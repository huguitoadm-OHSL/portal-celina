import { useMemo, useState } from 'react';
import { ADVISORS, ADVISOR_PROJECTIONS_USD, MONTHLY_TARGET_USD, REPORTED_SALES, PROJECTION_DETAILS } from '../constants/commercialReference';
import { actualsByAdvisor, addClosedSale, closedSales } from '../services/commercialLedger';
import { summarizeCommercial } from '../utils/commercial';
import { mergeSavedSales, planSalesImport, SALES_STORAGE_KEY } from '../services/salesImport';
import { CommercialContext } from './CommercialContext';

export function CommercialProvider({ children }) {
  const [initial] = useState(() => {
    try {
      const saved = localStorage.getItem(SALES_STORAGE_KEY);
      return { sales: saved ? mergeSavedSales(REPORTED_SALES, JSON.parse(saved)) : REPORTED_SALES, error: '' };
    } catch { return { sales: REPORTED_SALES, error: 'No se pudo restaurar el registro local. Los datos guardados no se han borrado; revise el respaldo antes de importar.' }; }
  });
  const [sales, setSales] = useState(initial.sales);
  const [storageError] = useState(initial.error);
  const [projections, setProjections] = useState(() => Object.fromEntries(ADVISORS.map(advisor => [advisor.id, { amountUsd: ADVISOR_PROJECTIONS_USD[advisor.id], days: PROJECTION_DETAILS[advisor.id]?.days ?? Array(7).fill(0), lots: PROJECTION_DETAILS[advisor.id]?.lots ?? Array(7).fill(0) }])));
  const [targetUsd, setTarget] = useState(MONTHLY_TARGET_USD);
  const setTargetUsd = amount => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 0) throw new Error('El objetivo USD debe ser positivo o cero.');
    setTarget(Math.round(value * 100) / 100);
  };
  const actuals = useMemo(() => actualsByAdvisor(ADVISORS, sales), [sales]);
  const advisors = useMemo(() => actuals.map(advisor => ({ ...advisor, projectionUsd: projections[advisor.id].amountUsd, days: projections[advisor.id].days, projectedLots: projections[advisor.id].lots })), [actuals, projections]);
  const summary = useMemo(() => summarizeCommercial(advisors, targetUsd), [advisors, targetUsd]);
  const updateProjection = (advisorId, amount, days, lots) => {
    const value = Number(amount);
    if (!ADVISORS.some(advisor => advisor.id === advisorId) || !Number.isFinite(value) || value < 0) throw new Error('Proyección inválida.');
    setProjections(previous => ({ ...previous, [advisorId]: { amountUsd: Math.round(value * 100) / 100, days: days ?? Array(7).fill(0), lots: lots ?? previous[advisorId].lots } }));
  };
  const importSales = rows => {
    if (storageError) throw new Error(storageError);
    const plan = planSalesImport(rows, sales);
    if (plan.errors.length) throw new Error('Corrija las filas observadas antes de aplicar.');
    const saved = plan.next.filter(sale => sale.source === 'excel');
    if (saved.length > 1000) throw new Error('El registro local admite como máximo 1.000 ventas importadas.');
    try { localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(saved)); }
    catch { throw new Error('No se pudo guardar en este navegador. No se aplicaron cambios.'); }
    setSales(plan.next);
    return plan;
  };
  const recordSale = sale => setSales(previous => addClosedSale(previous, sale));
  return <CommercialContext.Provider value={{ advisors, sales: closedSales(sales), summary, targetUsd, setTargetUsd, updateProjection, recordSale, importSales, storageError }}>{children}</CommercialContext.Provider>;
}
