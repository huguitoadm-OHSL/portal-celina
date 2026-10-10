// Fechas comerciales en America/La_Paz. Nunca recalcular contratos con la tasa actual.
export const EXCHANGE_RATE_HISTORY = Object.freeze([
  Object.freeze({ id: 'base-octubre-2026', from: null, through: null, rate: 12, source: 'Base heredada de config.js (vigencia pendiente de gerencia)' }),
  Object.freeze({ id: 'fin-semana-2026-10-10', from: '2026-10-10', through: '2026-10-11', rate: 11.73, source: 'Gerencia: instrucción 10/10/2026' }),
]);

export function businessDate(value = new Date()) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = new Date(`${value}T12:00:00Z`);
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) throw new Error('Fecha comercial inválida');
    return value;
  }
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error('Fecha comercial inválida');
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/La_Paz', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export function getExchangeRate(date = new Date(), historicalRate) {
  if (historicalRate !== undefined && historicalRate !== null) {
    const rate = Number(historicalRate);
    if (!Number.isFinite(rate) || rate <= 0) throw new Error('El TC histórico debe ser positivo');
    return rate;
  }
  const day = businessDate(date);
  return [...EXCHANGE_RATE_HISTORY].reverse().find(entry => (!entry.from || day >= entry.from) && (!entry.through || day <= entry.through)).rate;
}

export function convertUsdToBs(amount, { date, historicalRate } = {}) {
  const value = Number(amount);
  if (!Number.isFinite(value)) throw new Error('Importe inválido');
  return Math.round((value * getExchangeRate(date, historicalRate) + Number.EPSILON) * 100) / 100;
}
