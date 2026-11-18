// Fechas comerciales en America/La_Paz. Nunca recalcular contratos con la tasa actual.
export const EXCHANGE_RATE_HISTORY = Object.freeze([
  Object.freeze({ id: 'base-octubre-2026', from: null, through: null, rate: 12, source: 'Base heredada de config.js (vigencia pendiente de gerencia)' }),
  Object.freeze({ id: 'fin-semana-2026-10-10', from: '2026-10-10', through: '2026-10-11', rate: 11.73, source: 'Gerencia: instrucción 10/10/2026' }),
  Object.freeze({ id: 'vigente-2026-10-16', from: '2026-10-16', through: null, rate: 11.68, source: 'Supervisión: instrucción 16/10/2026; vigente hasta nueva instrucción' }),
  Object.freeze({ id: 'vigente-2026-10-22', from: '2026-10-22', through: null, rate: 11.75, source: 'Supervisión: instrucción 22/10/2026; vigente hasta nueva instrucción' }),
  Object.freeze({ id: 'referencia-2026-11-17', from: '2026-11-17', through: null, rate: 11.70, source: 'Supervisión: referencia del 17/11/2026' }),
]);

const RATE_KEY = 'celina_tc_manual_history_v1';
export function saveManualExchangeRate(rate, date = businessDate()) {
  const value = Number(rate);
  if (!Number.isFinite(value) || value <= 0 || value > 100) throw new Error('Introduzca un tipo de cambio válido.');
  const previous = readManualRates();
  const next = [...previous.filter(item => item.date !== date), { date, rate: value, source: 'Actualización manual de supervisión' }].sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(RATE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('celina:exchange-rate-updated'));
  return value;
}
function readManualRates() {
  try {
    const rows = JSON.parse(localStorage.getItem(RATE_KEY) || '[]');
    return Array.isArray(rows) ? rows.filter(r => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && Number.isFinite(r.rate) && r.rate > 0) : [];
  } catch { return []; }
}

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
  const manual = typeof localStorage !== 'undefined' ? readManualRates().filter(item => item.date <= day).at(-1) : null;
  const official = [...EXCHANGE_RATE_HISTORY].reverse().find(entry => (!entry.from || day >= entry.from) && (!entry.through || day <= entry.through));
  if (manual && (!official.from || manual.date >= official.from)) return manual.rate;
  return official.rate;
}

export function convertUsdToBs(amount, { date, historicalRate } = {}) {
  const value = Number(amount);
  if (!Number.isFinite(value)) throw new Error('Importe inválido');
  return Math.round((value * getExchangeRate(date, historicalRate) + Number.EPSILON) * 100) / 100;
}
