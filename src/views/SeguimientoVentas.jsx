import React from 'react';
import { Target, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const PROYECTOS_ACTUALIZADOS = ['Muyurina', 'Renacer', 'Santa Fe', 'Rancho Nuevo', 'Jardines', 'Celina VII F3', 'Cañaveral'];

// LA BASE DE DATOS MAESTRA - ACTUALÍZALA AQUÍ Y VERCEL LO HARÁ PÚBLICO
const BASE_DE_DATOS_PBI = [
  { nombre: "NEFI ELIAS CHAVEZ", colAct: 45278, ventasReales: [1,1,0,0,0,0,0], tipo: 'NUEVO' },
  { nombre: "DANIEL ANGULO MALDONADO", colAct: 45000, ventasReales: [0,6,0,0,0,0,0], tipo: 'INTERNO' },
  { nombre: "MARISOL URGEL PIZARRO", colAct: 38484, ventasReales: [1,1,0,0,1,0,0], tipo: 'INTERNO' },
  { nombre: "GLORIANA SILVA ALMENDA", colAct: 13200, ventasReales: [0,2,0,0,0,0,0], tipo: 'INTERNO' },
  { nombre: "MADELINE CARBALLO", colAct: 12874, ventasReales: [0,0,0,0,0,0,1], tipo: 'EXTERNO' },
  { nombre: "JAIME FABRICIO RIOS", colAct: 7500, ventasReales: [0,1,0,0,0,0,0], tipo: 'INTERNO' },
  { nombre: "ELY GONZALES GARCIA", colAct: 7200, ventasReales: [0,0,0,0,0,1,0], tipo: 'INTERNO' },
  { nombre: "CARLOS ENRIQUE CALDERON", colAct: 25289,98, ventasReales: [0,0,0,2,0,0,0], tipo: 'INTERNO' },
  { nombre: "GUICELA ARIAS", colAct: 0, ventasReales: [0,0,0,0,0,0,0], tipo: 'NUEVO' },
  { nombre: "HUMBERTO FALDIN PARAPAINO", colAct: 0, ventasReales: [0,0,0,0,0,0,0], tipo: 'NUEVO' },
  { nombre: "MERLY MENDEZ HURTADO", colAct: 0, ventasReales: [0,0,0,0,0,0,0], tipo: 'INTERNO' },
  { nombre: "RODRIGO ROJAS SILES", colAct: 0, ventasReales: [0,0,0,0,0,0,0], tipo: 'INTERNO' },
  { nombre: "TERESITA CARDOZO AGUIRRE", colAct: 0, ventasReales: [0,0,0,0,0,0,0], tipo: 'NUEVO' }
];

export default function SeguimientoVentas() {
  const ventasPorProyecto = [0, 0, 0, 0, 0, 0, 0]; 

  const datosProcesados = BASE_DE_DATOS_PBI.map(asesor => {
    let totalVentas = 0;
    asesor.ventasReales.forEach((cant, i) => { 
      ventasPorProyecto[i] += cant; 
      totalVentas += cant;
    });

    let clusterInfo = { texto: 'Venta Cero', color: 'text-slate-400 font-semibold' };
    if (asesor.colAct >= 25000) clusterInfo = { texto: 'Comisionan', color: 'text-emerald-600 font-bold' };
    else if (asesor.colAct > 0) clusterInfo = { texto: 'No Comisionan', color: 'text-amber-600 font-bold' };

    return {
      nombre: asesor.nombre, agencia: 'MONTERO', supervisor: 'OSCAR SARAVIA',
      ventas: totalVentas, colocacion: asesor.colAct, tipo: asesor.tipo,
      minima: 25000, cluster: clusterInfo
    };
  });

  const maxVentaProy = Math.max(...ventasPorProyecto, 1);

  // KPIS EXACTOS DEL PBI DE CELINA
  const totalAsesores = 13;
  const totalAntiguos = 8;
  const totalNuevos = 4;
  const totalExternos = 1;
  
  const productivos = datosProcesados.filter(a => a.colocacion >= 25000).length;
  // Productividad calculada sobre la base de antiguos para igualar el 25% de Power BI
  const productividad = Math.round((productivos / totalAntiguos) * 100); 

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Target className="w-6 h-6 mr-2 text-indigo-600" /> Detalle de Asesor Mes en Curso
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* TARJETA ASESORES (DISEÑO PBI) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-slate-500 mb-4 flex items-center"><Users className="w-4 h-4 mr-2"/> Asesores</p>
          <div className="grid grid-cols-4 divide-x divide-slate-100 text-center">
            <div><p className="text-3xl font-black text-slate-800">{totalAsesores}</p><p className="text-[10px] text-slate-400 font-semibold uppercase mt-1">Total</p></div>
            <div><p className="text-3xl font-black text-slate-800">{totalAntiguos}</p><p className="text-[10px] text-slate-400 font-semibold uppercase mt-1">Antiguos</p></div>
            <div><p className="text-3xl font-black text-sky-600">{totalNuevos}</p><p className="text-[10px] text-sky-500/70 font-semibold uppercase mt-1">Nuevos</p></div>
            <div><p className="text-3xl font-black text-amber-500">{totalExternos}</p><p className="text-[10px] text-amber-500/70 font-semibold uppercase mt-1">Externos</p></div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 divide-x divide-slate-100 text-center">
            <div><p className="text-2xl font-black text-slate-700">{productivos}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Productivos</p></div>
            <div><p className="text-2xl font-black text-emerald-600">{productividad}%</p><p className="text-[10px] text-emerald-500/70 font-bold uppercase mt-1">Productividad Cluster</p></div>
          </div>
        </div>

        {/* TARJETA VENTAS ACUMULADAS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-bold text-slate-700 flex items-center mb-4"><Target className="w-4 h-4 mr-2 text-emerald-500"/> Ventas Acumuladas</p>
          <div className="space-y-3.5 w-full">
            {PROYECTOS_ACTUALIZADOS.map((nombre, i) => (
              <div key={i} className="flex items-center text-xs">
                <span className="w-24 font-semibold text-slate-500 truncate">{nombre}</span>
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
