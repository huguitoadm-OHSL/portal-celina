import React, { useState, useMemo } from 'react';
import { Calculator, CheckCircle2, XCircle } from 'lucide-react';

export default function SimuladorAmortizacion() {
  // ================= 1. ESTADO DEL SIMULADOR (EDITABLES Y FIJOS) =================
  const [form, setForm] = useState({
    cliente: 'JHONATAN VILLANUEVA APURI',
    proyecto: 'CELINA MUYURINA',
    uv: '49', mzn: '30', lote: '31', superficie: '300.0',
    nroContrato: 'C2603500573',
    precioTotal: 52761.21,
    cuotaInicial: 2870.00,
    montoAmortizar: 2494.56,
    plazoMeses: 120
  });

  // VALORES FIJOS BLINDADOS (Según instrucción del CEO)
  const TASA_ANUAL = 12.1133; 
  const SEGURO_MENSUAL = 23.80;

  const [vistaActual, setVistaActual] = useState('AMORTIZADO'); // 'ORIGINAL' o 'AMORTIZADO'

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ================= 2. MOTOR MATEMÁTICO (INGENIERÍA INVERSA DEL CRM) =================
  const calculos = useMemo(() => {
    const P_total = parseFloat(form.precioTotal) || 0;
    const Enganche = parseFloat(form.cuotaInicial) || 0;
    const Amortizacion = parseFloat(form.montoAmortizar) || 0;
    const n_meses = parseInt(form.plazoMeses) || 120;
    
    // 1. Cálculo del Plan Original
    const Total_Cuotas_Original = P_total - Enganche;
    const Cuota_Total_Mes = Total_Cuotas_Original / n_meses;
    const Cuota_Base = Cuota_Total_Mes - SEGURO_MENSUAL;
    const r_mensual = TASA_ANUAL / 100 / 12;

    // Capital real escondido dentro del Total Financiado
    const Capital_Verdadero = Cuota_Base * (1 - Math.pow(1 + r_mensual, -n_meses)) / r_mensual;
    const Total_Plusvalia_Original = (Cuota_Base * n_meses) - Capital_Verdadero;
    
    // Generar Tabla Original
    let tablaOriginal = [];
    let balanceDeudaOriginal = Total_Cuotas_Original;
    let capitalRestanteOri = Capital_Verdadero;

    for (let i = 1; i <= n_meses; i++) {
      const interes = capitalRestanteOri * r_mensual;
      const capital = Cuota_Base - interes;
      capitalRestanteOri -= capital;
      balanceDeudaOriginal -= Cuota_Total_Mes;
      
      tablaOriginal.push({
        periodo: i,
        capital: capital,
        plusvalia: interes,
        cuotaBase: Cuota_Base,
        seguro: SEGURO_MENSUAL,
        pagoTotal: Cuota_Total_Mes,
        balance: Math.max(0, balanceDeudaOriginal),
        pagada: 'NO'
      });
    }

    // 2. Cálculo del Plan Amortizado (Mes 0)
    let Capital_Nuevo = Capital_Verdadero - Amortizacion;
    let tablaAmortizada = [];
    let cuotasRestantes = 0;
    let Nueva_Deuda_Total = 0;

    if (Capital_Nuevo > 0) {
      // Calcular nuevo plazo manteniendo la cuota base
      cuotasRestantes = -Math.log(1 - (Capital_Nuevo * r_mensual) / Cuota_Base) / Math.log(1 + r_mensual);
      cuotasRestantes = Math.ceil(cuotasRestantes);

      let capTemp = Capital_Nuevo;
      let totalInteresNuevo = 0;

      // Pre-calcular la nueva deuda total para la columna de Balance
      for (let i = 1; i <= cuotasRestantes; i++) {
        const int = capTemp * r_mensual;
        let cap = Cuota_Base - int;
        if (capTemp - cap < 0) cap = capTemp;
        capTemp -= cap;
        totalInteresNuevo += int;
        Nueva_Deuda_Total += (cap + int + SEGURO_MENSUAL);
      }

      let balanceDeudaAmortizada = Nueva_Deuda_Total;
      capTemp = Capital_Nuevo;

      for (let i = 1; i <= cuotasRestantes; i++) {
        const int = capTemp * r_mensual;
        let cap = Cuota_Base - int;
        if (capTemp - cap < 0) cap = capTemp;
        capTemp -= cap;
        const pagoMes = cap + int + SEGURO_MENSUAL;
        balanceDeudaAmortizada -= pagoMes;

        tablaAmortizada.push({
          periodo: i,
          capital: cap,
          plusvalia: int,
          cuotaBase: cap + int,
          seguro: SEGURO_MENSUAL,
          pagoTotal: pagoMes,
          balance: Math.max(0, balanceDeudaAmortizada),
          pagada: 'NO'
        });
      }
    }

    return {
      Capital_Verdadero, Total_Plusvalia_Original, Total_Cuotas_Original,
      Cuota_Total_Mes, tablaOriginal, tablaAmortizada,
      Nueva_Deuda_Total, Capital_Nuevo, cuotasRestantes
    };
  }, [form]);

  const fD = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num || 0);
  const fNum = (num) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num || 0);

  const tablaActiva = vistaActual === 'ORIGINAL' ? calculos.tablaOriginal : calculos.tablaAmortizada;

  return (
    <div className="font-sans bg-[#f4f6f8] min-h-screen p-4">
      
      {/* ================= PANEL DE EDICIÓN SUPERIOR ================= */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 flex items-center mb-4">
          <Calculator className="w-4 h-4 mr-2 text-blue-600" /> Parámetros del Simulador
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cliente Titular</label>
            <input type="text" name="cliente" value={form.cliente} onChange={handleChange} className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Proyecto / UV / MZN / LT</label>
            <div className="flex gap-1">
              <input type="text" name="proyecto" value={form.proyecto} onChange={handleChange} className="w-full px-2 py-1.5 border border-slate-300 rounded text-[10px] outline-none" title="Proyecto" />
              <input type="text" name="uv" value={form.uv} onChange={handleChange} className="w-10 px-1 py-1.5 border border-slate-300 rounded text-[10px] text-center outline-none" title="UV" />
              <input type="text" name="mzn" value={form.mzn} onChange={handleChange} className="w-10 px-1 py-1.5 border border-slate-300 rounded text-[10px] text-center outline-none" title="MZN" />
              <input type="text" name="lote" value={form.lote} onChange={handleChange} className="w-10 px-1 py-1.5 border border-slate-300 rounded text-[10px] text-center outline-none" title="LOTE" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Total Contrato ($)</label>
            <input type="number" name="precioTotal" value={form.precioTotal} onChange={handleChange} className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500 font-bold text-slate-800" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cuota Inicial ($)</label>
            <input type="number" name="cuotaInicial" value={form.cuotaInicial} onChange={handleChange} className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-blue-500 font-bold text-slate-800" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1 bg-blue-50 px-1 rounded">Monto a Amortizar ($)</label>
            <input type="number" name="montoAmortizar" value={form.montoAmortizar} onChange={handleChange} className="w-full px-2 py-1.5 border-2 border-blue-400 bg-blue-50 rounded text-xs outline-none focus:border-blue-600 font-bold text-blue-800" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plusvalía (%)</label>
            <input type="number" value={TASA_ANUAL} readOnly className="w-full px-2 py-1.5 bg-slate-100 border border-slate-200 rounded text-xs text-slate-500 font-bold cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Seguro Fijo ($)</label>
            <input type="number" value={SEGURO_MENSUAL} readOnly className="w-full px-2 py-1.5 bg-slate-100 border border-slate-200 rounded text-xs text-slate-500 font-bold cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cuotas Pagadas</label>
            <input type="number" value={0} readOnly className="w-full px-2 py-1.5 bg-slate-100 border border-slate-200 rounded text-xs text-slate-500 font-bold cursor-not-allowed" title="Amortización desde el mes 0" />
          </div>
        </div>
      </div>

      {/* ================= CONTENEDOR ESTILO CRM ================= */}
      <div className="flex flex-col xl:flex-row gap-4">
        
        {/* COLUMNA IZQUIERDA: TABLA DE PAGOS */}
        <div className="w-full xl:w-[45%] bg-white border border-slate-200 shadow-sm flex flex-col">
          <div className="overflow-auto max-h-[800px]">
            <table className="w-full border-collapse text-[10px]">
              <thead className="bg-[#f8f9fa] sticky top-0 shadow-[0_1px_2px_rgba(0,0,0,0.1)] z-10">
                <tr>
                  <th className="p-1.5 border-r border-slate-200 font-bold text-slate-600 text-center">Período</th>
                  <th className="p-1.5 border-r border-slate-200 font-bold text-slate-600 text-right">Capital</th>
                  <th className="p-1.5 border-r border-slate-200 font-bold text-slate-600 text-right">Plusvalía</th>
                  <th className="p-1.5 border-r border-slate-200 font-bold text-slate-600 text-right">Cuota</th>
                  <th className="p-1.5 border-r border-slate-200 font-bold text-slate-600 text-right">Pago Seguro</th>
                  <th className="p-1.5 border-r border-slate-200 font-bold text-slate-600 text-right">Total Pago (Cuota Mes)</th>
                  <th className="p-1.5 border-r border-slate-200 font-bold text-slate-600 text-right">Balance Principal</th>
                  <th className="p-1.5 font-bold text-slate-600 text-center">Pagada</th>
                </tr>
              </thead>
              <tbody>
                {/* FILAS MES 0 */}
                <tr className="border-b border-slate-100 hover:bg-slate-50 text-slate-700">
                  <td className="p-1.5 border-r border-slate-100 text-center">0</td>
                  <td className="p-1.5 border-r border-slate-100 text-right">{fD(form.cuotaInicial)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right">{fD(0)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right">{fD(0)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right">{fD(0)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right font-bold">{fD(form.cuotaInicial)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right">{fD(calculos.Total_Cuotas_Original)}</td>
                  <td className="p-1.5 text-center text-emerald-600 font-bold">SI</td>
                </tr>

                {vistaActual === 'AMORTIZADO' && parseFloat(form.montoAmortizar) > 0 && (
                  <tr className="border-b border-slate-100 bg-blue-50 text-blue-800 font-bold">
                    <td className="p-1.5 border-r border-blue-100 text-center">0</td>
                    <td className="p-1.5 border-r border-blue-100 text-right">{fD(form.montoAmortizar)}</td>
                    <td className="p-1.5 border-r border-blue-100 text-right">{fD(0)}</td>
                    <td className="p-1.5 border-r border-blue-100 text-right">{fD(0)}</td>
                    <td className="p-1.5 border-r border-blue-100 text-right">{fD(0)}</td>
                    <td className="p-1.5 border-r border-blue-100 text-right">{fD(form.montoAmortizar)}</td>
                    <td className="p-1.5 border-r border-blue-100 text-right">{fD(calculos.Nueva_Deuda_Total)}</td>
                    <td className="p-1.5 text-center">SI</td>
                  </tr>
                )}

                {/* FILAS DE MESES DINÁMICAS */}
                {tablaActiva.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 text-slate-700">
                    <td className="p-1.5 border-r border-slate-100 text-center">{row.periodo}</td>
                    <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.capital)}</td>
                    <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.plusvalia)}</td>
                    <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.cuotaBase)}</td>
                    <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.seguro)}</td>
                    <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.pagoTotal)}</td>
                    <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.balance)}</td>
                    <td className="p-1.5 text-center">NO</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESULTADOS Y CONTRATO CLONADO */}
        <div className="w-full xl:w-[55%] flex flex-col space-y-4">
          
          <div className="bg-white border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm text-slate-800 mb-4">Resultado de la Simulación</h3>
            
            {/* TABS SIMULADOS INTERACTIVOS */}
            <div className="flex border-b border-slate-200 mb-5">
              <button 
                onClick={() => setVistaActual('ORIGINAL')}
                className={"px-4 py-2 text-[11px] outline-none transition-colors " + (vistaActual === 'ORIGINAL' ? "text-slate-800 font-bold border-b-2 border-slate-800 bg-white" : "text-blue-600 hover:text-blue-800 font-semibold")}
              >
                Plan de Pago - Original
              </button>
              <button 
                onClick={() => setVistaActual('AMORTIZADO')}
                className={"px-4 py-2 text-[11px] outline-none transition-colors " + (vistaActual === 'AMORTIZADO' ? "text-slate-800 font-bold border-b-2 border-slate-800 bg-white" : "text-blue-600 hover:text-blue-800 font-semibold")}
              >
                Plan de Pago - Amortizado ({fD(form.montoAmortizar)})
              </button>
            </div>

            {/* TABLAS DE SALDOS */}
            <div className="grid grid-cols-2 gap-8 mb-4">
              <div>
                <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1 text-[11px]">Plan de Pago:</h4>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between"><span className="text-slate-600">Moneda del Crédito:</span> <span className="text-slate-800 uppercase">DOLARES</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Total Cancelado:</span> <span className="text-slate-800">{vistaActual === 'ORIGINAL' ? fD(0) : fD(form.montoAmortizar)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Total Capital Cancelado:</span> <span className="text-slate-800">{vistaActual === 'ORIGINAL' ? fD(0) : fD(form.montoAmortizar)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Total Plusvalía Cancelada:</span> <span className="text-slate-800">{fD(0)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Total Seguro Cancelado:</span> <span className="text-slate-800">{fD(0)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Total Cbdl Cancelado:</span> <span className="text-slate-800">{fD(0)}</span></div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1 text-[11px]">Saldos a Cancelar</h4>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between"><span className="text-slate-600">Penalidades a Cancelar:</span> <span className="text-slate-800">0.0</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Saldo Total a Cancelar:</span> <span className="text-slate-800">{vistaActual === 'ORIGINAL' ? fD(calculos.Total_Cuotas_Original) : fD(calculos.Nueva_Deuda_Total)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Saldo Capital a Cancelar:</span> <span className="text-slate-800">{vistaActual === 'ORIGINAL' ? fD(calculos.Capital_Verdadero) : fD(calculos.Capital_Nuevo)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Saldo Plusvalía a Cancelar:</span> <span className="text-slate-800">{vistaActual === 'ORIGINAL' ? fD(calculos.Total_Plusvalia_Original) : fD(calculos.Nueva_Deuda_Total - calculos.Capital_Nuevo - (calculos.cuotasRestantes * SEGURO_MENSUAL))}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Saldo Seguro a Cancelar:</span> <span className="text-slate-800">{vistaActual === 'ORIGINAL' ? fD(form.plazoMeses * SEGURO_MENSUAL) : fD(calculos.cuotasRestantes * SEGURO_MENSUAL)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-600">Saldo Cbdl a Cancelar:</span> <span className="text-slate-800">{fD(0)}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm flex-1">
            <div className="flex px-4 border-b border-slate-200 overflow-x-auto whitespace-nowrap pt-2">
              <span className="px-3 py-1.5 text-slate-800 font-bold border-b-2 border-slate-800 text-[11px] cursor-pointer">Básicos</span>
              <span className="px-3 py-1.5 text-blue-600 font-semibold text-[11px] cursor-pointer hover:underline">Doc. Adjuntos</span>
              <span className="px-3 py-1.5 text-blue-600 font-semibold text-[11px] cursor-pointer hover:underline">Plan de Pagos</span>
              <span className="px-3 py-1.5 text-blue-600 font-semibold text-[11px] cursor-pointer hover:underline">Penalidades</span>
              <span className="px-3 py-1.5 text-blue-600 font-semibold text-[11px] cursor-pointer hover:underline">Penalidades Diferidas</span>
              <span className="px-3 py-1.5 text-blue-600 font-semibold text-[11px] cursor-pointer hover:underline">Histórico de Pagos</span>
            </div>

            <div className="p-5">
              <div className="mb-4">
                <span className="text-[11px] font-bold text-slate-800">Plan de Pago Activo:</span>
                <span className="ml-2 text-[9px] font-bold text-emerald-600 border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 rounded">SI</span>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 text-[11px]">Básicos de Contrato</h4>
                  <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold w-1/3">Cliente(s):</span><span className="text-blue-600 font-bold w-2/3 cursor-pointer hover:underline uppercase">{form.cliente}</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold w-1/3">Cliente Titular:</span><span className="text-blue-600 font-bold w-2/3 cursor-pointer hover:underline uppercase">{form.cliente}</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold w-1/3">Realizado Por:</span><span className="text-slate-800 w-2/3 uppercase">ADMINISTRADOR SISTEMA</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold w-1/3">Fecha Contrato:</span><span className="text-slate-800 w-2/3">HOY</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold w-1/3">Proyecto:</span><span className="text-slate-800 w-2/3 uppercase">{form.proyecto}</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold w-1/3">Lote:</span><span className="text-slate-800 w-2/3 uppercase">UV: {form.uv} MZN: {form.mzn} LOTE: {form.lote}</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold w-1/3">M2 Lote:</span><span className="text-slate-800 w-2/3">{form.superficie} m2</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold w-1/3">Tipo de Contrato:</span><span className="text-slate-800 w-2/3">CONTRATO DE VENTA CON RESERVA DE DERECHO PROPIETARIO</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold w-1/3">Nro Contrato:</span><span className="text-slate-800 w-2/3 uppercase">{form.nroContrato}</span></div>
                    <div className="flex justify-between items-center pb-1"><span className="text-slate-600 font-bold w-1/3">Estado Contrato:</span><div className="w-2/3"><span className="text-[9px] font-bold text-emerald-600 border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 rounded">VIGENTE</span></div></div>
                    <div className="flex justify-between items-center pb-1"><span className="text-slate-600 font-bold w-1/3">Procesado?:</span><div className="w-2/3"><span className="text-[9px] font-bold text-red-600 border border-red-300 bg-red-50 px-1.5 py-0.5 rounded">NO</span></div></div>
                    <div className="flex justify-between items-center"><span className="text-slate-600 font-bold w-1/3">Fallecido?:</span><div className="w-2/3"><span className="text-[9px] font-bold text-emerald-600 border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 rounded">NO</span></div></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 text-[11px]">Financiero de Contrato</h4>
                  <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold">Total Contrato:</span><span className="text-slate-800">{fD(form.precioTotal)}</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold">Tipo de Pago:</span><span className="text-slate-800">MENSUAL</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold">Total Cuotas:</span><span className="text-slate-800">{fD(calculos.Total_Cuotas_Original)}</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold">Cuota Inicial:</span><span className="text-slate-800">{fD(form.cuotaInicial)}</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold">Cuota Periódica:</span><span className="text-slate-800">{fNum(calculos.Cuota_Total_Mes - SEGURO_MENSUAL)}</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold">Cuota Periódica por Seguro:</span><span className="text-slate-800">{fD(SEGURO_MENSUAL)}</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold">Plazo en Años:</span><span className="text-slate-800">{form.plazoMeses / 12}</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold">Cantidad de Períodos:</span><span className="text-slate-800">{vistaActual === 'ORIGINAL' ? form.plazoMeses : calculos.cuotasRestantes}</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold">Ultima Cuota:</span><span className="text-slate-800">{fD(calculos.Cuota_Total_Mes)}</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold">Fecha Primera Cuota:</span><span className="text-slate-800">AUTOMÁTICO</span></div>
                    <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-600 font-bold">Fecha de Creación del Seguro:</span><span className="text-slate-800">HOY</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
