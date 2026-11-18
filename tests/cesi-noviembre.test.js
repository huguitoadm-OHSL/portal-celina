import test from 'node:test';
import assert from 'node:assert/strict';
import { ADVISORS, NOVEMBER_REPORTED_SALES, REPORTED_SALES, NOVEMBER_TARGET_USD, NOVEMBER_PROJECTIONS_USD } from '../src/constants/commercialReference.js';
import { planSalesImport } from '../src/services/salesImport.js';
import { actualsByAdvisor } from '../src/services/commercialLedger.js';

const columns = ['Nro', 'Urbanización', 'Sucursal', 'Vendedor', 'CI Vendedor', 'Fecha de Venta', 'CI Cliente', 'Cliente', 'Número de Lote', 'Superficie (mt2)', 'Contrato', 'Años de Financiamiento', 'Precio al Contado', 'Total', 'Inicial', 'Estado', 'Procesado', 'Fecha Procesado', 'Aprobado', 'Fecha Aprobado'];
const row = (number, project, advisor, date, contract, amount, approved='No ') => {
  const data = Array(20).fill(null);
  data[0] = number; data[1] = project; data[2] = 'AGENCIA MONTERO'; data[3] = advisor;
  data[5] = date; data[10] = contract; data[12] = amount; data[13] = amount * 1.8;
  data[15] = 'VENTA A PLAZOS'; data[16] = 'No '; data[18] = approved;
  return data;
};
test('ocho asesores vigentes, incluida Merly y Ana Karla', () => {
  assert.equal(ADVISORS.length, 8);
  assert.ok(ADVISORS.some(a => a.id === 'merly'));
  assert.ok(ADVISORS.some(a => a.id === 'ana'));
  assert.equal(NOVEMBER_TARGET_USD, 110000);
  assert.equal(Object.values(NOVEMBER_PROJECTIONS_USD).reduce((a,b) => a+b, 0), 53900);
});
test('CESI filtra otros asesores, reconoce ambas operaciones y no duplica contratos históricos', () => {
  const rows = [columns,
    row(1, 'EL RENACER', 'ELY GONZALES GARCIA', '11/11/2026', 'C2604201635', 17998.742204),
    row(2, 'CELINA MUYURINA', 'MERLY MENDEZ HURTADO', '17/11/2026', 'C2603500764', 11897.25),
    row(3, 'CAÑAVERAL', 'OTRO ASESOR', '17/11/2026', 'C999', 8000)];
  const first = planSalesImport(rows, REPORTED_SALES, '2026-11');
  assert.deepEqual(first.errors, []);
  assert.equal(first.skippedOtherAdvisors, 1);
  assert.equal(first.additions.length, 2);
  assert.equal(first.additions[0].amountUsd, 17998.74);
  assert.equal(first.additions[1].amountUsd, 11897.25);
  const second = planSalesImport(rows, [...REPORTED_SALES, ...NOVEMBER_REPORTED_SALES], '2026-11');
  assert.deepEqual(second.errors, []);
  assert.equal(second.additions.length, 0);
  assert.equal(second.duplicateCount, 2);
  const actual = actualsByAdvisor(ADVISORS, [...REPORTED_SALES, ...NOVEMBER_REPORTED_SALES], '2026-11');
  assert.equal(actual.reduce((sum,a) => sum + a.actualUsd, 0), 29895.99);
});
test('un contrato existente con importe diferente queda bloqueado para conciliación', () => {
  const rows = [columns,row(1,'EL RENACER','ELY GONZALES GARCIA','11/11/2026','C2604201635', 19000)];
  const plan = planSalesImport(rows, [...REPORTED_SALES, ...NOVEMBER_REPORTED_SALES], '2026-11');
  assert.equal(plan.errors.length, 1);
  assert.match(plan.errors[0].message, /contrato|identificador/);
});