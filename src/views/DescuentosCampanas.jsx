import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import { ResultCard } from '../components/ui/ResultCard';

export default function DescuentosCampanas() {
  const [form, setForm] = useState({
    asesor: 'Oscar Saravia.',
    cliente: '',
    proyecto: 'CELINA MUYURINA',
    uv: '', 
    mzn: '', 
    lote: '',
    superficie: '',
    tipoVenta: 'CONTADO'
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // CÁLCULO DE LA NUEVA MÉTRICA (2$ Contado / 1$ Crédito)
  const factor = form.tipoVenta === 'CONTADO' ? 2 : 1;
  const descuentoDolares = (parseFloat(form.superficie || 0) * factor).toFixed(2);

  const generarHtml = () => `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; color: #1e293b;">
      <tr>
        <td>
          <p style="font-size: 14px;">Buenas [SALUDO_AUTO]</p>
          <p style="font-size: 14px;">Por favor le solicito mediante el presente correo, la aplicación del descuento correspondiente a la modalidad de venta:</p>

          <!-- ALERTA ROJA PREMIUM -->
          <table width="100%" cellpadding="12" cellspacing="0" border="0" style="background-color: #fef2f2; border: 1px solid #fca5a5; margin-bottom: 20px;">
            <tr>
              <td style="color: #ef4444; font-size: 13px; font-weight: bold;">
                ⚠️ REQUIERE AUTORIZACIÓN: Aplicación de Descuento por Venta al ${form.tipoVenta}
              </td>
            </tr>
          </table>

          <!-- TARJETA PRINCIPAL (ESTILO GLASSMORPHISM / PREMIUM) -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e2e8f0; background-color: #ffffff;">
            
            <!-- CABECERA -->
            <tr>
              <td style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 14px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size: 12px; font-weight: 800; color: #64748b; letter-spacing: 1.5px;">📝 RESUMEN DE DESCUENTOS</td>
                    <td align="right" style="font-size: 11px; font-weight: 900; color: #10b981; letter-spacing: 1px;">ACTIVO</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 3 COLUMNAS DE MÉTRICAS -->
            <tr>
              <td>
                <table width="100%" cellpadding="18" cellspacing="0" border="0" style="border-bottom: 1px solid #e2e8f0;">
                  <tr>
                    <td align="center" width="33%" style="border-right: 1px solid #e2e8f0;">
                      <span style="font-size: 10px; font-weight: 800; color: #94a3b8; display: block; margin-bottom: 6px;">SUPERFICIE</span>
                      <span style="font-size: 18px; font-weight: 900; color: #0f172a;">${form.superficie || '0'} m²</span>
                    </td>
                    <td align="center" width="33%" style="border-right: 1px solid #e2e8f0;">
                      <span style="font-size: 10px; font-weight: 800; color: #94a3b8; display: block; margin-bottom: 6px;">FACTOR APLICADO</span>
                      <span style="font-size: 18px; font-weight: 900; color: #0f172a;">$${factor}.00 / m²</span>
                    </td>
                    <td align="center" width="34%">
                      <span style="font-size: 10px; font-weight: 800; color: #94a3b8; display: block; margin-bottom: 6px;">CLIENTE</span>
                      <span style="font-size: 14px; font-weight: 800; color: #2563eb;">${form.cliente || '---'}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- DESGLOSE -->
            <tr>
              <td style="padding: 25px 20px;">
                <table width="100%" cellpadding="12" cellspacing="0" border="0" style="font-size: 13px;">
                  <tr>
                    <td style="color: #64748b; border-bottom: 1px solid #f1f5f9;">Condición de Venta (${form.tipoVenta})</td>
                    <td align="right" style="font-weight: 800; color: #0f172a; border-bottom: 1px solid #f1f5f9;">$${factor}.00 x m²</td>
                  </tr>
                  <tr>
                    <td style="color: #0f172a; font-weight: 800; padding-top: 18px;">Total Descuento Solicitado</td>
                    <td align="right" style="font-weight: 900; color: #10b981; font-size: 16px; padding-top: 18px;">-$${descuentoDolares}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- PIE DE PÁGINA OSCURO (PREMIUM OLD MONEY) -->
            <tr>
              <td style="background-color: #0f172a; padding: 25px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size: 12px; font-weight: 800; color: #94a3b8; letter-spacing: 1px;">DESCUENTO TOTAL A APLICAR</td>
                    <td align="right" style="font-size: 28px; font-weight: 900; color: #38bdf8;">$${descuentoDolares}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top: 25px;">
                      <table width="100%" cellpadding="14" cellspacing="0" border="0" style="background-color: #1e293b; border-radius: 6px;">
                        <tr>
                          <td align="center" style="font-size: 11px; font-weight: 800; color: #60a5fa; letter-spacing: 1.5px; text-transform: uppercase;">
                            ${form.proyecto} &nbsp;&nbsp;|&nbsp;&nbsp; UV ${form.uv} &nbsp;&nbsp;•&nbsp;&nbsp; MZN ${form.mzn} &nbsp;&nbsp;•&nbsp;&nbsp; LT ${form.lote}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p style="font-size: 14px; margin-top: 25px; color: #333;">Quedo atento a su aprobación para continuar con el proceso del cierre de la venta.</p>
          <p style="font-size: 14px; color: #333;">Saludos cordiales,<br/><strong>${form.asesor}</strong></p>
        </td>
      </tr>
    </table>
  `;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center mb-6">
        <Tag className="w-6 h-6 mr-2 text-indigo-600" /> Solicitud de Descuento
      </h2>
      
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        {/* PANEL DE FORMULARIO MEJORADO */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Asesor</label>
              <input type="text" name="asesor" value={form.asesor} onChange={handleChange} className="w-full px-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700 font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cliente</label>
              <input type="text" name="cliente" value={form.cliente} onChange={handleChange} placeholder="Ej. ISABEL PACO ORTEGA" className="w-full px-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700 font-medium uppercase" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Proyecto</label>
              <select name="proyecto" value={form.proyecto} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700 font-medium cursor-pointer">
                <option value="CELINA MUYURINA">CELINA MUYURINA</option>
                <option value="CELINA SANTA FE">CELINA SANTA FE</option>
                <option value="EL RENACER">EL RENACER</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-600 uppercase mb-2">Tipo de Venta</label>
              <select name="tipoVenta" value={form.tipoVenta} onChange={handleChange} className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-blue-700 font-black cursor-pointer shadow-sm">
                <option value="CONTADO">CONTADO ($2 / m2)</option>
                <option value="CRÉDITO">CRÉDITO ($1 / m2)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 text-center">UV</label>
              <input type="text" name="uv" value={form.uv} onChange={handleChange} className="w-full px-3 py-3 bg-slate-800 text-white border-none rounded-xl text-center font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 text-center">MZN</label>
              <input type="text" name="mzn" value={form.mzn} onChange={handleChange} className="w-full px-3 py-3 bg-slate-800 text-white border-none rounded-xl text-center font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 text-center">Lote</label>
              <input type="text" name="lote" value={form.lote} onChange={handleChange} className="w-full px-3 py-3 bg-slate-800 text-white border-none rounded-xl text-center font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-black text-amber-600 uppercase mb-2 text-center">M2 Sup.</label>
              <input type="number" name="superficie" value={form.superficie} onChange={handleChange} className="w-full px-3 py-3 border border-amber-300 bg-amber-50 rounded-xl text-center font-black text-amber-700 outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-inner" placeholder="Ej. 240" />
            </div>
          </div>
        </div>

        {/* TARJETA RESULTADO */}
        <ResultCard 
          title="Solicitud de Descuento" 
          text={`Descuento para ${form.cliente} - M2: ${form.superficie}`} 
          htmlContent={generarHtml()} 
          subject={`Solicitud Descuento - ${form.proyecto} UV:${form.uv} Mz:${form.mzn} Lt:${form.lote} - ${form.tipoVenta}`} 
        />
      </div>
    </div>
  );
}
