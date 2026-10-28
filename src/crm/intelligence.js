import {
  normalize,
  activityKey,
  activityAnchor,
  leadRowKey,
} from "./reportParser.js";
export const DEFAULT_SETTINGS = {
  leads: 150,
  scheduled: 15,
  visited: 15,
  dailyLeads: 10,
  dailyActivities: 10,
  workdays: [1, 2, 3, 4, 5],
  excludedDates: [],
  cutoff: "18:00",
  staleDays: 7,
};
export function laPazNow(now = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/La_Paz",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(now)
    .replace(" ", "T");
}
export function unique(rows, key) {
  return [...new Map(rows.map((r) => [key(r), r])).values()];
}
export function latestBatches(batches, period) {
  const map = new Map();
  for (const b of batches
    .filter((b) => b.period === period)
    .sort(
      (a, b) =>
        a.exportedAt.localeCompare(b.exportedAt) ||
        a.observedAt.localeCompare(b.observedAt),
    )) {
    map.set(b.advisorKey + "|" + b.kind, b);
  }
  return [...map.values()];
}
const diffDays = (a, b) =>
  (Date.parse(a + "Z") - Date.parse(b + "Z")) / 86400000;
export function classifyLead(lead, now = laPazNow(), staleDays = 7) {
  const acts = [...lead.activities].sort((a, b) => b.at.localeCompare(a.at));
  const evidence = [];
  const last = acts[0]?.at;
  const stale = !!last && diffDays(now, last) >= staleDays;
  let strong = null,
    interest = null,
    rejection = null,
    appointment = null;
  for (const a of acts) {
    if (a.at > now) continue;
    const n = normalize(a.note);
    const neg =
      /\b(no compr|no desea|no quiere|no tiene interes|sin interes|ya no|no realizara|no puede comprar|no realizo)/.test(
        n,
      );
    const ref = { at: a.at, note: a.note, kind: a.kind };
    if (neg && !rejection) rejection = ref;
    if (
      !neg &&
      /\b(realizara (la )?compra|quiere comprar|decidio comprar|confirmo (la )?compra|listo para comprar|entrego documentos|confirmo reserva)\b/.test(
        n,
      ) &&
      !strong
    )
      strong = ref;
    if (
      !neg &&
      /\b(le gusto|interesad[oa]|lo analizara|evaluara|consultara|pidio|solicito)\b/.test(
        n,
      ) &&
      !interest
    )
      interest = ref;
    if (normalize(a.kind) === "agenda a visita de terreno" && !appointment)
      appointment = ref;
  }
  const positive =
    [strong, interest, appointment]
      .filter(Boolean)
      .sort((a, b) => b.at.localeCompare(a.at))[0] || null;
  let temperature = "Sin calificar",
    reason =
      "Envíos o registros sin evidencia suficiente de intención de compra.";
  if (rejection && (!positive || rejection.at >= positive.at)) {
    temperature = "Frío / en pausa";
    reason =
      "Nota con señal negativa explícita; requiere revisión del contexto.";
    evidence.push(rejection);
  } else if (
    strong &&
    (!rejection || strong.at > rejection.at) &&
    !stale &&
    diffDays(now, strong.at) <= staleDays
  ) {
    temperature = "Caliente";
    reason =
      "Señal explícita reciente de avance hacia compra, declarada en una nota.";
    evidence.push(strong);
  } else if (positive && !stale && diffDays(now, positive.at) <= staleDays) {
    temperature = "Tibio";
    reason =
      "Interés o agenda reciente; falta confirmar un compromiso de compra.";
    evidence.push(positive);
  } else if (positive) {
    reason = "Hay interés histórico, pero falta comprobar su vigencia.";
    evidence.push(positive);
  }
  const warnings = [];
  if (!acts.length) warnings.push("Sin actividad en los reportes cargados");
  if (stale) warnings.push(`${staleDays}+ días sin nueva actividad registrada`);
  if (positive && temperature === "Sin calificar")
    warnings.push("Recuperar interés histórico");
  if (lead.blacklisted)
    warnings.push("Lista negra: revisar restricción antes de contactar");
  const priority = lead.blacklisted
    ? "Revisar restricción"
    : temperature === "Caliente"
      ? "Atender hoy"
      : positive && stale
        ? "Recuperación prioritaria"
        : appointment
          ? "Confirmar visita"
          : !acts.length
            ? "Primer seguimiento"
            : "Revisar seguimiento";
  return {
    temperature,
    reason,
    evidence,
    warnings,
    priority,
    lastActivity: last || null,
    stale,
  };
}
export function buildIntelligence(
  batches,
  period,
  settings = DEFAULT_SETTINGS,
  now = laPazNow(),
) {
  const current = latestBatches(batches, period);
  const histories = new Map();
  for (const b of batches)
    if (b.kind === "activities")
      for (const r of b.records) {
        if (!histories.has(r.leadId)) histories.set(r.leadId, new Map());
        histories.get(r.leadId).set(activityKey(r), r);
      }

  const clients = new Map(),
    advisors = [];
  const issues = [];
  const actBatches = current.filter((b) => b.kind === "activities"),
    leadBatches = current.filter((b) => b.kind === "leads");
  const allActivities = unique(
    actBatches.flatMap((b) => b.records),
    (r) => r.advisorKey + "|" + activityKey(r),
  );
  const byPhone = new Map();
  for (const r of allActivities) {
    const k = JSON.stringify([r.advisorKey, r.phone, r.createdAt]);
    if (!byPhone.has(k)) byPhone.set(k, new Set());
    byPhone.get(k).add(r.leadId);
    const id = r.leadId;
    const existing = clients.get(id);
    if (
      existing &&
      (existing.phone !== r.phone || existing.createdAt !== r.createdAt)
    )
      issues.push({
        type: "Identidad",
        text: `ID ${id}: teléfono o fecha de alta inconsistentes; revisar.`,
      });
    if (existing && existing.advisorKey !== r.advisorKey)
      issues.push({
        type: "Asignación",
        text: `ID ${id}: aparece con más de un asesor; revisar reasignación.`,
      });
    if (!existing)
      clients.set(id, {
        ...r,
        id,
        activities: [],
        listed: false,
        aliases: ["provisional:" + leadRowKey(r)],
        blacklisted: false,
      });
    clients.get(id).activities.push(r);
  }
  for (const b of leadBatches)
    for (const r of unique(b.records, leadRowKey)) {
      const candidates = byPhone.get(
        JSON.stringify([r.advisorKey, r.phone, r.createdAt]),
      );
      const matched = candidates?.size === 1 ? [...candidates][0] : null;
      const id = matched || "provisional:" + leadRowKey(r);
      if (!matched)
        issues.push({
          type:
            candidates?.size > 1 ? "Coincidencia ambigua" : "Sin ID vinculado",
          text: `${r.name || "Sin nombre"}: ${candidates?.size > 1 ? "varios IDs posibles" : "pendiente de vincular con el reporte de actividades"}.`,
        });
      const old = clients.get(id);
      clients.set(id, {
        ...r,
        id,
        activities: old?.activities || [],
        listed: true,
        provisional: !matched,
        aliases: ["provisional:" + leadRowKey(r)],
        blacklisted: r.blacklisted,
      });
    }
  for (const b of current)
    if (!b.complete)
      issues.push({
        type: "Cobertura parcial",
        text: `${b.advisor}: el último reporte de ${b.kind === "leads" ? "leads" : "actividades"} es parcial; no certifica totales ni ausencias.`,
      });
  for (const key of [...new Set(current.map((b) => b.advisorKey))]) {
    const lb = leadBatches.find((b) => b.advisorKey === key),
      ab = actBatches.find((b) => b.advisorKey === key);
    const acts = allActivities.filter((r) => r.advisorKey === key);
    const ls = lb ? unique(lb.records, leadRowKey) : [];
    const scheduled = acts.filter(
      (r) => normalize(r.kind) === "agenda a visita de terreno",
    );
    const visits = acts.filter((r) =>
      ["visita de terreno minibus", "visita de terreno propia"].includes(
        normalize(r.kind),
      ),
    );
    const newLeads = lb
      ? ls.filter((r) => r.createdAt.slice(0, 7) === period).length
      : null;
    const daily = [];
    const count = new Date(
      Date.UTC(+period.slice(0, 4), +period.slice(5), 0),
    ).getUTCDate();
    for (let day = 1; day <= count; day++) {
      const date = `${period}-${String(day).padStart(2, "0")}`;
      if (date > now.slice(0, 10)) continue;
      const weekday = new Date(date + "T12:00:00Z").getUTCDay();
      if (
        !settings.workdays.includes(weekday) ||
        settings.excludedDates.includes(date)
      )
        continue;
      const ds = acts.filter((a) => a.at.slice(0, 10) === date),
        leadCount = lb
          ? ls.filter((r) => r.createdAt.slice(0, 10) === date).length
          : null;
      const closed =
        date < now.slice(0, 10) || now.slice(11, 16) >= settings.cutoff;
      const covered =
        lb?.complete &&
        ab?.complete &&
        [lb, ab].every(
          (b) =>
            b.exportedAt.slice(0, 10) > date ||
            (b.exportedAt.slice(0, 10) === date &&
              b.exportedAt.slice(11, 16) >= settings.cutoff),
        );
      daily.push({
        date,
        leads: leadCount,
        rows: ab
          ? ab.records.filter((r) => r.at.slice(0, 10) === date).length
          : null,
        activities: ab ? ds.length : null,
        managed: ab ? new Set(ds.map((r) => r.leadId)).size : null,
        touches: ab ? new Set(ds.map(activityAnchor)).size : null,
        status: !closed
          ? "Jornada abierta"
          : !covered
            ? "Pendiente de exportación completa tras el corte"
            : leadCount >= settings.dailyLeads &&
                ds.length >= settings.dailyActivities
              ? "Objetivo diario registrado"
              : "Revisar objetivo diario",
      });
    }
    advisors.push({
      key,
      name: lb?.advisor || ab.advisor,
      leads: newLeads,
      leadCoverage: !!lb?.complete,
      activityCoverage: !!ab?.complete,
      rawRows: ab?.rawCount ?? null,
      activities: ab ? acts.length : null,
      managed: ab ? new Set(acts.map((r) => r.leadId)).size : null,
      touches: ab ? new Set(acts.map(activityAnchor)).size : null,
      scheduled: ab ? scheduled.length : null,
      scheduledClients: ab
        ? new Set(scheduled.map((r) => r.leadId)).size
        : null,
      visited: ab ? visits.length : null,
      visitedClients: ab ? new Set(visits.map((r) => r.leadId)).size : null,
      daily,
      lastExport: current
        .filter((b) => b.advisorKey === key)
        .map((b) => b.exportedAt)
        .sort()
        .at(-1),
    });
  }
  return {
    current,
    advisors,
    clients: [...clients.values()].map((c) => ({
      ...c,
      aliases: c.provisional
        ? [c.id]
        : byPhone.get(leadRowKey(c))?.size === 1
          ? ["provisional:" + leadRowKey(c)]
          : [],
      history: [...(histories.get(c.id)?.values() || [])],
      analysis: classifyLead(c, now, settings.staleDays),
    })),
    issues,
    activities: allActivities,
  };
}
export function compareBatch(previous, next) {
  if (!previous)
    return {
      baseline: true,
      added: next.records.length,
      missing: 0,
      changedAnchors: 0,
      updated: 0,
      late: [],
      note: "Primera observación: no permite demostrar cargas tardías anteriores.",
    };
  const key = next.kind === "activities" ? activityKey : leadRowKey;
  const old = new Set(previous.records.map(key)),
    fresh = new Set(next.records.map(key));
  const added = unique(next.records, key).filter((r) => !old.has(key(r)));
  const anchors = new Set(previous.records.map(activityAnchor));
  const previousRows = new Map(previous.records.map((r) => [key(r), r]));
  const updated =
    next.kind === "leads"
      ? next.records.filter(
          (r) =>
            previousRows.has(key(r)) &&
            JSON.stringify(previousRows.get(key(r))) !== JSON.stringify(r),
        ).length
      : 0;
  const changedAnchors =
    next.kind === "activities"
      ? added.filter((r) => anchors.has(activityAnchor(r))).length
      : 0;
  const coverage =
    previous.complete &&
    next.complete &&
    previous.kind === next.kind &&
    previous.period === next.period &&
    previous.advisorKey === next.advisorKey &&
    next.exportedAt > previous.exportedAt;
  const late =
    coverage && next.kind === "activities"
      ? added
          .filter(
            (r) =>
              !anchors.has(activityAnchor(r)) && r.at < previous.exportedAt,
          )
          .map((r) => ({
            leadId: r.leadId,
            activityAt: r.at,
            firstSeenAt: next.observedAt,
            exportedAt: next.exportedAt,
            note: r.note,
          }))
      : [];
  return {
    baseline: false,
    added: added.length,
    missing: [...old].filter((k) => !fresh.has(k)).length,
    changedAnchors,
    updated,
    late,
    note: coverage
      ? "Aparición tardía es una observación del reporte, no prueba de manipulación. Las ausencias no significan pérdidas."
      : "Cobertura parcial o fechas sin orden: no se infiere carga tardía ni pérdida.",
  };
}
export function chronologicalChanges(batches, period) {
  const groups = new Map();
  const result = [];
  for (const b of batches
    .filter((b) => b.period === period)
    .sort(
      (a, b) =>
        a.exportedAt.localeCompare(b.exportedAt) ||
        a.observedAt.localeCompare(b.observedAt),
    )) {
    const k = b.advisorKey + "|" + b.kind;
    const previous = groups.get(k);
    result.push({ batch: b, comparison: compareBatch(previous, b) });
    groups.set(k, b);
  }
  return result.reverse();
}
