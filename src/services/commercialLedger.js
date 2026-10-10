const CLOSED_STATUSES = new Set(['confirmed', 'reported_by_supervisor', 'legacy_reference']);

function cents(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value < 0) throw new Error('El importe USD debe ser positivo o cero.');
  return Math.round(value * 100);
}

export function closedSales(sales, period = '2026-10') {
  const identifiers = new Set();
  return sales.filter(sale => {
    if (!CLOSED_STATUSES.has(sale.status)) return false;
    if ((sale.period || sale.date?.slice(0, 7)) !== period) return false;
    if (!sale.id || sale.currency !== 'USD' || !sale.advisorId || !sale.project || !Number.isInteger(sale.lots) || sale.lots < 1) throw new Error('La venta realizada requiere identificador, asesor, proyecto, lotes y moneda USD.');
    cents(sale.amountUsd);
    const keys = [sale.id, sale.contractId && `contract:${sale.contractId}`].filter(Boolean);
    if (keys.some(key => identifiers.has(key))) throw new Error('Venta duplicada: revise el identificador o contrato.');
    keys.forEach(key => identifiers.add(key));
    return true;
  });
}

export function actualsByAdvisor(advisors, sales, period) {
  const actual = closedSales(sales, period);
  if (actual.some(sale => !advisors.some(advisor => advisor.id === sale.advisorId))) throw new Error('La venta pertenece a un asesor no identificado.');
  return advisors.map(advisor => {
    const records = actual.filter(sale => sale.advisorId === advisor.id);
    return { ...advisor, actualUsd: records.reduce((sum, sale) => sum + cents(sale.amountUsd), 0) / 100, confirmedSales: records.reduce((sum, sale) => sum + sale.lots, 0) };
  });
}

export function addClosedSale(sales, sale, period) {
  if (!CLOSED_STATUSES.has(sale.status)) throw new Error('Una proyección no puede registrarse como venta realizada.');
  const existing = sales.find(record => record.id === sale.id || (sale.contractId && record.contractId === sale.contractId));
  if (existing) {
    if (existing.advisorId !== sale.advisorId || existing.project !== sale.project || existing.amountUsd !== sale.amountUsd || existing.lots !== sale.lots || existing.currency !== sale.currency || existing.date !== sale.date) throw new Error('El identificador ya existe con datos distintos.');
    return sales;
  }
  const candidate = sales.find(record => (!record.contractId || !sale.contractId) && record.advisorId === sale.advisorId && record.project === sale.project && record.amountUsd === sale.amountUsd && record.currency === sale.currency && record.lots === sale.lots && (record.date === sale.date || (!record.date && record.period === (sale.period || sale.date?.slice(0, 7)))));
  if (candidate) throw new Error('Posible duplicado de una referencia sin contrato: concilie la operación antes de incorporarla.');
  const next = [...sales, sale];
  closedSales(next, period);
  return next;
}
