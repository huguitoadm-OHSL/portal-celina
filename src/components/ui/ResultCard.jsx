import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Check, ChevronDown, Clock, MousePointerClick, Zap, Users } from 'lucide-react';

export function ResultCard({ title, text, htmlContent, subject, cc, supervisorDestino, setSupervisorDestino }) {
  const [copiado, setCopiado] = useState(false);
  const [mostrarAlertaPegar, setMostrarAlertaPegar] = useState(false);

  const esAndroid = /Android/i.test(navigator.userAgent);
  const esIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // ================= 1. DICCIONARIO DE RUTEO ESTRICTO (Intacto) =================
  const MAPA_CORREOS = useMemo(() => [
    {
      pantallas: ["recompra"],
      contactos: [
        { email: 'cbarretto@celina.com.bo', nombre: 'Ing. Charles Barretto', saludo: 'Estimado Ing. Charles' },
        { email: 'csalvatierra@celina.com.bo', nombre: 'Cinthia Salvatierra', saludo: 'Estimada Cinthia' },
        { email: 'elizarraga@celina.com.bo', nombre: 'Enrique Lizarraga', saludo: 'Estimado Enrique' },
        { email: 'aperez@celina.com.bo', nombre: 'Alex Pérez', saludo: 'Estimado Alex' },
        { email: 'omendoza@celina.com.bo', nombre: 'Olivia Mendoza', saludo: 'Estimada Olivia' }
      ]
    },
    {
      pantallas: ["renuncia", "alta", "crm", "evaluación", "evaluacion", "postulante", "memorándum", "memorandum", "rrhh"],
      contactos: [
        { email: 'uklein@grupopaz.com.bo', nombre: 'Ulrich Klein Montano', saludo: 'Estimado Ulrich' },
        { email: 'mfroca@celina.com.bo', nombre: 'Maria Fernanda Roca', saludo: 'Estimada Maria Fernanda' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' },
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' }
      ]
    },
    {
      pantallas: ["llamada", "validación", "validacion", "código", "codigo", "códigos", "codigos", "pend."],
      contactos: [
        { email: 'elizarraga@celina.com.bo', nombre: 'Enrique Lizarraga', saludo: 'Estimado Enrique' },
        { email: 'omendoza@celina.com.bo', nombre: 'Olivia Mendoza Duran', saludo: 'Estimada Olivia' },
        { email: 'rmartinez@celina.com.bo', nombre: 'Rodolfo Martínez', saludo: 'Estimado Rodolfo' }
      ]
    },
    {
      pantallas: ["proyección", "proyeccion", "diaria", "semanal", "seguimiento", "físico", "fisico", "reenvío", "reenvio", "firma", "seguro", "descuento", "campaña", "campana", "inc.", "cuota", "bloqueo", "lote", "liquidación", "liquidacion", "contado", "amortización", "amortizacion", "recalcular", "consolidación", "consolidacion"],
      contactos: [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' }
      ]
    }
  ], []);

  const RESPALDO = useMemo(() => [
    { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
    { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' }
  ], []);

  const contactosDisponibles = useMemo(() => {
    const contextoTotal = [title, subject].join(" ").toLowerCase();
    for (const grupo of MAPA_CORREOS) {
      if (grupo.pantallas.some(p => contextoTotal.includes(p))) return grupo.contactos;
    }
    return RESPALDO;
  }, [title, subject, MAPA_CORREOS, RESPALDO]);

  const contactoSeleccionado = contactosDisponibles.find(c => c.email === supervisorDestino);
  const destinatarioEfectivo = contactoSeleccionado ? contactoSeleccionado.email : contactosDisponibles[0].email;
  const objetoDestinatario = contactoSeleccionado || contactosDisponibles[0];

  useEffect(() => {
    if (supervisorDestino !== destinatarioEfectivo && setSupervisorDestino) {
      setSupervisorDestino(destinatarioEfectivo);
    }
  }, [destinatarioEfectivo, supervisorDestino, setSupervisorDestino]);

  const ccDinamicoArray = useMemo(() => {
    const copiasExtra = contactosDisponibles.filter(c => c.email !== destinatarioEfectivo).map(c => c.email);
    const copiasProps = cc ? cc.split(',').map(s => s.trim()).filter(Boolean) : [];
    return [...new Set([...copiasExtra, ...copiasProps])];
  }, [contactosDisponibles, destinatarioEfectivo, cc]);
  
  // Separadores independientes para garantizar compatibilidad total (Coma vs Punto y Coma)
  const ccOutlookStr = ccDinamicoArray.join(';'); 
  const ccGmailStr = ccDinamicoArray.join(','); 

  // ================= 2. PROCESADOR DE TEXTO (CORRECCIÓN ESTÉTICA) =================
  const procesarTextoMutante = (contenido) => {
    if (!contenido) return '';
    
    const hora = new Date().getHours();
    let saludoTiempo = "Buenas noches";
    if (hora >= 5 && hora < 12) saludoTiempo = "Buenos días";
    if (hora >= 12 && hora < 19) saludoTiempo = "Buenas tardes";
    
    const nombreSaludo = objetoDestinatario ? objetoDestinatario.saludo : 'Estimado/a';
    
    let modificado = contenido;

    // Destruimos cualquier token antiguo
    modificado = modificado.replace(/\{\{SALUDO_TIEMPO\}\}/gi, "Buenas"); 
    modificado = modificado.replace(/\{\{NOMBRE_SUPERVISOR\}\}/gi, "");
    modificado = modificado.replace(/\[SALUDO_AUTO\]/gi, "");
    
    // 🟢 CORRECCIÓN: Ahora absorbe la coma y el espacio ([,\s]*) para evitar "Charles, , por favor"
    const nombresQuemados = /Estimad[oa]\s+(Mauricio|Robert|Verenice|Ing\.\s+Charles|Cinthia|Enrique|Luis\s+Fernando|Olivia|Rodolfo|Alex|Ulrich|Maria\s+Fernanda)[,\s]*/gi;
    modificado = modificado.replace(nombresQuemados, '');

    // Reemplazo final con el saludo perfecto
    modificado = modificado.replace(/\bBuen(?:os|as)\s*(días|dias|tardes|noches)?\b/gi, `${saludoTiempo} ${nombreSaludo}, `);

    // Limpiezas de seguridad por si quedaron comas huérfanas
    modificado = modificado.replace(/,\s*,/g, ',');
    modificado = modificado.replace(/,\s*<br>\s*,/gi, ',<br>');
    modificado = modificado.replace(/,\s*\n\s*,/g, ',\n');
    modificado = modificado.replace(/,\s*<br>/gi, ',<br>');
    
    return modificado;
  };

  const htmlFinal = procesarTextoMutante(htmlContent);
  const textoPlanoFinal = procesarTextoMutante(text);

  // ================= 3. FLUJO DE COPIADO SEGURO =================
  const ejecutarFlujoSeguro = (callbackApp) => {
    try {
      const blob = new Blob([htmlFinal], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      navigator.clipboard.write([clipboardItem]).catch(() => navigator.clipboard.writeText(textoPlanoFinal));
    } catch (err) {
      navigator.clipboard.writeText(textoPlanoFinal);
    }
    
    setMostrarAlertaPegar(true);
    setTimeout(() => {
      setMostrarAlertaPegar(false);
      callbackApp();
    }, 1800);
  };

  const abrirAppOutlookEscritorio = () => {
    ejecutarFlujoSeguro(() => {
      const dest = encodeURIComponent(destinatarioEfectivo || '');
      const asun = encodeURIComponent(subject || '');
      
      // 🟢 CORRECCIÓN MÓVIL: Se elimina ms-outlook:// en celulares para evitar "Error de redirección".
      // Se utiliza el mailto: estándar con separador de comas que abre impecable en Android y iPhone.
      if (esAndroid || esIOS) {
        const copiasCCMobile = encodeURIComponent(ccGmailStr || ''); 
        window.location.href = `mailto:${dest}?subject=${asun}&cc=${copiasCCMobile}`;
      } else {
        const copiasCCPC = encodeURIComponent(ccOutlookStr || ''); 
        window.location.href = `mailto:${dest}?subject=${asun}&cc=${copiasCCPC}`;
      }
    });
  };

  const abrirEnGmail = () => {
    ejecutarFlujoSeguro(() => {
      const miCorreoAuditoria = "ohsaravia@celina.com.bo";
      const dest = encodeURIComponent(destinatarioEfectivo || '');
      const asun = encodeURIComponent(subject || '');
      const copiasCC = encodeURIComponent((ccGmailStr ? ccGmailStr + ',' : '') + miCorreoAuditoria); 

      if (esAndroid || esIOS) {
        window.location.href = `googlegmail://co?to=${dest}&subject=${asun}&cc=${copiasCC}`;
        setTimeout(() => { window.location.href = `mailto:${dest}?subject=${asun}&cc=${copiasCC}`; }, 1000);
      } else {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${dest}&su=${asun}&cc=${copiasCC}`, '_blank');
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 p-6 flex flex-col justify-between h-full relative overflow-hidden transition-all">
      
      {/* 🚀 ESCUDO VISUAL PREMIUM 🚀 */}
      {mostrarAlertaPegar && (
        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(52,211,153,0.4)] animate-bounce">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3 tracking-tight">¡Memoria Cargada!</h3>
          <p className="text-emerald-50 text-sm font-medium leading-relaxed max-w-[250px]">
            Tu cliente de correo se abrirá en un segundo.<br/><br/>
            Usa <span className="inline-flex items-center px-2.5 py-1 bg-slate-800 text-white rounded-md border border-slate-700 font-mono text-xs shadow-inner"><MousePointerClick className="w-3 h-3 mr-1"/>Pegar</span> para insertar el formato perfecto.
          </p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <h3 className="font-black text-slate-800 text-base flex items-center tracking-tight">
            <Zap className="w-5 h-5 text-indigo-500 mr-2 fill-indigo-100" /> {title || "Vista Previa"}
          </h3>
          <span className="text-[10px] font-black bg-indigo-50/80 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-100/50 flex items-center shadow-sm">
            <Clock className="w-3.5 h-3.5 mr-1.5" /> Automatizado
          </span>
        </div>

        {/* SELECTOR DE DESTINATARIO (To) */}
        <div className="mb-4 space-y-1.5">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Enviar A (Destinatario):</label>
          <div className="relative group">
            <select 
              value={destinatarioEfectivo} 
              onChange={(e) => setSupervisorDestino && setSupervisorDestino(e.target.value)} 
              className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 appearance-none cursor-pointer transition-all group-hover:bg-white group-hover:shadow-sm"
            >
              {contactosDisponibles.map((c, idx) => (
                <option key={idx} value={c.email}>{c.nombre} ({c.email})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none transition-transform group-hover:text-indigo-500" />
          </div>
        </div>

        {/* PILLS DE COPIA (CC) */}
        <div className="mb-5 space-y-1.5">
          <label className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">
            <Users className="w-3 h-3 mr-1" /> En Copia Oculta (CC):
          </label>
          <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50/80 border border-slate-100 rounded-xl min-h-[42px] items-center">
            {ccDinamicoArray.length > 0 ? ccDinamicoArray.map((email, i) => (
              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-500 shadow-sm">
                {email}
              </span>
            )) : <span className="text-[11px] font-medium text-slate-400 pl-2">Ninguno</span>}
          </div>
        </div>

        {/* VISTA PREVIA HTML */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 max-h-[250px] overflow-y-auto mb-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] text-xs select-all custom-scrollbar">
          <div dangerouslySetInnerHTML={{ __html: htmlFinal }} className="prose prose-sm prose-slate max-w-none" />
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="space-y-3 pt-5 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => {
            try {
              const blob = new Blob([htmlFinal], { type: 'text/html' });
              const clipboardItem = new ClipboardItem({ 'text/html': blob });
              navigator.clipboard.write([clipboardItem]).catch(() => navigator.clipboard.writeText(textoPlanoFinal));
            } catch (err) { navigator.clipboard.writeText(textoPlanoFinal); }
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2500);
          }} className={`py-3.5 px-3 rounded-xl font-black text-xs flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95 ${copiado ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
            <Copy className={`w-4 h-4 mr-2 ${copiado ? 'hidden' : 'block'}`} />
            {copiado ? <><Check className="w-4 h-4 mr-2"/> ¡Copiado!</> : 'Copiar Formato'}
          </button>
          
          <button onClick={abrirAppOutlookEscritorio} className="py-3.5 px-3 bg-gradient-to-b from-[#0078d4] to-[#005a9e] hover:from-[#0086f0] hover:to-[#006ab8] text-white rounded-xl font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/20 transition-all active:scale-95">
            App Outlook 🖥️
          </button>
        </div>
        
        <button onClick={abrirEnGmail} className="w-full py-3.5 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white rounded-xl font-black text-xs flex items-center justify-center shadow-md shadow-red-500/20 transition-all relative active:scale-95 group">
          Abrir en Gmail
          <span className="absolute right-3 text-[9px] font-bold bg-white/20 px-2 py-1 rounded-lg transition-colors group-hover:bg-white/30">+ CC Automático</span>
        </button>
      </div>
    </div>
  );
}
