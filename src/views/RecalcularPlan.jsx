import React, { useState, useMemo } from 'react';
import { Calculator, RefreshCw, Calendar, DollarSign, FileText, ChevronRight, Clock, RotateCcw, Eye, EyeOff } from 'lucide-react';

export default function RecalcularPlan() {
  // ================= 1. ESTADO DEL FORMULARIO =================
  const [form, setForm] = useState({
    cliente: '',
    nroContrato: '',
    precioTotalOriginal: '',
    cuotaInicial: '',
    plazoMesesOriginal: '',
    seguroMensual: '',
    saldoCapital: '', 
    cuotasPagadas: '0', 
    nuevoPlazoMeses: '168' 
  });

  const TASA_MENSUAL = 0.0101444; 

  const [calculado, setCalculado] = useState(false);
  const [tabActiva, setTabActiva] = useState('RESUMEN'); 
  const [ocultarDetalles, setOcultarDetalles] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ================= 2. MOTOR MATEMÁTICO (CLON EXACTO DE CELINA) =================
  const calculos = useMemo(() => {
    const P_total_Orig = parseFloat(form.precioTotalOriginal) || 0;
    const Enganche = parseFloat(form.cuotaInicial) || 0;
    const Seguro = parseFloat(form.seguroMensual) || 0;
    const pagadas = parseInt(form.cuotasPagadas) || 0;
    const n_orig = parseInt(form.plazoMesesOriginal) || 120;
    const n_nuevo_total = parseInt(form.nuevoPlazoMeses) || 168;

    const Cuota_Total_Orig = n_orig > 0 ? (P_total_Orig - Enganche) / n_orig : 0; 
    
    // --- INTELIGENCIA DE DEDUCCIÓN DE CAPITAL ---
    let Capital_Actual = parseFloat(form.saldoCapital);
    
    if (!Capital_Actual) {
      const Cuota_Pura_Orig = Math.max(0, Cuota_Total_Orig - Seguro);
      let PV_Original = 0;
      if (TASA_MENSUAL > 0 && n_orig > 0) {
        PV_Original = Cuota_Pura_Orig * (1 - Math.pow(1 + TASA_MENSUAL, -n_orig)) / TASA_MENSUAL;
      }
      // Redondeo inteligente a la decena más cercana para igualar el precio real del lote del CRM
      Capital_Actual = Math.round(PV_Original / 10) * 10; 
    }

    const cuotasRestantesNuevas = n_nuevo_total - pagadas;
    let Cuota_Pura_Nueva = 0;
    
    if (cuotasRestantesNuevas > 0 && Capital_Actual > 0) {
      Cuota_Pura_Nueva = Capital_Actual * (TASA_MENSUAL * Math.pow(1 + TASA_MENSUAL, cuotasRestantesNuevas)) / (Math.pow(1 + TASA_MENSUAL, cuotasRestantesNuevas) - 1);
      // REGLA DEL SISTEMA: Redondeo a 2 decimales para la cuota fija
      Cuota_Pura_Nueva = Math.round(Cuota_Pura_Nueva * 100) / 100; 
    }
    
    const Cuota_Total_Nueva = Cuota_Pura_Nueva + Seguro;

    let tabla = [];
    let CapTemp = Capital_Actual;
    let Total_Nuevo_Financiado = 0;

    for (let i = 1; i <= cuotasRestantesNuevas; i++) {
      let interes = Math.round(CapTemp * TASA_MENSUAL * 100) / 100;
      let capital = Math.round((Cuota_Pura_Nueva - interes) * 100) / 100;
      let seguroAplicado = Seguro;
      
      // REGLA DEL SISTEMA: Última cuota ajusta centavos y elimina seguro
      if (i === cuotasRestantesNuevas) {
        capital = CapTemp;
        interes = Math.round(CapTemp * TASA_MENSUAL * 100) / 100; 
        seguroAplicado = 0; 
      }
      
      CapTemp -= capital;
      CapTemp = Math.round(CapTemp * 100) / 100;

      const pagoMes = Math.round((capital + interes + seguroAplicado) * 100) / 100;
      Total_Nuevo_Financiado += pagoMes;

      tabla.push({
        periodo: pagadas + i,
        capital: capital,
        plusvalia: interes,
        cuotaBase: Math.round((capital + interes) * 100) / 100,
        seguro: seguroAplicado,
        pagoTotal: pagoMes,
        balance: 0, 
        pagada: 'NO'
      });
    }

    // Balance Decreciente exacto (Deuda Total Restante)
    let balanceDescendente = Total_Nuevo_Financiado;
    tabla = tabla.map(row => {
      balanceDescendente -= row.pagoTotal;
      return { ...row, balance: Math.max(0, Math.round(balanceDescendente * 100) / 100) };
    });

    const Monto_Total_Plan_Pago = Total_Nuevo_Financiado;
    const Monto_Total_Contrato = Monto_Total_Plan_Pago + Enganche;

    return {
      Cuota_Total_Orig, Cuota_Total_Nueva, Seguro, Capital_Actual,
      Monto_Total_Contrato, Monto_Total_Plan_Pago, Enganche,
      n_nuevo_total, cuotasRestantesNuevas, tabla,
      ultimaCuota: tabla.length > 0 ? tabla[tabla.length - 1].pagoTotal : 0
    };
  }, [form]);

  const fD = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num || 0);

  // ================= 3. INTERFAZ GRÁFICA =================
  return (
    <div className="font-sans bg-[#f0f2f5] min-h-screen p-4 xl:p-8 pb-12">
      
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center">
            <div className="bg-emerald-100 p-2.5 rounded-xl mr-4">
              <RefreshCw className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 uppercase tracking-wide">Recalcular Plan de Pagos</h1>
              <p className="text-[11px] text-slate-500 font-medium">Motor de reestructuración 100% sincronizado al sistema original</p>
            </div>
          </div>
          {calculado && (
            <button 
              onClick={() => setCalculado(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-[11px] font-bold transition-colors flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Nueva Reestructuración
            </button>
          )}
        </div>

        {/* PANEL DE CONFIGURACIÓN LIMPIO (SIN PROYECTO) */}
        <div className={"bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all " + (calculado ? "opacity-70 pointer-events-none" : "")}>
          <div className="bg-slate-800 p-4 border-b border-slate-700">
            <h2 className="text-xs font-bold text-white flex items-center tracking-widest uppercase">
              <FileText className="w-4 h-4 mr-2 text-blue-400" /> Datos Extraídos del Contrato
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
            
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cliente Titular</label>
              <input type="text" name="cliente" value={form.cliente} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500 font-bold text-slate-700 bg-slate-50" />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nro Contrato</label>
              <input type="text" name="nroContrato" value={form.nroContrato} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500 font-bold text-slate-700 bg-slate-50" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Total Orig. ($)</label>
              <input type="number" name="precioTotalOriginal" value={form.precioTotalOriginal} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500 font-black text-slate-800" />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">C. Inicial ($)</label>
              <input type="number" name="cuotaInicial" value={form.cuotaInicial} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500 font-bold text-slate-800" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Plazo (Meses)</label>
              <input type="number" name="plazoMesesOriginal" value={form.plazoMesesOriginal} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500 font-bold text-slate-800" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Seguro Mensual ($)</label>
              <input type="number" name="seguroMensual" value={form.seguroMensual} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-emerald-500 font-bold text-slate-800" />
            </div>
            
            <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200">
              <label className="block text-[10px] font-black text-blue-700 uppercase mb-1">Saldo Capital a Cancelar</label>
              <input type="number" name="saldoCapital" value={form.saldoCapital} onChange={handleChange} placeholder="Opcional: Dato exacto del CRM" className="w-full px-3 py-2 border border-blue-300 rounded text-xs outline-none focus:border-blue-600 font-black text-blue-900 bg-white shadow-inner" />
            </div>

          </div>

          <div className="bg-emerald-50/50 p-5 border-t border-slate-100 flex flex-col md:flex-row items-end justify-between gap-4">
            <div className="flex gap-5 w-full md:w-auto">
              <div className="w-full md:w-48">
                <label className="block text-[10px] font-black text-emerald-700 uppercase mb-1">Cuotas Ya Pagadas</label>
                <input type="number" name="cuotasPagadas" value={form.cuotasPagadas} onChange={handleChange} className="w-full px-3 py-3 border-2 border-emerald-200 rounded-lg text-sm outline-none focus:border-emerald-500 font-black text-emerald-800 bg-white shadow-sm" />
              </div>
              <div className="w-full md:w-64">
                <label className="block text-[10px] font-black text-blue-700 uppercase mb-1">Nuevo Plazo Total</label>
                <select name="nuevoPlazoMeses" value={form.nuevoPlazoMeses} onChange={handleChange} className="w-full px-3 py-3 border-2 border-blue-300 rounded-lg text-sm outline-none focus:border-blue-500 font-black text-blue-800 bg-white shadow-sm cursor-pointer">
                  {[...Array(14)].map((_, index) => {
                    const anios = index + 1;
                    const meses = anios * 12;
                    return (
                      <option key={meses} value={meses}>
                        {meses} Meses ({anios} {anios === 1 ? 'Año' : 'Años'})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {!calculado && (
              <button 
                onClick={() => {
                  if(!form.precioTotalOriginal || !form.plazoMesesOriginal) {
                    alert("Por favor ingrese el Total Original y el Plazo Original para continuar.");
                    return;
                  }
                  setCalculado(true);
                }}
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center transition-all shadow-lg hover:shadow-emerald-600/30 transform hover:-translate-y-0.5"
              >
                <Calculator className="w-5 h-5 mr-2" /> Calcular Nuevo Plan
              </button>
            )}
          </div>
        </div>

        {/* ================= RESULTADOS ================= */}
        {calculado && (
          <div className="animate-in slide-in-from-bottom-8 duration-500 fade-in bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
            
            <div className="flex border-b border-slate-200 bg-slate-50 px-2 pt-2 justify-between items-center pr-4">
              <div className="flex">
                <button 
                  onClick={() => setTabActiva('RESUMEN')}
                  className={"px-6 py-3 text-[11px] uppercase tracking-wider font-black rounded-t-lg transition-colors " + (tabActiva === 'RESUMEN' ? 'bg-white text-emerald-600 border-t-2 border-emerald-600 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100')}
                >
                  Resumen General
                </button>
                <button 
                  onClick={() => setTabActiva('TABLA')}
                  className={"px-6 py-3 text-[11px] uppercase tracking-wider font-black rounded-t-lg transition-colors " + (tabActiva === 'TABLA' ? 'bg-white text-emerald-600 border-t-2 border-emerald-600 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100')}
                >
                  Plan de Pagos
                </button>
              </div>
              
              {tabActiva === 'TABLA' && (
                <button 
                  onClick={() => setOcultarDetalles(!ocultarDetalles)}
                  className="flex items-center text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
                >
                  {ocultarDetalles ? <Eye className="w-3.5 h-3.5 mr-1.5" /> : <EyeOff className="w-3.5 h-3.5 mr-1.5" />}
                  {ocultarDetalles ? 'Mostrar Interés/Seguro' : 'Ocultar al Cliente'}
                </button>
              )}
            </div>

            <div className="p-6">
              
              {tabActiva === 'RESUMEN' && (
                <div className="animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
                          <span className="text-[11px] font-bold text-slate-500 uppercase">Monto Total en Contrato</span>
                          <span className="text-lg font-black text-slate-800">{fD(calculos.Monto_Total_Contrato)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
                          <span className="text-[11px] font-bold text-slate-500 uppercase">Monto Cuota Inicial</span>
                          <span className="text-sm font-bold text-slate-700">{fD(calculos.Enganche)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-1">
                          <span className="text-[11px] font-bold text-slate-500 uppercase">Monto Total Plan de Pago</span>
                          <span className="text-sm font-bold text-slate-700">{fD(calculos.Monto_Total_Plan_Pago)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 shadow-sm">
                          <Clock className="w-5 h-5 text-blue-500 mb-2" />
                          <span className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Nuevo Plazo</span>
                          <span className="block text-xl font-black text-blue-900">{calculos.n_nuevo_total / 12} Años</span>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 shadow-sm">
                          <Calendar className="w-5 h-5 text-amber-500 mb-2" />
                          <span className="block text-[10px] font-bold text-amber-600 uppercase mb-1">Períodos Totales</span>
                          <span className="block text-xl font-black text-amber-900">{calculos.n_nuevo_total} Meses</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 opacity-10">
                        <DollarSign className="w-48 h-48" />
                      </div>
                      
                      <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Variación de Cuotas Mensuales</h3>
                      
                      <div className="flex items-end justify-between mb-8 relative z-10">
                        <div>
                          <span className="block text-[11px] font-medium text-slate-400 mb-1">Cuota Anterior Estimada</span>
                          <span className="text-2xl font-black text-slate-300 line-through decoration-red-500/50">{fD(calculos.Cuota_Total_Orig)}</span>
                        </div>
                        <div className="bg-slate-700/50 p-2 rounded-full mx-4">
                          <ChevronRight className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="text-right">
                          <span className="block text-[11px] font-bold text-emerald-400 mb-1 uppercase tracking-wider">Nueva Cuota</span>
                          <span className="text-4xl font-black text-white">{fD(calculos.Cuota_Total_Nueva)}</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 relative z-10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] text-slate-400 font-medium">Cuota Mensual por Seguro:</span>
                          <span className="text-xs font-bold">{fD(calculos.Seguro)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] text-slate-400 font-medium">Cuota Mensual por CBDI:</span>
                          <span className="text-xs font-bold">$0.00</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                          <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">Última Cuota a Pagar:</span>
                          <span className="text-sm font-black text-emerald-400">{fD(calculos.ultimaCuota)}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {tabActiva === 'TABLA' && (
                <div className="animate-in fade-in duration-300 overflow-hidden border border-slate-200 rounded-xl flex flex-col xl:flex-row">
                  
                  <div className="w-full xl:w-[60%] overflow-auto max-h-[600px] border-r border-slate-200">
                    <table className="w-full border-collapse text-[11px]">
                      <thead className="bg-slate-100 sticky top-0 shadow-sm z-10">
                        <tr>
                          <th className="p-3 border-b border-slate-200 font-bold text-slate-600 text-center uppercase tracking-wider">Período</th>
                          <th className="p-3 border-b border-slate-200 font-bold text-slate-600 text-right uppercase tracking-wider">Capital</th>
                          {!ocultarDetalles && <th className="p-3 border-b border-slate-200 font-bold text-slate-600 text-right uppercase tracking-wider bg-slate-50">Plusvalía</th>}
                          {!ocultarDetalles && <th className="p-3 border-b border-slate-200 font-bold text-slate-600 text-right uppercase tracking-wider bg-slate-50">Cuota Pura</th>}
                          {!ocultarDetalles && <th className="p-3 border-b border-slate-200 font-bold text-slate-600 text-right uppercase tracking-wider bg-slate-50">Seguro</th>}
                          <th className="p-3 border-b border-slate-200 font-black text-blue-700 text-right uppercase tracking-wider">Total Pago</th>
                          <th className="p-3 border-b border-slate-200 font-bold text-slate-600 text-right uppercase tracking-wider">Balance Principal</th>
                          <th className="p-3 border-b border-slate-200 font-bold text-slate-600 text-center uppercase tracking-wider">Pagada</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculos.tabla.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-slate-700">
                            <td className="p-2.5 text-center font-medium">{row.periodo}</td>
                            <td className="p-2.5 text-right">{fD(row.capital)}</td>
                            {!ocultarDetalles && <td className="p-2.5 text-right bg-slate-50/50">{fD(row.plusvalia)}</td>}
                            {!ocultarDetalles && <td className="p-2.5 text-right bg-slate-50/50">{fD(row.cuotaBase)}</td>}
                            {!ocultarDetalles && <td className="p-2.5 text-right bg-slate-50/50">{fD(row.seguro)}</td>}
                            <td className="p-2.5 text-right font-bold text-slate-800">{fD(row.pagoTotal)}</td>
                            <td className="p-2.5 text-right font-medium">{fD(row.balance)}</td>
                            <td className="p-2.5 text-center font-bold text-slate-300">{row.pagada}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="w-full xl:w-[40%] bg-slate-50 p-5">
                    <h4 className="font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4 text-[11px] uppercase tracking-wider">Básicos de Contrato</h4>
                    <div className="space-y-3 text-[10px]">
                      <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500 font-medium w-1/3">Cliente(s):</span><span className="text-blue-600 font-bold w-2/3 uppercase text-right">{form.cliente || '---'}</span></div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500 font-medium w-1/3">Realizado Por:</span><span className="text-slate-800 w-2/3 uppercase text-right">ADMINISTRADOR CRM</span></div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500 font-medium w-1/3">Fecha Contrato:</span><span className="text-slate-800 w-2/3 text-right">HOY</span></div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500 font-medium w-1/3">Capital Base:</span><span className="text-slate-800 font-bold w-2/3 uppercase text-right">{fD(calculos.Capital_Actual)}</span></div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
