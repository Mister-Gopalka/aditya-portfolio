import AdminPanel from "@/components/AdminPanel";
import { getFontPairing, getProjectVisibility, getHeroPhotoSettings } from "@/lib/supabase";
import { projects } from "@/lib/projects";

export default async function AdminPage() {
  const currentPairing = await getFontPairing();
  const visibilityMap = await getProjectVisibility();
  const heroPhoto = await getHeroPhotoSettings();

  const projectList = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    visible: visibilityMap[p.slug] !== undefined ? visibilityMap[p.slug] : p.visible,
  }));

  return (
    <div className="min-h-screen bg-[#FFF8F3]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <a href="/" className="text-sm text-[#1C0A00]/50 hover:text-[#A0281A] transition-colors">
          ← Back to site
        </a>
        <h1 className="font-heading text-3xl font-bold text-[#1C0A00] mt-4 mb-2">Admin Panel</h1>
        <p className="text-[#1C0A00]/50 text-sm mb-10">Manage font pairings and project visibility.</p>
        <AdminPanel currentPairing={currentPairing} projects={projectList} heroPhoto={heroPhoto} />
      </div>
    </div>
  );
}
