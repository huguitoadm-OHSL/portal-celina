import { formatCurrency, formatDiaMes, obtenerSaludoTiempo } from './formatters';

export const generarTextoRecompraCelular = (formRecompra, supervisorData, beneficio) => {
  const { saludo, nombrePila } = supervisorData;
  return `👋 ${obtenerSaludoTiempo()}\n${saludo} ${nombrePila},\n\nPor favor su ayuda con el código de pago por recompra de este cliente:\n\n*🆕 CONTRATO NUEVO*\n🏢 Agencia: ${formRecompra.sucursal || '-'}\n📅 Venta: ${formRecompra.fechaVentaNuevo || '-'}\n👤 Nombre: ${formRecompra.nombreNuevo || '-'}\n📄 Contrato: ${formRecompra.contratoNuevo || '-'}\n🏷️ Aplicó Descuento: ${formRecompra.aplicoDescuento}\n💵 Cuotas Pagadas: ${formRecompra.cuotasPagadas}\n✅ Procesado: ${formRecompra.procesadoNuevo}\n🟢 Vigente: ${formRecompra.vigenteNuevo}\n\n*🕰️ CONTRATO ANTIGUO*\n👤 Nombre: ${formRecompra.nombreAntiguo || '-'}\n📄 Contrato: ${formRecompra.contratoAntiguo || '-'}\n📅 Venta: ${formRecompra.fechaVentaAntiguo || '-'}\n💰 Fecha Pago: ${formRecompra.fechaPago || '-'}\n✅ Procesado: ${formRecompra.procesadoAntiguo}\n🟢 Vigente: ${formRecompra.vigenteAntiguo}\n🤝 Patrocinador: ${formRecompra.patrocinador || '-'}\n\n*💵 VALOR CUOTA: $ ${formRecompra.valorCuota || '0'}*\n*🎁 BENEFICIO: $ ${beneficio}*\n\nSaludos cordiales,\n*${formRecompra.asesor || 'Asesor'}*`;
};

export const generarTextoDescuentoCelular = (formDescuento, supervisorData, calculos) => {
  const { vc, descuentoTotal, descuentoTexto, nuevoPrecioTotal, nuevoPrecioM2, porcentajeCuota } = calculos;
  const { saludo, titulo } = supervisorData;
  const nomProyecto = formDescuento.proyecto === 'OTRO...' ? (formDescuento.proyectoManual || 'PROYECTO MANUAL') : formDescuento.proyecto;
  let condicionTexto = formDescuento.modalidad === 'Crédito' ? `con cuota inicial del ${formatCurrency(porcentajeCuota)}% venta a plazos` : `venta al contado`;
  const catStr = formDescuento.categoria ? String(formDescuento.categoria).toUpperCase() : '';
  
  const requiereAutorizacion = formDescuento.modalidad === 'Crédito' && porcentajeCuota >= 1.5 && porcentajeCuota < 5;
  const badgeText = requiereAutorizacion ? `\n🚨 *REQUIERE AUTORIZACIÓN: Bajada de Cuota Inicial al 1.5% (Categoría Calle)*\n` : '';

  return `👋 ${obtenerSaludoTiempo()}\n${saludo} ${titulo},${badgeText}\nPor favor le solicito la aplicación del descuento de la campaña vigente del proyecto *${nomProyecto}*:\n\n*📌 DATOS DEL LOTE*\n📐 Superficie: ${formDescuento.m2 || '0'} m²\n💵 Precio M2 Normal: $ ${formatCurrency(formDescuento.precioM2 || 0)}\n💰 *Precio Original: $ ${formatCurrency(vc)}*\n\n*🏷️ APLICACIÓN DE CAMPAÑA*\n✅ Condición: ${descuentoTexto} ${condicionTexto}\n🔥 *Descuento Total: -$ ${formatCurrency(descuentoTotal)}*\n\n*✨ PRECIO FINAL PROMOCIÓN ✨*\n➡️ *Precio Final: $ ${formatCurrency(nuevoPrecioTotal)}*\n➡️ *Precio M2 Final: $ ${formatCurrency(nuevoPrecioM2)}*\n\n*📍 UBICACIÓN*\nUV: ${formDescuento.uv || 'SN'} | MZN: ${formDescuento.manzano || '---'} | LT: ${formDescuento.lote || '---'}\n${catStr ? `🏢 Categoría: ${catStr}\n` : ''}\nQuedo atento a su aprobación para continuar con el proceso de venta.\n\nSaludos cordiales,\n*${formDescuento.asesor || 'Nombre del Asesor'}*`;
};

export const generarTextoCuotaCelular = (formCuota, supervisorData) => {
  const { saludo, titulo } = supervisorData;
  return `👋 ${obtenerSaludoTiempo()}\n${saludo} ${titulo},\n\nPor favor su autorización para proceder con la anulación y reingreso del siguiente contrato para incrementar su cuota inicial:\n\n*👤 DATOS DEL CLIENTE*\n👤 Cliente: ${formCuota.cliente || '---'}\n📄 Nro. Contrato: ${formCuota.nroContrato || '---'}\n🪪 CI: ${formCuota.ci || '---'}\n📍 Ubicación: ${formCuota.proyecto} | UV ${formCuota.uv || '-'} | MZN ${formCuota.manzano || '-'} | LOTE ${formCuota.lote || '-'}\n\n*💰 INCREMENTO*\n📉 Cuota Registrada: $ ${formatCurrency(formCuota.cuotaInicial || 0)}\n📈 *NUEVA CUOTA: $ ${formatCurrency(formCuota.nuevaCuota || 0)}*\n\n*📝 OBSERVACIONES*\n${formCuota.motivo || '---'}\n\nQuedo atento a su aprobación.\n\nSaludos,\n*${formCuota.asesorVentas || 'Asesor'}*`;
};

export const generarTextoSeguroCelular = (formSeguro, supervisorData) => {
  const { saludo, nombrePila } = supervisorData;
  const cant = formSeguro.beneficiarios.length;
  let lista = "";
  formSeguro.beneficiarios.forEach((b, i) => {
    lista += `\n*Beneficiario ${i+1}:*\n👤 Nombre: ${b.nombre || '---'}\n👥 Parentesco: ${b.parentesco || '---'}\n📊 Porcentaje: ${b.porcentaje ? b.porcentaje + '%' : '---'}\n🪪 CI: ${b.ci || '---'}\n`;
  });

  return `👋 ${obtenerSaludoTiempo()}\n${saludo} ${nombrePila},\n\nPor favor tu ayuda adicionando a estos ${cant} beneficiarios al seguro de vida:\n\n*📄 DATOS DEL CONTRATO*\n👤 Cliente: ${formSeguro.cliente || '---'}\n📑 Contrato: ${formSeguro.nroContrato || '---'}\n📍 UV: ${formSeguro.uv || 'SN'} | MZN: ${formSeguro.manzano || 'SN'} | LOTE: ${formSeguro.lote || 'SN'}\n\n*📋 LISTA DE BENEFICIARIOS*${lista}\nMuchísimas gracias.\n\nSaludos,\n*${formSeguro.asesor || 'Asesor'}*`;
};

export const generarTextoFisicoCelular = (formFisico, supervisorData) => {
  const { saludo, titulo } = supervisorData;
  return `👋 ${obtenerSaludoTiempo()}\n${saludo} ${titulo},\n\nSolicito el cambio de contrato digital a físico para el siguiente cliente:\n\n*👤 DATOS DEL CLIENTE*\n👤 Nombre: ${formFisico.nombre || '---'}\n🪪 CI: ${formFisico.ci || '---'}\n📄 Contrato: ${formFisico.contrato || '---'}\n\n*📝 MOTIVO*\n${formFisico.motivo || '---'}\n\nQuedo atento a la confirmación.\n\nSaludos,\n*${formFisico.asesor || 'Asesor'}*`;
};

export const generarTextoReenvioCelular = (formReenvio, supervisorData) => {
  const { saludo, nombrePila } = supervisorData;
  let lista = "";
  formReenvio.contratos.forEach((c, i) => {
    lista += `\n*Contrato ${i+1}:*\n📄 Nro: ${c.nroContrato || '---'}\n👤 Cliente: ${c.cliente || '---'}\n🪪 CI: ${c.ci || '---'}\n📍 UV: ${c.uv || 'SN'} | MZN: ${c.manzano || '-'} | LT: ${c.lote || '-'}\n`;
  });

  return `👋 ${obtenerSaludoTiempo()}\n${saludo} ${nombrePila},\n\nSolicito tu apoyo habilitando nuevamente el envío del correo para la firma digital del proyecto *${formReenvio.proyecto.toUpperCase()}* debido a un error involuntario del cliente.\n\n*📋 CONTRATOS AFECTADOS:*${lista}\nQuedo atento a tu confirmación.\n\nSaludos,\n*${formReenvio.asesor || 'Asesor'}*`;
};

export const generarTextoLlamadaCelular = (formLlamada) => {
  return `👋 ${obtenerSaludoTiempo()}\nEstimada Olivia,\n\nPor favor su ayuda con la validación de llamada de este cliente referido, solicita que lo llamen a las *${formLlamada.horaLlamada || '[HORA]'}*:\n\n*🗣️ REFERIDO*\n👤 Nombre: ${formLlamada.nombreReferido || '---'}\n📄 Contrato: ${formLlamada.contratoReferido || '---'}\n📱 Celular: ${formLlamada.celularReferido || '---'}\n\n*🎁 BENEFICIARIA*\n👤 Nombre: ${formLlamada.nombreBeneficiario || '---'}\n🪪 CI: ${formLlamada.ciBeneficiario || '---'}\n\nSaludos cordiales,\n*${formLlamada.asesor || 'Asesor'}*`;
};

export const generarTextoRenunciaCelular = (formRenuncia) => {
  return `👋 ${obtenerSaludoTiempo()} estimado Ulrich,\n\nPor medio del presente, te hago entrega formal de la carta de renuncia de la Sra./Sr. *${formRenuncia.nombre || '[Nombre]'}*, quien se desempeñaba como *${formRenuncia.cargo || 'Asesor de Ventas'}* desde el pasado ${formRenuncia.fechaIngreso || '[Fecha]'}.\n\nEn su nota, con fecha ${formRenuncia.fechaRenuncia || '[Fecha]'}, la/el asesor/a comunica que su retiro se debe a ${formRenuncia.motivo || '[motivos...]'}. Adjunto el documento escaneado para que se proceda con el trámite correspondiente en el departamento de Recursos Humanos.\n\nQuedo atento a cualquier requerimiento adicional para cerrar este proceso.\n\nSaludos cordiales,\n*${formRenuncia.asesor || 'Oscar Saravia'}*`;
};

export const generarTextoAltaCRMCelular = (formAltaCRM) => {
  return `👋 ${obtenerSaludoTiempo()}\nEstimado Ulrich,\n\nPor medio de la presente, solicito por favor la gestión para la creación del usuario de acceso a los sistemas *CRM y CESI* para el nuevo asesor comercial que se están integrando a mi equipo.\n\nA continuación, detallo los datos personales requeridos de cada uno, basados en sus fichas de ingreso:\n\n*Nombre:* ${formAltaCRM.nombre || '-'}\n*Apellido Paterno:* ${formAltaCRM.apPaterno || '-'}\n*Apellido Materno:* ${formAltaCRM.apMaterno || '-'}\n*Carnet de Identidad:* ${formAltaCRM.ci || '-'}\n*Fecha de Nacimiento:* ${formAltaCRM.fechaNacimiento || '-'}\n*Correo Electrónico:* ${formAltaCRM.correo || '-'}\n\nQuedo atento a la confirmación de las credenciales para poder facilitarle el acceso y que inicie sus gestiones lo antes posible.\nDe antemano, muchas gracias por tu colaboración.\n\nSaludos cordiales,\n*${formAltaCRM.asesor || 'Oscar Saravia'}*`;
};

export const generarTextoEvaluacionCelular = (formEvaluacion) => {
  return `👋 ${obtenerSaludoTiempo()}.\nEstimado Ulrich,\n\nEn respuesta a tu correo, adjunto el formulario de evaluación de desempeño debidamente completado del asesor de la sucursal Montero que acaba de finalizar su programa de aprendizaje.\n\nA continuación, comparto un resumen detallado de las observaciones y mis recomendaciones:\n\n*1. ${formEvaluacion.nombre || '[Nombre]'}*\n- *Punteo Total:* ${formEvaluacion.punteo || '0'} (${formEvaluacion.calificacion || 'Muy Bueno'})\n- *Resultados:* ${formEvaluacion.lotes || '0'} lotes vendidos ($${formatCurrency(formEvaluacion.monto)}), ${formEvaluacion.leads || '0'} leads y ${formEvaluacion.visitas || '0'} visitas.\n- *Observaciones y recomendación:* ${formEvaluacion.observaciones || '[Detalles]'}\n\nQuedo a su disposición ante cualquier consulta.\n\nSaludos cordiales,\n*${formEvaluacion.asesor || 'Oscar Hugo Saravia'}*`;
};

export const generarTextoPostulanteCelular = (formPostulante) => {
  return `👋 ${obtenerSaludoTiempo()}\nEstimado Ulrich,\n\nTe adjunto el formulario de entrevista de *${formPostulante.nombre || '[Nombre]'}* para el puesto de Asesor de Ventas. Él llega a nosotros como referido de la asesora ${formPostulante.referidor || '[Nombre]'}.\n\nDespués de realizarle la entrevista y evaluar su perfil, mi recomendación es que proceda. Me gustaría que lo puedan tomar en cuenta para pasarlo a la etapa de capacitación y así poder ir preparándolo para que se integre a la Máquina de Ventas aquí en la sucursal de Montero.\n\nEn el documento adjunto podrás ver el detalle completo de su experiencia, evaluación de competencias y el role play.\n\nCualquier consulta me avisas.\n\nSaludos cordiales,\n*${formPostulante.asesor || 'Oscar Saravia'}*`;
};

export const generarTextoAmortizacionCelular = (formAmortizacion, calculos) => {
  const { P, C_pura, n, S, C_total, precioFinalPlazos, P_actual, cuotasRestantesOrig, saldoNuevo, n_new, tiempoAhorrado, ahorrado, error } = calculos;
  if (error) return `⚠️ Error en simulación: ${error}`;
  
  const clienteStr = formAmortizacion.cliente ? `Estimado/a ${formAmortizacion.cliente},` : `Estimado/a cliente,`;
  return `👋 Buenas tardes,\n${clienteStr} te presento la simulación de tu abono extraordinario a capital (Sistema Francés):\n\n*📝 DATOS DEL CRÉDITO ORIGINAL*\nPrecio al Contado: $ ${formatCurrency(formAmortizacion.precioContrato)}\nCuota Inicial: $ ${formatCurrency(formAmortizacion.cuotaInicial)}\nCapital Financiado: $ ${formatCurrency(P)}\nPlazo Original: ${formAmortizacion.plazoOriginal || 0} años (${n} meses)\nPrecio Final a Plazos: $ ${formatCurrency(precioFinalPlazos)}\nCuota Mensual Fija (Pura): $ ${formatCurrency(C_pura)}\n\n*📊 SITUACIÓN ACTUAL*\nCuotas Pagadas: ${formAmortizacion.cuotasPagadas || 0} meses\nCuotas Restantes: ${cuotasRestantesOrig} meses\nSaldo Capital Actual: $ ${formatCurrency(P_actual)}\n\n*🚀 IMPACTO DE TU ABONO (De $ ${formatCurrency(formAmortizacion.montoAmortizacion)})*\nNuevo Saldo Capital: $ ${formatCurrency(saldoNuevo)}\nNuevas Cuotas Restantes: ${n_new} meses\nTiempo Ahorrado: ${tiempoAhorrado} meses\nAhorro Estimado: $ ${formatCurrency(ahorrado)}\n\nSi deseas proceder con este pago o tienes alguna duda, quedo a tu disposición.\n\nSaludos cordiales.`;
};

export const generarTextoProyeccionCelular = (formProyeccion, supervisorData) => {
  const { saludo, nombrePila } = supervisorData;
  let texto = `👋 ${obtenerSaludoTiempo()}\n${saludo} ${nombrePila},\n\nAdjunto el resumen del consolidado de proyección de ventas semanal del equipo.\n\n`;
  
  let sumColAct = 0;
  let sumTotalColMes = 0;

  if (formProyeccion && Array.isArray(formProyeccion.asesores)) {
    formProyeccion.asesores.forEach((asesor, i) => {
      const sumDias = Array.isArray(asesor.dias) ? asesor.dias.reduce((a, b) => a + (Number(b) || 0), 0) : 0;
      const colActualNum = Number(asesor.colAct) || 0;
      const totalColMes = colActualNum + sumDias;
      sumColAct += colActualNum;
      sumTotalColMes += totalColMes;
      
      if (colActualNum > 0 || sumDias > 0) {
        texto += `*${i+1}. ${asesor.nombre || ''}*\n`;
        texto += `   📈 Colocación Actual: $ ${formatCurrency(colActualNum)}\n`;
        texto += `   🎯 Proyección Semanal: $ ${formatCurrency(sumDias)}\n`;
        texto += `   🏁 Cierre de Mes: $ ${formatCurrency(totalColMes)}\n\n`;
      }
    });
  }

  const mesStr = new Date(formProyeccion.fechaInicio || new Date()).toLocaleString('es-ES', { month: 'long' });
  const capMes = mesStr.charAt(0).toUpperCase() + mesStr.slice(1);
  const objMensual = Number(formProyeccion.objetivoMensual) || 0;
  const porcentajeAvance = objMensual ? (sumColAct / objMensual) * 100 : 0;
  const porcentajeFin = objMensual ? (sumTotalColMes / objMensual) * 100 : 0;

  texto += `*📊 RESUMEN DEL EQUIPO*\n`;
  texto += `🎯 Objetivo ${capMes}: $ ${formatCurrency(objMensual)}\n`;
  texto += `📈 Colocación Actual: $ ${formatCurrency(sumColAct)} (${formatCurrency(porcentajeAvance)}%)\n`;
  texto += `🏁 Colocación Fin de Mes: $ ${formatCurrency(sumTotalColMes)} (${formatCurrency(porcentajeFin)}%)\n\n`;
  texto += `Saludos cordiales.`;

  return texto;
};

export const generarTextoDiariaCelular = (formDiaria, supervisorData) => {
  const { saludo, nombrePila } = supervisorData;
  let texto = `👋 ${obtenerSaludoTiempo()}\n${saludo} ${nombrePila},\n\nAdjunto el reporte de Proyección Diaria del equipo:\n\n`;
  let tVisitas = 0, tVentas = 0, tColocacion = 0;
  
  formDiaria.forEach((a, i) => {
    if (a.visita || a.venta || a.colocacion) {
      texto += `*${i+1}. ${a.nombre}*\nVisitas: ${a.visita||0} | Ventas: ${a.venta||0} | $: ${formatCurrency(a.colocacion)}\n\n`;
    }
    tVisitas += Number(a.visita)||0;
    tVentas += Number(a.venta)||0;
    tColocacion += Number(a.colocacion)||0;
  });
  
  texto += `*📊 TOTALES DEL DÍA:*\n📍 Visitas: ${tVisitas}\n🤝 Ventas: ${tVentas}\n💰 Colocación: $${formatCurrency(tColocacion)}\n\nSaludos cordiales.`;
  return texto;
};
export const generarTextoPendienteValidacion = (form) => {
  return `Buenas tardes Estimado Alex,\n\nPor favor su ayuda con la validación de llamada de este cliente, menciona que tendrá tiempo de contestar hoy a las ${form.horaLlamada || '[Hora]'}, por favor pido la ayuda de tu equipo para que la puedan llamar a esa hora:\n\nCliente sin validación:\n${form.cliente || '[Nombre]'} - Contrato: ${form.contrato || '[Contrato]'} - Celular: ${form.celular || '[Celular]'}\n\nSaludos cordiales,\n${form.asesor || 'Oscar Saravia'}`;
};

export const generarTextoBloqueoLote = (form) => {
  return `Buenos días estimado jefe,\n\nPor favor su ayuda necesito su autorización para realizar el bloqueo del lote ubicado en el Proyecto ${form.proyecto || '[Proyecto]'}:\n\nProyecto: ${form.proyecto}\nUV: ${form.uv} Manzano: ${form.manzano} Lote: ${form.lote}\nSuperficie: ${form.superficie} m2\nCategoría: ${form.categoria}\nCuota inicial referencial: $us ${form.cuotaInicial}\n\n${form.motivo}\n\nPor tal motivo, solicito se pueda proceder con el bloqueo del lote mencionado, a fin de resguardar la disponibilidad y evitar cruces comerciales.\n\nQuedo atento a su confirmación.\n\nSaludos cordiales,\n${form.asesor || 'Oscar Saravia'}`;
};

export const generarTextoMemorandum = (form) => {
  let asesoresTexto = "";
  form.asesores.forEach(a => {
    if(a.nombre) asesoresTexto += `- ${a.nombre}: Registra una colocación actual de ${a.colocacion}, lo cual representa una brecha crítica frente a su compromiso de ${a.compromiso}.\n`;
  });
  return `Buenas noches estimado Ulrich,\n\nMe dirijo a ti para solicitar formalmente la emisión de un memorándum de llamada de atención para asesores de mi equipo comercial. El motivo es el incumplimiento reiterado de sus métricas de ventas.\n\nDe acuerdo con el cierre de proyecciones y resultados del mes de ${form.mes || '[Mes]'}, el detalle de su rendimiento es el siguiente:\n\n${asesoresTexto}\nAdjunto a este correo el cuadro de proyección y seguimiento de metas de ${form.mes || '[Mes]'} como respaldo documental.\n\nAgradezco de antemano tu apoyo para gestionar estas llamadas de atención a la brevedad.\n\nSaludos cordiales,\n${form.asesor || 'Oscar Saravia'}`;
};
