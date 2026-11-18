import { normalize } from './reportParser.js';

const has = (text, pattern) => pattern.test(normalize(text));
const recentDays = (now, at) => at ? (Date.parse(now.slice(0,10)+'T12:00:00Z') - Date.parse(at.slice(0,10)+'T12:00:00Z')) / 86400000 : Infinity;
const MATCH = Object.freeze({
  commitment: /confirmo (la )?compra|quiere comprar|decidio comprar|listo para comprar|entrego documentos|confirmo reserva|firmara|pago (la )?reserva|separar el lote/,
  visit: /visita (de )?terreno|visito el proyecto|recorrio el proyecto/,
  quote: /cotiz|propuesta|financiam|cuota inicial|mensualidad|capacidad de pago|precio/,
  scheduled: /agenda a visita|agendo visita|visita programada|cita confirmada/,
  interest: /interesad|le gusto|solicito informacion|pidio informacion|lo analizara|evaluara/,
  negative: /no compr|no desea|no quiere|sin interes|ya no|no puede comprar|descarto|no realizara/,
});
export const PIPELINE_STAGES = ['Nuevo / por contactar','En conversación','Visita agendada','Visitó el proyecto','Cotización / negociación','Compromiso de cierre','En pausa'];
export function scoreOpportunity(client, now, supervisorNotes = []) {
  const actions = [...(client.activities || [])].filter(a => a.at <= now).sort((a,b) => b.at.localeCompare(a.at));
  const latest = actions[0]?.at || null;
  const concatenated = actions.map(a => [a.kind,a.note].filter(Boolean).join(' '));
  const newest = concatenated.slice(0, 7);
  const recentText = newest.join(' ');
  const all = concatenated.join(' ');
  const lastDays = recentDays(now,latest);
  const evidence = [];
  let score = 0;
  const add = (points, reason) => {score += points; evidence.push(reason);};
  const negative = has(recentText, MATCH.negative);
  const committed = has(recentText,MATCH.commitment);
  const visits = has(all,MATCH.visit);
  const quotes = has(all,MATCH.quote);
  const appointments = has(all,MATCH.scheduled);
  const interest = has(recentText,MATCH.interest);
  if (committed && !negative) add(30,'Compromiso explícito documentado en las notas recientes');
  if (visits) add(25,'Visita al terreno registrada o mencionada');
  if (quotes) add(20,'Se menciona cotización, precio o plan de pago');
  if (appointments) add(15,'Agenda de visita registrada');
  if (interest && !negative) add(10,'Interés explícito reciente');
  if (lastDays <= 2) add(12,'Interacción en los dos últimos días');
  else if (lastDays <= 7) add(6,'Actividad registrada en la última semana');
  if (negative) {score = Math.min(score,15);evidence.push('Nota reciente de desinterés; requiere verificación');}
  if (lastDays > 7 && Number.isFinite(lastDays)) {score = Math.max(0, score-15); evidence.push('Seguimiento sin actividad reciente');}
  if (client.blacklisted) {score = 0;evidence.push('Restricción de contacto: no priorizar sin revisión');}
  const overdue = supervisorNotes.some(n => n.due && !n.completedAt && n.due < now.slice(0,10));
  if (overdue) evidence.push('Compromiso de supervisión vencido');
  const stage = client.blacklisted || negative ? 'En pausa'
    : committed ? 'Compromiso de cierre'
    : quotes ? 'Cotización / negociación'
    : visits ? 'Visitó el proyecto'
    : appointments ? 'Visita agendada'
    : actions.length ? 'En conversación' : 'Nuevo / por contactar';
  const nextAction = client.blacklisted ? 'Verificar restricción antes de contactar'
    : overdue ? 'Resolver tarea vencida de supervisión'
    : committed ? 'Confirmar documentos, reserva y condiciones con el asesor'
    : quotes ? 'Solicitar decisión y resolver objeciones de precio o cuota'
    : visits ? 'Contactar para concretar cotización o reserva'
    : appointments ? 'Confirmar fecha y asistencia a la visita'
    : lastDays > 7 ? 'Reactivar seguimiento y verificar interés'
    : actions.length ? 'Solicitar siguiente paso y fecha de compromiso'
    : 'Programar primer contacto';
  return {
    score: Math.min(100,Math.max(0,score)), stage, nextAction,
    evidence, lastDays: Number.isFinite(lastDays) ? Math.max(0, Math.floor(lastDays)) : null,
    quality: committed ? 'Alta señal de intención' : score>=50 ? 'Revisar para cierre' : score>=25 ? 'Seguimiento activo' : 'Sin evidencia suficiente',
    // Score es un orden operacional por reglas, no un porcentaje de conversión.
    probability: null,
  };
}
