import { ADVISORS, PROJECT_NAMES } from '../constants/commercialReference.js';
import { businessDate } from '../constants/exchangeRates.js';
import { actualsByAdvisor, addClosedSale } from './commercialLedger.js';

export const SALES_STORAGE_KEY = 'celina.sales.imports.v1';
export const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
const projectKey = value => normalize(value).replace(/^celina\s+/, '').replace(/^(el|los)\s+/, '');
const aliases = {
  advisor: ['vendedor', 'asesor'], project: ['urbanizacion', 'proyecto'], date: ['fecha de venta', 'fecha venta', 'fecha'],
  amount: ['precio al contado', 'colocacion usd', 'importe usd', 'monto usd'],
  contract: ['contrato', 'id contrato', 'identificador'], lots: ['lotes', 'cantidad'], currency: ['moneda'], status: ['estado'],
};
export function parseUsd(value) {
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value <= 0 || value > 100000000 || Math.abs(value * 100 - Math.round(value * 100)) > 0.00001) throw new Error('Importe USD inválido (máximo dos decimales).');
    return Math.round(value * 100) / 100;
  }
  let text = String(value ?? '').trim().replace(/^(USD|US\$|\$)\s*/i, '').replace(/\s/g, '');
  if (/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(text)) text = text.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(,\d{3})+(\.\d{1,2})?$/.test(text)) text = text.replace(/,/g, '');
  else if (/^\d+([.,]\d{1,2})?$/.test(text)) text = text.replace(',', '.');
  else throw new Error('Importe USD inválido. Use celdas numéricas o separadores consistentes.');
  return parseUsd(Number(text));
}
export function parseSaleDate(value) {
  if (value instanceof Date) {
    if (!Number.isFinite(value.getTime())) throw new Error('Fecha inválida.');
    return businessDate(value.toISOString().slice(0, 10));
  }
  const text = String(value ?? '').trim();
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text);
  if (!match && !/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error('Fecha inválida. Use DD/MM/AAAA o una fecha de Excel.');
  return businessDate(match ? `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}` : text);
}
export const saleFingerprint = sale => [sale.advisorId, projectKey(sale.project), sale.date, sale.amountUsd, sale.lots].join('|');
const sameSale = (a, b) => saleFingerprint(a) === saleFingerprint(b) && a.currency === b.currency;

// Una vista previa no modifica el estado. Cualquier error bloquea el lote completo.
export function planSalesImport(rows, existing, period = '2026-10') {
  if (!Array.isArray(rows) || rows.length < 2 || rows.length > 1001) throw new Error('Use una hoja con encabezados y entre 1 y 1.000 ventas.');
  const headers = rows[0].map(normalize);
  const columns = Object.fromEntries(Object.entries(aliases).map(([key, names]) => {
    const matches = headers.map((header, i) => names.includes(header) ? i : -1).filter(i => i >= 0);
    if (matches.length > 1) throw new Error(`Más de una columna para ${key}; conserve una sola.`);
    return [key, matches[0] ?? -1];
  }));
  for (const key of ['advisor', 'project', 'date', 'amount']) if (columns[key] < 0) throw new Error(`Falta la columna: ${aliases[key][0]}.`);
  const results = [], additions = [], errors = [];
  let next = [...existing];
  rows.slice(1).forEach((row, index) => {
    if (!row || row.every(cell => cell === null || cell === undefined || String(cell).trim() === '')) return;
    try {
      const get = key => columns[key] >= 0 ? row[columns[key]] : undefined;
      const advisor = ADVISORS.find(a => normalize(a.nombre) === normalize(get('advisor')));
      if (!advisor) throw new Error('Asesor no reconocido. Use el nombre completo del equipo.');
      const project = PROJECT_NAMES.find(p => projectKey(p) === projectKey(get('project')));
      if (!project) throw new Error('Proyecto no reconocido.');
      if (get('currency') != null && !['', 'usd', 'dolares', 'dolares americanos', '$', 'us$'].includes(normalize(get('currency')))) throw new Error('Solo se admiten ventas en USD; no se convierte moneda.');
      if (get('status') != null && !['', 'confirmada', 'confirmado', 'realizada', 'realizado', 'vendido', 'venta al contado', 'venta a credito'].includes(normalize(get('status')))) throw new Error('El estado no corresponde a una venta realizada.');
      const date = parseSaleDate(get('date'));
      if (date.slice(0, 7) !== period) throw new Error('La venta no corresponde a octubre de 2026.');
      const lots = get('lots') == null || get('lots') === '' ? 1 : Number(get('lots'));
      if (!Number.isInteger(lots) || lots < 1 || lots > 100) throw new Error('Cantidad de lotes inválida.');
      const contractId = String(get('contract') ?? '').trim();
      if (contractId.length > 100 || /^[=+@]/.test(contractId)) throw new Error('Identificador de contrato inválido.');
      const sale = { advisor: advisor.nombre, advisorId: advisor.id, project, date, lots, amountUsd: parseUsd(get('amount')), currency: 'USD', period, status: 'reported_by_supervisor', source: 'excel' };
      sale.id = contractId ? `excel-contract:${contractId}` : `excel:${saleFingerprint(sale)}`;
      if (contractId) sale.contractId = contractId;
      const identity = next.find(s => s.id === sale.id || (contractId && s.contractId === contractId));
      if (identity && !sameSale(identity, sale)) throw new Error('El identificador o contrato ya existe con datos distintos; requiere conciliación.');
      const duplicate = identity || next.find(s => sameSale(s, sale) && (!s.contractId || !contractId || s.contractId === contractId));
      const ambiguous = !duplicate && next.find(s => s.advisorId === sale.advisorId && projectKey(s.project) === projectKey(sale.project) && s.date === sale.date && s.lots === sale.lots && (!s.contractId || !contractId));
      if (ambiguous) throw new Error('Posible corrección de una venta del mismo asesor, proyecto y fecha. Concilie el contrato antes de sumar otro importe.');
      if (duplicate) results.push({ row: index + 2, sale, status: 'duplicate' });
      else {
        next = addClosedSale(next, sale, period);
        additions.push(sale); results.push({ row: index + 2, sale, status: 'new' });
      }
    } catch (failure) { errors.push({ row: index + 2, message: failure.message }); }
  });
  if (!results.length && !errors.length) throw new Error('La hoja no contiene ventas.');
  actualsByAdvisor(ADVISORS, next, period);
  return { results, additions, errors, duplicateCount: results.filter(r => r.status === 'duplicate').length, next };
}

// Restaurar solo importaciones, conciliándolas contra las referencias vigentes del repositorio.
export function mergeSavedSales(base, saved) {
  if (!Array.isArray(saved) || saved.length > 1000) throw new Error('Respaldo local inválido.');
  let next = [...base];
  for (const sale of saved) {
    if (sale.source !== 'excel' || sale.status !== 'reported_by_supervisor' || sale.date?.slice(0, 7) !== '2026-10') throw new Error('Respaldo local inválido.');
    parseSaleDate(sale.date); parseUsd(sale.amountUsd);
    if (!PROJECT_NAMES.includes(sale.project)) throw new Error('Proyecto local inválido.');
    const duplicate = next.find(s => s.id === sale.id || (sale.contractId && s.contractId === sale.contractId) || (sameSale(s, sale) && (!s.contractId || !sale.contractId || s.contractId === sale.contractId)));
    if (duplicate) {
      if (!sameSale(duplicate, sale)) throw new Error('Una importación local requiere conciliación con la referencia vigente.');
      continue;
    }
    next = addClosedSale(next, sale);
  }
  actualsByAdvisor(ADVISORS, next);
  return next;
}
