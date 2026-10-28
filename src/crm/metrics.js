export const STAGES = [
  "Captado",
  "Contactado",
  "Calificado",
  "Cotizado",
  "Visita agendada",
  "Visita realizada",
  "Negociación",
  "Cierre declarado",
  "Cierre perdido",
];
export function todayLaPaz(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/La_Paz",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export const isOpen = (o) =>
  !["Cierre declarado", "Cierre perdido"].includes(o.stage);
export function signals(o, today = todayLaPaz()) {
  const pending = o.tasks.filter((t) => t.status === "Pendiente");
  const overdue = pending.filter((t) => t.due < today).length;
  const reasons = [];
  let score = 0;
  if (o.firstContactAt) {
    score += 15;
    reasons.push("Contacto efectivo +15");
  }
  if (o.quotes.length) {
    score += 20;
    reasons.push("Referencia de cotización +20");
  }
  if (o.visits.length) {
    score += 25;
    reasons.push("Visita completada +25");
  }
  if (o.commitments.some((c) => c.status === "Cumplido")) {
    score += 25;
    reasons.push("Compromiso cumplido +25");
  }
  if (pending.length) {
    score += 15;
    reasons.push("Próxima gestión pactada +15");
  }
  if (overdue) {
    score -= 20;
    reasons.push("Gestión vencida −20");
  }
  if (o.objections.some((x) => x.status === "Pendiente")) {
    score -= 10;
    reasons.push("Objeción pendiente −10");
  }
  const warnings = [];
  if (isOpen(o)) {
    if (!pending.length) warnings.push("Sin próxima gestión");
    if (overdue) warnings.push("Gestiones vencidas");
    if (!o.firstContactAt) warnings.push("Sin contacto efectivo");
    if (o.commitments.some((c) => c.status === "Pendiente" && c.due < today))
      warnings.push("Compromiso incumplido");
    const last = o.lastContactAt || o.createdAt;
    if (
      (Date.parse(`${today}T12:00:00-04:00`) - Date.parse(last)) / 86400000 >=
      7
    )
      warnings.push("Riesgo de abandono: 7 días sin contacto");
  }
  return {
    score: Math.max(0, Math.min(100, score)),
    reasons,
    warnings,
    overdue,
    quality: Math.round(
      (100 *
        [
          !!o.project,
          !!o.source,
          !!o.ownerId,
          !!o.firstContactAt,
          !isOpen(o) || pending.length > 0,
        ].filter(Boolean).length) /
        5,
    ),
  };
}
export function metrics(
  opportunities,
  period,
  today = todayLaPaz(),
  asOf = new Date().toISOString(),
) {
  const during = (v) => v?.slice(0, 7) === period;
  const cohort = opportunities.filter((o) => during(o.createdAt));
  const verified = opportunities.filter(
    (o) => o.verifiedClose && during(o.verifiedClose.date),
  );
  const tasks = opportunities
    .flatMap((o) => o.tasks)
    .filter((t) => during(t.due));
  return {
    open: opportunities.filter(isOpen).length,
    estimatedUsd: opportunities
      .filter(isOpen)
      .reduce((s, o) => s + o.estimatedUsd, 0),
    captured: cohort.length,
    firstResponses: opportunities.filter((o) => during(o.firstContactAt))
      .length,
    scheduledVisits: tasks.filter((t) => t.kind === "Visita").length,
    verified: verified.length,
    verifiedUsd: verified.reduce((s, o) => s + o.verifiedClose.amountUsd, 0),
    declared: opportunities.filter(
      (o) => o.stage === "Cierre declarado" && during(o.declaredAt),
    ).length,
    cohortConversion: cohort.length
      ? cohort.filter((o) => o.verifiedClose && o.verifiedClose.date <= today)
          .length / cohort.length
      : null,
    completed: tasks.filter((t) => t.status === "Realizada").length,
    taskTotal: tasks.length,
    activities: opportunities
      .flatMap((o) => o.activities)
      .filter((a) => during(a.at)).length,
    visits: opportunities
      .flatMap((o) => o.visits)
      .filter((v) => during(v.completedAt)).length,
    quotes: opportunities.flatMap((o) => o.quotes).filter((q) => during(q.at))
      .length,
    lateResponses: cohort.filter(
      (o) =>
        Date.parse(o.firstContactAt || asOf) - Date.parse(o.createdAt) >
        86400000,
    ).length,
  };
}
