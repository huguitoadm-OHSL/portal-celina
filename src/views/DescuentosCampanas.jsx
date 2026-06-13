import React, { useState, useEffect } from 'react';
import { Tag, Search, Edit3, CheckCircle2, AlertTriangle, Receipt, Flame } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { PROYECTOS, PROYECTOS_PROPIOS_1 } from '../constants/proyectos';
import { SUPERVISORES } from '../constants/equipo';
import { formatCurrency } from '../utils/formatters';
import { calcularDescuento, obtenerDatosSupervisor } from '../utils/calculadoras';
import { generarTextoDescuentoCelular } from '../utils/textTemplates';
import { generarHtmlDescuento } from '../utils/htmlTemplates';

export default function DescuentosCampanas() {
  const [formDescuento, setFormDescuento] = useState({
    proyecto: 'El Renacer', uv: '', manzano: '', lote: '', modalidad: 'Crédito', cuota: '', modoCuota: 'monto', modoBusqueda: 'inteligente',
    m2: '', precioM2: '', categoria: '', asesor: '', proyectoManual: '', descuentoManual: '', tipoDescuentoManual: 'porcentaje', descuentoPropiosManual: '23'
  });

  const [supervisorDestino, setSupervisorDestino] = useState(SUPERVISORES[0].correo);
  const [lotesBD, setLotesBD] = useState([]);
  const [cargandoLotes, setCargandoLotes] = useState(true);
  const [loteAutocompletado, setLoteAutocompletado] = useState(false);

  useEffect(() => {
    fetch('./lotes.json').then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        const limpios = data.map(item => ({
          proyecto: item.proyecto || item.PROYECTO || '', uv: item.uv || item.UV || '', manzano: item.mzn || item.MZN || item.manzano || '',
          lote: item.lote || item.LOTE || '', m2: parseFloat(item.superficie || item.m2) || 0, precioM2: parseFloat(item.precio || item.precioM2) || 0, categoria: item.categoria || ''
        })).filter(l => l.proyecto && l.uv && l.manzano && l.lote);
        setLotesBD(limpios);
      }
    }).catch(() => {}).finally(() => setCargandoLotes(false));
  }, []);

  const safeToLower = (val) => val ? String(val).toLowerCase() : '';
  const pL = safeToLower(formDescuento.proyecto); const uL = safeToLower(formDescuento.uv); const mL = safeToLower(formDescuento.manzano);
  
  const opcionesUV = [...new Set(lotesBD.filter(l => safeToLower(l.proyecto).includes(pL)).map(l => l.uv))].sort();
  const opcionesMZN = [...new Set(lotesBD.filter(l => safeToLower(l.proyecto).includes(pL) && safeToLower(l.uv) === uL).map(l => l.manzano))].sort();
  const opcionesLote = [...new Set(lotesBD.filter(l => safeToLower(l.proyecto).includes(pL) && safeToLower(l.uv) === uL && safeToLower(l.manzano) === mL).map(l => l.lote))].sort();

  useEffect(() => {
    const { proyecto, uv, manzano, lote, modoBusqueda } = formDescuento;
    if (modoBusqueda === 'inteligente' && proyecto && uv && manzano && lote && lotesBD.length > 0) {
      const enc = lotesBD.find(l => safeToLower(l.proyecto).includes(safeToLower(proyecto)) && safeToLower(l.uv) === safeToLower(uv) && safeToLower(l.manzano) === safeToLower(manzano) && safeToLower(l.lote) === safeToLower(lote));
      if (enc) { setFormDescuento(p => ({ ...p, m2: enc.m2, precioM2: enc.precioM2, categoria: enc.categoria })); setLoteAutocompletado(true); } 
      else { setLoteAutocompletado(false); }
    } else setLoteAutocompletado(false);
  }, [formDescuento.proyecto, formDescuento.uv, formDescuento.manzano, formDescuento.lote, formDescuento.modoBusqueda, lotesBD]);

  const handleC = (e) => {
    const { name, value } = e.target;
    setFormDescuento(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'proyecto' && value === 'OTRO...') newState.modoBusqueda = 'manual';
      if (newState.modoBusqueda === 'inteligente') {
        if (name === 'proyecto') { newState.uv = ''; newState.manzano = ''; newState.lote = ''; newState.m2 = ''; newState.precioM2 = ''; newState.categoria = ''; }
        else if (name === 'uv') { newState.manzano = ''; newState.lote = ''; newState.m2 = ''; newState.precioM2 = ''; newState.categoria = ''; }
        else if (name === 'manzano') { newState.lote = ''; newState.m2 = ''; newState.precioM2 = ''; newState.categoria = ''; }
      }
      return newState;
    });
  };

  const calculos = calcularDescuento(formDescuento);
  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);

  const pct = calculos.porcentajeCuota || 0;
  const targetPct = pct < 5 ? 5 : 10;
  const fillPct = Math.min((pct / targetPct) * 100, 100);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center"><Tag className="w-6 h-6 mr-2 text-blue-600" /> Descuentos Campañas</h2>
        
        {/* BOTONES: AUTOMÁTICO VS MANUAL RESTAURADOS */}
        <div className="bg-slate-200/60 p-1 rounded-full inline-flex self-start sm:self-auto">
          <button onClick={() => setFormDescuento({...formDescuento, modoBusqueda: 'inteligente'})} disabled={formDescuento.proyecto === 'OTRO...'} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center ${formDescuento.modoBusqueda === 'inteligente' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'} disabled:opacity-40`}><Search className="w-3.5 h-3.5 mr-1.5" /> Automático</button>
          <button onClick={() => setFormDescuento({...formDescuento, modoBusqueda: 'manual'})} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center ${formDescuento.modoBusqueda === 'manual' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}><Edit3 className="w-3.5 h-3.5 mr-1.5" /> Manual</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] 2xl:grid-cols-[1.5fr_1fr] gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 w-full">
            <div><label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Proyecto</label><select name="proyecto" value={formDescuento.proyecto} onChange={handleC} className="w-full px-3 py-2.5 border rounded-xl bg-slate-50 text-sm">{PROYECTOS.map(p => <option key={p} value={p}>{p}</option>)}<option value="OTRO...">OTRO...</option></select></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Modalidad</label><select name="modalidad" value={formDescuento.modalidad} onChange={handleC} className="w-full px-3 py-2.5 border rounded-xl bg-slate-50 text-sm"><option value="Contado">Al Contado</option><option value="Crédito">A Crédito (Plazos)</option></select></div>
          </div>

          {/* BLOQUE MANUAL RESTAURADO */}
          {formDescuento.proyecto === 'OTRO...' && (
            <div className="mb-5 bg-amber-50/80 p-4 rounded-xl border border-amber-200 shadow-sm">
              <h4 className="font-bold text-amber-800 mb-3 text-sm flex items-center"><Edit3 className="w-4 h-4 mr-2" /> Proyecto Manual</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div><label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">Nombre del Proyecto</label><input type="text" name="proyectoManual" value={formDescuento.proyectoManual} onChange={handleC} className="w-full px-3 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white text-sm" placeholder="Ej. Celina VII"/></div>
                 <div><label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">Descuento a Aplicar</label><div className="flex gap-2"><select name="tipoDescuentoManual" value={formDescuento.tipoDescuentoManual} onChange={handleC} className="w-1/2 px-2 py-2.5 border border-amber-200 rounded-xl bg-white text-sm font-semibold focus:ring-2 focus:ring-amber-500 outline-none"><option value="porcentaje">% Desc.</option><option value="monto">$ por m²</option></select><input type="number" name="descuentoManual" value={formDescuento.descuentoManual} onChange={handleC} className="w-1/2 px-3 py-2.5 border border-amber-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Ej. 10"/></div></div>
              </div>
            </div>
          )}

          {formDescuento.modalidad === 'Crédito' && (
            <div className="mb-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-2">Ingresar Cuota Inicial</label>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <select value={formDescuento.modoCuota} onChange={(e) => setFormDescuento({...formDescuento, modoCuota: e.target.value, cuota: ''})} className="flex-1 px-3 py-2.5 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"><option value="monto">Monto ($)</option><option value="porcentaje">Porcentaje (%)</option></select>
                <input type="number" name="cuota" value={formDescuento.cuota} onChange={handleC} className="flex-1 px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-inner" placeholder={formDescuento.modoCuota === 'monto' ? "Ej. 1000" : "Ej. 5"} />
                <div className="flex-1 flex items-center justify-center bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm py-2.5">{formDescuento.modoCuota === 'monto' ? `${formatCurrency(pct)}%` : `$ ${formatCurrency(calculos.montoCuotaNum)}`}</div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-xs font-bold mb-1"><span className="text-slate-500">Avance Cuota Inicial</span><span className="text-blue-600">Meta: {targetPct}%</span></div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500" style={{width: `${fillPct}%`}}></div></div>
                {pct > 0 && pct < targetPct && <p className="text-[10px] font-bold text-amber-600 mt-1.5 flex items-center"><Flame className="w-3 h-3 mr-1"/> ¡Sube al {targetPct}% para mejorar el descuento!</p>}
              </div>
            </div>
          )}

          {/* AJUSTE MANUAL DEL 23% RESTAURADO */}
          {PROYECTOS_PROPIOS_1.includes(formDescuento.proyecto) && formDescuento.modalidad === 'Crédito' && pct >= 1.5 && (
            <div className="mb-6 bg-purple-50 p-4 rounded-xl border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex-1">
                 <label className="block text-sm font-bold text-purple-900 mb-1">¡Aplica a Descuento Especial!</label>
                 <p className="text-xs text-purple-700 leading-tight">Puedes ajustar el % manualmente si lo deseas.</p>
               </div>
               <div className="flex items-center bg-white rounded-lg border border-purple-200 overflow-hidden">
                 <input type="number" name="descuentoPropiosManual" value={formDescuento.descuentoPropiosManual} onChange={handleC} max={pct >= 5 ? "23" : "20"} min="0" className="w-20 px-3 py-2 text-center font-bold text-purple-700 outline-none" />
                 <span className="pr-3 font-bold text-purple-500">%</span>
               </div>
            </div>
          )}

          {formDescuento.modoBusqueda === 'inteligente' && formDescuento.proyecto !== 'OTRO...' ? (
            <div className="mb-6 p-5 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><label className="block text-xs font-bold text-emerald-700 mb-1.5">UV</label><select name="uv" value={formDescuento.uv} onChange={handleC} className="w-full px-3 py-2 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"><option value="">---</option>{opcionesUV.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
                <div><label className="block text-xs font-bold text-emerald-700 mb-1.5">MZN</label><select name="manzano" value={formDescuento.manzano} onChange={handleC} disabled={!formDescuento.uv} className="w-full px-3 py-2 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"><option value="">---</option>{opcionesMZN.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                <div><label className="block text-xs font-bold text-emerald-700 mb-1.5">LOTE</label><select name="lote" value={formDescuento.lote} onChange={handleC} disabled={!formDescuento.manzano} className="w-full px-3 py-2 border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"><option value="">---</option>{opcionesLote.map(lt => <option key={lt} value={lt}>{lt}</option>)}</select></div>
              </div>
              {lotesBD.length === 0 && !cargandoLotes && <p className="text-xs text-amber-600 mt-4 flex items-center"><AlertTriangle className="w-4 h-4 mr-1" /> BD no disponible. Usa modo manual.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
              <Input label="UV" name="uv" value={formDescuento.uv} onChange={handleC} />
              <Input label="Manzano" name="manzano" value={formDescuento.manzano} onChange={handleC} />
              <Input label="Lote" name="lote" value={formDescuento.lote} onChange={handleC} />
            </div>
          )}

          {formDescuento.modoBusqueda === 'inteligente' && formDescuento.categoria && (
            <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-xl text-xs font-bold mb-5 flex items-center shadow-md"><Tag className="w-4 h-4 mr-2 text-cyan-400" /><span className="text-slate-400 mr-1.5">Categoría:</span> {String(formDescuento.categoria).toUpperCase()}</div>
          )}
          {formDescuento.modoBusqueda === 'manual' && <div className="mb-5"><Input label="Categoría (Opcional)" name="categoria" value={formDescuento.categoria} onChange={handleC} placeholder="Ej. AVENIDA" /></div>}

          {loteAutocompletado && formDescuento.modoBusqueda === 'inteligente' && <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-bold mb-5 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Autocompletado exitoso</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <Input label="Superficie (M2)" name="m2" value={formDescuento.m2} onChange={handleC} type="number" />
            <Input label="Precio Reg. (M2)" name="precioM2" value={formDescuento.precioM2} onChange={handleC} type="number" />
          </div>
          <Input label="Nombre del Asesor" name="asesor" value={formDescuento.asesor} onChange={handleC} />
        </div>
        
        {/* TICKET MANTENIDO */}
        <div className="w-full min-w-0 space-y-6">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <Receipt className="absolute -right-4 -top-4 w-24 h-24 opacity-10 text-white" />
            <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-4">Ticket de Simulación</p>
            <div className="flex justify-between items-end border-b border-slate-700 pb-4 mb-4">
              <div><p className="text-sm text-slate-400">Precio Original</p><p className="text-xl font-bold text-slate-200 line-through decoration-red-500">${formatCurrency(calculos.vc)}</p></div>
              <div className="text-right"><p className="text-sm text-slate-400">Ahorro Cliente</p><p className="text-2xl font-black text-emerald-400">-${formatCurrency(calculos.descuentoTotal)}</p></div>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-700">
              <span className="font-bold text-slate-300">PRECIO FINAL</span>
              <span className="text-3xl font-black text-white">${formatCurrency(calculos.nuevoPrecioTotal)}</span>
            </div>
          </div>
          <ResultCard title="Enviar Solicitud" text={generarTextoDescuentoCelular(formDescuento, supervisorData, calculos)} htmlContent={generarHtmlDescuento(formDescuento, calculos, supervisorData)} subject={`Solicitud Descuento Campañas - ${formDescuento.proyecto === 'OTRO...' ? formDescuento.proyectoManual : formDescuento.proyecto}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
        </div>
      </div>
    </div>
  );
}

