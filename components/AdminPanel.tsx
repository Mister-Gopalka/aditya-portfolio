"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Submission } from "@/lib/inbox";
import {
  DEFAULT_PERIOD,
  PERIODS,
  type Period,
  type PlaceRow,
  type RecentVisitor,
  type StatRow,
  type VisitorStats,
} from "@/lib/analytics";

interface Props {
  submissions: Submission[];
  stats: VisitorStats | null;
  recent: RecentVisitor[];
  projects: { slug: string; title: string; visible: boolean }[];
}

type Tab = "inbox" | "archive" | "visitors" | "projects";

// Explicit timeZone so the server and the browser format identically and
// hydration does not mismatch. Aditya reads these in IST.
const IST = "Asia/Kolkata";

const card = "rounded-2xl border border-[#1C0A00]/10 bg-[#FFF8F3] shadow-md";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: IST,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDay(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
  });
}

function timeAgo(iso: string) {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// Slugs are shown as-is. Title-casing them read as "Oyo" and "Linkedin.Com" —
// a display transform is not worth mangling a brand name over.
function prettyPath(path: string) {
  if (path === "/") return "Home";
  return path.replace(/^\/projects\//, "");
}

/** "IN" -> "India". Falls back to the raw code if the runtime cannot map it. */
function countryName(code: string | null) {
  if (!code) return "Unknown";
  if (code.length !== 2) return code;
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function placeLabel(country: string | null, city: string | null) {
  const name = countryName(country);
  return city ? `${city}, ${name}` : name;
}

export default function AdminPanel({ submissions, stats, recent, projects }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("inbox");
  const [visibility, setVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(projects.map((p) => [p.slug, p.visible]))
  );
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const active = submissions.filter((s) => !s.archived_at);
  const archived = submissions.filter((s) => s.archived_at);
  const unread = active.filter((s) => !s.read_at).length;

  async function inboxAction(id: string, action: string) {
    setBusy(true);
    await fetch("/api/admin/inbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setBusy(false);
    router.refresh();
  }

  async function handleVisibilityChange(slug: string, val: boolean) {
    const updated = { ...visibility, [slug]: val };
    setVisibility(updated);
    const res = await fetch("/api/admin/visibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility: updated }),
    });
    if (!res.ok) {
      // Put the toggle back rather than showing a state the site does not have.
      setVisibility(visibility);
      setNote("Could not save. Check SUPABASE_SERVICE_ROLE_KEY.");
      return;
    }
    setNote("Saved.");
    setTimeout(() => setNote(""), 2000);
  }

  async function signOut() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.refresh();
  }

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "inbox", label: "Inbox", badge: unread },
    { id: "archive", label: "Archive", badge: archived.length },
    { id: "visitors", label: "Visitors" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-[#A0281A] text-white"
                  : "bg-[#1C0A00]/5 text-[#1C0A00]/70 hover:bg-[#1C0A00]/10"
              }`}
            >
              {t.label}
              {!!t.badge && (
                <span
                  className={`text-xs rounded-full px-2 py-0.5 ${
                    tab === t.id
                      ? "bg-white/25 text-white"
                      : t.id === "inbox"
                        ? "bg-[#A0281A] text-white"
                        : "bg-[#1C0A00]/15 text-[#1C0A00]/60"
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={signOut}
          className="text-sm text-[#1C0A00]/50 hover:text-[#A0281A] transition-colors"
        >
          Sign out
        </button>
      </div>

      {note && <p className="text-sm text-[#A0281A] font-medium">{note}</p>}

      {tab === "inbox" && (
        <Inbox
          submissions={active}
          busy={busy}
          onAction={inboxAction}
          empty="No messages yet. Anything sent through the form on the site lands here."
        />
      )}

      {tab === "archive" && (
        <Inbox
          submissions={archived}
          busy={busy}
          onAction={inboxAction}
          empty="Nothing archived. Messages you archive from the inbox are kept here rather than deleted."
        />
      )}

      {tab === "visitors" && <Visitors initialStats={stats} initialRecent={recent} />}

      {tab === "projects" && (
        <section className={`${card} overflow-hidden`}>
          {projects.map((project, i) => (
            <div
              key={project.slug}
              className={`flex items-center justify-between px-6 py-4 ${
                i !== projects.length - 1 ? "border-b border-[#1C0A00]/8" : ""
              }`}
            >
              <span className="text-sm text-[#1C0A00] font-medium">{project.title}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={visibility[project.slug]}
                  onChange={(e) => handleVisibilityChange(project.slug, e.target.checked)}
                />
                <div className="w-10 h-6 bg-[#1C0A00]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A0281A]" />
              </label>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function Inbox({
  submissions,
  busy,
  onAction,
  empty,
}: {
  submissions: Submission[];
  busy: boolean;
  onAction: (id: string, action: string) => void;
  empty: string;
}) {
  if (submissions.length === 0) {
    return (
      <div className={`${card} p-8`}>
        <p className="text-sm text-[#1C0A00]/50">{empty}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {submissions.map((s) => {
        const unread = !s.read_at;
        const isArchived = !!s.archived_at;
        return (
          <article
            key={s.id}
            className={`${card} p-6 ${unread && !isArchived ? "border-l-4 border-l-[#A0281A]" : ""}`}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#1C0A00]">
                  {s.name}
                  {unread && !isArchived && (
                    <span className="ml-2 align-middle text-[10px] uppercase tracking-wider bg-[#A0281A] text-white rounded-full px-2 py-0.5">
                      New
                    </span>
                  )}
                </h3>
                <p className="text-sm text-[#1C0A00]/50 mt-0.5">{formatDate(s.created_at)}</p>
              </div>
              <a
                href={`https://wa.me/${s.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white bg-[#A0281A] hover:bg-[#8B1F13] rounded-full px-5 py-2 transition-colors"
              >
                WhatsApp {s.phone}
              </a>
            </div>

            {s.requirement && (
              <p className="text-[#1C0A00]/80 text-sm mt-4 leading-relaxed whitespace-pre-wrap">
                {s.requirement}
              </p>
            )}

            <div className="flex gap-4 mt-5 text-sm">
              <button
                disabled={busy}
                onClick={() => onAction(s.id, unread ? "read" : "unread")}
                className="text-[#1C0A00]/50 hover:text-[#A0281A] transition-colors disabled:opacity-40"
              >
                {unread ? "Mark read" : "Mark unread"}
              </button>
              <button
                disabled={busy}
                onClick={() => onAction(s.id, isArchived ? "unarchive" : "archive")}
                className="text-[#1C0A00]/50 hover:text-[#A0281A] transition-colors disabled:opacity-40"
              >
                {isArchived ? "Move back to inbox" : "Archive"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Ranked({
  title,
  subtitle,
  rows,
  empty,
}: {
  title: string;
  subtitle?: string;
  rows: { label: string; views: number; visitors: number }[];
  empty: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.visitors));
  return (
    <section className={`${card} p-6`}>
      <div className="flex items-baseline justify-between mb-4 gap-3">
        <h3 className="font-heading text-base font-bold text-[#1C0A00]">{title}</h3>
        <span className="text-[11px] text-[#1C0A00]/40 shrink-0">
          {subtitle ?? "people · views"}
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-[#1C0A00]/40">{empty}</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {rows.slice(0, 8).map((r) => (
            <div key={r.label} className="flex items-center gap-3">
              <span className="text-sm text-[#1C0A00]/75 w-36 shrink-0 truncate" title={r.label}>
                {r.label}
              </span>
              <div className="flex-1 h-2 bg-[#1C0A00]/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A0281A] rounded-full"
                  style={{ width: `${(r.visitors / max) * 100}%` }}
                />
              </div>
              <span className="text-sm text-[#1C0A00] font-medium w-8 text-right tabular-nums">
                {r.visitors}
              </span>
              <span className="text-xs text-[#1C0A00]/40 w-8 text-right tabular-nums">
                {r.views}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Visitors({
  initialStats,
  initialRecent,
}: {
  initialStats: VisitorStats | null;
  initialRecent: RecentVisitor[];
}) {
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);
  const [stats, setStats] = useState<VisitorStats | null>(initialStats);
  const [recent, setRecent] = useState<RecentVisitor[]>(initialRecent);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const periodRef = useRef(period);
  periodRef.current = period;

  const load = useCallback(async (p: Period, showSpinner: boolean) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?period=${p}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // A slow response for an old period must not overwrite a newer one.
      if (data.period !== periodRef.current) return;
      setStats(data.stats);
      setRecent(data.recent ?? []);
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, []);

  // Refetch on period change, and poll while the tab is actually being looked
  // at. Polling a background tab would burn requests for nobody.
  //
  // Returning to the tab refreshes straight away rather than waiting out the
  // remainder of an interval — otherwise the first thing you see on coming
  // back is up to 15 seconds stale, which is the moment you most want it live.
  useEffect(() => {
    load(period, true);

    const id = setInterval(() => {
      if (document.visibilityState === "visible") load(periodRef.current, false);
    }, 15000);

    const onVisible = () => {
      if (document.visibilityState === "visible") load(periodRef.current, false);
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [period, load]);

  if (!stats && failed) {
    return (
      <div className={`${card} p-8`}>
        <p className="text-sm text-[#1C0A00]/50">
          Could not load visitor data. Check that SUPABASE_SERVICE_ROLE_KEY is set.
        </p>
      </div>
    );
  }

  const maxDaily = Math.max(1, ...(stats?.daily ?? []).map((d) => d.views));
  const showChart = period !== "today" && (stats?.daily.length ?? 0) > 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              period === p.id
                ? "bg-[#1C0A00] text-[#FFF8F3]"
                : "bg-[#1C0A00]/5 text-[#1C0A00]/60 hover:bg-[#1C0A00]/10"
            }`}
          >
            {p.label}
          </button>
        ))}
        {loading && <span className="text-xs text-[#1C0A00]/40">Loading…</span>}
      </div>

      {/* Headline. People first: one person reading five pages is one visitor,
          which is the honest measure of reach. */}
      <section className={`${card} p-6 flex flex-wrap items-end gap-x-12 gap-y-4`}>
        <div>
          <p className="text-5xl font-bold text-[#1C0A00] tabular-nums leading-none">
            {stats?.uniqueVisitors ?? 0}
          </p>
          <p className="text-xs text-[#1C0A00]/50 mt-2">
            {(stats?.uniqueVisitors ?? 0) === 1 ? "person" : "people"}
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[#1C0A00]/60 tabular-nums leading-none">
            {stats?.totalViews ?? 0}
          </p>
          <p className="text-xs text-[#1C0A00]/40 mt-2">
            {(stats?.totalViews ?? 0) === 1 ? "page view" : "page views"}
          </p>
        </div>
      </section>

      {showChart && (
        <section className={`${card} p-6`}>
          <h3 className="font-heading text-base font-bold text-[#1C0A00] mb-1">Daily</h3>
          <p className="text-xs text-[#1C0A00]/50 mb-5">
            Bar height is views. The number under it is people.
          </p>
          <div className="flex items-end gap-1.5 overflow-x-auto pb-1">
            {stats!.daily.map((d) => (
              <div key={d.date} className="flex flex-col items-center gap-1.5 min-w-[34px]">
                <span className="text-[10px] text-[#1C0A00]/40 tabular-nums">{d.views}</span>
                <div
                  className="w-full bg-[#A0281A] rounded-t min-h-[3px]"
                  style={{ height: `${(d.views / maxDaily) * 110}px` }}
                  title={`${formatDay(d.date)} — ${d.views} views, ${d.visitors} people`}
                />
                <span className="text-[10px] text-[#1C0A00]/50 tabular-nums">{d.visitors}</span>
                <span className="text-[9px] text-[#1C0A00]/35 whitespace-nowrap">
                  {formatDay(d.date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Order is deliberate: where they came from and what they read are the
          two answers that change what Aditya does next. Place and device are
          context, so they sit below. */}
      <Ranked
        title="Where they came from"
        rows={(stats?.sources ?? []) as StatRow[]}
        empty="Nothing yet."
      />
      <Ranked
        title="What they read"
        rows={(stats?.pages ?? []).map((p) => ({ ...p, label: prettyPath(p.label) }))}
        empty="Nothing yet."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Ranked
          title="Where they are"
          rows={(stats?.places ?? []).map((p: PlaceRow) => ({
            label: placeLabel(p.country, p.city),
            views: p.views,
            visitors: p.visitors,
          }))}
          empty="Nothing yet. Location is unavailable on the dev server."
        />
        <Ranked
          title="Device"
          rows={(stats?.devices ?? []) as StatRow[]}
          empty="Nothing yet."
        />
      </div>

      <LiveFeed recent={recent} />
    </div>
  );
}

function LiveFeed({ recent }: { recent: RecentVisitor[] }) {
  // Re-render on a timer so the "2 min ago" labels stay honest between polls.
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={`${card} p-6`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A0281A] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A0281A]" />
        </span>
        <h3 className="font-heading text-base font-bold text-[#1C0A00]">Last 10 visitors</h3>
      </div>
      <p className="text-xs text-[#1C0A00]/50 mb-5">
        One row per person, newest first. Updates every 15 seconds. Not affected by
        the period above.
      </p>

      {recent.length === 0 ? (
        <p className="text-sm text-[#1C0A00]/40">
          Nobody yet. This fills in as people arrive.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-[#1C0A00]/8">
          {recent.map((v) => (
            <div key={v.visitor_hash} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-[#1C0A00] flex-wrap">
                  <span className="font-medium">{timeAgo(v.last_seen)}</span>
                  <span className="text-[#1C0A00]/30">·</span>
                  <span className="text-[#1C0A00]/70">{v.source ?? "Direct"}</span>
                  <span className="text-[#1C0A00]/30">·</span>
                  <span className="text-[#1C0A00]/70">
                    {placeLabel(v.country, v.city)}
                  </span>
                  <span className="text-[#1C0A00]/30">·</span>
                  <span className="text-[#1C0A00]/70">{v.device ?? "Unknown"}</span>
                </div>
                <span className="text-xs text-[#1C0A00]/40 tabular-nums shrink-0">
                  {v.views} {v.views === 1 ? "page" : "pages"}
                </span>
              </div>
              <p className="text-sm text-[#1C0A00]/55 mt-1.5 break-words">
                {v.paths.slice(0, 6).map(prettyPath).join("  →  ")}
                {v.paths.length > 6 && `  +${v.paths.length - 6} more`}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
