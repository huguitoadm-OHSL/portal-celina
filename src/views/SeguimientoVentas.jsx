import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, BarChart2 } from 'lucide-react';
import { DATA_VERSION } from '../constants/config';
import { EQUIPOS_ASESORES } from '../constants/equipo';

export default function SeguimientoVentas() {
  const [asesoresSeguimiento, setAsesoresSeguimiento] = useState([]);
  const [datosProyeccion, setDatosProyeccion] = useState(null);
  
  // Cargar datos desde localStorage
  useEffect(() => {
    const loadAsesores = () => {
      try {
        const savedData = localStorage.getItem(`portalAsesores_proyeccion_Oscar Saravia`);
        if (savedData && localStorage.getItem('portalAsesores_dataVersion') === DATA_VERSION) {
          const data = JSON.parse(savedData);
          setDatosProyeccion(data);
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

  // --- LÓGICA DE ESTADÍSTICAS ---
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

  // --- LÓGICA PARA LOS GRÁFICOS ---
  const totalesPorDia = [0, 0, 0, 0, 0, 0, 0];
  const totalesPorProyecto = [0, 0, 0, 0, 0];
  const NOMBRES_PROYECTOS = ["Muyurina", "Renacer", "Santa Fe", "R. Nuevo", "Jardines"];

  if (datosProyeccion && datosProyeccion.asesores) {
    datosProyeccion.asesores.forEach(a => {
        if (a.dias) a.dias.forEach((val, i) => { totalesPorDia[i] += (Number(val) || 0) });
        if (a.proy) a.proy.forEach((val, i) => { totalesPorProyecto[i] += (Number(val) || 0) });
    });
  }

  // Obtenemos el valor máximo para escalar la altura de las barras proporcionalmente
  const maxDia = Math.max(...totalesPorDia, 1);
  const maxProy = Math.max(...totalesPorProyecto, 1);
  const formatNum = (val) => new Intl.NumberFormat('en-US').format(val);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><Target className="w-6 h-6 mr-2 text-sky-600" /> Detalle de Asesor Mes en Curso</h2></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* TARJETA 1: MÉTRICAS DEL EQUIPO */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-600 mb-4">Asesores</h3>
          <div className="flex justify-between text-center mb-6">
            <div><p className="text-2xl font-black text-slate-800">{statsSeguimiento.asesores}</p><p className="text-[11px] text-slate-500">Total</p></div><div className="w-px bg-slate-200"></div>
            <div><p className="text-2xl font-black text-slate-800">{statsSeguimiento.antiguos}</p><p className="text-[11px] text-slate-500">Antiguos</p></div><div className="w-px bg-slate-200"></div>
            <div><p className="text-2xl font-black text-slate-800">{statsSeguimiento.nuevos}</p><p className="text-[11px] text-slate-500">Nuevos</p></div>
          </div>
          <div className="flex justify-around text-center pt-4 border-t border-slate-100">
            <div><p className="text-xl font-bold text-slate-700">{statsSeguimiento.productivos}</p><p className="text-xs text-slate-500">Productivos</p></div>
            <div><p className="text-xl font-bold text-emerald-600">{statsSeguimiento.prodPercent}%</p><p className="text-xs text-slate-500">Productividad Cluster</p></div>
          </div>
        </div>
        
        {/* TARJETA 2: GRÁFICO VENTAS POR FECHA (Barras Verticales) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-600 flex items-center"><TrendingUp className="w-4 h-4 mr-1.5 text-blue-500"/> Ventas por Fecha (Semana)</h3>
          <div className="h-32 flex items-end justify-between gap-1.5 mt-4 px-2">
            {totalesPorDia.map((total, idx) => {
              // Calculamos el porcentaje de altura (mínimo 2% para que se vea la barra)
              const heightPercent = Math.max((total / maxDia) * 100, 2); 
              return (
                <div key={idx} className="flex flex-col items-center w-full group relative h-full justify-end">
                  {/* Tooltip flotante al pasar el mouse */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    ${formatNum(total)}
                  </div>
                  {/* La barra */}
                  <div className={`w-full rounded-t-sm transition-all duration-500 ${total > 0 ? 'bg-blue-500 group-hover:bg-blue-600' : 'bg-slate-100'}`} style={{ height: `${heightPercent}%` }}></div>
                  <span className="text-[10px] font-bold text-slate-400 mt-2">D{idx+1}</span>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* TARJETA 3: GRÁFICO VENTAS POR PROYECTO (Barras Horizontales) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-600 flex items-center"><BarChart2 className="w-4 h-4 mr-1.5 text-emerald-500"/> Ventas por Proyecto</h3>
          <div className="flex flex-col gap-2.5 mt-4 justify-center">
            {totalesPorProyecto.map((total, idx) => {
               // Calculamos el porcentaje de ancho
               const widthPercent = Math.max((total / maxProy) * 100, 1);
               return (
                 <div key={idx} className="flex items-center w-full text-xs group">
                    <span className="w-20 text-left font-semibold text-slate-500 truncate pr-2">{NOMBRES_PROYECTOS[idx]}</span>
                    <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden flex items-center relative">
                       <div className="h-full bg-emerald-400 rounded-full transition-all duration-500 group-hover:bg-emerald-500" style={{ width: `${widthPercent}%` }}></div>
                    </div>
                    <span className="w-12 text-right text-[10px] font-bold text-slate-600 ml-2">${formatNum(total)}</span>
                 </div>
               )
            })}
          </div>
        </div>

      </div>
      
      {/* TABLA DE ASESORES */}
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
                    <td className={`p-3 font-bold capitalize ${colNum >= 25000 ? 'text-emerald-600' : colNum > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{cluster}</td>
                  </tr>
                );
              })}
            </tbody>
         </table>
      </div>
    </div>
  );
}
