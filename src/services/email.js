import DOMPurify from 'dompurify';
import { CREDIT_IMAGE_MARKER, validInlineLotImage } from './inlineLotImage.js';

export function greeting(date = new Date()) {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'America/La_Paz', hour: '2-digit', hourCycle: 'h23' }).format(date));
  return hour >= 5 && hour < 12 ? 'Buenos días' : hour >= 12 && hour < 19 ? 'Buenas tardes' : 'Buenas noches';
}

// El saludo usa solo el primer nombre; la identidad completa se conserva en datos y destinatarios.
export function firstName(name) {
  return String(name ?? '').trim().replace(/^(?:(?:Lic|Ing|Dr|Dra|Sr|Sra)\.?\s+)+/i, '').split(/\s+/)[0] || '';
}

export function emailSalutation(name, gender = 'M') {
  const nameOnly = firstName(name);
  return nameOnly ? `${gender === 'F' ? 'Estimada' : 'Estimado'} ${nameOnly}` : 'Buen día';
}

// Reemplazo único de tokens: no se vuelve a procesar el saludo ya resuelto.
export function resolveEmail(content, recipient, date = new Date()) {
  return String(content || '').replace(/\{\{SALUDO_TIEMPO\}\}/g, () => greeting(date)).replace(/\{\{NOMBRE_SUPERVISOR\}\}/g, () => String(recipient || 'Buen día'));
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

export function escapeTemplateData(value) {
  if (typeof value === 'string') return escapeHtml(value);
  if (Array.isArray(value)) return value.map(escapeTemplateData);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, escapeTemplateData(item)]));
  return value;
}

export function sanitizeEmailHtml(html, { inlineImage } = {}) {
  const withoutRemoteStyles = String(html || '').replace(/style\s*=\s*(["'])(.*?)\1/gi, (match, quote, style) => /url\s*\(|@import|expression\s*\(/i.test(style) ? '' : match);
  const clean = DOMPurify.sanitize(withoutRemoteStyles, { USE_PROFILES: { html: true }, FORBID_TAGS: ['a', 'img', 'style', 'iframe', 'form', 'input', 'button', 'svg', 'video', 'audio'], FORBID_ATTR: ['src', 'srcset', 'background'] });
  return clean.replaceAll(CREDIT_IMAGE_MARKER, validInlineLotImage(inlineImage) ? `<img src="${inlineImage}" alt="Captura del lote seleccionado" width="340" style="display:block;max-width:100%;height:auto;margin:0 auto;"/>` : '');
}

export async function copyEmail(html, text, options) {
  const cleanHtml = sanitizeEmailHtml(html, options);
  if (!navigator.clipboard) throw new Error('El portapapeles requiere un navegador compatible y una conexión segura.');
  if (typeof ClipboardItem !== 'undefined') {
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([cleanHtml], { type: 'text/html' }), 'text/plain': new Blob([text], { type: 'text/plain' }) })]);
      return;
    } catch { /* Recuperación a texto plano. */ }
  }
  await navigator.clipboard.writeText(text);
}
