import React, { useState } from 'react';
import { UserMinus } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { ResultCard } from '../components/ui/ResultCard';
import { generarTextoRenunciaCelular } from '../utils/textTemplates';
import { generarHtmlRenuncia } from '../utils/htmlTemplates';

export default function CartaRenuncia() {
  const [formRenuncia, setFormRenuncia] = useState({ asesor: '', nombre: '', cargo: 'Asesor de Ventas', fechaIngreso: '', fechaRenuncia: '', motivo: '' });
  const handleRenunciaChange = (e) => setFormRenuncia({ ...formRenuncia, [e.target.name]: e.target.value });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
            <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
            PORTAL GESTIÓN ESTRATÉGICA • CELINA
          </span>
        </div><h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center"><UserMinus className="w-6 h-6 mr-2 text-cyan-400" /> Entrega de Carta de Renuncia</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        <div className="bg-[#070e1c] p-5 sm:p-6 rounded-3xl shadow-2xl border border-[#14233c] text-slate-100 w-full min-w-0">
          <Input label="Tu Nombre (Remitente)" name="asesor" value={formRenuncia.asesor} onChange={handleRenunciaChange} placeholder="Ej. Oscar Saravia" />
          <div className="mt-4 mb-4 pb-2 border-b border-[#14233c] pb-2"><h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider">Datos de la Renuncia</h3></div>
          <Input label="Nombre del Asesor que renuncia" name="nombre" value={formRenuncia.nombre} onChange={handleRenunciaChange} placeholder="Ej. Nataly Heredia" />
          <Input label="Cargo" name="cargo" value={formRenuncia.cargo} onChange={handleRenunciaChange} placeholder="Ej. Asesor de Ventas" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-2">
            <Input label="Fecha de Ingreso" name="fechaIngreso" value={formRenuncia.fechaIngreso} onChange={handleRenunciaChange} placeholder="Ej. 24 de marzo de 2026" />
            <Input label="Fecha de la Nota" name="fechaRenuncia" value={formRenuncia.fechaRenuncia} onChange={handleRenunciaChange} placeholder="Ej. 17 de octubre de 2026" />
          </div>
          <TextArea label="Motivo de la renuncia" name="motivo" value={formRenuncia.motivo} onChange={handleRenunciaChange} placeholder="Ej. Motivos de salud..." />
        </div>
        <div className="w-full min-w-0">
          <ResultCard title="Carta de Renuncia" text={generarTextoRenunciaCelular(formRenuncia)} htmlContent={generarHtmlRenuncia(formRenuncia)} subject={`Entrega de carta de renuncia - ${formRenuncia.nombre || 'Asesor'}`} fixedDestinoLabel="Ulrich Klein Montano" fixedDestinoEmail="uklein@grupopaz.com.bo" ccEmails="mfroca@celina.com.bo, rvaca@grupopaz.com.bo, mreyes@celina.com.bo" />
        </div>
      </div>
    </div>
  );
}
