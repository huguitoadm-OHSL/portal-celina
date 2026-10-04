import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Check, ChevronDown, Clock, MousePointerClick, Zap, Users, Monitor, Mail } from 'lucide-react';

const MI_CORREO_AUDITORIA = "ohsaravia@celina.com.bo";

export function ResultCard({ 
  title, 
  text, 
  htmlContent, 
  subject, 
  cc, 
  supervisorDestino, 
  setSupervisorDestino,
  fixedDestinoLabel,
  fixedDestinoEmail,
  ccEmails
}) {
  const [copiado, setCopiado] = useState(false);
  const [mostrarAlertaPegar, setMostrarAlertaPegar] = useState(false);

  const esAndroid = /Android/i.test(navigator.userAgent);
  const esIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const MAPA_CORREOS = useMemo(() => [
    {
      pantallas: ["recompra"],
      contactos: [
        { email: 'cbarretto@celina.com.bo', nombre: 'Ing. Charles Barretto', saludo: 'Estimado Ing. Charles' },
        { email: 'csalvatierra@celina.com.bo', nombre: 'Cinthia Salvatierra', saludo: 'Estimada Cinthia' },
        { email: 'elizarraga@celina.com.bo', nombre: 'Enrique Lizarraga', saludo: 'Estimado Enrique' },
        { email: 'omendoza@celina.com.bo', nombre: 'Olivia Mendoza', saludo: 'Estimada Olivia' }
      ]
    },
    {
      pantallas: ["renuncia", "alta", "crm", "evaluación", "evaluacion", "postulante", "memorándum", "memorandum", "rrhh"],
      contactos: [
        { email: 'uklein@grupopaz.com.bo', nombre: 'Ulrich Klein Montano', saludo: 'Estimado Ulrich' },
        { email: 'mfroca@celina.com.bo', nombre: 'Maria Fernanda Roca', saludo: 'Estimada Maria Fernanda' },
        { email: 'mreyes@celina.com.bo', nombre: 'Lic. Mauricio Reyes', saludo: 'Estimado Lic. Mauricio' },
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Lic. Robert Vaca', saludo: 'Estimado Lic. Robert' }
      ]
    },
    {
      pantallas: ["llamada", "validación", "validacion", "código", "codigo", "códigos", "codigos", "pend.", "penalidad", "penalidades"],
      contactos: [
        { email: 'elizarraga@celina.com.bo', nombre: 'Enrique Lizarraga', saludo: 'Estimado Enrique' },
        { email: 'omendoza@celina.com.bo', nombre: 'Olivia Mendoza Duran', saludo: 'Estimada Olivia' },
        { email: 'rmartinez@celina.com.bo', nombre: 'Rodolfo Martínez', saludo: 'Estimado Rodolfo' }
      ]
    },
    {
      pantallas: ["proyección", "proyeccion", "diaria", "semanal", "seguimiento", "físico", "fisico", "reenvío", "reenvio", "firma", "seguro", "descuento", "campaña", "campana", "inc.", "cuota", "bloqueo", "lote", "liquidación", "liquidacion", "contado", "amortización", "amortizacion", "recalcular", "consolidación", "consolidacion"],
      contactos: [
        { email: 'mreyes@celina.com.bo', nombre: 'Lic. Mauricio Reyes', saludo: 'Estimado Lic. Mauricio' },
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Lic. Robert Vaca', saludo: 'Estimado Lic. Robert' },
        { email: 'vchoque@grupopaz.com.bo', nombre: 'Lic. Verenice Choque', saludo: 'Estimada Lic. Verenice' }
      ]
    }
  ], []);

  const RESPALDO = useMemo(() => [
    { email: 'mreyes@celina.com.bo', nombre: 'Lic. Mauricio Reyes', saludo: 'Estimado Lic. Mauricio' },
    { email: 'rvaca@grupopaz.com.bo', nombre: 'Lic. Robert Vaca', saludo: 'Estimado Lic. Robert' }
  ], []);

  const contactosDisponibles = useMemo(() => {
    if (fixedDestinoEmail && fixedDestinoLabel) {
      return [{ email: fixedDestinoEmail, nombre: fixedDestinoLabel, saludo: `Estimado/a ${fixedDestinoLabel}` }];
    }
    const contextoTotal = [title, subject].join(" ").toLowerCase();
    for (const grupo of MAPA_CORREOS) {
      if (grupo.pantallas.some(p => contextoTotal.includes(p))) return grupo.contactos;
    }
    return RESPALDO;
  }, [title, subject, fixedDestinoEmail, fixedDestinoLabel, MAPA_CORREOS, RESPALDO]);

  const contactoSeleccionado = contactosDisponibles.find(c => c.email === supervisorDestino);
  const destinatarioEfectivo = fixedDestinoEmail || (contactoSeleccionado ? contactoSeleccionado.email : contactosDisponibles[0].email);
  const objetoDestinatario = contactoSeleccionado || contactosDisponibles[0];

  useEffect(() => {
    if (!fixedDestinoEmail && supervisorDestino !== destinatarioEfectivo && setSupervisorDestino) {
      setSupervisorDestino(destinatarioEfectivo);
    }
  }, [destinatarioEfectivo, supervisorDestino, setSupervisorDestino, fixedDestinoEmail]);

  const ccDinamicoArray = useMemo(() => {
    const copiasExtra = fixedDestinoEmail ? [] : contactosDisponibles.filter(c => c.email !== destinatarioEfectivo).map(c => c.email);
    const copiasProps = cc ? cc.split(',').map(s => s.trim()).filter(Boolean) : [];
    const copiasFixed = ccEmails ? ccEmails.split(',').map(s => s.trim()).filter(Boolean) : [];
    return [...new Set([...copiasExtra, ...copiasProps, ...copiasFixed, MI_CORREO_AUDITORIA])];
  }, [contactosDisponibles, destinatarioEfectivo, cc, ccEmails, fixedDestinoEmail]);

  const procesarTextoMutante = (contenido) => {
    if (!contenido) return '';
    const hora = new Date().getHours();
    let saludoTiempo = "Buenas noches";
    if (hora >= 5 && hora < 12) saludoTiempo = "Buenos días";
    if (hora >= 12 && hora < 19) saludoTiempo = "Buenas tardes";
    
    const nombreSaludo = objetoDestinatario ? objetoDestinatario.saludo : 'Estimado/a';
    
    let modificado = contenido;
    modificado = modificado.replace(/\{\{SALUDO_TIEMPO\}\}/gi, saludoTiempo); 
    modificado = modificado.replace(/\{\{NOMBRE_SUPERVISOR\}\}/gi, nombreSaludo);
    modificado = modificado.replace(/\[SALUDO_AUTO\]/gi, "");
    
    const nombresQuemados = /Estimad[oa]\s+(Mauricio|Robert|Verenice|Ing\.\s+Charles|Cinthia|Enrique|Luis\s+Fernando|Olivia|Rodolfo|Alex|Ulrich|Maria\s+Fernanda)[,\s]*/gi;
    modificado = modificado.replace(nombresQuemados, '');
    modificado = modificado.replace(/\bBuen(?:os|as)\s*(días|dias|tardes|noches)?\b/gi, `${saludoTiempo}, ${nombreSaludo}`);

    modificado = modificado.replace(/,\s*,/g, ',');
    modificado = modificado.replace(/,\s*<br>\s*,/gi, ',<br>');
    modificado = modificado.replace(/,\s*\n\s*,/g, ',\n');
    modificado = modificado.replace(/,\s*<br>/gi, ',<br>');
    return modificado;
  };

  const htmlFinal = procesarTextoMutante(htmlContent);
  const textoPlanoFinal = procesarTextoMutante(text);

  const ejecutarFlujoSeguro = (callbackApp) => {
    try {
      if (typeof ClipboardItem !== 'undefined') {
        const htmlBlob = new Blob([htmlFinal], { type: 'text/html' });
        const textBlob = new Blob([textoPlanoFinal], { type: 'text/plain' });
        const clipboardItem = new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob });
        navigator.clipboard.write([clipboardItem]).catch(() => navigator.clipboard.writeText(textoPlanoFinal));
      } else {
        navigator.clipboard.writeText(textoPlanoFinal);
      }
    } catch {
      navigator.clipboard.writeText(textoPlanoFinal);
    }
    
    setMostrarAlertaPegar(true);
    setTimeout(() => {
      setMostrarAlertaPegar(false);
      if (callbackApp) callbackApp();
    }, 1800);
  };

  const abrirAppOutlookEscritorio = () => {
    ejecutarFlujoSeguro(() => {
      const dest = destinatarioEfectivo || '';
      const asun = encodeURIComponent(subject || '');
      const ccStr = ccDinamicoArray.join(','); 
      window.location.href = `mailto:${dest}?subject=${asun}&cc=${ccStr}`;
    });
  };

  const abrirEnGmail = () => {
    ejecutarFlujoSeguro(() => {
      const dest = destinatarioEfectivo || '';
      const asun = encodeURIComponent(subject || '');
      const ccStr = ccDinamicoArray.join(','); 

      if (esAndroid || esIOS) {
        window.location.href = `googlegmail://co?to=${dest}&subject=${asun}&cc=${ccStr}`;
        setTimeout(() => { window.location.href = `mailto:${dest}?subject=${asun}&cc=${ccStr}`; }, 1000);
      } else {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(dest)}&su=${asun}&cc=${encodeURIComponent(ccStr)}`, '_blank');
      }
    });
  };

  return (
    <div className="bg-[#070e1c] rounded-3xl border border-[#14233c] p-5 sm:p-6 shadow-2xl flex flex-col justify-between h-full relative overflow-hidden transition-all text-slate-100">
      {mostrarAlertaPegar && (
        <div className="absolute inset-0 z-50 bg-[#030712]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-bounce">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-black text-white mb-2 tracking-tight">¡Formato Copiado al Portapapeles!</h3>
          <p className="text-emerald-300 text-xs font-medium leading-relaxed max-w-[260px]">
            Tu cliente de correo se abrirá con el Asunto, Destinatario y CC listos.<br/><br/>
            Usa <span className="inline-flex items-center px-2 py-0.5 bg-[#091426] text-cyan-300 rounded border border-cyan-500/40 font-mono text-[11px]"><MousePointerClick className="w-3 h-3 mr-1"/>Pegar</span> para insertar el cuerpo del correo.
          </p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between border-b border-[#14233c] pb-3 mb-4">
          <h3 className="font-black text-white text-sm sm:text-base flex items-center tracking-tight">
            <Zap className="w-4 h-4 text-cyan-400 mr-2" /> {title || "Vista Previa"}
          </h3>
          <span className="text-[10px] font-black bg-cyan-950/80 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-500/40 flex items-center shadow-sm">
            <Clock className="w-3 h-3 mr-1" /> Auto-Generado
          </span>
        </div>

        <div className="mb-3 space-y-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">
            Enviar A (Destinatario):
          </label>
          <div className="relative group">
            <select 
              value={destinatarioEfectivo} 
              disabled={Boolean(fixedDestinoEmail)}
              onChange={(e) => setSupervisorDestino && setSupervisorDestino(e.target.value)} 
              className="w-full pl-3 pr-8 py-2.5 bg-[#050b18] border border-[#1e3a5f] rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-400 appearance-none cursor-pointer transition-all disabled:opacity-80"
            >
              {contactosDisponibles.map((c, idx) => (
                <option key={idx} value={c.email}>{c.nombre} ({c.email})</option>
              ))}
            </select>
            {!fixedDestinoEmail && (
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-cyan-400" />
            )}
          </div>
        </div>

        <div className="mb-4 space-y-1">
          <label className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-wider pl-0.5">
            <Users className="w-3 h-3 mr-1 text-cyan-400" /> En Copia (CC Automático de Auditoría):
          </label>
          <div className="flex flex-wrap gap-1 p-2 bg-[#050b18] border border-[#14233c] rounded-xl min-h-[38px] items-center">
            {ccDinamicoArray.map((email, i) => (
              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#091426] border border-[#1e3a5f] text-[9px] font-mono font-bold text-cyan-300">
                {email}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#030712] border border-[#14233c] rounded-2xl p-4 max-h-[240px] overflow-y-auto mb-4 text-xs select-all custom-scrollbar leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: htmlFinal }} className="prose prose-sm prose-invert max-w-none text-slate-300" />
        </div>
      </div>

      <div className="space-y-2.5 pt-4 border-t border-[#14233c]">
        <div className="grid grid-cols-2 gap-2.5">
          <button 
            type="button"
            onClick={() => {
              try {
                if (typeof ClipboardItem !== 'undefined') {
                  const htmlBlob = new Blob([htmlFinal], { type: 'text/html' });
                  const textBlob = new Blob([textoPlanoFinal], { type: 'text/plain' });
                  const item = new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob });
                  navigator.clipboard.write([item]).catch(() => navigator.clipboard.writeText(textoPlanoFinal));
                } else {
                  navigator.clipboard.writeText(textoPlanoFinal);
                }
              } catch {
                navigator.clipboard.writeText(textoPlanoFinal);
              }
              setCopiado(true);
              setTimeout(() => setCopiado(false), 2500);
            }} 
            className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center transition-all duration-300 shadow-md active:scale-95 ${
              copiado ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-100 hover:bg-white text-slate-950'
            }`}
          >
            <Copy className={`w-3.5 h-3.5 mr-1.5 ${copiado ? 'hidden' : 'block'} text-slate-800`} />
            {copiado ? <><Check className="w-3.5 h-3.5 mr-1.5"/> ¡Copiado!</> : 'Copiar Formato'}
          </button>
          
          <button 
            type="button"
            onClick={abrirAppOutlookEscritorio} 
            className="py-3 px-3 bg-[#0078d4] hover:bg-[#006cc1] text-white rounded-xl font-black text-xs flex items-center justify-center shadow-lg shadow-blue-900/40 transition-all active:scale-95"
          >
            <Monitor className="w-3.5 h-3.5 mr-1.5 text-blue-100" />
            App Outlook 🖥️
          </button>
        </div>
        
        <button 
          type="button"
          onClick={abrirEnGmail} 
          className="w-full py-3.5 bg-[#ea4335] hover:bg-[#dc2626] text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center shadow-lg shadow-red-950/40 transition-all relative active:scale-95 group"
        >
          <Mail className="w-4 h-4 mr-2" />
          <span>Abrir en Gmail</span>
          <span className="ml-2 text-[9px] font-black bg-white/20 px-2 py-0.5 rounded-full border border-white/30">+ CC Automático</span>
        </button>
      </div>
    </div>
  );
}
