# Inteligencia comercial privada — Portal Celina

Esta implementación reemplaza el prototipo multiusuario del PR #4. Decisión del propietario: **solo Oscar Saravia usa el Portal; los asesores no tienen acceso**. No se crean cuentas individuales. La empresa conserva su CRM actual como lugar de trabajo de los asesores.

## Probar la rama

Requisito local: Node.js 24 y npm. Compatible con Windows; el comando no requiere variables de entorno de sintaxis Unix.

```bash
git switch feat/omni-commercial-intelligence-v1
npm ci
npm run dev:crm
```

Abrir `http://127.0.0.1:5173`, pulsar **Vista de revisión local** y entrar en **Inteligencia comercial**. La revisión local es la función de desarrollo que ya tenía el Portal; no existe en el build de producción. En una instalación remota se conserva el acceso personal del Portal mediante contraseña y cookie del servidor. No se habilitó ni desplegó esta rama.

1. Elegir el mes de análisis.
2. Abrir **Cargar reportes** y seleccionar el listado de leads `.xlsx` de un asesor.
3. Revisar las primeras filas y las observaciones. Confirmar la fecha/hora de descarga si el archivo no la contiene.
4. Indicar si la exportación cubre el mes completo y todos los estados/actividades. Un archivo parcial se conserva como parcial.
5. Confirmar la importación. Repetir con el reporte de actividades del mismo asesor y mes.
6. Repetir por asesor. Cada día volver a exportar el mes acumulado y cargar ambos reportes.
7. Revisar Prioridades, Equipo y metas, Agenda, Calidad e Historial y cambios.
8. Descargar un **respaldo privado JSON** tras actualizar. Si cambia la dirección del Portal, navegador o equipo, restaurar el respaldo en el nuevo origen.

Los Excel adjuntos del usuario se analizaron para diseñar el formato, pero NO se cargaron automáticamente en la aplicación, no se añadieron a git y no forman parte de las pruebas. El historial de un navegador nuevo comienza vacío.

## Persistencia para uso personal

Se usa IndexedDB, una base del navegador, no Excel como base de producción. Los archivos se leen con la dependencia `read-excel-file` que ya existía. Se guardan instantáneas normalizadas, metadatos de cobertura, fecha fuente, fecha de importación, notas y configuración. No se guardan contraseñas, cédulas ni campos innecesarios del CRM. No hay llamadas de subida al servidor, Firebase, servicios de IA o al CRM corporativo.

La base se llama `celina-private-intelligence-v1`; almacenes `batches`, `notes`, `meta`. Cada importación se confirma con una transacción. El guardado y la restauración informan error si el navegador no puede escribir. El historial queda ligado al origen y perfil del navegador; no se comparte entre usuarios ni equipos, no está cifrado por esta aplicación y puede perderse al borrar datos del sitio o por políticas del navegador. Para uso individual en un dispositivo privado se ofrece respaldo/restauración; si se necesita recuperación central administrada se debe desarrollar un backend durable separado.

Límite de diseño de esta versión: archivos Excel de 5 MB y 20.000 filas por carga; respaldo de 50 MB, 1.000 instantáneas y 20.000 notas. Al alcanzar esos límites se requiere una ampliación o migración del historial; no se borra información para hacer espacio. No hay borrado automático de registros. El presupuesto de 50 MB del historial se evalúa sobre la representación JSON como límite orientativo; la cuota real depende del navegador. El respaldo contiene datos personales: custodiarlo como los Excel de origen. No se crean servicios, pagos ni suscripciones.

## Identidad y conciliación

- Actividades: `ID Lead` es la referencia original, no se inventa un ID corporativo.
- Listado sin ID: coincidencia provisional mediante asesor normalizado, teléfono normalizado y fecha/hora de alta; solo se vincula si hay exactamente un ID candidato.
- No se fusionan identidades por nombre. Más de un ID candidato genera observación.
- Las filas del listado no vinculadas permanecen con clave provisional y son visibles. No se pierden por carecer de actividad.
- Los leads con actividad que no aparecen en el listado se conservan y se señalan. No se suman automáticamente a la captación mensual del listado.
- Cambios o inconsistencias de asesor, fecha de alta y teléfono por ID se señalan para revisar; no se escriben reasignaciones en el CRM corporativo.

## Metas, calendario y definiciones

Valores iniciales solicitados por el propietario:

| Indicador | Objetivo |
| --- | ---: |
| Leads nuevos mensuales | 150 |
| Visitas agendadas mensuales | 15 |
| Visitas realizadas registradas mensuales | 15 |
| Leads nuevos por jornada | 10 |
| Actividades distintas registradas por jornada | 10 |

Son configurables en el Portal. Calendario inicial explícito: lunes a viernes, corte 18:00, zona America/La_Paz. Debe ajustarse a las jornadas reales; permite excluir feriados, permisos u otras fechas. Es una configuración común del equipo en V1, no calendarios individuales. La configuración se conserva al recargar.

- Captación mensual: filas únicas del último listado por asesor/mes cuya fecha de creación cae en el periodo. Sin listado se muestra N/D.
- Actividades mensuales: filas distintas del último reporte de actividades del asesor/mes; no se acumulan los totales de cada descarga diaria.
- Agendas: tipo `Agenda a Visita de Terreno`.
- Visitas realizadas registradas: tipos `Visita de Terreno Minibus` y `Visita de Terreno Propia`. Son declaraciones del CRM, no asistencia validada ni ventas.
- Se separan filas exportadas, actividades distintas, clientes gestionados y agrupaciones del mismo lead/tipo/minuto. Las agrupaciones no demuestran interacciones reales ni se usan para borrar filas diferentes.
- Dos registros de información/cotización en el mismo minuto pueden seguir siendo dos filas válidas. El panel muestra el contexto sin atribuir falsificación.
- Falta de registros significa falta de evidencia en los reportes; no demuestra ausencia de trabajo.
- Una jornada solo se compara con el objetivo cuando ya cerró y ambos reportes completos fueron descargados después de su hora de corte. Un reporte anterior no certifica días posteriores.
- No se calcula derecho a comisión ni colocación mínima: faltan ventas oficiales y reglas corporativas verificadas. Ninguna nota de compra se incorpora al registro de ventas.

Las metas se evalúan para el equipo cargado y el asesor seleccionado. Búsqueda, temperatura y texto de proyecto delimitan la lista de clientes; no cambian los objetivos del asesor. El proyecto es un filtro de menciones textuales, no una identidad de lote ni una consulta de disponibilidad.

## Prioridad comercial explicable

Reglas deterministas provisionales, sin llamadas a modelos externos y sin probabilidades:

- **Caliente:** nota reciente con expresión explícita de intención o avance hacia compra, sin negación detectada.
- **Tibio:** interés, evaluación o agenda reciente sin señal firme de compra.
- **Frío / en pausa:** señal negativa explícita en la nota, pendiente de revisión contextual.
- **Sin calificar:** solo envíos, falta de evidencia o señales históricas cuya vigencia ya no se puede afirmar.

La ventana inicial es de siete días y se puede cambiar. El texto se normaliza para tildes y mayúsculas; no es comprensión lingüística completa. Notas ambiguas, negaciones complejas, cambios de contexto, errores ortográficos y palabras fuera del catálogo requieren revisión humana. Cada clasificación muestra la nota original, fecha y regla aplicada. No se interpreta una cotización enviada como respuesta del cliente ni como interés probado.

Se distingue temperatura de urgencia: primer seguimiento, confirmar visita, recuperar interés histórico y compromisos propios vencidos o de hoy. Lista negra se señala antes de proponer contacto. Las fechas de cita escritas en notas se muestran para revisión, sin convertir automáticamente «mañana» en una cita confirmada.

El supervisor puede añadir una nota, próximo paso y fecha acordada; también confirmar una temperatura con fundamento y fecha de vigencia. Al vencer la confirmación se vuelve a las señales del reporte. La agenda permite completar la acción sin borrar la nota histórica. Estas anotaciones no modifican las actividades originales del CRM.

## Historial, duplicados y carga tardía

Cada instantánea almacena:

- Tipo de reporte, asesor, periodo y cobertura declarada.
- Nombre de archivo, fecha/hora de descarga y momento real de importación.
- Registros normalizados y huella SHA-256 del contenido.

La misma exportación (mismo contenido, fecha fuente y cobertura) es idempotente. La misma cartera descargada en otra fecha genera una nueva observación sin inflar clientes ni actividades. La fecha fuente del reporte de actividades se lee del encabezado; la del listado se declara manualmente cuando no existe. Una fecha fuente futura se rechaza.

La comparación se ordena por fecha fuente aunque los archivos se carguen fuera de orden. Las filas ausentes no se consideran pérdidas. Los cambios de nota dentro del mismo lead, tipo e instante se muestran como posibles correcciones o filas adicionales, no se certifican como una gestión nueva. La primera carga es línea de base y no permite acusar cargas anteriores tardías.

Una actividad que aparece después, con fecha declarada anterior a la descarga previa, se señala como aparición tardía para revisión solo si ambos reportes del mismo asesor, mes y tipo se declararon completos y sus fechas fuente son crecientes. No es prueba de manipulación ni un timestamp de creación de actividad del servidor corporativo. El reporte no incluye ID único de actividad ni fecha técnica de carga: esa limitación permanece.

## Respaldo y restauración

El respaldo JSON tiene formato y versión declarados. La restauración reconstruye y valida las filas mediante el mismo lector lógico, comprueba huellas y fechas, valida notas/configuración y combina mediante una sola transacción. Nunca borra la base existente. Un ID con contenido diferente bloquea toda la restauración. Las metas ya configuradas se conservan; en un navegador vacío se recuperan las del respaldo. Las huellas comprueban consistencia, no son firma digital ni autenticidad del CRM.

## Correspondencia con el Excel maestro original

| Hoja conceptual | Implementación privada |
| --- | --- |
| Panel Ejecutivo | Prioridades y Equipo y metas |
| Oportunidades | Leads vinculados por ID o identidad provisional; no se crean oportunidades de venta ficticias |
| Gestiones | Actividades importadas y notas de supervisión separadas |
| Agenda Diaria | Agendas declaradas del CRM y acciones confirmadas por el supervisor |
| Equipo | Asesores detectados en los archivos, sin cuentas individuales |
| Metas | Objetivos mensuales y diarios configurables |
| Embudo | Distribución de temperatura y estados originales en la ficha; no se inventa un embudo de cierres |
| Calidad Datos | Cobertura, coincidencias e inconsistencias |
| Catalogos | Tipos reconocidos y reglas transparentes |
| Ejemplos SEP 2026 | No se importan; su formato no corresponde a los dos reportes admitidos |
| Guia e Integracion | Este documento y el contexto visible de cada vista |

## Archivos y arquitectura

- `src/crm/AdvisorIntelligence.jsx`: espacio exclusivo de supervisión, carga, prioridades, equipo, agenda, ficha, historial, calidad y configuración.
- `src/crm/reportParser.js`: detección de los dos formatos, fechas, normalización, validación y huellas.
- `src/crm/intelligence.js`: conciliación, indicadores, calendario, evidencia de temperatura y cambios entre instantáneas.
- `src/crm/privateStore.js`: IndexedDB, transacciones, notas, configuración, respaldo/restauración.
- `src/crm/crm.css`: temas y adaptación móvil usando el diseño del Portal.
- `src/App.jsx`: ruta lazy existente actualizada; conserva las otras 25 vistas.
- `tests/private-intelligence.test.js`: casos lógicos con datos sintéticos.
- `tests/e2e/crm.spec.js`, `tests/e2e/private-workbooks.js`, `tests/private-report-fixtures.js`: archivos sintéticos y flujo de navegador.
- `vite.config.js`, `package.json`, `playwright.config.js`, `.github/workflows/verify.yml`: retirar el servidor de identidades sintéticas; comando compatible con Windows y pruebas de navegador.
- Se retiran `server/crm/*`, la interfaz multiusuario anterior, sus métricas y pruebas específicas, y el ejemplo de URL del Engine que ya no se usa en esta fase.
- `api/crm.js` queda como endpoint obsoleto bloqueado; el módulo privado no lo invoca.

## Futuro CRM y agentes de IA

Las capas de lector, dominio y persistencia están separadas. Las huellas, identidades fuente, notas, fechas de observación y cambios son reutilizables por un futuro adaptador de servidor y agentes autorizados. Esta versión no incluye un agente autónomo, sincronización corporativa ni envío de datos personales a servicios de IA. El Engine sigue siendo el motor financiero y geoespacial; no se modificó su repositorio, cálculos, planos ni inventarios.

## Pruebas y puesta en marcha

```bash
npm run check
npx playwright install --with-deps chromium
npm run test:e2e
```

Las pruebas del módulo son exclusivamente sintéticas. El flujo de navegador carga `.xlsx` reales de laboratorio con el lector real, confirma importaciones, repite archivos, recarga, registra una intervención, muestra una tarea vencida, descarga respaldo, restaura en otro contexto de navegador y rechaza un respaldo alterado sin borrar registros existentes. También comprueba que el flujo privado no emite solicitudes POST y que cabe a 390 px.

La rama mantiene deshabilitado su despliegue automático. El PR permanece en borrador, sin merge ni despliegue productivo. No se activaron pagos ni servicios. La aprobación siguiente corresponde a revisar la rama y decidir un preview protegido o la puesta en marcha oficial. Para producción se debe conservar el acceso personal del servidor y asumir explícitamente la persistencia por navegador con respaldo. La restricción de uso comercial del alojamiento Hobby documentada en la auditoría anterior no cambia por tener un único usuario; debe resolverse antes del uso empresarial oficial.

### Evidencias de esta entrega

- ESLint y compilación de producción: correctos.
- Pruebas Node: **50/50** correctas, 14 específicas de importación/inteligencia privada y 36 de regresión del Portal.
- Navegador, corrida completa: **17/17** correctas (las 15 anteriores del Portal y dos del flujo privado).
- Tras los ajustes finales de clasificación y persistencia se repitieron lint, las 50 pruebas Node, build y las dos pruebas del flujo privado: correctos.
- Se verificaron con archivos exclusivamente sintéticos: lector XLSX real, idempotencia, conciliación por ID, diferencia entre filas y clientes, recuperación tras recarga, nota y compromiso vencido, respaldo descargado y restaurado en un contexto nuevo, y rechazo atómico de respaldo alterado.
- Se inspeccionó la captura móvil de 390 px y se verificó ausencia de desbordamiento horizontal. Las capturas son diagnósticas de laboratorio y no se incorporan al repositorio.
- No se envió información de leads por POST durante el flujo privado de navegador. El Portal conserva sus pruebas del acceso personal y protección de recursos del servidor.
- No se probaron ni se afirman sincronización cloud, recuperación sin respaldo, autenticidad corporativa de las notas, detección infalible de intención, asistencia a visitas o cálculo de comisiones.
