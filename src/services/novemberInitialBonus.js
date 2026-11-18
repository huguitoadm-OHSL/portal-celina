/** Anexo III · Campaña de noviembre 2026.
 * Los tramos y bonos son importes en USD; el incremento se mide en
 * puntos porcentuales respecto a la cuota inicial parametrizada.
 * El cálculo es informativo: no autoriza aplicación ni acumulación.
 */
export const CUOTA_INCREMENT_BONUSES_USD=Object.freeze([
 Object.freeze([100,170,270,400,500,600]),
 Object.freeze([150,250,400,600,750,900]),
 Object.freeze([200,330,530,800,1000,1200]),
]);
export const CUOTA_INCREMENT_RANGES=Object.freeze(['3 a 5,99 p.p.','6 a 7,99 p.p.','8 o más p.p.']);
export const PRICE_RANGES=Object.freeze(['Hasta 7.500','7.501 a 15.000','15.001 a 22.500','22.501 a 30.000','30.001 a 45.000','Más de 45.000']);
export function bonusForIncreasedInitial(priceUsd,incrementPoints) {
 const p=Number(priceUsd), delta=Number(incrementPoints);
 if(!Number.isFinite(p)||p<=0||!Number.isFinite(delta)||delta<0) throw new Error('Datos financieros inválidos');
 const priceIndex=p<=7500?0:p<=15000?1:p<=22500?2:p<=30000?3:p<=45000?4:5;
 const row=delta>=8?2:delta>=6?1:delta>=3?0:-1;
 return {bonusUsd:row<0?0:CUOTA_INCREMENT_BONUSES_USD[row][priceIndex],priceIndex,row,eligible:row>=0};
}
