import { NextResponse } from "next/server";
import { deviceFrom, recordPageview, referrerHost, visitorHash } from "@/lib/analytics";

// Called once per page view by components/Tracker.tsx.
//
// The IP is read here and hashed immediately; it is never stored or logged.
// Country and city come from Vercel's edge headers, which are derived from the
// same IP before it reaches us. Nothing is written to the visitor's browser,
// so this still needs no consent banner.

/** Vercel percent-encodes these, and they are absent when running locally. */
function geoHeader(req: Request, name: string): string | null {
  const raw = req.headers.get(name);
  if (!raw) return null;
  try {
    const value = decodeURIComponent(raw).trim();
    return value || null;
  } catch {
    return raw.trim() || null;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const path = typeof body.path === "string" ? body.path.slice(0, 512) : null;
  if (!path) return NextResponse.json({ ok: false }, { status: 400 });

  const userAgent = req.headers.get("user-agent") ?? "";

  // Vercel sets x-forwarded-for; the first entry is the client.
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";

  try {
    await recordPageview({
      path,
      referrer: referrerHost(
        typeof body.referrer === "string" ? body.referrer : null,
        req.headers.get("host")
      ),
      device: deviceFrom(userAgent),
      visitor_hash: await visitorHash(ip, userAgent),
      country: geoHeader(req, "x-vercel-ip-country"),
      city: geoHeader(req, "x-vercel-ip-city"),
    });
  } catch {
    // Analytics must never break a page load.
  }

  return NextResponse.json({ ok: true });
}
