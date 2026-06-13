import React, { useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { ResultCard } from '../components/ui/ResultCard';
import { generarTextoEvaluacionCelular } from '../utils/textTemplates';
import { generarHtmlEvaluacion } from '../utils/htmlTemplates';

export default function EvaluacionFinMes() {
  const [formEvaluacion, setFormEvaluacion] = useState({ asesor: '', nombre: '', punteo: '', calificacion: 'Muy Bueno', lotes: '', monto: '', leads: '', visitas: '', observaciones: '' });
  const handleChange = (e) => setFormEvaluacion({ ...formEvaluacion, [e.target.name]: e.target.value });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><ClipboardCheck className="w-6 h-6 mr-2 text-blue-600" /> Reporte de Evaluación</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
          <Input label="Tu Nombre (Remitente)" name="asesor" value={formEvaluacion.asesor} onChange={handleChange} placeholder="Ej. Oscar Hugo Saravia" />
          <div className="mt-4 mb-4 pb-2 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-800">Resultados de la Evaluación</h3></div>
          <Input label="Nombre del Asesor Evaluado" name="nombre" value={formEvaluacion.nombre} onChange={handleChange} placeholder="Ej. Jaime Fabricio Rios" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-2">
            <Input label="Punteo Total" name="punteo" value={formEvaluacion.punteo} onChange={handleChange} type="number" />
            <Input label="Calificación (Texto)" name="calificacion" value={formEvaluacion.calificacion} onChange={handleChange} placeholder="Ej. Muy Bueno" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mb-2">
            <Input label="Lotes Vendidos" name="lotes" value={formEvaluacion.lotes} onChange={handleChange} type="number" />
            <Input label="Monto Vendido ($)" name="monto" value={formEvaluacion.monto} onChange={handleChange} type="number" />
            <Input label="Leads" name="leads" value={formEvaluacion.leads} onChange={handleChange} type="number" />
          </div>
          <Input label="Visitas" name="visitas" value={formEvaluacion.visitas} onChange={handleChange} type="number" />
          <TextArea label="Observaciones" name="observaciones" value={formEvaluacion.observaciones} onChange={handleChange} placeholder="Ej. Su desempeño ha sido sobresaliente..." />
        </div>
        <div className="w-full min-w-0">
          <ResultCard title="Reporte de Evaluación" text={generarTextoEvaluacionCelular(formEvaluacion)} htmlContent={generarHtmlEvaluacion(formEvaluacion)} subject={`RE: REPORTE DE EVALUACIÓN - ${formEvaluacion.nombre || 'Asesor'}`.toUpperCase()} fixedDestinoLabel="Ulrich Klein Montano" fixedDestinoEmail="uklein@grupopaz.com.bo" ccEmails="mfroca@celina.com.bo, rvaca@grupopaz.com.bo, mreyes@celina.com.bo" />
        </div>
      </div>
    </div>
  );
}
