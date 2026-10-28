export const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
export function localDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 19);
  let s = String(value ?? "")
    .trim()
    .replace(" ", "T");
  if (/^\d{2}\/\d{2}\/\d{4}/.test(s))
    s =
      s.slice(6, 10) + "-" + s.slice(3, 5) + "-" + s.slice(0, 2) + s.slice(10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s += "T00:00:00";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) s += ":00";
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(s) ||
    !Number.isFinite(Date.parse(s + "Z")) ||
    new Date(s + "Z").toISOString().slice(0, 19) !== s
  )
    throw new Error("Fecha inválida: " + String(value).slice(0, 40));
  return s;
}
export function phoneKey(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!/^\d{7,15}$/.test(digits))
    throw new Error("Teléfono ausente o inválido.");
  return digits.length === 11 && digits.startsWith("591")
    ? digits.slice(3)
    : digits;
}
const text = (value, limit = 4000) => {
  const s = String(value ?? "").trim();
  if (s.length > limit) throw new Error("Texto demasiado largo.");
  return s;
};
export function parseReport(rows, period) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period))
    throw new Error("Seleccione un mes válido.");
  if (!Array.isArray(rows) || rows.length > 20006)
    throw new Error("El reporte admite hasta 20.000 registros.");
  const headerIndex = rows.findIndex(
    (row) =>
      Array.isArray(row) &&
      row.some((v) => normalize(v) === "telefono") &&
      row.some((v) => normalize(v) === "lead"),
  );
  if (headerIndex < 0) throw new Error("No se reconoce el encabezado del CRM.");
  const headers = rows[headerIndex].map(normalize);
  if (new Set(headers.filter(Boolean)).size !== headers.filter(Boolean).length)
    throw new Error("Encabezados duplicados.");
  const kind =
    headers.includes("id lead") && headers.includes("actividad")
      ? "activities"
      : headers.includes("agente asignado")
        ? "leads"
        : null;
  if (!kind)
    throw new Error("Formato no compatible con los dos reportes del CRM.");
  const required =
    kind === "activities"
      ? [
          "id lead",
          "agente",
          "fecha de registro",
          "actividad",
          "actividad nota",
          "actividad fecha",
          "contactabilidad",
          "estado del lead",
        ]
      : [
          "agente asignado",
          "fecha de creacion",
          "fecha de asignacion",
          "estado del lead",
          "ultima actividad",
        ];
  for (const name of required)
    if (!headers.includes(name)) throw new Error("Falta columna: " + name);
  let exportedAt = null,
    declaredPeriod = null,
    declaredCount = null;
  for (const row of rows.slice(0, headerIndex))
    for (const cell of row) {
      const s = String(cell ?? "");
      const time = s.match(/Fecha:\s*(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2})/i);
      if (time) exportedAt = localDate(time[1]);
      const range = s.match(
        /Del\s+(\d{2}\/\d{2}\/\d{4})\s+al\s+(\d{2}\/\d{2}\/\d{4})/i,
      );
      if (range) {
        const start = localDate(range[1]),
          end = localDate(range[2]);
        const last = new Date(
          Date.UTC(Number(period.slice(0, 4)), Number(period.slice(5)), 0),
        ).getUTCDate();
        if (
          start.slice(0, 7) !== period ||
          end.slice(0, 7) !== period ||
          start.slice(8, 10) !== "01" ||
          Number(end.slice(8, 10)) !== last
        )
          throw new Error(
            "El reporte debe abarcar el mes completo seleccionado.",
          );
        declaredPeriod = period;
      }
      const count = s.match(/Total lead registrados:\s*(\d+)/i);
      if (count) declaredCount = Number(count[1]);
    }
  const errors = [],
    records = [];
  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row?.some((v) => v !== null && v !== undefined && v !== "")) continue;
    try {
      const get = (name) => row[headers.indexOf(name)];
      const advisor = text(
        get(kind === "activities" ? "agente" : "agente asignado"),
        150,
      );
      if (!advisor) throw new Error("Asesor ausente.");
      const record = {
        advisor,
        advisorKey: normalize(advisor),
        name: text(get("lead"), 250),
        phone: phoneKey(get("telefono")),
        createdAt: localDate(
          get(
            kind === "activities" ? "fecha de registro" : "fecha de creacion",
          ),
        ),
        state: text(get("estado del lead"), 100),
        source: text(get("medio de contacto"), 100),
        campaign: text(get("campana"), 200),
      };
      if (kind === "activities") {
        record.leadId = text(get("id lead"), 128);
        if (!/^[a-zA-Z0-9_-]{3,128}$/.test(record.leadId))
          throw new Error("ID de lead inválido.");
        record.kind = text(get("actividad"), 150);
        record.note = text(get("actividad nota"));
        record.at = localDate(get("actividad fecha"));
        record.contactability = text(get("contactabilidad"), 200);
        record.prospectStage = text(get("etapa de prospeccion"), 200);
        if (!record.kind || record.at.slice(0, 7) !== period)
          throw new Error("Actividad vacía o fuera del mes seleccionado.");
      } else {
        record.assignedAt = localDate(get("fecha de asignacion"));
        record.lastActivity = text(get("ultima actividad"), 200);
        record.blacklisted = normalize(get("en lista negra")) === "si";
      }
      records.push(record);
    } catch (e) {
      errors.push({ row: i + 1, message: e.message });
    }
  }
  if (!records.length && !errors.length)
    errors.push({
      row: 0,
      message:
        "El archivo no contiene registros. No confirma una cartera vacía.",
    });
  if (
    kind === "activities" &&
    declaredCount !== null &&
    declaredCount !== records.length
  )
    errors.push({
      row: 0,
      message: `El encabezado declara ${declaredCount} filas y se leyeron ${records.length}.`,
    });
  const advisors = [...new Set(records.map((r) => r.advisorKey))];
  if (advisors.length > 1)
    errors.push({
      row: 0,
      message:
        "Exporte un solo asesor por archivo para mantener una cobertura inequívoca.",
    });
  const warnings = [];
  if (!declaredPeriod)
    warnings.push(
      "Confirme que el filtro de exportación abarca el mes completo y todos los estados y actividades.",
    );
  if (!exportedAt)
    warnings.push(
      "El archivo no incluye fecha de descarga: indíquela antes de importar.",
    );
  const ids = new Set();
  let duplicates = 0;
  for (const r of records) {
    const key = kind === "activities" ? activityKey(r) : leadRowKey(r);
    if (ids.has(key)) duplicates++;
    ids.add(key);
  }
  if (duplicates)
    warnings.push(
      `${duplicates} filas idénticas se contarán una sola vez; se conservará el total de filas del archivo.`,
    );
  return {
    kind,
    period,
    exportedAt,
    advisor: records[0]?.advisor || "",
    advisorKey: advisors[0] || "",
    records,
    errors,
    warnings,
    rawCount: records.length,
    declaredPeriod,
  };
}
export const leadRowKey = (r) =>
  JSON.stringify([r.advisorKey, r.phone, r.createdAt]);
export const activityAnchor = (r) => JSON.stringify([r.leadId, r.kind, r.at]);
export const activityKey = (r) =>
  JSON.stringify([
    r.leadId,
    r.kind,
    r.at,
    normalize(r.note),
    normalize(r.contactability),
  ]);
export async function contentDigest(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
export async function prepareBatch(
  rows,
  { period, fileName, exportedAt, complete },
  now = new Date(),
) {
  const plan = parseReport(rows, period);
  if (plan.errors.length)
    throw new Error(
      plan.errors.map((e) => `Fila ${e.row}: ${e.message}`).join(" · "),
    );
  const sourceAt = plan.exportedAt || localDate(exportedAt);
  if (Date.parse(sourceAt + "-04:00") > now.getTime() + 300000)
    throw new Error("La fecha de descarga está en el futuro.");
  const hash = await contentDigest({
    kind: plan.kind,
    period,
    advisorKey: plan.advisorKey,
    records: plan.records.map((r) => JSON.stringify(r)).sort(),
  });
  return {
    id: await contentDigest([hash, sourceAt, Boolean(complete)]),
    contentHash: hash,
    kind: plan.kind,
    period,
    advisor: plan.advisor,
    advisorKey: plan.advisorKey,
    fileName: text(fileName, 250),
    exportedAt: sourceAt,
    observedAt: now.toISOString(),
    complete: complete === true,
    records: plan.records,
    rawCount: plan.rawCount,
  };
}
