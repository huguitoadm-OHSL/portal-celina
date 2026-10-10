import { configuredPassword, passwordMatches, createSession, readSession, validSession, sessionCookie, sameOrigin } from '../server/auth.js';

// Protección complementaria por instancia; no sustituye un límite distribuido del Firewall de Vercel.
const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
function limited(key, now = Date.now()) {
  for (const [ip, entry] of attempts) if (now - entry.started >= WINDOW_MS) attempts.delete(ip);
  if (attempts.size >= 10000 && !attempts.has(key)) return true;
  const entry = attempts.get(key) || { count: 0, started: now };
  entry.count++; attempts.set(key, entry);
  return entry.count > 10;
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'private, no-store');
  response.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  const host = request.headers.host;
  const password = configuredPassword();
  if (!password) return response.status(503).json({ error: 'El acceso está pendiente de configuración en Vercel.' });
  if (request.method === 'GET') {
    const authorized = validSession(readSession(request.headers.cookie || ''), password, host);
    return response.status(authorized ? 200 : 401).json({ authorized });
  }
  if (request.method !== 'POST') { response.setHeader('Allow', 'GET, POST'); return response.status(405).json({ error: 'Método no permitido.' }); }
  if (!sameOrigin(request.headers.origin, host)) return response.status(403).json({ error: 'Solicitud no permitida.' });
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers['content-type'] || '')) return response.status(415).json({ error: 'Formato no permitido.' });
  if (Number(request.headers['content-length']) > 2048) return response.status(413).json({ error: 'Solicitud demasiado grande.' });
  let body;
  try { body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body; } catch { return response.status(400).json({ error: 'Solicitud inválida.' }); }
  if (body?.action === 'logout') { response.setHeader('Set-Cookie', sessionCookie('', 0)); return response.status(200).json({ authorized: false }); }
  if (body?.action !== 'login') return response.status(400).json({ error: 'Solicitud inválida.' });
  const ip = request.headers['x-real-ip'] || request.socket?.remoteAddress || 'unknown';
  if (limited(ip)) { response.setHeader('Retry-After', '600'); return response.status(429).json({ error: 'Demasiados intentos. Espera 10 minutos antes de volver a ingresar.' }); }
  if (!passwordMatches(body.password, password)) return response.status(401).json({ error: 'Contraseña incorrecta.' });
  response.setHeader('Set-Cookie', sessionCookie(createSession(password, host)));
  return response.status(200).json({ authorized: true });
}
