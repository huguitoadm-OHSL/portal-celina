import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Users, Award, AlertCircle } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { formatCurrency } from '../utils/formatters';

export default function SeguimientoVentas() {
  const [asesores, setAsesores] = useState([]);

  // CONEXIÓN A LA NUBE EN TIEMPO REAL
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "proyecciones"), (snapshot) => {
      let todosLosAsesores = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data && data.asesores) {
          data.asesores.forEach(a => {
            todosLosAsesores.push({ ...a, equipo: data.equipo || 'Oscar Saravia' });
          });
        }
      });

      // ORDENAR AUTOMÁTICAMENTE POR COLOCACIÓN (De mayor a menor)
      todosLosAsesores.sort((a, b) => (Number(b.colAct) || 0) - (Number(a.colAct) || 0));
      setAsesores(todosLosAsesores);
    });

    return () => unsubscribe();
  }, []);

  // LÓGICA DE NEGOCIO Y CORRECCIONES AUTOMÁTICAS
  const asesoresNuevos = ['NEFI ELIAS CHAVEZ', 'TERESITA CARDOZO AGUIRRE', 'GUICELA ARIAS', 'HUMBERTO FALDIN PARAPAINO'];

  const datosProcesados = asesores.map(asesor => {
    const nombreUpper = asesor.nombre.toUpperCase();
    const esNuevo = asesoresNuevos.some(nuevo => nombreUpper.includes(nuevo));

    // EL CÁLCULO MÁGICO: Suma los lotes desde el arreglo de proyectos del Modal Inteligente
    const totalVentas = asesor.proy ? asesor.proy.reduce((acc, val) => acc + (Number(val) || 0), 0) : 0;

    const colocacion = Number(asesor.colAct) || 0;
    
    // Asignación de Cluster idéntico a Power BI
    let clusterInfo = { texto: 'Venta Cero', color: 'text-slate-400 font-semibold' };
    if (colocacion >= 25000) {
      clusterInfo = { texto: 'Comisionan', color: 'text-emerald-600 font-bold' };
    } else if (colocacion > 0) {
      clusterInfo = { texto: 'No Comisionan', color: 'text-amber-600 font-bold' };
    }

    return {
      nombre: nombreUpper,
      agencia: 'MONTERO',
      supervisor: asesor.equipo.toUpperCase(),
      ventas: totalVentas,
      colocacion: colocacion,
      tipo: esNuevo ? 'NUEVO' : 'INTERNO',
      minima: 25000,
      cluster: clusterInfo
    };
  });

  // CÁLCULO DE KPIS GERENCIALES
  const totalAsesores = datosProcesados.length;
  const totalNuevos = datosProcesados.filter(a => a.tipo === 'NUEVO').length;
  const totalAntiguos = totalAsesores - totalNuevos;
  const productivos = datosProcesados.filter(a => a.colocacion >= 25000).length;
  const productividad = totalAsesores > 0 ? Math.round((productivos / totalAsesores) * 100) : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center"><Target className="w-6 h-6 mr-2 text-indigo-600" /> Detalle de Asesor Mes en Curso</h2>
        </div>
      </div>

      {/* TARJETAS DE KPIS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-4">Asesores</p>
          <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
            <div>
              <p className="text-3xl font-black text-slate-800">{totalAsesores}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Total</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">{totalAntiguos}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Antiguos</p>
            </div>
            <div>
              <p className="text-3xl font-black text-sky-600">{totalNuevos}</p>
              <p className="text-xs text-sky-500/70 font-semibold uppercase tracking-wider mt-1">Nuevos</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 divide-x divide-slate-100 text-center">
            <div>
              <p className="text-2xl font-black text-slate-700">{productivos}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Productivos</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-600">{productividad}%</p>
              <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-wider mt-1">Productividad Cluster</p>
            </div>
          </div>
        </div>

        {/* ESPACIO PARA GRÁFICAS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400 border-dashed">
           <TrendingUp className="w-10 h-10 mb-3 opacity-20" />
           <p className="font-semibold text-sm">Panel de Gráficos Integrado</p>
           <p className="text-xs text-center mt-2">La sincronización de gráficos avanzados se activará<br/>al recopilar más historial de ventas.</p>
        </div>
      </div>

      {/* TABLA ESTILO POWER BI */}
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
              {datosProcesados.map((asesor, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
