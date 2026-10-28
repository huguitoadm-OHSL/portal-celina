import { useEffect, useRef, useState } from "react";
import { parseReport, prepareBatch } from "./reportParser.js";
import {
  buildIntelligence,
  chronologicalChanges,
  DEFAULT_SETTINGS,
  laPazNow,
} from "./intelligence.js";
import {
  openPrivateDatabase,
  loadPrivateState,
  saveBatch,
  saveSettings,
  saveSupervisorNote,
  completeSupervisorTask,
  backupData,
  restoreBackup,
} from "./privateStore.js";
import "./crm.css";
const EMPTY = { batches: [], notes: [], settings: DEFAULT_SETTINGS };
const labelKind = (k) =>
  k === "leads" ? "Listado de leads" : "Reporte de actividades";
const number = (n) =>
  n === null || n === undefined ? "N/D" : n.toLocaleString("es-BO");
function downloadJson(value) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `Celina_Respaldo_Privado_${laPazNow().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Goal({ value, target, label, complete }) {
  return (
    <div>
      <strong>
        {label}: {number(value)} / {target}
      </strong>
      <p>
        {value === null
          ? "Falta cargar el reporte"
          : `${Math.round((value / target) * 100)}% · Faltan ${Math.max(0, target - value)}`}{" "}
        ·{" "}
        {complete
          ? "Cobertura declarada completa"
          : "Cobertura parcial o pendiente"}
      </p>
    </div>
  );
}
export default function AdvisorIntelligence() {
  const db = useRef(null),
    detail = useRef(null),
    [state, setState] = useState(EMPTY),
    [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [now, setNow] = useState(laPazNow()),
    [period, setPeriod] = useState(laPazNow().slice(0, 7)),
    [advisor, setAdvisor] = useState(""),
    [tab, setTab] = useState("Prioridades"),
    [selected, setSelected] = useState(""),
    [search, setSearch] = useState(""),
    [temperature, setTemperature] = useState(""),
    [project, setProject] = useState(""),
    [commercialState, setCommercialState] = useState(""),
    [preview, setPreview] = useState(null),
    [downloadAt, setDownloadAt] = useState(laPazNow().slice(0, 16)),
    [complete, setComplete] = useState(false),
    [restore, setRestore] = useState(null);
  useEffect(() => {
    let active = true,
      connection;
    openPrivateDatabase()
      .then(async (d) => {
        connection = d;
        const s = await loadPrivateState(d);
        if (active) {
          db.current = d;
          setState(s);
          setReady(true);
        } else d.close();
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    const timer = setInterval(() => setNow(laPazNow()), 30000);
    return () => {
      active = false;
      clearInterval(timer);
      connection?.close();
    };
  }, []);
  async function refresh() {
    setState(await loadPrivateState(db.current));
  }
  async function action(fn) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(e.message || "No se guardó la operación.");
    } finally {
      setBusy(false);
    }
  }
  const settings = state.settings,
    model = buildIntelligence(state.batches, period, settings, now);
  const notesFor = (client) =>
    state.notes
      .filter(
        (n) => n.leadId === client.id || client.aliases?.includes(n.leadId),
      )
      .sort((a, b) => b.at.localeCompare(a.at));
  const clients = model.clients.map((c) => {
    const notes = notesFor(c),
      override = notes.find(
        (n) => n.temperature && n.expires >= now.slice(0, 10),
      );
    const pending = notes.filter((n) => n.due && !n.completedAt),
      overdue = pending.some((n) => n.due < now.slice(0, 10));
    return {
      ...c,
      supervisorNotes: notes,
      pending,
      analysis: {
        ...c.analysis,
        ...(override
          ? {
              temperature: override.temperature,
              reason:
                "Clasificación confirmada por supervisión: " + override.text,
              evidence: [
                { at: override.at, note: override.text, kind: "Supervisión" },
              ],
            }
          : {}),
        priority: c.blacklisted
          ? "Revisar restricción"
          : overdue
            ? "Compromiso supervisor vencido"
            : pending.some((n) => n.due === now.slice(0, 10))
              ? "Compromiso de hoy"
              : override?.temperature === "Caliente"
                ? "Atender hoy"
                : c.analysis.priority,
      },
    };
  });
  const filtered = clients.filter(
    (c) =>
      (!advisor || c.advisorKey === advisor) &&
      (!temperature || c.analysis.temperature === temperature) &&
      (!commercialState || c.state === commercialState) &&
      (!project ||
        c.activities.some((a) =>
          (a.note + " " + a.contactability)
            .toLowerCase()
            .includes(project.toLowerCase()),
        )) &&
      (!search ||
        (c.name + " " + c.phone + " " + c.id)
          .toLowerCase()
          .includes(search.toLowerCase())),
  );
  const selectedClient = clients.find((c) => c.id === selected);
  const team = model.advisors.filter((a) => !advisor || a.key === advisor);
  const rank = (c) =>
    c.blacklisted
      ? 9
      : c.pending.some((n) => n.due <= now.slice(0, 10))
        ? 0
        : c.analysis.temperature === "Caliente"
          ? 1
          : c.analysis.priority === "Confirmar visita"
            ? 2
            : c.analysis.priority === "Recuperación prioritaria"
              ? 3
              : 4;
  async function chooseFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setPreview(null);
    setError("");
    if (!file) return;
    setBusy(true);
    try {
      if (!/\.xlsx$/i.test(file.name) || file.size > 5_000_000)
        throw new Error("Seleccione un .xlsx de hasta 5 MB.");
      const { readSheet } = await import("read-excel-file/browser");
      const rows = await readSheet(file);
      const plan = parseReport(rows, period);
      setPreview({ rows, plan, fileName: file.name, period });
      setComplete(false);
      if (plan.exportedAt) setDownloadAt(plan.exportedAt.slice(0, 16));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function confirmImport() {
    await action(async () => {
      if (!preview || preview.period !== period)
        throw new Error("El periodo cambió: vuelva a seleccionar el archivo.");
      const batch = await prepareBatch(preview.rows, {
        period,
        fileName: preview.fileName,
        exportedAt: downloadAt,
        complete,
      });
      const result = await saveBatch(db.current, batch);
      setMessage(
        result.duplicate
          ? "Esta misma exportación ya estaba guardada. No se duplicó ningún registro."
          : "Importación guardada. Historial e indicadores actualizados.",
      );
      setPreview(null);
    });
  }
  async function chooseBackup(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setRestore(null);
    setError("");
    if (!file) return;
    try {
      if (file.size > 50_000_000) throw new Error("El respaldo supera 50 MB.");
      const payload = JSON.parse(await file.text());
      if (
        payload.format !== "celina-private-intelligence" ||
        payload.version !== 1 ||
        !Array.isArray(payload.batches) ||
        !Array.isArray(payload.notes)
      )
        throw new Error("Respaldo no reconocido.");
      setRestore(payload);
    } catch (e) {
      setError(e.message);
    }
  }
  function openClient(id) {
    setSelected(id);
    setTab("Ficha");
    setTimeout(
      () =>
        detail.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0,
    );
  }
  if (!ready)
    return (
      <section className="crm panel">
        <h1>Inteligencia comercial privada</h1>
        <p role={error ? "alert" : "status"}>
          {error || "Abriendo historial privado…"}
        </p>
      </section>
    );
  return (
    <section className="crm">
      <header className="crm-hero">
        <p className="eyebrow">OMNI / INTELIGENCIA COMERCIAL PRIVADA</p>
        <h1>Tu equipo, con el siguiente paso claro.</h1>
        <p>
          Prioridades comerciales y disciplina de seguimiento · Uso exclusivo de
          supervisión.
        </p>
        <strong>
          Rama de prueba · El CRM de la empresa conserva su operación original
        </strong>
      </header>
      <div className="panel crm-storage">
        <strong>Historial guardado en este navegador</strong>
        <p>
          Los Excel se procesan en tu dispositivo. No se envían al servidor, no
          se sincronizan entre equipos y no se escriben en el CRM. Descarga
          respaldos para conservar el historial si cambias de navegador o borras
          sus datos.
        </p>
        <button
          disabled={busy}
          onClick={() =>
            action(async () => {
              downloadJson(await backupData(db.current));
              setMessage(
                "Respaldo preparado para descargar. Contiene información privada: guárdalo en un lugar seguro.",
              );
            })
          }
        >
          Descargar respaldo privado
        </button>
      </div>
      {error && (
        <p className="panel crm-alert" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="panel" role="status">
          {message}
        </p>
      )}
      <div className="crm-filters">
        <label>
          Mes de análisis
          <input
            type="month"
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value || laPazNow().slice(0, 7));
              setPreview(null);
              setSelected("");
            }}
          />
        </label>
        <label>
          Asesor
          <select value={advisor} onChange={(e) => setAdvisor(e.target.value)}>
            <option value="">Todo el equipo cargado</option>
            {model.advisors.map((a) => (
              <option key={a.key} value={a.key}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Temperatura
          <select
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          >
            <option value="">Todas</option>
            {["Caliente", "Tibio", "Frío / en pausa", "Sin calificar"].map(
              (t) => (
                <option key={t}>{t}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Estado del CRM
          <select
            value={commercialState}
            onChange={(e) => setCommercialState(e.target.value)}
          >
            <option value="">Todos</option>
            {[...new Set(model.clients.map((c) => c.state))]
              .filter(Boolean)
              .map((s) => (
                <option key={s}>{s}</option>
              ))}
          </select>
        </label>
        <label>
          Buscar lead
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre, teléfono o ID"
          />
        </label>
        <label>
          Proyecto mencionado en notas
          <input
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Filtro textual, sin validar inventario"
          />
        </label>
      </div>
      <nav className="crm-tabs" aria-label="Inteligencia privada">
        {[
          "Prioridades",
          "Cargar reportes",
          "Equipo y metas",
          "Agenda",
          "Historial y cambios",
          "Calidad",
          "Ficha",
          "Configuración",
        ].map((t) => (
          <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </nav>
      <p className="crm-note">
        Mes: {period}. Los indicadores de equipo usan el filtro de asesor;
        temperatura, búsqueda y proyecto filtran la lista de clientes. El envío
        de información no acredita respuesta ni venta. La clasificación por
        notas es provisional y explicable.
      </p>
      {state.batches.length === 0 && (
        <div className="panel">
          <h2>Comienza con los dos reportes del CRM</h2>
          <p>
            Carga el listado de leads y el reporte de actividades del mismo
            asesor y mes. Podrás sumar a tus siete asesores, uno por archivo,
            sin crearles cuentas.
          </p>
          <button onClick={() => setTab("Cargar reportes")}>
            Cargar primer reporte
          </button>
        </div>
      )}
      {tab === "Cargar reportes" && (
        <div className="panel crm-form">
          <h2>Cargar Excel del CRM</h2>
          <p>
            Exporta un asesor, el mes completo y todos los estados y
            actividades. El sistema reconoce ambos formatos por sus columnas.
            Para otro mes, cambia primero Mes de análisis.
          </p>
          <label>
            Archivo Excel del CRM
            <input
              type="file"
              accept=".xlsx"
              disabled={busy}
              onChange={chooseFile}
            />
          </label>
          {preview && (
            <>
              <h3>Vista previa · {labelKind(preview.plan.kind)}</h3>
              <p>
                {preview.fileName} · {preview.plan.advisor} ·{" "}
                {preview.plan.rawCount} filas · {period}
              </p>
              {preview.plan.warnings.map((w) => (
                <p className="crm-alert" key={w}>
                  {w}
                </p>
              ))}
              {preview.plan.errors.map((e, i) => (
                <p role="alert" key={i}>
                  Fila {e.row}: {e.message}
                </p>
              ))}
              <label>
                Fecha y hora de descarga (Bolivia)
                <input
                  type="datetime-local"
                  value={downloadAt}
                  disabled={!!preview.plan.exportedAt}
                  onChange={(e) => setDownloadAt(e.target.value)}
                  required
                />
              </label>
              <label className="crm-check">
                <input
                  type="checkbox"
                  checked={complete}
                  onChange={(e) => setComplete(e.target.checked)}
                />{" "}
                Confirmo mes completo, todos los estados y actividades, sin
                otros filtros que limiten la exportación.
              </label>
              <p>
                Si no puedes confirmar la cobertura, puedes guardar un reporte
                parcial. No se usarán sus ausencias para inferir cargas tardías.
              </p>
              <div className="crm-table">
                <table>
                  <thead>
                    <tr>
                      <th>Lead</th>
                      <th>Estado / actividad</th>
                      <th>Fecha</th>
                      <th>Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.plan.records.slice(0, 8).map((r, i) => (
                      <tr key={i}>
                        <td>{r.name || "Sin nombre"}</td>
                        <td>{r.kind || r.state}</td>
                        <td>{r.at || r.createdAt}</td>
                        <td>{r.note || r.lastActivity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Vista de las primeras ocho filas. Se validan todas antes de
                guardar.
              </p>
              <button
                disabled={busy || !!preview.plan.errors.length}
                onClick={confirmImport}
              >
                Confirmar importación
              </button>
              <button disabled={busy} onClick={() => setPreview(null)}>
                Cancelar vista previa
              </button>
            </>
          )}
        </div>
      )}
      {tab === "Prioridades" && (
        <>
          <div className="crm-kpis">
            {["Caliente", "Tibio", "Frío / en pausa", "Sin calificar"].map(
              (t) => (
                <article className="panel" key={t}>
                  <span>{t}</span>
                  <strong>
                    {
                      filtered.filter((c) => c.analysis.temperature === t)
                        .length
                    }
                  </strong>
                </article>
              ),
            )}
          </div>
          <div className="crm-cards">
            {[...filtered]
              .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name))
              .map((c) => (
                <button
                  className="panel crm-opportunity"
                  key={c.id}
                  onClick={() => openClient(c.id)}
                >
                  <small>{c.advisor}</small>
                  <h2>{c.name || "Lead sin nombre"}</h2>
                  <span
                    className={
                      "crm-temperature " +
                      (c.analysis.temperature === "Caliente"
                        ? "hot"
                        : c.analysis.temperature === "Tibio"
                          ? "warm"
                          : "neutral")
                    }
                  >
                    {c.analysis.temperature}
                  </span>
                  <strong>{c.analysis.priority}</strong>
                  <p>{c.analysis.reason}</p>
                  <small>
                    Última actividad registrada:{" "}
                    {c.analysis.lastActivity?.replace("T", " ") ||
                      "No disponible"}
                  </small>
                  {c.analysis.warnings.map((w) => (
                    <span className="crm-alert" key={w}>
                      {w}
                    </span>
                  ))}
                </button>
              ))}
          </div>
          {model.clients.length > 0 && !filtered.length && (
            <p className="panel">Sin clientes para estos filtros.</p>
          )}
        </>
      )}
      {tab === "Equipo y metas" && (
        <>
          <div className="panel">
            <h2>Control mensual del equipo</h2>
            <p>
              Metas indicadas por supervisión: 150 leads, 15 agendas y 15
              visitas realizadas registradas. Los reportes no verifican
              asistencia, ventas ni derecho a comisión. Un archivo faltante se
              muestra N/D.
            </p>
          </div>
          {team.map((a) => (
            <article key={a.key} className="panel">
              <h2>{a.name}</h2>
              <div className="crm-kpis">
                <Goal
                  label="Leads nuevos del listado"
                  value={a.leads}
                  target={settings.leads}
                  complete={a.leadCoverage}
                />
                <Goal
                  label="Agendas registradas"
                  value={a.scheduled}
                  target={settings.scheduled}
                  complete={a.activityCoverage}
                />
                <Goal
                  label="Visitas realizadas registradas"
                  value={a.visited}
                  target={settings.visited}
                  complete={a.activityCoverage}
                />
              </div>
              <p>
                Filas exportadas: {number(a.rawRows)} · Actividades distintas:{" "}
                {number(a.activities)} · Leads gestionados: {number(a.managed)}{" "}
                · Grupos de mismo lead, tipo y minuto: {number(a.touches)}
              </p>
              <p>
                Clientes con agenda: {number(a.scheduledClients)} · Clientes con
                visita registrada: {number(a.visitedClients)}. Los grupos por
                minuto son orientativos y no prueban cuántas interacciones
                reales ocurrieron.
              </p>
              <h3>Disciplina diaria · fechas declaradas en el CRM</h3>
              <p>
                Calendario y hora de corte configurables. Cero registros no
                demuestra cero trabajo realizado.
              </p>
              <div className="crm-table">
                <table>
                  <thead>
                    <tr>
                      <th>Día</th>
                      <th>Leads</th>
                      <th>Filas</th>
                      <th>Actividades distintas</th>
                      <th>Clientes gestionados</th>
                      <th>Objetivo diario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.daily.map((d) => (
                      <tr key={d.date}>
                        <td>{d.date}</td>
                        <td>
                          {number(d.leads)} / {settings.dailyLeads}
                        </td>
                        <td>{number(d.rows)}</td>
                        <td>
                          {number(d.activities)} / {settings.dailyActivities}
                        </td>
                        <td>{number(d.managed)}</td>
                        <td>{d.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <small>Última descarga: {a.lastExport.replace("T", " ")}</small>
            </article>
          ))}
        </>
      )}
      {tab === "Agenda" && (
        <div className="panel">
          <h2>Agenda de supervisión</h2>
          <h3>Agendas registradas en el CRM · revisar fecha de cita</h3>
          {filtered.flatMap((c) =>
            c.activities
              .filter((a) => a.kind === "Agenda a Visita de Terreno")
              .map((a, i) => (
                <button
                  className="crm-agenda-row"
                  key={c.id + ":" + i}
                  onClick={() => openClient(c.id)}
                >
                  {c.name} · Registro: {a.at.replace("T", " ")} · {a.note}
                </button>
              )),
          )}
          <h3>Tus próximas acciones confirmadas</h3>
          <p>
            Las citas mencionadas en texto no se confirman automáticamente.
            Registra en la ficha la fecha y la próxima acción acordada.
          </p>
          {filtered
            .flatMap((c) => c.pending.map((n) => ({ c, n })))
            .sort((a, b) => a.n.due.localeCompare(b.n.due))
            .map(({ c, n }) => (
              <div className="crm-agenda-row" key={n.id}>
                <button onClick={() => openClient(c.id)}>
                  {n.due} ·{" "}
                  {n.due < now.slice(0, 10)
                    ? "VENCIDA"
                    : n.due === now.slice(0, 10)
                      ? "HOY"
                      : "PROGRAMADA"}{" "}
                  · {c.name} · {n.nextAction || n.text}
                </button>
                <button
                  disabled={busy}
                  onClick={() =>
                    action(() => completeSupervisorTask(db.current, n.id))
                  }
                >
                  Completar acción
                </button>
              </div>
            ))}
        </div>
      )}
      {tab === "Historial y cambios" && (
        <div className="panel">
          <h2>Historial de cargas y cambios</h2>
          <p>
            Se conservan los archivos normalizados y la fecha de observación.
            Repetir la misma exportación no duplica el historial. Ausencia no
            equivale a pérdida; una corrección de nota no acredita otra gestión.
          </p>
          {chronologicalChanges(state.batches, period)
            .filter((x) => !advisor || x.batch.advisorKey === advisor)
            .map(({ batch: b, comparison: c }) => (
              <article className="crm-history" key={b.id}>
                <h3>
                  {b.advisor} · {labelKind(b.kind)}
                </h3>
                <p>
                  {b.fileName} · Descarga: {b.exportedAt.replace("T", " ")} ·
                  Cobertura {b.complete ? "completa declarada" : "parcial"}
                </p>
                <p>
                  Importación:{" "}
                  {new Date(b.observedAt).toLocaleString("es-BO", {
                    timeZone: "America/La_Paz",
                  })}{" "}
                  · Filas: {b.rawCount}
                </p>
                <p>
                  {c.baseline
                    ? "Línea de base"
                    : `${c.added} registros no presentes antes · ${c.missing} ausencias observadas · ${c.changedAnchors} posibles cambios o filas adicionales del mismo evento · ${c.updated} fichas actualizadas`}
                </p>
                <p>{c.note}</p>
                {c.late.map((l, i) => (
                  <p className="crm-alert" key={i}>
                    Aparición tardía para revisar · ID {l.leadId} · Actividad
                    declarada {l.activityAt.replace("T", " ")} · Vista en
                    descarga {l.exportedAt.replace("T", " ")}. {l.note}
                  </p>
                ))}
              </article>
            ))}
        </div>
      )}
      {tab === "Calidad" && (
        <div className="panel">
          <h2>Calidad y conciliación</h2>
          <p>
            Coincidencias automáticas: mismo asesor, teléfono normalizado y
            fecha/hora de alta, con un solo ID candidato. Las coincidencias son
            provisionales y no fusionan identidades del CRM.
          </p>
          {model.issues.map((i, n) => (
            <p className="crm-alert" key={n}>
              <strong>{i.type}:</strong> {i.text}
            </p>
          ))}
          {model.advisors.map((a) => (
            <p key={a.key}>
              {a.name}:{" "}
              {
                model.clients.filter((c) => c.advisorKey === a.key && !c.listed)
                  .length
              }{" "}
              leads con actividad fuera del listado cargado. No se suman
              automáticamente como captación nueva.
            </p>
          ))}
        </div>
      )}
      {tab === "Ficha" && (
        <div className="panel crm-detail" ref={detail}>
          {!selectedClient ? (
            <>
              <h2>Ficha del lead</h2>
              <p>
                Selecciona un cliente en Prioridades para revisar su historial.
              </p>
            </>
          ) : (
            <>
              <h2>Ficha · {selectedClient.name || "Sin nombre"}</h2>
              <p>
                {selectedClient.phone} · {selectedClient.advisor} ·{" "}
                {selectedClient.state}
              </p>
              <small>
                ID: {selectedClient.id}{" "}
                {selectedClient.provisional &&
                  "· Identidad provisional, aún sin ID CRM vinculado"}
              </small>
              <h3>
                {selectedClient.analysis.temperature} ·{" "}
                {selectedClient.analysis.priority}
              </h3>
              <p>{selectedClient.analysis.reason}</p>
              <p>
                Regla operativa provisional. No es probabilidad de cierre ni
                venta confirmada.
              </p>
              {selectedClient.analysis.evidence.map((e, i) => (
                <blockquote className="crm-evidence" key={i}>
                  {e.at.replace("T", " ")} · {e.kind}
                  <p>{e.note}</p>
                </blockquote>
              ))}
              <h3>Actividades originales del último reporte del mes</h3>
              {[...selectedClient.activities]
                .sort((a, b) => b.at.localeCompare(a.at))
                .map((a, i) => (
                  <article key={i} className="crm-history">
                    <strong>
                      {a.at.replace("T", " ")} · {a.kind}
                    </strong>
                    <p>{a.note}</p>
                    <small>
                      Campo Contactabilidad: {a.contactability} · Etapa:{" "}
                      {a.prospectStage || "Sin completar"}
                    </small>
                  </article>
                ))}
              <details>
                <summary>
                  Ver versiones históricas observadas (
                  {selectedClient.history.length})
                </summary>
                <p>
                  Conserva notas vistas en cargas anteriores. Las versiones no
                  se suman como gestiones nuevas ni reemplazan el último
                  reporte.
                </p>
                {selectedClient.history.map((a, i) => (
                  <article className="crm-history" key={i}>
                    <strong>
                      {a.at.replace("T", " ")} · {a.kind}
                    </strong>
                    <p>{a.note}</p>
                  </article>
                ))}
              </details>
              <form
                className="crm-form"
                key={selectedClient.id}
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const input = Object.fromEntries(new FormData(form));
                  action(async () => {
                    await saveSupervisorNote(db.current, {
                      ...input,
                      leadId: selectedClient.id,
                    });
                    form.reset();
                    setMessage(
                      "Nota de supervisión guardada con fecha y evidencia.",
                    );
                  });
                }}
              >
                <h3>Tu intervención y próximo paso</h3>
                <label>
                  Nota y fundamento
                  <textarea name="text" required maxLength={4000} />
                </label>
                <label>
                  Próxima acción
                  <input name="nextAction" maxLength={500} />
                </label>
                <label>
                  Fecha del compromiso
                  <input name="due" type="date" />
                </label>
                <label>
                  Clasificación confirmada por ti
                  <select name="temperature">
                    <option value="">Conservar análisis por evidencia</option>
                    {[
                      "Caliente",
                      "Tibio",
                      "Frío / en pausa",
                      "Sin calificar",
                    ].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Vigencia de tu clasificación
                  <input name="expires" type="date" />
                  <small>
                    Obligatoria si confirmas una clasificación. Al vencer,
                    vuelve el análisis por evidencia.
                  </small>
                </label>
                <button disabled={busy}>Guardar intervención</button>
              </form>
              <h3>Historial de supervisión</h3>
              {selectedClient.supervisorNotes.map((n) => (
                <article className="crm-history" key={n.id}>
                  <small>
                    {new Date(n.at).toLocaleString("es-BO", {
                      timeZone: "America/La_Paz",
                    })}
                  </small>
                  <p>{n.text}</p>
                  <p>
                    {n.nextAction} {n.due && `· ${n.due}`}{" "}
                    {n.temperature && `· ${n.temperature} hasta ${n.expires}`}{" "}
                    {n.completedAt && "· Acción completada"}
                  </p>
                </article>
              ))}
            </>
          )}
        </div>
      )}
      {tab === "Configuración" && (
        <>
          <form
            className="panel crm-form"
            key={JSON.stringify(settings)}
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget),
                s = Object.fromEntries(f);
              action(async () => {
                await saveSettings(db.current, {
                  ...s,
                  workdays: f.getAll("workdays").map(Number),
                  excludedDates: String(s.excludedDates || "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                });
                setMessage("Metas y calendario guardados.");
              });
            }}
          >
            <h2>Metas y calendario de supervisión</h2>
            <p>
              Valores iniciales según tu indicación. Calendario inicial: lunes a
              viernes; ajústalo a las jornadas reales del equipo. El mínimo de
              colocación y las reglas de comisión no se calculan con estos
              reportes.
            </p>
            {[
              ["leads", "Meta mensual de leads"],
              ["scheduled", "Meta mensual de visitas agendadas"],
              ["visited", "Meta mensual de visitas realizadas"],
              ["dailyLeads", "Objetivo diario de leads"],
              ["dailyActivities", "Objetivo diario de actividades"],
              ["staleDays", "Días sin actividad para revisar seguimiento"],
            ].map(([name, label]) => (
              <label key={name}>
                {label}
                <input
                  type="number"
                  name={name}
                  min="1"
                  max="10000"
                  required
                  defaultValue={settings[name]}
                />
              </label>
            ))}
            <fieldset>
              <legend>Días laborables</legend>
              {[
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
              ].map((d, i) => (
                <label className="crm-check" key={d}>
                  <input
                    type="checkbox"
                    name="workdays"
                    value={i}
                    defaultChecked={settings.workdays.includes(i)}
                  />
                  {d}
                </label>
              ))}
            </fieldset>
            <label>
              Hora de corte diaria (Bolivia)
              <input
                type="time"
                name="cutoff"
                required
                defaultValue={settings.cutoff}
              />
            </label>
            <label>
              Fechas excluidas (AAAA-MM-DD, separadas por comas)
              <input
                name="excludedDates"
                defaultValue={settings.excludedDates.join(", ")}
              />
            </label>
            <button disabled={busy}>Guardar metas y calendario</button>
          </form>
          <div className="panel crm-form">
            <h2>Restaurar respaldo privado</h2>
            <p>
              Combina el respaldo con este historial sin borrar registros. Un
              identificador con contenido diferente bloquea toda la
              restauración. Las metas actuales se conservan si ya fueron
              configuradas.
            </p>
            <label>
              Archivo de respaldo
              <input
                type="file"
                accept=".json,application/json"
                onChange={chooseBackup}
                disabled={busy}
              />
            </label>
            {restore && (
              <>
                <p>
                  Respaldo: {restore.batches.length} importaciones y{" "}
                  {restore.notes.length} notas. Se validará íntegramente antes
                  de guardar.
                </p>
                <button
                  disabled={busy}
                  onClick={() =>
                    action(async () => {
                      await restoreBackup(db.current, restore);
                      setRestore(null);
                      setMessage(
                        "Respaldo validado y restaurado sin borrar el historial.",
                      );
                    })
                  }
                >
                  Confirmar restauración
                </button>
                <button disabled={busy} onClick={() => setRestore(null)}>
                  Cancelar restauración
                </button>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}
