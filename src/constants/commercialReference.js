// Referencia del supervisor. No representa una inserción ni una consulta al CRM.
export const REFERENCE_DATE = '2026-10-10';
export const MONTHLY_TARGET_BS = 111000;
export const REFERENCE_ADVISORS = Object.freeze([
  { id: 'carlos', nombre: 'Carlos Enrique Calderon Montano', actualBs: 6500, projectionBs: 5000, referenceSales: 1 },
  { id: 'jimmy', nombre: 'Jimmy Gonzales Nuñez', actualBs: 0, projectionBs: 8000, referenceSales: 0 },
  { id: 'ely', nombre: 'Ely Gonzales Garcia', actualBs: 0, projectionBs: 7500, referenceSales: 0 },
  { id: 'jaime', nombre: 'Jaime Fabricio Rios Castro', actualBs: 0, projectionBs: 6600, referenceSales: 0 },
  { id: 'marisol', nombre: 'Marisol Urgel Pizarro', actualBs: 11200, projectionBs: 6000, referenceSales: 1 },
  { id: 'merly', nombre: 'Merly Mendez Hurtado', actualBs: 0, projectionBs: 7500, referenceSales: 0 },
  { id: 'jose', nombre: 'Jose Gabriel Padilla Loayza', actualBs: 0, projectionBs: 7000, referenceSales: 0 },
].map(Object.freeze));
export const PROJECT_NAMES = ['Muyurina', 'El Renacer', 'Santa Fe', 'Rancho Nuevo', 'Jardines', 'Celina VII F3', 'Cañaveral'];
// La asignación individual y las fechas diarias no fueron proporcionadas.
export const PROJECT_PROJECTION = Object.freeze({ Muyurina: 0, 'El Renacer': 4, 'Rancho Nuevo': 1, Jardines: 2 });
// Corrección expresa de supervisión del 10/10: venta ingresada el día anterior.
// El cuadro anterior en Bs se conserva por separado; este importe USD no se agrega a sus totales.
export const MARISOL_REFERENCE = Object.freeze({ id: 'supervision-marisol-2026-10-09', advisor: 'Marisol Urgel Pizarro', advisorId: 'marisol', project: 'Los Jardines', lots: 1, amountUsd: 11200, currency: 'USD', date: '2026-10-09', status: 'reported_by_supervisor' });
export const REPORTED_SALES = Object.freeze([
  Object.freeze({ id: 'legacy-carlos', advisorId: 'carlos', project: 'Cañaveral', lots: 1, status: 'legacy_reference' }),
  MARISOL_REFERENCE,
]);
