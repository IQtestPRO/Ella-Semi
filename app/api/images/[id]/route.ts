import { getImage } from "../../../../lib/images";

export const runtime = "nodejs";

/** Serve uma imagem enviada pela Ellen (público). Cache imutável: cada upload
 *  gera um id novo, então a URL nunca muda de conteúdo. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const img = await getImage(id);
  if (!img) {
    return new Response("Imagem não encontrada", { status: 404 });
  }
  return new Response(img.bytes as BodyInit, {
    headers: {
      "Content-Type": img.mime,
      // s-maxage: CDN da Vercel cacheia no edge — o Turso é consultado uma
      // única vez por imagem; depois serve instantâneo. Ids são imutáveis.
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
