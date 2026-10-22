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

Corte de supervisión del 22/10/2026: 5 ventas, USD 78.705 realizados. Jaime: 1 lote en El Renacer, cerrado el 18/10/2026, USD 5.700, confirmado por supervisión. Semana 19–25/oct: 4 lotes posibles, USD 24.200. Total proyectado USD 102.905, objetivo USD 111.000, brecha USD 8.095 y cumplimiento 92,71 %. Los USD 5.700 que Jaime proyecta para el 24/oct son una oportunidad distinta del cierre del 18/oct; no cuentan como otra venta realizada. Las cuatro vistas comparten los cierres; premios en Bs.

**Importación:** Seguimiento de Ventas → Cargar ventas desde Excel. Primera hoja .xlsx, hasta 5 MB / 1.000 filas. Encabezados: Urbanización, Vendedor, Fecha de Venta, Precio al Contado. Opcionales: Contrato, Lotes, Moneda y Estado. Vista previa, validación del lote completo y confirmación explícita. Coincidencias se omiten; identificadores contradictorios requieren conciliación. Solo USD y ventas realizadas de octubre de 2026. Los archivos no se envían a terceros.

Las importaciones confirmadas se guardan en este navegador y actualizan Inicio, Proyección, Seguimiento e Incentivos; persisten al recargar, sin CRM ni sincronización entre dispositivos. Conservar el Excel como respaldo. La edición de posibles ventas sigue siendo de sesión.

TC 11,75 vigente desde 22/10/2026 en America/La_Paz hasta nueva instrucción. Se conservan el 11,68 de 16–21/oct, el 11,73 de 10–11/oct y los contratos históricos; conversión solo en simulaciones para el cliente. Ver [reglas y conciliación](docs/financial-rules.md).

El simulador de incentivos conserva su regla original en USD y se identifica como simulador independiente. No debe usarse para liquidar bonos sin conciliar moneda, ventas y carpetas. No se han convertido proyecciones en operaciones cerradas.

## Documentación

- [Cambios, alcance y condiciones de entrega](docs/V4-DELIVERY.md)
- [Reglas financieras y datos pendientes](docs/financial-rules.md)
- [Pruebas y limitaciones](docs/validation.md)
- [Evaluación de IA opcional](docs/ai-evaluation.md)

### Copias de correo

Gmail añade exclusivamente una copia a `ohsaravia@celina.com.bo`. Outlook no añade la copia automática de supervisión y conserva las copias operativas. Abrir el cliente prepara un borrador; el portal no envía mensajes.

## Correo de descuento a crédito

Solo la modalidad Crédito utiliza el modelo remitido el 22/oct: dato para el sistema (precio de lista, equivalente informativo y precio nuevo por m²), proyecto/UV/manzano/lote, descuento fijo y total, equivalencia con TC vigente, captura opcional y firma del asesor. Se conservan las plantillas de contado y liquidación y sus cálculos. La captura se carga localmente (PNG/JPG/WebP, hasta 1,5 MB), se vincula al lote seleccionado y no se almacena ni se envía automáticamente. «Copiar formato» prepara HTML y texto. Si el cliente de correo elimina la imagen al pegar, adjuntarla manualmente. Gmail y Outlook conservan sus reglas de copia; no hay envío automático.

## Entrega del 22/oct: solo GitHub

Por instrucción del propietario, esta actualización se entrega en la rama feat/actualizacion-oct22-credito y su pull request, sin publicación ni fusión a main. vercel.json desactiva la creación automática de despliegues para esta rama concreta; no modifica otras plataformas o proyectos. Para publicar más adelante se requiere una nueva instrucción.
