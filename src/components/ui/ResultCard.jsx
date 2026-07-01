import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Check, Mail, ChevronDown, Clock } from 'lucide-react';

export function ResultCard({ title, text, htmlContent, subject, cc, supervisorDestino, setSupervisorDestino }) {
  const [copiado, setCopiado] = useState(false);

  // ================= 1. DETECCIÓN DE ENTORNO (CELULAR VS PC) =================
  const esAndroid = /Android/i.test(navigator.userAgent);
  const esIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const esMovil = esAndroid || esIOS;

  // ================= 2. ESCÁNER PROFUNDO DE FRASES EXACTAS =================
  // Soluciona el error de los correos cruzados buscando frases completas en todo el texto.
  const contactosDisponibles = useMemo(() => {
    const contenidoTotal = [title, subject, text, htmlContent].join(" ").toLowerCase();

    // 1. RECOMPRA
    if (contenidoTotal.includes("recompra")) {
      return [
        { email: 'cbarretto@celina.com.bo', nombre: 'Ing. Charles Barretto', saludo: 'Estimado Ing. Charles' },
        { email: 'csalvatierra@celina.com.bo', nombre: 'Cinthia Salvatierra', saludo: 'Estimada Cinthia' },
        { email: 'elizarraga@celina.com.bo', nombre: 'Enrique Lizarraga', saludo: 'Estimado Enrique' }
      ];
    }

    // 2. TRÍADA DE PLATAFORMA (Códigos, Validaciones, Referidos, Pendientes)
    if (
      contenidoTotal.includes("código de liquidación") || contenidoTotal.includes("codigo de liquidacion") ||
      contenidoTotal.includes("código de amortización") || contenidoTotal.includes("codigo de amortizacion") ||
      contenidoTotal.includes("validación de llamada") || contenidoTotal.includes("validacion de llamada") ||
      contenidoTotal.includes("cliente sin validación") || contenidoTotal.includes("cliente sin validacion") ||
      contenidoTotal.includes("cliente referido")
    ) {
      return [
        { email: 'elizarraga@celina.com.bo', nombre: 'Enrique Lizarraga', saludo: 'Estimado Enrique' },
        { email: 'omendoza@celina.com.bo', nombre: 'Olivia Mendoza Duran', saludo: 'Estimada Olivia' },
        { email: 'rmartinez@celina.com.bo', nombre: 'Rodolfo Martínez', saludo: 'Estimado Rodolfo' }
      ];
    }

    // 3. RECURSOS HUMANOS (RRHH)
    if (
      contenidoTotal.includes("memorándum") || contenidoTotal.includes("memorandum") ||
      contenidoTotal.includes("carta de renuncia") || contenidoTotal.includes("renuncia") ||
      contenidoTotal.includes("crm") || contenidoTotal.includes("evaluación") || 
      contenidoTotal.includes("postulante")
    ) {
      return [
        { email: 'uklein@grupopaz.com.bo', nombre: 'Ulrich Klein Montano', saludo: 'Estimado Ulrich' },
        { email: 'mfroca@celina.com.bo', nombre: 'Maria Fernanda Roca Miranda', saludo: 'Estimada Maria Fernanda' },
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' }
      ];
    }

    // 4. BLOQUEO DE LOTE
    if (contenidoTotal.includes("bloqueo") || contenidoTotal.includes("lote")) {
      return [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'vchoque@celina.com.bo', nombre: 'Verenice Choque', saludo: 'Estimada Verenice' },
        { email: 'lribera@grupopaz.com.bo', nombre: 'Luis Fernando Ribera', saludo: 'Estimado Luis Fernando' }
      ];
    }

    // 5. AMORTIZACIÓN A CAPITAL
    if (contenidoTotal.includes("amortización a capital") || contenidoTotal.includes("amortizacion a capital")) {
      return [
        { email: 'vchoque@celina.com.bo', nombre: 'Verenice Choque', saludo: 'Estimada Verenice' }
      ];
    }

    // 6. CUOTA INICIAL Y PROYECCIONES
    if (
      contenidoTotal.includes("cuota inicial") || 
      contenidoTotal.includes("proyección") || contenidoTotal.includes("proyeccion") ||
      contenidoTotal.includes("diaria") || contenidoTotal.includes("semanal")
    ) {
      return [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' }
      ];
    }

    // 7. DESCUENTOS Y LIQUIDACIONES
    if (
      contenidoTotal.includes("descuento") || 
      contenidoTotal.includes("campaña") || contenidoTotal.includes("campana") ||
      contenidoTotal.includes("liquidación") || contenidoTotal.includes("liquidacion")
    ) {
      return [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' },
        { email: 'vchoque@celina.com.bo', nombre: 'Verenice Choque', saludo: 'Estimada Verenice' }
      ];
    }

    // RESPALDO CORPORATIVO
    return [
      { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' },
      { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' }
    ];
  }, [title, subject, text, htmlContent]);

  // ================= 3. SELECCIÓN ABSOLUTA =================
  const contactoSeleccionado = contactosDisponibles.find(c => c.email === supervisorDestino);
  const destinatarioEfectivo = contactoSeleccionado ? contactoSeleccionado.email : contactosDisponibles[0].email;
  const objetoDestinatario = contactoSeleccionado || contactosDisponibles[0];

  useEffect(() => {
    if (supervisorDestino !== destinatarioEfectivo && setSupervisorDestino) {
      setSupervisorDestino(destinatarioEfectivo);
    }
  }, [destinatarioEfectivo, supervisorDestino, setSupervisorDestino]);

  // ================= 4. COPIAS AUTOMÁTICAS (CC) =================
  const ccDinamico = useMemo(() => {
    const copiasExtra = contactosDisponibles
      .filter(c => c.email !== destinatarioEfectivo)
      .map(c => c.email);
    const copiasProps = cc ? cc.split(',').map(s => s.trim()).filter(Boolean) : [];
    return [...new Set([...copiasExtra, ...copiasProps])].join(', ');
  }, [contactosDisponibles, destinatarioEfectivo, cc]);

  // ================= 5. MUTACIÓN DEL SALUDO =================
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

  // ================= 6. MOTORES DE ENVÍO DE CLASE MUNDIAL =================
  const copiarAlPortapapeles = async () => {
    try {
      const blob = new Blob([htmlFinal], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      await navigator.clipboard.write([clipboardItem]);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch (err) {
      navigator.clipboard.writeText(textoPlanoFinal);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  // 🔥 GMAIL MÓVIL Y PC: Fuerza la apertura de la APP en celulares
  const abrirEnGmail = () => {
    const miCorreoAuditoria = "ohsaravia@celina.com.bo";
    const dest = encodeURIComponent(destinatarioEfectivo || '');
    const asun = encodeURIComponent(subject || '');
    const copiasCC = encodeURIComponent(ccDinamico || '');
    const copiaBCC = encodeURIComponent(miCorreoAuditoria);
    const cuerpo = encodeURIComponent(textoPlanoFinal || '');

    if (esAndroid) {
      window.location.href = `intent://compose?to=${dest}&subject=${asun}&cc=${copiasCC}&bcc=${copiaBCC}&body=${cuerpo}#Intent;package=com.google.android.gm;scheme=mailto;end;`;
    } else if (esIOS) {
      window.location.href = `googlegmail://co?to=${dest}&subject=${asun}&cc=${copiasCC}&bcc=${copiaBCC}&body=${cuerpo}`;
      setTimeout(() => { window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${dest}&su=${asun}&cc=${copiasCC}&bcc=${copiaBCC}&body=${cuerpo}`, '_blank'); }, 1500);
    } else {
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${dest}&su=${asun}&cc=${copiasCC}&bcc=${copiaBCC}&body=${cuerpo}`, '_blank');
    }
  };

  // 🔥 OUTLOOK PC Y MÓVIL: Evita Pantalla Blanca con comandos nativos y retraso estratégico
  const abrirAppOutlookEscritorio = (e) => {
    e.preventDefault();
    copiarAlPortapapeles(); // Copia al portapapeles silenciosamente

    const dest = encodeURIComponent(destinatarioEfectivo || '');
    const asun = encodeURIComponent(subject || '');
    const copiasCC = encodeURIComponent(ccDinamico || '');
    const cuerpoVacio = encodeURIComponent(" "); // EVITA EL BUCLE INFINITO EN WINDOWS 11

    setTimeout(() => {
      if (esMovil) {
        window.location.href = `ms-outlook://compose?to=${dest}&subject=${asun}&cc=${copiasCC}`;
        // Si no tienen Outlook app, cae en el mailto clásico de forma segura
        setTimeout(() => { window.location.href = `mailto:${dest}?subject=${asun}&cc=${copiasCC}&body=${cuerpoVacio}`; }, 1000);
      } else {
        // En PC usamos "_top" para que Windows no bloquee el subproceso
        window.open(`mailto:${dest}?subject=${asun}&cc=${copiasCC}&body=${cuerpoVacio}`, '_top');
      }
    }, 350); // Le damos 350ms a la PC para que copie la tabla en memoria antes de abrir Outlook
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 className="font-black text-slate-800 text-base flex items-center">
            <Check className="w-5 h-5 text-emerald-500 mr-2" /> {title || "Vista Previa del Mensaje"}
          </h3>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center">
            <Clock className="w-3 h-3 mr-1" /> Automático ⏱️
          </span>
        </div>

        {/* SELECTOR DESPLEGABLE */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Destinatario (Enviar a):</label>
          <div className="relative">
            <select 
              value={destinatarioEfectivo} 
              onChange={(e) => setSupervisorDestino && setSupervisorDestino(e.target.value)} 
              className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer shadow-inner"
            >
              {contactosDisponibles.map((c, idx) => (
                <option key={idx} value={c.email}>
                  {c.nombre} ({c.email})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>

        {/* COPIA CC */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">En Copia Automatizada (CC):</label>
          <div className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
            {ccDinamico || "Ninguno"}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 max-h-[340px] overflow-y-auto mb-6 shadow-inner text-xs select-all">
          <div dangerouslySetInnerHTML={{ __html: htmlFinal }} />
        </div>
      </div>

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
            onClick={abrirAppOutlookEscritorio} 
            className="py-2.5 px-3 bg-[#0072c6] hover:bg-[#005a9e] text-white rounded-xl font-black text-xs flex items-center justify-center shadow transition-all active:scale-95"
          >
            App Outlook 🖥️
          </button>
        </div>
        
        <button 
          onClick={abrirEnGmail} 
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center justify-center shadow transition-colors relative active:scale-95"
        >
          Abrir en Gmail
          <span className="absolute right-3 text-[9px] font-semibold bg-red-800 px-2 py-0.5 rounded-md opacity-90">
            + CC: ohsaravia
          </span>
        </button>
      </div>
    </div>
  );
}
