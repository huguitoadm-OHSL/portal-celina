export function summarizeCommercial(advisors, targetBs) {
  const safe = value => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) throw new Error('Los importes deben ser positivos o cero');
    return Math.round(n * 100);
  };
  const actual = advisors.reduce((total, a) => total + safe(a.actualBs), 0);
  const projected = advisors.reduce((total, a) => total + safe(a.projectionBs), 0);
  const target = safe(targetBs);
  return { actualBs: actual / 100, projectionBs: projected / 100, totalBs: (actual + projected) / 100, gapBs: Math.max(0, target - actual - projected) / 100, achievementPct: target ? (actual + projected) / target * 100 : 0, currentPct: target ? actual / target * 100 : 0 };
}

export function reconcileSale(reference, records) {
  if (!Array.isArray(records)) return { status: 'unverified', matches: [] };
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/^el\s+/, '').replace(/\s+/g, ' ');
  const matches = records.filter(sale => normalize(sale.advisor) === normalize(reference.advisor) && normalize(sale.project) === normalize(reference.project) && sale.date === reference.date && Number(sale.amountBs) === reference.amountBs && Number(sale.lots) === reference.lots);
  // Son coincidencias candidatas: solo contrato/identificador verifican la identidad.
  return { status: matches.length ? 'possible_duplicate' : 'not_found_in_supplied_records', matches };
}
