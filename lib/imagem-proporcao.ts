import sharp from "sharp";

/**
 * Recorta uma foto na proporção exata de onde ela vai aparecer (ADR-0030).
 *
 * O card de categoria é 4:5 em pé. A foto que a Ellen manda vem do celular
 * (9:16), de print (16:9) ou quadrada do Instagram. Sem este passo, ou a joia
 * estica, ou o CSS corta por conta própria em lugar imprevisível.
 *
 * `position: "attention"` deixa o sharp escolher o recorte pela região de maior
 * contraste/detalhe — numa foto de joia, é a joia. É o mesmo critério usado nas
 * capas de categoria geradas no Higgsfield.
 */
const LARGURA_MAX = 1400;
const QUALIDADE = 86;

export async function recortarNaProporcao(
  entrada: Buffer | Uint8Array,
  proporcao: number,
): Promise<Buffer> {
  const base = sharp(entrada).rotate(); // respeita EXIF (foto de celular deitada)
  const meta = await base.metadata();

  const largura = Math.min(meta.width ?? LARGURA_MAX, LARGURA_MAX);
  const altura = Math.round(largura / proporcao);

  return base
    .resize(largura, altura, { fit: "cover", position: "attention" })
    .webp({ quality: QUALIDADE })
    .toBuffer();
}
