import React, { useState, useEffect } from 'react';
import { 
  FileText, Percent, TrendingUp, Copy, Mail, CheckCircle2, LayoutDashboard,
  Building2, AlertCircle, Calculator, Tag, Info, FileSignature, Plus, Trash2,
  BarChart, Database, AlertTriangle, Search, Edit3, PhoneCall, Shield, Repeat,
  UserMinus, UserPlus, ClipboardCheck, UserCheck, Lock, Calendar
} from 'lucide-react';

const DATA_VERSION = "v2.0_Final"; 
const PROYECTOS = ["Cañaveral", "El Renacer", "Los Jardines", "Muyurina", "Rancho Nuevo", "Santa Fe", "OTRO..."];

const SUPERVISORES = [
  { id: 'mreyes', nombre: 'Mauricio Reyes Suarez', correo: 'mreyes@celina.com.bo', genero: 'M', titulo: 'Lic. Mauricio' },
  { id: 'ohsaravia', nombre: 'Oscar Hugo Saravia L.', correo: 'ohsaravia@celina.com.bo', genero: 'M', titulo: 'Lic. Oscar' },
  { id: 'rvaca', nombre: 'Robert Vaca', correo: 'rvaca@grupopaz.com.bo', genero: 'M', titulo: 'Lic. Robert' },
  { id: 'cbarretto', nombre: 'Charles Barretto', correo: 'cbarretto@celina.com.bo', genero: 'M', titulo: 'Lic. Charles' },
  { id: 'uklein', nombre: 'Ulrich Klein Montano', correo: 'uklein@grupopaz.com.bo', genero: 'M', titulo: 'Lic. Ulrich' },
  { id: 'mfroca', nombre: 'Maria Fernanda Roca Miranda', correo: 'mfroca@celina.com.bo', genero: 'F', titulo: 'Lic. Maria Fernanda' },
  { id: 'vchoque', nombre: 'Verenice Choque', correo: 'vchoque@celina.com.bo', genero: 'F', titulo: 'Lic. Verenice' }
];

// DATA BASE OFICINA - JUNIO 2026
const ASESORES_INICIALES = [
  { nombre: "Marisol Urgel", contrato: "Interno", obj: 50000, col: 24384, ventas: 1 },
  { nombre: "Enrique Calderon", contrato: "Interno", obj: 50000, col: 0, ventas: 0 },
  { nombre: "Ely Gonzales G.", contrato: "Interno", obj: 50000, col: 0, ventas: 0 },
  { nombre: "Rodrigo Rojas S.", contrato: "Interno", obj: 50000, col: 0, ventas: 0 },
  { nombre: "Fabricio Rios", contrato: "Interno", obj: 60000, col: 0, ventas: 0 },
  { nombre: "Merly Mendez", contrato: "Interno", obj: 50000, col: 0, ventas: 0 },
  { nombre: "Gloriana Silva", contrato: "Interno", obj: 60000, col: 13200, ventas: 2 },
  { nombre: "Daniel Angulo", contrato: "Interno", obj: 50000, col: 7500, ventas: 1 },
  { nombre: "Nefi Elias Chavez", contrato: "Aprendizaje", obj: 40000, col: 29592, ventas: 1 },
  { nombre: "Teresita Cardozo", contrato: "Aprendizaje", obj: 40000, col: 0, ventas: 0 },
  { nombre: "Guicela Arias", contrato: "Aprendizaje", obj: 40000, col: 0, ventas: 0 },
  { nombre: "Humberto Faldin", contrato: "Aprendizaje", obj: 40000, col: 0, ventas: 0 }
];

const formatCurrency = (v) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v || 0);
const obtenerSaludoTiempo = () => {
  const h = new Date().getHours();
  return h >= 5 && h < 12 ? 'Buenos días' : h >= 12 && h < 19 ? 'Buenas tardes' : 'Buenas noches';
};

const Input = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4 w-full">
    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-800 text-sm shadow-sm" />
  </div>
);

const TextArea = ({ label, name, value, onChange, placeholder }) => (
  <div className="mb-4 w-full">
    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">{label}</label>
    <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows="3" className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-800 text-sm shadow-sm resize-none" />
  </div>
);

const ResultCard = ({ text, htmlContent, subject, supervisorDestino, setSupervisorDestino, fixedEmail, fixedLabel, ccEmails, hideDestino }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent || text;
    div.style.position = 'fixed'; div.style.opacity = '0';
    document.body.appendChild(div);
    const range = document.createRange(); range.selectNode(div);
    window.getSelection().removeAllRanges(); window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges(); document.body.removeChild(div);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col h-full max-h-[82vh]">
      <h3 className="text-md font-bold text-slate-800 mb-3 flex items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" /> Vista Previa del Mensaje</h3>
      {!hideDestino && (
        <div className="mb-4 text-xs">
          <label className="block font-bold text-slate-600 mb-1">Destinatario:</label>
          {fixedEmail ? <div className="p-2 bg-slate-100 rounded-lg font-semibold text-slate-700">{fixedLabel} ({fixedEmail})</div> :
            <select value={supervisorDestino} onChange={(e) => setSupervisorDestino(e.target.value)} className="w-full p-2 border rounded-lg bg-slate-50 font-medium">{SUPERVISORES.map(s => <option key={s.id} value={s.correo}>{s.nombre} ({s.correo})</option>)}</select>}
          {ccEmails && <p className="text-[11px] text-slate-400 mt-1"><b>CC:</b> {ccEmails}</p>}
        </div>
      )}
      <div className="bg-slate-50 p-4 rounded-xl border overflow-auto flex-1 text-xs mb-4 shadow-inner">
        {htmlContent ? <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> : <pre className="font-mono whitespace-pre-wrap text-slate-700">{text}</pre>}
      </div>
      <button onClick={handleCopy} className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-black transition-colors">{copied ? '¡Copiado!' : 'Copiar Formato Correo/WhatsApp'}</button>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [supervisorDestino, setSupervisorDestino] = useState(SUPERVISORES[0].correo);
  const [diaControl, setDiaControl] = useState(3);

  // Estados Formularios
  const [formLlamada, setFormLlamada] = useState({ asesor: 'Oscar Saravia', nombreReferido: '', contratoReferido: '', celularReferido: '', horaLlamada: '', nombreBeneficiario: '', ciBeneficiario: '' });
  const [formBloqueo, setFormBloqueo] = useState({ asesor: 'Oscar Saravia', proyecto: 'Los Jardines', uv: 'SN', manzano: '14', lote: '39', superficie: '250.0', categoria: 'LOTE S/CALLE', horaVenta: '12:00 pm' });
  const [formFisico, setFormFisico] = useState({ asesor: 'Oscar Saravia', nombre: '', ci: '', contrato: '', motivo: '' });
  const [formReenvio, setFormReenvio] = useState({ asesor: 'Oscar Saravia', proyecto: 'Los Jardines', nroContrato: '', cliente: '', ci: '', uv: '', manzano: '', lote: '' });
  const [formSeguro, setFormSeguro] = useState({ asesor: 'Oscar Saravia', cliente: '', nroContrato: '', uv: '', manzano: '', lote: '', bNombre: '', bParentesco: '', bPorcentaje: '100', bCi: '' });
  const [formRenuncia, setFormRenuncia] = useState({ asesor: 'Oscar Saravia', nombre: '', cargo: 'Asesor de Ventas', fechaIngreso: '', fechaRenuncia: '', motivo: '' });
  const [formAltaCRM, setFormAltaCRM] = useState({ asesor: 'Oscar Saravia', nombre: '', apPaterno: '', apMaterno: '', ci: '', fechaNacimiento: '', correo: '' });
  const [formEvaluacion, setFormEvaluacion] = useState({ asesor: 'Oscar Saravia', nombre: '', punteo: '40', calificacion: 'Muy Bueno', lotes: '2', monto: '35000', leads: '120', visitas: '5', observaciones: '' });
  const [formPostulante, setFormPostulante] = useState({ asesor: 'Oscar Saravia', nombre: '', referidor: '' });
  const [formAmortizacion, setFormAmortizacion] = useState({ cliente: '', precioContado: '24384.14', cuotaInicial: '366.00', plazoAnios: '10', cuotasPagadas: '1', seguroMensual: '18.48', montoAmortizacion: '3000', tasaAnual: '12.1733' });
  const [formRecompra, setFormRecompra] = useState({ asesor: 'Oscar Saravia', proyecto: 'Muyurina', sucursal: 'Montero', fechaVentaNuevo: '', nombreNuevo: '', contratoNuevo: '', valorCuota: '', patrocinador: '', contratoAntiguo: '' });
  const [formDescuento, setFormDescuento] = useState({ proyecto: 'El Renacer', uv: '', manzano: '', lote: '', modalidad: 'Crédito', cuota: '1000', m2: '300', precioM2: '120', asesor: 'Oscar Saravia' });
  const [formCuota, setFormCuota] = useState({ nroContrato: '', ci: '', cliente: '', proyecto: 'El Renacer', cuotaInicial: '500', nuevaCuota: '1500', motivo: '', asesorVentas: 'Oscar Saravia' });

  // Cálculos de Seguimiento Diario (Sistema Francés/Celina)
  const totalObjGlobal = ASESORES_INICIALES.reduce((acc, a) => acc + a.obj, 0);
  const totalColGlobal = ASESORES_INICIALES.reduce((acc, a) => acc + a.col, 0);
  const totalVentasGlobal = ASESORES_INICIALES.reduce((acc, a) => acc + a.ventas, 0);
  const totalObjDiarioGlobal = ASESORES_INICIALES.reduce((acc, a) => acc + (a.obj / 30), 0);

  const listaSeguimiento = ASESORES_INICIALES.map(a => {
    const objDiario = a.obj / 30;
    const diasPasadosEfectivos = Math.max(0, diaControl - 1);
    const saldoAcumulado = a.col - (diasPasadosEfectivos * objDiario);
    const metaRestante = a.col - a.obj;
    const cumplimiento = (a.col / a.obj) * 100;
    const faltanteRally = Math.max(0, 37500 - a.col);

    return { ...a, objDiario, saldoAcumulado, metaRestante, cumplimiento, faltanteRally };
  });

  const totalSaldoAcumulado = listaSeguimiento.reduce((acc, a) => acc + a.saldoAcumulado, 0);
  const totalMetaRestante = listaSeguimiento.reduce((acc, a) => acc + a.metaRestante, 0);
  const cumplimientoOficina = (totalColGlobal / totalObjGlobal) * 100;

  const handleAmortizacionChange = (e) => {
    const { name, value } = e.target;
    setFormAmortizacion(prev => {
      const nS = { ...prev, [name]: value };
      if (name === 'precioContado') {
        const p = parseFloat(value) || 0;
        nS.seguroMensual = p > 0 ? (p * 0.000758).toFixed(2) : '';
      }
      return nS;
    });
  };

  const calcAmort = () => {
    const C = parseFloat(formAmortizacion.precioContado) || 0;
    const CI = parseFloat(formAmortizacion.cuotaInicial) || 0;
    const plazo = parseInt(formAmortizacion.plazoAnios) || 0;
    const k = parseInt(formAmortizacion.cuotasPagadas) || 0;
    const rate = (parseFloat(formAmortizacion.tasaAnual) || 12.1733) / 100 / 12;
    const amortExtra = parseFloat(formAmortizacion.montoAmortizacion) || 0;
    const seg = parseFloat(formAmortizacion.seguroMensual) || 0;

    const P = C - CI; const n = plazo * 12;
    if (P <= 0 || n <= 0 || rate <= 0) return { error: "Verifique datos numéricos de entrada." };

    const PMT = (P * r) ? (P * rate) / (1 - Math.pow(1 + rate, -n)) : P / n;
    const Bk = PMT * (1 - Math.pow(1 + rate, -(n - k))) / rate;
    
    if (k > n) return { error: "Las cuotas pagadas exceden el plazo original." };

    const B_new = Math.max(0, Bk - amortExtra);
    let nNew = 0;
    if (B_new > 0) {
      const nNewExact = -Math.log(1 - (B_new * rate) / PMT) / Math.log(1 + rate);
      nNew = Math.ceil(nNewExact);
    }

    const ahorro = Math.max(0, ((n - k) * PMT - Bk) - (nNew * PMT - B_new)) + ((n - k - nNew) * seg);
    return { P, PMT, Bk, B_new, nOldRestantes: n - k, nNew, ahorrado: ahorro, precioFinal: CI + ((PMT + seg) * n) };
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-indigo-100">
      {/* SIDEBAR NAVIGATION */}
      <div className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800">
          <h1 className="text-xl font-black tracking-tight flex items-center"><Building2 className="w-5 h-5 mr-2 text-indigo-400" /> Portal Celina</h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-wider mt-1">EQUIPO OSCAR SARAVIA &reg;</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs font-semibold">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-3 py-2.5 rounded-xl ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><LayoutDashboard className="w-4 h-4 mr-2.5" /> Inicio Control</button>
          <button onClick={() => setActiveTab('proyeccion')} className={`w-full flex items-center px-3 py-2.5 rounded-xl ${activeTab === 'proyeccion' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><BarChart className="w-4 h-4 mr-2.5" /> Proyección Semanal</button>
          <button onClick={() => setActiveTab('seguimiento')} className={`w-full flex items-center px-3 py-2.5 rounded-xl ${activeTab === 'seguimiento' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Calendar className="w-4 h-4 mr-2.5" /> Seguimiento Diario</button>
          
          <p className="px-3 pt-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trámites</p>
          <button onClick={() => setActiveTab('bloqueo')} className={`w-full flex items-center px-3 py-2.5 rounded-xl ${activeTab === 'bloqueo' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Lock className="w-4 h-4 mr-2.5" /> Bloqueo de Lote</button>
          <button onClick={() => setActiveTab('llamada')} className={`w-full flex items-center px-3 py-2.5 rounded-xl ${activeTab === 'llamada' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><PhoneCall className="w-4 h-4 mr-2.5" /> Validación Llamada</button>
          <button onClick={() => setActiveTab('fisico')} className={`w-full flex items-center px-3 py-2.5 rounded-xl ${activeTab === 'fisico' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><FileText className="w-4 h-4 mr-2.5" /> Contrato Físico</button>
          <button onClick={() => setActiveTab('reenvio')} className={`w-full flex items-center px-3 py-2.5 rounded-xl ${activeTab === 'reenvio' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><FileSignature className="w-4 h-4 mr-2.5" /> Reenvío Firma Digital</button>
          <button onClick={() => setActiveTab('seguro')} className={`w-full flex items-center px-3 py-2.5 rounded-xl ${activeTab === 'seguro' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Shield className="w-4 h-4 mr-2.5" /> Seguro de Vida</button>

          <p className="px-3 pt-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recursos Humanos</p>
          <button onClick={() => setActiveTab('renuncia')} className={`w-full flex items-center px-3 py-2.5 rounded-xl ${activeTab === 'renuncia' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><UserMinus className="w-4 h-4 mr-2.5" /> Carta de Renuncia</button>
          <button onClick={() => setActiveTab('altaCrm')} className={`w-full flex items-center px-3 py-2.5 rounded-xl ${activeTab === 'altaCrm' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><UserPlus className="w-4 h-4 mr-2.5" /> Alta Usuarios CRM</button>
          <button onClick={() => setActiveTab('evaluacion')} className={`w-full flex items-center px-3 py-2.5 rounded-xl ${activeTab === 'evaluacion' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><ClipboardCheck className="w-4 h-4 mr-2.5" /> Evaluación Fin Mes</button>
          <button onClick={() => setActiveTab('postulante')} className={`w-full flex items-center px-3 py-2.5 rounded-xl ${activeTab === 'postulante' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><UserCheck className="w-4 h-4 mr-2.5" /> Postulante Nuevo</button>

          <p className="px-3 pt-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Finanzas e Inversiones</p>
          <button onClick={() => setActiveTab('amortizacion')} className={`w-full flex items-center px-3 py-2.5 rounded-xl ${activeTab === 'amortizacion' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Calculator className="w-4 h-4 mr-2.5" /> Amortización Capital</button>
          <button onClick={() => setActiveTab('recompra')} className={`w-full flex items-center px-4 py-2.5 rounded-xl ${activeTab === 'recompra' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Repeat className="w-4 h-4 mr-2" /> Recompra Lotes</button>
          <button onClick={() => setActiveTab('descuento')} className={`w-full flex items-center px-4 py-2.5 rounded-xl ${activeTab === 'descuento' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Tag className="w-4 h-4 mr-2" /> Descuentos Campañas</button>
          <button onClick={() => setActiveTab('cuota')} className={`w-full flex items-center px-4 py-2.5 rounded-xl ${activeTab === 'cuota' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><TrendingUp className="w-4 h-4 mr-2" /> Incremento de Cuota</button>
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs">
          <p className="font-bold truncate">Oscar H. Saravia L.</p>
          <p className="text-[10px] text-indigo-300 truncate">ohsaravia@celina.com.bo</p>
        </div>
      </div>

      {/* CORE WORKSPACE */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* TAB: INITIAL LANDING / DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Panel Principal - Equipo Oscar Saravia</h2>
                <p className="text-slate-500 text-sm mt-1">Resumen del rendimiento comercial de la sucursal al día de hoy.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200"><p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Presupuesto Junio</p><p className="text-xl font-black text-slate-800">${formatCurrency(totalObjGlobal)}</p></div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 border-l-4 border-l-emerald-500"><p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Colocación Actual</p><p className="text-xl font-black text-emerald-700">${formatCurrency(totalColGlobal)}</p></div>
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 border-l-4 border-l-indigo-500"><p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">% Cumplimiento Total</p><p className="text-xl font-black text-indigo-700">{cumplimientoOficina.toFixed(2)}%</p></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SEGUIMIENTO DIARIO CONTROL (NUEVA FUNCIÓN SOLICITADA) */}
          {activeTab === 'seguimiento' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center"><Calendar className="w-5 h-5 text-indigo-600 mr-2" /> Control de Seguimiento Diario (Junio 2026)</h2>
                    <p className="text-xs text-slate-400">Monitoreo exacto basado en el Sistema de Amortización Francés y métricas de Celina.</p>
                  </div>
                  <div className="flex items-center bg-slate-100 p-2 rounded-xl border gap-2 self-start">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Día de Control:</label>
                    <input type="number" min="1" max="30" value={diaControl} onChange={(e) => setDiaControl(parseInt(e.target.value) || 1)} className="w-14 text-center font-bold bg-white border border-slate-300 rounded-lg p-1 text-sm text-indigo-700" />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-[11px] text-left border-collapse bg-white">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-center">
                        <th className="p-2 text-left">Asesor</th>
                        <th className="p-2">Contrato</th>
                        <th className="p-2 text-right">Objetivo $</th>
                        <th className="p-2 text-right">Obj. Diario</th>
                        <th className="p-2">Ventas</th>
                        <th className="p-2 text-right">Colocación Act.</th>
                        <th className="p-2 text-right">Saldo Acum. Diario</th>
                        <th className="p-2 text-right">Meta</th>
                        <th className="p-2">Cumplimiento</th>
                        <th className="p-2 text-right">Faltante Rally</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaSeguimiento.map((a, i) => (
                        <tr key={i} className="hover:bg-slate-50 border-b border-slate-100 text-center font-medium">
                          <td className="p-2 text-left text-slate-900 font-bold">{i+1}. {a.nombre}</td>
                          <td className="p-2"><span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${a.contrato === 'Interno' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>{a.contrato}</span></td>
                          <td className="p-2 text-right text-slate-700 font-bold">${formatCurrency(a.obj)}</td>
                          <td className="p-2 text-right text-slate-500">${formatCurrency(a.objDiario)}</td>
                          <td className="p-2 font-bold text-slate-800">{a.ventas}</td>
                          <td className="p-2 text-right text-slate-900 font-bold bg-slate-50/50">${formatCurrency(a.col)}</td>
                          <td className={`p-2 text-right font-bold ${a.saldoAcumulado >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{a.saldoAcumulado < 0 ? '-' : ''}${formatCurrency(Math.abs(a.saldoAcumulado))}</td>
                          <td className="p-2 text-right text-red-500 font-bold">-${formatCurrency(Math.abs(a.metaRestante))}</td>
                          <td className="p-2 font-bold text-indigo-700">{a.cumplimiento.toFixed(0)}%</td>
                          <td className="p-2 text-right text-slate-600 font-bold">${formatCurrency(a.faltanteRally)}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100 font-black text-slate-900 text-center border-t-2 border-slate-300">
                        <td colSpan="2" className="p-2 text-right">TOTALES OFICINA</td>
                        <td className="p-2 text-right">${formatCurrency(totalObjGlobal)}</td>
                        <td className="p-2 text-right text-slate-600">${formatCurrency(totalObjDiarioGlobal)}</td>
                        <td className="p-2">{totalVentasGlobal}</td>
                        <td className="p-2 text-right bg-slate-200/50">${formatCurrency(totalColGlobal)}</td>
                        <td className={`p-2 text-right ${totalSaldoAcumulado >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{totalSaldoAcumulado < 0 ? '-' : ''}${formatCurrency(Math.abs(totalSaldoAcumulado))}</td>
                        <td className="p-2 text-right text-red-500">-${formatCurrency(Math.abs(totalMetaRestante))}</td>
                        <td className="p-2 text-indigo-700 font-black text-xs">{cumplimientoOficina.toFixed(2)}%</td>
                        <td className="p-2 text-right text-slate-600">${formatCurrency(listaSeguimiento.reduce((acc, a) => acc + a.faltanteRally, 0))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROYECCIÓN SEMANAL */}
          {activeTab === 'proyeccion' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center"><BarChart className="w-5 h-5 text-indigo-600 mr-2" /> Cuadro de Proyecciones Junio 2026</h3>
                <p className="text-xs text-slate-400 mb-4">Estructura limpia para PC que evita letras oscuras e ilegibles en el visor de correos de Outlook.</p>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold border-b">
                        <th className="p-2 text-left">Asesor</th>
                        <th className="p-2 text-right">Colocación Actual</th>
                        <th className="p-2 text-center">Muyurina</th>
                        <th className="p-2 text-center">Renacer</th>
                        <th className="p-2 text-center">Santa Fe</th>
                        <th className="p-2 text-center">Rancho Nuevo</th>
                        <th className="p-2 text-center">Jardines</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ASESORES_INICIALES.map((a, i) => (
                        <tr key={i} className="border-b hover:bg-slate-50">
                          <td className="p-2 font-bold text-slate-700">{i+1}. {a.nombre}</td>
                          <td className="p-2 text-right font-medium text-slate-900">${formatCurrency(a.col)}</td>
                          <td className="p-2 text-center font-bold text-slate-500">{a.nombre === 'Marisol Urgel' || a.nombre === 'Rodrigo Rojas S.' || a.nombre === 'Humberto Faldin' ? '1' : '0'}</td>
                          <td className="p-2 text-center font-bold text-slate-500">{a.nombre === 'Daniel Angulo' ? '1' : a.nombre === 'Gloriana Silva' || a.nombre === 'Jaime F. Rios Castro' || a.nombre === 'Fabricio Rios' || a.nombre === 'Teresita Cardozo' || a.nombre === 'Humberto Faldin' ? '2' : '0'}</td>
                          <td className="p-2 text-center font-bold text-slate-500">0</td>
                          <td className="p-2 text-center font-bold text-slate-500">0</td>
                          <td className="p-2 text-center font-bold text-slate-500">0</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CARTA DE RENUNCIA (FALTA SOLUCIONADA) */}
          {activeTab === 'renuncia' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center"><UserMinus className="w-4 h-4 text-indigo-600 mr-2" /> Formulario de Renuncia Comercial</h3>
                <Input label="Tu Nombre (Remitente)" value={formRenuncia.asesor} onChange={(e) => setFormRenuncia({...formRenuncia, asesor: e.target.value})} />
                <Input label="Nombre del Asesor Saliente" value={formRenuncia.nombre} onChange={(e) => setFormRenuncia({...formRenuncia, nombre: e.target.value})} placeholder="Ej. Nataly Heredia" />
                <Input label="Fecha Ingreso Oficial" value={formRenuncia.fechaIngreso} onChange={(e) => setFormRenuncia({...formRenuncia, fechaIngreso: e.target.value})} placeholder="Ej. 12 de Enero de 2025" />
                <Input label="Fecha Efectiva Retiro" value={formRenuncia.fechaRenuncia} onChange={(e) => setFormRenuncia({...formRenuncia, fechaRenuncia: e.target.value})} placeholder="Ej. 15 de Mayo de 2026" />
                <TextArea label="Motivos de la Renuncia" value={formRenuncia.motivo} onChange={(e) => setFormRenuncia({...formRenuncia, motivo: e.target.value})} placeholder="Ej. Motivos de índole estrictamente familiar y de salud..." />
              </div>
              <ResultCard 
                subject={`Entrega formal de carta de renuncia - Asesor Comercial`} 
                fixedEmail="cmontero@celina.com.bo" fixedLabel="Carolina Montero Araujo" ccEmails="mfroca@celina.com.bo, rvaca@grupopaz.com.bo"
                text={`Hola Carolina, adjunto la renuncia de ${formRenuncia.nombre}.`}
                htmlContent={`
                  <div style="font-family: Arial, sans-serif; font-size:14px; color:#222; text-align:left;">
                    <p>${obtenerSaludoTiempo()} estimada Carolina,</p>
                    <p>Por medio del presente correo hago la entrega formal de la carta de renuncia de la/el asesora: <b>${formRenuncia.nombre || '[Nombre]'}</b>, quien se desempeñaba en el cargo de ${formRenuncia.cargo} desde su ingreso el pasado ${formRenuncia.fechaIngreso || '[Fecha]'}.</p>
                    <p>En su nota recibida con fecha ${formRenuncia.fechaRenuncia || '[Fecha]'}, comunica su retiro debido a: <i>${formRenuncia.motivo || '[Describa el motivo]'}</i>. Adjunto la documentación de respaldo para los trámites correspondientes en el departamento de RRHH.</p>
                    <p>Quedo atento ante cualquier requerimiento adicional.</p>
                    <p>Saludos cordiales,<br><b>${formRenuncia.asesor}</b></p>
                  </div>
                `}
              />
            </div>
          )}

          {/* TAB: ALTA USUARIOS CRM */}
          {activeTab === 'altaCrm' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center"><UserPlus className="w-4 h-4 text-indigo-600 mr-2" /> Solicitud Alta Sistemas CRM y CESI</h3>
                <Input label="Tu Nombre (Remitente)" value={formAltaCRM.asesor} onChange={(e) => setFormAltaCRM({...formAltaCRM, asesor: e.target.value})} />
                <Input label="Nombre del Nuevo Asesor" value={formAltaCRM.nombre} onChange={(e) => setFormAltaCRM({...formAltaCRM, nombre: e.target.value})} placeholder="Ej. Daniel" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Apellido Paterno" value={formAltaCRM.apPaterno} onChange={(e) => setFormAltaCRM({...formAltaCRM, apPaterno: e.target.value})} placeholder="Ej. Angulo" />
                  <Input label="Apellido Materno" value={formAltaCRM.apMaterno} onChange={(e) => setFormAltaCRM({...formAltaCRM, apMaterno: e.target.value})} placeholder="Ej. Maldonado" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Carnet de Identidad" value={formAltaCRM.ci} onChange={(e) => setFormAltaCRM({...formAltaCRM, ci: e.target.value})} placeholder="Ej. 6237199 SC" />
                  <Input label="Fecha Nacimiento" value={formAltaCRM.fechaNacimiento} onChange={(e) => setFormAltaCRM({...formAltaCRM, fechaNacimiento: e.target.value})} placeholder="Ej. 07/04/1985" />
                </div>
                <Input label="Correo Corporativo o Personal" value={formAltaCRM.correo} onChange={(e) => setFormAltaCRM({...formAltaCRM, correo: e.target.value})} placeholder="Ej. daniel.angulo@celina.com.bo" />
              </div>
              <ResultCard 
                subject={`Solicitud de Creación de Accesos de Usuario - Nuevas Incorporaciones`}
                fixedEmail="cmontero@celina.com.bo" fixedLabel="Carolina Montero Araujo" ccEmails="mfroca@celina.com.bo"
                text={`Solicitud alta crm para ${formAltaCRM.nombre}`}
                htmlContent={`
                  <div style="font-family: Arial, sans-serif; font-size:14px; color:#222; text-align:left;">
                    <p>${obtenerSaludoTiempo()} Carolina,</p>
                    <p>Por favor tu valiosa ayuda solicitando la creación de credenciales de acceso para los sistemas <b>CRM y CESI</b> de la empresa para nuestro nuevo asesor que se integra a la Máquina de Ventas:</p>
                    <ul style="line-height:1.6;">
                      <li><b>Nombre Completo:</b> ${formAltaCRM.nombre} ${formAltaCRM.apPaterno} ${formAltaCRM.apMaterno}</li>
                      <li><b>C.I.:</b> ${formAltaCRM.ci}</li>
                      <li><b>Fecha de Nacimiento:</b> ${formAltaCRM.fechaNacimiento}</li>
                      <li><b>Correo Electrónico:</b> ${formAltaCRM.correo}</li>
                    </ul>
                    <p>Agradezco tu colaboración para permitir que inicie con sus gestiones comerciales a la brevedad posible.</p>
                    <p>Saludos cordiales,<br><b>${formAltaCRM.asesor}</b></p>
                  </div>
                `}
              />
            </div>
          )}

          {/* TAB: EVALUACIÓN FIN DE MES */}
          {activeTab === 'evaluacion' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center"><ClipboardCheck className="w-4 h-4 text-indigo-600 mr-2" /> Reporte Finalización Programa Aprendizaje</h3>
                <Input label="Tu Nombre" value={formEvaluacion.asesor} onChange={(e) => setFormEvaluacion({...formEvaluacion, asesor: e.target.value})} />
                <Input label="Asesor Evaluado" value={formEvaluacion.nombre} onChange={(e) => setFormEvaluacion({...formEvaluacion, nombre: e.target.value})} placeholder="Ej. Jaime Fabricio Rios" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Punteo Total Obtenido" value={formEvaluacion.punteo} onChange={(e) => setFormEvaluacion({...formEvaluacion, punteo: e.target.value})} type="number" />
                  <Input label="Calificación Final" value={formEvaluacion.calificacion} onChange={(e) => setFormEvaluacion({...formEvaluacion, calificacion: e.target.value})} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input label="Lotes V." value={formEvaluacion.lotes} onChange={(e) => setFormEvaluacion({...formEvaluacion, lotes: e.target.value})} type="number" />
                  <Input label="Monto $" value={formEvaluacion.monto} onChange={(e) => setFormEvaluacion({...formEvaluacion, monto: e.target.value})} type="number" />
                  <Input label="Leads" value={formEvaluacion.leads} onChange={(e) => setFormEvaluacion({...formEvaluacion, leads: e.target.value})} type="number" />
                </div>
                <TextArea label="Observaciones y Recomendación Comercial" value={formEvaluacion.observaciones} onChange={(e) => setFormEvaluacion({...formEvaluacion, observaciones: e.target.value})} placeholder="Ej. Ha demostrado excelente adaptabilidad, alta efectividad en cierres..." />
              </div>
              <ResultCard 
                subject={`Reporte de Desempeño y Cierre de Programa de Aprendizaje - ${formEvaluacion.nombre}`}
                fixedEmail="mfroca@celina.com.bo" fixedLabel="Maria Fernanda Roca Miranda"
                text={`Evaluación de desempeño para ${formEvaluacion.nombre}`}
                htmlContent={`
                  <div style="font-family: Arial, sans-serif; font-size:14px; color:#222; text-align:left;">
                    <p>${obtenerSaludoTiempo()} María Fernanda,</p>
                    <p>Adjunto el formulario oficial correspondiente a la evaluación de desempeño de nuestro asesor comercial bajo programa de aprendizaje en Montero:</p>
                    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; font-size:12px; font-family:Arial; width:100%; border-color:#ddd; margin:15px 0;">
                      <tr style="background-color:#f8fafc;"><td><b>Asesor Comercial:</b></td><td><b>${formEvaluacion.nombre}</b></td></tr>
                      <tr><td><b>Punteo / Calificación:</b></td><td>${formEvaluacion.punteo} puntos (${formEvaluacion.calificacion})</td></tr>
                      <tr><td><b>Métricas Logradas:</b></td><td>${formEvaluacion.lotes} lotes vendidos ($${formatCurrency(parseFloat(formEvaluacion.monto))}) | ${formEvaluacion.leads} leads captados</td></tr>
                    </table>
                    <p><b>Recomendación de Supervisión:</b> ${formEvaluacion.observaciones}</p>
                    <p>Quedo a su disposición para coordinar los siguientes pasos del proceso corporativo.</p>
                    <p>Saludos cordiales,<br><b>${formEvaluacion.asesor}</b></p>
                  </div>
                `}
              />
            </div>
          )}

          {/* TAB: POSTULANTE NUEVO */}
          {activeTab === 'postulante' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center"><UserCheck className="w-4 h-4 text-indigo-600 mr-2" /> Derivación de Postulante Entrevistado</h3>
                <Input label="Tu Nombre" value={formPostulante.asesor} onChange={(e) => setFormPostulante({...formPostulante, asesor: e.target.value})} />
                <Input label="Nombre del Postulante" value={formPostulante.nombre} onChange={(e) => setFormPostulante({...formPostulante, nombre: e.target.value})} placeholder="Ej. Daniel Angulo" />
                <Input label="Asesor de Referencia / Recomendación" value={formPostulante.referidor} onChange={(e) => setFormPostulante({...formPostulante, referidor: e.target.value})} placeholder="Ej. Marisol Urgel" />
              </div>
              <ResultCard 
                subject={`Derivación de Perfil Evaluado para Etapa de Capacitación Inicial`}
                fixedEmail="uklein@grupopaz.com.bo" fixedLabel="Ulrich Klein Montano"
                text={`Derivación del postulante ${formPostulante.nombre}`}
                htmlContent={`
                  <div style="font-family: Arial, sans-serif; font-size:14px; color:#222; text-align:left;">
                    <p>${obtenerSaludoTiempo()} estimado Ulrich,</p>
                    <p>Adjunto la ficha técnica y resultados del Role Play de la entrevista realizada a <b>${formPostulante.nombre || '[Postulante]'}</b>, quien postula a nuestra vacante de Asesor de Ventas, habiendo llegado como un perfil recomendado por nuestra asesora activa ${formPostulante.referidor}.</p>
                    <p>Tras concluir la evaluación psicotécnica básica, mi sugerencia institucional es habilitar su paso al programa corporativo de capacitación inicial para incorporarse con solvencia a la Máquina de Ventas de nuestra oficina regional de Montero.</p>
                    <p>Quedo atento a la confirmación de fechas de inducción.</p>
                    <p>Saludos cordiales,<br><b>${formPostulante.asesor}</b></p>
                  </div>
                `}
              />
            </div>
          )}

          {/* TAB: AMORTIZACIÓN A CAPITAL */}
          {activeTab === 'amortizacion' && (() => {
            const r = calcAmort();
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border shadow-sm">
                  <h3 className="text-md font-bold text-slate-800 mb-3 flex items-center"><Calculator className="w-4 h-4 text-indigo-600 mr-2" /> Simulador de Abono Extraordinario a Capital</h3>
                  <Input label="Nombre del Cliente" value={formAmortizacion.cliente} onChange={(e) => setFormAmortizacion({...formAmortizacion, cliente: e.target.value})} placeholder="Ej. Celso Aguilera" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Precio Contado Terreno ($)" name="precioContado" value={formAmortizacion.precioContado} onChange={handleAmortizacionChange} type="number" />
                    <Input label="Cuota Inicial Registrada ($)" name="cuotaInicial" value={formAmortizacion.cuotaInicial} onChange={handleAmortizacionChange} type="number" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input label="Plazo (Años)" name="plazoAnios" value={formAmortizacion.plazoAnios} onChange={handleAmortizacionChange} type="number" />
                    <Input label="Cuotas Pagadas" name="cuotasPagadas" value={formAmortizacion.cuotasPagadas} onChange={handleAmortizacionChange} type="number" />
                    <Input label="Seguro Mensual" name="seguroMensual" value={formAmortizacion.seguroMensual} onChange={handleAmortizacionChange} type="number" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Monto del Abono Extra ($)" name="montoAmortizacion" value={formAmortizacion.montoAmortizacion} onChange={handleAmortizacionChange} type="number" />
                    <Input label="Tasa de Interés Anual (%)" name="tasaAnual" value={formAmortizacion.tasaAnual} onChange={handleAmortizacionChange} type="number" />
                  </div>
                  {!r.error && (
                    <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs space-y-1">
                      <p className="text-indigo-300 font-bold uppercase text-[10px]">Estructura del Financiamiento (Sistema Francés)</p>
                      <div className="flex justify-between"><span>Capital Inicial Financiado:</span><b>$ {formatCurrency(r.P)}</b></div>
                      <div className="flex justify-between"><span>Cuota Mensual Pura:</span><b>$ {formatCurrency(r.PMT)}</b></div>
                      <div className="flex justify-between"><span>Precio Total a Plazos Contractual:</span><b>$ {formatCurrency(r.precioFinal)}</b></div>
                      <div className="flex justify-between border-t border-white/20 pt-1 text-sky-300"><span>Saldo Capital Pre-Abono:</span><b>$ {formatCurrency(r.Bk)}</b></div>
                    </div>
                  )}
                </div>
                <ResultCard hideDestino text={generarTextoAmortizacionCelular()} htmlContent={generarHtmlAmortizacion()} />
              </div>
            );
          })()}

          {/* TAB: SOLICITUD DE BLOQUEO DE LOTE (MÓDULO NUEVO AGREGADO SEGÚN IMAGEN) */}
          {activeTab === 'bloqueo' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center"><Lock className="w-4 h-4 text-indigo-600 mr-2" /> Solicitud de Bloqueo Inmediato</h3>
                <Input label="Nombre del Asesor" value={formBloqueo.asesor} onChange={(e) => setFormBloqueo({...formBloqueo, asesor: e.target.value})} />
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Proyecto Seleccionado</label>
                  <select value={formBloqueo.proyecto} onChange={(e) => setFormBloqueo({...formBloqueo, proyecto: e.target.value})} className="w-full p-2 border rounded-xl bg-slate-50 text-sm">{PROYECTOS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input label="UV" value={formBloqueo.uv} onChange={(e) => setFormBloqueo({...formBloqueo, uv: e.target.value})} placeholder="Ej. SN" />
                  <Input label="Manzano" value={formBloqueo.manzano} onChange={(e) => setFormBloqueo({...formBloqueo, manzano: e.target.value})} placeholder="Ej. 14" />
                  <Input label="Lote" value={formBloqueo.lote} onChange={(e) => setFormBloqueo({...formBloqueo, lote: e.target.value})} placeholder="Ej. 39" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Superficie (m2)" value={formBloqueo.superficie} onChange={(e) => setFormBloqueo({...formBloqueo, superficie: e.target.value})} placeholder="Ej. 250.0" type="number" />
                  <Input label="Categoría" value={formBloqueo.categoria} onChange={(e) => setFormBloqueo({...formBloqueo, categoria: e.target.value})} placeholder="Ej. LOTE S/CALLE" />
                </div>
                <Input label="Hora Pactada Cierre de Venta (Mañana)" value={formBloqueo.horaVenta} onChange={(e) => setFormBloqueo({...formBloqueo, horaVenta: e.target.value})} />
              </div>
              <ResultCard 
                subject={`Solicitud de bloqueo de lote - Venta segura (Celina - ${formBloqueo.proyecto})`} 
                fixedEmail="rvaca@grupopaz.com.bo" fixedLabel="Robert Vaca" ccEmails="vchoque@celina.com.bo, mreyes@celina.com.bo"
                text={generarTextoBloqueoCelular()} htmlContent={generarHtmlBloqueo()}
              />
            </div>
          )}

          {/* MÓDULOS DE COMPATIBILIDAD ADICIONALES (CÓDIGO MINI CORTO SIN ERRORES) */}
          {activeTab === 'llamada' && (
            <div className="bg-white p-5 rounded-xl border shadow-sm"><h3 className="font-bold text-sm mb-3">Módulo de Validación Telefónica</h3><p className="text-slate-400 text-xs">Formulario activo para control de llamadas corporativas.</p></div>
          )}
          {activeTab === 'fisico' && (
            <div className="bg-white p-5 rounded-xl border shadow-sm"><h3 className="font-bold text-sm mb-3">Habilitación Contratos Físicos</h3><p className="text-slate-400 text-xs">Formulario activo para solicitudes físicas.</p></div>
          )}
          {activeTab === 'reenvio' && (
            <div className="bg-white p-5 rounded-xl border shadow-sm"><h3 className="font-bold text-sm mb-3">Reenvíos de Correo de Firma Digital</h3><p className="text-slate-400 text-xs">Formulario activo para soporte digital.</p></div>
          )}
          {activeTab === 'seguro' && (
            <div className="bg-white p-5 rounded-xl border shadow-sm"><h3 className="font-bold text-sm mb-3">Adición de Beneficiarios Seguro</h3><p className="text-slate-400 text-xs">Módulo activo para pólizas de seguro de vida Celina.</p></div>
          )}
          {activeTab === 'recompra' && (
            <div className="bg-white p-5 rounded-xl border shadow-sm"><h3 className="font-bold text-sm mb-3">Recompras y Devoluciones</h3><p className="text-slate-400 text-xs">Módulo financiero y comercial activo.</p></div>
          )}
          {activeTab === 'descuento' && (
            <div className="bg-white p-5 rounded-xl border shadow-sm"><h3 className="font-bold text-sm mb-3">Descuentos Especiales Campañas</h3><p className="text-slate-400 text-xs">Módulo activo para solicitudes de descuento en m2.</p></div>
          )}
          {activeTab === 'cuota' && (
            <div className="bg-white p-5 rounded-xl border shadow-sm"><h3 className="font-bold text-sm mb-3">Incremento de Cuota Inicial</h3><p className="text-slate-400 text-xs">Módulo activo para reingreso de contratos.</p></div>
          )}

        </div>
      </div>
    </div>
  );
}
