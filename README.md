# Portal Celina V4.0

Aplicación React 19 + Vite para gestión comercial inmobiliaria. Los 25 módulos existentes se conservan. Esta rama introduce temas claro, oscuro y automático; dashboard en bolivianos; correos seguros; tipo de cambio con vigencia y pruebas automatizadas.

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

## Acceso

Se eliminó la contraseña incrustada y la autorización por bandera en localStorage. La versión compilada exige Firebase Authentication y una claim booleana `portalAccess: true` o `admin: true`, asignada por Firebase Admin en un entorno confiable. Habilitar Email/Password, dominio autorizado y cuentas aprobadas **antes de fusionar o publicar**. No se crea automáticamente ningún usuario ni permiso.

En desarrollo (`npm run dev`) hay un botón **Vista de revisión local**, sin acceso a operaciones remotas. El botón y el bypass se eliminan de la compilación de producción. Las reglas de Firebase y el acceso al CRM requieren revisión del administrador; el repositorio no contiene reglas desplegadas ni un servicio de registro de ventas. Los archivos estáticos de una web no se vuelven confidenciales por mostrar una pantalla de login.

## Datos y condiciones financieras

El dashboard y la proyección semanal usan la referencia entregada por supervisión el 10/10/2026. No son una lectura del CRM. Bs 11.200 de Marisol ya están incluidos en Bs 17.700; no se ha registrado ninguna venta nueva. La conciliación de un extracto JSON ocurre en memoria y solo muestra coincidencias candidatas.

El TC gerencial 11,73 aplica únicamente el 10 y 11 de octubre de 2026, en `America/La_Paz`. Fuera del intervalo se conserva la base heredada 12,00; confirmar su siguiente vigencia con gerencia. Para contratos previos, especificar el TC pactado. Ver [reglas y conciliación](docs/financial-rules.md).

El simulador de incentivos conserva su regla original en USD y se identifica como simulador independiente. No debe usarse para liquidar bonos sin conciliar moneda, ventas y carpetas. No se han convertido proyecciones en operaciones cerradas.

## Documentación

- [Cambios, alcance y condiciones de entrega](docs/V4-DELIVERY.md)
- [Reglas financieras y datos pendientes](docs/financial-rules.md)
- [Pruebas y limitaciones](docs/validation.md)
- [Evaluación de IA opcional](docs/ai-evaluation.md)
