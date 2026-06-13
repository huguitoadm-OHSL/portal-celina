import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';

// 1. Descomenta el Dashboard
import Dashboard from './views/Dashboard';
import ContratoFisico from './views/ContratoFisico';
// import Recompra from './views/Recompra';

export default function App() {
  // 2. Cambiamos 'fisico' por 'dashboard' para que sea la pantalla principal al entrar
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
      // 3. Activamos el caso dashboard
      case 'dashboard': return <Dashboard />;
      case 'fisico': return <ContratoFisico />;
      // case 'recompra': return <Recompra />;
      
      default: 
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <h2 className="text-2xl font-bold mb-2">Vista en construcción</h2>
            <p>Estamos migrando este módulo a la nueva arquitectura.</p>
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
