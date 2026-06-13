import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Percent, 
  TrendingUp, 
  Copy, 
  Mail, 
  CheckCircle2, 
  LayoutDashboard,
  Building2,
  AlertCircle,
  Calculator,
  Tag,
  Info,
  FileSignature,
  Plus,
  Trash2,
  BarChart,
  Database,
  AlertTriangle,
  Search,
  Edit3,
  PhoneCall,
  Shield,
  Repeat,
  UserMinus,
  UserPlus,
  ClipboardCheck,
  UserCheck,
  Users,
  LineChart,
  PieChart,
  Target,
  CalendarDays,
  Menu,
  X
} from 'lucide-react';

// --- CONTROL DE VERSIÓN DE DATOS ---
const DATA_VERSION = "v1.6"; // Actualizado para purgar el error de pantalla blanca

// --- CONFIGURACIÓN DE DATOS MOCK ---
const PROYECTOS_CONVENIO_1 = ["Los Jardines", "El Renacer", "Rancho Nuevo", "Santa Fe"];
const PROYECTOS_CONVENIO_2 = ["Cañaveral"];
const PROYECTOS_PROPIOS_1 = ["Muyurina"];
const PROYECTOS = ["Cañaveral", "El Renacer", "Los Jardines", "Muyurina", "Rancho Nuevo", "Santa Fe", "OTRO..."];

const SUPERVISORES = [
  { id: 'mreyes', nombre: 'Mauricio Reyes Suarez', correo: 'mreyes@celina.com.bo', genero: 'M', titulo: 'Mauricio' },
  { id: 'ohsaravia', nombre: 'Oscar Hugo Saravia L.', correo: 'ohsaravia@celina.com.bo', genero: 'M', titulo: 'Oscar' },
  { id: 'rvaca', nombre: 'Robert Vaca', correo: 'rvaca@grupopaz.com.bo', genero: 'M', titulo: 'Lic. Robert' },
  { id: 'cbarretto', nombre: 'Charles Barretto', correo: 'cbarretto@celina.com.bo', genero: 'M', titulo: 'Ing. Charles' },
  { id: 'uklein', nombre: 'Ulrich Klein Montano', correo: 'uklein@grupopaz.com.bo', genero: 'M', titulo: 'Ulrich' },
  { id: 'mfroca', nombre: 'Maria Fernanda Roca Miranda', correo: 'mfroca@celina.com.bo', genero: 'F', titulo: 'Maria Fernanda' },
  { id: 'lbakovic', nombre: 'Lucio Bakovic', correo: 'lbakovic@grupopaz.com.bo', genero: 'M', titulo: 'Lucio' },
  { id: 'maguilar', nombre: 'Miguel Angel Aguilar A.', correo: 'maguilar@celina.com.bo', genero: 'M', titulo: 'Miguel Angel' },
  { id: 'madett', nombre: 'Mario Adett Zamora', correo: 'madett@grupopaz.com.bo', genero: 'M', titulo: 'Lic. Mario' },
  { id: 'ccastedo', nombre: 'Cristian Daniel Castedo Castedo', correo: 'ccastedo@celina.com.bo', genero: 'M', titulo: 'Cristian' },
  { id: 'vchoque', nombre: 'Verenice Choque', correo: 'vchoque@celina.com.bo', genero: 'F', titulo: 'Verenice' }
];

const EQUIPOS_ASESORES = {
  "Oscar Saravia": [
    { nombre: "Marisol Urgel Pizarro", colAct: 24384.00, tipo: "Interno", ventas: 1 },
    { nombre: "Carlos Enrique Calderon", colAct: 0, tipo: "Interno", ventas: 0 },
    { nombre: "Ely Gonzales Garcia", colAct: 7200.00, tipo: "Interno", ventas: 1 },
    { nombre: "Rodrigo Rojas Siles", colAct: 0, tipo: "Interno", ventas: 0 },
    { nombre: "Jaime F. Rios Castro", colAct: 7500, tipo: "Interno", ventas: 1 },
    { nombre: "Merly Mendez Hurtado", colAct: 0, tipo: "Interno", ventas: 0 },
    { nombre: "Gloriana Silva Almenda", colAct: 13200.00, tipo: "Interno", ventas: 2 },
    { nombre: "Daniel Angulo Maldonado", colAct: 45000.00, tipo: "Interno", ventas: 6 },
    { nombre: "Nefi Elias Chavez", colAct: 45278.00, tipo: "Aprendizaje", ventas: 2 },
    { nombre: "Teresita Cardozo Aguirre", colAct: 0, tipo: "Aprendizaje", ventas: 0 },
    { nombre: "Guicela Arias", colAct: 0, tipo: "Aprendizaje", ventas: 0 },
    { nombre: "Humberto Faldin Parapaino", colAct: 0, tipo: "Aprendizaje", ventas: 0 }
  ]
};

const OBJETIVOS_MENSUALES = {
  "Oscar Saravia": 450000 
};

const NOMBRES_PROYECTOS_PROYECCION = ["Muyurina", "Renacer", "Santa Fe", "Rancho Nuevo", "Jardines"];

// --- FUNCIONES GLOBALES ---
const formatCurrency = (val) => {
  const numericVal = Number(val) || 0;
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numericVal);
};

const formatVacio = (val) => val === 0 ? '-' : formatCurrency(val);
const formatDias = (val) => val === 0 ? '-' : formatCurrency(val);

const obtenerSaludoTiempo = () => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return 'Buenos días';
  if (hora >= 12 && hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

const formatDiaMes = (fechaIso, sumarDias = 0) => {
  if (!fechaIso) return `Día ${sumarDias + 1}`;
  const partes = String(fechaIso).split('-');
  if (partes.length !== 3) return `Día ${sumarDias + 1}`;
  const date = new Date(partes[0], partes[1] - 1, partes[2]);
  date.setDate(date.getDate() + sumarDias);
  const dia = date.getDate();
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const mes = meses[date.getMonth()];
  if (!mes) return `Día ${sumarDias + 1}`; // EVITA CRASH
  return `${dia}-${mes}`;
};

// --- COMPONENTES UI ---
const Input = ({ label, name, value, onChange, placeholder, type = "text", required = false, className = "" }) => (
  <div className={`mb-4 w-full ${className}`}>
    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5 truncate">{String(label)}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 placeholder-slate-400 shadow-sm text-sm"
    />
  </div>
);

const TextArea = ({ label, name, value, onChange, placeholder }) => (
  <div className="mb-4 w-full">
    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5 truncate">{String(label)}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows="4"
      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 placeholder-slate-400 shadow-sm resize-none text-sm"
    />
  </div>
);

const ResultCard = ({ title, text, htmlContent, subject, supervisorDestino, setSupervisorDestino, showTextPlain = true, fixedDestinoLabel, fixedDestinoEmail, ccEmails, hideDestino = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      if (htmlContent) {
        const div = document.createElement('div');
        div.innerHTML = String(htmlContent);
        div.style.position = 'fixed';
        div.style.pointerEvents = 'none';
        div.style.opacity = '0';
        div.style.backgroundColor = '#ffffff';
        div.style.color = '#000000';
        document.body.appendChild(div);

        const range = document.createRange();
        range.selectNode(div);
        const windowSelection = window.getSelection();
        windowSelection.removeAllRanges();
        windowSelection.addRange(range);

        document.execCommand('copy');

        windowSelection.removeAllRanges();
        document.body.removeChild(div);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = String(text);
        textArea.style.position = "fixed";
        textArea.style.top = "-9999px";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al intentar copiar al portapapeles:', err);
    }
  };

  const handleOpenEmailApp = () => {
    handleCopy();
    const to = fixedDestinoEmail || supervisorDestino || '';
    const ccQuery = ccEmails ? `&cc=${encodeURIComponent(ccEmails)}` : '';
    const instruccionPega = "(Por favor, borra este texto, mantén presionado aquí y selecciona 'Pegar' para insertar la tabla con su formato oficial)";
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}${ccQuery}&body=${encodeURIComponent(instruccionPega)}`;
    
    setTimeout(() => {
      window.location.href = mailtoLink;
    }, 400);
  };

  const handleOpenGmail = () => {
    handleCopy();
    const to = fixedDestinoEmail || supervisorDestino || '';
    const ccQuery = ccEmails ? `&cc=${encodeURIComponent(ccEmails)}` : '';
    const instruccionPega = "(Por favor, borra este texto, mantén presionado aquí y selecciona 'Pegar' para insertar la tabla con su formato oficial)";
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodeURIComponent(subject)}${ccQuery}&body=${encodeURIComponent(instruccionPega)}`;
    
    setTimeout(() => {
      window.open(gmailLink, '_blank');
    }, 400);
  };

  const handleOpenOutlook = () => {
    handleCopy();
    const to = fixedDestinoEmail || supervisorDestino || '';
    const ccQuery = ccEmails ? `&cc=${encodeURIComponent(ccEmails)}` : '';
    const subjectEnc = encodeURIComponent(subject);
    const bodyEnc = encodeURIComponent("(Por favor, borra este texto, mantén presionado aquí y selecciona 'Pegar' para insertar la tabla con su formato oficial)");
    
    setTimeout(() => {
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      if (isAndroid) {
        const intentUrl = `intent:${to}?subject=${subjectEnc}${ccQuery}&body=${bodyEnc}#Intent;scheme=mailto;package=com.microsoft.office.outlook;end;`;
        window.location.href = intentUrl;
      } else if (isIOS) {
        window.location.href = `ms-outlook://compose?to=${to}&subject=${subjectEnc}${ccQuery}&body=${bodyEnc}`;
      } else {
        window.location.href = `mailto:${to}?subject=${subjectEnc}${ccQuery}&body=${bodyEnc}`;
      }
    }, 400);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 sticky top-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col h-full max-h-[85vh] min-w-0 w-full">
      <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center tracking-tight">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-2" />
        Vista Previa del Mensaje
      </h3>

      {!hideDestino && (
        <div className="mb-5 w-full">
          <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Enviar a:</label>
          {fixedDestinoEmail ? (
            <div className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-100/70 text-slate-700 font-semibold shadow-inner truncate text-sm">
              {String(fixedDestinoLabel)} {fixedDestinoEmail ? `(${String(fixedDestinoEmail)})` : ''}
            </div>
          ) : (
            <select 
              value={supervisorDestino}
              onChange={(e) => setSupervisorDestino && setSupervisorDestino(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 text-slate-800 font-semibold shadow-sm cursor-pointer text-sm"
            >
              {SUPERVISORES.map(s => (
                <option key={s.id} value={s.correo}>{String(s.nombre)} ({String(s.correo)})</option>
              ))}
            </select>
          )}
          {ccEmails && (
              <p className="text-xs text-slate-500 mt-2 ml-1"><strong>CC:</strong> {String(ccEmails)}</p>
          )}
        </div>
      )}

      {htmlContent && (
        <div className="mb-4 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex gap-3 items-start shadow-sm w-full">
          <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-800 leading-relaxed">
            <strong>Si usas PC:</strong> Haz clic en <b>"Copiar Formato PC"</b> y pega directo en tu gestor de correo.<br/>
            <strong>Si usas Celular:</strong> Usa los botones inferiores para abrir la App con el diseño copiado en memoria.
          </p>
        </div>
      )}

      <div className="bg-[#f8fafc] p-5 rounded-xl border border-slate-200 mb-5 flex-1 overflow-auto shadow-inner w-full min-w-0" id="vista-previa-contenido">
        {htmlContent ? (
          <div dangerouslySetInnerHTML={{ __html: String(htmlContent) }} />
        ) : (
          <div className="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{String(text)}</div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full mt-auto">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold transition-all shadow-sm whitespace-nowrap"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2 text-slate-400" />}
          {copied ? '¡Copiado Exitosamente!' : (htmlContent ? 'Copiar Formato PC' : 'Copiar Texto para WhatsApp')}
        </button>
        {showTextPlain && !hideDestino && (
          <div className="flex-1 flex flex-col gap-2">
            <button
              onClick={handleOpenEmailApp}
              className="w-full flex items-center justify-center py-2 px-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-xl font-bold transition-all shadow-md shadow-slate-900/20 whitespace-nowrap text-sm"
              title="Abrir en la aplicación de correo predeterminada del sistema"
            >
              <Mail className="w-4 h-4 mr-2" />
              App de Correo (Por defecto)
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleOpenGmail}
                className="flex items-center justify-center py-2 px-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-md text-xs whitespace-nowrap"
              >
                Abrir en Gmail
              </button>
              <button
                onClick={handleOpenOutlook}
                className="flex items-center justify-center py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md text-xs whitespace-nowrap"
              >
                App Outlook
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {

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

  const [activeTab, setActiveTab] = useState('dashboard');
  const [supervisorDestino, setSupervisorDestino] = useState(SUPERVISORES[0].correo);
  const [globalStats, setGlobalStats] = useState({ goal: 0, actual: 0, teams: [] });
  
  const [lotesBD, setLotesBD] = useState([]);
  const [cargandoLotes, setCargandoLotes] = useState(true);
  const [loteAutocompletado, setLoteAutocompletado] = useState(false);

  const [formFisico, setFormFisico] = useState({
    nombre: '', ci: '', contrato: '', motivo: '', asesor: ''
  });

  const [formLlamada, setFormLlamada] = useState({
    asesor: '', nombreReferido: '', contratoReferido: '', celularReferido: '', horaLlamada: '', nombreBeneficiario: '', ciBeneficiario: ''
  });
  
  const [formSeguro, setFormSeguro] = useState({
    asesor: '', cliente: '', nroContrato: '', uv: '', manzano: '', lote: '',
    beneficiarios: [{ nombre: '', parentesco: '', porcentaje: '', ci: '' }]
  });

  const [formRecompra, setFormRecompra] = useState({
    asesor: '', proyecto: 'Muyurina', sucursal: '', 
    fechaVentaNuevo: '', nombreNuevo: '', contratoNuevo: '', aplicoDescuento: 'NO', cuotasPagadas: '', procesadoNuevo: 'SI', vigenteNuevo: 'SI',
    nombreAntiguo: '', contratoAntiguo: '', fechaVentaAntiguo: '', fechaPago: '', procesadoAntiguo: 'SI', vigenteAntiguo: 'SI', patrocinador: '',
    valorCuota: ''
  });

  const [formDescuento, setFormDescuento] = useState({
    proyecto: 'El Renacer', uv: '', manzano: '', lote: '', 
    modalidad: 'Crédito', 
    cuota: '', modoCuota: 'monto',
    modoBusqueda: 'manual', 
    m2: '', precioM2: '', categoria: '', asesor: '',
    proyectoManual: '', descuentoManual: '', tipoDescuentoManual: 'porcentaje',
    descuentoPropiosManual: '23' 
  });

  const [formCuota, setFormCuota] = useState({
    nroContrato: '', ci: '', cliente: '',
    proyecto: 'El Renacer', uv: '', manzano: '', lote: '', 
    cuotaInicial: '', nuevaCuota: '', motivo: '',
    asesorVentas: '', celularCliente: '', fechaVenta: ''
  });

  const [formReenvio, setFormReenvio] = useState({
    proyecto: 'Los Jardines', asesor: '',
    contratos: [{ nroContrato: '', cliente: '', ci: '', uv: '', manzano: '', lote: '' }]
  });

  const [formRenuncia, setFormRenuncia] = useState({
    asesor: '', nombre: '', cargo: 'Asesor de Ventas', fechaIngreso: '', fechaRenuncia: '', motivo: ''
  });

  const [formAltaCRM, setFormAltaCRM] = useState({
    asesor: '', nombre: '', apPaterno: '', apMaterno: '', ci: '', fechaNacimiento: '', correo: ''
  });

  const [formEvaluacion, setFormEvaluacion] = useState({
    asesor: '', nombre: '', punteo: '', calificacion: 'Muy Bueno', lotes: '', monto: '', leads: '', visitas: '', observaciones: ''
  });

  const [formPostulante, setFormPostulante] = useState({
    asesor: '', nombre: '', referidor: ''
  });

  // Estado del nuevo Amortizador Frances
  const [formAmortizacion, setFormAmortizacion] = useState({
    cliente: '', precioContrato: '', cuotaInicial: '', plazoOriginal: '', cuotasPagadas: '', seguroMensual: '', tasaAnual: '12.1733', montoAmortizacion: ''
  });

  // ESTADO PROYECCION DIARIA
  const [formDiaria, setFormDiaria] = useState(() => {
    return EQUIPOS_ASESORES["Oscar Saravia"].map(a => ({
      nombre: a.nombre, tipo: a.tipo, visita: '', venta: '', colocacion: '', hora: '', medio: ''
    }));
  });

  const [sumaVentaModal, setSumaVentaModal] = useState({ show: false, index: null, nombre: '', monto: '' });
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('Oscar Saravia');

  // ESTADO MENÚ CELULAR
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  // AUTO-CALCULO DEL SEGURO DE VIDA
  useEffect(() => {
    const pv = parseFloat(formAmortizacion.precioContrato?.toString().replace(/,/g, '')) || 0;
    const ci = parseFloat(formAmortizacion.cuotaInicial?.toString().replace(/,/g, '')) || 0;
    const cap = Math.max(0, pv - ci);
    if (cap > 0) {
       const seg = (cap * 0.00077).toFixed(2); // Fórmula: 0.77 por cada 1000
       setFormAmortizacion(prev => ({...prev, seguroMensual: seg}));
    } else {
       setFormAmortizacion(prev => ({...prev, seguroMensual: ''}));
    }
  }, [formAmortizacion.precioContrato, formAmortizacion.cuotaInicial]);
  
  useEffect(() => {
    const currentVersion = localStorage.getItem('portalAsesores_dataVersion');
    if (currentVersion !== DATA_VERSION) {
      Object.keys(EQUIPOS_ASESORES).forEach(team => {
        localStorage.removeItem(`portalAsesores_proyeccion_${team}`);
      });
      localStorage.setItem('portalAsesores_dataVersion', DATA_VERSION);
      setFormProyeccion({
        equipo: 'Oscar Saravia',
        fechaInicio: new Date().toISOString().split('T')[0],
        objetivoMensual: OBJETIVOS_MENSUALES['Oscar Saravia'],
        asesores: EQUIPOS_ASESORES['Oscar Saravia'].map(a => ({
          nombre: a.nombre, colAct: a.colAct, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0] 
        }))
      });
    }
  }, []);

  const [formProyeccion, setFormProyeccion] = useState(() => {
    try {
      const currentVersion = localStorage.getItem('portalAsesores_dataVersion');
      if (currentVersion === DATA_VERSION) {
        const savedData = localStorage.getItem(`portalAsesores_proyeccion_Oscar Saravia`);
        if (savedData) {
          return JSON.parse(savedData);
        }
      }
    } catch (e) {}
    
    return {
      equipo: 'Oscar Saravia',
      fechaInicio: new Date().toISOString().split('T')[0],
      objetivoMensual: OBJETIVOS_MENSUALES['Oscar Saravia'],
      asesores: EQUIPOS_ASESORES['Oscar Saravia'].map(a => ({
        nombre: a.nombre, colAct: a.colAct, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0] 
      }))
    };
  });

  useEffect(() => {
    let tGoal = 0;
    let tAct = 0;
    let tTeams = [];

    Object.keys(OBJETIVOS_MENSUALES).forEach(team => {
      let teamGoal = OBJETIVOS_MENSUALES[team] || 0;
      let teamAct = 0;
      
      try {
        const teamSaved = localStorage.getItem(`portalAsesores_proyeccion_${team}`);
        if (teamSaved && localStorage.getItem('portalAsesores_dataVersion') === DATA_VERSION) {
          const tData = JSON.parse(teamSaved);
          teamGoal = typeof tData.objetivoMensual === 'number' ? tData.objetivoMensual : teamGoal;
          if (Array.isArray(tData.asesores)) {
            teamAct = tData.asesores.reduce((sum, a) => {
              const sumDias = Array.isArray(a.dias) ? a.dias.reduce((d1, d2) => d1 + d2, 0) : 0;
              return sum + (Number(a.colAct) || 0) + sumDias;
            }, 0);
          }
        } else if (EQUIPOS_ASESORES[team]) {
          teamAct = EQUIPOS_ASESORES[team].reduce((sum, a) => sum + (Number(a.colAct) || 0), 0);
        }
      } catch (e) {}

      tGoal += teamGoal;
      tAct += teamAct;
      tTeams.push({ 
        name: String(team), 
        goal: Number(teamGoal) || 0, 
        actual: Number(teamAct) || 0, 
        percent: teamGoal > 0 ? (teamAct / teamGoal) * 100 : 0 
      });
    });

    tTeams.sort((a, b) => b.percent - a.percent);
    setGlobalStats({ goal: tGoal, actual: tAct, teams: tTeams });
  }, [formProyeccion, activeTab]);

  useEffect(() => {
    const savedData = localStorage.getItem(`portalAsesores_proyeccion_${equipoSeleccionado}`);
    if (savedData && localStorage.getItem('portalAsesores_dataVersion') === DATA_VERSION) {
      try {
        const pData = JSON.parse(savedData);
        if (pData && Array.isArray(pData.asesores)) {
          setFormProyeccion(pData);
        }
      } catch(e) {}
    } else {
      setFormProyeccion({
        equipo: equipoSeleccionado,
        fechaInicio: new Date().toISOString().split('T')[0],
        objetivoMensual: OBJETIVOS_MENSUALES[equipoSeleccionado] || 0,
        asesores: EQUIPOS_ASESORES[equipoSeleccionado] ? EQUIPOS_ASESORES[equipoSeleccionado].map(a => ({
          nombre: a.nombre, colAct: a.colAct, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0] 
        })) : []
      });
    }
  }, [equipoSeleccionado]);

  const saveProyeccionState = async (newState) => {
    setFormProyeccion(newState);
    try {
      localStorage.setItem(`portalAsesores_proyeccion_${newState.equipo}`, JSON.stringify(newState));
    } catch (e) {}
  };

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await fetch('./lotes.json');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const lotesLimpios = data.map(item => {
              const rawProy = String(item.proyecto || item.PROYECTO || '').toUpperCase();
              let proyLimpio = rawProy;
              if (rawProy.includes("RENACER")) proyLimpio = "El Renacer";
              else if (rawProy.includes("JARDINES")) proyLimpio = "Los Jardines";
              else if (rawProy.includes("MUYURINA")) proyLimpio = "Muyurina";
              else if (rawProy.includes("SANTA FE")) proyLimpio = "Santa Fe";
              else if (rawProy.includes("CAÑAVERAL") || rawProy.includes("CANAVERAL")) proyLimpio = "Cañaveral";
              else if (rawProy.includes("RANCHO NUEVO")) proyLimpio = "Rancho Nuevo";

              const rawM2 = String(item.superficie || item.SUPERFICIE || item.m2 || '0').replace(/[^0-9.,]/g, '').replace(',', '.');
              const rawPrecio = String(item.precio || item.PRECIO || item.precioM2 || '0').replace(/[^0-9.,]/g, '').replace(',', '.');

              return {
                proyecto: proyLimpio,
                uv: String(item.uv || item.UV || ''),
                manzano: String(item.mzn || item.MZN || item.manzano || item.MANZANO || ''),
                lote: String(item.lote || item.LOTE || ''),
                m2: parseFloat(rawM2) || 0,
                precioM2: parseFloat(rawPrecio) || 0,
                categoria: String(item.categoria || item.CATEGORIA || '')
              };
            }).filter(l => l.proyecto !== '' && l.uv !== '' && l.manzano !== '' && l.lote !== '');

            setLotesBD(lotesLimpios);
            if (lotesLimpios.length > 0) {
              setFormDescuento(prev => ({...prev, modoBusqueda: 'inteligente'}));
            }
          }
        } else {
          console.warn("Aviso: El archivo lotes.json no fue encontrado.");
        }
      } catch (error) {
        console.warn("Aviso: Fallo al cargar lotes.json. El modo manual será el predeterminado.");
      } finally {
        setCargandoLotes(false);
      }
    };
    fetchLotes();
  }, []);

  const safeToLower = (val) => (val === null || val === undefined) ? '' : String(val).toLowerCase();
  
  const pL_filtro = safeToLower(formDescuento.proyecto);
  const uL_filtro = safeToLower(formDescuento.uv);
  const mL_filtro = safeToLower(formDescuento.manzano);

  const opcionesUV = [...new Set(lotesBD
    .filter(l => safeToLower(l.proyecto) === pL_filtro)
    .map(l => l.uv)
  )].filter(val => val !== null && val !== undefined && val !== '').sort((a,b) => String(a).localeCompare(String(b), undefined, {numeric: true}));

  const opcionesMZN = [...new Set(lotesBD
    .filter(l => safeToLower(l.proyecto) === pL_filtro && safeToLower(l.uv) === uL_filtro)
    .map(l => l.manzano)
  )].filter(val => val !== null && val !== undefined && val !== '').sort((a,b) => String(a).localeCompare(String(b), undefined, {numeric: true}));

  const opcionesLote = [...new Set(lotesBD
    .filter(l => safeToLower(l.proyecto) === pL_filtro && safeToLower(l.uv) === uL_filtro && safeToLower(l.manzano) === mL_filtro)
    .map(l => l.lote)
  )].filter(val => val !== null && val !== undefined && val !== '').sort((a,b) => String(a).localeCompare(String(b), undefined, {numeric: true}));

  useEffect(() => {
    const { proyecto, uv, manzano, lote } = formDescuento;
    if (proyecto && uv && manzano && lote && lotesBD.length > 0) {
      const pL = safeToLower(proyecto);
      const uL = safeToLower(uv);
      const mL = safeToLower(manzano);
      const loL = safeToLower(lote);

      const loteEncontrado = lotesBD.find(l => 
        safeToLower(l.proyecto) === pL && 
        safeToLower(l.uv) === uL && 
        safeToLower(l.manzano) === mL && 
        safeToLower(l.lote) === loL
      );
      
      if (loteEncontrado) {
        setFormDescuento(prev => ({
          ...prev,
          m2: loteEncontrado.m2 !== null && loteEncontrado.m2 !== undefined ? String(loteEncontrado.m2) : '',
          precioM2: loteEncontrado.precioM2 !== null && loteEncontrado.precioM2 !== undefined ? String(loteEncontrado.precioM2) : '',
          categoria: loteEncontrado.categoria ? String(loteEncontrado.categoria) : ''
        }));
        setLoteAutocompletado(true);
      } else {
        setFormDescuento(prev => ({ ...prev, categoria: '' }));
        setLoteAutocompletado(false);
      }
    } else {
      setLoteAutocompletado(false);
    }
  }, [formDescuento.proyecto, formDescuento.uv, formDescuento.manzano, formDescuento.lote, lotesBD]);

  const handleFisicoChange = (e) => setFormFisico({ ...formFisico, [e.target.name]: e.target.value });
  const handleCuotaChange = (e) => setFormCuota({ ...formCuota, [e.target.name]: e.target.value });
  const handleLlamadaChange = (e) => setFormLlamada({ ...formLlamada, [e.target.name]: e.target.value });
  const handleSeguroChange = (e) => setFormSeguro({ ...formSeguro, [e.target.name]: e.target.value });
  const handleRenunciaChange = (e) => setFormRenuncia({ ...formRenuncia, [e.target.name]: e.target.value });
  const handleAltaCRMChange = (e) => setFormAltaCRM({ ...formAltaCRM, [e.target.name]: e.target.value });
  const handleEvaluacionChange = (e) => setFormEvaluacion({ ...formEvaluacion, [e.target.name]: e.target.value });
  const handlePostulanteChange = (e) => setFormPostulante({ ...formPostulante, [e.target.name]: e.target.value });
  const handleAmortizacionChange = (e) => setFormAmortizacion({ ...formAmortizacion, [e.target.name]: e.target.value });
  
  const handleRecompraChange = (e) => {
    const { name, value } = e.target;
    setFormRecompra(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'nombreNuevo' && (!prev.nombreAntiguo || prev.nombreAntiguo === prev.nombreNuevo)) {
        newState.nombreAntiguo = value;
      }
      return newState;
    });
  };

  const handleBeneficiarioChange = (index, field, value) => {
    const nuevosBeneficiarios = [...formSeguro.beneficiarios];
    nuevosBeneficiarios[index][field] = value;
    setFormSeguro({ ...formSeguro, beneficiarios: nuevosBeneficiarios });
  };
  const agregarBeneficiario = () => setFormSeguro({ ...formSeguro, beneficiarios: [...formSeguro.beneficiarios, { nombre: '', parentesco: '', porcentaje: '', ci: '' }] });
  const eliminarBeneficiario = (index) => {
    if (formSeguro.beneficiarios.length > 1) {
      setFormSeguro({ ...formSeguro, beneficiarios: formSeguro.beneficiarios.filter((_, i) => i !== index) });
    }
  };

  const handleReenvioChange = (index, field, value) => {
    const nuevosContratos = [...formReenvio.contratos];
    nuevosContratos[index][field] = value;
    setFormReenvio({ ...formReenvio, contratos: nuevosContratos });
  };
  const agregarContratoReenvio = () => setFormReenvio({ ...formReenvio, contratos: [...formReenvio.contratos, { nroContrato: '', cliente: '', ci: '', uv: '', manzano: '', lote: '' }] });
  const eliminarContratoReenvio = (index) => {
    if (formReenvio.contratos.length > 1) {
      setFormReenvio({ ...formReenvio, contratos: formReenvio.contratos.filter((_, i) => i !== index) });
    }
  };

  const handleDescuentoChange = (e) => {
    const { name, value } = e.target;
    setFormDescuento(prev => {
      const newState = { ...prev, [name]: value };
      
      if (name === 'proyecto' && value === 'OTRO...') {
        newState.modoBusqueda = 'manual';
      }
      
      if (newState.modoBusqueda === 'inteligente') {
        if (name === 'proyecto') {
          newState.uv = ''; newState.manzano = ''; newState.lote = ''; newState.m2 = ''; newState.precioM2 = ''; newState.categoria = '';
        } else if (name === 'uv') {
          newState.manzano = ''; newState.lote = ''; newState.m2 = ''; newState.precioM2 = ''; newState.categoria = '';
        } else if (name === 'manzano') {
          newState.lote = ''; newState.m2 = ''; newState.precioM2 = ''; newState.categoria = '';
        }
      }
      return newState;
    });
  };

  const handleEquipoChange = (e) => {
    setEquipoSeleccionado(String(e.target.value));
  };
  
  const updateAsesorProyeccion = (index, field, valStr) => {
    if (!formProyeccion || !Array.isArray(formProyeccion.asesores)) return;
    const nuevosAsesores = [...formProyeccion.asesores];
    nuevosAsesores[index][field] = parseFloat(valStr) || 0;
    saveProyeccionState({ ...formProyeccion, asesores: nuevosAsesores });
  };
  
  const updateAsesorArrayProyeccion = (index, type, arrayIndex, valStr) => {
    if (!formProyeccion || !Array.isArray(formProyeccion.asesores)) return;
    const nuevosAsesores = [...formProyeccion.asesores];
    nuevosAsesores[index][type][arrayIndex] = parseFloat(valStr) || 0;
    saveProyeccionState({ ...formProyeccion, asesores: nuevosAsesores });
  };

  const confirmarSumaVenta = () => {
    const montoASumar = parseFloat(sumaVentaModal.monto);
    if (!isNaN(montoASumar) && montoASumar > 0) {
      const nuevosAsesores = [...formProyeccion.asesores];
      nuevosAsesores[sumaVentaModal.index].colAct = (Number(nuevosAsesores[sumaVentaModal.index].colAct) || 0) + montoASumar;
      saveProyeccionState({ ...formProyeccion, asesores: nuevosAsesores });
    }
    setSumaVentaModal({ show: false, index: null, nombre: '', monto: '' });
  };

  const calcularDescuento = () => {
    const { proyecto, modalidad, cuota, modoCuota, m2, precioM2, descuentoManual, tipoDescuentoManual } = formDescuento;
    const m2Num = parseFloat(m2) || 0;
    const precioM2Num = parseFloat(precioM2) || 0;
    const vc = m2Num * precioM2Num;
    
    let montoCuotaNum = 0;
    let porcentajeCuota = 0;
    const cuotaVal = parseFloat(cuota) || 0;

    if (modoCuota === 'monto') {
      montoCuotaNum = cuotaVal;
      porcentajeCuota = vc > 0 ? (montoCuotaNum / vc) * 100 : 0;
    } else {
      porcentajeCuota = cuotaVal;
      montoCuotaNum = vc > 0 ? (porcentajeCuota / 100) * vc : 0;
    }

    let descuentoTotal = 0;
    let descuentoTexto = "";

    if (proyecto === 'OTRO...') {
      let descManualNum = parseFloat(descuentoManual) || 0;
      if (tipoDescuentoManual === 'porcentaje') {
         descuentoTotal = vc * (descManualNum / 100);
         descuentoTexto = descManualNum > 0 ? `${descManualNum}%` : '0%';
      } else {
         descuentoTotal = descManualNum * m2Num;
         descuentoTexto = descManualNum > 0 ? `$${descManualNum} por m²` : '0';
      }
    } else if (PROYECTOS_CONVENIO_1.includes(proyecto) || PROYECTOS_CONVENIO_2.includes(proyecto)) {
      let descuentoPorM2 = 0;
      if (modalidad === 'Contado') {
        descuentoPorM2 = PROYECTOS_CONVENIO_1.includes(proyecto) ? 3 : 4; 
      } else if (modalidad === 'Crédito') {
        if (porcentajeCuota >= 5) descuentoPorM2 = 2; 
        else if (porcentajeCuota >= 1.5) descuentoPorM2 = 1; 
      }
      descuentoTotal = descuentoPorM2 * m2Num;
      descuentoTexto = descuentoPorM2 > 0 ? `$${descuentoPorM2} por m²` : '0';

    } else if (PROYECTOS_PROPIOS_1.includes(proyecto)) {
      let porcentaje = 0;
      if (modalidad === 'Contado') {
        porcentaje = 30; 
      } else if (modalidad === 'Crédito') {
        if (porcentajeCuota >= 5) {
          const maxDesc = 23;
          let inputDesc = parseFloat(formDescuento.descuentoPropiosManual);
          if (isNaN(inputDesc)) inputDesc = maxDesc;
          porcentaje = Math.max(0, Math.min(inputDesc, maxDesc));
        } else if (porcentajeCuota >= 1.5) {
          const maxDesc = 20;
          let inputDesc = parseFloat(formDescuento.descuentoPropiosManual);
          if (isNaN(inputDesc)) inputDesc = maxDesc;
          porcentaje = Math.max(0, Math.min(inputDesc, maxDesc));
        }
      }
      descuentoTotal = vc * (porcentaje / 100);
      descuentoTexto = porcentaje > 0 ? `${porcentaje}%` : '0%';
    }

    const nuevoPrecioTotal = vc - descuentoTotal;
    const nuevoPrecioM2 = m2Num > 0 ? nuevoPrecioTotal / m2Num : 0;

    return { vc, descuentoTotal, descuentoTexto, nuevoPrecioTotal, nuevoPrecioM2, porcentajeCuota, montoCuotaNum };
  };

  const calcularBeneficioRecompra = () => {
    const p = String(formRecompra.proyecto).toUpperCase();
    if (p.includes('MUYURINA')) return 200;
    if (p.includes('RANCHO NUEVO')) return 50;
    return 100;
  };

  const calcularSimulacionAmortizacion = () => {
    const PV = parseFloat(formAmortizacion.precioContrato?.toString().replace(/,/g, '')) || 0;
    const CI = parseFloat(formAmortizacion.cuotaInicial?.toString().replace(/,/g, '')) || 0;
    const t = parseFloat(formAmortizacion.plazoOriginal) || 0;
    const p = parseFloat(formAmortizacion.cuotasPagadas) || 0;
    const S = parseFloat(formAmortizacion.seguroMensual?.toString().replace(/,/g, '')) || 0;
    const r_anual = parseFloat(formAmortizacion.tasaAnual?.toString().replace(/,/g, '')) || 0;
    const A = parseFloat(formAmortizacion.montoAmortizacion?.toString().replace(/,/g, '')) || 0;

    const n = t * 12;
    const r_mensual = r_anual / 100 / 12;
    const P = Math.max(0, PV - CI); // Capital Financiado

    let C_pura = 0;
    if (r_mensual > 0 && n > 0) {
      C_pura = P * (r_mensual * Math.pow(1 + r_mensual, n)) / (Math.pow(1 + r_mensual, n) - 1);
    } else if (n > 0) {
      C_pura = P / n;
    }
    
    const C_total = C_pura + S;
    const precioFinalPlazos = CI + (C_total * n);
    
    let P_actual = 0;
    if (r_mensual > 0 && n > 0 && p > 0) {
      P_actual = P * (Math.pow(1 + r_mensual, n) - Math.pow(1 + r_mensual, p)) / (Math.pow(1 + r_mensual, n) - 1);
    } else if (n > 0) {
      P_actual = Math.max(0, P - (C_pura * p));
    } else {
      P_actual = P;
    }

    const cuotasRestantesOrig = Math.max(0, n - p);
    const saldoNuevo = Math.max(0, P_actual - A);

    let n_new = 0;
    let error = "";
    if (r_mensual > 0 && C_pura > 0 && saldoNuevo > 0) {
      const term = 1 - (saldoNuevo * r_mensual) / C_pura;
      if (term <= 0) {
        error = "La amortización no cubre los intereses.";
        n_new = cuotasRestantesOrig;
      } else {
        n_new = -Math.log(term) / Math.log(1 + r_mensual);
      }
    } else if (C_pura > 0) {
      n_new = saldoNuevo / C_pura;
    }

    n_new = Math.ceil(n_new - 0.0001); // CORRECCIÓN PRECISIÓN DECIMAL PARA MESES EXACTOS
    if(n_new < 0) n_new = 0;

    const tiempoAhorrado = Math.max(0, cuotasRestantesOrig - n_new);
    
    const intsOrig = Math.max(0, (C_pura * cuotasRestantesOrig) - P_actual);
    const intsNew = Math.max(0, (C_pura * n_new) - saldoNuevo);
    const ahorrado = Math.max(0, intsOrig - intsNew);

    return {
      P, C_pura, S, C_total, precioFinalPlazos, P_actual, 
      cuotasRestantesOrig, saldoNuevo, n_new, tiempoAhorrado, ahorrado, n, error
    };
  };

  const obtenerDatosSupervisor = () => {
    const supervisorSeleccionado = SUPERVISORES.find(s => s.correo === supervisorDestino) || SUPERVISORES[0];
    return {
      saludo: supervisorSeleccionado.genero === 'F' ? 'Estimada' : 'Estimado',
      titulo: supervisorSeleccionado.titulo,
      nombrePila: supervisorSeleccionado.nombre.split(' ')[0] 
    };
  };

  // Lógica para Seguimiento de Ventas
  const asesoresEquipoActual = formProyeccion.asesores || [];
  const asesoresSeguimiento = useMemo(() => {
    return [...asesoresEquipoActual].sort((a, b) => (Number(b.colAct) || 0) - (Number(a.colAct) || 0));
  }, [asesoresEquipoActual]);

  const statsSeguimiento = useMemo(() => {
    let totales = { asesores: 0, antiguos: 0, nuevos: 0, externos: 0, productivos: 0 };
    asesoresSeguimiento.forEach(a => {
      totales.asesores++;
      if (a.tipo === 'Interno') totales.antiguos++;
      else if (a.tipo === 'Aprendizaje') totales.nuevos++;
      else if (a.tipo === 'Externo') totales.externos++;
      if (Number(a.colAct) >= 25000) totales.productivos++;
    });
    const prodPercent = totales.asesores > 0 ? Math.round((totales.productivos / totales.asesores) * 100) : 0;
    return { ...totales, prodPercent };
  }, [asesoresSeguimiento]);


  // --- GENERADORES DE TEXTOS PLANOS PARA CELULAR ---
  
  const generarTextoRecompraCelular = () => {
    const beneficio = calcularBeneficioRecompra();
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    return `👋 ${obtenerSaludoTiempo()}\n${saludo} ${nombrePila},\n\nPor favor su ayuda con el código de pago por recompra de este cliente:\n\n*🆕 CONTRATO NUEVO*\n🏢 Agencia: ${formRecompra.sucursal || '-'}\n📅 Venta: ${formRecompra.fechaVentaNuevo || '-'}\n👤 Nombre: ${formRecompra.nombreNuevo || '-'}\n📄 Contrato: ${formRecompra.contratoNuevo || '-'}\n🏷️ Aplicó Descuento: ${formRecompra.aplicoDescuento}\n💵 Cuotas Pagadas: ${formRecompra.cuotasPagadas}\n✅ Procesado: ${formRecompra.procesadoNuevo}\n🟢 Vigente: ${formRecompra.vigenteNuevo}\n\n*🕰️ CONTRATO ANTIGUO*\n👤 Nombre: ${formRecompra.nombreAntiguo || '-'}\n📄 Contrato: ${formRecompra.contratoAntiguo || '-'}\n📅 Venta: ${formRecompra.fechaVentaAntiguo || '-'}\n💰 Fecha Pago: ${formRecompra.fechaPago || '-'}\n✅ Procesado: ${formRecompra.procesadoAntiguo}\n🟢 Vigente: ${formRecompra.vigenteAntiguo}\n🤝 Patrocinador: ${formRecompra.patrocinador || '-'}\n\n*💵 VALOR CUOTA: $ ${formRecompra.valorCuota || '0'}*\n*🎁 BENEFICIO: $ ${beneficio}*\n\nSaludos cordiales,\n*${formRecompra.asesor || 'Asesor'}*`;
  };

  const generarTextoDescuentoCelular = () => {
    const { vc, descuentoTotal, descuentoTexto, nuevoPrecioTotal, nuevoPrecioM2, porcentajeCuota } = calcularDescuento();
    const { saludo, titulo } = obtenerDatosSupervisor();
    const nomProyecto = formDescuento.proyecto === 'OTRO...' ? (formDescuento.proyectoManual || 'PROYECTO MANUAL') : formDescuento.proyecto;
    let condicionTexto = formDescuento.modalidad === 'Crédito' ? `con cuota inicial del ${formatCurrency(porcentajeCuota)}% venta a plazos` : `venta al contado`;
    const catStr = formDescuento.categoria ? String(formDescuento.categoria).toUpperCase() : '';
    
    const requiereAutorizacion = formDescuento.modalidad === 'Crédito' && porcentajeCuota >= 1.5 && porcentajeCuota < 5;
    const badgeText = requiereAutorizacion ? `\n🚨 *REQUIERE AUTORIZACIÓN: Bajada de Cuota Inicial al 1.5% (Categoría Calle)*\n` : '';

    return `👋 ${obtenerSaludoTiempo()}\n${saludo} ${titulo},${badgeText}\nPor favor le solicito la aplicación del descuento de la campaña vigente del proyecto *${nomProyecto}*:\n\n*📌 DATOS DEL LOTE*\n📐 Superficie: ${formDescuento.m2 || '0'} m²\n💵 Precio M2 Normal: $ ${formatCurrency(formDescuento.precioM2 || 0)}\n💰 *Precio Original: $ ${formatCurrency(vc)}*\n\n*🏷️ APLICACIÓN DE CAMPAÑA*\n✅ Condición: ${descuentoTexto} ${condicionTexto}\n🔥 *Descuento Total: -$ ${formatCurrency(descuentoTotal)}*\n\n*✨ PRECIO FINAL PROMOCIÓN ✨*\n➡️ *Precio Final: $ ${formatCurrency(nuevoPrecioTotal)}*\n➡️ *Precio M2 Final: $ ${formatCurrency(nuevoPrecioM2)}*\n\n*📍 UBICACIÓN*\nUV: ${formDescuento.uv || 'SN'} | MZN: ${formDescuento.manzano || '---'} | LT: ${formDescuento.lote || '---'}\n${catStr ? `🏢 Categoría: ${catStr}\n` : ''}\nQuedo atento a su aprobación para continuar con el proceso de venta.\n\nSaludos cordiales,\n*${formDescuento.asesor || 'Nombre del Asesor'}*`;
  };

  const generarTextoCuotaCelular = () => {
    const { saludo, titulo } = obtenerDatosSupervisor();
    return `👋 ${obtenerSaludoTiempo()}\n${saludo} ${titulo},\n\nPor favor su autorización para proceder con la anulación y reingreso del siguiente contrato para incrementar su cuota inicial:\n\n*👤 DATOS DEL CLIENTE*\n👤 Cliente: ${formCuota.cliente || '---'}\n📄 Nro. Contrato: ${formCuota.nroContrato || '---'}\n🪪 CI: ${formCuota.ci || '---'}\n📍 Ubicación: ${formCuota.proyecto} | UV ${formCuota.uv || '-'} | MZN ${formCuota.manzano || '-'} | LOTE ${formCuota.lote || '-'}\n\n*💰 INCREMENTO*\n📉 Cuota Registrada: $ ${formatCurrency(formCuota.cuotaInicial || 0)}\n📈 *NUEVA CUOTA: $ ${formatCurrency(formCuota.nuevaCuota || 0)}*\n\n*📝 OBSERVACIONES*\n${formCuota.motivo || '---'}\n\nQuedo atento a su aprobación.\n\nSaludos,\n*${formCuota.asesorVentas || 'Asesor'}*`;
  };

  const generarTextoSeguroCelular = () => {
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    const cant = formSeguro.beneficiarios.length;
    let lista = "";
    formSeguro.beneficiarios.forEach((b, i) => {
      lista += `\n*Beneficiario ${i+1}:*\n👤 Nombre: ${b.nombre || '---'}\n👥 Parentesco: ${b.parentesco || '---'}\n📊 Porcentaje: ${b.porcentaje ? b.porcentaje + '%' : '---'}\n🪪 CI: ${b.ci || '---'}\n`;
    });

    return `👋 ${obtenerSaludoTiempo()}\n${saludo} ${nombrePila},\n\nPor favor tu ayuda adicionando a estos ${cant} beneficiarios al seguro de vida:\n\n*📄 DATOS DEL CONTRATO*\n👤 Cliente: ${formSeguro.cliente || '---'}\n📑 Contrato: ${formSeguro.nroContrato || '---'}\n📍 UV: ${formSeguro.uv || 'SN'} | MZN: ${formSeguro.manzano || 'SN'} | LOTE: ${formSeguro.lote || 'SN'}\n\n*📋 LISTA DE BENEFICIARIOS*${lista}\nMuchísimas gracias.\n\nSaludos,\n*${formSeguro.asesor || 'Asesor'}*`;
  };
  
  const generarTextoFisicoCelular = () => {
    const { saludo, titulo } = obtenerDatosSupervisor();
    return `👋 ${obtenerSaludoTiempo()}\n${saludo} ${titulo},\n\nSolicito el cambio de contrato digital a físico para el siguiente cliente:\n\n*👤 DATOS DEL CLIENTE*\n👤 Nombre: ${formFisico.nombre || '---'}\n🪪 CI: ${formFisico.ci || '---'}\n📄 Contrato: ${formFisico.contrato || '---'}\n\n*📝 MOTIVO*\n${formFisico.motivo || '---'}\n\nQuedo atento a la confirmación.\n\nSaludos,\n*${formFisico.asesor || 'Asesor'}*`;
  };

  const generarTextoReenvioCelular = () => {
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    let lista = "";
    formReenvio.contratos.forEach((c, i) => {
      lista += `\n*Contrato ${i+1}:*\n📄 Nro: ${c.nroContrato || '---'}\n👤 Cliente: ${c.cliente || '---'}\n🪪 CI: ${c.ci || '---'}\n📍 UV: ${c.uv || 'SN'} | MZN: ${c.manzano || '-'} | LT: ${c.lote || '-'}\n`;
    });

    return `👋 ${obtenerSaludoTiempo()}\n${saludo} ${nombrePila},\n\nSolicito tu apoyo habilitando nuevamente el envío del correo para la firma digital del proyecto *${formReenvio.proyecto.toUpperCase()}* debido a un error involuntario del cliente.\n\n*📋 CONTRATOS AFECTADOS:*${lista}\nQuedo atento a tu confirmación.\n\nSaludos,\n*${formReenvio.asesor || 'Asesor'}*`;
  };

  const generarTextoLlamadaCelular = () => {
    return `👋 ${obtenerSaludoTiempo()}\nEstimada Olivia,\n\nPor favor su ayuda con la validación de llamada de este cliente referido, solicita que lo llamen a las *${formLlamada.horaLlamada || '[HORA]'}*:\n\n*🗣️ REFERIDO*\n👤 Nombre: ${formLlamada.nombreReferido || '---'}\n📄 Contrato: ${formLlamada.contratoReferido || '---'}\n📱 Celular: ${formLlamada.celularReferido || '---'}\n\n*🎁 BENEFICIARIA*\n👤 Nombre: ${formLlamada.nombreBeneficiario || '---'}\n🪪 CI: ${formLlamada.ciBeneficiario || '---'}\n\nSaludos cordiales,\n*${formLlamada.asesor || 'Asesor'}*`;
  };

  const generarTextoProyeccionCelular = () => {
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    let texto = `👋 ${obtenerSaludoTiempo()}\n${saludo} ${nombrePila},\n\nAdjunto el resumen del consolidado de proyección de ventas semanal del equipo.\n\n`;
    
    let sumColAct = 0;
    let sumTotalColMes = 0;

    if (formProyeccion && Array.isArray(formProyeccion.asesores)) {
      formProyeccion.asesores.forEach((asesor, i) => {
        const sumDias = Array.isArray(asesor.dias) ? asesor.dias.reduce((a, b) => a + (Number(b) || 0), 0) : 0;
        const colActualNum = Number(asesor.colAct) || 0;
        const totalColMes = colActualNum + sumDias;
        sumColAct += colActualNum;
        sumTotalColMes += totalColMes;
        
        if (colActualNum > 0 || sumDias > 0) {
          texto += `*${i+1}. ${asesor.nombre || ''}*\n`;
          texto += `   📈 Colocación Actual: $ ${formatCurrency(colActualNum)}\n`;
          texto += `   🎯 Proyección Semanal: $ ${formatCurrency(sumDias)}\n`;
          texto += `   🏁 Cierre de Mes: $ ${formatCurrency(totalColMes)}\n\n`;
        }
      });
    }

    const mesStr = new Date(formProyeccion.fechaInicio || new Date()).toLocaleString('es-ES', { month: 'long' });
    const capMes = mesStr.charAt(0).toUpperCase() + mesStr.slice(1);
    const objMensual = Number(formProyeccion.objetivoMensual) || 0;
    const porcentajeAvance = objMensual ? (sumColAct / objMensual) * 100 : 0;
    const porcentajeFin = objMensual ? (sumTotalColMes / objMensual) * 100 : 0;

    texto += `*📊 RESUMEN DEL EQUIPO*\n`;
    texto += `🎯 Objetivo ${capMes}: $ ${formatCurrency(objMensual)}\n`;
    texto += `📈 Colocación Actual: $ ${formatCurrency(sumColAct)} (${formatCurrency(porcentajeAvance)}%)\n`;
    texto += `🏁 Colocación Fin de Mes: $ ${formatCurrency(sumTotalColMes)} (${formatCurrency(porcentajeFin)}%)\n\n`;
    texto += `Saludos cordiales.`;

    return texto;
  };

  const generarTextoRenunciaCelular = () => {
    return `👋 ${obtenerSaludoTiempo()} estimado Ulrich,\n\nPor medio del presente, te hago entrega formal de la carta de renuncia de la Sra./Sr. *${formRenuncia.nombre || '[Nombre]'}*, quien se desempeñaba como *${formRenuncia.cargo || 'Asesor de Ventas'}* desde el pasado ${formRenuncia.fechaIngreso || '[Fecha]'}.\n\nEn su nota, con fecha ${formRenuncia.fechaRenuncia || '[Fecha]'}, la/el asesor/a comunica que su retiro se debe a ${formRenuncia.motivo || '[motivos...]'}. Adjunto el documento escaneado para que se proceda con el trámite correspondiente en el departamento de Recursos Humanos.\n\nQuedo atento a cualquier requerimiento adicional para cerrar este proceso.\n\nSaludos cordiales,\n*${formRenuncia.asesor || 'Oscar Saravia'}*`;
  };

  const generarTextoAltaCRMCelular = () => {
    return `👋 ${obtenerSaludoTiempo()}\nEstimado Ulrich,\n\nPor medio de la presente, solicito por favor la gestión para la creación del usuario de acceso a los sistemas *CRM y CESI* para el nuevo asesor comercial que se están integrando a mi equipo.\n\nA continuación, detallo los datos personales requeridos de cada uno, basados en sus fichas de ingreso:\n\n*Nombre:* ${formAltaCRM.nombre || '-'}\n*Apellido Paterno:* ${formAltaCRM.apPaterno || '-'}\n*Apellido Materno:* ${formAltaCRM.apMaterno || '-'}\n*Carnet de Identidad:* ${formAltaCRM.ci || '-'}\n*Fecha de Nacimiento:* ${formAltaCRM.fechaNacimiento || '-'}\n*Correo Electrónico:* ${formAltaCRM.correo || '-'}\n\nQuedo atento a la confirmación de las credenciales para poder facilitarle el acceso y que inicie sus gestiones lo antes posible.\nDe antemano, muchas gracias por tu colaboración.\n\nSaludos cordiales,\n*${formAltaCRM.asesor || 'Oscar Saravia'}*`;
  };

  const generarTextoEvaluacionCelular = () => {
    return `👋 ${obtenerSaludoTiempo()}.\nEstimado Ulrich,\n\nEn respuesta a tu correo, adjunto el formulario de evaluación de desempeño debidamente completado del asesor de la sucursal Montero que acaba de finalizar su programa de aprendizaje.\n\nA continuación, comparto un resumen detallado de las observaciones y mis recomendaciones:\n\n*1. ${formEvaluacion.nombre || '[Nombre]'}*\n- *Punteo Total:* ${formEvaluacion.punteo || '0'} (${formEvaluacion.calificacion || 'Muy Bueno'})\n- *Resultados:* ${formEvaluacion.lotes || '0'} lotes vendidos ($${formatCurrency(formEvaluacion.monto)}), ${formEvaluacion.leads || '0'} leads y ${formEvaluacion.visitas || '0'} visitas.\n- *Observaciones y recomendación:* ${formEvaluacion.observaciones || '[Detalles]'}\n\nQuedo a su disposición ante cualquier consulta.\n\nSaludos cordiales,\n*${formEvaluacion.asesor || 'Oscar Hugo Saravia'}*`;
  };

  const generarTextoPostulanteCelular = () => {
    return `👋 ${obtenerSaludoTiempo()}\nEstimado Ulrich,\n\nTe adjunto el formulario de entrevista de *${formPostulante.nombre || '[Nombre]'}* para el puesto de Asesor de Ventas. Él llega a nosotros como referido de la asesora ${formPostulante.referidor || '[Nombre]'}.\n\nDespués de realizarle la entrevista y evaluar su perfil, mi recomendación es que proceda. Me gustaría que lo puedan tomar en cuenta para pasarlo a la etapa de capacitación y así poder ir preparándolo para que se integre a la Máquina de Ventas aquí en la sucursal de Montero.\n\nEn el documento adjunto podrás ver el detalle completo de su experiencia, evaluación de competencias y el role play.\n\nCualquier consulta me avisas.\n\nSaludos cordiales,\n*${formPostulante.asesor || 'Oscar Saravia'}*`;
  };

  const generarTextoAmortizacionCelular = () => {
    const { P, C_pura, n, S, C_total, precioFinalPlazos, P_actual, cuotasRestantesOrig, saldoNuevo, n_new, tiempoAhorrado, ahorrado, error } = calcularSimulacionAmortizacion();
    if (error) return `⚠️ Error en simulación: ${error}`;
    
    const clienteStr = formAmortizacion.cliente ? `Estimado/a ${formAmortizacion.cliente},` : `Estimado/a cliente,`;
    return `👋 Buenas tardes,\n${clienteStr} te presento la simulación de tu abono extraordinario a capital (Sistema Francés):\n\n*📝 DATOS DEL CRÉDITO ORIGINAL*\nPrecio al Contado: $ ${formatCurrency(formAmortizacion.precioContrato)}\nCuota Inicial: $ ${formatCurrency(formAmortizacion.cuotaInicial)}\nCapital Financiado: $ ${formatCurrency(P)}\nPlazo Original: ${formAmortizacion.plazoOriginal || 0} años (${n} meses)\nPrecio Final a Plazos: $ ${formatCurrency(precioFinalPlazos)}\nCuota Mensual Fija (Pura): $ ${formatCurrency(C_pura)}\n\n*📊 SITUACIÓN ACTUAL*\nCuotas Pagadas: ${formAmortizacion.cuotasPagadas || 0} meses\nCuotas Restantes: ${cuotasRestantesOrig} meses\nSaldo Capital Actual: $ ${formatCurrency(P_actual)}\n\n*🚀 IMPACTO DE TU ABONO (De $ ${formatCurrency(formAmortizacion.montoAmortizacion)})*\nNuevo Saldo Capital: $ ${formatCurrency(saldoNuevo)}\nNuevas Cuotas Restantes: ${n_new} meses\nTiempo Ahorrado: ${tiempoAhorrado} meses\nAhorro Estimado: $ ${formatCurrency(ahorrado)}\n\nSi deseas proceder con este pago o tienes alguna duda, quedo a tu disposición.\n\nSaludos cordiales.`;
  };

  // --- GENERADORES HTML PARA PC ---
  
  const generarHtmlRecompra = () => {
    const beneficio = calcularBeneficioRecompra();
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    return `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 1200px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()},</p>
      <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">${saludo} ${nombrePila} por favor su ayuda con el c&oacute;digo de pago por recompra de este cliente, le toca pagar su cuota el <strong>${formRecompra.fechaPago || '[FECHA PAGO]'}</strong> muchas gracias de antemano:</p>
      
      <div style="overflow-x: auto; padding-bottom: 10px; width: 100%; max-width: 100%;">
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; text-align: center; width: 100%; min-width: 1200px; border: 1px solid #000000; background-color: #ffffff;">
          <thead>
            <tr>
              <th colspan="8" style="background-color: #ffc000; border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000"><b>CONTRATO NUEVO</b></font></span></th>
              <th colspan="7" style="background-color: #ed7d31; border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000"><b>CONTRATO ANTIGUO</b></font></span></th>
              <th rowspan="2" style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000"><b>VALOR DE<br>CUOTA $</b></font></span></th>
              <th rowspan="2" style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000"><b>BENEFICIO $</b></font></span></th>
            </tr>
            <tr>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000"><b>Agencia</b></font></span></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Fecha de<br>venta</b></font></span></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; min-width: 150px;"><span style="color: #000000;"><font color="#000000"><b>Nombre</b></font></span></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Contrato</b></font></span></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Se aplico<br>descuento<br>por metro ?</b></font></span></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Cant. De<br>cuotas ya<br>pagadas</b></font></span></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>¿Procesado?</b></font></span></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>¿Vigente?</b></font></span></th>

              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; min-width: 150px;"><span style="color: #000000;"><font color="#000000"><b>Nombre</b></font></span></th>
              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Contrato</b></font></span></th>
              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Fecha de<br>venta</b></font></span></th>
              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>Fecha Pago</b></font></span></th>
              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>¿Procesado?</b></font></span></th>
              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000"><b>¿Vigente?</b></font></span></th>
              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; min-width: 120px;"><span style="color: #000000;"><font color="#000000"><b>Patrocinador</b></font></span></th>
            </tr>
          </thead>
          <tbody>
            <tr style="background-color: #ffffff;">
              <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase;"><span style="color: #000000;"><font color="#000000">${formRecompra.sucursal || ''}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000">${formRecompra.fechaVentaNuevo || ''}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase;"><span style="color: #000000;"><font color="#000000">${formRecompra.nombreNuevo || ''}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase; white-space: nowrap;"><span style="color: #000000;"><font color="#000000">${formRecompra.contratoNuevo || ''}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.aplicoDescuento || 'NO'}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.cuotasPagadas || '0'}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.procesadoNuevo || 'SI'}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.vigenteNuevo || 'SI'}</font></span></td>
              
              <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase;"><span style="color: #000000;"><font color="#000000">${formRecompra.nombreAntiguo || ''}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase; white-space: nowrap;"><span style="color: #000000;"><font color="#000000">${formRecompra.contratoAntiguo || ''}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000">${formRecompra.fechaVentaAntiguo || ''}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px; white-space: nowrap;"><span style="color: #000000;"><font color="#000000">${formRecompra.fechaPago || ''}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.procesadoAntiguo || 'SI'}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.vigenteAntiguo || 'SI'}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase;"><span style="color: #000000;"><font color="#000000">${formRecompra.patrocinador || ''}</font></span></td>
              
              <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000">${formRecompra.valorCuota || ''}</font></span></td>
              <td style="border: 1px solid #000000; padding: 6px;"><span style="color: #000000;"><font color="#000000"><b>${beneficio}</b></font></span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style="margin-top: 25px; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formRecompra.asesor || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarHtmlProyeccion = () => {
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    let filasAsesoresHtml = "";
    
    let sumColAct = 0;
    let sumProyA = [0,0,0,0,0];
    let sumTotalProySemanal = 0;
    let sumTotalColMes = 0;

    if (formProyeccion && Array.isArray(formProyeccion.asesores)) {
      formProyeccion.asesores.forEach((asesor, i) => {
        const sumDias = Array.isArray(asesor.dias) ? asesor.dias.reduce((a, b) => a + (Number(b) || 0), 0) : 0;
        const colActNum = Number(asesor.colAct) || 0;
        const totalColMes = colActNum + sumDias;
        
        sumColAct += colActNum;
        if (Array.isArray(asesor.proy)) {
          asesor.proy.forEach((val, idx) => {
            if (sumProyA[idx] !== undefined) {
               sumProyA[idx] += (Number(val) || 0);
            }
          });
        }
        sumTotalProySemanal += sumDias;
        sumTotalColMes += totalColMes;

        const isProductivo = totalColMes >= 25000;
        const rowBgStyle = isProductivo ? 'background-color: #ecfdf5;' : 'background-color: #ffffff;';
        const textColor = isProductivo ? '#059669' : '#0f172a';

        filasAsesoresHtml += `
          <tr style="${rowBgStyle}">
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b;">${i+1}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: left; color: #0f172a; font-weight: bold; white-space: nowrap;">${String(asesor.nombre || '')}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #334155;">${formatVacio(colActNum)}</td>
            ${Array.isArray(asesor.dias) ? asesor.dias.map(d => `<td style="padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 1px solid #f1f5f9; text-align: center; color: #475569;">${formatDias(Number(d)||0)}</td>`).join('') : ''}
            ${Array.isArray(asesor.proy) ? asesor.proy.map(p => `<td style="padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 1px solid #f0f9ff; text-align: center; color: #0369a1; font-weight: bold;">${formatDias(Number(p)||0)}</td>`).join('') : ''}
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 1px solid #e2e8f0; text-align: right; color: #334155; font-weight: bold;">${formatVacio(sumDias)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: ${textColor};">${formatVacio(totalColMes)}${isProductivo ? ' &#10004;' : ''}</td>
          </tr>
        `;
      });
    }

    const mesStr = new Date(formProyeccion.fechaInicio || new Date()).toLocaleString('es-ES', { month: 'long' });
    const capMes = mesStr.charAt(0).toUpperCase() + mesStr.slice(1);
    const objMensual = Number(formProyeccion.objetivoMensual) || 0;
    const porcentajeAvance = objMensual ? (sumColAct / objMensual) * 100 : 0;
    const porcentajeFin = objMensual ? (sumTotalColMes / objMensual) * 100 : 0;

    return `
    <div style="background-color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #334155; line-height: 1.6; max-width: 1200px; text-align: left;">
      <p style="color: #0f172a; font-size: 16px;"><b>${obtenerSaludoTiempo()} ${saludo} ${nombrePila},</b></p>
      <p style="color: #334155;">Adjunto el consolidado de proyecci&oacute;n de ventas semanal del equipo. A continuaci&oacute;n el detalle actualizado:</p>
      
      <div style="overflow-x: auto; width: 100%; max-width: 100%;">
      <table border="0" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; margin-top: 15px; width: 100%; min-width: 900px; text-align: left; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <thead>
          <tr>
            <th colspan="3" style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 10px; text-align: left; color: #0f172a; font-size: 13px;"><b>Equipo: ${String(formProyeccion.equipo || '')}</b></th>
            <th colspan="7" style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; border-left: 1px solid #e2e8f0; padding: 10px; text-align: center; color: #334155; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;"><b>Ventas Diarias</b></th>
            <th colspan="5" style="background-color: #eff6ff; border-bottom: 2px solid #bae6fd; border-left: 1px solid #e2e8f0; padding: 10px; text-align: center; color: #0369a1; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;"><b>Proyectos</b></th>
            <th rowspan="2" style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; border-left: 1px solid #e2e8f0; padding: 10px; text-align: right; color: #334155; vertical-align: bottom;"><b>Total<br>Proy. Semanal</b></th>
            <th rowspan="2" style="background-color: #f0fdf4; border-bottom: 2px solid #6ee7b7; border-left: 1px solid #e2e8f0; padding: 10px; text-align: right; color: #065f46; vertical-align: bottom;"><b>Cierre Mes<br>(Meta $25k)</b></th>
          </tr>
          <tr>
            <th style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 8px; color: #64748b; width: 30px; text-align: center;">#</th>
            <th style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 8px; text-align: left; color: #475569; white-space: nowrap;"><b>Asesor</b></th>
            <th style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 8px; text-align: right; color: #475569; white-space: nowrap;"><b>Coloc. Actual</b></th>
            ${[0,1,2,3,4,5,6].map(d => `<th style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; border-left: 1px solid #e2e8f0; padding: 8px; text-align: center; color: #64748b; white-space: nowrap;">${formatDiaMes(formProyeccion.fechaInicio, d)}</th>`).join('')}
            ${NOMBRES_PROYECTOS_PROYECCION.map(p => `<th style="background-color: #eff6ff; border-bottom: 2px solid #bae6fd; border-left: 1px solid #e2e8f0; padding: 8px; text-align: center; color: #0284c7; white-space: nowrap;">${String(p)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${filasAsesoresHtml}
          <tr style="background-color: #f8fafc;">
            <td colspan="3" style="padding: 10px 8px; text-align: right; color: #0f172a; border-top: 2px solid #cbd5e1;"><b>TOTALES GLOBALES</b></td>
            <td colspan="7" style="padding: 10px 8px; border-top: 2px solid #cbd5e1;"></td>
            ${sumProyA.map(p => `<td style="padding: 10px 8px; text-align: center; color: #0284c7; border-top: 2px solid #bae6fd; font-weight: bold;">${p === 0 ? '-' : p}</td>`).join('')}
            <td style="padding: 10px 8px; text-align: right; color: #0f172a; border-top: 2px solid #cbd5e1;"><b>${formatCurrency(sumTotalProySemanal)}</b></td>
            <td style="padding: 10px 8px; text-align: right; color: #059669; border-top: 2px solid #6ee7b7; background-color: #d1fae5; font-size: 14px;"><b>$${formatCurrency(sumTotalColMes)}</b></td>
          </tr>
        </tbody>
      </table>
      </div>

      <table border="0" cellpadding="0" cellspacing="0" style="margin-top: 25px; width: 100%; max-width: 450px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
        <tr>
          <td colspan="2" style="background-color: #0f172a; color: #ffffff; padding: 12px 16px; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
            <span style="color: #ffffff;"><font color="#ffffff">Resumen General - ${capMes} ${new Date().getFullYear()}</font></span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; color: #475569; font-size: 13px; border-bottom: 1px solid #f1f5f9;"><b>Objetivo del Mes</b></td>
          <td style="padding: 12px 16px; text-align: right; color: #0f172a; font-size: 14px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">$${formatCurrency(objMensual)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; color: #475569; font-size: 13px; border-bottom: 1px solid #f1f5f9;"><b>Colocaci&oacute;n Actual</b></td>
          <td style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #f1f5f9;">
            <span style="color: #0f172a; font-size: 14px; font-weight: bold;">$${formatCurrency(sumColAct)}</span>
            <span style="display: inline-block; background-color: #f1f5f9; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-left: 8px; font-weight: bold;">${formatCurrency(porcentajeAvance)}%</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 14px 16px; color: #0f172a; font-size: 14px;"><b>Proyecci&oacute;n Cierre de Mes</b></td>
          <td style="padding: 14px 16px; text-align: right;">
            <span style="color: #059669; font-size: 16px; font-weight: bold;">$${formatCurrency(sumTotalColMes)}</span>
            <span style="display: inline-block; background-color: #d1fae5; color: #065f46; padding: 3px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px; font-weight: bold;">${formatCurrency(porcentajeFin)}%</span>
          </td>
        </tr>
      </table>
      <p style="margin-top: 25px; margin-bottom: 2px; color: #475569;">Saludos cordiales.</p>
    </div>`;
  };

  const generarHtmlLlamada = () => {
    return `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">Estimada Olivia,</p>
      <p style="margin-bottom: 20px; color: #333333;">Por favor su ayuda con la validaci&oacute;n de llamada de este cliente referido, el cliente menciona que tendr&aacute; tiempo de contestar hoy a las <strong>${formLlamada.horaLlamada || '[HORA]'}</strong>, por favor pido la ayuda de tu equipo para que la puedan llamar a esa hora:</p>
      
      <p style="margin-bottom: 5px; color: #555555;">Cliente referido:</p>
      <p style="margin-top: 0; margin-bottom: 15px; font-weight: bold; font-size: 15px; color: #000000;">${formLlamada.nombreReferido || '[NOMBRE REFERIDO]'} - Contrato: ${formLlamada.contratoReferido || '[CONTRATO]'} - Celular: ${formLlamada.celularReferido || '[CELULAR]'}</p>
      
      <p style="margin-bottom: 5px; color: #555555;">Cliente beneficiaria:</p>
      <p style="margin-top: 0; margin-bottom: 25px; font-weight: bold; font-size: 15px; color: #000000;">${formLlamada.nombreBeneficiario || '[NOMBRE BENEFICIARIA]'}, ${formLlamada.ciBeneficiario || '[CI BENEFICIARIA]'}</p>
      
      <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formLlamada.asesor || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarHtmlSeguro = () => {
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    const cant = formSeguro.beneficiarios.length;
    let filas = "";
    formSeguro.beneficiarios.forEach(b => {
      filas += `<tr style="background-color: #ffffff;"><td style="border: 1px solid #cbd5e1; padding: 8px 12px; font-weight: bold;"><span style="color: #000000;"><font color="#000000">${b.nombre || '---'}</font></span></td><td style="border: 1px solid #cbd5e1; padding: 8px 12px;"><span style="color: #000000;"><font color="#000000">${b.parentesco || '---'}</font></span></td><td style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: center;"><span style="color: #000000;"><font color="#000000">${b.porcentaje ? b.porcentaje + '%' : '---'}</font></span></td><td style="border: 1px solid #cbd5e1; padding: 8px 12px;"><span style="color: #000000;"><font color="#000000">${b.ci || '---'}</font></span></td></tr>`;
    });

    return `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 20px; color: #333333;">${saludo} ${nombrePila},</p>
      <p style="margin-bottom: 20px; color: #333333;">Por favor tu ayuda adicionando a estos ${cant} beneficiarios al seguro de vida de esta venta, detallo todo a continuaci&oacute;n:</p>
      
      <p style="margin-bottom: 5px; color: #333333;"><strong>Cliente(s):</strong> ${formSeguro.cliente || '[Nombre del Cliente]'}</p>
      <p style="margin-bottom: 5px; margin-top: 0; color: #333333;"><strong>Nro. Contrato:</strong> ${formSeguro.nroContrato || '[Nro]'}</p>
      <p style="margin-bottom: 20px; margin-top: 0; color: #333333;"><strong>UV:</strong> ${formSeguro.uv || 'SN'} &nbsp;&nbsp;&nbsp;<strong>MZN:</strong> ${formSeguro.manzano || 'SN'} &nbsp;&nbsp;&nbsp;<strong>LOTE:</strong> ${formSeguro.lote || 'SN'}</p>

      <p style="margin-bottom: 10px; font-weight: bold; color: #333333;">Beneficiarios del seguro ${cant} personas:</p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; border: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 13px; margin-bottom: 25px; width: 100%; text-align: left; background-color: #ffffff;">
        <thead><tr style="background-color: #f8fafc;"><th style="border: 1px solid #cbd5e1; padding: 8px 12px;"><span style="color: #0f172a;"><font color="#0f172a"><b>NOMBRE</b></font></span></th><th style="border: 1px solid #cbd5e1; padding: 8px 12px;"><span style="color: #0f172a;"><font color="#0f172a"><b>PARENTESCO</b></font></span></th><th style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: center;"><span style="color: #0f172a;"><font color="#0f172a"><b>%</b></font></span></th><th style="border: 1px solid #cbd5e1; padding: 8px 12px;"><span style="color: #0f172a;"><font color="#0f172a"><b>CI.</b></font></span></th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      
      <p style="margin-bottom: 25px; color: #333333;">Much&iacute;simas gracias de antemano.</p>
      <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formSeguro.asesor || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarHtmlFisico = () => {
    const { saludo, titulo } = obtenerDatosSupervisor();
    return `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">${saludo} ${titulo},</p>
      <p style="margin-bottom: 20px; color: #333333;">Por medio de la presente, solicito el cambio de contrato digital a f&iacute;sico para el siguiente cliente:</p>
      <ul style="margin-bottom: 20px; list-style-type: none; padding-left: 0; color: #333333;">
        <li style="margin-bottom: 5px;">- <strong>Nombre del Cliente:</strong> ${formFisico.nombre || '[Nombre]'}</li>
        <li style="margin-bottom: 5px;">- <strong>N&uacute;mero de Carnet (CI):</strong> ${formFisico.ci || '[CI]'}</li>
        <li style="margin-bottom: 5px;">- <strong>N&uacute;mero de Contrato:</strong> ${formFisico.contrato || '[Nro Contrato]'}</li>
      </ul>
      <p style="margin-bottom: 5px; color: #333333;"><strong>Motivo de la solicitud:</strong></p>
      <p style="margin-bottom: 20px; color: #333333;">${formFisico.motivo || '[Describa el motivo...]'}</p>
      <p style="margin-bottom: 25px; color: #333333;">Quedo atento a la confirmaci&oacute;n.</p>
      <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formFisico.asesor || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarHtmlDescuento = () => {
    const { vc, descuentoTotal, descuentoTexto, nuevoPrecioTotal, nuevoPrecioM2, porcentajeCuota } = calcularDescuento();
    const { saludo, titulo } = obtenerDatosSupervisor();
    const nomProyecto = formDescuento.proyecto === 'OTRO...' ? (formDescuento.proyectoManual || 'PROYECTO MANUAL') : formDescuento.proyecto;
    let condicionTexto = formDescuento.modalidad === 'Crédito' ? `con cuota inicial del ${formatCurrency(porcentajeCuota)}% venta a plazos` : `venta al contado`;

    const requiereAutorizacion = formDescuento.modalidad === 'Crédito' && porcentajeCuota >= 1.5 && porcentajeCuota < 5;
    const badgeHtml = requiereAutorizacion 
       ? `<div style="background-color: #fee2e2; color: #991b1b; padding: 10px 14px; border-radius: 6px; font-size: 13px; font-weight: bold; margin-bottom: 15px; border: 1px solid #f87171;">&#9888; REQUIERE AUTORIZACI&Oacute;N: Bajada de Cuota Inicial al 1.5% (Categor&iacute;a Calle)</div>` 
       : '';

    return `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #1e293b; max-width: 650px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px; color: #1e293b;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 20px; color: #1e293b;">${saludo} ${titulo},</p>
      ${badgeHtml}
      <p style="margin-bottom: 20px; color: #1e293b;">Por favor le solicito mediante el presente correo, la aplicaci&oacute;n del descuento correspondiente a la campa&ntilde;a vigente del proyecto ${nomProyecto}: ${descuentoTexto} ${condicionTexto}:</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-family: Arial, sans-serif; overflow: hidden; text-align: left;">
        <tr><td style="padding: 15px; border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
              <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="color: #334155; font-size: 13px; font-weight: bold; letter-spacing: 1px;">&#128195; RESUMEN DE DESCUENTOS</td><td align="right"><span style="background-color: #d1fae5; color: #047857; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">ACTIVO</span></td></tr></table>
          </td></tr>
        <tr><td style="padding: 15px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td width="31%" align="center" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
                   <div style="font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase;">Superficie</div>
                   <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 6px;">${formDescuento.m2 || '0'} <span style="font-size: 12px; font-weight: normal; color: #64748b;">m&sup2;</span></div>
                </td><td width="3%"></td>
                <td width="31%" align="center" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
                   <div style="font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase;">Precio M2</div>
                   <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 6px;">$${formatCurrency(formDescuento.precioM2 || 0)}</div>
                </td><td width="3%"></td>
                <td width="32%" align="center" style="background-color: #f4f7ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 12px;">
                   <div style="font-size: 10px; color: #2563eb; font-weight: bold; text-transform: uppercase;">Precio Original</div>
                   <div style="font-size: 16px; font-weight: bold; color: #1d4ed8; margin-top: 6px;">$${formatCurrency(vc)}</div>
                </td>
              </tr></table>
          </td></tr>
        <tr><td style="padding: 0 15px 15px 15px;">
             <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
                <tr><td style="padding: 14px; border-bottom: 1px dashed #e2e8f0; font-size: 13px; color: #475569;">Condici&oacute;n (${nomProyecto})</td>
                   <td align="right" style="padding: 14px; border-bottom: 1px dashed #e2e8f0;"><span style="background-color: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-right: 12px;">${descuentoTexto || '0'}</span><strong style="font-size: 14px; color: #0f172a;">-$${formatCurrency(descuentoTotal)}</strong></td></tr>
                <tr><td style="padding: 14px; border-bottom: 1px dashed #e2e8f0; font-size: 13px; color: #475569;">Total Valor Contrato (VC)</td>
                   <td align="right" style="padding: 14px; border-bottom: 1px dashed #e2e8f0; font-size: 14px; font-weight: bold; color: #0f172a;">$${formatCurrency(vc)}</td></tr>
                <tr><td style="padding: 14px; border-bottom: 1px dashed #e2e8f0; font-size: 13px; color: #475569;">Total Descuento Campa&ntilde;as</td>
                   <td align="right" style="padding: 14px; border-bottom: 1px dashed #e2e8f0; font-size: 14px; font-weight: bold; color: #059669;">-$${formatCurrency(descuentoTotal)}</td></tr>
                <tr><td style="padding: 18px 14px; font-size: 15px; font-weight: bold; color: #0f172a;">Nuevo Precio Promoci&oacute;n</td>
                   <td align="right" style="padding: 18px 14px; font-size: 18px; font-weight: bold; color: #2563eb;">$${formatCurrency(nuevoPrecioTotal)}</td></tr>
             </table>
          </td></tr>
        <tr><td style="padding: 0 15px 15px 15px;">
             <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 8px;">
                <tr><td style="padding: 20px 20px 10px 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;"><span style="color: #cbd5e1;"><font color="#cbd5e1">Precio M2 a Aplicar</font></span></td>
                   <td align="right" style="padding: 20px 20px 10px 20px; font-size: 26px; font-weight: bold;"><span style="color: #34d399;"><font color="#34d399">$${formatCurrency(nuevoPrecioM2)}</font></span></td></tr>
                <tr><td colspan="2" style="padding: 0 20px 20px 20px;">
                      <div style="background-color: #1e293b; padding: 10px; border-radius: 6px; text-align: center; font-size: 11px; font-family: monospace; color: #94a3b8; letter-spacing: 1px;">
                         UV <strong style="color: #ffffff;">${formDescuento.uv || 'SN'}</strong> &nbsp;&bull;&nbsp; MZN <strong style="color: #ffffff;">${formDescuento.manzano || '-'}</strong> &nbsp;&bull;&nbsp; LT <strong style="color: #ffffff;">${formDescuento.lote || '-'}</strong>
                         ${formDescuento.categoria ? `<br><span style="color: #38bdf8; display: inline-block; margin-top: 6px; font-weight: bold;">CATEGORÍA: ${String(formDescuento.categoria).toUpperCase()}</span>` : ''}
                      </div>
                   </td></tr>
             </table>
          </td></tr>
      </table>
      <p style="margin-top: 25px; margin-bottom: 5px; color: #1e293b;">Quedo atento a su aprobaci&oacute;n para continuar con el proceso del cierre de la venta.</p>
      <p style="margin-top: 0; margin-bottom: 2px; color: #1e293b;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #0f172a;">${formDescuento.asesor || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarHtmlCuota = () => {
    const { saludo, titulo } = obtenerDatosSupervisor();
    return `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">${saludo} ${titulo},</p>
      <p style="margin-bottom: 20px; color: #333333;">Por favor su autorizaci&oacute;n para proceder con la anulaci&oacute;n del contrato actual del cliente <strong>${formCuota.cliente || '[Nombre del Cliente]'}</strong> y realizar un reingreso. El motivo de esta gesti&oacute;n es que el cliente desea incrementar significativamente su cuota inicial para reducir sus pagos mensuales.</p>
      <p style="margin-bottom: 10px; color: #333333;">A continuaci&oacute;n, detallo los datos de la operaci&oacute;n actual en sistema:</p>
      <ul style="margin-bottom: 20px; list-style-type: none; padding-left: 0; color: #333333;">
        <li style="margin-bottom: 5px;">- <strong>Nro. Contrato:</strong> ${formCuota.nroContrato || '[Nro]'}</li>
        <li style="margin-bottom: 5px;">- <strong>Carnet (CI):</strong> ${formCuota.ci || '[CI]'}</li>
        <li style="margin-bottom: 5px;">- <strong>Ubicaci&oacute;n:</strong> Proyecto ${formCuota.proyecto} | UV ${formCuota.uv || '[X]'} | MZN ${formCuota.manzano || '[X]'} | LOTE ${formCuota.lote || '[X]'}</li>
      </ul>
      <p style="margin-bottom: 5px; color: #333333;"><strong>Motivos del Reingreso / Observaciones:</strong></p>
      <p style="margin-bottom: 20px; color: #333333;">${formCuota.motivo || '[Detalle el motivo del incremento...]'}</p>
      <p style="margin-bottom: 25px; color: #333333;">Quedo atento a su aprobaci&oacute;n para proceder.</p>
      <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formCuota.asesorVentas || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarHtmlReenvio = () => {
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    let filas = "";
    formReenvio.contratos.forEach(c => {
      filas += `<tr style="background-color: #ffffff;"><td style="border: 1px solid #333333; padding: 6px 8px; font-weight: bold;"><span style="color: #000000;"><font color="#000000">${c.nroContrato || '---'}</font></span></td><td style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000">${c.cliente || '---'}</font></span></td><td style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000">${c.ci || '---'}</font></span></td><td style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000">UV: ${c.uv || 'SN'} - Mzn: ${c.manzano || '-'} - Lote: ${c.lote || '-'}</font></span></td></tr>`;
    });
    const esMultiple = formReenvio.contratos.length > 1;
    return `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">${saludo} ${nombrePila},</p>
      <p style="margin-bottom: 20px; color: #333333;">Te escribo para solicitar tu apoyo habilitando nuevamente el env&iacute;o del correo para la firma digital de ${esMultiple ? "los siguientes contratos" : "el siguiente contrato"}. Debido a un error involuntario por parte de ${esMultiple ? "los clientes" : "el cliente"}, el proceso no se pudo completar en la primera instancia.</p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; border: 1px solid #333333; font-family: Arial, sans-serif; font-size: 13px; margin-bottom: 25px; width: 100%; text-align: left; background-color: #ffffff;">
        <thead><tr style="background-color: #f2f2f2;"><th style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000"><b>Nro. Contrato</b></font></span></th><th style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000"><b>Cliente</b></font></span></th><th style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000"><b>Carnet (CI)</b></font></span></th><th style="border: 1px solid #333333; padding: 6px 8px;"><span style="color: #000000;"><font color="#000000"><b>Ubicaci&oacute;n</b></font></span></th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      <p style="margin-bottom: 25px; color: #333333;">Quedo atento a tu confirmaci&oacute;n para proceder con la regularizaci&oacute;n.</p>
      <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formReenvio.asesor || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarHtmlRenuncia = () => {
    return `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 20px; color: #333333;">${obtenerSaludoTiempo()} estimado Ulrich,</p>
      <p style="margin-bottom: 20px; color: #333333;">Por medio del presente, te hago entrega formal de la carta de renuncia de la Sra./Sr. <strong>${formRenuncia.nombre || '[Nombre]'}</strong>, quien se desempe&ntilde;aba como <strong>${formRenuncia.cargo || 'Asesor de Ventas'}</strong> desde el pasado ${formRenuncia.fechaIngreso || '[Fecha]'}.</p>
      <p style="margin-bottom: 20px; color: #333333;">En su nota, con fecha ${formRenuncia.fechaRenuncia || '[Fecha]'}, la/el asesor/a comunica que su retiro se debe a ${formRenuncia.motivo || '[motivos que le impiden continuar cumpliendo con sus funciones de manera &oacute;ptima]'}. Adjunto el documento escaneado para que se proceda con el tr&aacute;mite correspondiente en el departamento de Recursos Humanos.</p>
      <p style="margin-bottom: 20px; color: #333333;">Quedo atento a cualquier requerimiento adicional para cerrar este proceso.</p>
      <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formRenuncia.asesor || 'Oscar Saravia'}</p>
    </div>`;
  };

  const generarHtmlAltaCRM = () => {
    return `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 20px; color: #333333;">Estimado Ulrich,</p>
      <p style="margin-bottom: 20px; color: #333333;">Por medio de la presente, solicito por favor la gesti&oacute;n para la creaci&oacute;n del usuario de acceso a los sistemas <strong>CRM y CESI</strong> para el nuevo asesor comercial que se est&aacute;n integrando a mi equipo.</p>
      <p style="margin-bottom: 15px; color: #333333;">A continuaci&oacute;n, detallo los datos personales requeridos de cada uno, basados en sus fichas de ingreso:</p>
      <ul style="margin-bottom: 20px; list-style-type: none; padding-left: 0; color: #333333;">
        <li style="margin-bottom: 5px;">Nombre: ${formAltaCRM.nombre || '---'}</li>
        <li style="margin-bottom: 5px;">Apellido Paterno: ${formAltaCRM.apPaterno || '---'}</li>
        <li style="margin-bottom: 5px;">Apellido Materno: ${formAltaCRM.apMaterno || '---'}</li>
        <li style="margin-bottom: 5px;">Carnet de Identidad: ${formAltaCRM.ci || '---'}</li>
        <li style="margin-bottom: 5px;">Fecha de Nacimiento: ${formAltaCRM.fechaNacimiento || '---'}</li>
        <li style="margin-bottom: 5px;">Correo Electr&oacute;nico: ${formAltaCRM.correo || '---'}</li>
      </ul>
      <p style="margin-bottom: 5px; color: #333333;">Quedo atento a la confirmaci&oacute;n de las credenciales para poder facilitarle el acceso y que inicie sus gestiones lo antes posible.</p>
      <p style="margin-bottom: 20px; color: #333333;">De antemano, muchas gracias por tu colaboraci&oacute;n.</p>
      <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formAltaCRM.asesor || 'Oscar Saravia'}</p>
    </div>`;
  };

  const generarHtmlEvaluacion = () => {
    return `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}.</p>
      <p style="margin-top: 0; margin-bottom: 20px; color: #333333;">Estimado Ulrich,</p>
      <p style="margin-bottom: 20px; color: #333333;">En respuesta a tu correo, adjunto el formulario de evaluaci&oacute;n de desempe&ntilde;o debidamente completado del asesor de la sucursal Montero que acaba de finalizar su programa de aprendizaje.</p>
      <p style="margin-bottom: 15px; color: #333333;">A continuaci&oacute;n, comparto un resumen detallado de las observaciones y mis recomendaciones:</p>
      <p style="margin-bottom: 10px; color: #333333;"><strong>1. ${formEvaluacion.nombre || '[Nombre Completo]'}</strong></p>
      <ul style="margin-bottom: 20px; padding-left: 20px; color: #333333;">
        <li style="margin-bottom: 10px;"><strong>Punteo Total:</strong> ${formEvaluacion.punteo || '0'} (${formEvaluacion.calificacion || 'Muy Bueno'})</li>
        <li style="margin-bottom: 10px;"><strong>Resultados:</strong> ${formEvaluacion.lotes || '0'} lotes vendidos ($${formatCurrency(formEvaluacion.monto)}), ${formEvaluacion.leads || '0'} leads y ${formEvaluacion.visitas || '0'} visitas.</li>
        <li style="margin-bottom: 10px;"><strong>Observaciones y recomendaci&oacute;n:</strong> ${formEvaluacion.observaciones || '[Texto de observaciones...]'}</li>
      </ul>
      <p style="margin-bottom: 20px; color: #333333;">Quedo a su disposici&oacute;n ante cualquier consulta.</p>
      <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formEvaluacion.asesor || 'Oscar Hugo Saravia'}</p>
    </div>`;
  };

  const generarHtmlPostulante = () => {
    return `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">Estimado Ulrich,</p>
      <p style="margin-bottom: 20px; color: #333333;">Te adjunto el formulario de entrevista de <strong>${formPostulante.nombre || '[Nombre Postulante]'}</strong> para el puesto de Asesor de Ventas. &Eacute;l llega a nosotros como referido de la asesora ${formPostulante.referidor || '[Nombre Referidor]'}.</p>
      <p style="margin-bottom: 20px; color: #333333;">Despu&eacute;s de realizarle la entrevista y evaluar su perfil, mi recomendaci&oacute;n es que proceda. Me gustar&iacute;a que lo puedan tomar en cuenta para pasarlo a la etapa de capacitaci&oacute;n y as&iacute; poder ir prepar&aacute;ndolo para que se integre a la M&aacute;quina de Ventas aqu&iacute; en la sucursal de Montero.</p>
      <p style="margin-bottom: 20px; color: #333333;">En el documento adjunto podr&aacute;s ver el detalle completo de su experiencia, evaluaci&oacute;n de competencias y el role play.</p>
      <p style="margin-bottom: 25px; color: #333333;">Cualquier consulta me avisas.</p>
      <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formPostulante.asesor || 'Oscar Saravia'}</p>
    </div>`;
  };

  const generarHtmlAmortizacion = () => {
    const { P, C_pura, n, S, C_total, precioFinalPlazos, P_actual, cuotasRestantesOrig, saldoNuevo, n_new, tiempoAhorrado, ahorrado, error } = calcularSimulacionAmortizacion();
    if (error) return `<div style="color:red; font-weight:bold;">Error: ${error}</div>`;

    const clienteStr = formAmortizacion.cliente ? `Estimado/a <strong>${formAmortizacion.cliente}</strong>` : 'Estimado/a cliente';

    return `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 650px; line-height: 1.6; text-align: left;">
      <p style="margin-bottom: 20px; color: #333333;">&#128075; ${obtenerSaludoTiempo()},<br>${clienteStr}, te presento la simulaci&oacute;n de tu abono extraordinario a capital (Sistema Franc&eacute;s):</p>
      
      <!-- TABLA 1: DATOS ORIGINALES -->
      <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 25px; border-collapse: collapse;">
        <thead>
          <tr>
            <th colspan="2" style="background-color: #f1f5f9; color: #334155; font-size: 13px; text-transform: uppercase; text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">&#128221; DATOS DEL CR&Eacute;DITO ORIGINAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width="60%" style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Precio al Contado</td>
            <td width="40%" align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">$ ${formatCurrency(formAmortizacion.precioContrato)}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Cuota Inicial</td>
            <td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">$ ${formatCurrency(formAmortizacion.cuotaInicial)}</td>
          </tr>
          <tr>
            <td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Capital Financiado</td>
            <td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">$ ${formatCurrency(P)}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Plazo Original</td>
            <td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">${formAmortizacion.plazoOriginal || 0} a&ntilde;os (${n} meses)</td>
          </tr>
          <tr>
            <td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Precio Final a Plazos</td>
            <td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">$ ${formatCurrency(precioFinalPlazos)}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="color: #475569; padding: 10px 12px;">Cuota Mensual Fija (Pura)</td>
            <td align="right" style="color: #0f172a; font-weight: bold; padding: 10px 12px;">$ ${formatCurrency(C_pura)}</td>
          </tr>
        </tbody>
      </table>

      <!-- TABLA 2: SITUACION ACTUAL -->
      <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 25px; border-collapse: collapse;">
        <thead>
          <tr>
            <th colspan="2" style="background-color: #e2e8f0; color: #1e293b; font-size: 13px; text-transform: uppercase; text-align: left; padding: 10px 12px; border-bottom: 1px solid #cbd5e1;">&#128202; SITUACI&Oacute;N ACTUAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width="60%" style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Cuotas Pagadas</td>
            <td width="40%" align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">${formAmortizacion.cuotasPagadas || 0} meses</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="color: #475569; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">Cuotas Restantes</td>
            <td align="right" style="color: #0f172a; font-weight: bold; border-bottom: 1px solid #f1f5f9; padding: 10px 12px;">${cuotasRestantesOrig} meses</td>
          </tr>
          <tr>
            <td style="color: #0f172a; font-weight: bold; padding: 12px;">Saldo Capital Actual</td>
            <td align="right" style="color: #2563eb; font-weight: bold; font-size: 16px; padding: 12px;">$ ${formatCurrency(P_actual)}</td>
          </tr>
        </tbody>
      </table>

      <!-- TABLA 3: IMPACTO -->
      <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #ffffff; border: 1px solid #bbf7d0; border-radius: 4px; margin-bottom: 25px; border-collapse: collapse;">
        <thead>
          <tr>
            <th colspan="2" style="background-color: #d1fae5; color: #065f46; font-size: 14px; text-transform: uppercase; text-align: left; padding: 12px; border-bottom: 1px solid #a7f3d0;">&#128640; IMPACTO DE TU ABONO (De $ ${formatCurrency(formAmortizacion.montoAmortizacion)})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width="60%" style="color: #166534; font-weight: bold; border-bottom: 1px solid #d1fae5; padding: 12px;">Nuevo Saldo Capital</td>
            <td width="40%" align="right" style="color: #065f46; font-weight: bold; font-size: 16px; border-bottom: 1px solid #d1fae5; padding: 12px;">$ ${formatCurrency(saldoNuevo)}</td>
          </tr>
          <tr style="background-color: #f0fdf4;">
            <td style="color: #166534; font-weight: bold; border-bottom: 1px solid #d1fae5; padding: 12px;">Nuevas Cuotas Restantes</td>
            <td align="right" style="color: #065f46; font-weight: bold; font-size: 16px; border-bottom: 1px solid #d1fae5; padding: 12px;">${n_new} meses</td>
          </tr>
          <tr>
            <td style="color: #15803d; font-weight: bold; border-bottom: 1px solid #d1fae5; padding: 12px;">Tiempo Ahorrado</td>
            <td align="right" style="color: #15803d; font-weight: bold; padding: 12px;">${tiempoAhorrado} meses</td>
          </tr>
          <tr style="background-color: #f0fdf4;">
            <td style="color: #15803d; font-weight: bold; padding: 12px;">Ahorro Estimado</td>
            <td align="right" style="color: #047857; font-weight: bold; font-size: 16px; padding: 12px;">$ ${formatCurrency(ahorrado)}</td>
          </tr>
        </tbody>
      </table>

      <p style="margin-bottom: 20px; color: #333333;">Si deseas proceder con este pago o tienes alguna duda, quedo a tu disposici&oacute;n.</p>
      <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales.</p>
    </div>`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex flex-col md:flex-row font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between shrink-0 z-30 shadow-md">
        <div className="flex items-center font-bold text-lg">
          <Building2 className="w-6 h-6 mr-2 text-indigo-400" /> Portal Asesores
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-1 rounded-md hover:bg-white/10 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50 w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col shadow-2xl shrink-0 border-r border-slate-800/50 h-screen overflow-hidden`}>
        
        <button className="md:hidden absolute top-6 right-5 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10" onClick={() => setIsSidebarOpen(false)}>
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
          <button onClick={() => handleTabChange('dashboard')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5 mr-3 shrink-0" /> Inicio
          </button>

          <div className="pt-5 pb-2"><p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gerencia</p></div>
          <button onClick={() => { handleTabChange('proyeccion'); setSupervisorDestino('mreyes@celina.com.bo'); }} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'proyeccion' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <BarChart className="w-5 h-5 mr-3 shrink-0" /> Proyección Semanal
          </button>
          <button onClick={() => handleTabChange('diaria')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'diaria' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <CalendarDays className="w-5 h-5 mr-3 shrink-0" /> Proyección Diaria
          </button>
          <button onClick={() => handleTabChange('seguimiento')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'seguimiento' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Target className="w-5 h-5 mr-3 shrink-0" /> Seguimiento de Ventas
          </button>
          
          <div className="pt-5 pb-2"><p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cotizaciones y Recompras</p></div>
          <button onClick={() => handleTabChange('amortizacion')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'amortizacion' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Calculator className="w-5 h-5 mr-3 shrink-0" /> Amortización a Capital
          </button>
          <button onClick={() => handleTabChange('recompra')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'recompra' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Repeat className="w-5 h-5 mr-3 shrink-0" /> Recompra
          </button>
          <button onClick={() => handleTabChange('descuento')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'descuento' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Tag className="w-5 h-5 mr-3 shrink-0" /> Descuentos Campañas
          </button>
          <button onClick={() => handleTabChange('cuota')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'cuota' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <TrendingUp className="w-5 h-5 mr-3 shrink-0" /> Inc. Cuota Inicial
          </button>

          <div className="pt-5 pb-2"><p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trámites Generales</p></div>
          <button onClick={() => handleTabChange('llamada')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'llamada' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <PhoneCall className="w-5 h-5 mr-3 shrink-0" /> Validación Llamada
          </button>
          <button onClick={() => handleTabChange('fisico')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'fisico' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <FileText className="w-5 h-5 mr-3 shrink-0" /> Contrato Físico
          </button>
          <button onClick={() => handleTabChange('reenvio')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'reenvio' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <FileSignature className="w-5 h-5 mr-3 shrink-0" /> Reenvío Firma Digital
          </button>
          <button onClick={() => handleTabChange('seguro')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'seguro' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Shield className="w-5 h-5 mr-3 shrink-0" /> Seguro de Vida
          </button>

          <div className="pt-5 pb-2"><p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recursos Humanos (RRHH)</p></div>
          <button onClick={() => handleTabChange('renuncia')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'renuncia' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <UserMinus className="w-5 h-5 mr-3 shrink-0" /> Carta de Renuncia
          </button>
          <button onClick={() => handleTabChange('altaCrm')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'altaCrm' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <UserPlus className="w-5 h-5 mr-3 shrink-0" /> Alta Usuarios CRM
          </button>
          <button onClick={() => handleTabChange('evaluacion')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'evaluacion' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <ClipboardCheck className="w-5 h-5 mr-3 shrink-0" /> Evaluación Fin de Mes
          </button>
          <button onClick={() => handleTabChange('postulante')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'postulante' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <UserCheck className="w-5 h-5 mr-3 shrink-0" /> Postulante Nuevo
          </button>
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

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto p-4 md:p-8 lg:p-10 w-full h-[calc(100vh-72px)] md:h-screen">
        <div className="max-w-[1600px] mx-auto w-full pb-10">
          
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div>
                    <div className="inline-flex items-center justify-center px-3 py-1 mb-3 text-xs font-bold tracking-wide text-indigo-600 bg-indigo-100 rounded-full">PORTAL V2.0</div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Panel de Control Global</h2>
                    <p className="text-slate-500 mt-2">Visión en tiempo real de la proyección de ventas de todos los equipos.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm min-w-[200px]">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avance Global</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-black text-indigo-600">{globalStats.goal > 0 ? (globalStats.actual / globalStats.goal * 100).toFixed(1) : 0}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <p className="text-sm font-bold text-slate-500 mb-1">Meta Global</p>
                    <p className="text-2xl font-black text-slate-800">${formatCurrency(globalStats.goal)}</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-l-emerald-500">
                    <p className="text-sm font-bold text-slate-500 mb-1">Colocación Actual</p>
                    <p className="text-2xl font-black text-emerald-600">${formatCurrency(globalStats.actual)}</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-l-amber-500">
                    <p className="text-sm font-bold text-slate-500 mb-1">Brecha (Falta)</p>
                    <p className="text-2xl font-black text-amber-600">${formatCurrency(Math.max(0, globalStats.goal - globalStats.actual))}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-md shadow-indigo-200 flex flex-col justify-center text-white">
                    <p className="text-sm font-bold text-indigo-200 mb-1">Total Equipos</p>
                    <p className="text-2xl font-black">{String(globalStats.teams.length)}</p>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Rendimiento por Equipo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto pr-2 pb-4">
                  {globalStats.teams.map((t, idx) => (
                    <div key={t.name} className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-slate-700 flex items-center">
                          <span className="w-6 h-6 rounded bg-slate-200 text-slate-500 flex items-center justify-center text-xs mr-2">{idx + 1}</span>
                          {String(t.name)}
                        </span>
                        <span className="text-xs font-bold bg-white px-2 py-1 rounded text-slate-600 shadow-sm">{t.percent.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden">
                        <div className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(t.percent, 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs font-semibold text-slate-500">
                        <span>Actual: ${formatCurrency(t.actual)}</span>
                        <span>Meta: ${formatCurrency(t.goal)}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* FORM: PROYECCIÓN SEMANAL */}
          {activeTab === 'proyeccion' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    <BarChart className="w-6 h-6 mr-2 text-blue-600" /> Proyección de Ventas Semanal
                  </h2>
                  <p className="text-slate-500">Consolidado por equipo para envío a Gerencia (M. Reyes).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-[2fr_1fr] 2xl:grid-cols-[2.5fr_1fr] gap-6 w-full">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col w-full min-w-0">
                  <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 bg-slate-50 items-center w-full">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Equipo Supervisor</label>
                      <select 
                        value={formProyeccion.equipo} 
                        onChange={handleEquipoChange} 
                        className="w-full px-3 py-1.5 mt-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                      >
                        {Object.keys(EQUIPOS_ASESORES).map(equipo => (
                          <option key={equipo} value={equipo}>{String(equipo)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full sm:w-40">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Semana del (Lunes)</label>
                      <input type="date" value={formProyeccion.fechaInicio} onChange={(e) => {
                        const newState = {...formProyeccion, fechaInicio: e.target.value};
                        saveProyeccionState(newState);
                      }} className="w-full px-3 py-1.5 mt-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                    <div className="w-full sm:w-40">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Objetivo Mes</label>
                      <input type="number" value={formProyeccion.objetivoMensual} onChange={(e) => {
                        const newState = {...formProyeccion, objetivoMensual: parseFloat(e.target.value) || 0};
                        saveProyeccionState(newState);
                      }} className="w-full px-3 py-1.5 mt-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap">
                      <thead>
                        <tr>
                          <th rowSpan="2" className="bg-[#f8fafc] text-slate-800 p-2 border border-slate-300">Asesor</th>
                          <th rowSpan="2" className="bg-[#f8fafc] text-slate-800 p-2 border border-slate-300 text-center leading-tight">Colocación<br/>Actual</th>
                          <th colSpan="7" className="bg-[#f1f5f9] text-slate-700 p-2 border border-slate-300 text-center uppercase tracking-wider text-[10px]">Ventas / Proyección Diaria</th>
                          <th colSpan="5" className="bg-[#eff6ff] text-sky-800 p-2 border border-slate-300 text-center uppercase tracking-wider text-[10px]">Proyectos</th>
                        </tr>
                        <tr>
                          {[0,1,2,3,4,5,6].map(d => <th key={d} className="bg-[#f8fafc] text-slate-600 p-2 border border-slate-300 text-center font-semibold">{String(formatDiaMes(formProyeccion.fechaInicio, d))}</th>)}
                          {NOMBRES_PROYECTOS_PROYECCION.map(p => <th key={p} className="bg-[#eff6ff] text-sky-700 p-2 border border-slate-300 text-center font-semibold">{String(p)}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(formProyeccion.asesores) && formProyeccion.asesores.map((asesor, i) => {
                          const totalColMes = (Number(asesor.colAct) || 0) + (Array.isArray(asesor.dias) ? asesor.dias.reduce((a,b)=>a+(Number(b)||0),0) : 0);
                          const isProductivo = totalColMes >= 25000;
                          
                          return (
                          <tr key={i} className={`hover:bg-blue-50/50 ${isProductivo ? 'bg-emerald-50/30' : ''}`}>
                            <td className="p-2 border border-slate-300 font-bold text-slate-800">{i+1}. {String(asesor.nombre || '')}</td>
                            <td className="p-1 border border-slate-300 bg-slate-50/50">
                              <div className="flex items-center gap-1">
                                <input type="number" value={asesor.colAct === 0 ? '' : asesor.colAct} onChange={(e) => updateAsesorProyeccion(i, 'colAct', e.target.value)} className="w-full min-w-[50px] p-1 text-right text-xs bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-400 rounded text-slate-700 font-semibold" placeholder="0" />
                                <button onClick={() => setSumaVentaModal({show: true, index: i, nombre: asesor.nombre, monto: ''})} className="p-1.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors shadow-sm" title="Sumar Nueva Venta"><Plus className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                            {Array.isArray(asesor.dias) && asesor.dias.map((diaVal, dIdx) => (
                              <td key={dIdx} className="p-1 border border-slate-300">
                                <input type="number" value={diaVal === 0 ? '' : diaVal} onChange={(e) => updateAsesorArrayProyeccion(i, 'dias', dIdx, e.target.value)} className="w-full min-w-[40px] p-1 text-center text-xs bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-400 rounded text-slate-600" placeholder="-" />
                              </td>
                            ))}
                            {Array.isArray(asesor.proy) && asesor.proy.map((proyVal, pIdx) => (
                              <td key={pIdx} className="p-1 border border-slate-300 bg-sky-50/30">
                                <input type="number" value={proyVal === 0 ? '' : proyVal} onChange={(e) => updateAsesorArrayProyeccion(i, 'proy', pIdx, e.target.value)} className="w-full min-w-[40px] p-1 text-center text-xs font-bold text-sky-700 bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-400 rounded" placeholder="0" />
                              </td>
                            ))}
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                     <span className="flex items-center"><Info className="w-4 h-4 mr-2 flex-shrink-0" /> Los datos se guardan de forma local en tu navegador. Si el asesor supera los $25,000 en el correo aparecerá en color verde.</span>
                  </div>
                </div>

                <div className="w-full min-w-0 flex flex-col h-full">
                  <div className="flex-1">
                    <ResultCard 
                      title="Proyección Semanal" 
                      text={String(generarTextoProyeccionCelular())} 
                      htmlContent={String(generarHtmlProyeccion())}
                      subject={`Proyección Semanal Equipo ${String(formProyeccion.equipo)} - ${String(formatDiaMes(formProyeccion.fechaInicio, 0))}`} 
                      supervisorDestino={supervisorDestino}
                      setSupervisorDestino={setSupervisorDestino}
                      showTextPlain={true}
                    />
                  </div>
                </div>
              </div>

              {/* MODAL SUMAR VENTA */}
              {sumaVentaModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Añadir Nueva Venta</h3>
                    <p className="text-sm text-slate-500 mb-4">Sumar al acumulado de <strong className="text-slate-700">{sumaVentaModal.nombre}</strong></p>
                    <div className="mb-5">
                       <label className="block text-xs font-bold text-slate-700 mb-1.5">Monto de la Venta ($)</label>
                       <input
                         type="number"
                         autoFocus
                         value={sumaVentaModal.monto}
                         onChange={(e) => setSumaVentaModal({...sumaVentaModal, monto: e.target.value})}
                         className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-lg font-bold outline-none"
                         placeholder="Ej. 6600"
                         onKeyDown={(e) => e.key === 'Enter' && confirmarSumaVenta()}
                       />
                    </div>
                    <div className="flex gap-3">
                       <button onClick={() => setSumaVentaModal({show: false, index: null, nombre: '', monto: ''})} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancelar</button>
                       <button onClick={confirmarSumaVenta} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-colors">Sumar Venta</button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* FORM: PROYECCIÓN DIARIA */}
          {activeTab === 'diaria' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <CalendarDays className="w-6 h-6 mr-2 text-blue-600" /> Proyección Diaria
                </h2>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[#002060] text-white p-3">
                  <h3 className="text-sm font-bold">Proyeccion Diaria Equipo "MAQUINA DE VENTAS"</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-[#002060] text-white border-b border-[#001540]">
                        <th className="p-2 border-r border-[#001540] text-center w-10">Nº</th>
                        <th className="p-2 border-r border-[#001540]">Asesor</th>
                        <th className="p-2 border-r border-[#001540] text-center w-24">Tipo</th>
                        <th className="p-2 border-r border-[#001540] text-center w-20">Visita</th>
                        <th className="p-2 border-r border-[#001540] text-center w-20">Venta</th>
                        <th className="p-2 border-r border-[#001540] text-center w-32">$us. Colocacion<br/>Día</th>
                        <th className="p-2 border-r border-[#001540] text-center w-40">Hora/proyecto</th>
                        <th className="p-2 text-center w-32">Medio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formDiaria.map((a, idx) => (
                        <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 font-semibold text-slate-700">
                          <td className="p-2 border-r border-slate-200 text-center">{idx + 1}</td>
                          <td className="p-2 border-r border-slate-200 uppercase text-xs">{a.nombre}</td>
                          <td className="p-2 border-r border-slate-200 text-center">{a.tipo}</td>
                          <td className="p-0 border-r border-slate-200"><input type="number" value={a.visita} onChange={(e) => { const n = [...formDiaria]; n[idx].visita = e.target.value; setFormDiaria(n); }} className="w-full h-full p-2 text-center focus:bg-blue-50 outline-none font-bold bg-transparent" placeholder="0" /></td>
                          <td className="p-0 border-r border-slate-200"><input type="number" value={a.venta} onChange={(e) => { const n = [...formDiaria]; n[idx].venta = e.target.value; setFormDiaria(n); }} className="w-full h-full p-2 text-center focus:bg-blue-50 outline-none font-bold bg-transparent" placeholder="0" /></td>
                          <td className="p-0 border-r border-slate-200"><input type="number" value={a.colocacion} onChange={(e) => { const n = [...formDiaria]; n[idx].colocacion = e.target.value; setFormDiaria(n); }} className="w-full h-full p-2 text-center focus:bg-blue-50 outline-none font-bold bg-transparent" placeholder="0,00" /></td>
                          <td className="p-0 border-r border-slate-200"><input type="text" value={a.hora} onChange={(e) => { const n = [...formDiaria]; n[idx].hora = e.target.value; setFormDiaria(n); }} className="w-full h-full p-2 focus:bg-blue-50 outline-none bg-transparent uppercase" /></td>
                          <td className="p-0"><input type="text" value={a.medio} onChange={(e) => { const n = [...formDiaria]; n[idx].medio = e.target.value; setFormDiaria(n); }} className="w-full h-full p-2 focus:bg-blue-50 outline-none bg-transparent uppercase" /></td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                        <td colSpan="3" className="p-2 text-right border-r border-slate-300 text-slate-800">TOTAL VISITAS</td>
                        <td className="p-2 text-center border-r border-slate-300 bg-white">{formDiaria.reduce((sum, a) => sum + (parseFloat(a.visita) || 0), 0)}</td>
                        <td colSpan="4"></td>
                      </tr>
                      <tr className="bg-slate-50 font-bold border-t border-slate-300">
                        <td colSpan="3" className="p-2 text-right border-r border-slate-300 text-slate-800">TOTAL VENTAS</td>
                        <td className="p-2 text-center border-r border-slate-300 bg-white">{formDiaria.reduce((sum, a) => sum + (parseFloat(a.venta) || 0), 0)}</td>
                        <td colSpan="4"></td>
                      </tr>
                      <tr className="bg-[#002060] font-bold text-white">
                        <td colSpan="3" className="p-2 text-right border-r border-[#001540]">TOTAL DÍA $us.</td>
                        <td className="p-2 text-center border-r border-[#001540]">{formatCurrency(formDiaria.reduce((sum, a) => sum + (parseFloat(a.colocacion) || 0), 0))}</td>
                        <td colSpan="4"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* FORM: SEGUIMIENTO DE VENTAS */}
          {activeTab === 'seguimiento' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-sky-600" /> Detalle de Asesor Mes en Curso
                </h2>
                <div className="bg-sky-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center">
                  <span className="italic mr-2 font-medium">Volver a Detalle por Equipos</span> 
                </div>
              </div>

              {/* Tarjetas Superiores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Asesores Stats */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-600 mb-4">Asesores</h3>
                  <div className="flex justify-between text-center mb-6">
                    <div><p className="text-2xl font-black text-slate-800">{statsSeguimiento.asesores}</p><p className="text-[11px] text-slate-500">Total Asesores</p></div>
                    <div className="w-px bg-slate-200"></div>
                    <div><p className="text-2xl font-black text-slate-800">{statsSeguimiento.antiguos}</p><p className="text-[11px] text-slate-500">Antiguos</p></div>
                    <div className="w-px bg-slate-200"></div>
                    <div><p className="text-2xl font-black text-slate-800">{statsSeguimiento.nuevos}</p><p className="text-[11px] text-slate-500">Nuevos</p></div>
                    <div className="w-px bg-slate-200"></div>
                    <div><p className="text-2xl font-black text-slate-800">{statsSeguimiento.externos}</p><p className="text-[11px] text-slate-500">Externos</p></div>
                  </div>
                  <div className="flex justify-around text-center pt-4 border-t border-slate-100">
                     <div>
                        <p className="text-xl font-bold text-slate-700">{statsSeguimiento.productivos}</p>
                        <p className="text-xs text-slate-500">Productivos</p>
                     </div>
                     <div>
                        <p className="text-xl font-bold text-red-600">{statsSeguimiento.prodPercent}%</p>
                        <p className="text-xs text-slate-500">Productividad Cluster</p>
                     </div>
                  </div>
                </div>

                {/* Ventas por Fecha */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <h3 className="text-sm font-bold text-slate-600 mb-2">Ventas por Fecha</h3>
                  <div className="flex-1 flex items-end justify-around pb-6 pt-4 relative">
                    {/* Placeholder chart */}
                    <div className="absolute left-0 top-0 bottom-6 w-full flex flex-col justify-between text-[10px] text-slate-400 border-l border-b border-slate-200">
                      <span>50 mil</span>
                      <span>0 mil</span>
                    </div>
                    <div className="flex items-end justify-around w-full h-full ml-8 relative">
                       <div className="w-12 h-[5%] bg-sky-700 relative group"><span className="absolute -bottom-6 w-full text-center text-xs text-slate-500">1</span></div>
                       <div className="w-12 h-[80%] bg-sky-700 relative group"><span className="absolute -bottom-6 w-full text-center text-xs text-slate-500">2</span></div>
                    </div>
                  </div>
                </div>

                {/* Ventas por Proyecto */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-600 mb-4">Ventas por Proyecto</h3>
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-sky-700 text-white">
                        <th className="p-2 font-semibold rounded-tl">Proyecto</th>
                        <th className="p-2 font-semibold text-center">Cantidad</th>
                        <th className="p-2 font-semibold text-right">Colocación</th>
                        <th className="p-2 font-semibold text-center rounded-tr">% Participación</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="p-2 text-slate-600 uppercase">CELINA MUYURINA</td>
                        <td className="p-2 text-center">2</td>
                        <td className="p-2 text-right">53.976</td>
                        <td className="p-2 text-center bg-blue-100">72,3 %</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="p-2 text-slate-600 uppercase">EL RENACER</td>
                        <td className="p-2 text-center">3</td>
                        <td className="p-2 text-right">20.700</td>
                        <td className="p-2 text-center">27,7 %</td>
                      </tr>
                      <tr className="font-bold text-slate-800">
                        <td className="p-2">Total</td>
                        <td className="p-2 text-center">5</td>
                        <td className="p-2 text-right">74.676</td>
                        <td className="p-2 text-center">100,0 %</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Filtros */}
              <div className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 flex gap-4">
                 <div>
                    <label className="block text-[10px] text-sky-700 font-bold mb-1">Supervisor</label>
                    <select className="border border-sky-300 bg-sky-600 text-white rounded text-xs p-1.5 px-3 pr-8 shadow-sm font-semibold outline-none cursor-pointer">
                      <option>OSCAR HUGO SARAVIA LANGUIDEY</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] text-sky-700 font-bold mb-1">Agencia</label>
                    <select className="border border-sky-300 bg-sky-600 text-white rounded text-xs p-1.5 px-3 pr-8 shadow-sm font-semibold outline-none cursor-pointer">
                      <option>Todas</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] text-sky-700 font-bold mb-1">Tipo Asesor</label>
                    <select className="border border-sky-300 bg-sky-600 text-white rounded text-xs p-1.5 px-3 pr-8 shadow-sm font-semibold outline-none cursor-pointer">
                      <option>Todas</option>
                    </select>
                 </div>
              </div>

              {/* Tabla Principal */}
              <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden overflow-x-auto shadow-sm">
                 <table className="w-full text-xs text-left whitespace-nowrap">
                    <thead>
                      <tr className="bg-[#0f6b86] text-white">
                        <th className="p-3 font-semibold border-r border-[#0d5970]">Asesor</th>
                        <th className="p-3 font-semibold border-r border-[#0d5970]">Agencia</th>
                        <th className="p-3 font-semibold border-r border-[#0d5970]">Supervisor</th>
                        <th className="p-3 font-semibold text-center border-r border-[#0d5970]">Ventas</th>
                        <th className="p-3 font-semibold text-right border-r border-[#0d5970]">Colocación ▼</th>
                        <th className="p-3 font-semibold border-r border-[#0d5970]">Tipo Asesor</th>
                        <th className="p-3 font-semibold text-right border-r border-[#0d5970]">Venta Minima</th>
                        <th className="p-3 font-semibold text-center border-r border-[#0d5970]">Colocación Cluster</th>
                        <th className="p-3 font-semibold">Cluster</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asesoresSeguimiento.map((a, idx) => {
                        const colNum = Number(a.colAct) || 0;
                        let cluster = "Venta Cero";
                        if (colNum >= 25000) cluster = "Comisionan";
                        else if (colNum > 0) cluster = "No Comisionan";

                        return (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-slate-600 uppercase">
                            <td className="p-3">{String(a.nombre || '')}</td>
                            <td className="p-3">MONTERO</td>
                            <td className="p-3">OSCAR HUGO SARAVIA LANGUIDEY</td>
                            <td className="p-3 text-center">{a.ventas || 0}</td>
                            <td className="p-3 text-right">{colNum === 0 ? '0' : new Intl.NumberFormat('es-BO', {minimumFractionDigits: 3}).format(colNum).replace(',', '.')}</td>
                            <td className="p-3">{a.tipo || 'Interno'}</td>
                            <td className="p-3 text-right">25.000</td>
                            <td className="p-3 text-center">0</td>
                            <td className="p-3 capitalize">{cluster}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                 </table>
              </div>

            </div>
          )}

          {/* FORM: SIMULADOR AMORTIZACIÓN */}
          {activeTab === 'amortizacion' && (() => {
            const { P, C_pura, S, C_total, precioFinalPlazos, P_actual, cuotasRestantesOrig, saldoNuevo, n_new, tiempoAhorrado, ahorrado, n, error } = calcularSimulacionAmortizacion();
            return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><Calculator className="w-6 h-6 mr-2 text-blue-600" /> Simulador de Amortización a Capital</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-[1fr_450px] 2xl:grid-cols-[1fr_500px] gap-8 w-full">
                
                {/* CONTROLES IZQUIERDA */}
                <div className="w-full min-w-0 flex flex-col gap-6">
                  
                  {/* Formulario de Inputs */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <Input label="Nombre del Cliente (Opcional)" name="cliente" value={formAmortizacion.cliente} onChange={handleAmortizacionChange} placeholder="Ej. Juan Pérez" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1 w-full mt-2">
                      <Input label="Precio de Contrato ($)" name="precioContrato" value={formAmortizacion.precioContrato} onChange={handleAmortizacionChange} placeholder="Ej. 24384.14" />
                      <Input label="Cuota Inicial ($)" name="cuotaInicial" value={formAmortizacion.cuotaInicial} onChange={handleAmortizacionChange} placeholder="Ej. 366.00" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-1 w-full">
                      <Input label="Plazo Original (Años)" name="plazoOriginal" value={formAmortizacion.plazoOriginal} onChange={handleAmortizacionChange} placeholder="Ej. 10" type="number" />
                      <Input label="Cuotas Pagadas (Meses)" name="cuotasPagadas" value={formAmortizacion.cuotasPagadas} onChange={handleAmortizacionChange} placeholder="Ej. 12" type="number" />
                      <Input label="Seguro Mensual ($)" name="seguroMensual" value={formAmortizacion.seguroMensual} onChange={handleAmortizacionChange} placeholder="Ej. 18.48" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1 w-full border-t border-slate-100 pt-4 mt-2">
                      <Input label="Tasa Anual (%)" name="tasaAnual" value={formAmortizacion.tasaAnual} onChange={handleAmortizacionChange} placeholder="Ej. 12.1733" />
                      <Input label="Monto a Amortizar ($)" name="montoAmortizacion" value={formAmortizacion.montoAmortizacion} onChange={handleAmortizacionChange} placeholder="Ej. 5000" className="[&_input]:bg-emerald-50 [&_input]:border-emerald-200 [&_input]:text-emerald-800 [&_label]:text-emerald-700" />
                    </div>

                    {/* Recuadro de Detalle del Sistema (Francés) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4">
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Detalle del Sistema (Francés)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                          <span className="text-slate-600">Capital Financiado:</span>
                          <span className="font-extrabold text-slate-800">$ {formatCurrency(P)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                          <span className="text-slate-600">Cuota Total (C+I+S):</span>
                          <span className="font-extrabold text-slate-800">$ {formatCurrency(C_total)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                          <span className="text-slate-600">Precio Final a Plazos:</span>
                          <span className="font-extrabold text-slate-800">$ {formatCurrency(precioFinalPlazos)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                          <span className="text-slate-600">Saldo Capital Actual:</span>
                          <span className="font-extrabold text-blue-600">$ {formatCurrency(P_actual)}</span>
                        </div>
                      </div>
                      {error && (
                         <div className="mt-3 text-xs font-bold text-red-500 flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> {error}</div>
                      )}
                    </div>
                  </div>

                  {/* Impacto Dashboard */}
                  <div className="bg-[#171b36] rounded-2xl p-6 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
                    {/* Decorative subtle background gradient */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <h3 className="text-sm font-bold text-white mb-6 flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-indigo-400" /> Impacto de la Amortización</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#24294a] rounded-xl p-5 border border-white/5">
                        <p className="text-[10px] text-indigo-200 mb-1 font-bold uppercase tracking-wider">Cuotas Restantes</p>
                        <p className="text-3xl font-black text-white">{cuotasRestantesOrig} <span className="text-xs font-medium text-indigo-200/70">meses</span></p>
                      </div>
                      <div className="bg-[#143e46] rounded-xl p-5 border border-[#1e5860] relative overflow-hidden">
                        <p className="text-[10px] text-emerald-200 mb-1 font-bold uppercase tracking-wider relative z-10">Nuevas Cuotas</p>
                        <p className="text-3xl font-black text-emerald-400 relative z-10">{n_new} <span className="text-xs font-medium text-emerald-500/70">meses</span></p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-white/10 pt-5">
                      <div>
                        <p className="text-[10px] text-indigo-300 mb-1 font-bold uppercase tracking-wider">Tiempo Ahorrado</p>
                        <p className="text-lg font-bold text-white">{tiempoAhorrado} meses</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-indigo-300 mb-1 font-bold uppercase tracking-wider">Ahorro ($ Estimado)</p>
                        <p className="text-lg font-bold text-emerald-400">$ {formatCurrency(ahorrado)}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RESULTADO DERECHA */}
                <div className="w-full min-w-0">
                  <ResultCard 
                    title="Resumen para el Cliente" 
                    text={generarTextoAmortizacionCelular()} 
                    htmlContent={generarHtmlAmortizacion()} 
                    subject={`Simulación de Abono a Capital`} 
                    hideDestino={true}
                  />
                </div>
              </div>
            </div>
            );
          })()}

          {/* FORM: RECOMPRA */}
          {activeTab === 'recompra' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><Repeat className="w-6 h-6 mr-2 text-blue-600" /> Solicitud de Recompra</h2></div>
              <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] 2xl:grid-cols-[1.5fr_1fr] gap-8 w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-6">
                      <Input label="Nombre del Asesor" name="asesor" value={formRecompra.asesor} onChange={handleRecompraChange} placeholder="Ej. Oscar Saravia" />
                      <div className="w-full">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Proyecto (Para Beneficio $)</label>
                        <select name="proyecto" value={formRecompra.proyecto} onChange={handleRecompraChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 shadow-sm text-sm">
                           <option value="Muyurina">Muyurina ($200)</option>
                           <option value="El Renacer">El Renacer ($100)</option>
                           <option value="Los Jardines">Los Jardines ($100)</option>
                           <option value="Santa Fe">Santa Fe ($100)</option>
                           <option value="Cañaveral">Cañaveral ($100)</option>
                           <option value="Celina 3">Celina 3 ($100)</option>
                           <option value="Celina 4">Celina 4 ($100)</option>
                           <option value="Celina 5">Celina 5 ($100)</option>
                           <option value="Celina 7">Celina 7 ($100)</option>
                           <option value="Celina 10">Celina 10 ($100)</option>
                           <option value="Rancho Nuevo">Rancho Nuevo ($50)</option>
                        </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                     {/* CONTRATO NUEVO */}
                     <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-200">
                        <h3 className="text-sm font-extrabold text-amber-600 mb-4 border-b border-amber-200 pb-2">DATOS CONTRATO NUEVO</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-2">
                           <Input label="Agencia / Sucursal" name="sucursal" value={formRecompra.sucursal} onChange={handleRecompraChange} placeholder="Ej. YAPACANI" />
                           <Input label="Fecha de venta" name="fechaVentaNuevo" value={formRecompra.fechaVentaNuevo} onChange={handleRecompraChange} placeholder="Ej. 27/8/2025" />
                        </div>
                        <Input label="Nombre del Cliente" name="nombreNuevo" value={formRecompra.nombreNuevo} onChange={handleRecompraChange} placeholder="Ej. DILSON DURY MARIACA" />
                        <Input label="Contrato Nuevo" name="contratoNuevo" value={formRecompra.contratoNuevo} onChange={handleRecompraChange} placeholder="Ej. C2504001327" />
                        
                        <div className="grid grid-cols-2 gap-4 mt-2">
                           <div className="w-full">
                             <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">¿Aplicó Dscto por m2?</label>
                             <select name="aplicoDescuento" value={formRecompra.aplicoDescuento} onChange={handleRecompraChange} className="w-full px-3 py-2 border border-slate-200 rounded bg-white text-sm">
                               <option value="NO">NO</option><option value="SI">SI</option>
                             </select>
                           </div>
                           <div className="w-full">
                             <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">Cuotas Pagadas</label>
                             <input type="number" name="cuotasPagadas" value={formRecompra.cuotasPagadas} onChange={handleRecompraChange} className="w-full px-3 py-2 border border-slate-200 rounded text-sm" placeholder="Ej. 2" />
                           </div>
                           <div className="w-full">
                             <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">¿Procesado?</label>
                             <select name="procesadoNuevo" value={formRecompra.procesadoNuevo} onChange={handleRecompraChange} className="w-full px-3 py-2 border border-slate-200 rounded bg-white text-sm">
                               <option value="SI">SI</option><option value="NO">NO</option>
                             </select>
                           </div>
                           <div className="w-full">
                             <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">¿Vigente?</label>
                             <select name="vigenteNuevo" value={formRecompra.vigenteNuevo} onChange={handleRecompraChange} className="w-full px-3 py-2 border border-slate-200 rounded bg-white text-sm">
                               <option value="SI">SI</option><option value="NO">NO</option>
                             </select>
                           </div>
                        </div>
                     </div>

                     {/* CONTRATO ANTIGUO */}
                     <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-200">
                        <h3 className="text-sm font-extrabold text-orange-600 mb-4 border-b border-orange-200 pb-2">DATOS CONTRATO ANTIGUO</h3>
                        <Input label="Nombre del Cliente Antiguo" name="nombreAntiguo" value={formRecompra.nombreAntiguo} onChange={handleRecompraChange} placeholder="Ej. DILSON DURY MARIACA" />
                        <Input label="Contrato Antiguo" name="contratoAntiguo" value={formRecompra.contratoAntiguo} onChange={handleRecompraChange} placeholder="Ej. C2504001326" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-2">
                           <Input label="Fecha de venta" name="fechaVentaAntiguo" value={formRecompra.fechaVentaAntiguo} onChange={handleRecompraChange} placeholder="Ej. 27/8/2025" />
                           <Input label="Fecha Pago de Cuota" name="fechaPago" value={formRecompra.fechaPago} onChange={handleRecompraChange} placeholder="Ej. 7-dic-25" />
                        </div>
                        
                        <Input label="Patrocinador" name="patrocinador" value={formRecompra.patrocinador} onChange={handleRecompraChange} placeholder="Ej. JHOVANA ALMANZA VALLEJOS" />
                        <Input label="Valor de Cuota ($)" name="valorCuota" value={formRecompra.valorCuota} onChange={handleRecompraChange} placeholder="Ej. 304.8" type="number" />
                        
                        <div className="grid grid-cols-2 gap-4 mt-2">
                           <div className="w-full">
                             <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">¿Procesado?</label>
                             <select name="procesadoAntiguo" value={formRecompra.procesadoAntiguo} onChange={handleRecompraChange} className="w-full px-3 py-2 border border-slate-200 rounded bg-white text-sm">
                               <option value="SI">SI</option><option value="NO">NO</option>
                             </select>
                           </div>
                           <div className="w-full">
                             <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">¿Vigente?</label>
                             <select name="vigenteAntiguo" value={formRecompra.vigenteAntiguo} onChange={handleRecompraChange} className="w-full px-3 py-2 border border-slate-200 rounded bg-white text-sm">
                               <option value="SI">SI</option><option value="NO">NO</option>
                             </select>
                           </div>
                        </div>
                     </div>
                   </div>

                </div>
                <div className="w-full min-w-0">
                   <ResultCard 
                     title="Solicitud Recompra" 
                     text={generarTextoRecompraCelular()} 
                     htmlContent={generarHtmlRecompra()} 
                     subject={`solicitud de código de descuento RECOMPRA cliente: ${formRecompra.nombreNuevo || 'NOMBRE'}`} 
                     supervisorDestino={supervisorDestino} 
                     setSupervisorDestino={setSupervisorDestino} 
                   />
                </div>
              </div>
            </div>
          )}

          {/* FORM: VALIDACIÓN LLAMADA */}
          {activeTab === 'llamada' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><PhoneCall className="w-6 h-6 mr-2 text-blue-600" /> Validación de Llamada (Referidos)</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
                  <Input label="Nombre del Asesor" name="asesor" value={formLlamada.asesor} onChange={handleLlamadaChange} placeholder="Ej. Oscar Saravia" />
                  
                  <div className="mt-6 mb-4 pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800">Datos del Cliente Referido</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    <Input label="Nombre del Referido" name="nombreReferido" value={formLlamada.nombreReferido} onChange={handleLlamadaChange} placeholder="Ej. Maria Fernanda Ramos Escobar" />
                    <Input label="Número de Contrato" name="contratoReferido" value={formLlamada.contratoReferido} onChange={handleLlamadaChange} placeholder="Ej. C2604002026" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    <Input label="Celular del Referido" name="celularReferido" value={formLlamada.celularReferido} onChange={handleLlamadaChange} placeholder="Ej. 77712345" />
                    <Input label="Hora para la llamada" name="horaLlamada" value={formLlamada.horaLlamada} onChange={handleLlamadaChange} placeholder="Ej. 16:00 PM" />
                  </div>

                  <div className="mt-6 mb-4 pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800">Datos del Cliente Beneficiaria</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    <Input label="Nombre de la Beneficiaria" name="nombreBeneficiario" value={formLlamada.nombreBeneficiario} onChange={handleLlamadaChange} placeholder="Ej. Crispina García López" />
                    <Input label="Carnet (CI) Beneficiaria" name="ciBeneficiario" value={formLlamada.ciBeneficiario} onChange={handleLlamadaChange} placeholder="Ej. C2604201165" />
                  </div>
                </div>
                <div className="w-full min-w-0">
                  <ResultCard 
                    title="Validación Llamada" 
                    text={generarTextoLlamadaCelular()} 
                    htmlContent={generarHtmlLlamada()} 
                    subject={`Solicitud de validación llamada Cliente referido: ${formLlamada.nombreReferido || 'NOMBRE'}, ${formLlamada.contratoReferido || 'CONTRATO'}`} 
                    fixedDestinoLabel="Olivia Mendoza Duran"
                    fixedDestinoEmail="omendoza@celina.com.bo"
                    ccEmails="elizarraga@celina.com.bo, aperez@celina.com.bo"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FORM: SEGURO DE VIDA */}
          {activeTab === 'seguro' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><Shield className="w-6 h-6 mr-2 text-blue-600" /> Adición Beneficiarios Seguro</h2></div>
              <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] 2xl:grid-cols-[1.5fr_1fr] gap-8 w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
                   <div className="mb-4"><Input label="Nombre del Asesor" name="asesor" value={formSeguro.asesor} onChange={handleSeguroChange} placeholder="Ej. Oscar Saravia" /></div>
                   
                   <div className="mt-6 mb-4 pb-2 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800">Datos de la Venta</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-2">
                      <Input label="Nombre del Cliente(s)" name="cliente" value={formSeguro.cliente} onChange={handleSeguroChange} placeholder="Ej. Celso Aguilera Barboza" />
                      <Input label="Nro. Contrato" name="nroContrato" value={formSeguro.nroContrato} onChange={handleSeguroChange} placeholder="Ej. C2504200808" />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mb-4">
                      <Input label="UV" name="uv" value={formSeguro.uv} onChange={handleSeguroChange} placeholder="Ej. SN" />
                      <Input label="Manzano" name="manzano" value={formSeguro.manzano} onChange={handleSeguroChange} placeholder="Ej. 52" />
                      <Input label="Lote" name="lote" value={formSeguro.lote} onChange={handleSeguroChange} placeholder="Ej. 10" />
                   </div>

                   <div className="mt-6 mb-4 pb-2 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800">Beneficiarios del Seguro</h3>
                   </div>
                   <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 w-full">
                      {formSeguro.beneficiarios.map((b, index) => (
                        <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group w-full">
                          {formSeguro.beneficiarios.length > 1 && (<button onClick={() => eliminarBeneficiario(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full z-10"><Trash2 className="w-4 h-4" /></button>)}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full">
                            <div className="w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">Nombre</label><input type="text" value={b.nombre} onChange={(e) => handleBeneficiarioChange(index, 'nombre', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white uppercase" placeholder="Ej. Carla Aguilera Chávez" /></div>
                            <div className="w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">Parentesco</label><input type="text" value={b.parentesco} onChange={(e) => handleBeneficiarioChange(index, 'parentesco', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white uppercase" placeholder="Ej. HIJA" /></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                            <div className="w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">Porcentaje (%)</label><input type="number" value={b.porcentaje} onChange={(e) => handleBeneficiarioChange(index, 'porcentaje', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white" placeholder="Ej. 50" /></div>
                            <div className="w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">C.I.</label><input type="text" value={b.ci} onChange={(e) => handleBeneficiarioChange(index, 'ci', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white uppercase" placeholder="Ej. OTROS" /></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={agregarBeneficiario} className="mt-4 w-full flex items-center justify-center py-3 border-2 border-dashed rounded-xl text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"><Plus className="w-4 h-4 mr-1" /> Añadir otro beneficiario</button>
                </div>
                <div className="w-full min-w-0">
                   <ResultCard 
                     title="Adición Beneficiarios Seguro" 
                     text={generarTextoSeguroCelular()} 
                     htmlContent={generarHtmlSeguro()} 
                     subject={`solicitud de adición de ${formSeguro.beneficiarios.length} beneficiarios al seguro de vida ${formSeguro.nroContrato}`} 
                     supervisorDestino={supervisorDestino} 
                     setSupervisorDestino={setSupervisorDestino} 
                   />
                </div>
              </div>
            </div>
          )}

          {/* FORM: CONTRATO FÍSICO */}
          {activeTab === 'fisico' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><FileText className="w-6 h-6 mr-2 text-blue-600" /> Habilitación de Contrato Físico</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
                  <Input label="Nombre del Asesor" name="asesor" value={formFisico.asesor} onChange={handleFisicoChange} placeholder="Ej. Oscar Saravia" />
                  <Input label="Nombre Completo del Cliente" name="nombre" value={formFisico.nombre} onChange={handleFisicoChange} placeholder="Ej. Juan Pérez" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    <Input label="Número de Carnet (CI)" name="ci" value={formFisico.ci} onChange={handleFisicoChange} placeholder="Ej. 1234567" />
                    <Input label="Número de Contrato" name="contrato" value={formFisico.contrato} onChange={handleFisicoChange} placeholder="Ej. CT-9876" />
                  </div>
                  <TextArea label="Motivo detallado" name="motivo" value={formFisico.motivo} onChange={handleFisicoChange} placeholder="Ej. El cliente es una persona mayor..." />
                </div>
                <div className="w-full min-w-0"><ResultCard title="Contrato Físico" text={generarTextoFisicoCelular()} htmlContent={generarHtmlFisico()} subject={`Solicitud Contrato Físico - ${formFisico.nombre || 'Cliente'}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} /></div>
              </div>
            </div>
          )}

          {/* FORM: REENVÍO FIRMA DIGITAL */}
          {activeTab === 'reenvio' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><FileSignature className="w-6 h-6 mr-2 text-blue-600" /> Reenvío Firma Digital</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-[1.2fr_1fr] 2xl:grid-cols-[1.5fr_1fr] gap-8 w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 border-b border-slate-100 pb-3 gap-3">
                    <h3 className="text-lg font-medium text-slate-800">Listado de Contratos</h3>
                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <select value={formReenvio.proyecto} onChange={(e) => setFormReenvio({...formReenvio, proyecto: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                        {PROYECTOS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-4"><Input label="Nombre del Asesor" name="asesor" value={formReenvio.asesor} onChange={(e) => setFormReenvio({...formReenvio, asesor: e.target.value})} placeholder="Ej. Oscar Saravia" /></div>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 w-full">
                    {formReenvio.contratos.map((contrato, index) => (
                      <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group w-full">
                        {formReenvio.contratos.length > 1 && (<button onClick={() => eliminarContratoReenvio(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full z-10"><Trash2 className="w-4 h-4" /></button>)}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full">
                          <div className="w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">Nro. Contrato</label><input type="text" value={contrato.nroContrato} onChange={(e) => handleReenvioChange(index, 'nroContrato', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white" /></div>
                          <div className="w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">Carnet (CI)</label><input type="text" value={contrato.ci} onChange={(e) => handleReenvioChange(index, 'ci', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white" /></div>
                        </div>
                        <div className="mb-3 w-full"><label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del Cliente</label><input type="text" value={contrato.cliente} onChange={(e) => handleReenvioChange(index, 'cliente', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm uppercase bg-white" /></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                          <div className="flex flex-col w-full"><label className="text-xs text-slate-500 mb-1">UV:</label><input type="text" value={contrato.uv} onChange={(e) => handleReenvioChange(index, 'uv', e.target.value)} className="w-full px-2.5 py-1 border rounded text-sm bg-white" /></div>
                          <div className="flex flex-col w-full"><label className="text-xs text-slate-500 mb-1">Mzn:</label><input type="text" value={contrato.manzano} onChange={(e) => handleReenvioChange(index, 'manzano', e.target.value)} className="w-full px-2.5 py-1 border rounded text-sm bg-white" /></div>
                          <div className="flex flex-col w-full"><label className="text-xs text-slate-500 mb-1">Lote:</label><input type="text" value={contrato.lote} onChange={(e) => handleReenvioChange(index, 'lote', e.target.value)} className="w-full px-2.5 py-1 border rounded text-sm bg-white" /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={agregarContratoReenvio} className="mt-4 w-full flex items-center justify-center py-3 border-2 border-dashed rounded-xl text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"><Plus className="w-4 h-4 mr-1" /> Añadir otro contrato</button>
                </div>
                <div className="w-full min-w-0"><ResultCard title="Reenvío Firma Digital" text={generarTextoReenvioCelular()} htmlContent={generarHtmlReenvio()} subject={`Solicitud Reenvío de Correo Firma Digital - ${formReenvio.proyecto}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} /></div>
              </div>
            </div>
          )}

          {/* FORM: DESCUENTO CAMPAÑAS */}
          {activeTab === 'descuento' && (() => {
            const { porcentajeCuota, montoCuotaNum } = calcularDescuento();
            const nomProyectoFinal = formDescuento.proyecto === 'OTRO...' ? (formDescuento.proyectoManual || 'PROYECTO MANUAL') : formDescuento.proyecto;
            
            // Lógica inteligente para el asunto del correo
            let asuntoDescuento = `Solicitud Descuento Campañas - ${nomProyectoFinal} UV:${formDescuento.uv} Mz:${formDescuento.manzano} Lt:${formDescuento.lote}`;
            if (formDescuento.modalidad === 'Crédito' && porcentajeCuota >= 1.5 && porcentajeCuota < 5) {
              asuntoDescuento += ` - AUTORIZACIÓN PARA BAJAR LA CUOTA INICIAL AL 1.5% CATEGORÍA CALLE`;
            }

            return (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center"><Tag className="w-6 h-6 mr-2 text-blue-600" /> Descuentos Campañas</h2>
                  
                  {/* BOTÓN TOGGLE BÚSQUEDA INTELIGENTE / MANUAL */}
                  <div className="bg-slate-200/60 p-1 rounded-full inline-flex self-start sm:self-auto">
                    <button 
                      onClick={() => setFormDescuento({...formDescuento, modoBusqueda: 'inteligente'})}
                      disabled={formDescuento.proyecto === 'OTRO...'}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center ${formDescuento.modoBusqueda === 'inteligente' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'} disabled:opacity-40`}
                    >
                      <Search className="w-3.5 h-3.5 mr-1.5" /> Automático
                    </button>
                    <button 
                      onClick={() => setFormDescuento({...formDescuento, modoBusqueda: 'manual'})}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center ${formDescuento.modoBusqueda === 'manual' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Manual
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-[1.3fr_1fr] 2xl:grid-cols-[1.5fr_1fr] gap-8 w-full">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 w-full">
                      <div className="w-full">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Proyecto</label>
                        <select name="proyecto" value={formDescuento.proyecto} onChange={handleDescuentoChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 shadow-sm text-sm">
                          {PROYECTOS.map(p => <option key={p} value={p}>{String(p).toUpperCase()}</option>)}
                        </select>
                      </div>
                      <div className="w-full">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Modalidad</label>
                        <select name="modalidad" value={formDescuento.modalidad} onChange={handleDescuentoChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 shadow-sm text-sm">
                          <option value="Contado">Al Contado</option>
                          <option value="Crédito">A Crédito (Plazos)</option>
                        </select>
                      </div>
                    </div>

                    {formDescuento.proyecto === 'OTRO...' && (
                      <div className="mb-5 bg-amber-50/80 p-4 rounded-xl border border-amber-200 shadow-sm w-full">
                        <h4 className="font-bold text-amber-800 mb-3 text-sm flex items-center"><Edit3 className="w-4 h-4 mr-2" /> Proyecto Manual</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                           <div className="w-full">
                             <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">Nombre del Proyecto</label>
                             <input type="text" name="proyectoManual" value={formDescuento.proyectoManual} onChange={handleDescuentoChange} className="w-full px-3 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white text-sm" placeholder="Ej. Celina VII"/>
                           </div>
                           <div className="w-full">
                             <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">Descuento a Aplicar</label>
                             <div className="flex flex-col sm:flex-row w-full gap-2">
                               <select name="tipoDescuentoManual" value={formDescuento.tipoDescuentoManual} onChange={handleDescuentoChange} className="w-full sm:w-1/2 px-2 py-2.5 border border-amber-200 rounded-xl bg-white text-sm font-semibold focus:ring-2 focus:ring-amber-500 outline-none">
                                  <option value="porcentaje">% Desc.</option>
                                  <option value="monto">$ por m²</option>
                               </select>
                               <input type="number" name="descuentoManual" value={formDescuento.descuentoManual} onChange={handleDescuentoChange} className="w-full sm:w-1/2 px-3 py-2.5 border border-amber-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Ej. 10"/>
                             </div>
                           </div>
                        </div>
                      </div>
                    )}

                    {formDescuento.modalidad === 'Crédito' && (
                      <div className="mb-6 bg-blue-50/50 p-5 rounded-xl border border-blue-100/50 w-full">
                        <div className="flex flex-col w-full">
                          <label className="block text-sm font-bold text-slate-700 mb-2 ml-0.5">Ingresar Cuota Inicial</label>
                          <div className="flex flex-col sm:flex-row w-full gap-3">
                            <select 
                              value={formDescuento.modoCuota} 
                              onChange={(e) => setFormDescuento({...formDescuento, modoCuota: e.target.value, cuota: ''})}
                              className="flex-1 px-3 py-2.5 border border-blue-200 rounded-xl bg-white text-slate-700 font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            >
                              <option value="monto">Monto ($)</option>
                              <option value="porcentaje">Porcentaje (%)</option>
                            </select>
                            <input 
                              type="number" 
                              name="cuota" 
                              value={formDescuento.cuota} 
                              onChange={handleDescuentoChange} 
                              placeholder={formDescuento.modoCuota === 'monto' ? "Ej. 1000" : "Ej. 5"}
                              className="flex-1 px-3 py-2.5 border border-blue-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-inner text-sm" 
                            />
                            <div className="flex-1 flex items-center justify-center bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm py-2.5 px-2">
                              {formDescuento.modoCuota === 'monto' 
                                ? `${formatCurrency(porcentajeCuota)}%` 
                                : `$ ${formatCurrency(montoCuotaNum)}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NUEVO BLOQUE: DESCUENTO MANUAL PROYECTOS PROPIOS >= 1.5% */}
                    {PROYECTOS_PROPIOS_1.includes(formDescuento.proyecto) && formDescuento.modalidad === 'Crédito' && porcentajeCuota >= 1.5 && (
                      <div className="mb-6 bg-purple-50/80 p-4 rounded-xl border border-purple-200 shadow-sm w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                         <div className="flex-1">
                           <label className="block text-sm font-bold text-purple-900 mb-1">¡Aplica a Descuento Especial!</label>
                           <p className="text-xs text-purple-700 leading-tight">Puedes ajustar el % manualmente si lo deseas (Máximo {porcentajeCuota >= 5 ? '23' : '20'}%).</p>
                         </div>
                         <div className="w-full sm:w-auto flex items-center bg-white rounded-lg border border-purple-200 overflow-hidden">
                           <input
                             type="number"
                             name="descuentoPropiosManual"
                             value={formDescuento.descuentoPropiosManual}
                             onChange={handleDescuentoChange}
                             max={porcentajeCuota >= 5 ? "23" : "20"}
                             min="0"
                             className="w-20 px-3 py-2 text-center font-bold text-purple-700 focus:outline-none"
                           />
                           <span className="pr-3 font-bold text-purple-500">%</span>
                         </div>
                      </div>
                    )}
                    
                    {/* MENÚS CASCADA O MANUAL */}
                    {formDescuento.modoBusqueda === 'inteligente' && formDescuento.proyecto !== 'OTRO...' ? (
                      <div className="mb-6 p-5 bg-slate-50 border border-slate-100 rounded-xl w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                          <div className="w-full">
                            <label className="block text-xs font-bold text-emerald-700 mb-1.5 ml-0.5 uppercase tracking-wide">Elegir UV</label>
                            <select name="uv" value={formDescuento.uv} onChange={handleDescuentoChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 font-semibold cursor-pointer text-sm">
                              <option value="">---</option>
                              {opcionesUV.map(u => <option key={u} value={u}>{String(u)}</option>)}
                            </select>
                          </div>
                          <div className="w-full">
                            <label className="block text-xs font-bold text-emerald-700 mb-1.5 ml-0.5 uppercase tracking-wide">Elegir MZN</label>
                            <select name="manzano" value={formDescuento.manzano} onChange={handleDescuentoChange} disabled={!formDescuento.uv} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 font-semibold cursor-pointer disabled:opacity-50 disabled:bg-slate-100 text-sm">
                              <option value="">---</option>
                              {opcionesMZN.map(m => <option key={m} value={m}>{String(m)}</option>)}
                            </select>
                          </div>
                          <div className="w-full">
                            <label className="block text-xs font-bold text-emerald-700 mb-1.5 ml-0.5 uppercase tracking-wide">Elegir Lote</label>
                            <select name="lote" value={formDescuento.lote} onChange={handleDescuentoChange} disabled={!formDescuento.manzano} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 font-semibold cursor-pointer disabled:opacity-50 disabled:bg-slate-100 text-sm">
                              <option value="">---</option>
                              {opcionesLote.map(lt => <option key={lt} value={lt}>{String(lt)}</option>)}
                            </select>
                          </div>
                        </div>
                        {lotesBD.length === 0 && !cargandoLotes ? (
                          <p className="text-xs text-amber-600 mt-4 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" /> Cargando base de datos o archivo lotes.json no encontrado.
                          </p>
                        ) : null}
                        {cargandoLotes ? (
                          <p className="text-xs text-slate-500 mt-4 flex items-center">
                             Cargando base de datos segura...
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-3 w-full">
                        <Input label="UV" name="uv" value={formDescuento.uv} onChange={handleDescuentoChange} />
                        <Input label="Manzano" name="manzano" value={formDescuento.manzano} onChange={handleDescuentoChange} />
                        <Input label="Lote" name="lote" value={formDescuento.lote} onChange={handleDescuentoChange} />
                      </div>
                    )}

                    {/* ETIQUETA DE CATEGORÍA (ESTILO DARK) */}
                    {formDescuento.modoBusqueda === 'inteligente' && formDescuento.categoria ? (
                      <div className="bg-slate-900 border border-slate-800 text-white p-4 rounded-xl text-xs font-bold mb-5 flex items-center shadow-md uppercase tracking-wider w-full overflow-hidden">
                        <Tag className="w-4 h-4 mr-2.5 text-cyan-400 flex-shrink-0" />
                        <span className="text-slate-400 mr-1.5 font-semibold flex-shrink-0">Categoría:</span> 
                        <span className="truncate">{String(formDescuento.categoria)}</span>
                      </div>
                    ) : formDescuento.modoBusqueda === 'manual' ? (
                      <div className="mb-4 w-full">
                         <Input label="Categoría (Opcional)" name="categoria" value={formDescuento.categoria} onChange={handleDescuentoChange} placeholder="Ej. AVENIDA PRINCIPAL CON PAVIMENTO" />
                      </div>
                    ) : null}

                    {loteAutocompletado && formDescuento.modoBusqueda === 'inteligente' && (
                      <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-xs font-bold mb-5 flex items-center shadow-sm w-full">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" /> Superficie y Precio autocompletados
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 w-full">
                      <Input label="Superficie (M2)" name="m2" value={formDescuento.m2} onChange={handleDescuentoChange} type="number" />
                      <Input label="Precio Reg. (M2)" name="precioM2" value={formDescuento.precioM2} onChange={handleDescuentoChange} type="number" />
                    </div>
                    
                    <div className="border-t border-slate-100 pt-5 mt-2 w-full"><Input label="Nombre del Asesor" name="asesor" value={formDescuento.asesor} onChange={handleDescuentoChange} /></div>
                  </div>
                  <div className="w-full min-w-0"><ResultCard title="Descuento" text={generarTextoDescuentoCelular()} htmlContent={generarHtmlDescuento()} subject={asuntoDescuento} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} /></div>
                </div>
              </div>
            );
          })()}

          {/* FORM: INCREMENTO CUOTA */}
          {activeTab === 'cuota' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><TrendingUp className="w-6 h-6 mr-2 text-blue-600" /> Incremento de Cuota Inicial</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    <Input label="Nro. Contrato" name="nroContrato" value={formCuota.nroContrato} onChange={handleCuotaChange} />
                    <Input label="Carnet (CI)" name="ci" value={formCuota.ci} onChange={handleCuotaChange} />
                  </div>
                  <Input label="Nombre del Cliente" name="cliente" value={formCuota.cliente} onChange={handleCuotaChange} />
                  <div className="mb-5 w-full">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Proyecto</label>
                    <select name="proyecto" value={formCuota.proyecto} onChange={handleCuotaChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 shadow-sm text-sm">{PROYECTOS.map(p => <option key={p} value={p}>{String(p)}</option>)}</select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                    <Input label="UV" name="uv" value={formCuota.uv} onChange={handleCuotaChange} />
                    <Input label="Manzano" name="manzano" value={formCuota.manzano} onChange={handleCuotaChange} />
                    <Input label="Lote" name="lote" value={formCuota.lote} onChange={handleCuotaChange} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2 w-full">
                    <Input label="Cuota Registrada ($)" name="cuotaInicial" value={formCuota.cuotaInicial} onChange={handleCuotaChange} type="number" />
                    <Input label="Nueva Cuota ($)" name="nuevaCuota" value={formCuota.nuevaCuota} onChange={handleCuotaChange} type="number" />
                  </div>
                  <TextArea label="Motivo del incremento" name="motivo" value={formCuota.motivo} onChange={handleCuotaChange} />
                  <div className="border-t border-slate-100 pt-5 mt-2 w-full"><Input label="Nombre del Asesor" name="asesorVentas" value={formCuota.asesorVentas} onChange={handleCuotaChange} /></div>
                </div>
                <div className="w-full min-w-0"><ResultCard title="Incremento Cuota" text={generarTextoCuotaCelular()} htmlContent={generarHtmlCuota()} subject={`Incremento Cuota Inicial - ${formCuota.proyecto} Mz${formCuota.manzano} Lt${formCuota.lote}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} /></div>
              </div>
            </div>
          )}

          {/* FORM: RRHH - RENUNCIA */}
          {activeTab === 'renuncia' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><UserMinus className="w-6 h-6 mr-2 text-blue-600" /> Entrega de Carta de Renuncia</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
                  <Input label="Tu Nombre (Remitente)" name="asesor" value={formRenuncia.asesor} onChange={handleRenunciaChange} placeholder="Ej. Oscar Saravia" />
                  <div className="mt-4 mb-4 pb-2 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-800">Datos de la Renuncia</h3></div>
                  <Input label="Nombre del Asesor que renuncia" name="nombre" value={formRenuncia.nombre} onChange={handleRenunciaChange} placeholder="Ej. Nataly Heredia B." />
                  <Input label="Cargo" name="cargo" value={formRenuncia.cargo} onChange={handleRenunciaChange} placeholder="Ej. Asesor de Ventas" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-2">
                    <Input label="Fecha de Ingreso" name="fechaIngreso" value={formRenuncia.fechaIngreso} onChange={handleRenunciaChange} placeholder="Ej. 24 de marzo de 2026" />
                    <Input label="Fecha de la Nota/Renuncia" name="fechaRenuncia" value={formRenuncia.fechaRenuncia} onChange={handleRenunciaChange} placeholder="Ej. 17 de abril de 2026" />
                  </div>
                  <TextArea label="Motivo de la renuncia" name="motivo" value={formRenuncia.motivo} onChange={handleRenunciaChange} placeholder="Ej. Motivos de salud que le impiden continuar..." />
                </div>
                <div className="w-full min-w-0">
                  <ResultCard 
                    title="Carta de Renuncia" 
                    text={generarTextoRenunciaCelular()} 
                    htmlContent={generarHtmlRenuncia()} 
                    subject={`Entrega de carta de renuncia - ${formRenuncia.nombre || 'Asesor'}`} 
                    fixedDestinoLabel="Ulrich Klein Montano"
                    fixedDestinoEmail="uklein@grupopaz.com.bo"
                    ccEmails="mfroca@celina.com.bo, rvaca@grupopaz.com.bo, mreyes@celina.com.bo"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FORM: RRHH - ALTA CRM */}
          {activeTab === 'altaCrm' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><UserPlus className="w-6 h-6 mr-2 text-blue-600" /> Solicitud de Alta de Usuarios CRM y CESI</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
                  <Input label="Tu Nombre (Remitente)" name="asesor" value={formAltaCRM.asesor} onChange={handleAltaCRMChange} placeholder="Ej. Oscar Saravia" />
                  <div className="mt-4 mb-4 pb-2 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-800">Datos del Nuevo Asesor</h3></div>
                  <Input label="Nombre(s)" name="nombre" value={formAltaCRM.nombre} onChange={handleAltaCRMChange} placeholder="Ej. DANIEL" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-2">
                    <Input label="Apellido Paterno" name="apPaterno" value={formAltaCRM.apPaterno} onChange={handleAltaCRMChange} placeholder="Ej. ANGULO" />
                    <Input label="Apellido Materno" name="apMaterno" value={formAltaCRM.apMaterno} onChange={handleAltaCRMChange} placeholder="Ej. MALDONADO" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-2">
                    <Input label="Carnet de Identidad" name="ci" value={formAltaCRM.ci} onChange={handleAltaCRMChange} placeholder="Ej. 6237199 S/E" />
                    <Input label="Fecha de Nacimiento" name="fechaNacimiento" value={formAltaCRM.fechaNacimiento} onChange={handleAltaCRMChange} placeholder="Ej. 07 abr 1985" />
                  </div>
                  <Input label="Correo Electrónico" name="correo" value={formAltaCRM.correo} onChange={handleAltaCRMChange} placeholder="Ej. danielangulom7@gmail.com" />
                </div>
                <div className="w-full min-w-0">
                  <ResultCard 
                    title="Alta Usuarios CRM" 
                    text={generarTextoAltaCRMCelular()} 
                    htmlContent={generarHtmlAltaCRM()} 
                    subject={`Solicitud de Alta de Usuarios CRM y CESI – ${formAltaCRM.nombre} ${formAltaCRM.apPaterno} ${formAltaCRM.apMaterno}`.trim()} 
                    fixedDestinoLabel="Ulrich Klein Montano"
                    fixedDestinoEmail="uklein@grupopaz.com.bo"
                    ccEmails="mfroca@celina.com.bo, rvaca@grupopaz.com.bo, mreyes@celina.com.bo"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FORM: RRHH - EVALUACION */}
          {activeTab === 'evaluacion' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><ClipboardCheck className="w-6 h-6 mr-2 text-blue-600" /> Reporte de Finalización (Aprendizaje)</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
                  <Input label="Tu Nombre (Remitente)" name="asesor" value={formEvaluacion.asesor} onChange={handleEvaluacionChange} placeholder="Ej. Oscar Hugo Saravia" />
                  <div className="mt-4 mb-4 pb-2 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-800">Resultados de la Evaluación</h3></div>
                  <Input label="Nombre del Asesor Evaluado" name="nombre" value={formEvaluacion.nombre} onChange={handleEvaluacionChange} placeholder="Ej. Jaime Fabricio Rios Castro" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-2">
                    <Input label="Punteo Total" name="punteo" value={formEvaluacion.punteo} onChange={handleEvaluacionChange} placeholder="Ej. 41" type="number" />
                    <Input label="Calificación (Texto)" name="calificacion" value={formEvaluacion.calificacion} onChange={handleEvaluacionChange} placeholder="Ej. Muy Bueno" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mb-2">
                    <Input label="Lotes Vendidos" name="lotes" value={formEvaluacion.lotes} onChange={handleEvaluacionChange} placeholder="Ej. 9" type="number" />
                    <Input label="Monto Vendido ($)" name="monto" value={formEvaluacion.monto} onChange={handleEvaluacionChange} placeholder="Ej. 91110" type="number" />
                    <Input label="Leads" name="leads" value={formEvaluacion.leads} onChange={handleEvaluacionChange} placeholder="Ej. 153" type="number" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mb-2">
                    <Input label="Visitas" name="visitas" value={formEvaluacion.visitas} onChange={handleEvaluacionChange} placeholder="Ej. 7" type="number" />
                  </div>
                  <TextArea label="Observaciones y Recomendación" name="observaciones" value={formEvaluacion.observaciones} onChange={handleEvaluacionChange} placeholder={`Ej. Su desempeño ha sido sobresaliente... Solicito su ratificación y la firma de su contrato...`} />
                </div>
                <div className="w-full min-w-0">
                  <ResultCard 
                    title="Reporte de Evaluación" 
                    text={generarTextoEvaluacionCelular()} 
                    htmlContent={generarHtmlEvaluacion()} 
                    subject={`RE: REPORTE DE FINALIZACION DEL PROGRAMA DE APRENDIZAJE - ${formEvaluacion.nombre || 'Asesor'}`.toUpperCase()} 
                    fixedDestinoLabel="Ulrich Klein Montano"
                    fixedDestinoEmail="uklein@grupopaz.com.bo"
                    ccEmails="mfroca@celina.com.bo, rvaca@grupopaz.com.bo, mreyes@celina.com.bo"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FORM: RRHH - POSTULANTE */}
          {activeTab === 'postulante' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><UserCheck className="w-6 h-6 mr-2 text-blue-600" /> Postulante para Capacitación</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full min-w-0">
                  <Input label="Tu Nombre (Remitente)" name="asesor" value={formPostulante.asesor} onChange={handlePostulanteChange} placeholder="Ej. Oscar Saravia" />
                  <div className="mt-4 mb-4 pb-2 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-800">Datos del Postulante</h3></div>
                  <Input label="Nombre del Postulante" name="nombre" value={formPostulante.nombre} onChange={handlePostulanteChange} placeholder="Ej. Daniel Angulo Maldonado" />
                  <Input label="Referido por (Nombre Asesor)" name="referidor" value={formPostulante.referidor} onChange={handlePostulanteChange} placeholder="Ej. Marisol Urgel" />
                </div>
                <div className="w-full min-w-0">
                  <ResultCard 
                    title="Postulante Capacitación" 
                    text={generarTextoPostulanteCelular()} 
                    htmlContent={generarHtmlPostulante()} 
                    subject={`Postulante para capacitación: ${formPostulante.nombre} (Referido de ${formPostulante.referidor})`} 
                    fixedDestinoLabel="Ulrich Klein Montano"
                    fixedDestinoEmail="uklein@grupopaz.com.bo"
                    ccEmails="mfroca@celina.com.bo, rvaca@grupopaz.com.bo, mreyes@celina.com.bo"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
