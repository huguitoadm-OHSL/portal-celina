import test from 'node:test';
import assert from 'node:assert/strict';
import {canonicalProjectName,projectIdentity} from '../src/services/projectIdentity.js';
import {reportedSalesByProject} from '../src/utils/commercial.js';
import {scoreOpportunity,planNextActions} from '../src/crm/opportunityScore.js';

test('dos ventas no generan una barra adicional por alias de Renacer ni Jardines',()=>{
 assert.equal(canonicalProjectName('EL RENACER'),'Renacer');
 assert.equal(canonicalProjectName('Celina Renacer'),'Renacer');
 assert.equal(canonicalProjectName('Los Jardines'),'Jardines');
 assert.equal(projectIdentity('El Renacer'),projectIdentity('Renacer'));
 const sales=[{project:'El Renacer',lots:1},{project:'Renacer',lots:1},{project:'Los Jardines',lots:1}];
 assert.deepEqual(reportedSalesByProject(['Renacer','Jardines'],sales),[2,1]);
});
const activity=(note,kind='Llamada por Whatsapp')=>({at:'2026-11-17T11:00:00',note,kind,prospectStage:''});
test('Prospecto acreditado tiene ponderación superior sin presentar probabilidad real',()=>{
 const other=scoreOpportunity({state:'En proceso',activities:[activity('Le interesa el lote')]},'2026-11-17T14:00:00');
 const prospect=scoreOpportunity({state:'Prospecto',identityComplete:true,activities:[activity('Lote 8 del manzano 2, interesado en cotización')]},'2026-11-17T14:00:00');
 assert.ok(prospect.score>other.score);
 assert.equal(prospect.stage,'Prospecto calificado');
 assert.equal(prospect.temperature,'Caliente');
 assert.equal(prospect.probability,null);
 assert.equal(prospect.plan.steps.length,3);
 assert.match(prospect.plan.headline,/cierre/);
});
test('Prospecto sin confirmación documental no presume datos inexistentes',()=>{
 const result=scoreOpportunity({state:'Prospecto',activities:[activity('Pendiente de más información')]},'2026-11-17T14:00:00');
 assert.equal(result.temperature,'Tibio');
 assert.match(result.plan.steps[0],/Confirmar documentación/);
});
test('Desinterés y lista negra impiden recomendar cierre pese a prospecto anterior',()=>{
 const negative=scoreOpportunity({state:'Prospecto',activities:[activity('No desea comprar, cerró negociación')]},'2026-11-17T14:00:00');
 assert.equal(negative.stage,'En pausa');
 assert.equal(negative.temperature,'Frío / en pausa');
 assert.equal(negative.score<=12,true);
 const blocked=scoreOpportunity({state:'Prospecto',blacklisted:true,activities:[activity('Quiere comprar lote 12')]},'2026-11-17T14:00:00');
 assert.equal(blocked.score,0);
 assert.match(blocked.plan.steps[0],/restricción/);
});
test('plan comercial sugerido sin edición manual, según señales y compromisos vencidos',()=>{
 const p=scoreOpportunity({state:'En proceso',activities:[activity('Agenda a visita de terreno','Agenda a Visita de Terreno')]},'2026-11-17T14:00:00');
 assert.match(p.plan.steps[0],/visita|contacto/i);
 const late=scoreOpportunity({state:'En proceso',activities:[activity('Quiere comprar')]},'2026-11-17T14:00:00',[{due:'2026-11-16',completedAt:null}]);
 assert.equal(late.plan.urgency,'Hoy');
 assert.match(late.plan.headline,/vencido/);
 const cold=planNextActions({temperature:'Frío / en pausa',stale:true});
 assert.match(cold.steps[0],/consentimiento/);
});
