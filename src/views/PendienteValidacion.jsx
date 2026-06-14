import React, { useState } from 'react';
import { PhoneForwarded } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { generarTextoPendienteValidacion } from '../utils/textTemplates';
import { generarHtmlPendienteValidacion } from '../utils/htmlTemplates';

export default function PendienteValidacion() {
  const [form, setForm] = useState({ cliente: '', contrato: '', celular: '', horaLlamada: '', asesor: 'Oscar Hugo Saravia L.' });
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="animate-in fade-in w-full">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><PhoneForwarded className="w-6 h-6 mr-2 text-rose-600" /> Clientes Pendientes de Validación</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <Input label="Nombre del Cliente" name="cliente" value={form.cliente} onChange={handle} />
          <div className="grid grid-cols-2 gap-4 my-4">
            <Input label="Contrato" name="contrato" value={form.contrato} onChange={handle} />
            <Input label="Celular" name="celular" value={form.celular} onChange={handle} />
          </div>
          <Input label="Hora acordada de llamada (Ej. 15:30 PM)" name="horaLlamada" value={form.horaLlamada} onChange={handle} />
          <div className="mt-4"><Input label="Nombre del Asesor" name="asesor" value={form.asesor} onChange={handle} /></div>
        </div>
        <ResultCard title="Vista Previa del Mensaje" text={generarTextoPendienteValidacion(form)} htmlContent={generarHtmlPendienteValidacion(form)} subject={`RV: Reporte de Clientes Pendientes de Validacion - ${form.cliente} - Celular: ${form.celular}`} fixedDestinoLabel="Alex Pérez" fixedDestinoEmail="aperez@celina.com.bo" ccEmails="elizarraga@celina.com.bo" />
      </div>
    </div>
  );
}
