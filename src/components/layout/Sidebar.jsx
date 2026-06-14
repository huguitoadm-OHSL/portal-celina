import React from 'react';
import { 
  LayoutDashboard, Calendar, CalendarDays, TrendingUp, 
  Calculator, RefreshCcw, Tag, ArrowUpCircle, 
  PhoneCall, FileText, Send, ShieldCheck, 
  UserMinus, UserPlus, ClipboardCheck, Users, X 
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, isOpen, closeSidebar }) {
  const menuGroups = [
    {
      title: 'GERENCIA',
      items: [
        { id: 'dashboard', label: 'Inicio', icon: <LayoutDashboard size={18} /> },
        { id: 'proyeccion', label: 'Proyección Semanal', icon: <Calendar size={18} /> },
        { id: 'diaria', label: 'Proyección Diaria', icon: <CalendarDays size={18} /> },
        { id: 'seguimiento', label: 'Seguimiento de Ventas', icon: <TrendingUp size={18} /> },
      ]
    },
    {
      title: 'COTIZACIONES Y RECOMPRAS',
      items: [
        { id: 'amortizacion', label: 'Amortización a Capital', icon: <Calculator size={18} /> },
        { id: 'recompra', label: 'Recompra', icon: <RefreshCcw size={18} /> },
        { id: 'descuento', label: 'Descuentos Campañas', icon: <Tag size={18} /> },
        { id: 'cuota', label: 'Inc. Cuota Inicial', icon: <ArrowUpCircle size={18} /> },
      ]
    },
    {
      title: 'TRÁMITES GENERALES',
      items: [
        { id: 'llamada', label: 'Validación Llamada', icon: <PhoneCall size={18} /> },
        { id: 'fisico', label: 'Contrato Físico', icon: <FileText size={18} /> },
        { id: 'reenvio', label: 'Reenvío Firma', icon: <Send size={18} /> },
        { id: 'seguro', label: 'Seguro de Vida', icon: <ShieldCheck size={18} /> },
      ]
    },
    {
      title: 'RECURSOS HUMANOS (RRHH)',
      items: [
        { id: 'renuncia', label: 'Carta de Renuncia', icon: <UserMinus size={18} /> },
        { id: 'altaCrm', label: 'Alta Usuarios CRM', icon: <UserPlus size={18} /> },
        { id: 'evaluacion', label: 'Evaluación Fin de Mes', icon: <ClipboardCheck size={18} /> },
        { id: 'postulante', label: 'Postulante Nuevo', icon: <Users size={18} /> },
      ]
    }
  ];

  return (
    <>
      {/* Fondo oscuro para celulares */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={closeSidebar}></div>
      )}

      {/* Contenedor Principal del Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] text-slate-300 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Cabecera / Título */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center">
              <LayoutDashboard className="w-6 h-6 mr-2 text-blue-500" />
              Portal Asesores
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1 font-bold">Herramientas de Gestión</p>
            <p className="text-[9px] text-blue-500 mt-2 font-semibold">DISEÑADO POR OSCAR SARAVIA &reg;</p>
          </div>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>

        {/* Opciones del Menú (CON BOTONES, NO ENLACES) */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="px-6 text-[10px] font-black uppercase text-slate-500 tracking-wider mb-3">
                {group.title}
              </h3>
              <ul className="space-y-0.5">
                {group.items.map(item => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 768) closeSidebar();
                      }}
                      className={`w-full flex items-center px-6 py-3 text-sm font-semibold transition-all duration-200 outline-none ${
                        activeTab === item.id 
                          ? 'bg-blue-600 text-white border-l-4 border-blue-400' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-l-4 border-transparent'
                      }`}
                    >
                      <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-500'} mr-3`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Perfil del Usuario / Footer */}
        <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              OS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Oscar Hugo Saravia L.</p>
              <p className="text-xs text-slate-500 truncate">ohsaravia@celina.com.bo</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
