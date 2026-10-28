// Fail closed: la contraseña compartida del Portal no autoriza carteras CRM.
export default function handler(request, response) {
  response.setHeader("Cache-Control", "private, no-store");
  response.setHeader("Vercel-CDN-Cache-Control", "no-store");
  return response
    .status(503)
    .json({
      error:
        "CRM pendiente de almacenamiento persistente y autenticación individual. No habilitado para datos reales.",
    });
}
