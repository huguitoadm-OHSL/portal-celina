import React, { useState } from 'react';
import { ClipboardCheck, Target, Star, Shield, Zap } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { ResultCard } from '../components/ui/ResultCard';
import { generarTextoEvaluacionCelular } from '../utils/textTemplates';
import { generarHtmlEvaluacion } from '../utils/htmlTemplates';

export default function EvaluacionFinMes() {
  const [formEvaluacion, setFormEvaluacion] = useState({ 
    asesor: '', nombre: '', punteo: '', calificacion: 'Muy Bueno', lotes: '', monto: '', leads: '', visitas: '', observaciones: '',
    habilidades: { cierre: 80, prospeccion: 60, producto: 90, actitud: 100 }
  });

  const handleE = (e) => setFormEvaluacion({ ...formEvaluacion, [e.target.name]: e.target.value });
  const handleHab = (skill, val) => setFormEvaluacion({ ...formEvaluacion, habilidades: { ...formEvaluacion.habilidades, [skill]: val } });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><ClipboardCheck className="w-6 h-6 mr-2 text-blue-600" /> Evaluación de Desempeño</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full">
          <Input label="Nombre del Asesor Evaluado" name="nombre" value={formEvaluacion.nombre} onChange={handleE} placeholder="Ej. Jaime Fabricio Rios" />
          
          {/* BARRAS DE COMPETENCIA DINÁMICAS */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 my-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Scorecard de Competencias</h3>
            <div className="space-y-4">
              {[
                { id: 'cierre', label: 'Cierre de Ventas', icon: <Target className="w-4 h-4 text-rose-500" />, color: 'bg-rose-500' },
                { id: 'prospeccion', label: 'Prospección', icon: <Zap className="w-4 h-4 text-amber-500" />, color: 'bg-amber-500' },
                { id: 'producto', label: 'Conocimiento Producto', icon: <Shield className="w-4 h-4 text-blue-500" />, color: 'bg-blue-500' },
                { id: 'actitud', label: 'Actitud Comercial', icon: <Star className="w-4 h-4 text-emerald-500" />, color: 'bg-emerald-500' }
              ].map(skill => (
                <div key={skill.id}>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1 items-center">
                    <span className="flex items-center gap-1.5">{skill.icon} {skill.label}</span>
                    <span>{formEvaluacion.habilidades[skill.id]}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={formEvaluacion.habilidades[skill.id]} onChange={(e) => handleHab(skill.id, e.target.value)} className={`w-full h-2 rounded-lg appearance-none bg-slate-200 cursor-pointer accent-${skill.color.split('-')[1]}-600`} />
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden"><div className={`h-full ${skill.color} transition-all`} style={{width: `${formEvaluacion.habilidades[skill.id]}%`}}></div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="Punteo Total" name="punteo" value={formEvaluacion.punteo} onChange={handleE} type="number" />
            <div><label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Calificación</label><select name="calificacion" value={formEvaluacion.calificacion} onChange={handleE} className="w-full px-3 py-2.5 border rounded-xl bg-slate-50 text-sm"><option value="Excelente">Excelente</option><option value="Muy Bueno">Muy Bueno</option><option value="Regular">Regular</option><option value="Bajo">Bajo</option></select></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Input label="Lotes" name="lotes" value={formEvaluacion.lotes} onChange={handleE} type="number" />
            <Input label="Monto ($)" name="monto" value={formEvaluacion.monto} onChange={handleE} type="number" />
            <Input label="Visitas" name="visitas" value={formEvaluacion.visitas} onChange={handleE} type="number" />
          </div>
          <TextArea label="Observaciones Finales" name="observaciones" value={formEvaluacion.observaciones} onChange={handleE} />
        </div>
        
        <div className="w-full space-y-6">
          <ResultCard title="Reporte de Evaluación" text={generarTextoEvaluacionCelular(formEvaluacion)} htmlContent={generarHtmlEvaluacion(formEvaluacion)} subject={`REPORTE DE EVALUACIÓN - ${formEvaluacion.nombre || 'Asesor'}`} fixedDestinoLabel="Ulrich Klein Montano" fixedDestinoEmail="uklein@grupopaz.com.bo" ccEmails="mfroca@celina.com.bo, rvaca@grupopaz.com.bo, mreyes@celina.com.bo" />
        </div>
      </div>
    </div>
  );
}
