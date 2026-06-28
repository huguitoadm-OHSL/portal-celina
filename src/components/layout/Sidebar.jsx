import React from 'react';
import { 
  LayoutDashboard, BarChart, CalendarDays, Target, Calculator, Repeat, Tag, 
  TrendingUp, PhoneCall, FileText, FileSignature, Shield, UserMinus, UserPlus, 
  ClipboardCheck, UserCheck, Building2, X, Lock, PhoneForwarded, AlertOctagon, KeyRound 
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, closeSidebar, setSupervisorDestino }) => {
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    closeSidebar();
  };

  // Sub-componente para no repetir el código de los botones
  const NavItem = ({ id, icon: Icon, label, onClickAction }) => {
    const isActive = activeTab === id;
    return (
      <button 
        onClick={onClickAction || (() => handleTabChange(id))} 
        className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
      >
        <Icon className="w-5 h-5 mr-3 shrink-0" /> {label}
      </button>
    );
  };

  const NavSection = ({ title }) => (
    <div className="pt-5 pb-2">
      <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
    </div>
  );

  return (
    <>
      {/* OVERLAY PARA MÓVIL */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden" onClick={closeSidebar} />
      )}

      {/* MENÚ LATERAL */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50 w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col shadow-2xl shrink-0 border-r border-slate-800/50 h-screen overflow-hidden`}>
        
        <button className="md:hidden absolute top-6 right-5 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10" onClick={closeSidebar}>
          <X className="w-5 h-5"/>
        </button>

        <div className="p-7 shrink-0 pr-12 md:pr-7">
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
            <Building2 className="w-7 h-7 mr-2 text-white" />
            Portal Asesores
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 font-medium tracking-wide">Herramientas de Gestión</p>
          <p className="text-indigo-400/80 text-[10px] mt-2 font-bold tracking-widest uppercase">Diseñado por Oscar Saravia &reg;</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pb-8">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Inicio" />

          <NavSection title="Gerencia" />
          <NavItem 
            id="proyeccion" 
            icon={BarChart} 
            label="Proyección Semanal" 
            onClickAction={() => { handleTabChange('proyeccion'); setSupervisorDestino('mreyes@celina.com.bo'); }} 
          />
          <NavItem id="diaria" icon={CalendarDays} label="Proyección Diaria" />
          <NavItem id="seguimiento" icon={Target} label="Seguimiento de Ventas" />
          
          <NavSection title="Cotizaciones y Recompras" />
          <NavItem id="amortizacion" icon={Calculator} label="Amortización a Capital" />
          <NavItem id="recompra" icon={Repeat} label="Recompra" />
          <NavItem id="descuento" icon={Tag} label="Descuentos Campañas" />
          <NavItem id="cuota" icon={TrendingUp} label="Inc. Cuota Inicial" />
          <NavItem id="bloqueoLote" icon={Lock} label="Bloqueo de Lote" />
          <NavItem id="liquidacionContado" icon={FileText} label="Liquidación Contado" />
          <NavItem id="solicitudesCodigo" icon={KeyRound} label="Solicitud de Códigos" />

          <NavSection title="Trámites Generales" />
          <NavItem id="llamada" icon={PhoneCall} label="Validación Llamada" />
          <NavItem id="fisico" icon={FileText} label="Contrato Físico" />
          <NavItem id="reenvio" icon={FileSignature} label="Reenvío Firma Digital" />
          <NavItem id="seguro" icon={Shield} label="Seguro de Vida" />
          <NavItem id="pendienteValidacion" icon={PhoneForwarded} label="Pend. de Validación" />

          <NavSection title="Recursos Humanos (RRHH)" />
          <NavItem id="renuncia" icon={UserMinus} label="Carta de Renuncia" />
          <NavItem id="altaCrm" icon={UserPlus} label="Alta Usuarios CRM" />
          <NavItem id="evaluacion" icon={ClipboardCheck} label="Evaluación Fin de Mes" />
          <NavItem id="postulante" icon={UserCheck} label="Postulante Nuevo" />
          <NavItem id="memorandum" icon={AlertOctagon} label="Solicitud Memorándum" />
        </nav>
        
        <div className="p-5 border-t border-slate-800/50 bg-slate-950/30 shrink-0">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center mr-3 font-bold text-sm shadow-inner ring-2 ring-indigo-400/20 shrink-0">OS</div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              <p className="text-sm font-bold text-white truncate">Oscar Hugo Saravia L.</p>
              <p className="text-xs text-indigo-300/80 truncate">ohsaravia@celina.com.bo</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

