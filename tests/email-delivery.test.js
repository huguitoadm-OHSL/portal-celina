import test from 'node:test';
import assert from 'node:assert/strict';
import { emailCopies, composeEmailUrl } from '../src/services/emailDelivery.js';

const supervisor = 'ohsaravia@celina.com.bo';
test('Gmail copia únicamente a supervisión y Outlook excluye la copia automática', () => {
  const copies = ['rvaca@grupopaz.com.bo', supervisor, supervisor.toUpperCase(), 'rvaca@grupopaz.com.bo; mreyes@celina.com.bo'];
  assert.deepEqual(emailCopies('gmail', copies, 'mreyes@celina.com.bo'), [supervisor]);
  assert.deepEqual(emailCopies('outlook', copies, 'mreyes@celina.com.bo'), ['rvaca@grupopaz.com.bo']);
  assert.deepEqual(emailCopies('gmail', copies, supervisor), []);
});
test('enlaces conservan asunto y cuerpo sin crear destinatarios desde variables dinámicas', () => {
  const subject = 'Solicitud & revisión #2026';
  const body = 'Estimado director,\nUSD 11.200. No enviar aún.';
  for (const client of ['gmail', 'outlook']) {
    const url = composeEmailUrl({ client, to:'mreyes@celina.com.bo', subject, body, copies:[supervisor] });
    const params = new URLSearchParams(url.split('?')[1]);
    assert.equal(params.get(client === 'gmail' ? 'su' : 'subject'), subject);
    assert.equal(params.get('body'), body);
    assert.equal(params.get('cc'), client === 'gmail' ? supervisor : null);
  }
});
