# Operación local, evidencias y archivos

## Ejecutar la rama

Requisito: Node.js 24, npm y navegador moderno. No se necesitan cuentas externas, archivos Excel, credenciales ni servicios de pago para la prueba.

```bash
git switch feat/omni-commercial-intelligence-v1
npm ci
npm run dev:crm
```

Abrir `http://127.0.0.1:5173`, elegir **Vista de revisión local**, entrar en **Inteligencia comercial** y seleccionar un perfil sintético. Crear cliente con identidad única y oportunidad; volver a Cartera y abrir su ficha. La base comienza vacía. Registrar una gestión con próximo paso guarda la interacción y la tarea dentro de una sola transacción. Para probar vencimientos usar una fecha anterior a hoy. Cambiar de perfil permite revisar el aislamiento de carteras.

El selector de perfiles no solicita contraseñas porque únicamente funciona en localhost con datos de laboratorio. Nunca usarlo para información real ni publicarlo mediante túnel. `npm run dev` normal no activa el backend CRM sintético; `npm run dev:crm` sí. El build de producción no contiene el plugin de SQLite.

Datos persistidos localmente en `.crm-local/synthetic.sqlite`, excluidos de git. La recarga conserva los registros; al reiniciar el servidor se requiere volver a seleccionar perfil porque las sesiones de prueba se mantienen en memoria. No confundir sesión con almacenamiento de los datos.

Apertura opcional de OMNI: copiar el ejemplo `.env.crm.example` a un archivo local de entorno y configurar `VITE_OMNI_URL` solo con la URL HTTPS oficial confirmada. Reiniciar Vite. No introducir credenciales en variables VITE. Sin esa URL, la ficha comunica el pendiente y permite vincular referencias manuales.

## Comprobaciones reproducibles

```bash
npm run check
npx playwright install --with-deps chromium
CRM_SYNTHETIC_LOCAL=1 npm run test:e2e
```

`npm run check` ejecuta ESLint, pruebas de Node y compilación. El flujo de GitHub Actions usa Node 24 y ejecuta navegador con backend sintético activado explícitamente. Las pruebas no escriben en Firebase, OMNI, APIs corporativas ni producción.

En esta sesión el instalador habitual de Chromium devolvió un archivo inválido. Para la ejecución local se obtuvo un binario alternativo de Chromium mediante un paquete npm instalado fuera del repositorio y se indicó su ruta con `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. No se agregó esa dependencia a la aplicación ni al lockfile.

## Evidencias de lógica y persistencia

Las pruebas automatizadas de `tests/crm.test.js` comprueban:

- Cerrar y reabrir una base SQLite temporal conserva cliente, oportunidad y auditoría.
- Asesor ajeno no recibe oportunidades, datos de cliente ni bitácora; otro equipo no recibe la cartera; gerencia no puede modificarla.
- Una identidad única se reutiliza en varias oportunidades; el registro duplicado se rechaza sin crear otro cliente.
- Reasignación conserva el responsable original y transfiere la visibilidad al nuevo asesor.
- Un error en un campo revierte toda la transacción; una versión antigua no sobrescribe otra edición.
- Una gestión con próxima fecha crea actividad y tarea juntas; las alertas sobreviven al cambio de mes y respetan fecha de Bolivia.
- Cierre declarado no produce venta verificada. Solo administración puede verificar con contrato, importe, evidencia y fecha oficial.
- Conversión usa oportunidades de la misma cohorte y no mezcla ventas de septiembre con captación de octubre.
- Visita realizada y compromiso cumplido aportan señales; pérdida sin motivo se rechaza.
- Metas por asesor/mes conservan historial y requieren rol permitido.
- Endpoint de producción devuelve 503 y no concede acceso con el selector de prueba.

La prueba de navegador `tests/e2e/crm.spec.js` recorre el flujo real del formulario a la API y SQLite: crea cliente/oportunidad sintéticos, registra contacto y próximo paso, muestra alerta, recarga, comprueba datos guardados, completa tarea, verifica aislamiento en otro contexto, rechaza POST de origen ajeno y reasigna con historial. Comprueba ancho móvil de 390 px y escritorio de 1440 px. Las capturas que genera son evidencia diagnóstica local, excluida de git.

## Regresión del Portal

Se conserva la batería existente de correos, cálculos, tipos de cambio, importación e idempotencia. Se amplía la comprobación de navegación de 25 a 26 módulos por la nueva entrada CRM. Ningún formulario existente ni plantilla de correo se cambió. No se enviaron correos: las pruebas de enlaces usan simulaciones.

Resultado final de ejecución: consultar la sección de resultado al final de este archivo. Cualquier fallo temporal durante la implementación se distingue del resultado de la corrida final sobre código estable.

## Resumen de archivos

| Archivos | Cambio |
| --- | --- |
| `src/crm/CommercialIntelligence.jsx` | Cartera, ficha, bitácora, agenda, embudo, supervisión, filtros, metas y perfiles locales |
| `src/crm/metrics.js` | Definiciones de periodos, cohorte, señales, calidad, alertas e índice |
| `src/crm/crm.css` | Diseño responsive compatible con temas existentes |
| `server/crm/store.js` | Persistencia transaccional, permisos, validación, auditoría y dominio CRM |
| `server/crm/devPlugin.js` | API y sesiones exclusivamente locales, límites de origen/cuerpo |
| `api/crm.js` | Bloqueo explícito del CRM en producción |
| `src/App.jsx`, `src/components/layout/Sidebar.jsx` | Carga lazy y nueva entrada; conservar las vistas anteriores |
| `vite.config.js`, `package.json` | Comando de prueba local opt-in, sin añadir dependencias productivas |
| `.gitignore` | Excluir la base sintética local |
| `.env.crm.example` | Plantilla opcional sin secretos para URL verificada de OMNI |
| `vercel.json` | Deshabilitar despliegue automático de esta rama |
| `tests/crm.test.js`, `tests/e2e/crm.spec.js` | Pruebas de persistencia, seguridad, métricas y flujo funcional |
| `tests/e2e/portal.spec.js`, `playwright.config.js` | Navegación de 26 módulos y servidor de prueba según entorno |
| `.github/workflows/verify.yml` | Node 24 y activación explícita del entorno sintético para pruebas |
| `docs/OMNI-COMMERCIAL-AUDIT.md` | Auditoría, once hojas, integración, sostenibilidad, riesgos y aprobación |
| `docs/OMNI-COMMERCIAL-MODEL.md` | Entidades, permisos, indicadores y reglas del índice |
| `docs/OMNI-COMMERCIAL-VALIDATION.md` | Instrucciones, evidencias y cambios |

## Límites de lo probado

Las pruebas demuestran el comportamiento del prototipo local y la regresión automatizada. No certifican permisos desplegados de Firebase, multiusuario real, restauración de una base cloud, notificaciones fuera de la aplicación ni sincronización de cotizaciones o ventas corporativas. Esas capacidades siguen pendientes y el acceso productivo está bloqueado.

## Resultado de las corridas verificadas

- `npm run check`: ESLint correcto, pruebas de Node correctas y build de producción correcto. La batería final contiene 47 pruebas, incluidas 11 específicas del CRM.
- Navegador: 16/16 pruebas pasaron en la corrida completa sobre código estable, incluidas navegación de 26 módulos, temas, flujos anteriores y CRM.
- Después de añadir el rechazo de referencias de cotización duplicadas se repitieron lint, las 47 pruebas, compilación y el flujo CRM de navegador. No se modificaron los módulos anteriores en ese ajuste.
- Se inspeccionaron capturas de escritorio y móvil con datos exclusivamente sintéticos. No se detectó desbordamiento horizontal en el flujo CRM a 390 px.
- Una corrida intermedia de navegador tuvo un timeout en un test de navegación de Gmail mientras se editaba el código con Vite activo. La corrida completa posterior, sin editar el código durante su ejecución, pasó 16/16. No se atribuye el fallo a un defecto del correo ni se modificó esa funcionalidad.

No se afirma haber validado una instalación productiva. El adaptador cloud, las cuentas individuales reales y la integración automática con OMNI siguen pendientes.
