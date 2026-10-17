import test from 'node:test';
import assert from 'node:assert/strict';
import { planSalesImport, parseUsd, parseSaleDate, mergeSavedSales } from '../src/services/salesImport.js';
import { REPORTED_SALES, REFERENCE_ADVISORS, PROJECTION_DETAILS } from '../src/constants/commercialReference.js';
const header = ['Urbanización', 'Vendedor', 'Fecha de Venta', 'Precio al Contado', 'Contrato', 'Lotes', 'Moneda', 'Estado'];
const row = ['RANCHO NUEVO', 'JIMMY GONZALES NUÑEZ', '17/10/2026', '1.234,56', 'PRUEBA-1', 1, 'USD', 'Confirmada'];

test('cuadro del 16/10: cuatro cierres, fechas y proyectos conciliados; fin de semana separado', () => {
  assert.equal(REPORTED_SALES.length, 4);
  assert.deepEqual(REFERENCE_ADVISORS.filter(a => a.actualUsd).map(a => [a.id, a.actualUsd, a.confirmedSales]), [['carlos',13925,2],['marisol',59080,2]]);
  assert.equal(PROJECTION_DETAILS.jose.days[5], 7500);
  assert.equal(PROJECTION_DETAILS.carlos.days[6] + PROJECTION_DETAILS.merly.days[6], 12920);
  assert.deepEqual(REPORTED_SALES.map(s=>s.date),['2026-10-06','2026-10-09','2026-10-13','2026-10-16']);
});
test('importes regionales exactos, celdas numéricas, fechas Excel y rechazo de valores inseguros', () => {
  for (const value of [1234.56,'1.234,56','1,234.56','1234,56','USD 1234.56']) assert.equal(parseUsd(value),1234.56);
  assert.equal(parseUsd('47.880'),47880);
  for (const value of ['',null,-1,0,NaN,Infinity,'=100+1','Bs 100','1,2,3','1.2345']) assert.throws(()=>parseUsd(value));
  assert.equal(parseSaleDate(new Date('2026-10-16T00:00:00Z')),'2026-10-16');
  assert.equal(parseSaleDate('16/10/2026'),'2026-10-16');
  assert.throws(()=>parseSaleDate('31/10/2026X'));
  assert.throws(()=>parseSaleDate('31/02/2026'));
});
test('el extracto completo no duplica antecedentes con mayúsculas y alias de proyectos', () => {
  const rows = [header,...REPORTED_SALES.map(s=>[s.project === 'Muyurina' ? 'CELINA MUYURINA' : s.project.toUpperCase(),s.advisor.toUpperCase(),s.date,s.amountUsd])];
  const plan=planSalesImport(rows,REPORTED_SALES);
  assert.equal(plan.errors.length,0);assert.equal(plan.additions.length,0);assert.equal(plan.duplicateCount,4);
  assert.equal(REPORTED_SALES.length,4);
});
test('vista previa, repetición en archivo y recarga no suman dos veces una venta', () => {
  const plan=planSalesImport([header,row,row],REPORTED_SALES);
  assert.equal(plan.errors.length,0);assert.equal(plan.additions.length,1);assert.equal(plan.duplicateCount,1);
  assert.equal(plan.next.length,5);assert.equal(REPORTED_SALES.length,4);
  const restored=mergeSavedSales(REPORTED_SALES,plan.additions);
  assert.equal(restored.length,5);
  assert.equal(planSalesImport([header,row],restored).additions.length,0);
  assert.equal(mergeSavedSales(plan.next,plan.additions).length,5);
});
test('contratos en conflicto, proyecciones, otras monedas y otras fechas bloquean el lote', () => {
  const first=planSalesImport([header,row],REPORTED_SALES);
  const changed=[...row];changed[3]=1500;
  assert.match(planSalesImport([header,changed],first.next).errors[0].message,/datos distintos/);
  for (const [index,value] of [[1,'OTRA PERSONA'],[0,'PROYECTO DESCONOCIDO'],[2,'01/11/2026'],[6,'Bs'],[7,'Proyectada'],[5,1.5]]) {
    const invalid=[...row];invalid[index]=value;
    const plan=planSalesImport([header,row,invalid],REPORTED_SALES);
    assert.equal(plan.errors.length,1);assert.equal(REPORTED_SALES.length,4);
  }
  assert.throws(()=>planSalesImport([['Asesor'],['Nombre']],REPORTED_SALES),/Falta/);
  assert.throws(()=>planSalesImport(Array(1002).fill(row),REPORTED_SALES));
  assert.throws(()=>mergeSavedSales(REPORTED_SALES,[{...first.additions[0],advisorId:'unknown'}]));
});

test('mismo día y proyecto con otro importe requiere conciliación; contratos distintos se conservan al recargar', () => {
  const a=planSalesImport([header,row],REPORTED_SALES);
  const correction=[...row];correction[3]=2000;correction[4]='';
  assert.match(planSalesImport([header,correction],a.next).errors[0].message,/Concilie/);
  const other=[...row];other[4]='PRUEBA-OTRO-CONTRATO';
  const b=planSalesImport([header,other],a.next);
  assert.equal(b.additions.length,1);
  assert.equal(mergeSavedSales(REPORTED_SALES,[...a.additions,...b.additions]).length,6);
});
