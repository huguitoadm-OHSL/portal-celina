import { DEFAULT_SETTINGS } from "./intelligence.js";
import {
  prepareBatch,
  parseReport,
  normalize,
  localDate,
} from "./reportParser.js";
const DB_NAME = "celina-private-intelligence-v1";
const MAX_BYTES = 50_000_000;
const fail = (message) => {
  throw new Error(message);
};
export function openPrivateDatabase() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("batches", { keyPath: "id" });
      req.result.createObjectStore("notes", { keyPath: "id" });
      req.result.createObjectStore("meta");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () =>
      reject(new Error("No se pudo abrir el historial privado del navegador."));
    req.onblocked = () =>
      reject(
        new Error("Cierre otras pestañas del Portal para abrir el historial."),
      );
  });
}
function readAll(db, store) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(store).objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
export async function loadPrivateState(db) {
  const [batches, notes, meta] = await Promise.all([
    readAll(db, "batches"),
    readAll(db, "notes"),
    readAll(db, "meta"),
  ]);
  const settings =
    meta.find((v) => v?.kind === "settings")?.value || DEFAULT_SETTINGS;
  return { batches, notes, settings };
}
function transaction(db, names, write) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(names, "readwrite");
    let result;
    tx.oncomplete = () => resolve(result);
    tx.onabort = () =>
      reject(tx.error || new Error("No se guardaron los cambios."));
    tx.onerror = () => {};
    try {
      result = write(tx);
    } catch (e) {
      tx.abort();
      reject(e);
    }
  });
}
export async function saveBatch(db, batch) {
  const state = await loadPrivateState(db);
  if (state.batches.some((b) => b.id === batch.id)) return { duplicate: true };
  if (state.batches.length >= 1000)
    fail(
      "Se alcanzó el límite de 1.000 instantáneas. Conserva un respaldo antes de ampliar o migrar el historial.",
    );
  if (JSON.stringify(state).length + JSON.stringify(batch).length > MAX_BYTES)
    fail(
      "El historial alcanza el límite de 50 MB. Respalde los datos antes de ampliar la capacidad.",
    );
  return new Promise((resolve, reject) => {
    const tx = db.transaction("batches", "readwrite"),
      store = tx.objectStore("batches");
    let duplicate = false;
    const request = store.get(batch.id);
    request.onsuccess = () => {
      if (request.result) duplicate = true;
      else store.add(batch);
    };
    tx.oncomplete = () => resolve({ duplicate });
    tx.onabort = () =>
      reject(tx.error || new Error("No se pudo guardar la importación."));
    tx.onerror = () => {};
  });
}
export function validateSettings(s) {
  const out = {};
  for (const key of [
    "leads",
    "scheduled",
    "visited",
    "dailyLeads",
    "dailyActivities",
    "staleDays",
  ]) {
    const n = Number(s[key]);
    if (!Number.isInteger(n) || n < 1 || n > 10000)
      fail("Las metas y días deben ser enteros entre 1 y 10.000.");
    out[key] = n;
  }
  if (
    !Array.isArray(s.workdays) ||
    !s.workdays.length ||
    s.workdays.some((v) => !Number.isInteger(v) || v < 0 || v > 6)
  )
    fail("Seleccione al menos un día laborable válido.");
  out.workdays = [...new Set(s.workdays)];
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(s.cutoff))
    fail("Hora de corte inválida.");
  out.cutoff = s.cutoff;
  if (!Array.isArray(s.excludedDates) || s.excludedDates.length > 366)
    fail("Excepciones de calendario inválidas.");
  out.excludedDates = s.excludedDates.map((d) => localDate(d).slice(0, 10));
  return out;
}
export async function saveSettings(db, settings) {
  const value = validateSettings(settings);
  return transaction(db, ["meta"], (tx) =>
    tx
      .objectStore("meta")
      .put(
        { kind: "settings", value, at: new Date().toISOString() },
        "settings",
      ),
  );
}
export function validateNote(n) {
  if (
    typeof n.leadId !== "string" ||
    n.leadId.length > 1000 ||
    !n.leadId ||
    typeof n.text !== "string" ||
    !n.text.trim() ||
    n.text.length > 4000
  )
    fail("Seleccione un lead y escriba una nota válida.");
  const temperatures = [
    "",
    "Caliente",
    "Tibio",
    "Frío / en pausa",
    "Sin calificar",
  ];
  if (!temperatures.includes(n.temperature || ""))
    fail("Clasificación inválida.");
  const due = n.due ? localDate(n.due).slice(0, 10) : "";
  const expires = n.temperature ? localDate(n.expires).slice(0, 10) : "";
  return {
    id: crypto.randomUUID(),
    leadId: n.leadId,
    text: n.text.trim(),
    nextAction: String(n.nextAction || "").slice(0, 500),
    due,
    temperature: n.temperature || "",
    expires,
    at: new Date().toISOString(),
  };
}
export async function saveSupervisorNote(db, input) {
  const note = validateNote(input);
  const current = await loadPrivateState(db);
  if (current.notes.length >= 20000)
    fail("Se alcanzó el límite de 20.000 notas.");
  return transaction(db, ["notes"], (tx) => tx.objectStore("notes").add(note));
}
export async function completeSupervisorTask(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("notes", "readwrite"),
      s = tx.objectStore("notes");
    const r = s.get(id);
    r.onsuccess = () => {
      if (!r.result || r.result.completedAt) {
        tx.abort();
        return;
      }
      s.put({ ...r.result, completedAt: new Date().toISOString() });
    };
    tx.oncomplete = resolve;
    tx.onabort = () => reject(new Error("No se pudo completar la acción."));
  });
}
export async function backupData(db) {
  return {
    format: "celina-private-intelligence",
    version: 1,
    exportedAt: new Date().toISOString(),
    ...(await loadPrivateState(db)),
  };
}
export async function restoreBackup(db, payload) {
  if (
    !payload ||
    payload.format !== "celina-private-intelligence" ||
    payload.version !== 1 ||
    !Array.isArray(payload.batches) ||
    !Array.isArray(payload.notes) ||
    payload.batches.length > 1000 ||
    payload.notes.length > 20000 ||
    JSON.stringify(payload).length > MAX_BYTES
  )
    fail("Respaldo inválido o demasiado grande.");
  const settings = validateSettings(payload.settings),
    batches = [],
    notes = [];
  for (const b of payload.batches) {
    if (
      !b ||
      !["leads", "activities"].includes(b.kind) ||
      !Array.isArray(b.records) ||
      !Number.isFinite(Date.parse(b.observedAt))
    )
      fail("Importación de respaldo inválida.");
    // Reconstruir el formato público para aplicar la misma validación que a un Excel.
    const headers =
      b.kind === "leads"
        ? [
            "Lead",
            "Teléfono",
            "Agente asignado",
            "Fecha de creación",
            "Fecha de asignación",
            "Estado del lead",
            "Última actividad",
            "Medio de contacto",
            "Campaña",
            "En lista negra",
          ]
        : [
            "ID Lead",
            "Lead",
            "Teléfono",
            "Agente",
            "Fecha de registro",
            "Estado del lead",
            "Actividad",
            "Actividad nota",
            "Actividad fecha",
            "Contactabilidad",
            "Etapa de prospección",
            "Medio de contacto",
            "Campaña",
          ];
    const rows = b.records.map((r) =>
      b.kind === "leads"
        ? [
            r.name,
            r.phone,
            r.advisor,
            r.createdAt,
            r.assignedAt,
            r.state,
            r.lastActivity,
            r.source,
            r.campaign,
            r.blacklisted ? "Sí" : "No",
          ]
        : [
            r.leadId,
            r.name,
            r.phone,
            r.advisor,
            r.createdAt,
            r.state,
            r.kind,
            r.note,
            r.at,
            r.contactability,
            r.prospectStage,
            r.source,
            r.campaign,
          ],
    );
    const plan = parseReport([headers, ...rows], b.period);
    if (plan.errors.length || plan.advisorKey !== normalize(b.advisor))
      fail("Registros inconsistentes en el respaldo.");
    const rebuilt = await prepareBatch(
      [headers, ...rows],
      {
        period: b.period,
        fileName: b.fileName,
        exportedAt: b.exportedAt,
        complete: b.complete,
      },
      new Date(b.observedAt),
    );
    if (rebuilt.contentHash !== b.contentHash || rebuilt.id !== b.id)
      fail("El respaldo tiene una huella de importación inconsistente.");
    batches.push({ ...rebuilt, observedAt: b.observedAt });
  }
  for (const n of payload.notes) {
    if (
      !n ||
      !Number.isFinite(Date.parse(n.at)) ||
      typeof n.id !== "string" ||
      !n.id ||
      n.id.length > 100
    )
      fail("Nota de respaldo inválida.");
    const v = validateNote(n);
    if (n.completedAt && !Number.isFinite(Date.parse(n.completedAt)))
      fail("Fecha de cumplimiento inválida.");
    notes.push({
      ...v,
      id: n.id,
      at: n.at,
      ...(n.completedAt ? { completedAt: n.completedAt } : {}),
    });
  }
  const existing = await loadPrivateState(db);
  if (
    new Set([...existing.batches, ...batches].map((b) => b.id)).size > 1000 ||
    new Set([...existing.notes, ...notes].map((n) => n.id)).size > 20000
  )
    fail(
      "El respaldo supera la capacidad de instantáneas o notas de esta versión.",
    );
  const mergedBytes =
    JSON.stringify(existing).length + JSON.stringify(payload).length;
  if (mergedBytes > MAX_BYTES)
    fail("El respaldo supera la capacidad disponible de esta versión.");
  // Merge atómico: nunca borra el historial ni sobrescribe un identificador en conflicto.
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["batches", "notes", "meta"], "readwrite");
    let conflict = false;
    for (const [name, items] of [
      ["batches", batches],
      ["notes", notes],
    ])
      for (const item of items) {
        const s = tx.objectStore(name),
          r = s.get(item.id);
        r.onsuccess = () => {
          if (!r.result) s.add(item);
          else if (JSON.stringify(r.result) !== JSON.stringify(item)) {
            conflict = true;
            tx.abort();
          }
        };
      }
    const meta = tx.objectStore("meta"),
      m = meta.get("settings");
    m.onsuccess = () => {
      if (!m.result)
        meta.put(
          { kind: "settings", value: settings, at: new Date().toISOString() },
          "settings",
        );
    };
    tx.oncomplete = () =>
      resolve({ batches: batches.length, notes: notes.length });
    tx.onabort = () =>
      reject(
        new Error(
          conflict
            ? "Respaldo en conflicto: no se reemplazó el historial."
            : "No se restauró el respaldo.",
        ),
      );
    tx.onerror = () => {};
  });
}
