import { cookies } from "next/headers";
import AdminPanel from "@/components/AdminPanel";
import AdminLogin from "@/components/AdminLogin";
import { getProjectVisibility } from "@/lib/supabase";
import { listSubmissions } from "@/lib/inbox";
import { DEFAULT_PERIOD, getRecentVisitors, getVisitorStats } from "@/lib/analytics";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { projects } from "@/lib/projects";

// Always render fresh: an inbox that serves a cached copy would hide new
// messages, which is the exact failure this panel exists to fix.
export const dynamic = "force-dynamic";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authed = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);

  return (
    <div className="min-h-screen bg-[#FFF8F3]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <a href="/" className="text-sm text-[#1C0A00]/50 hover:text-[#A0281A] transition-colors">
          ← Back to site
        </a>
        <h1 className="font-heading text-3xl font-bold text-[#1C0A00] mt-4 mb-2">Admin Panel</h1>
        <p className="text-[#1C0A00]/50 text-sm mb-10">
          Messages from the site, who has been visiting, and what the homepage shows.
        </p>

        {/* Nothing below is fetched, let alone rendered, without a valid
            session. The password check happens before any query runs. */}
        {authed ? <AuthedPanel /> : <AdminLogin />}
      </div>
    </div>
  );
}

async function AuthedPanel() {
  // Archived messages are fetched too — the Archive tab renders from the same
  // list, so archiving does not need a second round trip.
  const [visibilityMap, submissions, stats, recent] = await Promise.all([
    getProjectVisibility(),
    listSubmissions(true),
    getVisitorStats(DEFAULT_PERIOD),
    getRecentVisitors(10),
  ]);

  const projectList = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    visible: visibilityMap[p.slug] !== undefined ? visibilityMap[p.slug] : p.visible,
  }));

  return (
    <AdminPanel
      submissions={submissions}
      stats={stats}
      recent={recent}
      projects={projectList}
    />
  );
}
