import { NextResponse, type NextRequest } from "next/server";
import { saveImage, deleteImage } from "../../../../lib/images";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

/** Upload de imagem (protegido pelo middleware). Recebe multipart `file`. */
export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Envio inválido." }, { status: 400 });
  }

  const file = form.get("file");
  const alt = (form.get("alt") as string | null)?.toString() ?? "";

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Nenhum arquivo enviado." },
      { status: 400 },
    );
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "O arquivo precisa ser uma imagem." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Imagem muito grande (máx. 15 MB)." },
      { status: 400 },
    );
  }

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const saved = await saveImage(buf, alt);
    return NextResponse.json(saved);
  } catch (e) {
    return NextResponse.json(
      { error: "Não foi possível processar a imagem." },
      { status: 500 },
    );
  }
}

/** Remove uma imagem por id (?id=...). */
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id ausente." }, { status: 400 });
  }
  await deleteImage(id);
  return NextResponse.json({ ok: true });
}
