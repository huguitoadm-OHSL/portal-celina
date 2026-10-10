import { CORREO_SUPERVISION_RESPALDO as CORREO_RESPALDO_OSCAR } from '../constants/config';
import { emailCopies, composeEmailUrl } from '../services/emailDelivery';
import { getExchangeRate } from '../constants/exchangeRates';
import { escapeHtml, sanitizeEmailHtml, copyEmail, greeting } from '../services/email';
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Tag,
  MapPin,
  Building2,
  Send,
  Copy,
  Mail,
  Upload,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  Banknote,
  Monitor
} from "lucide-react";

  const parseNumero = (val) => {
    if (val === undefined || val === null || val === "") return 0;
    if (typeof val === "number") return val;
    const str = String(val).replace(/,/g, "").trim();
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

const VENTANAS_CONTADO = {
  "0_5": { plazo: "Primeros 5 días", descuentoPct: 25, labelBadge: "CONTADO (PRIMEROS 5 DÍAS)" },
  "6_30": { plazo: "6 a 30 días", descuentoPct: 20, labelBadge: "CONTADO (6 A 30 DÍAS)" },
  "31_60": { plazo: "31 a 60 días", descuentoPct: 10, labelBadge: "CONTADO (31 A 60 DÍAS)" }
};



const obtenerDescuentoCreditoFijo = (valorLoteUSD) => {
  if (valorLoteUSD <= 0) return 0;
  if (valorLoteUSD <= 7500) return 300;
  if (valorLoteUSD <= 15000) return 600;
  if (valorLoteUSD <= 22500) return 900;
  if (valorLoteUSD <= 30000) return 1200;
  if (valorLoteUSD <= 45000) return 1500;
  return 1800;
};

const DIRECTORES_APROBACION = [
  { nombre: "Mauricio Reyes", cargo: "Jefe de Ventas", email: "mreyes@celina.com.bo", genero: "M" },
  { nombre: "Lic. Robert Vaca", cargo: "Gerente Regional", email: "rvaca@grupopaz.com.bo", genero: "M" },
  { nombre: "Lic. Verenice Choque", cargo: "Asistente de Inteligencia y Negocios", email: "vchoque@grupopaz.com.bo", genero: "F" }
];

const ASESORES_EQUIPO = [
  "Carlos Enrique Calderon Montano",
  "Ely Gonzales Garcia",
  "Jaime Fabricio Rios Castro",
  "Jimmy Gonzales Nuñez",
  "Jose Gabriel Padilla Loayza",
  "Marisol Urgel Pizarro",
  "Merly Mendez Hurtado"
];

export default function DescuentosCampanas() {
  const TC_OFICIAL_BASE = getExchangeRate();
  const [lotes, setLotes] = useState([]);
  const [cargandoBD, setCargandoBD] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [modalidad, setModalidad] = useState("CONTADO_LIQUIDACION");
  const [ventanaSeleccionada, setVentanaSeleccionada] = useState("0_5");

  const [proyectoSeleccionado, setProyectoSeleccionado] = useState("CAÑAVERAL");
  const [uvSeleccionada, setUvSeleccionada] = useState("");
  const [mznSeleccionada, setMznSeleccionada] = useState("");
  const [loteSeleccionado, setLoteSeleccionado] = useState("");

  const [superficie, setSuperficie] = useState(0);
  const [precioBaseM2, setPrecioBaseM2] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [, setEstadoLote] = useState("DISPONIBLE");

  const [cuotaInicialPct] = useState(1.5);
  const [plazoAnios] = useState(10);

  const [destinatarioEmail, setDestinatarioEmail] = useState(DIRECTORES_APROBACION[0].email);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(ASESORES_EQUIPO[0]);
  const [notificacion, setNotificacion] = useState(null);

  const fileInputRef = useRef(null);

  const formatMoneda = (val) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val || 0);

  // Detección horaria exacta
  const getSaludoHorario = greeting;

  const procesarDatosLotes = useCallback((data) => {
    if (!Array.isArray(data)) {
      setCargandoBD(false);
      return;
    }
    const mapeados = data.map((item) => ({
      proyecto: String(item.proyecto || item.Proyecto || "GENERAL").trim().toUpperCase(),
      estado: String(item.estado || item.Estado || "DISPONIBLE").trim().toUpperCase(),
      categoria: String(item.categoria || item.Categoria || "ESTÁNDAR").trim().toUpperCase(),
      uv: String(item.uv || item.Uv || item.UV || "SN").trim().toUpperCase(),
      mzn: String(item.mzn || item.Mzn || item.MZN || "").trim().toUpperCase(),
      lote: String(item.lote || item.Lote || item.LOTE || "").trim().toUpperCase(),
      superficie: parseNumero(item.superficie || item.Superficie),
      precio: parseNumero(item.precio || item.Precio)
    }));

    setLotes(mapeados);
    setCargandoBD(false);

    const proys = Array.from(new Set(mapeados.map((l) => l.proyecto))).sort();
    setProyectoSeleccionado(previous => proys.length > 0 && !proys.includes(previous) ? proys[0] : previous);
  }, []);

  const cargarInventario = useCallback(async () => {
    setCargandoBD(true);
    setErrorCarga(null);
    try {
      let data = [];
      try {
        const res = await fetch("/inventario_lotes.json");
        if (res.ok) data = await res.json();
        else throw new Error();
      } catch {
        const resFallback = await fetch("/lotes.json");
        if (resFallback.ok) data = await resFallback.json();
      }
      procesarDatosLotes(data);
    } catch {
      setErrorCarga("Cargue el archivo inventario_lotes.json.");
      setCargandoBD(false);
    }
  }, [procesarDatosLotes]);

  useEffect(() => {
    cargarInventario();
  }, [cargarInventario]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCargandoBD(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        procesarDatosLotes(JSON.parse(event.target?.result));
      } catch {
        setErrorCarga("JSON inválido.");
        setCargandoBD(false);
      }
    };
    reader.readAsText(file);
  };

  const proyectosDisponibles = useMemo(() => Array.from(new Set(lotes.map((l) => l.proyecto))).sort(), [lotes]);
  const uvsDisponibles = useMemo(() => {
    if (!proyectoSeleccionado) return [];
    return Array.from(new Set(lotes.filter((l) => l.proyecto === proyectoSeleccionado).map((l) => l.uv))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [lotes, proyectoSeleccionado]);

  const mznsDisponibles = useMemo(() => {
    if (!proyectoSeleccionado || !uvSeleccionada) return [];
    return Array.from(new Set(lotes.filter((l) => l.proyecto === proyectoSeleccionado && l.uv === uvSeleccionada).map((l) => l.mzn))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [lotes, proyectoSeleccionado, uvSeleccionada]);

  const lotesDisponibles = useMemo(() => {
    if (!proyectoSeleccionado || !uvSeleccionada || !mznSeleccionada) return [];
    return lotes.filter((l) => l.proyecto === proyectoSeleccionado && l.uv === uvSeleccionada && l.mzn === mznSeleccionada).sort((a, b) => a.lote.localeCompare(b.lote, undefined, { numeric: true }));
  }, [lotes, proyectoSeleccionado, uvSeleccionada, mznSeleccionada]);

  useEffect(() => {
    if (uvsDisponibles.length > 0 && !uvsDisponibles.includes(uvSeleccionada)) setUvSeleccionada(uvsDisponibles[0]);
  }, [proyectoSeleccionado, uvsDisponibles, uvSeleccionada]);

  useEffect(() => {
    if (mznsDisponibles.length > 0 && !mznsDisponibles.includes(mznSeleccionada)) setMznSeleccionada(mznsDisponibles[0]);
  }, [uvSeleccionada, mznsDisponibles, mznSeleccionada]);

  useEffect(() => {
    if (lotesDisponibles.length > 0) {
      const primero = lotesDisponibles.find((l) => l.estado === "DISPONIBLE") || lotesDisponibles[0];
      setLoteSeleccionado(primero.lote);
    }
  }, [mznSeleccionada, lotesDisponibles]);

  useEffect(() => {
    const item = lotes.find((l) => l.proyecto === proyectoSeleccionado && l.uv === uvSeleccionada && l.mzn === mznSeleccionada && l.lote === loteSeleccionado);
    if (item) {
      setSuperficie(item.superficie);
      setPrecioBaseM2(item.precio);
      setCategoria(item.categoria);
      setEstadoLote(item.estado);
    }
  }, [proyectoSeleccionado, uvSeleccionada, mznSeleccionada, loteSeleccionado, lotes]);

  const calculos = useMemo(() => {
    const capitalBaseUSD = superficie * precioBaseM2;

    if (modalidad === "CONTADO_LIQUIDACION") {
      const config = VENTANAS_CONTADO[ventanaSeleccionada] || VENTANAS_CONTADO["0_5"];
      const descuentoPct = config.descuentoPct;

      const montoDescuentoUSD = capitalBaseUSD * (descuentoPct / 100);
      const capitalFinalUSD = Math.max(0, capitalBaseUSD - montoDescuentoUSD);
      const totalBsOptica1 = capitalFinalUSD * TC_OFICIAL_BASE;

      // La segunda óptica es estrictamente equivalente a la primera: mismo total final en Bs.
      const tcEfectivoFinal = capitalBaseUSD > 0
        ? totalBsOptica1 / capitalBaseUSD
        : TC_OFICIAL_BASE * (1 - descuentoPct / 100);
      const descuentoTCOficial = TC_OFICIAL_BASE - tcEfectivoFinal;
      const totalBsOptica2 = totalBsOptica1;

      const nuevoPrecioM2 = superficie > 0 ? capitalFinalUSD / superficie : precioBaseM2 * (1 - descuentoPct / 100);
      const reduccionM2 = precioBaseM2 - nuevoPrecioM2;

      return {
        modalidad: "CONTADO",
        labelBadge: config.labelBadge,
        capitalBaseUSD,
        descuentoPct,
        montoAhorroUSD: montoDescuentoUSD,
        capitalFinalUSD,
        totalBs: totalBsOptica1,
        precioM2Anterior: precioBaseM2,
        nuevoPrecioM2,
        reduccionM2,
        optica1_capitalBase: capitalBaseUSD,
        optica1_descuentoUSD: montoDescuentoUSD,
        optica1_capitalFinal: capitalFinalUSD,
        optica1_tc: TC_OFICIAL_BASE,
        optica1_totalBs: totalBsOptica1,
        optica2_capitalBase: capitalBaseUSD,
        optica2_tcOficial: TC_OFICIAL_BASE,
        optica2_descuentoTC: descuentoTCOficial,
        optica2_tcEfectivo: tcEfectivoFinal,
        optica2_totalBs: totalBsOptica2
      };
    } else {
      const descuentoTotalUSD = obtenerDescuentoCreditoFijo(capitalBaseUSD);
      const descuentoEquivalenteM2 = superficie > 0 ? descuentoTotalUSD / superficie : 0;
      const capitalFinalUSD = Math.max(0, capitalBaseUSD - descuentoTotalUSD);
      const totalBs = capitalFinalUSD * TC_OFICIAL_BASE;

      const inicialUSD = capitalFinalUSD * (cuotaInicialPct / 100);
      const inicialBS = inicialUSD * TC_OFICIAL_BASE;
      const saldoUSD = Math.max(0, capitalFinalUSD - inicialUSD);

      const meses = plazoAnios * 12;
      const tasaMensual = 0.121733 / 12;
      let mensualUSD = 0;
      if (saldoUSD > 0 && meses > 0) {
        mensualUSD = (saldoUSD * (tasaMensual * Math.pow(1 + tasaMensual, meses))) / (Math.pow(1 + tasaMensual, meses) - 1);
      }
      const mensualBS = mensualUSD * TC_OFICIAL_BASE;
      const nuevoPrecioM2 = superficie > 0 ? capitalFinalUSD / superficie : Math.max(0, precioBaseM2 - descuentoEquivalenteM2);
      const descuentoPctEquivalente = capitalBaseUSD > 0 ? (descuentoTotalUSD / capitalBaseUSD) * 100 : 0;
      const tcEfectivoFinal = capitalBaseUSD > 0 ? totalBs / capitalBaseUSD : TC_OFICIAL_BASE;
      const descuentoTCEquivalente = TC_OFICIAL_BASE - tcEfectivoFinal;

      return {
        modalidad: "CREDITO",
        labelBadge: `VENTA A CRÉDITO (DESCUENTO FIJO $${descuentoTotalUSD.toFixed(0)})`,
        capitalBaseUSD,
        descuentoPct: descuentoPctEquivalente,
        descuentoFijoUSD: descuentoTotalUSD,
        descuentoEquivalenteM2,
        montoAhorroUSD: descuentoTotalUSD,
        capitalFinalUSD,
        totalBs,
        precioM2Anterior: precioBaseM2,
        nuevoPrecioM2,
        reduccionM2: descuentoEquivalenteM2,
        cuotaInicialUSD: inicialUSD,
        cuotaInicialBS: inicialBS,
        cuotaMensualUSD: mensualUSD,
        cuotaMensualBS: mensualBS,
        saldoUSD,
        optica1_capitalBase: capitalBaseUSD,
        optica1_descuentoUSD: descuentoTotalUSD,
        optica1_capitalFinal: capitalFinalUSD,
        optica1_tc: TC_OFICIAL_BASE,
        optica1_totalBs: totalBs,
        optica2_capitalBase: capitalBaseUSD,
        optica2_tcOficial: TC_OFICIAL_BASE,
        optica2_descuentoTC: descuentoTCEquivalente,
        optica2_tcEfectivo: tcEfectivoFinal,
        optica2_totalBs: totalBs
      };
    }
  }, [modalidad, ventanaSeleccionada, superficie, precioBaseM2, cuotaInicialPct, plazoAnios, TC_OFICIAL_BASE]);

  const descuentoVisual = calculos.modalidad === "CREDITO"
    ? `$ ${formatMoneda(calculos.montoAhorroUSD)} FIJO`
    : `${calculos.descuentoPct.toFixed(0)}%`;
  const descuentoEtiqueta = calculos.modalidad === "CREDITO"
    ? "DESCUENTO FIJO"
    : `DESCUENTO (${calculos.descuentoPct.toFixed(0)}%)`;

  const destinatarioObj = useMemo(() => {
    return DIRECTORES_APROBACION.find((d) => d.email === destinatarioEmail) || DIRECTORES_APROBACION[0];
  }, [destinatarioEmail]);

  const correosCC = useMemo(() => {
    const otros = DIRECTORES_APROBACION.filter((d) => d.email !== destinatarioEmail).map((d) => d.email);
    return emailCopies('outlook', otros, destinatarioEmail).join(', ');
  }, [destinatarioEmail]);

  const asuntoCorreo = `Solicitud Descuento Campañas - ${proyectoSeleccionado} UV:${uvSeleccionada} Mz${mznSeleccionada} Lt${loteSeleccionado} (Nuevo P.M2: $${formatMoneda(calculos.nuevoPrecioM2)})`;
  const tratamientoDirecto = destinatarioObj.genero === "F" ? "Estimada" : "Estimado";

  // HTML con estilos inline exactos para Gmail / Outlook
  const generarHTMLCorreo = () => {
    return `
<div style="font-family: Arial, Helvetica, sans-serif; color: #0f172a; max-width: 650px; margin: 0 auto; line-height: 1.5;">
  <p style="margin: 0 0 10px; font-size: 15px;">${getSaludoHorario()}</p>
  <p style="margin: 0 0 16px; font-size: 15px;">${tratamientoDirecto} <strong>${destinatarioObj.nombre}</strong>,</p>
  <p style="margin: 0 0 20px; font-size: 14px; color: #334155;">
    Solicito la aplicación del descuento de la
    <strong>Campaña Oficial de Octubre</strong> para el proyecto <strong>${escapeHtml(proyectoSeleccionado)}</strong>.
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; margin-bottom: 22px;">
    <tr>
      <td style="padding: 18px 20px;">
        <div style="font-size: 11px; font-weight: 900; color: #15803d; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
          📌 DATO CLAVE PARA MODIFICAR EN EL SISTEMA
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size: 13px; color: #334155;">
              Precio Anterior de Lista: <strong style="color: #64748b; text-decoration: line-through;">$ ${formatMoneda(calculos.precioM2Anterior)}/m²</strong><br>
              ${calculos.modalidad === "CREDITO" ? "Descuento equivalente por m² (informativo)" : "Reducción directa autorizada"}: <strong style="color: #dc2626;">-$ ${formatMoneda(calculos.reduccionM2)}/m²</strong>
            </td>
            <td align="right">
              <span style="font-size: 11px; color: #15803d; font-weight: bold; display: block;">NUEVO PRECIO M²:</span>
              <span style="font-size: 28px; font-weight: 900; color: #15803d; font-family: monospace;">
                $ ${formatMoneda(calculos.nuevoPrecioM2)} <span style="font-size: 14px;">/ m²</span>
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #060c18; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; margin-bottom: 25px;">
    <tr>
      <td style="padding: 20px; border-bottom: 1px solid #132238;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">PROYECTO</div>
              <div style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">${escapeHtml(proyectoSeleccionado)}</div>
              <div style="display: inline-block; background-color: #78350f; color: #fde68a; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px; margin-top: 6px;">
                ${categoria || "LOTE SOBRE AV. ESQ."}
              </div>
            </td>
            <td align="right" valign="top">
              <span style="display: inline-block; background-color: #0c1a30; border: 1px solid #1e3a5f; color: #38bdf8; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; margin-left: 4px;">
                UV <strong style="color: #ffffff; font-size: 13px;">${escapeHtml(uvSeleccionada)}</strong>
              </span>
              <span style="display: inline-block; background-color: #0c1a30; border: 1px solid #1e3a5f; color: #38bdf8; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; margin-left: 4px;">
                MZN <strong style="color: #ffffff; font-size: 13px;">${escapeHtml(mznSeleccionada)}</strong>
              </span>
              <span style="display: inline-block; background-color: #0c1a30; border: 1px solid #1e3a5f; color: #38bdf8; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; margin-left: 4px;">
                LT <strong style="color: #ffffff; font-size: 13px;">${escapeHtml(loteSeleccionado)}</strong>
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td align="center" style="padding: 28px 20px 18px;">
        <div style="display: inline-block; background-color: #0f2744; border: 1px solid #0284c7; color: #38bdf8; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; margin-bottom: 10px;">
          🏷️ ${calculos.labelBadge}
        </div>
        <div style="font-size: 44px; font-weight: 900; color: #ffffff; letter-spacing: -1px; margin-bottom: 4px;">
          $ ${formatMoneda(calculos.capitalFinalUSD)}
        </div>
        <div style="font-size: 18px; font-weight: bold; color: #94a3b8;">
          Bs. ${formatMoneda(calculos.totalBs)}
          <span style="background-color: #172554; color: #60a5fa; font-size: 11px; padding: 2px 8px; border-radius: 4px; margin-left: 8px; font-weight: 600;">
            TC ${TC_OFICIAL_BASE.toFixed(2)}
          </span>
        </div>
      </td>
    </tr>

    <tr>
      <td style="padding: 5px 20px 15px;">
        <table width="100%" cellpadding="0" cellspacing="6">
          <tr>
            <td width="33%" align="center" style="background-color: #0b1528; border: 1px solid #1e293b; border-radius: 10px; padding: 10px;">
              <div style="font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase;">BASE</div>
              <div style="font-size: 15px; font-weight: bold; color: #ffffff; margin-top: 3px;">$ ${formatMoneda(calculos.capitalBaseUSD)}</div>
            </td>
            <td width="33%" align="center" style="background-color: #0b1528; border: 1px solid #1e293b; border-radius: 10px; padding: 10px;">
              <div style="font-size: 10px; color: #38bdf8; font-weight: bold; text-transform: uppercase;">DESCUENTO</div>
              <div style="font-size: 15px; font-weight: bold; color: #38bdf8; margin-top: 3px;">${descuentoVisual}</div>
            </td>
            <td width="33%" align="center" style="background-color: #04251d; border: 1px solid #065f46; border-radius: 10px; padding: 10px;">
              <div style="font-size: 10px; color: #34d399; font-weight: bold; text-transform: uppercase;">AHORRO</div>
              <div style="font-size: 15px; font-weight: bold; color: #34d399; margin-top: 3px;">$ ${formatMoneda(calculos.montoAhorroUSD)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 10px 20px 20px;">
        <table width="100%" cellpadding="0" cellspacing="8">
          <tr>
            <td width="50%" valign="top" style="background-color: #081120; border: 1px solid #1e3a5f; border-radius: 12px; padding: 14px;">
              <div style="font-size: 10px; font-weight: bold; color: #38bdf8; margin-bottom: 10px; text-transform: uppercase;">
                💲 ÓPTICA 1: DESCUENTO A CAPITAL
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 11px; color: #94a3b8;">
                <tr>
                  <td style="padding: 3px 0;">CAPITAL BASE ($US)</td>
                  <td align="right" style="color: #ffffff; font-weight: bold;">$ ${formatMoneda(calculos.optica1_capitalBase)}</td>
                </tr>
                <tr>
                  <td style="padding: 3px 0;">${descuentoEtiqueta}</td>
                  <td align="right" style="color: #38bdf8; font-weight: bold;">- $ ${formatMoneda(calculos.optica1_descuentoUSD)}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; border-top: 1px solid #1e293b;">CAPITAL FINAL ($US)</td>
                  <td align="right" style="padding: 5px 0; border-top: 1px solid #1e293b; color: #ffffff; font-weight: bold;">$ ${formatMoneda(calculos.optica1_capitalFinal)}</td>
                </tr>
                <tr>
                  <td style="padding: 3px 0;">TIPO DE CAMBIO</td>
                  <td align="right" style="color: #94a3b8; font-weight: bold;">x ${calculos.optica1_tc.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0 0; font-size: 12px; font-weight: bold; color: #38bdf8; border-top: 1px solid #1e293b;">TOTAL (BS.)</td>
                  <td align="right" style="padding: 8px 0 0; font-size: 13px; font-weight: 900; color: #38bdf8; border-top: 1px solid #1e293b;">Bs. ${formatMoneda(calculos.optica1_totalBs)}</td>
                </tr>
              </table>
            </td>

            <td width="50%" valign="top" style="background-color: #081120; border: 1px solid #1e3a5f; border-radius: 12px; padding: 14px;">
              <div style="font-size: 10px; font-weight: bold; color: #34d399; margin-bottom: 10px; text-transform: uppercase;">
                📈 ÓPTICA 2: DESCUENTO A T.C.
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 11px; color: #94a3b8;">
                <tr>
                  <td style="padding: 3px 0;">CAPITAL BASE ($US)</td>
                  <td align="right" style="color: #ffffff; font-weight: bold;">$ ${formatMoneda(calculos.optica2_capitalBase)}</td>
                </tr>
                <tr>
                  <td style="padding: 3px 0;">TC VIGENTE</td>
                  <td align="right" style="color: #ffffff; font-weight: bold;">${calculos.optica2_tcOficial.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 3px 0;">${descuentoEtiqueta}</td>
                  <td align="right" style="color: #34d399; font-weight: bold;">- ${calculos.optica2_descuentoTC.toFixed(2)} Bs/$us</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; border-top: 1px solid #1e293b;">TC EFECTIVO FINAL</td>
                  <td align="right" style="padding: 5px 0; border-top: 1px solid #1e293b; color: #ffffff; font-weight: bold;">x ${calculos.optica2_tcEfectivo.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0 0; font-size: 12px; font-weight: bold; color: #34d399; border-top: 1px solid #1e293b;">TOTAL (BS.)</td>
                  <td align="right" style="padding: 8px 0 0; font-size: 13px; font-weight: 900; color: #34d399; border-top: 1px solid #1e293b;">Bs. ${formatMoneda(calculos.optica2_totalBs)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <p style="margin: 0 0 16px; font-size: 14px;">Solicito su aprobación y la aplicación de las condiciones en el sistema para continuar con el cierre de la venta.</p>
  <p style="margin: 0 0 4px; font-size: 14px;">Saludos cordiales,</p>
  <p style="margin: 0; font-size: 15px; font-weight: bold; color: #0f172a;">${escapeHtml(asesorSeleccionado)}</p>
</div>
`;
  };

  const generarTextoPlano = () => {
    return `${getSaludoHorario()}

${tratamientoDirecto} ${destinatarioObj.nombre},

Por favor le solicito la aplicación del descuento de campaña vigente para el proyecto ${proyectoSeleccionado}:

📌 DATO REQUERIDO PARA EL SISTEMA CELINA:
• Precio m² Anterior de Lista: $ ${formatMoneda(calculos.precioM2Anterior)}/m²
• ${calculos.modalidad === "CREDITO" ? "Descuento equivalente por m² (solo informativo)" : "Reducción neta por m²"}: -$ ${formatMoneda(calculos.reduccionM2)}/m²
• NUEVO PRECIO M² APLICABLE: $ ${formatMoneda(calculos.nuevoPrecioM2)}/m²

UBICACIÓN DEL LOTE:
• Proyecto: ${proyectoSeleccionado}
• Ubicación: UV ${uvSeleccionada} • MZN ${mznSeleccionada} • LT ${loteSeleccionado}
• Superficie: ${formatMoneda(superficie)} m²
• Categoría: ${categoria}

RESUMEN FINANCIERO (${calculos.labelBadge}):
• Capital Base: $ ${formatMoneda(calculos.capitalBaseUSD)}
• ${calculos.modalidad === "CREDITO" ? "Descuento fijo según valor del lote" : `Descuento (${calculos.descuentoPct.toFixed(0)}%)`}: -$ ${formatMoneda(calculos.montoAhorroUSD)}
• Capital Final a Liquidar: $ ${formatMoneda(calculos.capitalFinalUSD)} USD
• Total en Bolivianos: Bs. ${formatMoneda(calculos.totalBs)} (TC vigente ${TC_OFICIAL_BASE.toFixed(2)})
• TC Efectivo de Pago: ${calculos.optica2_tcEfectivo.toFixed(2)} Bs/US$

Asesor Responsable: ${asesorSeleccionado}
Copia de Respaldo: ${CORREO_RESPALDO_OSCAR}

Solicito su aprobación y la aplicación de las condiciones en el sistema para continuar con el cierre de la venta.

Saludos cordiales,
${asesorSeleccionado}`;
  };

  const copiarFormatoHTML = async () => {
    const html = sanitizeEmailHtml(generarHTMLCorreo());
    const texto = generarTextoPlano();
    try {
      await copyEmail(html, texto);
      setNotificacion("Formato copiado. Revise el correo antes de enviarlo.");
    } catch (error) { setNotificacion(error.message || "No se pudo copiar. Utilice la vista previa."); }
    setTimeout(() => setNotificacion(null), 3500);
  };

  const enviarAppOutlook = () => {
    copiarFormatoHTML();
    const bodyEncoded = encodeURIComponent(generarTextoPlano());
    const subjectEncoded = encodeURIComponent(asuntoCorreo);
    const toEncoded = encodeURIComponent(destinatarioEmail);
    const ccEncoded = encodeURIComponent(emailCopies('outlook', [correosCC], destinatarioEmail).join(','));

    window.location.href = `mailto:${toEncoded}?cc=${ccEncoded}&subject=${subjectEncoded}&body=${bodyEncoded}`;
    setNotificacion("Outlook: sin copia automática a supervisión. Pegue el formato y revise el borrador.");
  };

  const abrirEnGmailWeb = () => {
    const url = composeEmailUrl({ client: 'gmail', to: destinatarioEmail, subject: asuntoCorreo, body: generarTextoPlano() });
    window.open(url, '_blank', 'noopener,noreferrer');
    copiarFormatoHTML();
    setNotificacion(`Gmail: copia exclusiva a ${CORREO_RESPALDO_OSCAR}. Revise el borrador antes de enviarlo.`);
  };

  const textoWhatsApp = `🔥 *OFERTA CAMPAÑA OCTUBRE - CELINA URBANIZACIONES* 🔥\n\n` +
    `📍 *Proyecto:* ${proyectoSeleccionado} (UV ${uvSeleccionada} • MZN ${mznSeleccionada} • Lote ${loteSeleccionado})\n` +
    `📐 *Superficie:* ${formatMoneda(superficie)} m² | ${categoria}\n\n` +
    `💵 *Precio Base:* $ ${formatMoneda(calculos.capitalBaseUSD)} ($${formatMoneda(calculos.precioM2Anterior)}/m²)\n` +
    `🎉 *Descuento Campaña:* *${calculos.modalidad === "CREDITO" ? `$ ${formatMoneda(calculos.montoAhorroUSD)} FIJO` : `${calculos.descuentoPct.toFixed(0)}%`}* (-$ ${formatMoneda(calculos.montoAhorroUSD)})\n` +
    (calculos.modalidad === "CREDITO" ? `📐 *Equivalente informativo:* $ ${formatMoneda(calculos.reduccionM2)}/m²\n` : "") +
    `💎 *PRECIO PROMOCIONAL:* *$ ${formatMoneda(calculos.capitalFinalUSD)} USD*\n` +
    `📊 *Nuevo Precio m²:* *$ ${formatMoneda(calculos.nuevoPrecioM2)}/m²*\n\n` +
    `🇧🇴 *Total en Bolivianos:* *Bs. ${formatMoneda(calculos.totalBs)}*\n` +
    `👉 *TC Efectivo:* *Bs. ${calculos.optica2_tcEfectivo?.toFixed(2)}* (vs TC vigente ${TC_OFICIAL_BASE.toFixed(2)})\n\n` +
    `Asesor: ${asesorSeleccionado}`;

  return (
    <div className="w-full text-[var(--text-primary)] font-sans overflow-x-hidden">
      <details className="panel mb-6"><summary>Vista previa del correo · revisar antes de enviar</summary><div className="email-preview" dangerouslySetInnerHTML={{ __html: sanitizeEmailHtml(generarHTMLCorreo()) }}/></details>
      {/* BARRA SUPERIOR */}
      <div className="max-w-6xl mx-auto mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[var(--border-glow)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
              PORTAL GESTIÓN ESTRATÉGICA • CELINA URBANIZACIONES
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            DESCUENTOS <span className="text-cyan-400">CAMPAÑAS</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json" className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-initial px-3 py-1.5 bg-[var(--bg-card-inner)] border border-[var(--border-highlight)] hover:border-cyan-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 text-[var(--text-secondary)] transition"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            Cargar JSON
          </button>
          <button
            onClick={cargarInventario}
            className="flex-1 sm:flex-initial px-3 py-1.5 bg-cyan-950/70 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 text-cyan-300 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cargandoBD ? "animate-spin" : ""}`} />
            Matriz ({lotes.length})
          </button>
        </div>
      </div>

      {errorCarga && (
        <div className="max-w-6xl mx-auto mb-4 bg-amber-950/50 border border-amber-500/50 p-3 rounded-xl flex items-center gap-3 text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{errorCarga}</span>
        </div>
      )}

      {/* TABS DE MODALIDAD */}
      <div className="max-w-6xl mx-auto mb-5 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 bg-[#081224] border border-[var(--border-glow)] p-2 rounded-2xl">
        <div className="flex p-1 bg-[var(--bg-card-inner)] border border-[var(--border-glow)] rounded-xl w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setModalidad("CONTADO_LIQUIDACION")}
            className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 rounded-lg text-[11px] sm:text-xs font-black transition flex items-center justify-center gap-1.5 ${
              modalidad === "CONTADO_LIQUIDACION"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            VENTAS CONTADO - LIQUIDACIÓN (25%/20%/10%)
          </button>
          <button
            type="button"
            onClick={() => setModalidad("CREDITO")}
            className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 rounded-lg text-[11px] sm:text-xs font-black transition flex items-center justify-center gap-1.5 ${
              modalidad === "CREDITO"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            CRÉDITO (DESCUENTO FIJO POR LOTE)
          </button>
        </div>

        {modalidad === "CONTADO_LIQUIDACION" && (
          <div className="grid grid-cols-3 gap-1.5 w-full lg:w-auto">
            {Object.keys(VENTANAS_CONTADO).map((vKey) => {
              const conf = VENTANAS_CONTADO[vKey];
              const activo = ventanaSeleccionada === vKey;
              return (
                <button
                  key={vKey}
                  onClick={() => setVentanaSeleccionada(vKey)}
                  className={`px-2.5 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg border text-center transition ${
                    activo
                      ? "bg-cyan-950 border-cyan-400 text-cyan-300 shadow-sm"
                      : "bg-[var(--bg-card-inner)] border-[var(--border-glow)] text-[var(--text-muted)] hover:border-slate-700"
                  }`}
                >
                  {conf.plazo} ({conf.descuentoPct}%)
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* GRID EN 2 COLUMNAS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-glow)] rounded-2xl p-4 shadow-xl">
            <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Terreno Seleccionado
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-[var(--text-muted)] mb-1 font-bold">PROYECTO</label>
                <select
                  value={proyectoSeleccionado}
                  onChange={(e) => setProyectoSeleccionado(e.target.value)}
                  className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-highlight)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-primary)] focus:outline-none"
                >
                  {proyectosDisponibles.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-[var(--text-muted)] mb-1 text-center font-bold">UV</label>
                  <select
                    value={uvSeleccionada}
                    onChange={(e) => setUvSeleccionada(e.target.value)}
                    className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-highlight)] rounded-lg py-1.5 text-xs text-center font-bold text-cyan-300 focus:outline-none"
                  >
                    {uvsDisponibles.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[var(--text-muted)] mb-1 text-center font-bold">MZN</label>
                  <select
                    value={mznSeleccionada}
                    onChange={(e) => setMznSeleccionada(e.target.value)}
                    className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-highlight)] rounded-lg py-1.5 text-xs text-center font-bold text-cyan-300 focus:outline-none"
                  >
                    {mznsDisponibles.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[var(--text-muted)] mb-1 text-center font-bold">LOTE</label>
                  <select
                    value={loteSeleccionado}
                    onChange={(e) => setLoteSeleccionado(e.target.value)}
                    className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-highlight)] rounded-lg py-1.5 text-xs text-center font-bold text-cyan-300 focus:outline-none"
                  >
                    {lotesDisponibles.map((l) => (
                      <option key={l.lote} value={l.lote}>
                        {l.lote} {l.estado !== "DISPONIBLE" ? `(${l.estado})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-[var(--bg-card-inner)] border border-[var(--border-glow)] rounded-xl p-3 text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Superficie:</span>
                  <strong className="text-[var(--text-primary)]">{formatMoneda(superficie)} m²</strong>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Precio Lista:</span>
                  <strong className="text-[var(--text-primary)]">${formatMoneda(precioBaseM2)}/m²</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-[var(--border-glow)] text-[11px]">
                  <span className="text-slate-500">Categoría:</span>
                  <span className="text-amber-300 font-semibold">{categoria || "LOTE SOBRE AV. ESQ."}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-glow)] rounded-2xl p-4 shadow-xl space-y-3">
            <div>
              <label className="block text-[10px] text-[var(--text-muted)] mb-1 font-bold uppercase">
                SOLICITUD DIRIGIDA A (QUIEN APLICA EN SISTEMA):
              </label>
              <select
                value={destinatarioEmail}
                onChange={(e) => setDestinatarioEmail(e.target.value)}
                className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-highlight)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] font-bold focus:outline-none"
              >
                {DIRECTORES_APROBACION.map((d) => (
                  <option key={d.email} value={d.email}>
                    {d.nombre} — {d.cargo}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[var(--bg-card-inner)] border border-[#182a46] p-2.5 rounded-xl text-[10px] text-[var(--text-muted)] space-y-1">
              <span className="font-bold text-cyan-400 block uppercase">Copias por cliente de correo:</span>
              <div className="text-[var(--text-secondary)] font-mono text-[9px] leading-relaxed break-all">
                Gmail: {CORREO_RESPALDO_OSCAR}. Outlook: {correosCC || 'sin copias'}.
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-[var(--text-muted)] mb-1 font-bold uppercase">
                ASESOR RESPONSABLE:
              </label>
              <select
                value={asesorSeleccionado}
                onChange={(e) => setAsesorSeleccionado(e.target.value)}
                className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-highlight)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] font-bold focus:outline-none"
              >
                {ASESORES_EQUIPO.map((as) => <option key={as} value={as}>{as}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: DASHBOARD DE LIQUIDACIÓN */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-glow)] rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Header del lote */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-5 border-b border-[var(--border-glow)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0e1d32] border border-[var(--border-highlight)] flex items-center justify-center text-cyan-400 shadow-inner shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">PROYECTO</div>
                  <div className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">{proyectoSeleccionado}</div>
                  <div className="inline-block bg-[#78350f]/80 text-[#fef08a] border border-[#b45309]/50 text-[10px] font-extrabold px-2 py-0.5 rounded mt-0.5">
                    {categoria || "LOTE SOBRE AV. ESQ."}
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5 self-end sm:self-auto">
                <div className="bg-[#0b172a] border border-[#1c3558] px-2.5 sm:px-3.5 py-1 rounded-xl text-center">
                  <span className="text-[8px] sm:text-[9px] block text-[var(--text-muted)] font-bold uppercase">UV</span>
                  <strong className="text-sm sm:text-base text-cyan-400 font-black">{uvSeleccionada}</strong>
                </div>
                <div className="bg-[#0b172a] border border-[#1c3558] px-2.5 sm:px-3.5 py-1 rounded-xl text-center">
                  <span className="text-[8px] sm:text-[9px] block text-[var(--text-muted)] font-bold uppercase">MZN</span>
                  <strong className="text-sm sm:text-base text-cyan-400 font-black">{mznSeleccionada}</strong>
                </div>
                <div className="bg-[#0b172a] border border-[#1c3558] px-2.5 sm:px-3.5 py-1 rounded-xl text-center">
                  <span className="text-[8px] sm:text-[9px] block text-[var(--text-muted)] font-bold uppercase">LOTE</span>
                  <strong className="text-sm sm:text-base text-cyan-400 font-black">{loteSeleccionado}</strong>
                </div>
              </div>
            </div>

            {/* HERO CENTRAL */}
            <div className="py-6 sm:py-7 text-center">
              <div className="inline-block bg-[#0e243c] border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-xs font-black px-3 sm:px-4 py-1.5 rounded-full uppercase tracking-wider mb-2 sm:mb-3">
                🏷️ {calculos.labelBadge}
              </div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight mb-2">
                $ {formatMoneda(calculos.capitalFinalUSD)}
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-black text-[var(--text-secondary)] flex items-center justify-center gap-2">
                <span>Bs. {formatMoneda(calculos.totalBs)}</span>
                <span className="bg-[#172554] text-cyan-400 border border-cyan-500/30 text-xs px-2 py-0.5 rounded font-mono font-bold">
                  TC {TC_OFICIAL_BASE.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg mx-auto mt-5">
                <div className="bg-[var(--bg-card-inner)] border border-[#182a46] rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 text-center">
                  <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-black uppercase">BASE</div>
                  <div className="text-sm sm:text-base md:text-lg font-black text-[var(--text-primary)] mt-0.5">
                    $ {formatMoneda(calculos.capitalBaseUSD)}
                  </div>
                </div>

                <div className="bg-[var(--bg-card-inner)] border border-cyan-500/30 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 text-center">
                  <div className="text-[9px] sm:text-[10px] text-cyan-400 font-black uppercase">DESCUENTO</div>
                  <div className="text-sm sm:text-base md:text-lg font-black text-cyan-300 mt-0.5">
                    {descuentoVisual}
                  </div>
                </div>

                <div className="bg-[var(--bg-card-inner)] border border-emerald-500/40 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 text-center">
                  <div className="text-[9px] sm:text-[10px] text-emerald-400 font-black uppercase">AHORRO</div>
                  <div className="text-sm sm:text-base md:text-lg font-black text-emerald-300 mt-0.5">
                    $ {formatMoneda(calculos.montoAhorroUSD)}
                  </div>
                </div>
              </div>

              <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-4">
                Toda la liquidación se procesa al tipo de cambio oficial vigente el día efectivo de la transacción.
              </div>
            </div>

            {/* DOBLE ÓPTICA FINANCIERA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-[var(--border-glow)]">
              <div className="bg-[#081222] border border-[#192f50] rounded-2xl p-3.5 sm:p-4 text-xs font-mono">
                <div className="text-[11px] font-black text-cyan-400 mb-2.5 flex items-center gap-1.5 uppercase font-sans">
                  💲 ÓPTICA 1: DESCUENTO A CAPITAL
                </div>
                <div className="space-y-1.5 sm:space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">CAPITAL BASE ($US)</span>
                    <strong className="text-[var(--text-primary)]">$ {formatMoneda(calculos.optica1_capitalBase)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">{descuentoEtiqueta}</span>
                    <strong className="text-cyan-400">- $ {formatMoneda(calculos.optica1_descuentoUSD)}</strong>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-[#192f50]">
                    <span className="text-[var(--text-secondary)] font-bold">CAPITAL FINAL ($US)</span>
                    <strong className="text-[var(--text-primary)]">$ {formatMoneda(calculos.optica1_capitalFinal)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">TIPO DE CAMBIO</span>
                    <strong className="text-[var(--text-secondary)]">x {calculos.optica1_tc?.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#192f50] text-sm">
                    <span className="text-cyan-400 font-bold">TOTAL (BS.)</span>
                    <strong className="text-cyan-300 text-sm sm:text-base font-black">Bs. {formatMoneda(calculos.optica1_totalBs)}</strong>
                  </div>
                </div>
              </div>

              <div className="bg-[#081222] border border-[#192f50] rounded-2xl p-3.5 sm:p-4 text-xs font-mono">
                <div className="text-[11px] font-black text-emerald-400 mb-2.5 flex items-center gap-1.5 uppercase font-sans">
                  📈 ÓPTICA 2: DESCUENTO A T.C.
                </div>
                <div className="space-y-1.5 sm:space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">CAPITAL BASE ($US)</span>
                    <strong className="text-[var(--text-primary)]">$ {formatMoneda(calculos.optica2_capitalBase)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">TC VIGENTE</span>
                    <strong className="text-[var(--text-primary)]">{calculos.optica2_tcOficial?.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">{descuentoEtiqueta}</span>
                    <strong className="text-emerald-400">- {calculos.optica2_descuentoTC?.toFixed(2)} Bs/$us</strong>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-[#192f50]">
                    <span className="text-[var(--text-secondary)] font-bold">TC EFECTIVO FINAL</span>
                    <strong className="text-[var(--text-primary)]">x {calculos.optica2_tcEfectivo?.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#192f50] text-sm">
                    <span className="text-emerald-400 font-bold">TOTAL (BS.)</span>
                    <strong className="text-emerald-300 text-sm sm:text-base font-black">Bs. {formatMoneda(calculos.optica2_totalBs)}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* DATO PRIORITARIO: PRECIO POR METRO CUADRADO PARA MODIFICAR EN SISTEMA */}
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-[#0d2a1d] to-[#0a1f33] border-2 border-emerald-500/60 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-emerald-400 block mb-0.5">
                    DATO CLAVE PARA EL SISTEMA CELINA (APROBADORES)
                  </span>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Precio Anterior: <span className="line-through text-[var(--text-muted)] font-mono">${formatMoneda(calculos.precioM2Anterior)}/m²</span>
                    <span className="ml-2 text-rose-400 font-mono font-bold">(-${formatMoneda(calculos.reduccionM2)}/m²{calculos.modalidad === "CREDITO" ? " equiv." : ""})</span>
                  </div>
                </div>

                <div className="text-left sm:text-right bg-[#05130e] border border-emerald-500/50 px-4 py-2 rounded-xl w-full sm:w-auto">
                  <span className="text-[9px] font-bold text-[var(--text-muted)] block uppercase">NUEVO PRECIO M² EN SISTEMA:</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    $ {formatMoneda(calculos.nuevoPrecioM2)} <span className="text-xs">/ m²</span>
                  </span>
                </div>
              </div>
            </div>

            {/* BOTONERA TRIPLE EXACTA + WHATSAPP */}
            <div className="pt-6 mt-4 border-t border-[var(--border-glow)] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. COPIAR FORMATO (TARJETA BLANCA / GRIS CLARA) */}
                <button
                  type="button"
                  onClick={copiarFormatoHTML}
                  className="py-3 px-4 bg-slate-100 hover:bg-[var(--bg-card)] text-slate-900 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md active:scale-95"
                >
                  <Copy className="w-4 h-4 text-slate-800" />
                  Copiar Formato
                </button>

                {/* 2. APP OUTLOOK (AZUL OFICIAL #0078D4) */}
                <button
                  type="button"
                  onClick={enviarAppOutlook}
                  className="py-3 px-4 bg-[#0078d4] hover:bg-[#006cc1] text-[var(--text-primary)] font-black rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/40 active:scale-95"
                >
                  <Monitor className="w-4 h-4 text-blue-100" />
                  App Outlook 🖥️
                </button>
              </div>

              {/* 3. ABRIR EN GMAIL CON BADGE + CC AUTOMÁTICO (ROJO #EA4335) */}
              <button
                type="button"
                onClick={abrirEnGmailWeb}
                className="w-full py-3.5 px-4 bg-[#ea4335] hover:bg-[#dc2626] text-[var(--text-primary)] font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-red-950/50 relative overflow-hidden active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>Abrir en Gmail</span>
                <span className="ml-1.5 bg-[var(--bg-card)]/20 text-[var(--text-primary)] border border-white/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  + CC Automático
                </span>
              </button>

              {/* 4. ENVIAR POR WHATSAPP */}
              <button
                type="button"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(textoWhatsApp)}`, "_blank")}
                className="w-full py-2.5 px-4 bg-[#0f3a2c] hover:bg-[#124937] border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                Enviar Propuesta por WhatsApp
              </button>
            </div>

            {notificacion && (
              <div className="mt-3 text-center text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 py-2 rounded-lg animate-pulse">
                {notificacion}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
