import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Check, Mail, ChevronDown, Clock, AlertTriangle } from 'lucide-react';

export function ResultCard({ title, text, htmlContent, subject, cc, supervisorDestino, setSupervisorDestino }) {
  const [copiado, setCopiado] = useState(false);
  const [mostrarAlertaPegar, setMostrarAlertaPegar] = useState(false);

  const esAndroid = /Android/i.test(navigator.userAgent);
  const esIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // ================= 1. DICCIONARIO BLINDADO (TÍTULOS Y ASUNTOS) =================
  const MAPA_CORREOS = useMemo(() => [
    {
      pantallas: ["código", "codigo", "códigos", "codigos", "llamada", "referido", "validación", "validacion", "pendiente", "pend."],
      contactos: [
        { email: 'elizarraga@celina.com.bo', nombre: 'Enrique Lizarraga', saludo: 'Estimado Enrique' },
        { email: 'omendoza@celina.com.bo', nombre: 'Olivia Mendoza Duran', saludo: 'Estimada Olivia' },
        { email: 'rmartinez@celina.com.bo', nombre: 'Rodolfo Martínez', saludo: 'Estimado Rodolfo' }
      ]
    },
    {
      pantallas: ["memorándum", "memorandum", "renuncia", "crm", "evaluación", "evaluacion", "postulante", "rrhh"],
      contactos: [
        { email: 'uklein@grupopaz.com.bo', nombre: 'Ulrich Klein Montano', saludo: 'Estimado Ulrich' },
        { email: 'mfroca@celina.com.bo', nombre: 'Maria Fernanda Roca Miranda', saludo: 'Estimada Maria Fernanda' },
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' }
      ]
    },
    {
      pantallas: ["recompra"],
      contactos: [
        { email: 'cbarretto@celina.com.bo', nombre: 'Ing. Charles Barretto', saludo: 'Estimado Ing. Charles' },
        { email: 'csalvatierra@celina.com.bo', nombre: 'Cinthia Salvatierra', saludo: 'Estimada Cinthia' },
        { email: 'elizarraga@celina.com.bo', nombre: 'Enrique Lizarraga', saludo: 'Estimado Enrique' }
      ]
    },
    {
      pantallas: ["bloqueo", "lote"],
      contactos: [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'vchoque@celina.com.bo', nombre: 'Verenice Choque', saludo: 'Estimada Verenice' },
        { email: 'lribera@grupopaz.com.bo', nombre: 'Luis Fernando Ribera', saludo: 'Estimado Luis Fernando' }
      ]
    },
    {
      pantallas: ["amortización", "amortizacion"],
      contactos: [
        { email: 'vchoque@celina.com.bo', nombre: 'Verenice Choque', saludo: 'Estimada Verenice' }
      ]
    },
    {
      pantallas: ["campaña", "campana"],
      contactos: [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'vchoque@celina.com.bo', nombre: 'Verenice Choque', saludo: 'Estimada Verenice' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' }
      ]
    },
    {
      pantallas: ["liquidación", "liquidacion", "descuento"],
      contactos: [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' },
        { email: 'vchoque@celina.com.bo', nombre: 'Verenice Choque', saludo: 'Estimada Verenice' }
      ]
    },
    {
      pantallas: ["cuota", "proyección", "proyeccion", "diaria", "semanal", "inc."],
      contactos: [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' }
      ]
    }
  ], []);

  const RESPALDO = useMemo(() => [
    { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' },
    { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' }
  ], []);

  const contactosDisponibles = useMemo(() => {
    const contextoTotal = [title, subject].join(" ").toLowerCase();
    for (const grupo of MAPA_CORREOS) {
      if (grupo.pantallas.some(p => contextoTotal.includes(p))) {
        return grupo.contactos;
      }
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

  const ccDinamico = useMemo(() => {
    const copiasExtra = contactosDisponibles.filter(c => c.email !== destinatarioEfectivo).map(c => c.email);
    const copiasProps = cc ? cc.split(',').map(s => s.trim()).filter(Boolean) : [];
    return [...new Set([...copiasExtra, ...copiasProps])].join(', ');
  }, [contactosDisponibles, destinatarioEfectivo, cc]);

  // ================= 2. MUTACIÓN DE TEXTO Y HTML =================
  const procesarTextoMutante = (contenido) => {
    if (!contenido) return '';
    const hora = new Date().getHours();
    let saludoBase = "Buenas noches";
    if (hora >= 5 && hora < 12) saludoBase = "Buenos días";
    if (hora >= 12 && hora < 19) saludoBase = "Buenas tardes";
    const nombreSaludo = objetoDestinatario ? objetoDestinatario.saludo : 'Estimado/a';
    
    let modificado = contenido.replace(/Buenas\s+(noches|días|tardes)/gi, saludoBase).replace(/\[SALUDO_AUTO\]/gi, "");
    
    return modificado
      .replace(/Estimado\s+Mauricio/gi, nombreSaludo).replace(/Estimado\s+Robert/gi, nombreSaludo)
      .replace(/Estimada\s+Verenice/gi, nombreSaludo).replace(/Estimado\s+Ing\.\s+Charles/gi, nombreSaludo)
      .replace(/Estimada\s+Cinthia/gi, nombreSaludo).replace(/Estimado\s+Enrique/gi, nombreSaludo)
      .replace(/Estimado\s+Luis\s+Fernando/gi, nombreSaludo).replace(/Estimada\s+Olivia/gi, nombreSaludo)
      .replace(/Estimado\s+Rodolfo/gi, nombreSaludo).replace(/Estimado\s+Alex/gi, nombreSaludo)
      .replace(/Estimado\s+Ulrich/gi, nombreSaludo).replace(/Estimada\s+Maria\s+Fernanda/gi, nombreSaludo);
  };

  const htmlFinal = procesarTextoMutante(htmlContent);
  const textoPlanoFinal = procesarTextoMutante(text);

  // ================= 3. EL TRUCO MAESTRO: COPIAR Y ALERTAR =================
  const ejecutarFlujoSeguro = (callbackApp) => {
    // 1. Copia el HTML perfecto a la memoria del usuario
    try {
      const blob = new Blob([htmlFinal], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      navigator.clipboard.write([clipboardItem]).catch(() => navigator.clipboard.writeText(textoPlanoFinal));
    } catch (err) {
      navigator.clipboard.writeText(textoPlanoFinal);
    }
    
    // 2. Muestra la pantalla de instrucción
    setMostrarAlertaPegar(true);

    // 3. Abre la app de correos (en blanco para evitar crashes) tras 1.5 segundos
    setTimeout(() => {
      setMostrarAlertaPegar(false);
      callbackApp();
    }, 1800);
  };

  // ================= 4. MOTORES DE ENVÍO SIN ERRORES =================
  const abrirAppOutlookEscritorio = () => {
    ejecutarFlujoSeguro(() => {
      const dest = encodeURIComponent(destinatarioEfectivo || '');
      const asun = encodeURIComponent(subject || '');
      const copiasCC = encodeURIComponent(ccDinamico || '');
      
      // Intentamos forzar Outlook app en celulares. Si falla, usamos el enlace limpio.
      if (esAndroid || esIOS) {
        window.location.href = `ms-outlook://compose?to=${dest}&subject=${asun}&cc=${copiasCC}`;
        setTimeout(() => { window.location.href = `mailto:${dest}?subject=${asun}&cc=${copiasCC}`; }, 1000);
      } else {
        window.location.href = `mailto:${dest}?subject=${asun}&cc=${copiasCC}`;
      }
    });
  };

  const abrirEnGmail = () => {
    ejecutarFlujoSeguro(() => {
      const miCorreoAuditoria = "ohsaravia@celina.com.bo";
      const dest = encodeURIComponent(destinatarioEfectivo || '');
      const asun = encodeURIComponent(subject || '');
      const copiasCC = encodeURIComponent((ccDinamico ? ccDinamico + ', ' : '') + miCorreoAuditoria);

      if (esAndroid || esIOS) {
        window.location.href = `googlegmail://co?to=${dest}&subject=${asun}&cc=${copiasCC}`;
        setTimeout(() => { window.location.href = `mailto:${dest}?subject=${asun}&cc=${copiasCC}`; }, 1000);
      } else {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${dest}&su=${asun}&cc=${copiasCC}`, '_blank');
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between h-full relative overflow-hidden">
      
      {/* 🚀 EL ESCUDO VISUAL QUE ENSEÑA A PEGAR 🚀 */}
      {mostrarAlertaPegar && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">¡Formato Copiado!</h3>
          <p className="text-emerald-100 text-sm font-medium">
            Tu correo se abrirá vacío por seguridad.<br/><br/>
            Presiona <strong className="text-white bg-slate-800 px-2 py-1 rounded">CTRL + V</strong> (o dale a Pegar en tu celular) para colocar los cuadros y colores perfectos.
          </p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 className="font-black text-slate-800 text-base flex items-center">
            <Check className="w-5 h-5 text-emerald-500 mr-2" /> {title || "Vista Previa"}
          </h3>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center">
            <Clock className="w-3 h-3 mr-1" /> Automático ⏱️
          </span>
        </div>

        <div className="mb-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Destinatario (Enviar a):</label>
          <div className="relative">
            <select 
              value={destinatarioEfectivo} 
              onChange={(e) => setSupervisorDestino && setSupervisorDestino(e.target.value)} 
              className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer shadow-inner"
            >
              {contactosDisponibles.map((c, idx) => (
                <option key={idx} value={c.email}>{c.nombre} ({c.email})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">En Copia Automatizada (CC):</label>
          <div className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 truncate">
            {ccDinamico || "Ninguno"}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 max-h-[340px] overflow-y-auto mb-6 shadow-inner text-xs select-all">
          <div dangerouslySetInnerHTML={{ __html: htmlFinal }} />
        </div>
      </div>

      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={() => {
            try {
              const blob = new Blob([htmlFinal], { type: 'text/html' });
              const clipboardItem = new ClipboardItem({ 'text/html': blob });
              navigator.clipboard.write([clipboardItem]).catch(() => navigator.clipboard.writeText(textoPlanoFinal));
            } catch (err) { navigator.clipboard.writeText(textoPlanoFinal); }
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2500);
          }} className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center transition-all shadow-sm ${copiado ? 'bg-emerald-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
            <Copy className="w-4 h-4 mr-1.5" />
            {copiado ? '¡Copiado! ✅' : 'Copiar Formato PC'}
          </button>
          
          <button onClick={abrirAppOutlookEscritorio} className="py-2.5 px-3 bg-[#0072c6] hover:bg-[#005a9e] text-white rounded-xl font-black text-xs flex items-center justify-center shadow transition-all active:scale-95">
            App Outlook 🖥️
          </button>
        </div>
        
        <button onClick={abrirEnGmail} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center justify-center shadow transition-colors relative active:scale-95">
          Abrir en Gmail
          <span className="absolute right-3 text-[9px] font-semibold bg-red-800 px-2 py-0.5 rounded-md opacity-90">+ CC: ohsaravia</span>
        </button>
      </div>
    </div>
  );
}
