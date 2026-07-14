import React, { useState, useMemo } from 'react';
import { Calculator, Calendar, DollarSign, Clock, FileText } from 'lucide-react';

export default function SimuladorAmortizacion() {
  // ================= 1. ESTADO DEL SIMULADOR (INPUTS SIMPLIFICADOS) =================
  const [params, setParams] = useState({
    proyecto: 'CELINA MUYURINA',
    uv: '49', mzn: '30', lote: '31', superficie: '300.01',
    precioTotal: 52781.21,
    cuotaInicial: 2870.00,
    montoAmortizar: 2494.56, // Amortización en Cuota Cero
    tasaAnual: 7.17, // Tasa de plusvalía anual
    plazoMeses: 120, // Ej: 10 años = 120 meses
    seguroMensual: 23.80
  });

  const handleChange = (e) => setParams(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ================= 2. MOTOR MATEMÁTICO (AMORTIZACIÓN CUOTA CERO) =================
  const calculos = useMemo(() => {
    const P_total = parseFloat(params.precioTotal) || 0;
    const Enganche = parseFloat(params.cuotaInicial) || 0;
    const Amortizacion = parseFloat(params.montoAmortizar) || 0;
    
    // El Capital Real a Financiar es el Precio menos la Cuota Inicial y menos la Amortización anticipada
    const CapitalFinanciar = Math.max(0, P_total - Enganche - Amortizacion);
    
    const r_mensual = (parseFloat(params.tasaAnual) || 0) / 100 / 12;
    const n_meses = parseInt(params.plazoMeses) || 1;
    const seguro = parseFloat(params.seguroMensual) || 0;

    // Cálculo de la Cuota Base (Sistema Francés) sobre el capital ya reducido
    let cuotaBase = 0;
    if (r_mensual > 0 && CapitalFinanciar > 0) {
      cuotaBase = (CapitalFinanciar * r_mensual * Math.pow(1 + r_mensual, n_meses)) / (Math.pow(1 + r_mensual, n_meses) - 1);
    } else if (CapitalFinanciar > 0) {
      cuotaBase = CapitalFinanciar / n_meses; // Sin intereses
    }
    
    const cuotaTotalMes = cuotaBase + seguro;

    let balanceActual = CapitalFinanciar;
    let tabla = [];
    let interesesTotales = 0;

    // Bucle para armar la tabla de 1 hasta N meses
    for (let i = 1; i <= n_meses; i++) {
      if (balanceActual <= 0) break;

      const interes = balanceActual * r_mensual;
      let capital = cuotaBase - interes;
      
      // Ajuste milimétrico de la última cuota
      if (balanceActual - capital < 0.01) {
        capital = balanceActual;
      }
      
      balanceActual -= capital;
      interesesTotales += interes;
      
      tabla.push({
        periodo: i,
        capital: capital,
        plusvalia: interes,
        cuotaBase: capital + interes,
        seguro: seguro,
        pagoTotal: capital + interes + seguro,
        balance: Math.max(0, balanceActual),
        pagada: 'NO'
      });
    }

    // Ahorro estimado (Si no hubiera amortizado vs habiendo amortizado)
    // Simulamos la cuota que habría pagado SIN amortizar
    const capitalSinAmortizar = P_total - Enganche;
    const cuotaSinAmortizar = (capitalSinAmortizar * r_mensual * Math.pow(1 + r_mensual, n_meses)) / (Math.pow(1 + r_mensual, n_meses) - 1);
    const interesesSinAmortizar = (cuotaSinAmortizar * n_meses) - capitalSinAmortizar;
    const ahorroIntereses = interesesSinAmortizar - interesesTotales;

    return {
      CapitalFinanciar, cuotaBase, cuotaTotalMes, tabla,
      interesesTotales, ahorroIntereses,
      totalFinanciado: CapitalFinanciar + interesesTotales
    };
  }, [params]);

  // Formateador de moneda
  const fD = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num || 0);

  return (
    <div className="animate-in fade-in duration-500 font-sans">
      
      {/* ================= PANEL DE CONTROL SUPERIOR (DARK MODE) ================= */}
      <div className="bg-[#0f172a] rounded-xl p-5 mb-6 shadow-xl text-white">
        <h2 className="text-lg font-black flex items-center mb-4 text-emerald-400">
          <Calculator className="w-5 h-5 mr-2" /> Simulador: Amortización Anticipada (Cuota Cero)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Total Contrato</label>
            <input type="number" name="precioTotal" value={params.precioTotal} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cuota Inicial</label>
            <input type="number" name="cuotaInicial" value={params.cuotaInicial} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-emerald-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-black text-amber-400 uppercase mb-1">Amortización (Antes de empezar)</label>
            <input type="number" name="montoAmortizar" value={params.montoAmortizar} onChange={handleChange} className="w-full px-3 py-2 bg-amber-500/20 border border-amber-500/50 rounded-lg text-lg outline-none focus:border-amber-400 font-black text-amber-300 shadow-inner" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plazo (Meses)</label>
            <input type="number" name="plazoMeses" value={params.plazoMeses} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plusvalía (%)</label>
            <input type="number" step="0.01" name="tasaAnual" value={params.tasaAnual} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Seguro Fijo</label>
            <input type="number" step="0.01" name="seguroMensual" value={params.seguroMensual} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-emerald-500" />
          </div>
        </div>
      </div>

      {/* ================= CONTENEDOR PRINCIPAL ESTILO CRM ================= */}
      <div className="bg-white border border-slate-200 shadow-sm flex flex-col xl:flex-row min-h-[700px] text-[11px] text-slate-700">
        
        {/* COLUMNA IZQUIERDA: TABLA DE PAGOS */}
        <div className="w-full xl:w-[60%] border-r border-slate-200 flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 p-2.5 font-bold text-slate-800 flex justify-between items-center">
            <span>Plan de Pagos Detallado</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">Tabla Generada con Éxito</span>
          </div>
          
          <div className="overflow-auto max-h-[800px] flex-1">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100 sticky top-0 border-b border-slate-200 shadow-sm z-10">
                <tr>
                  <th className="p-2 border-r border-slate-200 font-bold text-left whitespace-nowrap">Período</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-right whitespace-nowrap">Capital</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-right whitespace-nowrap">Plusvalía</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-right whitespace-nowrap">Cuota</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-right whitespace-nowrap">Seguro</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-right whitespace-nowrap">Total Pago</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-right whitespace-nowrap text-blue-800">Balance Principal</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-center whitespace-nowrap">Pagada</th>
                </tr>
              </thead>
              <tbody>
                {/* FILA CERO (AMORTIZACIÓN INICIAL) */}
                <tr className="border-b-2 border-slate-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                  <td className="p-1.5 border-r border-slate-100 text-center font-bold text-emerald-700">0</td>
                  <td className="p-1.5 border-r border-slate-100 text-right font-bold text-emerald-700">{fD(params.montoAmortizar)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right text-emerald-700">{fD(0)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right text-emerald-700">{fD(0)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right text-emerald-700">{fD(0)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right font-black text-emerald-700">{fD(params.montoAmortizar)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right font-black text-blue-700">{fD(calculos.CapitalFinanciar)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-center font-bold text-emerald-600">SI</td>
                </tr>

                {/* FILAS DE MESES GENERADOS (1 a N) */}
                {calculos.tabla.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-slate-800">
                    <td className="p-1.5 border-r border-slate-100 text-center">{row.periodo}</td>
                    <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.capital)}</td>
                    <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.plusvalia)}</td>
                    <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.cuotaBase)}</td>
                    <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.seguro)}</td>
                    <td className="p-1.5 border-r border-slate-100 text-right font-bold">{fD(row.pagoTotal)}</td>
                    <td className="p-1.5 border-r border-slate-100 text-right font-bold text-blue-700">{fD(row.balance)}</td>
                    <td className="p-1.5 border-r border-slate-100 text-center font-bold text-slate-300">{row.pagada}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESULTADOS Y CLON DE CONTRATO VISUAL */}
        <div className="w-full xl:w-[40%] bg-[#fafbfc] flex flex-col">
          
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-[14px] text-slate-800 mb-4 font-normal">Resultado de la Simulación</h3>
            
            <div className="flex border-b border-slate-200 mb-4">
              <div className="px-4 py-2 text-slate-800 font-bold border-b-2 border-slate-800 text-[11px] cursor-pointer bg-white">
                Plan de Pago - Amortizado al Inicio ({fD(params.montoAmortizar)})
              </div>
            </div>

            <div className="border border-slate-200 bg-white p-3 mb-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">Plan de Pago:</h4>
                  <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-[10px]">
                    <span className="text-slate-600">Moneda del Crédito:</span> <span className="font-bold">DOLARES</span>
                    <span className="text-slate-600">Total Cancelado:</span> <span>{fD(params.montoAmortizar)}</span>
                    <span className="text-slate-600">Total Capital Cancelado:</span> <span>{fD(params.montoAmortizar)}</span>
                    <span className="text-slate-600">Total Plusvalía Cancelada:</span> <span>{fD(0)}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">Saldos a Cancelar</h4>
                  <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-[10px]">
                    <span className="text-slate-600">Saldo Total a Cancelar:</span> <span>{fD(calculos.CapitalFinanciar)}</span>
                    <span className="text-slate-600">Saldo Capital a Cancelar:</span> <span>{fD(calculos.CapitalFinanciar)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ARGUMENTO COMERCIAL POTENTE */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start">
              <Clock className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-black text-emerald-800 mb-1">Beneficio de Amortizar en Cuota Cero</p>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Al ingresar {fD(params.montoAmortizar)} antes de empezar a pagar, el cliente reduce su cuota periódica desde el primer día y <strong>se ahorra {fD(calculos.ahorroIntereses)}</strong> en intereses totales durante los {params.plazoMeses} meses.
                </p>
              </div>
            </div>
          </div>

          <div className="flex px-4 border-b border-slate-200 overflow-x-auto whitespace-nowrap bg-white pt-2">
            <span className="px-3 py-1.5 text-blue-600 font-semibold border-b-2 border-blue-600 text-[10px] cursor-pointer">Básicos</span>
            <span className="px-3 py-1.5 text-blue-500 hover:text-blue-700 text-[10px] cursor-pointer">Plan de Pagos</span>
          </div>

          <div className="p-4 bg-white flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-8">
              
              <div>
                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2 text-[11px]">Básicos de Contrato</h4>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium w-1/3">Cliente Titular:</span>
                    <span className="text-blue-600 font-semibold w-2/3 text-left">CLIENTE DEMOSTRACIÓN</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium w-1/3">Proyecto:</span>
                    <span className="text-slate-700 w-2/3 text-left">{params.proyecto}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium w-1/3">Lote:</span>
                    <span className="text-slate-700 w-2/3 text-left">UV: {params.uv} MZN: {params.mzn} LOTE: {params.lote}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium w-1/3">M2 Lote:</span>
                    <span className="text-slate-700 w-2/3 text-left">{params.superficie}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2 text-[11px]">Financiamiento</h4>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium">Total Contrato:</span>
                    <span className="text-slate-700">{fD(params.precioTotal)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium bg-amber-100 px-1 rounded">Amortización (Cuota 0):</span>
                    <span className="text-slate-700 font-bold text-amber-700">{fD(params.montoAmortizar)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium">Cuota Inicial:</span>
                    <span className="text-slate-700">{fD(params.cuotaInicial)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium font-bold text-blue-600">Nueva Cuota Mensual:</span>
                    <span className="text-blue-700 font-black">{fD(calculos.cuotaTotalMes)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium">Cantidad de Períodos:</span>
                    <span className="text-slate-700">{params.plazoMeses}</span>
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
