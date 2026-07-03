import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateCampanha } from "../../../../lib/catalog/admin";

export const runtime = "nodejs";

export async function PUT(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }
  try {
    const campanha = await updateCampanha(body as never);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, campanha });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos.", detalhes: e.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erro ao salvar campanha." },
      { status: 500 },
    );
  }
}
