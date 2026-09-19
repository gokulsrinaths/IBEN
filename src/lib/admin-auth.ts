import "server-only";

/** Signed-cookie session for the single-operator admin area. Uses Web
 * Crypto (not Node's `crypto` module) so the same code runs in both
 * Edge middleware and Node route handlers with no extra dependency. */
export const ADMIN_COOKIE = "iben_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function getSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || null;
}

export async function createSessionToken(): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const payload = base64url(
    new TextEncoder().encode(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })),
  );
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${base64url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const secret = getSecret();
  if (!secret || !token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  try {
    const key = await getKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlToBytes(signature) as BufferSource,
      new TextEncoder().encode(payload),
    );
    if (!valid) return false;
    const { exp } = JSON.parse(new TextDecoder().decode(base64urlToBytes(payload)));
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

/** Constant-time-ish password check: normalizes both sides to the same
 * length before comparing so a length mismatch alone can't short-circuit. */
export function checkPassword(input: string, expected: string): boolean {
  const a = new TextEncoder().encode(input.padEnd(expected.length, "\0"));
  const b = new TextEncoder().encode(expected.padEnd(input.length, "\0"));
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0 && input.length === expected.length;
}

/** Guard for /api/admin/* route handlers, in addition to middleware. */
export async function requireAdmin(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE}=([^;]+)`));
  return verifySessionToken(match?.[1]);
}
