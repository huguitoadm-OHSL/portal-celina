import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, RefreshCw } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { formatCurrency } from '../utils/formatters';

const PROYECTOS_ACTUALIZADOS = ['Muyurina', 'Renacer', 'Santa Fe', 'Rancho Nuevo', 'Jardines', 'Celina VII F3', 'Cañaveral'];

export default function SeguimientoVentas() {
  const [asesores, setAsesores] = useState([]);
  const [sincronizando, setSincronizando] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "proyecciones"), (snapshot) => {
      let todosLosAsesores = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data && Array.isArray(data.asesores)) {
          data.asesores.forEach(a => { 
            if (a && a.nombre) todosLosAsesores.push({ ...a, equipo: doc.id }); 
          });
        }
      });
      todosLosAsesores.sort((a, b) => (Number(b.colAct) || 0) - (Number(a.colAct) || 0));
      
      setAsesores(todosLosAsesores);
      setSincronizando(false);
    }, (error) => {
      console.error("Error Firebase:", error);
      setSincronizando(false);
    });
    return () => unsubscribe();
  }, []);

  // CLASIFICACIÓN DE PERSONAL
  const asesoresNuevos = ['NEFI ELIAS CHAVEZ', 'TERESITA CARDOZO AGUIRRE', 'GUICELA ARIAS', 'HUMBERTO FALDIN PARAPAINO'];
  const asesoresExternos = ['MADELINE CARBALLO'];

  const ventasPorDia = [0, 0, 0, 0, 0, 0, 0];
  const ventasPorProyecto = [0, 0, 0, 0, 0, 0, 0]; // 7 posiciones

  const datosProcesados = asesores.map(asesor => {
    const nombreUpper = String(asesor.nombre || 'ASESOR DESCONOCIDO').toUpperCase();
    
    // ASIGNACIÓN DE TIPO
    const esNuevo = asesoresNuevos.some(nuevo => nombreUpper.includes(nuevo));
    const esExterna = asesoresExternos.some(ext => nombreUpper.includes(ext));
    
    let tipoAsesor = 'INTERNO';
    if (esNuevo) tipoAsesor = 'NUEVO';
    else if (esExterna) tipoAsesor = 'EXTERNO';

    if (Array.isArray(asesor.dias)) asesor.dias.forEach((d, i) => { ventasPorDia[i] += (Number(d) || 0); });
    
    let totalVentas = 0;
    const ventasReales = Array.isArray(asesor.ventasReales) ? asesor.ventasReales : [0, 0, 0, 0, 0, 0, 0];
    ventasReales.forEach((p, i) => { 
      const cant = Number(p) || 0;
      if (i < 7) {
        ventasPorProyecto[i] += cant; 
        totalVentas += cant;
      }
    });

    const colocacion = Number(asesor.colAct) || 0;
    let clusterInfo = { texto: 'Venta Cero', color: 'text-slate-400 font-semibold' };
    if (colocacion >= 25000) clusterInfo = { texto: 'Comisionan', color: 'text-emerald-600 font-bold' };
    else if (colocacion > 0) clusterInfo = { texto: 'No Comisionan', color: 'text-amber-600 font-bold' };

    return {
      nombre: nombreUpper, agencia: 'MONTERO', supervisor: asesor.equipo.toUpperCase(),
      ventas: totalVentas, colocacion: colocacion, tipo: tipoAsesor,
      minima: 25000, cluster: clusterInfo
    };
  });

  const maxVentaDia = Math.max(...ventasPorDia, 1);
  const maxVentaProy = Math.max(...ventasPorProyecto, 1);

  const totalAsesores = datosProcesados.length > 0 ? datosProcesados.length : 12;
  const totalNuevos = datosProcesados.filter(a => a.tipo === 'NUEVO').length || 0;
  const totalAntiguos = totalAsesores - totalNuevos;
  const productivos = datosProcesados.filter(a => a.colocacion >= 25000).length || 0;
  const productividad = totalAsesores > 0 ? Math.round((productivos / totalAsesores) * 100) : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Target className="w-6 h-6 mr-2 text-indigo-600" /> Detalle de Asesor Mes en Curso
          {sincronizando && <RefreshCw className="w-4 h-4 ml-3 text-slate-400 animate-spin" />}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-slate-500 mb-4">Asesores</p>
          <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
            <div><p className="text-3xl font-black text-slate-800">{totalAsesores}</p><p className="text-[10px] text-slate-400 font-semibold uppercase mt-1">Total</p></div>
            <div><p className="text-3xl font-black text-slate-800">{totalAntiguos}</p><p className="text-[10px] text-slate-400 font-semibold uppercase mt-1">Planta/Ext</p></div>
            <div><p className="text-3xl font-black text-sky-600">{totalNuevos}</p><p className="text-[10px] text-sky-500/70 font-semibold uppercase mt-1">Nuevos</p></div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 divide-x divide-slate-100 text-center">
            <div><p className="text-2xl font-black text-slate-700">{productivos}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Productivos</p></div>
            <div><p className="text-2xl font-black text-emerald-600">{productividad}%</p><p className="text-[10px] text-emerald-500/70 font-bold uppercase mt-1">Productividad Cluster</p></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-bold text-slate-700 flex items-center mb-6"><TrendingUp className="w-4 h-4 mr-2 text-blue-500"/> Ventas por Fecha (Semana)</p>
          <div className="flex items-end justify-between h-28 w-full gap-2 px-2">
            {ventasPorDia.map((v, i) => (
              <div key={i} className="flex flex-col items-center w-full group relative">
                <div className="w-full bg-blue-100 rounded-t-md relative transition-all duration-500 group-hover:bg-blue-300" style={{ height: `${maxVentaDia > 0 ? (v / maxVentaDia) * 100 : 0}%`, minHeight: v > 0 ? '4px' : '0px' }}>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm px-1.5 py-0.5 rounded border border-slate-200 z-10 whitespace-nowrap">${formatCurrency(v)}</div>
                </div>
                <p className="text-[10px] font-semibold text-slate-400 mt-2">D{i+1}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-bold text-slate-700 flex items-center mb-4"><Target className="w-4 h-4 mr-2 text-emerald-500"/> Ventas Acumuladas</p>
          <div className="space-y-3.5 w-full">
            {PROYECTOS_ACTUALIZADOS.map((nombre, i) => (
              <div key={i} className="flex items-center text-xs">
                <span className="w-20 font-semibold text-slate-500 truncate">{nombre}</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full mx-3 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: `${maxVentaProy > 0 ? (ventasPorProyecto[i] / maxVentaProy) * 100 : 0}%` }}></div>
                </div>
                <span className="w-6 text-right font-bold text-slate-700">{ventasPorProyecto[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[#0f607a] text-white">
                <th className="p-3 font-bold uppercase tracking-wider">Asesor</th>
                <th className="p-3 font-bold uppercase tracking-wider text-center">Agencia</th>
                <th className="p-3 font-bold uppercase tracking-wider text-center">Supervisor</th>
                <th className="p-3 font-black uppercase tracking-wider text-center bg-[#0d5268]">Ventas</th>
                <th className="p-3 font-bold uppercase tracking-wider text-right">Colocación ▼</th>
                <th className="p-3 font-bold uppercase tracking-wider text-center">Tipo Asesor</th>
                <th className="p-3 font-bold uppercase tracking-wider text-right">Venta Minima</th>
                <th className="p-3 font-bold uppercase tracking-wider text-center">Cluster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {datosProcesados.length > 0 ? datosProcesados.map((asesor, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-slate-600 font-semibold">{asesor.nombre}</td>
                  <td className="p-3 text-slate-500 text-center">{asesor.agencia}</td>
                  <td className="p-3 text-slate-500 text-center">{asesor.supervisor}</td>
                  <td className="p-3 text-slate-800 font-black text-center text-sm bg-slate-50/50">{asesor.ventas}</td>
                  <td className="p-3 text-sky-700 font-bold text-right">{formatCurrency(asesor.colocacion)}</td>
                  <td className="p-3 text-slate-600 text-center font-medium">{asesor.tipo}</td>
                  <td className="p-3 text-slate-500 text-right">{formatCurrency(asesor.minima)}</td>
                  <td className={`p-3 text-center ${asesor.cluster.color}`}>{asesor.cluster.texto}</td>
                </tr>
              )) : <tr><td colSpan="8" className="p-8 text-center text-slate-400 font-semibold">Plataforma limpia. Esperando registros...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
