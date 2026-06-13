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
    proyecto: 'El Renacer', uv: '', manzano: '', lote: '', modalidad: 'Crédito', cuota: '', modoCuota: 'monto', modoBusqueda: 'manual',
    m2: '', precioM2: '', categoria: '', asesor: '', proyectoManual: '', descuentoManual: '', tipoDescuentoManual: 'porcentaje', descuentoPropiosManual: '23'
  });

  const [supervisorDestino, setSupervisorDestino] = useState(SUPERVISORES[0].correo);
  const [lotesBD, setLotesBD] = useState([]);
  const [loteAutocompletado, setLoteAutocompletado] = useState(false);

  useEffect(() => {
    fetch('./lotes.json').then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        const limpios = data.map(item => ({
          proyecto: item.proyecto || item.PROYECTO || '', uv: item.uv || item.UV || '', manzano: item.mzn || item.MZN || item.manzano || '',
          lote: item.lote || item.LOTE || '', m2: parseFloat(item.superficie || item.m2) || 0, precioM2: parseFloat(item.precio || item.precioM2) || 0, categoria: item.categoria || ''
        })).filter(l => l.proyecto && l.uv && l.manzano && l.lote);
        setLotesBD(limpios);
        if (limpios.length > 0) setFormDescuento(p => ({...p, modoBusqueda: 'inteligente'}));
      }
    }).catch(() => {});
  }, []);

  const safeToLower = (val) => val ? String(val).toLowerCase() : '';
  const pL = safeToLower(formDescuento.proyecto); const uL = safeToLower(formDescuento.uv); const mL = safeToLower(formDescuento.manzano);
  const opcionesUV = [...new Set(lotesBD.filter(l => safeToLower(l.proyecto).includes(pL)).map(l => l.uv))].sort();
  const opcionesMZN = [...new Set(lotesBD.filter(l => safeToLower(l.proyecto).includes(pL) && safeToLower(l.uv) === uL).map(l => l.manzano))].sort();
  const opcionesLote = [...new Set(lotesBD.filter(l => safeToLower(l.proyecto).includes(pL) && safeToLower(l.uv) === uL && safeToLower(l.manzano) === mL).map(l => l.lote))].sort();

  useEffect(() => {
    const { proyecto, uv, manzano, lote } = formDescuento;
    if (proyecto && uv && manzano && lote && lotesBD.length > 0) {
      const enc = lotesBD.find(l => safeToLower(l.proyecto).includes(safeToLower(proyecto)) && safeToLower(l.uv) === safeToLower(uv) && safeToLower(l.manzano) === safeToLower(manzano) && safeToLower(l.lote) === safeToLower(lote));
      if (enc) { setFormDescuento(p => ({ ...p, m2: enc.m2, precioM2: enc.precioM2, categoria: enc.categoria })); setLoteAutocompletado(true); } 
      else { setLoteAutocompletado(false); }
    } else setLoteAutocompletado(false);
  }, [formDescuento.proyecto, formDescuento.uv, formDescuento.manzano, formDescuento.lote, lotesBD]);

  const handleC = (e) => setFormDescuento({ ...formDescuento, [e.target.name]: e.target.value });
  const calculos = calcularDescuento(formDescuento);
  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);

  // Termómetro de Cuota
  const pct = calculos.porcentajeCuota || 0;
  const targetPct = pct < 5 ? 5 : 10;
  const fillPct = Math.min((pct / targetPct) * 100, 100);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><Tag className="w-6 h-6 mr-2 text-blue-600" /> Descuentos Campañas</h2></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 w-full">
            <div><label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Proyecto</label><select name="proyecto" value={formDescuento.proyecto} onChange={handleC} className="w-full px-3 py-2.5 border rounded-xl bg-slate-50 text-sm">{PROYECTOS.map(p => <option key={p} value={p}>{p}</option>)}<option value="OTRO...">OTRO...</option></select></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Modalidad</label><select name="modalidad" value={formDescuento.modalidad} onChange={handleC} className="w-full px-3 py-2.5 border rounded-xl bg-slate-50 text-sm"><option value="Contado">Al Contado</option><option value="Crédito">A Crédito (Plazos)</option></select></div>
          </div>

          {formDescuento.modalidad === 'Crédito' && (
            <div className="mb-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-2">Ingresar Cuota Inicial</label>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <select value={formDescuento.modoCuota} onChange={(e) => setFormDescuento({...formDescuento, modoCuota: e.target.value, cuota: ''})} className="flex-1 px-3 py-2.5 border rounded-xl text-sm"><option value="monto">Monto ($)</option><option value="porcentaje">Porcentaje (%)</option></select>
                <input type="number" name="cuota" value={formDescuento.cuota} onChange={handleC} className="flex-1 px-3 py-2.5 border rounded-xl text-sm" placeholder="Ej. 1000" />
                <div className="flex-1 flex items-center justify-center bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm py-2.5">{formDescuento.modoCuota === 'monto' ? `${formatCurrency(pct)}%` : `$ ${formatCurrency(calculos.montoCuotaNum)}`}</div>
              </div>
              
              {/* TERMÓMETRO */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-bold mb-1"><span className="text-slate-500">Avance Cuota Inicial</span><span className="text-blue-600">Meta: {targetPct}%</span></div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500" style={{width: `${fillPct}%`}}></div></div>
                {pct > 0 && pct < targetPct && <p className="text-[10px] font-bold text-amber-600 mt-1.5 flex items-center"><Flame className="w-3 h-3 mr-1"/> ¡Sube al {targetPct}% para mejorar el descuento!</p>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-5">
            <div><label className="block text-xs font-bold text-slate-700 mb-1">UV</label><select name="uv" value={formDescuento.uv} onChange={handleC} className="w-full p-2 border rounded text-sm"><option value="">---</option>{opcionesUV.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
            <div><label className="block text-xs font-bold text-slate-700 mb-1">MZN</label><select name="manzano" value={formDescuento.manzano} onChange={handleC} className="w-full p-2 border rounded text-sm"><option value="">---</option>{opcionesMZN.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
            <div><label className="block text-xs font-bold text-slate-700 mb-1">LOTE</label><select name="lote" value={formDescuento.lote} onChange={handleC} className="w-full p-2 border rounded text-sm"><option value="">---</option>{opcionesLote.map(lt => <option key={lt} value={lt}>{lt}</option>)}</select></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 w-full">
            <Input label="Superficie (M2)" name="m2" value={formDescuento.m2} onChange={handleC} type="number" />
            <Input label="Precio Reg. (M2)" name="precioM2" value={formDescuento.precioM2} onChange={handleC} type="number" />
          </div>
          <Input label="Nombre del Asesor" name="asesor" value={formDescuento.asesor} onChange={handleC} />
        </div>
        
        {/* COLUMNA DERECHA: TICKET + RESULTADO */}
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
          <ResultCard title="Enviar Solicitud" text={generarTextoDescuentoCelular(formDescuento, supervisorData, calculos)} htmlContent={generarHtmlDescuento(formDescuento, calculos, supervisorData)} subject={`Solicitud Descuento Campañas - ${formDescuento.proyecto}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
        </div>
      </div>
    </div>
  );
}
