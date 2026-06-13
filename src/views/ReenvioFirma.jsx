import React, { useState } from 'react';
import { FileSignature, Plus, Trash2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { PROYECTOS } from '../constants/proyectos';
import { SUPERVISORES } from '../constants/equipo';
import { obtenerDatosSupervisor } from '../utils/calculadoras';
import { generarTextoReenvioCelular } from '../utils/textTemplates';
import { generarHtmlReenvio } from '../utils/htmlTemplates';

export default function ReenvioFirma() {
  const [formReenvio, setFormReenvio] = useState({ proyecto: 'Los Jardines', asesor: '', contratos: [{ nroContrato: '', cliente: '', ci: '', uv: '', manzano: '', lote: '' }] });
  const [supervisorDestino, setSupervisorDestino] = useState(SUPERVISORES[0].correo);

  const handleReenvioChange = (index, field, value) => {
    const nuevosContratos = [...formReenvio.contratos];
    nuevosContratos[index][field] = value;
    setFormReenvio({ ...formReenvio, contratos: nuevosContratos });
  };
  const agregarContratoReenvio = () => setFormReenvio({ ...formReenvio, contratos: [...formReenvio.contratos, { nroContrato: '', cliente: '', ci: '', uv: '', manzano: '', lote: '' }] });
  const eliminarContratoReenvio = (index) => { if (formReenvio.contratos.length > 1) setFormReenvio({ ...formReenvio, contratos: formReenvio.contratos.filter((_, i) => i !== index) }); };

  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><FileSignature className="w-6 h-6 mr-2 text-blue-600" /> Reenvío Firma Digital</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-[1.2fr_1fr] 2xl:grid-cols-[1.5fr_1fr] gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 border-b border-slate-100 pb-3 gap-3">
            <h3 className="text-lg font-medium text-slate-800">Listado de Contratos</h3>
            <div className="w-full sm:w-1/2 md:w-1/3">
              <select value={formReenvio.proyecto} onChange={(e) => setFormReenvio({...formReenvio, proyecto: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                {PROYECTOS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4"><Input label="Nombre del Asesor" name="asesor" value={formReenvio.asesor} onChange={(e) => setFormReenvio({...formReenvio, asesor: e.target.value})} placeholder="Ej. Oscar Saravia" /></div>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 w-full">
            {formReenvio.contratos.map((contrato, index) => (
              <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group w-full">
                {formReenvio.contratos.length > 1 && (<button onClick={() => eliminarContratoReenvio(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full z-10"><Trash2 className="w-4 h-4" /></button>)}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full">
                  <div className="w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">Nro. Contrato</label><input type="text" value={contrato.nroContrato} onChange={(e) => handleReenvioChange(index, 'nroContrato', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white" /></div>
                  <div className="w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">Carnet (CI)</label><input type="text" value={contrato.ci} onChange={(e) => handleReenvioChange(index, 'ci', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white" /></div>
                </div>
                <div className="mb-3 w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del Cliente</label><input type="text" value={contrato.cliente} onChange={(e) => handleReenvioChange(index, 'cliente', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm uppercase bg-white" /></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                  <div className="flex flex-col w-full"><label className="text-xs text-slate-500 mb-1">UV:</label><input type="text" value={contrato.uv} onChange={(e) => handleReenvioChange(index, 'uv', e.target.value)} className="w-full px-2.5 py-1 border rounded text-sm bg-white" /></div>
                  <div className="flex flex-col w-full"><label className="text-xs text-slate-500 mb-1">Mzn:</label><input type="text" value={contrato.manzano} onChange={(e) => handleReenvioChange(index, 'manzano', e.target.value)} className="w-full px-2.5 py-1 border rounded text-sm bg-white" /></div>
                  <div className="flex flex-col w-full"><label className="text-xs text-slate-500 mb-1">Lote:</label><input type="text" value={contrato.lote} onChange={(e) => handleReenvioChange(index, 'lote', e.target.value)} className="w-full px-2.5 py-1 border rounded text-sm bg-white" /></div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={agregarContratoReenvio} className="mt-4 w-full flex items-center justify-center py-3 border-2 border-dashed rounded-xl text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"><Plus className="w-4 h-4 mr-1" /> Añadir otro contrato</button>
        </div>
        <div className="w-full min-w-0">
          <ResultCard title="Reenvío Firma Digital" text={generarTextoReenvioCelular(formReenvio, supervisorData)} htmlContent={generarHtmlReenvio(formReenvio, supervisorData)} subject={`Solicitud Reenvío de Correo Firma Digital - ${formReenvio.proyecto}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
        </div>
      </div>
    </div>
  );
}
