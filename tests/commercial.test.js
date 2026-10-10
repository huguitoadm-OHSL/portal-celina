import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeCommercial, reconcileSale } from '../src/utils/commercial.js';
import { REFERENCE_ADVISORS, MONTHLY_TARGET_BS, MARISOL_REFERENCE, PROJECT_PROJECTION } from '../src/constants/commercialReference.js';

test('los siete asesores concilian sin sumar dos veces Bs 11.200', () => {
  const summary = summarizeCommercial(REFERENCE_ADVISORS, MONTHLY_TARGET_BS);
  assert.deepEqual({ ...summary, achievementPct: Number(summary.achievementPct.toFixed(2)), currentPct: Number(summary.currentPct.toFixed(2)) }, { actualBs:17700, projectionBs:47600, totalBs:65300, gapBs:45700, achievementPct:58.83, currentPct:15.95 });
  assert.equal(REFERENCE_ADVISORS.find(a => a.id === 'marisol').actualBs, 11200);
  assert.equal(Object.values(PROJECT_PROJECTION).reduce((a,b) => a+b), 7);
});
test('el registro no consultado no se interpreta como venta ausente', () => {
  assert.equal(reconcileSale(MARISOL_REFERENCE, null).status, 'unverified');
  assert.equal(reconcileSale(MARISOL_REFERENCE, []).status, 'not_found_in_supplied_records');
});
test('coincidencias por asesor, proyecto, fecha, importe y cantidad se marcan para verificar', () => {
  const records = [{...MARISOL_REFERENCE, contractId:'CRM-123', advisor:'  MARISOL URGEL PIZARRO ', project:'Renacer'}];
  assert.equal(reconcileSale(MARISOL_REFERENCE, records).status, 'possible_duplicate');
  assert.equal(reconcileSale(MARISOL_REFERENCE, [{...records[0], date:'2026-10-09'}]).matches.length, 0);
  assert.equal(reconcileSale(MARISOL_REFERENCE, [{...records[0], amountBs: 11201}]).matches.length, 0);
  assert.equal(records.length, 1);
});
test('validación financiera y precisión de centavos', () => {
  assert.throws(() => summarizeCommercial([{actualBs: -1, projectionBs:0}],111000));
  assert.throws(() => summarizeCommercial([{actualBs: Infinity, projectionBs:0}],111000));
  assert.equal(summarizeCommercial([{actualBs:.1, projectionBs:.2}],1).totalBs,.3);
  assert.equal(summarizeCommercial(REFERENCE_ADVISORS,0).achievementPct,0);
});
