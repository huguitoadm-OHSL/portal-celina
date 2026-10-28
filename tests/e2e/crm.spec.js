import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { leadsWorkbook, activitiesWorkbook } from "./private-workbooks.js";
async function enter(page) {
  await page.clock.install({ time: new Date("2026-10-28T16:00:00Z") });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Vista de revisión local", exact: true })
    .click();
  await page.getByRole("button", { name: /Inteligencia comercial/ }).click();
  await expect(
    page.getByRole("heading", {
      name: "Tu equipo, con el siguiente paso claro.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cargar primer reporte" }),
  ).toBeVisible();
}
async function upload(page, buffer, name) {
  await page
    .getByRole("button", { name: "Cargar reportes", exact: true })
    .click();
  await page
    .getByLabel("Archivo Excel del CRM", { exact: true })
    .setInputFiles({
      name,
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer: Buffer.from(buffer, "base64"),
    });
  await expect(
    page.getByRole("heading", { name: /Vista previa/ }),
  ).toBeVisible();
  await page.getByLabel(/Confirmo mes completo/).check();
  await page
    .getByRole("button", { name: "Confirmar importación", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    /Importación guardada|ya estaba guardada/,
  );
}
test("inteligencia privada: Excel real sintético, idempotencia, persistencia, notas, agenda y restauración", async ({
  page,
  browser,
}) => {
  const outgoing = [];
  page.on("request", (r) => {
    if (r.method() === "POST") outgoing.push(r.url());
  });
  await enter(page);
  await expect(
    page.getByRole("button", { name: "Asesor sintético 1", exact: true }),
  ).toHaveCount(0);
  await upload(page, leadsWorkbook, "Listado-sintetico.xlsx");
  await upload(page, activitiesWorkbook, "Actividades-sinteticas.xlsx");
  await upload(page, activitiesWorkbook, "Actividades-sinteticas.xlsx");
  await expect(page.getByRole("status")).toContainText("No se duplicó");
  await page
    .getByRole("button", { name: "Historial y cambios", exact: true })
    .click();
  await expect(page.locator(".crm-history")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Equipo y metas", exact: true })
    .click();
  await expect(page.locator("main")).toContainText("Filas exportadas: 5");
  await expect(page.locator("main")).toContainText(
    "Grupos de mismo lead, tipo y minuto: 4",
  );
  await page.getByRole("button", { name: "Prioridades", exact: true }).click();
  await page
    .getByRole("button")
    .filter({
      has: page.getByRole("heading", {
        name: "Cliente Alfa Sintético",
        exact: true,
      }),
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Caliente · Atender hoy" }),
  ).toBeVisible();
  await page
    .getByLabel("Nota y fundamento")
    .fill("Supervisor confirmó interés con evidencia sintética");
  await page
    .getByLabel("Próxima acción", { exact: true })
    .fill("Confirmar documentos de prueba");
  await page.getByLabel("Fecha del compromiso").fill("2026-10-27");
  await page.getByRole("button", { name: "Guardar intervención" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Nota de supervisión guardada",
  );
  await page.getByRole("button", { name: "Agenda", exact: true }).click();
  await expect(page.locator("main")).toContainText("VENCIDA");
  await page.reload();
  await page
    .getByRole("button", { name: "Vista de revisión local", exact: true })
    .click();
  await page.getByRole("button", { name: /Inteligencia comercial/ }).click();
  await page.getByRole("button", { name: "Agenda", exact: true }).click();
  await expect(page.locator("main")).toContainText(
    "Confirmar documentos de prueba",
  );
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Descargar respaldo privado", exact: true })
    .click();
  const file = await download;
  const bytes = await readFile(await file.path());
  const backup = JSON.parse(bytes.toString());
  expect(backup.batches).toHaveLength(2);
  expect(backup.notes).toHaveLength(1);
  const context = await browser.newContext(),
    other = await context.newPage();
  await enter(other);
  await other
    .getByRole("button", { name: "Configuración", exact: true })
    .click();
  await other
    .getByLabel("Archivo de respaldo", { exact: true })
    .setInputFiles({
      name: "Respaldo-sintetico.json",
      mimeType: "application/json",
      buffer: bytes,
    });
  await other.getByRole("button", { name: "Confirmar restauración" }).click();
  await expect(other.getByRole("status")).toContainText("restaurado");
  await other.getByRole("button", { name: "Agenda", exact: true }).click();
  await expect(other.locator("main")).toContainText(
    "Confirmar documentos de prueba",
  );
  await other
    .getByRole("button", { name: "Completar acción", exact: true })
    .click();
  await expect(
    other.getByRole("button", { name: "Completar acción", exact: true }),
  ).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Prioridades", exact: true }).click();
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
    path: "test-results/private-mobile.png",
    fullPage: true,
  });
  expect(outgoing).toEqual([]);
  await context.close();
});
test("restauración manipulada se rechaza sin borrar el historial", async ({
  page,
}) => {
  await enter(page);
  await upload(page, leadsWorkbook, "Listado-sintetico.xlsx");
  const dl = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Descargar respaldo privado" })
    .click();
  const payload = JSON.parse(
    (await readFile(await (await dl).path())).toString(),
  );
  payload.batches[0].records[0].name = "Alteración sin huella";
  await page
    .getByRole("button", { name: "Configuración", exact: true })
    .click();
  await page
    .getByLabel("Archivo de respaldo", { exact: true })
    .setInputFiles({
      name: "Respaldo-manipulado.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(payload)),
    });
  await page.getByRole("button", { name: "Confirmar restauración" }).click();
  await expect(page.getByRole("alert")).toContainText("huella");
  await page.getByRole("button", { name: "Prioridades", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Cliente Alfa Sintético", exact: true }),
  ).toBeVisible();
});
