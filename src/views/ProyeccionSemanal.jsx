import React, { useState, useEffect } from 'react';
import { BarChart, Plus, Info } from 'lucide-react';
import { ResultCard } from '../components/ui/ResultCard';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { EQUIPOS_ASESORES, OBJETIVOS_MENSUALES, SUPERVISORES } from '../constants/equipo';
import { PROYECTOS_CONVENIO_1, NOMBRES_PROYECTOS_PROYECCION } from '../constants/proyectos';
import { DATA_VERSION } from '../constants/config';
import { formatCurrency, formatVacio, formatDias, formatDiaMes } from '../utils/formatters';
import { obtenerDatosSupervisor } from '../utils/calculadoras';
import { generarTextoProyeccionCelular } from '../utils/textTemplates';
import { generarHtmlProyeccion } from '../utils/htmlTemplates';

export default function ProyeccionSemanal() {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('Oscar Saravia');
  const [supervisorDestino, setSupervisorDestino] = useState('mreyes@celina.com.bo');
  
  // MODAL INTELIGENTE: Ahora incluye Proyecto y Cantidad
  const [sumaVentaModal, setSumaVentaModal] = useState({ 
    show: false, index: null, nombre: '', monto: '', proyecto: NOMBRES_PROYECTOS_PROYECCION[0] || 'Muyurina', cantidad: 1 
  });

  const [formProyeccion, setFormProyeccion] = useState(() => {
    return {
      equipo: 'Oscar Saravia', fechaInicio: new Date().toISOString().split('T')[0],
      objetivoMensual: OBJETIVOS_MENSUALES['Oscar Saravia'],
      asesores: EQUIPOS_ASESORES['Oscar Saravia'].map(a => ({ nombre: a.nombre, colAct: a.colAct, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0] }))
    };
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const docRef = doc(db, "proyecciones", equipoSeleccionado);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const dataNube = docSnap.data();
          const newState = {
            equipo: equipoSeleccionado, 
            fechaInicio: new Date().toISOString().split('T')[0],
            objetivoMensual: OBJETIVOS_MENSUALES[equipoSeleccionado] || 0,
            asesores: dataNube.asesores
          };
          setFormProyeccion(newState);
          localStorage.setItem(`portalAsesores_proyeccion_${equipoSeleccionado}`, JSON.stringify(newState));
          return; 
        }
      } catch (error) {
        console.error("Error al descargar de la nube:", error);
      }

      const savedData = localStorage.getItem(`portalAsesores_proyeccion_${equipoSeleccionado}`);
      if (savedData && localStorage.getItem('portalAsesores_dataVersion') === DATA_VERSION) {
        setFormProyeccion(JSON.parse(savedData));
      } else {
        setFormProyeccion({
          equipo: equipoSeleccionado, fechaInicio: new Date().toISOString().split('T')[0],
          objetivoMensual: OBJETIVOS_MENSUALES[equipoSeleccionado] || 0,
          asesores: EQUIPOS_ASESORES[equipoSeleccionado] ? EQUIPOS_ASESORES[equipoSeleccionado].map(a => ({ nombre: a.nombre, colAct: a.colAct, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0] })) : []
        });
      }
    };
    
    cargarDatos();
  }, [equipoSeleccionado]);

  const saveProyeccionState = (newState) => {
    setFormProyeccion(newState);
    localStorage.setItem(`portalAsesores_proyeccion_${newState.equipo}`, JSON.stringify(newState));

    try {
      setDoc(doc(db, "proyecciones", newState.equipo), {
        asesores: newState.asesores,
        dataVersion: DATA_VERSION,
        ultimaActualizacion: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error al sincronizar en la nube:", error);
    }
  };

  const updateAsesor = (idx, field, val) => {
    const n = [...formProyeccion.asesores]; n[idx][field] = parseFloat(val) || 0;
    saveProyeccionState({ ...formProyeccion, asesores: n });
  };
  
  const updateAsesorArray = (idx, type, arrIdx, val) => {
    const n = [...formProyeccion.asesores]; n[idx][type][arrIdx] = parseFloat(val) || 0;
    saveProyeccionState({ ...formProyeccion, asesores: n });
  };

  // LOGICA DEL MODAL INTELIGENTE
  const confirmarSuma = () => {
    const m = parseFloat(sumaVentaModal.monto);
    const cant = parseInt(sumaVentaModal.cantidad) || 1;
    const proyIndex = NOMBRES_PROYECTOS_PROYECCION.indexOf(sumaVentaModal.proyecto);

    if (!isNaN(m) && m > 0) {
      const n = [...formProyeccion.asesores];
      // 1. Sumamos el dinero a la colocación
      n[sumaVentaModal.index].colAct = (Number(n[sumaVentaModal.index].colAct) || 0) + m;
      
      // 2. Sumamos la cantidad de lotes al proyecto específico para que Seguimiento lo detecte
      if (proyIndex !== -1) {
        n[sumaVentaModal.index].proy[proyIndex] = (Number(n[sumaVentaModal.index].proy[proyIndex]) || 0) + cant;
      }
      
      saveProyeccionState({ ...formProyeccion, asesores: n });
    }
    setSumaVentaModal({ show: false, index: null, nombre: '', monto: '', proyecto: NOMBRES_PROYECTOS_PROYECCION[0], cantidad: 1 });
  };

  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center"><BarChart className="w-6 h-6 mr-2 text-blue-600" /> Proyección de Ventas Semanal</h2>
          <p className="text-slate-500">Consolidado por equipo para envío a Gerencia.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-[2fr_1fr] 2xl:grid-cols-[2.5fr_1fr] gap-6 w-full">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col w-full min-w-0">
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 bg-slate-50 items-center w-full">
            <div className="flex-1 min-w-[200px]"><label className="block text-xs font-bold text-slate-500 uppercase">Equipo Supervisor</label><select value={equipoSeleccionado} onChange={(e) => setEquipoSeleccionado(e.target.value)} className="w-full px-3 py-1.5 mt-1 border rounded focus:ring-2 focus:ring-blue-500">{Object.keys(EQUIPOS_ASESORES).map(e => <option key={e} value={e}>{e}</option>)}</select></div>
            <div className="w-full sm:w-40"><label className="block text-xs font-bold text-slate-500 uppercase">Semana del (Lunes)</label><input type="date" value={formProyeccion.fechaInicio} onChange={(e) => saveProyeccionState({...formProyeccion, fechaInicio: e.target.value})} className="w-full px-3 py-1.5 mt-1 border rounded focus:ring-2 focus:ring-blue-500" /></div>
            <div className="w-full sm:w-40"><label className="block text-xs font-bold text-slate-500 uppercase">Objetivo Mes</label><input type="number" value={formProyeccion.objetivoMensual} onChange={(e) => saveProyeccionState({...formProyeccion, objetivoMensual: parseFloat(e.target.value) || 0})} className="w-full px-3 py-1.5 mt-1 border rounded focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap">
              <thead>
                <tr>
                  <th rowSpan="2" className="bg-[#f8fafc] text-slate-800 p-2 border border-slate-300">Asesor</th>
                  <th rowSpan="2" className="bg-[#f8fafc] text-slate-800 p-2 border border-slate-300 text-center">Colocación<br/>Actual</th>
                  <th colSpan="7" className="bg-[#f1f5f9] text-slate-700 p-2 border border-slate-300 text-center uppercase">Ventas / Proyección Diaria</th>
                  <th colSpan="5" className="bg-[#eff6ff] text-sky-800 p-2 border border-slate-300 text-center uppercase">Proyectos</th>
                </tr>
                <tr>
                  {[0,1,2,3,4,5,6].map(d => <th key={d} className="bg-[#f8fafc] text-slate-600 p-2 border border-slate-300 text-center font-semibold">{formatDiaMes(formProyeccion.fechaInicio, d)}</th>)}
                  {NOMBRES_PROYECTOS_PROYECCION.map(p => <th key={p} className="bg-[#eff6ff] text-sky-700 p-2 border border-slate-300 text-center font-semibold">{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {formProyeccion.asesores.map((asesor, i) => {
                  const sumDias = asesor.dias.reduce((a,b)=>a+(Number(b)||0),0);
                  const isProd = (Number(asesor.colAct)||0) + sumDias >= 25000;
                  return (
                  <tr key={i} className={`hover:bg-blue-50/50 ${isProd ? 'bg-emerald-50/30' : ''}`}>
                    <td className="p-2 border border-slate-300 font-bold text-slate-800">{i+1}. {asesor.nombre}</td>
                    <td className="p-1 border border-slate-300 bg-slate-50/50">
                      <div className="flex items-center gap-1"><input type="number" value={asesor.colAct||''} onChange={(e) => updateAsesor(i, 'colAct', e.target.value)} className="w-full min-w-[50px] p-1 text-right text-xs outline-none bg-transparent font-semibold" placeholder="0" /><button onClick={() => setSumaVentaModal({show: true, index: i, nombre: asesor.nombre, monto: '', proyecto: NOMBRES_PROYECTOS_PROYECCION[0], cantidad: 1})} className="p-1.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"><Plus className="w-3.5 h-3.5" /></button></div>
                    </td>
                    {asesor.dias.map((d, dIdx) => <td key={dIdx} className="p-1 border border-slate-300"><input type="number" value={d||''} onChange={(e) => updateAsesorArray(i, 'dias', dIdx, e.target.value)} className="w-full min-w-[40px] p-1 text-center outline-none bg-transparent" placeholder="-" /></td>)}
                    {asesor.proy.map((p, pIdx) => <td key={pIdx} className="p-1 border border-slate-300 bg-sky-50/30"><input type="number" value={p||''} onChange={(e) => updateAsesorArray(i, 'proy', pIdx, e.target.value)} className="w-full min-w-[40px] p-1 text-center font-bold text-sky-700 outline-none bg-transparent" placeholder="0" /></td>)}
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full min-w-0 flex flex-col h-full">
          <ResultCard title="Proyección Semanal" text={generarTextoProyeccionCelular(formProyeccion, supervisorData)} htmlContent={generarHtmlProyeccion(formProyeccion, supervisorData)} subject={`Proyección Semanal Equipo ${formProyeccion.equipo}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
        </div>
      </div>
      
      {/* MODAL INTELIGENTE UI */}
      {sumaVentaModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Añadir Nueva Venta</h3>
            <p className="text-sm text-slate-500 mb-5">Sumar a <strong className="text-slate-700">{sumaVentaModal.nombre}</strong></p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Monto Colocación ($)</label>
                <input type="number" autoFocus value={sumaVentaModal.monto} onChange={(e) => setSumaVentaModal({...sumaVentaModal, monto: e.target.value})} className="w-full px-4 py-3 border rounded-xl text-lg font-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Ej. 6600" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Proyecto Origen</label>
                  <select value={sumaVentaModal.proyecto} onChange={(e) => setSumaVentaModal({...sumaVentaModal, proyecto: e.target.value})} className="w-full px-3 py-3 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 bg-slate-50">
                    {NOMBRES_PROYECTOS_PROYECCION.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nº Ventas</label>
                  <input type="number" value={sumaVentaModal.cantidad} onChange={(e) => setSumaVentaModal({...sumaVentaModal, cantidad: e.target.value})} className="w-full px-3 py-3 border rounded-xl text-sm font-bold outline-none focus:border-blue-500 text-center bg-slate-50" min="1" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSumaVentaModal({show: false, index: null, nombre: '', monto: '', proyecto: NOMBRES_PROYECTOS_PROYECCION[0], cantidad: 1})} className="flex-1 px-4 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">Cancelar</button>
              <button onClick={confirmarSuma} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30">Guardar Venta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
