import { useMemo, useState } from 'react';
import { ADVISORS, ADVISOR_PROJECTIONS_USD, MONTHLY_TARGET_USD, REPORTED_SALES } from '../constants/commercialReference';
import { actualsByAdvisor, addClosedSale, closedSales } from '../services/commercialLedger';
import { summarizeCommercial } from '../utils/commercial';
import { CommercialContext } from './CommercialContext';

export function CommercialProvider({ children }) {
  // Estado de sesión: sin escrituras financieras remotas ni almacenamiento de contratos en localStorage.
  const [sales, setSales] = useState(REPORTED_SALES);
  const [projections, setProjections] = useState(() => Object.fromEntries(ADVISORS.map(advisor => [advisor.id, { amountUsd: ADVISOR_PROJECTIONS_USD[advisor.id], days: Array(7).fill(0), lots: Array(7).fill(0) }])));
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
  const recordSale = sale => setSales(previous => addClosedSale(previous, sale));
  return <CommercialContext.Provider value={{ advisors, sales: closedSales(sales), summary, targetUsd, setTargetUsd, updateProjection, recordSale }}>{children}</CommercialContext.Provider>;
}
