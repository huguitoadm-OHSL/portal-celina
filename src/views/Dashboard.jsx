import React, { useState, useMemo } from 'react';
import { 
  Target, TrendingUp, Zap, Trophy, Activity, FileText, PhoneCall, Users, Crown
} from 'lucide-react';

export default function Dashboard() {
  const [asesoresData] = useState([
    { id: 1, nombre: 'Carlos Enrique Calderon', ventas: 0, colocacion: 0 },
    { id: 2, nombre: 'Ely Gonzales Garcia', ventas: 0, colocacion: 0 },
    { id: 3, nombre: 'Jaime Fabricio Rios', ventas: 0, colocacion: 0 },
    { id: 4, nombre: 'Jimmy Gonzales Nuñez', ventas: 0, colocacion: 0 },
    { id: 5, nombre: 'Jose Gabriel Padilla', ventas: 0, colocacion: 0 },
    { id: 6, nombre: 'Marisol Urgel Pizarro', ventas: 0, colocacion: 0 },
    { id: 7, nombre: 'Merly Mendez Hurtado', ventas: 0, colocacion: 0 },
  ]);

  const ventasActuales = useMemo(() => asesoresData.reduce((sum, as) => sum + as.colocacion, 0), [asesoresData]);
  const totalCierres = useMemo(() => asesoresData.reduce((sum, as) => sum + as.ventas, 0), [asesoresData]);
  
  const metaMensual = 111000;
  const porcentajeAvance = (ventasActuales / metaMensual) * 100;

  const fD = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num || 0);

  return (
    <div className="w-full font-sans space-y-6 pb-12 antialiased">
      {/* HERO SECTION DE IMPACTO CÓSMICO */}
      <div className="bg-[#070e1c] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center border border-[#14233c]">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[110px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2.5 mb-3">
            <span className="px-3 py-1 bg-cyan-950/80 text-cyan-300 text-[10px] font-black tracking-widest uppercase rounded-full border border-cyan-500/40">
              Portal de Liderazgo • Octubre 2026
            </span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Máquina de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Ventas</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium flex items-center bg-[#050b18] w-fit px-3.5 py-1.5 rounded-xl border border-[#14233c]">
            <Activity className="w-4 h-4 mr-2 text-emerald-400" />
            <span className="text-emerald-300 font-bold mr-1">{totalCierres} Cierre(s)</span> registrados en el ciclo de recuperación.
          </p>
        </div>

        <div className="relative z-10 mt-6 md:mt-0 bg-[#050b18]/80 border border-[#1e3a5f] p-5 rounded-2xl text-center shadow-xl min-w-[170px] w-full md:w-auto">
          <p className="text-[10px] text-cyan-400 font-black tracking-widest uppercase mb-1">Avance Global</p>
          <p className="text-4xl sm:text-5xl font-black text-white font-mono">
            {porcentajeAvance.toFixed(1)}<span className="text-2xl text-slate-400">%</span>
          </p>
        </div>
      </div>

      {/* 4 INDICADORES TÁCTICOS EN MODO OSCURO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: FileText, label: 'Cotizaciones Activas', val: '142', color: 'cyan' },
          { icon: PhoneCall, label: 'Llamadas ATC', val: '89', color: 'blue' },
          { icon: Users, label: 'Visitas a Terreno', val: '34', color: 'emerald' },
          { icon: Zap, label: 'Cierres en Puerta', val: totalCierres, color: 'amber' }
        ].map((item, idx) => (
          <div key={idx} className="bg-[#070e1c] border border-[#14233c] rounded-2xl p-4 flex items-center space-x-3.5 shadow-lg">
            <div className="bg-[#050b18] border border-[#1e3a5f] p-3 rounded-xl text-cyan-400 shrink-0">
              <item.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
              <p className="text-lg sm:text-xl font-black text-white">{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* METAS Y COLOCACIÓN (ELIMINADAS LAS TARJETAS BLANCAS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meta del Mes */}
        <div className="bg-[#070e1c] rounded-3xl p-6 border border-[#14233c] shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Meta del Mes de Octubre</p>
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">{fD(metaMensual)}</h3>
              <p className="text-xs text-slate-400 mt-2">Objetivo de equipo (7 Asesores Comerciales)</p>
            </div>
            <div className="bg-[#050b18] border border-[#1e3a5f] p-3 rounded-2xl text-cyan-400">
              <Target className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Colocación Actual */}
        <div className="bg-[#070e1c] rounded-3xl p-6 border border-emerald-500/40 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Colocación Actual</p>
              <h3 className="text-3xl sm:text-4xl font-black text-emerald-300 tracking-tight font-mono">{fD(ventasActuales)}</h3>
              <p className="text-xs text-slate-400 mt-2">Ventas consolidadas en sistema</p>
            </div>
            <div className="bg-[#04241b] border border-emerald-500/50 p-3 rounded-2xl text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
