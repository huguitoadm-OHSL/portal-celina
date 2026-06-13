import React, { useState } from 'react';
import { Repeat } from 'lucide-react';

import { Input } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';

import { SUPERVISORES } from '../constants/equipo';
import { calcularBeneficioRecompra, obtenerDatosSupervisor } from '../utils/calculadoras';
import { generarTextoRecompraCelular } from '../utils/textTemplates';
import { generarHtmlRecompra } from '../utils/htmlTemplates';

export default function Recompra() {
  const [formRecompra, setFormRecompra] = useState({
    asesor: '', proyecto: 'Muyurina', sucursal: '', 
    fechaVentaNuevo: '', nombreNuevo: '', contratoNuevo: '', aplicoDescuento: 'NO', cuotasPagadas: '', procesadoNuevo: 'SI', vigenteNuevo: 'SI',
    nombreAntiguo: '', contratoAntiguo: '', fechaVentaAntiguo: '', fechaPago: '', procesadoAntiguo: 'SI', vigenteAntiguo: 'SI', patrocinador: '',
    valorCuota: ''
  });
  
  const [supervisorDestino, setSupervisorDestino] = useState(SUPERVISORES[0].correo);

  const handleRecompraChange = (e) => {
    const { name, value } = e.target;
    setFormRecompra(prev => {
      const newState = { ...prev, [name]: value };
      // Copia automática del nombre si no se ha llenado el antiguo
      if (name === 'nombreNuevo' && (!prev.nombreAntiguo || prev.nombreAntiguo === prev.nombreNuevo)) {
        newState.nombreAntiguo = value;
      }
      return newState;
    });
  };

  // Cálculos y datos
  const beneficio = calcularBeneficioRecompra(formRecompra.proyecto);
  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);
  
  const textoWhatsApp = generarTextoRecompraCelular(formRecompra, supervisorData, beneficio);
  const textoHtml = generarHtmlRecompra(formRecompra, supervisorData, beneficio);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><Repeat className="w-6 h-6 mr-2 text-blue-600" /> Solicitud de Recompra</h2></div>
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] 2xl:grid-cols-[1.5fr_1fr] gap-8 w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-6">
              <Input label="Nombre del Asesor" name="asesor" value={formRecompra.asesor} onChange={handleRecompraChange} placeholder="Ej. Oscar Saravia" />
              <div className="w-full">
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Proyecto (Para Beneficio $)</label>
                <select name="proyecto" value={formRecompra.proyecto} onChange={handleRecompraChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 shadow-sm text-sm">
                   <option value="Muyurina">Muyurina ($200)</option>
                   <option value="El Renacer">El Renacer ($100)</option>
                   <option value="Los Jardines">Los Jardines ($100)</option>
                   <option value="Santa Fe">Santa Fe ($100)</option>
                   <option value="Cañaveral">Cañaveral ($100)</option>
                   <option value="Celina 3">Celina 3 ($100)</option>
                   <option value="Celina 4">Celina 4 ($100)</option>
                   <option value="Celina 5">Celina 5 ($100)</option>
                   <option value="Celina 7">Celina 7 ($100)</option>
                   <option value="Celina 10">Celina 10 ($100)</option>
                   <option value="Rancho Nuevo">Rancho Nuevo ($50)</option>
                </select>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
             {/* CONTRATO NUEVO */}
             <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-200">
                <h3 className="text-sm font-extrabold text-amber-600 mb-4 border-b border-amber-200 pb-2">DATOS CONTRATO NUEVO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-2">
                   <Input label="Agencia / Sucursal" name="sucursal" value={formRecompra.sucursal} onChange={handleRecompraChange} placeholder="Ej. YAPACANI" />
                   <Input label="Fecha de venta" name="fechaVentaNuevo" value={formRecompra.fechaVentaNuevo} onChange={handleRecompraChange} placeholder="Ej. 27/8/2026" />
                </div>
                <Input label="Nombre del Cliente" name="nombreNuevo" value={formRecompra.nombreNuevo} onChange={handleRecompraChange} placeholder="Ej. DILSON DURY MARIACA" />
                <Input label="Contrato Nuevo" name="contratoNuevo" value={formRecompra.contratoNuevo} onChange={handleRecompraChange} placeholder="Ej. C2604001327" />
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                   <div className="w-full">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">¿Aplicó Dscto por m2?</label>
                     <select name="aplicoDescuento" value={formRecompra.aplicoDescuento} onChange={handleRecompraChange} className="w-full px-3 py-2 border border-slate-200 rounded bg-white text-sm">
                       <option value="NO">NO</option><option value="SI">SI</option>
                     </select>
                   </div>
                   <div className="w-full">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">Cuotas Pagadas</label>
                     <input type="number" name="cuotasPagadas" value={formRecompra.cuotasPagadas} onChange={handleRecompraChange} className="w-full px-3 py-2 border border-slate-200 rounded text-sm" placeholder="Ej. 2" />
                   </div>
                   <div className="w-full">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">¿Procesado?</label>
                     <select name="procesadoNuevo" value={formRecompra.procesadoNuevo} onChange={handleRecompraChange} className="w-full px-3 py-2 border border-slate-200 rounded bg-white text-sm">
                       <option value="SI">SI</option><option value="NO">NO</option>
                     </select>
                   </div>
                   <div className="w-full">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">¿Vigente?</label>
                     <select name="vigenteNuevo" value={formRecompra.vigenteNuevo} onChange={handleRecompraChange} className="w-full px-3 py-2 border border-slate-200 rounded bg-white text-sm">
                       <option value="SI">SI</option><option value="NO">NO</option>
                     </select>
                   </div>
                </div>
             </div>

             {/* CONTRATO ANTIGUO */}
             <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-200">
                <h3 className="text-sm font-extrabold text-orange-600 mb-4 border-b border-orange-200 pb-2">DATOS CONTRATO ANTIGUO</h3>
                <Input label="Nombre del Cliente Antiguo" name="nombreAntiguo" value={formRecompra.nombreAntiguo} onChange={handleRecompraChange} placeholder="Ej. DILSON DURY MARIACA" />
                <Input label="Contrato Antiguo" name="contratoAntiguo" value={formRecompra.contratoAntiguo} onChange={handleRecompraChange} placeholder="Ej. C2604001326" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-2">
                   <Input label="Fecha de venta" name="fechaVentaAntiguo" value={formRecompra.fechaVentaAntiguo} onChange={handleRecompraChange} placeholder="Ej. 27/8/2026" />
                   <Input label="Fecha Pago de Cuota" name="fechaPago" value={formRecompra.fechaPago} onChange={handleRecompraChange} placeholder="Ej. 7-dic-26" />
                </div>
                
                <Input label="Patrocinador" name="patrocinador" value={formRecompra.patrocinador} onChange={handleRecompraChange} placeholder="Ej. JHOVANA ALMANZA VALLEJOS" />
                <Input label="Valor de Cuota ($)" name="valorCuota" value={formRecompra.valorCuota} onChange={handleRecompraChange} placeholder="Ej. 304.8" type="number" />
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                   <div className="w-full">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">¿Procesado?</label>
                     <select name="procesadoAntiguo" value={formRecompra.procesadoAntiguo} onChange={handleRecompraChange} className="w-full px-3 py-2 border border-slate-200 rounded bg-white text-sm">
                       <option value="SI">SI</option><option value="NO">NO</option>
                     </select>
                   </div>
                   <div className="w-full">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">¿Vigente?</label>
                     <select name="vigenteAntiguo" value={formRecompra.vigenteAntiguo} onChange={handleRecompraChange} className="w-full px-3 py-2 border border-slate-200 rounded bg-white text-sm">
                       <option value="SI">SI</option><option value="NO">NO</option>
                     </select>
                   </div>
                </div>
             </div>
           </div>

        </div>
        <div className="w-full min-w-0">
           <ResultCard 
             title="Solicitud Recompra" 
             text={textoWhatsApp} 
             htmlContent={textoHtml} 
             subject={`solicitud de código de descuento RECOMPRA cliente: ${formRecompra.nombreNuevo || 'NOMBRE'}`} 
             supervisorDestino={supervisorDestino} 
             setSupervisorDestino={setSupervisorDestino} 
           />
        </div>
      </div>
    </div>
  );
}
