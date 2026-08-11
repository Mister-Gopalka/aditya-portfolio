import { supabaseAdmin } from "./supabase";

// How far back the admin panel looks. Portfolio traffic is small enough that
// aggregating the raw rows in JS is cheaper than maintaining a rollup table.
const WINDOW_DAYS = 30;
const MAX_ROWS = 20000;

export type Pageview = {
  created_at: string;
  path: string;
  referrer: string | null;
  device: string | null;
  visitor_hash: string | null;
};

export type VisitorStats = {
  totalViews: number;
  uniqueVisitors: number;
  viewsToday: number;
  visitorsToday: number;
  daily: { date: string; views: number; visitors: number }[];
  topPaths: { path: string; views: number }[];
  topReferrers: { referrer: string; views: number }[];
  devices: { device: string; views: number }[];
};

export function deviceFrom(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(ua)) return "Tablet";
  if (/mobi|iphone|android|phone/.test(ua)) return "Mobile";
  return "Desktop";
}

/**
 * Hostname only. Full referrer URLs carry query strings we have no use for.
 *
 * A visitor moving between pages on the site sends the site itself as the
 * referrer. Counting that would put adityagopalka.com at the top of "where
 * they came from", which is the one place that answer is useless. Self
 * referrals are recorded as direct, same as a typed URL.
 */
export function referrerHost(
  referrer: string | null | undefined,
  selfHost?: string | null
): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (!host) return null;
    if (selfHost && host === selfHost.replace(/^www\./, "").split(":")[0]) return null;
    return host;
  } catch {
    return null;
  }
}

/**
 * A daily-rotating, salted hash of IP + user agent. Never the IP itself.
 *
 * The salt includes the date, so the same person on the same network hashes
 * differently tomorrow. That is enough to count "how many distinct people
 * today" and deliberately not enough to follow anyone across days. No cookie
 * is set, so no consent banner is required.
 */
export async function visitorHash(ip: string, userAgent: string): Promise<string> {
  const salt = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "portfolio";
  const day = new Date().toISOString().slice(0, 10);
  const bytes = new TextEncoder().encode(`${day}:${salt}:${ip}:${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function recordPageview(view: {
  path: string;
  referrer: string | null;
  device: string;
  visitor_hash: string;
}) {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from("pageviews").insert(view);
}

function countBy<T extends string>(rows: { key: T }[]): { key: T; views: number }[] {
  const counts = new Map<T, number>();
  for (const row of rows) counts.set(row.key, (counts.get(row.key) ?? 0) + 1);
  return [...counts.entries()]
    .map(([key, views]) => ({ key, views }))
    .sort((a, b) => b.views - a.views);
}

export async function getVisitorStats(): Promise<VisitorStats | null> {
  if (!supabaseAdmin) return null;

  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabaseAdmin
    .from("pageviews")
    .select("created_at, path, referrer, device, visitor_hash")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(MAX_ROWS);

  if (error) return null;
  const rows = (data ?? []) as Pageview[];

  const today = new Date().toISOString().slice(0, 10);
  const byDay = new Map<string, { views: number; visitors: Set<string> }>();

  for (const row of rows) {
    const day = row.created_at.slice(0, 10);
    if (!byDay.has(day)) byDay.set(day, { views: 0, visitors: new Set() });
    const bucket = byDay.get(day)!;
    bucket.views += 1;
    if (row.visitor_hash) bucket.visitors.add(row.visitor_hash);
  }

  const daily = [...byDay.entries()]
    .map(([date, b]) => ({ date, views: b.views, visitors: b.visitors.size }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalViews: rows.length,
    uniqueVisitors: new Set(rows.map((r) => r.visitor_hash).filter(Boolean)).size,
    viewsToday: byDay.get(today)?.views ?? 0,
    visitorsToday: byDay.get(today)?.visitors.size ?? 0,
    daily,
    topPaths: countBy(rows.map((r) => ({ key: r.path }))).map(({ key, views }) => ({
      path: key,
      views,
    })),
    topReferrers: countBy(
      rows.filter((r) => r.referrer).map((r) => ({ key: r.referrer as string }))
    ).map(({ key, views }) => ({ referrer: key, views })),
    devices: countBy(rows.map((r) => ({ key: r.device ?? "Unknown" }))).map(
      ({ key, views }) => ({ device: key, views })
    ),
  };
}
