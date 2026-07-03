import { createClient, type Client } from "@libsql/client";

/**
 * Cliente único do banco (Turso / libsql) — source of truth do catálogo e de
 * todo o conteúdo editável do site (ADR-0021, supersede ADR-0004/0005 no ponto
 * "JSON versionado como armazenamento de produção").
 *
 * Lê `TURSO_DATABASE_URL` (+ `TURSO_AUTH_TOKEN` quando `libsql://`). Para dev
 * offline aceita também `file:./data/ella.db`. NUNCA usar em middleware (edge
 * runtime) — só em Server Components, Route Handlers e scripts (Node runtime).
 */

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error(
    "TURSO_DATABASE_URL não configurado. Defina em .env.local (local) e nas Environment Variables da Vercel (produção).",
  );
}

declare global {
  // eslint-disable-next-line no-var
  var __ellaDbClient: Client | undefined;
}

/**
 * Reaproveita a conexão entre hot-reloads do `next dev` (evita esgotar conexões
 * durante o desenvolvimento). Em produção cria uma única instância no módulo.
 */
export const db: Client =
  globalThis.__ellaDbClient ?? createClient({ url, authToken });

if (process.env.NODE_ENV !== "production") {
  globalThis.__ellaDbClient = db;
}
