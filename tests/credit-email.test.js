import test from 'node:test';
import assert from 'node:assert/strict';
import { creditDiscountEmail } from '../src/services/creditDiscountEmail.js';
import { validInlineLotImage } from '../src/services/inlineLotImage.js';
const data={project:'EL RENACER',uv:'SN',block:'76',lot:'8',category:'CALLE - ZONA 3',advisor:'Jaime Fabricio Rios Castro',salutation:'Estimado Mauricio',greeting:'Buenos días',exchangeRate:11.75,calculations:{precioM2Anterior:20,reduccionM2:1,nuevoPrecioM2:19,labelBadge:'VENTA A CRÉDITO (DESCUENTO FIJO $300)',capitalFinalUSD:5700,totalBs:66975}};
test('modelo de crédito: precio anterior, equivalente, precio nuevo, lote, total y firma sin ópticas', () => {
  const before=JSON.stringify(data);
  const result=creditDiscountEmail({...data,hasImage:true});
  for (const text of [result.html,result.text]) {
    for(const expected of ['Estimado Mauricio','EL RENACER','76','8','20.00','1.00','19.00','5,700.00','66,975.00','11.75','Jaime Fabricio Rios Castro']) assert.ok(text.includes(expected),expected);
    assert.doesNotMatch(text,/ÓPTICA|Capital Final a Liquidar|Por favor le solicito|undefined|NaN/);
  }
  assert.ok(result.html.includes('__CELINA_CREDIT_LOT_IMAGE__'));
  assert.equal(JSON.stringify(data),before);
  assert.ok(!creditDiscountEmail(data).html.includes('__CELINA_CREDIT_LOT_IMAGE__'));
});
test('datos escapados e imágenes solo raster locales, nunca URL externa ni SVG', () => {
  assert.ok(creditDiscountEmail({...data,project:'<img src=x onerror=alert(1)>'}).html.includes('&lt;img'));
  assert.ok(validInlineLotImage('data:image/png;base64,AAAA'));
  for(const value of ['https://ejemplo.com/a.png','data:image/svg+xml;base64,AAAA','data:image/png;base64,AAA" onerror=alert(1)','javascript:alert(1)','data:image/png;base64,'+'A'.repeat(2100000)]) assert.equal(validInlineLotImage(value),false);
});
