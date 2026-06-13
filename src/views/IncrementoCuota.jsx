import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { ResultCard } from '../components/ui/ResultCard';
import { PROYECTOS } from '../constants/proyectos';
import { SUPERVISORES } from '../constants/equipo';
import { obtenerDatosSupervisor } from '../utils/calculadoras';
import { generarTextoCuotaCelular } from '../utils/textTemplates';
import { generarHtmlCuota } from '../utils/htmlTemplates';

export default function IncrementoCuota() {
  const [formCuota, setFormCuota] = useState({ nroContrato: '', ci: '', cliente: '', proyecto: 'El Renacer', uv: '', manzano: '', lote: '', cuotaInicial: '', nuevaCuota: '', motivo: '', asesorVentas: '' });
  const [supervisorDestino, setSupervisorDestino] = useState(SUPERVISORES[0].correo);

  const handleCuotaChange = (e) => setFormCuota({ ...formCuota, [e.target.name]: e.target.value });
  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><TrendingUp className="w-6 h-6 mr-2 text-blue-600" /> Incremento de Cuota Inicial</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <Input label="Nro. Contrato" name="nroContrato" value={formCuota.nroContrato} onChange={handleCuotaChange} />
            <Input label="Carnet (CI)" name="ci" value={formCuota.ci} onChange={handleCuotaChange} />
          </div>
          <Input label="Nombre del Cliente" name="cliente" value={formCuota.cliente} onChange={handleCuotaChange} />
          <div className="mb-5 w-full">
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Proyecto</label>
            <select name="proyecto" value={formCuota.proyecto} onChange={handleCuotaChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 bg-slate-50/50 text-sm">{PROYECTOS.map(p => <option key={p} value={p}>{String(p)}</option>)}</select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
            <Input label="UV" name="uv" value={formCuota.uv} onChange={handleCuotaChange} />
            <Input label="Manzano" name="manzano" value={formCuota.manzano} onChange={handleCuotaChange} />
            <Input label="Lote" name="lote" value={formCuota.lote} onChange={handleCuotaChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2 w-full">
            <Input label="Cuota Registrada ($)" name="cuotaInicial" value={formCuota.cuotaInicial} onChange={handleCuotaChange} type="number" />
            <Input label="Nueva Cuota ($)" name="nuevaCuota" value={formCuota.nuevaCuota} onChange={handleCuotaChange} type="number" />
          </div>
          <TextArea label="Motivo del incremento" name="motivo" value={formCuota.motivo} onChange={handleCuotaChange} />
          <div className="border-t border-slate-100 pt-5 mt-2 w-full"><Input label="Nombre del Asesor" name="asesorVentas" value={formCuota.asesorVentas} onChange={handleCuotaChange} /></div>
        </div>
        <div className="w-full min-w-0">
          <ResultCard title="Incremento Cuota" text={generarTextoCuotaCelular(formCuota, supervisorData)} htmlContent={generarHtmlCuota(formCuota, supervisorData)} subject={`Incremento Cuota Inicial - ${formCuota.proyecto} Mz${formCuota.manzano} Lt${formCuota.lote}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
        </div>
      </div>
    </div>
  );
}
