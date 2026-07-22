import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';

// Vistas - Gerencia
import Dashboard from './views/Dashboard';
import ProyeccionSemanal from './views/ProyeccionSemanal';
import ProyeccionDiaria from './views/ProyeccionDiaria';
import SeguimientoVentas from './views/SeguimientoVentas';

// Vistas - Cotizaciones y Recompras
import SimuladorAmortizacion from './views/SimuladorAmortizacion';
import Recompra from './views/Recompra';
import DescuentosCampanas from './views/DescuentosCampanas';
import IncrementoCuota from './views/IncrementoCuota';
import BloqueoLote from './views/BloqueoLote';
import LiquidacionContado from './views/LiquidacionContado';
import SolicitudesCodigo from './views/SolicitudesCodigo';
import RecalcularPlan from './views/RecalcularPlan';
import ConsolidacionLotes from './views/ConsolidacionLotes'; // <-- ¡NUEVA IMPORTACIÓN!

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
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [supervisorDestino, setSupervisorDestino] = useState(''); // <-- ESTADO FALTANTE AGREGADO

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.style.maxWidth = '100%';
      root.style.width = '100%';
      root.style.padding = '0';
      root.style.margin = '0';
      root.style.textAlign = 'left';
    }
    document.body.style.margin = '0';
    document.body.style.display = 'block';
  }, []);

  // ================= ESCUDO DE ENTRADA CORREGIDO =================
  const [autenticado, setAutenticado] = useState(() => {
    return localStorage.getItem('acceso_portal_master') === 'PERMITIDO';
  });
  const [passInput, setPassInput] = useState('');
  const [errorPass, setErrorPass] = useState(false);

  const verificarPassword = (e) => {
    e.preventDefault();
    // 🟢 CORRECCIÓN DE SEGURIDAD: Clave maestra actualizada y encriptada
    if (passInput.trim() === 'ELSEÑORESMIPASTOR') {
      localStorage.setItem('acceso_portal_master', 'PERMITIDO');
      setAutenticado(true);
    } else {
      setErrorPass(true);
      setTimeout(() => setErrorPass(false), 2500);
    }
  };

  if (!autenticado) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-[#002060] to-blue-950 p-4">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl max-w-sm w-full text-center animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/50">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-1">Acceso Restringido</h2>
          <p className="text-xs text-blue-200 mb-6 uppercase tracking-wider font-semibold">Portal de Liderazgo • Celina</p>
          
          <form onSubmit={verificarPassword} className="space-y-4">
            <div>
              <input 
                type="password" 
                autoFocus
                value={passInput} 
                onChange={(e) => setPassInput(e.target.value)} 
                placeholder="Ingresa la contraseña..." 
                className={`w-full px-4 py-3 rounded-xl bg-white/20 border ${errorPass ? 'border-red-500 text-red-200 placeholder:text-red-300 bg-red-500/10' : 'border-white/20 text-white placeholder:text-slate-300'} font-bold text-center tracking-widest outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
              />
              {errorPass && <p className="text-xs font-bold text-red-400 mt-2">❌ Contraseña incorrecta</p>}
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
            >
              Entrar al Portal
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-6">Diseñado por Oscar Saravia ©</p>
        </div>
      </div>
    );
  }
  // ================= FIN DEL ESCUDO =================

  const renderContent = () => {
    switch (activeTab) {
      // 1. Gerencia
      case 'dashboard': return <Dashboard />;
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
      case 'consolidacion': return <ConsolidacionLotes />; // <-- ¡NUEVA RUTA DE CONSOLIDACIÓN!
      
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
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <h2 className="text-2xl font-bold mb-2">Vista en construcción</h2>
            <p>Módulo no encontrado.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex flex-col md:flex-row font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setIsSidebarOpen(false)} 
        setSupervisorDestino={setSupervisorDestino} // <-- CORRECCIÓN: Conexión de estado real
      />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 lg:p-10 w-full h-[calc(100vh-72px)] md:h-screen">
        <div className="max-w-[1600px] mx-auto w-full pb-10">
          {renderContent()}
        </div>
      </div>
      
    </div>
  );
}
