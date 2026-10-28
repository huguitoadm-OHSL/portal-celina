import { useEffect, useState } from "react";
import { metrics, signals, STAGES, todayLaPaz } from "./metrics";
import "./crm.css";
const omniUrl = (() => {
  try {
    const u = new URL(import.meta.env.VITE_OMNI_URL);
    return u.protocol === "https:" && !u.username && !u.password
      ? u.href
      : null;
  } catch {
    return null;
  }
})();
const usd = (n) =>
  new Intl.NumberFormat("es-BO", { style: "currency", currency: "USD" }).format(
    n,
  );
async function request(body) {
  const response = await fetch("/api/crm", {
    method: body ? "POST" : "GET",
    credentials: "same-origin",
    cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok)
    throw Object.assign(new Error(data.error), { users: data.users });
  return data;
}
function Field({ name, label, type = "text", required = false, defaultValue }) {
  return (
    <label>
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        maxLength={2000}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? "0.01" : undefined}
      />
    </label>
  );
}
export default function CommercialIntelligence() {
  const [data, setData] = useState(null),
    [users, setUsers] = useState([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState(""),
    [tab, setTab] = useState("Cartera"),
    [advisor, setAdvisor] = useState(""),
    [project, setProject] = useState(""),
    [stage, setStage] = useState(""),
    [period, setPeriod] = useState(todayLaPaz().slice(0, 7)),
    [today, setToday] = useState(todayLaPaz());
  useEffect(() => {
    let active = true;
    request()
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          setUsers(e.users || []);
        }
      });
    const timer = setInterval(() => setToday(todayLaPaz()), 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);
  async function send(body) {
    setBusy(true);
    setError("");
    try {
      const d = await request(body);
      setData(d);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function submit(event, action, extra = {}) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    if ("estimatedUsd" in values)
      values.estimatedUsd = Number(values.estimatedUsd);
    if ("amountUsd" in values) values.amountUsd = Number(values.amountUsd);
    for (const key of ["leads", "tasks", "quotes", "visits", "sales", "usd"])
      if (key in values) values[key] = Number(values[key]);
    values.contact = values.contact === "on";
    if (await send({ action, ...values, ...extra })) form.reset();
  }
  if (!data)
    return (
      <section className="crm panel">
        <p className="eyebrow">OMNI · COMMERCIAL INTELLIGENCE</p>
        <h1>Inteligencia comercial</h1>
        <p role="alert">{error || "Verificando acceso individual…"}</p>
        {users.length > 0 && (
          <>
            <p>
              Pruebas locales · Solo datos sintéticos. Seleccione un perfil para
              comprobar permisos.
            </p>
            {users.map((u) => (
              <button
                key={u.id}
                disabled={busy}
                onClick={() => send({ action: "demoLogin", userId: u.id })}
              >
                {u.name}
              </button>
            ))}
          </>
        )}
      </section>
    );
  const rows = data.opportunities.filter(
    (o) =>
      (!advisor || o.ownerId === advisor) &&
      (!project || o.project === project) &&
      (!stage || o.stage === stage),
  );
  const m = metrics(rows, period, today);
  const current = data.opportunities.find((o) => o.id === selected);
  const client = (id) => data.clients.find((c) => c.id === id);
  const userName = (id) => data.users.find((u) => u.id === id)?.name || id;
  const writable = data.user.role !== "management";
  const ownerOptions = data.users.filter(
    (u) =>
      u.role === "advisor" &&
      (data.user.role !== "advisor" || u.id === data.user.id),
  );
  const mutate = (action, extra) =>
    send({ action, id: current.id, version: current.version, ...extra });
  const formSubmit = (e, action) =>
    submit(e, action, { id: current.id, version: current.version });
  return (
    <section className="crm">
      <header className="crm-hero">
        <p className="eyebrow">OMNI / COMMERCIAL INTELLIGENCE V1.0</p>
        <h1>El próximo paso de cada cliente.</h1>
        <p>Seguimiento, compromisos y resultados verificables.</p>
        <strong>ENTORNO LOCAL · DATOS SINTÉTICOS · {data.user.name}</strong>
        <button
          onClick={() => {
            setData(null);
            setUsers(data.users);
            setSelected("");
            setAdvisor("");
            setProject("");
            setStage("");
          }}
        >
          Cambiar perfil de prueba
        </button>
      </header>
      {error && (
        <p className="panel" role="alert">
          {error}
        </p>
      )}
      <div className="crm-filters">
        <label>
          Periodo de resultados
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        </label>
        <label>
          Asesor
          <select value={advisor} onChange={(e) => setAdvisor(e.target.value)}>
            <option value="">Toda mi cartera autorizada</option>
            {ownerOptions.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Proyecto
          <select value={project} onChange={(e) => setProject(e.target.value)}>
            <option value="">Todos</option>
            {[...new Set(data.opportunities.map((o) => o.project))].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label>
          Etapa
          <select value={stage} onChange={(e) => setStage(e.target.value)}>
            <option value="">Todas</option>
            {STAGES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="crm-kpis">
        {[
          ["Cartera abierta", m.open],
          ["Valor estimado abierto", usd(m.estimatedUsd)],
          ["Oportunidades captadas", m.captured],
          [
            "Clientes nuevos únicos",
            data.clients.filter(
              (c) =>
                c.createdAt?.slice(0, 7) === period &&
                rows.some((o) => o.clientId === c.id),
            ).length,
          ],
          ["Ventas verificadas", m.verified],
          ["USD verificados", usd(m.verifiedUsd)],
          ["Cierres declarados", m.declared],
          [
            "Conversión cohorte a hoy",
            m.cohortConversion === null
              ? "N/D"
              : `${(m.cohortConversion * 100).toFixed(1)}%`,
          ],
          ["Tareas del periodo cumplidas", `${m.completed} / ${m.taskTotal}`],
        ].map(([label, value]) => (
          <article className="panel" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <p className="crm-note">
        Cartera y alertas: estado actual sin corte mensual. Resultados: periodo
        seleccionado. Conversión: ventas verificadas de oportunidades captadas
        en ese mismo periodo / oportunidades de esa cohorte, observadas hasta{" "}
        {today}. Las metas se comparan por asesor y periodo en Supervisión; N/D
        significa meta sin definir o cero.
      </p>
      <nav className="crm-tabs" aria-label="Vistas CRM">
        {["Cartera", "Agenda", "Supervisión", "Embudo", "Nueva oportunidad"]
          .filter((t) => writable || t !== "Nueva oportunidad")
          .map((t) => (
            <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
      </nav>
      {tab === "Nueva oportunidad" && (
        <form className="panel crm-form" onSubmit={(e) => submit(e, "create")}>
          <h2>Nueva oportunidad</h2>
          <p>
            Seleccione un cliente existente para conservar una sola identidad.
          </p>
          <label>
            Cliente existente
            <select name="clientId">
              <option value="">Crear cliente sintético</option>
              {data.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.identity}
                </option>
              ))}
            </select>
          </label>
          <Field name="name" label="Nombre del cliente" />
          <Field name="identity" label="Identificador estable del cliente" />
          <Field name="phone" label="Teléfono" />
          <label>
            Responsable
            <select name="ownerId" required>
              {ownerOptions.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
          <Field name="project" label="Proyecto" required />
          <Field name="source" label="Origen" required />
          <Field
            name="estimatedUsd"
            label="Valor estimado USD"
            type="number"
            required
          />
          <button disabled={busy}>Guardar oportunidad</button>
        </form>
      )}
      {tab === "Cartera" && (
        <div className="crm-cards">
          {rows.length === 0 && (
            <p className="panel">
              Sin oportunidades. Registre una oportunidad sintética para
              comenzar.
            </p>
          )}
          {rows.map((o) => {
            const s = signals(o, today);
            return (
              <button
                className="panel crm-opportunity"
                key={o.id}
                onClick={() => setSelected(o.id)}
              >
                <small>
                  {o.project} · {userName(o.ownerId)}
                </small>
                <h2>{client(o.clientId)?.name}</h2>
                <p>
                  {o.stage} · {usd(o.estimatedUsd)}
                </p>
                <strong>Índice de avance {s.score}/100</strong>
                <p>Calidad de registro {s.quality}%</p>
                {s.warnings.map((w) => (
                  <span className="crm-alert" key={w}>
                    {w}
                  </span>
                ))}
              </button>
            );
          })}
        </div>
      )}
      {tab === "Agenda" && (
        <div className="panel">
          <h2>Agenda comercial · {today}</h2>
          <p>
            Incluye pendientes de todos los meses y compromisos del cliente.
          </p>
          {rows
            .flatMap((o) =>
              [
                ...o.tasks
                  .filter((t) => t.status === "Pendiente")
                  .map((t) => ({ ...t, category: t.kind || "Seguimiento" })),
                ...o.commitments
                  .filter((c) => c.status === "Pendiente")
                  .map((c) => ({
                    ...c,
                    title: c.text,
                    category: "Compromiso",
                  })),
              ].map((t) => ({ ...t, o })),
            )
            .sort((a, b) => a.due.localeCompare(b.due))
            .map((t) => (
              <button
                className="crm-agenda-row"
                key={t.id}
                onClick={() => setSelected(t.o.id)}
              >
                <strong>
                  {t.due < today
                    ? "VENCIDA"
                    : t.due === today
                      ? "HOY"
                      : "PROGRAMADA"}{" "}
                  · {t.due}
                </strong>
                <span>
                  {t.category} · {t.title} · {client(t.o.clientId)?.name}
                </span>
              </button>
            ))}
        </div>
      )}
      {tab === "Supervisión" && (
        <>
          <div className="panel">
            <h2>Metas y cumplimiento · {period}</h2>
            {ownerOptions.map((u) => {
              const t = data.targets.find(
                  (t) => t.ownerId === u.id && t.period === period,
                ),
                v = metrics(
                  rows.filter((o) => o.ownerId === u.id),
                  period,
                  today,
                );
              return (
                <p key={u.id}>
                  {u.name} ·{" "}
                  {t
                    ? [
                        [v.captured, t.leads, "captación"],
                        [v.completed, t.tasks, "tareas"],
                        [v.quotes, t.quotes, "cotizaciones"],
                        [v.visits, t.visits, "visitas"],
                        [v.verified, t.sales, "ventas verificadas"],
                        [v.verifiedUsd, t.usd, "USD verificados"],
                      ]
                        .map(
                          ([n, goal, label]) =>
                            `${label}: ${n}/${goal} (${goal ? Math.round((n / goal) * 100) + "%" : "N/D"})`,
                        )
                        .join(" · ")
                    : "Metas sin definir"}
                </p>
              );
            })}
            {["supervisor", "admin"].includes(data.user.role) && (
              <form
                className="crm-form"
                onSubmit={(e) => submit(e, "target", { period })}
              >
                <h3>Definir metas del periodo</h3>
                <label>
                  Asesor de la meta
                  <select name="ownerId">
                    {ownerOptions.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </label>
                {[
                  ["leads", "Meta captación"],
                  ["tasks", "Meta tareas"],
                  ["quotes", "Meta cotizaciones"],
                  ["visits", "Meta visitas"],
                  ["sales", "Meta ventas verificadas"],
                  ["usd", "Meta USD verificados"],
                ].map(([name, label]) => (
                  <Field
                    key={name}
                    name={name}
                    label={label}
                    type="number"
                    required
                  />
                ))}
                <button disabled={busy}>Guardar metas</button>
              </form>
            )}
          </div>
          <div className="panel">
            <h2>Intervención y desempeño</h2>
            <p>
              Actividad {m.activities} · Primeros contactos {m.firstResponses} ·
              Visitas programadas {m.scheduledVisits} · Visitas realizadas{" "}
              {m.visits} · Referencias de cotización {m.quotes} · Primeras
              respuestas fuera de 24h {m.lateResponses}
            </p>
            <div className="crm-table">
              <table>
                <thead>
                  <tr>
                    {[
                      "Asesor",
                      "Abiertas",
                      "Captación",
                      "Gestiones",
                      "Primer contacto",
                      "Fuera de 24h",
                      "Tareas cumplidas",
                      "Visitas programadas",
                      "Visitas",
                      "Cotizaciones",
                      "Negociaciones",
                      "Vencidas",
                      "Sin próxima",
                      "Verificadas",
                      "USD",
                      "Calidad",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ownerOptions.map((u) => {
                    const a = rows.filter((o) => o.ownerId === u.id),
                      v = metrics(a, period, today);
                    return (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        {[
                          v.open,
                          v.captured,
                          v.activities,
                          v.firstResponses,
                          v.lateResponses,
                          `${v.completed}/${v.taskTotal}`,
                          v.scheduledVisits,
                          v.visits,
                          v.quotes,
                          a.filter((o) => o.stage === "Negociación").length,
                          a.reduce((s, o) => s + signals(o, today).overdue, 0),
                          a.filter((o) =>
                            signals(o, today).warnings.includes(
                              "Sin próxima gestión",
                            ),
                          ).length,
                          v.verified,
                          usd(v.verifiedUsd),
                          a.length
                            ? `${Math.round(a.reduce((s, o) => s + signals(o, today).quality, 0) / a.length)}%`
                            : "N/D",
                        ].map((n, i) => (
                          <td key={i}>{n}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="panel">
            <h2>Clientes que necesitan apoyo</h2>
            {rows
              .filter(
                (o) =>
                  signals(o, today).warnings.length ||
                  o.objections.some((x) => x.status === "Pendiente"),
              )
              .map((o) => (
                <button
                  className="crm-agenda-row"
                  key={o.id}
                  onClick={() => setSelected(o.id)}
                >
                  {client(o.clientId)?.name} ·{" "}
                  {signals(o, today).warnings.join(" · ")} · Objeciones
                  pendientes:{" "}
                  {o.objections.filter((x) => x.status === "Pendiente").length}
                </button>
              ))}
          </div>
        </>
      )}
      {tab === "Embudo" && (
        <div className="crm-cards">
          {STAGES.map((s) => (
            <article className="panel" key={s}>
              <h2>{s}</h2>
              <strong>{rows.filter((o) => o.stage === s).length}</strong>
              <p>Distribución actual, sin inferir conversión histórica.</p>
            </article>
          ))}
        </div>
      )}
      {current && (
        <div className="crm-detail panel" key={current.id}>
          <button onClick={() => setSelected("")}>Cerrar ficha</button>
          <h2>Ficha 360° · {client(current.clientId)?.name}</h2>
          <p>
            {client(current.clientId)?.phone} · {current.project} ·{" "}
            {current.stage}
          </p>
          <small>
            Oportunidad {current.id} · Versión {current.version}
          </small>
          <p>Responsable: {userName(current.ownerId)}</p>
          <h3>Índice de avance: {signals(current, today).score}/100</h3>
          <p>
            {signals(current, today).reasons.join(" · ") ||
              "Sin señales registradas"}
            . Regla operativa provisional; no es probabilidad de cierre.
          </p>
          {signals(current, today).warnings.map((w) => (
            <p className="crm-alert" key={w}>
              {w}
            </p>
          ))}
          <h3>Próximas gestiones</h3>
          {current.tasks.map((t) => (
            <div className="crm-agenda-row" key={t.id}>
              <span>
                {t.due} · {t.title} · {t.status}
              </span>
              {writable && t.status === "Pendiente" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutate("completeTask", {
                      taskId: t.id,
                      result: new FormData(e.currentTarget).get("result"),
                    });
                  }}
                >
                  <input
                    name="result"
                    aria-label="Resultado de tarea"
                    required
                    placeholder="Resultado comprobable"
                  />
                  <button disabled={busy}>Completar tarea</button>
                </form>
              )}
            </div>
          ))}
          {writable && (
            <div className="crm-cards">
              <form
                className="crm-form"
                onSubmit={(e) => formSubmit(e, "activity")}
              >
                <h3>Registrar gestión y próximo paso</h3>
                <label>
                  Tipo
                  <select name="kind">
                    {["Llamada", "Mensaje", "Reunión", "Visita"].map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </select>
                </label>
                <Field name="result" label="Resultado" required />
                <label>
                  <input name="contact" type="checkbox" /> Hubo contacto
                  efectivo
                </label>
                <Field name="nextDate" label="Próxima fecha" type="date" />
                <Field name="nextAction" label="Próxima acción" />
                <button disabled={busy}>Guardar gestión</button>
              </form>
              <form
                className="crm-form"
                onSubmit={(e) => formSubmit(e, "task")}
              >
                <h3>Agendar tarea o visita</h3>
                <Field name="title" label="Acción pactada" required />
                <Field
                  name="due"
                  label="Fecha programada"
                  type="date"
                  required
                />
                <label>
                  Tipo de tarea
                  <select name="kind">
                    <option>Seguimiento</option>
                    <option>Visita</option>
                  </select>
                </label>
                <button disabled={busy}>Agendar</button>
              </form>
              <form
                className="crm-form"
                onSubmit={(e) => formSubmit(e, "stage")}
              >
                <h3>Etapa comercial</h3>
                <label>
                  Nueva etapa
                  <select name="stage" defaultValue={current.stage}>
                    {STAGES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <Field
                  name="reason"
                  label="Motivo de pérdida (obligatorio al perder)"
                />
                <button disabled={busy}>Cambiar etapa</button>
              </form>
              {["supervisor", "admin"].includes(data.user.role) && (
                <form
                  className="crm-form"
                  onSubmit={(e) => formSubmit(e, "reassign")}
                >
                  <h3>Reasignación con historial</h3>
                  <label>
                    Nuevo responsable
                    <select name="ownerId">
                      {ownerOptions.map((u) => (
                        <option value={u.id} key={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button disabled={busy}>Reasignar</button>
                </form>
              )}
              <form
                className="crm-form"
                onSubmit={(e) => formSubmit(e, "quote")}
              >
                <h3>Vincular cotización OMNI</h3>
                <p>
                  Referencia manual. Importe y disponibilidad deben consultarse
                  en OMNI; no se sincronizan.
                </p>
                <Field name="reference" label="Referencia original" required />
                <Field name="lot" label="Lote / manzano" required />
                <button disabled={busy}>Vincular referencia</button>
              </form>
              {["objection", "commitment"].map((kind) => (
                <form
                  className="crm-form"
                  key={kind}
                  onSubmit={(e) => formSubmit(e, kind)}
                >
                  <h3>
                    {kind === "objection"
                      ? "Registrar objeción"
                      : "Compromiso del cliente"}
                  </h3>
                  <Field
                    name="text"
                    label={kind === "objection" ? "Objeción" : "Compromiso"}
                    required
                  />
                  {kind === "commitment" && (
                    <Field
                      name="due"
                      label="Fecha de compromiso"
                      type="date"
                      required
                    />
                  )}
                  <button disabled={busy}>Registrar</button>
                </form>
              ))}
            </div>
          )}
          {data.user.role === "admin" &&
            current.stage === "Cierre declarado" &&
            !current.verifiedClose && (
              <form
                className="crm-form"
                onSubmit={(e) => formSubmit(e, "verify")}
              >
                <h3>Verificación corporativa (prueba sintética)</h3>
                <Field name="contract" label="Contrato único" required />
                <Field
                  name="evidence"
                  label="Referencia de evidencia oficial"
                  required
                />
                <Field
                  name="amountUsd"
                  label="Importe verificado USD"
                  type="number"
                  required
                />
                <Field
                  name="date"
                  label="Fecha oficial de cierre"
                  type="date"
                  required
                />
                <button disabled={busy}>Verificar cierre</button>
              </form>
            )}
          <h3>Cotizaciones vinculadas</h3>
          {current.quotes.map((q) => (
            <p key={q.id}>
              {q.reference} · {q.project} · {q.lot}
            </p>
          ))}
          <p>
            {omniUrl ? (
              <a href={omniUrl} target="_blank" rel="noopener noreferrer">
                Abrir OMNI para seleccionar lote y cotizar ↗
              </a>
            ) : (
              "Apertura de OMNI pendiente de confirmar y configurar la URL oficial del Engine."
            )}{" "}
            No se envían datos personales ni se asume una API.
          </p>
          {["objection", "commitment"].map((entity) => (
            <div key={entity}>
              <h3>{entity === "objection" ? "Objeciones" : "Compromisos"}</h3>
              {(entity === "objection"
                ? current.objections
                : current.commitments
              ).map((item) => (
                <div key={item.id}>
                  <p>
                    {item.text} · {item.due} · {item.status}
                  </p>
                  {writable && item.status === "Pendiente" && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        mutate("resolve", {
                          entity,
                          itemId: item.id,
                          evidence: new FormData(e.currentTarget).get(
                            "evidence",
                          ),
                        });
                      }}
                    >
                      <input
                        name="evidence"
                        aria-label="Evidencia de cumplimiento"
                        required
                      />
                      <button disabled={busy}>Registrar cumplimiento</button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          ))}
          <h3>Historial del cliente en mi cartera autorizada</h3>
          {data.opportunities
            .filter((o) => o.clientId === current.clientId)
            .map((o) => (
              <div key={o.id}>
                <button onClick={() => setSelected(o.id)}>
                  {o.project} · {o.stage} · {o.id}
                </button>
                {o.activities.map((a) => (
                  <p key={a.id}>
                    {a.at} · {a.kind} · {a.result}
                  </p>
                ))}
              </div>
            ))}
          <h3>Bitácora de esta oportunidad</h3>
          {current.activities.map((a) => (
            <p key={a.id}>
              {a.at} · {userName(a.actor)} · {a.kind} · {a.result}
            </p>
          ))}
          <h3>Historial de etapas y responsables</h3>
          {current.history.map((h, i) => (
            <p key={i}>
              {h.at} · {h.stage} · {userName(h.ownerId)} · por{" "}
              {userName(h.actor)}
            </p>
          ))}
          <h3>Auditoría</h3>
          {data.audit
            .filter((a) => a.opportunityId === current.id)
            .map((a) => (
              <p key={a.id}>
                {a.at} · {a.action} · {userName(a.actor)}
              </p>
            ))}
          <p>
            Venta corporativa:{" "}
            {current.verifiedClose
              ? `${current.verifiedClose.contract} · ${usd(current.verifiedClose.amountUsd)}`
              : "Sin verificación oficial. Ningún cierre declarado se cuenta como venta verificada."}
          </p>
        </div>
      )}
    </section>
  );
}
