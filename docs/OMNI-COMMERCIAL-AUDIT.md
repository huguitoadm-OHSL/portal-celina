> DOCUMENTO HISTÓRICO DEL PROTOTIPO MULTIUSUARIO. Sustituido por [Inteligencia privada](INTELIGENCIA-PRIVADA.md) tras la decisión de uso exclusivo del propietario. Las cuentas individuales, SQLite y el bloqueo por falta de identidad descritos aquí ya no definen el módulo actual.

# OMNI Commercial Intelligence V1.0 — auditoría y entrega de prueba

Fecha de elaboración: 27 de octubre de 2026, Bolivia. Repositorio: `huguitoadm-OHSL/portal-celina`. Base auditada: `5c49eb2d0c770ed72d2fe79e53bdb385b056d49e`. Rama de trabajo: `feat/omni-commercial-intelligence-v1`.

## Decisión y alcance implementado

Se implementó un módulo funcional local, integrado en la navegación existente, para validar procesos exclusivamente con datos sintéticos. No es un CRM de producción ni un preview remoto operativo. La base comercial actual no fue leída ni modificada. La rama deshabilita su despliegue automático en `vercel.json`. No se cambia main, no se hace merge, no se ejecuta despliegue y no se contrata ningún servicio.

El Portal no cuenta en el código auditado con persistencia compartida comercial ni identidad individual suficiente. Por ello se presentó antes de construir la propuesta de Firestore + cuentas individuales. Se implementó un repositorio SQLite local transaccional solo para comprobar los procesos mientras se decide la infraestructura definitiva. `/api/crm` en producción devuelve 503 incluso si se dispone de la contraseña compartida.

## Auditoría del Portal

| Área | Evidencia en el código | Reutilización / desarrollo |
| --- | --- | --- |
| Framework | React 19, Vite 8, JavaScript JSX, Tailwind 3, lucide-react | Reutilizar shell y carga lazy; nuevo módulo aislado |
| Navegación | `src/App.jsx`, `components/layout/Sidebar.jsx` | Añadir una entrada, conservar 25 vistas anteriores |
| Diseño | Variables CSS, `useTheme`, ThemeSelector, menú móvil, ErrorBoundary | Reutilizar temas claro/oscuro/sistema y estructura responsive |
| Persistencia comercial | `state/CommercialProvider.jsx`: referencias estáticas, importaciones en localStorage, metas/proyecciones en memoria | No constituye fuente compartida; CRM separado para no alterar cifras existentes |
| Firebase | `src/firebase.js`: inicializa Auth, no Firestore ni escrituras de ventas | Posible base para cuentas individuales; falta configurar y comprobar permisos administrativos |
| Acceso real | `server/auth.js`, `api/auth.js`, `middleware.js`: contraseña de entorno y cookie HMAC de 8 horas, HttpOnly, Secure, SameSite Strict | Mantener acceso personal existente. No identifica asesor, supervisor ni equipo |
| Claims auxiliares | `services/authorization.js` | No implementa permisos CRM ni conecta identidad a la sesión compartida |
| Asesores y ventas | `constants/commercialReference.js`, `equipo.js`, `commercialLedger.js`, `salesImport.js` | Referencias existentes se preservan, sin promoverlas a ventas CRM verificadas |
| Seguimiento | SeguimientoVentas y proyecciones orientadas a reportes | Reutilizar lenguaje visual, desarrollar ficha, tareas, historial y permisos |
| Dependencias | Firebase, DOMPurify, read-excel-file, @vercel/functions | Sin añadir dependencias de producción; SQLite es API nativa de Node 24 para prueba local |
| Pruebas | Node test runner, ESLint, Playwright, CI existente | Ampliar pruebas de autorización, persistencia, CRM y navegador |

No se consultaron usuarios, reglas desplegadas, cuotas consumidas, variables secretas ni la configuración administrativa de Firebase/Vercel. Las conclusiones describen el repositorio, no certifican el entorno remoto. El Portal principal se dejó sin modificaciones en producción.

## Análisis de las once hojas

Archivo analizado directamente: `OMNI_Centro_Control_Comercial_Version_Premium_Oct2026.xlsx`. Se revisaron celdas, fórmulas y relaciones; el archivo no se usa como base de datos ni se incorpora al repositorio.

| Hoja | Dimensiones | Interpretación / migración |
| --- | --- | --- |
| Panel Ejecutivo | 36 × 16 | Fórmulas e indicadores derivados. Reimplementar definiciones, no importar totales |
| Oportunidades | 256 × 33 | 250 filas preparadas; cero oportunidades operativas registradas. Crear desde registros nuevos |
| Gestiones | 506 × 16 | 500 filas preparadas; cero gestiones operativas registradas. Bitácora sin sobrescritura |
| Agenda Diaria | 17 × 11 | Resumen de pendientes, vencimientos, hoy y próximos días; derivado de tareas |
| Equipo | 13 × 8 | Siete perfiles de referencia. El propio libro pide validar nombres y permisos. ID Portal sin vincular; no crear cuentas reales automáticamente |
| Metas | 90 × 14 | Siete filas iniciales de octubre. Objetivos vacíos: sin definir; no convertirlos en metas oficiales |
| Embudo | 29 × 13 | Distribución de etapas actuales; no es conversión histórica |
| Calidad Datos | 22 × 9 | Duplicados, asignación, agenda, respuesta, cierres y pérdidas incompletas |
| Catalogos | 23 × 14 | Etapas, canales, tipos y señales; puntuaciones operativas propuestas, no probabilidades |
| Ejemplos SEP 2026 | 17 × 19 | Diez ejemplos A001–A010, explícitamente excluidos. No importar nombres, etapas, montos ni probabilidades |
| Guia e Integracion | 52 × 12 | Reglas de captura, tareas, conciliación y transición al Portal |

No existe en el libro evidencia suficiente para incorporar una venta oficialmente verificada. No se importó ninguna operación ni perfil real. La selección local contiene siete asesores ficticios y roles ficticios de supervisor, gerencia y administración.

## Integración con Quantum OMNI Engine

Repositorio inspeccionado mediante GitHub, solo lectura: `huguitoadm-OHSL/motor-financiero-celina`, árbol `49c2798bc86dd6763133cd9e7409d9f864d7a329`. Se revisaron `src/App.tsx`, `src/useInventory.ts` y `src/useReceptionHistory.ts`. El Engine usa React/TypeScript y MapLibre. `useInventory.ts` consulta `https://simulador.data-gc.net/api/proyectos` y `/lotes?project_id=...`, además de matrices locales; es evidencia de mecanismos de lectura de inventario en el Engine, no una API CRM o de cotizaciones. No se invocaron ni alteraron esos servicios. El historial de recepción inspeccionado es localStorage por usuario, no un registro compartido de clientes.

1. Apertura: la ficha puede abrir la URL HTTPS oficial del Engine configurada con `VITE_OMNI_URL`, en pestaña nueva, sin información personal ni parámetros no verificados. No se configuró una URL supuesta: el usuario facilitó la del Portal, no la del Engine. Falta confirmar la URL oficial. No se implementó selección automática de proyecto/lote.
2. Vinculación: disponible el registro manual de referencia de cotización, proyecto y lote asociado a la oportunidad, con actor y fecha. Es una referencia declarada, no un documento de cotización validado. Los indicadores la nombran referencia de cotización. Precios, cálculo y disponibilidad se consultan en su origen.
3. Sincronización: pendiente. No se encontró un contrato verificado de API CRM, autenticación entre sistemas, eventos o webhooks de cotización/venta. Antes de desarrollar se necesita contrato de eventos, identificadores estables, firma, permisos, idempotencia y reconciliación. No usar la API de inventario como autorización para escribir ventas.

No se modificó el repositorio del Engine, los cálculos financieros, planos, geometrías, inventario ni reglas de disponibilidad.

## Solución sostenible propuesta antes de la activación

Recomendación técnica: Firebase Authentication individual (sin SMS) + Firestore Standard sin habilitar facturación, previa comprobación del proyecto y su configuración real. La cuota gratuita publicada permite una base gratuita por proyecto, 1 GiB de almacenamiento, 50.000 lecturas y 20.000 escrituras diarias, 10 GiB de salida mensual. No implica disponibilidad confirmada de esas cuotas en la cuenta del usuario. Paginación, consultas por owner/team, índices compuestos, contadores y archivo de auditoría son necesarios; no trasladar el snapshot entero del prototipo a una colección única.

Autorización propuesta: verificar ID token en servidor, resolver rol y equipo de un directorio administrado, ejecutar escrituras transaccionales y añadir auditoría desde el servidor. Bloquear escrituras directas del navegador por reglas; las credenciales administrativas nunca deben estar en VITE_* ni en git. Si no hay acceso seguro para esa configuración, mantener CRM bloqueado. Antes del piloto se debe probar con emuladores y un entorno separado, no con la base actual. La recuperación y los respaldos deben diseñarse: los backups gestionados y PITR no están incluidos en la cuota gratuita. No se habilitaron servicios de pago.

Vercel Hobby: el módulo local no requiere funciones programadas, procesos persistentes ni disco de Vercel. SQLite local NO es almacenamiento durable para funciones serverless. Las alertas actuales se calculan al consultar y con cambio de fecha, sin cron ni notificaciones salientes. Además de límites técnicos, la documentación oficial restringe Hobby al uso personal no comercial. El caso empresarial de Celina exige resolver alojamiento compatible antes de activar el CRM. No se cambió el plan; no se promete que el uso comercial esté permitido en Hobby.

Fuentes oficiales consultadas:
- https://vercel.com/docs/plans/hobby
- https://vercel.com/docs/limits/fair-use-guidelines
- https://vercel.com/docs/functions/limitations
- https://firebase.google.com/docs/firestore/quotas
- https://firebase.google.com/docs/firestore/pricing

## Riesgos y trabajo pendiente

- Autenticación real, asignación de siete cuentas, permisos de equipos y adaptador persistente compartido están pendientes. El selector sintético es exclusivo del servidor local: no representa un login empresarial.
- No hay datos reales conciliados ni metas oficiales. El antiguo dashboard mantiene sus referencias independientes. No se mezcló con CRM ni se creó un segundo libro de ventas oficial.
- Confirmar clave de identidad del cliente (ID corporativo preferente); no fusionar clientes solo por teléfono o nombre. La prueba usa una identidad textual normalizada.
- El prototipo conserva eventos dentro del agregado de oportunidad y snapshots completos de auditoría; requiere separación en colecciones, paginación, retención y restauración antes de escalar.
- El índice es una regla de gestión provisional, no está calibrado. No hay evidencia para un modelo predictivo; solicitar historia confiable y validar por cohortes con separación temporal si se considera después.
- No se confirma automáticamente una venta por declaración del asesor, actividad, bloqueo, cotización, compromiso ni reserva. Administración debe conciliar contra evidencia corporativa.
- No se han ejecutado migraciones, notificaciones, sincronización OMNI ni despliegues.

## Aprobación para uso oficial

Esta rama es revisable y comprobable localmente. No está lista para autorizar un merge o producción: primero resolver alojamiento, identidad individual y persistencia, confirmar URL de OMNI y completar pruebas en un entorno separado. La aprobación oficial debe referirse a un commit verificado y un entorno definido después de cerrar esos pendientes. No se solicita autorización para publicar una versión incompleta.
