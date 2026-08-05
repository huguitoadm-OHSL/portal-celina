import React, { useState, useMemo } from 'react';
import { 
  Target, TrendingUp, Zap, Trophy, Rocket, 
  Activity, FileText, PhoneCall, Users, Flag, Sparkles, Medal, Crown
} from 'lucide-react';

export default function Dashboard() {
  // ================= BASE DE DATOS LOCAL (VENTAS DEL MES) =================
  const [asesoresData] = useState([
    { id: 1, nombre: 'MARISOL URGEL PIZARRO', ventas: 1, colocacion: 6300 },
  ]);

  // ================= MOTOR MATEMÁTICO =================
  const ventasActuales = useMemo(() => asesoresData.reduce((sum, as) => sum + as.colocacion, 0), [asesoresData]);
  const totalCierres = useMemo(() => asesoresData.reduce((sum, as) => sum + as.ventas, 0), [asesoresData]);
  
  const metaMensual = 450000;
  const porcentajeAvance = (ventasActuales / metaMensual) * 100;

  const fD = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num || 0);

  // Ordenar asesores de mayor a menor colocación
  const topAsesores = [...asesoresData].sort((a, b) => b.colocacion - a.colocacion).filter(a => a.colocacion > 0);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 font-sans space-y-6 pb-12 antialiased">
      
      {/* ================= HERO SECTION (ILUMINACIÓN DRAMÁTICA Y NEONES) ================= */}
      <div className="bg-[#090e17] rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center border border-white/5 group">
        {/* Luces cinematográficas de fondo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/4 transition-transform duration-1000 group-hover:bg-blue-500/20"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Patrón de malla cybertech sutil */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <span className="px-3.5 py-1.5 bg-blue-900/40 text-blue-300 text-[9px] font-black tracking-[0.25em] uppercase rounded-full border border-blue-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              Portal de Liderazgo V2.5
            </span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-3 drop-shadow-xl">
            Máquina de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 animate-gradient-x">Ventas</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-medium flex items-center bg-slate-900/50 w-fit px-4 py-2 rounded-xl border border-white/5 backdrop-blur-sm">
            <Activity className="w-4 h-4 mr-2 text-emerald-400" />
            <span className="text-emerald-300 font-bold mr-1">{totalCierres} Cierre(s)</span> registrado(s). Sistema operando a máxima capacidad.
          </p>
        </div>

        <div className="relative z-10 mt-8 md:mt-0 bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] text-center shadow-[0_8px_32px_rgba(0,0,0,0.2)] min-w-[180px] hover:bg-white/10 transition-colors duration-500">
          <p className="text-[10px] text-blue-200/80 font-black tracking-widest uppercase mb-2">Avance Global</p>
          <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 drop-shadow-lg">
            {porcentajeAvance.toFixed(2)}<span className="text-2xl text-slate-400">%</span>
          </p>
        </div>
      </div>

      {/* ================= INDICADORES DE ESFUERZO (GLASSMORPHISM Y HOVER FLOTANTE) ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {[
          { icon: FileText, label: 'Cotizaciones', val: '142', color: 'indigo' },
          { icon: PhoneCall, label: 'Llamadas ATC', val: '89', color: 'sky' },
          { icon: Users, label: 'Visitas a Terreno', val: '34', color: 'emerald' },
          { icon: Zap, label: 'Cierres en Puerta', val: totalCierres, color: 'amber' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] p-5 border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center space-x-4 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] hover:bg-white transition-all duration-300 group">
            <div className={`bg-${item.color}-50/80 p-3.5 rounded-2xl border border-${item.color}-100 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
              <item.icon className={`w-5 h-5 text-${item.color}-600`} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
              <p className="text-xl font-black text-slate-800 tracking-tight">{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= TARJETAS KPI PRINCIPALES (SOMBRAS PROFUNDAS) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        
        {/* META */}
        <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_15px_50px_rgba(0,0,0,0.06)] transition-all duration-500">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Meta del Mes</p>
              <h3 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tighter">{fD(metaMensual)}</h3>
            </div>
            <div className="bg-blue-50/80 p-3.5 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-blue-100 shadow-inner">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* COLOCACIÓN ACTUAL (VIBRANTE Y ENERGÉTICO) */}
        <div className={`rounded-[2rem] p-7 shadow-[0_20px_50px_rgba(16,185,129,0.3)] relative overflow-hidden transition-all duration-700 hover:-translate-y-1 ${ventasActuales > 0 ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-700 border border-emerald-400/50' : 'bg-slate-800 border border-slate-700'}`}>
          {ventasActuales > 0 && <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl opacity-70 mix-blend-overlay"></div>}
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 drop-shadow-sm ${ventasActuales > 0 ? 'text-emerald-50' : 'text-slate-400'}`}>Colocación Actual</p>
              <h3 className={`text-3xl lg:text-4xl font-black tracking-tighter drop-shadow-md ${ventasActuales > 0 ? 'text-white' : 'text-slate-200'}`}>
                {fD(ventasActuales)}
              </h3>
            </div>
            <div className={`p-3.5 rounded-2xl border ${ventasActuales > 0 ? 'bg-white/20 backdrop-blur-md border-white/30 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]' : 'bg-white/5 border-white/5'}`}>
              <TrendingUp className={`w-6 h-6 ${ventasActuales > 0 ? 'text-white drop-shadow-lg' : 'text-slate-500'}`} />
            </div>
          </div>
          {ventasActuales === 0 && (
            <p className="text-[10px] text-slate-500 mt-5 font-medium flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> Esperando el primer cierre...
            </p>
          )}
          {ventasActuales > 0 && (
            <div className="mt-5 inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black text-white border border-white/30 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
              <Zap className="w-3.5 h-3.5 mr-1.5 text-yellow-300 drop-shadow-[0_0_5px_rgba(253,224,71,0.8)] fill-yellow-300/20" /> ¡En Racha de Ventas!
            </div>
          )}
        </div>

        {/* BRECHA (FALTA) */}
        <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_15px_50px_rgba(0,0,0,0.06)] transition-all duration-500">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-50 rounded-full blur-2xl group-hover:bg-orange-100 transition-colors"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Terreno a Conquistar</p>
              <h3 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tighter">{fD(metaMensual - ventasActuales)}</h3>
            </div>
            <div className="bg-orange-50/80 p-3.5 rounded-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 border border-orange-100 shadow-inner">
              <Flag className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>

      </div>

      {/* ================= SECCIÓN INFERIOR ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
        
        {/* ENERGÍA DEL EQUIPO */}
        <div className="bg-white rounded-[2rem] p-7 md:p-9 border border-slate-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col justify-center">
          <div className="flex items-center mb-10">
            <div className="bg-indigo-50 p-2 rounded-lg mr-3 border border-indigo-100">
               <Zap className="w-5 h-5 text-indigo-600 fill-indigo-600/10" />
            </div>
            <h3 className="font-black text-slate-800 text-lg md:text-xl tracking-tight">Energía del Equipo</h3>
          </div>

          <div className="relative pt-6">
            <div className="flex mb-3 items-center justify-between relative">
              <div 
                className="absolute -top-11 transition-all duration-1000 ease-out z-20"
                style={{ left: `calc(${Math.min(Math.max(porcentajeAvance, 5), 95)}% - 24px)` }}
              >
                <span className={`text-[10px] font-black inline-flex items-center justify-center py-2 px-3.5 uppercase rounded-xl text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] backdrop-blur-md border border-white/10 ${ventasActuales > 0 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-slate-800'}`}>
                  {porcentajeAvance.toFixed(2)}%
                </span>
                {/* Flechita del tooltip */}
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${ventasActuales > 0 ? 'bg-emerald-600' : 'bg-slate-800'}`}></div>
              </div>
            </div>
            
            <div className="overflow-hidden h-4 md:h-5 mb-4 flex rounded-full bg-slate-100 shadow-inner relative border border-slate-200/50">
              <div 
                style={{ width: `${Math.max(porcentajeAvance, 0)}%` }} 
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-out z-10 relative ${ventasActuales > 0 ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500' : 'bg-indigo-500'}`}
              >
                {/* Brillo interno de la barra */}
                <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-white/30 to-transparent"></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className={ventasActuales > 0 ? "text-emerald-600/90 text-xs" : ""}>{fD(ventasActuales)}</span>
              <span>Meta: {fD(metaMensual)}</span>
            </div>
          </div>
        </div>

        {/* 🏆 PODIO DE CLASE MUNDIAL CON DORADOS SOFISTICADOS */}
        <div className="bg-white rounded-[2rem] p-7 md:p-9 border border-slate-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex items-center mb-7">
            <div className="bg-amber-50 p-2 rounded-lg mr-3 border border-amber-100">
               <Trophy className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            </div>
            <h3 className="font-black text-slate-800 text-lg md:text-xl tracking-tight">Top Asesores del Mes</h3>
          </div>

          {topAsesores.length === 0 ? (
            // ESTADO VACÍO
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-[#0f172a] to-indigo-950 rounded-3xl border border-indigo-500/20 shadow-inner relative overflow-hidden text-center group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.3)] group-hover:scale-110 transition-transform duration-700 relative z-10">
                <Rocket className="w-8 h-8 text-indigo-400 -translate-y-1 translate-x-0.5 group-hover:text-indigo-300" />
              </div>
              <h4 className="text-white font-black text-lg tracking-wide mb-2 relative z-10">¡El podio está esperando!</h4>
              <p className="text-indigo-200/70 text-xs font-medium max-w-[250px] leading-relaxed relative z-10">La carrera acaba de comenzar. ¿Quién de ustedes dará el primer gran golpe?</p>
            </div>
          ) : (
            // ESTADO ACTIVO (Listado de Ganadores VIP)
            <div className="flex-1 space-y-3.5 overflow-y-auto custom-scrollbar pr-2 max-h-[280px]">
              {topAsesores.map((asesor, index) => {
                const isPrimerLugar = index === 0;
                
                return (
                  <div key={asesor.id} className={`flex items-center justify-between p-4 md:p-5 rounded-2xl transition-all duration-300 group ${
                    isPrimerLugar 
                      ? 'bg-gradient-to-r from-amber-50/50 to-white border border-amber-200/60 shadow-[0_8px_20px_rgba(245,158,11,0.08)] hover:shadow-[0_12px_25px_rgba(245,158,11,0.12)] hover:-translate-y-0.5' 
                      : 'bg-slate-50/80 border border-slate-100 hover:bg-white hover:shadow-md hover:-translate-y-0.5'
                  }`}>
                    <div className="flex items-center">
                      <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm mr-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                        isPrimerLugar 
                          ? 'bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-yellow-200' 
                          : 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500 border border-slate-100'
                      }`}>
                        {isPrimerLugar ? (
                          <>
                            <Crown className="w-6 h-6 drop-shadow-md" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75"></div>
                          </>
                        ) : (
                          `#${index + 1}`
                        )}
                      </div>
                      <div>
                        <h4 className={`font-black text-xs md:text-sm tracking-wide ${isPrimerLugar ? 'text-slate-800' : 'text-slate-700'}`}>
                          {asesor.nombre}
                        </h4>
                        <p className={`text-[9px] md:text-[10px] font-black uppercase mt-1 tracking-widest ${isPrimerLugar ? 'text-amber-600/80' : 'text-slate-400'}`}>
                          {asesor.ventas} Venta(s) Registrada(s)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-xl md:text-2xl tracking-tighter ${isPrimerLugar ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 drop-shadow-sm' : 'text-slate-700'}`}>
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
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
