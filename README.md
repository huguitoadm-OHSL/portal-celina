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

Corte de supervisión del 16/10/2026: 4 ventas, USD 73.005 realizados; fin de semana 17–18/oct, 3 lotes y USD 20.420 proyectados. Total USD 93.425, objetivo USD 111.000, brecha USD 17.575 y cumplimiento 84,17 %. Carlos: USD 13.925 y 2 ventas. Marisol: USD 59.080 y 2 ventas. El nuevo detalle corrige su venta de USD 11.200 a El Renacer sin duplicarla; la nueva venta es Muyurina, USD 47.880. Las cuatro vistas comparten un registro; proyecciones separadas de cierres e incentivos en Bs.

**Importación:** Seguimiento de Ventas → Cargar ventas desde Excel. Primera hoja .xlsx, hasta 5 MB / 1.000 filas. Encabezados: Urbanización, Vendedor, Fecha de Venta, Precio al Contado. Opcionales: Contrato, Lotes, Moneda y Estado. Vista previa, validación del lote completo y confirmación explícita. Coincidencias se omiten; identificadores contradictorios requieren conciliación. Solo USD y ventas realizadas de octubre de 2026. Los archivos no se envían a terceros.

Las importaciones confirmadas se guardan en este navegador y actualizan Inicio, Proyección, Seguimiento e Incentivos; persisten al recargar, sin CRM ni sincronización entre dispositivos. Conservar el Excel como respaldo. La edición de posibles ventas sigue siendo de sesión.

TC 11,68 vigente desde 16/10/2026 en America/La_Paz hasta nueva instrucción. Se conservan el 11,73 de 10–11/oct y los contratos históricos; conversión solo en simulaciones para el cliente. Ver [reglas y conciliación](docs/financial-rules.md).

El simulador de incentivos conserva su regla original en USD y se identifica como simulador independiente. No debe usarse para liquidar bonos sin conciliar moneda, ventas y carpetas. No se han convertido proyecciones en operaciones cerradas.

## Documentación

- [Cambios, alcance y condiciones de entrega](docs/V4-DELIVERY.md)
- [Reglas financieras y datos pendientes](docs/financial-rules.md)
- [Pruebas y limitaciones](docs/validation.md)
- [Evaluación de IA opcional](docs/ai-evaluation.md)

### Copias de correo

Gmail añade exclusivamente una copia a `ohsaravia@celina.com.bo`. Outlook no añade la copia automática de supervisión y conserva las copias operativas. Abrir el cliente prepara un borrador; el portal no envía mensajes.
