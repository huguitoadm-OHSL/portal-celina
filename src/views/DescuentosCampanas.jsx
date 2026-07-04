import React, { useState } from 'react';
import { Tag, AlertCircle } from 'lucide-react';
import { ResultCard } from '../components/ui/ResultCard';

export default function DescuentosCampanas() {
  const [form, setForm] = useState({
    proyecto: 'Muyurina',
    modalidad: 'Al Contado', // 'A Crédito (Plazos)' o 'Al Contado'
    uv: '14',
    mzn: '40',
    lote: '24',
    superficie: '270',
    precioReg: '137',
    asesor: 'Oscar Saravia'
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ================= 1. MATEMÁTICA NUEVA ($2 CONTADO / $1 CRÉDITO) =================
  const sup = parseFloat(form.superficie) || 0;
  const pReg = parseFloat(form.precioReg) || 0;

  // Factor de descuento
  const factorDescuento = form.modalidad === 'Al Contado' ? 2 : 1;

  const precioOriginal = sup * pReg;
  const ahorroCliente = sup * factorDescuento;
  const precioFinal = precioOriginal - ahorroCliente;
  const precioM2Aplicar = pReg - factorDescuento;

  // Formateadores
  const fDinero = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  // ================= 2. CORREO HTML (EL DISEÑO EXACTO DE TU IMAGEN) =================
  const generarHtml = () => `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 13px; color: #0f172a; max-width: 950px; line-height: 1.5;">
      <tr>
        <td>
          <p>Buenas [SALUDO_AUTO]</p>

          <!-- ALERTA ROJA EXACTA -->
          <table width="100%" cellpadding="12" cellspacing="0" border="0" style="background-color: #fef2f2; border: 1px solid #fca5a5; margin-bottom: 15px;">
            <tr>
              <td style="color: #ef4444; font-size: 12px; font-weight: bold;">
                ⚠️ REQUIERE AUTORIZACIÓN: Aplicación de descuento comercial de $${factorDescuento}/m2 por Venta ${form.modalidad}
              </td>
            </tr>
          </table>

          <p style="margin-bottom: 20px;">Por favor le solicito mediante el presente correo, la aplicación del descuento correspondiente a la campaña vigente del proyecto ${form.proyecto}: descuento de $${factorDescuento}/m2 por modalidad ${form.modalidad.toLowerCase()}:</p>

          <!-- CONTENEDOR BLANCO PRINCIPAL -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e2e8f0; background-color: #ffffff;">
            
            <!-- Cabecera -->
            <tr>
              <td style="padding: 15px 20px; border-bottom: 1px solid #e2e8f0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size: 12px; font-weight: bold; color: #64748b; letter-spacing: 1px;">🧾 RESUMEN DE DESCUENTOS</td>
                    <td align="right" style="font-size: 11px; font-weight: bold; color: #10b981; letter-spacing: 1px;">ACTIVO</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 3 Columnas Grises -->
            <tr>
              <td style="padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0;">
                  <tr>
                    <td align="center" width="33%" style="padding: 15px; border-right: 1px solid #e2e8f0;">
                      <span style="font-size: 9px; font-weight: bold; color: #64748b; display: block; margin-bottom: 5px; letter-spacing: 1px;">SUPERFICIE</span>
                      <span style="font-size: 16px; font-weight: bold; color: #0f172a;">${form.superficie} m²</span>
                    </td>
                    <td align="center" width="33%" style="padding: 15px; border-right: 1px solid #e2e8f0;">
                      <span style="font-size: 9px; font-weight: bold; color: #64748b; display: block; margin-bottom: 5px; letter-spacing: 1px;">PRECIO M2 REGULAR</span>
                      <span style="font-size: 16px; font-weight: bold; color: #0f172a;">$${form.precioReg}</span>
                    </td>
                    <td align="center" width="34%" style="padding: 15px;">
                      <span style="font-size: 9px; font-weight: bold; color: #2563eb; display: block; margin-bottom: 5px; letter-spacing: 1px;">PRECIO ORIGINAL</span>
                      <span style="font-size: 16px; font-weight: bold; color: #2563eb;">${fDinero(precioOriginal)}</span>
                    </td>
                  </tr>
                </table>

                <!-- Filas de Detalles Contables -->
                <table width="100%" cellpadding="14" cellspacing="0" border="0" style="margin-top: 20px; font-size: 13px;">
                  <tr>
                    <td style="color: #64748b; border-bottom: 1px solid #f1f5f9; padding-left: 0;">Condición (${form.proyecto})</td>
                    <td align="right" style="border-bottom: 1px solid #f1f5f9; padding-right: 0;">
                      <span style="color: #d97706; font-weight: bold; margin-right: 10px;">-$${factorDescuento}/m2</span>
                      <span style="font-weight: bold; color: #0f172a;">-${fDinero(ahorroCliente)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; border-bottom: 1px solid #f1f5f9; padding-left: 0;">Total Valor Contrato (VC)</td>
                    <td align="right" style="font-weight: bold; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-right: 0;">${fDinero(precioOriginal)}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; border-bottom: 1px solid #f1f5f9; padding-left: 0;">Total Descuento Campañas</td>
                    <td align="right" style="font-weight: bold; color: #10b981; border-bottom: 1px solid #f1f5f9; padding-right: 0;">-${fDinero(ahorroCliente)}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; font-size: 15px; padding-top: 20px; padding-left: 0;">Nuevo Precio Promoción</td>
                    <td align="right" style="font-weight: bold; color: #2563eb; font-size: 16px; padding-top: 20px; padding-right: 0;">${fDinero(precioFinal)}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- FOOTER OSCURO PREMIUM -->
          <table width="100%" cellpadding="25" cellspacing="0" border="0" style="background-color: #0f172a; margin-top: -1px;">
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size: 11px; font-weight: bold; color: #94a3b8; letter-spacing: 1px;">PRECIO M2 A APLICAR</td>
                    <td align="right" style="font-size: 24px; font-weight: bold; color: #10b981;">${fDinero(precioM2Aplicar)}</td>
                  </tr>
                </table>
                
                <table width="100%" cellpadding="15" cellspacing="0" border="0" style="background-color: #1e293b; margin-top: 20px; border-radius: 4px;">
                  <tr>
                    <td style="font-size: 10px; font-weight: bold; color: #38bdf8; letter-spacing: 1px;">
                      CATEGORÍA: LOTE S/CALLE (REFERENCIAL)
                    </td>
                    <td align="right" style="font-size: 10px; font-weight: bold; color: #cbd5e1; letter-spacing: 2px;">
                      UV ${form.uv} &nbsp;•&nbsp; MZN ${form.mzn} &nbsp;•&nbsp; LT ${form.lote}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p style="font-size: 13px; margin-top: 30px;">Quedo atento a su aprobación para continuar con el proceso del cierre de la venta.</p>
          <p style="font-size: 13px;">Saludos cordiales,<br/><strong>${form.asesor}</strong></p>
        </td>
      </tr>
    </table>
  `;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black text-slate-800 flex items-center mb-6">
        <Tag className="w-6 h-6 mr-2 text-blue-600" /> Descuentos Campañas
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6">
        
        {/* PANEL IZQUIERDO: FORMULARIO UI */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Proyecto</label>
              <select name="proyecto" value={form.proyecto} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Muyurina">Muyurina</option>
                <option value="Santa Fe">Santa Fe</option>
                <option value="Renacer">Renacer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Modalidad</label>
              <select name="modalidad" value={form.modalidad} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="A Crédito (Plazos)">A Crédito (Plazos) - $1/m2</option>
                <option value="Al Contado">Al Contado - $2/m2</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-800 uppercase mb-1">UV</label>
              <input type="text" name="uv" value={form.uv} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 text-white border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-center" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-800 uppercase mb-1">MZN</label>
              <input type="text" name="mzn" value={form.mzn} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 text-white border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-center" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-800 uppercase mb-1">LOTE</label>
              <input type="text" name="lote" value={form.lote} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 text-white border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-center" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-800 uppercase mb-1">Superficie (M2)</label>
              <input type="number" name="superficie" value={form.superficie} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-800 uppercase mb-1">Precio Reg. (M2)</label>
              <input type="number" name="precioReg" value={form.precioReg} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-800 uppercase mb-1">Nombre del Asesor</label>
            <input type="text" name="asesor" value={form.asesor} onChange={handleChange} className="w-full px-3 py-2 bg-slate-300/50 text-slate-500 font-bold border-none rounded-lg text-sm outline-none" readOnly />
          </div>
        </div>

        {/* PANEL DERECHO: TICKET DE SIMULACIÓN Y RESULT CARD */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-white pointer-events-none">
              <span className="text-7xl font-black">$</span>
            </div>
            
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Ticket de Simulación</h3>
            
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="block text-xs font-bold text-slate-400 mb-1">Precio Original</span>
                <span className="text-xl font-black text-slate-300 line-through decoration-red-500 decoration-2">{fDinero(precioOriginal)}</span>
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-400 mb-1">Ahorro Cliente</span>
                <span className="text-xl font-black text-[#10b981]">-{fDinero(ahorroCliente)}</span>
              </div>
            </div>

            <div className="bg-[#0f172a] rounded-xl p-4 flex justify-between items-center border border-slate-700/50">
              <span className="text-sm font-black text-white tracking-widest">PRECIO FINAL</span>
              <span className="text-3xl font-black text-white">{fDinero(precioFinal)}</span>
            </div>
          </div>

          <ResultCard 
            title="Descuento" 
            text={\`Solicitud de descuento campaña para lote UV: \${form.uv} MZN: \${form.mzn} LOTE: \${form.lote}\`} 
            htmlContent={generarHtml()} 
            subject={\`Solicitud Descuento Campañas - \${form.proyecto} UV:\${form.uv} Mz:\${form.mzn} Lt:\${form.lote} - AUTORIZACIÓN VENTA \${form.modalidad.toUpperCase()}\`} 
          />
        </div>
      </div>
    </div>
  );
}
