import React, { useState } from 'react';
import { KeyRound, FileText, CheckCircle2 } from 'lucide-react';
import { ResultCard } from '../components/ui/ResultCard';
import { formatCurrency } from '../utils/formatters';

export default function SolicitudesCodigo() {
  const [tipoSolicitud, setTipoSolicitud] = useState('liquidacion'); // 'liquidacion' o 'amortizacion'
  const [destinatario, setDestinatario] = useState('elizarraga@celina.com.bo');
  
  const [form, setForm] = useState({
    cliente: '',
    contrato: '',
    proyecto: 'CELINA MUYURINA',
    uv: '',
    mzn: '',
    lote: '',
    montoAmortizar: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // GENERADOR DEL CUERPO DEL CORREO (IDÉNTICO A TUS IMÁGENES)
  const generarHtml = () => {
    const saludoIntro = "Buenas [SALUDO_AUTO]"; // ResultCard lo cambiará por días/tardes/noches
    
    if (tipoSolicitud === 'liquidacion') {
      return `
        <div style="font-family: Arial, sans-serif; font-size: 14px; color: #000; line-height: 1.6;">
          <p>${saludoIntro}</p>
          <p>Estimado Enrique por favor tu ayuda en el código de liquidación del siguiente cliente:</p>
          <br/>
          <p><strong>Cliente Titular:</strong> ${form.cliente || '___________________'}</p>
          <p><strong>Proyecto:</strong> ${form.proyecto}</p>
          <p><strong>Lote:</strong> UV: ${form.uv} MZN: ${form.mzn} LOTE: ${form.lote}</p>
          <p><strong>Nro. Contrato:</strong> ${form.contrato || '___________________'}</p>
          <br/>
          <p>Muchas gracias de antemano.</p>
          <br/>
          <p>Saludos<br/><strong>Oscar Saravia.</strong></p>
        </div>
      `;
    } else {
      const montoFormateado = form.montoAmortizar ? formatCurrency(parseFloat(form.montoAmortizar)) : '0';
      return `
        <div style="font-family: Arial, sans-serif; font-size: 14px; color: #000; line-height: 1.6;">
          <p>${saludoIntro}</p>
          <p>Estimado Enrique por favor tu ayuda con el código de amortización por un monto de $${montoFormateado}:</p>
          <br/>
          <p><strong>Cliente Titular:</strong> ${form.cliente || '___________________'}</p>
          <p><strong>Proyecto:</strong> ${form.proyecto}</p>
          <p><strong>Lote:</strong> UV: ${form.uv} MZN: ${form.mzn} LOTE: ${form.lote}</p>
          <p><strong>Nro. Contrato:</strong> ${form.contrato || '___________________'}</p>
          <br/>
          <p>Muchas gracias de antemano.</p>
          <br/>
          <p>Saludos<br/><strong>Oscar Saravia.</strong></p>
        </div>
      `;
    }
  };

  const generarTextoPlano = () => {
    if (tipoSolicitud === 'liquidacion') {
      return `Estimado Enrique por favor tu ayuda en el código de liquidación del cliente: ${form.cliente} - Contrato: ${form.contrato}`;
    } else {
      return `Estimado Enrique por favor tu ayuda con el código de amortización por un monto de $${form.montoAmortizar} para el cliente: ${form.cliente} - Contrato: ${form.contrato}`;
    }
  };

  // ASUNTOS IDÉNTICOS A TUS CAPTURAS
  const asuntoCorreo = tipoSolicitud === 'liquidacion'
    ? `Solicitud de código de liquidación Cliente Titular: ${form.cliente || '[Cliente]'} ${form.contrato || '[Contrato]'}`
    : `solicitud de codigo de amortizacion por un monto de $${form.montoAmortizar ? formatCurrency(parseFloat(form.montoAmortizar)) : '0'} Nro. Contrato: ${form.contrato || '[Contrato]'}`;

  // CC idéntico a tus capturas
  const correoCc = "omendoza@celina.com.bo";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <KeyRound className="w-6 h-6 mr-2 text-indigo-600" />
            Solicitud de Códigos en Plataforma
          </h2>
          <p className="text-slate-500 text-sm mt-1">Envío rápido de órdenes para Enrique Lizarraga (Plataforma).</p>
        </div>

        {/* SELECTOR VIP DE TIPO DE CÓDIGO */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
          <button
            onClick={() => setTipoSolicitud('liquidacion')}
            className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold transition-all ${tipoSolicitud === 'liquidacion' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            📄 Cód. Liquidación
          </button>
          <button
            onClick={() => setTipoSolicitud('amortizacion')}
            className={`flex items-center px-4 py-2 rounded-lg text-xs font-bold transition-all ${tipoSolicitud === 'amortizacion' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            💰 Cód. Amortización
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        {/* FORMULARIO */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3 text-sm font-bold text-slate-700">
            <span>{tipoSolicitud === 'liquidacion' ? 'Datos para Código de Liquidación' : 'Datos para Código de Amortización'}</span>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">CC: Olivia Mendoza</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cliente Titular</label>
              <input type="text" name="cliente" value={form.cliente} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold" placeholder="Ej. GERBACIO RICHAR ROJAS SILES" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nro. de Contrato</label>
              <input type="text" name="contrato" value={form.contrato} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-700" placeholder="Ej. C2403500736" />
            </div>

            {tipoSolicitud === 'amortizacion' && (
              <div className="animate-in fade-in duration-300">
                <label className="block text-xs font-bold text-emerald-600 uppercase mb-1">Monto a Amortizar ($)</label>
                <input type="number" name="montoAmortizar" value={form.montoAmortizar} onChange={handleChange} className="w-full px-4 py-2 border border-emerald-300 bg-emerald-50/30 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-black text-emerald-700" placeholder="Ej. 7174" />
              </div>
            )}

            <div className={tipoSolicitud === 'liquidacion' ? 'md:col-span-1' : 'md:col-span-2'}>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Proyecto</label>
              <select name="proyecto" value={form.proyecto} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-semibold">
                <option value="CELINA MUYURINA">CELINA MUYURINA</option>
                <option value="CELINA SANTA FE">CELINA SANTA FE</option>
                <option value="EL RENACER">EL RENACER</option>
                <option value="LOS JARDINES">LOS JARDINES</option>
                <option value="RANCHO NUEVO">RANCHO NUEVO</option>
                <option value="CELINA VII FASE 3">CELINA VII FASE 3</option>
                <option value="CAÑAVERAL">CAÑAVERAL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">UV</label>
              <input type="text" name="uv" value={form.uv} onChange={handleChange} className="w-full px-3 py-1.5 border rounded-lg text-center font-bold" placeholder="49" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">MZN</label>
              <input type="text" name="mzn" value={form.mzn} onChange={handleChange} className="w-full px-3 py-1.5 border rounded-lg text-center font-bold" placeholder="37" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">LOTE</label>
              <input type="text" name="lote" value={form.lote} onChange={handleChange} className="w-full px-3 py-1.5 border rounded-lg text-center font-bold" placeholder="16" />
            </div>
          </div>
        </div>

        {/* VISTA PREVIA CORREO */}
        <div className="w-full">
          <ResultCard 
            title={tipoSolicitud === 'liquidacion' ? 'Orden Cód. Liquidación' : 'Orden Cód. Amortización'} 
            text={generarTextoPlano()} 
            htmlContent={generarHtml()} 
            subject={asuntoCorreo}
            cc={correoCc}
            supervisorDestino={destinatario} 
            setSupervisorDestino={setDestinatario} 
          />
        </div>
      </div>
    </div>
  );
}
