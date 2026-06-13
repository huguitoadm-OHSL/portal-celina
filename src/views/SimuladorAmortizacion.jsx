import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, AlertTriangle } from 'lucide-react';

// Componentes UI
import { Input } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';

// Utilidades Lógicas
import { formatCurrency } from '../utils/formatters';
import { calcularSimulacionAmortizacion } from '../utils/calculadoras';
import { generarTextoAmortizacionCelular } from '../utils/textTemplates';
import { generarHtmlAmortizacion } from '../utils/htmlTemplates';

export default function SimuladorAmortizacion() {
  const [formAmortizacion, setFormAmortizacion] = useState({
    cliente: '', precioContrato: '', cuotaInicial: '', plazoOriginal: '', cuotasPagadas: '', seguroMensual: '', tasaAnual: '12.1733', montoAmortizacion: ''
  });

  const handleAmortizacionChange = (e) => setFormAmortizacion({ ...formAmortizacion, [e.target.name]: e.target.value });

  // AUTO-CÁLCULO DEL SEGURO DE VIDA
  useEffect(() => {
    const pv = parseFloat(formAmortizacion.precioContrato?.toString().replace(/,/g, '')) || 0;
    const ci = parseFloat(formAmortizacion.cuotaInicial?.toString().replace(/,/g, '')) || 0;
    const cap = Math.max(0, pv - ci);
    if (cap > 0) {
       const seg = (cap * 0.00077).toFixed(2); // Fórmula: 0.77 por cada 1000
       setFormAmortizacion(prev => ({...prev, seguroMensual: seg}));
    } else {
       setFormAmortizacion(prev => ({...prev, seguroMensual: ''}));
    }
  }, [formAmortizacion.precioContrato, formAmortizacion.cuotaInicial]);

  // Ejecutamos los cálculos en tiempo real
  const calculos = calcularSimulacionAmortizacion(formAmortizacion);
  const { P, C_pura, S, C_total, precioFinalPlazos, P_actual, cuotasRestantesOrig, saldoNuevo, n_new, tiempoAhorrado, ahorrado, n, error } = calculos;

  const textoWhatsApp = generarTextoAmortizacionCelular(formAmortizacion, calculos);
  const textoHtml = generarHtmlAmortizacion(formAmortizacion, calculos);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Calculator className="w-6 h-6 mr-2 text-blue-600" /> Simulador de Amortización a Capital
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-[1fr_450px] 2xl:grid-cols-[1fr_500px] gap-8 w-full">
        
        {/* CONTROLES IZQUIERDA */}
        <div className="w-full min-w-0 flex flex-col gap-6">
          
          {/* Formulario de Inputs */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <Input label="Nombre del Cliente (Opcional)" name="cliente" value={formAmortizacion.cliente} onChange={handleAmortizacionChange} placeholder="Ej. Juan Pérez" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1 w-full mt-2">
              <Input label="Precio de Contrato ($)" name="precioContrato" value={formAmortizacion.precioContrato} onChange={handleAmortizacionChange} placeholder="Ej. 24384.14" />
              <Input label="Cuota Inicial ($)" name="cuotaInicial" value={formAmortizacion.cuotaInicial} onChange={handleAmortizacionChange} placeholder="Ej. 366.00" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-1 w-full">
              <Input label="Plazo Original (Años)" name="plazoOriginal" value={formAmortizacion.plazoOriginal} onChange={handleAmortizacionChange} placeholder="Ej. 10" type="number" />
              <Input label="Cuotas Pagadas (Meses)" name="cuotasPagadas" value={formAmortizacion.cuotasPagadas} onChange={handleAmortizacionChange} placeholder="Ej. 12" type="number" />
              <Input label="Seguro Mensual ($)" name="seguroMensual" value={formAmortizacion.seguroMensual} onChange={handleAmortizacionChange} placeholder="Ej. 18.48" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1 w-full border-t border-slate-100 pt-4 mt-2">
              <Input label="Tasa Anual (%)" name="tasaAnual" value={formAmortizacion.tasaAnual} onChange={handleAmortizacionChange} placeholder="Ej. 12.1733" />
              <Input label="Monto a Amortizar ($)" name="montoAmortizacion" value={formAmortizacion.montoAmortizacion} onChange={handleAmortizacionChange} placeholder="Ej. 5000" className="[&_input]:bg-emerald-50 [&_input]:border-emerald-200 [&_input]:text-emerald-800 [&_label]:text-emerald-700" />
            </div>

            {/* Recuadro de Detalle del Sistema (Francés) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Detalle del Sistema (Francés)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-600">Capital Financiado:</span>
                  <span className="font-extrabold text-slate-800">$ {formatCurrency(P)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-600">Cuota Total (C+I+S):</span>
                  <span className="font-extrabold text-slate-800">$ {formatCurrency(C_total)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-600">Precio Final a Plazos:</span>
                  <span className="font-extrabold text-slate-800">$ {formatCurrency(precioFinalPlazos)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-600">Saldo Capital Actual:</span>
                  <span className="font-extrabold text-blue-600">$ {formatCurrency(P_actual)}</span>
                </div>
              </div>
              {error && (
                 <div className="mt-3 text-xs font-bold text-red-500 flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> {error}</div>
              )}
            </div>
          </div>

          {/* Impacto Dashboard */}
          <div className="bg-[#171b36] rounded-2xl p-6 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <h3 className="text-sm font-bold text-white mb-6 flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-indigo-400" /> Impacto de la Amortización</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#24294a] rounded-xl p-5 border border-white/5">
                <p className="text-[10px] text-indigo-200 mb-1 font-bold uppercase tracking-wider">Cuotas Restantes</p>
                <p className="text-3xl font-black text-white">{cuotasRestantesOrig} <span className="text-xs font-medium text-indigo-200/70">meses</span></p>
              </div>
              <div className="bg-[#143e46] rounded-xl p-5 border border-[#1e5860] relative overflow-hidden">
                <p className="text-[10px] text-emerald-200 mb-1 font-bold uppercase tracking-wider relative z-10">Nuevas Cuotas</p>
                <p className="text-3xl font-black text-emerald-400 relative z-10">{n_new} <span className="text-xs font-medium text-emerald-500/70">meses</span></p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-white/10 pt-5">
              <div>
                <p className="text-[10px] text-indigo-300 mb-1 font-bold uppercase tracking-wider">Tiempo Ahorrado</p>
                <p className="text-lg font-bold text-white">{tiempoAhorrado} meses</p>
              </div>
              <div>
                <p className="text-[10px] text-indigo-300 mb-1 font-bold uppercase tracking-wider">Ahorro ($ Estimado)</p>
                <p className="text-lg font-bold text-emerald-400">$ {formatCurrency(ahorrado)}</p>
              </div>
            </div>
          </div>

        </div>

        {/* RESULTADO DERECHA */}
        <div className="w-full min-w-0">
          <ResultCard 
            title="Resumen para el Cliente" 
            text={textoWhatsApp} 
            htmlContent={textoHtml} 
            subject={`Simulación de Abono a Capital`} 
            hideDestino={true}
          />
        </div>
      </div>
    </div>
  );
}


