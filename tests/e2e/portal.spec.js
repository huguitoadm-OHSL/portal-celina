import { test, expect } from '@playwright/test';

async function enter(page) {
  await page.goto('/');
  await page.getByRole('button', {name:'Vista de revisión local',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Colocación por asesor'})).toBeVisible();
}

test('temas persistentes, sistema operativo y dashboard móvil',async ({page}) => {
  await enter(page);
  await page.getByRole('button', {name:'Ver ventas', exact:true}).click();
  await expect(page.getByRole('heading', {name:'Detalle de Asesor Mes en Curso'})).toBeVisible();
  await page.getByRole('button', {name:'Inicio', exact:true}).click();
  await page.getByRole('button', {name:'Revisar proyección', exact:true}).click();
  await expect(page.locator('.email-preview')).toContainText('65,300.00');
  await page.getByRole('button', {name:'Inicio', exact:true}).click();
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
      expect(content, labels[i]).not.toMatch(/\{\{(?:SALUDO_TIEMPO|NOMBRE_SUPERVISOR)\}\}|Estimad[oa](?:\/a)?\s+Estimad[oa]|Estimado\/a|Estimad[oa]\s+(?:Lic|Ing)\.|\\vert\{\}|undefined|NaN/);
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
  expect((text.match(/Estimado Ulrich/g)||[]).length).toBe(1);
  expect(text).not.toContain('{{SALUDO_TIEMPO}}');
  expect(text).not.toContain('Estimado/a');
  expect(text).not.toContain('Klein Montano');
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
  await expect(page.locator('main')).toContainText('700 Bs.');
  await expect(page.locator('main')).toContainText('1.100 Bs.');
  await expect(page.getByRole('columnheader', {name:'Colocación ($ USD)', exact:true})).toBeVisible();
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

test('las cuatro pestañas comparten ventas USD y editar posibles ventas no altera colocación', async ({page}) => {
  await enter(page);
  const current = page.locator('.metric-card.current strong');
  await expect(current).toContainText('USD 17.700');
  const dashboardRow=page.locator('main tbody tr').filter({hasText:'Marisol Urgel Pizarro'});
  await expect(dashboardRow.locator('td').nth(1)).toHaveText('1');
  await expect(dashboardRow.locator('td').nth(2)).toContainText('11.200');
  await page.getByRole('button',{name:'Proyección Semanal',exact:true}).click();
  const weeklyRow=page.locator('main table tbody tr').filter({hasText:'Marisol Urgel Pizarro'}).filter({has:page.locator('input')});
  await expect(weeklyRow.locator('td').nth(1)).toHaveText('USD 11,200.00');
  await expect(weeklyRow.locator('td').nth(2)).toHaveText('1');
  await page.getByRole('spinbutton',{name:'Proyección semanal Marisol Urgel Pizarro',exact:true}).fill('12000');
  await weeklyRow.locator('input').last().fill('5');
  await page.getByRole('button',{name:'Inicio',exact:true}).click();
  await expect(current).toContainText('USD 17.700');
  await expect(page.locator('.metric-card').nth(1).locator('strong')).toContainText('USD 53.600');
  await expect(page.locator('.hero-meta')).toContainText('2 ventas realizadas');
  await page.getByRole('button',{name:/^Incentivos Celina/}).click();
  const placement=page.getByRole('spinbutton',{name:'Colocación USD de Marisol Urgel Pizarro',exact:true});
  await expect(placement).toHaveValue('11200');
  await expect(placement).toHaveAttribute('readonly','');
  await expect(page.getByRole('spinbutton',{name:'Ventas de Marisol Urgel Pizarro',exact:true})).toHaveValue('1');
  await page.getByRole('button',{name:'Simular escenario de incentivos',exact:true}).click();
  await placement.fill('99000');
  await page.getByRole('button',{name:'Seguimiento de Ventas',exact:true}).click();
  const tracking=page.locator('main tbody tr').filter({hasText:'Marisol Urgel Pizarro'});
  await expect(tracking.locator('td').nth(3)).toHaveText('1');
  await expect(tracking.locator('td').nth(4)).toHaveText('11,200.00');
  await page.getByRole('button',{name:'Proyección Semanal',exact:true}).click();
  await expect(page.getByRole('spinbutton',{name:'Proyección semanal Marisol Urgel Pizarro',exact:true})).toHaveValue('12000');
  await expect(weeklyRow.locator('td').nth(1)).toHaveText('USD 11,200.00');
});

test('una venta nueva en la fuente compartida actualiza las cuatro vistas y un reintento no duplica', async ({page}) => {
  await enter(page);
  // Entorno de prueba aislado: los datos TEST solo viven en este Provider y nunca se guardan en CRM.
  await page.evaluate(async () => {
    const React = (await import('/node_modules/.vite/deps/react.js')).default;
    const { createRoot } = (await import('/node_modules/.vite/deps/react-dom_client.js')).default;
    const { CommercialProvider } = await import('/src/state/CommercialProvider.jsx');
    const { useCommercial } = await import('/src/hooks/useCommercial.js');
    const modules = await Promise.all(['Dashboard','ProyeccionSemanal','SeguimientoVentas','IncentivosAsesores'].map(name => import(`/src/views/${name}.jsx`)));
    const sale = {id:'TEST-SALE', contractId:'TEST-CONTRACT', advisorId:'marisol',advisor:'Marisol Urgel Pizarro',project:'Los Jardines',lots:1,amountUsd:3000,currency:'USD',date:'2026-10-10',status:'confirmed'};
    function Harness() {
      const { recordSale } = useCommercial();
      return React.createElement('div', null, React.createElement('button', {onClick:()=>recordSale(sale)}, 'Añadir venta de prueba'), ...modules.map((module,index) => React.createElement('section',{key:index,id:`view-${index}`},React.createElement(module.default))));
    }
    const root=document.createElement('div'); root.id='commercial-harness'; document.body.append(root);
    createRoot(root).render(React.createElement(CommercialProvider,null,React.createElement(Harness)));
  });
  const harness=page.locator('#commercial-harness');
  const add=harness.getByRole('button',{name:'Añadir venta de prueba',exact:true});
  await add.click();
  await expect(harness.locator('#view-0 .metric-card.current strong')).toContainText('USD 20.700');
  const start=harness.locator('#view-0 tbody tr').filter({hasText:'Marisol Urgel Pizarro'});
  await expect(start.locator('td').nth(1)).toHaveText('2');
  await expect(start.locator('td').nth(2)).toContainText('14.200');
  const weekly=harness.locator('#view-1 tbody tr').filter({hasText:'Marisol Urgel Pizarro'}).filter({has:page.locator('input')});
  await expect(weekly.locator('td').nth(1)).toHaveText('USD 14,200.00');
  await expect(weekly.locator('td').nth(2)).toHaveText('2');
  const tracking=harness.locator('#view-2 tbody tr').filter({hasText:'Marisol Urgel Pizarro'});
  await expect(tracking.locator('td').nth(3)).toHaveText('2');
  await expect(tracking.locator('td').nth(4)).toHaveText('14,200.00');
  await expect(harness.locator('#view-3').getByRole('spinbutton',{name:'Ventas de Marisol Urgel Pizarro',exact:true})).toHaveValue('2');
  await expect(harness.locator('#view-3').getByRole('spinbutton',{name:'Colocación USD de Marisol Urgel Pizarro',exact:true})).toHaveValue('14200');
  await add.click();
  await expect(harness.locator('#view-0 .metric-card.current strong')).toContainText('USD 20.700');
  await expect(harness.locator('#view-0 .metric-card').nth(1).locator('strong')).toContainText('USD 47.600');
});


test('los cinco correos de RRHH saludan a Ulrich por su primer nombre en HTML y texto', async ({page}) => {
  await enter(page);
  await page.evaluate(() => {
    window.copiedEmail = '';
    window.ClipboardItem = undefined;
    Object.defineProperty(navigator, 'clipboard', {value: {writeText: async text => { window.copiedEmail = text; }}, configurable: true});
  });
  for (const module of ['Alta Usuarios CRM', 'Carta de Renuncia', 'Evaluación Fin de Mes', 'Postulante Nuevo', 'Solicitud Memorándum']) {
    await page.getByRole('button', {name: module, exact: true}).click();
    const preview = page.locator('.email-preview');
    await expect(preview).toContainText('Estimado Ulrich,');
    await expect(preview).not.toContainText('Estimado/a');
    await expect(preview).not.toContainText('Klein Montano');
    await page.evaluate(() => { window.copiedEmail = ''; });
    await page.getByRole('button', {name: 'Copiar Formato', exact: true}).click();
    await expect.poll(() => page.evaluate(() => window.copiedEmail)).toContain('Estimado Ulrich,');
    const text = await page.evaluate(() => window.copiedEmail);
    expect(text).not.toMatch(/Estimado\/a|Klein Montano|\{\{NOMBRE_SUPERVISOR\}\}/);
  }
});


test('el acceso personal pide solo contraseña y se valida por la API del servidor', async ({page}) => {
  let loginChecked = false;
  await page.route('**/api/auth', async route => {
    if (route.request().method() === 'GET') return route.fulfill({status:401,json:{authorized:false}});
    const data = route.request().postDataJSON();
    expect(data.action).toBe('login');
    expect(data.password).toBe('test-password-only-1234');
    loginChecked = true;
    return route.fulfill({status:200,json:{authorized:true}});
  });
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Bienvenido al portal'})).toBeVisible();
  await expect(page.locator('input[type=email]')).toHaveCount(0);
  await page.getByLabel('Contraseña',{exact:true}).fill('test-password-only-1234');
  await page.getByRole('button',{name:'Ingresar',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Colocación por asesor'})).toBeVisible();
  expect(loginChecked).toBeTruthy();
  expect(await page.evaluate(()=>localStorage.getItem('acceso_portal_master'))).toBeNull();
});
