"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Submission } from "@/lib/inbox";
import type { VisitorStats } from "@/lib/analytics";

interface Props {
  submissions: Submission[];
  stats: VisitorStats | null;
  projects: { slug: string; title: string; visible: boolean }[];
}

type Tab = "inbox" | "visitors" | "projects";

// Explicit timeZone so the server and the browser format identically and
// hydration does not mismatch. Aditya reads these in IST.
const IST = "Asia/Kolkata";

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

function prettyPath(path: string) {
  if (path === "/") return "Home";
  return path.replace(/^\/projects\//, "").replace(/-/g, " ");
}

const card = "rounded-2xl border border-[#1C0A00]/10 bg-[#FFF8F3] shadow-md";

export default function AdminPanel({ submissions, stats, projects }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("inbox");
  const [visibility, setVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(projects.map((p) => [p.slug, p.visible]))
  );
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const unread = submissions.filter((s) => !s.read_at).length;

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
    { id: "visitors", label: "Visitors" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
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
                    tab === t.id ? "bg-white/25 text-white" : "bg-[#A0281A] text-white"
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
        <Inbox submissions={submissions} busy={busy} onAction={inboxAction} />
      )}
      {tab === "visitors" && <Visitors stats={stats} />}
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
}: {
  submissions: Submission[];
  busy: boolean;
  onAction: (id: string, action: string) => void;
}) {
  if (submissions.length === 0) {
    return (
      <div className={`${card} p-8`}>
        <p className="text-sm text-[#1C0A00]/50">
          No messages yet. Anything sent through the form on the site lands here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {submissions.map((s) => {
        const unread = !s.read_at;
        return (
          <article
            key={s.id}
            className={`${card} p-6 ${unread ? "border-l-4 border-l-[#A0281A]" : ""}`}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#1C0A00]">
                  {s.name}
                  {unread && (
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
                onClick={() => onAction(s.id, s.archived_at ? "unarchive" : "archive")}
                className="text-[#1C0A00]/50 hover:text-[#A0281A] transition-colors disabled:opacity-40"
              >
                {s.archived_at ? "Unarchive" : "Archive"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className={`${card} p-5`}>
      <p className="text-3xl font-bold text-[#1C0A00]">{value}</p>
      <p className="text-xs text-[#1C0A00]/50 mt-1">{label}</p>
    </div>
  );
}

function Breakdown({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: { label: string; views: number }[];
  empty: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.views));
  return (
    <section className={`${card} p-6`}>
      <h3 className="font-heading text-base font-bold text-[#1C0A00] mb-4">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-[#1C0A00]/40">{empty}</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {rows.slice(0, 8).map((r) => (
            <div key={r.label} className="flex items-center gap-3">
              <span className="text-sm text-[#1C0A00]/75 w-40 shrink-0 truncate capitalize">
                {r.label}
              </span>
              <div className="flex-1 h-2 bg-[#1C0A00]/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A0281A] rounded-full"
                  style={{ width: `${(r.views / max) * 100}%` }}
                />
              </div>
              <span className="text-sm text-[#1C0A00]/50 w-10 text-right tabular-nums">
                {r.views}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Visitors({ stats }: { stats: VisitorStats | null }) {
  if (!stats) {
    return (
      <div className={`${card} p-8`}>
        <p className="text-sm text-[#1C0A00]/50">
          Visitor data is unavailable. Check that SUPABASE_SERVICE_ROLE_KEY is set.
        </p>
      </div>
    );
  }

  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.views));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Visitors today" value={stats.visitorsToday} />
        <Stat label="Views today" value={stats.viewsToday} />
        <Stat label="Visitors, 30 days" value={stats.uniqueVisitors} />
        <Stat label="Views, 30 days" value={stats.totalViews} />
      </div>

      <section className={`${card} p-6`}>
        <h3 className="font-heading text-base font-bold text-[#1C0A00] mb-1">Daily</h3>
        <p className="text-xs text-[#1C0A00]/50 mb-5">
          Bar height is views. The number under it is distinct visitors.
        </p>
        {stats.daily.length === 0 ? (
          <p className="text-sm text-[#1C0A00]/40">
            Nothing recorded yet. Counting starts when this goes live.
          </p>
        ) : (
          <div className="flex items-end gap-1.5 overflow-x-auto pb-1">
            {stats.daily.map((d) => (
              <div key={d.date} className="flex flex-col items-center gap-1.5 min-w-[34px]">
                <span className="text-[10px] text-[#1C0A00]/40 tabular-nums">{d.views}</span>
                <div
                  className="w-full bg-[#A0281A] rounded-t min-h-[3px]"
                  style={{ height: `${(d.views / maxDaily) * 110}px` }}
                  title={`${formatDay(d.date)} — ${d.views} views, ${d.visitors} visitors`}
                />
                <span className="text-[10px] text-[#1C0A00]/50 tabular-nums">{d.visitors}</span>
                <span className="text-[9px] text-[#1C0A00]/35 whitespace-nowrap">
                  {formatDay(d.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Breakdown
          title="Most-read pages"
          rows={stats.topPaths.map((p) => ({ label: prettyPath(p.path), views: p.views }))}
          empty="No pages recorded yet."
        />
        <Breakdown
          title="Where they came from"
          rows={stats.topReferrers.map((r) => ({ label: r.referrer, views: r.views }))}
          empty="No referrers yet. Direct visits and typed URLs report nothing."
        />
      </div>

      <Breakdown
        title="Device"
        rows={stats.devices.map((d) => ({ label: d.device, views: d.views }))}
        empty="No devices recorded yet."
      />
    </div>
  );
}
