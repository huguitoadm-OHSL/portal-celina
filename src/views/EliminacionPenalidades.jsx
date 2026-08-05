import React, { useState } from 'react';
import { ResultCard } from '../components/ui/ResultCard'; 
import { Ban, User, Building2, MapPin, FileText, AlertOctagon } from 'lucide-react';

export default function EliminacionPenalidades() {
  const [form, setForm] = useState({
    cliente: '',
    proyecto: '',
    uv: '',
    mzn: '',
    lote: '',
    contrato: ''
  });

  const [supervisorDestino, setSupervisorDestino] = useState('elizarraga@celina.com.bo');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // 🟢 ESCUDO DE SEGURIDAD GERENCIAL (Exclusión de Proyectos)
  const handleProyectoBlur = (e) => {
    const valor = e.target.value.toUpperCase();
    if (
      valor.includes("CELINA 1") || 
      valor.includes("CELINA 2") || 
      valor.includes("PARAÍSO DEL NORTE") || 
      valor.includes("PARAISO DEL NORTE")
    ) {
      alert("⚠️ RESTRICCIÓN DEL SISTEMA: Los proyectos 'Celina 1', 'Celina 2' y 'Paraíso del Norte' están estrictamente excluidos de esta gestión.");
      setForm(prev => ({ ...prev, proyecto: '' }));
    }
  };

  // ================= GENERACIÓN DE PLANTILLA =================
  const subject = `Solicitud de eliminación de penalidades Cliente Titular: ${form.cliente.toUpperCase()} ${form.contrato.toUpperCase()}`;

  // Formato automático de la ubicación
  const loteCompleto = `UV: ${form.uv} MZN: ${form.mzn} LOTE: ${form.lote}`;

  // Se inicia con un "Buenas" explícito para que el ResultCard lo intercepte y modifique
  const htmlContent = `
    Buenas tardes Estimado Enrique,
    <br><br>
    por favor tu ayuda con sus multas del siguiente cliente:
    <br><br>
    <b>Cliente Titular:</b> ${form.cliente.toUpperCase() || '[Nombre del Cliente]'}<br>
    <b>Proyecto:</b> ${form.proyecto.toUpperCase() || '[Proyecto]'}<br>
    <b>Lote:</b> ${loteCompleto.toUpperCase()}<br>
    <b>Nro. Contrato:</b> ${form.contrato.toUpperCase() || '[Número de Contrato]'}
    <br><br>
    Muchas gracias de antemano.
  `;

  const textContent = `
    Buenas tardes Estimado Enrique,

    por favor tu ayuda con sus multas del siguiente cliente:

    Cliente Titular: ${form.cliente.toUpperCase() || '[Nombre del Cliente]'}
    Proyecto: ${form.proyecto.toUpperCase() || '[Proyecto]'}
    Lote: ${loteCompleto.toUpperCase()}
    Nro. Contrato: ${form.contrato.toUpperCase() || '[Número de Contrato]'}

    Muchas gracias de antemano.
  `;

  return (
    <div className="font-sans bg-[#f0f2f5] min-h-screen p-3 md:p-4 xl:p-8 pb-12 animate-in fade-in zoom-in-95 duration-400">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 md:p-5 rounded-3xl shadow-sm border border-slate-200 gap-3 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center relative z-10">
            <div className="bg-gradient-to-tr from-rose-500 to-red-600 p-2.5 md:p-3 rounded-2xl mr-3 shadow-lg shadow-rose-500/20">
              <Ban className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base md:text-xl font-black text-slate-800 uppercase tracking-wide leading-tight">
                Eliminación de Penalidades
              </h1>
              <p className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                Gestión Operativa de Multas
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          
          {/* PANEL DE FORMULARIO (7 Columnas) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 md:p-8 shadow-sm">
            <div className="flex items-center mb-6 border-b border-slate-100 pb-4">
              <AlertOctagon className="w-5 h-5 text-rose-500 mr-2" />
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Datos de la Multa a Eliminar</h2>
            </div>

            <div className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Cliente Titular */}
                <div className="col-span-1 md:col-span-2 relative group">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 pl-1">Cliente Titular</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                    </div>
                    <input type="text" name="cliente" value={form.cliente} onChange={handleChange} placeholder="Ej: ERICK GONZALES ACOSTA" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all uppercase" />
                  </div>
                </div>

                {/* Proyecto (Campo Libre + Validación) */}
                <div className="relative group">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 pl-1">Proyecto</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Building2 className="w-4 h-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                    </div>
                    <input type="text" name="proyecto" value={form.proyecto} onChange={handleChange} onBlur={handleProyectoBlur} placeholder="Ej: CELINA MUYURINA" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all uppercase" />
                  </div>
                </div>

                {/* Nro. Contrato */}
                <div className="relative group">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 pl-1">Nro. Contrato</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FileText className="w-4 h-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                    </div>
                    <input type="text" name="contrato" value={form.contrato} onChange={handleChange} placeholder="Ej: C2603500343" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all uppercase" />
                  </div>
                </div>

                {/* Lote Desglosado */}
                <div className="col-span-1 md:col-span-2 relative group">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 pl-1">Ubicación del Lote</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <span className="text-[10px] font-bold text-slate-400">UV:</span>
                      </div>
                      <input type="text" name="uv" value={form.uv} onChange={handleChange} className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all uppercase" />
                    </div>
                    
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <span className="text-[10px] font-bold text-slate-400">MZN:</span>
                      </div>
                      <input type="text" name="mzn" value={form.mzn} onChange={handleChange} className="w-full pl-11 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all uppercase" />
                    </div>

                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <span className="text-[10px] font-bold text-slate-400">LT:</span>
                      </div>
                      <input type="text" name="lote" value={form.lote} onChange={handleChange} className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all uppercase" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* PANEL DE VISTA PREVIA (5 Columnas) */}
          <div className="lg:col-span-5 h-full">
            <ResultCard 
              title="Solicitud Penalidades" 
              text={textContent} 
              htmlContent={htmlContent} 
              subject={subject} 
              supervisorDestino={supervisorDestino} 
              setSupervisorDestino={setSupervisorDestino} 
            />
          </div>

        </div>
      </div>
    </div>
  );
}
