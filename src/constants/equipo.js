import { REFERENCE_ADVISORS } from './commercialReference';
// --- ESTRUCTURA DEL EQUIPO COMERCIAL ---
export const SUPERVISORES = [
  { id: 'mreyes', nombre: 'Mauricio Reyes Suarez', correo: 'mreyes@celina.com.bo', genero: 'M', titulo: 'Mauricio' },
  { id: 'ohsaravia', nombre: 'Oscar Hugo Saravia L.', correo: 'ohsaravia@celina.com.bo', genero: 'M', titulo: 'Oscar' },
  { id: 'rvaca', nombre: 'Robert Vaca', correo: 'rvaca@grupopaz.com.bo', genero: 'M', titulo: 'Lic. Robert' },
  { id: 'cbarretto', nombre: 'Charles Barretto', correo: 'cbarretto@celina.com.bo', genero: 'M', titulo: 'Ing. Charles' },
  { id: 'uklein', nombre: 'Ulrich Klein Montano', correo: 'uklein@grupopaz.com.bo', genero: 'M', titulo: 'Ulrich' },
  { id: 'mfroca', nombre: 'Maria Fernanda Roca Miranda', correo: 'mfroca@celina.com.bo', genero: 'F', titulo: 'Maria Fernanda' },
  { id: 'lbakovic', nombre: 'Lucio Bakovic', correo: 'lbakovic@grupopaz.com.bo', genero: 'M', titulo: 'Lucio' },
  { id: 'maguilar', nombre: 'Miguel Angel Aguilar A.', correo: 'maguilar@celina.com.bo', genero: 'M', titulo: 'Miguel Angel' },
  { id: 'madett', nombre: 'Mario Adett Zamora', correo: 'madett@grupopaz.com.bo', genero: 'M', titulo: 'Lic. Mario' },
  { id: 'ccastedo', nombre: 'Cristian Daniel Castedo Castedo', correo: 'ccastedo@celina.com.bo', genero: 'M', titulo: 'Cristian' },
  { id: 'vchoque', nombre: 'Verenice Choque', correo: 'vchoque@celina.com.bo', genero: 'F', titulo: 'Verenice' }
];

export const EQUIPOS_ASESORES = {
  "Oscar Saravia": REFERENCE_ADVISORS.map(a => ({ nombre: a.nombre, colAct: a.actualBs, tipo: 'Interno', ventas: a.referenceSales, source: 'Referencia de supervisión' }))
};

// Compatibilidad defensiva por nombre completo
EQUIPOS_ASESORES["Oscar Hugo Saravia L."] = EQUIPOS_ASESORES["Oscar Saravia"];

export const OBJETIVOS_MENSUALES = {
  "Oscar Saravia": 111000,
  "Oscar Hugo Saravia L.": 111000
};


