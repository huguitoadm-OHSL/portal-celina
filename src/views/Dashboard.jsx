import React, { useState, useMemo } from 'react';
import { 
  Target, TrendingUp, Zap, Trophy, Rocket, 
  Activity, FileText, PhoneCall, Users, Flag, Sparkles, Medal
} from 'lucide-react';

export default function Dashboard() {
  // ================= BASE DE DATOS LOCAL (VENTAS DEL MES) =================
  // Aquí puedes ir agregando a los asesores a medida que cierren ventas
  const [asesoresData] = useState([
    { id: 1, nombre: 'MARISOL URGEL PIZARRO', ventas: 1, colocacion: 6300 },
    // Ej: { id: 2, nombre: 'DANIEL ANGULO', ventas: 2, colocacion: 15000 },
  ]);

  // ================= MOTOR MATEMÁTICO =================
  const ventasActuales = useMemo(() => asesoresData.reduce((sum, as) => sum + as.colocacion, 0), [asesoresData]);
  const totalCierres = useMemo(() => asesoresData.reduce((sum, as) => sum + as.ventas, 0), [asesoresData]);
  
  const metaMensual = 450000;
  const porcentajeAvance = (ventasActuales / metaMensual) * 100;

  const fD = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num || 0);

  // Ordenar asesores de mayor a menor colocación para el Podio
  const topAsesores = [...asesoresData].sort((a, b) => b.colocacion - a.colocacion).filter(a => a.colocacion > 0);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 font-sans space-y-6 pb-12">
      
      {/* ================= HERO SECTION (CABECERA PREMIUM) ================= */}
      <div className="bg-[#0f172a] rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-[10px] font-black tracking-[0.2em] uppercase rounded-full border border-blue-500/30 backdrop-blur-md">
              Portal de Liderazgo V2.5
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            Máquina de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Ventas</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-medium flex items-center">
            <Activity className="w-4 h-4 mr-2 text-emerald-400" />
            Ventas registradas: {totalCierres}. Sistema operando a máxima capacidad.
          </p>
        </div>

        <div className="relative z-10 mt-6 md:mt-0 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl text-center shadow-inner min-w-[160px]">
          <p className="text-[10px] text-blue-200 font-black tracking-widest uppercase mb-1">Avance Global</p>
          <p className="text-4xl font-black text-white">{porcentajeAvance.toFixed(2)}%</p>
        </div>
      </div>

      {/* ================= INDICADORES DE ESFUERZO ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="bg-indigo-50 p-3 rounded-xl"><FileText className="w-5 h-5 text-indigo-600" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Cotizaciones</p>
            <p className="text-lg font-black text-slate-800">142</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="bg-sky-50 p-3 rounded-xl"><PhoneCall className="w-5 h-5 text-sky-600" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Llamadas ATC</p>
            <p className="text-lg font-black text-slate-800">89</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="bg-emerald-50 p-3 rounded-xl"><Users className="w-5 h-5 text-emerald-600" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Visitas a Terreno</p>
            <p className="text-lg font-black text-slate-800">34</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="bg-amber-50 p-3 rounded-xl"><Zap className="w-5 h-5 text-amber-500" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Cierres en Puerta</p>
            <p className="text-lg font-black text-slate-800">{totalCierres}</p>
          </div>
        </div>
      </div>

      {/* ================= TARJETAS KPI PRINCIPALES ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* META */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Meta del Mes</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{fD(metaMensual)}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-2xl group-hover:scale-110 transition-transform"><Target className="w-6 h-6 text-blue-600" /></div>
          </div>
        </div>

        {/* COLOCACIÓN ACTUAL (Se ilumina en verde al romper el cero) */}
        <div className={`rounded-3xl p-6 shadow-lg relative overflow-hidden transition-all duration-700 ${ventasActuales > 0 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-none' : 'bg-slate-800 border border-slate-700'}`}>
          {ventasActuales > 0 && <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>}
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${ventasActuales > 0 ? 'text-emerald-100' : 'text-slate-400'}`}>Colocación Actual</p>
              <h3 className={`text-3xl font-black tracking-tight ${ventasActuales > 0 ? 'text-white' : 'text-slate-200'}`}>
                {fD(ventasActuales)}
              </h3>
            </div>
            <div className={`p-3 rounded-2xl ${ventasActuales > 0 ? 'bg-white/20 backdrop-blur-sm shadow-inner' : 'bg-white/5'}`}>
              <TrendingUp className={`w-6 h-6 ${ventasActuales > 0 ? 'text-white' : 'text-slate-500'}`} />
            </div>
          </div>
          {ventasActuales === 0 && (
            <p className="text-[10px] text-slate-500 mt-4 font-medium flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> Esperando el primer cierre...
            </p>
          )}
          {ventasActuales > 0 && (
            <div className="mt-4 inline-flex items-center px-2 py-1 bg-emerald-700/50 rounded-lg text-[10px] font-bold text-white border border-emerald-400/30">
              <Zap className="w-3 h-3 mr-1 text-yellow-300" /> ¡En Racha!
            </div>
          )}
        </div>

        {/* BRECHA (FALTA) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-500/5 rounded-tl-full pointer-events-none"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Terreno a Conquistar</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{fD(metaMensual - ventasActuales)}</h3>
            </div>
            <div className="bg-orange-50 p-3 rounded-2xl group-hover:rotate-12 transition-transform"><Flag className="w-6 h-6 text-orange-500" /></div>
          </div>
        </div>

      </div>

      {/* ================= SECCIÓN INFERIOR ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ENERGÍA DEL EQUIPO */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center mb-8">
            <Zap className="w-5 h-5 text-indigo-500 mr-2" />
            <h3 className="font-black text-slate-800 text-lg">Energía del Equipo</h3>
          </div>

          <div className="relative pt-6">
            <div className="flex mb-2 items-center justify-between">
              <div 
                className="absolute -top-4 transition-all duration-1000 ease-out"
                style={{ left: `calc(${Math.min(porcentajeAvance, 100)}% - 20px)` }}
              >
                <span className={`text-xs font-black inline-block py-1.5 px-3 uppercase rounded-xl text-white shadow-lg ${ventasActuales > 0 ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                  {porcentajeAvance.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-slate-100 shadow-inner relative">
              <div 
                style={{ width: `${Math.max(porcentajeAvance, 0)}%` }} 
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 z-10 ${ventasActuales > 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-indigo-500'}`}
              ></div>
              
              {ventasActuales === 0 && (
                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]"></div>
              )}
            </div>
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
              <span className={ventasActuales > 0 ? "text-emerald-600 font-black text-xs" : ""}>{fD(ventasActuales)}</span>
              <span className="uppercase">Meta: {fD(metaMensual)}</span>
            </div>
          </div>
        </div>

        {/* 🏆 PODIO DE CLASE MUNDIAL (DINÁMICO) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center mb-6">
            <Trophy className="w-5 h-5 text-amber-500 mr-2" />
            <h3 className="font-black text-slate-800 text-lg">Top Asesores del Mes</h3>
          </div>

          {topAsesores.length === 0 ? (
            // ESTADO VACÍO (Mes en Cero)
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-[#0f172a] to-indigo-950 rounded-2xl border border-indigo-500/20 shadow-inner relative overflow-hidden text-center group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.3)] group-hover:scale-110 transition-transform duration-500 relative z-10">
                <Rocket className="w-8 h-8 text-indigo-400 -translate-y-1 translate-x-0.5 group-hover:text-indigo-300" />
              </div>
              <h4 className="text-white font-black text-base md:text-lg tracking-wide mb-2 relative z-10">¡El podio está esperando!</h4>
              <p className="text-indigo-200/70 text-xs font-medium max-w-[250px] leading-relaxed relative z-10">La carrera por la cima acaba de comenzar. ¿Quién de ustedes dará el primer gran golpe?</p>
            </div>
          ) : (
            // ESTADO ACTIVO (Listado de Ganadores)
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 max-h-[250px]">
              {topAsesores.map((asesor, index) => {
                // Definir medallas por posición
                let badgeColor = "bg-slate-100 text-slate-500 border-slate-200";
                if (index === 0) badgeColor = "bg-gradient-to-tr from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/30 border-none";
                if (index === 1) badgeColor = "bg-gradient-to-tr from-slate-300 to-slate-400 text-white shadow-md border-none";
                if (index === 2) badgeColor = "bg-gradient-to-tr from-amber-700 to-amber-800 text-white shadow-md border-none";

                return (
                  <div key={asesor.id} className="flex items-center justify-between bg-slate-50 border border-slate-100/80 p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all group">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm mr-4 border ${badgeColor} transition-transform group-hover:scale-110`}>
                        {index === 0 ? <Medal className="w-5 h-5" /> : `#${index + 1}`}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-[11px] md:text-xs tracking-wide">{asesor.nombre}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{asesor.ventas} Venta(s) Registrada(s)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-lg ${index === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {fD(asesor.colocacion)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
