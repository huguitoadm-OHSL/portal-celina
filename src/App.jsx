import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
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
  Download,
  Printer
} from 'lucide-react';

// --- INICIALIZACIÓN DE BASE DE DATOS EN LA NUBE (FIREBASE) ---
let app, auth, db;

try {
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
  if (firebaseConfig) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn("Firebase config no encontrada. Se usará almacenamiento local.");
  }
} catch (error) {
  console.error("Error inicializando Firebase:", error);
}

// Función robusta para asegurar que la ruta a Firebase siempre sea válida y no rompa la App
const getSafeProyeccionRef = (equipo) => {
  if (!db) return null;
  try {
    const rawAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    let pathStr = `artifacts/${rawAppId}/public/data/proyecciones/${equipo}`;
    const segments = pathStr.split('/').filter(Boolean);
    
    // Firestore requiere estrictamente un número PAR de segmentos para los documentos
    if (segments.length % 2 !== 0) {
      pathStr += '/data';
    }
    
    return doc(db, pathStr);
  } catch (e) {
    console.error("Error generando ruta segura de Firebase:", e);
    return null;
  }
};

// --- CONFIGURACIÓN DE DATOS MOCK ---
const PROYECTOS_CONVENIO_1 = ["Los Jardines", "El Renacer"];
const PROYECTOS_CONVENIO_2 = ["Cañaveral"];
const PROYECTOS_PROPIOS_1 = ["Muyurina", "Santa Fe"];
const PROYECTOS = ["Cañaveral", "El Renacer", "Los Jardines", "Muyurina", "Santa Fe", "OTRO..."];

const SUPERVISORES = [
  { id: 'mreyes', nombre: 'Mauricio Reyes Suarez', correo: 'mreyes@celina.com.bo', genero: 'M', titulo: 'Lic. Mauricio' },
  { id: 'akparada', nombre: 'Ana Karen Parada Vaca', correo: 'akparada@celina.com.bo', genero: 'F', titulo: 'Lic. Ana Karen' },
  { id: 'apinto', nombre: 'Angelica Pinto Sosa', correo: 'apinto@celina.com.bo', genero: 'F', titulo: 'Lic. Angelica' },
  { id: 'falmanza', nombre: 'Fernando Jose Almanza Urquiza', correo: 'falmanza@celina.com.bo', genero: 'M', titulo: 'Lic. Fernando' },
  { id: 'jjsenseve', nombre: 'Jorge Justiniano Senseve', correo: 'jjsenseve@celina.com.bo', genero: 'M', titulo: 'Lic. Jorge' },
  { id: 'ropaz', nombre: 'Roberto Paz Paz', correo: 'ropaz@celina.com.bo', genero: 'M', titulo: 'Lic. Roberto' },
  { id: 'rvalverded', nombre: 'Rene Valverde Duran', correo: 'rvalverded@celina.com.bo', genero: 'M', titulo: 'Lic. Rene' },
  { id: 'cbaldiviezo', nombre: 'Cristhiand Baldiviezo Balcazar', correo: 'cbaldiviezo@celina.com.bo', genero: 'M', titulo: 'Lic. Cristhiand' },
  { id: 'ohsaravia', nombre: 'Oscar Hugo Saravia L.', correo: 'ohsaravia@celina.com.bo', genero: 'M', titulo: 'Lic. Oscar' }
];

// --- EQUIPOS DE ASESORES POR SUPERVISOR ---
const EQUIPOS_ASESORES = {
  "Oscar Saravia": [
    { nombre: "Carlos Enrique Calderon", colAct: 13829.20 },
    { nombre: "Daniel Angulo Maldonado", colAct: 62640.00 },
    { nombre: "Ely Gonzales Garcia", colAct: 0 },
    { nombre: "Gloriana Silva Almenda", colAct: 6600.00 },
    { nombre: "Jaime F. Rios Castro", colAct: 0 },
    { nombre: "Marioly Viñolas", colAct: 0 },
    { nombre: "Marisol Urgel Pizarro", colAct: 58146.00 },
    { nombre: "Merly Mendez Hurtado", colAct: 7750.00 },
    { nombre: "Rodrigo Rojas Siles", colAct: 0 },
    { nombre: "Yocelin Salvatierra", colAct: 7500.00 }
  ],
  "Ana Karen Parada Vaca": [
    { nombre: "Maria Julieta Ortuste", colAct: 106980 },
    { nombre: "Joan Junior Falon", colAct: 52560 },
    { nombre: "Claudia Alejandra Balcazar", colAct: 27068 },
    { nombre: "Ana Lucia Rivero", colAct: 23164 },
    { nombre: "Jose Gabriel Padilla", colAct: 17424 },
    { nombre: "Roberto Aguilar", colAct: 7500 },
    { nombre: "Adrian Pedraza", colAct: 0 },
    { nombre: "Carla Tatiana Ribera", colAct: 0 },
    { nombre: "Helen Jimena Cruz", colAct: 0 },
    { nombre: "Jheraldine Endara", colAct: 0 },
    { nombre: "Karmiña Alejandra Orrego", colAct: 0 },
    { nombre: "Mary Selva Castro", colAct: 0 },
    { nombre: "Milenka Ortiz", colAct: 0 },
    { nombre: "Waldo Gomez", colAct: 0 }
  ],
  "Angelica Pinto Sosa": [
    { nombre: "Jimmy Gonzales", colAct: 24789 },
    { nombre: "Widen Barba", colAct: 20160 },
    { nombre: "Miguel Angel Gomez", colAct: 17781 },
    { nombre: "Carla Yessenia Carumetty", colAct: 17214 },
    { nombre: "Emar Leandro Rivas", colAct: 12850 },
    { nombre: "Rocio Peredo", colAct: 9100 },
    { nombre: "Yohana Avila", colAct: 6900 },
    { nombre: "Maria Gabriela Porcel", colAct: 6900 },
    { nombre: "Diana Mojica", colAct: 0 },
    { nombre: "Herman Jessmany Michel", colAct: 0 },
    { nombre: "Ivana Mendez", colAct: 0 },
    { nombre: "Javier Uriona", colAct: 0 },
    { nombre: "Lucy Milena Gomez", colAct: 0 },
    { nombre: "Paula Alejandra Escalante", colAct: 0 },
    { nombre: "Victoria Roman", colAct: 0 }
  ],
  "Cristhiand Baldiviezo Balcazar": [
    { nombre: "Miguel Rene Rivero", colAct: 17712 },
    { nombre: "Sheila Rubi Sheidl", colAct: 16500 },
    { nombre: "Gabriela Vidal", colAct: 10850 },
    { nombre: "Daniel Mauricio Chipunavi", colAct: 7700 },
    { nombre: "Jimena Mayta", colAct: 7500 },
    { nombre: "Nahely Gonzales", colAct: 6400 },
    { nombre: "Lider Cabral", colAct: 5750 },
    { nombre: "Ana Karla Castro", colAct: 0 },
    { nombre: "Carlos Gaston Camacho", colAct: 0 },
    { nombre: "Delfy Rios", colAct: 0 },
    { nombre: "Oscar Andres Cupary", colAct: 0 },
    { nombre: "Wilson Saucedo", colAct: 0 }
  ],
  "Fernando Jose Almanza Urquiza": [
    { nombre: "Laura Ximena Vallejos", colAct: 30240 },
    { nombre: "Karina Mercedes Molina", colAct: 22409 },
    { nombre: "Diana Perez", colAct: 13709 },
    { nombre: "Hilda Mendoza", colAct: 10368 },
    { nombre: "Blanca Merving Cuellar", colAct: 0 },
    { nombre: "Renata Veronica Guzman", colAct: 0 }
  ],
  "Jorge Justiniano Senseve": [
    { nombre: "Marvin Negrette", colAct: 36770 },
    { nombre: "Juan Pablo Vaca", colAct: 30841 },
    { nombre: "Lino Flores", colAct: 19600 },
    { nombre: "Freddy Fernando Delgadillo", colAct: 15550 },
    { nombre: "Carlos Alberto Chavez", colAct: 7800 },
    { nombre: "German Suarez", colAct: 6000 },
    { nombre: "Alejandra Montero", colAct: 0 },
    { nombre: "Ariel Justiniano", colAct: 0 },
    { nombre: "Daniela Eguez", colAct: 0 },
    { nombre: "Gustavo Adolfo Mendez", colAct: 0 },
    { nombre: "Jose Fernando Ortiz", colAct: 0 },
    { nombre: "Juan Carlos Choque", colAct: 0 },
    { nombre: "Luis Gustavo Huarachi", colAct: 0 },
    { nombre: "Melissa Padilla", colAct: 0 }
  ],
  "Rene Valverde Duran": [
    { nombre: "Luis Enrique Choque", colAct: 221883 },
    { nombre: "Rodrigo Lara", colAct: 53061 },
    { nombre: "Rosa Maria Hurtado", colAct: 25345 },
    { nombre: "Katherine Albitre", colAct: 12600 },
    { nombre: "Andrea Garcia", colAct: 8250 },
    { nombre: "Ghigliola Moreno", colAct: 7200 },
    { nombre: "Carlos Rodas", colAct: 0 },
    { nombre: "Cristian Erick Rocha", colAct: 0 },
    { nombre: "Rodrigo Roca", colAct: 0 },
    { nombre: "Sarah Desiree Cespedes", colAct: 0 }
  ],
  "Roberto Paz Paz": [
    { nombre: "Wilma Limpias", colAct: 49319 },
    { nombre: "Ericka Alejandra Fernandez", colAct: 19680 },
    { nombre: "Nancy Rojas", colAct: 19349 },
    { nombre: "Georgina Alexandra Sejas", colAct: 12600 },
    { nombre: "Yaeli Alvarez", colAct: 9450 },
    { nombre: "Anahi Velasco", colAct: 0 },
    { nombre: "Freimi Maely Subirana", colAct: 0 },
    { nombre: "Heydy Laura Gutierrez", colAct: 0 },
    { nombre: "Madeline Carballo", colAct: 0 },
    { nombre: "Maria Sendy Quispe", colAct: 0 },
    { nombre: "Mariel Becerra", colAct: 0 },
    { nombre: "Samuel Rivero", colAct: 0 }
  ]
};

const OBJETIVOS_MENSUALES = {
  "Oscar Saravia": 250000,
  "Ana Karen Parada Vaca": 515000,
  "Angelica Pinto Sosa": 515000,
  "Cristhiand Baldiviezo Balcazar": 515000,
  "Fernando Jose Almanza Urquiza": 160000,
  "Jorge Justiniano Senseve": 515000,
  "Rene Valverde Duran": 515000,
  "Roberto Paz Paz": 515000
};

const NOMBRES_PROYECTOS_PROYECCION = ["Muyurina", "Renacer", "Santa Fe", "Rancho Nuevo", "Jardines"];

// --- FUNCIONES GLOBALES ---
const formatCurrency = (val) => {
  const numericVal = Number(val) || 0;
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numericVal);
};

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
  return `${dia}-${mes}`;
};

// --- COMPONENTES UI ---
const Input = ({ label, name, value, onChange, placeholder, type = "text", required = false }) => (
  <div className="mb-4 w-full">
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

const ResultCard = ({ title, text, htmlContent, subject, supervisorDestino, setSupervisorDestino, showTextPlain = true, fixedDestinoLabel, fixedDestinoEmail, ccEmails }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      if (htmlContent) {
        const div = document.createElement('div');
        div.innerHTML = String(htmlContent);
        div.style.position = 'fixed';
        div.style.pointerEvents = 'none';
        div.style.opacity = '0';
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
    const to = fixedDestinoEmail || supervisorDestino;
    const ccQuery = ccEmails ? `&cc=${encodeURIComponent(ccEmails)}` : '';
    const instruccionPega = "(Por favor, borra este texto, mantén presionado aquí y selecciona 'Pegar' para insertar la tabla con su formato oficial)";
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}${ccQuery}&body=${encodeURIComponent(instruccionPega)}`;
    
    setTimeout(() => {
      window.location.href = mailtoLink;
    }, 400);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 sticky top-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col h-full max-h-[85vh] min-w-0 w-full">
      <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center tracking-tight">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-2" />
        Vista Previa del Correo
      </h3>

      <div className="mb-5 w-full">
        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Enviar a:</label>
        {fixedDestinoEmail ? (
          <div className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-100/70 text-slate-700 font-semibold shadow-inner truncate text-sm">
            {String(fixedDestinoLabel)} ({String(fixedDestinoEmail)})
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

      {htmlContent && (
        <div className="mb-4 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex gap-3 items-start shadow-sm w-full">
          <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-800 leading-relaxed">
            <strong>Si usas PC:</strong> Haz clic en <b>"Copiar Formato PC"</b> y pega directo en tu gestor de correo.<br/>
            <strong>Si usas Celular:</strong> Usa <b>"Copiar y Abrir Correo"</b> y sigue las instrucciones.
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
          {copied ? '¡Copiado Exitosamente!' : 'Copiar Formato PC'}
        </button>
        {showTextPlain && (
          <button
            onClick={handleOpenEmailApp}
            className="flex-1 flex items-center justify-center py-3 px-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-xl font-bold transition-all shadow-md shadow-slate-900/20 whitespace-nowrap"
          >
            <Mail className="w-4 h-4 mr-2" />
            Copiar y Abrir Correo
          </button>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  // --- INICIALIZACIÓN DE SESIÓN EN LA NUBE ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (auth && typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else if (auth) {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.error("Error al iniciar sesión en la Nube:", e);
      }
    };
    initAuth();
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, setUser);
      return () => unsubscribe();
    }
  }, []);

  // --- FIX PARA PANTALLA COMPLETA ---
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
  
  // --- ESTADOS PARA LA BASE DE DATOS DE LOTES DESDE JSON ---
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
    descuentoPropiosManual: '23' // Estado para el descuento personalizado de proyectos propios
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

  // --- ESTADO Y SINCRONIZACIÓN PARA PROYECCIÓN ---
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('Oscar Saravia');
  const [formProyeccion, setFormProyeccion] = useState({
    equipo: 'Oscar Saravia',
    fechaInicio: new Date().toISOString().split('T')[0],
    objetivoMensual: OBJETIVOS_MENSUALES['Oscar Saravia'],
    asesores: EQUIPOS_ASESORES['Oscar Saravia'].map(a => ({
      nombre: a.nombre, colAct: a.colAct, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0] 
    }))
  });

  // Efecto para inicializar la proyección desde LocalStorage rápidamente y calcular métricas globales
  useEffect(() => {
    // 1. Cargar equipo seleccionado
    const savedData = localStorage.getItem(`portalAsesores_proyeccion_${equipoSeleccionado}`);
    if (savedData) {
      try {
        const pData = JSON.parse(savedData);
        if (pData && Array.isArray(pData.asesores)) {
          setFormProyeccion(pData);
        }
      } catch(e) {
        console.error("Error cargando proyección de localStorage", e);
      }
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

    // 2. Calcular estadísticas del Dashboard Global
    let tGoal = 0;
    let tAct = 0;
    let tTeams = [];

    Object.keys(OBJETIVOS_MENSUALES).forEach(team => {
      let teamGoal = OBJETIVOS_MENSUALES[team];
      let teamAct = 0;
      
      const teamSaved = localStorage.getItem(`portalAsesores_proyeccion_${team}`);
      if (teamSaved) {
        try {
          const tData = JSON.parse(teamSaved);
          teamGoal = typeof tData.objetivoMensual === 'number' ? tData.objetivoMensual : teamGoal;
          if (Array.isArray(tData.asesores)) {
            teamAct = tData.asesores.reduce((sum, a) => {
              const sumDias = Array.isArray(a.dias) ? a.dias.reduce((d1, d2) => d1 + d2, 0) : 0;
              return sum + (Number(a.colAct) || 0) + sumDias;
            }, 0);
          }
        } catch(e){}
      } else if (EQUIPOS_ASESORES[team]) {
        teamAct = EQUIPOS_ASESORES[team].reduce((sum, a) => sum + (Number(a.colAct) || 0), 0);
      }

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

  }, [equipoSeleccionado, activeTab]);

  // Efecto para conectarse a Firebase de forma segura
  useEffect(() => {
    if (!user || !db) return;
    
    // Obtenemos la referencia asegurándonos que sea un formato de Documento válido
    const docRef = getSafeProyeccionRef(equipoSeleccionado);
    if (!docRef) return; 
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.asesores)) {
          setFormProyeccion(data);
          localStorage.setItem(`portalAsesores_proyeccion_${equipoSeleccionado}`, JSON.stringify(data));
        }
      } else {
        const defaultData = {
          equipo: equipoSeleccionado,
          fechaInicio: new Date().toISOString().split('T')[0],
          objetivoMensual: OBJETIVOS_MENSUALES[equipoSeleccionado] || 0,
          asesores: EQUIPOS_ASESORES[equipoSeleccionado] ? EQUIPOS_ASESORES[equipoSeleccionado].map(a => ({
            nombre: a.nombre, colAct: a.colAct, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0] 
          })) : []
        };
        setDoc(docRef, defaultData).catch(e => console.error("Error inicial Firebase:", e));
      }
    }, (error) => {
      console.warn("Aviso Firebase: Sin permisos suficientes. Trabajando en modo LocalStorage.");
    });

    return () => unsubscribe();
  }, [user, equipoSeleccionado]);

  // Función para empujar los cambios locales a Firebase
  const saveProyeccionState = async (newState) => {
    localStorage.setItem(`portalAsesores_proyeccion_${equipoSeleccionado}`, JSON.stringify(newState));
    if (user && db) {
      try {
        const docRef = getSafeProyeccionRef(equipoSeleccionado);
        if (docRef) {
          await setDoc(docRef, newState);
        }
      } catch (error) {
        console.warn("Aviso Firebase: No se guardó en la nube.", error.message);
      }
    }
  };

  // --- CARGAR DATOS DESDE EL ARCHIVO JSON AL INICIAR ---
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

  // --- OBTENER OPCIONES CASCADA (BÚSQUEDA INTELIGENTE) PROTEGIDAS ---
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

  // --- EFECTO DE AUTOCOMPLETADO DE LOTES ---
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


  // --- HANDLERS COMUNES ---
  const handleFisicoChange = (e) => setFormFisico({ ...formFisico, [e.target.name]: e.target.value });
  const handleCuotaChange = (e) => setFormCuota({ ...formCuota, [e.target.name]: e.target.value });
  const handleLlamadaChange = (e) => setFormLlamada({ ...formLlamada, [e.target.name]: e.target.value });
  const handleSeguroChange = (e) => setFormSeguro({ ...formSeguro, [e.target.name]: e.target.value });
  
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
    const newState = { ...formProyeccion, asesores: nuevosAsesores };
    setFormProyeccion(newState);
    saveProyeccionState(newState);
  };
  
  const updateAsesorArrayProyeccion = (index, type, arrayIndex, valStr) => {
    if (!formProyeccion || !Array.isArray(formProyeccion.asesores)) return;
    const nuevosAsesores = [...formProyeccion.asesores];
    nuevosAsesores[index][type][arrayIndex] = parseFloat(valStr) || 0;
    const newState = { ...formProyeccion, asesores: nuevosAsesores };
    setFormProyeccion(newState);
    saveProyeccionState(newState);
  };

  // IMPRIMIR PDF DE LA PROYECCIÓN
  const handlePrintPDF = () => {
    const content = generarHtmlProyeccion();
    const printWindow = window.open('', '', 'width=1000,height=800');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Reporte de Proyección - ${String(formProyeccion.equipo)}</title>
          <style>
            body { padding: 20px; background-color: #fff; font-family: sans-serif; }
            @media print {
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              body { margin: 0; padding: 0; }
              @page { size: landscape; margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <h2 style="color: #002060;">Reporte Oficial de Proyección</h2>
          ${content}
          <script>
            window.onload = function() { 
              setTimeout(function() {
                window.print(); 
                window.close();
              }, 300);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // --- LÓGICA DE DESCUENTOS CAMPAÑAS ---
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
      // Convenios
      let descuentoPorM2 = 0;
      if (modalidad === 'Contado') {
        descuentoPorM2 = PROYECTOS_CONVENIO_1.includes(proyecto) ? 3 : 4; 
      } else if (modalidad === 'Crédito') {
        if (porcentajeCuota >= 3) descuentoPorM2 = 2; 
        else if (porcentajeCuota >= 1.5) descuentoPorM2 = 1; 
      }
      descuentoTotal = descuentoPorM2 * m2Num;
      descuentoTexto = descuentoPorM2 > 0 ? `$${descuentoPorM2} por m²` : '0';

    } else if (PROYECTOS_PROPIOS_1.includes(proyecto)) {
      // Propios
      let porcentaje = 0;
      if (modalidad === 'Contado') {
        porcentaje = 30; 
      } else if (modalidad === 'Crédito') {
        // Lógica Fuerte: Si la cuota es 5% o más (Sin importar la categoría)
        if (porcentajeCuota >= 5) {
          const maxDesc = 23;
          let inputDesc = parseFloat(formDescuento.descuentoPropiosManual);
          if (isNaN(inputDesc)) inputDesc = maxDesc;
          porcentaje = Math.max(0, Math.min(inputDesc, maxDesc));
        } else if (porcentajeCuota >= 1.5) {
          porcentaje = 20; 
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

  const obtenerDatosSupervisor = () => {
    const supervisorSeleccionado = SUPERVISORES.find(s => s.correo === supervisorDestino) || SUPERVISORES[0];
    return {
      saludo: supervisorSeleccionado.genero === 'F' ? 'Estimada' : 'Estimado',
      titulo: supervisorSeleccionado.titulo,
      nombrePila: supervisorSeleccionado.nombre.split(' ')[0] 
    };
  };

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

    return `👋 ${obtenerSaludoTiempo()}\n${saludo} ${titulo},\n\nPor favor le solicito la aplicación del descuento de la campaña vigente del proyecto *${nomProyecto}*:\n\n*📌 DATOS DEL LOTE*\n📐 Superficie: ${formDescuento.m2 || '0'} m²\n💵 Precio M2 Normal: $ ${formatCurrency(formDescuento.precioM2 || 0)}\n💰 *Precio Original: $ ${formatCurrency(vc)}*\n\n*🏷️ APLICACIÓN DE CAMPAÑA*\n✅ Condición: ${descuentoTexto} ${condicionTexto}\n🔥 *Descuento Total: -$ ${formatCurrency(descuentoTotal)}*\n\n*✨ PRECIO FINAL PROMOCIÓN ✨*\n➡️ *Precio Final: $ ${formatCurrency(nuevoPrecioTotal)}*\n➡️ *Precio M2 Final: $ ${formatCurrency(nuevoPrecioM2)}*\n\n*📍 UBICACIÓN*\nUV: ${formDescuento.uv || 'SN'} | MZN: ${formDescuento.manzano || '---'} | LT: ${formDescuento.lote || '---'}\n${catStr ? `🏢 Categoría: ${catStr}\n` : ''}\nQuedo atento a su aprobación para continuar con el proceso de venta.\n\nSaludos cordiales,\n*${formDescuento.asesor || 'Nombre del Asesor'}*`;
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
        const sumDias = Array.isArray(asesor.dias) ? asesor.dias.reduce((a, b) => a + b, 0) : 0;
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

  // --- GENERADORES HTML PARA PC ---
  
  const generarHtmlRecompra = () => {
    const beneficio = calcularBeneficioRecompra();
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    return `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 1200px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px;">${obtenerSaludoTiempo()},</p>
      <p style="margin-top: 0; margin-bottom: 25px;">${saludo} ${nombrePila} por favor su ayuda con el c&oacute;digo de pago por recompra de este cliente, le toca pagar su cuota el <strong>${formRecompra.fechaPago || '[FECHA PAGO]'}</strong> muchas gracias de antemano:</p>
      
      <div style="overflow-x: auto; padding-bottom: 10px; width: 100%; max-width: 100%;">
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; text-align: center; width: 100%; min-width: 1200px; border: 1px solid #000000; color: #000000;">
          <thead>
            <tr>
              <th colspan="8" style="background-color: #ffc000; border: 1px solid #000000; padding: 6px;"><font color="#000000"><b>CONTRATO NUEVO</b></font></th>
              <th colspan="7" style="background-color: #ed7d31; border: 1px solid #000000; padding: 6px;"><font color="#000000"><b>CONTRATO ANTIGUO</b></font></th>
              <th rowspan="2" style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px;"><font color="#000000"><b>VALOR DE<br>CUOTA $</b></font></th>
              <th rowspan="2" style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px;"><font color="#000000"><b>BENEFICIO $</b></font></th>
            </tr>
            <tr>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px;"><font color="#000000"><b>Agencia</b></font></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000"><b>Fecha de<br>venta</b></font></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; min-width: 150px;"><font color="#000000"><b>Nombre</b></font></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000"><b>Contrato</b></font></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000"><b>Se aplico<br>descuento<br>por metro ?</b></font></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000"><b>Cant. De<br>cuotas ya<br>pagadas</b></font></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000"><b>¿Procesado?</b></font></th>
              <th style="background-color: #ffe699; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000"><b>¿Vigente?</b></font></th>

              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; min-width: 150px;"><font color="#000000"><b>Nombre</b></font></th>
              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000"><b>Contrato</b></font></th>
              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000"><b>Fecha de<br>venta</b></font></th>
              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000"><b>Fecha Pago</b></font></th>
              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000"><b>¿Procesado?</b></font></th>
              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000"><b>¿Vigente?</b></font></th>
              <th style="background-color: #fce4d6; border: 1px solid #000000; padding: 6px; min-width: 120px;"><font color="#000000"><b>Patrocinador</b></font></th>
            </tr>
          </thead>
          <tbody>
            <tr style="background-color: #ffffff;">
              <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase;"><font color="#000000">${formRecompra.sucursal || ''}</font></td>
              <td style="border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000">${formRecompra.fechaVentaNuevo || ''}</font></td>
              <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase;"><font color="#000000">${formRecompra.nombreNuevo || ''}</font></td>
              <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase; white-space: nowrap;"><font color="#000000">${formRecompra.contratoNuevo || ''}</font></td>
              <td style="border: 1px solid #000000; padding: 6px;"><font color="#000000">${formRecompra.aplicoDescuento || 'NO'}</font></td>
              <td style="border: 1px solid #000000; padding: 6px;"><font color="#000000">${formRecompra.cuotasPagadas || '0'}</font></td>
              <td style="border: 1px solid #000000; padding: 6px;"><font color="#000000">${formRecompra.procesadoNuevo || 'SI'}</font></td>
              <td style="border: 1px solid #000000; padding: 6px;"><font color="#000000">${formRecompra.vigenteNuevo || 'SI'}</font></td>
              
              <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase;"><font color="#000000">${formRecompra.nombreAntiguo || ''}</font></td>
              <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase; white-space: nowrap;"><font color="#000000">${formRecompra.contratoAntiguo || ''}</font></td>
              <td style="border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000">${formRecompra.fechaVentaAntiguo || ''}</font></td>
              <td style="border: 1px solid #000000; padding: 6px; white-space: nowrap;"><font color="#000000">${formRecompra.fechaPago || ''}</font></td>
              <td style="border: 1px solid #000000; padding: 6px;"><font color="#000000">${formRecompra.procesadoAntiguo || 'SI'}</font></td>
              <td style="border: 1px solid #000000; padding: 6px;"><font color="#000000">${formRecompra.vigenteAntiguo || 'SI'}</font></td>
              <td style="border: 1px solid #000000; padding: 6px; text-transform: uppercase;"><font color="#000000">${formRecompra.patrocinador || ''}</font></td>
              
              <td style="border: 1px solid #000000; padding: 6px;"><font color="#000000">${formRecompra.valorCuota || ''}</font></td>
              <td style="border: 1px solid #000000; padding: 6px;"><font color="#000000"><b>${beneficio}</b></font></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style="margin-top: 25px; margin-bottom: 2px;">Saludos cordiales,</p>
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
        const sumDias = Array.isArray(asesor.dias) ? asesor.dias.reduce((a, b) => a + b, 0) : 0;
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

        const formatVacio = (val) => val === 0 ? '-' : formatCurrency(val);
        const formatDias = (val) => val === 0 ? '-' : val;

        filasAsesoresHtml += `
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; background-color: #ffffff;"><font color="#000000"><b>${i+1}</b></font></td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #ffffff; white-space: nowrap;"><font color="#000000"><b>${String(asesor.nombre || '')}</b></font></td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: right; background-color: #ffffff; white-space: nowrap;"><font color="#000000">${formatVacio(colActNum)}</font></td>
            ${Array.isArray(asesor.dias) ? asesor.dias.map(d => `<td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; background-color: #ffffff;"><font color="#000000">${formatDias(Number(d)||0)}</font></td>`).join('') : ''}
            ${Array.isArray(asesor.proy) ? asesor.proy.map(p => `<td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; background-color: #ffffff;"><font color="#000000"><b>${Number(p)||0}</b></font></td>`).join('') : ''}
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: right; background-color: #ffffff; white-space: nowrap;"><font color="#000000"><b>${formatVacio(sumDias)}</b></font></td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: right; background-color: #ffffff; white-space: nowrap;"><font color="#000000"><b>${formatVacio(totalColMes)}</b></font></td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; background-color: #ffffff;"><font color="#000000"></font></td>
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
    <div style="font-family: Arial, sans-serif; font-size: 13px; color: #333333; text-align: left;">
      <p>${obtenerSaludoTiempo()}</p>
      <p>${saludo} ${nombrePila},</p>
      <p>Adjunto el consolidado de proyecci&oacute;n de ventas semanal del equipo correspondiente a la semana actual.</p>
      
      <div style="overflow-x: auto; width: 100%; max-width: 100%;">
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; margin-top: 15px; width: 100%; min-width: 900px; text-align: left; border-color: #cbd5e1; background-color: #ffffff;">
        <thead>
          <tr>
            <th colspan="3" style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: left;"><font color="#ffffff"><b>Proyeccion Equipo: ${String(formProyeccion.equipo || '')}</b></font></th>
            <th colspan="7" style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: center;"><font color="#ffffff"><b>Ventas</b></font></th>
            <th colspan="5" style="background-color: #92d050; border: 1px solid #92d050; padding: 6px; text-align: center;"><font color="#000000"><b>Proyectos</b></font></th>
            <th rowspan="2" style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: center; vertical-align: bottom;"><font color="#ffffff"><b>Total<br>Proyeccion<br>semanal</b></font></th>
            <th rowspan="2" style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: center; vertical-align: bottom;"><font color="#ffffff"><b>Total<br>colocacion<br>asesor/mes</b></font></th>
            <th rowspan="2" style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: center; vertical-align: bottom;"><font color="#ffffff"><b>Productivo<br>valor = $25.000</b></font></th>
          </tr>
          <tr>
            <th style="background-color: #002060; border: 1px solid #002060; padding: 6px;"></th>
            <th style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: left; white-space: nowrap;"><font color="#ffffff"><b>Asesor</b></font></th>
            <th style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: center; white-space: nowrap;"><font color="#ffffff"><b>Colocacion<br>actual</b></font></th>
            ${[0,1,2,3,4,5,6].map(d => `<th style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: center; white-space: nowrap;"><font color="#ffffff"><b>${formatDiaMes(formProyeccion.fechaInicio, d)}</b></font></th>`).join('')}
            ${NOMBRES_PROYECTOS_PROYECCION.map(p => `<th style="background-color: #92d050; border: 1px solid #92d050; padding: 6px; text-align: center; white-space: nowrap;"><font color="#000000"><b>${String(p)}</b></font></th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${filasAsesoresHtml}
          <tr>
            <td colspan="10" style="border: none; background-color: #ffffff;"></td>
            ${sumProyA.map(p => `<td style="background-color: #8faadc; border: 1px solid #cbd5e1; text-align: center; padding: 6px;"><font color="#000000"><b>${p}</b></font></td>`).join('')}
            <td style="border: none; background-color: #ffffff;"></td>
            <td style="background-color: #f8fafc; border: 1px solid #cbd5e1; text-align: right; padding: 6px; white-space: nowrap;"><font color="#000000"><b>${formatCurrency(sumTotalColMes)}</b></font></td>
            <td style="border: 1px solid #cbd5e1; text-align: center; padding: 6px; background-color: #ffffff;"><font color="#ff0000"><b>0%</b></font></td>
          </tr>
        </tbody>
      </table>
      </div>

      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; margin-top: 20px; width: 350px; text-align: left; border-color: #cbd5e1; background-color: #ffffff;">
        <tr>
          <td style="background-color: #002060; border: 1px solid #002060; padding: 6px;"><font color="#ffffff"><b>Proyeccion ${capMes}</b></font></td>
          <td style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: center;"><font color="#ffffff"><b>-</b></font></td>
          <td style="border: none; background-color: #ffffff;"></td>
        </tr>
        <tr>
          <td style="background-color: #002060; border: 1px solid #002060; padding: 6px;"><font color="#ffffff"><b>Colocacion actual</b></font></td>
          <td style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: right; white-space: nowrap;"><font color="#ffffff"><b>${formatCurrency(sumColAct)}</b></font></td>
          <td style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: center;"><font color="#ffffff"><b>${formatCurrency(porcentajeAvance)}%</b></font></td>
        </tr>
        <tr>
          <td style="background-color: #002060; border: 1px solid #002060; padding: 6px;"><font color="#ffffff"><b>Objetivo ${capMes} ${new Date().getFullYear()}</b></font></td>
          <td style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: right; white-space: nowrap;"><font color="#ffffff"><b>${formatCurrency(objMensual)}</b></font></td>
          <td style="border: none; background-color: #ffffff;"></td>
        </tr>
        <tr>
          <td style="background-color: #002060; border: 1px solid #002060; padding: 6px;"><font color="#ffffff"><b>Colocacion fin de mes</b></font></td>
          <td style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: right; white-space: nowrap;"><font color="#ffffff"><b>${formatCurrency(sumTotalColMes)}</b></font></td>
          <td style="background-color: #002060; border: 1px solid #002060; padding: 6px; text-align: center;"><font color="#ffffff"><b>${formatCurrency(porcentajeFin)}%</b></font></td>
        </tr>
      </table>
      <p style="margin-top: 25px; margin-bottom: 2px;">Saludos cordiales.</p>
    </div>`;
  };

  const generarHtmlLlamada = () => {
    return `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 25px;">Estimada Olivia,</p>
      <p style="margin-bottom: 20px;">Por favor su ayuda con la validaci&oacute;n de llamada de este cliente referido, el cliente menciona que tendr&aacute; tiempo de contestar hoy a las <strong>${formLlamada.horaLlamada || '[HORA]'}</strong>, por favor pido la ayuda de tu equipo para que la puedan llamar a esa hora:</p>
      
      <p style="margin-bottom: 5px; color: #555555;">Cliente referido:</p>
      <p style="margin-top: 0; margin-bottom: 15px; font-weight: bold; font-size: 15px; color: #000000;">${formLlamada.nombreReferido || '[NOMBRE REFERIDO]'} - Contrato: ${formLlamada.contratoReferido || '[CONTRATO]'} - Celular: ${formLlamada.celularReferido || '[CELULAR]'}</p>
      
      <p style="margin-bottom: 5px; color: #555555;">Cliente beneficiaria:</p>
      <p style="margin-top: 0; margin-bottom: 25px; font-weight: bold; font-size: 15px; color: #000000;">${formLlamada.nombreBeneficiario || '[NOMBRE BENEFICIARIA]'}, ${formLlamada.ciBeneficiario || '[CI BENEFICIARIA]'}</p>
      
      <p style="margin-top: 0; margin-bottom: 2px;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formLlamada.asesor || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarHtmlSeguro = () => {
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    const cant = formSeguro.beneficiarios.length;
    let filas = "";
    formSeguro.beneficiarios.forEach(b => {
      filas += `<tr style="background-color: #ffffff;"><td style="border: 1px solid #cbd5e1; padding: 8px 12px; font-weight: bold;"><font color="#000000">${b.nombre || '---'}</font></td><td style="border: 1px solid #cbd5e1; padding: 8px 12px;"><font color="#000000">${b.parentesco || '---'}</font></td><td style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: center;"><font color="#000000">${b.porcentaje ? b.porcentaje + '%' : '---'}</font></td><td style="border: 1px solid #cbd5e1; padding: 8px 12px;"><font color="#000000">${b.ci || '---'}</font></td></tr>`;
    });

    return `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 20px;">${saludo} ${nombrePila},</p>
      <p style="margin-bottom: 20px;">Por favor tu ayuda adicionando a estos ${cant} beneficiarios al seguro de vida de esta venta, detallo todo a continuaci&oacute;n:</p>
      
      <p style="margin-bottom: 5px;"><strong>Cliente(s):</strong> ${formSeguro.cliente || '[Nombre del Cliente]'}</p>
      <p style="margin-bottom: 5px; margin-top: 0;"><strong>Nro. Contrato:</strong> ${formSeguro.nroContrato || '[Nro]'}</p>
      <p style="margin-bottom: 20px; margin-top: 0;"><strong>UV:</strong> ${formSeguro.uv || 'SN'} &nbsp;&nbsp;&nbsp;<strong>MZN:</strong> ${formSeguro.manzano || 'SN'} &nbsp;&nbsp;&nbsp;<strong>LOTE:</strong> ${formSeguro.lote || 'SN'}</p>

      <p style="margin-bottom: 10px; font-weight: bold;">Beneficiarios del seguro ${cant} personas:</p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; border: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 13px; margin-bottom: 25px; width: 100%; text-align: left; background-color: #ffffff;">
        <thead><tr style="background-color: #f8fafc;"><th style="border: 1px solid #cbd5e1; padding: 8px 12px;"><font color="#0f172a"><b>NOMBRE</b></font></th><th style="border: 1px solid #cbd5e1; padding: 8px 12px;"><font color="#0f172a"><b>PARENTESCO</b></font></th><th style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: center;"><font color="#0f172a"><b>%</b></font></th><th style="border: 1px solid #cbd5e1; padding: 8px 12px;"><font color="#0f172a"><b>CI.</b></font></th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      
      <p style="margin-bottom: 25px;">Much&iacute;simas gracias de antemano.</p>
      <p style="margin-top: 0; margin-bottom: 2px;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formSeguro.asesor || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarHtmlFisico = () => {
    const { saludo, titulo } = obtenerDatosSupervisor();
    return `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 25px;">${saludo} ${titulo},</p>
      <p style="margin-bottom: 20px;">Por medio de la presente, solicito el cambio de contrato digital a f&iacute;sico para el siguiente cliente:</p>
      <ul style="margin-bottom: 20px; list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 5px;">- <strong>Nombre del Cliente:</strong> ${formFisico.nombre || '[Nombre]'}</li>
        <li style="margin-bottom: 5px;">- <strong>N&uacute;mero de Carnet (CI):</strong> ${formFisico.ci || '[CI]'}</li>
        <li style="margin-bottom: 5px;">- <strong>N&uacute;mero de Contrato:</strong> ${formFisico.contrato || '[Nro Contrato]'}</li>
      </ul>
      <p style="margin-bottom: 5px;"><strong>Motivo de la solicitud:</strong></p>
      <p style="margin-bottom: 20px;">${formFisico.motivo || '[Describa el motivo...]'}</p>
      <p style="margin-bottom: 25px;">Quedo atento a la confirmaci&oacute;n.</p>
      <p style="margin-top: 0; margin-bottom: 2px;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formFisico.asesor || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarHtmlDescuento = () => {
    const { vc, descuentoTotal, descuentoTexto, nuevoPrecioTotal, nuevoPrecioM2, porcentajeCuota } = calcularDescuento();
    const { saludo, titulo } = obtenerDatosSupervisor();
    const nomProyecto = formDescuento.proyecto === 'OTRO...' ? (formDescuento.proyectoManual || 'PROYECTO MANUAL') : formDescuento.proyecto;
    let condicionTexto = formDescuento.modalidad === 'Crédito' ? `con cuota inicial del ${formatCurrency(porcentajeCuota)}% venta a plazos` : `venta al contado`;

    return `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #1e293b; max-width: 650px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 25px;">${saludo} ${titulo},</p>
      <p style="margin-bottom: 20px;">Por favor le solicito mediante el presente correo, la aplicaci&oacute;n del descuento correspondiente a la campa&ntilde;a vigente del proyecto ${nomProyecto}: ${descuentoTexto} ${condicionTexto}:</p>

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
                <tr><td style="padding: 20px 20px 10px 20px; font-size: 12px; font-weight: bold; color: #cbd5e1; text-transform: uppercase;"><font color="#cbd5e1">Precio M2 a Aplicar</font></td>
                   <td align="right" style="padding: 20px 20px 10px 20px; font-size: 26px; font-weight: bold; color: #34d399;"><font color="#34d399">$${formatCurrency(nuevoPrecioM2)}</font></td></tr>
                <tr><td colspan="2" style="padding: 0 20px 20px 20px;">
                      <div style="background-color: #1e293b; padding: 10px; border-radius: 6px; text-align: center; font-size: 11px; font-family: monospace; color: #94a3b8; letter-spacing: 1px;">
                         UV <strong style="color: #ffffff;">${formDescuento.uv || 'SN'}</strong> &nbsp;&bull;&nbsp; MZN <strong style="color: #ffffff;">${formDescuento.manzano || '-'}</strong> &nbsp;&bull;&nbsp; LT <strong style="color: #ffffff;">${formDescuento.lote || '-'}</strong>
                         ${formDescuento.categoria ? `<br><span style="color: #38bdf8; display: inline-block; margin-top: 6px; font-weight: bold;">CATEGORÍA: ${String(formDescuento.categoria).toUpperCase()}</span>` : ''}
                      </div>
                   </td></tr>
             </table>
          </td></tr>
      </table>
      <p style="margin-top: 25px; margin-bottom: 5px;">Quedo atento a su aprobaci&oacute;n para continuar con el proceso del cierre de la venta.</p>
      <p style="margin-top: 0; margin-bottom: 2px;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #0f172a;">${formDescuento.asesor || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarHtmlCuota = () => {
    const { saludo, titulo } = obtenerDatosSupervisor();
    return `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 25px;">${saludo} ${titulo},</p>
      <p style="margin-bottom: 20px;">Por favor su autorizaci&oacute;n para proceder con la anulaci&oacute;n del contrato actual del cliente <strong>${formCuota.cliente || '[Nombre del Cliente]'}</strong> y realizar un reingreso. El motivo de esta gesti&oacute;n es que el cliente desea incrementar significativamente su cuota inicial para reducir sus pagos mensuales.</p>
      <p style="margin-bottom: 10px;">A continuaci&oacute;n, detallo los datos de la operaci&oacute;n actual en sistema:</p>
      <ul style="margin-bottom: 20px; list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 5px;">- <strong>Nro. Contrato:</strong> ${formCuota.nroContrato || '[Nro]'}</li>
        <li style="margin-bottom: 5px;">- <strong>Carnet (CI):</strong> ${formCuota.ci || '[CI]'}</li>
        <li style="margin-bottom: 5px;">- <strong>Ubicaci&oacute;n:</strong> Proyecto ${formCuota.proyecto} | UV ${formCuota.uv || '[X]'} | MZN ${formCuota.manzano || '[X]'} | LOTE ${formCuota.lote || '[X]'}</li>
      </ul>
      <p style="margin-bottom: 5px;"><strong>Motivos del Reingreso / Observaciones:</strong></p>
      <p style="margin-bottom: 20px;">${formCuota.motivo || '[Detalle el motivo del incremento...]'}</p>
      <p style="margin-bottom: 25px;">Quedo atento a su aprobaci&oacute;n para proceder.</p>
      <p style="margin-top: 0; margin-bottom: 2px;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formCuota.asesorVentas || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarHtmlReenvio = () => {
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    let filas = "";
    formReenvio.contratos.forEach(c => {
      filas += `<tr style="background-color: #ffffff;"><td style="border: 1px solid #333333; padding: 6px 8px; font-weight: bold;"><font color="#000000">${c.nroContrato || '---'}</font></td><td style="border: 1px solid #333333; padding: 6px 8px;"><font color="#000000">${c.cliente || '---'}</font></td><td style="border: 1px solid #333333; padding: 6px 8px;"><font color="#000000">${c.ci || '---'}</font></td><td style="border: 1px solid #333333; padding: 6px 8px;"><font color="#000000">UV: ${c.uv || 'SN'} - Mzn: ${c.manzano || '-'} - Lote: ${c.lote || '-'}</font></td></tr>`;
    });
    const esMultiple = formReenvio.contratos.length > 1;
    return `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
      <p style="margin-bottom: 5px;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 25px;">${saludo} ${nombrePila},</p>
      <p style="margin-bottom: 20px;">Te escribo para solicitar tu apoyo habilitando nuevamente el env&iacute;o del correo para la firma digital de ${esMultiple ? "los siguientes contratos" : "el siguiente contrato"}. Debido a un error involuntario por parte de ${esMultiple ? "los clientes" : "el cliente"}, el proceso no se pudo completar en la primera instancia.</p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; border: 1px solid #333333; font-family: Arial, sans-serif; font-size: 13px; margin-bottom: 25px; width: 100%; text-align: left; background-color: #ffffff;">
        <thead><tr style="background-color: #f2f2f2;"><th style="border: 1px solid #333333; padding: 6px 8px;"><font color="#000000"><b>Nro. Contrato</b></font></th><th style="border: 1px solid #333333; padding: 6px 8px;"><font color="#000000"><b>Cliente</b></font></th><th style="border: 1px solid #333333; padding: 6px 8px;"><font color="#000000"><b>Carnet (CI)</b></font></th><th style="border: 1px solid #333333; padding: 6px 8px;"><font color="#000000"><b>Ubicaci&oacute;n</b></font></th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      <p style="margin-bottom: 25px;">Quedo atento a tu confirmaci&oacute;n para proceder con la regularizaci&oacute;n.</p>
      <p style="margin-top: 0; margin-bottom: 2px;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333333;">${formReenvio.asesor || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex flex-col md:flex-row font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col shadow-2xl z-20 shrink-0 border-r border-slate-800/50">
        <div className="p-7">
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
            <Building2 className="w-7 h-7 mr-2 text-blue-400" />
            Portal Asesores
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 font-medium tracking-wide">Herramientas de Gestión</p>
          <p className="text-indigo-400/80 text-[10px] mt-2 font-bold tracking-widest uppercase">Diseñado por Oscar Saravia &reg;</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5 mr-3" /> Inicio
          </button>

          <div className="pt-5 pb-2"><p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gerencia</p></div>
          <button onClick={() => { setActiveTab('proyeccion'); setSupervisorDestino('mreyes@celina.com.bo'); }} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'proyeccion' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <BarChart className="w-5 h-5 mr-3" /> Proyección Semanal
          </button>
          
          <div className="pt-5 pb-2"><p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trámites Generales</p></div>
          <button onClick={() => setActiveTab('llamada')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'llamada' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <PhoneCall className="w-5 h-5 mr-3" /> Validación Llamada
          </button>
          <button onClick={() => setActiveTab('fisico')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'fisico' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <FileText className="w-5 h-5 mr-3" /> Contrato Físico
          </button>
          <button onClick={() => setActiveTab('reenvio')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'reenvio' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <FileSignature className="w-5 h-5 mr-3" /> Reenvío Firma Digital
          </button>
          <button onClick={() => setActiveTab('seguro')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'seguro' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Shield className="w-5 h-5 mr-3" /> Seguro de Vida
          </button>

          <div className="pt-5 pb-2"><p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cotizaciones y Recompras</p></div>
          <button onClick={() => setActiveTab('recompra')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'recompra' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Repeat className="w-5 h-5 mr-3" /> Recompra
          </button>
          <button onClick={() => setActiveTab('descuento')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'descuento' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Tag className="w-5 h-5 mr-3" /> Descuentos Campañas
          </button>
          <button onClick={() => setActiveTab('cuota')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'cuota' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <TrendingUp className="w-5 h-5 mr-3" /> Inc. Cuota Inicial
          </button>

        </nav>
        
        <div className="p-5 border-t border-slate-800/50 bg-slate-950/30">
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
      <div className="flex-1 overflow-auto p-6 md:p-10 w-full">
        <div className="max-w-[1600px] mx-auto w-full">
          
          {/* DASHBOARD VIEW (NUEVO CON GRÁFICOS) */}
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
                        setFormProyeccion(newState);
                        saveProyeccionState(newState);
                      }} className="w-full px-3 py-1.5 mt-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                    <div className="w-full sm:w-40">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Objetivo Mes</label>
                      <input type="number" value={formProyeccion.objetivoMensual} onChange={(e) => {
                        const newState = {...formProyeccion, objetivoMensual: parseFloat(e.target.value) || 0};
                        setFormProyeccion(newState);
                        saveProyeccionState(newState);
                      }} className="w-full px-3 py-1.5 mt-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap">
                      <thead>
                        <tr>
                          <th rowSpan="2" className="bg-[#002060] text-white p-2 border border-slate-400">Asesor</th>
                          <th rowSpan="2" className="bg-[#002060] text-white p-2 border border-slate-400 text-center leading-tight">Colocación<br/>Actual</th>
                          <th colSpan="7" className="bg-[#002060] text-white p-2 border border-slate-400 text-center">Ventas / Proyección Diaria</th>
                          <th colSpan="5" className="bg-[#92d050] text-black p-2 border border-slate-400 text-center">Proyectos</th>
                        </tr>
                        <tr>
                          {[0,1,2,3,4,5,6].map(d => <th key={d} className="bg-[#002060] text-white p-2 border border-slate-400 text-center font-normal">{String(formatDiaMes(formProyeccion.fechaInicio, d))}</th>)}
                          {NOMBRES_PROYECTOS_PROYECCION.map(p => <th key={p} className="bg-[#92d050] text-black p-2 border border-slate-400 text-center font-normal">{String(p)}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(formProyeccion.asesores) && formProyeccion.asesores.map((asesor, i) => (
                          <tr key={i} className="hover:bg-blue-50/50">
                            <td className="p-2 border border-slate-300 font-medium text-slate-800">{i+1}. {String(asesor.nombre || '')}</td>
                            <td className="p-1 border border-slate-300">
                              <input type="number" value={asesor.colAct === 0 ? '' : asesor.colAct} onChange={(e) => updateAsesorProyeccion(i, 'colAct', e.target.value)} className="w-full min-w-[60px] p-1 text-right text-xs bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-400 rounded" placeholder="0" />
                            </td>
                            {Array.isArray(asesor.dias) && asesor.dias.map((diaVal, dIdx) => (
                              <td key={dIdx} className="p-1 border border-slate-300">
                                <input type="number" value={diaVal === 0 ? '' : diaVal} onChange={(e) => updateAsesorArrayProyeccion(i, 'dias', dIdx, e.target.value)} className="w-full min-w-[40px] p-1 text-center text-xs bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-400 rounded" placeholder="-" />
                              </td>
                            ))}
                            {Array.isArray(asesor.proy) && asesor.proy.map((proyVal, pIdx) => (
                              <td key={pIdx} className="p-1 border border-slate-300 bg-green-50/30">
                                <input type="number" value={proyVal === 0 ? '' : proyVal} onChange={(e) => updateAsesorArrayProyeccion(i, 'proy', pIdx, e.target.value)} className="w-full min-w-[40px] p-1 text-center text-xs font-bold text-slate-700 bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-400 rounded" placeholder="0" />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                     <span className="flex items-center"><Info className="w-4 h-4 mr-2 flex-shrink-0" /> Todo lo que se escriba aquí se guardará en la Nube y todos podrán verlo.</span>
                     <button onClick={handlePrintPDF} className="flex items-center text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 transition-all"><Download className="w-4 h-4 mr-1.5" /> Exportar PDF</button>
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
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate
