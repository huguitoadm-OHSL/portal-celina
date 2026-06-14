import React, { useState } from 'react';
import { AlertOctagon, Plus, Trash2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { generarTextoMemorandum } from '../utils/textTemplates';
import { generarHtmlMemorandum } from '../utils/htmlTemplates';

export default function SolicitudMemorandum() {
  const [form, setForm] = useState({ mes: 'Mayo', asesor: 'Oscar Hugo Saravia', asesores: [{ nombre: '', colocacion: '', compromiso: '' }] });
  
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleRow = (i, field, value) => {
    const newAsesores = [...form.asesores];
    newAsesores[i][field] = value;
    setForm({ ...form, asesores: newAsesores });
  };
  const addRow = () => setForm({ ...form, asesores: [...form.asesores, { nombre: '', colocacion: '', compromiso: '' }] });
  const removeRow = (i) => setForm({ ...form, asesores: form.asesores.filter((_, idx) => idx !== i) });

  return (
    <div className="animate-in fade-in w-full">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><AlertOctagon className="w-6 h-6 mr-2 text-rose-600" /> Solicitud de Memorándum</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <Input label="Mes de Evaluación" name="mes" value={form.mes} onChange={handle} placeholder="Ej. Mayo" />
          
          <div className="mt-6 mb-2 flex justify-between items-center">
            <label className="block text-sm font-bold text-slate-700">Asesores con Incumplimiento</label>
            <button onClick={addRow} className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-bold flex items-center hover:bg-slate-200"><Plus size={14} className="mr-1"/> Agregar Asesor</button>
          </div>

          <div className="space-y-4">
            {form.asesores.map((a, i) => (
              <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                {form.asesores.length > 1 && <button onClick={() => removeRow(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600"><Trash2 size={16}/></button>}
                <div className="mb-3"><Input label="Nombre del Asesor" value={a.nombre} onChange={(e) => handleRow(i, 'nombre', e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Colocación Actual ($)" value={a.colocacion} onChange={(e) => handleRow(i, 'colocacion', e.target.value)} placeholder="Ej. 6.000,00" />
                  <Input label="Compromiso ($)" value={a.compromiso} onChange={(e) => handleRow(i, 'compromiso', e.target.value)} placeholder="Ej. 30.000,00" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <ResultCard title="Vista Previa del Mensaje" text={generarTextoMemorandum(form)} htmlContent={generarHtmlMemorandum(form)} subject={`Solicitud de Memorándum por incumplimiento de métricas ${form.mes} - ${form.asesores.map(a=>a.nombre).join('; ')}`} fixedDestinoLabel="Ulrich Klein Montano" fixedDestinoEmail="uklein@grupopaz.com.bo" ccEmails="mfroca@celina.com.bo, rvaca@grupopaz.com.bo" />
      </div>
    </div>
  );
}
