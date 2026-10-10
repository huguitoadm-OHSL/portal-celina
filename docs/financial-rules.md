# Conciliación financiera

## Referencia de supervisión: 10/10/2026

| Asesor | Actual Bs | Proyección Bs | Total Bs |
| --- | ---: | ---: | ---: |
| Carlos Enrique Calderon Montano | 6.500 | 5.000 | 11.500 |
| Jimmy Gonzales Nuñez | 0 | 8.000 | 8.000 |
| Ely Gonzales Garcia | 0 | 7.500 | 7.500 |
| Jaime Fabricio Rios Castro | 0 | 6.600 | 6.600 |
| Marisol Urgel Pizarro | 11.200 | 6.000 | 17.200 |
| Merly Mendez Hurtado | 0 | 7.500 | 7.500 |
| Jose Gabriel Padilla Loayza | 0 | 7.000 | 7.000 |
| Total | 17.700 | 47.600 | 65.300 |

Meta: Bs 111.000. Brecha: 111.000 − 65.300 = Bs 45.700. Cumplimiento proyectado: 65.300 / 111.000 × 100 = 58,828828… %, mostrado como 58,83 %. Avance actual: 15,95 %.

7 lotes proyectados: Muyurina 0; El Renacer 4; Rancho Nuevo 1; Jardines 2. No se recibió distribución diaria ni asignación por asesor. Se muestra el agregado por separado; no se han inventado registros diarios.

## Historial y TC

| Fuente encontrada | Valor anterior | Tratamiento V4 |
| --- | ---: | --- |
| `config.js`, `calcularDescuento` y textos | 12,00 | Base heredada fuera de la excepción. No acredita vigencia de todos los contratos anteriores. |
| `DescuentosCampanas.jsx` | 11,97 | Valor contradictorio archivado en esta auditoría; nuevas cotizaciones consultan la fuente central. No se encontraron fechas de vigencia en el código. |
| `LiquidacionContado.jsx` | 6,97 | Era un valor inicial de formulario vacío, no una operación histórica. Las nuevas simulaciones sugieren TC vigente; el campo contractual permanece editable. |
| Directiva del supervisor/gerencia | 11,73 | 10 y 11/10/2026 en Bolivia, inclusive. |
| Esquemas promocionales heredados | 8,40 / 9,60 / 10,80 | Tasas promocionales propias de otro esquema; se conservan y no se confunden con TC base. Requieren revisión de política antes de unificar descuentos. |

`getExchangeRate(fecha, tcHistorico)` da prioridad a un TC contractual explícito y positivo. `convertUsdToBs` redondea a centavos. Ningún registro financiero existente se recalculó. La vigencia cambia al cruzar medianoche en Bolivia y se refresca al volver al portal.

## Productividad: políticas distintas encontradas

| Módulo | Regla heredada | Decisión |
| --- | --- | --- |
| Incentivos septiembre/octubre | 2 ventas **o** USD 15.000; carpetas al día; productividad grupal 60 % | Conservar regla y simulador en USD, sin introducir importes en Bs como si fueran USD. |
| Seguimiento de ventas | Colocación ≥ 18.000 para clasificación; etiqueta de moneda ausente | Conservar umbral y señalar moneda pendiente de confirmación. No unificarlo con Incentivos. |
| Correo de proyección semanal | Marcaba productividad por proyección ≥ 25.000 | Retirar el distintivo del correo: una proyección no certifica productividad. |

USD 15.000 × 11,73 = Bs 175.950. Esta equivalencia no redefine la regla de incentivos, ni demuestra que la colocación de referencia sea la misma magnitud comercial exigida por el concurso.

## Marisol: preparación y conciliación, sin registrar

Referencia: Marisol Urgel Pizarro; El Renacer; 1 lote; Bs 11.200; 10/10/2026. El monto está incluido una única vez en Bs 17.700.

El repositorio contiene datos estáticos y una inicialización de Firebase sin consultas de ventas. Por ello no es posible afirmar que la operación existe o falta en el CRM. El dashboard acepta un extracto JSON con este formato:

```json
[
  {
    "advisor": "Marisol Urgel Pizarro",
    "project": "El Renacer",
    "date": "2026-10-10",
    "amountBs": 11200,
    "lots": 1,
    "contractId": "IDENTIFICADOR_VERIFICABLE"
  }
]
```

Se identifican coincidencias candidatas por nombre normalizado, proyecto, fecha, importe y cantidad. El registro definitivo requiere identificador único, cliente, UV/manzano/lote, comprobante y estado de validación. El extracto no se sube ni se persiste. Una lista vacía no demuestra ausencia en el CRM completo. No existe un botón para confirmar ni escribir la venta sin autorización.
