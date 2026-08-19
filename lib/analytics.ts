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
  /** Automated hits that reached the endpoint and were kept out of the counts. */
  filteredViews: number;
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

/**
 * Country and city as Vercel's edge saw them. Absent when running locally.
 *
 * Vercel percent-encodes these, hence the decode. Derived from the IP before
 * the request reaches us; the IP itself is never stored.
 */
export function geoFromRequest(req: Request): { country: string | null; city: string | null } {
  const read = (name: string): string | null => {
    const raw = req.headers.get(name);
    if (!raw) return null;
    try {
      return decodeURIComponent(raw).trim() || null;
    } catch {
      return raw.trim() || null;
    }
  };
  return {
    country: read("x-vercel-ip-country"),
    city: read("x-vercel-ip-city"),
  };
}

/**
 * Anything that says it is not a person.
 *
 * This is the second line of defence, not the first — components/Tracker.tsx
 * only reports a view once the session shows depth, and most automated
 * fetchers never get that far. What this catches is the honest ones, and it
 * labels rather than silently drops, so "who keeps fetching my link" stays
 * answerable.
 *
 * It will not catch a scanner that copies a real Chrome user agent, which the
 * datacenter link-scanners do — they cleared a user-agent check and a
 * simulated-interaction check both. The depth gate is what stops those, and
 * this list should never be widened in an attempt to do its job: every
 * broadening so far has cost real visitors more than it caught.
 */
const BOT_PATTERN = new RegExp(
  [
    // Self-identifying crawlers and indexers
    "bot\\b", "\\bbots\\b", "crawler", "crawling", "spider", "slurp", "scraper",
    // Search and SEO
    "googlebot", "google-extended", "bingbot", "bingpreview", "yandex", "baiduspider",
    "duckduckbot", "applebot", "ahrefs", "semrush", "mj12", "dotbot", "petalbot", "dataforseo",
    // LLM fetchers — the ones Aditya suspected
    "gptbot", "chatgpt", "oai-searchbot", "openai", "perplexity", "claudebot",
    "anthropic", "ccbot", "bytespider", "amazonbot", "meta-externalagent",
    // Link preview and unfurl, which is what a shared link triggers.
    //
    // Matched on the bot's own token, never the bare brand name. These apps
    // ship an in-app browser whose user agent also carries the brand: a real
    // person tapping the link inside LinkedIn sends "[LinkedInApp]", and
    // matching "linkedin" flagged them as bots. That discarded exactly the
    // visitors this site exists to catch, LinkedIn being where the link is
    // shared. WhatsApp is deliberately absent: its fetcher is
    // "WhatsApp/<version>" with no Mozilla prefix and the not-a-browser rule
    // below catches it, while its Android in-app browser appends
    // "WhatsApp/2.24" to a full Chrome user agent and must not be caught.
    "facebookexternalhit", "telegrambot", "slackbot", "slack-imgproxy",
    "discordbot", "linkedinbot", "twitterbot", "embedly", "quora link preview",
    "pinterestbot", "redditbot", "skypeuripreview",
    // Monitoring and security scanners
    "uptimerobot", "pingdom", "statuscake", "site24x7", "monitor", "lighthouse",
    "pagespeed", "gtmetrix", "netcraft", "censys", "expanse", "zgrab", "masscan", "nuclei",
    // Headless and scripted clients
    "headlesschrome", "phantomjs", "puppeteer", "playwright", "selenium",
    "python-requests", "python-urllib", "aiohttp", "httpx", "scrapy",
    "curl/", "wget", "libwww", "axios", "node-fetch", "go-http-client",
    "java/", "okhttp", "apache-httpclient", "postman", "insomnia",
  ].join("|"),
  "i"
);

export function isBot(userAgent: string): boolean {
  // No user agent at all is not a browser.
  if (!userAgent.trim()) return true;
  // Neither is anything that does not claim to be one. Every real browser
  // still sends the "Mozilla/" prefix; scripted fetchers and unfurlers such as
  // "WhatsApp/2.19.81 A" do not. A scanner that fakes the prefix is not this
  // function's problem — the depth gate in components/Tracker.tsx is.
  if (!/mozilla\//i.test(userAgent)) return true;
  return BOT_PATTERN.test(userAgent);
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
  user_agent: string;
  is_bot: boolean;
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
