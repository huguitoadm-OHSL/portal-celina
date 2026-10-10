import { reportedSalesByProject } from '../utils/commercial';
import { REFERENCE_ADVISORS, REPORTED_SALES } from '../constants/commercialReference';
import React from 'react';
import { Target, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const PROYECTOS_ACTUALIZADOS = ['Muyurina', 'Renacer', 'Santa Fe', 'Rancho Nuevo', 'Jardines', 'Celina VII F3', 'Cañaveral'];

// Ventas reportadas por supervisión; no se escriben registros en el CRM.
const BASE_DE_DATOS_PBI = REFERENCE_ADVISORS.map(a => ({ nombre: a.nombre, colAct: a.actualBs, ventasReales: reportedSalesByProject(PROYECTOS_ACTUALIZADOS, REPORTED_SALES.filter(sale => sale.advisorId === a.id)), tipo: 'INTERNO' }));

export default function SeguimientoVentas() {
  const ventasPorProyecto = [0, 0, 0, 0, 0, 0, 0];

  const datosProcesados = BASE_DE_DATOS_PBI.map(asesor => {
    let totalVentas = 0;
    asesor.ventasReales.forEach((cant, i) => {
      ventasPorProyecto[i] += cant;
      totalVentas += cant;
    });

    let clusterInfo = { texto: 'Venta Cero', color: 'text-[var(--text-muted)] font-semibold' };
    if (asesor.colAct >= 18000) clusterInfo = { texto: 'Comisionan', color: 'text-emerald-600 font-bold' };
    else if (asesor.colAct > 0) clusterInfo = { texto: 'No Comisionan', color: 'text-amber-600 font-bold' };

    return {
      nombre: asesor.nombre, agencia: 'MONTERO', supervisor: 'OSCAR SARAVIA',
      ventas: totalVentas, colocacion: asesor.colAct, tipo: asesor.tipo,
      minima: 18000, cluster: clusterInfo
    };
  });

  const maxVentaProy = Math.max(...ventasPorProyecto, 0);

  // KPIS EXACTOS DEL PBI DE CELINA
  const totalAsesores = 7;
  const totalAntiguos = 7;

  const productivos = datosProcesados.filter(a => a.colocacion >= 18000).length;
  // Productividad calculada sobre la base de antiguos para igualar el 25% de Power BI
  const productividad = Math.round((productivos / totalAntiguos) * 100);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <p className="source-note">Ventas reportadas: Marisol, 1 lote en Los Jardines el 09/10/2026, USD 11.200. Colocación de este cuadro: referencia anterior en Bs, conservada sin reconvertir ni sumar nuevamente. Umbral heredado 18.000: moneda pendiente de confirmación.</p>
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center">
          <Target className="w-6 h-6 mr-2 text-indigo-600" /> Detalle de Asesor Mes en Curso
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* TARJETA ASESORES (DISEÑO PBI) */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-glow)] shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-[var(--text-muted)] mb-4 flex items-center"><Users className="w-4 h-4 mr-2"/> Asesores</p>
          <div className="grid grid-cols-4 divide-x divide-slate-100 text-center">
            <div><p className="text-3xl font-black text-[var(--text-primary)]">{totalAsesores}</p><p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase mt-1">Total</p></div>
            <div><p className="text-3xl font-black text-[var(--text-primary)]">{totalAntiguos}</p><p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase mt-1">Antiguos</p></div>
          </div>
          <div className="mt-5 pt-4 border-t border-[var(--border-glow)] grid grid-cols-2 divide-x divide-slate-100 text-center">
            <div><p className="text-2xl font-black text-[var(--text-primary)]">{productivos}</p><p className="text-[10px] text-[var(--text-muted)] font-bold uppercase mt-1">Productivos</p></div>
            <div><p className="text-2xl font-black text-emerald-600">{productividad}%</p><p className="text-[10px] text-emerald-500/70 font-bold uppercase mt-1">Productividad Cluster</p></div>
          </div>
        </div>

        {/* TARJETA VENTAS ACUMULADAS */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-glow)] shadow-sm flex flex-col justify-between">
          <p className="text-sm font-bold text-[var(--text-primary)] flex items-center mb-4"><Target className="w-4 h-4 mr-2 text-emerald-500"/> Ventas Acumuladas</p>
          <div className="space-y-3.5 w-full">
            {PROYECTOS_ACTUALIZADOS.map((nombre, i) => (
              <div key={i} className="flex items-center text-xs">
                <span className="w-24 font-semibold text-[var(--text-muted)] truncate">{nombre}</span>
                <div className="flex-1 h-2.5 bg-[var(--bg-card-inner)] rounded-full mx-3 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: `${maxVentaProy > 0 ? (ventasPorProyecto[i] / maxVentaProy) * 100 : 0}%` }}></div>
                </div>
                <span className="w-6 text-right font-bold text-[var(--text-primary)]">{ventasPorProyecto[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-glow)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[var(--bg-card-inner)] border-b border-[var(--border-glow)] text-[var(--text-primary)]">
                <th className="p-3 font-bold uppercase tracking-wider">Asesor</th>
                <th className="p-3 font-bold uppercase tracking-wider text-center">Agencia</th>
                <th className="p-3 font-bold uppercase tracking-wider text-center">Supervisor</th>
                <th className="p-3 font-black uppercase tracking-wider text-center bg-[var(--bg-card-inner)] border-b border-[var(--border-glow)]">Ventas</th>
                <th className="p-3 font-bold uppercase tracking-wider text-right">Colocación ▼</th>
                <th className="p-3 font-bold uppercase tracking-wider text-center">Tipo Asesor</th>
                <th className="p-3 font-bold uppercase tracking-wider text-right">Venta Minima</th>
                <th className="p-3 font-bold uppercase tracking-wider text-center">Cluster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {datosProcesados.map((asesor, index) => (
                <tr key={index} className="hover:bg-[var(--bg-card-inner)] transition-colors">
                  <td className="p-3 text-[var(--text-secondary)] font-semibold">{asesor.nombre}</td>
                  <td className="p-3 text-[var(--text-muted)] text-center">{asesor.agencia}</td>
                  <td className="p-3 text-[var(--text-muted)] text-center">{asesor.supervisor}</td>
                  <td className="p-3 text-[var(--text-primary)] font-black text-center text-sm bg-[var(--bg-card-inner)]">{asesor.ventas}</td>
                  <td className="p-3 text-sky-700 font-bold text-right">{formatCurrency(asesor.colocacion)}</td>
                  <td className="p-3 text-[var(--text-secondary)] text-center font-medium">{asesor.tipo}</td>
                  <td className="p-3 text-[var(--text-muted)] text-right">{formatCurrency(asesor.minima)}</td>
                  <td className={`p-3 text-center ${asesor.cluster.color}`}>{asesor.cluster.texto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


