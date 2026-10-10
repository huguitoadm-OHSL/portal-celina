import { escapeTemplateData } from '../services/email';
import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { ResultCard } from '../components/ui/ResultCard';

export default function PostulanteNuevo() {
  const [form, setForm] = useState({
    asesor: 'Oscar Saravia',
    nombrePostulante: '',
    ci: '',
    celular: '',
    correo: '',
    ciudad: 'Montero',
    experiencia: '',
    medioReclutamiento: 'Referencia Directa',
    observaciones: ''
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const textoCorreo = `{{SALUDO_TIEMPO}}\n{{NOMBRE_SUPERVISOR}},\n\nPresento la postulación del siguiente candidato para incorporarse al equipo comercial de Montero:\n\n` +
    `👤 *Postulante:* ${form.nombrePostulante || '---'}\n` +
    `🪪 *C.I.:* ${form.ci || '---'}\n` +
    `📱 *Celular:* ${form.celular || '---'}\n` +
    `✉️ *Correo:* ${form.correo || '---'}\n` +
    `📍 *Ciudad:* ${form.ciudad}\n` +
    `💼 *Experiencia:* ${form.experiencia || 'En evaluación'}\n` +
    `🎯 *Medio:* ${form.medioReclutamiento}\n\n` +
    `Quedo a su disposición para coordinar la evaluación del candidato.\n\nSaludos cordiales,\n${form.asesor}`;

  const safeForm = escapeTemplateData(form);
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #0f172a; line-height: 1.6; max-width: 650px;">
      <p>{{SALUDO_TIEMPO}} {{NOMBRE_SUPERVISOR}},</p>
      <p>Presento la postulación del siguiente candidato para incorporarse al equipo comercial de Montero:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 15px 0; border: 1px solid #cbd5e1; border-radius: 8px;">
        <tr style="background-color: #f1f5f9;">
          <th colspan="2" style="padding: 10px; text-align: left; font-size: 12px; color: #334155; text-transform: uppercase;">
            👤 Datos del Postulante
          </th>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 40%;">Nombre Completo:</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${safeForm.nombrePostulante || '---'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Carnet de Identidad (CI):</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${safeForm.ci || '---'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Celular / WhatsApp:</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${safeForm.celular || '---'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Correo Electrónico:</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${safeForm.correo || '---'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Ciudad / Agencia:</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${safeForm.ciudad}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #64748b;">Experiencia en Ventas:</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${safeForm.experiencia || 'Sin experiencia previa'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; color: #64748b;">Canal de Contacto:</td>
          <td style="padding: 8px 12px; font-weight: bold; color: #0f172a;">${safeForm.medioReclutamiento}</td>
        </tr>
      </table>

      ${safeForm.observaciones ? `<p><strong>Observaciones / Perfil:</strong><br/>${safeForm.observaciones}</p>` : ''}

      <p style="margin-top: 20px;">Quedo atento a la coordinación de su entrevista.</p>
      <p>Saludos cordiales,<br/><strong>${safeForm.asesor}</strong><br/>Supervisor Comercial</p>
    </div>
  `;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full text-[var(--text-primary)] font-sans">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
            RECURSOS HUMANOS • TALENTO COMERCIAL
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] flex items-center tracking-tight gap-2.5">
          <UserCheck className="w-6 h-6 text-cyan-400" /> Registro de Postulante Nuevo
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        {/* FORMULARIO */}
        <div className="bg-[var(--bg-card)] p-5 sm:p-6 rounded-3xl shadow-2xl border border-[var(--border-glow)] text-[var(--text-primary)] w-full min-w-0 space-y-4">
          <Input label="Tu Nombre (Supervisor Remitente)" name="asesor" value={form.asesor} onChange={handleChange} placeholder="Ej. Oscar Saravia" />

          <div className="pt-2 pb-1 border-b border-[var(--border-glow)]">
            <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider">Datos del Candidato</h3>
          </div>

          <Input label="Nombre(s) y Apellidos Completos" name="nombrePostulante" value={form.nombrePostulante} onChange={handleChange} placeholder="Ej. Juan Carlos Morales Peña" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Input label="Carnet de Identidad (CI)" name="ci" value={form.ci} onChange={handleChange} placeholder="Ej. 8234567 SC" />
            <Input label="Celular / WhatsApp" name="celular" value={form.celular} onChange={handleChange} placeholder="Ej. 76012345" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Input label="Correo Electrónico" name="correo" value={form.correo} onChange={handleChange} placeholder="Ej. candidato@gmail.com" />
            <Input label="Ciudad / Agencia" name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Ej. Montero" />
          </div>

          <Input label="Experiencia Laboral / Rubro" name="experiencia" value={form.experiencia} onChange={handleChange} placeholder="Ej. 2 años en ventas de intangibles" />

          <div>
            <label className="block text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 ml-0.5">
              Canal de Reclutamiento
            </label>
            <select
              name="medioReclutamiento"
              value={form.medioReclutamiento}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-card-inner)] border border-[var(--border-highlight)] rounded-xl text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-cyan-400 transition-all"
            >
              <option value="Referencia Directa">Referencia Directa</option>
              <option value="Redes Sociales (Facebook/TikTok)">Redes Sociales (Facebook/TikTok)</option>
              <option value="Feria Inmobiliaria / Terreno">Feria Inmobiliaria / Terreno</option>
              <option value="Bolsa de Trabajo / LinkedIn">Bolsa de Trabajo / LinkedIn</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <TextArea label="Observaciones / Perfil del Postulante" name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Detalles de la primera toma de contacto..." rows={3} />
        </div>

        {/* RESULT CARD */}
        <div className="w-full min-w-0">
          <ResultCard
            title="Ficha Postulante Nuevo"
            text={textoCorreo}
            htmlContent={htmlContent}
            subject={`Presentación Postulante Nuevo Equipo Montero - ${form.nombrePostulante || 'Candidato'}`}
            fixedDestinoLabel="Ulrich Klein Montano"
            fixedDestinoEmail="uklein@grupopaz.com.bo"
            ccEmails="mfroca@celina.com.bo, rvaca@grupopaz.com.bo, mreyes@celina.com.bo"
          />
        </div>
      </div>
    </div>
  );
}
