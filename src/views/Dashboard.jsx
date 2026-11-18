import { useMemo, useState } from 'react';
import { ArrowUpRight, Target, TrendingUp, CalendarDays, CircleDollarSign, Search, ShieldCheck } from 'lucide-react';
import { PROJECT_NAMES } from '../constants/commercialReference';
import { useCommercial } from '../hooks/useCommercial';
const money = value => `USD ${new Intl.NumberFormat('es-BO', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)}`;
const percent = value => new Intl.NumberFormat('es-BO', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value);

export default function Dashboard({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('name');
  const { advisors, sales, summary, targetUsd } = useCommercial();
  const projectProjection = Object.fromEntries(PROJECT_NAMES.map((name, index) => [name, advisors.reduce((sum, advisor) => sum + advisor.projectedLots[index], 0)]));
  const projectedCount = Object.values(projectProjection).reduce((sum, n) => sum + n, 0);
  const rows = useMemo(() => advisors.filter(a => a.nombre.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))).sort((a, b) => sort === 'total' ? b.actualUsd + b.projectionUsd - a.actualUsd - a.projectionUsd : a.nombre.localeCompare(b.nombre)), [advisors, query, sort]);
  return <div className="executive-dashboard">
    <section className="dashboard-hero">
      <div className="hero-content">
        <p className="eyebrow"><span className="hero-status-dot"/> DIRECCIÓN COMERCIAL · NOVIEMBRE 2026</p>
        <h1>Una visión clara.<br/><span>Un equipo con rumbo.</span></h1>
        <p>Resultados, oportunidades y decisiones en un solo lugar.</p>
        <div className="hero-actions">
          <button className="hero-action-primary" onClick={() => onNavigate?.('proyeccion')}>Revisar proyección <ArrowUpRight size={16}/></button>
          <button onClick={() => onNavigate?.('seguimiento')}>Ver ventas <ArrowUpRight size={16}/></button>
        </div>
        <div className="hero-meta"><CalendarDays size={15}/> Corte: 17 de noviembre de 2026 <span>·</span> {advisors.length} asesores · {advisors.reduce((sum, a) => sum + a.confirmedSales, 0)} ventas realizadas</div>
      </div>
      <div className="hero-score">
        <div className="achievement-ring" style={{ '--achievement': `${Math.min(summary.achievementPct, 100)}%` }}><div><span className="ring-label">CIERRE PROYECTADO</span><strong>{percent(summary.achievementPct)}<small>%</small></strong><span>Cumplimiento proyectado</span></div></div>
        <p>Objetivo mensual <strong>{money(targetUsd)}</strong></p>
      </div>
    </section>
    <p className="source-note"><ShieldCheck size={16}/> Ventas realizadas reportadas por supervisión. Inicio, Proyección Semanal, Seguimiento e Incentivos comparten esta colocación en USD. Las oportunidades proyectadas se mantienen separadas.</p>
    <div className="metric-grid">{[
      { label: 'Colocación actual', value: summary.actualUsd, detail: 'Solo ventas realizadas · fuente compartida', icon: CircleDollarSign, className: 'current' },
      { label: 'Proyección semanal', value: summary.projectionUsd, detail: `${projectedCount} lotes proyectados · 16 al 22 de noviembre`, icon: TrendingUp },
      { label: 'Cierre de mes proyectado', value: summary.totalUsd, detail: 'Actual + proyección semanal', icon: ArrowUpRight },
      { label: 'Brecha proyectada', value: summary.gapUsd, detail: `Objetivo mensual: ${money(targetUsd)}`, icon: Target },
    ].map(({label, value, detail, icon: Icon, className}) => <article className={`metric-card ${className || ''}`} key={label}><div><span>{label}</span><Icon size={20}/></div><strong>{money(value)}</strong><p>{detail}</p></article>)}</div>
    <div className="dashboard-columns"><section className="panel"><div className="panel-heading"><div><p className="eyebrow">DESEMPEÑO DEL EQUIPO</p><h2>Colocación por asesor</h2></div><span className="subtle-badge">{advisors.length} asesores · USD</span></div><div className="table-tools"><label><Search size={16}/><input aria-label="Buscar asesor" placeholder="Buscar asesor…" value={query} onChange={e => setQuery(e.target.value)}/></label><select aria-label="Orden de asesores" value={sort} onChange={e => setSort(e.target.value)}><option value="name">Nombre</option><option value="total">Mayor proyección</option></select></div><div className="table-scroll"><table className="executive-table"><thead><tr><th>Asesor</th><th>Ventas realizadas</th><th>Actual USD</th><th>Proyección USD</th><th>Total USD</th></tr></thead><tbody>{rows.map(a => <tr key={a.id}><td><span className="advisor-avatar">{a.nombre.split(' ').slice(0,2).map(n => n[0]).join('')}</span>{a.nombre}</td><td>{a.confirmedSales}</td><td>{money(a.actualUsd)}</td><td>{money(a.projectionUsd)}</td><td><strong>{money(a.actualUsd + a.projectionUsd)}</strong></td></tr>)}</tbody><tfoot><tr><th>Total equipo</th><td>{advisors.reduce((sum, a) => sum + a.confirmedSales, 0)}</td><td>{money(summary.actualUsd)}</td><td>{money(summary.projectionUsd)}</td><td>{money(summary.totalUsd)}</td></tr></tfoot></table>{!rows.length && <p>No se encontraron asesores.</p>}</div></section><section className="panel"><p className="eyebrow">OPORTUNIDADES</p><h2>{projectedCount} lotes por concretar</h2><p className="muted">Distribución de la proyección, separada de los cierres.</p><div className="project-bars">{Object.entries(projectProjection).map(([project, quantity]) => <div key={project}><div><span>{project}</span><strong>{quantity} {quantity === 1 ? 'lote' : 'lotes'}</strong></div><div className="bar-track"><div style={{width: `${quantity / Math.max(projectedCount, 1) * 100}%`}}/></div></div>)}</div><div className="goal-progress"><div><span>Avance actual</span><strong>{percent(summary.currentPct)} %</strong></div><progress max="100" value={summary.currentPct} aria-label="Avance actual respecto al objetivo mensual"/><p>{money(summary.actualUsd)} de {money(targetUsd)}</p></div></section></div>
    <div className="dashboard-columns"><section className="panel"><p className="eyebrow">CONCILIACIÓN CESI · NOVIEMBRE</p><h2>Ventas reportadas del equipo</h2><p>El reporte de CESI se carga desde Seguimiento de Ventas. Se identifican las ocho personas del equipo y se utiliza el precio al contado en USD.</p><p>El contrato permite omitir coincidencias en importaciones sucesivas. «Aprobado: No» se conserva como dato administrativo distinto de la venta reportada a supervisión.</p></section><section className="panel"><p className="eyebrow">VENTAS REALIZADAS</p><h2>Colocación del equipo · USD</h2><ul className="rate-history">{sales.map(sale => <li key={sale.id}><strong>{sale.advisor}</strong><span>{sale.project} · {sale.lots} lote · {money(sale.amountUsd)} · {sale.date ? sale.date.split('-').reverse().join('/') : 'Fecha de cierre por confirmar'}</span></li>)}</ul><details><summary>Reglas de productividad</summary><p>Incentivos de noviembre: 2 ventas realizadas o USD 18.000, con carpetas al día. Seguimiento: umbral heredado de USD 18.000. Las posibles ventas no se usan para calificar. El tipo de cambio se utiliza únicamente en las simulaciones de descuentos para el cliente.</p></details></section></div>
  </div>;
}
