import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CrmStore, demoUsers } from "../server/crm/store.js";
import { metrics, signals, todayLaPaz } from "../src/crm/metrics.js";
import handler from "../api/crm.js";
const supervisor = demoUsers[0],
  a = demoUsers[1],
  b = demoUsers[2];
const create = (s, user = a, more = {}) =>
  s.mutate(
    user,
    {
      action: "create",
      name: "Cliente sintético",
      identity: "DEMO-001",
      phone: "00000000",
      ownerId: user.role === "advisor" ? user.id : a.id,
      project: "Proyecto sintético",
      source: "Prueba",
      estimatedUsd: 100,
      ...more,
    },
    new Date("2026-10-01T14:00:00Z"),
  );
const apply = (s, user, o, action, more = {}) =>
  s.mutate(
    user,
    { action, id: o.id, version: o.version, ...more },
    new Date("2026-10-27T14:00:00Z"),
  );
test("CRM guarda y restaura clientes, oportunidades y auditoría tras reabrir SQLite", () => {
  const folder = mkdtempSync(join(tmpdir(), "crm-test-"));
  const path = join(folder, "db.sqlite");
  let s = new CrmStore(path);
  const o = create(s);
  s.close();
  s = new CrmStore(path);
  assert.equal(s.view(a).opportunities[0].id, o.id);
  assert.equal(s.view(a).clients.length, 1);
  assert.equal(s.view(a).audit.length, 1);
  s.close();
  rmSync(folder, { recursive: true });
});
test("CRM impide lecturas y escrituras de otra cartera y otro equipo; gerencia solo lectura", () => {
  const s = new CrmStore();
  const o = create(s);
  assert.equal(s.view(b).opportunities.length, 0);
  assert.equal(s.view(b).clients.length, 0);
  assert.equal(s.view(b).audit.length, 0);
  assert.throws(
    () => apply(s, b, o, "stage", { stage: "Contactado" }),
    /no disponible/,
  );
  assert.equal(
    s.view({ ...supervisor, teamId: "otro" }).opportunities.length,
    0,
  );
  assert.throws(
    () =>
      apply(
        s,
        demoUsers.find((u) => u.role === "management"),
        o,
        "task",
        { due: "2026-10-28", title: "x" },
      ),
    /no disponible/,
  );
  assert.throws(() => s.view(null), /individual/);
  s.close();
});
test("CRM una identidad admite varias oportunidades, sin duplicar cliente ni perder reasignaciones", () => {
  const s = new CrmStore();
  let o = create(s);
  assert.throws(() => create(s), /ya registrada/);
  create(s, a, { clientId: o.clientId });
  assert.equal(s.view(a).clients.length, 1);
  assert.equal(s.view(a).opportunities.length, 2);
  o = apply(s, supervisor, o, "reassign", { ownerId: b.id });
  assert.equal(s.view(b).opportunities.length, 1);
  assert.equal(o.history[0].ownerId, a.id);
  assert.equal(o.history.at(-1).ownerId, b.id);
  s.close();
});
test("CRM transacciones revierten fallos, validan importes y rechazan versiones antiguas", () => {
  const s = new CrmStore();
  assert.throws(() => create(s, a, { estimatedUsd: -10 }), /Importe/);
  assert.equal(s.view(a).clients.length, 0);
  const o = create(s);
  apply(s, a, o, "stage", { stage: "Contactado" });
  assert.throws(() => apply(s, a, o, "stage", { stage: "Cotizado" }), /cambió/);
  assert.equal(s.view(a).audit.length, 2);
  s.close();
});
test("CRM gestión guarda resultado y próxima tarea juntos; alertas cruzan meses y fecha Bolivia", () => {
  const s = new CrmStore();
  let o = create(s);
  assert.throws(
    () =>
      apply(s, a, o, "activity", {
        kind: "Llamada",
        result: "Respuesta",
        nextDate: "2026-10-25",
      }),
    /Texto/,
  );
  assert.equal(s.view(a).opportunities[0].activities.length, 0);
  o = apply(s, a, o, "activity", {
    kind: "Llamada",
    result: "Pidió visita",
    contact: true,
    nextDate: "2026-10-25",
    nextAction: "Confirmar visita",
  });
  assert.equal(o.activities.length, 1);
  assert.equal(o.tasks.length, 1);
  assert.equal(signals(o, "2026-11-01").overdue, 1);
  assert.equal(todayLaPaz(new Date("2026-11-01T02:00:00Z")), "2026-10-31");
  assert.ok(
    signals(o, "2026-11-05").warnings.some((w) => w.includes("abandono")),
  );
  s.close();
});
test("CRM cierre declarado no es venta; verificación requiere administración, evidencia y contrato único", () => {
  const s = new CrmStore();
  let o = create(s);
  o = apply(s, a, o, "stage", { stage: "Cierre declarado" });
  assert.equal(metrics([o], "2026-10").verified, 0);
  assert.throws(() => apply(s, supervisor, o, "verify", {}), /administración/);
  const admin = { ...supervisor, role: "admin" };
  o = apply(s, admin, o, "verify", {
    contract: "DEMO-C1",
    evidence: "Documento sintético validado",
    amountUsd: 100,
    date: "2026-10-27",
  });
  assert.equal(metrics([o], "2026-10").verifiedUsd, 100);
  assert.throws(
    () => apply(s, a, o, "stage", { stage: "Captado" }),
    /conciliación/,
  );
  s.close();
});
test("CRM conversión por cohorte separa captación de cierres de otras cohortes y meses", () => {
  const s = new CrmStore();
  const o = create(s);
  const old = {
    ...o,
    id: "old",
    createdAt: "2026-09-01T12:00:00Z",
    verifiedClose: { date: "2026-10-10", amountUsd: 200 },
  };
  const m = metrics([o, old], "2026-10", "2026-10-27");
  assert.equal(m.verified, 1);
  assert.equal(m.captured, 1);
  assert.equal(m.cohortConversion, 0);
  assert.equal(metrics([], "2026-10").cohortConversion, null);
  s.close();
});
test("CRM visita y compromiso cumplidos alimentan señales con evidencia; pérdidas exigen motivo", () => {
  const s = new CrmStore();
  let o = create(s);
  o = apply(s, a, o, "task", {
    title: "Visita",
    kind: "Visita",
    due: "2026-10-27",
  });
  o = apply(s, a, o, "completeTask", {
    taskId: o.tasks[0].id,
    result: "Visita sintética completada",
  });
  assert.equal(o.visits.length, 1);
  o = apply(s, a, o, "commitment", {
    text: "Entregar documentos",
    due: "2026-10-28",
  });
  o = apply(s, a, o, "resolve", {
    entity: "commitment",
    itemId: o.commitments[0].id,
    evidence: "Recibidos en prueba",
  });
  assert.ok(signals(o).reasons.includes("Compromiso cumplido +25"));
  assert.throws(
    () => apply(s, a, o, "stage", { stage: "Cierre perdido" }),
    /Texto/,
  );
  s.close();
});
test("CRM producción falla cerrada y no acepta la sesión compartida como identidad", () => {
  let code, body;
  const response = {
    setHeader() {},
    status(c) {
      code = c;
      return this;
    },
    json(d) {
      body = d;
    },
  };
  handler(
    { method: "POST", body: { action: "demoLogin", userId: a.id } },
    response,
  );
  assert.equal(code, 503);
  assert.match(body.error, /No habilitado/);
});

test("CRM metas se guardan por asesor y periodo con historial y permisos", () => {
  const s = new CrmStore();
  const input = {
    action: "target",
    ownerId: a.id,
    period: "2026-10",
    leads: 10,
    tasks: 20,
    quotes: 5,
    visits: 3,
    sales: 2,
    usd: 1000,
  };
  assert.throws(() => s.mutate(a, input), /Sin permiso/);
  s.mutate(supervisor, input);
  s.mutate(supervisor, { ...input, usd: 2000 });
  assert.equal(s.view(a).targets[0].history.length, 2);
  assert.equal(s.view(b).targets.length, 0);
  assert.equal(s.view(supervisor).targets[0].usd, 2000);
  s.close();
});

test("CRM rechaza referencias de cotización duplicadas sin inflar actividad", () => {
  const s = new CrmStore();
  let o = create(s);
  o = apply(s, a, o, "quote", { reference: "DEMO-Q-1", lot: "DEMO-L-1" });
  assert.throws(
    () => apply(s, a, o, "quote", { reference: "demo-q-1", lot: "DEMO-L-1" }),
    /ya vinculada/,
  );
  assert.equal(s.view(a).opportunities[0].quotes.length, 1);
  s.close();
});
