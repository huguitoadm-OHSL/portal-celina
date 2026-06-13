import { formatCurrency, obtenerSaludoTiempo } from './formatters';

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
        <tr><th colspan="2" style="background-color: #d1fae5; color: #065f46; font-size: 14px; text-transform: uppercase; text-align: left; padding: 12px; border-bottom: 1px solid #a7f3d0;">&#128640; IMPACTO DE TU ABONO (De $ ${formatCurrency(formAmortizacion.montoAmortizacion)})</th></tr>
      </thead>
      <tbody>
        <tr><td width="60%" style="color: #166534; font-weight: bold; border-bottom: 1px solid #d1fae5; padding: 12px;">Nuevo Saldo Capital</td><td width="40%" align="right" style="color: #065f46; font-weight: bold; font-size: 16px; border-bottom: 1px solid #d1fae5; padding: 12px;">$ ${formatCurrency(saldoNuevo)}</td></tr>
        <tr style="background-color: #f0fdf4;"><td style="color: #166534; font-weight: bold; border-bottom: 1px solid #d1fae5; padding: 12px;">Nuevas Cuotas Restantes</td><td align="right" style="color: #065f46; font-weight: bold; font-size: 16px; border-bottom: 1px solid #d1fae5; padding: 12px;">${n_new} meses</td></tr>
        <tr><td style="color: #15803d; font-weight: bold; border-bottom: 1px solid #d1fae5; padding: 12px;">Tiempo Ahorrado</td><td align="right" style="color: #15803d; font-weight: bold; padding: 12px;">${tiempoAhorrado} meses</td></tr>
        <tr style="background-color: #f0fdf4;"><td style="color: #15803d; font-weight: bold; padding: 12px;">Ahorro Estimado</td><td align="right" style="color: #047857; font-weight: bold; font-size: 16px; padding: 12px;">$ ${formatCurrency(ahorrado)}</td></tr>
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

export const generarHtmlCuota = (formCuota, supervisorData) => {
  const { saludo, titulo } = supervisorData;
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
    <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">${saludo} ${titulo},</p>
    <p style="margin-bottom: 20px; color: #333333;">Por favor su autorizaci&oacute;n para proceder con la anulaci&oacute;n del contrato actual del cliente <strong>${formCuota.cliente || '[Nombre del Cliente]'}</strong> y realizar un reingreso. El motivo de esta gesti&oacute;n es que el cliente desea incrementar significativamente su cuota inicial para reducir sus pagos mensuales.</p>
    <p style="margin-bottom: 10px; color: #333333;">A continuaci&oacute;n, detallo los datos de la operaci&oacute;n actual en sistema:</p>
    <ul style="margin-bottom: 20px; list-style-type: none; padding-left: 0; color: #333333;">
      <li style="margin-bottom: 5px;">- <strong>Nro. Contrato:</strong> ${formCuota.nroContrato || '[Nro]'}</li>
      <li style="margin-bottom: 5px;">- <strong>Carnet (CI):</strong> ${formCuota.ci || '[CI]'}</li>
      <li style="margin-bottom: 5px;">- <strong>Ubicaci&oacute;n:</strong> Proyecto ${formCuota.proyecto} | UV ${formCuota.uv || '[X]'} | MZN ${formCuota.manzano || '[X]'} | LOTE ${formCuota.lote || '[X]'}</li>
    </ul>
    <p style="margin-bottom: 5px; color: #333333;"><strong>Motivos del Reingreso / Observaciones:</strong></p>
    <p style="margin-bottom: 20px; color: #333333;">${formCuota.motivo || '[Detalle el motivo del incremento...]'}</p>
    <p style="margin-bottom: 25px; color: #333333;">Quedo atento a su aprobaci&oacute;n para proceder.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formCuota.asesorVentas || '[Nombre del Asesor]'}</p>
  </div>`;
};

export const generarHtmlReenvio = (formReenvio, supervisorData) => {
  const { saludo, nombrePila } = supervisorData;
  let filas = "";
  formReenvio.contratos.forEach(c => {
    filas += `<tr style="background-color: #ffffff;"><td style="border: 1px solid #333333; padding: 6px 8px; font-weight: bold;"><span style="color: #000000;"><font color="#000000">${c.nroContrato || '---'}</font></span></td><td style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000">${c.cliente || '---'}</font></span></td><td style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000">${c.ci || '---'}</font></span></td><td style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000">UV: ${c.uv || 'SN'} - Mzn: ${c.manzano || '-'} - Lote: ${c.lote || '-'}</font></span></td></tr>`;
  });
  const esMultiple = formReenvio.contratos.length > 1;
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
    <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">${saludo} ${nombrePila},</p>
    <p style="margin-bottom: 20px; color: #333333;">Te escribo para solicitar tu apoyo habilitando nuevamente el env&iacute;o del correo para la firma digital de ${esMultiple ? "los siguientes contratos" : "el siguiente contrato"}. Debido a un error involuntario por parte de ${esMultiple ? "los clientes" : "el cliente"}, el proceso no se pudo completar en la primera instancia.</p>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; border: 1px solid #333333; font-family: Arial, sans-serif; font-size: 13px; margin-bottom: 25px; width: 100%; text-align: left; background-color: #ffffff;">
      <thead><tr style="background-color: #f2f2f2;"><th style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000"><b>Nro. Contrato</b></font></span></th><th style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000"><b>Cliente</b></font></span></th><th style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000"><b>Carnet (CI)</b></font></span></th><th style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000"><b>Ubicaci&oacute;n</b></font></span></th></tr></thead>
      <tbody>${filas}</tbody>
    </table>
    <p style="margin-bottom: 25px; color: #333333;">Quedo atento a tu confirmaci&oacute;n para proceder con la regularizaci&oacute;n.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formReenvio.asesor || '[Nombre del Asesor]'}</p>
  </div>`;
};

export const generarHtmlLlamada = (formLlamada) => {
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
    <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">Estimada Olivia,</p>
    <p style="margin-bottom: 20px; color: #333333;">Por favor su ayuda con la validaci&oacute;n de llamada de este cliente referido, el cliente menciona que tendr&aacute; tiempo de contestar hoy a las <strong>${formLlamada.horaLlamada || '[HORA]'}</strong>, por favor pido la ayuda de tu equipo para que la puedan llamar a esa hora:</p>
    
    <p style="margin-bottom: 5px; color: #555555;">Cliente referido:</p>
    <p style="margin-top: 0; margin-bottom: 15px; font-weight: bold; font-size: 15px; color: #000000;">${formLlamada.nombreReferido || '[NOMBRE REFERIDO]'} - Contrato: ${formLlamada.contratoReferido || '[CONTRATO]'} - Celular: ${formLlamada.celularReferido || '[CELULAR]'}</p>
    
    <p style="margin-bottom: 5px; color: #555555;">Cliente beneficiaria:</p>
    <p style="margin-top: 0; margin-bottom: 25px; font-weight: bold; font-size: 15px; color: #000000;">${formLlamada.nombreBeneficiario || '[NOMBRE BENEFICIARIA]'}, ${formLlamada.ciBeneficiario || '[CI BENEFICIARIA]'}</p>
    
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formLlamada.asesor || '[Nombre del Asesor]'}</p>
  </div>`;
};

export const generarHtmlSeguro = (formSeguro, supervisorData) => {
  const { saludo, nombrePila } = supervisorData;
  const cant = formSeguro.beneficiarios.length;
  let filas = "";
  formSeguro.beneficiarios.forEach(b => {
    filas += `<tr style="background-color: #ffffff;"><td style="border: 1px solid #cbd5e1; padding: 8px 12px; font-weight: bold;"><span style="color: #000000;"><font color="#000000">${b.nombre || '---'}</font></span></td><td style="border: 1px solid #cbd5e1; padding: 8px 12px;"><span style="color: #000000;"><font color="#000000">${b.parentesco || '---'}</font></span></td><td style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: center;"><span style="color: #000000;"><font color="#000000">${b.porcentaje ? b.porcentaje + '%' : '---'}</font></span></td><td style="border: 1px solid #cbd5e1; padding: 8px 12px;"><span style="color: #000000;"><font color="#000000">${b.ci || '---'}</font></span></td></tr>`;
  });

  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
    <p style="margin-top: 0; margin-bottom: 20px; color: #333333;">${saludo} ${nombrePila},</p>
    <p style="margin-bottom: 20px; color: #333333;">Por favor tu ayuda adicionando a estos ${cant} beneficiarios al seguro de vida de esta venta, detallo todo a continuaci&oacute;n:</p>
    
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
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formSeguro.asesor || '[Nombre del Asesor]'}</p>
  </div>`;
};

export const generarHtmlDiaria = (formDiaria, supervisorData) => {
  const { saludo, nombrePila } = supervisorData;
  let filas = "";
  let tVisitas = 0, tVentas = 0, tColocacion = 0;

  formDiaria.forEach((a, i) => {
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
    <p style="margin-bottom: 20px;">${obtenerSaludoTiempo()} ${saludo} ${nombrePila},<br><br>Adjunto el reporte de Proyección Diaria del equipo correspondiente al día de hoy:</p>
    
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

export const generarHtmlProyeccion = (formProyeccion, supervisorData) => {
  const { saludo, nombrePila } = supervisorData;
  let filasAsesoresHtml = "";
  
  let sumColAct = 0;
  let sumProyA = [0,0,0,0,0];
  let sumTotalProySemanal = 0;
  let sumTotalColMes = 0;

  const formatCurr = (val) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(val) || 0);
  const fVacio = (val) => val === 0 ? '-' : formatCurr(val);
  const fDias = (val) => val === 0 ? '-' : formatCurr(val);
  
  const NOMBRES_PROYECTOS_PROYECCION = ["Muyurina", "Renacer", "Santa Fe", "Rancho Nuevo", "Jardines"];

  const formatDiaMesP = (fechaIso, sumarDias = 0) => {
    if (!fechaIso) return `Día ${sumarDias + 1}`;
    const partes = String(fechaIso).split('-');
    if (partes.length !== 3) return `Día ${sumarDias + 1}`;
    const date = new Date(Date.UTC(partes[0], partes[1] - 1, partes[2])); 
    date.setDate(date.getDate() + sumarDias);
    const dia = date.getDate();
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const mes = meses[date.getMonth()];
    if (!mes) return `Día ${sumarDias + 1}`; 
    return `${dia}-${mes}`;
  };

  if (formProyeccion && Array.isArray(formProyeccion.asesores)) {
    formProyeccion.asesores.forEach((asesor, i) => {
      const sumDias = Array.isArray(asesor.dias) ? asesor.dias.reduce((a, b) => a + (Number(b) || 0), 0) : 0;
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

      const isProductivo = totalColMes >= 25000;
      const rowBgStyle = isProductivo ? 'background-color: #ecfdf5;' : 'background-color: #ffffff;';
      const textColor = isProductivo ? '#059669' : '#0f172a';

      filasAsesoresHtml += `
        <tr style="${rowBgStyle}">
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b;">${i+1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: left; color: #0f172a; font-weight: bold; white-space: nowrap;">${String(asesor.nombre || '')}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #334155;">${fVacio(colActNum)}</td>
          ${Array.isArray(asesor.dias) ? asesor.dias.map(d => `<td style="padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 1px solid #f1f5f9; text-align: center; color: #475569;">${fDias(Number(d)||0)}</td>`).join('') : ''}
          ${Array.isArray(asesor.proy) ? asesor.proy.map(p => `<td style="padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 1px solid #f0f9ff; text-align: center; color: #0369a1; font-weight: bold;">${fDias(Number(p)||0)}</td>`).join('') : ''}
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 1px solid #e2e8f0; text-align: right; color: #334155; font-weight: bold;">${fVacio(sumDias)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: ${textColor};">${fVacio(totalColMes)}${isProductivo ? ' &#10004;' : ''}</td>
        </tr>
      `;
    });
  }

  const mesStr = new Date(formProyeccion.fechaInicio || new Date()).toLocaleString('es-ES', { month: 'long' });
  const capMes = mesStr.charAt(0).toUpperCase() + mesStr.slice(1);
  const objMensual = Number(formProyeccion.objetivoMensual) || 0;
  const porcentajeAvance = objMensual ? (sumColAct / objMensual) * 100 : 0;
  const porcentajeFin = objMensual ? (sumTotalColMes / objMensual) * 100 : 0;

  return `
  <div style="background-color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #334155; line-height: 1.6; max-width: 1200px; text-align: left;">
    <p style="color: #0f172a; font-size: 16px;"><b>Buenos d&iacute;as ${saludo} ${nombrePila},</b></p>
    <p style="color: #334155;">Adjunto el consolidado de proyecci&oacute;n de ventas semanal del equipo. A continuaci&oacute;n el detalle actualizado:</p>
    
    <div style="overflow-x: auto; width: 100%; max-width: 100%;">
    <table border="0" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; margin-top: 15px; width: 100%; min-width: 900px; text-align: left; background-color: #ffffff; border: 1px solid #e2e8f0;">
      <thead>
        <tr>
          <th colspan="3" style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 10px; text-align: left; color: #0f172a; font-size: 13px;"><b>Equipo: ${String(formProyeccion.equipo || '')}</b></th>
          <th colspan="7" style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; border-left: 1px solid #e2e8f0; padding: 10px; text-align: center; color: #334155; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;"><b>Ventas Diarias</b></th>
          <th colspan="5" style="background-color: #eff6ff; border-bottom: 2px solid #bae6fd; border-left: 1px solid #e2e8f0; padding: 10px; text-align: center; color: #0369a1; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;"><b>Proyectos</b></th>
          <th rowspan="2" style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; border-left: 1px solid #e2e8f0; padding: 10px; text-align: right; color: #334155; vertical-align: bottom;"><b>Total<br>Proy. Semanal</b></th>
          <th rowspan="2" style="background-color: #f0fdf4; border-bottom: 2px solid #6ee7b7; border-left: 1px solid #e2e8f0; padding: 10px; text-align: right; color: #065f46; vertical-align: bottom;"><b>Cierre Mes<br>(Meta $25k)</b></th>
        </tr>
        <tr>
          <th style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 8px; color: #64748b; width: 30px; text-align: center;">#</th>
          <th style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 8px; text-align: left; color: #475569; white-space: nowrap;"><b>Asesor</b></th>
          <th style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 8px; text-align: right; color: #475569; white-space: nowrap;"><b>Coloc. Actual</b></th>
          ${[0,1,2,3,4,5,6].map(d => `<th style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; border-left: 1px solid #e2e8f0; padding: 8px; text-align: center; color: #64748b; white-space: nowrap;">${formatDiaMesP(formProyeccion.fechaInicio, d)}</th>`).join('')}
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
          <td style="padding: 10px 8px; text-align: right; color: #059669; border-top: 2px solid #6ee7b7; background-color: #d1fae5; font-size: 14px;"><b>$${formatCurr(sumTotalColMes)}</b></td>
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
        <td style="padding: 12px 16px; text-align: right; color: #0f172a; font-size: 14px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">$${formatCurr(objMensual)}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #475569; font-size: 13px; border-bottom: 1px solid #f1f5f9;"><b>Colocaci&oacute;n Actual</b></td>
        <td style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #f1f5f9;">
          <span style="color: #0f172a; font-size: 14px; font-weight: bold;">$${formatCurr(sumColAct)}</span>
          <span style="display: inline-block; background-color: #f1f5f9; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-left: 8px; font-weight: bold;">${formatCurr(porcentajeAvance)}%</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; color: #0f172a; font-size: 14px;"><b>Proyecci&oacute;n Cierre de Mes</b></td>
        <td style="padding: 14px 16px; text-align: right;">
          <span style="color: #059669; font-size: 16px; font-weight: bold;">$${formatCurr(sumTotalColMes)}</span>
          <span style="display: inline-block; background-color: #d1fae5; color: #065f46; padding: 3px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px; font-weight: bold;">${formatCurr(porcentajeFin)}%</span>
        </td>
      </tr>
    </table>
    <p style="margin-top: 25px; margin-bottom: 2px; color: #475569;">Saludos cordiales.</p>
  </div>`;
};
