import { useCommercial } from '../hooks/useCommercial';
import { PROJECT_PROJECTION } from '../constants/commercialReference';
import React, { useState } from 'react';
import { BarChart, ShieldCheck } from 'lucide-react';
import { ResultCard } from '../components/ui/ResultCard';
import { formatDiaMes, formatCurrency } from '../utils/formatters';
import { obtenerDatosSupervisor } from '../utils/calculadoras';
import { generarTextoProyeccionCelular } from '../utils/textTemplates';
import { generarHtmlProyeccion } from '../utils/htmlTemplates';
import { SUPERVISORES } from '../constants/equipo';

const PROYECTOS_ACTUALIZADOS = ['Muyurina', 'Renacer', 'Santa Fe', 'Rancho Nuevo', 'Jardines', 'Celina VII F3', 'Cañaveral'];

export default function ProyeccionSemanal() {
  const [supervisorDestino, setSupervisorDestino] = useState('mreyes@celina.com.bo');

  const { advisors, targetUsd, setTargetUsd, updateProjection } = useCommercial();
  const [settings, setSettings] = useState({ equipo: 'Oscar Saravia', fechaInicio: '2026-10-05' });
  const formProyeccion = { ...settings, objetivoMensual: targetUsd, asesores: advisors.map(advisor => ({ ...advisor, colAct: advisor.actualUsd, dias: advisor.days, proy: advisor.projectedLots })) };

  const handleLocalArrayChange = (idx, type, arrIdx, val) => {
    const advisor = advisors[idx];
    const values = [...(type === 'dias' ? advisor.days : advisor.projectedLots)];
    values[arrIdx] = Math.max(0, type === 'proy' ? Math.floor(Number(val) || 0) : Number(val) || 0);
    if (type === 'dias') updateProjection(advisor.id, values.reduce((sum, amount) => sum + amount, 0), values, advisor.projectedLots);
    else updateProjection(advisor.id, advisor.projectionUsd, advisor.days, values);
  };
  const handleParamChange = (field, val) => {
    if (field === 'objetivoMensual') setTargetUsd(val);
    else setSettings(previous => ({ ...previous, [field]: val }));
  };

  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);

  // CÁLCULO DE TOTALES EN TIEMPO REAL
  const totalColocacion = formProyeccion.asesores.reduce((acc, a) => acc + (a.colAct || 0), 0);
  const totalesDias = [0,1,2,3,4,5,6].map(dIdx => formProyeccion.asesores.reduce((acc, a) => acc + (a.dias[dIdx] || 0), 0));
  const totalesProy = [0,1,2,3,4,5,6].map(pIdx => formProyeccion.asesores.reduce((acc, a) => acc + (a.proy[pIdx] || 0), 0));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

      <p className="source-note">Importes en USD. Colocación actual: solo ventas realizadas, compartidas con Inicio, Seguimiento e Incentivos. Puede editar las posibles ventas y su proyección; no modificarán la colocación realizada. La distribución diaria e individual de proyectos está pendiente.</p>
      <div className="panel mb-6"><strong>7 lotes proyectados:</strong> {Object.entries(PROJECT_PROJECTION).map(([p, n]) => `${p}: ${n}`).join(' · ')}</div>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center">
            <BarChart className="w-6 h-6 mr-2 text-cyan-400" /> Proyección Semanal
            <span className="ml-3 text-xs font-bold flex items-center px-2 py-1 rounded border bg-[var(--bg-card-inner)] text-indigo-700 border-indigo-200">
              <ShieldCheck className="w-4 h-4 mr-1"/> Referencia de supervisión
            </span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 w-full">
        <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-glow)] overflow-hidden flex flex-col w-full min-w-0">
          <div className="p-4 border-b border-[var(--border-glow)] flex flex-wrap gap-4 bg-[var(--bg-card-inner)] items-center w-full">
            <div className="w-full sm:w-40">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase">Semana del (Lunes)</label>
              <input type="date" value={formProyeccion.fechaInicio} onChange={(e) => handleParamChange('fechaInicio', e.target.value)} className="w-full px-3 py-1.5 mt-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="w-full sm:w-40">
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase">Objetivo Mes USD</label>
              <input type="number" value={formProyeccion.objetivoMensual} onChange={(e) => handleParamChange('objetivoMensual', parseFloat(e.target.value) || 0)} className="w-full px-3 py-1.5 mt-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap">
              <thead>
                <tr>
                  <th rowSpan="2" className="bg-[var(--bg-card)] text-[var(--text-primary)] p-2 border border-[var(--border-highlight)]">Asesor</th>
                  <th rowSpan="2" className="bg-[var(--bg-card)] text-[var(--text-primary)] p-2 border border-[var(--border-highlight)] text-center">Coloc. Actual USD</th>
                  <th rowSpan="2" className="p-2 border border-[var(--border-highlight)] text-center">Ventas realizadas</th>
                  <th rowSpan="2" className="p-2 border border-[var(--border-highlight)] text-center">Proyección USD</th>
                  <th colSpan="7" className="bg-[var(--bg-card-inner)] text-[var(--text-primary)] p-2 border border-[var(--border-highlight)] text-center uppercase">Proyección Diaria</th>
                  <th colSpan="7" className="bg-[var(--bg-card-hover)] text-sky-800 p-2 border border-[var(--border-highlight)] text-center uppercase">Proyectos (Posibles Ventas)</th>
                </tr>
                <tr>
                  {[0,1,2,3,4,5,6].map(d => <th key={d} className="bg-[var(--bg-card)] text-[var(--text-secondary)] p-2 border border-[var(--border-highlight)] text-center">{formatDiaMes(formProyeccion.fechaInicio, d)}</th>)}
                  {PROYECTOS_ACTUALIZADOS.map(p => <th key={p} className="bg-[var(--bg-card-hover)] text-sky-700 p-2 border border-[var(--border-highlight)] text-center">{p.substring(0,6)}.</th>)}
                </tr>
              </thead>
              <tbody>
                {formProyeccion.asesores.map((asesor, i) => (
                  <tr key={i} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                    <td className="p-2 border border-[var(--border-highlight)] font-bold text-[var(--text-primary)] truncate max-w-[130px]">{i+1}. {asesor.nombre}</td>
                    <td className="p-2 border border-[var(--border-highlight)] font-black text-emerald-700 text-right bg-[var(--bg-card-inner)]">
                      USD {asesor.colAct > 0 ? formatCurrency(asesor.colAct) : '0'}
                    </td>
                    <td className="p-2 border border-[var(--border-highlight)] text-center">{asesor.confirmedSales}</td>
                    <td className="p-2 border border-[var(--border-highlight)]"><input aria-label={`Proyección semanal ${asesor.nombre}`} type="number" min="0" step="0.01" value={asesor.projectionUsd} onChange={e => updateProjection(asesor.id, Math.max(0, Number(e.target.value) || 0))} className="w-24 p-1 rounded"/></td>
                    {asesor.dias.map((d, dIdx) => (
                      <td key={dIdx} className="p-1 border border-[var(--border-highlight)]">
                        <input type="number" value={d === 0 ? '' : d} onChange={(e) => handleLocalArrayChange(i, 'dias', dIdx, e.target.value)} className="w-full min-w-[30px] p-1 text-center bg-transparent outline-none focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-blue-400 rounded transition-all" placeholder="-" />
                      </td>
                    ))}
                    {asesor.proy.map((p, pIdx) => (
                      <td key={pIdx} className="p-1 border border-[var(--border-highlight)] bg-[var(--bg-card-hover)]">
                        <input type="number" value={p === 0 ? '' : p} onChange={(e) => handleLocalArrayChange(i, 'proy', pIdx, e.target.value)} className="w-full min-w-[30px] p-1 text-center font-bold text-sky-700 bg-transparent outline-none focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-sky-400 rounded transition-all" placeholder="0" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {/* FILA DE TOTALES DINÁMICOS */}
              <tfoot>
                <tr className="bg-[var(--bg-card-inner)] font-black text-[var(--text-primary)] border-t-2 border-[var(--border-highlight)]">
                  <td className="p-2 text-right uppercase text-xs" colSpan="1">Totales Globales</td>
                  <td className="p-2 text-right text-emerald-700">USD {formatCurrency(totalColocacion)}</td>
                  <td className="p-2 text-center">{advisors.reduce((sum, advisor) => sum + advisor.confirmedSales, 0)}</td>
                  <td className="p-2 text-right">USD {formatCurrency(formProyeccion.asesores.reduce((sum, a) => sum + a.projectionUsd, 0))}</td>
                  {totalesDias.map((tot, i) => (
                    <td key={i} className="p-2 text-center text-[var(--text-primary)]">{tot > 0 ? 'USD '+formatCurrency(tot) : '-'}</td>
                  ))}
                  {totalesProy.map((tot, i) => (
                    <td key={i} className="p-2 text-center text-sky-700">{tot > 0 ? tot : '-'}</td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="w-full min-w-0 flex flex-col h-full">
          <ResultCard title="Proyección Semanal" text={generarTextoProyeccionCelular(formProyeccion, supervisorData)} htmlContent={generarHtmlProyeccion(formProyeccion, supervisorData)} subject={`Proyección Semanal Equipo`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
        </div>
      </div>
    </div>
  );
}


