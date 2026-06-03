import React, { useState, useEffect } from 'react';
import { 
  FileText, TrendingUp, Copy, Mail, CheckCircle2, LayoutDashboard,
  Building2, AlertCircle, Calculator, Tag, Info, FileSignature, Plus, Trash2,
  BarChart, Calendar, Search, Edit3, PhoneCall, Shield, Repeat,
  UserMinus, UserPlus, ClipboardCheck, UserCheck, Lock
} from 'lucide-react';

const DATA_VERSION = "v3.0_PRO"; 

const PROYECTOS = ["Cañaveral", "El Renacer", "Los Jardines", "Muyurina", "Rancho Nuevo", "Santa Fe", "OTRO..."];

const SUPERVISORES = [
  { id: 'mreyes', nombre: 'Mauricio Reyes Suarez', correo: 'mreyes@celina.com.bo', genero: 'M', titulo: 'Lic. Mauricio' },
  { id: 'ohsaravia', nombre: 'Oscar Hugo Saravia L.', correo: 'ohsaravia@celina.com.bo', genero: 'M', titulo: 'Lic. Oscar' },
  { id: 'rvaca', nombre: 'Robert Vaca', correo: 'rvaca@grupopaz.com.bo', genero: 'M', titulo: 'Lic. Robert' },
  { id: 'uklein', nombre: 'Ulrich Klein Montano', correo: 'uklein@grupopaz.com.bo', genero: 'M', titulo: 'Lic. Ulrich' },
  { id: 'mfroca', nombre: 'Maria Fernanda Roca Miranda', correo: 'mfroca@celina.com.bo', genero: 'F', titulo: 'Lic. Maria Fernanda' },
  { id: 'vchoque', nombre: 'Verenice Choque', correo: 'vchoque@celina.com.bo', genero: 'F', titulo: 'Lic. Verenice' },
  { id: 'cmontero', nombre: 'Carolina Montero Araujo', correo: 'cmontero@celina.com.bo', genero: 'F', titulo: 'Lic. Carolina' },
  { id: 'omendoza', nombre: 'Olivia Mendoza Duran', correo: 'omendoza@celina.com.bo', genero: 'F', titulo: 'Lic. Olivia' }
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

const formatDiaMes = (fechaIso, sumarDias = 0) => {
  if (!fechaIso) return `Día ${sumarDias + 1}`;
  const p = String(fechaIso).split('-');
  if (p.length !== 3) return `Día ${sumarDias + 1}`;
  const d = new Date(p[0], p[1] - 1, p[2]);
  d.setDate(d.getDate() + sumarDias);
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d.getDate()}-${meses[d.getMonth()]}`;
};

// COMPONENTES UI REUTILIZABLES
const Input = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4 w-full">
    <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1 uppercase tracking-wide">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-800 text-sm shadow-sm transition-all" />
  </div>
);

const TextArea = ({ label, name, value, onChange, placeholder }) => (
  <div className="mb-4 w-full">
    <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1 uppercase tracking-wide">{label}</label>
    <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows="3" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-800 text-sm shadow-sm resize-none transition-all" />
  </div>
);

const ResultCard = ({ title, text, htmlContent, subject, supervisorDestino, setSupervisorDestino, showDestino = true, fixedEmail, fixedLabel, ccEmails }) => {
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

  const openApp = (app) => {
    handleCopy();
    const to = fixedEmail || supervisorDestino || '';
    const cc = ccEmails ? `&cc=${encodeURIComponent(ccEmails)}` : '';
    const subj = encodeURIComponent(subject);
    const body = encodeURIComponent("(Mantén presionado aquí y selecciona 'Pegar' para insertar el formato corporativo)");
    
    setTimeout(() => {
      if(app === 'gmail') window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subj}${cc}&body=${body}`, '_blank');
      else if(app === 'outlook') {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        window.location.href = isMobile ? `ms-outlook://compose?to=${to}&subject=${subj}${cc}&body=${body}` : `mailto:${to}?subject=${subj}${cc}&body=${body}`;
      }
      else window.location.href = `mailto:${to}?subject=${subj}${cc}&body=${body}`;
    }, 400);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-xl flex flex-col h-full max-h-[85vh]">
      <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center tracking-tight"><CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" /> {title || 'Vista Previa'}</h3>
      
      {showDestino && (
        <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Enviar a:</label>
          {fixedEmail ? <div className="font-semibold text-slate-700 text-sm">{fixedLabel} ({fixedEmail})</div> :
            <select value={supervisorDestino} onChange={(e) => setSupervisorDestino(e.target.value)} className="w-full bg-transparent font-semibold text-sm outline-none text-slate-800 cursor-pointer">{SUPERVISORES.map(s => <option key={s.id} value={s.correo}>{s.nombre}</option>)}</select>}
          {ccEmails && <p className="text-[10px] text-slate-400 mt-1"><b>CC:</b> {ccEmails}</p>}
        </div>
      )}

      {htmlContent && (
        <div className="mb-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex gap-2 items-start text-[11px] text-indigo-800">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <p>Al hacer clic en los botones, el formato se copiará automáticamente a tu portapapeles. Solo debes "Pegar" en el correo.</p>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl border border-slate-200 overflow-auto flex-1 text-xs mb-5 shadow-inner" style={{color: '#000'}}>
        {htmlContent ? <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> : <pre className="font-mono whitespace-pre-wrap">{text}</pre>}
      </div>
      
      <div className="flex flex-col gap-2 w-full mt-auto">
        <button onClick={handleCopy} className={`w-full py-3 font-bold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
          {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />} {copied ? '¡Copiado Exitosamente!' : 'Solo Copiar Formato'}
        </button>
        {htmlContent && (
          <div className="grid grid-cols-2 gap-2">
             <button onClick={() => openApp('gmail')} className="py-2.5 bg-[#EA4335] hover:bg-[#d33c30] text-white font-bold rounded-xl text-xs flex items-center justify-center shadow-md"><Mail className="w-3.5 h-3.5 mr-1.5"/> Gmail</button>
             <button onClick={() => openApp('outlook')} className="py-2.5 bg-[#0078D4] hover:bg-[#006abc] text-white font-bold rounded-xl text-xs flex items-center justify-center shadow-md"><Mail className="w-3.5 h-3.5 mr-1.5"/> Outlook</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('seguimiento');
  const [supervisorDestino, setSupervisorDestino] = useState('mreyes@celina.com.bo');
  const [diaControl, setDiaControl] = useState(3);
  const [lotesBD, setLotesBD] = useState([]);
  const [cargandoLotes, setCargandoLotes] = useState(true);

  // Estados Formularios
  const [formLlamada, setFormLlamada] = useState({ asesor: 'Oscar Saravia', nombreReferido: '', contratoReferido: '', celularReferido: '', horaLlamada: '', nombreBeneficiario: '', ciBeneficiario: '' });
  const [formBloqueo, setFormBloqueo] = useState({ asesor: 'Oscar Saravia', proyecto: 'Los Jardines', uv: '', manzano: '', lote: '', superficie: '', categoria: '', horaVenta: '12:00 pm' });
  const [formFisico, setFormFisico] = useState({ asesor: 'Oscar Saravia', nombre: '', ci: '', contrato: '', motivo: '' });
  const [formReenvio, setFormReenvio] = useState({ asesor: 'Oscar Saravia', proyecto: 'Los Jardines', contratos: [{ nroContrato: '', cliente: '', ci: '', uv: '', manzano: '', lote: '' }] });
  const [formSeguro, setFormSeguro] = useState({ asesor: 'Oscar Saravia', cliente: '', nroContrato: '', uv: '', manzano: '', lote: '', beneficiarios: [{ nombre: '', parentesco: '', porcentaje: '100', ci: '' }] });
  const [formRenuncia, setFormRenuncia] = useState({ asesor: 'Oscar Saravia', nombre: '', cargo: 'Asesor de Ventas', fechaIngreso: '', fechaRenuncia: '', motivo: '' });
  const [formAltaCRM, setFormAltaCRM] = useState({ asesor: 'Oscar Saravia', nombre: '', apPaterno: '', apMaterno: '', ci: '', fechaNacimiento: '', correo: '' });
  const [formEvaluacion, setFormEvaluacion] = useState({ asesor: 'Oscar Saravia', nombre: '', punteo: '', calificacion: 'Muy Bueno', lotes: '', monto: '', leads: '', visitas: '', observaciones: '' });
  const [formPostulante, setFormPostulante] = useState({ asesor: 'Oscar Saravia', nombre: '', referidor: '' });
  const [formAmortizacion, setFormAmortizacion] = useState({ cliente: '', precioContado: '', cuotaInicial: '', plazoAnios: '10', cuotasPagadas: '1', seguroMensual: '', montoAmortizacion: '', tasaAnual: '12.1733' });
  const [formRecompra, setFormRecompra] = useState({ asesor: 'Oscar Saravia', proyecto: 'Muyurina', sucursal: 'MONTERO', fechaVentaNuevo: '', nombreNuevo: '', contratoNuevo: '', aplicoDescuento: 'NO', cuotasPagadas: '0', procesadoNuevo: 'SI', vigenteNuevo: 'SI', nombreAntiguo: '', contratoAntiguo: '', fechaVentaAntiguo: '', fechaPago: '', procesadoAntiguo: 'SI', vigenteAntiguo: 'SI', patrocinador: '', valorCuota: '' });
  const [formDescuento, setFormDescuento] = useState({ proyecto: 'El Renacer', uv: '', manzano: '', lote: '', modalidad: 'Crédito', cuota: '', modoCuota: 'monto', modoBusqueda: 'manual', m2: '', precioM2: '', categoria: '', asesor: 'Oscar Saravia', proyectoManual: '', descuentoManual: '', tipoDescuentoManual: 'porcentaje', descuentoPropiosManual: '20' });
  const [formCuota, setFormCuota] = useState({ nroContrato: '', ci: '', cliente: '', proyecto: 'El Renacer', uv: '', manzano: '', lote: '', cuotaInicial: '', nuevaCuota: '', motivo: '', asesorVentas: 'Oscar Saravia' });

  // Estado Proyección Semanal (Local Storage)
  const [formProyeccion, setFormProyeccion] = useState(() => {
    try {
      if (localStorage.getItem('portalAsesores_dataVersion') === DATA_VERSION) {
        const saved = localStorage.getItem('portalAsesores_proy');
        if (saved) return JSON.parse(saved);
      } else { localStorage.setItem('portalAsesores_dataVersion', DATA_VERSION); }
    } catch(e) {}
    return { 
      fechaInicio: new Date().toISOString().split('T')[0], 
      objetivoMensual: 450000, 
      asesores: ASESORES_INICIALES.map(a => ({ nombre: a.nombre, colAct: a.col, dias: [0,0,0,0,0,0,0], proy: [0,0,0,0,0] }))
    };
  });

  const [sumaVentaModal, setSumaVentaModal] = useState({ show: false, index: null, nombre: '', monto: '' });

  // Guardado Automático Proyección
  useEffect(() => { localStorage.setItem('portalAsesores_proy', JSON.stringify(formProyeccion)); }, [formProyeccion]);

  // Carga Base Lotes JSON
  useEffect(() => {
    fetch('./lotes.json').then(r => r.json()).then(data => {
      if(Array.isArray(data)){
        const limpios = data.map(item => ({
          proyecto: String(item.proyecto || item.PROYECTO || '').toUpperCase().replace('RENACER','El Renacer').replace('JARDINES','Los Jardines').replace('MUYURINA','Muyurina').replace('SANTA FE','Santa Fe').replace('CAÑAVERAL','Cañaveral').replace('RANCHO NUEVO','Rancho Nuevo'),
          uv: String(item.uv || item.UV || ''), manzano: String(item.mzn || item.MZN || item.manzano || item.MANZANO || ''), lote: String(item.lote || item.LOTE || ''),
          m2: parseFloat(String(item.superficie || item.SUPERFICIE || item.m2 || '0').replace(/[^0-9.,]/g, '').replace(',', '.')) || 0,
          precioM2: parseFloat(String(item.precio || item.PRECIO || item.precioM2 || '0').replace(/[^0-9.,]/g, '').replace(',', '.')) || 0,
          categoria: String(item.categoria || item.CATEGORIA || '')
        })).filter(l => l.proyecto && l.uv && l.manzano && l.lote);
        setLotesBD(limpios);
        if(limpios.length > 0) setFormDescuento(p => ({...p, modoBusqueda: 'inteligente'}));
      }
    }).catch(() => console.warn("Lotes JSON no encontrado. Modo manual.")).finally(() => setCargandoLotes(false));
  }, []);

  // Handlers Comunes
  const hC = (setter) => (e) => setter(p => ({ ...p, [e.target.name]: e.target.value }));
  
  const handleAmortChange = (e) => {
    const { name, value } = e.target;
    setFormAmortizacion(p => {
      const ns = { ...p, [name]: value };
      if(name === 'precioContado'){
        const v = parseFloat(value) || 0;
        ns.seguroMensual = v > 0 ? (v * 0.000758).toFixed(2) : '';
      }
      return ns;
    });
  };

  const handleDescChange = (e) => {
    const { name, value } = e.target;
    setFormDescuento(p => {
      const ns = { ...p, [name]: value };
      if(name === 'proyecto' && value === 'OTRO...') ns.modoBusqueda = 'manual';
      if(ns.modoBusqueda === 'inteligente' && ['proyecto','uv','manzano'].includes(name)){
        if(name === 'proyecto'){ ns.uv=''; ns.manzano=''; ns.lote=''; ns.m2=''; ns.precioM2=''; ns.categoria=''; }
        if(name === 'uv'){ ns.manzano=''; ns.lote=''; ns.m2=''; ns.precioM2=''; ns.categoria=''; }
        if(name === 'manzano'){ ns.lote=''; ns.m2=''; ns.precioM2=''; ns.categoria=''; }
      }
      return ns;
    });
  };

  // Lógica Autocompletado Descuentos
  const pL_filtro = formDescuento.proyecto.toLowerCase();
  const uL_filtro = formDescuento.uv.toLowerCase();
  const mL_filtro = formDescuento.manzano.toLowerCase();
  
  const opUV = [...new Set(lotesBD.filter(l => l.proyecto.toLowerCase() === pL_filtro).map(l => l.uv))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
  const opMZN = [...new Set(lotesBD.filter(l => l.proyecto.toLowerCase() === pL_filtro && l.uv.toLowerCase() === uL_filtro).map(l => l.manzano))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
  const opLT = [...new Set(lotesBD.filter(l => l.proyecto.toLowerCase() === pL_filtro && l.uv.toLowerCase() === uL_filtro && l.manzano.toLowerCase() === mL_filtro).map(l => l.lote))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));

  useEffect(() => {
    if(formDescuento.modoBusqueda !== 'inteligente') return;
    const l = lotesBD.find(x => x.proyecto.toLowerCase() === pL_filtro && x.uv.toLowerCase() === uL_filtro && x.manzano.toLowerCase() === mL_filtro && x.lote.toLowerCase() === formDescuento.lote.toLowerCase());
    if(l) setFormDescuento(p => ({...p, m2: String(l.m2), precioM2: String(l.precioM2), categoria: l.categoria}));
  }, [formDescuento.lote, formDescuento.modoBusqueda, lotesBD, pL_filtro, uL_filtro, mL_filtro]);

  // Cálculos Financieros y Simuladores
  const calcAmort = () => {
    const C = parseFloat(formAmortizacion.precioContado) || 0;
    const CI = parseFloat(formAmortizacion.cuotaInicial) || 0;
    const n = (parseInt(formAmortizacion.plazoAnios) || 0) * 12;
    const k = parseInt(formAmortizacion.cuotasPagadas) || 0;
    const r = (parseFloat(formAmortizacion.tasaAnual) || 12.1733) / 100 / 12;
    const amort = parseFloat(formAmortizacion.montoAmortizacion) || 0;
    const seg = parseFloat(formAmortizacion.seguroMensual) || 0;

    let P = C - CI, error = "", PMT = 0, Bk = 0, B_new = 0, nNew = 0, ahorro = 0;
    if (P > 0 && n > 0 && r > 0) {
      PMT = (P * r) / (1 - Math.pow(1 + r, -n));
      if (k > n) error = "Cuotas pagadas exceden el plazo.";
      else {
        Bk = PMT * (1 - Math.pow(1 + r, -(n - k))) / r;
        if(amort > 0) {
          B_new = Math.max(0, Bk - amort);
          if(B_new > 0){
             nNew = Math.ceil(-Math.log(1 - (B_new * r) / PMT) / Math.log(1 + r));
             ahorro = ((n - k) * PMT - Bk) - ((-Math.log(1 - (B_new * r) / PMT) / Math.log(1 + r)) * PMT - B_new);
          } else { nNew = 0; ahorro = ((n - k) * PMT - Bk); }
        } else { B_new = Bk; nNew = n - k; }
      }
    } else if (P < 0) error = "La cuota inicial supera el precio.";
    
    return { P, PMT, cuotaTotal: PMT + seg, Bk, B_new, nOldR: Math.max(0, n - k), nNew, ahorrado: Math.max(0, ahorro + ((n - k - nNew)*seg)), precioFinal: CI + ((PMT + seg)*n), error };
  };

  const calcDesc = () => {
    const { proyecto, modalidad, cuota, modoCuota, m2, precioM2, descMan, tipoDescMan, descPropMan } = { ...formDescuento, descMan: formDescuento.descuentoManual, tipoDescMan: formDescuento.tipoDescuentoManual, descPropMan: formDescuento.descuentoPropiosManual };
    const vc = (parseFloat(m2) || 0) * (parseFloat(precioM2) || 0);
    const pCuota = modoCuota === 'monto' ? (vc > 0 ? ((parseFloat(cuota)||0) / vc) * 100 : 0) : (parseFloat(cuota)||0);
    
    let dTot = 0, dTex = "";
    if (proyecto === 'OTRO...') {
      dTot = tipoDescMan === 'porcentaje' ? vc * ((parseFloat(descMan)||0)/100) : (parseFloat(descMan)||0) * (parseFloat(m2)||0);
      dTex = tipoDescMan === 'porcentaje' ? `${parseFloat(descMan)||0}%` : `$${parseFloat(descMan)||0}/m²`;
    } else if (PROYECTOS_CONVENIO_1.includes(proyecto) || PROYECTOS_CONVENIO_2.includes(proyecto)) {
      const pd = modalidad === 'Contado' ? (PROYECTOS_CONVENIO_1.includes(proyecto)?3:4) : (pCuota >= 5 ? 2 : (pCuota >= 1.5 ? 1 : 0));
      dTot = pd * (parseFloat(m2)||0); dTex = pd > 0 ? `$${pd}/m²` : '0';
    } else if (PROYECTOS_PROPIOS_1.includes(proyecto)) {
      let pd = 0;
      if (modalidad === 'Contado') pd = 30;
      else if (pCuota >= 1.5) pd = Math.min(parseFloat(descPropMan)||20, pCuota >= 5 ? 23 : 20);
      dTot = vc * (pd/100); dTex = pd > 0 ? `${pd}%` : '0%';
    }
    return { vc, dTot, dTex, pF: vc - dTot, pmF: (parseFloat(m2)||0)>0 ? (vc-dTot)/(parseFloat(m2)||0) : 0, pCuota };
  };

  // Cálculos de Seguimiento Diario (Módulo Gerencial)
  const [listSeguimiento, setListSeguimiento] = useState([]);
  const [totalesSeguimiento, setTotalesSeguimiento] = useState({ obj:0, objD:0, v:0, col:0, sAcum:0, mRest:0, cump:0, falt:0 });

  useEffect(() => {
    const list = ASESORES_INICIALES.map(a => {
      // Reemplazamos los datos hardcodeados con lo que el usuario haya metido en el cuadro de proyección
      const proyMatch = formProyeccion.asesores.find(p => p.nombre === a.nombre);
      const colReal = proyMatch ? (Number(proyMatch.colAct) || 0) + proyMatch.dias.reduce((x,y)=>x+y,0) : a.col;
      
      const oD = a.obj / 30;
      const sA = colReal - (Math.max(0, diaControl - 1) * oD);
      const mR = colReal - a.obj;
      return { ...a, col: colReal, objDiario: oD, saldoAcumulado: sA, metaRestante: mR, cumplimiento: (colReal/a.obj)*100, faltanteRally: Math.max(0, 37500 - colReal) };
    });
    setListSeguimiento(list);
    
    const tO = list.reduce((s,a)=>s+a.obj,0); const tC = list.reduce((s,a)=>s+a.col,0);
    setTotalesSeguimiento({
      obj: tO, objD: list.reduce((s,a)=>s+a.objDiario,0), v: list.reduce((s,a)=>s+a.ventas,0), col: tC,
      sAcum: list.reduce((s,a)=>s+a.saldoAcumulado,0), mRest: list.reduce((s,a)=>s+a.metaRestante,0),
      cump: tO > 0 ? (tC/tO)*100 : 0, falt: list.reduce((s,a)=>s+a.faltanteRally,0)
    });
  }, [diaControl, formProyeccion]);

  // Funciones de HTML para Emails
  const wrapDiv = (html) => `<div style="font-family:'Segoe UI',Arial,sans-serif; font-size:14px; color:#1e293b; max-width:800px; line-height:1.6;">${html}</div>`;
  const btnStyle = "background-color:#0f172a; color:#fff; padding:6px 12px; border-radius:4px; font-weight:bold; font-size:12px;";
  const tdHeader = "background-color:#f1f5f9; padding:10px; border-bottom:2px solid #cbd5e1; font-weight:bold; color:#0f172a; font-size:13px; text-transform:uppercase;";
  const tdCell = "padding:10px; border-bottom:1px solid #e2e8f0; color:#334155;";

  const getHtmlLlamada = () => wrapDiv(`
    <p>${obtenerSaludoTiempo()} estimada Olivia,</p>
    <p>Por favor su apoyo con la validación telefónica del siguiente prospecto referido, solicitó ser llamado a Hrs. <b>${formLlamada.horaLlamada || '---'}</b>:</p>
    <table width="100%" cellspacing="0" style="border:1px solid #e2e8f0; border-radius:8px; margin-bottom:20px;">
      <tr><td style="${tdHeader}" colspan="2">🗣️ DATOS DEL REFERIDO</td></tr>
      <tr><td style="${tdCell} width:40%;">Nombre Completo:</td><td style="${tdCell}"><b>${formLlamada.nombreReferido}</b></td></tr>
      <tr><td style="${tdCell}">Nro. de Contrato:</td><td style="${tdCell}"><b>${formLlamada.contratoReferido}</b></td></tr>
      <tr><td style="${tdCell}">Teléfono Celular:</td><td style="${tdCell}"><b>${formLlamada.celularReferido}</b></td></tr>
      <tr><td style="${tdHeader}" colspan="2">🎁 DATOS DE LA BENEFICIARIA</td></tr>
      <tr><td style="${tdCell}">Nombre Completo:</td><td style="${tdCell}"><b>${formLlamada.nombreBeneficiario}</b></td></tr>
      <tr><td style="${tdCell} border-bottom:none;">C.I.:</td><td style="${tdCell} border-bottom:none;"><b>${formLlamada.ciBeneficiario}</b></td></tr>
    </table>
    <p>Saludos cordiales,<br><b>${formLlamada.asesor}</b></p>
  `);

  const getHtmlBloqueo = () => wrapDiv(`
    <p>${obtenerSaludoTiempo()} estimado jefe,</p>
    <p>Por favor su autorización para el <b>BLOQUEO INMEDIATO</b> del siguiente lote, el cliente confirma cierre para mañana a Hrs. <b>${formBloqueo.horaVenta}</b>:</p>
    <table width="100%" cellspacing="0" style="border:1px solid #e2e8f0; border-radius:8px; margin-bottom:20px; background-color:#f8fafc;">
      <tr><td style="padding:15px; border-bottom:1px solid #e2e8f0;"><span style="color:#0f172a; font-weight:bold; font-size:16px;">PROYECTO: CELINA - ${String(formBloqueo.proyecto).toUpperCase()}</span></td></tr>
      <tr><td style="padding:15px;">
        <ul style="margin:0; padding-left:20px; color:#334155; line-height:1.8;">
          <li><b>Ubicación Lote:</b> UV ${formBloqueo.uv} - MZN ${formBloqueo.manzano} - LOTE ${formBloqueo.lote}</li>
          <li><b>Superficie:</b> ${formBloqueo.superficie} m²</li>
          <li><b>Categoría Comercial:</b> ${String(formBloqueo.categoria).toUpperCase()}</li>
        </ul>
      </td></tr>
    </table>
    <p>Agradezco de antemano la gestión.</p>
    <p>Saludos cordiales,<br><b>${formBloqueo.asesor}</b></p>
  `);

  const getHtmlFisico = () => wrapDiv(`
    <p>${obtenerSaludoTiempo()} estimado jefe,</p>
    <p>Solicito la autorización para el <b>cambio de modalidad de contrato (de Digital a Físico)</b> para la siguiente venta:</p>
    <ul style="padding-left:20px; margin-bottom:20px;">
      <li><b>Cliente:</b> ${formFisico.nombre}</li>
      <li><b>C.I.:</b> ${formFisico.ci}</li>
      <li><b>Contrato Nro:</b> ${formFisico.contrato}</li>
    </ul>
    <div style="background-color:#fef2f2; border:1px solid #fca5a5; padding:15px; border-radius:8px; margin-bottom:20px;">
      <p style="margin:0; color:#991b1b; font-size:13px;"><b>📝 Motivo del Cambio:</b><br>${formFisico.motivo}</p>
    </div>
    <p>Saludos cordiales,<br><b>${formFisico.asesor}</b></p>
  `);

  const getHtmlReenvio = () => {
    let rows = formReenvio.contratos.map(c => `<tr><td style="${tdCell}"><b>${c.nroContrato}</b></td><td style="${tdCell}">${c.cliente}</td><td style="${tdCell}">${c.ci}</td><td style="${tdCell}">UV ${c.uv} - MZN ${c.manzano} - Lote ${c.lote}</td></tr>`).join('');
    return wrapDiv(`
      <p>${obtenerSaludoTiempo()} estimado jefe,</p>
      <p>Solicito el reenvío del correo para la Firma Digital de los siguientes clientes (Proyecto ${formReenvio.proyecto}), debido a caducidad o error en la bandeja de entrada:</p>
      <table width="100%" cellspacing="0" style="border:1px solid #e2e8f0; margin-bottom:20px;">
        <tr><th style="${tdHeader}">Nro. Contrato</th><th style="${tdHeader}">Cliente</th><th style="${tdHeader}">C.I.</th><th style="${tdHeader}">Lote</th></tr>
        ${rows}
      </table>
      <p>Saludos cordiales,<br><b>${formReenvio.asesor}</b></p>
    `);
  };

  const getHtmlSeguro = () => {
    let rows = formSeguro.beneficiarios.map(b => `<tr><td style="${tdCell}"><b>${b.nombre}</b></td><td style="${tdCell}">${b.parentesco}</td><td style="${tdCell} text-align:center;">${b.porcentaje}%</td><td style="${tdCell}">${b.ci}</td></tr>`).join('');
    return wrapDiv(`
      <p>${obtenerSaludoTiempo()} jefe,</p>
      <p>Por favor su ayuda con la adición de beneficiarios a la póliza de Seguro de Vida correspondiente al contrato <b>${formSeguro.nroContrato}</b> (Cliente: ${formSeguro.cliente}):</p>
      <table width="100%" cellspacing="0" style="border:1px solid #e2e8f0; margin-bottom:20px;">
        <tr><th style="${tdHeader}">Nombre del Beneficiario</th><th style="${tdHeader}">Parentesco</th><th style="${tdHeader} text-align:center;">Porcentaje</th><th style="${tdHeader}">C.I.</th></tr>
        ${rows}
      </table>
      <p>Saludos cordiales,<br><b>${formSeguro.asesor}</b></p>
    `);
  };

  const getHtmlRenuncia = () => wrapDiv(`
    <p>${obtenerSaludoTiempo()} estimada Carolina,</p>
    <p>Adjunto a este correo la carta de renuncia formalizada del asesor/a <b>${formRenuncia.nombre}</b> (Cargo: ${formRenuncia.cargo}), quien forma parte de nuestro equipo comercial desde el ${formRenuncia.fechaIngreso}.</p>
    <p>La desvinculación se hará efectiva a partir del <b>${formRenuncia.fechaRenuncia}</b>, motivado por: <i>${formRenuncia.motivo}</i>.</p>
    <p>Solicito amablemente iniciar el proceso de baja en los sistemas corporativos y cálculo de finiquito correspondiente.</p>
    <p>Saludos cordiales,<br><b>${formRenuncia.asesor}</b></p>
  `);

  const getHtmlAltaCRM = () => wrapDiv(`
    <p>${obtenerSaludoTiempo()} Carolina,</p>
    <p>Solicito la creación de credenciales de acceso para los sistemas <b>CRM y CESI</b> para nuestro nuevo talento que se integra al equipo comercial:</p>
    <ul style="padding-left:20px; margin-bottom:20px;">
      <li><b>Nombre Completo:</b> ${formAltaCRM.nombre} ${formAltaCRM.apPaterno} ${formAltaCRM.apMaterno}</li>
      <li><b>C.I.:</b> ${formAltaCRM.ci}</li>
      <li><b>Nacimiento:</b> ${formAltaCRM.fechaNacimiento}</li>
      <li><b>Email:</b> ${formAltaCRM.correo}</li>
    </ul>
    <p>Saludos cordiales,<br><b>${formAltaCRM.asesor}</b></p>
  `);

  const getHtmlEvaluacion = () => wrapDiv(`
    <p>${obtenerSaludoTiempo()} María Fernanda,</p>
    <p>Remito los resultados de la Evaluación de Desempeño (Fin de Programa de Aprendizaje) del asesor <b>${formEvaluacion.nombre}</b>:</p>
    <table width="100%" cellspacing="0" style="border:1px solid #e2e8f0; margin-bottom:20px;">
      <tr><td style="${tdHeader}" colspan="2">📊 MÉTRICAS Y RESULTADOS</td></tr>
      <tr><td style="${tdCell}"><b>Puntuación Final:</b></td><td style="${tdCell}"><span style="${btnStyle} background-color:#0ea5e9;">${formEvaluacion.punteo} pts. (${formEvaluacion.calificacion})</span></td></tr>
      <tr><td style="${tdCell}"><b>Cierres Comerciales:</b></td><td style="${tdCell}">${formEvaluacion.lotes} lotes ($${formatCurrency(parseFloat(formEvaluacion.monto))})</td></tr>
      <tr><td style="${tdCell}"><b>Gestión de Leads:</b></td><td style="${tdCell}">${formEvaluacion.leads} generados | ${formEvaluacion.visitas} visitas guiadas</td></tr>
    </table>
    <div style="background-color:#f8fafc; padding:15px; border-left:4px solid #4f46e5; margin-bottom:20px;">
      <p style="margin:0; font-size:13px;"><b>Recomendación de Supervisión:</b><br>${formEvaluacion.observaciones}</p>
    </div>
    <p>Saludos cordiales,<br><b>${formEvaluacion.asesor}</b></p>
  `);

  const getHtmlPostulante = () => wrapDiv(`
    <p>${obtenerSaludoTiempo()} Ulrich,</p>
    <p>Te envío el perfil evaluado de <b>${formPostulante.nombre}</b> (Referido internamente por: ${formPostulante.referidor}).</p>
    <p>Luego de la entrevista y Role Play, mi evaluación es positiva y sugiero su paso directo al Programa de Capacitación Inicial Comercial para nuestra sucursal.</p>
    <p>Adjunto la Ficha de Entrevista.</p>
    <p>Saludos cordiales,<br><b>${formPostulante.asesor}</b></p>
  `);

  const getHtmlAmort = () => {
    const r = calcAmort();
    if(r.error) return `<p style="color:red; font-weight:bold;">Error: ${r.error}</p>`;
    return wrapDiv(`
      <p>${obtenerSaludoTiempo()},</p>
      <p>Estimado/a <b>${formAmortizacion.cliente || 'Cliente'}</b>, a continuación le presento la simulación matemática (Sistema Francés) del impacto de su abono a capital:</p>
      
      <table width="100%" cellspacing="0" style="border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; margin-bottom:20px;">
        <tr><td colspan="2" style="background-color:#1e293b; color:#fff; padding:12px; font-weight:bold; font-size:13px;">📌 SITUACIÓN ACTUAL DEL CRÉDITO</td></tr>
        <tr><td style="${tdCell}">Capital Restante Actual:</td><td style="${tdCell} text-align:right; font-weight:bold;">$ ${formatCurrency(r.Bk)}</td></tr>
        <tr><td style="${tdCell}">Cuota Fija Mensual (Pura):</td><td style="${tdCell} text-align:right;">$ ${formatCurrency(r.PMT)}</td></tr>
        <tr><td style="${tdCell}">Plazo Restante Actual:</td><td style="${tdCell} text-align:right;">${r.nOldR} meses</td></tr>
      </table>

      <table width="100%" cellspacing="0" style="border:1px solid #bbf7d0; border-radius:8px; overflow:hidden; margin-bottom:20px;">
        <tr><td colspan="2" style="background-color:#10b981; color:#fff; padding:12px; font-weight:bold; font-size:13px;">🚀 IMPACTO DEL ABONO EXTRA DE $ ${formatCurrency(formAmortizacion.montoAmortizacion)}</td></tr>
        <tr><td style="${tdCell}">Nuevo Capital Restante:</td><td style="${tdCell} text-align:right; font-weight:bold; color:#059669; font-size:16px;">$ ${formatCurrency(r.B_new)}</td></tr>
        <tr><td style="${tdCell}"><b>NUEVO PLAZO RESTANTE:</b></td><td style="${tdCell} text-align:right; font-weight:bold; color:#059669; font-size:18px;">${r.nNew} meses</td></tr>
      </table>

      <div style="background-color:#fef3c7; border:1px solid #fde68a; padding:15px; border-radius:8px;">
        <h4 style="margin-top:0; color:#b45309; font-size:14px;">🎁 SUS BENEFICIOS:</h4>
        <ul style="margin-bottom:0; color:#92400e;">
          <li><b>Usted se ahorra de pagar:</b> ${r.nOldR - r.nNew} cuotas.</li>
          <li><b>Ahorro real estimado en dinero:</b> $ ${formatCurrency(r.ahorrado)}</li>
        </ul>
      </div>
      <p>Quedo a su entera disposición.</p>
    `);
  };

  const getHtmlRecompra = () => wrapDiv(`
    <p>${obtenerSaludoTiempo()} jefe,</p>
    <p>Solicito amablemente el código de descuento por concepto de <b>RECOMPRA</b> para el siguiente cliente (Beneficio estimado: $${calcularBeneficioRecompra()}):</p>
    
    <table width="100%" cellspacing="0" style="border:1px solid #e2e8f0; margin-bottom:20px;">
      <tr><th colspan="2" style="background-color:#0f172a; color:#fff; padding:8px;">CONTRATO NUEVO</th><th colspan="2" style="background-color:#ea580c; color:#fff; padding:8px;">CONTRATO ANTIGUO</th></tr>
      <tr><td style="${tdCell} background:#f8fafc;"><b>Cliente:</b></td><td style="${tdCell} font-weight:bold;">${formRecompra.nombreNuevo}</td><td style="${tdCell} background:#fff7ed;"><b>Cliente:</b></td><td style="${tdCell} font-weight:bold;">${formRecompra.nombreAntiguo}</td></tr>
      <tr><td style="${tdCell} background:#f8fafc;"><b>Nro Contrato:</b></td><td style="${tdCell} color:#2563eb;"><b>${formRecompra.contratoNuevo}</b></td><td style="${tdCell} background:#fff7ed;"><b>Nro Contrato:</b></td><td style="${tdCell} color:#ea580c;"><b>${formRecompra.contratoAntiguo}</b></td></tr>
      <tr><td style="${tdCell} background:#f8fafc;"><b>Agencia:</b></td><td style="${tdCell}">${formRecompra.sucursal}</td><td style="${tdCell} background:#fff7ed;"><b>Patrocinador:</b></td><td style="${tdCell}">${formRecompra.patrocinador}</td></tr>
      <tr><td style="${tdCell} background:#f8fafc;"><b>Venta (Fecha):</b></td><td style="${tdCell}">${formRecompra.fechaVentaNuevo}</td><td style="${tdCell} background:#fff7ed;"><b>Venta (Fecha):</b></td><td style="${tdCell}">${formRecompra.fechaVentaAntiguo}</td></tr>
      <tr><td style="${tdCell} background:#f8fafc;"><b>Cuotas Pagadas:</b></td><td style="${tdCell}">${formRecompra.cuotasPagadas}</td><td style="${tdCell} background:#fff7ed;"><b>Valor Cuota ($):</b></td><td style="${tdCell} font-weight:bold;">$${formRecompra.valorCuota}</td></tr>
    </table>
    <p>Saludos cordiales,<br><b>${formRecompra.asesor}</b></p>
  `);

  const getHtmlDescuento = () => {
    const { vc, dTot, dTex, pF, pmF, pCuota } = calcDesc();
    const isAlerta = formDescuento.modalidad === 'Crédito' && pCuota >= 1.5 && pCuota < 5;
    return wrapDiv(`
      <p>${obtenerSaludoTiempo()} jefe,</p>
      ${isAlerta ? `<div style="background:#fef2f2; color:#b91c1c; padding:10px; border-radius:6px; border:1px solid #fca5a5; font-weight:bold; margin-bottom:15px;">⚠️ SOLICITUD DE EXCEPCIÓN: Autorización para bajar Cuota Inicial al ${formatCurrency(pCuota)}% (Categoría Calle).</div>` : ''}
      <p>Solicito la aplicación del descuento de la campaña comercial para el proyecto <b>${formDescuento.proyecto === 'OTRO...' ? formDescuento.proyectoManual : formDescuento.proyecto}</b> bajo la modalidad <b>${formDescuento.modalidad}</b>:</p>
      
      <table width="100%" cellspacing="0" style="border:1px solid #e2e8f0; border-radius:8px; margin-bottom:20px;">
        <tr><td style="${tdHeader}" colspan="2">📐 DATOS DEL LOTE (UV ${formDescuento.uv} - MZN ${formDescuento.manzano} - LT ${formDescuento.lote})</td></tr>
        <tr><td style="${tdCell}">Superficie:</td><td style="${tdCell} text-align:right;"><b>${formDescuento.m2} m²</b></td></tr>
        <tr><td style="${tdCell}">Precio de Lista (m²):</td><td style="${tdCell} text-align:right;"><b>$ ${formatCurrency(formDescuento.precioM2)}</b></td></tr>
        <tr><td style="${tdCell} background:#f8fafc;">Valor Contrato Base:</td><td style="${tdCell} text-align:right; font-size:15px; color:#0f172a;"><b>$ ${formatCurrency(vc)}</b></td></tr>
        <tr><td style="${tdHeader}" colspan="2">🏷️ APLICACIÓN DE DESCUENTO (${dTex})</td></tr>
        <tr><td style="${tdCell} color:#059669;"><b>Total Descuento Campaña:</b></td><td style="${tdCell} text-align:right; color:#059669;"><b>- $ ${formatCurrency(dTot)}</b></td></tr>
        <tr><td style="${tdCell} background:#0f172a; color:#fff; font-size:16px;"><b>NUEVO PRECIO PROMOCIONAL:</b></td><td style="${tdCell} background:#0f172a; color:#34d399; font-size:20px; text-align:right;"><b>$ ${formatCurrency(pF)}</b></td></tr>
        <tr><td style="${tdCell} border:none; text-align:right; font-size:11px; color:#64748b;" colspan="2">(Equivalente a $${formatCurrency(pmF)} el m²)</td></tr>
      </table>
      <p>Quedo atento a su aprobación.</p><p><b>${formDescuento.asesor}</b></p>
    `);
  };

  const getHtmlCuota = () => wrapDiv(`
    <p>${obtenerSaludoTiempo()} jefe,</p>
    <p>Solicito la <b>anulación y reingreso</b> del contrato ${formCuota.nroContrato} a nombre de ${formCuota.cliente} para aplicar un incremento extraordinario a su cuota inicial:</p>
    <table width="100%" cellspacing="0" style="border:1px solid #e2e8f0; margin-bottom:20px;">
      <tr><td style="${tdCell} width:50%;">Ubicación:</td><td style="${tdCell}"><b>${formCuota.proyecto} (UV ${formCuota.uv} - MZN ${formCuota.manzano} - LT ${formCuota.lote})</b></td></tr>
      <tr><td style="${tdCell} color:#dc2626;">Cuota Inicial Actual Registrada:</td><td style="${tdCell} color:#dc2626; font-weight:bold;">$ ${formatCurrency(formCuota.cuotaInicial)}</td></tr>
      <tr><td style="${tdCell} background:#f0fdf4; color:#059669; font-size:16px;"><b>NUEVA CUOTA INICIAL A ABONAR:</b></td><td style="${tdCell} background:#f0fdf4; color:#059669; font-weight:bold; font-size:18px;">$ ${formatCurrency(formCuota.nuevaCuota)}</td></tr>
    </table>
    <p><b>Justificación:</b> ${formCuota.motivo}</p>
    <p>Saludos cordiales,<br><b>${formCuota.asesorVentas}</b></p>
  `);

  const generarHtmlProyeccionOutlook = () => {
    let filas = "", tCol=0, tProyS=0, tMes=0, pA = [0,0,0,0,0];
    
    formProyeccion.asesores.forEach((a, i) => {
      const proyVentas = a.dias.reduce((x,y)=>x+y,0);
      const colAct = parseFloat(a.colAct)||0;
      const finMes = colAct + proyVentas;
      tCol+=colAct; tProyS+=proyVentas; tMes+=finMes;
      a.proy.forEach((v,x) => pA[x]+=(parseFloat(v)||0));
      
      const prod = finMes >= 25000;
      filas += `
        <tr style="background-color:${prod ? '#f0fdf4':'#ffffff'};">
          <td style="${tdCell} text-align:center;">${i+1}</td>
          <td style="${tdCell} font-weight:bold;">${a.nombre}</td>
          <td style="${tdCell} text-align:right;">${formatVacio(colAct)}</td>
          ${a.dias.map(d => `<td style="${tdCell} text-align:center; color:#64748b;">${formatDias(d)}</td>`).join('')}
          ${a.proy.map(p => `<td style="${tdCell} text-align:center; font-weight:bold; color:#0284c7;">${formatDias(p)}</td>`).join('')}
          <td style="${tdCell} text-align:right; font-weight:bold;">${formatVacio(proyVentas)}</td>
          <td style="${tdCell} text-align:right; font-weight:bold; color:${prod?'#059669':'#0f172a'};">${formatVacio(finMes)} ${prod?'✔':''}</td>
        </tr>`;
    });

    const obj = formProyeccion.objetivoMensual;
    const av = obj>0 ? (tCol/obj)*100 : 0;
    const fi = obj>0 ? (tMes/obj)*100 : 0;

    return wrapDiv(`
      <p><b>${obtenerSaludoTiempo()} estimado jefe,</b></p>
      <p>Adjunto el cuadro gerencial de Proyección Semanal del equipo:</p>
      <table width="100%" cellspacing="0" style="border:1px solid #cbd5e1; border-collapse:collapse; font-size:12px; margin-bottom:20px;">
        <thead>
          <tr>
            <th colspan="3" style="background:#0f172a; color:#fff; padding:10px; text-align:left;">Equipo: Oscar Saravia</th>
            <th colspan="7" style="background:#1e293b; color:#fff; padding:10px; text-align:center;">Ventas Proyectadas Diarias</th>
            <th colspan="5" style="background:#0ea5e9; color:#fff; padding:10px; text-align:center;">Proyectos</th>
            <th rowspan="2" style="background:#0f172a; color:#fff; padding:10px; text-align:right; vertical-align:bottom;">Total Proy.</th>
            <th rowspan="2" style="background:#10b981; color:#fff; padding:10px; text-align:right; vertical-align:bottom;">Cierre Mes</th>
          </tr>
          <tr>
            <th style="background:#334155; color:#fff; padding:8px;">#</th><th style="background:#334155; color:#fff; padding:8px;">Asesor</th><th style="background:#334155; color:#fff; padding:8px;">Coloc. Actual</th>
            ${[0,1,2,3,4,5,6].map(d => `<th style="background:#475569; color:#fff; padding:8px; text-align:center;">${formatDiaMes(formProyeccion.fechaInicio, d)}</th>`).join('')}
            ${NOMBRES_PROYECTOS_PROYECCION.map(p => `<th style="background:#38bdf8; color:#fff; padding:8px; text-align:center;">${p}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${filas}
          <tr style="background:#f1f5f9;">
            <td colspan="3" style="padding:10px; text-align:right; font-weight:bold; border-top:2px solid #cbd5e1;">TOTALES</td>
            <td colspan="7" style="border-top:2px solid #cbd5e1;"></td>
            ${pA.map(p => `<td style="padding:10px; text-align:center; font-weight:bold; color:#0284c7; border-top:2px solid #cbd5e1;">${p||'-'}</td>`).join('')}
            <td style="padding:10px; text-align:right; font-weight:bold; border-top:2px solid #cbd5e1;">${formatCurrency(tProyS)}</td>
            <td style="padding:10px; text-align:right; font-weight:bold; color:#059669; font-size:14px; border-top:2px solid #cbd5e1;">$${formatCurrency(tMes)}</td>
          </tr>
        </tbody>
      </table>
      <table width="350" cellspacing="0" style="border:1px solid #cbd5e1; font-size:12px;">
        <tr><td style="background:#0f172a; color:#fff; padding:10px;"><b>Objetivo Comercial</b></td><td style="padding:10px; text-align:right;"><b>$ ${formatCurrency(obj)}</b></td></tr>
        <tr><td style="background:#0f172a; color:#fff; padding:10px;"><b>Avance Real</b></td><td style="padding:10px; text-align:right;">$ ${formatCurrency(tCol)} <span style="background:#f1f5f9; padding:2px 5px; border-radius:4px; font-size:10px;">${av.toFixed(1)}%</span></td></tr>
        <tr><td style="background:#0f172a; color:#fff; padding:10px;"><b>Cierre Proyectado</b></td><td style="padding:10px; text-align:right; color:#059669; font-size:14px;"><b>$ ${formatCurrency(tMes)}</b> <span style="background:#d1fae5; padding:2px 5px; border-radius:4px; font-size:10px;">${fi.toFixed(1)}%</span></td></tr>
      </table>
      <p>Saludos cordiales.</p>
    `);
  };

  const textFallbacks = {
    proy: `👋 Jefe, envío el resumen de la proyección del equipo.\n\n🎯 Objetivo Mes: $ ${formatCurrency(formProyeccion.objetivoMensual)}\n📈 Avance Actual: $ ${formatCurrency(formProyeccion.asesores.reduce((s,a)=>s+(Number(a.colAct)||0),0))}\n🏁 Cierre Proyectado: $ ${formatCurrency(formProyeccion.asesores.reduce((s,a)=>s+(Number(a.colAct)||0)+a.dias.reduce((x,y)=>x+y,0),0))}\n\nSaludos.`,
    amort: `La simulación muestra que con un abono de $${formAmortizacion.montoAmortizacion}, usted terminaría su crédito en ${calcAmort().nNew} meses.`,
    recompra: `Solicitud de Recompra para el contrato ${formRecompra.contratoNuevo}. Beneficio estimado: $${calcularBeneficioRecompra()}`
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-indigo-100">
      {/* SIDEBAR NAVIGATION */}
      <div className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 shadow-2xl z-20">
        <div className="p-5 border-b border-slate-800/80 bg-gradient-to-br from-slate-900 to-indigo-950">
          <h1 className="text-xl font-black tracking-tight flex items-center"><Building2 className="w-5 h-5 mr-2 text-indigo-400" /> Portal Celina</h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-wider mt-1">EQUIPO OSCAR SARAVIA &reg;</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs font-semibold custom-scrollbar">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-3 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><LayoutDashboard className="w-4 h-4 mr-2.5" /> Dashboard Global</button>
          <button onClick={() => setActiveTab('proyeccion')} className={`w-full flex items-center px-3 py-3 rounded-xl transition-all ${activeTab === 'proyeccion' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><BarChart className="w-4 h-4 mr-2.5" /> Proyección Semanal</button>
          <button onClick={() => setActiveTab('seguimiento')} className={`w-full flex items-center px-3 py-3 rounded-xl transition-all ${activeTab === 'seguimiento' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Calendar className="w-4 h-4 mr-2.5" /> Seguimiento Diario</button>
          
          <p className="px-3 pt-4 pb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Trámites Generales</p>
          <button onClick={() => setActiveTab('bloqueo')} className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === 'bloqueo' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}><Lock className="w-4 h-4 mr-2.5" /> Bloqueo de Lote</button>
          <button onClick={() => setActiveTab('llamada')} className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === 'llamada' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}><PhoneCall className="w-4 h-4 mr-2.5" /> Validación Llamada</button>
          <button onClick={() => setActiveTab('fisico')} className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === 'fisico' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}><FileText className="w-4 h-4 mr-2.5" /> Contrato Físico</button>
          <button onClick={() => setActiveTab('reenvio')} className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === 'reenvio' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}><FileSignature className="w-4 h-4 mr-2.5" /> Reenvío Firma Digital</button>
          <button onClick={() => setActiveTab('seguro')} className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === 'seguro' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}><Shield className="w-4 h-4 mr-2.5" /> Seguro de Vida</button>

          <p className="px-3 pt-4 pb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Recursos Humanos</p>
          <button onClick={() => setActiveTab('renuncia')} className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === 'renuncia' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}><UserMinus className="w-4 h-4 mr-2.5" /> Carta de Renuncia</button>
          <button onClick={() => setActiveTab('altaCrm')} className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === 'altaCrm' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}><UserPlus className="w-4 h-4 mr-2.5" /> Alta Usuarios CRM</button>
          <button onClick={() => setActiveTab('evaluacion')} className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === 'evaluacion' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}><ClipboardCheck className="w-4 h-4 mr-2.5" /> Evaluación Fin Mes</button>
          <button onClick={() => setActiveTab('postulante')} className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === 'postulante' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}><UserCheck className="w-4 h-4 mr-2.5" /> Postulante Nuevo</button>

          <p className="px-3 pt-4 pb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Finanzas e Inversiones</p>
          <button onClick={() => setActiveTab('amortizacion')} className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === 'amortizacion' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-400 hover:bg-slate-800/50 hover:text-emerald-300'}`}><Calculator className="w-4 h-4 mr-2.5" /> Amortización a Capital</button>
          <button onClick={() => setActiveTab('recompra')} className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === 'recompra' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-400 hover:bg-slate-800/50 hover:text-amber-300'}`}><Repeat className="w-4 h-4 mr-2.5" /> Recompra Celina</button>
          <button onClick={() => setActiveTab('descuento')} className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === 'descuento' ? 'bg-sky-600 text-white shadow-sm' : 'text-sky-400 hover:bg-slate-800/50 hover:text-sky-300'}`}><Tag className="w-4 h-4 mr-2.5" /> Descuento Campañas</button>
          <button onClick={() => setActiveTab('cuota')} className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === 'cuota' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-400 hover:bg-slate-800/50 hover:text-rose-300'}`}><TrendingUp className="w-4 h-4 mr-2.5" /> Incremento Cuota Inicial</button>
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center mr-3 font-bold shadow-md">OS</div>
          <div>
            <p className="font-bold truncate text-white">Oscar H. Saravia L.</p>
            <p className="text-[10px] text-indigo-300 truncate">ohsaravia@celina.com.bo</p>
          </div>
        </div>
      </div>

      {/* CORE WORKSPACE */}
      <div className="flex-1 p-5 md:p-8 overflow-y-auto bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="max-w-[1400px] mx-auto w-full">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200/60">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div>
                    <div className="inline-flex items-center justify-center px-3 py-1 mb-3 text-xs font-black tracking-widest text-indigo-600 bg-indigo-100 rounded-full shadow-sm">PORTAL V3.0 PRO</div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">Panel de Control Global</h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Visión gerencial en tiempo real de la proyección de tu sucursal.</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700 shadow-lg min-w-[200px] text-white">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avance Global Junio</p>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-black text-emerald-400">{cumplimientoOficina.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><BarChart className="w-16 h-16"/></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Presupuesto</p>
                    <p className="text-2xl font-black text-slate-800">${formatCurrency(totalObjGlobal)}</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-l-emerald-500">
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Colocación Actual</p>
                    <p className="text-2xl font-black text-emerald-600">${formatCurrency(totalColGlobal)}</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-l-rose-500">
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">Brecha Restante</p>
                    <p className="text-2xl font-black text-rose-600">${formatCurrency(Math.max(0, totalObjGlobal - totalColGlobal))}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-lg shadow-indigo-600/30 flex flex-col justify-center text-white">
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Asesores Activos</p>
                    <p className="text-3xl font-black">{ASESORES_INICIALES.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seguimiento' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
                  <div>
                    <h2 className="text-xl font-black text-slate-800 flex items-center"><Calendar className="w-6 h-6 text-indigo-600 mr-2" /> Seguimiento Diario de Control (Junio 2026)</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Control automático de metas. Los saldos positivos indican sobrecumplimiento.</p>
                  </div>
                  <div className="flex items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 shadow-sm gap-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Día de Control:</label>
                    <input type="number" min="1" max="30" value={diaControl} onChange={(e) => setDiaControl(parseInt(e.target.value) || 1)} className="w-16 text-center font-black bg-white border border-indigo-200 focus:border-indigo-500 outline-none rounded-lg py-1.5 text-indigo-700 shadow-inner" />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                  <table className="w-full text-[11px] text-left border-collapse bg-white whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-center text-[10px]">
                        <th className="p-3 text-left border-r border-slate-800">Asesor</th>
                        <th className="p-3 border-r border-slate-800">Tipo</th>
                        <th className="p-3 text-right border-r border-slate-800">Meta Mes $</th>
                        <th className="p-3 text-right border-r border-slate-800 text-slate-400">Obj. Diario</th>
                        <th className="p-3 border-r border-slate-800">Ventas</th>
                        <th className="p-3 text-right border-r border-slate-800">Colocación Act.</th>
                        <th className="p-3 text-right border-r border-slate-800 bg-indigo-950">Saldo Acum. Diario</th>
                        <th className="p-3 text-right border-r border-slate-800">Meta Restante</th>
                        <th className="p-3 border-r border-slate-800">% Cump.</th>
                        <th className="p-3 text-right">Faltante Rally</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listSeguimiento.map((a, i) => (
                        <tr key={i} className="hover:bg-slate-50 border-b border-slate-100 text-center font-medium transition-colors">
                          <td className="p-2.5 text-left text-slate-800 font-bold border-r border-slate-100">{i+1}. {a.nombre}</td>
                          <td className="p-2.5 border-r border-slate-100"><span className={`px-2 py-1 rounded-md font-black text-[9px] uppercase tracking-wider ${a.contrato === 'Interno' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{a.contrato}</span></td>
                          <td className="p-2.5 text-right text-slate-600 font-bold border-r border-slate-100">${formatCurrency(a.obj)}</td>
                          <td className="p-2.5 text-right text-slate-400 border-r border-slate-100">${formatCurrency(a.objDiario)}</td>
                          <td className="p-2.5 font-black text-slate-700 border-r border-slate-100 bg-slate-50/50">{a.ventas}</td>
                          <td className="p-2.5 text-right text-slate-900 font-black border-r border-slate-100 bg-slate-50/50">${formatCurrency(a.col)}</td>
                          <td className={`p-2.5 text-right font-black border-r border-slate-100 ${a.saldoAcumulado >= 0 ? 'text-emerald-600 bg-emerald-50/30' : 'text-rose-500 bg-rose-50/30'}`}>{a.saldoAcumulado < 0 ? '-' : ''}${formatCurrency(Math.abs(a.saldoAcumulado))}</td>
                          <td className="p-2.5 text-right text-rose-500 font-bold border-r border-slate-100">-${formatCurrency(Math.abs(a.metaRestante))}</td>
                          <td className="p-2.5 font-black text-indigo-600 border-r border-slate-100">{a.cumplimiento.toFixed(0)}%</td>
                          <td className="p-2.5 text-right text-slate-600 font-bold bg-slate-50/50">${formatCurrency(a.faltanteRally)}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100 font-black text-slate-900 text-center border-t-2 border-slate-300">
                        <td colSpan="2" className="p-3 text-right border-r border-slate-200">TOTALES OFICINA</td>
                        <td className="p-3 text-right border-r border-slate-200">${formatCurrency(totalesSeguimiento.obj)}</td>
                        <td className="p-3 text-right text-slate-500 border-r border-slate-200">${formatCurrency(totalesSeguimiento.objD)}</td>
                        <td className="p-3 border-r border-slate-200">{totalesSeguimiento.v}</td>
                        <td className="p-3 text-right bg-slate-200/50 border-r border-slate-200">${formatCurrency(totalesSeguimiento.col)}</td>
                        <td className={`p-3 text-right border-r border-slate-200 ${totalesSeguimiento.sAcum >= 0 ? 'text-emerald-600 bg-emerald-100/50' : 'text-rose-600 bg-rose-100/50'}`}>{totalesSeguimiento.sAcum < 0 ? '-' : ''}${formatCurrency(Math.abs(totalesSeguimiento.sAcum))}</td>
                        <td className="p-3 text-right text-rose-600 border-r border-slate-200">-${formatCurrency(Math.abs(totalesSeguimiento.mRest))}</td>
                        <td className="p-3 text-indigo-700 font-black text-sm border-r border-slate-200">{totalesSeguimiento.cump.toFixed(1)}%</td>
                        <td className="p-3 text-right text-slate-700">${formatCurrency(totalesSeguimiento.falt)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'proyeccion' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl">
                <div className="flex justify-between items-end mb-5 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-800 flex items-center"><BarChart className="w-6 h-6 text-indigo-600 mr-2" /> Editor de Proyección Semanal</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Modifica los montos aquí y el cuadro de Seguimiento Diario se actualizará automáticamente.</p>
                  </div>
                  <button onClick={() => setSumaVentaModal({show: true, index: 0, nombre: formProyeccion.asesores[0].nombre, monto: ''})} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center"><Plus className="w-4 h-4 mr-1"/> Ingresar Venta Rápida</button>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap bg-white">
                    <thead>
                      <tr>
                        <th rowSpan="2" className="bg-slate-100 text-slate-800 p-2.5 border border-slate-200 font-black uppercase text-[10px]">Asesor</th>
                        <th rowSpan="2" className="bg-slate-100 text-slate-800 p-2.5 border border-slate-200 text-center font-black uppercase text-[10px] bg-emerald-50/50">Colocación<br/>Actual</th>
                        <th colSpan="7" className="bg-slate-800 text-white p-2 border border-slate-700 text-center uppercase tracking-wider text-[10px]">Proyección Diaria (Ingresar Montos)</th>
                        <th colSpan="5" className="bg-sky-100 text-sky-900 p-2 border border-sky-200 text-center uppercase tracking-wider text-[10px]">Proyectos Lotes</th>
                      </tr>
                      <tr>
                        {[0,1,2,3,4,5,6].map(d => <th key={d} className="bg-slate-700 text-slate-200 p-2 border border-slate-600 text-center font-bold text-[10px]">{formatDiaMes(formProyeccion.fechaInicio, d)}</th>)}
                        {NOMBRES_PROYECTOS_PROYECCION.map(p => <th key={p} className="bg-sky-50 text-sky-800 p-2 border border-sky-200 text-center font-bold text-[10px]">{p}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {formProyeccion.asesores.map((a, i) => {
                        const totalColMes = (Number(a.colAct)||0) + a.dias.reduce((x,y)=>x+y,0);
                        const prod = totalColMes >= 25000;
                        return (
                        <tr key={i} className={`hover:bg-slate-50 transition-colors ${prod ? 'bg-emerald-50/20' : ''}`}>
                          <td className="p-2 border border-slate-200 font-bold text-slate-700">{i+1}. {a.nombre}</td>
                          <td className="p-1 border border-slate-200 bg-slate-50/50">
                            <input type="number" value={a.colAct===0?'':a.colAct} onChange={(e) => {
                              const ns = [...formProyeccion.asesores]; ns[i].colAct = parseFloat(e.target.value)||0;
                              setFormProyeccion({...formProyeccion, asesores: ns});
                            }} className="w-full min-w-[60px] p-1.5 text-right font-black text-indigo-700 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded" placeholder="0" />
                          </td>
                          {a.dias.map((dVal, dIdx) => (
                            <td key={dIdx} className="p-1 border border-slate-200">
                              <input type="number" value={dVal===0?'':dVal} onChange={(e) => {
                                const ns = [...formProyeccion.asesores]; ns[i].dias[dIdx] = parseFloat(e.target.value)||0;
                                setFormProyeccion({...formProyeccion, asesores: ns});
                              }} className="w-full min-w-[50px] p-1.5 text-center font-bold text-slate-600 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded" placeholder="-" />
                            </td>
                          ))}
                          {a.proy.map((pVal, pIdx) => (
                            <td key={pIdx} className="p-1 border border-slate-200 bg-sky-50/30">
                              <input type="number" value={pVal===0?'':pVal} onChange={(e) => {
                                const ns = [...formProyeccion.asesores]; ns[i].proy[pIdx] = parseFloat(e.target.value)||0;
                                setFormProyeccion({...formProyeccion, asesores: ns});
                              }} className="w-full min-w-[40px] p-1.5 text-center font-black text-sky-700 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-sky-500 rounded" placeholder="0" />
                            </td>
                          ))}
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>
              <ResultCard title="Reporte Gerencial Outlook" text={textFallbacks.proy} htmlContent={generarHtmlProyeccionOutlook()} subject={`Proyección Semanal Equipo Oscar Saravia - ${formatDiaMes(formProyeccion.fechaInicio,0)}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />

              {sumaVentaModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
                  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 animate-in zoom-in-95">
                    <h3 className="text-xl font-black text-slate-800 mb-1">Añadir Venta Rápida</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Selecciona al Asesor</p>
                    <select className="w-full p-3 border rounded-xl mb-4 text-sm font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500" value={sumaVentaModal.index} onChange={(e)=>setSumaVentaModal({...sumaVentaModal, index: parseInt(e.target.value), nombre: formProyeccion.asesores[parseInt(e.target.value)].nombre})}>
                      {formProyeccion.asesores.map((a, i) => <option key={i} value={i}>{a.nombre}</option>)}
                    </select>
                    <Input label="Monto de Venta ($)" value={sumaVentaModal.monto} onChange={(e)=>setSumaVentaModal({...sumaVentaModal, monto: e.target.value})} type="number" placeholder="Ej. 6500" />
                    <div className="flex gap-3 mt-2">
                       <button onClick={()=>setSumaVentaModal({show:false, index:0, nombre:'', monto:''})} className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200">Cancelar</button>
                       <button onClick={()=>{
                         if(sumaVentaModal.monto){
                           const ns = [...formProyeccion.asesores];
                           ns[sumaVentaModal.index].colAct = (Number(ns[sumaVentaModal.index].colAct)||0) + parseFloat(sumaVentaModal.monto);
                           setFormProyeccion({...formProyeccion, asesores: ns});
                         }
                         setSumaVentaModal({show:false, index:0, nombre:'', monto:''});
                       }} className="flex-1 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md">Sumar Monto</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'llamada' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl"><h3 className="text-xl font-black text-slate-800 mb-5 flex items-center"><PhoneCall className="w-5 h-5 text-indigo-600 mr-2" /> Validación Referidos</h3>
                <Input label="Tu Nombre" value={formLlamada.asesor} onChange={hC(setFormLlamada)} name="asesor" />
                <div className="grid grid-cols-2 gap-3"><Input label="Referido" value={formLlamada.nombreReferido} onChange={hC(setFormLlamada)} name="nombreReferido" /><Input label="Contrato" value={formLlamada.contratoReferido} onChange={hC(setFormLlamada)} name="contratoReferido" /></div>
                <div className="grid grid-cols-2 gap-3"><Input label="Celular" value={formLlamada.celularReferido} onChange={hC(setFormLlamada)} name="celularReferido" /><Input label="Hora" value={formLlamada.horaLlamada} onChange={hC(setFormLlamada)} name="horaLlamada" /></div>
                <div className="grid grid-cols-2 gap-3"><Input label="Beneficiaria" value={formLlamada.nombreBeneficiario} onChange={hC(setFormLlamada)} name="nombreBeneficiario" /><Input label="C.I. Ben." value={formLlamada.ciBeneficiario} onChange={hC(setFormLlamada)} name="ciBeneficiario" /></div>
              </div>
              <ResultCard title="Correo a Atención Cliente" text="Validación de llamada..." htmlContent={getHtmlLlamada()} subject="Validación de Referido" fixedEmail="omendoza@celina.com.bo" fixedLabel="Olivia Mendoza" />
            </div>
          )}

          {activeTab === 'bloqueo' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl"><h3 className="text-xl font-black text-slate-800 mb-5 flex items-center"><Lock className="w-5 h-5 text-indigo-600 mr-2" /> Bloqueo Inmediato</h3>
                <Input label="Tu Nombre" value={formBloqueo.asesor} onChange={hC(setFormBloqueo)} name="asesor" />
                <div className="mb-4"><label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1 uppercase">Proyecto</label><select name="proyecto" value={formBloqueo.proyecto} onChange={hC(setFormBloqueo)} className="w-full p-3 border rounded-xl bg-slate-50 text-sm">{PROYECTOS.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
                <div className="grid grid-cols-3 gap-2"><Input label="UV" value={formBloqueo.uv} onChange={hC(setFormBloqueo)} name="uv" /><Input label="MZN" value={formBloqueo.manzano} onChange={hC(setFormBloqueo)} name="manzano" /><Input label="LOTE" value={formBloqueo.lote} onChange={hC(setFormBloqueo)} name="lote" /></div>
                <div className="grid grid-cols-2 gap-3"><Input label="Superficie (m2)" value={formBloqueo.superficie} onChange={hC(setFormBloqueo)} name="superficie" /><Input label="Categoría" value={formBloqueo.categoria} onChange={hC(setFormBloqueo)} name="categoria" /></div>
                <Input label="Hora Cierre" value={formBloqueo.horaVenta} onChange={hC(setFormBloqueo)} name="horaVenta" />
              </div>
              <ResultCard title="Correo Autorización" text="Bloqueo Lote..." htmlContent={getHtmlBloqueo()} subject={`Solicitud bloqueo - Venta segura (${formBloqueo.proyecto})`} fixedEmail="rvaca@grupopaz.com.bo" fixedLabel="Robert Vaca" ccEmails="vchoque@celina.com.bo, mreyes@celina.com.bo" />
            </div>
          )}

          {activeTab === 'fisico' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl"><h3 className="text-xl font-black text-slate-800 mb-5 flex items-center"><FileText className="w-5 h-5 text-indigo-600 mr-2" /> Contrato Físico</h3>
                <Input label="Tu Nombre" value={formFisico.asesor} onChange={hC(setFormFisico)} name="asesor" />
                <Input label="Cliente" value={formFisico.nombre} onChange={hC(setFormFisico)} name="nombre" />
                <div className="grid grid-cols-2 gap-3"><Input label="C.I." value={formFisico.ci} onChange={hC(setFormFisico)} name="ci" /><Input label="Contrato" value={formFisico.contrato} onChange={hC(setFormFisico)} name="contrato" /></div>
                <TextArea label="Motivo" value={formFisico.motivo} onChange={hC(setFormFisico)} name="motivo" />
              </div>
              <ResultCard title="Solicitud Físico" text="Cambio Físico..." htmlContent={getHtmlFisico()} subject={`Solicitud Contrato Físico - ${formFisico.nombre}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
            </div>
          )}

          {activeTab === 'reenvio' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl"><h3 className="text-xl font-black text-slate-800 mb-5 flex items-center"><FileSignature className="w-5 h-5 text-indigo-600 mr-2" /> Reenvío Firma Digital</h3>
                <div className="grid grid-cols-2 gap-3 mb-4"><Input label="Tu Nombre" value={formReenvio.asesor} onChange={(e)=>setFormReenvio({...formReenvio, asesor:e.target.value})} /><div className="w-full"><label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1 uppercase">Proyecto</label><select value={formReenvio.proyecto} onChange={(e)=>setFormReenvio({...formReenvio, proyecto:e.target.value})} className="w-full p-3 border rounded-xl bg-slate-50 text-sm">{PROYECTOS.map(p=><option key={p} value={p}>{p}</option>)}</select></div></div>
                <div className="space-y-4 max-h-[50vh] overflow-auto pr-2">
                  {formReenvio.contratos.map((c, i) => (
                    <div key={i} className="p-4 bg-slate-50 border rounded-2xl relative"><button onClick={()=>setFormReenvio({...formReenvio, contratos: formReenvio.contratos.filter((_,x)=>x!==i)})} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-full"><Trash2 className="w-4 h-4"/></button>
                      <div className="grid grid-cols-2 gap-2 mb-2"><Input label="Contrato" value={c.nroContrato} onChange={(e)=>handleReenvioChange(i, 'nroContrato', e.target.value)} /><Input label="C.I." value={c.ci} onChange={(e)=>handleReenvioChange(i, 'ci', e.target.value)} /></div>
                      <Input label="Cliente" value={c.cliente} onChange={(e)=>handleReenvioChange(i, 'cliente', e.target.value)} />
                      <div className="grid grid-cols-3 gap-2"><Input label="UV" value={c.uv} onChange={(e)=>handleReenvioChange(i, 'uv', e.target.value)} /><Input label="MZN" value={c.manzano} onChange={(e)=>handleReenvioChange(i, 'manzano', e.target.value)} /><Input label="LOTE" value={c.lote} onChange={(e)=>handleReenvioChange(i, 'lote', e.target.value)} /></div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setFormReenvio({...formReenvio, contratos: [...formReenvio.contratos, {nroContrato:'',cliente:'',ci:'',uv:'',manzano:'',lote:''}]})} className="w-full mt-4 py-3 border-2 border-dashed rounded-xl font-bold text-slate-500 hover:text-indigo-600">+ Añadir Contrato</button>
              </div>
              <ResultCard title="Correo Reenvío" text="Reenvío firmas..." htmlContent={getHtmlReenvio()} subject={`Reenvío Firma Digital - ${formReenvio.proyecto}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
            </div>
          )}

          {activeTab === 'seguro' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl"><h3 className="text-xl font-black text-slate-800 mb-5 flex items-center"><Shield className="w-5 h-5 text-indigo-600 mr-2" /> Beneficiarios Seguro</h3>
                <Input label="Tu Nombre" value={formSeguro.asesor} onChange={hC(setFormSeguro)} name="asesor" />
                <div className="grid grid-cols-2 gap-3"><Input label="Cliente" value={formSeguro.cliente} onChange={hC(setFormSeguro)} name="cliente" /><Input label="Contrato" value={formSeguro.nroContrato} onChange={hC(setFormSeguro)} name="nroContrato" /></div>
                <div className="grid grid-cols-3 gap-2 mb-4"><Input label="UV" value={formSeguro.uv} onChange={hC(setFormSeguro)} name="uv" /><Input label="MZN" value={formSeguro.manzano} onChange={hC(setFormSeguro)} name="manzano" /><Input label="LOTE" value={formSeguro.lote} onChange={hC(setFormSeguro)} name="lote" /></div>
                <div className="space-y-4 max-h-[50vh] overflow-auto pr-2">
                  {formSeguro.beneficiarios.map((b, i) => (
                    <div key={i} className="p-4 bg-slate-50 border rounded-2xl relative"><button onClick={()=>setFormSeguro({...formSeguro, beneficiarios: formSeguro.beneficiarios.filter((_,x)=>x!==i)})} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-full"><Trash2 className="w-4 h-4"/></button>
                      <div className="grid grid-cols-2 gap-2 mb-2"><Input label="Beneficiario" value={b.nombre} onChange={(e)=>handleBeneficiarioChange(i, 'nombre', e.target.value)} /><Input label="Parentesco" value={b.parentesco} onChange={(e)=>handleBeneficiarioChange(i, 'parentesco', e.target.value)} /></div>
                      <div className="grid grid-cols-2 gap-2"><Input label="% Porcentaje" value={b.porcentaje} onChange={(e)=>handleBeneficiarioChange(i, 'porcentaje', e.target.value)} type="number"/><Input label="C.I." value={b.ci} onChange={(e)=>handleBeneficiarioChange(i, 'ci', e.target.value)} /></div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setFormSeguro({...formSeguro, beneficiarios: [...formSeguro.beneficiarios, {nombre:'',parentesco:'',porcentaje:'100',ci:''}]})} className="w-full mt-4 py-3 border-2 border-dashed rounded-xl font-bold text-slate-500 hover:text-indigo-600">+ Añadir Beneficiario</button>
              </div>
              <ResultCard title="Póliza Seguro" text="Seguro de vida..." htmlContent={getHtmlSeguro()} subject={`Adición Seguros - Contrato ${formSeguro.nroContrato}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
            </div>
          )}

          {activeTab === 'renuncia' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl"><h3 className="text-xl font-black text-slate-800 mb-5 flex items-center"><UserMinus className="w-5 h-5 text-indigo-600 mr-2" /> Renuncia Comercial</h3>
                <Input label="Tu Nombre" value={formRenuncia.asesor} onChange={hC(setFormRenuncia)} name="asesor" />
                <div className="grid grid-cols-2 gap-3"><Input label="Asesor Saliente" value={formRenuncia.nombre} onChange={hC(setFormRenuncia)} name="nombre" /><Input label="Cargo" value={formRenuncia.cargo} onChange={hC(setFormRenuncia)} name="cargo" /></div>
                <div className="grid grid-cols-2 gap-3"><Input label="Fecha Ingreso" value={formRenuncia.fechaIngreso} onChange={hC(setFormRenuncia)} name="fechaIngreso" /><Input label="Fecha Retiro" value={formRenuncia.fechaRenuncia} onChange={hC(setFormRenuncia)} name="fechaRenuncia" /></div>
                <TextArea label="Motivos" value={formRenuncia.motivo} onChange={hC(setFormRenuncia)} name="motivo" />
              </div>
              <ResultCard title="Correo RRHH" text="Renuncia..." htmlContent={getHtmlRenuncia()} subject={`Carta Renuncia - ${formRenuncia.nombre}`} fixedEmail="cmontero@celina.com.bo" fixedLabel="Carolina Montero" ccEmails="mfroca@celina.com.bo" />
            </div>
          )}

          {activeTab === 'altaCrm' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl"><h3 className="text-xl font-black text-slate-800 mb-5 flex items-center"><UserPlus className="w-5 h-5 text-indigo-600 mr-2" /> Alta Usuarios CRM</h3>
                <Input label="Tu Nombre" value={formAltaCRM.asesor} onChange={hC(setFormAltaCRM)} name="asesor" />
                <div className="grid grid-cols-3 gap-2"><Input label="Nombres" value={formAltaCRM.nombre} onChange={hC(setFormAltaCRM)} name="nombre" /><Input label="Ap. Pat" value={formAltaCRM.apPaterno} onChange={hC(setFormAltaCRM)} name="apPaterno" /><Input label="Ap. Mat" value={formAltaCRM.apMaterno} onChange={hC(setFormAltaCRM)} name="apMaterno" /></div>
                <div className="grid grid-cols-2 gap-3"><Input label="C.I." value={formAltaCRM.ci} onChange={hC(setFormAltaCRM)} name="ci" /><Input label="Fecha Nac." value={formAltaCRM.fechaNacimiento} onChange={hC(setFormAltaCRM)} name="fechaNacimiento" /></div>
                <Input label="Correo Personal/Celina" value={formAltaCRM.correo} onChange={hC(setFormAltaCRM)} name="correo" />
              </div>
              <ResultCard title="Correo Alta" text="Alta CRM..." htmlContent={getHtmlAltaCRM()} subject={`Alta Sistemas CRM - ${formAltaCRM.nombre}`} fixedEmail="cmontero@celina.com.bo" fixedLabel="Carolina Montero" ccEmails="mfroca@celina.com.bo" />
            </div>
          )}

          {activeTab === 'evaluacion' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl"><h3 className="text-xl font-black text-slate-800 mb-5 flex items-center"><ClipboardCheck className="w-5 h-5 text-indigo-600 mr-2" /> Evaluación Aprendizaje</h3>
                <Input label="Tu Nombre" value={formEvaluacion.asesor} onChange={hC(setFormEvaluacion)} name="asesor" />
                <Input label="Asesor Evaluado" value={formEvaluacion.nombre} onChange={hC(setFormEvaluacion)} name="nombre" />
                <div className="grid grid-cols-2 gap-3"><Input label="Punteo Total" value={formEvaluacion.punteo} onChange={hC(setFormEvaluacion)} name="punteo" type="number" /><Input label="Calificación" value={formEvaluacion.calificacion} onChange={hC(setFormEvaluacion)} name="calificacion" /></div>
                <div className="grid grid-cols-3 gap-2"><Input label="Lotes" value={formEvaluacion.lotes} onChange={hC(setFormEvaluacion)} name="lotes" type="number" /><Input label="Monto $" value={formEvaluacion.monto} onChange={hC(setFormEvaluacion)} name="monto" type="number" /><Input label="Leads" value={formEvaluacion.leads} onChange={hC(setFormEvaluacion)} name="leads" type="number" /></div>
                <TextArea label="Recomendación" value={formEvaluacion.observaciones} onChange={hC(setFormEvaluacion)} name="observaciones" />
              </div>
              <ResultCard title="Reporte Final" text="Evaluacion..." htmlContent={getHtmlEvaluacion()} subject={`Evaluación Desempeño - ${formEvaluacion.nombre}`} fixedEmail="mfroca@celina.com.bo" fixedLabel="Maria Fernanda Roca" />
            </div>
          )}

          {activeTab === 'postulante' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl"><h3 className="text-xl font-black text-slate-800 mb-5 flex items-center"><UserCheck className="w-5 h-5 text-indigo-600 mr-2" /> Derivación Postulante</h3>
                <Input label="Tu Nombre" value={formPostulante.asesor} onChange={hC(setFormPostulante)} name="asesor" />
                <Input label="Postulante" value={formPostulante.nombre} onChange={hC(setFormPostulante)} name="nombre" />
                <Input label="Referido por" value={formPostulante.referidor} onChange={hC(setFormPostulante)} name="referidor" />
              </div>
              <ResultCard title="Correo Selección" text="Postulante..." htmlContent={getHtmlPostulante()} subject={`Nuevo Postulante Evaluado - ${formPostulante.nombre}`} fixedEmail="uklein@grupopaz.com.bo" fixedLabel="Ulrich Klein" />
            </div>
          )}

          {activeTab === 'amortizacion' && (() => {
            const r = calcAmort();
            return (
              <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl"><h3 className="text-xl font-black text-slate-800 mb-5 flex items-center"><Calculator className="w-5 h-5 text-indigo-600 mr-2" /> Simulador Amortización Francés</h3>
                  <Input label="Cliente (Opcional)" value={formAmortizacion.cliente} onChange={handleAmortChange} name="cliente" />
                  <div className="grid grid-cols-2 gap-3"><Input label="Precio Contado $" value={formAmortizacion.precioContado} onChange={handleAmortChange} name="precioContado" type="number" /><Input label="Cuota Inicial $" value={formAmortizacion.cuotaInicial} onChange={handleAmortChange} name="cuotaInicial" type="number" /></div>
                  <div className="grid grid-cols-3 gap-2"><Input label="Plazo Años" value={formAmortizacion.plazoAnios} onChange={handleAmortChange} name="plazoAnios" type="number" /><Input label="Cuotas Pagadas" value={formAmortizacion.cuotasPagadas} onChange={handleAmortChange} name="cuotasPagadas" type="number" /><Input label="Seguro Mens." value={formAmortizacion.seguroMensual} onChange={handleAmortChange} name="seguroMensual" type="number" /></div>
                  <div className="grid grid-cols-2 gap-3"><Input label="Abono Extra $" value={formAmortizacion.montoAmortizacion} onChange={handleAmortChange} name="montoAmortizacion" type="number" /><Input label="Tasa Anual %" value={formAmortizacion.tasaAnual} onChange={handleAmortChange} name="tasaAnual" type="number" /></div>
                  {!r.error && (
                    <div className="bg-slate-900 text-white p-4 rounded-xl mt-2 grid grid-cols-2 gap-3 text-xs shadow-inner">
                      <div><p className="text-slate-400 font-bold mb-1">Cap. Financiado</p><p className="text-lg font-black">${formatCurrency(r.P)}</p></div>
                      <div><p className="text-slate-400 font-bold mb-1">Cuota Fija</p><p className="text-lg font-black">${formatCurrency(r.PMT)}</p></div>
                      <div><p className="text-slate-400 font-bold mb-1">Saldo Actual</p><p className="text-lg font-black text-sky-400">${formatCurrency(r.Bk)}</p></div>
                      <div><p className="text-slate-400 font-bold mb-1">Ahorro Estimado</p><p className="text-lg font-black text-emerald-400">${formatCurrency(r.ahorrado)}</p></div>
                    </div>
                  )}
                </div>
                <ResultCard hideDestino text={textFallbacks.amort} htmlContent={getHtmlAmort()} />
              </div>
            );
          })()}

          {activeTab === 'recompra' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl"><h3 className="text-xl font-black text-slate-800 mb-5 flex items-center"><Repeat className="w-5 h-5 text-indigo-600 mr-2" /> Solicitud Recompra</h3>
                <div className="grid grid-cols-2 gap-3 mb-4"><Input label="Tu Nombre" value={formRecompra.asesor} onChange={hC(setFormRecompra)} name="asesor" /><div className="w-full"><label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1 uppercase">Proyecto Beneficio</label><select name="proyecto" value={formRecompra.proyecto} onChange={hC(setFormRecompra)} className="w-full p-3 border rounded-xl bg-slate-50 text-sm">{PROYECTOS.map(p=><option key={p} value={p}>{p}</option>)}</select></div></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200"><h4 className="font-black text-slate-800 mb-3 text-xs uppercase tracking-widest border-b pb-2">Contrato Nuevo</h4><Input label="Agencia" value={formRecompra.sucursal} onChange={hC(setFormRecompra)} name="sucursal" /><Input label="Cliente Nuevo" value={formRecompra.nombreNuevo} onChange={handleRecompraChange} name="nombreNuevo" /><Input label="Contrato" value={formRecompra.contratoNuevo} onChange={hC(setFormRecompra)} name="contratoNuevo" /><div className="grid grid-cols-2 gap-2"><Input label="Venta" value={formRecompra.fechaVentaNuevo} onChange={hC(setFormRecompra)} name="fechaVentaNuevo" /><Input label="Pagadas" value={formRecompra.cuotasPagadas} onChange={hC(setFormRecompra)} name="cuotasPagadas" type="number" /></div></div>
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100"><h4 className="font-black text-orange-800 mb-3 text-xs uppercase tracking-widest border-b border-orange-200 pb-2">Contrato Antiguo</h4><Input label="Cliente Antiguo" value={formRecompra.nombreAntiguo} onChange={hC(setFormRecompra)} name="nombreAntiguo" /><Input label="Contrato" value={formRecompra.contratoAntiguo} onChange={hC(setFormRecompra)} name="contratoAntiguo" /><div className="grid grid-cols-2 gap-2"><Input label="Patrocinador" value={formRecompra.patrocinador} onChange={hC(setFormRecompra)} name="patrocinador" /><Input label="Cuota $" value={formRecompra.valorCuota} onChange={hC(setFormRecompra)} name="valorCuota" type="number" /></div><div className="grid grid-cols-2 gap-2"><Input label="Venta" value={formRecompra.fechaVentaAntiguo} onChange={hC(setFormRecompra)} name="fechaVentaAntiguo" /><Input label="Fecha Pago" value={formRecompra.fechaPago} onChange={hC(setFormRecompra)} name="fechaPago" /></div></div>
                </div>
              </div>
              <ResultCard title="Correo Recompra" text={textFallbacks.recompra} htmlContent={getHtmlRecompra()} subject={`Solicitud Recompra - ${formRecompra.nombreNuevo}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
            </div>
          )}

          {activeTab === 'descuento' && (() => {
            const { vc, dTot, dTex, pF, pmF, pCuota } = calcDesc();
            return (
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl">
                  <div className="flex justify-between items-center mb-5"><h3 className="text-xl font-black text-slate-800 flex items-center"><Tag className="w-5 h-5 text-indigo-600 mr-2" /> Descuentos Especiales</h3><button onClick={()=>setFormDescuento({...formDescuento, modoBusqueda: formDescuento.modoBusqueda==='manual'?'inteligente':'manual'})} className="px-3 py-1 bg-slate-100 font-bold text-xs rounded-full text-indigo-600">{formDescuento.modoBusqueda==='manual'?'Cambiar a Auto':'Cambiar a Manual'}</button></div>
                  <div className="grid grid-cols-2 gap-3 mb-4"><div className="w-full"><label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1 uppercase">Proyecto</label><select name="proyecto" value={formDescuento.proyecto} onChange={handleDescChange} className="w-full p-3 border rounded-xl bg-slate-50 text-sm">{PROYECTOS.map(p=><option key={p} value={p}>{p}</option>)}</select></div><div className="w-full"><label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1 uppercase">Modalidad</label><select name="modalidad" value={formDescuento.modalidad} onChange={handleDescChange} className="w-full p-3 border rounded-xl bg-slate-50 text-sm"><option value="Contado">Contado</option><option value="Crédito">Crédito</option></select></div></div>
                  {formDescuento.modalidad === 'Crédito' && <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4 flex gap-3"><select value={formDescuento.modoCuota} onChange={(e)=>setFormDescuento({...formDescuento, modoCuota:e.target.value})} className="p-2 border rounded-lg bg-white text-sm"><option value="monto">Monto $</option><option value="porcentaje">%</option></select><input type="number" name="cuota" value={formDescuento.cuota} onChange={handleDescChange} placeholder="Ingresa Cuota Inicial" className="w-full p-2 border rounded-lg bg-white outline-none" /><div className="bg-blue-600 text-white font-bold p-2 rounded-lg px-4 flex items-center justify-center text-xs">{formDescuento.modoCuota === 'monto' ? `${formatCurrency(pCuota)}%` : `$${formatCurrency((pCuota/100)*vc)}`}</div></div>}
                  {formDescuento.modoBusqueda === 'inteligente' && formDescuento.proyecto !== 'OTRO...' ? (
                    <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 p-4 rounded-xl border"><select name="uv" value={formDescuento.uv} onChange={handleDescChange} className="w-full p-2 border rounded text-xs"><option value="">UV</option>{opUV.map(u=><option key={u}>{u}</option>)}</select><select name="manzano" value={formDescuento.manzano} onChange={handleDescChange} disabled={!formDescuento.uv} className="w-full p-2 border rounded text-xs"><option value="">MZN</option>{opMZN.map(m=><option key={m}>{m}</option>)}</select><select name="lote" value={formDescuento.lote} onChange={handleDescChange} disabled={!formDescuento.manzano} className="w-full p-2 border rounded text-xs"><option value="">LOTE</option>{opLT.map(l=><option key={l}>{l}</option>)}</select></div>
                  ) : <div className="grid grid-cols-3 gap-2 mb-4"><Input label="UV" value={formDescuento.uv} onChange={handleDescChange} name="uv" /><Input label="MZN" value={formDescuento.manzano} onChange={handleDescChange} name="manzano" /><Input label="LT" value={formDescuento.lote} onChange={handleDescChange} name="lote" /></div>}
                  <div className="grid grid-cols-2 gap-3 mb-2"><Input label="Superficie m2" value={formDescuento.m2} onChange={handleDescChange} name="m2" type="number" /><Input label="Precio m2" value={formDescuento.precioM2} onChange={handleDescChange} name="precioM2" type="number" /></div>
                  <Input label="Tu Nombre" value={formDescuento.asesor} onChange={handleDescChange} name="asesor" />
                </div>
                <ResultCard title="Correo Campañas" text="Descuento..." htmlContent={getHtmlDescuento()} subject={`Autorización Descuento Campaña`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
              </div>
            );
          })()}

          {activeTab === 'cuota' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl"><h3 className="text-xl font-black text-slate-800 mb-5 flex items-center"><TrendingUp className="w-5 h-5 text-indigo-600 mr-2" /> Incremento Cuota Inicial</h3>
                <Input label="Tu Nombre" value={formCuota.asesorVentas} onChange={hC(setFormCuota)} name="asesorVentas" />
                <div className="grid grid-cols-2 gap-3"><Input label="Contrato" value={formCuota.nroContrato} onChange={hC(setFormCuota)} name="nroContrato" /><Input label="C.I. Cliente" value={formCuota.ci} onChange={hC(setFormCuota)} name="ci" /></div>
                <Input label="Nombre Cliente" value={formCuota.cliente} onChange={hC(setFormCuota)} name="cliente" />
                <div className="mb-4"><label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1 uppercase">Proyecto</label><select name="proyecto" value={formCuota.proyecto} onChange={hC(setFormCuota)} className="w-full p-3 border rounded-xl bg-slate-50 text-sm">{PROYECTOS.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
                <div className="grid grid-cols-3 gap-2"><Input label="UV" value={formCuota.uv} onChange={hC(setFormCuota)} name="uv" /><Input label="MZN" value={formCuota.manzano} onChange={hC(setFormCuota)} name="manzano" /><Input label="LT" value={formCuota.lote} onChange={hC(setFormCuota)} name="lote" /></div>
                <div className="grid grid-cols-2 gap-3"><Input label="C.I. Registrada" value={formCuota.cuotaInicial} onChange={hC(setFormCuota)} name="cuotaInicial" type="number" /><Input label="NUEVA C.I." value={formCuota.nuevaCuota} onChange={hC(setFormCuota)} name="nuevaCuota" type="number" /></div>
                <TextArea label="Motivo Reingreso" value={formCuota.motivo} onChange={hC(setFormCuota)} name="motivo" />
              </div>
              <ResultCard title="Correo Incremento" text="Incremento CI..." htmlContent={getHtmlCuota()} subject={`Incremento Cuota Inicial - ${formCuota.proyecto}`} supervisorDestino={supervisorDestino} setSupervisorDestino={setSupervisorDestino} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
