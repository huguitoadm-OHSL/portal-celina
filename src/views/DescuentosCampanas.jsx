import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Tag,
  MapPin,
  Building2,
  Send,
  Copy,
  Mail,
  Trophy,
  Upload,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

// ============================================================================
// PARÁMETROS Y CONSTANTES OFICIALES (OCTUBRE)
// ============================================================================
const VENTANAS_CONTADO = {
  "0_30": {
    plazo: "0 a 30 días",
    descuentoPct: 30,
    tcEfectivo: 8.40,
    labelBadge: "CONTADO (0 A 30 DÍAS)"
  },
  "30_60": {
    plazo: "30 a 60 días",
    descuentoPct: 20,
    tcEfectivo: 9.60,
    labelBadge: "CONTADO (30 A 60 DÍAS)"
  },
  "60_90": {
    plazo: "60 a 90 días",
    descuentoPct: 10,
    tcEfectivo: 10.80,
    labelBadge: "CONTADO (60 A 90 DÍAS)"
  }
};

const TC_OFICIAL_BASE = 12.00;
const DESCUENTO_CREDITO_M2 = 1.0; // Descuento 1 US$ x m2
const META_EQUIPO_OCTUBRE = 111000;

// Destinatarios clave para la aprobación formal
const DESTINATARIOS_APROBACION = [
  { nombre: "Lic. Mauricio Reyes", cargo: "Jefatura de Ventas", email: "mreyes@celina.com.bo" },
  { nombre: "Lic. Verenice Choque", cargo: "Jefatura de Cartera y Cobranzas", email: "vchoque@grupopaz.com.bo" },
  { nombre: "Lic. Robert Vaca", cargo: "Gerencia Comercial Grupo PAZ", email: "rvaca@grupopaz.com.bo" },
  { nombre: "Lic. Rene Valverde", cargo: "Jefatura de Operaciones", email: "rvalverded@celina.com.bo" },
  { nombre: "Lic. Angelica Pinto", cargo: "Jefatura Administrativa", email: "apinto@celina.com.bo" }
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
  const [lotes, setLotes] = useState([]);
  const [cargandoBD, setCargandoBD] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  // Modalidad comercial
  const [modalidad, setModalidad] = useState("CONTADO_LIQUIDACION");
  const [ventanaSeleccionada, setVentanaSeleccionada] = useState("0_30");

  // Filtros en cascada
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState("MUYURINA");
  const [uvSeleccionada, setUvSeleccionada] = useState("");
  const [mznSeleccionada, setMznSeleccionada] = useState("");
  const [loteSeleccionado, setLoteSeleccionado] = useState("");

  // Atributos del lote activo
  const [superficie, setSuperficie] = useState(0);
  const [precioBaseM2, setPrecioBaseM2] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [estadoLote, setEstadoLote] = useState("DISPONIBLE");

  // Ajustes de crédito
  const [cuotaInicialPct, setCuotaInicialPct] = useState(1.5);
  const [plazoAnios, setPlazoAnios] = useState(10);

  // Destinatario y asesor
  const [destinatarioEmail, setDestinatarioEmail] = useState(DESTINATARIOS_APROBACION[0].email);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(ASESORES_EQUIPO[0]);
  const [notificacion, setNotificacion] = useState(null);

  const fileInputRef = useRef(null);

  // Limpiador numérico seguro
  const parseNumero = (val) => {
    if (val === undefined || val === null || val === "") return 0;
    if (typeof val === "number") return val;
    const str = String(val).replace(/,/g, "").trim();
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  const formatMoneda = (val) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val || 0);

  // Ingesta automática de inventario_lotes.json desde /public
  const cargarInventario = async () => {
    setCargandoBD(true);
    setErrorCarga(null);
    try {
      let data = [];
      try {
        const res = await fetch("/inventario_lotes.json");
        if (res.ok) data = await res.json();
        else throw new Error("No encontrado");
      } catch (e) {
        const resFallback = await fetch("/lotes.json");
        if (resFallback.ok) data = await resFallback.json();
        else throw new Error("No accesible");
      }
      procesarDatosLotes(data);
    } catch (err) {
      setErrorCarga("Cargue el archivo inventario_lotes.json con el botón superior.");
      setCargandoBD(false);
    }
  };

  const procesarDatosLotes = (data) => {
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
    if (proys.length > 0 && !proys.includes(proyectoSeleccionado)) {
      setProyectoSeleccionado(proys[0]);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCargandoBD(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result);
        procesarDatosLotes(json);
      } catch (err) {
        setErrorCarga("JSON inválido.");
        setCargandoBD(false);
      }
    };
    reader.readAsText(file);
  };

  // Opciones en cascada
  const proyectosDisponibles = useMemo(() => Array.from(new Set(lotes.map((l) => l.proyecto))).sort(), [lotes]);

  const uvsDisponibles = useMemo(() => {
    if (!proyectoSeleccionado) return [];
    return Array.from(
      new Set(lotes.filter((l) => l.proyecto === proyectoSeleccionado).map((l) => l.uv))
    ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [lotes, proyectoSeleccionado]);

  const mznsDisponibles = useMemo(() => {
    if (!proyectoSeleccionado || !uvSeleccionada) return [];
    return Array.from(
      new Set(
        lotes
          .filter((l) => l.proyecto === proyectoSeleccionado && l.uv === uvSeleccionada)
          .map((l) => l.mzn)
      )
    ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [lotes, proyectoSeleccionado, uvSeleccionada]);

  const lotesDisponibles = useMemo(() => {
    if (!proyectoSeleccionado || !uvSeleccionada || !mznSeleccionada) return [];
    return lotes
      .filter(
        (l) =>
          l.proyecto === proyectoSeleccionado &&
          l.uv === uvSeleccionada &&
          l.mzn === mznSeleccionada
      )
      .sort((a, b) => a.lote.localeCompare(b.lote, undefined, { numeric: true }));
  }, [lotes, proyectoSeleccionado, uvSeleccionada, mznSeleccionada]);

  useEffect(() => {
    if (uvsDisponibles.length > 0 && !uvsDisponibles.includes(uvSeleccionada)) {
      setUvSeleccionada(uvsDisponibles[0]);
    }
  }, [proyectoSeleccionado, uvsDisponibles]);

  useEffect(() => {
    if (mznsDisponibles.length > 0 && !mznsDisponibles.includes(mznSeleccionada)) {
      setMznSeleccionada(mznsDisponibles[0]);
    }
  }, [uvSeleccionada, mznsDisponibles]);

  useEffect(() => {
    if (lotesDisponibles.length > 0) {
      const primeroDisp = lotesDisponibles.find((l) => l.estado === "DISPONIBLE") || lotesDisponibles[0];
      setLoteSeleccionado(primeroDisp.lote);
    }
  }, [mznSeleccionada, lotesDisponibles]);

  useEffect(() => {
    const item = lotes.find(
      (l) =>
        l.proyecto === proyectoSeleccionado &&
        l.uv === uvSeleccionada &&
        l.mzn === mznSeleccionada &&
        l.lote === loteSeleccionado
    );
    if (item) {
      setSuperficie(item.superficie);
      setPrecioBaseM2(item.precio);
      setCategoria(item.categoria);
      setEstadoLote(item.estado);
    }
  }, [proyectoSeleccionado, uvSeleccionada, mznSeleccionada, loteSeleccionado, lotes]);

  // ============================================================================
  // CÁLCULOS MATEMÁTICOS DE DOBLE ÓPTICA
  // ============================================================================
  const calculos = useMemo(() => {
    const capitalBaseUSD = superficie * precioBaseM2;

    if (modalidad === "CONTADO_LIQUIDACION") {
      const config = VENTANAS_CONTADO[ventanaSeleccionada] || VENTANAS_CONTADO["0_30"];
      const descuentoPct = config.descuentoPct;

      // ÓPTICA 1: DESCUENTO A CAPITAL
      const montoDescuentoUSD = capitalBaseUSD * (descuentoPct / 100);
      const capitalFinalUSD = Math.max(0, capitalBaseUSD - montoDescuentoUSD);
      const totalBsOptica1 = capitalFinalUSD * TC_OFICIAL_BASE;

      // ÓPTICA 2: DESCUENTO A T.C.
      const descuentoTCOficial = TC_OFICIAL_BASE * (descuentoPct / 100); // 3.60 Bs/$us en 30%
      const tcEfectivoFinal = TC_OFICIAL_BASE - descuentoTCOficial; // 8.40 en 30%
      const totalBsOptica2 = capitalBaseUSD * tcEfectivoFinal;

      return {
        modalidad: "CONTADO",
        labelBadge: config.labelBadge,
        capitalBaseUSD,
        descuentoPct,
        montoAhorroUSD: montoDescuentoUSD,
        capitalFinalUSD,
        totalBs: totalBsOptica1,
        // Óptica 1
        optica1_capitalBase: capitalBaseUSD,
        optica1_descuentoUSD: montoDescuentoUSD,
        optica1_capitalFinal: capitalFinalUSD,
        optica1_tc: TC_OFICIAL_BASE,
        optica1_totalBs: totalBsOptica1,
        // Óptica 2
        optica2_capitalBase: capitalBaseUSD,
        optica2_tcOficial: TC_OFICIAL_BASE,
        optica2_descuentoTC: descuentoTCOficial,
        optica2_tcEfectivo: tcEfectivoFinal,
        optica2_totalBs: totalBsOptica2
      };
    } else {
      // CRÉDITO: 1 US$ x m2
      const descuentoTotalUSD = superficie * DESCUENTO_CREDITO_M2;
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

      return {
        modalidad: "CREDITO",
        labelBadge: "VENTA A CRÉDITO (1 US$/m²)",
        capitalBaseUSD,
        descuentoPct: capitalBaseUSD > 0 ? (descuentoTotalUSD / capitalBaseUSD) * 100 : 0,
        montoAhorroUSD: descuentoTotalUSD,
        capitalFinalUSD,
        totalBs,
        cuotaInicialUSD: inicialUSD,
        cuotaInicialBS: inicialBS,
        cuotaMensualUSD: mensualUSD,
        cuotaMensualBS: mensualBS,
        saldoUSD,
        // Óptica 1
        optica1_capitalBase: capitalBaseUSD,
        optica1_descuentoUSD: descuentoTotalUSD,
        optica1_capitalFinal: capitalFinalUSD,
        optica1_tc: TC_OFICIAL_BASE,
        optica1_totalBs: totalBs,
        // Óptica 2
        optica2_capitalBase: capitalBaseUSD,
        optica2_tcOficial: TC_OFICIAL_BASE,
        optica2_descuentoTC: (descuentoTotalUSD / (capitalBaseUSD || 1)) * TC_OFICIAL_BASE,
        optica2_tcEfectivo: TC_OFICIAL_BASE * (capitalFinalUSD / (capitalBaseUSD || 1)),
        optica2_totalBs: totalBs
      };
    }
  }, [modalidad, ventanaSeleccionada, superficie, precioBaseM2, cuotaInicialPct, plazoAnios]);

  const destinatarioObj = useMemo(() => {
    return DESTINATARIOS_APROBACION.find((d) => d.email === destinatarioEmail) || DESTINATARIOS_APROBACION[0];
  }, [destinatarioEmail]);

  // ============================================================================
  // GENERADORES DE CORREO FORMAL (HTML CORPORATIVO)
  // ============================================================================
  const generarHTMLCorreo = () => {
    return `
<div style="font-family: Arial, Helvetica, sans-serif; color: #1e293b; max-width: 650px; margin: 0 auto; line-height: 1.5;">
  <p style="margin: 0 0 10px; font-size: 15px;">Buenas tardes</p>
  <p style="margin: 0 0 15px; font-size: 15px;">Estimado(a) <strong>${destinatarioObj.nombre}</strong>,</p>
  <p style="margin: 0 0 25px; font-size: 14px; color: #334155;">
    Por favor le solicito mediante el presente correo la aplicación y aprobación del descuento correspondiente a la 
    <strong>Campaña Oficial de Octubre</strong> para el proyecto <strong>${proyectoSeleccionado}</strong>, bajo el esquema y doble óptica que se detalla a continuación:
  </p>

  <!-- TARJETA PRINCIPAL ESTILO DARK CORPORATIVO -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #060c18; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; margin-bottom: 25px;">
    <!-- CABECERA DE UBICACIÓN -->
    <tr>
      <td style="padding: 20px; border-bottom: 1px solid #132238;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">PROYECTO</div>
              <div style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">${proyectoSeleccionado}</div>
              <div style="display: inline-block; background-color: #78350f; color: #fde68a; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px; margin-top: 6px;">
                ${categoria || "LOTE S/CALLE I1 - ZONA C"}
              </div>
            </td>
            <td align="right" valign="top">
              <span style="display: inline-block; background-color: #0c1a30; border: 1px solid #1e3a5f; color: #38bdf8; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; margin-left: 4px;">
                UV <strong style="color: #ffffff; font-size: 13px;">${uvSeleccionada}</strong>
              </span>
              <span style="display: inline-block; background-color: #0c1a30; border: 1px solid #1e3a5f; color: #38bdf8; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; margin-left: 4px;">
                MZN <strong style="color: #ffffff; font-size: 13px;">${mznSeleccionada}</strong>
              </span>
              <span style="display: inline-block; background-color: #0c1a30; border: 1px solid #1e3a5f; color: #38bdf8; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; margin-left: 4px;">
                LT <strong style="color: #ffffff; font-size: 13px;">${loteSeleccionado}</strong>
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- HERO VALOR FINAL -->
    <tr>
      <td align="center" style="padding: 30px 20px 20px;">
        <div style="display: inline-block; background-color: #0f2744; border: 1px solid #0284c7; color: #38bdf8; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; margin-bottom: 12px;">
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

    <!-- TRES CAJAS MÉTRICAS -->
    <tr>
      <td style="padding: 10px 20px 20px;">
        <table width="100%" cellpadding="0" cellspacing="6">
          <tr>
            <td width="33%" align="center" style="background-color: #0b1528; border: 1px solid #1e293b; border-radius: 10px; padding: 12px;">
              <div style="font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase;">BASE</div>
              <div style="font-size: 16px; font-weight: bold; color: #ffffff; margin-top: 4px;">$ ${formatMoneda(calculos.capitalBaseUSD)}</div>
            </td>
            <td width="33%" align="center" style="background-color: #0b1528; border: 1px solid #1e293b; border-radius: 10px; padding: 12px;">
              <div style="font-size: 10px; color: #38bdf8; font-weight: bold; text-transform: uppercase;">DESCUENTO</div>
              <div style="font-size: 16px; font-weight: bold; color: #38bdf8; margin-top: 4px;">${calculos.descuentoPct.toFixed(0)}%</div>
            </td>
            <td width="33%" align="center" style="background-color: #04251d; border: 1px solid #065f46; border-radius: 10px; padding: 12px;">
              <div style="font-size: 10px; color: #34d399; font-weight: bold; text-transform: uppercase;">AHORRO</div>
              <div style="font-size: 16px; font-weight: bold; color: #34d399; margin-top: 4px;">$ ${formatMoneda(calculos.montoAhorroUSD)}</div>
            </td>
          </tr>
        </table>
        <div style="text-align: center; font-size: 10px; color: #64748b; font-weight: bold; margin-top: 15px; letter-spacing: 0.5px;">
          TODA LA LIQUIDACIÓN SE PROCESA AL TIPO DE CAMBIO OFICIAL VIGENTE EL DÍA EFECTIVO DE LA TRANSACCIÓN.
        </div>
      </td>
    </tr>

    <!-- CUADRO DE DOBLE ÓPTICA FINANCIERA -->
    <tr>
      <td style="padding: 10px 20px 25px;">
        <table width="100%" cellpadding="0" cellspacing="8">
          <tr>
            <!-- ÓPTICA 1 -->
            <td width="50%" valign="top" style="background-color: #081120; border: 1px solid #1e3a5f; border-radius: 12px; padding: 16px;">
              <div style="font-size: 11px; font-weight: bold; color: #38bdf8; margin-bottom: 12px; text-transform: uppercase;">
                💲 ÓPTICA 1: DESCUENTO A CAPITAL
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 12px; color: #94a3b8;">
                <tr>
                  <td style="padding: 4px 0;">CAPITAL BASE ($US)</td>
                  <td align="right" style="color: #ffffff; font-weight: bold;">$ ${formatMoneda(calculos.optica1_capitalBase)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;">DESCUENTO (${calculos.descuentoPct.toFixed(0)}%)</td>
                  <td align="right" style="color: #38bdf8; font-weight: bold;">- $ ${formatMoneda(calculos.optica1_descuentoUSD)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; border-top: 1px solid #1e293b;">CAPITAL FINAL ($US)</td>
                  <td align="right" style="padding: 6px 0; border-top: 1px solid #1e293b; color: #ffffff; font-weight: bold;">$ ${formatMoneda(calculos.optica1_capitalFinal)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;">TIPO DE CAMBIO</td>
                  <td align="right" style="color: #94a3b8; font-weight: bold;">x ${calculos.optica1_tc.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 0; font-size: 13px; font-weight: bold; color: #38bdf8; border-top: 1px solid #1e293b;">TOTAL (BS.)</td>
                  <td align="right" style="padding: 10px 0 0; font-size: 14px; font-weight: 900; color: #38bdf8; border-top: 1px solid #1e293b;">Bs. ${formatMoneda(calculos.optica1_totalBs)}</td>
                </tr>
              </table>
            </td>

            <!-- ÓPTICA 2 -->
            <td width="50%" valign="top" style="background-color: #081120; border: 1px solid #1e3a5f; border-radius: 12px; padding: 16px;">
              <div style="font-size: 11px; font-weight: bold; color: #34d399; margin-bottom: 12px; text-transform: uppercase;">
                📈 ÓPTICA 2: DESCUENTO A T.C.
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 12px; color: #94a3b8;">
                <tr>
                  <td style="padding: 4px 0;">CAPITAL BASE ($US)</td>
                  <td align="right" style="color: #ffffff; font-weight: bold;">$ ${formatMoneda(calculos.optica2_capitalBase)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;">TC OFICIAL BASE</td>
                  <td align="right" style="color: #ffffff; font-weight: bold;">${calculos.optica2_tcOficial.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;">DESCUENTO (${calculos.descuentoPct.toFixed(0)}%)</td>
                  <td align="right" style="color: #34d399; font-weight: bold;">- ${calculos.optica2_descuentoTC.toFixed(2)} Bs/$us</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; border-top: 1px solid #1e293b;">TC EFECTIVO FINAL</td>
                  <td align="right" style="padding: 6px 0; border-top: 1px solid #1e293b; color: #ffffff; font-weight: bold;">x ${calculos.optica2_tcEfectivo.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 0; font-size: 13px; font-weight: bold; color: #34d399; border-top: 1px solid #1e293b;">TOTAL (BS.)</td>
                  <td align="right" style="padding: 10px 0 0; font-size: 14px; font-weight: 900; color: #34d399; border-top: 1px solid #1e293b;">Bs. ${formatMoneda(calculos.optica2_totalBs)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <p style="margin: 0 0 10px; font-size: 14px;">Quedo atento a su aprobación para continuar con el proceso del cierre de la venta.</p>
  <p style="margin: 0 0 4px; font-size: 14px;">Saludos cordiales,</p>
  <p style="margin: 0; font-size: 15px; font-weight: bold; color: #0f172a;">${asesorSeleccionado}</p>
  <p style="margin: 0; font-size: 12px; color: #64748b;">Celina Urbanizaciones • Grupo PAZ</p>
</div>
`;
  };

  const copiarCorreoHTML = async () => {
    const html = generarHTMLCorreo();
    const textoPlano = `Solicitud de Descuento - ${proyectoSeleccionado} UV ${uvSeleccionada} MZN ${mznSeleccionada} LT ${loteSeleccionado}\n` +
      `Total USD: $${formatMoneda(calculos.capitalFinalUSD)} | Total Bs: Bs. ${formatMoneda(calculos.totalBs)}\n` +
      `Base: $${formatMoneda(calculos.capitalBaseUSD)} | Descuento: ${calculos.descuentoPct.toFixed(0)}% | Ahorro: $${formatMoneda(calculos.montoAhorroUSD)}`;

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const item = new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([textoPlano], { type: "text/plain" })
        });
        await navigator.clipboard.write([item]);
        setNotificacion("¡Cuadro HTML profesional copiado! Pégalo (Ctrl + V) directamente en Gmail/Outlook.");
      } else {
        await navigator.clipboard.writeText(html);
        setNotificacion("¡Código copiado al portapapeles!");
      }
    } catch {
      await navigator.clipboard.writeText(textoPlano);
      setNotificacion("¡Texto plano copiado!");
    }
    setTimeout(() => setNotificacion(null), 4000);
  };

  const textoWhatsApp = `🔥 *OFERTA LIQUIDACIÓN CAMPAÑA OCTUBRE - CELINA URBANIZACIONES* 🔥\n\n` +
    `📍 *Proyecto:* ${proyectoSeleccionado}\n` +
    `📐 *Lote:* UV ${uvSeleccionada} • MZN ${mznSeleccionada} • Lote ${loteSeleccionado} (${formatMoneda(superficie)} m²)\n` +
    `🏷️ *Categoría:* ${categoria}\n\n` +
    `💵 *Precio Base:* $ ${formatMoneda(calculos.capitalBaseUSD)}\n` +
    `🎉 *Descuento Campaña:* *${calculos.descuentoPct.toFixed(0)}%* (-$ ${formatMoneda(calculos.montoAhorroUSD)})\n` +
    `💎 *PRECIO FINAL:* *$ ${formatMoneda(calculos.capitalFinalUSD)} USD*\n\n` +
    `🇧🇴 *En Bolivianos:* *Bs. ${formatMoneda(calculos.totalBs)}*\n` +
    `👉 *TC Efectivo de Pago:* *Bs. ${calculos.optica2_tcEfectivo?.toFixed(2)}* (vs TC Oficial 12.00)\n\n` +
    `Asesor: ${asesorSeleccionado}`;

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 p-4 md:p-8 font-sans">
      {/* HEADER DE CONTROL */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[11px] font-black tracking-widest text-cyan-400 uppercase">
              PORTAL GESTIÓN ESTRATÉGICA • CELINA URBANIZACIONES
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Tag className="w-7 h-7 text-cyan-400" />
            DESCUENTOS <span className="text-cyan-400">CAMPAÑAS</span>
          </h1>
        </div>

        {/* CONTROLES DE MATRIZ DE LOTES */}
        <div className="flex items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json" className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-slate-300 transition"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            Cargar JSON
          </button>
          <button
            onClick={cargarInventario}
            className="px-3 py-1.5 bg-cyan-950/60 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-cyan-300 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cargandoBD ? "animate-spin" : ""}`} />
            Matriz ({lotes.length})
          </button>
        </div>
      </div>

      {errorCarga && (
        <div className="max-w-6xl mx-auto mb-6 bg-amber-950/50 border border-amber-500/50 p-3.5 rounded-xl flex items-center gap-3 text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{errorCarga}</span>
        </div>
      )}

      {/* SELECTOR DE MODALIDAD EXCLUSIVA */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-900/60 border border-slate-800 p-2.5 rounded-2xl">
        <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setModalidad("CONTADO_LIQUIDACION")}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-black transition flex items-center justify-center gap-2 ${
              modalidad === "CONTADO_LIQUIDACION"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Banknote className="w-4 h-4" />
            VENTAS CONTADO - LIQUIDACIÓN (30% / 20% / 10%)
          </button>
          <button
            type="button"
            onClick={() => setModalidad("CREDITO")}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-black transition flex items-center justify-center gap-2 ${
              modalidad === "CREDITO"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            CRÉDITO (1 US$/m²)
          </button>
        </div>

        {/* SELECTOR DE VENTANAS SI ES CONTADO */}
        {modalidad === "CONTADO_LIQUIDACION" && (
          <div className="flex gap-1.5 w-full sm:w-auto">
            {Object.keys(VENTANAS_CONTADO).map((vKey) => {
              const conf = VENTANAS_CONTADO[vKey];
              const activo = ventanaSeleccionada === vKey;
              return (
                <button
                  key={vKey}
                  onClick={() => setVentanaSeleccionada(vKey)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                    activo
                      ? "bg-cyan-950 border-cyan-400 text-cyan-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {conf.plazo} ({conf.descuentoPct}%)
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* CONTENIDO PRINCIPAL EN 2 COLUMNAS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMNA IZQUIERDA: SELECTORES */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Terreno Seleccionado
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">PROYECTO</label>
                <select
                  value={proyectoSeleccionado}
                  onChange={(e) => setProyectoSeleccionado(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                >
                  {proyectosDisponibles.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 text-center font-bold">UV</label>
                  <select
                    value={uvSeleccionada}
                    onChange={(e) => setUvSeleccionada(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1 text-xs text-center font-bold text-cyan-300 focus:outline-none"
                  >
                    {uvsDisponibles.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 text-center font-bold">MZN</label>
                  <select
                    value={mznSeleccionada}
                    onChange={(e) => setMznSeleccionada(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1 text-xs text-center font-bold text-cyan-300 focus:outline-none"
                  >
                    {mznsDisponibles.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 text-center font-bold">LOTE</label>
                  <select
                    value={loteSeleccionado}
                    onChange={(e) => setLoteSeleccionado(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1 text-xs text-center font-bold text-cyan-300 focus:outline-none"
                  >
                    {lotesDisponibles.map((l) => (
                      <option key={l.lote} value={l.lote}>
                        {l.lote} {l.estado !== "DISPONIBLE" ? `(${l.estado})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Superficie:</span>
                  <strong className="text-white">{formatMoneda(superficie)} m²</strong>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Precio Lista:</span>
                  <strong className="text-white">${formatMoneda(precioBaseM2)}/m²</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-500">Categoría:</span>
                  <span className="text-amber-300 font-semibold">{categoria || "LOTE S/CALLE I1 - ZONA C"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* DESTINATARIOS PARA APROBACIÓN */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                SOLICITUD DIRIGIDA A (JEFATURA / GERENCIA):
              </label>
              <select
                value={destinatarioEmail}
                onChange={(e) => setDestinatarioEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none"
              >
                {DESTINATARIOS_APROBACION.map((d) => (
                  <option key={d.email} value={d.email}>
                    {d.nombre} — {d.cargo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                ASESOR RESPONSABLE:
              </label>
              <select
                value={asesorSeleccionado}
                onChange={(e) => setAsesorSeleccionado(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none"
              >
                {ASESORES_EQUIPO.map((as) => <option key={as} value={as}>{as}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: DASHBOARD IDÉNTICO A LA CAPTURA */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#070e1c] border border-[#14233c] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Header del lote */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#14233c]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0e1d32] border border-[#1e3a5f] flex items-center justify-center text-cyan-400 shadow-inner">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">PROYECTO</div>
                  <div className="text-2xl font-black text-white tracking-tight">{proyectoSeleccionado}</div>
                  <div className="inline-block bg-[#78350f]/80 text-[#fef08a] border border-[#b45309]/50 text-[10px] font-extrabold px-2.5 py-0.5 rounded mt-1">
                    {categoria || "LOTE S/CALLE I1 - ZONA C"}
                  </div>
                </div>
              </div>

              {/* 3 Badges de UV, MZN, LOTE */}
              <div className="flex gap-2">
                <div className="bg-[#0b172a] border border-[#1c3558] px-3.5 py-1.5 rounded-xl text-center">
                  <span className="text-[9px] block text-slate-400 font-bold uppercase">UV</span>
                  <strong className="text-base text-cyan-400 font-black">{uvSeleccionada}</strong>
                </div>
                <div className="bg-[#0b172a] border border-[#1c3558] px-3.5 py-1.5 rounded-xl text-center">
                  <span className="text-[9px] block text-slate-400 font-bold uppercase">MZN</span>
                  <strong className="text-base text-cyan-400 font-black">{mznSeleccionada}</strong>
                </div>
                <div className="bg-[#0b172a] border border-[#1c3558] px-3.5 py-1.5 rounded-xl text-center">
                  <span className="text-[9px] block text-slate-400 font-bold uppercase">LOTE</span>
                  <strong className="text-base text-cyan-400 font-black">{loteSeleccionado}</strong>
                </div>
              </div>
            </div>

            {/* SECCIÓN HERO CENTRAL */}
            <div className="py-8 text-center">
              <div className="inline-block bg-[#0e243c] border border-cyan-500/40 text-cyan-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
                🏷️ {calculos.labelBadge}
              </div>
              <div className="text-5xl md:text-6xl font-black text-white tracking-tight mb-2">
                $ {formatMoneda(calculos.capitalFinalUSD)}
              </div>
              <div className="text-xl md:text-2xl font-black text-slate-300 flex items-center justify-center gap-2">
                <span>Bs. {formatMoneda(calculos.totalBs)}</span>
                <span className="bg-[#172554] text-cyan-400 border border-cyan-500/30 text-xs px-2.5 py-0.5 rounded font-mono font-bold">
                  TC {TC_OFICIAL_BASE.toFixed(2)}
                </span>
              </div>

              {/* 3 Cajas de Métricas */}
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mt-7">
                <div className="bg-[#091426] border border-[#182a46] rounded-2xl p-3.5 text-center">
                  <div className="text-[10px] text-slate-400 font-black uppercase">BASE</div>
                  <div className="text-base md:text-lg font-black text-white mt-0.5">
                    $ {formatMoneda(calculos.capitalBaseUSD)}
                  </div>
                </div>

                <div className="bg-[#091426] border border-cyan-500/30 rounded-2xl p-3.5 text-center">
                  <div className="text-[10px] text-cyan-400 font-black uppercase">DESCUENTO</div>
                  <div className="text-base md:text-lg font-black text-cyan-300 mt-0.5">
                    {calculos.descuentoPct.toFixed(0)}%
                  </div>
                </div>

                <div className="bg-[#04241b] border border-emerald-500/40 rounded-2xl p-3.5 text-center">
                  <div className="text-[10px] text-emerald-400 font-black uppercase">AHORRO</div>
                  <div className="text-base md:text-lg font-black text-emerald-300 mt-0.5">
                    $ {formatMoneda(calculos.montoAhorroUSD)}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-5">
                Toda la liquidación se procesa al tipo de cambio oficial vigente el día efectivo de la transacción.
              </div>
            </div>

            {/* SECCIÓN DOBLE ÓPTICA FINANCIERA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#14233c]">
              {/* ÓPTICA 1: DESCUENTO A CAPITAL */}
              <div className="bg-[#081222] border border-[#192f50] rounded-2xl p-4 text-xs font-mono">
                <div className="text-xs font-black text-cyan-400 mb-3 flex items-center gap-1.5 uppercase font-sans">
                  💲 ÓPTICA 1: DESCUENTO A CAPITAL
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">CAPITAL BASE ($US)</span>
                    <strong className="text-white">$ {formatMoneda(calculos.optica1_capitalBase)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DESCUENTO ({calculos.descuentoPct.toFixed(0)}%)</span>
                    <strong className="text-cyan-400">- $ {formatMoneda(calculos.optica1_descuentoUSD)}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#192f50]">
                    <span className="text-slate-300 font-bold">CAPITAL FINAL ($US)</span>
                    <strong className="text-white">$ {formatMoneda(calculos.optica1_capitalFinal)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TIPO DE CAMBIO</span>
                    <strong className="text-slate-300">x {calculos.optica1_tc?.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#192f50] text-sm">
                    <span className="text-cyan-400 font-bold">TOTAL (BS.)</span>
                    <strong className="text-cyan-300 text-base font-black">Bs. {formatMoneda(calculos.optica1_totalBs)}</strong>
                  </div>
                </div>
              </div>

              {/* ÓPTICA 2: DESCUENTO A T.C. */}
              <div className="bg-[#081222] border border-[#192f50] rounded-2xl p-4 text-xs font-mono">
                <div className="text-xs font-black text-emerald-400 mb-3 flex items-center gap-1.5 uppercase font-sans">
                  📈 ÓPTICA 2: DESCUENTO A T.C.
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">CAPITAL BASE ($US)</span>
                    <strong className="text-white">$ {formatMoneda(calculos.optica2_capitalBase)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TC OFICIAL BASE</span>
                    <strong className="text-white">{calculos.optica2_tcOficial?.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DESCUENTO ({calculos.descuentoPct.toFixed(0)}%)</span>
                    <strong className="text-emerald-400">- {calculos.optica2_descuentoTC?.toFixed(2)} Bs/$us</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#192f50]">
                    <span className="text-slate-300 font-bold">TC EFECTIVO FINAL</span>
                    <strong className="text-white">x {calculos.optica2_tcEfectivo?.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#192f50] text-sm">
                    <span className="text-emerald-400 font-bold">TOTAL (BS.)</span>
                    <strong className="text-emerald-300 text-base font-black">Bs. {formatMoneda(calculos.optica2_totalBs)}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTONES DE DISPARO */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-4 border-t border-[#14233c]">
              <button
                type="button"
                onClick={copiarCorreoHTML}
                className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/20"
              >
                <Mail className="w-4 h-4" />
                Copiar Correo Diseñado (HTML)
              </button>

              <button
                type="button"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(textoWhatsApp)}`, "_blank")}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950/40"
              >
                <Send className="w-4 h-4" />
                Enviar por WhatsApp
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
