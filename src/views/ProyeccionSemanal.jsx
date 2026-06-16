import React, { useState, useEffect } from 'react';
import { BarChart, Cloud, CheckCircle2 } from 'lucide-react';
import { ResultCard } from '../components/ui/ResultCard';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { formatDiaMes, formatCurrency } from '../utils/formatters';
import { obtenerDatosSupervisor } from '../utils/calculadoras';
import { generarTextoProyeccionCelular } from '../utils/textTemplates';
import { generarHtmlProyeccion } from '../utils/htmlTemplates';
import { SUPERVISORES } from '../constants/equipo';

const PROYECTOS_ACTUALIZADOS = ['Muyurina', 'Renacer', 'Santa Fe', 'Rancho Nuevo', 'Jardines', 'Celina VII F3', 'Cañaveral'];

// BASE DE DATOS INMUTABLE (Protege el dinero real)
const BASE_DE_DATOS_PBI = [
  { nombre: "NEFI ELIAS CHAVEZ", colAct: 45278 }, { nombre: "DANIEL ANGULO MALDONADO", colAct: 45000 },
  { nombre: "MARISOL URGEL PIZARRO", colAct: 38484 }, { nombre: "GLORIANA SILVA ALMENDA", colAct: 13200 },
  { nombre: "MADELINE CARBALLO", colAct: 12874 }, { nombre: "JAIME FABRICIO RIOS", colAct: 7500 },
  { nombre: "ELY GONZALES GARCIA", colAct: 7200 }, { nombre: "CARLOS ENRIQUE CALDERON", colAct: 0 },
  { nombre: "GUICELA ARIAS", colAct: 0 }, { nombre: "HUMBERTO FALDIN PARAPAINO", colAct: 0 },
  { nombre: "MERLY MENDEZ HURTADO", colAct: 0 }, { nombre: "RODRIGO ROJAS SILES", colAct: 0 },
  { nombre: "TERESITA CARDOZO AGUIRRE", colAct: 0 }
];

export default function ProyeccionSemanal() {
  const [supervisorDestino, setSupervisorDestino] = useState('mreyes@celina.com.bo');
  const [guardandoNube, setGuardandoNube] = useState(false);
  const [estadoSincronizacion, setEstadoSincronizacion] = useState('Conectando...');
  
  const [formProyeccion, setFormProyeccion] = useState({
    equipo: 'Oscar Saravia', fechaInicio: new Date().toISOString().split('T')[0], objetivoMensual: 450000,
    asesores: BASE_DE_DATOS_PBI.map(a => ({ ...a, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0,0,0] }))
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "proyecciones_dinamicas", "Oscar Saravia"), (docSnap) => {
      if (docSnap.exists()) {
        const dataNube = docSnap.data();
        setFormProyeccion(prev => {
          const asesoresFusionados = BASE_DE_DATOS_PBI.map((asesorBase, index) => {
            const asesorNube = dataNube.asesores && dataNube.asesores[index] ? dataNube.asesores[index] : {};
            return {
              ...asesorBase,
              dias: asesorNube.dias && asesorNube.dias.length === 7 ? asesorNube.dias : [0,0,0,0,0,0,0],
              proy: asesorNube.proy && asesorNube.proy.length === 7 ? asesorNube.proy : [0,0,0,0,0,0,0]
            };
          });

          return {
            ...prev,
            asesores: asesoresFusionados,
            fechaInicio: dataNube.fechaInicio || prev.fechaInicio,
            objetivoMensual: dataNube.objetivoMensual || prev.objetivoMensual
          };
        });
      }
      setEstadoSincronizacion('Sincronizado');
    }, (error) => {
      console.error(error);
      setEstadoSincronizacion('Modo Local');
    });

    return () => unsubscribe();
  }, []);

  const syncToCloud = async (newState) => {
    setGuardandoNube(true);
    setEstadoSincronizacion('Guardando...');
    try {
      await setDoc(doc(db, "proyecciones_dinamicas", "Oscar Saravia"), {
        asesores: newState.asesores,
        fechaInicio: newState.fechaInicio,
        objetivoMensual: newState.objetivoMensual,
        ultimaActualizacion: new Date().toISOString()
      });
      setTimeout(() => {
        setGuardandoNube(false);
        setEstadoSincronizacion('Sincronizado');
      }, 1000);
    } catch (e) {
      console.error(e);
      setGuardandoNube(false);
      setEstadoSincronizacion('Error de red');
    }
  };

  const handleLocalArrayChange = (idx, type, arrIdx, val) => {
    const n = [...formProyeccion.asesores];
    n[idx] = { ...n[idx] }; 
    n[idx][type] = [...n[idx][type]]; 
    n[idx][type][arrIdx] = parseFloat(val) || 0;
    setFormProyeccion({ ...formProyeccion, asesores: n });
  };

  const handleParamChange = (field, val) => {
    const newState = { ...formProyeccion, [field]: val };
    setFormProyeccion(newState);
  };

  const handleBlurSave = () => {
    syncToCloud(formProyeccion);
  };

  const handleBlurParamSave = (field, val) => {
    const newState = { ...formProyeccion, [field]: val };
    setFormProyeccion(newState);
    syncToCloud(newState);
  };

  const limpiarSemana = () => {
    if(window.confirm("¿Seguro que deseas limpiar las proyecciones de esta semana para todo el equipo?")) {
      const asesoresLimpios = formProyeccion.asesores.map(a => ({ ...a, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0,0,0] }));
      const newState = { ...formProyeccion, asesores: asesoresLimpios };
      setFormProyeccion(newState);
      syncToCloud(newState);
    }
  };

  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <BarChart className="w-6 h-6 mr-2 text-blue-600" /> Proyección Semanal
            
            <span className={`ml-3 text-xs font-bold flex items-center px-2 py-1 rounded border ${estadoSincronizacion === 'Sincronizado' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : estadoSincronizacion === 'Guardando...' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
              {estadoSincronizacion === 'Sincronizado' ? <CheckCircle2 className="w-3 h-3 mr-1"/> : <Cloud className="w-3 h-3 mr-1"/>} 
              {estadoSincronizacion}
            </span>
          </h2>
        </div>
        <button onClick={limpiarSemana} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded transition-colors border border-transparent hover:border-red-100">
          Borrar Cuadrícula Semanal
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 w-full">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col w-full min-w-0">
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 bg-slate-50 items-center w-full">
            <div className="w-full sm:w-40">
              <label className="block text-xs font-bold text-slate-500 uppercase">Semana del (Lunes)</label>
              <input type="date" value={formProyeccion.fechaInicio} onChange={(e) => handleParamChange('fechaInicio', e.target.value)} onBlur={(e) => handleBlurParamSave('fechaInicio', e.target.value)} className="w-full px-3 py-1.5 mt-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="w-full sm:w-40">
              <label className="block text-xs font-bold text-slate-500 uppercase">Objetivo Mes</label>
              <input type="number" value={formProyeccion.objetivoMensual} onChange={(e) => handleParamChange('objetivoMensual', parseFloat(e.target.value) || 0)} onBlur={(e) => handleBlurParamSave('objetivoMensual', parseFloat(e.target.value) || 0)} className="w-full px-3 py-1.5 mt-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
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
                    {/* COLOCACIÓN INMUTABLE LECTURA DESDE PBI - DISEÑO ELEGANTE Y LIMPIO */}
                    <td className="p-2 border border-slate-300 font-black text-emerald-700 text-right bg-emerald-50/30">
                      ${asesor.colAct > 0 ? formatCurrency(asesor.colAct) : '0'}
                    </td>
                    
                    {asesor.dias.map((d, dIdx) => (
                      <td key={dIdx} className="p-1 border border-slate-300">
                        <input type="number" value={d === 0 ? '' : d} onChange={(e) => handleLocalArrayChange(i, 'dias', dIdx, e.target.value)} onBlur={handleBlurSave} className="w-full min-w-[30px] p-1 text-center bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-blue-400 rounded transition-all" placeholder="-" />
                      </td>
                    ))}
                    
                    {asesor.proy.map((p, pIdx) => (
                      <td key={pIdx} className="p-1 border border-slate-300 bg-sky-50/30">
                        <input type="number" value={p === 0 ? '' : p} onChange={(e) => handleLocalArrayChange(i, 'proy', pIdx, e.target.value)} onBlur={handleBlurSave} className="w-full min-w-[30px] p-1 text-center font-bold text-sky-700 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-sky-400 rounded transition-all" placeholder="0" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
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
