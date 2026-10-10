import { next } from '@vercel/functions';
import { configuredPassword, readSession, validSession } from './server/auth.js';
import { loginPage } from './server/loginPage.js';

export const config = { runtime: 'nodejs', matcher: '/:path*' };

export default function middleware(request) {
  const url = new URL(request.url);
  if (url.pathname === '/api/auth') return next();
  const password = configuredPassword();
  if (validSession(readSession(request.headers.get('cookie') || ''), password, url.host)) {
    const response = next();
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('Vercel-CDN-Cache-Control', 'no-store');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'same-origin');
    return response;
  }
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const page = loginPage(Boolean(password));
    return new Response(page.html, { status: password ? 200 : 503, headers: page.headers });
  }
  // Incluye los bundles y archivos públicos: no se entrega información comercial sin sesión.
  return new Response('Acceso no autorizado.', { status: 401, headers: { 'Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' } });
}
