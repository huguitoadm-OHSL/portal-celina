import { getExchangeRate } from './exchangeRates';
// ============================================================================
// CONFIGURACIÓN CENTRAL PORTAL GESTIÓN ESTRATÉGICA • CELINA URBANIZACIONES
// ============================================================================

export const DATA_VERSION = "v4.0 - Octubre 2026";

// Parámetros Financieros Oficiales
export const obtenerTCOficial = getExchangeRate;
export const META_EQUIPO_OCTUBRE_BS = 111000;
export const CORREO_SUPERVISION_RESPALDO = "ohsaravia@celina.com.bo";

// Directorio de Aprobadores Oficiales (Quienes aplican descuentos en sistema)
export const DIRECTORES_APROBACION = [
  {
    id: "mreyes",
    nombre: "Lic. Mauricio Reyes",
    cargo: "Jefe de Ventas",
    email: "mreyes@celina.com.bo",
    genero: "M"
  },
  {
    id: "rvaca",
    nombre: "Lic. Robert Vaca",
    cargo: "Gerente Regional",
    email: "rvaca@grupopaz.com.bo",
    genero: "M"
  },
  {
    id: "vchoque",
    nombre: "Lic. Verenice Choque",
    cargo: "Asistente de Inteligencia y Negocios",
    email: "vchoque@grupopaz.com.bo",
    genero: "F"
  }
];

// Los 7 Asesores del Equipo Oficial
export const ASESORES_EQUIPO = [
  "Carlos Enrique Calderon Montano",
  "Ely Gonzales Garcia",
  "Jaime Fabricio Rios Castro",
  "Jimmy Gonzales Nuñez",
  "Jose Gabriel Padilla Loayza",
  "Marisol Urgel Pizarro",
  "Merly Mendez Hurtado"
];

// Esquema Oficial de Descuentos Contado / Liquidación (Octubre)
export const ESQUEMA_CONTADO = {
  "0_30": {
    dias: "0 a 30 días",
    descuentoPct: 30,
    tcEfectivo: 8.40,
    badge: "CONTADO (0 A 30 DÍAS)"
  },
  "30_60": {
    dias: "30 a 60 días",
    descuentoPct: 20,
    tcEfectivo: 9.60,
    badge: "CONTADO (30 A 60 DÍAS)"
  },
  "60_90": {
    dias: "60 a 90 días",
    descuentoPct: 10,
    tcEfectivo: 10.80,
    badge: "CONTADO (60 A 90 DÍAS)"
  }
};

// Esquema Oficial Crédito
export const ESQUEMA_CREDITO = {
  descuentoUsdM2: 1.00, // 1 US$ x m2
  cuotaInicialMinimaPct: 1.5, // 1.50% de cuota inicial
  get tcOficialVenta() { return getExchangeRate(); },
  escalonadoMensual: false // Ventas nuevas no aplica escalonado
};
