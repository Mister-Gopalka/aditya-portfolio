import { supabaseAdmin } from "./supabase";

// Aditya reads these in IST, and the SQL buckets days in Asia/Kolkata, so the
// "today" boundary has to agree with it. IST has no DST, hence the flat offset.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export type Period = "today" | "7d" | "30d" | "all";

export const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "all", label: "All time" },
];

export const DEFAULT_PERIOD: Period = "7d";

export type StatRow = { label: string; views: number; visitors: number };
export type PlaceRow = {
  country: string;
  city: string | null;
  views: number;
  visitors: number;
};

export type VisitorStats = {
  totalViews: number;
  uniqueVisitors: number;
  daily: { date: string; views: number; visitors: number }[];
  sources: StatRow[];
  pages: StatRow[];
  places: PlaceRow[];
  devices: StatRow[];
};

export type RecentVisitor = {
  visitor_hash: string;
  first_seen: string;
  last_seen: string;
  views: number;
  source: string | null;
  device: string | null;
  country: string | null;
  city: string | null;
  paths: string[];
};

export function isPeriod(value: unknown): value is Period {
  return typeof value === "string" && PERIODS.some((p) => p.id === value);
}

/** The UTC instant a period starts. `all` has no lower bound. */
export function periodStart(period: Period): string | null {
  const now = Date.now();
  switch (period) {
    case "today": {
      // Midnight in IST, expressed as UTC.
      const ist = new Date(now + IST_OFFSET_MS);
      const midnightIst = Date.UTC(
        ist.getUTCFullYear(),
        ist.getUTCMonth(),
        ist.getUTCDate()
      );
      return new Date(midnightIst - IST_OFFSET_MS).toISOString();
    }
    case "7d":
      return new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    case "30d":
      return new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
    case "all":
      return null;
  }
}

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
  country: string | null;
  city: string | null;
}) {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from("pageviews").insert(view);
}

export async function getVisitorStats(period: Period): Promise<VisitorStats | null> {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin.rpc("visitor_stats", {
    since: periodStart(period),
  });
  if (error || !data) return null;
  return data as VisitorStats;
}

export async function getRecentVisitors(limit = 10): Promise<RecentVisitor[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin.rpc("recent_visitors", { limit_n: limit });
  if (error || !data) return [];
  return data as RecentVisitor[];
}
