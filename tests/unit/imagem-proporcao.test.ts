// @vitest-environment node
import { describe, expect, it } from "vitest";
import sharp from "sharp";
import { recortarNaProporcao } from "../../lib/imagem-proporcao";

/**
 * O card de categoria é 4:5 em pé. A Ellen vai mandar foto do celular (9:16),
 * print (16:9) ou quadrada do Instagram — e o card não pode esticar a joia nem
 * cortar fora do assunto. Aqui o corte é feito no upload, uma vez.
 */
async function png(w: number, h: number) {
  return sharp({
    create: { width: w, height: h, channels: 3, background: "#e8d8c8" },
  })
    .png()
    .toBuffer();
}

describe("recortarNaProporcao", () => {
  it("deixa foto deitada (16:9) na proporção do card", async () => {
    const out = await recortarNaProporcao(await png(1920, 1080), 4 / 5);
    const m = await sharp(out).metadata();
    expect(m.width! / m.height!).toBeCloseTo(0.8, 2);
  });

  it("deixa foto de celular (9:16) na proporção do card", async () => {
    const out = await recortarNaProporcao(await png(1080, 1920), 4 / 5);
    const m = await sharp(out).metadata();
    expect(m.width! / m.height!).toBeCloseTo(0.8, 2);
  });

  it("deixa foto quadrada na proporção do card", async () => {
    const out = await recortarNaProporcao(await png(1200, 1200), 4 / 5);
    const m = await sharp(out).metadata();
    expect(m.width! / m.height!).toBeCloseTo(0.8, 2);
  });

  it("não estica: a imagem que já está 4:5 sai igual de proporção", async () => {
    const out = await recortarNaProporcao(await png(800, 1000), 4 / 5);
    const m = await sharp(out).metadata();
    expect(m.width! / m.height!).toBeCloseTo(0.8, 2);
  });

  it("devolve WebP (formato do site)", async () => {
    const out = await recortarNaProporcao(await png(1000, 700), 4 / 5);
    const m = await sharp(out).metadata();
    expect(m.format).toBe("webp");
  });

  it("respeita outra proporção quando pedida (ex.: 16:9 do topo)", async () => {
    const out = await recortarNaProporcao(await png(1000, 1000), 16 / 9);
    const m = await sharp(out).metadata();
    expect(m.width! / m.height!).toBeCloseTo(16 / 9, 2);
  });
});
