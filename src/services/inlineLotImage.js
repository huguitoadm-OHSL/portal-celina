export const CREDIT_IMAGE_MARKER = '__CELINA_CREDIT_LOT_IMAGE__';
export function validInlineLotImage(value) {
  return typeof value === 'string' && value.length <= 2100000 && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value);
}

