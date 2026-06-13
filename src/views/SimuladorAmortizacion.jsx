import React, { useState } from 'react';
import { Calculator, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { formatCurrency } from '../utils/formatters';
import { calcularAmortizacion } from '../utils/calculadoras';
import { generarTextoAmortizacionCelular } from '../utils/textTemplates';
import { generarHtmlAmortizacion } from '../utils/htmlTemplates';

export default function SimuladorAmortizacion() {
  const [formAmortizacion, setFormAmortizacion] = useState({ cliente: '', precioContrato: '', cuotaInicial: '', plazoOriginal: '10', cuotasPagadas: '', montoAmortizacion: '' });
  const [supervisorDestino, setSupervisorDestino] = useState('ninguno');
  
  const handleA = (e) => setFormAmortizacion({ ...formAmortizacion, [e.target.name]: e.target.value });
  const calculos = calcularAmortizacion(formAmortizacion);
  
  // Variables matemáticas aseguradas (Blindaje Anti-Errores)
  const costoTotalOriginal = Number(calculos.precioFinalPlazos) || 0;
  const pActualNum = Number(calculos.P_actual) || 0;
  const montoNum = Number(formAmortizacion.montoAmortizacion) || 0;
  const nNewNum = Number(calculos.n_new) || 0;
  const cPuraNum = Number(calculos.C_pura) || 0;
  const cuotasPagadasNum = Number(formAmortizacion.cuotasPagadas) || 0;
  const cuotaIniNum = Number(formAmortizacion.cuotaInicial) || 0;

  const costoTotalNuevo = (pActualNum - montoNum + (nNewNum * cPuraNum) + (cuotasPagadasNum * cPuraNum) + cuotaIniNum) || 0;
  const pctAhorro = costoTotalOriginal > 0 ? ((Number(calculos.ahorrado) || 0) / costoTotalOriginal) * 100 : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><Calculator className="w-6 h-6 mr-2 text-blue-600" /> Simulador de Amortización</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full">
          <Input label="Nombre del Cliente" name="cliente" value={formAmortizacion.cliente} onChange={handleA} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Input label="Precio al Contado ($)" name="precioContrato" value={formAmortizacion.precioContrato} onChange={handleA} type="number" />
            <Input label="Cuota Inicial Pagada ($)" name="cuotaInicial" value={formAmortizacion.cuotaInicial} onChange={handleA} type="number" />
            <Input label="Plazo Original (Años)" name="plazoOriginal" value={formAmortizacion.plazoOriginal} onChange={handleA} type="number" />
            <Input label="Cuotas Ya Pagadas (Meses)" name="cuotasPagadas" value={formAmortizacion.cuotasPagadas} onChange={handleA} type="number" />
          </div>
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
              <label className="block text-sm font-bold text-emerald-800 mb-2">Monto a Amortizar (Abono Extra)</label>
              <div className="flex relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">$</span>
                <input type="number" name="montoAmortizacion" value={formAmortizacion.montoAmortizacion} onChange={handleA} className="w-full pl-8 pr-4 py-3 border-2 border-emerald-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 text-lg font-bold text-emerald-900 bg-white outline-none" placeholder="Ej. 5000" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-6">
          {(Number(calculos.ahorrado) || 0) > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <h3 className="text-center font-black text-slate-800 text-lg mb-6 flex items-center justify-center"><ShieldCheck className="w-5 h-5 mr-2 text-emerald-500"/> Impacto de la Inversión</h3>
              <div className="flex items-end justify-center gap-8 h-40 mb-4 px-4">
                <div className="flex flex-col items-center w-24 group">
                  <span className="text-xs font-bold text-slate-500 mb-2">${formatCurrency(costoTotalOriginal)}</span>
                  <div className="w-full bg-slate-200 rounded-t-lg h-[100%] transition-all"></div>
                  <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Costo Original</span>
                </div>
                <div className="flex flex-col items-center w-24 group relative">
                  <div className="absolute -top-6 bg-emerald-100 text-emerald-700 text-[10px] font-bold py-1 px-2 rounded-full whitespace-nowrap border border-emerald-200 animate-pulse">Ahorras {pctAhorro.toFixed(0)}%</div>
                  <span className="text-xs font-black text-emerald-600 mb-2">${formatCurrency(costoTotalNuevo)}</span>
                  <div className="w-full bg-gradient-to-t from-emerald-400 to-emerald-500 rounded-t-lg transition-all shadow-md" style={{height: `${100 - pctAhorro}%`}}></div>
                  <span className="text-[10px] font-bold text-emerald-600 mt-2 uppercase">Nuevo Costo</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100"><Clock className="w-6 h-6 mx-auto mb-1 text-emerald-500"/><p className="text-xs text-emerald-600 uppercase font-bold">Tiempo Ahorrado</p><p className="text-xl font-black text-emerald-800">{calculos.tiempoAhorrado || 0} Meses</p></div>
                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100"><DollarSign className="w-6 h-6 mx-auto mb-1 text-blue-500"/><p className="text-xs text-blue-600 uppercase font-bold">Dinero Ahorrado</p><p className="text-xl font-black text-blue-800">${formatCurrency(calculos.ahorrado || 0)}</p></div>
              </div>
            </div>
          )}
          <ResultCard title="Enviar Simulación" text={generarTextoAmortizacionCelular(formAmortizacion, calculos)} htmlContent={generarHtmlAmortizacion(formAmortizacion, calculos)} subject={`Simulación Amortización a Capital - ${formAmortizacion.cliente}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
        </div>
      </div>
    </div>
  );
}

