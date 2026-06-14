import React, { useState, useEffect } from 'react';
import { BarChart, Plus, RefreshCw } from 'lucide-react';
import { ResultCard } from '../components/ui/ResultCard';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { EQUIPOS_ASESORES, OBJETIVOS_MENSUALES, SUPERVISORES } from '../constants/equipo';
import { NOMBRES_PROYECTOS_PROYECCION } from '../constants/proyectos';
import { DATA_VERSION } from '../constants/config';
import { formatDiaMes } from '../utils/formatters';
import { obtenerDatosSupervisor } from '../utils/calculadoras';
import { generarTextoProyeccionCelular } from '../utils/textTemplates';
import { generarHtmlProyeccion } from '../utils/htmlTemplates';

export default function ProyeccionSemanal() {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('Oscar Saravia');
  const [supervisorDestino, setSupervisorDestino] = useState('mreyes@celina.com.bo');
  const [cargandoNube, setCargandoNube] = useState(true);
  
  const [sumaVentaModal, setSumaVentaModal] = useState({ 
    show: false, index: null, nombre: '', monto: '', proyecto: NOMBRES_PROYECTOS_PROYECCION[0] || 'Muyurina', cantidad: 1 
  });

  const [formProyeccion, setFormProyeccion] = useState({
    equipo: 'Oscar Saravia', fechaInicio: new Date().toISOString().split('T')[0],
    objetivoMensual: OBJETIVOS_MENSUALES['Oscar Saravia'] || 0,
    asesores: EQUIPOS_ASESORES['Oscar Saravia'].map(a => ({ nombre: a.nombre, colAct: a.colAct, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0], ventasReales: [0,0,0,0,0] }))
  });

  // CANDADO DE SINCRONIZACIÓN Y CREACIÓN DE BÓVEDA HISTÓRICA
  useEffect(() => {
    setCargandoNube(true);
    const unsubscribe = onSnapshot(doc(db, "proyecciones", equipoSeleccionado), (docSnap) => {
      if (docSnap.exists()) {
        const dataNube = docSnap.data();
        const asesoresAsegurados = dataNube.asesores.map(a => ({
          ...a,
          ventasReales: a.ventasReales || [0,0,0,0,0] // Protege el historial
        }));
        setFormProyeccion(prev => ({ ...prev, asesores: asesoresAsegurados, objetivoMensual: dataNube.objetivoMensual || prev.objetivoMensual, fechaInicio: dataNube.fechaInicio || prev.fechaInicio }));
      }
      setCargandoNube(false);
    }, (error) => {
      console.error("Error conectando a la Nube:", error);
      setCargandoNube(false);
    });
    return () => unsubscribe();
  }, [equipoSeleccionado]);

  const saveProyeccionState = (newState) => {
    if (cargandoNube) return; 
    setFormProyeccion(newState);
    try {
      setDoc(doc(db, "proyecciones", newState.equipo), {
        asesores: newState.asesores,
        objetivoMensual: newState.objetivoMensual,
        fechaInicio: newState.fechaInicio,
        dataVersion: DATA_VERSION,
        ultimaActualizacion: new Date().toISOString()
      });
    } catch (error) { console.error(error); }
  };

  const updateAsesor = (idx, field, val) => {
    const n = [...formProyeccion.asesores]; n[idx][field] = parseFloat(val) || 0;
    saveProyeccionState({ ...formProyeccion, asesores: n });
  };
  
  const updateAsesorArray = (idx, type, arrIdx, val) => {
    const n = [...formProyeccion.asesores]; n[idx][type][arrIdx] = parseFloat(val) || 0;
    saveProyeccionState({ ...formProyeccion, asesores: n });
  };

  // MODAL INTELIGENTE: ENVÍA DIRECTO A LA BÓVEDA HISTÓRICA
  const confirmarSuma = () => {
    const m = parseFloat(sumaVentaModal.monto) || 0;
    const cant = parseInt(sumaVentaModal.cantidad) || 0;
    const proyIndex = NOMBRES_PROYECTOS_PROYECCION.indexOf(sumaVentaModal.proyecto);

    if (m >= 0 || cant > 0) {
      const n = [...formProyeccion.asesores];
      n[sumaVentaModal.index].colAct = (Number(n[sumaVentaModal.index].colAct) || 0) + m;
      
      if (!n[sumaVentaModal.index].ventasReales) {
        n[sumaVentaModal.index].ventasReales = [0,0,0,0,0];
      }
      
      if (proyIndex !== -1) {
        n[sumaVentaModal.index].ventasReales[proyIndex] += cant;
      }
      saveProyeccionState({ ...formProyeccion, asesores: n });
    }
    setSumaVentaModal({ show: false, index: null, nombre: '', monto: '', proyecto: NOMBRES_PROYECTOS_PROYECCION[0], cantidad: 1 });
  };

  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);

  if (cargandoNube) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500 animate-pulse">
        <RefreshCw className="w-12 h-12 text-blue-500 mb-4 animate-spin" />
        <p className="text-lg font-bold">Conectando a Firebase...</p>
        <p className="text-sm">Sincronizando bóveda de ventas acumuladas</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex justify-between items-end">
        <div><h2 className="text-2xl font-bold text-slate-800 flex items-center"><BarChart className="w-6 h-6 mr-2 text-blue-600" /> Proyección Semanal</h2></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-[2fr_1fr] 2xl:grid-cols-[2.5fr_1fr] gap-6 w-full">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col w-full min-w-0">
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 bg-slate-50 items-center w-full">
            <div className="flex-1 min-w-[200px]"><label className="block text-xs font-bold text-slate-500 uppercase">Equipo Supervisor</label><select value={equipoSeleccionado} onChange={(e) => setEquipoSeleccionado(e.target.value)} className="w-full px-3 py-1.5 mt-1 border rounded focus:ring-2 focus:ring-blue-500">{Object.keys(EQUIPOS_ASESORES).map(e => <option key={e} value={e}>{e}</option>)}</select></div>
            <div className="w-full sm:w-40"><label className="block text-xs font-bold text-slate-500 uppercase">Objetivo Mes</label><input type="number" value={formProyeccion.objetivoMensual} onChange={(e) => saveProyeccionState({...formProyeccion, objetivoMensual: parseFloat(e.target.value) || 0})} className="w-full px-3 py-1.5 mt-1 border rounded focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap">
              <thead>
                <tr>
                  <th rowSpan="2" className="bg-[#f8fafc] text-slate-800 p-2 border border-slate-300">Asesor</th>
                  <th rowSpan="2" className="bg-[#f8fafc] text-slate-800 p-2 border border-slate-300 text-center">Colocación</th>
                  <th colSpan="7" className="bg-[#f1f5f9] text-slate-700 p-2 border border-slate-300 text-center uppercase">Proyección Diaria</th>
                  <th colSpan="5" className="bg-[#eff6ff] text-sky-800 p-2 border border-slate-300 text-center uppercase">Proyectos (Proyección)</th>
                </tr>
                <tr>
                  {[0,1,2,3,4,5,6].map(d => <th key={d} className="bg-[#f8fafc] text-slate-600 p-2 border border-slate-300 text-center">{formatDiaMes(formProyeccion.fechaInicio, d)}</th>)}
                  {NOMBRES_PROYECTOS_PROYECCION.map(p => <th key={p} className="bg-[#eff6ff] text-sky-700 p-2 border border-slate-300 text-center">{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {formProyeccion.asesores.map((asesor, i) => {
                  return (
                  <tr key={i} className={`hover:bg-blue-50/50`}>
                    <td className="p-2 border border-slate-300 font-bold text-slate-800">{i+1}. {asesor.nombre}</td>
                    <td className="p-1 border border-slate-300 bg-slate-50/50">
                      <div className="flex items-center gap-1"><input type="number" value={asesor.colAct||''} onChange={(e) => updateAsesor(i, 'colAct', e.target.value)} className="w-full min-w-[50px] p-1 text-right text-xs outline-none bg-transparent font-bold text-sky-700" placeholder="0" /><button onClick={() => setSumaVentaModal({show: true, index: i, nombre: asesor.nombre, monto: '', proyecto: NOMBRES_PROYECTOS_PROYECCION[0], cantidad: 1})} className="p-1.5 bg-emerald-100 text-emerald-700 rounded"><Plus className="w-3.5 h-3.5" /></button></div>
                    </td>
                    {asesor.dias.map((d, dIdx) => <td key={dIdx} className="p-1 border border-slate-300"><input type="number" value={d||''} onChange={(e) => updateAsesorArray(i, 'dias', dIdx, e.target.value)} className="w-full min-w-[40px] p-1 text-center bg-transparent" placeholder="-" /></td>)}
                    {asesor.proy.map((p, pIdx) => <td key={pIdx} className="p-1 border border-slate-300 bg-sky-50/30"><input type="number" value={p||''} onChange={(e) => updateAsesorArray(i, 'proy', pIdx, e.target.value)} className="w-full min-w-[40px] p-1 text-center text-sky-700 font-bold bg-transparent" placeholder="0" /></td>)}
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full min-w-0 flex flex-col h-full"><ResultCard title="Proyección Semanal" text={generarTextoProyeccionCelular(formProyeccion, supervisorData)} htmlContent={generarHtmlProyeccion(formProyeccion, supervisorData)} subject={`Proyección Semanal Equipo`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} /></div>
      </div>
      
      {/* MODAL INTELIGENTE */}
      {sumaVentaModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Añadir Venta Real</h3>
            <p className="text-sm text-slate-500 mb-5">Sumar al Historial de <strong className="text-slate-700">{sumaVentaModal.nombre}</strong></p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Añadir a Colocación Actual ($)</label>
                <input type="number" value={sumaVentaModal.monto} onChange={(e) => setSumaVentaModal({...sumaVentaModal, monto: e.target.value})} className="w-full px-4 py-3 border rounded-xl text-lg font-black" placeholder="Ej. 6600 (Dejar vacío si no aplica)" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Proyecto Origen</label>
                  <select value={sumaVentaModal.proyecto} onChange={(e) => setSumaVentaModal({...sumaVentaModal, proyecto: e.target.value})} className="w-full px-3 py-3 border rounded-xl text-sm font-bold bg-slate-50">{NOMBRES_PROYECTOS_PROYECCION.map(p => <option key={p} value={p}>{p}</option>)}</select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Nº Lotes</label>
                  <input type="number" value={sumaVentaModal.cantidad} onChange={(e) => setSumaVentaModal({...sumaVentaModal, cantidad: e.target.value})} className="w-full px-3 py-3 border rounded-xl text-sm font-bold text-center bg-slate-50" min="1" />
                </div>
              </div>
            </div>
            <div className="flex gap-3"><button onClick={() => setSumaVentaModal({show: false, index: null, nombre: '', monto: '', proyecto: NOMBRES_PROYECTOS_PROYECCION[0], cantidad: 1})} className="flex-1 px-4 py-2.5 rounded-xl font-bold bg-slate-100">Cancelar</button><button onClick={confirmarSuma} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-emerald-600">Guardar Venta</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
