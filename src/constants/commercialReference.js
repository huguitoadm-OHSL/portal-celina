import { actualsByAdvisor } from '../services/commercialLedger.js';
// Moneda comercial confirmada por supervisión: USD. No representa escrituras en CRM.
export const REFERENCE_DATE = '2026-10-10';
export const COMMERCIAL_CURRENCY = 'USD';
export const MONTHLY_TARGET_USD = 111000;
export const ADVISORS = Object.freeze([
  { id: 'carlos', nombre: 'Carlos Enrique Calderon Montano' },
  { id: 'jimmy', nombre: 'Jimmy Gonzales Nuñez' },
  { id: 'ely', nombre: 'Ely Gonzales Garcia' },
  { id: 'jaime', nombre: 'Jaime Fabricio Rios Castro' },
  { id: 'marisol', nombre: 'Marisol Urgel Pizarro' },
  { id: 'merly', nombre: 'Merly Mendez Hurtado' },
  { id: 'jose', nombre: 'Jose Gabriel Padilla Loayza' },
].map(Object.freeze));
export const PROJECT_NAMES = ['Muyurina', 'El Renacer', 'Santa Fe', 'Rancho Nuevo', 'Jardines', 'Celina VII F3', 'Cañaveral'];
// Posibles ventas: no se incorporan al registro de ventas realizadas.
export const PROJECT_PROJECTION = Object.freeze({ Muyurina: 0, 'El Renacer': 4, 'Rancho Nuevo': 1, Jardines: 2 });
export const ADVISOR_PROJECTIONS_USD = Object.freeze({ carlos: 5000, jimmy: 8000, ely: 7500, jaime: 6600, marisol: 6000, merly: 7500, jose: 7000 });
export const MARISOL_REFERENCE = Object.freeze({ id: 'supervision-marisol-2026-10-09', advisor: 'Marisol Urgel Pizarro', advisorId: 'marisol', project: 'Los Jardines', lots: 1, amountUsd: 11200, currency: 'USD', date: '2026-10-09', period: '2026-10', status: 'reported_by_supervisor' });
export const REPORTED_SALES = Object.freeze([
  // Se conserva el antecedente de Carlos; su fecha exacta no fue proporcionada.
  Object.freeze({ id: 'legacy-carlos', advisor: ADVISORS[0].nombre, advisorId: 'carlos', project: 'Cañaveral', lots: 1, amountUsd: 6500, currency: 'USD', date: null, period: '2026-10', status: 'legacy_reference' }),
  MARISOL_REFERENCE,
]);
// Adaptador de compatibilidad: la colocación y los lotes se derivan del registro único.
export const REFERENCE_ADVISORS = Object.freeze(actualsByAdvisor(ADVISORS, REPORTED_SALES).map(advisor => Object.freeze({ ...advisor, projectionUsd: ADVISOR_PROJECTIONS_USD[advisor.id] })));
