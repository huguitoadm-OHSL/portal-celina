import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveEmail, escapeHtml, firstName, emailSalutation } from '../src/services/email.js';
import { generarHtmlProyeccion, generarHtmlAltaCRM, generarHtmlDescuento, generarHtmlSeguro, generarHtmlPostulante, generarHtmlReenvio } from '../src/utils/htmlTemplates.js';
import { generarTextoProyeccionCelular, generarTextoPendienteValidacion, generarTextoAltaCRMCelular } from '../src/utils/textTemplates.js';
import { REFERENCE_ADVISORS } from '../src/constants/commercialReference.js';

test('saludo se resuelve una sola vez sin duplicar nombres ni fórmulas de cortesía', () => {
  const template='{{SALUDO_TIEMPO}}\n{{NOMBRE_SUPERVISOR}},\nSolicito su apoyo.';
  const result=resolveEmail(template,'Estimado Lic. Mauricio',new Date('2026-10-10T12:00:00Z'));
  assert.equal(result,'Buenos días\nEstimado Lic. Mauricio,\nSolicito su apoyo.');
  assert.equal(resolveEmail(result,'Otro'),result);
  assert.equal(resolveEmail('{{NOMBRE_SUPERVISOR}}','Persona $&'), 'Persona $&');
});
test('strings dinámicos se escapan en HTML y los datos comerciales conservan sus importes', () => {
  assert.equal(escapeHtml('<b>"Nombre"</b>'), '&lt;b&gt;&quot;Nombre&quot;&lt;/b&gt;');
  const html=generarHtmlAltaCRM({nombre:'<img src=x onerror=alert(1)>',ci:'1234'});
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;img'));
  assert.ok(html.includes('1234'));
});
test('proyección HTML y texto coinciden en USD y contienen los siete proyectos', () => {
  const form={equipo:'Oscar Saravia', fechaInicio:'2026-10-05',objetivoMensual:111000,asesores:REFERENCE_ADVISORS.map(a=>({nombre:a.nombre,colAct:a.actualUsd,projectionUsd:a.projectionUsd,dias:Array(7).fill(0),proy:Array(7).fill(0)}))};
  for (const output of [generarHtmlProyeccion(form),generarTextoProyeccionCelular(form)]) {
    assert.ok(output.includes('17,700.00'));
    assert.ok(output.includes('65,300.00'));
    assert.ok(output.includes('58.83'));
    assert.ok(!output.includes('undefined'));
  }
  assert.ok(generarHtmlProyeccion(form).includes('Cañaveral'));
  assert.ok(generarHtmlProyeccion(form).includes('USD 65,300.00'));
});
test('redacción corregida en alta y pendiente de validación', () => {
  assert.ok(generarTextoAltaCRMCelular({}).includes('se está integrando'));
  assert.equal((generarTextoPendienteValidacion({}).match(/ayuda/g)||[]).length,0);
});
test('correo de cotización muestra el TC de la operación, sin monto fijo contradictorio', () => {
  const html = generarHtmlDescuento({modalidad:'Crédito'},{tcBase:11.73,tcAplicado:11.73});
  assert.ok(!html.includes('12,00'));
  assert.ok(html.includes('11.73'));
});

test('plantillas corporativas mantienen concordancia y tratamiento profesional', () => {
  const one = generarHtmlSeguro({beneficiarios:[{nombre:'Persona',porcentaje:100}]});
  const many = generarHtmlSeguro({beneficiarios:[{nombre:'A',porcentaje:50},{nombre:'B',porcentaje:50}]});
  assert.ok(one.includes('al siguiente beneficiario'));
  assert.ok(many.includes('a los siguientes 2 beneficiarios'));
  const reenvio = generarHtmlReenvio({contratos:[{}]});
  assert.ok(reenvio.includes('el siguiente contrato'));
  assert.ok(!reenvio.includes('tu apoyo'));
  const applicant = generarHtmlPostulante({});
  assert.ok(!applicant.includes('M&aacute;quina de Ventas'));
  assert.ok(applicant.includes('equipo comercial'));
});


test('saludos usan primer nombre sin títulos, apellidos ni Estimado/a', () => {
  for (const [name, gender, expected] of [
    ['Ulrich Klein Montano', 'M', 'Estimado Ulrich'],
    ['Lic. Mauricio Reyes', 'M', 'Estimado Mauricio'],
    ['Ing. Charles Barretto', 'M', 'Estimado Charles'],
    ['Lic. Robert Vaca', 'M', 'Estimado Robert'],
    ['  Maria Fernanda Roca Miranda  ', 'F', 'Estimada Maria'],
    ['Lic. Verenice Choque', 'F', 'Estimada Verenice']
  ]) {
    assert.equal(emailSalutation(name, gender), expected);
    assert.equal(resolveEmail('{{NOMBRE_SUPERVISOR}},', emailSalutation(name, gender)), `${expected},`);
  }
  assert.equal(firstName(' Ulrich   Klein Montano '), 'Ulrich');
  assert.equal(emailSalutation(''), 'Buen día');
});
