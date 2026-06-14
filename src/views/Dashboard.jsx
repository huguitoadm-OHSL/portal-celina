import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Trophy, Zap, Crown, AlertCircle, Medal } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { OBJETIVOS_MENSUALES } from '../constants/equipo';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Dashboard() {
  // CARGA OPTIMISTA: Lee de la memoria al milisegundo para no dejar en blanco la pantalla
  const [stats, setStats] = useState(() => {
    const cached = localStorage.getItem('dashboard_cache');
    return cached ? JSON.parse(cached) : { meta: 0, actual: 0, topAsesores: [], avance: 0, brecha: 0 };
  });

  useEffect(() => {
    let metaTotal = 0;
    Object.keys(OBJETIVOS_MENSUALES).forEach(equipo => metaTotal += OBJETIVOS_MENSUALES[equipo]);

    // ONSNAPSHOT: Mantendrá sincronizado el Dashboard en segundo plano sin congelar la app
    const unsubscribe = onSnapshot(collection(db, "proyecciones"), (querySnapshot) => {
      let actualTotal = 0;
      let todosLosAsesores = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data && data.asesores) {
          data.asesores.forEach(a => {
            const col = Number(a.colAct) || 0;
            actualTotal += col;
            if (col > 0) todosLosAsesores.push({ nombre: a.nombre, venta: col });
          });
        }
      });

      const top5 = todosLosAsesores.sort((a, b) => b.venta - a.venta).slice(0, 5);
      const avanceCalc = metaTotal > 0 ? (actualTotal / metaTotal) * 100 : 0;
      const brechaCalc = Math.max(metaTotal - actualTotal, 0);

      const newStats = { meta: metaTotal, actual: actualTotal, topAsesores: top5, avance: avanceCalc, brecha: brechaCalc };
      
      setStats(newStats);
      localStorage.setItem('dashboard_cache', JSON.stringify(newStats)); // Actualiza la caché silenciosamente
    }, (error) => {
      console.error("Error al sincronizar Dashboard:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-slate-900 via-[#002060] to-blue-900 rounded-2xl p-8 mb-8 shadow-lg text-white flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4"><Zap size={250} /></div>
        <div className="relative z-10">
          <p className="text-blue-200 font-bold tracking-wider text-sm mb-1 uppercase">Portal de Liderazgo v2.5</p>
          <h2 className="text-3xl md:text-4xl font-black mb-2">Máquina de Ventas</h2>
          <p className="text-slate-300 max-w-xl">Base de datos en la nube activada. Sincronización en segundo plano fluida y sin interrupciones.</p>
        </div>
        <div className="mt-6 md:mt-0 relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center min-w-[160px]">
          <p className="text-xs text-blue-200 uppercase font-bold tracking-wider mb-1">Avance Global</p>
          <p className="text-4xl font-black text-white">{stats.avance.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center group hover:shadow-md transition-all">
          <div className="bg-blue-100 p-4 rounded-xl text-blue-600 mr-5 group-hover:scale-110 transition-transform"><Target size={32} /></div>
          <div><p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Meta del Mes</p><p className="text-2xl font-black text-slate-800">$ {formatCurrency(stats.meta)}</p></div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl p-6 shadow-md flex items-center text-white transform hover:-translate-y-1 transition-transform">
          <div className="bg-white/20 p-4 rounded-xl mr-5 backdrop-blur-sm"><TrendingUp size={32} className="text-white" /></div>
          <div><p className="text-sm font-bold text-emerald-50 uppercase tracking-wide">Colocación Actual</p><p className="text-3xl font-black">$ {formatCurrency(stats.actual)}</p></div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center group hover:shadow-md transition-all">
          <div className="bg-amber-100 p-4 rounded-xl text-amber-600 mr-5 group-hover:scale-110 transition-transform"><AlertCircle size={32} /></div>
          <div><p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Brecha (Falta)</p><p className="text-2xl font-black text-amber-600">$ {formatCurrency(stats.brecha)}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 flex items-center mb-8"><Zap className="w-5 h-5 mr-2 text-blue-600" /> Energía del Equipo</h3>
          <div className="relative pt-8 pb-4">
            <div className="absolute top-0 transform -translate-x-1/2 transition-all duration-1000 ease-out" style={{ left: `${Math.min(stats.avance, 100)}%` }}>
              <div className="bg-slate-800 text-white text-xs font-bold py-1 px-3 rounded-lg shadow-lg relative">{stats.avance.toFixed(1)}%<div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div></div>
            </div>
            <div className="w-full h-6 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${Math.min(stats.avance, 100)}%` }}></div>
            </div>
            <div className="flex justify-between mt-3 text-sm font-bold text-slate-400"><span>$0</span><span className="text-slate-700">Meta: ${formatCurrency(stats.meta)}</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 flex items-center mb-6"><Trophy className="w-5 h-5 mr-2 text-amber-500" /> Top Asesores del Mes</h3>
          {stats.topAsesores.length === 0 ? (
            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200"><Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-semibold text-sm">Aún no hay ventas registradas.</p></div>
          ) : (
            <div className="space-y-4">
              {stats.topAsesores.map((asesor, index) => {
                let icon = <Medal className="w-5 h-5 text-slate-400" />;
                let bgClass = "bg-slate-50";
                if (index === 0) { icon = <Crown className="w-5 h-5 text-amber-500" />; bgClass = "bg-gradient-to-r from-amber-50 to-transparent border border-amber-100"; }
                else if (index === 1) { icon = <Medal className="w-5 h-5 text-slate-400" />; bgClass = "bg-gradient-to-r from-slate-100 to-transparent border border-slate-200"; }
                else if (index === 2) { icon = <Medal className="w-5 h-5 text-amber-700" />; bgClass = "bg-gradient-to-r from-orange-50 to-transparent border border-orange-100"; }

                return (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-xl ${bgClass}`}>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-slate-700 mr-4 border border-slate-100">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}</div>
                      <div><p className="font-bold text-slate-800 text-sm uppercase">{asesor.nombre}</p><p className="text-xs font-semibold text-slate-500 flex items-center">{icon} <span className="ml-1">Top {index + 1}</span></p></div>
                    </div>
                    <div className="text-right"><p className="font-black text-emerald-600 text-lg">${formatCurrency(asesor.venta)}</p></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
