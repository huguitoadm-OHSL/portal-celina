import { normalize } from './reportParser.js';

// Reglas auditables sobre datos declarados por el CRM. Ninguna acción se ejecuta
// sobre el cliente: el plan se recomienda al asesor y se recalcula al importar.
const daysSince=(now,at)=>at?Math.max(0,Math.floor((Date.parse(now.slice(0,10)+'T12:00:00Z')-Date.parse(at.slice(0,10)+'T12:00:00Z'))/86400000)):null;
const match=(text,re)=>re.test(normalize(text));
const terms={
  prospect:/\bprospecto\b|prospecto calificado/,
  commitment:/quiere comprar|confirmo (la )?compra|decidio comprar|listo para comprar|confirmo reserva|separar el lote|entrego documentos|firmara|pago (la )?reserva/,
  visit:/visita (de )?terreno|visito el proyecto|recorrio el proyecto|visita de terreno propia|visita de terreno minibus/,
  quote:/cotiz|propuesta|financiam|cuota inicial|mensualidad|capacidad de pago/,
  appointment:/agenda a visita|agendo visita|visita programada|cita confirmada/,
  interest:/interesad|le gusto|solicito informacion|pidio informacion|lo analizara|evaluara|quiere conocer/,
  negative:/no compr|no desea|no quiere|sin interes|ya no|no puede comprar|descarto|no realizara/,
  lot:/\b(lote|manzano|terreno elegido|lote elegido|lote seleccionado|uv)\b/,
  docs:/\b(ci|carnet|documentos|cedula|identidad)\b/
};
export const PIPELINE_STAGES=['Nuevo / por contactar','En conversación','Visita agendada','Visitó el proyecto','Cotización / negociación','Prospecto calificado','Compromiso de cierre','En pausa'];

export function planNextActions({temperature,prospect,committed,quote,visit,appointment,stale,blacklisted,overdue,identityComplete,lotKnown}) {
 if(blacklisted) return {headline:'Verificar restricción de contacto',urgency:'Revisión previa',steps:[
  'Comprobar el motivo de la restricción en el CRM antes de contactar',
  'Validar con supervisión si existe autorización para cualquier gestión',
  'Documentar la decisión sin realizar mensajes automáticos']};
 if(overdue) return {headline:'Resolver compromiso vencido',urgency:'Hoy',steps:[
  'Revisar con el asesor el compromiso registrado y el último contacto',
  'Confirmar personalmente el estado actual de la negociación',
  'Establecer y documentar una nueva fecha verificable de gestión']};
 if(prospect && !committed) return {headline:'Preparar cierre del prospecto',urgency:'Hoy',steps:[
  identityComplete&&lotKnown?'Verificar documentación y datos del lote reservado/elegido':'Confirmar documentación y lote específico de interés antes de avanzar',
  quote?'Revisar la última cotización y condiciones aprobadas':'Preparar cotización del lote y validar cuota inicial y capacidad de pago',
  'Pedir confirmación de decisión y fecha de reserva, sin dar por realizada la venta']};
 if(committed) return {headline:'Confirmar cierre y documentación',urgency:'Hoy',steps:[
  'Verificar lote, titular, monto y condiciones de la propuesta',
  'Confirmar con el cliente el compromiso de reserva o firma y su fecha',
  'Conciliar el resultado con CESI antes de contabilizar una venta']};
 if(temperature==='Caliente') return {headline:'Intervenir en la negociación',urgency:'Hoy',steps:[
  'Contactar al cliente con referencia a su último interés registrado',
  quote?'Resolver la objeción concreta y confirmar aceptación de cotización':'Preparar cotización de la alternativa de lote',
  'Acordar siguiente compromiso verificable con el cliente']};
 if(temperature==='Tibio') return {headline:'Convertir interés en visita o cotización',urgency:'Próximas 48 h',steps:[
  appointment?'Confirmar asistencia y logística de visita':'Ofrecer visita al proyecto y dos horarios específicos',
  visit?'Consultar qué lote y condiciones le interesaron':'Confirmar presupuesto, superficie y ubicación deseada',
  'Registrar respuesta y fecha del próximo seguimiento']};
 if(temperature==='Frío / en pausa') return {headline:'Recuperar o depurar cartera',urgency:stale?'Esta semana':'Según consentimiento',steps:[
  'Revisar motivo de desinterés y vigencia del consentimiento de contacto',
  'Realizar un único contacto de recuperación si corresponde',
  'Si confirma desinterés, mantener en pausa sin insistencia']};
 return {headline:stale?'Retomar contacto pendiente':'Completar primer diagnóstico',urgency:stale?'Próximas 48 h':'Esta semana',steps:[
  'Confirmar que los datos de contacto son correctos',
  'Consultar necesidad inmobiliaria, presupuesto y plazo de compra',
  'Programar seguimiento concreto o visita según respuesta']};
}
export function scoreOpportunity(client,now,supervisorNotes=[]) {
 const actions=[...(client.activities||[])].filter(a=>a.at<=now).sort((a,b)=>b.at.localeCompare(a.at));
 const latest=actions[0]?.at||null;
 const lastDays=daysSince(now,latest);
 // El estado se obtiene del CRM; nunca se inventa por la presencia de un nombre.
 const currentState=normalize(client.state||'');
 const latestStage=actions.find(a=>String(a.prospectStage||'').trim())?.prospectStage||'';
 const prospect=match([currentState,latestStage].join(' '),terms.prospect);
 const newest=actions.slice(0,8).map(a=>[a.note,a.kind,a.contactability].join(' ')).join(' ');
 const all=actions.map(a=>[a.note,a.kind].join(' ')).join(' ');
 const negative=match(newest,terms.negative);
 const committed=match(newest,terms.commitment);
 const visit=match(all,terms.visit);
 const quote=match(all,terms.quote);
 const appointment=match(all,terms.appointment);
 const interest=match(newest,terms.interest);
 const lotKnown=match(newest,terms.lot);
 const identityComplete=client.identityComplete===true || actions.some(a=>a.identityComplete===true);
 const evidence=[];let score=0;
 const add=(n,why)=>{score+=n;evidence.push({points:n,reason:why});};
 if(prospect)add(40,'El CRM marca la negociación como Prospecto');
 if(identityComplete)add(8,'El reporte indica documento de identidad registrado (sin almacenar su número)');
 if(lotKnown)add(8,'Las notas mencionan un lote o manzano concreto');
 if(committed)add(22,'Intención o compromiso de compra explícito en notas');
 if(visit)add(12,'Visita de terreno registrada o mencionada');
 if(quote)add(10,'Cotización o condiciones de financiamiento registradas');
 if(appointment)add(5,'Visita agendada');
 if(interest)add(5,'Interés explícito registrado');
 if(lastDays!==null&&lastDays<=2)add(8,'Actividad de los últimos dos días');
 else if(lastDays!==null&&lastDays<=7)add(4,'Actividad de la última semana');
 const stale=lastDays===null||lastDays>7;
 if(stale&&lastDays!==null){score-=12;evidence.push({points:-12,reason:'Más de siete días sin actividad registrada'});}
 if(negative){score=Math.min(score,12);evidence.push({points:0,reason:'Nota reciente de rechazo o desinterés; revisar contexto'});}
 if(client.blacklisted){score=0;evidence.push({points:0,reason:'Restricción de contacto; no contactar automáticamente'});}
 const overdue=supervisorNotes.some(n=>n.due&&!n.completedAt&&n.due<now.slice(0,10));
 const stage=client.blacklisted||negative?'En pausa':committed?'Compromiso de cierre':prospect?'Prospecto calificado':quote?'Cotización / negociación':visit?'Visitó el proyecto':appointment?'Visita agendada':actions.length?'En conversación':'Nuevo / por contactar';
 const temperature=client.blacklisted||negative?'Frío / en pausa':
  (prospect&&(committed||lotKnown||identityComplete)||committed&&!stale)?'Caliente':
  (prospect||interest||visit||quote||appointment)?'Tibio':
  stale&&actions.length?'Frío / en pausa':'Sin calificar';
 const plan=planNextActions({temperature,prospect,committed,quote,visit,appointment,stale,blacklisted:client.blacklisted,overdue,identityComplete,lotKnown});
 return {score:Math.max(0,Math.min(100,score)),stage,temperature,plan,
  nextAction:plan.headline,evidence,lastDays,prospect,identityComplete,lotKnown,
  quality:prospect?'Prospecto en CRM':score>=55?'Alta prioridad':score>=25?'Seguimiento activo':'Sin evidencia suficiente',
  probability:null};
}
