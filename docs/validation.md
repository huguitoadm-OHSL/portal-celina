# Validación de la rama V4

## Ejecución local

- ESLint: sin errores ni advertencias.
- Pruebas unitarias: 13 aprobadas (autorización, totales, centavos, coincidencias, saludos, escape HTML, correos, TC y frontera de medianoche en Bolivia).
- Compilación Vite: correcta; 25 vistas con carga diferida.
- Pruebas de navegador: 6 aprobadas en Chromium 153, incluyendo recorrido de los 25 módulos, temas persistentes y automático, viewport 390 × 844, vista previa de CRM con intento de inyección, sanitización de estilos remotos, conciliación y rechazo de la antigua bandera de acceso.
- Compilación servida con `vite preview`: exige login y no expone el botón de revisión local.
- Inspección visual de capturas del portal real en claro, oscuro y móvil.

La descarga de Chromium desde el CDN de Playwright no estuvo disponible en el entorno local. Se ejecutaron las mismas pruebas con una instalación temporal de Chromium 153; no se añadió ese navegador al proyecto. En GitHub Actions se usa la instalación estándar de Playwright. El workflow publica el informe si hay fallos y no despliega.

## Límites de la verificación

No se ingresó con una cuenta real de Firebase, no se verificaron reglas remotas ni el registro de ventas de producción. La revisión local de permisos valida la política de claims y el bloqueo del mecanismo anterior; la configuración del servidor exige validación del administrador antes de publicar.

El recorrido de los 25 módulos verifica renderizado y ausencia de errores JavaScript, no cada posible combinación financiera de los simuladores. Las reglas históricas de descuentos, comisiones y concurso requieren confirmación comercial. No hubo correos enviados ni registros financieros modificados.
