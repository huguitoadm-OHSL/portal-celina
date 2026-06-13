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

// Vistas - Trámites Generales
import ValidacionLlamada from './views/ValidacionLlamada';
import ContratoFisico from './views/ContratoFisico';
import ReenvioFirma from './views/ReenvioFirma';
import SeguroVida from './views/SeguroVida';

// Vistas - Recursos Humanos (RRHH)
import CartaRenuncia from './views/CartaRenuncia';
import AltaCRM from './views/AltaCRM';
import EvaluacionFinMes from './views/EvaluacionFinMes';
import PostulanteNuevo from './views/PostulanteNuevo';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const renderContent = () => {
    switch (activeTab) {
      // 1. Gerencia
      case 'dashboard': return <Dashboard />;
      case 'proyeccion': return <ProyeccionSemanal />;
      case 'diaria': return <ProyeccionDiaria />;
      case 'seguimiento': return <SeguimientoVentas />;
      
      // 2. Cotizaciones y Recompras
      case 'amortizacion': return <SimuladorAmortizacion />;
      case 'recompra': return <Recompra />;
      case 'descuento': return <DescuentosCampanas />;
      case 'cuota': return <IncrementoCuota />;
      
      // 3. Trámites Generales
      case 'llamada': return <ValidacionLlamada />;
      case 'fisico': return <ContratoFisico />;
      case 'reenvio': return <ReenvioFirma />;
      case 'seguro': return <SeguroVida />;
      
      // 4. Recursos Humanos (RRHH)
      case 'renuncia': return <CartaRenuncia />;
      case 'altaCrm': return <AltaCRM />;
      case 'evaluacion': return <EvaluacionFinMes />;
      case 'postulante': return <PostulanteNuevo />;
      
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
        setSupervisorDestino={() => {}} 
      />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 lg:p-10 w-full h-[calc(100vh-72px)] md:h-screen">
        <div className="max-w-[1600px] mx-auto w-full pb-10">
          {renderContent()}
        </div>
      </div>
      
    </div>
  );
}

