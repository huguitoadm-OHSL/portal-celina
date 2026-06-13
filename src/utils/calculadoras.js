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

// --- CALCULADORA DE AMORTIZACIÓN (SISTEMA FRANCÉS ORIGINAL) ---
export const calcularAmortizacion = (form) => {
  const parseNum = (val) => Number(String(val).replace(',', '.')) || 0;
  
  const precio = parseNum(form.precioContrato);
  const enganche = parseNum(form.cuotaInicial);
  const plazoAnios = parseNum(form.plazoOriginal);
  const pagadas = parseNum(form.cuotasPagadas);
  const abono = parseNum(form.montoAmortizacion);
  const seguro = parseNum(form.seguroMensual);
  const tasaAnual = parseNum(form.tasaAnual) || 12.1733;

  if (precio === 0 || plazoAnios === 0) {
    return { P: 0, C_pura: 0, n: 0, C_total: 0, precioFinalPlazos: 0, P_actual: 0, cuotasRestantesOrig: 0, saldoNuevo: 0, n_new: 0, tiempoAhorrado: 0, ahorrado: 0 };
  }

  const P = Math.max(precio - enganche, 0);
  const n = plazoAnios * 12;
  const i = (tasaAnual / 100) / 12;

  let C_pura = 0;
  if (i > 0) {
    C_pura = P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  } else {
    C_pura = P / n;
  }

  const C_total = C_pura + seguro;
  const precioFinalPlazos = enganche + (C_total * n);

  let P_actual = 0;
  if (i > 0) {
    P_actual = P * (Math.pow(1 + i, n) - Math.pow(1 + i, pagadas)) / (Math.pow(1 + i, n) - 1);
  } else {
    P_actual = Math.max(P - (C_pura * pagadas), 0);
  }

  const cuotasRestantesOrig = Math.max(n - pagadas, 0);
  const saldoNuevo = Math.max(P_actual - abono, 0);

  let n_new = 0;
  if (saldoNuevo > 0 && C_pura > 0) {
     if (i > 0) {
         n_new = Math.ceil(-Math.log(1 - (saldoNuevo * i) / C_pura) / Math.log(1 + i));
     } else {
         n_new = Math.ceil(saldoNuevo / C_pura);
     }
  }

  const tiempoAhorrado = Math.max(cuotasRestantesOrig - n_new, 0);
  
  // Cálculo de Ahorro: (Tiempo ahorrado * Cuota Pura) - Abono + (Tiempo ahorrado * Seguro)
  const interesAhorrado = (tiempoAhorrado * C_pura) - abono;
  const seguroAhorrado = tiempoAhorrado * seguro;
  const ahorrado = Math.max(interesAhorrado + seguroAhorrado, 0);

  return {
    P, C_pura, n, C_total, precioFinalPlazos, P_actual, cuotasRestantesOrig, saldoNuevo, n_new, tiempoAhorrado, ahorrado,
    montoNum: abono
  };
};
