// Admin sessions.
//
// The old panel checked the password in an API route and then flipped a React
// state variable. Nothing server-side was protected: any POST to /api/admin/*
// went straight through. This replaces that with a signed, http-only cookie
// that `proxy.ts` verifies before the request reaches a route or a page.
//
// Web Crypto rather than node:crypto on purpose — proxy.ts runs on the Edge
// runtime, where node:crypto is not available. crypto.subtle works in both.

export const ADMIN_COOKIE = "admin_session";

// Long enough that Aditya is not retyping the password mid-session, short
// enough that a forgotten open tab on someone else's machine expires.
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

export function secret(): string | null {
  // ADMIN_SESSION_SECRET is optional. Falling back to ADMIN_PASSWORD means
  // there is no second env var to set up, and changing the password
  // invalidates every existing session, which is the behaviour you want.
  //
  // Device tokens are signed with this too, so changing the password also
  // un-trusts every registered device and forces a fresh emailed code on each
  // one. That is the correct response to a suspected compromise, and it is
  // the reason there is no separate "sign out everywhere" button.
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** HMAC with the admin secret. Null when no secret is configured at all. */
export async function signPayload(payload: string): Promise<string | null> {
  const key = secret();
  if (!key) return null;
  return sign(payload, key);
}

async function sign(payload: string, key: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(payload));
  return base64url(new Uint8Array(sig));
}

// Comparison that does not leak how much of the value matched via timing.
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function checkPassword(candidate: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof candidate !== "string") return false;
  return safeEqual(candidate, expected);
}

/** Returns a `<expiry>.<signature>` token, or null if no secret is configured. */
export async function createSessionToken(): Promise<string | null> {
  const key = secret();
  if (!key) return null;
  const expiry = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expiry}.${await sign(expiry, key)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const key = secret();
  if (!key || !token) return false;

  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;

  const expiresAt = Number(expiry);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return safeEqual(signature, await sign(expiry, key));
}
