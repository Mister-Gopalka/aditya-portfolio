#!/usr/bin/env node
// Manage trusted admin devices from a terminal.
//
//   npm run devices list
//   npm run devices revoke <id>
//   npm run devices code
//
// Revoking lives here rather than in the admin panel on purpose. Someone who
// got into the panel must not be able to un-trust Aditya's own laptop and
// phone and lock him out. This needs the service-role key from .env.local,
// which is on his machine and nowhere else.
//
// `code` mints a sign-in code directly, for the case where Resend is down or
// RESEND_API_KEY is missing and the emailed code never arrives. It is not a
// backdoor: it already requires the service-role key, which is full database
// access anyway.

import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function loadEnv() {
  let raw;
  try {
    raw = readFileSync(join(ROOT, ".env.local"), "utf8");
  } catch {
    fail("Could not read .env.local. Run this from the project root.");
  }
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return env;
}

function fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

const env = loadEnv();
const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const SECRET = env.ADMIN_SESSION_SECRET || env.ADMIN_PASSWORD;

if (!URL_BASE || !KEY) fail("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be in .env.local");

async function db(path, init = {}) {
  const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) fail(`Supabase said ${res.status}: ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/** Must match hashCode() in lib/admin-devices.ts exactly. */
async function hashCode(code) {
  if (!SECRET) fail("ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be in .env.local");
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`login-code:${code}`));
  let binary = "";
  for (const b of new Uint8Array(sig)) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function when(iso) {
  if (!iso) return "never";
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const [command, argument] = process.argv.slice(2);

switch (command) {
  case "list": {
    const rows = await db(
      "admin_devices?select=id,name,created_at,last_seen_at,country,city,revoked_at&order=created_at.asc"
    );
    const active = rows.filter((r) => !r.revoked_at);
    const revoked = rows.filter((r) => r.revoked_at);

    if (active.length === 0) {
      console.log("\n  No trusted devices.\n");
    } else {
      console.log(`\n  ${active.length} trusted device${active.length === 1 ? "" : "s"}:\n`);
      for (const r of active) {
        const place = [r.city, r.country].filter(Boolean).join(", ") || "unknown";
        console.log(`  ${r.name}`);
        console.log(`    id         ${r.id}`);
        console.log(`    added      ${when(r.created_at)}`);
        console.log(`    last used  ${when(r.last_seen_at)}`);
        console.log(`    where      ${place}\n`);
      }
    }

    if (revoked.length) {
      console.log(`  ${revoked.length} revoked: ${revoked.map((r) => r.name).join(", ")}\n`);
    }
    break;
  }

  case "revoke": {
    if (!argument) fail("Usage: npm run devices revoke <id>");
    const rows = await db(`admin_devices?id=eq.${encodeURIComponent(argument)}&select=id,name,revoked_at`);
    if (!rows.length) fail(`No device with id ${argument}. Run "npm run devices list" to see them.`);
    if (rows[0].revoked_at) fail(`"${rows[0].name}" was already revoked.`);

    await db(`admin_devices?id=eq.${encodeURIComponent(argument)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ revoked_at: new Date().toISOString() }),
    });
    console.log(`\n  Revoked "${rows[0].name}".`);
    console.log(`  That device now needs an emailed code to sign in, and its visits count again.\n`);
    break;
  }

  case "code": {
    const code = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
    const hash = await hashCode(code);
    const now = new Date();

    await db("admin_login_codes?consumed_at=is.null", {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ consumed_at: now.toISOString() }),
    });

    await db("admin_login_codes", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        code_hash: hash,
        expires_at: new Date(now.getTime() + 10 * 60 * 1000).toISOString(),
        user_agent: "issued from scripts/devices.mjs",
      }),
    });

    console.log(`\n  Sign-in code: ${code}`);
    console.log(`  Valid for 10 minutes. Enter it on the admin page.\n`);
    break;
  }

  default:
    console.log(`
  npm run devices list            show trusted devices
  npm run devices revoke <id>     stop trusting one
  npm run devices code            mint a sign-in code, when email is not working
`);
}
