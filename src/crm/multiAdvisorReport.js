import { normalize, parseReport } from './reportParser.js';

/**
 * Adaptador de exportaciones mixtas del CRM Celina.
 * Nunca envía datos del cliente al servidor: divide en memoria un informe
 * completo por asesor para preservar la semántica de cobertura y el historial.
 * No divide por lead, porque varias actividades pertenecen al mismo cliente.
 */
export function splitReportByAdvisor(rows, period) {
  if (!Array.isArray(rows) || rows.length > 20006) throw new Error('El reporte del CRM es demasiado grande.');
  const headerIndex = rows.findIndex(row => Array.isArray(row) && row.some(v => normalize(v) === 'telefono') && row.some(v => normalize(v) === 'lead'));
  if (headerIndex === -1) throw new Error('No se reconoce el encabezado del CRM.');
  const headers = rows[headerIndex].map(normalize);
  const advisorColumn = headers.indexOf(headers.includes('agente') ? 'agente' : 'agente asignado');
  if (advisorColumn < 0) throw new Error('El reporte no tiene la columna Agente.');
  const groups = new Map();
  for (const row of rows.slice(headerIndex + 1)) {
    if (!row?.some(v => v !== null && v !== undefined && v !== '')) continue;
    const name = String(row[advisorColumn] ?? '').trim();
    const key = normalize(name);
    if (!key) throw new Error('Una actividad no tiene asesor asignado.');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  if (!groups.size) throw new Error('El reporte no tiene actividades.');
  const metadata = rows.slice(0, headerIndex).map(row => row.map(cell => /^Total lead registrados:/i.test(String(cell ?? '').trim()) ? '' : cell));
  const plans = [...groups.entries()].map(([key, items]) => {
    const subrows = [...metadata, rows[headerIndex], ...items];
    return { key, rows: subrows, plan: parseReport(subrows, period) };
  });
  return { kind: plans[0].plan.kind, count: plans.reduce((sum, part) => sum + part.plan.rawCount, 0), plans };
}
