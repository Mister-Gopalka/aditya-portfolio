// Trusted admin devices, and the emailed code that creates one.
//
// The password alone is no longer enough to reach the panel. A sign-in from a
// device this site has not seen before also needs a six-digit code, emailed to
// Aditya. That means a stolen password produces an email he will see rather
// than silent access — the alert and the second factor are the same event, so
// there is only one thing to send and one thing to read.
//
// Revoking a device is deliberately absent from this file's write surface as
// far as the web app is concerned. `scripts/devices.mjs` does it from a
// terminal. If someone does get into the panel, they must not be able to
// un-trust Aditya's own laptop and phone and lock him out.

import { safeEqual, signPayload } from "./admin-auth";
import { geoFromRequest } from "./analytics";
import { escapeHtml, sendEmail, TO } from "./email";
import { supabaseAdmin } from "./supabase";

export const DEVICE_COOKIE = "admin_device";

// A year. This cookie is the "remember this device" half of the login, so it
// has to outlive the 12-hour session by a wide margin or the second factor
// stops being a one-time step and becomes a daily tax.
export const DEVICE_MAX_AGE = 60 * 60 * 24 * 365;

const CODE_TTL_MS = 10 * 60 * 1000;

// Six digits is a million combinations. That is only safe because a code dies
// after five wrong guesses and after ten minutes, so an online guessing attack
// gets five tries per emailed code rather than unlimited tries.
const MAX_CODE_ATTEMPTS = 5;

export type AdminDevice = {
  id: string;
  name: string;
  user_agent: string | null;
  created_at: string;
  last_seen_at: string | null;
  country: string | null;
  city: string | null;
};

export type RequestContext = {
  userAgent: string;
  country: string | null;
  city: string | null;
};

/** "Chrome on macOS". Chrome's UA also contains "Safari", so order matters. */
export function describeDevice(ua: string): string {
  if (!ua) return "Unknown device";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Unknown browser";

  const os = /iPhone|iPad|iPod/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Mac OS X|Macintosh/.test(ua)
        ? "macOS"
        : /Windows/.test(ua)
          ? "Windows"
          : /Linux/.test(ua)
            ? "Linux"
            : "unknown OS";

  return `${browser} on ${os}`;
}

/** What the device list and the alert email need to know about a request. */
export function requestContext(req: Request): RequestContext {
  const { country, city } = geoFromRequest(req);
  return { userAgent: req.headers.get("user-agent") ?? "", country, city };
}

/** Parsed straight off the header — no dependency on a framework cookie API. */
export function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return undefined;
}

// --- device tokens -------------------------------------------------------

/** `<uuid>.<hmac>`. Signed so a forged cookie cannot claim to be trusted. */
export async function signDeviceId(id: string): Promise<string | null> {
  const sig = await signPayload(`device:${id}`);
  return sig ? `${id}.${sig}` : null;
}

/** The device id if the signature holds, otherwise null. No database call. */
export async function verifyDeviceToken(
  token: string | undefined
): Promise<string | null> {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;

  const id = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = await signPayload(`device:${id}`);
  if (!expected) return null;

  return safeEqual(signature, expected) ? id : null;
}

// --- device records ------------------------------------------------------

export async function getActiveDevice(id: string): Promise<AdminDevice | null> {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from("admin_devices")
    .select("id, name, user_agent, created_at, last_seen_at, country, city")
    .eq("id", id)
    .is("revoked_at", null)
    .maybeSingle();
  if (error || !data) return null;
  return data as AdminDevice;
}

/**
 * Whether this request carries a cookie for a device that is still trusted.
 *
 * Called on every pageview, so the cheap check comes first: a visitor with no
 * device cookie — which is everyone except Aditya — costs one string lookup
 * and no database round trip at all.
 */
export async function isTrustedDevice(req: Request): Promise<boolean> {
  const token = readCookie(req, DEVICE_COOKIE);
  if (!token) return false;
  const id = await verifyDeviceToken(token);
  if (!id) return false;
  return (await getActiveDevice(id)) !== null;
}

export async function registerDevice(
  name: string,
  ctx: RequestContext
): Promise<string | null> {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from("admin_devices")
    .insert({
      name: name.trim().slice(0, 80) || describeDevice(ctx.userAgent),
      user_agent: ctx.userAgent.slice(0, 500),
      country: ctx.country,
      city: ctx.city,
      last_seen_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error || !data) return null;
  return data.id as string;
}

export async function touchDevice(id: string, ctx: RequestContext): Promise<void> {
  if (!supabaseAdmin) return;
  await supabaseAdmin
    .from("admin_devices")
    .update({
      last_seen_at: new Date().toISOString(),
      country: ctx.country,
      city: ctx.city,
    })
    .eq("id", id);
}

/** Active devices, oldest first. Read-only: the panel never writes to these. */
export async function listDevices(): Promise<AdminDevice[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("admin_devices")
    .select("id, name, user_agent, created_at, last_seen_at, country, city")
    .is("revoked_at", null)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data as AdminDevice[];
}

// --- one-time codes ------------------------------------------------------

/** Rejection sampling, so every six-digit code is equally likely. */
function generateCode(): string {
  const buf = new Uint32Array(1);
  let n: number;
  do {
    crypto.getRandomValues(buf);
    n = buf[0];
  } while (n >= 4_294_000_000); // largest multiple of 1e6 below 2^32
  return String(n % 1_000_000).padStart(6, "0");
}

/**
 * HMAC rather than a bare hash. A plain SHA-256 of a six-digit code is
 * reversible by trying all million inputs, so anyone who read the table would
 * have live codes. Keyed with the admin secret, the stored value is useless
 * without also having that secret.
 */
async function hashCode(code: string): Promise<string | null> {
  return signPayload(`login-code:${code}`);
}

/** Issues a code and returns it in the clear, for emailing. */
export async function createLoginCode(ctx: RequestContext): Promise<string | null> {
  if (!supabaseAdmin) return null;

  const code = generateCode();
  const hash = await hashCode(code);
  if (!hash) return null;

  const now = new Date();

  // Only one code is ever live. Issuing a new one kills the previous, so a
  // code left in an old email cannot be used later.
  await supabaseAdmin
    .from("admin_login_codes")
    .update({ consumed_at: now.toISOString() })
    .is("consumed_at", null);

  // Housekeeping, so the table does not grow forever.
  await supabaseAdmin
    .from("admin_login_codes")
    .delete()
    .lt("created_at", new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString());

  const { error } = await supabaseAdmin.from("admin_login_codes").insert({
    code_hash: hash,
    expires_at: new Date(now.getTime() + CODE_TTL_MS).toISOString(),
    user_agent: ctx.userAgent.slice(0, 500),
    country: ctx.country,
    city: ctx.city,
  });
  if (error) return null;

  return code;
}

/** Consumes the code on success, and burns it after too many wrong guesses. */
export async function verifyLoginCode(candidate: unknown): Promise<boolean> {
  if (!supabaseAdmin) return false;
  if (typeof candidate !== "string") return false;

  const code = candidate.replace(/\D/g, "");
  if (code.length !== 6) return false;

  const { data, error } = await supabaseAdmin
    .from("admin_login_codes")
    .select("id, code_hash, attempts")
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return false;

  const hash = await hashCode(code);
  if (hash && safeEqual(hash, data.code_hash)) {
    await supabaseAdmin
      .from("admin_login_codes")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", data.id);
    return true;
  }

  const attempts = (data.attempts ?? 0) + 1;
  await supabaseAdmin
    .from("admin_login_codes")
    .update({
      attempts,
      // Burn it rather than let someone keep guessing.
      consumed_at: attempts >= MAX_CODE_ATTEMPTS ? new Date().toISOString() : null,
    })
    .eq("id", data.id);

  return false;
}

// --- the email -----------------------------------------------------------

function maskEmail(address: string): string {
  const at = address.lastIndexOf("@");
  if (at < 1) return address;
  const name = address.slice(0, at);
  const domain = address.slice(at);
  const shown = name.slice(0, 2);
  return `${shown}${"•".repeat(Math.max(1, name.length - 2))}${domain}`;
}

export const MASKED_RECIPIENT = maskEmail(TO);

/**
 * The code and the intrusion alert are the same message on purpose.
 *
 * If it is Aditya, he wants the code. If it is someone who has guessed the
 * password, he wants to know immediately. One email serves both, so there is
 * nothing to configure twice and no second thing that can silently fail.
 */
export async function sendLoginCodeEmail(
  code: string,
  ctx: RequestContext
): Promise<boolean> {
  const where = [ctx.city, ctx.country].filter(Boolean).join(", ") || "location unknown";
  const device = describeDevice(ctx.userAgent);
  const when = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  return sendEmail({
    tag: "admin",
    // In the subject so it is readable from a phone notification without
    // opening anything.
    subject: `Admin sign-in code: ${code}`,
    text: [
      `Someone signed in to the adityagopalka.com admin panel from a device it has not seen before.`,
      ``,
      `Code:   ${code}   (valid for 10 minutes)`,
      ``,
      `Device: ${device}`,
      `Where:  ${where}`,
      `When:   ${when} IST`,
      ``,
      `If this was not you, someone has the admin password. Change ADMIN_PASSWORD`,
      `in the Vercel dashboard now. Doing that also un-trusts every device.`,
    ].join("\n"),
    html: `
      <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1C0A00">
        <p style="margin:0 0 18px;font-size:13px;color:#8a7f78">Sign-in from a new device</p>
        <p style="margin:0 0 8px">Enter this code to finish signing in:</p>
        <p style="margin:0 0 24px;font-size:30px;font-weight:700;letter-spacing:5px">${escapeHtml(code)}</p>
        <p style="margin:0 0 24px;font-size:13px;color:#8a7f78">Valid for 10 minutes.</p>
        <table style="margin:0 0 24px;font-size:14px;border-collapse:collapse">
          <tr><td style="padding:2px 16px 2px 0;color:#8a7f78">Device</td><td>${escapeHtml(device)}</td></tr>
          <tr><td style="padding:2px 16px 2px 0;color:#8a7f78">Where</td><td>${escapeHtml(where)}</td></tr>
          <tr><td style="padding:2px 16px 2px 0;color:#8a7f78">When</td><td>${escapeHtml(when)} IST</td></tr>
        </table>
        <p style="margin:0;padding:14px 16px;background:#FFF3F0;border-radius:8px;font-size:14px">
          <strong>If this was not you</strong>, someone has the admin password.
          Change <code>ADMIN_PASSWORD</code> in Vercel now. That also un-trusts every device.
        </p>
      </div>
    `,
  });
}
