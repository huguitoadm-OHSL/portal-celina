import React, { useState } from 'react';
import { Calculator, Percent, FileText } from 'lucide-react';
import { ResultCard } from '../components/ui/ResultCard';
import { formatCurrency } from '../utils/formatters';

export default function LiquidacionContado() {
  const [destinatario, setDestinatario] = useState('rvaca@celina.com.bo');
  
  // Estado inicial con los datos del formulario
  const [form, setForm] = useState({
    cliente: '',
    contrato: '',
    fechaContrato: new Date().toISOString().split('T')[0],
    asesor: '',
    proyecto: 'URBANIZACIÓN MUYURINA',
    uv: '',
    mzn: '',
    lote: '',
    superficie: '',
    precioM2: '',
    dsctoBasePorcentaje: 20,
    cuotaInicial: '',
    fechaAmortizacion: new Date().toISOString().split('T')[0],
    montoAmortizacion: '',
    dsctoContadoPorcentaje: 10,
    tc: 6.97
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Motor Matemático
  const superficieNum = parseFloat(form.superficie) || 0;
  const precioM2Num = parseFloat(form.precioM2) || 0;
  
  const precioNormalTotal = superficieNum * precioM2Num;
  
  const precioM2Dscto = precioM2Num * (1 - form.dsctoBasePorcentaje / 100);
  const precioDsctoTotal = superficieNum * precioM2Dscto;
  
  const cuotaInicialNum = parseFloat(form.cuotaInicial) || 0;
  const saldoFinanciar = precioDsctoTotal - cuotaInicialNum;
  
  // El 10% de contado se calcula sobre el precio normal, según tu imagen
  const montoDsctoContado = precioNormalTotal * (form.dsctoContadoPorcentaje / 100);
  const montoAmortizacionNum = parseFloat(form.montoAmortizacion) || 0;
  
  const saldoLiquidarUsd = saldoFinanciar - montoDsctoContado - montoAmortizacionNum;
  const saldoLiquidarBs = saldoLiquidarUsd * form.tc;

  // Cálculo de días transcurridos
  const diasTranscurridos = Math.floor((new Date() - new Date(form.fechaContrato)) / (1000 * 60 * 60 * 24)) || 0;
  const dsctoTotalCampana = parseFloat(form.dsctoBasePorcentaje) + parseFloat(form.dsctoContadoPorcentaje);

  // Formateador de fechas para el correo (Ej: 20/06/2026)
  const formatFechaBoliviana = (fechaISO) => {
    if (!fechaISO) return '';
    const [year, month, day] = fechaISO.split('-');
    return `${day}/${month}/${year}`;
  };

  // GENERADOR DEL CORREO (HTML IDÉNTICO A TU CAPTURA)
  const generarHtml = () => {
    return `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #000; line-height: 1.5;">
        <p>Buenas noches, estimado Robert,</p>
        <p>Te escribo para solicitar tu autorización para aplicar el <strong>descuento del ${form.dsctoContadoPorcentaje}% por liquidación bajo la modalidad de venta parcial al contado</strong> (dentro del plazo de los primeros 30 días), correspondiente al siguiente contrato:</p>
        
        <p><strong>Datos del Contrato y Terreno</strong></p>
        <ul>
          <li><strong>Cliente Titular:</strong> ${form.cliente || '___________________'}</li>
          <li><strong>Nro. de Contrato:</strong> ${form.contrato || '___________________'} <em>(Estado: Vigente)</em></li>
          <li><strong>Fecha de Contrato:</strong> ${formatFechaBoliviana(form.fechaContrato)} <em>(Ingresado hace ${diasTranscurridos} días)</em></li>
          <li><strong>Asesor Comercial:</strong> ${form.asesor || '___________________'}</li>
        </ul>

        <table style="width: 100%; max-width: 600px; border-collapse: collapse; border: 2px solid #000; text-align: right; font-size: 13px;">
          <thead>
            <tr>
              <th colspan="4" style="background-color: #1f497d; color: #ffffff; text-align: center; font-weight: bold; padding: 6px; border: 1px solid #000;">
                PROYECTO: ${form.proyecto}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="4" style="background-color: #f2f2f2; text-align: left; font-weight: bold; padding: 4px; border: 1px solid #000;">PRECIO NORMAL</td>
            </tr>
            <tr>
              <td style="text-align: left; font-weight: bold; padding: 4px; border: 1px solid #000; width: 45%;">UV: ${form.uv} MZN: ${form.mzn} LOTE: ${form.lote}</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000; text-align: center;">${superficieNum > 0 ? superficieNum : ''}</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000;">${precioM2Num > 0 ? formatCurrency(precioM2Num) : ''}</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000;">${formatCurrency(precioNormalTotal)}</td>
            </tr>
            <tr>
              <td colspan="4" style="background-color: #f2f2f2; text-align: left; font-weight: bold; padding: 4px; border: 1px solid #000;">PRECIO DESC. ${form.dsctoBasePorcentaje}%</td>
            </tr>
            <tr>
              <td style="text-align: left; font-weight: bold; padding: 4px; border: 1px solid #000;">UV: ${form.uv} MZN: ${form.mzn} LOTE: ${form.lote}</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000; text-align: center;">${superficieNum > 0 ? superficieNum : ''}</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000;">${precioM2Dscto > 0 ? formatCurrency(precioM2Dscto) : ''}</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000;">${formatCurrency(precioDsctoTotal)}</td>
            </tr>
            <tr>
              <td style="text-align: left; font-weight: bold; padding: 4px; border: 1px solid #000;">NUEVO PRECIO (DSCTO. ${form.dsctoBasePorcentaje}%)</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000; text-align: center;">${superficieNum > 0 ? superficieNum : ''}</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000;">${precioM2Dscto > 0 ? formatCurrency(precioM2Dscto) : ''}</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000;">${formatCurrency(precioDsctoTotal)}</td>
            </tr>
            
            <tr><td colspan="4" style="border-left: 1px solid #000; border-right: 1px solid #000; padding: 6px;"></td></tr>
            
            <tr style="background-color: #c4d79b;">
              <td colspan="3" style="text-align: left; font-weight: bold; padding: 4px; border: 1px solid #000;">CUOTA INICIAL</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000;">${formatCurrency(cuotaInicialNum)}</td>
            </tr>
            <tr><td colspan="4" style="border-left: 1px solid #000; border-right: 1px solid #000; padding: 6px;"></td></tr>
            <tr>
              <td colspan="3" style="text-align: left; font-weight: bold; padding: 4px; border: 1px solid #000;">SALDO A FINANCIAR</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000;">${formatCurrency(saldoFinanciar)}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: left; font-weight: bold; padding: 4px; border: 1px solid #000;">DSCTO ${form.dsctoContadoPorcentaje}% VENTA CONTADO 30 DIAS</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000;">${formatCurrency(montoDsctoContado)}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: left; font-weight: bold; padding: 4px; border: 1px solid #000;">AMORTIZACION ${formatFechaBoliviana(form.fechaAmortizacion)}</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000;">${formatCurrency(montoAmortizacionNum)}</td>
            </tr>
            <tr><td colspan="4" style="border-left: 1px solid #000; border-right: 1px solid #000; padding: 6px;"></td></tr>
            <tr style="background-color: #c4d79b;">
              <td colspan="3" style="text-align: left; font-weight: bold; padding: 4px; border: 1px solid #000;">SALDO A LIQUIDAR POR $US.</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000;">${formatCurrency(saldoLiquidarUsd)}</td>
            </tr>
            <tr style="background-color: #ffff00;">
              <td colspan="3" style="text-align: left; font-weight: bold; padding: 4px; border: 1px solid #000;">EN BOLIVIANOS (T.C. ${form.tc})</td>
              <td style="font-weight: bold; padding: 4px; border: 1px solid #000;">${formatCurrency(saldoLiquidarBs)}</td>
            </tr>
          </tbody>
        </table>

        <p><strong>Justificación Comercial</strong></p>
        <p>El contrato fue ingresado el ${formatFechaBoliviana(form.fechaContrato)}, por lo que el cliente está concretando la cancelación total del lote en el <strong>día ${diasTranscurridos}</strong>, cumpliendo perfectamente con el requisito del periodo de gracia de 30 días para compras al contado de la <strong>campaña vigente del proyecto ${form.proyecto.replace('URBANIZACIÓN ', '')} del ${dsctoTotalCampana}% de descuento por ventas al contado.</strong></p>
        
        <p>Adjunto a este correo las capturas de respaldo del sistema. Quedo atento a tu visto bueno para solicitar la aplicación del descuento con el código de liquidación en plataforma y proceder con el pago.</p>
        
        <p>Saludos cordiales,</p>
        <p><strong>Oscar H. Saravia</strong></p>
      </div>
    `;
  };

  const generarTexto = () => {
    return `Solicitud de autorización de descuento por liquidación al contado para el cliente ${form.cliente}. Ver detalles en el formato HTML.`;
  };

  const asuntoCorreo = `Solicitud de autorización: Descuento ${form.dsctoContadoPorcentaje}% por liquidación al contado — Contrato ${form.contrato || '[Nro]'} (Cliente: ${form.cliente || '[Nombre]'})`;
  // Configuración de copias del correo según tu imagen
  const correosCc = "mreyes@celina.com.bo, maguilar@celina.com.bo, csalvatierra@celina.com.bo, cbarretto@celina.com.bo, elizarraga@celina.com.bo";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-indigo-600" />
          Liquidación al Contado (30 Días)
        </h2>
        <p className="text-slate-500 text-sm mt-1">Generador automático de tabla de descuentos para aprobaciones de gerencia.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        
        {/* PANEL DE FORMULARIO */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center mb-4"><Calculator className="w-5 h-5 mr-2 text-blue-500" /> Datos del Contrato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cliente Titular</label>
                <input type="text" name="cliente" value={form.cliente} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej. Luis Fernando Moreno Herrera" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nro. de Contrato</label>
                <input type="text" name="contrato" value={form.contrato} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej. C2603500529" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha de Contrato</label>
                <input type="date" name="fechaContrato" value={form.fechaContrato} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asesor Comercial</label>
                <input type="text" name="asesor" value={form.asesor} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej. Rodrigo Rojas Siles" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Proyecto</label>
                <select name="proyecto" value={form.proyecto} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="URBANIZACIÓN MUYURINA">Urbanización Muyurina</option>
                  <option value="URBANIZACIÓN SANTA FE">Urbanización Santa Fe</option>
                  <option value="EL RENACER">El Renacer</option>
                  <option value="LOS JARDINES">Los Jardines</option>
                  <option value="RANCHO NUEVO">Rancho Nuevo</option>
                  <option value="CELINA VII FASE 3">Celina VII Fase 3</option>
                  <option value="CAÑAVERAL">Cañaveral</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">UV</label>
                <input type="text" name="uv" value={form.uv} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">MZN</label>
                <input type="text" name="mzn" value={form.mzn} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">LOTE</label>
                <input type="text" name="lote" value={form.lote} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center mb-4"><Percent className="w-5 h-5 mr-2 text-emerald-500" /> Matemática Financiera</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Superficie (m2)</label>
                <input type="number" name="superficie" value={form.superficie} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="300" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Precio Normal / m2 ($)</label>
                <input type="number" name="precioM2" value={form.precioM2} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="145" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">% Descuento Base</label>
                <input type="number" name="dsctoBasePorcentaje" value={form.dsctoBasePorcentaje} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cuota Inicial Pagada ($)</label>
                <input type="number" name="cuotaInicial" value={form.cuotaInicial} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="522" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha de Amortización</label>
                <input type="date" name="fechaAmortizacion" value={form.fechaAmortizacion} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monto Amortizado ($)</label>
                <input type="number" name="montoAmortizacion" value={form.montoAmortizacion} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="5739" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">% Dscto Contado Extra</label>
                <input type="number" name="dsctoContadoPorcentaje" value={form.dsctoContadoPorcentaje} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Cambio (TC)</label>
                <input type="number" name="tc" value={form.tc} step="0.01" onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-amber-50" />
              </div>
            </div>
          </div>
        </div>

        {/* TARJETA DE RESULTADO Y BOTONES DE CORREO */}
        <div className="w-full">
          <ResultCard 
            title="Vista Previa de Liquidación" 
            text={generarTexto()} 
            htmlContent={generarHtml()} 
            subject={asuntoCorreo}
            cc={correosCc}
            supervisorDestino={destinatario} 
            setSupervisorDestino={setDestinatario} 
          />
        </div>
      </div>
    </div>
  );
}
