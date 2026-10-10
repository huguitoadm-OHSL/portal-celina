// Estas claims deben asignarse exclusivamente con Firebase Admin en un entorno confiable.
export function isAuthorizedClaims(claims) {
  return claims?.portalAccess === true || claims?.admin === true;
}
