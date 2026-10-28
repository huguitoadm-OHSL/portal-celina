import test from "node:test";
import assert from "node:assert/strict";
import {
  parseReport,
  prepareBatch,
  localDate,
  phoneKey,
  activityKey,
} from "../src/crm/reportParser.js";
import {
  buildIntelligence,
  classifyLead,
  compareBatch,
  DEFAULT_SETTINGS,
  chronologicalChanges,
} from "../src/crm/intelligence.js";
import { validateSettings, validateNote } from "../src/crm/privateStore.js";
import {
  leadsRows,
  activityRows,
  activityRecords,
} from "./private-report-fixtures.js";
const options = {
  period: "2026-10",
  fileName: "synthetic.xlsx",
  exportedAt: "2026-10-28T00:32",
  complete: true,
};
const asOf = new Date("2026-10-28T05:00:00Z");
async function batches() {
  return [
    await prepareBatch(leadsRows, options, asOf),
    await prepareBatch(activityRows(), options, asOf),
  ];
}
test("lector reconoce dos formatos y separa filas, ID lead y fecha declarada", () => {
  const l = parseReport(leadsRows, "2026-10"),
    a = parseReport(activityRows(), "2026-10");
  assert.equal(l.records.length, 3);
  assert.equal(a.records.length, 5);
  assert.equal(new Set(a.records.map((r) => r.leadId)).size, 3);
  assert.equal(a.exportedAt, "2026-10-28T00:32:00");
  assert.equal(a.errors.length, 0);
});
test("lector rechaza fechas inválidas, columnas ausentes, múltiples asesores y periodo incompleto", () => {
  assert.throws(() => localDate("2026-02-30 12:00:00"), /Fecha/);
  assert.throws(
    () => parseReport([["Lead", "Teléfono", "Agente asignado"]], "2026-10"),
    /Falta columna/,
  );
  const mixed = structuredClone(leadsRows);
  mixed[2][7] = "Otro Asesor";
  assert.ok(
    parseReport(mixed, "2026-10").errors.some((e) =>
      e.message.includes("solo asesor"),
    ),
  );
  assert.throws(
    () =>
      parseReport(
        activityRows().map((r, i) =>
          i === 1 ? ["Del 02/10/2026 al 31/10/2026"] : r,
        ),
        "2026-10",
      ),
    /mes completo/,
  );
});
test("conciliación combina teléfono y fecha sin sumar lead histórico a captación", async () => {
  const model = buildIntelligence(
    await batches(),
    "2026-10",
    DEFAULT_SETTINGS,
    "2026-10-28T01:00:00",
  );
  const a = model.advisors[0];
  assert.equal(a.leads, 3);
  assert.equal(a.managed, 3);
  assert.equal(a.rawRows, 5);
  assert.equal(a.activities, 5);
  assert.equal(a.touches, 4);
  assert.equal(a.scheduled, 1);
  assert.equal(a.visited, 1);
  assert.equal(model.clients.length, 4);
  assert.equal(
    model.clients.find((c) => c.name === "Cliente Alfa Sintético").provisional,
    false,
  );
  assert.equal(phoneKey("+591 70000001"), "70000001");
});
test("no se fusiona por nombre ni teléfono sin fecha coincidente o con IDs ambiguos", async () => {
  const ls = structuredClone(leadsRows);
  ls[1][6] = "2026-10-03 10:00:00";
  const b = await batches();
  b[0] = await prepareBatch(ls, options, asOf);
  const m = buildIntelligence(b, "2026-10");
  assert.equal(
    m.clients.filter((c) => c.name === "Cliente Alfa Sintético").length,
    2,
  );
  assert.ok(m.issues.some((i) => i.type === "Sin ID vinculado"));
});
test("temperatura distingue intención reciente, negativa, obsolescencia y falta de evidencia", async () => {
  const m = buildIntelligence(
    await batches(),
    "2026-10",
    DEFAULT_SETTINGS,
    "2026-10-28T01:00:00",
  );
  assert.equal(
    m.clients.find((c) => c.id === "synthetic-001").analysis.temperature,
    "Caliente",
  );
  assert.equal(
    m.clients.find((c) => c.id === "synthetic-002").analysis.temperature,
    "Tibio",
  );
  assert.equal(
    m.clients.find((c) => c.name === "Cliente Gamma Sintético").analysis
      .temperature,
    "Sin calificar",
  );
  assert.equal(
    classifyLead(
      m.clients.find((c) => c.id === "synthetic-001"),
      "2026-11-28T12:00:00",
    ).temperature,
    "Sin calificar",
  );
  const rejected = {
    activities: [
      {
        kind: "Información por Whatsapp",
        note: "No quiere comprar",
        at: "2026-10-27T11:00:00",
      },
    ],
  };
  assert.equal(
    classifyLead(rejected, "2026-10-28T01:00:00").temperature,
    "Frío / en pausa",
  );
});
test("misma descarga es idempotente; nueva descarga idéntica conserva nueva observación sin inflar KPI", async () => {
  const a = await prepareBatch(activityRows(), options, asOf),
    b = await prepareBatch(activityRows(), options, asOf),
    c = await prepareBatch(
      activityRows(undefined, "28/10/2026 00:45"),
      options,
      asOf,
    );
  assert.equal(a.id, b.id);
  assert.notEqual(a.id, c.id);
  assert.equal(a.contentHash, c.contentHash);
  assert.equal(buildIntelligence([a, c], "2026-10").advisors[0].activities, 5);
  assert.equal(compareBatch(a, c).added, 0);
});
test("corrección de nota no certifica gestión nueva; filas simultáneas diferentes no se eliminan", async () => {
  const a = await prepareBatch(activityRows(), options, asOf);
  const changed = structuredClone(activityRecords);
  changed[0][14] = "Nota corregida";
  const b = await prepareBatch(
    activityRows(changed, "28/10/2026 00:45"),
    options,
    asOf,
  );
  const diff = compareBatch(a, b);
  assert.equal(diff.changedAnchors, 1);
  assert.equal(diff.late.length, 0);
  assert.equal(buildIntelligence([a, b], "2026-10").advisors[0].activities, 5);
  assert.notEqual(activityKey(a.records[0]), activityKey(a.records[1]));
});
test("aparición tardía requiere reportes completos y fecha fuente en orden, no castiga línea de base", async () => {
  const first = await prepareBatch(
    activityRows(activityRecords.slice(0, 4), "27/10/2026 20:00"),
    options,
    asOf,
  );
  const next = await prepareBatch(activityRows(), options, asOf);
  assert.equal(compareBatch(null, next).late.length, 0);
  assert.equal(compareBatch(first, next).late.length, 1);
  assert.equal(
    compareBatch({ ...first, complete: false }, next).late.length,
    0,
  );
  assert.equal(
    chronologicalChanges([next, first], "2026-10")[0].comparison.late.length,
    1,
  );
});
test("calendario no condena días sin exportación posterior al corte y permite excepciones", async () => {
  const b = await batches();
  const model = buildIntelligence(
    b,
    "2026-10",
    DEFAULT_SETTINGS,
    "2026-10-28T12:00:00",
  );
  assert.equal(
    model.advisors[0].daily.find((d) => d.date === "2026-10-28").status,
    "Jornada abierta",
  );
  const past = buildIntelligence(
    b,
    "2026-10",
    DEFAULT_SETTINGS,
    "2026-10-29T19:00:00",
  );
  assert.match(
    past.advisors[0].daily.find((d) => d.date === "2026-10-28").status,
    /Pendiente de exportación/,
  );
  const excluded = buildIntelligence(b, "2026-10", {
    ...DEFAULT_SETTINGS,
    excludedDates: ["2026-10-27"],
  });
  assert.ok(!excluded.advisors[0].daily.some((d) => d.date === "2026-10-27"));
});
test("sin archivo de leads, el cumplimiento es N/D; cobertura parcial no acredita ausencias", async () => {
  const b = await batches();
  const a = buildIntelligence([{ ...b[1], complete: false }], "2026-10")
    .advisors[0];
  assert.equal(a.leads, null);
  assert.equal(a.activityCoverage, false);
});
test("metas y notas validan calendario, fundamento y vigencia", () => {
  assert.throws(
    () => validateSettings({ ...DEFAULT_SETTINGS, workdays: [] }),
    /día laborable/,
  );
  assert.throws(
    () => validateSettings({ ...DEFAULT_SETTINGS, dailyLeads: 0 }),
    /enteros/,
  );
  assert.throws(
    () =>
      validateNote({
        leadId: "synthetic-001",
        text: "Confirmado",
        temperature: "Caliente",
      }),
    /Fecha/,
  );
  assert.equal(
    validateNote({
      leadId: "synthetic-001",
      text: "Interés confirmado",
      temperature: "Caliente",
      expires: "2026-10-31",
    }).temperature,
    "Caliente",
  );
});

test("una agenda reciente después de rechazo no reactiva una intención de compra anterior como caliente", () => {
  const lead = {
    activities: [
      {
        at: "2026-10-25T10:00:00",
        kind: "Visita",
        note: "Realizará la compra",
      },
      { at: "2026-10-26T10:00:00", kind: "Mensaje", note: "No quiere comprar" },
      {
        at: "2026-10-27T10:00:00",
        kind: "Agenda a Visita de Terreno",
        note: "Se agenda nueva conversación",
      },
    ],
  };
  assert.equal(classifyLead(lead, "2026-10-28T10:00:00").temperature, "Tibio");
});
test("las notas provisionales solo pueden enlazarse con un ID inequívoco", async () => {
  const b = await batches();
  const records = structuredClone(activityRecords);
  records.push([...activityRecords[0]]);
  records.at(-1)[5] = "synthetic-conflict";
  b[1] = await prepareBatch(activityRows(records), options, asOf);
  const m = buildIntelligence(b, "2026-10");
  assert.deepEqual(m.clients.find((c) => c.id === "synthetic-001").aliases, []);
  assert.ok(
    m.clients.some((c) => c.provisional && c.name === "Cliente Alfa Sintético"),
  );
});
test("comparación de listados registra cambios de estado sin aumentar captación", async () => {
  const first = await prepareBatch(leadsRows, options, asOf);
  const changed = structuredClone(leadsRows);
  changed[1][10] = "Prospecto";
  const next = await prepareBatch(
    changed,
    { ...options, exportedAt: "2026-10-28T00:45" },
    asOf,
  );
  assert.equal(compareBatch(first, next).updated, 1);
  assert.equal(
    buildIntelligence([first, next], "2026-10").advisors[0].leads,
    3,
  );
});
