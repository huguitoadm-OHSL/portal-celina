import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';

// Vistas que ya hemos migrado a la nueva arquitectura
import Dashboard from './views/Dashboard';
import ContratoFisico from './views/ContratoFisico';
import SimuladorAmortizacion from './views/SimuladorAmortizacion';
import DescuentosCampanas from './views/DescuentosCampanas';
import Recompra from './views/Recompra';

export default function App() {
  // Iniciamos la aplicación mostrando el Dashboard por defecto
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mantenemos la limpieza de estilos globales de la pantalla
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

  // Nuestro "Enrutador" interno que decide qué pantalla mostrar
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'fisico': return <ContratoFisico />;
      case 'amortizacion': return <SimuladorAmortizacion />;
      case 'descuento': return <DescuentosCampanas />;
      case 'recompra': return <Recompra />;
      
      // Si el usuario hace clic en un botón del menú que aún no hemos migrado, muestra esto:
      default: 
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <h2 className="text-2xl font-bold mb-2">Vista en construcción</h2>
            <p>Estamos migrando este módulo a la nueva arquitectura modular.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex flex-col md:flex-row font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      {/* Cabecera para celulares */}
      <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
      
      {/* Menú Lateral */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setIsSidebarOpen(false)} 
        setSupervisorDestino={() => {}} 
      />

      {/* Contenedor Principal donde se muestran las vistas */}
      <div className="flex-1 overflow-auto p-4 md:p-8 lg:p-10 w-full h-[calc(100vh-72px)] md:h-screen">
        <div className="max-w-[1600px] mx-auto w-full pb-10">
          {renderContent()}
        </div>
      </div>

    </div>
  );
}
