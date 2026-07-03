import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  SETTINGS_SCHEMAS,
  setSetting,
  type SettingKey,
} from "../../../../lib/settings";

export const runtime = "nodejs";

export async function PUT(req: NextRequest) {
  let body: { key?: string; value?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const key = body.key as SettingKey;
  if (!key || !(key in SETTINGS_SCHEMAS)) {
    return NextResponse.json(
      { error: `Configuração desconhecida: ${String(body.key)}` },
      { status: 400 },
    );
  }

  try {
    await setSetting(key, body.value as never);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos.", detalhes: e.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erro ao salvar." },
      { status: 500 },
    );
  }
}
