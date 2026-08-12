import { NextResponse } from "next/server";
import {
  deviceFrom,
  geoFromRequest,
  recordPageview,
  referrerHost,
  visitorHash,
} from "@/lib/analytics";
import { isTrustedDevice } from "@/lib/admin-devices";

// Called once per page view by components/Tracker.tsx.
//
// The IP is read here and hashed immediately; it is never stored or logged.
// Country and city come from Vercel's edge headers, which are derived from the
// same IP before it reaches us. Nothing is written to a visitor's browser, so
// this still needs no consent banner.

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const path = typeof body.path === "string" ? body.path.slice(0, 512) : null;
  if (!path) return NextResponse.json({ ok: false }, { status: 400 });

  // Aditya browsing his own site is not traffic. Any browser he has signed in
  // to the panel from carries a signed device cookie, and those visits are
  // dropped here rather than filtered out later, so the numbers are true at
  // the point of collection.
  //
  // Cheap for everyone else: no cookie means no database round trip.
  if (await isTrustedDevice(req)) {
    return NextResponse.json({ ok: true, skipped: "admin device" });
  }

  const userAgent = req.headers.get("user-agent") ?? "";

  // Vercel sets x-forwarded-for; the first entry is the client.
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const { country, city } = geoFromRequest(req);

  try {
    await recordPageview({
      path,
      referrer: referrerHost(
        typeof body.referrer === "string" ? body.referrer : null,
        req.headers.get("host")
      ),
      device: deviceFrom(userAgent),
      visitor_hash: await visitorHash(ip, userAgent),
      country,
      city,
    });
  } catch {
    // Analytics must never break a page load.
  }

  return NextResponse.json({ ok: true });
}
