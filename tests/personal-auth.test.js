import test from 'node:test';
import assert from 'node:assert/strict';
import { configuredPassword, passwordMatches, createSession, validSession, readSession, sessionCookie, sameOrigin, SESSION_SECONDS } from '../server/auth.js';
import handler from '../api/auth.js';
import middleware from '../middleware.js';
const secret = 'test-only-generated-secret-32-characters';
const host = 'portal-celina.vercel.app';
const now = 1791648000000;

test('secreto fuera del cliente; configuración ausente o corta bloquea acceso', () => {
  assert.equal(configuredPassword({}), null);
  assert.equal(configuredPassword({ PORTAL_PASSWORD: 'old-short-pass' }), null);
  assert.equal(configuredPassword({ PORTAL_PASSWORD: secret }), secret);
  assert.equal(passwordMatches(secret, secret), true);
  for (const invalid of [null, {}, 'incorrect', 'x'.repeat(257)]) assert.equal(passwordMatches(invalid, secret), false);
});
test('cookie firmada rechaza alteraciones, otro dominio, contraseña rotada y vencimiento', () => {
  const token = createSession(secret, host, now);
  assert.equal(validSession(token, secret, host, now), true);
  assert.equal(validSession(token + 'x', secret, host, now), false);
  assert.equal(validSession(token, secret, 'other.vercel.app', now), false);
  assert.equal(validSession(token, secret + '-rotated', host, now), false);
  assert.equal(validSession(token, secret, host, now + SESSION_SECONDS * 1000), false);
  assert.equal(validSession('x.y', secret, host, now), false);
  assert.equal(readSession(sessionCookie(token)), token);
  assert.equal(readSession(`__Host-celina_session=${token}; __Host-celina_session=${token}`), '');
  for (const flag of ['HttpOnly', 'Secure', 'SameSite=Strict', 'Path=/']) assert.ok(sessionCookie(token).includes(flag));
});
test('middleware protege página, bundles y archivos: bandera local no da acceso', () => {
  const previous = process.env.PORTAL_PASSWORD;
  process.env.PORTAL_PASSWORD = secret;
  try {
    const login = middleware(new Request(`https://${host}/`));
    assert.equal(login.status, 200);
    assert.ok(login.headers.get('content-security-policy').includes("frame-ancestors 'none'"));
    for (const path of ['/assets/index.js', '/src/views/Dashboard.jsx', '/favicon.svg', '/api/other']) assert.equal(middleware(new Request(`https://${host}${path}`)).status, 401);
    const token = createSession(secret, host);
    const allowed = middleware(new Request(`https://${host}/`, { headers: { cookie: `__Host-celina_session=${token}` } }));
    assert.equal(allowed.headers.get('x-middleware-next'), '1');
    assert.equal(allowed.headers.get('cache-control'), 'private, no-store');
    delete process.env.PORTAL_PASSWORD;
    assert.equal(middleware(new Request(`https://${host}/`)).status, 503);
  } finally { if (previous === undefined) delete process.env.PORTAL_PASSWORD; else process.env.PORTAL_PASSWORD = previous; }
});
function response() {
  return { headers: {}, statusCode: 200, data: null, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.statusCode = code; return this; }, json(data) { this.data = data; return this; } };
}
test('API comprueba origen y contraseña, firma sesión y permite cerrar sin exponer secreto', async () => {
  const previous = process.env.PORTAL_PASSWORD;
  process.env.PORTAL_PASSWORD = secret;
  try {
    const req = { method: 'POST', headers: { host, origin: `https://${host}`, 'content-type': 'application/json', 'x-real-ip': 'auth-test' }, body: { action: 'login', password: secret } };
    for (const origin of ['https://evil.example', 'null', undefined]) { const res = response(); await handler({ ...req, headers: { ...req.headers, origin } }, res); assert.equal(res.statusCode, 403); }
    const wrong = response(); await handler({ ...req, body: { action: 'login', password: 'wrong' } }, wrong); assert.equal(wrong.statusCode, 401);
    const res = response(); await handler(req, res); assert.equal(res.statusCode, 200); assert.deepEqual(res.data, { authorized: true });
    const cookie = res.headers['Set-Cookie']; assert.ok(!JSON.stringify(res).includes(secret));
    const session = response(); await handler({ method: 'GET', headers: { host, cookie } }, session); assert.equal(session.statusCode, 200);
    const signedOut = response(); await handler({ ...req, body: { action: 'logout' } }, signedOut); assert.ok(signedOut.headers['Set-Cookie'].includes('Max-Age=0'));
    const noSession = response(); await handler({ method: 'GET', headers: { host } }, noSession); assert.equal(noSession.statusCode, 401);
    assert.equal(sameOrigin(`http://${host}`, host), false);
    for (let i = 0; i < 11; i++) { const attempt = response(); await handler({ ...req, headers: { ...req.headers, 'x-real-ip': 'rate-test' }, body: { action: 'login', password: 'wrong' } }, attempt); if (i === 10) assert.equal(attempt.statusCode, 429); }
  } finally { if (previous === undefined) delete process.env.PORTAL_PASSWORD; else process.env.PORTAL_PASSWORD = previous; }
});
