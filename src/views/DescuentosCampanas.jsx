import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import { ResultCard } from '../components/ui/ResultCard';

export default function DescuentosCampanas() {
  const [form, setForm] = useState({
    asesor: '',
    cliente: '',
    proyecto: 'CELINA MUYURINA',
    uv: '', mzn: '', lote: '',
    superficie: '',
    tipoVenta: 'CONTADO' // 'CONTADO' o 'CRÉDITO'
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // CÁLCULO DE LA NUEVA MÉTRICA
  const factor = form.tipoVenta === 'CONTADO' ? 2 : 1;
  const descuentoDolares = (parseFloat(form.superficie || 0) * factor).toFixed(2);

  const generarHtml = () => `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #000; line-height: 1.6;">
      <p>Buenas [SALUDO_AUTO]</p>
      <p>Estimado/a, por favor su ayuda con la autorización de descuento para el siguiente cliente:</p>
      <br/>
      <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px; border: 1px solid #ddd;">
        <tr style="background-color: #f8fafc;">
          <th style="padding: 8px; border: 1px solid #ddd;">Cliente</th>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${form.cliente || '---'}</td>
        </tr>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd;">Proyecto</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${form.proyecto}</td>
        </tr>
        <tr style="background-color: #f8fafc;">
          <th style="padding: 8px; border: 1px solid #ddd;">Lote</th>
          <td style="padding: 8px; border: 1px solid #ddd;">UV: ${form.uv} - MZN: ${form.mzn} - LOTE: ${form.lote}</td>
        </tr>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd;">Superficie</th>
          <td style="padding: 8px; border: 1px solid #ddd;">${form.superficie || '0'} m2</td>
        </tr>
        <tr style="background-color: #f8fafc;">
          <th style="padding: 8px; border: 1px solid #ddd;">Tipo de Venta</th>
          <td style="padding: 8px; border: 1px solid #ddd; color: #0072c6; font-weight: bold;">${form.tipoVenta} ($${factor}/m2)</td>
        </tr>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd; background-color: #ffe699;">Descuento Total</th>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #fff2cc; color: #d97706;">$${descuentoDolares}</td>
        </tr>
      </table>
      <br/>
      <p>Saludos cordiales,<br/><strong>${form.asesor || 'Asesor Comercial'}</strong></p>
    </div>
  `;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center mb-6"><Tag className="w-6 h-6 mr-2 text-indigo-600" /> Solicitud de Descuento</h2>
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-slate-500 uppercase">Asesor</label><input type="text" name="asesor" value={form.asesor} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase">Cliente</label><input type="text" name="cliente" value={form.cliente} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" /></div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Proyecto</label>
              <select name="proyecto" value={form.proyecto} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl bg-white"><option value="CELINA MUYURINA">CELINA MUYURINA</option><option value="CELINA SANTA FE">CELINA SANTA FE</option><option value="EL RENACER">EL RENACER</option></select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Tipo de Venta</label>
              <select name="tipoVenta" value={form.tipoVenta} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl bg-slate-50 font-bold text-blue-700">
                <option value="CONTADO">CONTADO ($2 / m2)</option>
                <option value="CRÉDITO">CRÉDITO ($1 / m2)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-4">
            <div><label className="block text-xs font-bold text-slate-500 uppercase">UV</label><input type="text" name="uv" onChange={handleChange} className="w-full px-3 py-2 border rounded-xl text-center" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase">MZN</label><input type="text" name="mzn" onChange={handleChange} className="w-full px-3 py-2 border rounded-xl text-center" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase">Lote</label><input type="text" name="lote" onChange={handleChange} className="w-full px-3 py-2 border rounded-xl text-center" /></div>
            <div><label className="block text-xs font-bold text-amber-600 uppercase">M2 Sup.</label><input type="number" name="superficie" onChange={handleChange} className="w-full px-3 py-2 border border-amber-300 bg-amber-50 rounded-xl text-center font-bold" /></div>
          </div>
        </div>
        <ResultCard title="Solicitud de Descuento" text={`Descuento para ${form.cliente}`} htmlContent={generarHtml()} subject={`Solicitud de Descuento - ${form.cliente}`} />
      </div>
    </div>
  );
}
