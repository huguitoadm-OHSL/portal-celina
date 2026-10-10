import { getExchangeRate } from '../constants/exchangeRates.js';
import { escapeTemplateData, emailSalutation } from '../services/email.js';
import { formatCurrency } from './formatters.js';

const generarHtmlFisicoRaw = (formFisico = {}) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">{{SALUDO_TIEMPO}}</p>
    <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">{{NOMBRE_SUPERVISOR}},</p>
    <p style="margin-bottom: 20px; color: #333333;">Solicito el cambio de contrato digital a f&iacute;sico para el siguiente cliente:</p>
    <ul style="margin-bottom: 20px; list-style-type: none; padding-left: 0; color: #333333;">
      <li style="margin-bottom: 5px;">- <strong>Nombre del Cliente:</strong> ${formFisico.nombre || '[Nombre]'}</li>
      <li style="margin-bottom: 5px;">- <strong>N&uacute;mero de Carnet (CI):</strong> ${formFisico.ci || '[CI]'}</li>
      <li style="margin-bottom: 5px;">- <strong>N&uacute;mero de Contrato:</strong> ${formFisico.contrato || '[Nro Contrato]'}</li>
    </ul>
    <p style="margin-bottom: 5px; color: #333333;"><strong>Motivo de la solicitud:</strong></p>
    <p style="margin-bottom: 20px; color: #333333;">${formFisico.motivo || '[Describa el motivo...]'}</p>
    <p style="margin-bottom: 25px; color: #333333;">Quedo atento a la confirmaci&oacute;n.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formFisico.asesor || 'Asesor'}</p>
  </div>`;
};

const generarHtmlAmortizacionRaw = (formAmortizacion = {}, calculos = {}) => {
  const {
    P = 0, C_pura = 0, n = 0, precioFinalPlazos = 0,
    P_actual = 0, cuotasRestantesOrig = 0, saldoNuevo = 0,
    n_new = 0, tiempoAhorrado = 0, ahorrado = 0, error = ''
  } = calculos;

  if (error) return `<div style="color:red; font-weight:bold;">Error: ${error}</div>`;
  const clienteStr = emailSalutation(formAmortizacion.cliente);

  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 650px; line-height: 1.6; text-align: left;">
    <p style="margin-bottom: 20px; color: #333333;">&#128075; {{SALUDO_TIEMPO}},<br>${clienteStr}, presento la simulaci&oacute;n de su abono extraordinario a capital (Sistema Franc&eacute;s):</p>

    <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 25px; border-collapse: collapse;">
      <thead>
        <tr><th colspan="2" style="background-color: #f1f5f9; color: #334155; font-size: 13px; text-transform: uppercase; text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">&#128221; DATOS DEL CR&Eacute;DITO ORIGINAL</th></tr>
      </thead>
      <tbody>
        <tr><td width="60%" style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Precio al Contado</td><td width="40%" align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">$ ${formatCurrency(formAmortizacion.precioContrato)}</td></tr>
        <tr style="background-color: #f8fafc;"><td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Cuota Inicial</td><td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">$ ${formatCurrency(formAmortizacion.cuotaInicial)}</td></tr>
        <tr><td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Capital Financiado</td><td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">$ ${formatCurrency(P)}</td></tr>
        <tr style="background-color: #f8fafc;"><td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Plazo Original</td><td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">${formAmortizacion.plazoOriginal || 0} a&ntilde;os (${n} meses)</td></tr>
        <tr><td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Precio Final a Plazos</td><td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">$ ${formatCurrency(precioFinalPlazos)}</td></tr>
        <tr style="background-color: #f8fafc;"><td style="color: #475569; padding: 10px 12px;">Cuota Mensual Fija (Pura)</td><td align="right" style="color: #0f172a; font-weight: bold; padding: 10px 12px;">$ ${formatCurrency(C_pura)}</td></tr>
      </tbody>
    </table>

    <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 25px; border-collapse: collapse;">
      <thead>
        <tr><th colspan="2" style="background-color: #e2e8f0; color: #1e293b; font-size: 13px; text-transform: uppercase; text-align: left; padding: 10px 12px; border-bottom: 1px solid #cbd5e1;">&#128202; SITUACI&Oacute;N ACTUAL</th></tr>
      </thead>
      <tbody>
        <tr><td width="60%" style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Cuotas Pagadas</td><td width="40%" align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">${formAmortizacion.cuotasPagadas || 0} meses</td></tr>
        <tr style="background-color: #f8fafc;"><td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Cuotas Restantes</td><td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">${cuotasRestantesOrig} meses</td></tr>
        <tr><td style="color: #0f172a; font-weight: bold; padding: 12px;">Saldo Capital Actual</td><td align="right" style="color: #2563eb; font-weight: bold; font-size: 16px; padding: 12px;">$ ${formatCurrency(P_actual)}</td></tr>
      </tbody>
    </table>

    <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #ffffff; border: 1px solid #bbf7d0; border-radius: 4px; margin-bottom: 25px; border-collapse: collapse;">
      <thead>
        <tr><th colspan="2" style="background-color: #d1fae5; color: #065f46; font-size: 14px; text-transform: uppercase; text-align: left; padding: 12px; border-bottom: 1px solid #a7f3d0;">&#128640; IMPACTO DEL ABONO (De $ ${formatCurrency(formAmortizacion.montoAmortizacion)})</th></tr>
      </thead>
      <tbody>
        <tr><td width="60%" style="color: #166534; font-weight: bold; border-bottom: 1px solid #d1fae5; padding: 12px;">Nuevo Saldo Capital</td><td width="40%" align="right" style="color: #065f46; font-weight: bold; font-size: 16px; border-bottom: 1px solid #d1fae5; padding: 12px;">$ ${formatCurrency(saldoNuevo)}</td></tr>
        <tr style="background-color: #f0fdf4;"><td style="color: #166534; font-weight: bold; border-bottom: 1px solid #d1fae5; padding: 12px;">Nuevas Cuotas Restantes</td><td align="right" style="color: #065f46; font-weight: bold; font-size: 16px; border-bottom: 1px solid #d1fae5; padding: 12px;">${n_new} meses</td></tr>
        <tr><td style="color: #15803d; font-weight: bold; border-bottom: 1px solid #d1fae5; padding: 12px;">Tiempo Ahorrado</td><td align="right" style="color: #15803d; font-weight: bold; padding: 12px;">${tiempoAhorrado} meses</td></tr>
        <tr style="background-color: #f0fdf4;"><td style="color: #15803d; font-weight: bold; padding: 12px;">Ahorro Estimado</td><td align="right" style="color: #047857; font-weight: bold; font-size: 16px; padding: 12px;">$ ${formatCurrency(ahorrado)}</td></tr>
      </tbody>
    </table>

    <p style="margin-bottom: 20px; color: #333333;">Si desea proceder con el pago o requiere informaci&oacute;n adicional, quedo a su disposici&oacute;n.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales.</p>
  </div>`;
};

const generarHtmlDescuentoRaw = (formDescuento = {}, calculos = {}) => {
  const {
    vc = 0,
    descuentoTotal = 0,
    descuentoTexto = '',
    nuevoPrecioTotal = 0,
    nuevoPrecioM2 = 0,
    porcentajeCuota = 0,
    tcAplicado = getExchangeRate(),
    plazoTexto = '',
    nuevoPrecioBs = 0,
    tcBase = getExchangeRate(),
    cuotaInicialBs = 0
  } = calculos;

  const nomProyecto = formDescuento.proyecto === 'OTRO...'
    ? (formDescuento.proyectoManual || 'PROYECTO MANUAL')
    : (formDescuento.proyecto || 'PROYECTO');

  const esCredito = formDescuento.modalidad === 'Crédito';
  let condicionTexto = "";

  if (esCredito) {
    condicionTexto = `a crédito con cuota inicial del ${formatCurrency(porcentajeCuota)}% (TC ${formatCurrency(tcBase)} Bs) y descuento vigente de ${descuentoTexto}`;
  } else {
    condicionTexto = `al contado (${plazoTexto || 'Liquidación'}), aplicando ${descuentoTexto} y TC promocional de ${formatCurrency(tcAplicado)} Bs`;
  }

  // Alerta de autorización para cuota inicial al 1.5% (menor al 5% estándar)
  const requiereAutorizacion = esCredito && porcentajeCuota >= 1.5 && porcentajeCuota < 5;
  const badgeHtml = requiereAutorizacion
     ? `<div style="background-color: #fee2e2; color: #991b1b; padding: 10px 14px; border-radius: 6px; font-size: 13px; font-weight: bold; margin-bottom: 15px; border: 1px solid #f87171;">&#9888; REQUIERE AUTORIZACI&Oacute;N: Bajada de Cuota Inicial al 1.5% (Categor&iacute;a Calle)</div>`
     : '';

  // Bloque adicional de detalles financieros de Octubre (Bolivianos y TC)
  const seccionMonedaBsHtml = !esCredito
    ? `
      <tr>
        <td style="padding: 12px 14px; border-bottom: 1px dashed #e2e8f0; font-size: 13px; color: #475569;">Tipo de Cambio Aplicado (TC Hoy)</td>
        <td align="right" style="padding: 12px 14px; border-bottom: 1px dashed #e2e8f0; font-size: 14px; font-weight: bold; color: #0f172a;">${formatCurrency(tcAplicado)} Bs</td>
      </tr>
      <tr>
        <td style="padding: 12px 14px; border-bottom: 1px dashed #e2e8f0; font-size: 13px; color: #475569;">Total al Contado en Bolivianos (Bs)</td>
        <td align="right" style="padding: 12px 14px; border-bottom: 1px dashed #e2e8f0; font-size: 15px; font-weight: bold; color: #047857;">Bs ${formatCurrency(nuevoPrecioBs)}</td>
      </tr>`
    : `
      <tr>
        <td style="padding: 12px 14px; border-bottom: 1px dashed #e2e8f0; font-size: 13px; color: #475569;">TC Cuota Inicial (D&iacute;a de la Venta)</td>
        <td align="right" style="padding: 12px 14px; border-bottom: 1px dashed #e2e8f0; font-size: 14px; font-weight: bold; color: #0f172a;">${formatCurrency(tcBase)} Bs</td>
      </tr>
      <tr>
        <td style="padding: 12px 14px; border-bottom: 1px dashed #e2e8f0; font-size: 13px; color: #475569;">Cuota Inicial en Bolivianos (${formatCurrency(porcentajeCuota)}%)</td>
        <td align="right" style="padding: 12px 14px; border-bottom: 1px dashed #e2e8f0; font-size: 14px; font-weight: bold; color: #2563eb;">Bs ${formatCurrency(cuotaInicialBs)}</td>
      </tr>`;

  // Aclaración oficial de política comercial de Octubre
  const aclaracionOctubreHtml = esCredito
    ? `<div style="background-color: #f1f5f9; border-left: 4px solid #2563eb; padding: 10px 14px; margin-top: 15px; border-radius: 4px; font-size: 11px; color: #334155; line-height: 1.4;">
        <strong>Aclaraci&oacute;n Ventas a Cr&eacute;dito (Octubre):</strong> Todas las ventas a cr&eacute;dito son al TC oficial del d&iacute;a de la venta. La cuota inicial se cancela al TC vigente d&iacute;a de la venta (Bs ${formatCurrency(tcBase)}) y la cuota mes a mes se paga al TC oficial el d&iacute;a del pago de su mensualidad. En ventas nuevas no aplica ning&uacute;n escalonado mensual.
       </div>`
    : `<div style="background-color: #f1f5f9; border-left: 4px solid #059669; padding: 10px 14px; margin-top: 15px; border-radius: 4px; font-size: 11px; color: #334155; line-height: 1.4;">
        <strong>Condici&oacute;n Contado/Liquidaci&oacute;n (Octubre):</strong> Esquema v&aacute;lido seg&uacute;n plazo de pago. TC referencial Bs ${formatCurrency(tcBase)} x US$ 1. Ambos esquemas (contado y crédito) no pueden combinarse.
       </div>`;

  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #1e293b; max-width: 650px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #1e293b;">{{SALUDO_TIEMPO}}</p>
    <p style="margin-top: 0; margin-bottom: 20px; color: #1e293b;">{{NOMBRE_SUPERVISOR}},</p>
    ${badgeHtml}
    <p style="margin-bottom: 20px; color: #1e293b;">Solicito la aplicaci&oacute;n del descuento de la campa&ntilde;a vigente de octubre para el proyecto <strong>${nomProyecto}</strong>. Condici&oacute;n: ${condicionTexto}.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-family: Arial, sans-serif; overflow: hidden; text-align: left;">
      <tr><td style="padding: 15px; border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="color: #334155; font-size: 13px; font-weight: bold; letter-spacing: 1px;">&#128195; RESUMEN DE CAMPAÑA OCTUBRE</td><td align="right"><span style="background-color: #d1fae5; color: #047857; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">ACTIVO</span></td></tr></table>
        </td></tr>
      <tr><td style="padding: 15px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td width="31%" align="center" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
                 <div style="font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase;">Superficie</div>
                 <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 6px;">${formDescuento.m2 || '0'} <span style="font-size: 12px; font-weight: normal; color: #64748b;">m&sup2;</span></div>
              </td><td width="3%"></td>
              <td width="31%" align="center" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
                 <div style="font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase;">Precio M2</div>
                 <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 6px;">$${formatCurrency(formDescuento.precioM2 || 0)}</div>
              </td><td width="3%"></td>
              <td width="32%" align="center" style="background-color: #f4f7ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 12px;">
                 <div style="font-size: 10px; color: #2563eb; font-weight: bold; text-transform: uppercase;">Precio Original</div>
                 <div style="font-size: 16px; font-weight: bold; color: #1d4ed8; margin-top: 6px;">$${formatCurrency(vc)}</div>
              </td>
            </tr></table>
        </td></tr>
      <tr><td style="padding: 0 15px 15px 15px;">
           <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
              <tr><td style="padding: 14px; border-bottom: 1px dashed #e2e8f0; font-size: 13px; color: #475569;">Condici&oacute;n (${nomProyecto})</td>
                 <td align="right" style="padding: 14px; border-bottom: 1px dashed #e2e8f0;"><span style="background-color: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-right: 12px;">${descuentoTexto || '0'}</span><strong style="font-size: 14px; color: #0f172a;">-$${formatCurrency(descuentoTotal)}</strong></td></tr>
              <tr><td style="padding: 14px; border-bottom: 1px dashed #e2e8f0; font-size: 13px; color: #475569;">Total Valor Contrato (VC)</td>
                 <td align="right" style="padding: 14px; border-bottom: 1px dashed #e2e8f0; font-size: 14px; font-weight: bold; color: #0f172a;">$${formatCurrency(vc)}</td></tr>
              <tr><td style="padding: 14px; border-bottom: 1px dashed #e2e8f0; font-size: 13px; color: #475569;">Total Descuento Campa&ntilde;a</td>
                 <td align="right" style="padding: 14px; border-bottom: 1px dashed #e2e8f0; font-size: 14px; font-weight: bold; color: #059669;">-$${formatCurrency(descuentoTotal)}</td></tr>
              <tr><td style="padding: 16px 14px; font-size: 15px; font-weight: bold; color: #0f172a;">Nuevo Precio Promoci&oacute;n ($us)</td>
                 <td align="right" style="padding: 16px 14px; font-size: 18px; font-weight: bold; color: #2563eb;">$${formatCurrency(nuevoPrecioTotal)}</td></tr>
              ${seccionMonedaBsHtml}
           </table>
        </td></tr>
      <tr><td style="padding: 0 15px 15px 15px;">
           <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 8px;">
              <tr><td style="padding: 20px 20px 10px 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;"><span style="color: #cbd5e1;"><font color="#cbd5e1">Precio M2 a Aplicar</font></span></td>
                 <td align="right" style="padding: 20px 20px 10px 20px; font-size: 26px; font-weight: bold;"><span style="color: #34d399;"><font color="#34d399">$${formatCurrency(nuevoPrecioM2)}</font></span></td></tr>
              <tr><td colspan="2" style="padding: 0 20px 20px 20px;">
                    <div style="background-color: #1e293b; padding: 10px; border-radius: 6px; text-align: center; font-size: 11px; font-family: monospace; color: #94a3b8; letter-spacing: 1px;">
                       UV <strong style="color: #ffffff;">${formDescuento.uv || 'SN'}</strong> &nbsp;&bull;&nbsp; MZN <strong style="color: #ffffff;">${formDescuento.manzano || '-'}</strong> &nbsp;&bull;&nbsp; LT <strong style="color: #ffffff;">${formDescuento.lote || '-'}</strong>
                       ${formDescuento.categoria ? `<br><span style="color: #38bdf8; display: inline-block; margin-top: 6px; font-weight: bold;">CATEGORÍA: ${String(formDescuento.categoria).toUpperCase()}</span>` : ''}
                    </div>
                 </td></tr>
           </table>
        </td></tr>
    </table>
    ${aclaracionOctubreHtml}
    <p style="margin-top: 25px; margin-bottom: 5px; color: #1e293b;">Quedo atento a su aprobaci&oacute;n para continuar con el cierre de la venta.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #1e293b;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #0f172a;">${formDescuento.asesor || 'Asesor'}</p>
  </div>`;
};

const generarHtmlRecompraRaw = (formRecompra = {}, beneficio = 0) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 1200px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">{{SALUDO_TIEMPO}}</p>
    <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">{{NOMBRE_SUPERVISOR}}, solicito su apoyo para generar el c&oacute;digo de pago por recompra del siguiente cliente. Fecha de pago de su cuota: <strong>${formRecompra.fechaPago || '[FECHA PAGO]'}</strong>.</p>

    <div style="overflow-x: auto; padding-bottom: 10px; width: 100%; max-width: 100%;">
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; text-align: center; width: 100%; min-width: 1200px; border: 1px solid #000000; background-color: #ffffff;">
        <thead>
          <tr>
            <th colspan="8" style="background-color: #ffc000; border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000"><b>CONTRATO NUEVO</b></font></span></th>
            <th colspan="7" style="background-color: #ed7d31; border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000"><b>CONTRATO ANTIGUO</b></font></span></th>
            <th rowspan="2" style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000"><b>VALOR DE<br>CUOTA $</b></font></span></th>
            <th rowspan="2" style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000"><b>BENEFICIO $</b></font></span></th>
          </tr>
          <tr>
            <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000"><b>Agencia</b></font></span></th>
            <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Fecha de<br>venta</b></font></span></th>
            <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; min-width: 150px;"><span style="color: #000000;"><font color="#000000"><b>Nombre</b></font></span></th>
            <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Contrato</b></font></span></th>
            <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Se aplico<br>descuento<br>por metro ?</b></font></span></th>
            <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Cant. De<br>cuotas ya<br>pagadas</b></font></span></th>
            <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>¿Procesado?</b></font></span></th>
            <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>¿Vigente?</b></font></span></th>
            <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; min-width: 150px;"><span style="color: #000000;"><font color="#000000"><b>Nombre</b></font></span></th>
            <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Contrato</b></font></span></th>
            <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Fecha de<br>venta</b></font></span></th>
            <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Fecha Pago</b></font></span></th>
            <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>¿Procesado?</b></font></span></th>
            <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>¿Vigente?</b></font></span></th>
            <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; min-width: 120px;"><span style="color: #000000;"><font color="#000000"><b>Patrocinador</b></font></span></th>
          </tr>
        </thead>
        <tbody>
          <tr style="background-color: #ffffff;">
            <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase;"><span style="color: #000000;"><font color="#000000">${formRecompra.sucursal || ''}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000">${formRecompra.fechaVentaNuevo || ''}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase;"><span style="color: #000000;"><font color="#000000">${formRecompra.nombreNuevo || ''}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase; white-space: nowrap;"><span style="color: #000000;"><font color="#000000">${formRecompra.contratoNuevo || ''}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.aplicoDescuento || 'NO'}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.cuotasPagadas || '0'}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.procesadoNuevo || 'SI'}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.vigenteNuevo || 'SI'}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase;"><span style="color: #000000;"><font color="#000000">${formRecompra.nombreAntiguo || ''}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase; white-space: nowrap;"><span style="color: #000000;"><font color="#000000">${formRecompra.contratoAntiguo || ''}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000">${formRecompra.fechaVentaAntiguo || ''}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000">${formRecompra.fechaPago || ''}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.procesadoAntiguo || 'SI'}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.vigenteAntiguo || 'SI'}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase;"><span style="color: #000000;"><font color="#000000">${formRecompra.patrocinador || ''}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.valorCuota || ''}</font></span></td>
            <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000"><b>${beneficio}</b></font></span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p style="margin-top: 25px; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formRecompra.asesor || 'Asesor'}</p>
  </div>`;
};

const generarHtmlRenunciaRaw = (formRenuncia = {}) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 20px; color: #333333;">{{SALUDO_TIEMPO}} {{NOMBRE_SUPERVISOR}},</p>
    <p style="margin-bottom: 20px; color: #333333;">Adjunto la carta de renuncia de <strong>${formRenuncia.nombre || '[Nombre]'}</strong>, quien se desempe&ntilde;aba como <strong>${formRenuncia.cargo || 'Asesor de Ventas'}</strong> desde ${formRenuncia.fechaIngreso || '[Fecha]'}.</p>
    <p style="margin-bottom: 20px; color: #333333;">En su nota, con fecha ${formRenuncia.fechaRenuncia || '[Fecha]'}, la persona comunica que su retiro se debe a ${formRenuncia.motivo || '[motivos...]'}. Solicito gestionar el tr&aacute;mite correspondiente en Recursos Humanos con el documento adjunto.</p>
    <p style="margin-bottom: 20px; color: #333333;">Quedo atento a cualquier requerimiento adicional para cerrar este proceso.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formRenuncia.asesor || 'Asesor'}</p>
  </div>`;
};

const generarHtmlAltaCRMRaw = (formAltaCRM = {}) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">{{SALUDO_TIEMPO}}</p>
    <p style="margin-top: 0; margin-bottom: 20px; color: #333333;">{{NOMBRE_SUPERVISOR}},</p>
    <p style="margin-bottom: 20px; color: #333333;">Solicito crear el usuario de acceso a los sistemas <strong>CRM y CESI</strong> para el nuevo asesor comercial que se est&aacute; integrando a mi equipo.</p>
    <p style="margin-bottom: 15px; color: #333333;">A continuaci&oacute;n, detallo los datos personales requeridos:</p>
    <ul style="margin-bottom: 20px; list-style-type: none; padding-left: 0; color: #333333;">
      <li style="margin-bottom: 5px;">Nombre: ${formAltaCRM.nombre || '---'}</li>
      <li style="margin-bottom: 5px;">Apellido Paterno: ${formAltaCRM.apPaterno || '---'}</li>
      <li style="margin-bottom: 5px;">Apellido Materno: ${formAltaCRM.apMaterno || '---'}</li>
      <li style="margin-bottom: 5px;">Carnet de Identidad: ${formAltaCRM.ci || '---'}</li>
      <li style="margin-bottom: 5px;">Fecha de Nacimiento: ${formAltaCRM.fechaNacimiento || '---'}</li>
      <li style="margin-bottom: 5px;">Correo Electr&oacute;nico: ${formAltaCRM.correo || '---'}</li>
    </ul>
    <p style="margin-bottom: 5px; color: #333333;">Agradecer&eacute; confirmar la habilitaci&oacute;n del usuario y el procedimiento de acceso.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formAltaCRM.asesor || 'Asesor'}</p>
  </div>`;
};

const generarHtmlEvaluacionRaw = (formEvaluacion = {}) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">{{SALUDO_TIEMPO}}</p>
    <p style="margin-top: 0; margin-bottom: 20px; color: #333333;">{{NOMBRE_SUPERVISOR}},</p>
    <p style="margin-bottom: 20px; color: #333333;">En respuesta a su correo, adjunto el formulario de evaluaci&oacute;n de desempe&ntilde;o del asesor de Montero al finalizar su programa de aprendizaje.</p>
    <p style="margin-bottom: 10px; color: #333333;"><strong>1. ${formEvaluacion.nombre || '[Nombre Completo]'}</strong></p>
    <ul style="margin-bottom: 20px; padding-left: 20px; color: #333333;">
      <li style="margin-bottom: 10px;"><strong>Punteo Total:</strong> ${formEvaluacion.punteo || '0'} (${formEvaluacion.calificacion || 'Muy Bueno'})</li>
      <li style="margin-bottom: 10px;"><strong>Resultados:</strong> ${formEvaluacion.lotes || '0'} lotes vendidos ($${formEvaluacion.monto || '0'}), ${formEvaluacion.leads || '0'} leads y ${formEvaluacion.visitas || '0'} visitas.</li>
      <li style="margin-bottom: 10px;"><strong>Observaciones y recomendaci&oacute;n:</strong> ${formEvaluacion.observaciones || '[Texto...]'}</li>
    </ul>
    <p style="margin-bottom: 20px; color: #333333;">Quedo a su disposici&oacute;n ante cualquier consulta.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formEvaluacion.asesor || 'Asesor'}</p>
  </div>`;
};

const generarHtmlPostulanteRaw = (formPostulante = {}) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">{{SALUDO_TIEMPO}}</p>
    <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">{{NOMBRE_SUPERVISOR}},</p>
    <p style="margin-bottom: 20px; color: #333333;">Adjunto el formulario de entrevista de <strong>${formPostulante.nombre || '[Nombre]'}</strong> para el puesto de Asesor de Ventas. La postulaci&oacute;n fue referida por ${formPostulante.referidor || '[Nombre]'}.</p>
    <p style="margin-bottom: 20px; color: #333333;">Tras la entrevista y la evaluaci&oacute;n del perfil, recomiendo continuar con la etapa de capacitaci&oacute;n para su incorporaci&oacute;n al equipo comercial de Montero.</p>
    <p style="margin-bottom: 20px; color: #333333;">En el documento adjunto encontrar&aacute; el detalle completo de su experiencia, evaluaci&oacute;n de competencias y la simulaci&oacute;n comercial.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formPostulante.asesor || 'Asesor'}</p>
  </div>`;
};

const generarHtmlCuotaRaw = (formCuota = {}) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">{{SALUDO_TIEMPO}}</p>
    <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">{{NOMBRE_SUPERVISOR}},</p>
    <p style="margin-bottom: 20px; color: #333333;">Solicito su autorizaci&oacute;n para anular del contrato actual del cliente <strong>${formCuota.cliente || '[Nombre del Cliente]'}</strong> y realizar un reingreso. El motivo de esta gesti&oacute;n es que el cliente desea incrementar significativamente su cuota inicial para reducir sus pagos mensuales.</p>
    <p style="margin-bottom: 10px; color: #333333;">A continuaci&oacute;n, detallo los datos de la operaci&oacute;n actual en sistema:</p>
    <ul style="margin-bottom: 20px; list-style-type: none; padding-left: 0; color: #333333;">
      <li style="margin-bottom: 5px;">- <strong>Nro. Contrato:</strong> ${formCuota.nroContrato || '[Nro]'}</li>
      <li style="margin-bottom: 5px;">- <strong>Carnet (CI):</strong> ${formCuota.ci || '[CI]'}</li>
      <li style="margin-bottom: 5px;">- <strong>Ubicaci&oacute;n:</strong> Proyecto ${formCuota.proyecto || '---'} | UV ${formCuota.uv || '[X]'} | MZN ${formCuota.manzano || '[X]'} | LOTE ${formCuota.lote || '[X]'}</li>
    </ul>
    <p style="margin-bottom: 5px; color: #333333;"><strong>Motivos del Reingreso / Observaciones:</strong></p>
    <p style="margin-bottom: 20px; color: #333333;">${formCuota.motivo || '[Detalle el motivo del incremento...]'}</p>
    <p style="margin-bottom: 25px; color: #333333;">Quedo atento a su aprobaci&oacute;n para proceder.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formCuota.asesorVentas || 'Asesor'}</p>
  </div>`;
};

const generarHtmlReenvioRaw = (formReenvio = {}) => {
  let filas = "";
  const listaContratos = Array.isArray(formReenvio.contratos) ? formReenvio.contratos : [];
  listaContratos.forEach(c => {
    filas += `<tr style="background-color: #ffffff;"><td style="border: 1px solid #333333; padding: 6px 8px; font-weight: bold;"><span style="color: #000000;"><font color="#000000">${c.nroContrato || '---'}</font></span></td><td style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000">${c.cliente || '---'}</font></span></td><td style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000">${c.ci || '---'}</font></span></td><td style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000">UV: ${c.uv || 'SN'} - Mzn: ${c.manzano || '-'} - Lote: ${c.lote || '-'}</font></span></td></tr>`;
  });
  const esMultiple = listaContratos.length > 1;
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">{{SALUDO_TIEMPO}}</p>
    <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">{{NOMBRE_SUPERVISOR}},</p>
    <p style="margin-bottom: 20px; color: #333333;">Solicito habilitar nuevamente el env&iacute;o del correo de firma digital de ${esMultiple ? "los siguientes contratos" : "el siguiente contrato"}. Debido a un error involuntario por parte de ${esMultiple ? "los clientes" : "el cliente"}, el proceso no se pudo completar en la primera instancia.</p>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; border: 1px solid #333333; font-family: Arial, sans-serif; font-size: 13px; margin-bottom: 25px; width: 100%; text-align: left; background-color: #ffffff;">
      <thead><tr style="background-color: #f2f2f2;"><th style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000"><b>Nro. Contrato</b></font></span></th><th style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000"><b>Cliente</b></font></span></th><th style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000"><b>Carnet (CI)</b></font></span></th><th style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000"><b>Ubicaci&oacute;n</b></font></span></th></tr></thead>
      <tbody>${filas}</tbody>
    </table>
    <p style="margin-bottom: 25px; color: #333333;">Quedo atento a su confirmaci&oacute;n para proceder con la regularizaci&oacute;n.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formReenvio.asesor || 'Asesor'}</p>
  </div>`;
};

const generarHtmlLlamadaRaw = (formLlamada = {}) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">{{SALUDO_TIEMPO}}</p>
    <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">{{NOMBRE_SUPERVISOR}},</p>
    <p style="margin-bottom: 20px; color: #333333;">Solicito coordinar la llamada de validaci&oacute;n del siguiente cliente referido, quien estar&aacute; disponible hoy a las <strong>${formLlamada.horaLlamada || '[HORA]'}</strong>:</p>

    <p style="margin-bottom: 5px; color: #555555;">Cliente referido:</p>
    <p style="margin-top: 0; margin-bottom: 15px; font-weight: bold; font-size: 15px; color: #000000;">${formLlamada.nombreReferido || '[NOMBRE REFERIDO]'} - Contrato: ${formLlamada.contratoReferido || '[CONTRATO]'} - Celular: ${formLlamada.celularReferido || '[CELULAR]'}</p>

    <p style="margin-bottom: 5px; color: #555555;">Cliente beneficiaria:</p>
    <p style="margin-top: 0; margin-bottom: 25px; font-weight: bold; font-size: 15px; color: #000000;">${formLlamada.nombreBeneficiario || '[NOMBRE BENEFICIARIA]'}, ${formLlamada.ciBeneficiario || '[CI BENEFICIARIA]'}</p>

    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formLlamada.asesor || 'Asesor'}</p>
  </div>`;
};

const generarHtmlSeguroRaw = (formSeguro = {}) => {
  const beneficiarios = Array.isArray(formSeguro.beneficiarios) ? formSeguro.beneficiarios : [];
  const cant = beneficiarios.length;
  let filas = "";
  beneficiarios.forEach(b => {
    filas += `<tr style="background-color: #ffffff;"><td style="border: 1px solid #cbd5e1; padding: 8px 12px; font-weight: bold;"><span style="color: #000000;"><font color="#000000">${b.nombre || '---'}</font></span></td><td style="border: 1px solid #cbd5e1; padding: 8px 12px;"><span style="color: #000000;"><font color="#000000">${b.parentesco || '---'}</font></span></td><td style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: center;"><span style="color: #000000;"><font color="#000000">${b.porcentaje ? b.porcentaje + '%' : '---'}</font></span></td><td style="border: 1px solid #cbd5e1; padding: 8px 12px;"><span style="color: #000000;"><font color="#000000">${b.ci || '---'}</font></span></td></tr>`;
  });

  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">{{SALUDO_TIEMPO}}</p>
    <p style="margin-top: 0; margin-bottom: 20px; color: #333333;">{{NOMBRE_SUPERVISOR}},</p>
    <p style="margin-bottom: 20px; color: #333333;">Solicito incorporar ${cant === 1 ? 'al siguiente beneficiario' : `a los siguientes ${cant} beneficiarios`} al seguro de vida. Detallo los datos a continuaci&oacute;n:</p>

    <p style="margin-bottom: 5px; color: #333333;"><strong>Cliente(s):</strong> ${formSeguro.cliente || '[Nombre del Cliente]'}</p>
    <p style="margin-bottom: 5px; margin-top: 0; color: #333333;"><strong>Nro. Contrato:</strong> ${formSeguro.nroContrato || '[Nro]'}</p>
    <p style="margin-bottom: 20px; margin-top: 0; color: #333333;"><strong>UV:</strong> ${formSeguro.uv || 'SN'} &nbsp;&nbsp;&nbsp;<strong>MZN:</strong> ${formSeguro.manzano || 'SN'} &nbsp;&nbsp;&nbsp;<strong>LOTE:</strong> ${formSeguro.lote || 'SN'}</p>

    <p style="margin-bottom: 10px; font-weight: bold; color: #333333;">Beneficiarios del seguro ${cant} personas:</p>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; border: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 13px; margin-bottom: 25px; width: 100%; text-align: left; background-color: #ffffff;">
      <thead><tr style="background-color: #f8fafc;"><th style="border: 1px solid #cbd5e1; padding: 8px 12px;"><span style="color: #0f172a;"><font color="#0f172a"><b>NOMBRE</b></font></span></th><th style="border: 1px solid #cbd5e1; padding: 8px 12px;"><span style="color: #0f172a;"><font color="#0f172a"><b>PARENTESCO</b></font></span></th><th style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: center;"><span style="color: #0f172a;"><font color="#0f172a"><b>%</b></font></span></th><th style="border: 1px solid #cbd5e1; padding: 8px 12px;"><span style="color: #0f172a;"><font color="#0f172a"><b>CI.</b></font></span></th></tr></thead>
      <tbody>${filas}</tbody>
    </table>

    <p style="margin-bottom: 25px; color: #333333;">Much&iacute;simas gracias de antemano.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formSeguro.asesor || 'Asesor'}</p>
  </div>`;
};

const generarHtmlDiariaRaw = (formDiaria = []) => {
  let filas = "";
  let tVisitas = 0, tVentas = 0, tColocacion = 0;
  const listaDiaria = Array.isArray(formDiaria) ? formDiaria : [];

  listaDiaria.forEach((a, i) => {
    tVisitas += Number(a.visita) || 0;
    tVentas += Number(a.venta) || 0;
    tColocacion += Number(a.colocacion) || 0;

    filas += `
      <tr style="background-color: #ffffff; border-bottom: 1px solid #e2e8f0; color: #334155;">
        <td style="padding: 8px; text-align: center;">${i + 1}</td>
        <td style="padding: 8px; font-weight: bold; text-transform: uppercase; font-size: 11px;">${a.nombre}</td>
        <td style="padding: 8px; text-align: center;">${a.tipo}</td>
        <td style="padding: 8px; text-align: center;">${a.visita || '0'}</td>
        <td style="padding: 8px; text-align: center;">${a.venta || '0'}</td>
        <td style="padding: 8px; text-align: center; font-weight: bold; color: #0f172a;">${formatCurrency(a.colocacion)}</td>
        <td style="padding: 8px; text-transform: uppercase;">${a.hora || ''}</td>
        <td style="padding: 8px; text-transform: uppercase;">${a.medio || ''}</td>
      </tr>
    `;
  });

  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 13px; color: #333333; max-width: 900px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 20px;">{{SALUDO_TIEMPO}} {{NOMBRE_SUPERVISOR}},<br><br>Adjunto el reporte de Proyecci&oacute;n Diaria del equipo correspondiente al d&iacute;a de hoy:</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid #002060; font-family: Arial, sans-serif; font-size: 11px;">
      <thead>
        <tr style="background-color: #002060; color: #ffffff;">
          <th style="padding: 10px; border-right: 1px solid #001540;">Nº</th>
          <th style="padding: 10px; border-right: 1px solid #001540; text-align: left;">Asesor</th>
          <th style="padding: 10px; border-right: 1px solid #001540;">Tipo</th>
          <th style="padding: 10px; border-right: 1px solid #001540;">Visitas</th>
          <th style="padding: 10px; border-right: 1px solid #001540;">Ventas</th>
          <th style="padding: 10px; border-right: 1px solid #001540;">$us Colocación</th>
          <th style="padding: 10px; border-right: 1px solid #001540;">Hora/Proyecto</th>
          <th style="padding: 10px;">Medio</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
        <tr style="background-color: #f8fafc; font-weight: bold; border-top: 2px solid #cbd5e1;">
          <td colspan="3" style="padding: 10px; text-align: right; color: #0f172a;">TOTAL VISITAS</td>
          <td style="padding: 10px; text-align: center; background-color: #ffffff; color: #0f172a;">${tVisitas}</td>
          <td colspan="4"></td>
        </tr>
        <tr style="background-color: #f8fafc; font-weight: bold; border-top: 1px solid #cbd5e1;">
          <td colspan="3" style="padding: 10px; text-align: right; color: #0f172a;">TOTAL VENTAS</td>
          <td style="padding: 10px; text-align: center; background-color: #ffffff; color: #0f172a;">${tVentas}</td>
          <td colspan="4"></td>
        </tr>
        <tr style="background-color: #002060; font-weight: bold; color: #ffffff;">
          <td colspan="3" style="padding: 12px; text-align: right;">TOTAL DÍA $us.</td>
          <td style="padding: 12px; text-align: center; font-size: 14px;">$${formatCurrency(tColocacion)}</td>
          <td colspan="4"></td>
        </tr>
      </tbody>
    </table>
    <p style="margin-top: 25px;">Saludos cordiales.</p>
  </div>`;
};

const generarHtmlProyeccionRaw = (formProyeccion = {}) => {
  let filasAsesoresHtml = "";

  let sumColAct = 0;
  const sumProyA = [0, 0, 0, 0, 0, 0, 0];
  let sumTotalProySemanal = 0;
  let sumTotalColMes = 0;

  const formatCurr = (val) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(val) || 0);
  const fVacio = (val) => val === 0 ? '-' : formatCurr(val);
  const fDias = (val) => val === 0 ? '-' : formatCurr(val);

  const NOMBRES_PROYECTOS_PROYECCION = ["Muyurina", "El Renacer", "Santa Fe", "Rancho Nuevo", "Jardines", "Celina VII F3", "Cañaveral"];

  const formatDiaMesP = (fechaIso, sumarDias = 0) => {
    if (!fechaIso) return `Día ${sumarDias + 1}`;
    const partes = String(fechaIso).split('-');
    if (partes.length !== 3) return `Día ${sumarDias + 1}`;
    const date = new Date(Date.UTC(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]) + sumarDias));
    const dia = date.getUTCDate();
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const mes = meses[date.getUTCMonth()];
    if (!mes) return `Día ${sumarDias + 1}`;
    return `${dia}-${mes}`;
  };

  const listaAsesores = Array.isArray(formProyeccion.asesores) ? formProyeccion.asesores : [];
  listaAsesores.forEach((asesor, i) => {
    const sumDias = asesor.projectionUsd ?? (Array.isArray(asesor.dias) ? asesor.dias.reduce((a, b) => a + (Number(b) || 0), 0) : 0);
    const colActNum = Number(asesor.colAct) || 0;
    const totalColMes = colActNum + sumDias;

    sumColAct += colActNum;
    if (Array.isArray(asesor.proy)) {
      asesor.proy.forEach((val, idx) => {
        if (sumProyA[idx] !== undefined) sumProyA[idx] += (Number(val) || 0);
      });
    }
    sumTotalProySemanal += sumDias;
    sumTotalColMes += totalColMes;

    const isProductivo = false; // La proyección no confirma productividad ni comisiones.
    const rowBgStyle = isProductivo ? 'background-color: #ecfdf5;' : 'background-color: #ffffff;';
    const textColor = isProductivo ? '#059669' : '#0f172a';

    filasAsesoresHtml += `
      <tr style="${rowBgStyle}">
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b;">${i + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: left; color: #0f172a; font-weight: bold; white-space: nowrap;">${String(asesor.nombre || '')}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #334155;">${fVacio(colActNum)}</td>
        ${Array.isArray(asesor.dias) ? asesor.dias.map(d => `<td style="padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 1px solid #f1f5f9; text-align: center; color: #475569;">${fDias(Number(d) || 0)}</td>`).join('') : ''}
        ${Array.isArray(asesor.proy) ? asesor.proy.map(p => `<td style="padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 1px solid #f0f9ff; text-align: center; color: #0369a1; font-weight: bold;">${fDias(Number(p) || 0)}</td>`).join('') : ''}
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 1px solid #e2e8f0; text-align: right; color: #334155; font-weight: bold;">${fVacio(sumDias)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: ${textColor};">${fVacio(totalColMes)}${isProductivo ? ' &#10004;' : ''}</td>
      </tr>
    `;
  });

  const getMesStr = (fechaIso) => {
    if (!fechaIso) return 'Octubre';
    const partes = String(fechaIso).split('-');
    if (partes.length === 3) {
      const dateUtc = new Date(Date.UTC(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2])));
      const m = dateUtc.toLocaleString('es-ES', { month: 'long', timeZone: 'UTC' });
      return m.charAt(0).toUpperCase() + m.slice(1);
    }
    const d = new Date(fechaIso);
    const m = d.toLocaleString('es-ES', { month: 'long' });
    return m.charAt(0).toUpperCase() + m.slice(1);
  };

  const capMes = getMesStr(formProyeccion.fechaInicio);
  const objMensual = Number(formProyeccion.objetivoMensual) || 0;
  const porcentajeAvance = objMensual ? (sumColAct / objMensual) * 100 : 0;
  const porcentajeFin = objMensual ? (sumTotalColMes / objMensual) * 100 : 0;

  return `
  <div style="background-color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #334155; line-height: 1.6; max-width: 1200px; text-align: left;">
    <p style="color: #0f172a; font-size: 16px;"><b>{{SALUDO_TIEMPO}} {{NOMBRE_SUPERVISOR}},</b></p>
    <p style="color: #334155;">Adjunto el consolidado de proyecci&oacute;n de ventas semanal del equipo. A continuaci&oacute;n el detalle de referencia en dólares americanos (USD). La distribución por día y por asesor/proyecto está pendiente; las proyecciones no representan ventas cerradas:</p>

    <div style="overflow-x: auto; width: 100%; max-width: 100%;">
    <table border="0" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; margin-top: 15px; width: 100%; min-width: 900px; text-align: left; background-color: #ffffff; border: 1px solid #e2e8f0;">
      <thead>
        <tr>
          <th colspan="3" style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 10px; text-align: left; color: #0f172a; font-size: 13px;"><b>Equipo: ${String(formProyeccion.equipo || '')}</b></th>
          <th colspan="7" style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; border-left: 1px solid #e2e8f0; padding: 10px; text-align: center; color: #334155; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;"><b>Proyección diaria (USD)</b></th>
          <th colspan="7" style="background-color: #eff6ff; border-bottom: 2px solid #bae6fd; border-left: 1px solid #e2e8f0; padding: 10px; text-align: center; color: #0369a1; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;"><b>Proyectos</b></th>
          <th rowspan="2" style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; border-left: 1px solid #e2e8f0; padding: 10px; text-align: right; color: #334155; vertical-align: bottom;"><b>Total<br>Proy. Semanal</b></th>
          <th rowspan="2" style="background-color: #f0fdf4; border-bottom: 2px solid #6ee7b7; border-left: 1px solid #e2e8f0; padding: 10px; text-align: right; color: #065f46; vertical-align: bottom;"><b>Cierre Mes<br>(USD)</b></th>
        </tr>
        <tr>
          <th style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 8px; color: #64748b; width: 30px; text-align: center;">#</th>
          <th style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 8px; text-align: left; color: #475569; white-space: nowrap;"><b>Asesor</b></th>
          <th style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 8px; text-align: right; color: #475569; white-space: nowrap;"><b>Coloc. Actual</b></th>
          ${[0, 1, 2, 3, 4, 5, 6].map(d => `<th style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; border-left: 1px solid #e2e8f0; padding: 8px; text-align: center; color: #64748b; white-space: nowrap;">${formatDiaMesP(formProyeccion.fechaInicio, d)}</th>`).join('')}
          ${NOMBRES_PROYECTOS_PROYECCION.map(p => `<th style="background-color: #eff6ff; border-bottom: 2px solid #bae6fd; border-left: 1px solid #e2e8f0; padding: 8px; text-align: center; color: #0284c7; white-space: nowrap;">${String(p)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${filasAsesoresHtml}
        <tr style="background-color: #f8fafc;">
          <td colspan="3" style="padding: 10px 8px; text-align: right; color: #0f172a; border-top: 2px solid #cbd5e1;"><b>TOTALES GLOBALES</b></td>
          <td colspan="7" style="padding: 10px 8px; border-top: 2px solid #cbd5e1;"></td>
          ${sumProyA.map(p => `<td style="padding: 10px 8px; text-align: center; color: #0284c7; border-top: 2px solid #bae6fd; font-weight: bold;">${p === 0 ? '-' : p}</td>`).join('')}
          <td style="padding: 10px 8px; text-align: right; color: #0f172a; border-top: 2px solid #cbd5e1;"><b>${formatCurr(sumTotalProySemanal)}</b></td>
          <td style="padding: 10px 8px; text-align: right; color: #059669; border-top: 2px solid #6ee7b7; background-color: #d1fae5; font-size: 14px;"><b>USD ${formatCurr(sumTotalColMes)}</b></td>
        </tr>
      </tbody>
    </table>
    </div>

    <table border="0" cellpadding="0" cellspacing="0" style="margin-top: 25px; width: 100%; max-width: 450px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
      <tr>
        <td colspan="2" style="background-color: #0f172a; color: #ffffff; padding: 12px 16px; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
          <span style="color: #ffffff;"><font color="#ffffff">Resumen General - ${capMes}</font></span>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #475569; font-size: 13px; border-bottom: 1px solid #f1f5f9;"><b>Objetivo del Mes</b></td>
        <td style="padding: 12px 16px; text-align: right; color: #0f172a; font-size: 14px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">USD ${formatCurr(objMensual)}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #475569; font-size: 13px; border-bottom: 1px solid #f1f5f9;"><b>Colocaci&oacute;n Actual</b></td>
        <td style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #f1f5f9;">
          <span style="color: #0f172a; font-size: 14px; font-weight: bold;">USD ${formatCurr(sumColAct)}</span>
          <span style="display: inline-block; background-color: #f1f5f9; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-left: 8px; font-weight: bold;">${formatCurr(porcentajeAvance)}%</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; color: #0f172a; font-size: 14px;"><b>Proyecci&oacute;n Cierre de Mes</b></td>
        <td style="padding: 14px 16px; text-align: right;">
          <span style="color: #059669; font-size: 16px; font-weight: bold;">USD ${formatCurr(sumTotalColMes)}</span>
          <span style="display: inline-block; background-color: #d1fae5; color: #065f46; padding: 3px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px; font-weight: bold;">${formatCurr(porcentajeFin)}%</span>
        </td>
      </tr>
    </table>
    <p style="margin-top: 25px; margin-bottom: 2px; color: #475569;">Saludos cordiales.</p>
  </div>`;
};

const generarHtmlPendienteValidacionRaw = (form = {}) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 20px; color: #333333;">{{SALUDO_TIEMPO}} {{NOMBRE_SUPERVISOR}},</p>
    <p style="margin-bottom: 20px; color: #333333;">Solicito coordinar la llamada de validaci&oacute;n del siguiente cliente, quien estar&aacute; disponible hoy a las <strong>${form.horaLlamada || '[Hora]'}</strong>:</p>
    <p style="margin-bottom: 5px; color: #333333;">Cliente sin validaci&oacute;n:</p>
    <p style="margin-top: 0; margin-bottom: 25px; font-weight: bold; font-size: 15px; color: #000000; text-transform: uppercase;">${form.cliente || '[NOMBRE]'} - Contrato: ${form.contrato || '[CONTRATO]'} - Celular: ${form.celular || '[CELULAR]'}</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${form.asesor || 'Asesor'}</p>
  </div>`;
};

const generarHtmlBloqueoLoteRaw = (form = {}) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 20px; color: #333333;">{{SALUDO_TIEMPO}} {{NOMBRE_SUPERVISOR}},</p>
    <p style="margin-bottom: 20px; color: #333333;">Solicito su autorizaci&oacute;n para realizar el <strong>bloqueo del lote</strong> ubicado en el <strong>Proyecto ${form.proyecto || '[Proyecto]'}</strong>:</p>
    <ul style="margin-bottom: 20px; list-style-type: none; padding-left: 0; color: #333333;">
      <li style="margin-bottom: 5px;"><strong>Proyecto:</strong> ${form.proyecto || '---'}</li>
      <li style="margin-bottom: 5px;"><strong>UV:</strong> ${form.uv || '---'} <strong>Manzano:</strong> ${form.manzano || '---'} <strong>Lote:</strong> ${form.lote || '---'}</li>
      <li style="margin-bottom: 5px;"><strong>Superficie:</strong> ${form.superficie || '0'} m&sup2;</li>
      <li style="margin-bottom: 5px;"><strong>Categor&iacute;a:</strong> ${form.categoria || '---'}</li>
      <li style="margin-bottom: 5px;"><strong>Cuota inicial referencial:</strong> $us ${form.cuotaInicial || '0'}</li>
    </ul>
    <p style="margin-bottom: 20px; color: #333333;">${form.motivo || '[Motivo del bloqueo]'}</p>
    <p style="margin-bottom: 20px; color: #333333;">El bloqueo permitirá resguardar la disponibilidad y evitar cruces comerciales.</p>
    <p style="margin-bottom: 20px; color: #333333;">Quedo atento a su confirmaci&oacute;n.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${form.asesor || 'Asesor'}</p>
  </div>`;
};

const generarHtmlMemorandumRaw = (form = {}) => {
  let asesoresHtml = "";
  const listaAsesores = Array.isArray(form.asesores) ? form.asesores : [];
  listaAsesores.forEach(a => {
    if (a.nombre) {
      asesoresHtml += `<li style="margin-bottom: 10px;"><strong>${a.nombre}:</strong> Registra una colocaci&oacute;n actual de <strong>${a.colocacion}</strong>, frente a su compromiso de <strong>${a.compromiso}</strong>.</li>`;
    }
  });
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 20px; color: #333333;">{{SALUDO_TIEMPO}} {{NOMBRE_SUPERVISOR}},</p>
    <p style="margin-bottom: 20px; color: #333333;">Solicito formalmente la emisi&oacute;n de un <strong>memor&aacute;ndum de llamada de atenci&oacute;n</strong> para los asesores de mi equipo comercial detallados abajo. El motivo de esta solicitud es el incumplimiento reiterado de sus m&eacute;tricas de ventas, seg&uacute;n los resultados y compromisos detallados a continuaci&oacute;n.</p>
    <p style="margin-bottom: 15px; color: #333333;">De acuerdo con el cierre de proyecciones y resultados del mes de <strong>${form.mes || '[Mes]'}</strong>, el detalle de su rendimiento es el siguiente:</p>
    <ul style="margin-bottom: 20px; color: #333333;">${asesoresHtml}</ul>
    <p style="margin-bottom: 20px; color: #333333;">Adjunto a este correo el cuadro de proyecci&oacute;n y seguimiento de metas de ${form.mes || '[Mes]'} como respaldo documental, para su revisi&oacute;n.</p>
    <p style="margin-bottom: 20px; color: #333333;">Agradezco su apoyo para gestionar estas llamadas de atenci&oacute;n a la brevedad, con el fin de dejar constancia formal en sus expedientes y proceder con las medidas de seguimiento correspondientes.</p>
    <p style="margin-bottom: 20px; color: #333333;">Quedo a su disposici&oacute;n para ampliar la informaci&oacute;n.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${form.asesor || 'Asesor'}</p>
  </div>`;
};

// Todos los valores dinámicos se insertan como texto, nunca como marcado HTML.
export const generarHtmlFisico = (...args) => generarHtmlFisicoRaw(...args.map(escapeTemplateData));
export const generarHtmlAmortizacion = (...args) => generarHtmlAmortizacionRaw(...args.map(escapeTemplateData));
export const generarHtmlDescuento = (...args) => generarHtmlDescuentoRaw(...args.map(escapeTemplateData));
export const generarHtmlRecompra = (...args) => generarHtmlRecompraRaw(...args.map(escapeTemplateData));
export const generarHtmlRenuncia = (...args) => generarHtmlRenunciaRaw(...args.map(escapeTemplateData));
export const generarHtmlAltaCRM = (...args) => generarHtmlAltaCRMRaw(...args.map(escapeTemplateData));
export const generarHtmlEvaluacion = (...args) => generarHtmlEvaluacionRaw(...args.map(escapeTemplateData));
export const generarHtmlPostulante = (...args) => generarHtmlPostulanteRaw(...args.map(escapeTemplateData));
export const generarHtmlCuota = (...args) => generarHtmlCuotaRaw(...args.map(escapeTemplateData));
export const generarHtmlReenvio = (...args) => generarHtmlReenvioRaw(...args.map(escapeTemplateData));
export const generarHtmlLlamada = (...args) => generarHtmlLlamadaRaw(...args.map(escapeTemplateData));
export const generarHtmlSeguro = (...args) => generarHtmlSeguroRaw(...args.map(escapeTemplateData));
export const generarHtmlDiaria = (...args) => generarHtmlDiariaRaw(...args.map(escapeTemplateData));
export const generarHtmlProyeccion = (...args) => generarHtmlProyeccionRaw(...args.map(escapeTemplateData));
export const generarHtmlPendienteValidacion = (...args) => generarHtmlPendienteValidacionRaw(...args.map(escapeTemplateData));
export const generarHtmlBloqueoLote = (...args) => generarHtmlBloqueoLoteRaw(...args.map(escapeTemplateData));
export const generarHtmlMemorandum = (...args) => generarHtmlMemorandumRaw(...args.map(escapeTemplateData));
