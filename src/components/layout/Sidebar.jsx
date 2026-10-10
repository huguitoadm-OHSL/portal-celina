import React from 'react';
import {
  LayoutDashboard, BarChart, CalendarDays, Target, RefreshCw, Calculator, Repeat, Tag,
  TrendingUp, PhoneCall, FileText, FileSignature, Shield, UserMinus, UserPlus,
  ClipboardCheck, UserCheck, Building2, X, Lock, PhoneForwarded, AlertOctagon, KeyRound,
  ArrowRightLeft, Ban, Trophy
} from 'lucide-react';

  const NavItem = ({ id, icon: Icon, label, onClickAction, badge, activeTab, handleTabChange }) => {
    const isActive = activeTab === id;
    return (
      <button
        aria-current={isActive ? "page" : undefined}
        onClick={onClickAction || (() => handleTabChange(id))}
        className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 group overflow-hidden ${
          isActive
            ? 'bg-gradient-to-r from-cyan-950/80 to-transparent text-cyan-300 border-l-4 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.15)] pl-4'
            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-slate-900/60'
        }`}
      >
        <div className="flex items-center truncate">
          <Icon className={`w-4 h-4 mr-3 shrink-0 transition-transform duration-300 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-500 group-hover:scale-110 group-hover:text-[var(--text-secondary)]'}`} />
          <span className="tracking-wide truncate">{label}</span>
        </div>
        {badge && (
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            {badge}
          </span>
        )}
      </button>
    );
  };

  const NavSection = ({ title }) => (
    <div className="pt-5 pb-1.5 px-3">
      <span className="text-[9px] font-black text-cyan-500/70 uppercase tracking-[0.25em]">
        {title}
      </span>
    </div>
  );


export const Sidebar = ({ activeTab, setActiveTab, isOpen, closeSidebar, setSupervisorDestino }) => {
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    closeSidebar();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-[var(--bg-space)]/80 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={closeSidebar} />
      )}

      <aside className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-out z-50 w-64 bg-[var(--bg-card-inner)] text-[var(--text-primary)] flex flex-col border-r border-[var(--border-glow)] h-screen overflow-hidden shrink-0 shadow-2xl`}>
        {/* Cabecera */}
        <div className="p-5 pb-4 shrink-0 flex justify-between items-center border-b border-[var(--border-glow)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-card-inner)] border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black text-[var(--text-primary)] tracking-tight flex items-center gap-1.5">
                Portal <span className="text-cyan-400 text-xs px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">V4.0</span>
              </h1>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Gestión Estratégica</p>
            </div>
          </div>
          <button aria-label="Cerrar menú" className="md:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]" onClick={closeSidebar}>
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 px-2.5 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="dashboard" icon={LayoutDashboard} label="Inicio" />

          <NavSection title="Gerencia" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="incentivos" icon={Trophy} label="Incentivos Celina" badge="Nuevo" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="proyeccion" icon={BarChart} label="Proyección Semanal" onClickAction={() => { handleTabChange('proyeccion'); setSupervisorDestino('mreyes@celina.com.bo'); }} />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="diaria" icon={CalendarDays} label="Proyección Diaria" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="seguimiento" icon={Target} label="Seguimiento de Ventas" />

          <NavSection title="Operaciones" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="descuento" icon={Tag} label="Descuentos Campañas" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="amortizacion" icon={Calculator} label="Amortización a Capital" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="recompra" icon={Repeat} label="Recompra" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="cuota" icon={TrendingUp} label="Inc. Cuota Inicial" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="bloqueoLote" icon={Lock} label="Bloqueo de Lote" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="liquidacionContado" icon={FileText} label="Liquidación Contado" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="solicitudesCodigo" icon={KeyRound} label="Solicitud de Códigos" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="recalcular" icon={RefreshCw} label="Recalcular Plan" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="consolidacion" icon={ArrowRightLeft} label="Consolidación de Lotes" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="penalidades" icon={Ban} label="Eliminación Penalidades" />

          <NavSection title="Trámites Generales" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="llamada" icon={PhoneCall} label="Validación Llamada" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="fisico" icon={FileText} label="Contrato Físico" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="reenvio" icon={FileSignature} label="Reenvío Firma Digital" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="seguro" icon={Shield} label="Seguro de Vida" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="pendienteValidacion" icon={PhoneForwarded} label="Pend. de Validación" />

          <NavSection title="Recursos Humanos" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="renuncia" icon={UserMinus} label="Carta de Renuncia" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="altaCrm" icon={UserPlus} label="Alta Usuarios CRM" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="evaluacion" icon={ClipboardCheck} label="Evaluación Fin de Mes" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="postulante" icon={UserCheck} label="Postulante Nuevo" />
          <NavItem activeTab={activeTab} handleTabChange={handleTabChange} id="memorandum" icon={AlertOctagon} label="Solicitud Memorándum" />
        </nav>

        {/* Pie de perfil */}
        <div className="p-3 m-3 border border-[var(--border-glow)] bg-[var(--bg-card)] rounded-2xl shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mr-2.5 font-black text-xs text-slate-950 shadow-[0_0_12px_rgba(0,229,255,0.4)] shrink-0">
              OS
            </div>
            <div className="overflow-hidden truncate">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-[var(--text-primary)] truncate">Oscar Saravia L.</p>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              </div>
              <p className="text-[10px] text-cyan-400/80 font-mono truncate">ohsaravia@celina.com.bo</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
