import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { DATA_VERSION } from '../constants/config';
import { EQUIPOS_ASESORES } from '../constants/equipo';

export default function SeguimientoVentas() {
  const [asesoresSeguimiento, setAsesoresSeguimiento] = useState([]);
  
  // Cargar datos desde localStorage
  useEffect(() => {
    const loadAsesores = () => {
      try {
        const savedData = localStorage.getItem(`portalAsesores_proyeccion_Oscar Saravia`);
        if (savedData && localStorage.getItem('portalAsesores_dataVersion') === DATA_VERSION) {
          const data = JSON.parse(savedData);
          if (data && data.asesores) {
            setAsesoresSeguimiento([...data.asesores].sort((a, b) => (Number(b.colAct) || 0) - (Number(a.colAct) || 0)));
            return;
          }
        }
      } catch(e) {}
      setAsesoresSeguimiento([...EQUIPOS_ASESORES["Oscar Saravia"]].sort((a, b) => (Number(b.colAct) || 0) - (Number(a.colAct) || 0)));
    };
    loadAsesores();
  }, []);

  const statsSeguimiento = (() => {
    let t = { asesores: 0, antiguos: 0, nuevos: 0, externos: 0, productivos: 0 };
    asesoresSeguimiento.forEach(a => {
      t.asesores++;
      if (a.tipo === 'Interno' || !a.tipo) t.antiguos++;
      else if (a.tipo === 'Aprendizaje') t.nuevos++;
      else if (a.tipo === 'Externo') t.externos++;
      if (Number(a.colAct) >= 25000) t.productivos++;
    });
    t.prodPercent = t.asesores > 0 ? Math.round((t.productivos / t.asesores) * 100) : 0;
    return t;
  })();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><Target className="w-6 h-6 mr-2 text-sky-600" /> Detalle de Asesor Mes en Curso</h2></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"><h3 className="text-sm font-bold text-slate-600 mb-4">Asesores</h3><div className="flex justify-between text-center mb-6"><div><p className="text-2xl font-black text-slate-800">{statsSeguimiento.asesores}</p><p className="text-[11px] text-slate-500">Total</p></div><div className="w-px bg-slate-200"></div><div><p className="text-2xl font-black text-slate-800">{statsSeguimiento.antiguos}</p><p className="text-[11px] text-slate-500">Antiguos</p></div><div className="w-px bg-slate-200"></div><div><p className="text-2xl font-black text-slate-800">{statsSeguimiento.nuevos}</p><p className="text-[11px] text-slate-500">Nuevos</p></div></div><div className="flex justify-around text-center pt-4 border-t border-slate-100"><div><p className="text-xl font-bold text-slate-700">{statsSeguimiento.productivos}</p><p className="text-xs text-slate-500">Productivos</p></div><div><p className="text-xl font-bold text-red-600">{statsSeguimiento.prodPercent}%</p><p className="text-xs text-slate-500">Productividad Cluster</p></div></div></div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center text-center text-slate-500">
          <p className="text-sm font-bold">Ventas por Fecha</p><p className="text-xs mt-2">Módulo gráfico en construcción</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center text-center text-slate-500">
          <p className="text-sm font-bold">Ventas por Proyecto</p><p className="text-xs mt-2">Módulo en construcción</p>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden overflow-x-auto shadow-sm">
         <table className="w-full text-xs text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#0f6b86] text-white">
                <th className="p-3 font-semibold border-r border-[#0d5970]">Asesor</th>
                <th className="p-3 font-semibold border-r border-[#0d5970]">Agencia</th>
                <th className="p-3 font-semibold border-r border-[#0d5970]">Supervisor</th>
                <th className="p-3 font-semibold text-center border-r border-[#0d5970]">Ventas</th>
                <th className="p-3 font-semibold text-right border-r border-[#0d5970]">Colocación ▼</th>
                <th className="p-3 font-semibold border-r border-[#0d5970]">Tipo Asesor</th>
                <th className="p-3 font-semibold text-right border-r border-[#0d5970]">Venta Minima</th>
                <th className="p-3 font-semibold">Cluster</th>
              </tr>
            </thead>
            <tbody>
              {asesoresSeguimiento.map((a, idx) => {
                const colNum = Number(a.colAct) || 0;
                let cluster = colNum >= 25000 ? "Comisionan" : colNum > 0 ? "No Comisionan" : "Venta Cero";
                return (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 text-slate-600 uppercase">
                    <td className="p-3 font-bold">{a.nombre || ''}</td>
                    <td className="p-3">MONTERO</td><td className="p-3">OSCAR SARAVIA</td>
                    <td className="p-3 text-center">{a.ventas || 0}</td>
                    <td className="p-3 text-right font-bold text-sky-700">{colNum === 0 ? '0' : new Intl.NumberFormat('es-BO', {minimumFractionDigits: 3}).format(colNum).replace(',', '.')}</td>
                    <td className="p-3">{a.tipo || 'Interno'}</td><td className="p-3 text-right">25.000</td>
                    <td className="p-3 font-bold capitalize text-emerald-600">{cluster}</td>
                  </tr>
                );
              })}
            </tbody>
         </table>
      </div>
    </div>
  );
}
