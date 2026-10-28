> DOCUMENTO HISTÓRICO DEL PROTOTIPO MULTIUSUARIO. Sustituido por [Inteligencia privada](INTELIGENCIA-PRIVADA.md) tras la decisión de uso exclusivo del propietario. Las cuentas individuales, SQLite y el bloqueo por falta de identidad descritos aquí ya no definen el módulo actual.

# Modelo, permisos y definiciones CRM

## Modelo lógico y correspondencia del prototipo

| Entidad | Identidad / relación | Implementación local |
| --- | --- | --- |
| Cliente | UUID + identidad normalizada única, nombre, contacto | Tabla clients, restricción UNIQUE de identidad |
| Oportunidad | UUID, clientId, ownerId, teamId, proyecto, origen, USD estimado, etapa, versión | Tabla opportunities; varias oportunidades por cliente |
| Asesor | ID individual, equipo, rol, activo | Directorio sintético fijo del servidor; real pendiente |
| Actividad | UUID, oportunidad, actor, instante, tipo, resultado, contacto efectivo | activities append-only |
| Tarea | UUID, oportunidad, fecha Bolivia, tipo, estado, resultado al completar | tasks; actividad vinculada al completar |
| Historial etapa/asignación | Actor, fecha, etapa y responsable | history append-only, sin borrar eventos anteriores |
| Referencia de cotización | UUID, oportunidad, referencia original, lote, proyecto, actor, fecha | quotes, no cálculo ni copia del motor financiero |
| Compromiso | UUID, texto, fecha pactada, estado, evidencia y fecha de cumplimiento | commitments |
| Visita | UUID, actividad o tarea origen, fecha de realización, resultado | visits; tareas tipo Visita para agenda |
| Objeción | UUID, texto, estado, evidencia de resolución, actor | objections |
| Motivo de pérdida | Texto obligatorio al pasar a pérdida | lossReason, cambios conservados en auditoría |
| Cierre verificado | Contrato único global, fuente/evidencia, USD, fecha oficial, verificador | verifiedClose; no inferido de etapa |
| Auditoría | UUID, oportunidad, acción, actor, instante, snapshot antes/después | audit; sin endpoint para editar o borrar |
| Meta | Asesor + periodo, objetivos de captación, tareas, referencias, visitas, ventas, USD | targets con historial de cambios |

El agregado usa transacciones BEGIN IMMEDIATE con rollback de cliente, oportunidad y auditoría si falla la operación. Las ediciones exigen la versión leída para evitar pérdida silenciosa de cambios. La deduplicación usa identidad, no similitud de nombres. Para una identidad ya conocida que no pertenece a la cartera, se solicita conciliación sin exponer sus datos.

En Firestore deben separarse los eventos en colecciones/subcolecciones y hacerse consultas autorizadas; no copiar esta representación de SQLite literalmente.

## Permisos aplicados en el servidor local

| Rol | Lectura | Escritura | Reasignación y metas | Verificar cierre |
| --- | --- | --- | --- | --- |
| Asesor | Solo oportunidades propias y clientes vinculados; su auditoría y metas | Solo cartera propia | No | No |
| Supervisor | Oportunidades del equipo asignado | Equipo asignado | Dentro de su equipo | No |
| Gerencia | Lectura global autorizada en esta prueba de un equipo | No | No | No |
| Administración | Global en la prueba | Sí | Sí | Sí, evidencia y contrato obligatorio |
| Sin identidad | Ninguna | No | No | No |

La sesión compartida del Portal NO es una identidad CRM. En el entorno local una cookie aleatoria HttpOnly y SameSite Strict dura una hora y referencia una identidad sintética almacenada en servidor. Solo se aceptan host localhost/127.0.0.1:5173 y POST de mismo origen, con cuerpo limitado a 16 KiB. No se permite rol/owner arbitrario desde el navegador. En producción `/api/crm` está deshabilitado con 503. La cookie local HTTP no es adecuada para producción; esta ruta no se incluye en el build ni en las funciones de Vercel.

## Definiciones comerciales

- **Captación:** oportunidades creadas en el periodo; no personas únicas. **Clientes nuevos únicos:** clientes distintos con alta en el periodo y vinculados al segmento autorizado; separados del conteo de oportunidades.
- **Cartera abierta:** oportunidades cuya etapa no es Cierre declarado ni Cierre perdido, independientemente del periodo de captación.
- **Valor estimado:** suma USD registrada por el asesor para cartera abierta; no es ingreso ni importe recalculado por el Engine.
- **Cierres declarados:** oportunidades actualmente en Cierre declarado y fecha de declaración del periodo. Permanecen sin verificación hasta conciliación administrativa.
- **Venta verificada del periodo:** cierre con contrato y evidencia, fecha oficial dentro del periodo. Se separa la fecha de verificación.
- **Conversión de cohorte:** oportunidades captadas en el periodo que tienen cierre verificado con fecha oficial hasta la fecha de observación / todas las oportunidades de esa misma cohorte. Devuelve N/D sin denominador. No es tasa de cohortes maduras ni predicción.
- **Actividad:** eventos registrados en el periodo. Las visitas completadas se cuentan por fecha de realización. Las referencias de cotización se cuentan por registro manual, no por emisión verificada en OMNI.
- **Cumplimiento de tareas:** tareas con fecha pactada en el periodo y completadas / tareas con fecha pactada en el periodo. Una tarea tardía puede estar completada; no equivale a cumplimiento puntual.
- **Primera respuesta fuera de 24h:** oportunidades de cohorte sin contacto efectivo dentro de 24h; el indicador incluye las pendientes vencidas. La primera respuesta se compara en milisegundos con el alta; para pendientes se usa el instante de observación.
- **Vencimiento:** tarea pendiente con fecha menor a hoy en America/La_Paz. Hoy usa igualdad. Las alertas no se reinician al cambiar el mes. La agenda incluye tareas y compromisos pendientes de todos los periodos.
- **Riesgo de abandono:** siete días sin contacto efectivo (o desde alta si nunca hubo contacto), evaluado con fecha comercial. No equivale a pérdida confirmada.
- **Calidad:** cinco comprobaciones binarias de proyecto, origen, responsable, contacto efectivo y próxima tarea para oportunidades abiertas. Se muestra como completitud operacional provisional, no certifica exactitud del dato.
- **Metas:** valor definido por supervisor/administración para asesor y mes. Cero o ausencia no genera un porcentaje ficticio. No se copian las cuotas del dashboard legado.

Los filtros de asesor, proyecto y etapa delimitan los registros antes del cálculo. El periodo delimita resultados; no oculta vencimientos anteriores. Comparaciones de metas bajo filtros de proyecto/etapa reflejan solo ese segmento frente al objetivo total del asesor; para evaluar el objetivo general se deben usar Todos/Todas.

## Índice de avance (0–100)

Regla provisional por señales observadas en la bitácora:

| Señal | Puntos |
| --- | --- |
| Contacto efectivo registrado | +15 |
| Al menos una referencia de cotización vinculada | +20 |
| Al menos una visita completada | +25 |
| Al menos un compromiso cumplido con evidencia | +25 |
| Al menos una próxima gestión registrada | +15 |
| Al menos una tarea pendiente vencida | −20 |
| Al menos una objeción pendiente | −10 |

Suma limitada a 0–100. La ficha muestra los sumandos aplicados. No añade puntos por múltiples llamadas repetidas y no convierte etapas declaradas en probabilidad. Una oportunidad cerrada puede conservar señales históricas; el índice no demuestra que esté ganada. Un compromiso vencido genera alerta, aunque todavía no tenga una penalización de puntaje. La referencia de cotización es declarada y requiere contraste en OMNI.

## Recuperación y escalamiento

La base local se guarda en `.crm-local/synthetic.sqlite`, excluida de git. Cerrar el proceso y copiar la base es un respaldo local de prueba; la producción necesita estrategia de recuperación, acceso restringido y comprobación de restauración. No migrar esta base de pruebas a producción. No hay eliminación ni cambio arbitrario de clientes en V1; correcciones, fusiones, reapertura de ventas verificadas, cancelación/reprogramación con motivo y políticas de retención son trabajo posterior documentado.
