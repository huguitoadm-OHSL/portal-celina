import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRightLeft, Building2, Wallet, CalendarCheck, Check, Eye, EyeOff, RotateCcw, AlertTriangle, Info } from 'lucide-react';

export default function ConsolidacionLotes() {
  // ================= 1. ESTADO DEL FORMULARIO =================
  const [form, setForm] = useState({
    cliente: '',
    tipoTransferencia: 'mismo_titular', 
    proyectoOrigen: '', loteOrigen: '', montoAportado: '', comisionAsesor: '', 
    proyectoDestino: '', loteDestino: '', cuotaDestino: '', seguroDestino: '', cbdiDestino: '', saldoDestino: '', pagadasDestino: '0', 
  });

  const TASA_MENSUAL = 0.0101444; 
  const [calculado, setCalculado] = useState(false);
  const [tabActiva, setTabActiva] = useState('RESUMEN'); 
  const [ocultarDetalles, setOcultarDetalles] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ================= CÁLCULO DE LIQUIDACIÓN =================
  const calculoLiquidacion = useMemo(() => {
    const aportado = parseFloat(form.montoAportado) || 0;
    const comision = parseFloat(form.comisionAsesor) || 0;
    const porcentajeReconocido = form.tipoTransferencia === 'mismo_titular' ? 1 : 0.70;
    const baseReconocida = aportado * porcentajeReconocido;
    const saldoALiquidar = Math.max(0, baseReconocida - comision);
    return { aportado, porcentajeReconocido, baseReconocida, comision, saldoALiquidar };
  }, [form.montoAportado, form.comisionAsesor, form.tipoTransferencia]);

  // ================= 2. MOTOR MATEMÁTICO: DE ATRÁS HACIA ADELANTE =================
  const calculos = useMemo(() => {
    const Cuota_Total_Actual = parseFloat(form.cuotaDestino) || 0;
    const Seguro_Num = parseFloat(form.seguroDestino) || 0;
    const Cbdi_Num = parseFloat(form.cbdiDestino) || 0; 
    const Capital_Actual = parseFloat(form.saldoDestino) || 0;
    const Fondos_Traspaso = calculoLiquidacion.saldoALiquidar; 
    const pagadas = parseInt(form.pagadasDestino) || 0;

    const Cuota_Pura_Fija = Math.round((Cuota_Total_Actual - Seguro_Num - Cbdi_Num) * 100) / 100;
    const interesPrimerMes = Math.round(Capital_Actual * 100 * TASA_MENSUAL) / 100;

    if (Capital_Actual > 0 && interesPrimerMes >= Cuota_Pura_Fija) {
        return { errorCritico: "⛔ ERROR DE DATOS: El monto ingresado genera un interés mayor a la cuota pura. Asegúrese de ingresar el 'SALDO CAPITAL' del CRM y NO el 'Saldo Total'." };
    }

    const SeguroCents = Math.round(Seguro_Num * 100);
    const CbdiCents = Math.round(Cbdi_Num * 100); 
    const CuotaPuraFijaCents = Math.round(Cuota_Pura_Fija * 100);

    let CapTempCents = Math.round(Capital_Actual * 100);
    let Suma_Total_Plan = 0;
    let tabla = [];
    let cuotas_originales = 0;

    // A. GENERAR TABLA DE PAGOS INTACTA
    if (CapTempCents > 0 && CuotaPuraFijaCents > 0) {
        while (CapTempCents > 0 && cuotas_originales < 400) {
          cuotas_originales++;
          let interesCents = Math.round(CapTempCents * TASA_MENSUAL);
          let capitalCents = CuotaPuraFijaCents - interesCents;
          
          if (CapTempCents - capitalCents <= 5) {
            capitalCents = CapTempCents;
            interesCents = Math.round(CapTempCents * TASA_MENSUAL);
          }
          
          CapTempCents -= capitalCents;
          let pagoMesCents = capitalCents + interesCents + SeguroCents + CbdiCents; 
          Suma_Total_Plan += pagoMesCents;

          tabla.push({
            periodo: pagadas + cuotas_originales,
            capital: capitalCents / 100,
            plusvalia: interesCents / 100,
            cuotaBase: Cuota_Pura_Fija,
            seguro: Seguro_Num,
            cbdi: Cbdi_Num, 
            pagoTotal: pagoMesCents / 100,
            balance: 0, 
            estadoAdelanto: 'PENDIENTE',
            saldoCubierto: 0
          });
        }
    }

    // B. APLICAR LOS FONDOS DE ATRÁS HACIA ADELANTE (Lógica Invertida)
    let billeteraCents = Math.round(Fondos_Traspaso * 100);
    let cuotasEliminadasCompletas = 0;
    let pagoSobrante = 0;
    let cuotaSobrantePeriodo = null;
    let Saldo_Capital_Restante = Capital_Actual; 

    // Recorremos la tabla desde la última cuota hasta la primera
    for (let i = tabla.length - 1; i >= 0; i--) {
      let row = tabla[i];
      let costoCuotaCents = Math.round(row.pagoTotal * 100);

      if (billeteraCents >= costoCuotaCents && billeteraCents > 0) {
        // Alcanza para matar la cuota final completa
        billeteraCents -= costoCuotaCents;
        tabla[i].estadoAdelanto = 'ELIMINADA POR FUSIÓN';
        tabla[i].saldoCubierto = row.pagoTotal;
        cuotasEliminadasCompletas++;
        Saldo_Capital_Restante -= row.capital; 
      } else if (billeteraCents > 0) {
        // Solo alcanza para pagar una parte de esta cuota
        tabla[i].saldoCubierto = billeteraCents / 100;
        pagoSobrante = (costoCuotaCents - billeteraCents) / 100;
        tabla[i].estadoAdelanto = `PAGO PARCIAL (Resta $${pagoSobrante.toFixed(2)})`;
        cuotaSobrantePeriodo = row.periodo;
        
        let tempBilletera = billeteraCents / 100;
        if (tempBilletera > row.seguro) {
            tempBilletera -= row.seguro; 
            if (tempBilletera > row.cbdi) { 
                tempBilletera -= row.cbdi;
                if (tempBilletera > row.plusvalia) {
                    tempBilletera -= row.plusvalia; 
                    Saldo_Capital_Restante -= tempBilletera; 
                }
            }
        }
        billeteraCents = 0;
      }
    }

    // C. CÁLCULO DE BALANCE DESCENDENTE NORMAL (Para mantener la vista contable correcta)
    let balanceDescendenteCents = Suma_Total_Plan;
    for (let i = 0; i < tabla.length; i++) {
        balanceDescendenteCents -= Math.round(tabla[i].pagoTotal * 100);
        tabla[i].balance = Math.max(0, balanceDescendenteCents / 100);
    }

    const Deuda_Total_Restante = Math.max(0, (Suma_Total_Plan / 100) - Fondos_Traspaso);

    return {
      errorCritico: null,
      Suma_Original: Suma_Total_Plan / 100,
      cuotas_originales,
      cuotasEliminadasCompletas,
      Fondos_Traspaso,
      pagoSobrante,
      cuotaSobrantePeriodo,
      Saldo_Capital_Restante: Math.max(0, Saldo_Capital_Restante), 
      Deuda_Total_Restante, 
      tabla
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
              <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Reconocimiento de Cuotas (Atrás hacia Adelante)</p>
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
                El importe reconocido será aplicado como <strong>pago de cuotas desde el final del plan hacia atrás</strong>. No se deben usar las palabras "capital", "interés" o "plusvalía" con el cliente. El descuento de comisión es de uso interno.
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
            
            {/* POLO IZQUIERDO */}
            <div className="bg-white border-2 border-rose-100 rounded-3xl p-5 md:p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center justify-between mb-5 border-b border-rose-100 pb-4">
                <div className="flex items-center">
                  <div className="bg-rose-100 p-2 rounded-lg mr-3"><Wallet className="w-4 h-4 text-rose-600" /></div>
                  <h2 className="text-xs md:text-sm font-black text-rose-800 uppercase tracking-wider">Lote A Desistir (Origen)</h2>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10">
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
                      Comisión Asesor ($) <AlertTriangle className="w-3 h-3 text-amber-500" title="Uso Interno."/>
                    </label>
                    <input type="number" name="comisionAsesor" value={form.comisionAsesor} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-rose-400" />
                  </div>
                </div>

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
                    <label className="block text-[10px] font-black text-rose-800 uppercase mb-1">Fondos Efectivos a Traspasar</label>
                    <div className="w-full px-4 py-2.5 bg-white border-2 border-rose-300 rounded-xl text-xl font-black text-rose-600 text-right shadow-sm">
                      {fD(calculoLiquidacion.saldoALiquidar)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* POLO DERECHO */}
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

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1">Cuota Act. ($)</label>
                    <input type="number" name="cuotaDestino" value={form.cuotaDestino} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-800 outline-none focus:border-emerald-400" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1">Seguro ($)</label>
                    <input type="number" name="seguroDestino" value={form.seguroDestino} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-400" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1">CBDI ($)</label>
                    <input type="number" name="cbdiDestino" value={form.cbdiDestino} onChange={handleChange} placeholder="Ej. 24.12" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-400" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase mb-1">Pagadas</label>
                    <input type="number" name="pagadasDestino" value={form.pagadasDestino} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-400" />
                  </div>
                </div>
                
                <div className="bg-red-50/50 p-3 rounded-2xl border-2 border-red-200 mt-[26px]">
                  <label className="block text-[10px] font-black text-red-600 uppercase mb-1 pl-1">SALDO CAPITAL A CANCELAR (⚠️ NO EL SALDO TOTAL)</label>
                  <input type="number" name="saldoDestino" value={form.saldoDestino} onChange={handleChange} placeholder="Ej. 4919.09" className="w-full px-4 py-3 bg-white border border-red-300 rounded-xl text-sm md:text-base outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 font-black text-red-900 shadow-inner transition-all" />
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
          <div className="animate-in slide-in-from-bottom-10 duration-500 fade-in mt-8">
            
            {calculos.errorCritico ? (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center shadow-lg">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-black text-red-800 mb-2">¡Cálculo Imposible Detectado!</h3>
                <p className="text-red-700 font-medium max-w-lg mx-auto leading-relaxed">{calculos.errorCritico}</p>
                <button onClick={() => setCalculado(false)} className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all">Corregir Datos</button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden">
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
                      
                      {/* FILA SUPERIOR */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                        <div className="md:col-span-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between group">
                            <div className="absolute -left-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <CalendarCheck className="w-64 h-64" />
                            </div>
                            <div className="relative z-10 mb-4 md:mb-0">
                              <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black tracking-widest uppercase mb-3"><Check className="w-3 h-3 mr-1"/> Fusión Completada</span>
                              <h3 className="text-sm md:text-base text-indigo-100 font-medium mb-1">Fondos Aplicados a Cuotas Finales</h3>
                              <span className="text-4xl md:text-6xl font-black drop-shadow-lg tracking-tight">{fD(calculos.Fondos_Traspaso)}</span>
                            </div>
                            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 md:p-5 rounded-2xl w-full md:w-auto text-right">
                              <p className="text-[10px] md:text-xs text-indigo-100 font-bold uppercase tracking-wider mb-1">Cuotas Finales Eliminadas</p>
                              <p className="text-3xl md:text-4xl font-black text-emerald-300">{calculos.cuotasEliminadasCompletas} <span className="text-sm font-medium">Meses</span></p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-800"></div>
                            <div>
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 pl-2">Total Deuda Futura Original</span>
                                <span className="block text-2xl font-black text-slate-800 pl-2">{fD(calculos.Suma_Original)}</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                            <div>
                                <span className="block text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 pl-2">Tiempo Restante (Acortado)</span>
                                <span className="block text-2xl font-black text-blue-900 pl-2">{calculos.cuotas_originales - calculos.cuotasEliminadasCompletas} Meses</span>
                            </div>
                            {calculos.pagoSobrante > 0 && calculos.cuotaSobrantePeriodo && (
                                <div className="text-right">
                                    <span className="block text-[9px] font-bold text-blue-600 uppercase mb-1">Ataque a Cuota {calculos.cuotaSobrantePeriodo}</span>
                                    <span className="block text-lg font-black text-blue-700">{fD(calculos.pagoSobrante)} (Resta)</span>
                                </div>
                            )}
                        </div>
                      </div>

                      {/* FILA INFERIOR: UPSELLING */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6 border-t border-slate-200 pt-6">
                        
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400"></div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                <Wallet className="w-32 h-32 text-emerald-400" />
                            </div>
                            <div className="relative z-10">
                                <span className="inline-flex items-center px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md text-[9px] font-black tracking-widest uppercase mb-3 border border-emerald-500/30">Oportunidad de Liquidación</span>
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-2">Nuevo Saldo a Capital Restante</h3>
                                <span className="block text-3xl md:text-4xl font-black text-emerald-400 pl-2">{fD(calculos.Saldo_Capital_Restante)}</span>
                                <p className="text-[10px] text-slate-500 font-medium mt-2 pl-2 border-t border-slate-800 pt-2">
                                    Monto exacto (Neto) a pagar si el cliente desea liquidar su lote <strong className="text-slate-300">hoy mismo</strong>.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                                <Calculator className="w-32 h-32 text-indigo-900" />
                            </div>
                            <div className="relative z-10">
                                <span className="inline-flex items-center px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] font-black tracking-widest uppercase mb-3 border border-slate-200">Deuda a Plazos Reducida</span>
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-2">Nuevo Saldo Total a Pagar</h3>
                                <span className="block text-3xl md:text-4xl font-black text-slate-800 pl-2">{fD(calculos.Deuda_Total_Restante)}</span>
                                <p className="text-[10px] text-slate-500 font-medium mt-2 pl-2 border-t border-slate-100 pt-2">
                                    Suma de <strong className="text-slate-700">todas las cuotas pendientes futuras</strong> (incluye seguro, CBDI e interés).
                                </p>
                            </div>
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
                              <th className="p-3 border-r border-slate-200 font-black text-slate-600 text-right uppercase">Cuota Mensual</th>
                              {!ocultarDetalles && <th className="p-3 border-r border-slate-200 font-black text-rose-500 text-right uppercase bg-rose-50/30" title="Información de Uso Interno">Costos Financieros</th>}
                              {!ocultarDetalles && <th className="p-3 border-r border-slate-200 font-black text-slate-500 text-right uppercase bg-white">Base</th>}
                              {!ocultarDetalles && <th className="p-3 border-r border-slate-200 font-black text-slate-500 text-right uppercase bg-white">Seguro</th>}
                              {!ocultarDetalles && <th className="p-3 border-r border-slate-200 font-black text-slate-500 text-right uppercase bg-white">CBDI</th>}
                              <th className="p-3 border-r border-slate-200 font-black text-indigo-700 text-right uppercase">Total a Pagar</th>
                              <th className="p-3 border-r border-slate-200 font-black text-slate-600 text-right uppercase">Saldo Deudor</th>
                              <th className="p-3 font-black text-slate-600 text-center uppercase">Estado / Fusión</th>
                            </tr>
                          </thead>
                          <tbody>
                            {calculos.tabla.map((row, idx) => {
                              const isPagada = row.estadoAdelanto.includes('ELIMINADA');
                              const isParcial = row.estadoAdelanto.includes('PARCIAL');
                              
                              let rowClass = "border-b border-slate-100 hover:bg-slate-50 text-slate-700 transition-colors";
                              if (isPagada) rowClass = "bg-emerald-50/70 border-b border-emerald-100 text-emerald-900";
                              if (isParcial) rowClass = "bg-amber-50/70 border-b border-amber-100 text-amber-900";

                              return (
                                <tr key={idx} className={rowClass}>
                                  <td className="p-2 md:p-3 border-r border-slate-100/50 text-center font-bold">{row.periodo}</td>
                                  <td className="p-2 md:p-3 border-r border-slate-100/50 text-right font-medium">{fD(row.capital)}</td>
                                  {!ocultarDetalles && <td className="p-2 md:p-3 border-r border-slate-100/50 text-right bg-rose-50/20 text-rose-500">{fD(row.plusvalia)}</td>}
                                  {!ocultarDetalles && <td className="p-2 md:p-3 border-r border-slate-100/50 text-right opacity-60">{fD(row.cuotaBase)}</td>}
                                  {!ocultarDetalles && <td className="p-2 md:p-3 border-r border-slate-100/50 text-right opacity-60">{fD(row.seguro)}</td>}
                                  {!ocultarDetalles && <td className="p-2 md:p-3 border-r border-slate-100/50 text-right opacity-60">{fD(row.cbdi)}</td>}
                                  
                                  <td className={`p-2 md:p-3 border-r border-slate-100/50 text-right font-black ${isPagada ? 'text-emerald-700' : 'text-slate-800'}`}>{fD(row.pagoTotal)}</td>
                                  <td className="p-2 md:p-3 border-r border-slate-100/50 text-right font-medium opacity-80">{fD(row.balance)}</td>
                                  <td className={`p-2 md:p-3 text-center font-bold text-[9px] ${isPagada ? 'text-emerald-600' : isParcial ? 'text-amber-600' : 'text-slate-300'}`}>
                                    {row.estadoAdelanto}
                                  </td>
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
        )}
      </div>
    </div>
  );
}
