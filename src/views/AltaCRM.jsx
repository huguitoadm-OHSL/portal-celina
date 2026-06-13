import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { generarTextoAltaCRMCelular } from '../utils/textTemplates';
import { generarHtmlAltaCRM } from '../utils/htmlTemplates';

export default function AltaCRM() {
  const [formAltaCRM, setFormAltaCRM] = useState({ asesor: '', nombre: '', apPaterno: '', apMaterno: '', ci: '', fechaNacimiento: '', correo: '' });
  const handleChange = (e) => setFormAltaCRM({ ...formAltaCRM, [e.target.name]: e.target.value });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><UserPlus className="w-6 h-6 mr-2 text-blue-600" /> Solicitud Alta de Usuarios CRM</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
          <Input label="Tu Nombre (Remitente)" name="asesor" value={formAltaCRM.asesor} onChange={handleChange} placeholder="Ej. Oscar Saravia" />
          <div className="mt-4 mb-4 pb-2 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-800">Datos del Nuevo Asesor</h3></div>
          <Input label="Nombre(s)" name="nombre" value={formAltaCRM.nombre} onChange={handleChange} placeholder="Ej. DANIEL" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-2">
            <Input label="Apellido Paterno" name="apPaterno" value={formAltaCRM.apPaterno} onChange={handleChange} placeholder="Ej. ANGULO" />
            <Input label="Apellido Materno" name="apMaterno" value={formAltaCRM.apMaterno} onChange={handleChange} placeholder="Ej. MALDONADO" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-2">
            <Input label="Carnet de Identidad" name="ci" value={formAltaCRM.ci} onChange={handleChange} placeholder="Ej. 6237199 S/E" />
            <Input label="Fecha de Nacimiento" name="fechaNacimiento" value={formAltaCRM.fechaNacimiento} onChange={handleChange} placeholder="Ej. 07 abr 1985" />
          </div>
          <Input label="Correo Electrónico" name="correo" value={formAltaCRM.correo} onChange={handleChange} placeholder="Ej. danielangulom7@gmail.com" />
        </div>
        <div className="w-full min-w-0">
          <ResultCard title="Alta Usuarios CRM" text={generarTextoAltaCRMCelular(formAltaCRM)} htmlContent={generarHtmlAltaCRM(formAltaCRM)} subject={`Solicitud de Alta CRM – ${formAltaCRM.nombre} ${formAltaCRM.apPaterno} ${formAltaCRM.apMaterno}`.trim()} fixedDestinoLabel="Ulrich Klein Montano" fixedDestinoEmail="uklein@grupopaz.com.bo" ccEmails="mfroca@celina.com.bo, rvaca@grupopaz.com.bo, mreyes@celina.com.bo" />
        </div>
      </div>
    </div>
  );
}
