import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { ResultCard } from '../components/ui/ResultCard';
import { EQUIPOS_ASESORES, SUPERVISORES } from '../constants/equipo';
import { formatCurrency } from '../utils/formatters';
import { obtenerDatosSupervisor } from '../utils/calculadoras';
import { generarTextoDiariaCelular } from '../utils/textTemplates';
import { generarHtmlDiaria } from '../utils/htmlTemplates';

export default function ProyeccionDiaria() {
  const [supervisorDestino, setSupervisorDestino] = useState('mreyes@celina.com.bo'); // Por defecto a Mauricio
  const [formDiaria, setFormDiaria] = useState(() => {
    return EQUIPOS_ASESORES["Oscar Saravia"].map(a => ({
      nombre: a.nombre, tipo: a.tipo, visita: '', venta: '', colocacion: '', hora: '', medio: ''
    }));
  });

  const handleChange = (idx, field, value) => {
    const nuevos = [...formDiaria];
    nuevos[idx][field] = value;
    setFormDiaria(nuevos);
  };

  const supervisorData = obtenerDatosSupervisor(supervisorDestino, SUPERVISORES);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
            GERENCIA COMERCIAL • DIRECCIÓN ESTRATÉGICA
          </span>
        </div><h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center"><CalendarDays className="w-6 h-6 mr-2 text-cyan-400" /> Proyección Diaria</h2></div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] 2xl:grid-cols-[2fr_1fr] gap-8 w-full">
        <div className="bg-[var(--bg-card)] border border-[var(--border-glow)] rounded-3xl text-[var(--text-primary)] shadow-2xl overflow-hidden shadow-sm flex flex-col min-w-0">
          <div className="bg-[var(--bg-card-inner)] border-b border-[var(--border-glow)] text-[var(--text-primary)] p-3"><h3 className="text-sm font-bold">Proyeccion Diaria Equipo "MAQUINA DE VENTAS"</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[var(--bg-card-inner)] border-b border-[var(--border-glow)] text-[var(--text-primary)] border-b border-[#001540]">
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
                  <tr key={idx} className="border-b border-[var(--border-glow)] hover:bg-[var(--bg-card-inner)] font-semibold text-[var(--text-primary)]">
                    <td className="p-2 border-r border-[var(--border-glow)] text-center">{idx + 1}</td>
                    <td className="p-2 border-r border-[var(--border-glow)] uppercase text-xs">{a.nombre}</td>
                    <td className="p-2 border-r border-[var(--border-glow)] text-center">{a.tipo}</td>
                    <td className="p-0 border-r border-[var(--border-glow)]"><input type="number" value={a.visita} onChange={(e) => handleChange(idx, 'visita', e.target.value)} className="w-full h-full p-2 text-center focus:bg-[var(--bg-card-hover)] outline-none font-bold bg-transparent" placeholder="0" /></td>
                    <td className="p-0 border-r border-[var(--border-glow)]"><input type="number" value={a.venta} onChange={(e) => handleChange(idx, 'venta', e.target.value)} className="w-full h-full p-2 text-center focus:bg-[var(--bg-card-hover)] outline-none font-bold bg-transparent" placeholder="0" /></td>
                    <td className="p-0 border-r border-[var(--border-glow)]"><input type="number" value={a.colocacion} onChange={(e) => handleChange(idx, 'colocacion', e.target.value)} className="w-full h-full p-2 text-center focus:bg-[var(--bg-card-hover)] outline-none font-bold bg-transparent" placeholder="0,00" /></td>
                    <td className="p-0 border-r border-[var(--border-glow)]"><input type="text" value={a.hora} onChange={(e) => handleChange(idx, 'hora', e.target.value)} className="w-full h-full p-2 focus:bg-[var(--bg-card-hover)] outline-none bg-transparent uppercase" /></td>
                    <td className="p-0"><input type="text" value={a.medio} onChange={(e) => handleChange(idx, 'medio', e.target.value)} className="w-full h-full p-2 focus:bg-[var(--bg-card-hover)] outline-none bg-transparent uppercase" /></td>
                  </tr>
                ))}
                <tr className="bg-[var(--bg-card-inner)] font-bold border-t-2 border-[var(--border-highlight)]">
                  <td colSpan="3" className="p-2 text-right border-r border-[var(--border-highlight)] text-[var(--text-primary)]">TOTAL VISITAS</td>
                  <td className="p-2 text-center border-r border-[var(--border-highlight)] bg-[var(--bg-card)]">{formDiaria.reduce((sum, a) => sum + (parseFloat(a.visita) || 0), 0)}</td>
                  <td colSpan="4"></td>
                </tr>
                <tr className="bg-[var(--bg-card-inner)] font-bold border-t border-[var(--border-highlight)]">
                  <td colSpan="3" className="p-2 text-right border-r border-[var(--border-highlight)] text-[var(--text-primary)]">TOTAL VENTAS</td>
                  <td className="p-2 text-center border-r border-[var(--border-highlight)] bg-[var(--bg-card)]">{formDiaria.reduce((sum, a) => sum + (parseFloat(a.venta) || 0), 0)}</td>
                  <td colSpan="4"></td>
                </tr>
                <tr className="bg-[var(--bg-card-inner)] border-b border-[var(--border-glow)] font-bold text-[var(--text-primary)]">
                  <td colSpan="3" className="p-2 text-right border-r border-[#001540]">TOTAL DÍA $us.</td>
                  <td className="p-2 text-center border-r border-[#001540]">{formatCurrency(formDiaria.reduce((sum, a) => sum + (parseFloat(a.colocacion) || 0), 0))}</td>
                  <td colSpan="4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full min-w-0">
          <ResultCard
            title="Proyección Diaria"
            text={generarTextoDiariaCelular(formDiaria, supervisorData)}
            htmlContent={generarHtmlDiaria(formDiaria, supervisorData)}
            subject="Reporte de Proyección Diaria - Máquina de Ventas"
            supervisorDestino={supervisorDestino}
            setSupervisorDestino={setSupervisorDestino}
          />
        </div>
      </div>
    </div>
  );
}
