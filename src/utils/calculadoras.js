import { PROYECTOS_CONVENIO_1, PROYECTOS_CONVENIO_2, PROYECTOS_PROPIOS_1 } from '../constants/proyectos';

// Tipo de Cambio Referencial Octubre 2026
export const TC_REFERENCIAL = 12.00;

export const calcularDescuento = (formDescuento = {}) => {
  const {
    proyecto = '',
    modalidad = '',
    cuota = 0,
    modoCuota = 'porcentaje',
    m2 = 0,
    precioM2 = 0,
    descuentoManual = 0,
    tipoDescuentoManual = 'porcentaje',
    descuentoPropiosManual,
    plazoContado = '30',
    plazoLiquidacion
  } = formDescuento;

  const m2Num = parseFloat(m2) || 0;
  const precioM2Num = parseFloat(precioM2) || 0;
  const vc = m2Num * precioM2Num;

  let montoCuotaNum = 0;
  let porcentajeCuota = 0;
  const cuotaVal = parseFloat(cuota) || 0;

  if (modoCuota === 'monto') {
    montoCuotaNum = cuotaVal;
    porcentajeCuota = vc > 0 ? (montoCuotaNum / vc) * 100 : 0;
  } else {
    porcentajeCuota = cuotaVal;
    montoCuotaNum = vc > 0 ? (porcentajeCuota / 100) * vc : 0;
  }

  let descuentoTotal = 0;
  let descuentoTexto = "";
  let tcAplicado = TC_REFERENCIAL;
  let plazoTexto = "";
  let descuentoPorM2Aplicado = 0;

  if (proyecto === 'OTRO...') {
    const descManualNum = parseFloat(descuentoManual) || 0;
    if (tipoDescuentoManual === 'porcentaje') {
      descuentoTotal = vc * (descManualNum / 100);
      descuentoTexto = descManualNum > 0 ? `${descManualNum}%` : '0%';
    } else {
      descuentoTotal = descManualNum * m2Num;
      descuentoTexto = descManualNum > 0 ? `$${descManualNum} por m²` : '0';
    }
  } else if (
    (Array.isArray(PROYECTOS_CONVENIO_1) && PROYECTOS_CONVENIO_1.includes(proyecto)) ||
    (Array.isArray(PROYECTOS_CONVENIO_2) && PROYECTOS_CONVENIO_2.includes(proyecto))
  ) {
    let descuentoPorM2 = 0;
    if (modalidad === 'Contado') {
      descuentoPorM2 = PROYECTOS_CONVENIO_1.includes(proyecto) ? 3 : 4; 
    } else if (modalidad === 'Crédito') {
      if (porcentajeCuota >= 1.5) {
        descuentoPorM2 = 1; 
      }
    }
    descuentoPorM2Aplicado = descuentoPorM2;
    descuentoTotal = descuentoPorM2 * m2Num;
    descuentoTexto = descuentoPorM2 > 0 ? `$${descuentoPorM2} por m²` : '0';

  } else {
    // DIRECTRICES OCTUBRE (Proyectos Propios / Nuevas Ventas)
    if (modalidad === 'Contado') {
      const p = String(plazoLiquidacion || plazoContado || '30').toLowerCase();

      if (p.includes('90') || p === '3' || p.includes('60 y 90')) {
        // Pago entre 60 y 90 días: 10% descuento | TC hoy: 10,80
        descuentoTotal = vc * 0.10;
        descuentoTexto = "10% (Pago entre 60 y 90 días)";
        plazoTexto = "Pago entre 60 y 90 días";
        tcAplicado = 10.80;
      } else if (p.includes('60') || p === '2' || p.includes('30 y 60')) {
        // Pago entre 30 y 60 días: 20% descuento | TC hoy: 9,60
        descuentoTotal = vc * 0.20;
        descuentoTexto = "20% (Pago entre 30 y 60 días)";
        plazoTexto = "Pago entre 30 y 60 días";
        tcAplicado = 9.60;
      } else {
        // Pago al contado o liquidación primeros 30 días: 30% descuento | TC hoy: 8,40
        descuentoTotal = vc * 0.30;
        descuentoTexto = "30% (Pago en los primeros 30 días)";
        plazoTexto = "Pago en los primeros 30 días";
        tcAplicado = 8.40;
      }
    } else if (modalidad === 'Crédito') {
      // Venta a plazo: Descuento 1 US$ x m2 al TC vigente 12,00
      tcAplicado = TC_REFERENCIAL;

      // Si existe un porcentaje manual especial autorizado explícito (ej. 15% o 20%)
      const inputDesc = parseFloat(descuentoPropiosManual);
      if (!isNaN(inputDesc) && inputDesc > 0 && inputDesc <= 20) {
        descuentoTotal = vc * (inputDesc / 100);
        descuentoTexto = `${inputDesc}%`;
      } else {
        // Regla general Octubre: Descuento 1 US$ x m²
        descuentoPorM2Aplicado = 1;
        descuentoTotal = 1 * m2Num;
        descuentoTexto = "$1 US$ por m²";
      }
    }
  }

  const nuevoPrecioTotal = Math.max(0, vc - descuentoTotal);
  const nuevoPrecioM2 = m2Num > 0 ? nuevoPrecioTotal / m2Num : 0;
  const nuevoPrecioBs = nuevoPrecioTotal * tcAplicado;
  const cuotaInicialBs = montoCuotaNum * TC_REFERENCIAL;

  return {
    vc,
    descuentoTotal,
    descuentoTexto,
    nuevoPrecioTotal,
    nuevoPrecioM2,
    porcentajeCuota,
    montoCuotaNum,
    tcAplicado,
    plazoTexto,
    nuevoPrecioBs,
    cuotaInicialBs,
    descuentoPorM2Aplicado
  };
};

export const calcularSimulacionAmortizacion = (formAmortizacion = {}) => {
  const PV = parseFloat(formAmortizacion.precioContrato?.toString().replace(/,/g, '')) || 0;
  const CI = parseFloat(formAmortizacion.cuotaInicial?.toString().replace(/,/g, '')) || 0;
  const t = parseFloat(formAmortizacion.plazoOriginal) || 0;
  const p = parseFloat(formAmortizacion.cuotasPagadas) || 0;
  const S = parseFloat(formAmortizacion.seguroMensual?.toString().replace(/,/g, '')) || 0;
  const r_anual = parseFloat(formAmortizacion.tasaAnual?.toString().replace(/,/g, '')) || 0;
  const A = parseFloat(formAmortizacion.montoAmortizacion?.toString().replace(/,/g, '')) || 0;

  const n = t * 12;
  const r_mensual = r_anual / 100 / 12;
  const P = Math.max(0, PV - CI);

  let C_pura = 0;
  if (r_mensual > 0 && n > 0) {
    C_pura = P * (r_mensual * Math.pow(1 + r_mensual, n)) / (Math.pow(1 + r_mensual, n) - 1);
  } else if (n > 0) {
    C_pura = P / n;
  }
  
  const C_total = C_pura + S;
  const precioFinalPlazos = CI + (C_total * n);
  
  let P_actual = 0;
  if (r_mensual > 0 && n > 0 && p > 0) {
    P_actual = P * (Math.pow(1 + r_mensual, n) - Math.pow(1 + r_mensual, p)) / (Math.pow(1 + r_mensual, n) - 1);
  } else if (n > 0) {
    P_actual = Math.max(0, P - (C_pura * p));
  } else {
    P_actual = P;
  }

  const cuotasRestantesOrig = Math.max(0, n - p);
  const saldoNuevo = Math.max(0, P_actual - A);

  let n_new = 0;
  let error = "";
  if (r_mensual > 0 && C_pura > 0 && saldoNuevo > 0) {
    const term = 1 - (saldoNuevo * r_mensual) / C_pura;
    if (term <= 0) {
      error = "La amortización no cubre los intereses.";
      n_new = cuotasRestantesOrig;
    } else {
      n_new = -Math.log(term) / Math.log(1 + r_mensual);
    }
  } else if (C_pura > 0) {
    n_new = saldoNuevo / C_pura;
  }

  n_new = Math.ceil(n_new - 0.0001); 
  if (n_new < 0) n_new = 0;

  const tiempoAhorrado = Math.max(0, cuotasRestantesOrig - n_new);
  
  const intsOrig = Math.max(0, (C_pura * cuotasRestantesOrig) - P_actual);
  const intsNew = Math.max(0, (C_pura * n_new) - saldoNuevo);
  const ahorrado = Math.max(0, intsOrig - intsNew);

  return {
    P, C_pura, S, C_total, precioFinalPlazos, P_actual, 
    cuotasRestantesOrig, saldoNuevo, n_new, tiempoAhorrado, ahorrado, n, error
  };
};

export const calcularBeneficioRecompra = (proyecto = '') => {
  const p = String(proyecto || '').toUpperCase();
  if (p.includes('MUYURINA')) return 200;
  if (p.includes('RANCHO NUEVO')) return 50;
  return 100;
};

export const obtenerDatosSupervisor = (supervisorDestino, SUPERVISORES = []) => {
  const lista = Array.isArray(SUPERVISORES) && SUPERVISORES.length > 0 ? SUPERVISORES : [];
  const supervisorSeleccionado = lista.find(s => s.correo === supervisorDestino) || lista[0] || {
    genero: 'M',
    titulo: 'Supervisor',
    nombre: 'Supervisor'
  };
  return {
    saludo: supervisorSeleccionado.genero === 'F' ? 'Estimada' : 'Estimado',
    titulo: supervisorSeleccionado.titulo || 'Supervisor',
    nombrePila: (supervisorSeleccionado.nombre || 'Supervisor').split(' ')[0] 
  };
};
