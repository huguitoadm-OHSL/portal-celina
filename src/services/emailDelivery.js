import { CORREO_SUPERVISION_RESPALDO } from '../constants/config.js';

// La copia de supervisión es exclusiva de Gmail. Outlook conserva solo las copias operativas.
export function emailCopies(client, recipients = [], to = '') {
  const values = recipients.flatMap(value => String(value || '').split(/[,;]/)).map(value => value.trim().toLowerCase()).filter(Boolean);
  const supervisor = CORREO_SUPERVISION_RESPALDO.toLowerCase();
  const destination = to.trim().toLowerCase();
  if (client === 'gmail') return destination === supervisor ? [] : [supervisor];
  return [...new Set(values)].filter(value => value !== supervisor && value !== destination);
}

export function composeEmailUrl({ client, to, subject, body, copies = [] }) {
  const params = new URLSearchParams();
  const cc = emailCopies(client, copies, to).join(',');
  if (client === 'gmail') {
    params.set('view', 'cm'); params.set('fs', '1'); params.set('to', to);
    params.set('su', subject || '');
  } else params.set('subject', subject || '');
  if (cc) params.set('cc', cc);
  if (body) params.set('body', body);
  return client === 'gmail' ? `https://mail.google.com/mail/?${params}` : `mailto:${encodeURIComponent(to)}?${params}`;
}
