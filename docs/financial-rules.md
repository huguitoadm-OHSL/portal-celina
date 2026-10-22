# Reglas financieras V4

## Corte vigente: 22/10/2026

Se conservan las cuatro ventas anteriores y se incorpora una sola venta de Jaime Fabricio Rios Castro: El Renacer, 18/10/2026, USD 5.700 y 1 lote. Proyecto y fecha fueron confirmados expresamente por supervisión durante la implementación. Identificador estable: supervision-jaime-2026-10-18. No se inventa contrato, cliente o ubicación del lote.

| Asesor | Ventas | Actual USD | Proyección 19–25/oct USD | Total USD |
| --- | ---: | ---: | ---: | ---: |
| Carlos | 2 | 13.925 | 5.000 | 18.925 |
| Jimmy | 0 | 0 | 0 | 0 |
| Ely | 0 | 0 | 7.500 | 7.500 |
| Jaime | 1 | 5.700 | 5.700 | 11.400 |
| Marisol | 2 | 59.080 | 0 | 59.080 |
| Merly | 0 | 0 | 0 | 0 |
| Jose | 0 | 0 | 6.000 | 6.000 |
| **Total** | **5** | **78.705** | **24.200** | **102.905** |

USD 111.000 de meta, USD 8.095 de brecha y 92,71 % proyectado; avance realizado 70,91 %. Viernes 23: Jose/El Renacer USD 6.000. Sábado 24: Carlos/Rancho Nuevo USD 5.000 y Jaime/El Renacer USD 5.700. Domingo 25: Ely/Jardines USD 7.500. Cuatro lotes posibles: Renacer 2, Rancho Nuevo 1 y Jardines 1. La proyección del 24/oct de Jaime no se convierte en una venta cerrada ni duplica su cierre del 18/oct.

TC 11,75 desde 22/10/2026, America/La_Paz, hasta nueva instrucción. Las fechas del 16 al 21 conservan 11,68; el 10 y 11 conservan 11,73. Siempre prevalece el TC contractual explícito. No se convierte la colocación ni los premios en Bs.

## Histórico: corte del 16/10/2026

Fuente: dos cuadros remitidos por supervisión. Ventas y colocación en USD; premios en Bs.

| Asesor | Ventas | Actual USD | Proyección 17–18/oct USD | Total USD |
| --- | ---: | ---: | ---: | ---: |
| Carlos Enrique Calderon Montano | 2 | 13.925 | 5.000 | 18.925 |
| Marisol Urgel Pizarro | 2 | 59.080 | 0 | 59.080 |
| Merly Mendez Hurtado | 0 | 0 | 7.920 | 7.920 |
| Jose Gabriel Padilla Loayza | 0 | 0 | 7.500 | 7.500 |
| Jimmy / Ely / Jaime | 0 | 0 | 0 | 0 |
| **Total** | **4** | **73.005** | **20.420** | **93.425** |

Meta USD 111.000; brecha USD 17.575; cumplimiento proyectado 84,17 %; avance actual 65,77 %. Carlos: Cañaveral 06/10 USD 6.500 y 13/10 USD 7.425. Marisol: El Renacer 09/10 USD 11.200 y Muyurina 16/10 USD 47.880. El extracto nuevo corrige la referencia previa de Los Jardines a El Renacer para la misma operación de USD 11.200; se conserva su ID y la procedencia de la corrección, sin sumarla de nuevo. La fecha desconocida de Carlos se completa con el extracto.

Tres lotes posibles: Jose/El Renacer el sábado 17 (USD 7.500), Carlos/Rancho Nuevo el domingo 18 (USD 5.000), Merly/Santa Fe el domingo 18 (USD 7.920). No son ventas cerradas.

TC 11,68 desde 16/10/2026 America/La_Paz, hasta nueva instrucción. Conservados TC 11,73 del 10–11/oct, base heredada de otras fechas y prioridad de TC contractual histórico. Solo simulaciones de descuentos.

### Importación de ventas

Seguimiento → Cargar ventas desde Excel. Primera hoja .xlsx, menos de 5 MB, hasta 1.000 filas. Columnas: Urbanización, Vendedor, Fecha de Venta, Precio al Contado; opcionales Contrato, Lotes, Moneda, Estado. Una venta/un lote por fila por defecto. Importes numéricos en USD o cadenas con separadores consistentes; fechas Excel, DD/MM/AAAA o ISO. Sin inferir ni convertir Bs. Se validan asesores y proyectos contra el equipo. Otra moneda, proyección, fecha inválida/fuera de octubre o contrato contradictorio bloquean el lote entero.

La vista previa no aplica cambios. Al confirmar se incorporan solo nuevas filas y se revalida contra el estado vigente. Coincidencias por contrato/ID o asesor+proyecto+fecha+importe+lotes se omiten preventivamente; no prueban identidad contractual. La referencia ya incluida nunca se suma otra vez. No hay correcciones o eliminaciones silenciosas. Se guardan solo las ventas importadas en localStorage bajo celina.sales.imports.v1; se concilian con la base al recargar y se preserva el respaldo si está corrupto. El fichero se procesa localmente, sin subirse a terceros. No hay CRM ni sincronización entre navegadores/dispositivos; conservar el Excel como respaldo. Las proyecciones editadas siguen siendo de sesión.

## Histórico: corte del 10/10/2026 (sustituido por el corte anterior)

### Moneda y fuente única

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

En el corte vigente Carlos y Marisol alcanzan 2 ventas individuales; no hay pago automático y la condición grupal sigue sin alcanzarse. En el corte histórico Marisol tenía 1 venta y USD 11.200. Las proyecciones, aunque superen el umbral, nunca califican. El escenario opcional editable de Incentivos se marca como SIMULACIÓN y no modifica el registro de ventas ni los otros módulos. La colocación y las ventas se expresan en USD. Los premios se expresan en bolivianos: Bs 700 en el nivel 110/60 y Bs 1.100 en el nivel 120/60; los totales de bonos y sus correos también se expresan en Bs. No se convierten estos premios con el tipo de cambio ni se liquida o paga un bono automáticamente.

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
