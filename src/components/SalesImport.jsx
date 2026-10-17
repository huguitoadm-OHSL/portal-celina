import { useState } from 'react';
import { Upload, FileCheck2 } from 'lucide-react';
import { useCommercial } from '../hooks/useCommercial';
import { planSalesImport } from '../services/salesImport';
import { formatCurrency } from '../utils/formatters';

export default function SalesImport() {
  const { sales, importSales, storageError } = useCommercial();
  const [rows, setRows] = useState(null);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function selectFile(event) {
    const file = event.target.files?.[0];
    setRows(null); setPlan(null); setError(''); setMessage('');
    if (!file) return;
    setBusy(true);
    try {
      if (!/\.xlsx$/i.test(file.name)) throw new Error('Seleccione un Excel .xlsx. Guarde los archivos .xls en ese formato antes de cargarlos.');
      if (file.size > 5_000_000) throw new Error('El Excel debe pesar menos de 5 MB.');
      const { readSheet } = await import('read-excel-file/browser');
      const data = await readSheet(file);
      setPlan(planSalesImport(data, sales)); setRows(data);
    } catch (failure) { setError(failure.message || 'No se pudo leer el Excel.'); }
    finally { event.target.value = ''; setBusy(false); }
  }
  function apply() {
    try {
      const result = importSales(rows);
      setMessage(`${result.additions.length} ventas incorporadas. ${result.duplicateCount} coincidencias omitidas para evitar duplicados. Inicio, Proyección, Seguimiento e Incentivos actualizados.`);
      setPlan(null); setRows(null); setError('');
    } catch (failure) { setError(failure.message); }
  }
  return <section className="panel mb-6" aria-labelledby="sales-import-title">
    <div className="panel-heading"><div><p className="eyebrow">ACTUALIZAR COLOCACIÓN</p><h2 id="sales-import-title"><Upload size={20} className="inline mr-2"/>Cargar ventas desde Excel</h2></div><span className="subtle-badge">USD · sin duplicados</span></div>
    <p>Primera hoja: <strong>Urbanización, Vendedor, Fecha de Venta y Precio al Contado</strong>. Una fila por venta. Contrato, Lotes, Moneda y Estado son opcionales. Si no hay columna Lotes, se cuenta 1 por fila. Solo ventas realizadas de octubre de 2026; las proyecciones se editan por separado.</p>
    <label className="file-label">Seleccionar Excel de ventas<input aria-label="Excel de ventas" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={selectFile} disabled={busy || Boolean(storageError)}/></label>
    <p className="muted">El archivo se procesa en tu dispositivo. Al confirmar, las ventas nuevas quedan guardadas en este navegador y se conservan al recargar. No se sincronizan con otros dispositivos ni modifican el CRM. Conserva tu Excel como respaldo.</p>
    {busy && <p role="status">Leyendo y conciliando el Excel…</p>}
    {(error || storageError) && <p role="alert">{error || storageError}</p>}
    {message && <p role="status"><FileCheck2 className="inline mr-2" size={18}/>{message}</p>}
    {plan && <div>
      <p role="status"><strong>{plan.additions.length} nuevas</strong> · {plan.duplicateCount} coincidencias · {plan.errors.length} observaciones · Colocación adicional: USD {formatCurrency(plan.additions.reduce((sum, sale) => sum + Math.round(sale.amountUsd * 100), 0) / 100)}</p>
      <p>Las coincidencias sin contrato se omiten de forma preventiva. Si son operaciones distintas, verifica sus identificadores antes de incorporarlas. No se reemplazan ventas existentes.</p>
      <div className="table-scroll"><table className="executive-table"><thead><tr><th>Fila</th><th>Asesor</th><th>Proyecto</th><th>Fecha</th><th>USD</th><th>Resultado</th></tr></thead><tbody>{plan.results.map(item => <tr key={item.row}><td>{item.row}</td><td>{item.sale.advisor}</td><td>{item.sale.project}</td><td>{item.sale.date.split('-').reverse().join('/')}</td><td>{formatCurrency(item.sale.amountUsd)}</td><td>{item.status === 'new' ? 'Nueva' : 'Coincidencia: no sumar'}</td></tr>)}</tbody></table></div>
      {plan.errors.length > 0 && <div role="alert"><p>No se aplicará ninguna fila hasta corregir las observaciones.</p><ul>{plan.errors.map(item => <li key={item.row}>Fila {item.row}: {item.message}</li>)}</ul></div>}
      <div className="hero-actions"><button type="button" className="hero-action-primary" onClick={apply} disabled={busy || Boolean(storageError) || Boolean(plan.errors.length) || !plan.additions.length}>Confirmar importación de {plan.additions.length} ventas</button><button type="button" onClick={() => {setPlan(null);setRows(null);}}>Cancelar importación</button></div>
    </div>}
  </section>;
}
