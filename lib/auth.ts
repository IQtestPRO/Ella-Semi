/**
 * Autenticação do /admin — sessão por cookie HMAC-assinado.
 *
 * EDGE-SAFE de propósito: usa só Web Crypto (`crypto.subtle`), nenhum import
 * de Node ou do banco, para poder rodar TAMBÉM no middleware (edge runtime).
 *
 * Credenciais e segredo vêm de env vars (.env.local / Vercel):
 *   ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET.
 */

export const SESSION_COOKIE = "ella_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias

const enc = new TextEncoder();

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const bin = atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) {
    throw new Error("SESSION_SECRET não configurado (.env.local / Vercel).");
  }
  return s;
}

async function hmac(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return new Uint8Array(sig);
}

/** Comparação de bytes em tempo constante. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

type SessionPayload = { u: string; exp: number };

/** Cria um token de sessão assinado para `username`. */
export async function createSession(username: string): Promise<string> {
  const payload: SessionPayload = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = b64urlEncode(enc.encode(JSON.stringify(payload)));
  const sig = b64urlEncode(await hmac(body));
  return `${body}.${sig}`;
}

/** Verifica o token; retorna o username se válido e não expirado, senão null. */
export async function verifySession(
  token: string | undefined | null,
): Promise<string | null> {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  let expected: Uint8Array;
  try {
    expected = await hmac(body);
  } catch {
    return null;
  }
  if (!timingSafeEqual(b64urlDecode(sig), expected)) return null;
  try {
    const payload = JSON.parse(
      new TextDecoder().decode(b64urlDecode(body)),
    ) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000) {
      return null;
    }
    return payload.u ?? null;
  } catch {
    return null;
  }
}

/** Confere usuário/senha contra as env vars, em tempo constante. */
export async function verifyCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedUser || !expectedPass) return false;
  // Compara hashes pra não vazar comprimento e rodar em tempo constante.
  const [uA, uB, pA, pB] = await Promise.all([
    hmac(`u:${username}`),
    hmac(`u:${expectedUser}`),
    hmac(`p:${password}`),
    hmac(`p:${expectedPass}`),
  ]);
  return timingSafeEqual(uA, uB) && timingSafeEqual(pA, pB);
}
