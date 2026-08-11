import { NextResponse } from "next/server";
import {
  DEFAULT_PERIOD,
  getRecentVisitors,
  getVisitorStats,
  isPeriod,
} from "@/lib/analytics";

// Guarded by proxy.ts. Backs the period switcher and the live visitor feed,
// which polls this while the Visitors tab is open.
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("period");
  const period = isPeriod(raw) ? raw : DEFAULT_PERIOD;

  const [stats, recent] = await Promise.all([
    getVisitorStats(period),
    getRecentVisitors(10),
  ]);

  return NextResponse.json(
    { period, stats, recent },
    // The whole point is freshness; a cached response would defeat it.
    { headers: { "Cache-Control": "no-store" } }
  );
}
