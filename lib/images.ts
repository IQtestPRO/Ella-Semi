import sharp from "sharp";
import { db } from "./db";

/**
 * Armazenamento de imagens enviadas pelo /admin (ADR-0022 — upload livre).
 *
 * A foto vem do celular/PC da Ellen, é normalizada (auto-orientação por EXIF,
 * redimensionada para caber em MAX_DIM, convertida para WebP) e guardada como
 * BLOB na tabela `images` do Turso. É servida pela rota pública
 * /api/images/[id]. Assim funciona em produção (Vercel read-only no FS) sem
 * depender de bucket externo, e a Ellen não precisa configurar nada.
 */

const MAX_DIM = 1600;
const WEBP_QUALITY = 82;

export type SavedImage = {
  id: string;
  url: string;
  width: number;
  height: number;
  mime: string;
};

export async function saveImage(
  input: Buffer | Uint8Array,
  alt = "",
): Promise<SavedImage> {
  const { data, info } = await sharp(input)
    .rotate() // aplica orientação EXIF (fotos de celular vêm deitadas)
    .resize({
      width: MAX_DIM,
      height: MAX_DIM,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });

  const id = crypto.randomUUID();
  await db.execute({
    sql: `INSERT INTO images (id, mime, bytes, width, height, alt, criadoEm)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      "image/webp",
      new Uint8Array(data),
      info.width,
      info.height,
      alt,
      new Date().toISOString(),
    ],
  });

  return {
    id,
    url: `/api/images/${id}`,
    width: info.width,
    height: info.height,
    mime: "image/webp",
  };
}

export async function getImage(
  id: string,
): Promise<{ bytes: Uint8Array; mime: string } | null> {
  const rs = await db.execute({
    sql: "SELECT mime, bytes FROM images WHERE id = ? LIMIT 1",
    args: [id],
  });
  if (rs.rows.length === 0) return null;
  const row = rs.rows[0];
  const raw = row.bytes as ArrayBuffer | Uint8Array;
  const bytes = raw instanceof Uint8Array ? raw : new Uint8Array(raw);
  return { bytes, mime: row.mime as string };
}

export async function deleteImage(id: string): Promise<void> {
  await db.execute({ sql: "DELETE FROM images WHERE id = ?", args: [id] });
}

/** Extrai o id de uma URL /api/images/<id> (ou null se não for uma). */
export function imageIdFromUrl(url: string): string | null {
  const m = url.match(/^\/api\/images\/([^/?#]+)/);
  return m ? m[1] : null;
}
