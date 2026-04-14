import React, { useState, useEffect } from 'react';
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
  Edit3
} from 'lucide-react';

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
  { id: 'rvaca', nombre: 'Robert Vaca', correo: 'rvaca@grupopaz.com.bo', genero: 'M', titulo: 'Lic. Robert' },
  { id: 'lbakovic', nombre: 'Lucio Bakovic', correo: 'lbakovic@grupopaz.com.bo', genero: 'M', titulo: 'Lic. Lucio' },
  { id: 'vchoque', nombre: 'Verenice Choque', correo: 'vchoque@celina.com.bo', genero: 'F', titulo: 'Lic. Verenice' },
  { id: 'gcuenca', nombre: 'Gabriel Cuenca', correo: 'gcuenca@celina.com.bo', genero: 'M', titulo: 'Lic. Gabriel' },
  { id: 'ohsaravia', nombre: 'Oscar Hugo Saravia L.', correo: 'ohsaravia@celina.com.bo', genero: 'M', titulo: 'Lic. Oscar' }
];

// --- EQUIPOS DE ASESORES POR SUPERVISOR ---
const EQUIPOS_ASESORES = {
  "Oscar Saravia": [
    { nombre: "Marisol Urgel", colAct: 42024 },
    { nombre: "Carlos Enrique Calderon", colAct: 13829 },
    { nombre: "Gloriana Silva", colAct: 13200 },
    { nombre: "Ely Gonzales", colAct: 0 },
    { nombre: "Jaime Fabricio Rios", colAct: 0 },
    { nombre: "Leonardo Santiago Gonzales", colAct: 0 },
    { nombre: "Marioly Viñolas", colAct: 0 },
    { nombre: "Merly Mendez", colAct: 0 },
    { nombre: "Nataly Heredia", colAct: 0 },
    { nombre: "Rodrigo Rojas", colAct: 0 }
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
const formatCurrency = (val) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

const obtenerSaludoTiempo = () => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return 'Buenos días';
  if (hora >= 12 && hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

const formatDiaMes = (fechaIso, sumarDias = 0) => {
  if (!fechaIso) return `Día ${sumarDias + 1}`;
  const partes = fechaIso.split('-');
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
  <div className="mb-5">
    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 placeholder-slate-400 shadow-sm"
    />
  </div>
);

const TextArea = ({ label, name, value, onChange, placeholder }) => (
  <div className="mb-5">
    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows="4"
      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 placeholder-slate-400 shadow-sm resize-none"
    />
  </div>
);

const ResultCard = ({ title, text, htmlContent, subject, supervisorDestino, setSupervisorDestino, showTextPlain = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      if (htmlContent) {
        const div = document.createElement('div');
        div.innerHTML = htmlContent;
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
        textArea.value = text;
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

  const handleSendEmail = () => {
    const mailtoLink = `mailto:${supervisorDestino}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 sticky top-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center tracking-tight">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-2" />
        Vista Previa del Correo
      </h3>

      <div className="mb-5">
        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Enviar consolidado a:</label>
        <select 
          value={supervisorDestino}
          onChange={(e) => setSupervisorDestino(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 text-slate-800 font-semibold shadow-sm cursor-pointer"
        >
          {SUPERVISORES.map(s => (
            <option key={s.id} value={s.correo}>{s.nombre} ({s.correo})</option>
          ))}
        </select>
      </div>

      {htmlContent && (
        <div className="mb-4 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex gap-3 items-start shadow-sm">
          <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-800 leading-relaxed">
            <strong>Recomendado:</strong> Usa <b>"Copiar Formato Correo"</b> y pégalo directamente en tu gestor de correo para enviar la tabla con su dise&ntilde;o profesional y alineaci&oacute;n justificada.
          </p>
        </div>
      )}

      <div className="bg-[#f8fafc] p-5 rounded-xl border border-slate-200 mb-5 h-[22rem] overflow-y-auto shadow-inner">
        {htmlContent ? (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        ) : (
          <div className="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{text}</div>
        )}
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold transition-all shadow-sm"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2 text-slate-400" />}
          {copied ? '¡Copiado!' : (htmlContent ? 'Copiar Formato' : 'Copiar Texto')}
        </button>
        {showTextPlain && (
          <button
            onClick={handleSendEmail}
            className="flex-1 flex items-center justify-center py-3 px-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-xl font-bold transition-all shadow-md shadow-slate-900/20"
          >
            <Mail className="w-4 h-4 mr-2" />
            Texto Plano
          </button>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('proyeccion');
  const [supervisorDestino, setSupervisorDestino] = useState(SUPERVISORES[0].correo);
  
  // --- ESTADOS PARA LA BASE DE DATOS DE LOTES DESDE JSON ---
  const [lotesBD, setLotesBD] = useState([]);
  const [cargandoLotes, setCargandoLotes] = useState(true);
  const [loteAutocompletado, setLoteAutocompletado] = useState(false);

  const [formFisico, setFormFisico] = useState({
    nombre: '', ci: '', contrato: '', motivo: '', asesor: ''
  });

  const [formDescuento, setFormDescuento] = useState({
    proyecto: 'El Renacer', uv: '', manzano: '', lote: '', 
    modalidad: 'Crédito', 
    cuota: '', modoCuota: 'monto',
    modoBusqueda: 'manual', // Iniciará en manual por defecto hasta que cargue el JSON
    m2: '', precioM2: '', categoria: '', asesor: '',
    proyectoManual: '', descuentoManual: '', tipoDescuentoManual: 'porcentaje'
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

  const [formProyeccion, setFormProyeccion] = useState({
    equipo: 'Oscar Saravia',
    fechaInicio: new Date().toISOString().split('T')[0], // Hoy
    objetivoMensual: OBJETIVOS_MENSUALES['Oscar Saravia'],
    asesores: EQUIPOS_ASESORES["Oscar Saravia"].map(a => ({
      nombre: a.nombre, colAct: a.colAct, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0] 
    }))
  });

  // --- CARGAR DATOS DESDE EL ARCHIVO JSON AL INICIAR ---
  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await fetch('./lotes.json');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            // NORMALIZACIÓN MÁGICA: Adaptamos las llaves del JSON a lo que la app espera, 
            // sin importar si vienen en mayúsculas, minúsculas o con otros nombres.
            const lotesLimpios = data.map(item => {
              // 1. Limpiar nombre del proyecto
              const rawProy = String(item.proyecto || item.PROYECTO || '').toUpperCase();
              let proyLimpio = rawProy;
              if (rawProy.includes("RENACER")) proyLimpio = "El Renacer";
              else if (rawProy.includes("JARDINES")) proyLimpio = "Los Jardines";
              else if (rawProy.includes("MUYURINA")) proyLimpio = "Muyurina";
              else if (rawProy.includes("SANTA FE")) proyLimpio = "Santa Fe";
              else if (rawProy.includes("CAÑAVERAL") || rawProy.includes("CANAVERAL")) proyLimpio = "Cañaveral";

              // 2. Limpiar números (cambiar coma por punto y convertir a número decimal)
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

  // --- OBTENER OPCIONES CASCADA (BÚSQUEDA INTELIGENTE) CON PROTECCIÓN DE ERRORES ---
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

  // MANEJADOR ESPECIAL PARA DESCUENTOS (LIMPIA CASCADAS EN MODO INTELIGENTE)
  const handleDescuentoChange = (e) => {
    const { name, value } = e.target;
    setFormDescuento(prev => {
      const newState = { ...prev, [name]: value };
      
      if (name === 'proyecto' && value === 'OTRO...') {
        newState.modoBusqueda = 'manual';
      }
      
      // Si estamos en búsqueda inteligente, debemos limpiar los campos hijos cuando un padre cambia
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
    const nuevoEquipo = e.target.value;
    const nuevosAsesores = EQUIPOS_ASESORES[nuevoEquipo].map(a => ({
      nombre: a.nombre, colAct: a.colAct, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0]
    }));
    setFormProyeccion({ ...formProyeccion, equipo: nuevoEquipo, asesores: nuevosAsesores, objetivoMensual: OBJETIVOS_MENSUALES[nuevoEquipo] || 0 });
  };
  const updateAsesorProyeccion = (index, field, valStr) => {
    const nuevosAsesores = [...formProyeccion.asesores];
    nuevosAsesores[index][field] = parseFloat(valStr) || 0;
    setFormProyeccion({ ...formProyeccion, asesores: nuevosAsesores });
  };
  const updateAsesorArrayProyeccion = (index, type, arrayIndex, valStr) => {
    const nuevosAsesores = [...formProyeccion.asesores];
    nuevosAsesores[index][type][arrayIndex] = parseFloat(valStr) || 0;
    setFormProyeccion({ ...formProyeccion, asesores: nuevosAsesores });
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
      let porcentaje = 0;
      if (modalidad === 'Contado') {
        porcentaje = 30;
      } else if (modalidad === 'Crédito') {
        if (porcentajeCuota >= 1.5) porcentaje = 20;
      }
      descuentoTotal = vc * (porcentaje / 100);
      descuentoTexto = porcentaje > 0 ? `${porcentaje}%` : '0%';
    }

    const nuevoPrecioTotal = vc - descuentoTotal;
    const nuevoPrecioM2 = m2Num > 0 ? nuevoPrecioTotal / m2Num : 0;

    return { vc, descuentoTotal, descuentoTexto, nuevoPrecioTotal, nuevoPrecioM2, porcentajeCuota, montoCuotaNum };
  };

  const obtenerDatosSupervisor = () => {
    const supervisorSeleccionado = SUPERVISORES.find(s => s.correo === supervisorDestino) || SUPERVISORES[0];
    return {
      saludo: supervisorSeleccionado.genero === 'F' ? 'Estimada' : 'Estimado',
      titulo: supervisorSeleccionado.titulo,
      nombrePila: supervisorSeleccionado.nombre.split(' ')[0] 
    };
  };

  // --- GENERADORES DE TEXTOS Y HTML ---
  const generarTextoFisico = () => {
    const { saludo, titulo } = obtenerDatosSupervisor();
    return `${obtenerSaludoTiempo()}\n${saludo} ${titulo},\n\nPor medio de la presente, solicito el cambio de contrato digital a físico para el siguiente cliente:\n\n- Nombre del Cliente: ${formFisico.nombre || '[Nombre]'}\n- Número de Carnet (CI): ${formFisico.ci || '[CI]'}\n- Número de Contrato: ${formFisico.contrato || '[Nro Contrato]'}\n\nMotivo de la solicitud:\n${formFisico.motivo || '[Describa el motivo...]'}\n\nQuedo atento a la confirmación. \n\nSaludos cordiales,\n${formFisico.asesor || '[Nombre del Asesor]'}`;
  };

  const generarHtmlFisico = () => {
    const { saludo, titulo } = obtenerDatosSupervisor();
    return `
    <div style="font-family: 'Aptos', Arial, sans-serif; font-size: 14px; color: #333; max-width: 800px; line-height: 1.5; text-align: justify;">
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
      <p style="margin-top: 0; font-weight: bold; color: #333;">${formFisico.asesor || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarTextoDescuento = () => {
    const { vc, descuentoTotal, descuentoTexto, nuevoPrecioTotal, nuevoPrecioM2, porcentajeCuota } = calcularDescuento();
    const { saludo, titulo } = obtenerDatosSupervisor();
    const mesActual = new Date().toLocaleString('es-ES', { month: 'long' });
    let condicionTexto = formDescuento.modalidad === 'Crédito' ? `con cuota inicial del ${formatCurrency(porcentajeCuota)}% venta a plazos` : `venta al contado`;
    const nomProyecto = formDescuento.proyecto === 'OTRO...' ? (formDescuento.proyectoManual || 'PROYECTO MANUAL') : formDescuento.proyecto;
    const catStr = formDescuento.categoria ? String(formDescuento.categoria).toUpperCase() : '';

    return `${obtenerSaludoTiempo()}\n${saludo} ${titulo},\n\nPor favor le solicito mediante el presente correo, la aplicación del descuento correspondiente a la campaña mes de ${mesActual} proyecto ${nomProyecto}: ${descuentoTexto} ${condicionTexto}:\n\n------------------------------------------------------------\n• Superficie:             ${formDescuento.m2 || '0'} m²\n• Precio M2:              $ ${formatCurrency(formDescuento.precioM2 || 0)}\n• Precio Original:        $ ${formatCurrency(vc)}\n------------------------------------------------------------\n• Condición (${nomProyecto}): ${descuentoTexto}  [-$ ${formatCurrency(descuentoTotal)}]\n• Total Valor Contrato (VC):   $ ${formatCurrency(vc)}\n• Total Dscto Campañas:       -$ ${formatCurrency(descuentoTotal)}\n------------------------------------------------------------\n• Nuevo Precio Promoción:      $ ${formatCurrency(nuevoPrecioTotal)}\n\nPRECIO M2 A APLICAR:        $ ${formatCurrency(nuevoPrecioM2)}\nUV ${formDescuento.uv || 'SN'} • MZN ${formDescuento.manzano || '---'} • LT ${formDescuento.lote || '---'}\n${catStr ? `CATEGORÍA: ${catStr}\n\n` : '\n'}Quedo atento a su aprobación para continuar con el proceso del cierre de la venta.\n\nSaludos cordiales,\n${formDescuento.asesor || '[Nombre del Asesor]'}`;
  };

  const generarHtmlDescuento = () => {
    const { vc, descuentoTotal, descuentoTexto, nuevoPrecioTotal, nuevoPrecioM2, porcentajeCuota } = calcularDescuento();
    const { saludo, titulo } = obtenerDatosSupervisor();
    const mesActual = new Date().toLocaleString('es-ES', { month: 'long' });
    let condicionTexto = formDescuento.modalidad === 'Crédito' ? `con cuota inicial del ${formatCurrency(porcentajeCuota)}% venta a plazos` : `venta al contado`;
    const nomProyecto = formDescuento.proyecto === 'OTRO...' ? (formDescuento.proyectoManual || 'PROYECTO MANUAL') : formDescuento.proyecto;

    return `
    <div style="font-family: 'Aptos', Arial, sans-serif; font-size: 14px; color: #1e293b; max-width: 650px; line-height: 1.5; text-align: justify;">
      <p style="margin-bottom: 5px;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 25px;">${saludo} ${titulo},</p>
      <p style="margin-bottom: 20px;">Por favor le solicito mediante el presente correo, la aplicaci&oacute;n del descuento correspondiente a la campa&ntilde;a mes de ${mesActual} proyecto ${nomProyecto}: ${descuentoTexto} ${condicionTexto}:</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-family: 'Aptos', Arial, sans-serif; overflow: hidden; text-align: left;">
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
                <tr><td style="padding: 20px 20px 10px 20px; font-size: 12px; font-weight: bold; color: #cbd5e1; text-transform: uppercase;">Precio M2 a Aplicar</td>
                   <td align="right" style="padding: 20px 20px 10px 20px; font-size: 26px; font-weight: bold; color: #34d399;">$${formatCurrency(nuevoPrecioM2)}</td></tr>
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

  const generarTextoCuota = () => {
    const { saludo, titulo } = obtenerDatosSupervisor();
    return `${obtenerSaludoTiempo()}\n${saludo} ${titulo},\n\nPor favor su autorización para proceder con la anulación del contrato actual del cliente ${formCuota.cliente || '[Nombre del Cliente]'} y realizar un reingreso. El motivo de esta gestión es que el cliente desea incrementar significativamente su cuota inicial para reducir sus pagos mensuales.\n\nA continuación, detallo los datos de la operación actual en sistema:\n\n- Nro. Contrato:       ${formCuota.nroContrato || '[Nro]'}\n- Carnet (CI):         ${formCuota.ci || '[CI]'}\n- Ubicación:           Proyecto ${formCuota.proyecto} | UV ${formCuota.uv || '[X]'} | MZN ${formCuota.manzano || '[X]'} | LOTE ${formCuota.lote || '[X]'}\n\nMotivos del Reingreso / Observaciones:\n${formCuota.motivo || '[Detalle el motivo del incremento...]'}\n\nQuedo atento a su aprobación para proceder.\n\nSaludos cordiales,\n${formCuota.asesorVentas || '[Nombre del Asesor]'}`;
  };

  const generarHtmlCuota = () => {
    const { saludo, titulo } = obtenerDatosSupervisor();
    return `
    <div style="font-family: 'Aptos', Arial, sans-serif; font-size: 14px; color: #333; max-width: 800px; line-height: 1.5; text-align: justify;">
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
      <p style="margin-top: 0; font-weight: bold; color: #333;">${formCuota.asesorVentas || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarTextoReenvio = () => {
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    let listaContratos = "";
    formReenvio.contratos.forEach(c => {
      listaContratos += `- Contrato: ${c.nroContrato || '[Nro]'} | Cliente: ${c.cliente || '[Nombre]'} | CI: ${c.ci || '[CI]'} | Ubicación: UV: ${c.uv || 'SN'} - Mzn: ${c.manzano || '-'} - Lote: ${c.lote || '-'}\n`;
    });

    const esMultiple = formReenvio.contratos.length > 1;
    const txtSiguientes = esMultiple ? "los siguientes contratos" : "el siguiente contrato";
    const txtClientes = esMultiple ? "los clientes" : "el cliente";
    const txtDatos = esMultiple ? "los datos de los contratos afectados" : "los datos del contrato afectado";
    const txtEstos = esMultiple ? "estos contratos" : "este contrato";

    return `${obtenerSaludoTiempo()}\n${saludo} ${nombrePila},\n\nTe escribo para solicitar tu apoyo habilitando nuevamente el envío del correo para la firma digital de ${txtSiguientes}. Debido a un error involuntario por parte de ${txtClientes}, el proceso no se pudo completar en la primera instancia.\n\nA continuación, detallo ${txtDatos} del proyecto ${formReenvio.proyecto.toUpperCase()}:\n\n${listaContratos}\nQuedo atento a tu confirmación para proceder con la regularización de ${txtEstos}.\n\nSaludos cordiales,\n${formReenvio.asesor || '[Nombre del Asesor]'}`;
  };

  const generarHtmlReenvio = () => {
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    let filas = "";
    formReenvio.contratos.forEach(c => {
      filas += `<tr><td style="border: 1px solid #333; padding: 4px 8px; font-weight: bold;">${c.nroContrato || '---'}</td><td style="border: 1px solid #333; padding: 4px 8px;">${c.cliente || '---'}</td><td style="border: 1px solid #333; padding: 4px 8px;">${c.ci || '---'}</td><td style="border: 1px solid #333; padding: 4px 8px;">UV: ${c.uv || 'SN'} - Mzn: ${c.manzano || '-'} - Lote: ${c.lote || '-'}</td></tr>`;
    });
    const esMultiple = formReenvio.contratos.length > 1;
    return `
    <div style="font-family: 'Aptos', Arial, sans-serif; font-size: 14px; color: #333; max-width: 800px; line-height: 1.5; text-align: justify;">
      <p style="margin-bottom: 5px;">${obtenerSaludoTiempo()}</p>
      <p style="margin-top: 0; margin-bottom: 25px;">${saludo} ${nombrePila},</p>
      <p style="margin-bottom: 20px;">Te escribo para solicitar tu apoyo habilitando nuevamente el env&iacute;o del correo para la firma digital de ${esMultiple ? "los siguientes contratos" : "el siguiente contrato"}. Debido a un error involuntario por parte de ${esMultiple ? "los clientes" : "el cliente"}, el proceso no se pudo completar en la primera instancia.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid #333; font-family: 'Aptos', Arial, sans-serif; font-size: 13px; margin-bottom: 25px;">
        <thead><tr style="background-color: #f2f2f2;"><th style="border: 1px solid #333; padding: 4px 8px; text-align: left;">Nro. Contrato</th><th style="border: 1px solid #333; padding: 4px 8px; text-align: left;">Cliente</th><th style="border: 1px solid #333; padding: 4px 8px; text-align: left;">Carnet (CI)</th><th style="border: 1px solid #333; padding: 4px 8px; text-align: left;">Ubicaci&oacute;n</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      <p style="margin-bottom: 25px;">Quedo atento a tu confirmaci&oacute;n para proceder con la regularizaci&oacute;n.</p>
      <p style="margin-top: 0; margin-bottom: 2px;">Saludos cordiales,</p>
      <p style="margin-top: 0; font-weight: bold; color: #333;">${formReenvio.asesor || '[Nombre del Asesor]'}</p>
    </div>`;
  };

  const generarHtmlProyeccion = () => {
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    let filasAsesoresHtml = "";
    
    let sumColAct = 0;
    let sumProyA = [0,0,0,0,0];
    let sumTotalProySemanal = 0;
    let sumTotalColMes = 0;

    formProyeccion.asesores.forEach((asesor, i) => {
      const sumDias = asesor.dias.reduce((a, b) => a + b, 0);
      const totalColMes = asesor.colAct + sumDias;
      
      sumColAct += asesor.colAct;
      asesor.proy.forEach((val, idx) => sumProyA[idx] += val);
      sumTotalProySemanal += sumDias;
      sumTotalColMes += totalColMes;

      const formatVacio = (val) => val === 0 ? '-' : formatCurrency(val);
      const formatDias = (val) => val === 0 ? '-' : val;

      filasAsesoresHtml += `
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; background: white;">${i+1}</td>
          <td style="border: 1px solid #cbd5e1; padding: 4px 6px; font-weight: bold; background: white;">${asesor.nombre}</td>
          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: right; background: white;">${formatVacio(asesor.colAct)}</td>
          ${asesor.dias.map(d => `<td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; background: white;">${formatDias(d)}</td>`).join('')}
          ${asesor.proy.map(p => `<td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold; background: white;">${p}</td>`).join('')}
          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: right; font-weight: bold; background: white;">${formatVacio(sumDias)}</td>
          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: right; font-weight: bold; background: white;">${formatVacio(totalColMes)}</td>
          <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; background: white;"></td>
        </tr>
      `;
    });

    const mesStr = new Date(formProyeccion.fechaInicio || new Date()).toLocaleString('es-ES', { month: 'long' });
    const capMes = mesStr.charAt(0).toUpperCase() + mesStr.slice(1);
    const porcentajeAvance = formProyeccion.objetivoMensual ? (sumColAct / formProyeccion.objetivoMensual) * 100 : 0;
    const porcentajeFin = formProyeccion.objetivoMensual ? (sumTotalColMes / formProyeccion.objetivoMensual) * 100 : 0;

    return `
    <div style="font-family: 'Aptos', Arial, sans-serif; font-size: 13px; color: #333; text-align: justify;">
      <p>${obtenerSaludoTiempo()}</p>
      <p>${saludo} ${nombrePila},</p>
      <p>Adjunto el consolidado de proyecci&oacute;n de ventas semanal del equipo correspondiente a la semana actual.</p>
      
      <table style="border-collapse: collapse; font-family: 'Aptos', Arial, sans-serif; font-size: 11px; margin-top: 15px; width: 100%; min-width: 900px; text-align: left;">
        <thead>
          <tr>
            <th colspan="3" style="background-color: #002060; color: white; padding: 6px; border: 1px solid white; text-align: left;">Proyeccion Equipo: ${formProyeccion.equipo}</th>
            <th colspan="7" style="background-color: #002060; color: white; padding: 6px; border: 1px solid white; text-align: center;">Ventas</th>
            <th colspan="5" style="background-color: #92d050; color: black; padding: 6px; border: 1px solid white; text-align: center;">Proyectos</th>
            <th rowspan="2" style="background-color: #002060; color: white; padding: 6px; border: 1px solid white; text-align: center; vertical-align: bottom;">Total<br>Proyeccion<br>semanal</th>
            <th rowspan="2" style="background-color: #002060; color: white; padding: 6px; border: 1px solid white; text-align: center; vertical-align: bottom;">Total<br>colocacion<br>asesor/mes</th>
            <th rowspan="2" style="background-color: #002060; color: white; padding: 6px; border: 1px solid white; text-align: center; vertical-align: bottom;">Productivo<br>valor = $25.000</th>
          </tr>
          <tr>
            <th style="background-color: #002060; color: white; border: 1px solid white;"></th>
            <th style="background-color: #002060; color: white; padding: 6px; border: 1px solid white; text-align: left;">Asesor</th>
            <th style="background-color: #002060; color: white; padding: 6px; border: 1px solid white; text-align: center;">Colocacion<br>actual</th>
            ${[0,1,2,3,4,5,6].map(d => `<th style="background-color: #002060; color: white; padding: 6px; border: 1px solid white; text-align: center;">${formatDiaMes(formProyeccion.fechaInicio, d)}</th>`).join('')}
            ${NOMBRES_PROYECTOS_PROYECCION.map(p => `<th style="background-color: #92d050; color: white; padding: 6px; border: 1px solid white; text-align: center;">${p}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${filasAsesoresHtml}
          <tr>
            <td colspan="10" style="border: none;"></td>
            ${sumProyA.map(p => `<td style="background-color: #8faadc; color: black; font-weight: bold; border: 1px solid #cbd5e1; text-align: center; padding: 4px;">${p}</td>`).join('')}
            <td style="border: none;"></td>
            <td style="background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; text-align: right; padding: 4px;">${formatCurrency(sumTotalColMes)}</td>
            <td style="font-weight: bold; color: red; text-align: center; padding: 4px;">0%</td>
          </tr>
        </tbody>
      </table>

      <table style="border-collapse: collapse; font-family: 'Aptos', Arial, sans-serif; font-size: 11px; margin-top: 20px; width: 300px; text-align: left;">
        <tr><td style="background-color: #002060; color: white; padding: 5px 8px; font-weight: bold; border: 1px solid white;">Proyeccion ${capMes}</td><td style="background-color: #002060; color: white; padding: 5px 8px; font-weight: bold; border: 1px solid white; text-align: center;">-</td><td style="border: none;"></td></tr>
        <tr><td style="background-color: #002060; color: white; padding: 5px 8px; font-weight: bold; border: 1px solid white;">Colocacion actual</td><td style="background-color: #002060; color: white; padding: 5px 8px; font-weight: bold; border: 1px solid white; text-align: right;">${formatCurrency(sumColAct)}</td><td style="background-color: #002060; color: white; padding: 5px 8px; font-weight: bold; border: 1px solid white; text-align: center;">${formatCurrency(porcentajeAvance)}%</td></tr>
        <tr><td style="background-color: #002060; color: white; padding: 5px 8px; font-weight: bold; border: 1px solid white;">Objetivo ${capMes} ${new Date().getFullYear()}</td><td style="background-color: #002060; color: white; padding: 5px 8px; font-weight: bold; border: 1px solid white; text-align: right;">${formatCurrency(formProyeccion.objetivoMensual)}</td><td style="border: none;"></td></tr>
        <tr><td style="background-color: #002060; color: white; padding: 5px 8px; font-weight: bold; border: 1px solid white;">Colocacion fin de mes</td><td style="background-color: #002060; color: white; padding: 5px 8px; font-weight: bold; border: 1px solid white; text-align: right;">${formatCurrency(sumTotalColMes)}</td><td style="background-color: #002060; color: white; padding: 5px 8px; font-weight: bold; border: 1px solid white; text-align: center;">${formatCurrency(porcentajeFin)}%</td></tr>
      </table>
      <p style="margin-top: 25px;">Saludos cordiales.</p>
    </div>`;
  };

  const generarTextoProyeccion = () => {
    const { saludo, nombrePila } = obtenerDatosSupervisor();
    let texto = `${obtenerSaludoTiempo()}\n${saludo} ${nombrePila},\n\nAdjunto el resumen del consolidado de proyección de ventas semanal del equipo.\n\n`;
    
    let sumColAct = 0;
    let sumTotalColMes = 0;

    formProyeccion.asesores.forEach((asesor, i) => {
      const sumDias = asesor.dias.reduce((a, b) => a + b, 0);
      const totalColMes = asesor.colAct + sumDias;
      sumColAct += asesor.colAct;
      sumTotalColMes += totalColMes;
      
      if (asesor.colAct > 0 || sumDias > 0) {
        texto += `${i+1}. ${asesor.nombre}\n`;
        texto += `   • Colocación Actual: $${formatCurrency(asesor.colAct)}\n`;
        texto += `   • Proyección Semanal: $${formatCurrency(sumDias)}\n`;
        texto += `   • Cierre de Mes: $${formatCurrency(totalColMes)}\n\n`;
      }
    });

    const mesStr = new Date(formProyeccion.fechaInicio || new Date()).toLocaleString('es-ES', { month: 'long' });
    const capMes = mesStr.charAt(0).toUpperCase() + mesStr.slice(1);
    const porcentajeAvance = formProyeccion.objetivoMensual ? (sumColAct / formProyeccion.objetivoMensual) * 100 : 0;
    const porcentajeFin = formProyeccion.objetivoMensual ? (sumTotalColMes / formProyeccion.objetivoMensual) * 100 : 0;

    texto += `--- RESUMEN DEL EQUIPO ---\n`;
    texto += `Objetivo ${capMes}: $${formatCurrency(formProyeccion.objetivoMensual)}\n`;
    texto += `Colocación Actual: $${formatCurrency(sumColAct)} (${formatCurrency(porcentajeAvance)}%)\n`;
    texto += `Colocación Fin de Mes: $${formatCurrency(sumTotalColMes)} (${formatCurrency(porcentajeFin)}%)\n\n`;
    texto += `Saludos cordiales.`;

    return texto;
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
          <button onClick={() => setActiveTab('fisico')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'fisico' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <FileText className="w-5 h-5 mr-3" /> Contrato Físico
          </button>
          <button onClick={() => setActiveTab('reenvio')} className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'reenvio' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <FileSignature className="w-5 h-5 mr-3" /> Reenvío Firma Digital
          </button>

          <div className="pt-5 pb-2"><p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cotizaciones</p></div>
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
      <div className="flex-1 overflow-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60">
                <div className="inline-flex items-center justify-center px-3 py-1 mb-4 text-xs font-bold tracking-wide text-indigo-600 bg-indigo-100 rounded-full">PORTAL V2.0</div>
                <h2 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">Bienvenido al Portal de Solicitudes</h2>
                <p className="text-slate-600 mb-10 text-lg leading-relaxed max-w-3xl">Esta herramienta está diseñada para estandarizar nuestras solicitudes y ahorrar tiempo. Selecciona el trámite a realizar en el menú lateral.</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100/50 shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1"><div className="p-3 bg-blue-100 rounded-xl mb-4"><FileText className="w-8 h-8 text-blue-600" /></div><h3 className="font-bold text-slate-800">Cero Errores</h3></div>
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100/50 shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1"><div className="p-3 bg-emerald-100 rounded-xl mb-4"><TrendingUp className="w-8 h-8 text-emerald-600" /></div><h3 className="font-bold text-slate-800">Más Rápido</h3></div>
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-100/50 shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1"><div className="p-3 bg-amber-100 rounded-xl mb-4"><Calculator className="w-8 h-8 text-amber-600" /></div><h3 className="font-bold text-slate-800">Cálculos Exactos</h3></div>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100/50 shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1"><div className="p-3 bg-purple-100 rounded-xl mb-4"><Database className="w-8 h-8 text-purple-600" /></div><h3 className="font-bold text-slate-800">Conectado a BD</h3></div>
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

              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50 items-center">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Equipo Supervisor</label>
                      <select 
                        value={formProyeccion.equipo} 
                        onChange={handleEquipoChange} 
                        className="w-full px-3 py-1.5 mt-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                      >
                        {Object.keys(EQUIPOS_ASESORES).map(equipo => (
                          <option key={equipo} value={equipo}>{equipo}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-40">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Semana del (Lunes)</label>
                      <input type="date" value={formProyeccion.fechaInicio} onChange={(e) => setFormProyeccion({...formProyeccion, fechaInicio: e.target.value})} className="w-full px-3 py-1.5 mt-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                    <div className="w-40">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Objetivo Mes</label>
                      <input type="number" value={formProyeccion.objetivoMensual} onChange={(e) => setFormProyeccion({...formProyeccion, objetivoMensual: parseFloat(e.target.value) || 0})} className="w-full px-3 py-1.5 mt-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 bg-white" />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap">
                      <thead>
                        <tr>
                          <th rowSpan="2" className="bg-[#002060] text-white p-2 border border-slate-400">Asesor</th>
                          <th rowSpan="2" className="bg-[#002060] text-white p-2 border border-slate-400 text-center leading-tight">Colocación<br/>Actual</th>
                          <th colSpan="7" className="bg-[#002060] text-white p-2 border border-slate-400 text-center">Ventas / Proyección Diaria</th>
                          <th colSpan="5" className="bg-[#92d050] text-black p-2 border border-slate-400 text-center">Proyectos</th>
                        </tr>
                        <tr>
                          {[0,1,2,3,4,5,6].map(d => <th key={d} className="bg-[#002060] text-white p-2 border border-slate-400 text-center font-normal">{formatDiaMes(formProyeccion.fechaInicio, d)}</th>)}
                          {NOMBRES_PROYECTOS_PROYECCION.map(p => <th key={p} className="bg-[#92d050] text-black p-2 border border-slate-400 text-center font-normal">{p}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {formProyeccion.asesores.map((asesor, i) => (
                          <tr key={i} className="hover:bg-blue-50/50">
                            <td className="p-2 border border-slate-300 font-medium text-slate-800">{i+1}. {asesor.nombre}</td>
                            <td className="p-1 border border-slate-300">
                              <input type="number" value={asesor.colAct === 0 ? '' : asesor.colAct} onChange={(e) => updateAsesorProyeccion(i, 'colAct', e.target.value)} className="w-20 p-1 text-right text-xs bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-400 rounded" placeholder="0" />
                            </td>
                            {asesor.dias.map((diaVal, dIdx) => (
                              <td key={dIdx} className="p-1 border border-slate-300">
                                <input type="number" value={diaVal === 0 ? '' : diaVal} onChange={(e) => updateAsesorArrayProyeccion(i, 'dias', dIdx, e.target.value)} className="w-16 p-1 text-center text-xs bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-400 rounded" placeholder="-" />
                              </td>
                            ))}
                            {asesor.proy.map((proyVal, pIdx) => (
                              <td key={pIdx} className="p-1 border border-slate-300 bg-green-50/30">
                                <input type="number" value={proyVal === 0 ? '' : proyVal} onChange={(e) => updateAsesorArrayProyeccion(i, 'proy', pIdx, e.target.value)} className="w-12 p-1 text-center text-xs font-bold text-slate-700 bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-400 rounded" placeholder="0" />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center">
                     <Info className="w-4 h-4 mr-2" /> Los totales por semana, por mes y promedios se calculan solos en la vista previa a la derecha.
                  </div>
                </div>

                <div>
                  <ResultCard 
                    title="Proyección Semanal" 
                    text={generarTextoProyeccion()} 
                    htmlContent={generarHtmlProyeccion()}
                    subject={`Proyección Semanal Equipo ${formProyeccion.equipo} - ${formatDiaMes(formProyeccion.fechaInicio, 0)}`} 
                    supervisorDestino={supervisorDestino}
                    setSupervisorDestino={setSupervisorDestino}
                    showTextPlain={true}
                  />
                </div>
              </div>
            </div>
          )}

          {/* FORM: CONTRATO FÍSICO */}
          {activeTab === 'fisico' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><FileText className="w-6 h-6 mr-2 text-blue-600" /> Habilitación de Contrato Físico</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <Input label="Nombre del Asesor" name="asesor" value={formFisico.asesor} onChange={handleFisicoChange} placeholder="Ej. Oscar Saravia" />
                  <Input label="Nombre Completo del Cliente" name="nombre" value={formFisico.nombre} onChange={handleFisicoChange} placeholder="Ej. Juan Pérez" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Número de Carnet (CI)" name="ci" value={formFisico.ci} onChange={handleFisicoChange} placeholder="Ej. 1234567" />
                    <Input label="Número de Contrato" name="contrato" value={formFisico.contrato} onChange={handleFisicoChange} placeholder="Ej. CT-9876" />
                  </div>
                  <TextArea label="Motivo detallado" name="motivo" value={formFisico.motivo} onChange={handleFisicoChange} placeholder="Ej. El cliente es una persona mayor..." />
                </div>
                <div><ResultCard title="Contrato Físico" text={generarTextoFisico()} htmlContent={generarHtmlFisico()} subject={`Solicitud Contrato Físico - ${formFisico.nombre || 'Cliente'}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} /></div>
              </div>
            </div>
          )}

          {/* FORM: REENVÍO FIRMA DIGITAL */}
          {activeTab === 'reenvio' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><FileSignature className="w-6 h-6 mr-2 text-blue-600" /> Reenvío Firma Digital</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                    <h3 className="text-lg font-medium text-slate-800">Listado de Contratos</h3>
                    <div className="w-1/3"><select value={formReenvio.proyecto} onChange={(e) => setFormReenvio({...formReenvio, proyecto: e.target.value})} className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">{PROYECTOS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                  </div>
                  <div className="mb-4"><Input label="Nombre del Asesor" name="asesor" value={formReenvio.asesor} onChange={(e) => setFormReenvio({...formReenvio, asesor: e.target.value})} placeholder="Ej. Oscar Saravia" /></div>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {formReenvio.contratos.map((contrato, index) => (
                      <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                        {formReenvio.contratos.length > 1 && (<button onClick={() => eliminarContratoReenvio(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full"><Trash2 className="w-4 h-4" /></button>)}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Nro. Contrato</label><input type="text" value={contrato.nroContrato} onChange={(e) => handleReenvioChange(index, 'nroContrato', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white" /></div>
                          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Carnet (CI)</label><input type="text" value={contrato.ci} onChange={(e) => handleReenvioChange(index, 'ci', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm bg-white" /></div>
                        </div>
                        <div className="mb-3"><label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del Cliente</label><input type="text" value={contrato.cliente} onChange={(e) => handleReenvioChange(index, 'cliente', e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-sm uppercase bg-white" /></div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex items-center"><span className="text-xs text-slate-500 mr-2">UV:</span><input type="text" value={contrato.uv} onChange={(e) => handleReenvioChange(index, 'uv', e.target.value)} className="w-full px-2.5 py-1 border rounded text-sm bg-white" /></div>
                          <div className="flex items-center"><span className="text-xs text-slate-500 mr-2">Mzn:</span><input type="text" value={contrato.manzano} onChange={(e) => handleReenvioChange(index, 'manzano', e.target.value)} className="w-full px-2.5 py-1 border rounded text-sm bg-white" /></div>
                          <div className="flex items-center"><span className="text-xs text-slate-500 mr-2">Lote:</span><input type="text" value={contrato.lote} onChange={(e) => handleReenvioChange(index, 'lote', e.target.value)} className="w-full px-2.5 py-1 border rounded text-sm bg-white" /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={agregarContratoReenvio} className="mt-4 w-full flex items-center justify-center py-2 border-2 border-dashed rounded-xl text-slate-600 hover:text-blue-600 font-medium text-sm"><Plus className="w-4 h-4 mr-1" /> Añadir otro contrato</button>
                </div>
                <div><ResultCard title="Reenvío Firma Digital" text={generarTextoReenvio()} htmlContent={generarHtmlReenvio()} subject={`Solicitud Reenvío de Correo Firma Digital - ${formReenvio.proyecto}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} /></div>
              </div>
            </div>
          )}

          {/* FORM: DESCUENTO CAMPAÑAS */}
          {activeTab === 'descuento' && (() => {
            const { porcentajeCuota, montoCuotaNum } = calcularDescuento();
            const nomProyectoFinal = formDescuento.proyecto === 'OTRO...' ? (formDescuento.proyectoManual || 'PROYECTO MANUAL') : formDescuento.proyecto;
            return (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 flex justify-between items-end">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center"><Tag className="w-6 h-6 mr-2 text-blue-600" /> Descuentos Campañas</h2>
                  
                  {/* BOTÓN TOGGLE BÚSQUEDA INTELIGENTE / MANUAL */}
                  <div className="bg-slate-200/60 p-1 rounded-full inline-flex">
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

                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div><label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Proyecto</label><select name="proyecto" value={formDescuento.proyecto} onChange={handleDescuentoChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 shadow-sm">{PROYECTOS.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}</select></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Modalidad</label><select name="modalidad" value={formDescuento.modalidad} onChange={handleDescuentoChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 shadow-sm"><option value="Contado">Al Contado</option><option value="Crédito">A Crédito (Plazos)</option></select></div>
                    </div>

                    {formDescuento.proyecto === 'OTRO...' && (
                      <div className="mb-4 bg-amber-50/80 p-4 rounded-xl border border-amber-200 shadow-sm">
                        <h4 className="font-bold text-amber-800 mb-3 text-sm flex items-center"><Edit3 className="w-4 h-4 mr-2" /> Proyecto Manual</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                             <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">Nombre del Proyecto</label>
                             <input type="text" name="proyectoManual" value={formDescuento.proyectoManual} onChange={handleDescuentoChange} className="w-full px-3 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white text-sm" placeholder="Ej. Celina VII"/>
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-0.5">Descuento a Aplicar</label>
                             <div className="flex w-full gap-2">
                               <select name="tipoDescuentoManual" value={formDescuento.tipoDescuentoManual} onChange={handleDescuentoChange} className="w-1/2 px-2 py-2.5 border border-amber-200 rounded-xl bg-white text-sm font-semibold focus:ring-2 focus:ring-amber-500 outline-none">
                                  <option value="porcentaje">% Desc.</option>
                                  <option value="monto">$ por m²</option>
                               </select>
                               <input type="number" name="descuentoManual" value={formDescuento.descuentoManual} onChange={handleDescuentoChange} className="w-1/2 px-3 py-2.5 border border-amber-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Ej. 10"/>
                             </div>
                           </div>
                        </div>
                      </div>
                    )}

                    {formDescuento.modalidad === 'Crédito' && (
                      <div className="mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                        <div className="flex flex-col w-full">
                          <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Ingresar Cuota Inicial</label>
                          <div className="flex w-full gap-2">
                            <select 
                              value={formDescuento.modoCuota} 
                              onChange={(e) => setFormDescuento({...formDescuento, modoCuota: e.target.value, cuota: ''})}
                              className="w-1/3 px-3 py-2.5 border border-blue-200 rounded-xl bg-white text-slate-700 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
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
                              className="w-1/3 px-4 py-2.5 border border-blue-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" 
                            />
                            <div className="w-1/3 flex items-center justify-center bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm transition-all">
                              {formDescuento.modoCuota === 'monto' 
                                ? `${formatCurrency(porcentajeCuota)}%` 
                                : `$ ${formatCurrency(montoCuotaNum)}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* MENÚS CASCADA O MANUAL */}
                    {formDescuento.modoBusqueda === 'inteligente' && formDescuento.proyecto !== 'OTRO...' ? (
                      <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-emerald-700 mb-1.5 ml-0.5 uppercase tracking-wide">Elegir UV</label>
                            <select name="uv" value={formDescuento.uv} onChange={handleDescuentoChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 font-semibold cursor-pointer">
                              <option value="">---</option>
                              {opcionesUV.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-emerald-700 mb-1.5 ml-0.5 uppercase tracking-wide">Elegir MZN</label>
                            <select name="manzano" value={formDescuento.manzano} onChange={handleDescuentoChange} disabled={!formDescuento.uv} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 font-semibold cursor-pointer disabled:opacity-50 disabled:bg-slate-100">
                              <option value="">---</option>
                              {opcionesMZN.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-emerald-700 mb-1.5 ml-0.5 uppercase tracking-wide">Elegir Lote</label>
                            <select name="lote" value={formDescuento.lote} onChange={handleDescuentoChange} disabled={!formDescuento.manzano} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 font-semibold cursor-pointer disabled:opacity-50 disabled:bg-slate-100">
                              <option value="">---</option>
                              {opcionesLote.map(lt => <option key={lt} value={lt}>{lt}</option>)}
                            </select>
                          </div>
                        </div>
                        {lotesBD.length === 0 && !cargandoLotes ? (
                          <p className="text-xs text-amber-600 mt-3 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1" /> Cargando base de datos o archivo lotes.json no encontrado.
                          </p>
                        ) : null}
                        {cargandoLotes ? (
                          <p className="text-xs text-slate-500 mt-3 flex items-center">
                             Cargando base de datos segura...
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4 mb-2">
                        <Input label="UV" name="uv" value={formDescuento.uv} onChange={handleDescuentoChange} />
                        <Input label="Manzano" name="manzano" value={formDescuento.manzano} onChange={handleDescuentoChange} />
                        <Input label="Lote" name="lote" value={formDescuento.lote} onChange={handleDescuentoChange} />
                      </div>
                    )}

                    {/* ETIQUETA DE CATEGORÍA (ESTILO DARK) */}
                    {formDescuento.modoBusqueda === 'inteligente' && formDescuento.categoria ? (
                      <div className="bg-slate-900 border border-slate-800 text-white p-3.5 rounded-xl text-xs font-bold mb-5 flex items-center shadow-md uppercase tracking-wider">
                        <Tag className="w-4 h-4 mr-2.5 text-cyan-400" />
                        <span className="text-slate-400 mr-1.5 font-semibold">Categoría:</span> {formDescuento.categoria}
                      </div>
                    ) : formDescuento.modoBusqueda === 'manual' ? (
                      <div className="mb-4">
                         <Input label="Categoría (Opcional)" name="categoria" value={formDescuento.categoria} onChange={handleDescuentoChange} placeholder="Ej. AVENIDA PRINCIPAL CON PAVIMENTO" />
                      </div>
                    ) : null}

                    {loteAutocompletado && formDescuento.modoBusqueda === 'inteligente' && (
                      <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-700 p-2.5 rounded-xl text-xs font-bold mb-5 flex items-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Superficie y Precio autocompletados desde tu Excel
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Input label="Superficie (M2)" name="m2" value={formDescuento.m2} onChange={handleDescuentoChange} type="number" />
                      <Input label="Precio Reg. (M2)" name="precioM2" value={formDescuento.precioM2} onChange={handleDescuentoChange} type="number" />
                    </div>
                    
                    <div className="border-t border-slate-100 pt-5 mt-2"><Input label="Nombre del Asesor" name="asesor" value={formDescuento.asesor} onChange={handleDescuentoChange} /></div>
                  </div>
                  <div><ResultCard title="Descuento" text={generarTextoDescuento()} htmlContent={generarHtmlDescuento()} subject={`Solicitud Descuento Campañas - ${nomProyectoFinal} Mz${formDescuento.manzano} Lt${formDescuento.lote}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} /></div>
                </div>
              </div>
            );
          })()}

          {/* FORM: INCREMENTO CUOTA */}
          {activeTab === 'cuota' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6"><h2 className="text-2xl font-bold text-slate-800 flex items-center"><TrendingUp className="w-6 h-6 mr-2 text-blue-600" /> Incremento de Cuota Inicial</h2></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Nro. Contrato" name="nroContrato" value={formCuota.nroContrato} onChange={handleCuotaChange} />
                    <Input label="Carnet (CI)" name="ci" value={formCuota.ci} onChange={handleCuotaChange} />
                  </div>
                  <Input label="Nombre del Cliente" name="cliente" value={formCuota.cliente} onChange={handleCuotaChange} />
                  <div className="mb-5">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Proyecto</label>
                    <select name="proyecto" value={formCuota.proyecto} onChange={handleCuotaChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 shadow-sm">{PROYECTOS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="UV" name="uv" value={formCuota.uv} onChange={handleCuotaChange} />
                    <Input label="Manzano" name="manzano" value={formCuota.manzano} onChange={handleCuotaChange} />
                    <Input label="Lote" name="lote" value={formCuota.lote} onChange={handleCuotaChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Input label="Cuota Registrada ($)" name="cuotaInicial" value={formCuota.cuotaInicial} onChange={handleCuotaChange} type="number" />
                    <Input label="Nueva Cuota ($)" name="nuevaCuota" value={formCuota.nuevaCuota} onChange={handleCuotaChange} type="number" />
                  </div>
                  <TextArea label="Motivo del incremento" name="motivo" value={formCuota.motivo} onChange={handleCuotaChange} />
                  <div className="border-t border-slate-100 pt-5 mt-2"><Input label="Nombre del Asesor" name="asesorVentas" value={formCuota.asesorVentas} onChange={handleCuotaChange} /></div>
                </div>
                <div><ResultCard title="Incremento Cuota" text={generarTextoCuota()} htmlContent={generarHtmlCuota()} subject={`Incremento Cuota Inicial - ${formCuota.proyecto} Mz${formCuota.manzano} Lt${formCuota.lote}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} /></div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
