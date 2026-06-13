import React, { useState, useEffect } from 'react';
import { Tag, Search, Edit3, CheckCircle2, AlertTriangle } from 'lucide-react';

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
    proyecto: 'El Renacer', uv: '', manzano: '', lote: '',
    modalidad: 'Crédito', cuota: '', modoCuota: 'monto', modoBusqueda: 'manual',
    m2: '', precioM2: '', categoria: '', asesor: '',
    proyectoManual: '', descuentoManual: '', tipoDescuentoManual: 'porcentaje', descuentoPropiosManual: '23'
  });

  const [supervisorDestino, setSupervisorDestino] = useState(SUPERVISORES[0].correo);
  const [lotesBD, setLotesBD] = useState([]);
  const [cargandoLotes, setCargandoLotes] = useState(true);
  const [loteAutocompletado, setLoteAutocompletado] = useState(false);

  // --- LOGICA DE LECTURA DE LOTES.JSON ---
  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await fetch('./lotes.json');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const lotesLimpios = data.map(item => {
              const rawProy = String(item.proyecto || item.PROYECTO || '').toUpperCase();
              let proyLimpio = rawProy;
              if (rawProy.includes("RENACER")) proyLimpio = "El Renacer";
              else if (rawProy.includes("JARDINES")) proyLimpio = "Los Jardines";
              else if (rawProy.includes("MUYURINA")) proyLimpio = "Muyurina";
              else if (rawProy.includes("SANTA FE")) proyLimpio = "Santa Fe";
              else if (rawProy.includes("CAÑAVERAL") || rawProy.includes("CANAVERAL")) proyLimpio = "Cañaveral";
              else if (rawProy.includes("RANCHO NUEVO")) proyLimpio = "Rancho Nuevo";

              const rawM2 = String(item.superficie || item.SUPERFICIE || item.m2 || '0').replace(/[^0-9.,]/g, '').replace(',', '.');
              const rawPrecio = String(item.precio || item.PRECIO || item.precioM2 || '0').replace(/[^0-9.,]/g, '').replace(',', '.');

              return {
                proyecto: proyLimpio, uv: String(item.uv || item.UV || ''),
                manzano: String(item.mzn || item.MZN || item.manzano || item.MANZANO || ''),
                lote: String(item.lote || item.LOTE || ''),
                m2: parseFloat(rawM2) || 0, precioM2: parseFloat(rawPrecio) || 0,
                categoria: String(item.categoria || item.CATEGORIA || '')
              };
            }).filter(l => l.proyecto !== '' && l.uv !== '' && l.manzano !== '' && l.lote !== '');

            setLotesBD(lotesLimpios);
            if (lotesLimpios.length > 0) setFormDescuento(prev => ({...prev, modoBusqueda: 'inteligente'}));
          }
        }
      } catch (error) {
        console.warn("Fallo al cargar lotes.json. El modo manual será el predeterminado.");
      } finally {
        setCargandoLotes(false);
      }
    };
    fetchLotes();
  }, []);

  // --- LOGICA DE AUTOCOMPLETADO (CASCADA) ---
  const safeToLower = (val) => (val === null || val === undefined) ? '' : String(val).toLowerCase();
  const pL_filtro = safeToLower(formDescuento.proyecto);
  const uL_filtro = safeToLower(formDescuento.uv);
  const mL_filtro = safeToLower(formDescuento.manzano);

  const opcionesUV = [...new Set(lotesBD.filter(l => safeToLower(l.proyecto) === pL_filtro).map(l => l.uv))].sort((a,b) => String(a).localeCompare(String(b), undefined, {numeric: true}));
  const opcionesMZN = [...new Set(lotesBD.filter(l => safeToLower(l.proyecto) === pL_filtro && safeToLower(l.uv) === uL_filtro).map(l => l.manzano))].sort((a,b) => String(a).localeCompare(String(b), undefined, {numeric: true}));
  const opcionesLote = [...new Set(lotesBD.filter(l => safeToLower(l.proyecto) === pL_filtro && safeToLower(l.uv) === uL_filtro && safeToLower(l.manzano) === mL_filtro).map(l => l.lote))].sort((a,b) => String(a).localeCompare(String(b), undefined, {numeric: true}));

  useEffect(() => {
    const { proyecto, uv, manzano, lote } = formDescuento;
    if (proyecto && uv && manzano && lote && lotesBD.length > 0) {
      const loteEncontrado = lotesBD.find(l => safeToLower(l.proyecto) === safeToLower(proyecto) && safeToLower(l.uv) === safeToLower(uv) && safeToLower(l.manzano) === safeToLower(manzano) && safeToLower(l.lote) === safeToLower(lote));
      if (loteEncontrado) {
        setFormDescuento(prev => ({
          ...prev, m2: loteEncontrado.m2 ? String(loteEncontrado.m2) : '',
          precioM2: loteEncontrado.precioM2 ? String(loteEncontrado.precioM2) : '',
          categoria: loteEncontrado.categoria ? String(loteEncontrado.categoria) : ''
        }));
        setLoteAutocompletado(true);
      } else {
        setFormDescuento(prev => ({ ...prev, categoria: '' }));
        setLoteAutocompletado(false);
      }
    } else {
      setLoteAutocompletado(false);
    }
  }, [formDescuento.proyecto, formDescuento.uv, formDescuento.manzano, formDescuento.lote, lotesBD]);

  const handleDescuentoChange = (e) => {
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

  // --- CÁLCULOS Y GENERACIÓN ---
  const calculos = calcularDescuento(formDescuento);
  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);
  
  const nomProyectoFinal = formDescuento.proyecto === 'OTRO...' ? (formDescuento.proyectoManual || 'PROYECTO MANUAL') : formDescuento.proyecto;
  let asuntoDescuento = `Solicitud Descuento Campañas - ${nomProyectoFinal} UV:${formDescuento.uv} Mz:${formDescuento.manzano} Lt:${formDescuento.lote}`;
  if (formDescuento.modalidad === 'Crédito' && calculos.porcentajeCuota >= 1.5 && calculos.porcentajeCuota < 5) {
    asuntoDescuento += ` - AUTORIZACIÓN PARA BAJAR LA CUOTA INICIAL AL 1.5% CATEGORÍA CALLE`;
  }

  const textoWhatsApp = generarTextoDescuentoCelular(formDescuento, supervisorData, calculos);
  const textoHtml = generarHtmlDescuento(formDescuento, calculos, supervisorData);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center"><Tag className="w-6 h-6 mr-2 text-blue-600" /> Descuentos Campañas</h2>
        
        {/* BOTÓN TOGGLE BÚSQUEDA */}
        <div className="bg-slate-200/60 p-1 rounded-full inline-flex self-start sm:self-auto">
          <button 
            onClick={() => setFormDescuento({...formDescuento, modoBusqueda: 'inteligente'})}
            disabled={formDescuento.proyecto === 'OTRO...'}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center ${formDescuento.modoBusqueda === 'inteligente' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'} disabled:opacity-40`}
          >
            <Search className="w-3.5 h-3.5 mr-1.5" /> Automático
          </button>
          <button 
            onClick={() => setFormDescuento({...formDescuento, modoBusqueda: 'manual'})}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center ${formDescuento.modoBusqueda === 'manual' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Manual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-[1.3fr_1fr] 2xl:grid-cols-[1.5fr_1fr] gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 w-full">
            <div className="w-full">
              <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Proyecto</label>
              <select name="proyecto" value={formDescuento.proyecto} onChange={handleDescuentoChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 shadow-sm text-sm">
                {PROYECTOS.map(p => <option key={p} value={p}>{String(p).toUpperCase()}</option>)}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Modalidad</label>
              <select name="modalidad" value={formDescuento.modalidad} onChange={handleDescuentoChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 shadow-sm text-sm">
                <option value="Contado">Al Contado</option>
                <option value="Crédito">A Crédito (Plazos)</option>
              </select>
            </div>
          </div>

          {formDescuento.proyecto === 'OTRO...' && (
            <div className="mb-5 bg-amber-50/80 p-4 rounded-xl border border-amber-200 shadow-sm w-full">
              <h4 className="font-bold text-amber-800 mb-3 text-sm flex items-center"><Edit3 className="w-4 h-4 mr-2" /> Proyecto Manual</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                 <div className="w-full">
                   <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">Nombre del Proyecto</label>
                   <input type="text" name="proyectoManual" value={formDescuento.proyectoManual} onChange={handleDescuentoChange} className="w-full px-3 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white text-sm" placeholder="Ej. Celina VII"/>
                 </div>
                 <div className="w-full">
                   <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">Descuento a Aplicar</label>
                   <div className="flex flex-col sm:flex-row w-full gap-2">
                     <select name="tipoDescuentoManual" value={formDescuento.tipoDescuentoManual} onChange={handleDescuentoChange} className="w-full sm:w-1/2 px-2 py-2.5 border border-amber-200 rounded-xl bg-white text-sm font-semibold focus:ring-2 focus:ring-amber-500 outline-none">
                        <option value="porcentaje">% Desc.</option>
                        <option value="monto">$ por m²</option>
                     </select>
                     <input type="number" name="descuentoManual" value={formDescuento.descuentoManual} onChange={handleDescuentoChange} className="w-full sm:w-1/2 px-3 py-2.5 border border-amber-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Ej. 10"/>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {formDescuento.modalidad === 'Crédito' && (
            <div className="mb-6 bg-blue-50/50 p-5 rounded-xl border border-blue-100/50 w-full">
              <div className="flex flex-col w-full">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-0.5">Ingresar Cuota Inicial</label>
                <div className="flex flex-col sm:flex-row w-full gap-3">
                  <select 
                    value={formDescuento.modoCuota} 
                    onChange={(e) => setFormDescuento({...formDescuento, modoCuota: e.target.value, cuota: ''})}
                    className="flex-1 px-3 py-2.5 border border-blue-200 rounded-xl bg-white text-slate-700 font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  >
                    <option value="monto">Monto ($)</option>
                    <option value="porcentaje">Porcentaje (%)</option>
                  </select>
                  <input 
                    type="number" name="cuota" value={formDescuento.cuota} onChange={handleDescuentoChange} 
                    placeholder={formDescuento.modoCuota === 'monto' ? "Ej. 1000" : "Ej. 5"}
                    className="flex-1 px-3 py-2.5 border border-blue-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-inner text-sm" 
                  />
                  <div className="flex-1 flex items-center justify-center bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm py-2.5 px-2">
                    {formDescuento.modoCuota === 'monto' ? `${formatCurrency(calculos.porcentajeCuota)}%` : `$ ${formatCurrency(calculos.montoCuotaNum)}`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {PROYECTOS_PROPIOS_1.includes(formDescuento.proyecto) && formDescuento.modalidad === 'Crédito' && calculos.porcentajeCuota >= 1.5 && (
            <div className="mb-6 bg-purple-50/80 p-4 rounded-xl border border-purple-200 shadow-sm w-full flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex-1">
                 <label className="block text-sm font-bold text-purple-900 mb-1">¡Aplica a Descuento Especial!</label>
                 <p className="text-xs text-purple-700 leading-tight">Puedes ajustar el % manualmente si lo deseas (Máximo {calculos.porcentajeCuota >= 5 ? '23' : '20'}%).</p>
               </div>
               <div className="w-full sm:w-auto flex items-center bg-white rounded-lg border border-purple-200 overflow-hidden">
                 <input type="number" name="descuentoPropiosManual" value={formDescuento.descuentoPropiosManual} onChange={handleDescuentoChange} max={calculos.porcentajeCuota >= 5 ? "23" : "20"} min="0" className="w-20 px-3 py-2 text-center font-bold text-purple-700 focus:outline-none" />
                 <span className="pr-3 font-bold text-purple-500">%</span>
               </div>
            </div>
          )}
          
          {formDescuento.modoBusqueda === 'inteligente' && formDescuento.proyecto !== 'OTRO...' ? (
            <div className="mb-6 p-5 bg-slate-50 border border-slate-100 rounded-xl w-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div className="w-full">
                  <label className="block text-xs font-bold text-emerald-700 mb-1.5 ml-0.5 uppercase tracking-wide">Elegir UV</label>
                  <select name="uv" value={formDescuento.uv} onChange={handleDescuentoChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 font-semibold cursor-pointer text-sm">
                    <option value="">---</option>
                    {opcionesUV.map(u => <option key={u} value={u}>{String(u)}</option>)}
                  </select>
                </div>
                <div className="w-full">
                  <label className="block text-xs font-bold text-emerald-700 mb-1.5 ml-0.5 uppercase tracking-wide">Elegir MZN</label>
                  <select name="manzano" value={formDescuento.manzano} onChange={handleDescuentoChange} disabled={!formDescuento.uv} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 font-semibold cursor-pointer disabled:opacity-50 disabled:bg-slate-100 text-sm">
                    <option value="">---</option>
                    {opcionesMZN.map(m => <option key={m} value={m}>{String(m)}</option>)}
                  </select>
                </div>
                <div className="w-full">
                  <label className="block text-xs font-bold text-emerald-700 mb-1.5 ml-0.5 uppercase tracking-wide">Elegir Lote</label>
                  <select name="lote" value={formDescuento.lote} onChange={handleDescuentoChange} disabled={!formDescuento.manzano} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 font-semibold cursor-pointer disabled:opacity-50 disabled:bg-slate-100 text-sm">
                    <option value="">---</option>
                    {opcionesLote.map(lt => <option key={lt} value={lt}>{String(lt)}</option>)}
                  </select>
                </div>
              </div>
              {lotesBD.length === 0 && !cargandoLotes ? (
                <p className="text-xs text-amber-600 mt-4 flex items-center"><AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" /> Cargando base de datos o archivo lotes.json no encontrado.</p>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-3 w-full">
              <Input label="UV" name="uv" value={formDescuento.uv} onChange={handleDescuentoChange} />
              <Input label="Manzano" name="manzano" value={formDescuento.manzano} onChange={handleDescuentoChange} />
              <Input label="Lote" name="lote" value={formDescuento.lote} onChange={handleDescuentoChange} />
            </div>
          )}

          {formDescuento.modoBusqueda === 'inteligente' && formDescuento.categoria ? (
            <div className="bg-slate-900 border border-slate-800 text-white p-4 rounded-xl text-xs font-bold mb-5 flex items-center shadow-md uppercase tracking-wider w-full overflow-hidden">
              <Tag className="w-4 h-4 mr-2.5 text-cyan-400 flex-shrink-0" />
              <span className="text-slate-400 mr-1.5 font-semibold flex-shrink-0">Categoría:</span> 
              <span className="truncate">{String(formDescuento.categoria)}</span>
            </div>
          ) : formDescuento.modoBusqueda === 'manual' ? (
            <div className="mb-4 w-full">
               <Input label="Categoría (Opcional)" name="categoria" value={formDescuento.categoria} onChange={handleDescuentoChange} placeholder="Ej. AVENIDA PRINCIPAL" />
            </div>
          ) : null}

          {loteAutocompletado && formDescuento.modoBusqueda === 'inteligente' && (
            <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-xs font-bold mb-5 flex items-center shadow-sm w-full">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" /> Superficie y Precio autocompletados
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 w-full">
            <Input label="Superficie (M2)" name="m2" value={formDescuento.m2} onChange={handleDescuentoChange} type="number" />
            <Input label="Precio Reg. (M2)" name="precioM2" value={formDescuento.precioM2} onChange={handleDescuentoChange} type="number" />
          </div>
          
          <div className="border-t border-slate-100 pt-5 mt-2 w-full"><Input label="Nombre del Asesor" name="asesor" value={formDescuento.asesor} onChange={handleDescuentoChange} /></div>
        </div>
        
        <div className="w-full min-w-0">
          <ResultCard 
            title="Descuento" 
            text={textoWhatsApp} 
            htmlContent={textoHtml} 
            subject={asuntoDescuento} 
            supervisorDestino={supervisorDestino} 
            setSupervisorDestino={setSupervisorDestino} 
          />
        </div>
      </div>
    </div>
  );
}
