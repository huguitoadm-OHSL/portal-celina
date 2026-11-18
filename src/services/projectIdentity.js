// Normalización exclusivamente para presentación, conciliación y búsqueda.
// No cambia contratos, importes ni asientos; evita barras duplicadas en Seguimiento.
const clean = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');
export function canonicalProjectName(value) {
 const raw=String(value ?? '').trim();
 const key=clean(raw).replace(/^celina\s+/,'').replace(/^(el|los)\s+/,'');
 if(key === 'renacer') return 'Renacer';
 if(key === 'jardines' || key === 'jardines del bosque') return 'Jardines';
 if(key === 'muyurina') return 'Muyurina';
 return raw;
}
export const projectIdentity = value => clean(canonicalProjectName(value));
