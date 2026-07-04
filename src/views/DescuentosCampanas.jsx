import React, { useState } from 'react';
import { Tag, AlertCircle } from 'lucide-react';
import { ResultCard } from '../components/ui/ResultCard';

export default function DescuentosCampanas() {
  const [form, setForm] = useState({
    proyecto: 'Muyurina',
    modalidad: 'A Crédito (Plazos)', // 'A Crédito (Plazos)' o 'Al Contado'
    tipoCuota: 'Porcentaje (%)',
    valorCuota: '1.5',
    uv: '49',
    mzn: '6',
    lote: '13',
    superficie: '240',
    precioReg: '145',
    asesor: 'Oscar Saravia.'
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ================= 1. MATEMÁTICA DE CLASE MUNDIAL ($2 CONTADO / $1 CRÉDITO) =================
  const sup = parseFloat(form.superficie) || 0;
  const pReg = parseFloat(form.precioReg) || 0;
  const valCuota = parseFloat(form.valorCuota) || 0;

  // Factor de descuento según modalidad
  const factorDescuento = form.modalidad === 'Al Contado' ? 2 : 1;

  const precioOriginal = sup * pReg;
  const ahorroCliente = sup * factorDescuento;
  const precioFinal = precioOriginal - ahorroCliente;
  const precioM2Aplicar = pReg - factorDescuento;

  // Cálculo de Cuota Inicial (Dinero y Porcentaje para la barra)
  let cuotaDinero = 0;
  let porcentajeReal = 0;
  if (form.tipoCuota === 'Porcentaje (%)') {
    cuotaDinero = precioFinal * (valCuota / 100);
    porcentajeReal = valCuota;
  } else {
    cuotaDinero = valCuota;
    porcentajeReal = precioFinal > 0 ? (valCuota / precioFinal) * 100 : 0;
  }

  // Formateadores
  const fDinero = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  // ================= 2. CORREO HTML (ESTILO PREMIUM RESTAURADO) =================
  const generarHtml = () => `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; color: #1e293b; max-width: 800px;">
      <p>Buenas [SALUDO_AUTO]</p>
      
      <!-- ALERTA DE AUTORIZACIÓN -->
      <table width="100%" cellpadding="12" cellspacing="0" border="0" style="background-color: #fef2f2; border: 1px solid #fca5a5; margin-bottom: 20px;">
        <tr>
          <td style="color: #ef4444; font-size: 13px; font-weight: bold;">
            ⚠️ REQUIERE AUTORIZACIÓN: Descuento Comercial por Modalidad ${form.modalidad}
          </td>
        </tr>
      </table>

      <p style="font-size: 13px;">Por favor le solicito mediante el presente correo, la aplicación del descuento correspondiente a la campaña vigente del proyecto ${form.proyecto}: Venta ${form.modalidad} con cuota inicial del ${porcentajeReal.toFixed(2)}%:</p>

      <!-- TABLA BLANCA DE MÉTRICAS -->
      <table width="100%" cellpadding="14" cellspacing="0" border="0" style="border: 1px solid #e2e8f0; background-color: #ffffff; font-size: 13px; margin-bottom: 0;">
        <tr>
          <td style="color: #64748b; border-bottom: 1px solid #f1f5f9;">Total Valor Contrato (VC)</td>
          <td align="right" style="font-weight: 800; border-bottom: 1px solid #f1f5f9;">${fDinero(precioOriginal)}</td>
        </tr>
        <tr>
          <td style="color: #64748b; border-bottom: 1px solid #f1f5f9;">Total Descuento Campañas ($${factorDescuento}/m2)</td>
          <td align="right" style="color: #10b981; font-weight: 800; border-bottom: 1px solid #f1f5f9;">-${fDinero(ahorroCliente)}</td>
        </tr>
        <tr>
          <td style="font-weight: 800; font-size: 14px; padding-top: 18px;">Nuevo Precio Promoción</td>
          <td align="right" style="font-weight: 900; color: #2563eb; font-size: 15px; padding-top: 18px;">${fDinero(precioFinal)}</td>
        </tr>
      </table>

      <!-- PIE DE PÁGINA OSCURO (PRECIO M2) -->
      <table width="100%" cellpadding="20" cellspacing="0" border="0" style="background-color: #0f172a; border-radius: 0 0 8px 8px;">
        <tr>
          <td style="font-size: 12px; font-weight: 800; color: #94a3b8; letter-spacing: 1px;">PRECIO M2 A APLICAR</td>
          <td align="right" style="font-size: 22px; font-weight: 900; color: #10b981;">${fDinero(precioM2Aplicar)}</td>
        </tr>
        <tr>
          <td colspan="2" align="center" style="font-size: 10px; font-weight: 800; color: #38bdf8; letter-spacing: 1.5px; border-top: 1px solid #1e293b; padding-top: 15px;">
            CATEGORÍA: LOTE S/CALLE - UV ${form.uv} • MZN ${form.mzn} • LT ${form.lote}
          </td>
        </tr>
      </table>

      <p style="font-size: 13px; margin-top: 25px; color: #333;">Quedo atento a su aprobación para continuar con el proceso del cierre de la venta.</p>
      <p style="font-size: 13px; color: #333;">Saludos cordiales,<br/><strong>${form.asesor}</strong></p>
    </div>
  `;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black text-slate-800 flex items-center mb-6">
        <Tag className="w-6 h-6 mr-2 text-blue-600" /> Descuentos Campañas
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6">
        
        {/* PANEL IZQUIERDO: EL FORMULARIO RESTAURADO */}
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

          {/* CAJA DE CUOTA INICIAL (El diseño intacto) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <label className="block text-xs font-bold text-slate-700 mb-2">Ingresar Cuota Inicial</label>
            <div className="flex gap-2 mb-4">
              <select name="tipoCuota" value={form.tipoCuota} onChange={handleChange} className="w-1/3 px-3 py-2 bg-slate-700 text-white border-none rounded-lg text-sm outline-none">
                <option value="Porcentaje (%)">Porcentaje (%)</option>
                <option value="Monto ($)">Monto ($)</option>
              </select>
              <input type="number" name="valorCuota" value={form.valorCuota} onChange={handleChange} className="w-1/3 px-3 py-2 bg-slate-700 text-white border-none rounded-lg text-sm text-center outline-none" />
              <div className="w-1/3 bg-blue-600 text-white font-black text-sm flex items-center justify-center rounded-lg shadow-inner">
                {fDinero(cuotaDinero)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-blue-600">
                <span>Avance Cuota Inicial</span>
                <span>Meta: 5%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: \`\${Math.min(porcentajeReal, 100)}%\` }}></div>
              </div>
              <div className="flex items-center text-[10px] font-bold text-amber-600 pt-1">
                <AlertCircle className="w-3 h-3 mr-1" /> ¡Sube al 5% para mejorar el descuento!
              </div>
            </div>
          </div>

          {/* INPUTS OSCUROS (UV, MZN, LOTE) */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-800 uppercase mb-1">UV</label>
              <input type="text" name="uv" value={form.uv} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 text-white border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-800 uppercase mb-1">MZN</label>
              <input type="text" name="mzn" value={form.mzn} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 text-white border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-800 uppercase mb-1">LOTE</label>
              <input type="text" name="lote" value={form.lote} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 text-white border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* SUPERFICIE Y PRECIO */}
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
          
          {/* EL ESPECTACULAR TICKET DE SIMULACIÓN */}
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

          {/* RESULT CARD (Intacta con tu correo de auditoría y bloqueos) */}
          <ResultCard 
            title="Descuentos Campañas" 
            text={\`Solicitud de descuento campaña para lote UV: \${form.uv} MZN: \${form.mzn} LOTE: \${form.lote}\`} 
            htmlContent={generarHtml()} 
            subject={\`Solicitud Descuento - \${form.proyecto} UV:\${form.uv} Mz:\${form.mzn} Lt:\${form.lote}\`} 
          />
        </div>
      </div>
    </div>
  );
}
