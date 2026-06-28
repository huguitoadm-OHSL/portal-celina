import React, { useState, useEffect } from 'react';
import { Copy, Check, Mail, ChevronDown, Clock } from 'lucide-react';

export function ResultCard({ title, text, htmlContent, subject, supervisorDestino, setSupervisorDestino }) {
  const [copiado, setCopiado] = useState(false);

  // ================= 1. DICCIONARIO MAESTRO DE DIRECCIONES Y CONFIGURACIONES =================
  const CONFIG_MÓDULOS = {
    descuentos: {
      palabraClave: ["liquidación", "liquidacion", "descuento"],
      excluirClave: ["campaña", "campana"],
      contactos: [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' },
        { email: 'vchoque@celina.com.bo', nombre: 'Verenice Choque', saludo: 'Estimada Verenice' }
      ]
    },
    proyeccionSemanal: {
      palabraClave: ["proyección semanal", "proyeccion semanal"],
      contactos: [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' }
      ]
    },
    proyeccionDiaria: {
      palabraClave: ["proyección diaria", "proyeccion diaria", "diaria"],
      contactos: [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' }
      ]
    },
    amortizacion: {
      palabraClave: ["amortización", "amortizacion"],
      contactos: [
        { email: 'vchoque@celina.com.bo', nombre: 'Verenice Choque', saludo: 'Estimada Verenice' }
      ]
    },
    recompra: {
      palabraClave: ["recompra"],
      contactos: [
        { email: 'cbarretto@celina.com.bo', nombre: 'Ing. Charles Barretto', saludo: 'Estimado Ing. Charles' },
        { email: 'csalvatierra@celina.com.bo', nombre: 'Cinthia Salvatierra', saludo: 'Estimada Cinthia' },
        { email: 'elizarraga@celina.com.bo', nombre: 'Enrique Lizarraga', saludo: 'Estimado Enrique' }
      ]
    },
    campanas: {
      palabraClave: ["campaña", "campana"],
      contactos: [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'vchoque@celina.com.bo', nombre: 'Verenice Choque', saludo: 'Estimada Verenice' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' }
      ]
    },
    cuotaInicial: {
      palabraClave: ["cuota inicial", "inc."],
      contactos: [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' }
      ]
    },
    bloqueoLote: {
      palabraClave: ["bloqueo", "lote"],
      contactos: [
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'vchoque@celina.com.bo', nombre: 'Verenice Choque', saludo: 'Estimada Verenice' },
        { email: 'lribera@grupopaz.com.bo', nombre: 'Luis Fernando Ribera', saludo: 'Estimado Luis Fernando' }
      ]
    },
    solicitudCodigos: {
      palabraClave: ["código", "codigo", "códigos", "codigos"],
      contactos: [
        { email: 'elizarraga@celina.com.bo', nombre: 'Enrique Lizarraga', saludo: 'Estimado Enrique' },
        { email: 'omendoza@celina.com.bo', nombre: 'Olivia Mendoza Duran', saludo: 'Estimada Olivia' },
        { email: 'rmartinez@celina.com.bo', nombre: 'Rodolfo Martínez', saludo: 'Estimado Rodolfo' }
      ]
    },
    validacionLlamada: {
      palabraClave: ["llamada", "referidos"],
      contactos: [
        { email: 'elizarraga@celina.com.bo', nombre: 'Enrique Lizarraga', saludo: 'Estimado Enrique' },
        { email: 'omendoza@celina.com.bo', nombre: 'Olivia Mendoza Duran', saludo: 'Estimada Olivia' },
        { email: 'rmartinez@celina.com.bo', nombre: 'Rodolfo Martínez', saludo: 'Estimado Rodolfo' }
      ]
    },
    pendienteValidacion: {
      palabraClave: ["pendiente", "pend."],
      contactos: [
        { email: 'elizarraga@celina.com.bo', nombre: 'Enrique Lizarraga', saludo: 'Estimado Enrique' },
        { email: 'omendoza@celina.com.bo', nombre: 'Olivia Mendoza Duran', saludo: 'Estimada Olivia' },
        { email: 'rmartinez@celina.com.bo', font: 'bold', nombre: 'Rodolfo Martínez', saludo: 'Estimado Rodolfo' },
        { email: 'aperez@celina.com.bo', nombre: 'Alex Pérez', saludo: 'Estimado Alex' }
      ]
    },
    rrhh: {
      palabraClave: ["renuncia", "crm", "evaluación", "evaluacion", "postulante", "memorándum", "memorandum"],
      contactos: [
        { email: 'uklein@grupopaz.com.bo', nombre: 'Ulrich Klein Montano', saludo: 'Estimado Ulrich' },
        { email: 'mfroca@celina.com.bo', nombre: 'Maria Fernanda Roca Miranda', saludo: 'Estimada Maria Fernanda' },
        { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' },
        { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' }
      ]
    }
  };

  // ================= 2. DETECTOR INTELIGENTE DE MÓDULO ACTIVO =================
  const obtenerContactosModulo = () => {
    const tituloNormalizado = (title || "").toLowerCase();
    
    // Búsqueda avanzada por exclusión/inclusión de palabras clave
    for (const key in CONFIG_MÓDULOS) {
      const mod = CONFIG_MÓDULOS[key];
      if (mod.excluirClave && mod.excluirClave.some(p => tituloNormalizado.includes(p))) continue;
      if (mod.palabraClave.some(p => tituloNormalizado.includes(p))) {
        return mod.contactos;
      }
    }
    
    // Respaldo maestro por seguridad si no coincide ningún módulo
    return [
      { email: 'mreyes@celina.com.bo', nombre: 'Mauricio Reyes Suarez', saludo: 'Estimado Mauricio' },
      { email: 'rvaca@grupopaz.com.bo', nombre: 'Robert Vaca', saludo: 'Estimado Robert' }
    ];
  };

  const contactosDisponibles = obtenerContactosModulo();
  const contactoSeleccionado = contactosDisponibles.find(c => c.email === supervisorDestino) || contactosDisponibles[0];

  // Forzar selección del primer contacto válido del módulo al cambiar de pestaña
  useEffect(() => {
    if (contactosDisponibles.length > 0 && (!supervisorDestino || !contactosDisponibles.some(c => c.email === supervisorDestino))) {
      setSupervisorDestino(contactosDisponibles[0].email);
    }
  }, [title, contactosDisponibles, supervisorDestino, setSupervisorDestino]);

  // ================= 3. CÁLCULO DE COPIAS AUTOMÁTICAS (CC) =================
  const calcularCcDinamico = () => {
    return contactosDisponibles
      .filter(c => c.email !== supervisorDestino)
      .map(c => c.email)
      .join(', ');
  };
  const ccDinamico = calcularCcDinamico();

  // ================= 4. RELOJ E INYECTOR DE SALUDOS MUTABLES =================
  const obtenerSaludoHorarioBase = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Buenos días";
    if (hora >= 12 && hora < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  const procesarTextoMutante = (contenido) => {
    if (!contenido) return '';
    const saludoBase = obtenerSaludoHorarioBase();
    const nombreSaludo = contactoSeleccionado ? contactoSeleccionado.saludo : 'Estimado/a';
    const saludoCompletoNuevo = `${saludoBase} ${nombreSaludo}`;

    return contenido
      .replace(/Buenas\s+(noches|días|tardes)\s+Estimado\s+Robert/gi, saludoCompletoNuevo)
      .replace(/Buenas\s+(noches|días|tardes)\s+Estimado\s+Mauricio/gi, saludoCompletoNuevo)
      .replace(/Buenas\s+(noches|días|tardes)\s+Estimada\s+Olivia/gi, saludoCompletoNuevo)
      .replace(/Buenas\s+(noches|días|tardes)\s+Estimado\s+Enrique/gi, saludoCompletoNuevo)
      .replace(/Buenas\s+(noches|días|tardes)\s+Estimada\s+Verenice/gi, saludoCompletoNuevo)
      .replace(/Buenas\s+(noches|días|tardes)\s+Estimado\s+Ulrich/gi, saludoCompletoNuevo)
      .replace(/Buenas\s+(noches|días|tardes)\s+Estimada\s+Maria\s+Fernanda/gi, saludoCompletoNuevo)
      .replace(/Buenas\s+(noches|días|tardes)\s+Estimado\s+Ing\.\s+Charles/gi, saludoCompletoNuevo)
      .replace(/Buenas\s+(noches|días|tardes)\s+Estimada\s+Cinthia/gi, saludoCompletoNuevo)
      .replace(/Buenas\s+(noches|días|tardes)\s+Estimado\s+Rodolfo/gi, saludoCompletoNuevo)
      .replace(/Buenas\s+(noches|días|tardes)\s+Estimado\s+Luis\s+Fernando/gi, saludoCompletoNuevo)
      .replace(/Buenas\s+(noches|días|tardes)\s+Estimado\s+Alex/gi, saludoCompletoNuevo)
      .replace(/Buenas\s+(noches|días|tardes)/gi, saludoBase)
      .replace(/\[SALUDO_AUTO\]/gi, nombreSaludo);
  };

  const htmlFinal = procesarTextoMutante(htmlContent);
  const textoPlanoFinal = procesarTextoMutante(text);

  // ================= 5. ENVIADORES INTEGRADOS CON OUTLOOK Y GMAIL =================
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

  const abrirEnGmail = () => {
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(supervisorDestino || '')}&su=${encodeURIComponent(subject || '')}&cc=${encodeURIComponent(ccDinamico)}&body=${encodeURIComponent(textoPlanoFinal)}`;
    window.open(url, '_blank');
  };

  const abrirAppOutlookEscritorio = async () => {
    try {
      const blob = new Blob([htmlFinal], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      await navigator.clipboard.write([clipboardItem]);
    } catch (err) {
      navigator.clipboard.writeText(textoPlanoFinal);
    }
    window.location.href = `mailto:${encodeURIComponent(supervisorDestino || '')}?subject=${encodeURIComponent(subject || '')}&cc=${encodeURIComponent(ccDinamico)}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 className="font-black text-slate-800 text-base flex items-center">
            <Check className="w-5 h-5 text-emerald-500 mr-2" /> {title || "Vista Previa"}
          </h3>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center">
            <Clock className="w-3 h-3 mr-1" /> {obtenerSaludoHorarioBase()} detectado
          </span>
        </div>

        {/* CONTENEDOR ENVIAR A: BLOQUEO RADICAL DE TECLADO */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Destinatario Principal:</label>
          <div className="relative">
            <select 
              value={supervisorDestino || ""} 
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

        {/* CONTENEDOR COPIA (CC) AUTOMÁTICA EN TIEMPO REAL */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">En Copia Automatizada (CC):</label>
          <div className="w-full px-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-500 select-none truncate">
            {ccDinamico || "Ninguno (Lista única)"}
          </div>
        </div>

        {/* CUERPO DEL CORREO */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 max-h-[340px] overflow-y-auto mb-6 shadow-inner text-xs">
          <div dangerouslySetInnerHTML={{ __html: htmlFinal }} />
        </div>
      </div>

      {/* BOTONERA CORPORATIVA */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={copiarAlPortapapeles} className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center transition-all shadow-sm ${copiado ? 'bg-emerald-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
            {copiado ? '¡Copiado! ✅' : 'Copiar Formato PC'}
          </button>
          <button onClick={abrirAppOutlookEscritorio} className="py-2.5 px-3 bg-[#0072c6] hover:bg-[#005a9e] text-white rounded-xl font-black text-xs flex items-center justify-center shadow transition-all">
            App Outlook 🖥️
          </button>
        </div>
        <button onClick={abrirEnGmail} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center justify-center shadow transition-colors">
          Abrir en Gmail
        </button>
      </div>
    </div>
  );
}
