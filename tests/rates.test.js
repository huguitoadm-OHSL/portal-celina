import test from 'node:test';
import assert from 'node:assert/strict';
import { getExchangeRate, convertUsdToBs, businessDate } from '../src/constants/exchangeRates.js';
import { calcularDescuento } from '../src/utils/calculadoras.js';

test('vigencia exacta sábado y domingo en Bolivia', () => {
  for (const day of ['2026-10-10','2026-10-11']) assert.equal(getExchangeRate(day),11.73);
  assert.equal(getExchangeRate('2026-10-09'),12);
  assert.equal(getExchangeRate('2026-10-12'),12);
  assert.equal(getExchangeRate('2026-10-10T03:59:59Z'),12);
  assert.equal(getExchangeRate('2026-10-10T04:00:00Z'),11.73);
  assert.equal(getExchangeRate('2026-10-12T03:59:59Z'),11.73);
  assert.equal(getExchangeRate('2026-10-12T04:00:00Z'),12);
});
test('TC histórico prevalece; USD 15.000 equivalen a Bs 175.950', () => {
  assert.equal(convertUsdToBs(15000,{date:'2026-10-10'}),175950);
  assert.equal(getExchangeRate('2026-10-10',6.97),6.97);
  assert.equal(convertUsdToBs(100,{date:'2026-10-10',historicalRate:6.97}),697);
  assert.throws(() => getExchangeRate('2026-10-10',0));
  assert.throws(() => businessDate('2026-02-30'));
});
test('cotizaciones de crédito usan la fecha de operación y preservan TC contractual', () => {
  const form={proyecto:'OTRO...', modalidad:'Crédito',m2:100,precioM2:10,cuota:10,fechaOperacion:'2026-10-10'};
  assert.equal(calcularDescuento(form).nuevoPrecioBs,11730);
  assert.equal(calcularDescuento({...form,tcHistorico:6.97}).nuevoPrecioBs,6970);
  assert.equal(calcularDescuento({...form,fechaOperacion:'2026-10-12'}).nuevoPrecioBs,12000);
});
