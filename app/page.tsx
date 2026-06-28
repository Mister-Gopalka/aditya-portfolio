import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectGrid from "@/components/ProjectGrid";
import { projects } from "@/lib/projects";
import { getProjectVisibility } from "@/lib/supabase";

export default async function HomePage() {
  const visibilityMap = await getProjectVisibility();

  const mergedProjects = projects.map((p) => ({
    ...p,
    visible: visibilityMap[p.slug] !== undefined ? visibilityMap[p.slug] : p.visible,
  }));

  const whatsappUrl = `https://wa.me/919560501904`;

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Card */}
        <section className="max-w-5xl mx-auto px-4 py-10">
          <div className="rounded-2xl p-8 md:p-12 bg-[#1C0A00] text-[#FFF8F3] shadow-md">
            <p className="text-[#F4A435] text-sm font-medium mb-4 tracking-wide uppercase">
              Available for work
            </p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-4">
              Aditya Gopalka
            </h1>
            <p className="text-[#FFF8F3]/70 text-lg md:text-xl mb-2">
              Creative Director · Copywriter · Campaign Director
            </p>
            <p className="text-[#FFF8F3]/50 text-sm md:text-base mb-8">
              Available for campaigns, ads and direction projects. Delhi, Mumbai and remote.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#E8604A] text-white font-medium px-6 py-3 rounded-full hover:bg-[#d4513c] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.552 4.112 1.52 5.845L.057 23.386a.5.5 0 00.611.61l5.644-1.48A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.937 0-3.75-.525-5.3-1.438l-.38-.222-3.945 1.033 1.053-3.845-.244-.397A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Let's talk on WhatsApp
            </a>
          </div>
        </section>

        <ProjectGrid projects={mergedProjects} />
      </main>
      <Footer />
    </>
  );
}
