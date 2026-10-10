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

## Corrección de Marisol comunicada por supervisión

El 10/10/2026, supervisión corrigió el proyecto y la fecha del antecedente inicial: **Los Jardines, 1 lote, venta ingresada el 09/10/2026**. Para Incentivos indicó expresamente **USD 11.200**. Esta instrucción sustituye el antecedente anterior de El Renacer, 10/10/2026 y Bs 11.200 para la ficha de la operación.

- Seguimiento: Marisol muestra 1 venta; Jardines muestra 1 y Cañaveral conserva 1 de Carlos. Los siete lotes proyectados siguen separados y no se suman a estos cierres reportados.
- Incentivos: Marisol inicia con 1 venta y USD 11.200. Se mantienen los demás valores y reglas del simulador. Una venta y USD 11.200 no alcanzan 2 ventas ni USD 15.000, por lo que no se reconoce productividad ni bono automáticamente.
- El cuadro previo del dashboard/proyección continúa en Bs, con Bs 17.700 actuales. Se conserva su referencia original sin agregar otros 11.200 ni convertir el importe USD usando un TC supuesto. Supervisión debe conciliar la moneda del cuadro general antes de sustituir sus importes.
- El conteo representa la venta reportada por supervisión. No se escribió en el CRM ni se verificó un contrato remoto. Los cambios a formularios son simulaciones en memoria.

Ejemplo del extracto de lectura local para detectar coincidencias candidatas:

```json
[
  {
    "advisor": "Marisol Urgel Pizarro",
    "project": "Los Jardines",
    "date": "2026-10-09",
    "amountUsd": 11200,
    "lots": 1,
    "contractId": "ID_REAL_DEL_CRM"
  }
]
```

También se acepta `amount: 11200, currency: "USD"`. Un importe `amountBs: 11200` no coincide con USD 11.200. El resultado solo verifica posibles coincidencias en el extracto proporcionado; el identificador de contrato permite confirmar la identidad real de la operación.
