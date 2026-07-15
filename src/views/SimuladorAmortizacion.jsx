import React, { useState, useMemo } from 'react';
import { Calculator, EyeOff, Eye, PlayCircle, RotateCcw, Clock } from 'lucide-react';

export default function SimuladorAmortizacion() {
  // ================= 1. ESTADO DEL FORMULARIO (LIENZO EN BLANCO) =================
  const [form, setForm] = useState({
    cliente: '',
    proyecto: '',
    uv: '', mzn: '', lote: '', superficie: '',
    precioTotal: '',
    cuotaInicial: '',
    plazoAnios: '',
    cuotasPagadas: '',
    montoAmortizar: ''
  });

  // CONSTANTES FINANCIERAS (Según Imagen 1)
  const TASA_ANUAL_NOMINAL = 12.1733; 
  const TASA_MENSUAL = 0.0101444; // 1.01444%

  // ESTADOS DE LA INTERFAZ
  const [calculado, setCalculado] = useState(false);
  const [ocultarDetalles, setOcultarDetalles] = useState(false);
  const [vistaActual, setVistaActual] = useState('ORIGINAL'); 

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ================= 2. MOTOR MATEMÁTICO AVANZADO =================
  const calculos = useMemo(() => {
    // 1. Lectura de variables
    const P_total = parseFloat(form.precioTotal) || 0;
    const Enganche = parseFloat(form.cuotaInicial) || 0;
    const Amortizacion = parseFloat(form.montoAmortizar) || 0;
    const n_anios = parseInt(form.plazoAnios) || 0;
    const n_meses = n_anios * 12;
    const pagadas = parseInt(form.cuotasPagadas) || 0;
    
    // Capital Real (Valor Presente a Financiar)
    const Saldo_Real_A_Financiar = Math.max(0, P_total - Enganche);

    // 2. CÁLCULO DINÁMICO DEL SEGURO (Algoritmo de Imagen 1)
    let valorTablaBase = 0;
    const tablaSeguro = {
      1: 16.32, 2: 17.30, 3: 18.31, 4: 19.36, 5: 20.44,
      6: 21.56, 7: 22.71, 8: 23.90, 9: 25.12, 10: 26.38,
      11: 27.67, 12: 29.00, 13: 30.36, 14: 31.75
    };
    
    if (n_anios > 0) {
      if (n_anios <= 14) {
        valorTablaBase = tablaSeguro[n_anios];
      } else {
        valorTablaBase = 31.75 + ((n_anios - 14) * 1.3);
      }
    }
    
    const factorSeguro = valorTablaBase / 34278.00;
    const SEGURO_MENSUAL = factorSeguro * Saldo_Real_A_Financiar;

    // 3. CÁLCULO DE CUOTA PURA (Amortización Francesa Estándar)
    let Cuota_Pura = 0;
    if (TASA_MENSUAL > 0 && n_meses > 0 && Saldo_Real_A_Financiar > 0) {
      Cuota_Pura = Saldo_Real_A_Financiar * (TASA_MENSUAL * Math.pow(1 + TASA_MENSUAL, n_meses)) / (Math.pow(1 + TASA_MENSUAL, n_meses) - 1);
    }
    
    const Cuota_Total_Mes = Cuota_Pura + SEGURO_MENSUAL;
    const Total_Plusvalia_Original = (Cuota_Pura * n_meses) - Saldo_Real_A_Financiar;
    const Total_Deuda_Original_Futura = (Cuota_Total_Mes * n_meses);
    
    // --- GENERACIÓN DEL PLAN ORIGINAL ---
    let tablaOriginal = [];
    let balanceDeudaOriginal = Total_Deuda_Original_Futura;
    let capitalRestanteOri = Saldo_Real_A_Financiar;

    for (let i = 1; i <= n_meses; i++) {
      const interes = capitalRestanteOri * TASA_MENSUAL;
      let capital = Cuota_Pura - interes;
      
      // Ajuste de última cuota
      if (capitalRestanteOri - capital < 0) capital = capitalRestanteOri;
      
      capitalRestanteOri -= capital;
      balanceDeudaOriginal -= Cuota_Total_Mes;
      
      tablaOriginal.push({
        periodo: i,
        capital: capital,
        plusvalia: interes,
        cuotaBase: Cuota_Pura,
        seguro: SEGURO_MENSUAL,
        pagoTotal: Cuota_Total_Mes,
        balance: Math.max(0, balanceDeudaOriginal),
        pagada: i <= pagadas ? 'SI' : 'NO'
      });
    }

    // --- GENERACIÓN DEL PLAN AMORTIZADO ---
    let tablaAmortizada = [];
    let balanceDeudaAmortizada = Total_Deuda_Original_Futura;
    let Capital_Restante = Saldo_Real_A_Financiar;

    // 1. Historial hasta las cuotas pagadas
    for (let i = 1; i <= pagadas; i++) {
      const interes = Capital_Restante * TASA_MENSUAL;
      const capital = Cuota_Pura - interes;
      Capital_Restante -= capital;
      balanceDeudaAmortizada -= Cuota_Total_Mes;
      
      tablaAmortizada.push({
        periodo: i,
        capital: capital,
        plusvalia: interes,
        cuotaBase: Cuota_Pura,
        seguro: SEGURO_MENSUAL,
        pagoTotal: Cuota_Total_Mes,
        balance: Math.max(0, balanceDeudaAmortizada),
        pagada: 'SI'
      });
    }

    // 2. Amortización de Capital
    let cuotasRestantes = 0;
    let Nueva_Deuda_Total = 0;
    let ahorroIntereses = 0;
    let mesesAhorrados = 0;

    if (Amortizacion > 0 && Capital_Restante > 0) {
      Capital_Restante -= Amortizacion;
      if (Capital_Restante < 0) Capital_Restante = 0;

      // Calcular nuevo plazo
      const factorLog = 1 - (Capital_Restante * TASA_MENSUAL) / Cuota_Pura;
      if (factorLog > 0) {
        cuotasRestantes = Math.ceil(-Math.log(factorLog) / Math.log(1 + TASA_MENSUAL));
      } else {
        cuotasRestantes = n_meses - pagadas;
      }

      // Proyectar nueva deuda total
      let capTemp = Capital_Restante;
      for (let i = 1; i <= cuotasRestantes; i++) {
        const int = capTemp * TASA_MENSUAL;
        let cap = Cuota_Pura - int;
        if (capTemp - cap < 0) cap = capTemp;
        capTemp -= cap;
        Nueva_Deuda_Total += (cap + int + SEGURO_MENSUAL);
      }

      balanceDeudaAmortizada = Nueva_Deuda_Total;

      // Inyección a la tabla
      tablaAmortizada.push({
        periodo: pagadas, 
        esAbono: true,
        capital: Amortizacion,
        balance: balanceDeudaAmortizada
      });

      // Llenar nuevas cuotas
      for (let i = 1; i <= cuotasRestantes; i++) {
        const interes = Capital_Restante * TASA_MENSUAL;
        let capital = Cuota_Pura - interes;
        if (Capital_Restante - capital < 0) capital = Capital_Restante;
        Capital_Restante -= capital;
        const pagoMes = capital + interes + SEGURO_MENSUAL;
        balanceDeudaAmortizada -= pagoMes;

        tablaAmortizada.push({
          periodo: pagadas + i,
          capital: capital,
          plusvalia: interes,
          cuotaBase: Cuota_Pura, // Mostramos la base teórica (capital+interes)
          seguro: SEGURO_MENSUAL,
          pagoTotal: pagoMes,
          balance: Math.max(0, balanceDeudaAmortizada),
          pagada: 'NO'
        });
      }

      mesesAhorrados = (n_meses - pagadas) - cuotasRestantes;
      const deudaRestanteOriginal = Total_Deuda_Original_Futura - (pagadas * Cuota_Total_Mes);
      ahorroIntereses = Math.max(0, (deudaRestanteOriginal - Amortizacion) - Nueva_Deuda_Total);
    } else {
      tablaAmortizada = [...tablaOriginal];
      cuotasRestantes = n_meses - pagadas;
      Nueva_Deuda_Total = Total_Deuda_Original_Futura - (pagadas * Cuota_Total_Mes);
    }

    return {
      Saldo_Real_A_Financiar, Total_Plusvalia_Original, Total_Deuda_Original_Futura,
      Cuota_Total_Mes, SEGURO_MENSUAL, tablaOriginal, tablaAmortizada, n_meses,
      Nueva_Deuda_Total, cuotasRestantes, ahorroIntereses, mesesAhorrados
    };
  }, [form]);

  const fD = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num || 0);

  const tablaActiva = vistaActual === 'ORIGINAL' ? calculos.tablaOriginal : calculos.tablaAmortizada;

  // ================= 3. RENDER UI =================
  return (
    <div className="font-sans bg-[#f4f6f8] min-h-screen p-4 pb-12">
      
      {/* PANEL DE FORMULARIO - CAMPOS VACÍOS */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5 shadow-md">
        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
          <h2 className="text-sm font-black text-slate-800 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-blue-600" /> Simulador Profesional de Amortizaciones
          </h2>
          {calculado && (
            <button onClick={() => setCalculado(false)} className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center transition-colors">
              <RotateCcw className="w-3 h-3 mr-1" /> Nueva Simulación
            </button>
          )}
        </div>

        <div className={"grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 " + (calculado ? 'opacity-60 pointer-events-none' : '')}>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cliente Titular</label>
            <input type="text" name="cliente" value={form.cliente} onChange={handleChange} placeholder="Nombre del cliente" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold text-slate-700" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Proyecto / Lote</label>
            <div className="flex gap-1">
              <input type="text" name="proyecto" value={form.proyecto} onChange={handleChange} className="w-full px-2 py-2 border border-slate-300 rounded-lg text-[10px] outline-none" placeholder="Proyecto" />
              <input type="text" name="uv" value={form.uv} onChange={handleChange} className="w-12 px-1 py-2 border border-slate-300 rounded-lg text-[10px] text-center outline-none" placeholder="UV" />
              <input type="text" name="mzn" value={form.mzn} onChange={handleChange} className="w-12 px-1 py-2 border border-slate-300 rounded-lg text-[10px] text-center outline-none" placeholder="MZN" />
              <input type="text" name="lote" value={form.lote} onChange={handleChange} className="w-12 px-1 py-2 border border-slate-300 rounded-lg text-[10px] text-center outline-none" placeholder="LT" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Total Contrato ($)</label>
            <input type="number" name="precioTotal" value={form.precioTotal} onChange={handleChange} placeholder="Ej. 30000" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 font-black text-slate-800" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cuota Inicial ($)</label>
            <input type="number" name="cuotaInicial" value={form.cuotaInicial} onChange={handleChange} placeholder="Ej. 2870" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 font-bold text-slate-800" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Plazo (Años)</label>
            <input type="number" name="plazoAnios" value={form.plazoAnios} onChange={handleChange} placeholder="Ej. 10" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 font-bold text-slate-800" />
          </div>
          
          {/* LÍNEA 2 DE INPUTS */}
          <div>
            <label className="block text-[10px] font-bold text-indigo-600 uppercase mb-1">Cuotas Pagadas</label>
            <input type="number" name="cuotasPagadas" value={form.cuotasPagadas} onChange={handleChange} className="w-full px-3 py-2 border-2 border-indigo-200 bg-indigo-50 rounded-lg text-xs outline-none focus:border-indigo-500 font-black text-indigo-800" placeholder="Ej. 12 (Vacío = 0)" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] font-black text-emerald-600 uppercase mb-1">Monto a Amortizar ($)</label>
            <input type="number" name="montoAmortizar" value={form.montoAmortizar} onChange={handleChange} className="w-full px-3 py-2 border-2 border-emerald-400 bg-emerald-50 rounded-lg text-sm outline-none focus:border-emerald-600 font-black text-emerald-800 shadow-inner" placeholder="Monto extra a inyectar" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plusvalía (%) [Fija]</label>
            <input type="text" value={TASA_ANUAL_NOMINAL + "%"} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-400 font-bold cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Seguro Mensual ($) [Automático]</label>
            <input type="text" value={calculado ? fD(calculos.SEGURO_MENSUAL) : "Calculando..."} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-400 font-bold cursor-not-allowed" />
          </div>
        </div>

        {!calculado && (
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => { setCalculado(true); setVistaActual('AMORTIZADO'); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center transition-all shadow-lg hover:shadow-blue-600/30 transform hover:-translate-y-0.5"
            >
              <PlayCircle className="w-4 h-4 mr-2" /> Procesar Simulación
            </button>
          </div>
        )}
      </div>

      {/* ================= RESULTADOS (MÓDULO OCULTO HASTA CALCULAR) ================= */}
      {calculado && (
        <div className="animate-in slide-in-from-bottom-8 duration-700 fade-in flex flex-col xl:flex-row gap-5">
          
          {/* COLUMNA IZQUIERDA: TABLA */}
          <div className="w-full xl:w-[48%] bg-white border border-slate-200 shadow-xl rounded-xl flex flex-col overflow-hidden">
            
            <div className="bg-slate-50 border-b border-slate-200 p-3 flex justify-between items-center">
              <div className="flex gap-2">
                <button 
                  onClick={() => setVistaActual('ORIGINAL')}
                  className={"px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all " + (vistaActual === 'ORIGINAL' ? 'bg-slate-800 text-white shadow-md' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100')}
                >
                  Plan Original
                </button>
                <button 
                  onClick={() => setVistaActual('AMORTIZADO')}
                  className={"px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all " + (vistaActual === 'AMORTIZADO' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100')}
                >
                  Plan Amortizado
                </button>
              </div>
              
              <button 
                onClick={() => setOcultarDetalles(!ocultarDetalles)}
                className="flex items-center text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
              >
                {ocultarDetalles ? <Eye className="w-3.5 h-3.5 mr-1.5" /> : <EyeOff className="w-3.5 h-3.5 mr-1.5" />}
                {ocultarDetalles ? 'Mostrar Interés/Seguro' : 'Ocultar al Cliente'}
              </button>
            </div>
            
            <div className="overflow-auto max-h-[750px]">
              <table className="w-full border-collapse text-[10px]">
                <thead className="bg-white sticky top-0 shadow-[0_1px_3px_rgba(0,0,0,0.05)] z-10">
                  <tr>
                    <th className="p-2 border-b border-slate-200 font-bold text-slate-500 text-center uppercase tracking-wider">Período</th>
                    <th className="p-2 border-b border-slate-200 font-bold text-slate-500 text-right uppercase tracking-wider">Capital</th>
                    {!ocultarDetalles && <th className="p-2 border-b border-slate-200 font-bold text-slate-500 text-right uppercase tracking-wider bg-slate-50/50">Plusvalía</th>}
                    {!ocultarDetalles && <th className="p-2 border-b border-slate-200 font-bold text-slate-500 text-right uppercase tracking-wider bg-slate-50/50">Cuota Base</th>}
                    {!ocultarDetalles && <th className="p-2 border-b border-slate-200 font-bold text-slate-500 text-right uppercase tracking-wider bg-slate-50/50">Seguro</th>}
                    <th className="p-2 border-b border-slate-200 font-black text-slate-800 text-right uppercase tracking-wider bg-slate-50">Cuota Mes</th>
                    <th className="p-2 border-b border-slate-200 font-bold text-slate-500 text-right uppercase tracking-wider">Deuda Total</th>
                    <th className="p-2 border-b border-slate-200 font-bold text-slate-500 text-center uppercase tracking-wider">Pagada</th>
                  </tr>
                </thead>
                <tbody>
                  {/* FILA MES 0 */}
                  <tr className="border-b border-slate-100 hover:bg-slate-50 text-slate-700">
                    <td className="p-2 text-center text-slate-400">0</td>
                    <td className="p-2 text-right">{fD(form.cuotaInicial)}</td>
                    {!ocultarDetalles && <td className="p-2 text-right bg-slate-50/30">{fD(0)}</td>}
                    {!ocultarDetalles && <td className="p-2 text-right bg-slate-50/30">{fD(0)}</td>}
                    {!ocultarDetalles && <td className="p-2 text-right bg-slate-50/30">{fD(0)}</td>}
                    <td className="p-2 text-right font-bold bg-slate-50/50">{fD(form.cuotaInicial)}</td>
                    <td className="p-2 text-right font-medium">{fD(calculos.Total_Deuda_Original_Futura)}</td>
                    <td className="p-2 text-center text-emerald-500 font-bold">SI</td>
                  </tr>

                  {/* FILAS DINÁMICAS */}
                  {tablaActiva.map((row, idx) => {
                    if (row.esAbono) {
                      return (
                        <tr key={"abono"+idx} className="bg-emerald-50/80 border-y-2 border-emerald-200 shadow-sm relative z-0">
                          <td className="p-2 text-center font-black text-emerald-700">{row.periodo}</td>
                          <td className="p-2 text-right font-black text-emerald-700">{fD(row.capital)}</td>
                          {!ocultarDetalles && <td className="p-2 text-center text-emerald-600/50 text-[8px] uppercase tracking-widest" colSpan={3}>Abono a Capital</td>}
                          <td className="p-2 text-right font-black text-emerald-700">{fD(row.capital)}</td>
                          <td className="p-2 text-right font-black text-blue-700">{fD(row.balance)}</td>
                          <td className="p-2 text-center font-bold text-emerald-600">SI</td>
                        </tr>
                      );
                    }

                    const isPagada = row.pagada === 'SI';
                    return (
                      <tr key={idx} className={"border-b border-slate-50 hover:bg-slate-50 transition-colors " + (isPagada ? 'text-slate-400 opacity-80' : 'text-slate-700')}>
                        <td className="p-2 text-center">{row.periodo}</td>
                        <td className="p-2 text-right">{fD(row.capital)}</td>
                        {!ocultarDetalles && <td className="p-2 text-right bg-slate-50/30">{fD(row.plusvalia)}</td>}
                        {!ocultarDetalles && <td className="p-2 text-right bg-slate-50/30">{fD(row.cuotaBase)}</td>}
                        {!ocultarDetalles && <td className="p-2 text-right bg-slate-50/30">{fD(row.seguro)}</td>}
                        <td className="p-2 text-right font-bold bg-slate-50/50 text-slate-800">{fD(row.pagoTotal)}</td>
                        <td className="p-2 text-right">{fD(row.balance)}</td>
                        <td className={"p-2 text-center font-bold " + (isPagada ? 'text-emerald-500' : 'text-slate-300')}>{row.pagada}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* COLUMNA DERECHA: CONTRATO Y RESULTADOS */}
          <div className="w-full xl:w-[52%] flex flex-col space-y-4">
            
            {vistaActual === 'AMORTIZADO' && parseFloat(form.montoAmortizar) > 0 && (
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-5 text-white shadow-xl flex items-center justify-between transform transition-all hover:scale-[1.01]">
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-full mr-4"><Clock className="w-6 h-6 text-white" /></div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-100 mb-1">Impacto de la Amortización</h3>
                    <p className="text-sm font-medium leading-tight">
                      El cliente se acaba de ahorrar <strong className="text-lg font-black bg-white/20 px-2 py-0.5 rounded mx-1">{calculos.mesesAhorrados} meses</strong> de tiempo<br/>
                      y un total de <strong className="text-lg font-black bg-white/20 px-2 py-0.5 rounded mx-1">{fD(calculos.ahorroIntereses)}</strong> en deudas futuras.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex-1">
              <div className="flex px-4 border-b border-slate-200 overflow-x-auto whitespace-nowrap pt-4 bg-slate-50">
                <span className="px-3 py-2 text-slate-800 font-bold border-b-2 border-slate-800 text-[11px] cursor-pointer">Básicos y Plan de Pagos</span>
                <span className="px-3 py-2 text-blue-600 font-medium text-[11px] hover:text-blue-800 cursor-not-allowed opacity-50">Doc. Adjuntos</span>
                <span className="px-3 py-2 text-blue-600 font-medium text-[11px] hover:text-blue-800 cursor-not-allowed opacity-50">Histórico de Pagos</span>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                  
                  {/* Básicos */}
                  <div>
                    <h4 className="font-bold text-slate-800 border-b-2 border-slate-100 pb-2 mb-3 text-[11px] uppercase tracking-wider">Básicos de Contrato</h4>
                    <div className="space-y-2.5 text-[10px]">
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium w-1/3">Cliente(s):</span><span className="text-blue-600 font-bold w-2/3 uppercase text-right">{form.cliente || '---'}</span></div>
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium w-1/3">Realizado Por:</span><span className="text-slate-800 w-2/3 uppercase text-right">ADMINISTRADOR CRM</span></div>
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium w-1/3">Fecha Contrato:</span><span className="text-slate-800 w-2/3 text-right">HOY</span></div>
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium w-1/3">Proyecto:</span><span className="text-slate-800 w-2/3 uppercase text-right">{form.proyecto || '---'}</span></div>
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium w-1/3">Lote:</span><span className="text-slate-800 w-2/3 uppercase text-right">UV: {form.uv} MZN: {form.mzn} LT: {form.lote}</span></div>
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium w-1/3">M2 Lote:</span><span className="text-slate-800 w-2/3 text-right">{form.superficie || 0} m2</span></div>
                    </div>
                  </div>

                  {/* Financiero */}
                  <div>
                    <h4 className="font-bold text-slate-800 border-b-2 border-slate-100 pb-2 mb-3 text-[11px] uppercase tracking-wider">Financiero de Contrato</h4>
                    <div className="space-y-2.5 text-[10px]">
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium">Total Contrato:</span><span className="text-slate-800 font-bold">{fD(form.precioTotal)}</span></div>
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium">Tipo de Pago:</span><span className="text-slate-800 font-bold">MENSUAL</span></div>
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium">Cuota Inicial:</span><span className="text-slate-800 font-bold">{fD(form.cuotaInicial)}</span></div>
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium">Cuota Periódica Base:</span><span className="text-slate-800 font-bold">{fD(calculos.Cuota_Total_Mes - calculos.SEGURO_MENSUAL)}</span></div>
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium">Cuota Seguro:</span><span className="text-slate-800 font-bold">{fD(calculos.SEGURO_MENSUAL)}</span></div>
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium">Cuota Total Mensual:</span><span className="text-slate-800 font-black text-blue-700">{fD(calculos.Cuota_Total_Mes)}</span></div>
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium">Plazo Original (Años):</span><span className="text-slate-800 font-bold">{form.plazoAnios}</span></div>
                      <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium">Cuotas Pagadas:</span><span className="text-slate-800 font-bold">{form.cuotasPagadas || 0}</span></div>
                    </div>
                  </div>

                  {/* Resultados Dinámicos */}
                  <div className="col-span-2 mt-2">
                    <h4 className="font-bold text-slate-800 border-b-2 border-slate-800 pb-2 mb-3 text-[11px] uppercase tracking-wider flex justify-between">
                      <span>Proyección {vistaActual === 'ORIGINAL' ? 'Original' : 'Amortizada'}</span>
                      {vistaActual === 'AMORTIZADO' && <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[9px]">Calculado al Mes {form.cuotasPagadas || 0}</span>}
                    </h4>
                    <div className="grid grid-cols-2 gap-x-10">
                      <div className="space-y-2.5 text-[10px]">
                        <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium">Total Deuda Futura Proyectada:</span><span className="text-slate-800 font-bold">{vistaActual === 'ORIGINAL' ? fD(calculos.Total_Deuda_Original_Futura) : fD(calculos.Nueva_Deuda_Total)}</span></div>
                        <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500 font-medium">Capital Puro a Financiar:</span><span className="text-slate-800">{vistaActual === 'ORIGINAL' ? fD(calculos.Saldo_Real_A_Financiar) : "Recalculado"}</span></div>
                      </div>
                      <div className="space-y-2.5 text-[10px]">
                        <div className="flex justify-between border-b border-slate-50 pb-1 bg-blue-50/50 p-1 rounded"><span className="text-slate-700 font-bold">Cuotas Restantes a Pagar:</span><span className="text-blue-700 font-black text-sm">{vistaActual === 'ORIGINAL' ? calculos.n_meses - parseInt(form.cuotasPagadas || 0) : calculos.cuotasRestantes}</span></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
