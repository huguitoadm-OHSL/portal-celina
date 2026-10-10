# Portal Celina V4.0

Aplicación React 19 + Vite para gestión comercial inmobiliaria. Los 25 módulos existentes se conservan. Esta rama introduce temas claro, oscuro y automático; dashboard en USD; correos seguros; tipo de cambio con vigencia y pruebas automatizadas.

## Ejecutar y verificar

Node.js 22.12+ (validado localmente con Node 24).

```bash
npm ci
npm run dev
npm run check
npx playwright install chromium
npm run test:e2e
```

`npm run check` ejecuta ESLint, pruebas unitarias y compilación. Las pruebas de navegador abren exclusivamente una vista de revisión local; no escriben en Firebase ni envían correos. `npm run build` genera `dist/` para revisión. No hay despliegue configurado en el workflow de verificación.

## Acceso personal en Vercel

El propietario confirmó uso individual. Se conserva el ingreso con una sola contraseña; no se requiere una cuenta Firebase. `middleware.js` protege el portal, los bundles y los archivos públicos antes de entregarlos. `/api/auth` valida la contraseña exclusivamente en el servidor y crea una cookie firmada de 8 horas, `HttpOnly`, `Secure` y `SameSite=Strict`. La bandera antigua en localStorage no concede acceso.

Configurar **`PORTAL_PASSWORD` como variable Sensitive** de Vercel en Production y Preview, con una contraseña nueva de 16–256 caracteres. No usar prefijos `VITE_`, no guardar la contraseña en GitHub ni archivos locales. El propietario introduce el valor directamente en Vercel. Si falta configuración, el despliegue bloquea el acceso; no hay contraseña predeterminada. Cambiar el secreto invalida las sesiones anteriores. Cerrar sesión elimina la cookie del navegador; una cookie sustraída previamente sigue siendo válida hasta su vencimiento o la rotación del secreto.

La API rechaza solicitudes POST de otros orígenes y limita intentos por instancia (10 cada 10 minutos). Este límite en memoria no es global: para protección distribuida, complementar con el Firewall de Vercel. No se crea una base de cuentas ni se escriben ventas en CRM. El botón de revisión existe únicamente en desarrollo y no se incluye en producción.

Antes de fusionar: configurar el secreto, verificar la vista previa de Vercel con la contraseña elegida, comprobar bloqueo de archivos sin sesión y validar ingreso/cierre de sesión. Vercel despliega Production al fusionar el PR en `main`. La vista previa de Sites permanece privada e independiente.

## Datos y condiciones financieras

Inicio, Proyección Semanal, Seguimiento e Incentivos usan un mismo registro de ventas realizadas y una misma colocación en USD. Supervisión confirmó que 17.700 actuales, 47.600 proyectados y 111.000 de objetivo están en dólares americanos. Marisol: Los Jardines, 1 venta del 09/10/2026, USD 11.200. Carlos conserva 1 venta en Cañaveral y USD 6.500; su fecha exacta no fue proporcionada. Las proyecciones nunca se suman a ventas realizadas ni califican para Incentivos.

La conversión a Bs se limita a las simulaciones de descuentos para el cliente. El estado compartido es de sesión; no existe conexión de ventas al CRM ni escritura remota. Agregar una venta en la fuente compartida actualiza las cuatro vistas; las operaciones definitivas requieren integración y autorización. El escenario editable de Incentivos está separado de los datos realizados.

El TC gerencial 11,73 aplica únicamente el 10 y 11 de octubre de 2026, en `America/La_Paz`. Fuera del intervalo se conserva la base heredada 12,00; confirmar su siguiente vigencia con gerencia. Para contratos previos, especificar el TC pactado. Ver [reglas y conciliación](docs/financial-rules.md).

El simulador de incentivos conserva su regla original en USD y se identifica como simulador independiente. No debe usarse para liquidar bonos sin conciliar moneda, ventas y carpetas. No se han convertido proyecciones en operaciones cerradas.

## Documentación

- [Cambios, alcance y condiciones de entrega](docs/V4-DELIVERY.md)
- [Reglas financieras y datos pendientes](docs/financial-rules.md)
- [Pruebas y limitaciones](docs/validation.md)
- [Evaluación de IA opcional](docs/ai-evaluation.md)

### Copias de correo

Gmail añade exclusivamente una copia a `ohsaravia@celina.com.bo`. Outlook no añade la copia automática de supervisión y conserva las copias operativas. Abrir el cliente prepara un borrador; el portal no envía mensajes.
