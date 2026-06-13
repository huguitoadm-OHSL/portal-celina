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
export const generarHtmlDescuento = (formDescuento, calculos, supervisorData) => {
  const { vc, descuentoTotal, descuentoTexto, nuevoPrecioTotal, nuevoPrecioM2, porcentajeCuota } = calculos;
  const { saludo, titulo } = supervisorData;
  const nomProyecto = formDescuento.proyecto === 'OTRO...' ? (formDescuento.proyectoManual || 'PROYECTO MANUAL') : formDescuento.proyecto;
  let condicionTexto = formDescuento.modalidad === 'Crédito' ? `con cuota inicial del ${formatCurrency(porcentajeCuota)}% venta a plazos` : `venta al contado`;

  const requiereAutorizacion = formDescuento.modalidad === 'Crédito' && porcentajeCuota >= 1.5 && porcentajeCuota < 5;
  const badgeHtml = requiereAutorizacion 
     ? `<div style="background-color: #fee2e2; color: #991b1b; padding: 10px 14px; border-radius: 6px; font-size: 13px; font-weight: bold; margin-bottom: 15px; border: 1px solid #f87171;">&#9888; REQUIERE AUTORIZACI&Oacute;N: Bajada de Cuota Inicial al 1.5% (Categor&iacute;a Calle)</div>` 
     : '';

  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #1e293b; max-width: 650px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #1e293b;">${obtenerSaludoTiempo()}</p>
    <p style="margin-top: 0; margin-bottom: 20px; color: #1e293b;">${saludo} ${titulo},</p>
    ${badgeHtml}
    <p style="margin-bottom: 20px; color: #1e293b;">Por favor le solicito mediante el presente correo, la aplicaci&oacute;n del descuento correspondiente a la campa&ntilde;a vigente del proyecto ${nomProyecto}: ${descuentoTexto} ${condicionTexto}:</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-family: Arial, sans-serif; overflow: hidden; text-align: left;">
      <tr><td style="padding: 15px; border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="color: #334155; font-size: 13px; font-weight: bold; letter-spacing: 1px;">&#128195; RESUMEN DE DESCUENTOS</td><td align="right"><span style="background-color: #d1fae5; color: #047857; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">ACTIVO</span></td></tr></table>
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
              <tr><td style="padding: 14px; border-bottom: 1px dashed #e2e8f0; font-size: 13px; color: #475569;">Total Descuento Campa&ntilde;as</td>
                 <td align="right" style="padding: 14px; border-bottom: 1px dashed #e2e8f0; font-size: 14px; font-weight: bold; color: #059669;">-$${formatCurrency(descuentoTotal)}</td></tr>
              <tr><td style="padding: 18px 14px; font-size: 15px; font-weight: bold; color: #0f172a;">Nuevo Precio Promoci&oacute;n</td>
                 <td align="right" style="padding: 18px 14px; font-size: 18px; font-weight: bold; color: #2563eb;">$${formatCurrency(nuevoPrecioTotal)}</td></tr>
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
    <p style="margin-top: 25px; margin-bottom: 5px; color: #1e293b;">Quedo atento a su aprobaci&oacute;n para continuar con el proceso del cierre de la venta.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #1e293b;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #0f172a;">${formDescuento.asesor || '[Nombre del Asesor]'}</p>
  </div>`;
};
export const generarHtmlRecompra = (formRecompra, supervisorData, beneficio) => {
  const { saludo, nombrePila } = supervisorData;
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 1200px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()},</p>
    <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">${saludo} ${nombrePila} por favor su ayuda con el c&oacute;digo de pago por recompra de este cliente, le toca pagar su cuota el <strong>${formRecompra.fechaPago || '[FECHA PAGO]'}</strong> muchas gracias de antemano:</p>
    
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
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formRecompra.asesor || '[Nombre del Asesor]'}</p>
  </div>`;
};
export const generarHtmlRenuncia = (formRenuncia) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 20px; color: #333333;">${obtenerSaludoTiempo()} estimado Ulrich,</p>
    <p style="margin-bottom: 20px; color: #333333;">Por medio del presente, te hago entrega formal de la carta de renuncia de la Sra./Sr. <strong>${formRenuncia.nombre || '[Nombre]'}</strong>, quien se desempe&ntilde;aba como <strong>${formRenuncia.cargo || 'Asesor de Ventas'}</strong> desde el pasado ${formRenuncia.fechaIngreso || '[Fecha]'}.</p>
    <p style="margin-bottom: 20px; color: #333333;">En su nota, con fecha ${formRenuncia.fechaRenuncia || '[Fecha]'}, la/el asesor/a comunica que su retiro se debe a ${formRenuncia.motivo || '[motivos...]'}. Adjunto el documento escaneado para que se proceda con el tr&aacute;mite correspondiente en el departamento de Recursos Humanos.</p>
    <p style="margin-bottom: 20px; color: #333333;">Quedo atento a cualquier requerimiento adicional para cerrar este proceso.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formRenuncia.asesor || 'Oscar Saravia'}</p>
  </div>`;
};

export const generarHtmlAltaCRM = (formAltaCRM) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
    <p style="margin-top: 0; margin-bottom: 20px; color: #333333;">Estimado Ulrich,</p>
    <p style="margin-bottom: 20px; color: #333333;">Por medio de la presente, solicito por favor la gesti&oacute;n para la creaci&oacute;n del usuario de acceso a los sistemas <strong>CRM y CESI</strong> para el nuevo asesor comercial que se est&aacute; integrando a mi equipo.</p>
    <p style="margin-bottom: 15px; color: #333333;">A continuaci&oacute;n, detallo los datos personales requeridos:</p>
    <ul style="margin-bottom: 20px; list-style-type: none; padding-left: 0; color: #333333;">
      <li style="margin-bottom: 5px;">Nombre: ${formAltaCRM.nombre || '---'}</li>
      <li style="margin-bottom: 5px;">Apellido Paterno: ${formAltaCRM.apPaterno || '---'}</li>
      <li style="margin-bottom: 5px;">Apellido Materno: ${formAltaCRM.apMaterno || '---'}</li>
      <li style="margin-bottom: 5px;">Carnet de Identidad: ${formAltaCRM.ci || '---'}</li>
      <li style="margin-bottom: 5px;">Fecha de Nacimiento: ${formAltaCRM.fechaNacimiento || '---'}</li>
      <li style="margin-bottom: 5px;">Correo Electr&oacute;nico: ${formAltaCRM.correo || '---'}</li>
    </ul>
    <p style="margin-bottom: 5px; color: #333333;">Quedo atento a la confirmaci&oacute;n de las credenciales para poder facilitarle el acceso.</p>
    <p style="margin-bottom: 20px; color: #333333;">De antemano, muchas gracias por tu colaboraci&oacute;n.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formAltaCRM.asesor || 'Oscar Saravia'}</p>
  </div>`;
};

export const generarHtmlEvaluacion = (formEvaluacion) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}.</p>
    <p style="margin-top: 0; margin-bottom: 20px; color: #333333;">Estimado Ulrich,</p>
    <p style="margin-bottom: 20px; color: #333333;">En respuesta a tu correo, adjunto el formulario de evaluaci&oacute;n de desempe&ntilde;o debidamente completado del asesor de la sucursal Montero que acaba de finalizar su programa de aprendizaje.</p>
    <p style="margin-bottom: 10px; color: #333333;"><strong>1. ${formEvaluacion.nombre || '[Nombre Completo]'}</strong></p>
    <ul style="margin-bottom: 20px; padding-left: 20px; color: #333333;">
      <li style="margin-bottom: 10px;"><strong>Punteo Total:</strong> ${formEvaluacion.punteo || '0'} (${formEvaluacion.calificacion || 'Muy Bueno'})</li>
      <li style="margin-bottom: 10px;"><strong>Resultados:</strong> ${formEvaluacion.lotes || '0'} lotes vendidos ($${formEvaluacion.monto || '0'}), ${formEvaluacion.leads || '0'} leads y ${formEvaluacion.visitas || '0'} visitas.</li>
      <li style="margin-bottom: 10px;"><strong>Observaciones y recomendaci&oacute;n:</strong> ${formEvaluacion.observaciones || '[Texto...]'}</li>
    </ul>
    <p style="margin-bottom: 20px; color: #333333;">Quedo a su disposici&oacute;n ante cualquier consulta.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formEvaluacion.asesor || 'Oscar Saravia'}</p>
  </div>`;
};

export const generarHtmlPostulante = (formPostulante) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
    <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">Estimado Ulrich,</p>
    <p style="margin-bottom: 20px; color: #333333;">Te adjunto el formulario de entrevista de <strong>${formPostulante.nombre || '[Nombre]'}</strong> para el puesto de Asesor de Ventas. &Eacute;l llega a nosotros como referido de la asesora ${formPostulante.referidor || '[Nombre]'}.</p>
    <p style="margin-bottom: 20px; color: #333333;">Despu&eacute;s de realizarle la entrevista y evaluar su perfil, mi recomendaci&oacute;n es que proceda a la etapa de capacitaci&oacute;n para que se integre a la M&aacute;quina de Ventas en Montero.</p>
    <p style="margin-bottom: 20px; color: #333333;">En el documento adjunto podr&aacute;s ver el detalle completo de su experiencia, evaluaci&oacute;n de competencias y el role play.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formPostulante.asesor || 'Oscar Saravia'}</p>
  </div>`;
};
