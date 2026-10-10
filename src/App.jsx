import { lazy, Suspense, useState } from 'react';
import AuthGate from './components/AuthGate';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ThemeSelector } from './components/ui/ThemeSelector';
import { useTheme } from './hooks/useTheme';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';

// Vistas - Gerencia
const Dashboard = lazy(() => import('./views/Dashboard'));
const ProyeccionSemanal = lazy(() => import('./views/ProyeccionSemanal'));
const ProyeccionDiaria = lazy(() => import('./views/ProyeccionDiaria'));
const SeguimientoVentas = lazy(() => import('./views/SeguimientoVentas'));
const IncentivosAsesores = lazy(() => import('./views/IncentivosAsesores'));

// Vistas - Cotizaciones y Recompras
const SimuladorAmortizacion = lazy(() => import('./views/SimuladorAmortizacion'));
const Recompra = lazy(() => import('./views/Recompra'));
const DescuentosCampanas = lazy(() => import('./views/DescuentosCampanas'));
const IncrementoCuota = lazy(() => import('./views/IncrementoCuota'));
const BloqueoLote = lazy(() => import('./views/BloqueoLote'));
const LiquidacionContado = lazy(() => import('./views/LiquidacionContado'));
const SolicitudesCodigo = lazy(() => import('./views/SolicitudesCodigo'));
const RecalcularPlan = lazy(() => import('./views/RecalcularPlan'));
const ConsolidacionLotes = lazy(() => import('./views/ConsolidacionLotes'));
const EliminacionPenalidades = lazy(() => import('./views/EliminacionPenalidades'));

// Vistas - Trámites Generales
const ValidacionLlamada = lazy(() => import('./views/ValidacionLlamada'));
const ContratoFisico = lazy(() => import('./views/ContratoFisico'));
const ReenvioFirma = lazy(() => import('./views/ReenvioFirma'));
const SeguroVida = lazy(() => import('./views/SeguroVida'));
const PendienteValidacion = lazy(() => import('./views/PendienteValidacion'));

// Vistas - Recursos Humanos (RRHH)
const CartaRenuncia = lazy(() => import('./views/CartaRenuncia'));
const AltaCRM = lazy(() => import('./views/AltaCRM'));
const EvaluacionFinMes = lazy(() => import('./views/EvaluacionFinMes'));
const PostulanteNuevo = lazy(() => import('./views/PostulanteNuevo'));
const SolicitudMemorandum = lazy(() => import('./views/SolicitudMemorandum'));

export default function App() {
  // Pestaña inicial predeterminada: Inicio (Dashboard)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setSupervisorDestino] = useState('');
  const [theme, setTheme] = useTheme();

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
            <h2 className="text-xl font-bold mb-1 text-[var(--text-secondary)]">Vista en optimización</h2>
            <p className="text-xs">Módulo en proceso de carga.</p>
          </div>
        );
    }
  };

  return (
    <AuthGate><a className="skip-link" href="#main-content">Ir al contenido</a><div className="min-h-screen bg-[var(--bg-space)] text-[var(--text-primary)] flex flex-col md:flex-row font-sans w-full overflow-x-hidden">
      <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
        setSupervisorDestino={setSupervisorDestino}
      />

      <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-8 w-full min-h-[calc(100vh-64px)] md:min-h-screen bg-[var(--bg-space)]">
        <div className="max-w-[1600px] mx-auto w-full pb-10">
          <header className="workspace-toolbar"><div><p className="eyebrow">PORTAL CELINA / ESPACIO DE TRABAJO</p><span>Equipo Oscar Saravia · Montero</span></div><div className="toolbar-actions"><span className="rate-pill">Gestión comercial · USD</span><ThemeSelector theme={theme} onChange={setTheme}/></div></header>
          <ErrorBoundary key={activeTab}><Suspense fallback={<div className="panel" role="status">Cargando módulo…</div>}>{renderContent()}</Suspense></ErrorBoundary>
        </div>
      </main>
    </div></AuthGate>
  );
}
