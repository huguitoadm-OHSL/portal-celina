import React, { useState } from 'react';
import { Shield, Plus, Trash2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { SUPERVISORES } from '../constants/equipo';
import { obtenerDatosSupervisor } from '../utils/calculadoras';
import { generarTextoSeguroCelular } from '../utils/textTemplates';
import { generarHtmlSeguro } from '../utils/htmlTemplates';

export default function SeguroVida() {
  const [formSeguro, setFormSeguro] = useState({ asesor: '', cliente: '', nroContrato: '', uv: '', manzano: '', lote: '', beneficiarios: [{ nombre: '', parentesco: '', porcentaje: '', ci: '' }] });
  const [supervisorDestino, setSupervisorDestino] = useState(SUPERVISORES[0].correo);

  const handleSeguroChange = (e) => setFormSeguro({ ...formSeguro, [e.target.name]: e.target.value });
  const handleBeneficiarioChange = (index, field, value) => { const nuevos = [...formSeguro.beneficiarios]; nuevos[index][field] = value; setFormSeguro({ ...formSeguro, beneficiarios: nuevos }); };
  const agregarBeneficiario = () => setFormSeguro({ ...formSeguro, beneficiarios: [...formSeguro.beneficiarios, { nombre: '', parentesco: '', porcentaje: '', ci: '' }] });
  const eliminarBeneficiario = (index) => { if (formSeguro.beneficiarios.length > 1) setFormSeguro({ ...formSeguro, beneficiarios: formSeguro.beneficiarios.filter((_, i) => i !== index) }); };

  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><Shield className="w-6 h-6 mr-2 text-blue-600" /> Adición Beneficiarios Seguro</h2></div>
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] 2xl:grid-cols-[1.5fr_1fr] gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
          <div className="mb-4"><Input label="Nombre del Asesor" name="asesor" value={formSeguro.asesor} onChange={handleSeguroChange} placeholder="Ej. Oscar Saravia" /></div>
          <div className="mt-6 mb-4 pb-2 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-800">Datos de la Venta</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-2">
            <Input label="Nombre del Cliente(s)" name="cliente" value={formSeguro.cliente} onChange={handleSeguroChange} placeholder="Ej. Celso Aguilera Barboza" />
            <Input label="Nro. Contrato" name="nroContrato" value={formSeguro.nroContrato} onChange={handleSeguroChange} placeholder="Ej. C2504200808" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mb-4">
            <Input label="UV" name="uv" value={formSeguro.uv} onChange={handleSeguroChange} placeholder="Ej. SN" />
            <Input label="Manzano" name="manzano" value={formSeguro.manzano} onChange={handleSeguroChange} placeholder="Ej. 52" />
            <Input label="Lote" name="lote" value={formSeguro.lote} onChange={handleSeguroChange} placeholder="Ej. 10" />
          </div>
          <div className="mt-6 mb-4 pb-2 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-800">Beneficiarios del Seguro</h3></div>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 w-full">
            {formSeguro.beneficiarios.map((b, index) => (
              <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group w-full">
                {formSeguro.beneficiarios.length > 1 && (<button onClick={() => eliminarBeneficiario(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full z-10"><Trash2 className="w-4 h-4" /></button>)}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full">
                  <div className="w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">Nombre</label><input type="text" value={b.nombre} onChange={(e) => handleBeneficiarioChange(index, 'nombre', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white uppercase" /></div>
                  <div className="w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">Parentesco</label><input type="text" value={b.parentesco} onChange={(e) => handleBeneficiarioChange(index, 'parentesco', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white uppercase" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  <div className="w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">Porcentaje (%)</label><input type="number" value={b.porcentaje} onChange={(e) => handleBeneficiarioChange(index, 'porcentaje', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white" /></div>
                  <div className="w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">C.I.</label><input type="text" value={b.ci} onChange={(e) => handleBeneficiarioChange(index, 'ci', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white uppercase" /></div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={agregarBeneficiario} className="mt-4 w-full flex items-center justify-center py-3 border-2 border-dashed rounded-xl text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"><Plus className="w-4 h-4 mr-1" /> Añadir otro beneficiario</button>
        </div>
        <div className="w-full min-w-0">
          <ResultCard title="Adición Beneficiarios Seguro" text={generarTextoSeguroCelular(formSeguro, supervisorData)} htmlContent={generarHtmlSeguro(formSeguro, supervisorData)} subject={`solicitud de adición de ${formSeguro.beneficiarios.length} beneficiarios al seguro de vida ${formSeguro.nroContrato}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
        </div>
      </div>
    </div>
  );
}
