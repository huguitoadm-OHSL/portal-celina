import test from 'node:test';
import assert from 'node:assert/strict';
import { actualsByAdvisor, addClosedSale } from '../src/services/commercialLedger.js';
import { ADVISORS, REPORTED_SALES, MARISOL_REFERENCE } from '../src/constants/commercialReference.js';

test('registro único suma solo colocación realizada USD y excluye proyecciones y otros meses', () => {
  const records = [...REPORTED_SALES, {...MARISOL_REFERENCE, id:'projected', status:'projected', amountUsd:6000}, {...MARISOL_REFERENCE, id:'november', date:'2026-11-01', period:'2026-11'}];
  const advisors = actualsByAdvisor(ADVISORS, records);
  assert.equal(advisors.reduce((sum,a)=>sum+a.actualUsd,0),17700);
  assert.equal(advisors.reduce((sum,a)=>sum+a.confirmedSales,0),2);
  assert.equal(advisors.find(a=>a.id==='marisol').actualUsd,11200);
  assert.equal(advisors.find(a=>a.id==='marisol').confirmedSales,1);
});
test('una nueva venta actualiza colocación y lotes del registro; reintentos no duplican', () => {
  const sale = {id:'TEST-NEW',contractId:'TEST-CONTRACT',advisorId:'jimmy',project:'Rancho Nuevo',lots:1,amountUsd:8000,currency:'USD',date:'2026-10-10',status:'confirmed'};
  const records = addClosedSale(REPORTED_SALES, sale);
  const again = addClosedSale(records, {...sale,id:'TEST-RETRY'});
  assert.equal(again,records);
  const advisors=actualsByAdvisor(ADVISORS,records);
  assert.equal(advisors.reduce((sum,a)=>sum+a.actualUsd,0),25700);
  assert.equal(advisors.reduce((sum,a)=>sum+a.confirmedSales,0),3);
  assert.equal(advisors.find(a=>a.id==='jimmy').confirmedSales,1);
  assert.throws(()=>addClosedSale(records,{...sale,amountUsd:8100}),/datos distintos/);
  assert.throws(()=>actualsByAdvisor(ADVISORS,[...records,sale]),/duplicada/);
  assert.throws(()=>addClosedSale(REPORTED_SALES,{...MARISOL_REFERENCE,id:'TEST-REAL-ID',contractId:'TEST-REAL-CONTRACT'}),/Posible duplicado/);
});
test('no se admiten montos en otra moneda ni ventas previstas como realizadas', () => {
  assert.throws(()=>addClosedSale(REPORTED_SALES,{...MARISOL_REFERENCE,id:'future',status:'projected'}),/proyección/);
  assert.throws(()=>actualsByAdvisor(ADVISORS,[{...MARISOL_REFERENCE,currency:'Bs'}]),/USD/);
  assert.throws(()=>actualsByAdvisor(ADVISORS,[{...MARISOL_REFERENCE,amountUsd:-1}]),/importe/);
  assert.throws(()=>actualsByAdvisor(ADVISORS,[{...MARISOL_REFERENCE,advisorId:'unknown'}]),/asesor/);
});
