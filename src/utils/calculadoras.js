import { PROYECTOS_CONVENIO_1, PROYECTOS_CONVENIO_2, PROYECTOS_PROPIOS_1 } from '../constants/proyectos';

export const calcularDescuento = (formDescuento) => {
  const { proyecto, modalidad, cuota, modoCuota, m2, precioM2, descuentoManual, tipoDescuentoManual, descuentoPropiosManual } = formDescuento;
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

  if (proyecto === 'OTRO...') {
    let descManualNum = parseFloat(descuentoManual) || 0;
    if (tipoDescuentoManual === 'porcentaje') {
       descuentoTotal = vc * (descManualNum / 100);
       descuentoTexto = descManualNum > 0 ? `${descManualNum}%` : '0%';
    } else {
       descuentoTotal = descManualNum * m2Num;
       descuentoTexto = descManualNum > 0 ? `$${descManualNum} por m²` : '0';
    }
  } else if (PROYECTOS_CONVENIO_1.includes(proyecto) || PROYECTOS_CONVENIO_2.includes(proyecto)) {
    let descuentoPorM2 = 0;
    if (modalidad === 'Contado') {
      descuentoPorM2 = PROYECTOS_CONVENIO_1.includes(proyecto) ? 3 : 4; 
    } else if (modalidad === 'Crédito') {
      if (porcentajeCuota >= 5) descuentoPorM2 = 2; 
      else if (porcentajeCuota >= 1.5) descuentoPorM2 = 1; 
    }
    descuentoTotal = descuentoPorM2 * m2Num;
    descuentoTexto = descuentoPorM2 > 0 ? `$${descuentoPorM2} por m²` : '0';

  } else if (PROYECTOS_PROPIOS_1.includes(proyecto)) {
    let porcentaje = 0;
    if (modalidad === 'Contado') {
      porcentaje = 30; 
    } else if (modalidad === 'Crédito') {
      if (porcentajeCuota >= 5) {
        const maxDesc = 23;
        let inputDesc = parseFloat(descuentoPropiosManual);
        if (isNaN(inputDesc)) inputDesc = maxDesc;
        porcentaje = Math.max(0, Math.min(inputDesc, maxDesc));
      } else if (porcentajeCuota >= 1.5) {
        const maxDesc = 20;
        let inputDesc = parseFloat(descuentoPropiosManual);
        if (isNaN(inputDesc)) inputDesc = maxDesc;
        porcentaje = Math.max(0, Math.min(inputDesc, maxDesc));
      }
    }
    descuentoTotal = vc * (porcentaje / 100);
    descuentoTexto = porcentaje > 0 ? `${porcentaje}%` : '0%';
  }

  const nuevoPrecioTotal = vc - descuentoTotal;
  const nuevoPrecioM2 = m2Num > 0 ? nuevoPrecioTotal / m2Num : 0;

  return { vc, descuentoTotal, descuentoTexto, nuevoPrecioTotal, nuevoPrecioM2, porcentajeCuota, montoCuotaNum };
};

export const calcularSimulacionAmortizacion = (formAmortizacion) => {
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
  if(n_new < 0) n_new = 0;

  const tiempoAhorrado = Math.max(0, cuotasRestantesOrig - n_new);
  
  const intsOrig = Math.max(0, (C_pura * cuotasRestantesOrig) - P_actual);
  const intsNew = Math.max(0, (C_pura * n_new) - saldoNuevo);
  const ahorrado = Math.max(0, intsOrig - intsNew);

  return {
    P, C_pura, S, C_total, precioFinalPlazos, P_actual, 
    cuotasRestantesOrig, saldoNuevo, n_new, tiempoAhorrado, ahorrado, n, error
  };
};

export const calcularBeneficioRecompra = (proyecto) => {
  const p = String(proyecto).toUpperCase();
  if (p.includes('MUYURINA')) return 200;
  if (p.includes('RANCHO NUEVO')) return 50;
  return 100;
};

export const obtenerDatosSupervisor = (supervisorDestino, SUPERVISORES) => {
  const supervisorSeleccionado = SUPERVISORES.find(s => s.correo === supervisorDestino) || SUPERVISORES[0];
  return {
    saludo: supervisorSeleccionado.genero === 'F' ? 'Estimada' : 'Estimado',
    titulo: supervisorSeleccionado.titulo,
    nombrePila: supervisorSeleccionado.nombre.split(' ')[0] 
  };
};


// --- CALCULADORA DE AMORTIZACIÓN A CAPITAL ---
export const calcularAmortizacion = (form) => {
  const precio = Number(form.precioContrato) || 0;
  const enganche = Number(form.cuotaInicial) || 0;
  const plazoAnios = Number(form.plazoOriginal) || 0;
  const pagadas = Number(form.cuotasPagadas) || 0;
  const abono = Number(form.montoAmortizacion) || 0;

  if (precio === 0 || plazoAnios === 0) {
    return { error: null, P: 0, C_pura: 0, n: 0, S: 0, C_total: 0, precioFinalPlazos: 0, P_actual: 0, cuotasRestantesOrig: 0, saldoNuevo: 0, n_new: 0, tiempoAhorrado: 0, ahorrado: 0, montoNum: 0, cuotasPagadasNum: 0, cuotaInicialNum: 0 };
  }

  const P = precio - enganche; // Capital financiado original
  const n = plazoAnios * 12; // Plazo en meses
  
  // Asumimos cuota pura (sin interés) por defecto en terrenos. 
  // Si Celina maneja un % específico anual, se cambia este valor (ej. 0.07 para 7%)
  const tasaAnual = 0; 
  const i = tasaAnual / 12;

  let C_pura = 0;
  let precioFinalPlazos = precio;

  if (i > 0) {
    // Fórmula Sistema Francés con interés
    C_pura = P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    precioFinalPlazos = enganche + (C_pura * n);
  } else {
    // Fórmula plana sin interés (Puro Capital)
    C_pura = P / n;
  }

  // Situación Actual
  const P_actual = Math.max(P - (C_pura * pagadas), 0); // Saldo actual antes del abono
  const cuotasRestantesOrig = Math.max(n - pagadas, 0);
  
  // Impacto del Abono (Amortización)
  const saldoNuevo = Math.max(P_actual - abono, 0); 
  const n_new = C_pura > 0 ? Math.ceil(saldoNuevo / C_pura) : 0; 
  const tiempoAhorrado = Math.max(cuotasRestantesOrig - n_new, 0);
  
  // Dinero Ahorrado
  const pagoRestanteOriginal = cuotasRestantesOrig * C_pura;
  const pagoRestanteNuevo = n_new * C_pura;
  const ahorrado = Math.max(pagoRestanteOriginal - pagoRestanteNuevo - abono, 0);

  return {
    P, C_pura, n, S: 0, C_total: C_pura, precioFinalPlazos,
    P_actual, cuotasRestantesOrig, saldoNuevo, n_new,
    tiempoAhorrado, ahorrado,
    montoNum: abono, cuotasPagadasNum: pagadas, cuotaInicialNum: enganche,
    error: null
  };
};
