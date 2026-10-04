import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';

// Vistas - Gerencia
import Dashboard from './views/Dashboard';
import ProyeccionSemanal from './views/ProyeccionSemanal';
import ProyeccionDiaria from './views/ProyeccionDiaria';
import SeguimientoVentas from './views/SeguimientoVentas';
import IncentivosAsesores from './views/IncentivosAsesores'; // 🟢 HERRAMIENTA OFICIAL DE INCENTIVOS

// Vistas - Cotizaciones y Recompras
import SimuladorAmortizacion from './views/SimuladorAmortizacion';
import Recompra from './views/Recompra';
import DescuentosCampanas from './views/DescuentosCampanas';
import IncrementoCuota from './views/IncrementoCuota';
import BloqueoLote from './views/BloqueoLote';
import LiquidacionContado from './views/LiquidacionContado';
import SolicitudesCodigo from './views/SolicitudesCodigo';
import RecalcularPlan from './views/RecalcularPlan';
import ConsolidacionLotes from './views/ConsolidacionLotes'; 
import EliminacionPenalidades from './views/EliminacionPenalidades';

// Vistas - Trámites Generales
import ValidacionLlamada from './views/ValidacionLlamada';
import ContratoFisico from './views/ContratoFisico';
import ReenvioFirma from './views/ReenvioFirma';
import SeguroVida from './views/SeguroVida';
import PendienteValidacion from './views/PendienteValidacion';

// Vistas - Recursos Humanos (RRHH)
import CartaRenuncia from './views/CartaRenuncia';
import AltaCRM from './views/AltaCRM';
import EvaluacionFinMes from './views/EvaluacionFinMes';
import PostulanteNuevo from './views/PostulanteNuevo';
import SolicitudMemorandum from './views/SolicitudMemorandum';

export default function App() {
  // Pestaña inicial predeterminada: Inicio (Dashboard)
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [supervisorDestino, setSupervisorDestino] = useState('');

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.style.maxWidth = '100%';
      root.style.width = '100%';
      root.style.padding = '0';
      root.style.margin = '0';
      root.style.textAlign = 'left';
      root.style.backgroundColor = '#030712';
    }
    document.body.style.margin = '0';
    document.body.style.backgroundColor = '#030712';
    document.body.style.overflowX = 'hidden';
  }, []);

  // ================= ESCUDO DE ENTRADA =================
  const [autenticado, setAutenticado] = useState(() => {
    return localStorage.getItem('acceso_portal_master') === 'PERMITIDO';
  });
  const [passInput, setPassInput] = useState('');
  const [errorPass, setErrorPass] = useState(false);

  const verificarPassword = (e) => {
    e.preventDefault();
    if (passInput.trim() === 'ELSEÑORESMIPASTOR') {
      localStorage.setItem('acceso_portal_master', 'PERMITIDO');
      setActiveTab('dashboard'); // Garantiza que siempre entre a Inicio
      setAutenticado(true);
    } else {
      setErrorPass(true);
      setTimeout(() => setErrorPass(false), 2500);
    }
  };

  if (!autenticado) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030712] p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="bg-[#070e1c] border border-[#14233c] p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative z-10 backdrop-blur-xl">
          <div className="w-16 h-16 bg-[#0c1a30] border border-cyan-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Acceso Restringido</h2>
          <p className="text-[10px] text-cyan-400 mb-6 uppercase tracking-widest font-black">Portal de Liderazgo • Celina</p>
          
          <form onSubmit={verificarPassword} className="space-y-4">
            <div>
              <input 
                type="password" 
                autoFocus
                value={passInput} 
                onChange={(e) => setPassInput(e.target.value)} 
                placeholder="Ingresa la contraseña..." 
                className={`w-full px-4 py-3 rounded-xl bg-[#050b18] border ${errorPass ? 'border-rose-500 text-rose-300' : 'border-[#1e3a5f] text-white focus:border-cyan-400'} font-bold text-center tracking-widest outline-none transition-all text-sm`}
              />
              {errorPass && <p className="text-xs font-bold text-rose-400 mt-2">❌ Contraseña incorrecta</p>}
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 text-sm"
            >
              Entrar al Portal
            </button>
          </form>
          <p className="text-[10px] text-slate-500 mt-6 font-mono">Diseñado por Oscar Saravia ©</p>
        </div>
      </div>
    );
  }
  // ================= FIN DEL ESCUDO =================

  const renderContent = () => {
    switch (activeTab) {
      // 1. Gerencia
      case 'dashboard': return <Dashboard />;
      case 'incentivos': return <IncentivosAsesores />; // 🟢 RUTA DEL CONCURSO DE INCENTIVOS
      case 'proyeccion': return <ProyeccionSemanal />;
      case 'diaria': return <ProyeccionDiaria />;
      case 'seguimiento': return <SeguimientoVentas />;
      
      // 2. Operaciones (Cotizaciones y Recompras)
      case 'amortizacion': return <SimuladorAmortizacion />;
      case 'recompra': return <Recompra />;
      case 'descuento': return <DescuentosCampanas />;
      case 'cuota': return <IncrementoCuota />;
      case 'bloqueoLote': return <BloqueoLote />;
      case 'liquidacionContado': return <LiquidacionContado />;
      case 'solicitudesCodigo': return <SolicitudesCodigo />;
      case 'recalcular': return <RecalcularPlan />;
      case 'consolidacion': return <ConsolidacionLotes />; 
      case 'penalidades': return <EliminacionPenalidades/>;
        
      // 3. Trámites Generales
      case 'llamada': return <ValidacionLlamada />;
      case 'fisico': return <ContratoFisico />;
      case 'reenvio': return <ReenvioFirma />;
      case 'seguro': return <SeguroVida />;
      case 'pendienteValidacion': return <PendienteValidacion />;
      
      // 4. Recursos Humanos (RRHH)
      case 'renuncia': return <CartaRenuncia />;
      case 'altaCrm': return <AltaCRM />;
      case 'evaluacion': return <EvaluacionFinMes />;
      case 'postulante': return <PostulanteNuevo />;
      case 'memorandum': return <SolicitudMemorandum />;
      
      default: 
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-20">
            <h2 className="text-xl font-bold mb-1 text-slate-300">Vista en optimización</h2>
            <p className="text-xs">Módulo en proceso de carga.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col md:flex-row font-sans w-full overflow-x-hidden">
      <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setIsSidebarOpen(false)} 
        setSupervisorDestino={setSupervisorDestino}
      />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-8 w-full min-h-[calc(100vh-64px)] md:min-h-screen bg-[#030712]">
        <div className="max-w-[1600px] mx-auto w-full pb-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
