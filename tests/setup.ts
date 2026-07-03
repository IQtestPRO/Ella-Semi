import "@testing-library/jest-dom/vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Carrega .env.local para os testes que tocam o banco (catalog é DB-backed —
// ADR-0021). Só preenche variáveis ainda não definidas no ambiente.
if (!process.env.TURSO_DATABASE_URL) {
  try {
    const raw = readFileSync(resolve(".env.local"), "utf-8");
    for (const line of raw.split(/\r?\n/)) {
      if (!line || line.startsWith("#") || !line.includes("=")) continue;
      const i = line.indexOf("=");
      const k = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim();
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {
    // sem .env.local — testes de banco serão pulados/falham com mensagem clara
  }
}
