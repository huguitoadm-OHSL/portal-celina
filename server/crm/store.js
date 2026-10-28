import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";

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
export const demoUsers = [
  {
    id: "supervisor-demo",
    name: "Supervisor de prueba",
    role: "supervisor",
    teamId: "demo",
  },
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `asesor-${i + 1}`,
    name: `Asesor sintético ${i + 1}`,
    role: "advisor",
    teamId: "demo",
  })),
  {
    id: "gerencia-demo",
    name: "Gerencia de prueba",
    role: "management",
    teamId: "demo",
  },
  {
    id: "admin-demo",
    name: "Administración de prueba",
    role: "admin",
    teamId: "demo",
  },
];
export function businessDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/La_Paz",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
function requireValue(ok, message, status = 400) {
  if (!ok) throw Object.assign(new Error(message), { status });
}
function text(value, required = false) {
  requireValue(
    typeof value === "string" &&
      value.length <= 2000 &&
      (!required || value.trim()),
    "Texto inválido.",
  );
  return value.trim();
}
function date(value) {
  requireValue(
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      new Date(value).toISOString().slice(0, 10) === value,
    "Fecha inválida.",
  );
  return value;
}
function amount(value) {
  requireValue(
    typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 1e10,
    "Importe inválido.",
  );
  return Math.round(value * 100) / 100;
}
const closed = (o) => ["Cierre declarado", "Cierre perdido"].includes(o.stage);
export class CrmStore {
  constructor(path = ":memory:") {
    this.db = new DatabaseSync(path);
    this.db.exec(
      "PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS targets(id TEXT PRIMARY KEY, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS clients(id TEXT PRIMARY KEY, identity TEXT UNIQUE NOT NULL, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS opportunities(id TEXT PRIMARY KEY, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY, opportunityId TEXT NOT NULL, data TEXT NOT NULL);",
    );
  }
  canRead(user, o) {
    return (
      user &&
      (["management", "admin"].includes(user.role) ||
        (user.teamId === o.teamId &&
          (user.role === "supervisor" ||
            (user.role === "advisor" && user.id === o.ownerId))))
    );
  }
  canWrite(user, o) {
    return this.canRead(user, o) && user.role !== "management";
  }
  all() {
    return this.db
      .prepare("SELECT data FROM opportunities")
      .all()
      .map((r) => JSON.parse(r.data));
  }
  view(user) {
    requireValue(user, "Sesión individual requerida.", 401);
    const opportunities = this.all().filter((o) => this.canRead(user, o));
    const ids = new Set(opportunities.map((o) => o.clientId));
    return {
      user,
      targets: this.db
        .prepare("SELECT data FROM targets")
        .all()
        .map((r) => JSON.parse(r.data))
        .filter((t) => this.canRead(user, t)),
      users: demoUsers.filter(
        (u) => u.teamId === user.teamId || user.role === "admin",
      ),
      opportunities,
      clients: this.db
        .prepare("SELECT data FROM clients")
        .all()
        .map((r) => JSON.parse(r.data))
        .filter((c) => ids.has(c.id)),
      audit: this.db
        .prepare("SELECT data FROM audit")
        .all()
        .map((r) => JSON.parse(r.data))
        .filter((a) => opportunities.some((o) => o.id === a.opportunityId)),
    };
  }
  mutate(user, input, now = new Date()) {
    requireValue(user, "Sesión individual requerida.", 401);
    requireValue(input && typeof input === "object", "Solicitud inválida.");
    this.db.exec("BEGIN IMMEDIATE");
    try {
      let o,
        before = null;
      const at = now.toISOString();
      if (input.action === "target") {
        requireValue(
          ["supervisor", "admin"].includes(user.role),
          "Sin permiso.",
          403,
        );
        const owner = demoUsers.find(
          (u) =>
            u.id === input.ownerId &&
            u.teamId === user.teamId &&
            u.role === "advisor",
        );
        requireValue(owner, "Asesor inválido.");
        requireValue(
          /^\d{4}-(0[1-9]|1[0-2])$/.test(input.period),
          "Periodo inválido.",
        );
        const id = `${owner.id}:${input.period}`;
        const old = this.db
          .prepare("SELECT data FROM targets WHERE id=?")
          .get(id);
        const previous = old ? JSON.parse(old.data) : null;
        const values = {};
        for (const key of [
          "leads",
          "tasks",
          "quotes",
          "visits",
          "sales",
          "usd",
        ]) {
          values[key] = amount(input[key]);
          if (key !== "usd")
            requireValue(
              Number.isInteger(values[key]),
              "La meta debe ser entera.",
            );
        }
        const target = {
          id,
          ownerId: owner.id,
          teamId: user.teamId,
          period: input.period,
          ...values,
          history: [
            ...(previous?.history || []),
            { at, actor: user.id, values },
          ],
        };
        this.db
          .prepare("INSERT OR REPLACE INTO targets VALUES(?,?)")
          .run(id, JSON.stringify(target));
        this.db.exec("COMMIT");
        return target;
      }
      if (input.action === "create") {
        requireValue(
          ["advisor", "supervisor", "admin"].includes(user.role),
          "Sin permiso.",
          403,
        );
        const owner = demoUsers.find(
          (u) =>
            u.id === input.ownerId &&
            u.role === "advisor" &&
            u.teamId === user.teamId,
        );
        requireValue(
          owner && (user.role !== "advisor" || owner.id === user.id),
          "Responsable no autorizado.",
          403,
        );
        let client;
        if (input.clientId) {
          const row = this.db
            .prepare("SELECT data FROM clients WHERE id=?")
            .get(text(input.clientId, true));
          requireValue(row, "Cliente no disponible.", 404);
          client = JSON.parse(row.data);
          requireValue(
            this.all().some(
              (old) => old.clientId === client.id && this.canWrite(user, old),
            ),
            "Cliente no disponible.",
            404,
          );
        } else {
          const identity = text(input.identity, true).toLowerCase();
          requireValue(
            !this.db
              .prepare("SELECT id FROM clients WHERE identity=?")
              .get(identity),
            "Identidad ya registrada: seleccione el cliente existente o solicite conciliación.",
            409,
          );
          client = {
            id: randomUUID(),
            createdAt: at,
            acquiredBy: owner.id,
            name: text(input.name, true),
            phone: text(input.phone, true),
            identity,
          };
          this.db
            .prepare("INSERT INTO clients VALUES(?,?,?)")
            .run(client.id, identity, JSON.stringify(client));
        }
        o = {
          id: randomUUID(),
          clientId: client.id,
          teamId: user.teamId,
          ownerId: owner.id,
          project: text(input.project, true),
          source: text(input.source, true),
          estimatedUsd: amount(input.estimatedUsd),
          createdAt: at,
          stage: "Captado",
          version: 1,
          activities: [],
          tasks: [],
          quotes: [],
          objections: [],
          commitments: [],
          visits: [],
          history: [
            { at, actor: user.id, stage: "Captado", ownerId: owner.id },
          ],
        };
      } else {
        const row = this.db
          .prepare("SELECT data FROM opportunities WHERE id=?")
          .get(text(input.id, true));
        requireValue(row, "Oportunidad no disponible.", 404);
        o = JSON.parse(row.data);
        requireValue(this.canWrite(user, o), "Oportunidad no disponible.", 403);
        requireValue(
          input.version === o.version,
          "La ficha cambió. Recargue antes de guardar.",
          409,
        );
        before = structuredClone(o);
        if (input.action === "activity") {
          requireValue(!closed(o), "La oportunidad está cerrada.");
          requireValue(
            ["Llamada", "Mensaje", "Reunión", "Visita"].includes(input.kind),
            "Tipo inválido.",
          );
          const a = {
            id: randomUUID(),
            at,
            actor: user.id,
            kind: input.kind,
            result: text(input.result, true),
            contact: input.contact === true,
          };
          o.activities.push(a);
          if (a.contact) {
            o.firstContactAt ||= at;
            o.lastContactAt = at;
          }
          if (a.kind === "Visita") o.visits.push({ ...a, completedAt: at });
          if (input.nextDate)
            o.tasks.push({
              id: randomUUID(),
              due: date(input.nextDate),
              title: text(input.nextAction, true),
              status: "Pendiente",
              createdAt: at,
            });
        } else if (input.action === "task") {
          requireValue(!closed(o), "La oportunidad está cerrada.");
          o.tasks.push({
            id: randomUUID(),
            due: date(input.due),
            title: text(input.title, true),
            kind: input.kind === "Visita" ? "Visita" : "Seguimiento",
            status: "Pendiente",
            createdAt: at,
          });
        } else if (input.action === "completeTask") {
          const t = o.tasks.find((t) => t.id === input.taskId);
          requireValue(t && t.status === "Pendiente", "Tarea no pendiente.");
          t.status = "Realizada";
          t.completedAt = at;
          t.result = text(input.result, true);
          o.activities.push({
            id: randomUUID(),
            at,
            actor: user.id,
            kind: t.kind,
            result: t.result,
            taskId: t.id,
          });
          if (t.kind === "Visita")
            o.visits.push({
              id: randomUUID(),
              completedAt: at,
              actor: user.id,
              result: t.result,
            });
        } else if (input.action === "stage") {
          requireValue(
            !o.verifiedClose,
            "Un cierre verificado requiere conciliación administrativa.",
          );
          requireValue(STAGES.includes(input.stage), "Etapa inválida.");
          if (input.stage === "Cierre perdido")
            o.lossReason = text(input.reason, true);
          o.stage = input.stage;
          o.declaredAt = input.stage === "Cierre declarado" ? at : null;
          o.history.push({
            at,
            actor: user.id,
            stage: o.stage,
            ownerId: o.ownerId,
          });
        } else if (input.action === "reassign") {
          requireValue(
            ["supervisor", "admin"].includes(user.role),
            "Sin permiso.",
            403,
          );
          const owner = demoUsers.find(
            (u) =>
              u.id === input.ownerId &&
              u.teamId === o.teamId &&
              u.role === "advisor",
          );
          requireValue(owner, "Asesor inválido.");
          o.ownerId = owner.id;
          o.history.push({
            at,
            actor: user.id,
            stage: o.stage,
            ownerId: owner.id,
          });
        } else if (input.action === "quote") {
          const reference = text(input.reference, true);
          requireValue(
            !this.all().some((x) =>
              x.quotes.some(
                (q) => q.reference.toLowerCase() === reference.toLowerCase(),
              ),
            ),
            "Referencia de cotización ya vinculada: concilie la oportunidad antes de duplicar.",
            409,
          );
          o.quotes.push({
            id: randomUUID(),
            reference,
            project: o.project,
            lot: text(input.lot, true),
            at,
            actor: user.id,
          });
        } else if (
          input.action === "objection" ||
          input.action === "commitment"
        ) {
          const list =
            input.action === "objection" ? o.objections : o.commitments;
          list.push({
            id: randomUUID(),
            text: text(input.text, true),
            due: input.action === "commitment" ? date(input.due) : null,
            status: "Pendiente",
            at,
            actor: user.id,
          });
        } else if (input.action === "resolve") {
          const list =
            input.entity === "objection"
              ? o.objections
              : input.entity === "commitment"
                ? o.commitments
                : [];
          const item = list.find((x) => x.id === input.itemId);
          requireValue(
            item && item.status === "Pendiente",
            "Elemento inválido.",
          );
          item.status = "Cumplido";
          item.resolvedAt = at;
          item.evidence = text(input.evidence, true);
        } else if (input.action === "verify") {
          requireValue(
            user.role === "admin",
            "Solo administración verifica contra la fuente corporativa.",
            403,
          );
          requireValue(
            o.stage === "Cierre declarado" && !o.verifiedClose,
            "Cierre no verificable.",
          );
          const contract = text(input.contract, true);
          requireValue(
            !this.all().some(
              (x) =>
                x.verifiedClose?.contract.toLowerCase() ===
                contract.toLowerCase(),
            ),
            "Contrato duplicado.",
            409,
          );
          const closeDate = date(input.date);
          requireValue(
            closeDate >= businessDate(new Date(o.createdAt)) &&
              closeDate <= businessDate(now),
            "Fecha de cierre fuera del intervalo permitido.",
          );
          o.verifiedClose = {
            contract,
            source: text(input.evidence, true),
            amountUsd: amount(input.amountUsd),
            date: closeDate,
            verifiedAt: at,
            actor: user.id,
          };
        } else requireValue(false, "Acción inválida.");
        o.version++;
      }
      o.updatedAt = at;
      this.db
        .prepare("INSERT OR REPLACE INTO opportunities VALUES(?,?)")
        .run(o.id, JSON.stringify(o));
      const audit = {
        id: randomUUID(),
        opportunityId: o.id,
        actor: user.id,
        at,
        action: input.action,
        before,
        after: structuredClone(o),
      };
      this.db
        .prepare("INSERT INTO audit VALUES(?,?,?)")
        .run(audit.id, o.id, JSON.stringify(audit));
      this.db.exec("COMMIT");
      return o;
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  close() {
    this.db.close();
  }
}
