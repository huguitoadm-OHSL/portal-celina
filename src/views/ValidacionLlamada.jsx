import React, { useState } from 'react';
import { PhoneCall } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { generarTextoLlamadaCelular } from '../utils/textTemplates';
import { generarHtmlLlamada } from '../utils/htmlTemplates';

export default function ValidacionLlamada() {
  const [formLlamada, setFormLlamada] = useState({ asesor: '', nombreReferido: '', contratoReferido: '', celularReferido: '', horaLlamada: '', nombreBeneficiario: '', ciBeneficiario: '' });
  const handleLlamadaChange = (e) => setFormLlamada({ ...formLlamada, [e.target.name]: e.target.value });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><PhoneCall className="w-6 h-6 mr-2 text-blue-600" /> Validación de Llamada (Referidos)</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
          <Input label="Nombre del Asesor" name="asesor" value={formLlamada.asesor} onChange={handleLlamadaChange} placeholder="Ej. Oscar Saravia" />
          <div className="mt-6 mb-4 pb-2 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-800">Datos del Cliente Referido</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <Input label="Nombre del Referido" name="nombreReferido" value={formLlamada.nombreReferido} onChange={handleLlamadaChange} placeholder="Ej. Maria Fernanda Ramos" />
            <Input label="Número de Contrato" name="contratoReferido" value={formLlamada.contratoReferido} onChange={handleLlamadaChange} placeholder="Ej. C2604002026" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <Input label="Celular del Referido" name="celularReferido" value={formLlamada.celularReferido} onChange={handleLlamadaChange} placeholder="Ej. 77712345" />
            <Input label="Hora para la llamada" name="horaLlamada" value={formLlamada.horaLlamada} onChange={handleLlamadaChange} placeholder="Ej. 16:00 PM" />
          </div>
          <div className="mt-6 mb-4 pb-2 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-800">Datos del Cliente Beneficiaria</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <Input label="Nombre de la Beneficiaria" name="nombreBeneficiario" value={formLlamada.nombreBeneficiario} onChange={handleLlamadaChange} placeholder="Ej. Crispina García" />
            <Input label="Carnet (CI) Beneficiaria" name="ciBeneficiario" value={formLlamada.ciBeneficiario} onChange={handleLlamadaChange} placeholder="Ej. C2604201165" />
          </div>
        </div>
        <div className="w-full min-w-0">
          <ResultCard title="Validación Llamada" text={generarTextoLlamadaCelular(formLlamada)} htmlContent={generarHtmlLlamada(formLlamada)} subject={`Solicitud de validación llamada Cliente referido: ${formLlamada.nombreReferido || 'NOMBRE'}, ${formLlamada.contratoReferido || 'CONTRATO'}`} fixedDestinoLabel="Olivia Mendoza Duran" fixedDestinoEmail="omendoza@celina.com.bo" ccEmails="elizarraga@celina.com.bo, aperez@celina.com.bo" />
        </div>
      </div>
    </div>
  );
}
