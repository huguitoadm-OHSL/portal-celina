import React from 'react';
import { 
  LayoutDashboard, BarChart, CalendarDays, Target, RefreshCw, Calculator, Repeat, Tag, 
  TrendingUp, PhoneCall, FileText, FileSignature, Shield, UserMinus, UserPlus, 
  ClipboardCheck, UserCheck, Building2, X, Lock, PhoneForwarded, AlertOctagon, KeyRound,
  ArrowRightLeft // <--- ¡AQUÍ ESTÁ EL ÍCONO FALTANTE QUE REPARARÁ LA PANTALLA NEGRA!
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, closeSidebar, setSupervisorDestino }) => {
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    closeSidebar();
  };

  // UI MEJORADA: Botones con interacciones de Clase Mundial
  const NavItem = ({ id, icon: Icon, label, onClickAction }) => {
    const isActive = activeTab === id;
    return (
      <button 
        onClick={onClickAction || (() => handleTabChange(id))} 
        className={`relative w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
          isActive 
            ? 'bg-white/10 text-white shadow-[0_4px_20px_-4px_rgba(79,70,229,0.3)]' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {/* Indicador lateral luminoso para la pestaña activa */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
        )}
        <Icon className={`w-5 h-5 mr-3 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-blue-400' : 'group-hover:scale-110'}`} /> 
        <span className="tracking-wide z-10">{label}</span>
      </button>
    );
  };

  const NavSection = ({ title }) => (
    <div className="pt-6 pb-2 relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-slate-800/50"></div>
      </div>
      <div className="relative flex justify-start">
        <span className="pr-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950">
          {title}
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* OVERLAY PARA MÓVIL (Con desenfoque premium) */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-40 md:hidden transition-opacity duration-300" onClick={closeSidebar} />
      )}

      {/* MENÚ LATERAL (Gradiente súper profundo) */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-all duration-400 ease-out z-50 w-72 bg-[#0B1120] text-white flex flex-col shadow-2xl shrink-0 border-r border-slate-800/60 h-screen overflow-hidden`}>
        
        {/* Fondo decorativo sutil */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none"></div>

        <button className="md:hidden absolute top-6 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10" onClick={closeSidebar}>
          <X className="w-5 h-5"/>
        </button>

        <div className="p-7 shrink-0 pr-12 md:pr-7 relative z-10">
          <h1 className="text-2xl font-black tracking-tight flex items-center text-white">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl mr-3 shadow-lg shadow-indigo-500/30 border border-indigo-400/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            Portal
          </h1>
          <p className="text-slate-400 text-xs mt-3 font-medium tracking-wide pl-1">Gestión Estratégica</p>
          <p className="text-indigo-400/60 text-[9px] mt-1.5 font-bold tracking-widest uppercase pl-1">Oscar Saravia &reg;</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-700/50 hover:scrollbar-thumb-slate-600 scrollbar-track-transparent pb-8 relative z-10">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Inicio" />

          <NavSection title="Gerencia" />
          <NavItem id="proyeccion" icon={BarChart} label="Proyección Semanal" onClickAction={() => { handleTabChange('proyeccion'); setSupervisorDestino('mreyes@celina.com.bo'); }} />
          <NavItem id="diaria" icon={CalendarDays} label="Proyección Diaria" />
          <NavItem id="seguimiento" icon={Target} label="Seguimiento de Ventas" />
          
          <NavSection title="Operaciones" />
          <NavItem id="amortizacion" icon={Calculator} label="Amortización a Capital" />
          <NavItem id="recompra" icon={Repeat} label="Recompra" />
          <NavItem id="descuento" icon={Tag} label="Descuentos Campañas" />
          <NavItem id="cuota" icon={TrendingUp} label="Inc. Cuota Inicial" />
          <NavItem id="bloqueoLote" icon={Lock} label="Bloqueo de Lote" />
          <NavItem id="liquidacionContado" icon={FileText} label="Liquidación Contado" />
          <NavItem id="solicitudesCodigo" icon={KeyRound} label="Solicitud de Códigos" />
          <NavItem id="recalcular" icon={RefreshCw} label="Recalcular Plan" />
          <NavItem id="consolidacion" icon={ArrowRightLeft} label="Consolidación de Lotes" />

          <NavSection title="Trámites Generales" />
          <NavItem id="llamada" icon={PhoneCall} label="Validación Llamada" />
          <NavItem id="fisico" icon={FileText} label="Contrato Físico" />
          <NavItem id="reenvio" icon={FileSignature} label="Reenvío Firma Digital" />
          <NavItem id="seguro" icon={Shield} label="Seguro de Vida" />
          <NavItem id="pendienteValidacion" icon={PhoneForwarded} label="Pend. de Validación" />

          <NavSection title="Recursos Humanos" />
          <NavItem id="renuncia" icon={UserMinus} label="Carta de Renuncia" />
          <NavItem id="altaCrm" icon={UserPlus} label="Alta Usuarios CRM" />
          <NavItem id="evaluacion" icon={ClipboardCheck} label="Evaluación Fin de Mes" />
          <NavItem id="postulante" icon={UserCheck} label="Postulante Nuevo" />
          <NavItem id="memorandum" icon={AlertOctagon} label="Solicitud Memorándum" />
        </nav>
        
        <div className="p-4 m-4 mt-0 border border-slate-800/60 bg-slate-900/50 rounded-2xl shrink-0 backdrop-blur-md relative z-10">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mr-3 font-black text-sm shadow-[0_0_15px_rgba(79,70,229,0.4)] ring-1 ring-white/10 shrink-0">OS</div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              <p className="text-sm font-bold text-white truncate">Oscar Saravia L.</p>
              <p className="text-[10px] text-slate-400 truncate">ohsaravia@celina.com.bo</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
