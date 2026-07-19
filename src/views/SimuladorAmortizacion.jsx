import React, { useState, useMemo } from 'react';
import { Calculator, Calendar, DollarSign, FileText, ChevronRight, Clock, RotateCcw, Eye, EyeOff, TrendingDown, CheckCircle2 } from 'lucide-react';

export default function SimuladorAmortizacion() {
  // ================= 1. ESTADO DEL FORMULARIO =================
  const [form, setForm] = useState({
    cliente: '',
    cuotaTotalActual: '', // Ej. 415.76
    seguroMensual: '',    // Ej. 23.80
    saldoCapital: '',     // Ej. 27130.00
    montoAmortizar: '',   // Ej. 3000
    cuotasPagadas: '0', 
  });

  const TASA_MENSUAL = 0.0101444; // 1.01444% Exacto de Celina

  const [calculado, setCalculado] = useState(false);
  const [tabActiva, setTabActiva] = useState('RESUMEN'); 
  const [ocultarDetalles, setOcultarDetalles] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ================= 2. MOTOR MATEMÁTICO (CLON BANCARIO 100% EXACTO) =================
  const calculos = useMemo(() => {
    const Cuota_Total_Actual = parseFloat(form.cuotaTotalActual) || 0;
    const Seguro_Num = parseFloat(form.seguroMensual) || 0;
    const Capital_Actual = parseFloat(form.saldoCapital) || 0;
    const Abono = parseFloat(form.montoAmortizar) || 0;
    const pagadas = parseInt(form.cuotasPagadas) || 0;

    // Cuota Fija Pura extraída matemáticamente
    const Cuota_Pura_Fija = Math.round((Cuota_Total_Actual - Seguro_Num) * 100) / 100;
    
    // Convertimos todo a CENTAVOS para procesar el algoritmo bancario sin perder 1 solo decimal
    const SeguroCents = Math.round(Seguro_Num * 100);
    const CuotaPuraFijaCents = Math.round(Cuota_Pura_Fija * 100);

    // ---------------------------------------------------------
    // A. PROYECTAR PLAN ORIGINAL (Para calcular ahorros reales)
    // ---------------------------------------------------------
    let CapTempOrigCents = Math.round(Capital_Actual * 100);
    let Suma_Original_Cents = 0;
    let cuotas_originales = 0;

    if (CapTempOrigCents > 0 && CuotaPuraFijaCents > 0) {
        while (CapTempOrigCents > 0 && cuotas_originales < 400) {
          cuotas_originales++;
          let interesCents = Math.round(CapTempOrigCents * TASA_MENSUAL);
          let capitalCents = CuotaPuraFijaCents - interesCents;

          if (CapTempOrigCents - capitalCents <= 0) {
            capitalCents = CapTempOrigCents;
            interesCents = Math.round(CapTempOrigCents * TASA_MENSUAL);
          }

          CapTempOrigCents -= capitalCents;
          Suma_Original_Cents += (capitalCents + interesCents + SeguroCents);
        }
    }

    // ---------------------------------------------------------
    // B. PROYECTAR PLAN AMORTIZADO (Con reducción de plazo)
    // ---------------------------------------------------------
    let CapTempAmortCents = Math.round(Math.max(0, Capital_Actual - Abono) * 100);
    let Suma_Amortizada_Cents = 0;
    let cuotas_nuevas = 0;
    let tabla = [];

    if (CapTempAmortCents > 0 && CuotaPuraFijaCents > 0) {
        while (CapTempAmortCents > 0 && cuotas_nuevas < 400) {
          cuotas_nuevas++;
          let interesCents = Math.round(CapTempAmortCents * TASA_MENSUAL);
          let capitalCents = CuotaPuraFijaCents - interesCents;

          // REGLA DE CIERRE BANCARIO: Última cuota absorbe el saldo exacto restante y SÍ cobra seguro
          if (CapTempAmortCents - capitalCents <= 0) {
            capitalCents = CapTempAmortCents;
            interesCents = Math.round(CapTempAmortCents * TASA_MENSUAL);
          }

          CapTempAmortCents -= capitalCents;
          let pagoMesCents = capitalCents + interesCents + SeguroCents;
          Suma_Amortizada_Cents += pagoMesCents;

          tabla.push({
            periodo: pagadas + cuotas_nuevas,
            capital: capitalCents / 100,
            plusvalia: interesCents / 100,
            cuotaBase: Cuota_Pura_Fija,
            seguro: Seguro_Num,
            pagoTotal: pagoMesCents / 100,
            balance: 0, 
            pagada: 'NO'
          });
        }
    }

    // ---------------------------------------------------------
    // C. CÁLCULO DE BALANCE DESCENDENTE Y FILA DE ABONO
    // ---------------------------------------------------------
    let balanceDescendenteCents = Suma_Amortizada_Cents;

    if (Abono > 0) {
        tabla.unshift({
            periodo: pagadas,
            esAbono: true,
            capital: Abono,
            plusvalia: 0,
            cuotaBase: 0,
            seguro: 0,
            pagoTotal: Abono,
            balance: balanceDescendenteCents / 100, // Inicia con la Deuda Futura Total Proyectada
            pagada: 'SI'
        });
    }

    tabla = tabla.map(row => {
      if (row.esAbono) return row;
      balanceDescendenteCents -= Math.round(row.pagoTotal * 100);
      return { ...row, balance: Math.max(0, balanceDescendenteCents / 100) };
    });

    const Ahorro_Total_Cents = Math.max(0, Suma_Original_Cents - Suma_Amortizada_Cents - Math.round(Abono * 100));
    const Meses_Ahorrados = Math.max(0, cuotas_originales - cuotas_nuevas);

    return {
      Suma_Original: Suma_Original_Cents / 100,
      Suma_Amortizada: Suma_Amortizada_Cents / 100,
      Ahorro_Total: Ahorro_Total_Cents / 100,
      Meses_Ahorrados,
      cuotas_originales,
      cuotas_nuevas,
      tabla,
      ultimaCuota: tabla.length > 1 ? tabla[tabla.length - 1].pagoTotal : 0
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
            <div className="bg-blue-100 p-2.5 rounded-xl mr-4">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 uppercase tracking-wide">Amortización a Capital</h1>
              <p className="text-[11px] text-slate-500 font-medium">Motor de reducción de plazo con cálculo exacto de ahorros</p>
            </div>
          </div>
          {calculado && (
            <button 
              onClick={() => setCalculado(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-[11px] font-bold transition-colors flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Nueva Amortización
            </button>
          )}
        </div>

        {/* PANEL DE CONFIGURACIÓN */}
        <div className={"bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all " + (calculado ? "opacity-70 pointer-events-none" : "")}>
          <div className="bg-slate-800 p-4 border-b border-slate-700">
            <h2 className="text-xs font-bold text-white flex items-center tracking-widest uppercase">
              <FileText className="w-4 h-4 mr-2 text-blue-400" /> Datos del Contrato y Abono Extraordinario
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cliente Titular</label>
              <input type="text" name="cliente" value={form.cliente} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 font-bold text-slate-700 bg-slate-50" />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cuota Total Actual ($)</label>
              <input type="number" name="cuotaTotalActual" value={form.cuotaTotalActual} onChange={handleChange} placeholder="Ej. 415.76" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 font-black text-slate-800" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Seguro Mensual ($)</label>
              <input type="number" name="seguroMensual" value={form.seguroMensual} onChange={handleChange} placeholder="Ej. 23.80" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 font-bold text-slate-800" />
            </div>
            
            <div className="md:col-span-2 bg-blue-50 p-3 rounded-xl border border-blue-200">
              <label className="block text-[10px] font-black text-blue-700 uppercase mb-1">Saldo Capital a Cancelar (Dato CRM)</label>
              <input type="number" name="saldoCapital" value={form.saldoCapital} onChange={handleChange} placeholder="Ej. 27130.00" className="w-full px-3 py-2.5 border border-blue-300 rounded-lg text-xs outline-none focus:border-blue-600 font-black text-blue-900 bg-white shadow-inner" />
            </div>

            <div className="md:col-span-2 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <label className="block text-[10px] font-black text-emerald-700 uppercase mb-1">Monto de Inyección a Capital ($)</label>
              <input type="number" name="montoAmortizar" value={form.montoAmortizar} onChange={handleChange} placeholder="Ej. 3000.00" className="w-full px-3 py-2.5 border border-emerald-300 rounded-lg text-xs outline-none focus:border-emerald-600 font-black text-emerald-900 bg-white shadow-inner" />
            </div>

          </div>

          <div className="bg-slate-50 p-5 border-t border-slate-100 flex flex-col md:flex-row items-end justify-between gap-4">
            <div className="w-full md:w-64">
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Cuotas Ya Pagadas (Opcional)</label>
              <input type="number" name="cuotasPagadas" value={form.cuotasPagadas} onChange={handleChange} className="w-full px-3 py-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 font-bold text-slate-700 bg-white" />
            </div>

            {!calculado && (
              <button 
                onClick={() => {
                  if(!form.saldoCapital || !form.cuotaTotalActual || !form.montoAmortizar) {
                    alert("¡Atención! Ingrese la Cuota Actual, el Saldo Capital y el Monto a Amortizar para calcular.");
                    return;
                  }
                  setCalculado(true);
                  setTabActiva('RESUMEN'); 
                }}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center transition-all shadow-lg hover:shadow-blue-600/30 transform hover:-translate-y-0.5"
              >
                <Calculator className="w-5 h-5 mr-2" /> Procesar Amortización
              </button>
            )}
          </div>
        </div>

        {/* ================= RESULTADOS (BENTO UI) ================= */}
        {calculado && (
          <div className="animate-in slide-in-from-bottom-8 duration-500 fade-in bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
            
            <div className="flex border-b border-slate-200 bg-slate-50 px-2 pt-2 justify-between items-center pr-4">
              <div className="flex">
                <button 
                  onClick={() => setTabActiva('RESUMEN')}
                  className={"px-6 py-3 text-[11px] uppercase tracking-wider font-black rounded-t-lg transition-colors " + (tabActiva === 'RESUMEN' ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100')}
                >
                  Resumen Estratégico
                </button>
                <button 
                  onClick={() => setTabActiva('TABLA')}
                  className={"px-6 py-3 text-[11px] uppercase tracking-wider font-black rounded-t-lg transition-colors " + (tabActiva === 'TABLA' ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100')}
                >
                  Nuevo Plan de Pagos
                </button>
              </div>
              
              {tabActiva === 'TABLA' && (
                <button 
                  onClick={() => setOcultarDetalles(!ocultarDetalles)}
                  className="flex items-center text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
                >
                  {ocultarDetalles ? <Eye className="w-3.5 h-3.5 mr-1.5" /> : <EyeOff className="w-3.5 h-3.5 mr-1.5" />}
                  {ocultarDetalles ? 'Mostrar Interés/Seguro' : 'Vista Simple Cliente'}
                </button>
              )}
            </div>

            <div className="p-6">
              
              {tabActiva === 'RESUMEN' && (
                <div className="animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* BENTO: IMPACTO DE AMORTIZACIÓN */}
                    <div className="md:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-center transform transition-transform hover:scale-[1.01]">
                        <div className="absolute -right-10 -top-10 opacity-10">
                            <TrendingDown className="w-48 h-48" />
                        </div>
                        <h3 className="text-[11px] text-emerald-100 font-black uppercase tracking-widest mb-2">Impacto Total del Abono Extraordinario</h3>
                        <div className="flex items-end gap-4 mb-4">
                            <span className="text-5xl font-black drop-shadow-md">{fD(calculos.Ahorro_Total)}</span>
                            <span className="text-sm font-medium text-emerald-200 mb-1">Ahorro en Intereses Futuros</span>
                        </div>
                        <div className="inline-flex items-center bg-white/20 px-4 py-2.5 rounded-lg w-max backdrop-blur-sm border border-white/20">
                            <Clock className="w-5 h-5 mr-2 text-emerald-100" />
                            <span className="font-bold text-sm tracking-wide">¡El cliente se ha ahorrado <strong className="text-xl mx-1">{calculos.Meses_Ahorrados}</strong> meses de tiempo!</span>
                        </div>
                    </div>

                    {/* BENTO: MÉTRICAS COMPARATIVAS */}
                    <div className="space-y-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-500"></div>
                            <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nueva Deuda Futura Total</span>
                            <span className="block text-2xl font-black text-slate-800">{fD(calculos.Suma_Amortizada)}</span>
                            <span className="block text-[10px] font-bold text-slate-400 mt-2 border-t border-slate-200 pt-2">Deuda Original Proyectada: {fD(calculos.Suma_Original)}</span>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-800"></div>
                            <span className="block text-[10px] font-bold text-blue-700 uppercase mb-1">Nuevo Plazo Restante</span>
                            <span className="block text-2xl font-black text-blue-900">{calculos.cuotas_nuevas} Meses</span>
                            <span className="block text-[10px] font-bold text-blue-500 mt-2 border-t border-blue-200 pt-2">Plazo Original Restante: {calculos.cuotas_originales} Meses</span>
                        </div>

                        <div className="bg-slate-900 rounded-xl p-4 shadow-sm flex items-center justify-between text-white">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Última Cuota<br/>a Pagar:</span>
                            <span className="text-xl font-black text-emerald-400">{fD(calculos.ultimaCuota)}</span>
                        </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TABLA 100% WIDTH - FULL PROTAGONISMO */}
              {tabActiva === 'TABLA' && (
                <div className="animate-in fade-in duration-300 overflow-hidden border border-slate-200 rounded-xl w-full">
                  <div className="overflow-auto max-h-[700px] w-full">
                    <table className="w-full border-collapse text-[11px]">
                      <thead className="bg-slate-100 sticky top-0 shadow-sm z-10">
                        <tr>
                          <th className="p-3 border-b border-r border-slate-200 font-bold text-slate-800 text-center uppercase tracking-wider">PERÍODO</th>
                          <th className="p-3 border-b border-r border-slate-200 font-bold text-slate-800 text-right uppercase tracking-wider">CAPITAL</th>
                          {!ocultarDetalles && <th className="p-3 border-b border-r border-slate-200 font-bold text-slate-800 text-right uppercase tracking-wider bg-slate-50">PLUSVALÍA</th>}
                          {!ocultarDetalles && <th className="p-3 border-b border-r border-slate-200 font-bold text-slate-800 text-right uppercase tracking-wider bg-slate-50">CUOTA PURA</th>}
                          {!ocultarDetalles && <th className="p-3 border-b border-r border-slate-200 font-bold text-slate-800 text-right uppercase tracking-wider bg-slate-50">SEGURO</th>}
                          <th className="p-3 border-b border-r border-slate-200 font-black text-blue-700 text-right uppercase tracking-wider">TOTAL PAGO</th>
                          <th className="p-3 border-b border-r border-slate-200 font-bold text-slate-800 text-right uppercase tracking-wider">BALANCE PRINCIPAL</th>
                          <th className="p-3 border-b border-slate-200 font-bold text-slate-800 text-center uppercase tracking-wider">PAGADA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculos.tabla.map((row, idx) => {
                          // RENDERIZADO ESPECIAL PARA LA FILA DE ABONO
                          if (row.esAbono) {
                            return (
                              <tr key={"abono-"+idx} className="bg-emerald-50/90 border-y-2 border-emerald-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative z-0">
                                <td className="p-3 border-r border-emerald-100 text-center font-black text-emerald-800">{row.periodo}</td>
                                <td className="p-3 border-r border-emerald-100 text-right font-black text-emerald-800">{fD(row.capital)}</td>
                                {!ocultarDetalles && <td className="p-3 border-r border-emerald-100 text-center text-emerald-600/70 font-black text-[9px] uppercase tracking-widest" colSpan="3">Abono Extraordinario a Capital</td>}
                                <td className="p-3 border-r border-emerald-100 text-right font-black text-emerald-800">{fD(row.pagoTotal)}</td>
                                <td className="p-3 border-r border-emerald-100 text-right font-black text-blue-800 bg-white/40">{fD(row.balance)}</td>
                                <td className="p-3 text-center font-black text-emerald-600">SI</td>
                              </tr>
                            );
                          }

                          return (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-slate-700">
                              <td className="p-3 border-r border-slate-100 text-center font-black text-slate-800">{row.periodo}</td>
                              <td className="p-3 border-r border-slate-100 text-right">{fD(row.capital)}</td>
                              {!ocultarDetalles && <td className="p-3 border-r border-slate-100 text-right bg-slate-50/50">{fD(row.plusvalia)}</td>}
                              {!ocultarDetalles && <td className="p-3 border-r border-slate-100 text-right bg-slate-50/50">{fD(row.cuotaBase)}</td>}
                              {!ocultarDetalles && <td className="p-3 border-r border-slate-100 text-right bg-slate-50/50">{fD(row.seguro)}</td>}
                              <td className="p-3 border-r border-slate-100 text-right font-black text-slate-800">{fD(row.pagoTotal)}</td>
                              <td className="p-3 border-r border-slate-100 text-right font-medium">{fD(row.balance)}</td>
                              <td className="p-3 text-center font-bold text-slate-300">{row.pagada}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
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
