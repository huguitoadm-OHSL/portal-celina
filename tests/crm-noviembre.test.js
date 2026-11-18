import test from 'node:test';
import assert from 'node:assert/strict';
import {splitReportByAdvisor} from '../src/crm/multiAdvisorReport.js';
import {scoreOpportunity,PIPELINE_STAGES} from '../src/crm/opportunityScore.js';
const header=['Nro.','Sucursal','Encargado','Agente','Campaña','ID Lead','Lead','Cedula de identidad','Teléfono','Fecha de registro','Medio de contacto','Contactado por','Estado del lead','Actividad','Actividad nota','Actividad fecha','Contactabilidad','Etapa de prospección'];
const record=(agent,id,phone,note) => [1,'MONTERO','SUPERVISOR',agent,'SIN ORIGEN',id,'Cliente','',phone,'2026-11-07 10:05:09','Web','-','Pendiente','Llamada por Whatsapp',note,'2026-11-09 13:12:00','Contestó','-'];
test('Excel de actividades multi-asesor se separa preservando filas e identidad',()=>{
 const rows=[['ACTIVIDADES REGISTRADAS',...Array(16).fill(null),'Fecha: 17/11/2026 19:10'],['Del 01/11/2026 al 30/11/2026'],[],['Total lead registrados: 3'],[],header,
 record('Ana Karla Castro Alvis','example-123','+591 70000001','Interesado'),
 record('Merly Mendez Hurtado','example-124','+591 70000002','Quiere comprar'),
 record('Ana Karla Castro Alvis','example-125','+591 70000003','No desea')];
 const result=splitReportByAdvisor(rows,'2026-11');
 assert.equal(result.plans.length,2);assert.equal(result.count,3);
 assert.deepEqual(result.plans.map(p=>p.plan.rawCount).sort(),[1,2]);
 assert.deepEqual(result.plans.flatMap(p=>p.plan.errors),[]);
 assert.equal(result.plans[0].plan.exportedAt,'2026-11-17T19:10:00');
});
test('Puntaje comercial no se presenta como probabilidad ni prioriza restricciones',()=>{
 const lead={activities:[{at:'2026-11-16T09:00:00',kind:'Visita de terreno propia',note:'Cotización entregada, quiere comprar'}]};
 const score=scoreOpportunity(lead,'2026-11-17T12:00:00');
 assert.ok(score.score>40); assert.equal(score.probability,null);
 assert.equal(score.stage,'Compromiso de cierre');assert.ok(PIPELINE_STAGES.includes(score.stage));
 assert.equal(scoreOpportunity({...lead,blacklisted:true},'2026-11-17T12:00:00').score,0);
});
