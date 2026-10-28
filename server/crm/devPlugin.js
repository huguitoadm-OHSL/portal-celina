import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import { CrmStore, demoUsers } from "./store.js";

// Exclusivo del servidor Vite local; nunca se incluye en el bundle ni en Vercel.
export function crmDevPlugin() {
  let store;
  const sessions = new Map();
  return {
    name: "crm-local-synthetic",
    apply: "serve",
    configureServer(server) {
      mkdirSync(".crm-local", { recursive: true, mode: 0o700 });
      store = new CrmStore(".crm-local/synthetic.sqlite");
      server.httpServer?.once("close", () => store.close());
      server.middlewares.use("/api/crm", async (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "no-store");
        const reply = (status, data) => {
          res.statusCode = status;
          res.end(JSON.stringify(data));
        };
        if (!["127.0.0.1:5173", "localhost:5173"].includes(req.headers.host))
          return reply(403, { error: "Solo entorno local." });
        if (
          req.method !== "GET" &&
          req.headers.origin !== `http://${req.headers.host}`
        )
          return reply(403, { error: "Origen no permitido." });
        const sid = (req.headers.cookie || "")
          .split(";")
          .map((x) => x.trim())
          .find((x) => x.startsWith("crm_demo="))
          ?.slice(9);
        const session = sessions.get(sid);
        const user =
          session && session.expires > Date.now()
            ? demoUsers.find((u) => u.id === session.userId)
            : null;
        if (req.method === "GET")
          return user
            ? reply(200, store.view(user))
            : reply(401, {
                error: "Seleccione una identidad sintética local.",
                users: demoUsers,
              });
        if (req.method !== "POST")
          return reply(405, { error: "Método no permitido." });
        try {
          let raw = "";
          for await (const chunk of req) {
            raw += chunk;
            if (Buffer.byteLength(raw) > 16384)
              return reply(413, { error: "Solicitud demasiado grande." });
          }
          const input = JSON.parse(raw);
          if (input.action === "demoLogin") {
            const account = demoUsers.find((u) => u.id === input.userId);
            if (!account) return reply(400, { error: "Identidad inválida." });
            if (sid) sessions.delete(sid);
            for (const [key, s] of sessions)
              if (s.expires < Date.now()) sessions.delete(key);
            if (sessions.size > 100)
              return reply(429, { error: "Límite local de sesiones." });
            const token = randomBytes(32).toString("hex");
            sessions.set(token, {
              userId: account.id,
              expires: Date.now() + 3600000,
            });
            res.setHeader(
              "Set-Cookie",
              `crm_demo=${token}; HttpOnly; SameSite=Strict; Path=/api/crm; Max-Age=3600`,
            );
            return reply(200, store.view(account));
          }
          store.mutate(user, input);
          return reply(200, store.view(user));
        } catch (e) {
          return reply(e.status || 400, {
            error: e.status ? e.message : "Solicitud inválida.",
          });
        }
      });
    },
  };
}
