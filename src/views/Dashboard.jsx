import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatters';
import { OBJETIVOS_MENSUALES, EQUIPOS_ASESORES } from '../constants/equipo';
import { DATA_VERSION } from '../constants/config';

export default function Dashboard() {
  const [globalStats, setGlobalStats] = useState({ goal: 0, actual: 0, teams: [] });

  useEffect(() => {
    let tGoal = 0;
    let tAct = 0;
    let tTeams = [];

    Object.keys(OBJETIVOS_MENSUALES).forEach(team => {
      let teamGoal = OBJETIVOS_MENSUALES[team] || 0;
      let teamAct = 0;
      
      try {
        const teamSaved = localStorage.getItem(`portalAsesores_proyeccion_${team}`);
        if (teamSaved && localStorage.getItem('portalAsesores_dataVersion') === DATA_VERSION) {
          const tData = JSON.parse(teamSaved);
          teamGoal = typeof tData.objetivoMensual === 'number' ? tData.objetivoMensual : teamGoal;
          if (Array.isArray(tData.asesores)) {
            teamAct = tData.asesores.reduce((sum, a) => {
              const sumDias = Array.isArray(a.dias) ? a.dias.reduce((d1, d2) => d1 + d2, 0) : 0;
              return sum + (Number(a.colAct) || 0) + sumDias;
            }, 0);
          }
        } else if (EQUIPOS_ASESORES[team]) {
          teamAct = EQUIPOS_ASESORES[team].reduce((sum, a) => sum + (Number(a.colAct) || 0), 0);
        }
      } catch (e) {}

      tGoal += teamGoal;
      tAct += teamAct;
      tTeams.push({ 
        name: String(team), 
        goal: Number(teamGoal) || 0, 
        actual: Number(teamAct) || 0, 
        percent: teamGoal > 0 ? (teamAct / teamGoal) * 100 : 0 
      });
    });

    tTeams.sort((a, b) => b.percent - a.percent);
    setGlobalStats({ goal: tGoal, actual: tAct, teams: tTeams });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center justify-center px-3 py-1 mb-3 text-xs font-bold tracking-wide text-indigo-600 bg-indigo-100 rounded-full">PORTAL V2.0</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Panel de Control Global</h2>
            <p className="text-slate-500 mt-2">Visión en tiempo real de la proyección de ventas de todos los equipos.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm min-w-[200px]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avance Global</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-indigo-600">{globalStats.goal > 0 ? (globalStats.actual / globalStats.goal * 100).toFixed(1) : 0}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-bold text-slate-500 mb-1">Meta Global</p>
            <p className="text-2xl font-black text-slate-800">${formatCurrency(globalStats.goal)}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-l-emerald-500">
            <p className="text-sm font-bold text-slate-500 mb-1">Colocación Actual</p>
            <p className="text-2xl font-black text-emerald-600">${formatCurrency(globalStats.actual)}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-l-amber-500">
            <p className="text-sm font-bold text-slate-500 mb-1">Brecha (Falta)</p>
            <p className="text-2xl font-black text-amber-600">${formatCurrency(Math.max(0, globalStats.goal - globalStats.actual))}</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-md shadow-indigo-200 flex flex-col justify-center text-white">
            <p className="text-sm font-bold text-indigo-200 mb-1">Total Equipos</p>
            <p className="text-2xl font-black">{String(globalStats.teams.length)}</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Rendimiento por Equipo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto pr-2 pb-4">
          {globalStats.teams.map((t, idx) => (
            <div key={t.name} className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-slate-700 flex items-center">
                  <span className="w-6 h-6 rounded bg-slate-200 text-slate-500 flex items-center justify-center text-xs mr-2">{idx + 1}</span>
                  {String(t.name)}
                </span>
                <span className="text-xs font-bold bg-white px-2 py-1 rounded text-slate-600 shadow-sm">{t.percent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden">
                <div className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(t.percent, 100)}%` }}></div>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Actual: ${formatCurrency(t.actual)}</span>
                <span>Meta: ${formatCurrency(t.goal)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
