import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRightLeft, Building2, Wallet, TrendingDown, Clock, Check, Eye, EyeOff, RotateCcw, AlertTriangle, Info, FileText } from 'lucide-react';

export default function ConsolidacionLotes() {
  // ================= 1. ESTADO DEL FORMULARIO =================
  const [form, setForm] = useState({
    cliente: '',
    tipoTransferencia: 'mismo_titular', // 'mismo_titular' (100%) o 'tercero' (70%)
    
    // LOTE ORIGEN (El que se devuelve)
    proyectoOrigen: '',
    loteOrigen: '',
    montoAportado: '', // Total aportado por el cliente
    comisionAsesor: '', // Comisión que debe ser descontada
    
    // LOTE DESTINO (El que se conserva)
    proyectoDestino: '',
    loteDestino: '',
    cuotaDestino: '', 
    seguroDestino: '', 
    saldoDestino: '', 
    pagadasDestino: '0', 
  });

  const TASA_MENSUAL = 0.0101444; 
  const [calculado, setCalculado] = useState(false);
  const [tabActiva, setTabActiva] = useState('RESUMEN'); 
  const [ocultarDetalles, setOcultarDetalles] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ================= CÁLCULO DEL SALDO A LIQUIDAR (POLÍTICA GERENCIAL) =================
  const calculoLiquidacion = useMemo(() => {
    const aportado = parseFloat(form.montoAportado) || 0;
    const comision = parseFloat(form.comisionAsesor) || 0;
    const porcentajeReconocido = form.tipoTransferencia === 'mismo_titular' ? 1 : 0.70;
    
    const baseReconocida = aportado * porcentajeReconocido;
    // El saldo a liquidar (fondos efectivos a inyectar) es la base menos la comisión
    const saldoALiquidar = Math.max(0, baseReconocida - comision);
    
    return {
      aportado,
      porcentajeReconocido,
      baseReconocida,
      comision,
      saldoALiquidar
    };
  }, [form.montoAportado, form.comisionAsesor, form.tipoTransferencia]);

  // ================= 2. MOTOR MATEMÁTICO (FUSIÓN Y AMORTIZACIÓN) =================
  const calculos = useMemo(() => {
    const Cuota_Total_Actual = parseFloat(form.cuotaDestino) || 0;
    const Seguro_Num = parseFloat(form.seguroDestino) || 0;
    const Capital_Actual = parseFloat(form.saldoDestino) || 0;
    const Fondos_Traspaso = calculoLiquidacion.saldoALiquidar; // INYECCIÓN DEL SALDO LIQUIDADO
    const pagadas = parseInt(form.pagadasDestino) || 0;

    const Cuota_Pura_Fija = Math.round((Cuota_Total_Actual - Seguro_Num) * 100) / 100;
    const SeguroCents = Math.round(Seguro_Num * 100);
    const CuotaPuraFijaCents = Math.round(Cuota_Pura_Fija * 100);

    // A. PROYECTAR PLAN ORIGINAL
    let CapTempOrigCents = Math.round(Capital_Actual * 100);
    let Suma_Original_Cents = 0;
    let cuotas_originales = 0;

    if (CapTempOrigCents > 0 && CuotaPuraFijaCents > 0) {
        while (CapTempOrigCents > 0 && cuotas_originales < 400) {
          cuotas_originales++;
          let interesCents = Math.round(CapTempOrigCents * TASA_MENSUAL);
          let capitalCents = CuotaPuraFijaCents - interesCents;
          
          // Prevención de saldos negativos en cuota final
          if (CapTempOrigCents - capitalCents <= 0) {
            capitalCents = CapTempOrigCents;
            interesCents = Math.round(CapTempOrigCents * TASA_MENSUAL);
          }
          
          CapTempOrigCents -= capitalCents;
          Suma_Original_Cents += (capitalCents + interesCents + SeguroCents);
        }
    }

    // B. PROYECTAR PLAN CONSOLIDADO
    let CapTempAmortCents = Math.round(Math.max(0, Capital_Actual - Fondos_Traspaso) * 100);
    let Suma_Amortizada_Cents = 0;
    let cuotas_nuevas = 0;
    let tabla = [];

    if (CapTempAmortCents > 0 && CuotaPuraFijaCents > 0) {
        while (CapTempAmortCents > 0 && cuotas_nuevas < 400) {
          cuotas_nuevas++;
          let interesCents = Math.round(CapTempAmortCents * TASA_MENSUAL);
          let capitalCents = CuotaPuraFijaCents - interesCents;
          
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

    // C. CÁLCULO DE BALANCE DESCENDENTE Y FILA DE TRASPASO
    let balanceDescendenteCents = Suma_Amortizada_Cents;

    if (Fondos_Traspaso > 0) {
        tabla.unshift({
            periodo: pagadas, esAbono: true, capital: Fondos_Traspaso, plusvalia: 0, cuotaBase: 0, seguro: 0, pagoTotal: Fondos_Traspaso, balance: balanceDescendenteCents / 100, pagada: 'SI'
        });
    }

    tabla = tabla.map(row => {
      if (row.esAbono) return row;
      balanceDescendenteCents -= Math.round(row.pagoTotal * 100);
      return { ...row, balance: Math.max(0, balanceDescendenteCents / 100) };
    });

    const Ahorro_Total_Cents = Math.max(0, Suma_Original_Cents - Suma_Amortizada_Cents - Math.round(Fondos_Traspaso * 100));

    return {
      Suma_Original: Suma_Original_Cents / 100,
      Suma_Amortizada: Suma_Amortizada_Cents / 100,
      Ahorro_Total: Ahorro_Total_Cents / 100,
      Meses_Ahorrados: Math.max(0, cuotas_originales - cuotas_nuevas),
      cuotas_originales, cuotas_nuevas, tabla,
      ultimaCuota: tabla.length > 1 ? tabla[tabla.length - 1].pagoTotal : 0
    };
  }, [form, calculoLiquidacion.saldoALiquidar]);

  const fD = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num || 0);

  // ================= 3. INTERFAZ GRÁFICA =================
  return (
    <div className="font-sans bg-[#f0f2f5] min-h-screen p-3 md:p-4 xl:p-8 pb-12">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-3 md:p-5 rounded-3xl shadow-sm border border-slate-200 gap-3 md:gap-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center relative z-10">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 md:p-3 rounded-2xl mr-3 md:mr-4 shadow-lg shadow-indigo-500/20">
              <ArrowRightLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base md:text-xl font-black text-slate-800 uppercase tracking-wide leading-tight">Consolidación de Activos</h1>
              <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Lineamientos Gerenciales Aplicados</p>
            </div>
          </div>
          {calculado && (
            <button onClick={() => setCalculado(false)} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-all flex items-center justify-center shadow-sm w-full md:w-auto relative z-10">
              <RotateCcw className="w-3 h-3 md:w-4 md:h-4 mr-2" /> Nueva Operación
            </button>
          )}
        </div>

        {/* ALERTA DE POLÍTICA GERENCIAL */}
        {!calculado && (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-2xl p-4 shadow-sm flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-3 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-black text-blue-900 uppercase tracking-wide mb-1">Políticas de Transferencia</h3>
              <p className="text-[11px] text-blue-800/80 leading-relaxed font-medium">
                No se requiere carta notariada. En todos los casos se debe dejar por escrito la solicitud con fotocopia de carnet. <strong>Terminología estricta:</strong> Usar únicamente los términos "Monto Aportado" y "Adelanto de Cuotas". Está prohibido usar palabras como capital, interés o plusvalía con el cliente. El descuento de comisión es estrictamente de uso interno.
              </p>
            </div>
          </div>
        )}

        {/* PANEL DE CONFIGURACIÓN */}
        <div className={"transition-all duration-500 " + (calculado ? "opacity-60 pointer-events-none grayscale-[20%]" : "")}>
          
          <div className="mb-4">
            <label className="block text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest mb-1 pl-2">Titular del Nuevo Contrato</label>
            <input type="text" name="cliente" value={form.cliente} onChange={handleChange} placeholder="Nombre completo del cliente..." className="w-full px-4 py-3 md:py-4 bg-white border border-slate-200 rounded-2xl text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-black text-slate-800 shadow-sm transition-all" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            
            {/* POLO IZQUIERDO: LOTE ORIGEN Y LIQUIDACIÓN */}
            <div className="bg-white border-2 border-rose-100 rounded-3xl p-5 md:p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center justify-between mb-5 border-b border-rose-100 pb-4">
                <div className="flex items-center">
                  <div className="bg-rose-100 p-2 rounded-lg mr-3"><Wallet className="w-4 h-4 text-rose-600" /></div>
                  <h2 className="text-xs md:text-sm font-black text-rose-800 uppercase tracking-wider">Lote A Desistir (Origen)</h2>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10">
                
                {/* Selector de Política */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-2">Tipo de Traspaso</label>
                  <select name="tipoTransferencia" value={form.tipoTransferencia} onChange={handleChange} className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-rose-400">
                    <option value="mismo_titular">Mismo Titular (Reconoce 100%)</option>
                    <option value="tercero">Tercero sin vínculo (Reconoce 70%)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1">Monto Total Aportado ($)</label>
                    <input type="number" name="montoAportado" value={form.montoAportado} onChange={handleChange} className="w-full px-3 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-sm font-black text-rose-900 outline-none focus:border-rose-400" />
                  </div>
                  <div className="col-span-2 md:col-span-1 relative">
                    <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                      Comisión Asesor ($) <AlertTriangle className="w-3 h-3 text-amber-500" title="Uso Interno. No comentar al cliente."/>
                    </label>
                    <input type="number" name="comisionAsesor" value={form.comisionAsesor} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-rose-400" />
                  </div>
                </div>

                {/* TABLERO DE RESULTADO DE LIQUIDACIÓN */}
                <div className="bg-gradient-to-r from-rose-50 to-orange-50 p-4 rounded-2xl border border-rose-200/60 shadow-inner mt-4">
                  <div className="flex justify-between items-center mb-2 border-b border-rose-200/50 pb-2">
                    <span className="text-[10px] font-bold text-rose-800/70 uppercase">Base Reconocida ({form.tipoTransferencia === 'mismo_titular' ? '100%' : '70%'})</span>
                    <span className="text-xs font-bold text-rose-900">{fD(calculoLiquidacion.baseReconocida)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-rose-800/70 uppercase">Descuento Comisiones</span>
                    <span className="text-xs font-bold text-rose-600">-{fD(calculoLiquidacion.comision)}</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-rose-800 uppercase mb-1">Saldo a Liquidar (Adelanto de Cuotas)</label>
                    <div className="w-full px-4 py-2.5 bg-white border-2 border-rose-300 rounded-xl text-xl font-black text-rose-600 text-right shadow-sm">
                      {fD(calculoLiquidacion.saldoALiquidar)}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* POLO DERECHO: LOTE DESTINO Y AMORTIZACIÓN */}
            <div className="bg-white border-2 border-emerald-100 rounded-3xl p-5 md:p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center mb-5 border-b border-emerald-100 pb-4">
                <div className="bg-emerald-100 p-2 rounded-lg mr-3"><Building2 className="w-4 h-4 text-emerald-600" /></div>
                <h2 className="text-xs md:text-sm font-black text-emerald-800 uppercase tracking-wider">Lote A Conservar (Destino)</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1">Proyecto Destino</label>
                    <input type="text" name="proyectoDestino" value={form.proyectoDestino} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-400" />
                  </div>
                  <div>
                    <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1">UV/MZN/LOTE</label>
                    <input type="text" name="loteDestino" value={form.loteDestino} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-400" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1">Cuota Act. ($)</label>
                    <input type="number" name="cuotaDestino" value={form.cuotaDestino} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-800 outline-none focus:border-emerald-400" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1">Seguro ($)</label>
                    <input type="number" name="seguroDestino" value={form.seguroDestino} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-400" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1">Pagadas</label>
                    <input type="number" name="pagadasDestino" value={form.pagadasDestino} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-400" />
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 mt-[26px]">
                  <label className="block text-[10px] font-black text-blue-700 uppercase mb-1 pl-1">Saldo a Cancelar (Dato CRM)</label>
                  <input type="number" name="saldoDestino" value={form.saldoDestino} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-blue-300 rounded-xl text-sm md:text-base outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 font-black text-blue-900 shadow-inner transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            {!calculado && (
              <button 
                onClick={() => {
                  if(!form.saldoDestino || !form.cuotaDestino || !form.montoAportado) { alert("Complete los montos clave de ambos lotes."); return; }
                  if(calculoLiquidacion.saldoALiquidar <= 0) { alert("El saldo a liquidar no puede ser cero o negativo. Revise la comisión o el monto aportado."); return; }
                  setCalculado(true); setTabActiva('RESUMEN'); 
                }}
                className="w-full lg:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-widest flex items-center justify-center transition-all shadow-[0_8px_20px_rgba(79,70,229,0.3)] active:scale-95"
              >
                <ArrowRightLeft className="w-5 h-5 mr-2" /> Ejecutar Consolidación
              </button>
            )}
          </div>
        </div>

        {/* ================= RESULTADOS ================= */}
        {calculado && (
          <div className="animate-in slide-in-from-bottom-10 duration-500 fade-in bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden mt-8">
            
            <div className="flex flex-col md:flex-row border-b border-slate-200 bg-slate-50/80 px-2 pt-2 justify-between items-center md:pr-4 gap-2 md:gap-0">
              <div className="flex w-full md:w-auto">
                <button onClick={() => setTabActiva('RESUMEN')} className={`flex-1 md:flex-none px-3 py-3 md:px-8 md:py-4 text-[9px] md:text-[11px] uppercase tracking-[0.15em] font-black rounded-t-2xl transition-all ${tabActiva === 'RESUMEN' ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-[0_-4px_15px_rgba(0,0,0,0.03)] relative z-10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
                  Impacto Estratégico
                </button>
                <button onClick={() => setTabActiva('TABLA')} className={`flex-1 md:flex-none px-3 py-3 md:px-8 md:py-4 text-[9px] md:text-[11px] uppercase tracking-[0.15em] font-black rounded-t-2xl transition-all ${tabActiva === 'TABLA' ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-[0_-4px_15px_rgba(0,0,0,0.03)] relative z-10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
                  Plan Consolidado
                </button>
              </div>
              
              {tabActiva === 'TABLA' && (
                <button onClick={() => setOcultarDetalles(!ocultarDetalles)} className="flex items-center text-[9px] md:text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm mb-2 md:mb-0 w-full md:w-auto justify-center hover:bg-slate-50 transition-colors">
                  {ocultarDetalles ? <Eye className="w-3.5 h-3.5 mr-2" /> : <EyeOff className="w-3.5 h-3.5 mr-2" />}
                  {ocultarDetalles ? 'Vista Interna Completa' : 'Vista Segura Cliente'}
                </button>
              )}
            </div>

            <div className="p-4 md:p-8 bg-slate-50/30">
              
              {tabActiva === 'RESUMEN' && (
                <div className="animate-in fade-in zoom-in-95 duration-400">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    
                    <div className="md:col-span-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between group">
                        <div className="absolute -left-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <ArrowRightLeft className="w-64 h-64" />
                        </div>
                        <div className="relative z-10 mb-4 md:mb-0">
                          <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black tracking-widest uppercase mb-3"><Check className="w-3 h-3 mr-1"/> Fusión Completada</span>
                          <h3 className="text-sm md:text-base text-indigo-100 font-medium mb-1">Adelanto de Cuotas Inyectado al Lote Destino</h3>
                          <span className="text-4xl md:text-6xl font-black drop-shadow-lg tracking-tight">{fD(calculoLiquidacion.saldoALiquidar)}</span>
                        </div>
                        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 md:p-5 rounded-2xl w-full md:w-auto text-right">
                          <p className="text-[10px] md:text-xs text-indigo-100 font-bold uppercase tracking-wider mb-1">Ahorro Generado</p>
                          <p className="text-2xl md:text-3xl font-black text-emerald-300">{fD(calculos.Ahorro_Total)}</p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-800"></div>
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deuda Futura Proyectada</span>
                        <span className="block text-2xl font-black text-slate-800 line-through decoration-rose-500/50">{fD(calculos.Suma_Original)}</span>
                        <p className="text-[10px] text-slate-500 font-medium mt-2 leading-relaxed">Esto es lo que el cliente iba a pagar si no consolidaba sus lotes.</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                        <span className="block text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Nueva Deuda Consolidada</span>
                        <span className="block text-3xl font-black text-blue-900">{fD(calculos.Suma_Amortizada)}</span>
                        <p className="text-[10px] text-blue-600/70 font-bold mt-2 pt-2 border-t border-blue-200">Reducción masiva de carga financiera.</p>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 shadow-sm flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                        <Clock className="w-6 h-6 text-emerald-500 mb-3" />
                        <span className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Tiempo Eliminado</span>
                        <span className="block text-3xl font-black text-emerald-800">{calculos.Meses_Ahorrados} Meses</span>
                        <span className="block text-[10px] font-bold text-emerald-600 mt-2">Plazo final: {calculos.cuotas_nuevas} meses</span>
                    </div>

                  </div>
                </div>
              )}

              {tabActiva === 'TABLA' && (
                <div className="animate-in fade-in duration-300 overflow-hidden border border-slate-200 rounded-2xl w-full bg-white shadow-sm">
                  <div className="overflow-auto max-h-[500px] md:max-h-[700px] w-full custom-scrollbar">
                    <table className="w-full border-collapse text-[9px] md:text-[11px] min-w-[500px] md:min-w-full">
                      <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                        <tr>
                          <th className="p-3 border-r border-slate-200 font-black text-slate-600 text-center uppercase">Per.</th>
                          {/* 🟢 MODIFICACIÓN ESTRATÉGICA: Se cambia "Capital" por "Abono Cuota" y "Balance" por "Saldo Deudor" */}
                          <th className="p-3 border-r border-slate-200 font-black text-slate-600 text-right uppercase">Abono Cuota</th>
                          {!ocultarDetalles && <th className="p-3 border-r border-slate-200 font-black text-rose-500 text-right uppercase bg-rose-50/30" title="Información de Uso Interno">Costos Financieros</th>}
                          {!ocultarDetalles && <th className="p-3 border-r border-slate-200 font-black text-slate-500 text-right uppercase bg-white">Cuota Pura</th>}
                          {!ocultarDetalles && <th className="p-3 border-r border-slate-200 font-black text-slate-500 text-right uppercase bg-white">Seguro</th>}
                          <th className="p-3 border-r border-slate-200 font-black text-indigo-700 text-right uppercase">Total Pago</th>
                          <th className="p-3 border-r border-slate-200 font-black text-slate-600 text-right uppercase">Saldo Deudor</th>
                          <th className="p-3 font-black text-slate-600 text-center uppercase">Est.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculos.tabla.map((row, idx) => {
                          if (row.esAbono) {
                            return (
                              <tr key={"abono-"+idx} className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-200 relative z-0">
                                <td className="p-3 border-r border-indigo-100 text-center font-black text-indigo-800">{row.periodo}</td>
                                <td className="p-3 border-r border-indigo-100 text-right font-black text-indigo-800">{fD(row.capital)}</td>
                                {!ocultarDetalles && <td className="p-3 border-r border-indigo-100 text-center text-indigo-600/80 font-black text-[9px] md:text-[10px] tracking-widest uppercase" colSpan="3">ADELANTO DE CUOTAS (LIQUIDACIÓN LOTE)</td>}
                                <td className="p-3 border-r border-indigo-100 text-right font-black text-indigo-800">{fD(row.pagoTotal)}</td>
                                <td className="p-3 border-r border-indigo-100 text-right font-black text-indigo-900 bg-white/50">{fD(row.balance)}</td>
                                <td className="p-3 text-center font-black text-indigo-600"><Check className="w-4 h-4 mx-auto" /></td>
                              </tr>
                            );
                          }
                          return (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 text-slate-700 transition-colors">
                              <td className="p-2 md:p-3 border-r border-slate-100 text-center font-bold text-slate-800">{row.periodo}</td>
                              <td className="p-2 md:p-3 border-r border-slate-100 text-right font-medium">{fD(row.capital)}</td>
                              {!ocultarDetalles && <td className="p-2 md:p-3 border-r border-slate-100 text-right bg-rose-50/30 text-rose-500">{fD(row.plusvalia)}</td>}
                              {!ocultarDetalles && <td className="p-2 md:p-3 border-r border-slate-100 text-right bg-slate-50/30 text-slate-500">{fD(row.cuotaBase)}</td>}
                              {!ocultarDetalles && <td className="p-2 md:p-3 border-r border-slate-100 text-right bg-slate-50/30 text-slate-500">{fD(row.seguro)}</td>}
                              <td className="p-2 md:p-3 border-r border-slate-100 text-right font-black text-slate-800">{fD(row.pagoTotal)}</td>
                              <td className="p-2 md:p-3 border-r border-slate-100 text-right font-medium text-slate-600">{fD(row.balance)}</td>
                              <td className="p-2 md:p-3 text-center font-bold text-slate-300 text-[9px]">{row.pagada}</td>
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
