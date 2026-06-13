import { formatCurrency, formatDiaMes, obtenerSaludoTiempo } from './formatters';

export const generarHtmlFisico = (formFisico, supervisorData) => {
  const { saludo, titulo } = supervisorData;
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
    <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">${saludo} ${titulo},</p>
    <p style="margin-bottom: 20px; color: #333333;">Por medio de la presente, solicito el cambio de contrato digital a f&iacute;sico para el siguiente cliente:</p>
    <ul style="margin-bottom: 20px; list-style-type: none; padding-left: 0; color: #333333;">
      <li style="margin-bottom: 5px;">- <strong>Nombre del Cliente:</strong> ${formFisico.nombre || '[Nombre]'}</li>
      <li style="margin-bottom: 5px;">- <strong>N&uacute;mero de Carnet (CI):</strong> ${formFisico.ci || '[CI]'}</li>
      <li style="margin-bottom: 5px;">- <strong>N&uacute;mero de Contrato:</strong> ${formFisico.contrato || '[Nro Contrato]'}</li>
    </ul>
    <p style="margin-bottom: 5px; color: #333333;"><strong>Motivo de la solicitud:</strong></p>
    <p style="margin-bottom: 20px; color: #333333;">${formFisico.motivo || '[Describa el motivo...]'}</p>
    <p style="margin-bottom: 25px; color: #333333;">Quedo atento a la confirmaci&oacute;n.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formFisico.asesor || '[Nombre del Asesor]'}</p>
  </div>`;
};

export const generarHtmlAmortizacion = (formAmortizacion, calculos) => {
  const { P, C_pura, n, S, C_total, precioFinalPlazos, P_actual, cuotasRestantesOrig, saldoNuevo, n_new, tiempoAhorrado, ahorrado, error } = calculos;
  
  if (error) return `<div style="color:red; font-weight:bold;">Error: ${error}</div>`;

  const clienteStr = formAmortizacion.cliente ? `Estimado/a <strong>${formAmortizacion.cliente}</strong>` : 'Estimado/a cliente';

  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 650px; line-height: 1.6; text-align: left;">
    <p style="margin-bottom: 20px; color: #333333;">&#128075; ${obtenerSaludoTiempo()},<br>${clienteStr}, te presento la simulaci&oacute;n de tu abono extraordinario a capital (Sistema Franc&eacute;s):</p>
    
    <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 25px; border-collapse: collapse;">
      <thead>
        <tr>
          <th colspan="2" style="background-color: #f1f5f9; color: #334155; font-size: 13px; text-transform: uppercase; text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">&#128221; DATOS DEL CR&Eacute;DITO ORIGINAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td width="60%" style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Precio al Contado</td>
          <td width="40%" align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">$ ${formatCurrency(formAmortizacion.precioContrato)}</td>
        </tr>
        <tr style="background-color: #f8fafc;">
          <td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Cuota Inicial</td>
          <td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">$ ${formatCurrency(formAmortizacion.cuotaInicial)}</td>
        </tr>
        <tr>
          <td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Capital Financiado</td>
          <td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">$ ${formatCurrency(P)}</td>
        </tr>
        <tr style="background-color: #f8fafc;">
          <td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Plazo Original</td>
          <td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">${formAmortizacion.plazoOriginal || 0} a&ntilde;os (${n} meses)</td>
        </tr>
        <tr>
          <td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Precio Final a Plazos</td>
          <td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">$ ${formatCurrency(precioFinalPlazos)}</td>
        </tr>
        <tr style="background-color: #f8fafc;">
          <td style="color: #475569; padding: 10px 12px;">Cuota Mensual Fija (Pura)</td>
          <td align="right" style="color: #0f172a; font-weight: bold; padding: 10px 12px;">$ ${formatCurrency(C_pura)}</td>
        </tr>
      </tbody>
    </table>

    <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 25px; border-collapse: collapse;">
      <thead>
        <tr>
          <th colspan="2" style="background-color: #e2e8f0; color: #1e293b; font-size: 13px; text-transform: uppercase; text-align: left; padding: 10px 12px; border-bottom: 1px solid #cbd5e1;">&#128202; SITUACI&Oacute;N ACTUAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td width="60%" style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Cuotas Pagadas</td>
          <td width="40%" align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">${formAmortizacion.cuotasPagadas || 0} meses</td>
        </tr>
        <tr style="background-color: #f8fafc;">
          <td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Cuotas Restantes</td>
          <td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">${cuotasRestantesOrig} meses</td>
        </tr>
        <tr>
          <td style="color: #0f172a; font-weight: bold; padding: 12px;">Saldo Capital Actual</td>
          <td align="right" style="color: #2563eb; font-weight: bold; font-size: 16px; padding: 12px;">$ ${formatCurrency(P_actual)}</td>
        </tr>
      </tbody>
    </table>

    <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #ffffff; border: 1px solid #bbf7d0; border-radius: 4px; margin-bottom: 25px; border-collapse: collapse;">
      <thead>
        <tr>
          <th colspan="2" style="background-color: #d1fae5; color: #065f46; font-size: 14px; text-transform: uppercase; text-align: left; padding: 12px; border-bottom: 1px solid #a7f3d0;">&#128640; IMPACTO DE TU ABONO (De $ ${formatCurrency(formAmortizacion.montoAmortizacion)})</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td width="60%" style="color: #166534; font-weight: bold; border-bottom: 1px solid #d1fae5; padding: 12px;">Nuevo Saldo Capital</td>
          <td width="40%" align="right" style="color: #065f46; font-weight: bold; font-size: 16px; border-bottom: 1px solid #d1fae5; padding: 12px;">$ ${formatCurrency(saldoNuevo)}</td>
        </tr>
        <tr style="background-color: #f0fdf4;">
          <td style="color: #166534; font-weight: bold; border-bottom: 1px solid #d1fae5; padding: 12px;">Nuevas Cuotas Restantes</td>
          <td align="right" style="color: #065f46; font-weight: bold; font-size: 16px; border-bottom: 1px solid #d1fae5; padding: 12px;">${n_new} meses</td>
        </tr>
        <tr>
          <td style="color: #15803d; font-weight: bold; border-bottom: 1px solid #d1fae5; padding: 12px;">Tiempo Ahorrado</td>
          <td align="right" style="color: #15803d; font-weight: bold; padding: 12px;">${tiempoAhorrado} meses</td>
        </tr>
        <tr style="background-color: #f0fdf4;">
          <td style="color: #15803d; font-weight: bold; padding: 12px;">Ahorro Estimado</td>
          <td align="right" style="color: #047857; font-weight: bold; font-size: 16px; padding: 12px;">$ ${formatCurrency(ahorrado)}</td>
        </tr>
      </tbody>
    </table>

    <p style="margin-bottom: 20px; color: #333333;">Si deseas proceder con este pago o tienes alguna duda, quedo a tu disposici&oacute;n.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales.</p>
  </div>`;
};
