import React, { useState } from 'react';
import { FileText } from 'lucide-react';

// Importamos nuestros componentes de UI
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { ResultCard } from '../components/ui/ResultCard';

// Importamos la lógica y datos estáticos
import { SUPERVISORES } from '../constants/equipo';
import { obtenerDatosSupervisor } from '../utils/calculadoras';
import { generarTextoFisicoCelular } from '../utils/textTemplates';
import { generarHtmlFisico } from '../utils/htmlTemplates';

export default function ContratoFisico() {
  // Estado local SOLO para esta vista
  const [form, setForm] = useState({ nombre: '', ci: '', contrato: '', motivo: '', asesor: '' });
  const [supervisorDestino, setSupervisorDestino] = useState(SUPERVISORES[0].correo);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Preparamos los datos para la tarjeta de resultado
  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);
  const textoWhatsApp = generarTextoFisicoCelular(form, supervisorData);
  const textoHtml = generarHtmlFisico(form, supervisorData);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-blue-600" /> Habilitación de Contrato Físico
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        {/* FORMULARIO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
          <Input label="Nombre del Asesor" name="asesor" value={form.asesor} onChange={handleChange} placeholder="Ej. Oscar Saravia" />
          <Input label="Nombre Completo del Cliente" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej. Juan Pérez" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <Input label="Número de Carnet (CI)" name="ci" value={form.ci} onChange={handleChange} placeholder="Ej. 1234567" />
            <Input label="Número de Contrato" name="contrato" value={form.contrato} onChange={handleChange} placeholder="Ej. CT-9876" />
          </div>
          <TextArea label="Motivo detallado" name="motivo" value={form.motivo} onChange={handleChange} placeholder="Ej. El cliente es una persona mayor..." />
        </div>

        {/* TARJETA DE RESULTADO */}
        <div className="w-full min-w-0">
          <ResultCard 
            title="Contrato Físico" 
            text={textoWhatsApp} 
            htmlContent={textoHtml} 
            subject={`Solicitud Contrato Físico - ${form.nombre || 'Cliente'}`} 
            supervisorDestino={supervisorDestino} 
            setSupervisorDestino={setSupervisorDestino} 
          />
        </div>
      </div>
    </div>
  );
}
