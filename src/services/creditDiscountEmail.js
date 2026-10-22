import { escapeHtml } from './email.js';
import { formatCurrency } from '../utils/formatters.js';

import { CREDIT_IMAGE_MARKER } from './inlineLotImage.js';

// Solo presentación del correo de crédito: no calcula ni cambia el descuento.
export function creditDiscountEmail({ project, uv, block, lot, category, advisor, salutation, greeting, calculations, exchangeRate, hasImage = false }) {
  const c = calculations;
  const h = escapeHtml;
  const money = formatCurrency;
  const intro = `Solicito la aplicación del descuento de la Campaña Oficial de Octubre para el proyecto ${project}.`;
  const closing = 'Solicito su aprobación y la aplicación de las condiciones en el sistema para continuar con el cierre de la venta.';
  const text = `${greeting}\n${salutation},\n\n${intro}\n\nDATO CLAVE PARA MODIFICAR EN EL SISTEMA\nPrecio anterior de lista: USD ${money(c.precioM2Anterior)}/m²\nDescuento equivalente por m² (informativo): USD ${money(c.reduccionM2)}/m²\nNUEVO PRECIO M²: USD ${money(c.nuevoPrecioM2)}/m²\n\nPROYECTO: ${project}${category ? ` / ${category}` : ''}\nUV ${uv} · MZN ${block} · LT ${lot}\n\n${c.labelBadge}\nPrecio con descuento: USD ${money(c.capitalFinalUSD)}\nEquivalente: Bs. ${money(c.totalBs)} · TC ${exchangeRate.toFixed(2)}\n${hasImage ? '\nCaptura del lote: pegar el formato con imagen o adjuntarla al borrador.\n' : ''}\n${closing}\n\nSaludos cordiales,\n${advisor}`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;max-width:650px;margin:0 auto;line-height:1.5;">
<p style="margin:0 0 8px;font-size:14px;">${h(greeting)}</p>
<p style="margin:0 0 16px;font-size:14px;">${h(salutation)},</p>
<p style="margin:0 0 20px;font-size:14px;">Solicito la aplicación del descuento de la <strong>Campaña Oficial de Octubre</strong> para el proyecto <strong>${h(project)}</strong>.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #16a34a;border-radius:10px;background-color:#f0fdf4;margin-bottom:20px;"><tbody><tr><td style="padding:14px 16px;">
<p style="font-size:11px;font-weight:bold;color:#15803d;margin:0 0 8px;">📌 DATO CLAVE PARA MODIFICAR EN EL SISTEMA</p>
<table width="100%" cellpadding="0" cellspacing="0"><tbody><tr><td style="font-size:12px;vertical-align:top;">Precio anterior de lista: <strong>USD ${money(c.precioM2Anterior)}/m²</strong><br/>Descuento equivalente por m² (informativo): <strong>USD ${money(c.reduccionM2)}/m²</strong></td>
<td align="right" style="vertical-align:top;color:#15803d;"><span style="font-size:11px;font-weight:bold;">NUEVO PRECIO M²:</span><br/><strong style="font-size:22px;">USD ${money(c.nuevoPrecioM2)} / m²</strong></td></tr></tbody></table></td></tr></tbody></table>
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;border:1px solid #334155;border-radius:10px;margin-bottom:22px;"><tbody>
<tr><td style="padding:14px 16px;border-bottom:1px solid #334155;"><table width="100%" cellpadding="0" cellspacing="0"><tbody><tr><td style="color:#ffffff;font-size:13px;"><strong>PROYECTO</strong><br/>${h(project)}${category ? ` / ${h(category)}` : ''}</td><td align="right" style="color:#e2e8f0;font-size:12px;">UV <strong>${h(uv)}</strong> · MZN <strong>${h(block)}</strong> · LT <strong>${h(lot)}</strong></td></tr></tbody></table></td></tr>
<tr><td align="center" style="padding:22px 16px;color:#ffffff;"><span style="display:inline-block;border:1px solid #0891b2;background-color:#164e63;border-radius:16px;padding:4px 12px;font-size:11px;font-weight:bold;">🏷️ ${h(c.labelBadge)}</span><p style="font-size:28px;font-weight:bold;margin:12px 0 4px;">USD ${money(c.capitalFinalUSD)}</p><p style="font-size:13px;color:#cbd5e1;margin:0;">Bs. ${money(c.totalBs)} · TC ${exchangeRate.toFixed(2)}</p></td></tr>
</tbody></table>
${hasImage ? `<div style="text-align:center;margin:0 0 24px;">${CREDIT_IMAGE_MARKER}</div>` : ''}
<p style="font-size:14px;margin:0 0 16px;">${closing}</p><p style="font-size:14px;margin:0 0 4px;">Saludos cordiales,</p><p style="font-size:14px;font-weight:bold;margin:0;">${h(advisor)}</p></div>`;
  return { html, text };
}
