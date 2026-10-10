import { test, expect } from '@playwright/test';

async function enter(page) {
  await page.goto('/');
  await page.getByRole('button', {name:'Vista de revisión local',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Colocación por asesor'})).toBeVisible();
}

test('temas persistentes, sistema operativo y dashboard móvil',async ({page}) => {
  await enter(page);
  const selector=page.getByRole('combobox',{name:'Tema de apariencia'});
  await selector.selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await selector.selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.reload();
  await page.getByRole('button',{name:'Vista de revisión local',exact:true}).click();
  await expect(selector).toHaveValue('dark');
  await selector.selectOption('system');
  await page.emulateMedia({colorScheme:'light'});
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.emulateMedia({colorScheme:'dark'});
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.setViewportSize({width:390,height:844});
  await expect(page.getByRole('heading',{name:'7 lotes por concretar'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.getByRole('button',{name:'Abrir menú'}).click();
  await expect(page.getByRole('button',{name:'Proyección Semanal',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Proyección Semanal',exact:true}).click();
  await expect(page.locator('.email-preview')).toContainText('65,300.00');
});

test('los 25 módulos se renderizan sin errores y sin perder navegación',async ({page}) => {
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:1440,height:1000});
  await enter(page);
  const buttons=page.locator('aside nav button');
  const labels=await buttons.allTextContents();
  expect(labels).toHaveLength(25);
  for (let i=0;i<labels.length;i++) {
    await buttons.nth(i).click();
    await expect(page.locator('main h1, main h2').first()).toBeVisible();
    await expect(page.getByText('No se pudo mostrar este módulo',{exact:true})).toHaveCount(0);
    const previews = page.locator('.email-preview');
    for (const preview of await previews.all()) {
      const content = await preview.innerText();
      expect(content, labels[i]).not.toMatch(/\{\{(?:SALUDO_TIEMPO|NOMBRE_SUPERVISOR)\}\}|Estimad[oa](?:\/a)?\s+Estimad[oa]|\\vert\{\}|undefined|NaN/);
      expect(content, labels[i]).not.toMatch(/\b(por favor le solicito|tu colaboración|tu apoyo|por si necesitas|Máquina de Ventas)\b/i);
    }
  }
  expect(errors).toEqual([]);
});

test('saludo, redacción y protección de HTML dinámico en alta de CRM', async ({page}) => {
  await enter(page);
  await page.getByRole('button',{name:'Alta Usuarios CRM',exact:true}).click();
  const preview=page.locator('.email-preview');
  await expect(preview).toContainText('se está integrando');
  const input=page.locator('input[name="nombre"]');
  await input.fill('<img src=x onerror="window.attacked=true">');
  await expect(preview).toContainText('<img src=x');
  expect(await preview.locator('img,script,iframe').count()).toBe(0);
  expect(await page.evaluate(()=>Boolean(window.attacked))).toBeFalsy();
  const text=await preview.innerText();
  expect((text.match(/Estimado\/a Ulrich/g)||[]).length).toBe(1);
  expect(text).not.toContain('{{SALUDO_TIEMPO}}');
});

test('conciliación de Marisol alerta coincidencias sin modificar importes', async ({page}) => {
  await enter(page);
  await page.locator('input[type=file]').setInputFiles({name:'extracto.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify([{advisor:'Marisol Urgel Pizarro',project:'Los Jardines',date:'2026-10-09',amountUsd:11200,lots:1,contractId:'ejemplo'}]))});
  await expect(page.locator('.reconciliation-status')).toContainText('1 coincidencia candidata');
  await expect(page.locator('.metric-card.current strong')).toContainText('17.700');
});

test('sanitizador bloquea scripts, eventos y estilos con solicitudes remotas',async ({page})=>{
  await enter(page);
  const clean=await page.evaluate(async()=>{
    const {sanitizeEmailHtml}=await import('/src/services/email.js');
    return sanitizeEmailHtml('<p style="background-image:url(https://example.com/tracker)">Prueba</p><a href="javascript:alert(1)">enlace</a><img src=x onerror=alert(1)><script>alert(1)</script>');
  });
  expect(clean).not.toContain('url(');
  expect(clean).not.toContain('onerror');
  expect(clean).not.toContain('<script');
  expect(clean).not.toContain('<img');
});

test('marca antigua en localStorage no concede acceso',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('acceso_portal_master','PERMITIDO'));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Bienvenido al portal'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Colocación por asesor'})).toHaveCount(0);
});

test('Marisol figura en Jardines y en Incentivos una sola vez, sin bonos indebidos', async ({page}) => {
  await enter(page);
  await page.getByRole('button', {name:'Seguimiento de Ventas', exact:true}).click();
  const row = page.locator('main tbody tr').filter({hasText:'Marisol Urgel Pizarro'});
  await expect(row.locator('td').nth(3)).toHaveText('1');
  const project = page.locator('main span').filter({hasText:/^Jardines$/}).locator('..');
  await expect(project.locator('span').last()).toHaveText('1');
  await page.getByRole('button', {name:/^Incentivos Celina/}).click();
  const advisor = page.locator('main table tbody tr').filter({hasText:'Marisol Urgel Pizarro'}).filter({has:page.locator('input')});
  await expect(advisor.locator('input').nth(0)).toHaveValue('1');
  await expect(advisor.locator('input').nth(1)).toHaveValue('11200');
  await expect(advisor).toContainText('PENDIENTE');
  await expect(advisor).toContainText('0 Bs.');
});

test('Gmail genera una sola copia corporativa en formularios, incentivos y campañas', async ({page}) => {
  await enter(page);
  await page.evaluate(() => {
    window.drafts = [];
    Object.defineProperty(navigator, 'clipboard', {value:{write:async()=>{},writeText:async()=>{}},configurable:true});
    window.open = (url) => {
      const location = {};
      Object.defineProperty(location, 'href', {set(value){window.drafts.push(value);}});
      if (url !== 'about:blank') window.drafts.push(url);
      return {location, close(){}, opener:null};
    };
  });
  for (const [module, button] of [['Alta Usuarios CRM', 'Abrir en Gmail'], ['Incentivos Celina', 'Gmail (+CC)'], ['Descuentos Campañas', 'Abrir en Gmail']]) {
    await page.getByRole('button', {name:new RegExp('^'+module)}).click();
    await page.getByRole('button', {name:button, exact:false}).click();
    await expect.poll(() => page.evaluate(() => window.drafts.length)).toBeGreaterThan(0);
    const drafts = await page.evaluate(() => window.drafts.splice(0));
    expect(drafts).toHaveLength(1);
    expect(new URL(drafts[0]).searchParams.get('cc')).toBe('ohsaravia@celina.com.bo');
    await page.waitForTimeout(2600);
  }
});
