export const formatCurrency = (val) => {
  const numericVal = Number(val) || 0;
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numericVal);
};

export const formatVacio = (val) => val === 0 ? '-' : formatCurrency(val);
export const formatDias = (val) => val === 0 ? '-' : formatCurrency(val);

export const obtenerSaludoTiempo = () => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return 'Buenos días';
  if (hora >= 12 && hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

export const formatDiaMes = (fechaIso, sumarDias = 0) => {
  if (!fechaIso) return `Día ${sumarDias + 1}`;
  const partes = String(fechaIso).split('-');
  if (partes.length !== 3) return `Día ${sumarDias + 1}`;
  const date = new Date(Date.UTC(partes[0], partes[1] - 1, partes[2])); 
  date.setDate(date.getDate() + sumarDias);
  const dia = date.getDate();
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const mes = meses[date.getMonth()];
  if (!mes) return `Día ${sumarDias + 1}`; 
  return `${dia}-${mes}`;
};

