import { useMemo, useState } from 'react';
import { ArrowUpRight, Target, TrendingUp, CalendarDays, CircleDollarSign, Search, ShieldCheck } from 'lucide-react';
import { REFERENCE_ADVISORS, MONTHLY_TARGET_BS, PROJECT_PROJECTION, MARISOL_REFERENCE } from '../constants/commercialReference';
import { EXCHANGE_RATE_HISTORY, getExchangeRate } from '../constants/exchangeRates';
import { summarizeCommercial, reconcileSale } from '../utils/commercial';
const money = value => `Bs ${new Intl.NumberFormat('es-BO', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)}`;
const percent = value => new Intl.NumberFormat('es-BO', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value);

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('name');
  const [records, setRecords] = useState(null);
  const [error, setError] = useState('');
  const summary = summarizeCommercial(REFERENCE_ADVISORS, MONTHLY_TARGET_BS);
  const reconciliation = reconcileSale(MARISOL_REFERENCE, records);
  const rows = useMemo(() => REFERENCE_ADVISORS.filter(a => a.nombre.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))).sort((a, b) => sort === 'total' ? b.actualBs + b.projectionBs - a.actualBs - a.projectionBs : a.nombre.localeCompare(b.nombre)), [query, sort]);
  async function readRecords(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(''); setRecords(null);
    try {
      if (file.size > 2_000_000) throw new Error('El archivo debe tener menos de 2 MB.');
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data) || data.some(a => !a || typeof a !== 'object' || !['advisor', 'project', 'date', 'amountBs', 'lots'].every(k => Object.hasOwn(a, k)))) throw new Error('Formato inválido. Se requiere una lista de registros con advisor, project, date, amountBs y lots.');
      setRecords(data);
    } catch (failure) { setError(failure.message); }
  }
  return <div className="executive-dashboard">
    <section className="dashboard-hero"><div><p className="eyebrow">DIRECCIÓN COMERCIAL · OCTUBRE 2026</p><h1>Una visión clara.<br/><span>Un equipo con rumbo.</span></h1><p>Resultados, oportunidades y decisiones en un solo lugar.</p><div className="hero-meta"><CalendarDays size={16}/> Corte de referencia: 10 de octubre de 2026 <span>·</span> 7 asesores</div></div><div className="achievement-ring" style={{ '--achievement': `${Math.min(summary.achievementPct, 100)}%` }}><div><strong>{percent(summary.achievementPct)}<small>%</small></strong><span>Cumplimiento proyectado</span></div></div></section>
    <p className="source-note"><ShieldCheck size={16}/> Referencia comercial proporcionada por supervisión. Pendiente de conciliación con el CRM; las proyecciones no son ventas cerradas.</p>
    <div className="metric-grid">{[
      { label: 'Colocación actual', value: summary.actualBs, detail: 'Importe de referencia · Bs 11.200 de Marisol incluidos', icon: CircleDollarSign, className: 'current' },
      { label: 'Proyección semanal', value: summary.projectionBs, detail: '7 lotes proyectados · oportunidades abiertas', icon: TrendingUp },
      { label: 'Cierre de mes proyectado', value: summary.totalBs, detail: 'Actual + proyección semanal', icon: ArrowUpRight },
      { label: 'Brecha proyectada', value: summary.gapBs, detail: `Objetivo mensual: ${money(MONTHLY_TARGET_BS)}`, icon: Target },
    ].map(({label, value, detail, icon: Icon, className}) => <article className={`metric-card ${className || ''}`} key={label}><div><span>{label}</span><Icon size={20}/></div><strong>{money(value)}</strong><p>{detail}</p></article>)}</div>
    <div className="dashboard-columns"><section className="panel"><div className="panel-heading"><div><p className="eyebrow">DESEMPEÑO DEL EQUIPO</p><h2>Colocación por asesor</h2></div><span className="subtle-badge">Bolivianos</span></div><div className="table-tools"><label><Search size={16}/><input aria-label="Buscar asesor" placeholder="Buscar asesor…" value={query} onChange={e => setQuery(e.target.value)}/></label><select aria-label="Orden de asesores" value={sort} onChange={e => setSort(e.target.value)}><option value="name">Nombre</option><option value="total">Mayor proyección</option></select></div><div className="table-scroll"><table className="executive-table"><thead><tr><th>Asesor</th><th>Actual Bs</th><th>Proyección Bs</th><th>Total Bs</th></tr></thead><tbody>{rows.map(a => <tr key={a.id}><td><span className="advisor-avatar">{a.nombre.split(' ').slice(0,2).map(n => n[0]).join('')}</span>{a.nombre}</td><td>{money(a.actualBs)}</td><td>{money(a.projectionBs)}</td><td><strong>{money(a.actualBs + a.projectionBs)}</strong></td></tr>)}</tbody><tfoot><tr><th>Total equipo</th><td>{money(summary.actualBs)}</td><td>{money(summary.projectionBs)}</td><td>{money(summary.totalBs)}</td></tr></tfoot></table>{!rows.length && <p>No se encontraron asesores.</p>}</div></section><section className="panel"><p className="eyebrow">OPORTUNIDADES</p><h2>7 lotes por concretar</h2><p className="muted">Distribución de la proyección, separada de los cierres.</p><div className="project-bars">{Object.entries(PROJECT_PROJECTION).map(([project, quantity]) => <div key={project}><div><span>{project}</span><strong>{quantity} lotes</strong></div><div className="bar-track"><div style={{width: `${quantity / 7 * 100}%`}}/></div></div>)}</div><div className="goal-progress"><div><span>Avance actual</span><strong>{percent(summary.currentPct)} %</strong></div><progress max="100" value={summary.currentPct} aria-label="Avance actual respecto al objetivo mensual"/><p>{money(summary.actualBs)} de {money(MONTHLY_TARGET_BS)}</p></div></section></div>
    <div className="dashboard-columns"><section className="panel"><p className="eyebrow">CONCILIACIÓN DE OPERACIONES</p><h2>Marisol · El Renacer</h2><p>1 lote · {money(11200)} · 10/10/2026. Este importe ya está incluido en la colocación actual.</p><p className="reconciliation-status" role="status">{reconciliation.status === 'unverified' ? 'Registro remoto sin verificar: no existe conexión de ventas en esta versión.' : reconciliation.status === 'possible_duplicate' ? `${reconciliation.matches.length === 1 ? 'Se encontró 1 coincidencia candidata.' : `Se encontraron ${reconciliation.matches.length} coincidencias candidatas.`} Verifique el contrato antes de registrar.` : 'No se encontró coincidencia en el archivo proporcionado. Esto no confirma su ausencia en el CRM.'}</p><label className="file-label">Conciliar un extracto JSON del CRM (solo lectura)<input type="file" accept=".json,application/json" onChange={readRecords}/></label>{error && <p role="alert">{error}</p>}<details><summary>Datos pendientes para confirmar la operación</summary><p>Contrato o identificador único, cliente, UV, manzano, lote, comprobante y estado de validación. La confirmación requiere autorización expresa. El archivo se analiza localmente y no se guarda ni envía.</p></details></section><section className="panel"><p className="eyebrow">CONTROL FINANCIERO</p><h2>Tipo de cambio e historial</h2><p className="exchange-value">Bs {percent(getExchangeRate())} <small>/ USD</small></p><p>Excepción gerencial: 10 y 11 de octubre de 2026. Los contratos conservan su TC histórico.</p><ul className="rate-history">{EXCHANGE_RATE_HISTORY.map(rate => <li key={rate.id}><strong>Bs {percent(rate.rate)}</strong><span>{rate.from ? `${rate.from} al ${rate.through}` : 'Base heredada fuera de la excepción'}</span></li>)}</ul><details><summary>Regla de productividad pendiente de conciliación</summary><p>Incentivos: 2 ventas o USD 15.000, con carpetas al día. Seguimiento: umbral heredado de 18.000. Se mantienen las reglas separadas. USD 15.000 × 11,73 = Bs 175.950; no se usa esta equivalencia para modificar incentivos.</p></details></section></div>
  </div>;
}
