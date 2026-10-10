import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const COOKIE_NAME = '__Host-celina_session';
export const SESSION_SECONDS = 8 * 60 * 60;

export function configuredPassword(env = process.env) {
  const password = env.PORTAL_PASSWORD;
  // Una contraseña nueva y larga reemplaza la clave anteriormente incluida en el navegador.
  return typeof password === 'string' && password.length >= 16 && password.length <= 256 ? password : null;
}

export function passwordMatches(candidate, password) {
  if (!password || typeof candidate !== 'string' || candidate.length > 256) return false;
  const digest = value => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(candidate), digest(password));
}

function signature(payload, password, host) {
  return createHmac('sha256', password).update(`celina-session-v1\n${host}\n${payload}`).digest('base64url');
}

export function createSession(password, host, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ v: 1, expires: Math.floor(now / 1000) + SESSION_SECONDS, nonce: randomBytes(16).toString('hex') })).toString('base64url');
  return `${payload}.${signature(payload, password, host)}`;
}

export function validSession(token, password, host, now = Date.now()) {
  if (!password || typeof token !== 'string' || token.length > 512) return false;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) return false;
  const [payload, mac] = parts;
  const expected = Buffer.from(signature(payload, password, host));
  const supplied = Buffer.from(mac);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    const current = Math.floor(now / 1000);
    return data.v === 1 && Number.isInteger(data.expires) && data.expires > current && data.expires <= current + SESSION_SECONDS && /^[a-f0-9]{32}$/.test(data.nonce);
  } catch { return false; }
}

export function sessionCookie(token = '', maxAge = SESSION_SECONDS) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export function readSession(cookie = '') {
  const entries = cookie.split(';').map(item => item.trim()).filter(item => item.startsWith(`${COOKIE_NAME}=`));
  return entries.length === 1 ? entries[0].slice(COOKIE_NAME.length + 1) : '';
}

export function sameOrigin(origin, host) {
  try { const url = new URL(origin); return url.protocol === 'https:' && url.host === host; } catch { return false; }
}
