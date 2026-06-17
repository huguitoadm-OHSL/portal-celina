import React, { useState } from 'react';
import { BarChart, ShieldCheck } from 'lucide-react';
import { ResultCard } from '../components/ui/ResultCard';
import { formatDiaMes, formatCurrency } from '../utils/formatters';
import { obtenerDatosSupervisor } from '../utils/calculadoras';
import { generarTextoProyeccionCelular } from '../utils/textTemplates';
import { generarHtmlProyeccion } from '../utils/htmlTemplates';
import { SUPERVISORES } from '../constants/equipo';

const PROYECTOS_ACTUALIZADOS = ['Muyurina', 'Renacer', 'Santa Fe', 'Rancho Nuevo', 'Jardines', 'Celina VII F3', 'Cañaveral'];

// LA BÓVEDA MAESTRA (Intacta y asegurada)
const BASE_DE_DATOS_PROYECCION = [
  { nombre: "NEFI ELIAS CHAVEZ", colAct: 45278, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0,0,0] }, 
  { nombre: "DANIEL ANGULO MALDONADO", colAct: 45000, dias: [0,0,0,0,0,9668,0], proy: [0,0,1,0,0,0,0] },
  { nombre: "MARISOL URGEL PIZARRO", colAct: 38484, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0,0,0] }, 
  { nombre: "GLORIANA SILVA ALMENDA", colAct: 13200, dias: [0,0,0,0,6000,0,0], proy: [0,0,1,0,0,0,0] },
  { nombre: "MADELINE CARBALLO", colAct: 12874, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0,0,0] }, 
  { nombre: "JAIME FABRICIO RIOS", colAct: 7500, dias: [0,0,0,0,0,6600,0], proy: [0,0,1,0,0,0,0] },
  { nombre: "ELY GONZALES GARCIA", colAct: 7200, dias: [0,0,0,0,7500,0,0], proy: [0,0,1,0,0,0,0] }, 
  { nombre: "CARLOS ENRIQUE CALDERON", colAct: 0, dias: [0,0,57803,0,5100,0,0], proy: [0,0,0,1,1,0,0] },
  { nombre: "GUICELA ARIAS", colAct: 0, dias: [0,0,0,0,6600,6600,0], proy: [0,2,0,0,0,0,0] }, 
  { nombre: "HUMBERTO FALDIN PARAPAINO", colAct: 0, dias: [0,0,0,0,6600,0,0], proy: [0,0,1,0,0,0,0] },
  { nombre: "MERLY MENDEZ HURTADO", colAct: 0, dias: [0,0,0,0,0,30480,0], proy: [1,0,0,0,0,0,0] }, 
  { nombre: "RODRIGO ROJAS SILES", colAct: 0, dias: [0,0,0,0,17280,0,0], proy: [1,0,0,0,0,0,0] },
  { nombre: "TERESITA CARDOZO AGUIRRE", colAct: 0, dias: [0,0,0,0,0,7500,0], proy: [0,1,0,0,0,0,0] }
];

export default function ProyeccionSemanal() {
  const [supervisorDestino, setSupervisorDestino] = useState('mreyes@celina.com.bo');
  
  const [formProyeccion, setFormProyeccion] = useState({
    equipo: 'Oscar Saravia', 
    fechaInicio: '2026-06-15', 
    objetivoMensual: 450000,
    asesores: BASE_DE_DATOS_PROYECCION
  });

  const handleLocalArrayChange = (idx, type, arrIdx, val) => {
    const n = [...formProyeccion.asesores];
    n[idx] = { ...n[idx] }; 
    n[idx][type] = [...n[idx][type]]; 
    n[idx][type][arrIdx] = parseFloat(val) || 0;
    setFormProyeccion({ ...formProyeccion, asesores: n });
  };

  const handleParamChange = (field, val) => {
    setFormProyeccion({ ...formProyeccion, [field]: val });
  };

  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);

  // CÁLCULO DE TOTALES EN TIEMPO REAL
  const totalColocacion = formProyeccion.asesores.reduce((acc, a) => acc + (a.colAct || 0), 0);
  const totalesDias = [0,1,2,3,4,5,6].map(dIdx => formProyeccion.asesores.reduce((acc, a) => acc + (a.dias[dIdx] || 0), 0));
  const totalesProy = [0,1,2,3,4,5,6].map(pIdx => formProyeccion.asesores.reduce((acc, a) => acc + (a.proy[pIdx] || 0), 0));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <BarChart className="w-6 h-6 mr-2 text-blue-600" /> Proyección Semanal
            <span className="ml-3 text-xs font-bold flex items-center px-2 py-1 rounded border bg-indigo-50 text-indigo-700 border-indigo-200">
              <ShieldCheck className="w-4 h-4 mr-1"/> Servidor GitHub (Protegido)
            </span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 w-full">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col w-full min-w-0">
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 bg-slate-50 items-center w-full">
            <div className="w-full sm:w-40">
              <label className="block text-xs font-bold text-slate-500 uppercase">Semana del (Lunes)</label>
              <input type="date" value={formProyeccion.fechaInicio} onChange={(e) => handleParamChange('fechaInicio', e.target.value)} className="w-full px-3 py-1.5 mt-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="w-full sm:w-40">
              <label className="block text-xs font-bold text-slate-500 uppercase">Objetivo Mes</label>
              <input type="number" value={formProyeccion.objetivoMensual} onChange={(e) => handleParamChange('objetivoMensual', parseFloat(e.target.value) || 0)} className="w-full px-3 py-1.5 mt-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap">
              <thead>
                <tr>
                  <th rowSpan="2" className="bg-[#f8fafc] text-slate-800 p-2 border border-slate-300">Asesor</th>
                  <th rowSpan="2" className="bg-[#f8fafc] text-slate-800 p-2 border border-slate-300 text-center">Coloc. Actual</th>
                  <th colSpan="7" className="bg-[#f1f5f9] text-slate-700 p-2 border border-slate-300 text-center uppercase">Proyección Diaria</th>
                  <th colSpan="7" className="bg-[#eff6ff] text-sky-800 p-2 border border-slate-300 text-center uppercase">Proyectos (Posibles Ventas)</th>
                </tr>
                <tr>
                  {[0,1,2,3,4,5,6].map(d => <th key={d} className="bg-[#f8fafc] text-slate-600 p-2 border border-slate-300 text-center">{formatDiaMes(formProyeccion.fechaInicio, d)}</th>)}
                  {PROYECTOS_ACTUALIZADOS.map(p => <th key={p} className="bg-[#eff6ff] text-sky-700 p-2 border border-slate-300 text-center">{p.substring(0,6)}.</th>)}
                </tr>
              </thead>
              <tbody>
                {formProyeccion.asesores.map((asesor, i) => (
                  <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-2 border border-slate-300 font-bold text-slate-800 truncate max-w-[130px]">{i+1}. {asesor.nombre}</td>
                    <td className="p-2 border border-slate-300 font-black text-emerald-700 text-right bg-emerald-50/30">
                      ${asesor.colAct > 0 ? formatCurrency(asesor.colAct) : '0'}
                    </td>
                    {asesor.dias.map((d, dIdx) => (
                      <td key={dIdx} className="p-1 border border-slate-300">
                        <input type="number" value={d === 0 ? '' : d} onChange={(e) => handleLocalArrayChange(i, 'dias', dIdx, e.target.value)} className="w-full min-w-[30px] p-1 text-center bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-blue-400 rounded transition-all" placeholder="-" />
                      </td>
                    ))}
                    {asesor.proy.map((p, pIdx) => (
                      <td key={pIdx} className="p-1 border border-slate-300 bg-sky-50/30">
                        <input type="number" value={p === 0 ? '' : p} onChange={(e) => handleLocalArrayChange(i, 'proy', pIdx, e.target.value)} className="w-full min-w-[30px] p-1 text-center font-bold text-sky-700 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-sky-400 rounded transition-all" placeholder="0" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {/* FILA DE TOTALES DINÁMICOS */}
              <tfoot>
                <tr className="bg-slate-100 font-black text-slate-800 border-t-2 border-slate-300">
                  <td className="p-2 text-right uppercase text-xs" colSpan="1">Totales Globales</td>
                  <td className="p-2 text-right text-emerald-700">${formatCurrency(totalColocacion)}</td>
                  {totalesDias.map((tot, i) => (
                    <td key={i} className="p-2 text-center text-slate-700">{tot > 0 ? '$'+formatCurrency(tot) : '-'}</td>
                  ))}
                  {totalesProy.map((tot, i) => (
                    <td key={i} className="p-2 text-center text-sky-700">{tot > 0 ? tot : '-'}</td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="w-full min-w-0 flex flex-col h-full">
          <ResultCard title="Proyección Semanal" text={generarTextoProyeccionCelular(formProyeccion, supervisorData)} htmlContent={generarHtmlProyeccion(formProyeccion, supervisorData)} subject={`Proyección Semanal Equipo`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
        </div>
      </div>
    </div>
  );
}
