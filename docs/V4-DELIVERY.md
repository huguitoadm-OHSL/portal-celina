# Entrega V4.0

## Implementación

- Tema claro/oscuro/automático persistente, actualización al cambiar preferencia del dispositivo y tolerancia a almacenamiento bloqueado.
- Tokens de superficies, texto y bordes aplicados a todas las vistas; paleta azul/turquesa; tipografía del sistema, contraste y foco visible; tablas con desplazamiento móvil y movimientos reducidos.
- Dashboard ejecutivo: búsqueda y orden de asesores, tarjetas de resultados, cumplimiento, distribución de proyectos, historial de TC y conciliación de Marisol.
- Fuente central de referencia: 7 asesores, colocación Bs 17.700, proyección Bs 47.600 y meta Bs 111.000.
- Proyección semanal: importes en Bs; la proyección total se puede editar sin inventar fechas diarias ni atribuir lotes a asesores. Al editar un importe diario, se usa la suma diaria como nueva proyección; al editar el total semanal, se reinicia la distribución diaria. Los cambios son simulaciones en memoria.
- Correos: sustitución de tokens una sola vez, saludos con hora de Bolivia, corrección de redundancias/gramática, escape de variables, sanitización HTML y copia con manejo de errores. Vista previa también en Incentivos y Campañas. Abrir el cliente de correo continúa siendo una acción manual; no existe envío automático.
- TC: vigencia comercial centralizada; excepción de fin de semana; TC histórico explícito tiene prioridad. Campañas, utilidades de descuento, textos y liquidación consultan esa configuración para nuevas simulaciones.
- Corrección del conteo por proyecto en Seguimiento: Cañaveral se sumaba dos veces. La venta de Carlos se conserva como antecedente de la versión anterior; Marisol se identifica como pendiente de conciliación.
- Carga diferida de los 25 módulos y límite de errores por módulo. Navegación extraída fuera del render para evitar remontajes.
- Tailwind compilado localmente, sin CDN ni descarga de tipografías; package-lock reparado; workflow de verificación sin despliegue y con permisos de lectura.
- Firebase Auth reemplaza contraseña pública y bandera local. Claims de acceso verificadas, cierre de sesión y ausencia del bypass local en producción.

## Capturas del portal real

Las capturas corresponden a la ejecución local de esta rama, con los datos de referencia. No representan un despliegue.

![Modo claro](previews/portal-light.png)
![Modo oscuro](previews/portal-dark.png)
![Móvil](previews/portal-mobile.png)

## Pendientes antes de publicar

1. Administrador de Firebase: habilitar proveedor, dominios y claims para las cuentas autorizadas. No se probó una cuenta real ni se inspeccionaron reglas desplegadas. No fusionar hasta completar esa configuración.
2. Supervisor/CRM: aportar extracto verificable y contrato de Marisol; confirmar cliente, UV, manzano, lote, comprobante y estado. No hay endpoint de ventas utilizado por el código heredado.
3. Gerencia: confirmar base vigente fuera del 10–11/10 y cómo se relacionan los umbrales de productividad/comisiones. Los simuladores mantienen esquemas anteriores distintos de contado y crédito, sin sustituir políticas comerciales.
4. Revisión de negocio: probar escenarios de contratos reales en los simuladores de amortización, consolidación y recálculo. Las pruebas de navegación verifican carga y continuidad; no certifican todas las reglas contractuales posibles.

No hubo cambios en `main`, despliegue, escritura de ventas definitivas, envío de correos ni llamadas a proveedores de IA.
