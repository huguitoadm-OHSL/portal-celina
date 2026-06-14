import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { ResultCard } from '../components/ui/ResultCard';
import { generarTextoBloqueoLote } from '../utils/textTemplates';
import { generarHtmlBloqueoLote } from '../utils/htmlTemplates';

export default function BloqueoLote() {
  const [form, setForm] = useState({ proyecto: 'Celina Muyurina', uv: '', manzano: '', lote: '', superficie: '', categoria: '', cuotaInicial: '', motivo: '', asesor: 'Oscar Saravia' });
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="animate-in fade-in w-full">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><Lock className="w-6 h-6 mr-2 text-slate-800" /> Solicitud de Bloqueo de Lote</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <Input label="Proyecto" name="proyecto" value={form.proyecto} onChange={handle} />
          <div className="grid grid-cols-3 gap-4 my-4">
            <Input label="UV" name="uv" value={form.uv} onChange={handle} />
            <Input label="Manzano" name="manzano" value={form.manzano} onChange={handle} />
            <Input label="Lote" name="lote" value={form.lote} onChange={handle} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Superficie (m2)" name="superficie" value={form.superficie} onChange={handle} />
            <Input label="Categoría" name="categoria" value={form.categoria} onChange={handle} placeholder="Ej. Lote s/calle F - Zona AA" />
          </div>
          <div className="mb-4"><Input label="Cuota Inicial Referencial ($us)" name="cuotaInicial" value={form.cuotaInicial} onChange={handle} /></div>
          <TextArea label="Motivo de la solicitud (Detalle del cliente)" name="motivo" value={form.motivo} onChange={handle} placeholder="La cliente manifestó su decisión de compra..." />
        </div>
        <ResultCard title="Vista Previa del Mensaje" text={generarTextoBloqueoLote(form)} htmlContent={generarHtmlBloqueoLote(form)} subject={`Solicitud de bloqueo de lote – Proyecto ${form.proyecto} UV: ${form.uv} Manzano: ${form.manzano} Lote: ${form.lote}`} fixedDestinoLabel="Robert Vaca" fixedDestinoEmail="rvaca@grupopaz.com.bo" ccEmails="mreyes@celina.com.bo" />
      </div>
    </div>
  );
}
