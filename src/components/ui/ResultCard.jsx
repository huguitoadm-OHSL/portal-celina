import React, { useState } from 'react';
import { Copy, ExternalLink, Check, Mail } from 'lucide-react';

export function ResultCard({ title, text, htmlContent, subject, cc, supervisorDestino, setSupervisorDestino }) {
  const [copiado, setCopiado] = useState(false);

  // ================= SALUDO INTELIGENTE POR HORARIO =================
  const obtenerSaludoHorario = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Buenos días";
    if (hora >= 12 && hora < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  const procesarSaludoHTML = (html) => {
    if (!html) return '';
    const saludoCorrecto = obtenerSaludoHorario();
    return html.replace(/Buenas (noches|días|tardes)/i, saludoCorrecto);
  };

  const htmlFinal = procesarSaludoHTML(htmlContent);

  const copiarAlPortapapeles = async () => {
    try {
      const blob = new Blob([htmlFinal], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      await navigator.clipboard.write([clipboardItem]);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch (err) {
      navigator.clipboard.writeText(text);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  const abrirEnGmail = () => {
    const cuerpoTexto = text || "Adjunto solicitud.";
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(supervisorDestino || '')}&su=${encodeURIComponent(subject || '')}&cc=${encodeURIComponent(cc || '')}&body=${encodeURIComponent(cuerpoTexto)}`;
    window.open(url, '_blank');
  };

  // ================= MOTOR OUTLOOK ESCRITORIO (Cero bloqueos) =================
  const abrirAppOutlookEscritorio = async () => {
    // 1. Truco VIP: Copiamos la tabla al portapapeles automáticamente al hacer clic
    try {
      const blob = new Blob([htmlFinal], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      await navigator.clipboard.write([clipboardItem]);
    } catch (err) {
      navigator.clipboard.writeText(text);
    }

    // 2. Enviamos una orden ligera a Windows 11 (Bajo el límite de 2048 caracteres)
    const dest = encodeURIComponent(supervisorDestino || '');
    const asun = encodeURIComponent(subject || '');
    const copias = encodeURIComponent(cc || '');
    
    // Esto disparará tu OUTLOOK.EXE local de forma instantánea
    window.location.href = `mailto:${dest}?subject=${asun}&cc=${copias}`;
  };

  const abrirAppCorreoDefecto = () => {
    window.location.href = `mailto:${encodeURIComponent(supervisorDestino || '')}?subject=${encodeURIComponent(subject || '')}&cc=${encodeURIComponent(cc || '')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 className="font-black text-slate-800 text-base flex items-center">
            <Check className="w-5 h-5 text-emerald-500 mr-2" /> {title || "Vista Previa"}
          </h3>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
            {obtenerSaludoHorario()} detectado ⏱️
          </span>
        </div>

        <div className="mb-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Correo Destino (Gerencia)</label>
          <input 
            type="email" 
            value={supervisorDestino} 
            onChange={(e) => setSupervisorDestino && setSupervisorDestino(e.target.value)} 
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 max-h-[380px] overflow-y-auto mb-6 shadow-inner text-xs select-all">
          <div dangerouslySetInnerHTML={{ __html: htmlFinal }} />
        </div>
      </div>

      {/* BOTONERA IDÉNTICA A TU DISEÑO ORIGINAL */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-2.5">
          <button 
            onClick={copiarAlPortapapeles} 
            className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center transition-all shadow-sm ${copiado ? 'bg-emerald-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
          >
            <Copy className="w-4 h-4 mr-1.5" />
            {copiado ? '¡Copiado! ✅' : 'Copiar Formato PC'}
          </button>

          <button 
            onClick={abrirAppCorreoDefecto} 
            className="py-3 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center shadow-md transition-all"
          >
            <Mail className="w-4 h-4 mr-1.5" /> App de Correo (Defecto)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button 
            onClick={abrirEnGmail} 
            className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center justify-center shadow transition-colors"
          >
            Abrir en Gmail
          </button>
          
          <button 
            onClick={abrirAppOutlookEscritorio} 
            className="py-2.5 px-3 bg-[#0072c6] hover:bg-[#005a9e] text-white rounded-xl font-bold text-xs flex items-center justify-center shadow transition-colors"
          >
            App Outlook 🖥️
          </button>
        </div>
      </div>
    </div>
  );
}
