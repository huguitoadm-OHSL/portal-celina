import { actualsByAdvisor } from '../services/commercialLedger.js';
// Moneda comercial confirmada por supervisión: USD. No representa escrituras en CRM.
export const REFERENCE_DATE = '2026-10-22';
export const COMMERCIAL_CURRENCY = 'USD';
export const ACTIVE_COMMERCIAL_PERIOD = '2026-11';
export const NOVEMBER_TARGET_USD = 110000;
export const NOVEMBER_WEEK_START = '2026-11-16';
export const MONTHLY_TARGET_USD = 111000;
export const ADVISORS = Object.freeze([
  { id: 'carlos', nombre: 'Carlos Enrique Calderon Montano' },
  { id: 'jimmy', nombre: 'Jimmy Gonzales Nuñez' },
  { id: 'ely', nombre: 'Ely Gonzales Garcia' },
  { id: 'jaime', nombre: 'Jaime Fabricio Rios Castro' },
  { id: 'marisol', nombre: 'Marisol Urgel Pizarro' },
  { id: 'merly', nombre: 'Merly Mendez Hurtado' },
  { id: 'jose', nombre: 'Jose Gabriel Padilla Loayza' },
  { id: 'ana', nombre: 'Ana Karla Castro Alvis' },
].map(Object.freeze));
export const PROJECT_NAMES = ['Muyurina', 'El Renacer', 'Santa Fe', 'Rancho Nuevo', 'Jardines', 'Celina VII F3', 'Cañaveral'];
// Posibles ventas: no se incorporan al registro de ventas realizadas.
export const PROJECT_PROJECTION = Object.freeze({ Muyurina: 0, 'El Renacer': 2, 'Santa Fe': 0, 'Rancho Nuevo': 1, Jardines: 1 });
export const ADVISOR_PROJECTIONS_USD = Object.freeze({ carlos: 5000, jimmy: 0, ely: 7500, jaime: 5700, marisol: 0, merly: 0, jose: 6000 });
export const MARISOL_REFERENCE = Object.freeze({ id: 'supervision-marisol-2026-10-09', advisor: 'Marisol Urgel Pizarro', advisorId: 'marisol', project: 'El Renacer', previousProject: 'Los Jardines', correctionSource: 'Detalle de ventas de supervisión del 16/10/2026', lots: 1, amountUsd: 11200, currency: 'USD', date: '2026-10-09', period: '2026-10', status: 'reported_by_supervisor' });
export const REPORTED_SALES = Object.freeze([
  // El extracto del 16/10 confirma fecha y proyecto; se conserva el ID anterior para no duplicar.
  Object.freeze({ id: 'legacy-carlos', advisor: ADVISORS[0].nombre, advisorId: 'carlos', project: 'Cañaveral', lots: 1, amountUsd: 6500, currency: 'USD', date: '2026-10-06', period: '2026-10', status: 'legacy_reference' }),
  MARISOL_REFERENCE,
  Object.freeze({ id: 'supervision-carlos-2026-10-13', advisor: ADVISORS[0].nombre, advisorId: 'carlos', project: 'Cañaveral', lots: 1, amountUsd: 7425, currency: 'USD', date: '2026-10-13', period: '2026-10', status: 'reported_by_supervisor' }),
  Object.freeze({ id: 'supervision-marisol-2026-10-16', advisor: ADVISORS[4].nombre, advisorId: 'marisol', project: 'Muyurina', lots: 1, amountUsd: 47880, currency: 'USD', date: '2026-10-16', period: '2026-10', status: 'reported_by_supervisor' }),
  Object.freeze({ id: 'supervision-jaime-2026-10-18', advisor: ADVISORS[3].nombre, advisorId: 'jaime', project: 'El Renacer', lots: 1, amountUsd: 5700, currency: 'USD', date: '2026-10-18', referenceDate: '2026-10-22', period: '2026-10', status: 'reported_by_supervisor' }),
]);
// Referencias de noviembre del reporte CESI 17/11/2026; "Aprobado: No" es distinto de venta reportada a supervisión.
// Se conservan los datos del contrato, por lo que una carga posterior de CESI no duplica operaciones.
export const NOVEMBER_REPORTED_SALES = Object.freeze([
  Object.freeze({id:'excel-contract:C2604201635', contractId:'C2604201635', advisor:ADVISORS[2].nombre, advisorId:'ely', project:'El Renacer', date:'2026-11-11', lots:1, amountUsd:17998.74, currency:'USD', period:'2026-11', status:'reported_by_supervisor', source:'cesi-reference', cesiApproved:false}),
  Object.freeze({id:'excel-contract:C2603500764', contractId:'C2603500764', advisor:ADVISORS[5].nombre, advisorId:'merly', project:'Muyurina', date:'2026-11-17', lots:1, amountUsd:11897.25, currency:'USD', period:'2026-11', status:'reported_by_supervisor', source:'cesi-reference', cesiApproved:false})
]);
export const NOVEMBER_PROJECTIONS_USD = Object.freeze({carlos:18400,jimmy:0,ely:6000,jaime:0,marisol:0,merly:7500,jose:14000,ana:8000});
export const NOVEMBER_PROJECTION_DETAILS = Object.freeze({
 carlos:{days:[0,0,9200,0,0,9200,0],lots:[0,0,0,2,0,0,0]},
 ely:{days:[0,0,0,0,6000,0,0],lots:[0,1,0,0,0,0,0]},
 merly:{days:[0,0,0,0,7500,0,0],lots:[0,0,0,0,1,0,0]},
 jose:{days:[0,0,8000,0,6000,0,0],lots:[0,1,0,0,1,0,0]},
 ana:{days:[0,0,8000,0,0,0,0],lots:[0,0,0,0,1,0,0]}
});
// Adaptador de compatibilidad: la colocación y los lotes se derivan del registro único.
export const REFERENCE_ADVISORS = Object.freeze(actualsByAdvisor(ADVISORS, REPORTED_SALES).map(advisor => Object.freeze({ ...advisor, projectionUsd: ADVISOR_PROJECTIONS_USD[advisor.id] })));

export const PROJECTION_WEEK_START = '2026-10-19';
// Lunes a domingo; proyectos en el orden PROJECT_NAMES. Solo oportunidades, no cierres.
export const PROJECTION_DETAILS = Object.freeze({
  carlos: { days: [0,0,0,0,0,5000,0], lots: [0,0,0,1,0,0,0] },
  ely: { days: [0,0,0,0,0,0,7500], lots: [0,0,0,0,1,0,0] },
  jaime: { days: [0,0,0,0,0,5700,0], lots: [0,1,0,0,0,0,0] },
  jose: { days: [0,0,0,0,6000,0,0], lots: [0,1,0,0,0,0,0] },
});
