import process from "node:process";
import { test, expect } from "@playwright/test";
test.skip(
  process.env.CRM_SYNTHETIC_LOCAL !== "1",
  "Requiere servidor sintético local explícito.",
);
test("CRM flujo real: guardar, recargar, alertar, completar tarea, reasignar y bloquear acceso ajeno", async ({
  page,
  browser,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Vista de revisión local", exact: true })
    .click();
  await page.getByRole("button", { name: /Inteligencia comercial/ }).click();
  await page
    .getByRole("button", { name: "Asesor sintético 1", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Nueva oportunidad", exact: true })
    .click();
  const name = `Cliente sintético E2E ${Date.now()}`;
  await page.getByLabel("Nombre del cliente").fill(name);
  await page.getByLabel("Identificador estable del cliente").fill(name);
  await page.getByLabel("Teléfono", { exact: true }).fill("00000000");
  await page
    .getByLabel("Proyecto", { exact: true })
    .last()
    .fill("Proyecto sintético");
  await page.getByLabel("Origen", { exact: true }).fill("Prueba");
  await page.getByLabel("Valor estimado USD").fill("100");
  await page.getByRole("button", { name: "Guardar oportunidad" }).click();
  await page.getByRole("button", { name: "Cartera", exact: true }).click();
  await page
    .getByRole("button")
    .filter({ has: page.getByRole("heading", { name, exact: true }) })
    .click();
  await expect(
    page.getByRole("heading", { name: `Ficha 360° · ${name}` }),
  ).toBeVisible();
  await page
    .getByLabel("Resultado", { exact: true })
    .fill("Respondió y pidió propuesta");
  await page.getByLabel("Hubo contacto efectivo").check();
  await page.getByLabel("Próxima fecha", { exact: true }).fill("2026-01-01");
  await page
    .getByLabel("Próxima acción", { exact: true })
    .fill("Confirmar propuesta sintética");
  await page.getByRole("button", { name: "Guardar gestión" }).click();
  await expect(page.locator(".crm-detail")).toContainText("Gestiones vencidas");
  await page.reload();
  await page
    .getByRole("button", { name: "Vista de revisión local", exact: true })
    .click();
  await page.getByRole("button", { name: /Inteligencia comercial/ }).click();
  await page
    .getByRole("button")
    .filter({ has: page.getByRole("heading", { name, exact: true }) })
    .click();
  await expect(page.locator(".crm-detail")).toContainText(
    "Respondió y pidió propuesta",
  );
  await page
    .getByLabel("Resultado de tarea")
    .fill("Propuesta revisada con cliente");
  await page.getByRole("button", { name: "Completar tarea" }).click();
  await expect(page.locator(".crm-detail")).toContainText("Realizada");
  const other = await browser.newContext();
  const otherPage = await other.newPage();
  await otherPage.goto("/");
  const login = await otherPage.request.post("/api/crm", {
    headers: { Origin: "http://127.0.0.1:5173" },
    data: { action: "demoLogin", userId: "asesor-2" },
  });
  expect(login.ok()).toBeTruthy();
  expect((await login.json()).clients.some((c) => c.name === name)).toBeFalsy();
  const state = await (await page.request.get("/api/crm")).json();
  const o = state.opportunities.find(
    (o) => state.clients.find((c) => c.id === o.clientId)?.name === name,
  );
  const forbidden = await otherPage.request.post("/api/crm", {
    headers: { Origin: "http://127.0.0.1:5173" },
    data: {
      action: "stage",
      id: o.id,
      version: o.version,
      stage: "Contactado",
    },
  });
  expect(forbidden.status()).toBe(403);
  const forged = await otherPage.request.post("/api/crm", {
    headers: { Origin: "https://ajeno.invalid" },
    data: { action: "demoLogin", userId: "supervisor-demo" },
  });
  expect(forged.status()).toBe(403);
  await page.getByRole("button", { name: "Cambiar perfil de prueba" }).click();
  await page
    .getByRole("button", { name: "Supervisor de prueba", exact: true })
    .click();
  await page
    .getByRole("button")
    .filter({ has: page.getByRole("heading", { name, exact: true }) })
    .click();
  await page.getByLabel("Nuevo responsable").selectOption("asesor-2");
  await page.getByRole("button", { name: "Reasignar", exact: true }).click();
  await expect(page.locator(".crm-detail")).toContainText("reassign");
  const after = await (await otherPage.request.get("/api/crm")).json();
  expect(after.clients.some((c) => c.name === name)).toBeTruthy();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await expect
    .poll(async () =>
      page.locator("aside").evaluate((e) => e.getBoundingClientRect().right),
    )
    .toBeLessThanOrEqual(0);
  await page.screenshot({
    path: "test-results/crm-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "test-results/crm-desktop.png",
    fullPage: true,
  });
  await other.close();
});
