import { formatCurrency, formatDiaMes, obtenerSaludoTiempo } from './formatters';
import { NOMBRES_PROYECTOS_PROYECCION } from '../constants/proyectos'; // Solo si mueves la proyección aquí

export const generarHtmlFisico = (formFisico, supervisorData) => {
  const { saludo, titulo } = supervisorData;
  return `
  <div style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 800px; line-height: 1.5; text-align: left;">
    <p style="margin-bottom: 5px; color: #333333;">${obtenerSaludoTiempo()}</p>
    <p style="margin-top: 0; margin-bottom: 25px; color: #333333;">${saludo} ${titulo},</p>
    <p style="margin-bottom: 20px; color: #333333;">Por medio de la presente, solicito el cambio de contrato digital a f&iacute;sico para el siguiente cliente:</p>
    <ul style="margin-bottom: 20px; list-style-type: none; padding-left: 0; color: #333333;">
      <li style="margin-bottom: 5px;">- <strong>Nombre del Cliente:</strong> ${formFisico.nombre || '[Nombre]'}</li>
      <li style="margin-bottom: 5px;">- <strong>N&uacute;mero de Carnet (CI):</strong> ${formFisico.ci || '[CI]'}</li>
      <li style="margin-bottom: 5px;">- <strong>N&uacute;mero de Contrato:</strong> ${formFisico.contrato || '[Nro Contrato]'}</li>
    </ul>
    <p style="margin-bottom: 5px; color: #333333;"><strong>Motivo de la solicitud:</strong></p>
    <p style="margin-bottom: 20px; color: #333333;">${formFisico.motivo || '[Describa el motivo...]'}</p>
    <p style="margin-bottom: 25px; color: #333333;">Quedo atento a la confirmaci&oacute;n.</p>
    <p style="margin-top: 0; margin-bottom: 2px; color: #333333;">Saludos cordiales,</p>
    <p style="margin-top: 0; font-weight: bold; color: #333333;">${formFisico.asesor || '[Nombre del Asesor]'}</p>
  </div>`;
};

// HAZ LO MISMO CON EL RESTO DE TUS FUNCIONES generarHtml...
// 1. Exporta la constante: export const generarHtmlRecompra = (formRecompra, supervisorData, beneficio) => { ... }
// 2. Extrae las variables necesarias al principio de la función.
// 3. Retorna el string con las template literals (` `) exactamente como lo tenías.
