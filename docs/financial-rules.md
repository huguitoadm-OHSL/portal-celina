# Reglas financieras V4

## Moneda y fuente única

El 10/10/2026, supervisión confirmó expresamente que todos los importes comerciales están en **USD**: colocación realizada, proyecciones, objetivo y seguimiento. Esta confirmación sustituye las etiquetas Bs del requerimiento inicial, sin multiplicar ni convertir los valores.

Inicio, Proyección Semanal, Seguimiento e Incentivos consumen el mismo registro de ventas realizadas mediante `CommercialProvider`. Cantidad e importe actual se derivan de ese registro; ninguna vista mantiene otra copia editable de la colocación realizada. Las proyecciones se almacenan por separado.

| Asesor | Actual USD | Proyección USD | Total proyectado USD |
| --- | ---: | ---: | ---: |
| Carlos Enrique Calderon | 6.500 | 5.000 | 11.500 |
| Jimmy Gonzales | 0 | 8.000 | 8.000 |
| Ely Gonzales Garcia | 0 | 7.500 | 7.500 |
| Jaime F. Rios Castro | 0 | 6.600 | 6.600 |
| Marisol Urgel Pizarro | 11.200 | 6.000 | 17.200 |
| Merly Mendez Hurtado | 0 | 7.500 | 7.500 |
| Jose Gabriel Padilla | 0 | 7.000 | 7.000 |
| **TOTAL** | **17.700** | **47.600** | **65.300** |

Meta USD 111.000. Brecha proyectada USD 45.700. Cumplimiento proyectado: 65.300 / 111.000 × 100 = 58,828828… %, mostrado 58,83 %. Avance realizado: 15,95 %. Los cálculos suman centavos para evitar errores de coma flotante.

## Ventas realizadas y posibles ventas

- Carlos: antecedente de 1 venta en Cañaveral y USD 6.500 para octubre. Se conserva sin inventar una fecha o identificador de contrato.
- Marisol: 1 venta reportada por supervisión en Los Jardines, ingresada el 09/10/2026, USD 11.200. Sustituye la referencia inicial de El Renacer. Ya está incluida una sola vez en USD 17.700.
- Ventas realizadas: 2 lotes. Jardines 1 y Cañaveral 1.
- Proyección independiente: 7 lotes (Muyurina 0, El Renacer 4, Rancho Nuevo 1, Jardines 2). No representan operaciones cerradas. No se recibió distribución diaria o asignación por asesor/proyecto.

El registro compartido acepta únicamente estados realizados/confirmados/reportados y moneda USD. Rechaza identificadores o contratos duplicados y datos incompatibles. Los reintentos idénticos no incrementan lotes ni colocación. Si el antecedente no tiene contrato y una nueva fila podría representar la misma operación, se exige conciliación antes de incorporarla. Un registro proyectado no puede incorporarse como realizado.

El estado es local a la sesión, sin persistencia financiera ni conexión al CRM. Una futura integración debe alimentar esta fuente, conservando identificadores y operaciones históricas; no debe actualizar las vistas individualmente.

## Incentivos y seguimiento

| Regla | Comportamiento |
| --- | --- |
| Incentivos septiembre/octubre | 2 ventas realizadas **o** USD 15.000; carpetas al día; productividad grupal 60 %. |
| Incentivos noviembre | 2 ventas realizadas **o** USD 18.000; productividad grupal 65 %. |
| Incentivos desde diciembre | 2 ventas realizadas **o** USD 21.000; productividad grupal 70 %. |
| Seguimiento/comisiones | Umbral heredado USD 18.000. Es una regla separada, no se sustituye por el umbral de Incentivos. |

Marisol tiene 1 venta y USD 11.200: no alcanza la regla individual vigente. Las proyecciones, aunque superen el umbral, nunca califican. El escenario opcional editable de Incentivos se marca como SIMULACIÓN y no modifica el registro de ventas ni los otros módulos. Los valores monetarios del simulador se presentan en USD conforme a la instrucción de supervisión; no se liquida ni paga un bono automáticamente.

## Tipo de cambio: exclusivamente simulaciones de descuentos

1 USD = Bs 11,73 para el 10 y 11/10/2026 en America/La_Paz. Fuera de esa excepción se conserva la base heredada de 12, pendiente de revisión comercial. `getExchangeRate(fecha, tcHistorico)` prioriza el TC contractual explícito y positivo; los descuentos/liquidaciones conservan la tasa histórica suministrada. `convertUsdToBs` redondea a centavos.

Los reportes de gestión e Incentivos no convierten los importes ni aplican TC a sus umbrales. Se retiraron las equivalencias y el indicador de TC de Inicio y del encabezado general. La conversión se muestra en las simulaciones de descuentos para el cliente, incluido el descuento de liquidación al contado.

## Conciliación de Marisol, solo lectura

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

También se acepta `amount: 11200, currency: "USD"`. Una cifra numéricamente igual en Bs no coincide con USD 11.200. El extracto solo detecta coincidencias candidatas; no certifica la identidad de una operación remota ni permite escribir contratos.
