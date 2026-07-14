import React, { useState, useMemo } from 'react';
import { Calculator, FileText, Calendar, DollarSign, ArrowRight, Clock } from 'lucide-react';

export default function SimuladorAmortizacion() {
  // ================= 1. ESTADO DEL SIMULADOR (INPUTS) =================
  const [params, setParams] = useState({
    proyecto: 'CELINA MUYURINA',
    uv: '49', mzn: '30', lote: '31', superficie: '300.01',
    precioTotal: 52781.21,
    cuotaInicial: 2870.00,
    tasaAnual: 7.17,
    plazoMeses: 120,
    seguroMensual: 23.80,
    cuotasPagadas: 12,
    montoAmortizar: 2494.56
  });

  const handleChange = (e) => setParams(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ================= 2. MOTOR MATEMÁTICO BANCARIO =================
  const calculos = useMemo(() => {
    const P_total = parseFloat(params.precioTotal) || 0;
    const Enganche = parseFloat(params.cuotaInicial) || 0;
    const CapitalInicial = P_total - Enganche;
    const r_mensual = (parseFloat(params.tasaAnual) || 0) / 100 / 12;
    const n_meses = parseInt(params.plazoMeses) || 1;
    const seguro = parseFloat(params.seguroMensual) || 0;
    const pagadas = parseInt(params.cuotasPagadas) || 0;
    const amortizacionExtra = parseFloat(params.montoAmortizar) || 0;

    const cuotaBase = (CapitalInicial * r_mensual * Math.pow(1 + r_mensual, n_meses)) / (Math.pow(1 + r_mensual, n_meses) - 1);
    const cuotaTotalMes = cuotaBase + seguro;

    let balanceActual = CapitalInicial;
    let tabla = [];
    let interesesTotales = 0;

    for (let i = 1; i <= pagadas; i++) {
      const interes = balanceActual * r_mensual;
      const capital = cuotaBase - interes;
      balanceActual -= capital;
      interesesTotales += interes;
      
      tabla.push({
        periodo: i,
        capital: capital,
        plusvalia: interes,
        cuotaBase: cuotaBase,
        seguro: seguro,
        pagoTotal: cuotaTotalMes,
        balance: Math.max(0, balanceActual),
        pagada: 'SI'
      });
    }

    const balanceAntesAmortizacion = balanceActual;
    balanceActual -= amortizacionExtra;
    const balanceDespuesAmortizacion = Math.max(0, balanceActual);

    let cuotasRestantes = 0;
    let interesesNuevos = 0;
    
    if (balanceActual > 0) {
      cuotasRestantes = -Math.log(1 - (balanceActual * r_mensual) / cuotaBase) / Math.log(1 + r_mensual);
      cuotasRestantes = Math.ceil(cuotasRestantes);

      for (let i = 1; i <= cuotasRestantes; i++) {
        const interes = balanceActual * r_mensual;
        let capital = cuotaBase - interes;
        
        if (balanceActual - capital < 0) {
          capital = balanceActual;
        }
        
        balanceActual -= capital;
        interesesNuevos += interes;
        
        tabla.push({
          periodo: pagadas + i,
          capital: capital,
          plusvalia: interes,
          cuotaBase: capital + interes,
          seguro: seguro,
          pagoTotal: capital + interes + seguro,
          balance: Math.max(0, balanceActual),
          pagada: 'NO'
        });
      }
    }

    const ahorroIntereses = ((n_meses - pagadas) * cuotaBase - balanceAntesAmortizacion) - interesesNuevos;
    const cuotasAhorradas = (n_meses - pagadas) - cuotasRestantes;

    return {
      CapitalInicial, cuotaBase, cuotaTotalMes, tabla,
      balanceDespuesAmortizacion, cuotasRestantes, ahorroIntereses, cuotasAhorradas,
      totalFinanciado: CapitalInicial + interesesTotales + interesesNuevos
    };
  }, [params]);

  const fD = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num || 0);

  return (
    <div className="animate-in fade-in duration-500 font-sans">
      
      {/* ================= PANEL DE CONTROL ================= */}
      <div className="bg-[#0f172a] rounded-xl p-5 mb-6 shadow-xl text-white">
        <h2 className="text-lg font-black flex items-center mb-4 text-emerald-400">
          <Calculator className="w-5 h-5 mr-2" /> Motor de Amortización a Capital
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Precio Total</label>
            <input type="number" name="precioTotal" value={params.precioTotal} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cuota Inicial</label>
            <input type="number" name="cuotaInicial" value={params.cuotaInicial} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plazo Original (Meses)</label>
            <input type="number" name="plazoMeses" value={params.plazoMeses} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plusvalía (%)</label>
            <input type="number" step="0.01" name="tasaAnual" value={params.tasaAnual} onChange={handleChange} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-emerald-400 uppercase mb-1">Cuotas Pagadas</label>
            <input type="number" name="cuotasPagadas" value={params.cuotasPagadas} onChange={handleChange} className="w-full px-3 py-2 bg-emerald-900/30 border border-emerald-700 rounded-lg text-sm outline-none focus:border-emerald-500 font-bold text-emerald-300" />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-black text-amber-400 uppercase mb-1">Inyección / Monto a Amortizar ($)</label>
            <input type="number" name="montoAmortizar" value={params.montoAmortizar} onChange={handleChange} className="w-full px-3 py-2 bg-amber-500/20 border border-amber-500/50 rounded-lg text-lg outline-none focus:border-amber-400 font-black text-amber-300" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm flex flex-col xl:flex-row min-h-[700px] text-[11px] text-slate-700">
        
        <div className="w-full xl:w-[60%] border-r border-slate-200 flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 p-2.5 font-bold text-slate-800 flex justify-between items-center">
            <span>Plan de Pagos Detallado</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">Amortización Aplicada en Mes {params.cuotasPagadas}</span>
          </div>
          
          <div className="overflow-auto max-h-[800px] flex-1">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100 sticky top-0 border-b border-slate-200 shadow-sm z-10">
                <tr>
                  <th className="p-2 border-r border-slate-200 font-bold text-left whitespace-nowrap">Período</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-right whitespace-nowrap">Capital</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-right whitespace-nowrap">Plusvalía</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-right whitespace-nowrap">Cuota</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-right whitespace-nowrap">Pago Seguro</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-right whitespace-nowrap">Total Pago</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-right whitespace-nowrap text-blue-800">Balance Principal</th>
                  <th className="p-2 border-r border-slate-200 font-bold text-center whitespace-nowrap">Pagada</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <td className="p-1.5 border-r border-slate-100 text-center text-slate-500">0</td>
                  <td className="p-1.5 border-r border-slate-100 text-right">{fD(params.cuotaInicial)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right">{fD(0)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right">{fD(0)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right">{fD(0)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right font-bold">{fD(params.cuotaInicial)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-right font-bold text-blue-700">{fD(calculos.CapitalInicial)}</td>
                  <td className="p-1.5 border-r border-slate-100 text-center font-bold text-emerald-600">SI</td>
                </tr>

                {calculos.tabla.map((row, idx) => {
                  const esMesAmortizacion = row.periodo === parseInt(params.cuotasPagadas);
                  return (
                    <React.Fragment key={idx}>
                      <tr className={"border-b border-slate-100 hover:bg-slate-50 transition-colors " + (row.pagada === 'SI' ? 'text-slate-500' : 'text-slate-800')}>
                        <td className="p-1.5 border-r border-slate-100 text-center">{row.periodo}</td>
                        <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.capital)}</td>
                        <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.plusvalia)}</td>
                        <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.cuotaBase)}</td>
                        <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.seguro)}</td>
                        <td className="p-1.5 border-r border-slate-100 text-right">{fD(row.pagoTotal)}</td>
                        <td className="p-1.5 border-r border-slate-100 text-right font-bold text-blue-700">{fD(row.balance)}</td>
                        <td className={"p-1.5 border-r border-slate-100 text-center font-bold " + (row.pagada === 'SI' ? 'text-emerald-600' : 'text-slate-300')}>{row.pagada}</td>
                      </tr>

                      {esMesAmortizacion && parseFloat(params.montoAmortizar) > 0 && (
                        <tr className="bg-amber-50 border-b-2 border-amber-200">
                          <td className="p-1.5 border-r border-amber-200 text-center font-bold text-amber-700 bg-amber-100" colSpan="5">
                            AMORTIZACIÓN A CAPITAL APLICADA
                          </td>
                          <td className="p-1.5 border-r border-amber-200 text-right font-black text-amber-700 bg-amber-100">
                            {fD(params.montoAmortizar)}
                          </td>
                          <td className="p-1.5 border-r border-amber-200 text-right font-black text-blue-800 bg-amber-100">
                            {fD(calculos.balanceDespuesAmortizacion)}
                          </td>
                          <td className="p-1.5 text-center font-bold text-amber-700 bg-amber-100">SI</td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full xl:w-[40%] bg-[#fafbfc] flex flex-col">
          
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-[14px] text-slate-800 mb-4 font-normal">Resultado de la Simulación</h3>
            
            <div className="flex border-b border-slate-200 mb-4">
              <div className="px-4 py-2 text-blue-600 font-semibold text-[11px] cursor-pointer">Plan de Pago - Original</div>
              <div className="px-4 py-2 text-slate-800 font-bold border-b-2 border-slate-800 text-[11px] cursor-pointer bg-white">
                Plan de Pago - Amortizado ({fD(params.montoAmortizar)})
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
                    <span className="text-slate-600">Penalidades a Cancelar:</span> <span>0.00</span>
                    <span className="text-slate-600">Saldo Total a Cancelar:</span> <span>{fD(calculos.balanceDespuesAmortizacion)}</span>
                    <span className="text-slate-600">Saldo Capital a Cancelar:</span> <span>{fD(calculos.balanceDespuesAmortizacion)}</span>
                    <span className="text-slate-600">Saldo Plusvalía a Cancelar:</span> <span>Calculado en Cuotas</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-2 flex items-start">
              <Clock className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-black text-emerald-800 mb-1">¡Poderoso Argumento Comercial!</p>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Con esta amortización, el cliente cancela su lote en <strong className="bg-emerald-200 px-1 rounded text-emerald-900">{calculos.cuotasRestantes} meses restantes</strong>.<br/>
                  Se ahorra <strong className="text-emerald-900">{calculos.cuotasAhorradas} meses</strong> de tiempo y <strong className="text-emerald-900">{fD(calculos.ahorroIntereses)}</strong> en intereses de plusvalía.
                </p>
              </div>
            </div>
          </div>

          <div className="flex px-4 border-b border-slate-200 overflow-x-auto whitespace-nowrap bg-white pt-2">
            <span className="px-3 py-1.5 text-blue-600 font-semibold border-b-2 border-blue-600 text-[10px] cursor-pointer">Básicos</span>
            <span className="px-3 py-1.5 text-blue-500 hover:text-blue-700 text-[10px] cursor-pointer">Doc. Adjuntos</span>
            <span className="px-3 py-1.5 text-blue-500 hover:text-blue-700 text-[10px] cursor-pointer">Plan de Pagos</span>
            <span className="px-3 py-1.5 text-blue-500 hover:text-blue-700 text-[10px] cursor-pointer">Penalidades</span>
            <span className="px-3 py-1.5 text-blue-500 hover:text-blue-700 text-[10px] cursor-pointer">Penalidades Diferidas</span>
            <span className="px-3 py-1.5 text-blue-500 hover:text-blue-700 text-[10px] cursor-pointer">Histórico de Pagos</span>
          </div>

          <div className="p-4 bg-white flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-8">
              
              <div>
                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2 text-[11px]">Básicos de Contrato</h4>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium w-1/3">Cliente:</span>
                    <span className="text-blue-600 font-semibold w-2/3 text-left cursor-pointer hover:underline">CLIENTE DEMOSTRACIÓN</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium w-1/3">Cliente Titular:</span>
                    <span className="text-blue-600 font-semibold w-2/3 text-left cursor-pointer hover:underline">CLIENTE DEMOSTRACIÓN</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium w-1/3">Realizado Por:</span>
                    <span className="text-slate-700 w-2/3 text-left uppercase">ADMINISTRADOR CRM</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium w-1/3">Fecha Contrato:</span>
                    <span className="text-slate-700 w-2/3 text-left">Hoy</span>
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
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium w-1/3">Tipo de Contrato:</span>
                    <span className="text-slate-700 w-2/3 text-left">CONTRATO DE VENTA CON RESERVA DE DERECHO...</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium w-1/3">Nro Contrato:</span>
                    <span className="text-slate-700 w-2/3 text-left">C20240000000</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1 items-center">
                    <span className="text-slate-500 font-medium w-1/3">Estado Contrato:</span>
                    <div className="w-2/3 text-left"><span className="text-[9px] font-bold text-emerald-600 border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 rounded">VIGENTE</span></div>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1 items-center">
                    <span className="text-slate-500 font-medium w-1/3">Procesado?:</span>
                    <div className="w-2/3 text-left"><span className="text-[9px] font-bold text-red-600 border border-red-300 bg-red-50 px-1.5 py-0.5 rounded">NO</span></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium w-1/3">Validado?:</span>
                    <div className="w-2/3 text-left"><span className="text-[9px] font-bold text-emerald-600 border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 rounded">SI</span></div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1 mb-2 text-[11px]">Financiamiento de Contrato</h4>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium">Total Contrato:</span>
                    <span className="text-slate-700">{fD(params.precioTotal)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium">Tipo de Pago:</span>
                    <span className="text-slate-700">MENSUAL</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium">Total Cuotas:</span>
                    <span className="text-slate-700">{fD(calculos.totalFinanciado)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium">Cuota Inicial:</span>
                    <span className="text-slate-700">{fD(params.cuotaInicial)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium">Cuota Periódica:</span>
                    <span className="text-slate-700">{fD(calculos.cuotaBase)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium">Cuota Periódica por Seguro:</span>
                    <span className="text-slate-700">{fD(params.seguroMensual)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium">Plazo en Años:</span>
                    <span className="text-slate-700">{params.plazoMeses / 12}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium">Cantidad de Períodos:</span>
                    <span className="text-slate-700">{params.plazoMeses}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium">Ultima Cuota:</span>
                    <span className="text-slate-700">{fD(calculos.cuotaTotalMes)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500 font-medium">Fecha Primera Cuota:</span>
                    <span className="text-slate-700">Automático</span>
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
