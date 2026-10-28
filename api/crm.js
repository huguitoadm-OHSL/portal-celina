// Endpoint obsoleto del prototipo multiusuario. No recibe datos del módulo privado.
export default function handler(request, response) {
  response.setHeader("Cache-Control", "private, no-store");
  return response
    .status(503)
    .json({
      error:
        "El prototipo multiusuario está retirado. Inteligencia privada procesa los reportes en tu navegador.",
    });
}
