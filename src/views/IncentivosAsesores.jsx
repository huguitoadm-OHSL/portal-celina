import React, { useState, useMemo } from 'react';
import { 
  Trophy, Award, TrendingUp, Users, CheckCircle2, XCircle, 
  AlertCircle, Copy, Monitor, Mail, Send, Sparkles, Clock, 
  Calendar, Flame, ShieldCheck, ChevronRight, FileText, ArrowRight
} from 'lucide-react';

const CORREO_RESPALDO_OSCAR = "ohsaravia@celina.com.bo";

const DIRECTORES_APROBACION = [
  { nombre: "Lic. Mauricio Reyes", cargo: "Jefe de Ventas", email: "mreyes@celina.com.bo" },
  { nombre: "Lic. Robert Vaca", cargo: "Gerente Regional", email: "rvaca@grupopaz.com.bo" }
];

// REGLAS OFICIALES DEL CONCURSO INTERNO CELINA 2026
const ETAPAS_CONCURSO = {
  "sep_oct": {
    id: "sep_oct",
    nombre: "Septiembre – Octubre",
    productividadRequeridaPct: 60,
    minVentas: 2,
    minColocacionUsd: 15000,
    descripcion: "Etapa de Recuperación e Impulso (Vigente)"
  },
  "nov": {
    id: "nov",
    nombre: "Noviembre",
    productividadRequeridaPct: 65,
    minVentas: 2,
    minColocacionUsd: 18000,
    descripcion: "Etapa de Consolidación"
  },
  "dic_adelante": {
    id: "dic_adelante",
    nombre: "Diciembre en adelante",
    productividadRequeridaPct: 70,
    minVentas: 2,
    minColocacionUsd: 21000,
    descripcion: "Etapa de Máximo Rendimiento"
  }
};

const ASESORES_INICIALES = [
  { id: 1, nombre: "Carlos Enrique Calderon Montano", ventas: 1, colocacion: 6500, carpetasAlDia: true },
  { id: 2, nombre: "Ely Gonzales Garcia", ventas: 0, colocacion: 0, carpetasAlDia: true },
  { id: 3, nombre: "Jaime Fabricio Rios Castro", ventas: 0, colocacion: 0, carpetasAlDia: true },
  { id: 4, nombre: "Jimmy Gonzales Nuñez", ventas: 0, colocacion: 0, carpetasAlDia: true },
  { id: 5, nombre: "Jose Gabriel Padilla Loayza", ventas: 0, colocacion: 0, carpetasAlDia: true },
  { id: 6, nombre: "Marisol Urgel Pizarro", ventas: 0, colocacion: 0, carpetasAlDia: true },
  { id: 7, nombre: "Merly Mendez Hurtado", ventas: 0, colocacion: 0, carpetasAlDia: true }
];

export default function IncentivosAsesores() {
  const [etapaSeleccionada, setEtapaSeleccionada] = useState("sep_oct");
  const [metaGrupalUSD, setMetaGrupalUSD] = useState(111000);
  const [asesores, setAsesores] = useState(ASESORES_INICIALES);
  const [destinatarioEmail, setDestinatarioEmail] = useState(DIRECTORES_APROBACION[0].email);
  const [notificacion, setNotificacion] = useState(null);

  const etapaActual = ETAPAS_CONCURSO[etapaSeleccionada];

  const formatMoneda = (val) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val || 0);

  const getSaludoHorario = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Buenos días";
    if (hora >= 12 && hora < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  const handleAsesorChange = (id, field, value) => {
    setAsesores(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, [field]: value };
      }
      return a;
    }));
  };

  // ================= MOTOR DE EVALUACIÓN SEGÚN BASES OFICIALES =================
  const evaluacion = useMemo(() => {
    const meta = parseFloat(metaGrupalUSD) || 111000;
    const meta110 = meta * 1.10;
    const meta120 = meta * 1.20;

    // 1. Evaluación individual por asesor
    const asesoresEvaluados = asesores.map(as => {
      const v = parseInt(as.ventas) || 0;
      const c = parseFloat(as.colocacion) || 0;
      const carpetasOk = as.carpetasAlDia;

      const cumpleVentas = v >= etapaActual.minVentas;
      const cumpleColocacion = c >= etapaActual.minColocacionUsd;
      const cumpleVolumen = cumpleVentas || cumpleColocacion;
      const esProductivo = cumpleVolumen && carpetasOk;

      let razon = "Pendiente de meta individual";
      if (!carpetasOk) razon = "Observado: Carpetas fuera de los 10 días";
      else if (cumpleVentas && cumpleColocacion) razon = `Cumple doble (${v} ventas y $${formatMoneda(c)})`;
      else if (cumpleVentas) razon = `Cumple por ventas (${v} de ${etapaActual.minVentas} req.)`;
      else if (cumpleColocacion) razon = `Cumple por colocación ($${formatMoneda(c)} >= $${formatMoneda(etapaActual.minColocacionUsd)})`;

      return {
        ...as,
        ventasNum: v,
        colocacionNum: c,
        cumpleVentas,
        cumpleColocacion,
        esProductivo,
        razon
      };
    });

    // 2. Métricas grupales
    const colocacionTotal = asesoresEvaluados.reduce((sum, a) => sum + a.colocacionNum, 0);
    const ventasTotales = asesoresEvaluados.reduce((sum, a) => sum + a.ventasNum, 0);
    const porcentajeGrupal = meta > 0 ? (colocacionTotal / meta) * 100 : 0;

    const totalProductivos = asesoresEvaluados.filter(a => a.esProductivo).length;
    const porcentajeProductividad = (totalProductivos / asesores.length) * 100;
    const minProductivosRequeridos = Math.ceil(asesores.length * (etapaActual.productividadRequeridaPct / 100));
    const cumpleProductividad = porcentajeProductividad >= etapaActual.productividadRequeridaPct;

    // 3. Determinación de Niveles de Premiación Ganados
    let nivelGanado = null;
    let bonoPorAsesorBs = 0;
    let textoBono = "Sin bono alcanzado";
    let claseEstado = "border-slate-800 bg-[#070e1c]";

    if (cumpleProductividad) {
      if (porcentajeGrupal >= 120) {
        nivelGanado = "NIVEL 2";
        bonoPorAsesorBs = 1100;
        textoBono = "¡NIVEL 2 ALCANZADO (120%)! Bono de 1.100 Bs por asesor productivo";
        claseEstado = "border-emerald-500/60 bg-gradient-to-r from-[#04241b] to-[#070e1c]";
      } else if (porcentajeGrupal >= 110) {
        nivelGanado = "NIVEL 1";
        bonoPorAsesorBs = 700;
        textoBono = "¡NIVEL 1 ALCANZADO (110%)! Bono de 700 Bs por asesor productivo";
        claseEstado = "border-cyan-500/60 bg-gradient-to-r from-[#08182b] to-[#070e1c]";
      } else {
        textoBono = `Productividad cumplida (${porcentajeProductividad.toFixed(0)}%), pero falta colocación para el 110% (Avance: ${porcentajeGrupal.toFixed(1)}%)`;
      }
    } else {
      if (porcentajeGrupal >= 110) {
        textoBono = `Colocación grupal alcanzada (${porcentajeGrupal.toFixed(1)}%), pero falta productividad (Logrado: ${totalProductivos}/${minProductivosRequeridos} asesores)`;
      } else {
        textoBono = `En carrera: Faltan colocación y productividad requerida de la etapa.`;
      }
    }

    const totalBonoEquipoBs = bonoPorAsesorBs * totalProductivos;
    const faltaPara110Usd = Math.max(0, meta110 - colocacionTotal);
    const faltaPara120Usd = Math.max(0, meta120 - colocacionTotal);
    const faltanProductivos = Math.max(0, minProductivosRequeridos - totalProductivos);

    return {
      meta,
      meta110,
      meta120,
      colocacionTotal,
      ventasTotales,
      porcentajeGrupal,
      totalProductivos,
      porcentajeProductividad,
      minProductivosRequeridos,
      cumpleProductividad,
      nivelGanado,
      bonoPorAsesorBs,
      totalBonoEquipoBs,
      textoBono,
      claseEstado,
      faltaPara110Usd,
      faltaPara120Usd,
      faltanProductivos,
      asesoresEvaluados
    };
  }, [metaGrupalUSD, asesores, etapaActual]);

  const destinatarioObj = useMemo(() => {
    return DIRECTORES_APROBACION.find(d => d.email === destinatarioEmail) || DIRECTORES_APROBACION[0];
  }, [destinatarioEmail]);

  const correosCC = useMemo(() => {
    const otros = DIRECTORES_APROBACION.filter(d => d.email !== destinatarioEmail).map(d => d.email);
    return [...otros, CORREO_RESPALDO_OSCAR].join(", ");
  }, [destinatarioEmail]);

  const asuntoCorreo = `Reporte y Solicitud de Incentivo Celina 2026 (${etapaActual.nombre}) - Equipo Montero Oscar Saravia`;

  const generarHTMLCorreo = () => {
    return `
<div style="font-family: Arial, Helvetica, sans-serif; color: #0f172a; max-width: 680px; margin: 0 auto; line-height: 1.5;">
  <p style="margin: 0 0 10px; font-size: 15px;">${getSaludoHorario()}</p>
  <p style="margin: 0 0 16px; font-size: 15px;">Estimado <strong>${destinatarioObj.nombre}</strong>,</p>
  <p style="margin: 0 0 20px; font-size: 14px; color: #334155;">
    Por medio del presente correo, presento el informe de cumplimiento de metas y liquidación del 
    <strong>CONCURSO INTERNO "INCENTIVO CELINA 2026"</strong> para la etapa <strong>${etapaActual.nombre}</strong>, 
    correspondiente a la Supervisión Comercial de Montero (Supervisor: Oscar Hugo Saravia L.):
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #070e1c; border: 2px solid ${evaluacion.nivelGanado ? '#10b981' : '#00e5ff'}; border-radius: 14px; margin-bottom: 22px; color: #ffffff;">
    <tr>
      <td style="padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="font-size: 10px; color: #00e5ff; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">BASES DEL CONCURSO • ETAPA ${etapaActual.nombre.toUpperCase()}</span>
              <div style="font-size: 22px; font-weight: 900; color: #ffffff; margin-top: 3px;">EQUIPO "MÁQUINA DE VENTAS"</div>
              <div style="font-size: 12px; color: #94a3b8;">Agencia Montero • Meta Base 100%: $ ${formatMoneda(evaluacion.meta)} USD</div>
            </td>
            <td align="right" valign="top">
              <span style="display: inline-block; background-color: ${evaluacion.nivelGanado ? '#04241b' : '#0c1a30'}; border: 1px solid ${evaluacion.nivelGanado ? '#10b981' : '#1e3a5f'}; color: ${evaluacion.nivelGanado ? '#34d399' : '#38bdf8'}; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 900;">
                ${evaluacion.nivelGanado || "EN CARRERA"}
              </span>
            </td>
          </tr>
        </table>

        <div style="margin: 20px 0 15px; text-align: center; background-color: #050b18; padding: 18px; border-radius: 12px; border: 1px solid #14233c;">
          <span style="font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase;">BONO INDIVIDUAL POR ASESOR PRODUCTIVO</span>
          <div style="font-size: 42px; font-weight: 900; color: ${evaluacion.nivelGanado ? '#34d399' : '#e2e8f0'}; letter-spacing: -1px; margin: 4px 0;">
            ${evaluacion.bonoPorAsesorBs > 0 ? `${formatMoneda(evaluacion.bonoPorAsesorBs)} Bs.` : '0 Bs.'}
          </div>
          <div style="font-size: 13px; color: #94a3b8;">
            Total a liquidar equipo (${evaluacion.totalProductivos} asesores calificados): 
            <strong style="color: #ffffff; font-size: 15px;">${formatMoneda(evaluacion.totalBonoEquipoBs)} Bs.</strong>
          </div>
        </div>

        <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 12px; border-top: 1px solid #1e3a5f;">
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Colocación Grupal Alcanzada:</td>
            <td align="right" style="color: #ffffff; font-weight: bold;">$ ${formatMoneda(evaluacion.colocacionTotal)} USD (${evaluacion.porcentajeGrupal.toFixed(1)}% de meta)</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Productividad del Equipo:</td>
            <td align="right" style="color: #ffffff; font-weight: bold;">${evaluacion.totalProductivos} de ${asesores.length} asesores (${evaluacion.porcentajeProductividad.toFixed(0)}% vs ${etapaActual.productividadRequeridaPct}% req.)</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Condición Individual de la Etapa:</td>
            <td align="right" style="color: #38bdf8; font-weight: bold;">2 ventas o USD ${formatMoneda(etapaActual.minColocacionUsd)}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 6px 0;">Política de Carpetas:</td>
            <td align="right" style="color: #34d399; font-weight: bold;">Dentro de los 10 días post venta</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <p style="font-size: 13px; font-weight: bold; color: #0f172a; margin-bottom: 8px;">DETALLE NOMINAL DE ASESORES Y ESTADO DE PRODUCTIVIDAD:</p>
  <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 12px; border-collapse: collapse; border: 1px solid #cbd5e1; margin-bottom: 22px;">
    <thead>
      <tr style="background-color: #f1f5f9; color: #334155; text-align: left;">
        <th style="border: 1px solid #cbd5e1;">Asesor</th>
        <th style="border: 1px solid #cbd5e1; text-align: center;">Ventas</th>
        <th style="border: 1px solid #cbd5e1; text-align: right;">Colocación ($)</th>
        <th style="border: 1px solid #cbd5e1; text-align: center;">10 Días</th>
        <th style="border: 1px solid #cbd5e1; text-align: center;">Condición</th>
        <th style="border: 1px solid #cbd5e1; text-align: right;">Bono Bs.</th>
      </tr>
    </thead>
    <tbody>
      ${evaluacion.asesoresEvaluados.map(a => `
        <tr style="background-color: ${a.esProductivo ? '#f0fdf4' : '#ffffff'};">
          <td style="border: 1px solid #cbd5e1; font-weight: bold; color: #0f172a;">${a.nombre}</td>
          <td style="border: 1px solid #cbd5e1; text-align: center;">${a.ventasNum}</td>           <td style="border: 1px solid #cbd5e1; text-align: right; font-family: monospace;">$ ${formatMoneda(a.colocacionNum)}</td>
          <td style="border: 1px solid #cbd5e1; text-align: center; color: ${a.carpetasAlDia ? '#16a34a' : '#dc2626'}; font-weight: bold;">
            ${a.carpetasAlDia ? 'AL DÍA' : 'OBSERVADO'}
          </td>
          <td style="border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: ${a.esProductivo ? '#16a34a' : '#64748b'};">
            ${a.esProductivo ? 'PRODUCTIVO' : 'NO CUMPLE'}
          </td>
          <td style="border: 1px solid #cbd5e1; text-align: right; font-weight: bold; font-family: monospace; color: ${a.esProductivo && evaluacion.bonoPorAsesorBs > 0 ? '#16a34a' : '#94a3b8'};">
            ${a.esProductivo && evaluacion.bonoPorAsesorBs > 0 ? `${formatMoneda(evaluacion.bonoPorAsesorBs)} Bs.` : '0 Bs.'}
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <p style="margin: 0 0 16px; font-size: 14px;">Quedo atento a la confirmación y proceso de pago del incentivo grupal.</p>
  <p style="margin: 0 0 4px; font-size: 14px;">Saludos cordiales,</p>
  <p style="margin: 0; font-size: 15px; font-weight: bold; color: #0f172a;">Oscar Hugo Saravia L.</p>
  <p style="margin: 0; font-size: 12px; color: #64748b;">Supervisor Comercial • Celina Urbanizaciones</p>
</div>
`;
  };

  const generarTextoPlano = () => {
    return `${getSaludoHorario()}

Estimado ${destinatarioObj.nombre},

Presento el informe oficial del concurso "INCENTIVO CELINA 2026" (${etapaActual.nombre}):

📍 SUPERVISIÓN: Oscar Saravia L. (Montero)
🎯 META GRUPAL: $ ${formatMoneda(evaluacion.meta)} USD
📊 COLOCACIÓN LOGRADA: $ ${formatMoneda(evaluacion.colocacionTotal)} USD (${evaluacion.porcentajeGrupal.toFixed(1)}%)
👥 PRODUCTIVIDAD LOGRADA: ${evaluacion.totalProductivos} de ${asesores.length} asesores (${evaluacion.porcentajeProductividad.toFixed(0)}% vs ${etapaActual.productividadRequeridaPct}% req.)

🏆 RESULTADO DEL EQUIPO:
${evaluacion.textoBono}
• Bono por asesor calificado: ${formatMoneda(evaluacion.bonoPorAsesorBs)} Bs.
• Total liquidación del equipo: ${formatMoneda(evaluacion.totalBonoEquipoBs)} Bs.

RESUMEN POR ASESOR:
${evaluacion.asesoresEvaluados.map(a => `• ${a.nombre}: ${a.ventasNum} vts \vert{}$${formatMoneda(a.colocacionNum)} \vert{}${a.esProductivo ? 'PRODUCTIVO (Gana ' + formatMoneda(evaluacion.bonoPorAsesorBs) + ' Bs)' : 'NO CUMPLE'}`).join('\n')}

Saludos cordiales,
Oscar Hugo Saravia L.`;
  };

  const copiarFormatoHTML = async () => {
    const html = generarHTMLCorreo();
    const texto = generarTextoPlano();
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const item = new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([texto], { type: "text/plain" })
        });
        await navigator.clipboard.write([item]);
        setNotificacion("¡Planilla copiada con formato! Pégala en tu correo.");
      } else {
        await navigator.clipboard.writeText(html);
        setNotificacion("¡Planilla copiada!");
      }
    } catch {
      await navigator.clipboard.writeText(texto);
      setNotificacion("¡Texto copiado!");
    }
    setTimeout(() => setNotificacion(null), 3500);
  };

  const enviarAppOutlook = () => {
    copiarFormatoHTML();
    const bodyEncoded = encodeURIComponent(generarTextoPlano());
    const subjectEncoded = encodeURIComponent(asuntoCorreo);
    const toEncoded = encodeURIComponent(destinatarioEmail);
    const ccEncoded = encodeURIComponent(correosCC);
    window.location.href = `mailto:${toEncoded}?cc=${ccEncoded}&subject=${subjectEncoded}&body=${bodyEncoded}`;
    setNotificacion("Abriendo Outlook con To y CC. ¡Pega el cuadro con Ctrl+V!");
  };

  const abrirEnGmailWeb = () => {
    copiarFormatoHTML();
    const bodyEncoded = encodeURIComponent(generarTextoPlano());
    const subjectEncoded = encodeURIComponent(asuntoCorreo);
    const toEncoded = encodeURIComponent(destinatarioEmail);
    const ccEncoded = encodeURIComponent(correosCC);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${toEncoded}&cc=${ccEncoded}&su=${subjectEncoded}&body=${bodyEncoded}`;
    window.open(gmailUrl, "_blank");
    setNotificacion("Gmail abierto con copia a ohsaravia@celina.com.bo. ¡Pega con Ctrl+V!");
  };

  const textoWhatsApp = `🔥 *INCENTIVO CELINA 2026 - EQUIPO MONTERO* 🔥\n\n` +
    `📅 *Etapa:* ${etapaActual.nombre}\n` +
    `🎯 *Colocación:* $ ${formatMoneda(evaluacion.colocacionTotal)} / $ ${formatMoneda(evaluacion.meta)} (${evaluacion.porcentajeGrupal.toFixed(1)}%)\n` +
    `👥 *Productividad:* ${evaluacion.totalProductivos}/${asesores.length} asesores (${evaluacion.porcentajeProductividad.toFixed(0)}%)\n\n` +
    `🏆 *ESTADO ACTUAL:* ${evaluacion.nivelGanado ? `¡${evaluacion.nivelGanado} GANADO! (${formatMoneda(evaluacion.bonoPorAsesorBs)} Bs por asesor)` : 'EN CARRERA'}\n\n` +
    `💡 *Regla individual:* 2 ventas o USD ${formatMoneda(etapaActual.minColocacionUsd)} + Carpetas en 10 días.\n` +
    `Supervisor: Oscar Saravia L.`;

  return (
    <div className="w-full text-slate-100 font-sans space-y-6 pb-12 antialiased">
      {/* ================= HERO PRINCIPAL ================= */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden transition-all duration-500 ${evaluacion.claseEstado}`}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
                CONCURSO INTERNO OFICIAL CELINA 2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Trophy className={`w-8 h-8 ${evaluacion.nivelGanado ? 'text-emerald-400 animate-bounce' : 'text-amber-400'}`} />
              INCENTIVO <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400">CELINA 2026</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Recuperación del incentivo grupal por colocación de equipo (110% o 120%) + productividad escalonada individual.
            </p>
          </div>

          {/* CARD DE BONO DESBLOQUEADO */}
          <div className="bg-[#050b18]/90 border border-[#1e3a5f] p-5 rounded-2xl text-center shadow-xl min-w-[240px] w-full lg:w-auto">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">
              Bono Por Asesor Productivo
            </span>
            <div className="text-4xl font-black text-white font-mono flex items-center justify-center gap-1.5">
              <span className={evaluacion.bonoPorAsesorBs > 0 ? "text-emerald-400" : "text-slate-400"}>
                {evaluacion.bonoPorAsesorBs > 0 ? `${formatMoneda(evaluacion.bonoPorAsesorBs)}` : '0'}
              </span>
              <span className="text-lg text-slate-400">Bs.</span>
            </div>
            <div className="text-[11px] font-bold text-cyan-300 mt-1">
              {evaluacion.nivelGanado ? `${evaluacion.nivelGanado} DESBLOQUEADO` : 'Aún no clasificado'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Total equipo: Bs. {formatMoneda(evaluacion.totalBonoEquipoBs)}
            </div>
          </div>
        </div>
      </div>

      {/* ================= SELECTOR DE ETAPA Y METAS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.values(ETAPAS_CONCURSO).map(et => {
          const esActiva = etapaSeleccionada === et.id;
          return (
            <button
              key={et.id}
              onClick={() => setEtapaSeleccionada(et.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                esActiva 
                  ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,229,255,0.15)] ring-1 ring-cyan-400' 
                  : 'bg-[#070e1c] border-[#14233c] text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black uppercase tracking-wider">{et.nombre}</span>
                {esActiva && (
                  <span className="text-[9px] bg-cyan-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                    Activa
                  </span>
                )}
              </div>
              <p className="text-[11px] font-bold text-cyan-300">
                Productividad requerida: {et.productividadRequeridaPct}%
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Asesor productivo: <strong>{et.minVentas} ventas</strong> o <strong>USD {formatMoneda(et.minColocacionUsd)}</strong>
              </p>
            </button>
          );
        })}
      </div>

      {/* ================= CONDICIÓN DE PREMIACIÓN (110% vs 120%) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NIVEL 1: 110% */}
        <div className={`p-5 rounded-3xl border transition-all ${evaluacion.porcentajeGrupal >= 110 && evaluacion.cumpleProductividad ? 'bg-[#06201a] border-emerald-500/60 shadow-lg' : 'bg-[#070e1c] border-[#14233c]'}`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block mb-0.5">NIVEL 1 DE PREMIACIÓN</span>
              <h3 className="text-xl font-black text-white">COLOCACIÓN GRUPAL 110%</h3>
              <p className="text-xs text-slate-400">+ Productividad {etapaActual.productividadRequeridaPct}% de la etapa</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-cyan-300 font-mono">700 Bs.</span>
              <span className="block text-[9px] text-slate-400 uppercase">Por Asesor</span>
            </div>
          </div>
          <div className="text-xs flex justify-between pt-2 border-t border-[#14233c]">
            <span className="text-slate-400">Meta Requerida:</span>
            <strong className="text-white font-mono">$ {formatMoneda(evaluacion.meta110)} USD</strong>
          </div>
          <div className="text-xs flex justify-between mt-1">
            <span className="text-slate-400">Estado:</span>
            <strong className={evaluacion.porcentajeGrupal >= 110 ? "text-emerald-400" : "text-amber-400"}>
              {evaluacion.colocacionTotal >= evaluacion.meta110 ? "✓ Colocación cumplida" : `Faltan $ ${formatMoneda(evaluacion.faltaPara110Usd)} USD`}
            </strong>
          </div>
        </div>

        {/* NIVEL 2: 120% */}
        <div className={`p-5 rounded-3xl border transition-all ${evaluacion.porcentajeGrupal >= 120 && evaluacion.cumpleProductividad ? 'bg-[#06201a] border-emerald-500/60 shadow-lg' : 'bg-[#070e1c] border-[#14233c]'}`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-0.5">NIVEL 2 DE PREMIACIÓN</span>
              <h3 className="text-xl font-black text-white">COLOCACIÓN GRUPAL 120%</h3>
              <p className="text-xs text-slate-400">+ Productividad {etapaActual.productividadRequeridaPct}% de la etapa</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400 font-mono">1.100 Bs.</span>
              <span className="block text-[9px] text-slate-400 uppercase">Por Asesor</span>
            </div>
          </div>
          <div className="text-xs flex justify-between pt-2 border-t border-[#14233c]">
            <span className="text-slate-400">Meta Requerida:</span>
            <strong className="text-white font-mono">$ {formatMoneda(evaluacion.meta120)} USD</strong>
          </div>
          <div className="text-xs flex justify-between mt-1">
            <span className="text-slate-400">Estado:</span>
            <strong className={evaluacion.porcentajeGrupal >= 120 ? "text-emerald-400" : "text-amber-400"}>
              {evaluacion.colocacionTotal >= evaluacion.meta120 ? "✓ Colocación cumplida" : `Faltan $ ${formatMoneda(evaluacion.faltaPara120Usd)} USD`}
            </strong>
          </div>
        </div>
      </div>

      {/* ================= TABLA DE ASESORES Y GESTIÓN ================= */}
      <div className="bg-[#070e1c] border border-[#14233c] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#14233c] pb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" /> Plantilla de Asesores de Montero (Oscar Saravia)
            </h3>
            <p className="text-xs text-slate-400">
              Registra las ventas y colocación para verificar quién califica según las bases oficiales.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Meta Base (100%):</span>
            <div className="flex items-center bg-[#050b18] border border-[#1e3a5f] rounded-xl px-3 py-1 text-xs font-mono font-bold text-cyan-400">
              $ <input
                type="number"
                value={metaGrupalUSD}
                onChange={(e) => setMetaGrupalUSD(e.target.value)}
                className="w-24 bg-transparent outline-none text-right font-black text-white ml-1"
              />
            </div>
          </div>
        </div>

        {/* TABLA RESPONSIVE */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#14233c] text-[10px] text-slate-400 uppercase tracking-wider font-black">
                <th className="py-3 px-3">Asesor Comercial</th>
                <th className="py-3 px-3 text-center">Ventas Realizadas</th>
                <th className="py-3 px-3 text-right">Colocación ($ USD)</th>
                <th className="py-3 px-3 text-center">Carpetas en 10 días</th>
                <th className="py-3 px-3 text-center">Condición Individual</th>
                <th className="py-3 px-3 text-right">Bono Asignado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#14233c]">
              {evaluacion.asesoresEvaluados.map(a => (
                <tr key={a.id} className={`hover:bg-[#091426] transition-colors ${a.esProductivo ? 'bg-[#04241b]/20' : ''}`}>
                  <td className="py-3 px-3 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${a.esProductivo ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                      <span>{a.nombre}</span>
                    </div>
                  </td>

                  {/* Input Ventas */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      value={a.ventas}
                      onChange={(e) => handleAsesorChange(a.id, 'ventas', e.target.value)}
                      className="w-16 px-2 py-1 bg-[#050b18] border border-[#1e3a5f] rounded-lg text-center font-black text-white focus:border-cyan-400 outline-none"
                    />
                  </td>

                  {/* Input Colocación */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-slate-500">$</span>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={a.colocacion}
                        onChange={(e) => handleAsesorChange(a.id, 'colocacion', e.target.value)}
                        className="w-28 px-2 py-1 bg-[#050b18] border border-[#1e3a5f] rounded-lg text-right font-black text-white font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </td>

                  {/* Checkbox Carpetas 10 días */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleAsesorChange(a.id, 'carpetasAlDia', !a.carpetasAlDia)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition ${
                        a.carpetasAlDia 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {a.carpetasAlDia ? "✓ Cumple (<=10d)" : "⚠️ Fuera de plazo"}
                    </button>
                  </td>

                  {/* Estado Individual */}
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black ${
                      a.esProductivo 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {a.esProductivo ? "PRODUCTIVO" : "PENDIENTE"}
                    </span>
                  </td>

                  {/* Bono Ganado */}
                  <td className="py-3 px-3 text-right font-mono font-black text-sm">
                    {a.esProductivo && evaluacion.bonoPorAsesorBs > 0 ? (
                      <span className="text-emerald-400">{formatMoneda(evaluacion.bonoPorAsesorBs)} Bs.</span>
                    ) : (
                      <span className="text-slate-600">0 Bs.</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RESUMEN DE CONTROL DE CIERRE */}
        <div className="bg-[#050b18] border border-[#1e3a5f] rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">DIAGNÓSTICO GRUPAL DEL EQUIPO</span>
            <p className="text-xs text-slate-300 font-bold">
              {evaluacion.textoBono}
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-3">
              <span>Colocación Grupal: <strong>$ {formatMoneda(evaluacion.colocacionTotal)} USD</strong> ({evaluacion.porcentajeGrupal.toFixed(1)}%)</span>
              <span>•</span>
              <span>Asesores Productivos: <strong>{evaluacion.totalProductivos} de {asesores.length}</strong> ({evaluacion.porcentajeProductividad.toFixed(0)}%)</span>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={copiarFormatoHTML}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-white text-slate-900 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <Copy className="w-3.5 h-3.5" /> Copiar Planilla
            </button>
            <button
              onClick={enviarAppOutlook}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-[#0078d4] hover:bg-[#006cc1] text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <Monitor className="w-3.5 h-3.5" /> Outlook 🖥️
            </button>
            <button
              onClick={abrirEnGmailWeb}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-[#ea4335] hover:bg-[#dc2626] text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <Mail className="w-3.5 h-3.5" /> Gmail (+CC)
            </button>
          </div>
        </div>

        {notificacion && (
          <div className="text-center text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 py-2 rounded-lg animate-pulse">
            {notificacion}
          </div>
        )}
      </div>

      {/* ================= REGLAS OFICIALES EXPLICADAS ================= */}
      <div className="bg-[#070e1c] border border-[#14233c] rounded-3xl p-6 shadow-2xl space-y-4">
        <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Resumen de Políticas Oficiales para Cobrar el Bono
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#050b18] border border-[#1e3a5f] p-4 rounded-2xl">
            <span className="text-[10px] font-black text-amber-400 uppercase block mb-1">1. Vende</span>
            <p className="text-slate-300 leading-relaxed">
              Cierra ventas de lotes en cualquier proyecto de Celina Urbanizaciones.
            </p>
          </div>

          <div className="bg-[#050b18] border border-[#1e3a5f] p-4 rounded-2xl">
            <span className="text-[10px] font-black text-cyan-400 uppercase block mb-1">2. Sé Productivo</span>
            <p className="text-slate-300 leading-relaxed">
              Concreta <strong>{etapaActual.minVentas} ventas</strong> o la colocación mínima de la etapa vigente (USD {formatMoneda(etapaActual.minColocacionUsd)}).
            </p>
          </div>

          <div className="bg-[#050b18] border border-[#1e3a5f] p-4 rounded-2xl">
            <span className="text-[10px] font-black text-rose-400 uppercase block mb-1">3. Procesa tu Carpeta</span>
            <p className="text-slate-300 leading-relaxed">
              Entrega y procesa la carpeta dentro de los <strong>10 días</strong> posteriores a la fecha de venta.
            </p>
          </div>

          <div className="bg-[#050b18] border border-[#1e3a5f] p-4 rounded-2xl">
            <span className="text-[10px] font-black text-emerald-400 uppercase block mb-1">4. Cumplan en Equipo</span>
            <p className="text-slate-300 leading-relaxed">
              <strong>110% de colocación:</strong> 700 Bs.<br/>
              <strong>120% de colocación:</strong> 1.100 Bs.<br/>
              (Exigiendo {etapaActual.productividadRequeridaPct}% del equipo productivo).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
