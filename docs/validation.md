# Validación de la rama V4

## Ejecución local

- ESLint: sin errores ni advertencias.
- Pruebas unitarias: 20 aprobadas (autorización, totales, centavos, coincidencias, saludos, escape HTML, correos, TC y frontera de medianoche en Bolivia).
- Compilación Vite: correcta; 25 vistas con carga diferida.
- Pruebas de navegador: 10 aprobadas en Chromium 153, incluyendo recorrido de los 25 módulos, temas persistentes y automático, viewport 390 × 844, vista previa de CRM con intento de inyección, sanitización de estilos remotos, conciliación y rechazo de la antigua bandera de acceso.
- Compilación servida con `vite preview`: exige login y no expone el botón de revisión local.
- Inspección visual de capturas del portal real en claro, oscuro y móvil.

La descarga de Chromium desde el CDN de Playwright no estuvo disponible en el entorno local. Se ejecutaron las mismas pruebas con una instalación temporal de Chromium 153; no se añadió ese navegador al proyecto. En GitHub Actions se usa la instalación estándar de Playwright. El workflow publica el informe si hay fallos y no despliega.

## Límites de la verificación

No se ingresó con una cuenta real de Firebase, no se verificaron reglas remotas ni el registro de ventas de producción. La revisión local de permisos valida la política de claims y el bloqueo del mecanismo anterior; la configuración del servidor exige validación del administrador antes de publicar.

El recorrido de los 25 módulos verifica renderizado y ausencia de errores JavaScript, no cada posible combinación financiera de los simuladores. Las reglas históricas de descuentos, comisiones y concurso requieren confirmación comercial. No hubo correos enviados ni registros financieros modificados.

## Regresiones de la revisión final

- Marisol: 1 venta en Jardines y una sola fila con USD 11.200 en Incentivos. Sin bono con la regla individual actual.
- Coincidencias candidatas: fecha 09/10/2026, Los Jardines, importe USD; un monto numéricamente igual en Bs no coincide.
- Gmail: se interceptó la apertura del borrador en CRM, Incentivos y Campañas; los tres generan exactamente un CC a supervisión. No se enviaron correos.
- Outlook: prueba de la política compartida; conserva copias operativas, elimina la copia de supervisión y evita duplicar el destinatario.
- Recorrido de las vistas previas de correo de los 25 módulos: sin tokens de saludo pendientes, tratamientos repetidos, undefined, NaN ni artefactos de separadores.
- Concordancia singular/plural de seguro y reenvío; redacción profesional y tratamiento de usted en las plantillas auditadas.
- ESLint, 20 pruebas unitarias y build aprobados. Navegación: 10 pruebas aprobadas.

La publicación del portal vigente está autorizada, pero el destino de alojamiento y una cuenta de Firebase habilitada todavía no están identificados/verificados. La vista previa privada es independiente y no acredita un inicio de sesión de Firebase en producción.

## Consistencia de las cuatro vistas en USD

- Verificación de USD 17.700 realizados, USD 47.600 proyectados, USD 65.300 de cierre proyectado y USD 111.000 de meta.
- Las cuatro vistas muestran 1 venta y USD 11.200 para Marisol.
- Editar proyección y posibles lotes cambia solo el escenario proyectado; la colocación e Incentivos siguen con ventas realizadas.
- Una venta de prueba añadida a un Provider aislado actualiza las cuatro vistas. Repetir su identificador/contrato no duplica el conteo ni el importe.
- Una simulación de Incentivos no altera Seguimiento ni la colocación semanal.
- El registro único rechaza moneda distinta de USD, importes inválidos, asesores desconocidos y ventas proyectadas como realizadas.

Las referencias iniciales en Bs fueron sustituidas por USD tras confirmación expresa de supervisión. No se usó TC para cambiar la magnitud de los importes.

## Moneda de premios corregida

ESLint, 20 pruebas unitarias, build y las 10 pruebas de navegador aprobados. La regresión de Incentivos verifica premios de 700 Bs. y 1.100 Bs., bono cero en Bs. y colocación conservada en USD. Se revisaron los importes de bonos en los correos HTML y texto sin enviarlos.

## Saludos y Recursos Humanos

21 pruebas unitarias y 11 pruebas de navegador aprobadas, además de ESLint y build. Saludo compartido por primer nombre sin títulos ni apellidos; RRHH usa «Estimado Ulrich». La nueva regresión verifica HTML y texto copiado de los cinco módulos: alta CRM, renuncia, evaluación, postulante y memorándum. El recorrido de los 25 módulos rechaza «Estimado/a» y títulos en los saludos. No se enviaron correos.
