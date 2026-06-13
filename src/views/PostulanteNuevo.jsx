import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { generarTextoPostulanteCelular } from '../utils/textTemplates';
import { generarHtmlPostulante } from '../utils/htmlTemplates';

export default function PostulanteNuevo() {
  const [formPostulante, setFormPostulante] = useState({ asesor: '', nombre: '', referidor: '' });
  const handleChange = (e) => setFormPostulante({ ...formPostulante, [e.target.name]: e.target.value });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><UserCheck className="w-6 h-6 mr-2 text-blue-600" /> Postulante para Capacitación</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
          <Input label="Tu Nombre (Remitente)" name="asesor" value={formPostulante.asesor} onChange={handleChange} placeholder="Ej. Oscar Saravia" />
          <div className="mt-4 mb-4 pb-2 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-800">Datos del Postulante</h3></div>
          <Input label="Nombre del Postulante" name="nombre" value={formPostulante.nombre} onChange={handleChange} placeholder="Ej. Daniel Angulo Maldonado" />
          <Input label="Referido por (Nombre Asesor)" name="referidor" value={formPostulante.referidor} onChange={handleChange} placeholder="Ej. Marisol Urgel" />
        </div>
        <div className="w-full min-w-0">
          <ResultCard title="Postulante Capacitación" text={generarTextoPostulanteCelular(formPostulante)} htmlContent={generarHtmlPostulante(formPostulante)} subject={`Postulante para capacitación: ${formPostulante.nombre} (Referido por ${formPostulante.referidor})`} fixedDestinoLabel="Ulrich Klein Montano" fixedDestinoEmail="uklein@grupopaz.com.bo" ccEmails="mfroca@celina.com.bo, rvaca@grupopaz.com.bo, mreyes@celina.com.bo" />
        </div>
      </div>
    </div>
  );
}
