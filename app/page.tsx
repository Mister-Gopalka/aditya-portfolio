import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { projects, Project } from "@/lib/projects";
import { getProjectVisibility } from "@/lib/supabase";
import Reveal from "@/components/v2/Reveal";
import SideNav from "@/components/v2/SideNav";
import SwipeCard from "@/components/v2/SwipeCard";
import ContactScene from "@/components/v2/ContactScene";
import LiteYouTube from "@/components/v2/LiteYouTube";

const CAPABILITIES = [
  "Copywriting & Scripts",
  "Ad Film Direction",
  "Brand Strategy",
  "Product Marketing",
  "Meta Ads",
  "Lead Gen & Sales",
  "AI & Automation",
  "Team Leadership",
];

const BRANDS = [
  "OYO",
  "HomeLane",
  "Vinod Chopra Films",
  "Wunderman Thompson (VML)",
  "L&K Saatchi & Saatchi",
  "Big Muscles",
  "AB InBev",
  "Lowe Lintas",
  "BeatO",
  "Nepal General Election",
];

const WHATSAPP_URL = "https://wa.me/919560501904";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.552 4.112 1.52 5.845L.057 23.386a.5.5 0 00.611.61l5.644-1.48A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.937 0-3.75-.525-5.3-1.438l-.38-.222-3.945 1.033 1.053-3.845-.244-.397A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

// The video that plays in each card. Vertical = 9:16 Shorts framed like a phone.
const SCENE_MEDIA: Record<string, { youtubeId?: string; mp4?: string; vertical?: boolean }> = {
  troost: { youtubeId: "3AR0LwkH-kY", vertical: true }, // "Come back story"
  "zero-se-restart": { youtubeId: "qdpquhyZaoY" },
  "big-muscles": { youtubeId: "9jtVAy4pSRA" },
  homelane: { youtubeId: "O0iYoiDberU" },
  "nepal-election": { youtubeId: "1qzrExsy2bQ" },
  lepton: { youtubeId: "ZyC9cvJwfMU" },
  "blanket-wars": { youtubeId: "A9IijGc-AMU" },
  beato: { youtubeId: "w_7O2hBdSPY" },
  "nexttt-one": { youtubeId: "dXEX4jdIZcQ", vertical: true },
};

// Short labels for the side-nav rail
const SCENE_NAV: Record<string, string> = {
  troost: "Troost",
  "zero-se-restart": "12th Fail",
  "big-muscles": "Big Muscles",
  oyo: "OYO",
  homelane: "HomeLane",
  "nepal-election": "Nepal",
  lepton: "Lepton",
  "blanket-wars": "Blanket Wars",
  beato: "BeatO",
  "nexttt-one": "Nexttt One",
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  const media = SCENE_MEDIA[project.slug] ?? {};
  const frameClass = media.vertical
    ? "relative aspect-[9/16] w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-[#FFF8F3]/10"
    : "relative aspect-video rounded-2xl overflow-hidden border border-[#FFF8F3]/10";

  return (
    <section
      id={project.slug}
      data-nav-label={SCENE_NAV[project.slug] ?? project.title}
      className="scroll-mt-24 px-5 md:px-6 py-6 md:py-10 flex justify-center"
    >
      <SwipeCard href={`/projects/${project.slug}`}>
        <article className="group relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#FFF8F3]/12 bg-[#FFF8F3]/[0.05] backdrop-blur-md shadow-[0_32px_70px_-18px_rgba(0,0,0,0.85)]">
          {/* Glossy top sheen — laminated paper, not wet glass */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/8 to-transparent" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center p-6 md:p-10">
            {/* Media — plays in place */}
            <Reveal className={`order-first ${flip ? "md:order-first" : "md:order-last"}`}>
              <div className={frameClass}>
                {media.youtubeId ? (
                  <LiteYouTube videoId={media.youtubeId} title={project.title} />
                ) : media.mp4 ? (
                  <video
                    controls
                    preload="none"
                    poster={project.coverImage}
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src={media.mp4} type="video/mp4" />
                  </video>
                ) : (
                  <Link href={`/projects/${project.slug}`} className="absolute inset-0 block">
                    <Image
                      src={project.coverImage}
                      alt={`${project.title} — ${project.client}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={85}
                    />
                  </Link>
                )}
              </div>
            </Reveal>

            {/* Text */}
            <Link href={`/projects/${project.slug}`} className={`block ${flip ? "md:text-right" : ""}`}>
              <Reveal>
                <p className="font-[family-name:var(--font-fraunces)] font-light text-[clamp(2.5rem,5vw,4rem)] leading-none text-[#C9956A]/50 mb-1">
                  {String(index + 1).padStart(2, "0")}
                </p>
              </Reveal>
              <Reveal delay={80}>
                <p className="text-[#FFF8F3]/55 text-xs uppercase tracking-[0.3em] mb-5">
                  {project.categories.join(" · ")}
                </p>
              </Reveal>
              <Reveal delay={160}>
                <h2
                  style={{ fontFamily: "var(--font-fraunces)" }}
                  className="font-semibold text-[clamp(1.7rem,3.4vw,2.9rem)] leading-[1.05] tracking-tight text-[#FFF8F3] mb-4 group-hover:text-[#C9956A] transition-colors duration-300"
                >
                  {project.title}
                </h2>
              </Reveal>
              <Reveal delay={240}>
                <p className="text-sm text-[#FFF8F3]/60 mb-5">{project.client}</p>
              </Reveal>
              <Reveal delay={320}>
                <p className={`text-base text-[#FFF8F3]/80 leading-relaxed mb-6 max-w-xl ${flip ? "md:ml-auto" : ""}`}>
                  {project.summary}
                </p>
              </Reveal>
              {project.result && (
                <Reveal delay={400}>
                  <p className="text-sm font-medium text-[#C9956A] mb-8">↗ {project.result}</p>
                </Reveal>
              )}
              <Reveal delay={480}>
                <span className="inline-block text-sm text-[#FFF8F3]/70 border-b border-[#FFF8F3]/25 pb-1 group-hover:text-[#FFF8F3] group-hover:border-[#C9956A] transition-colors duration-300">
                  View the full story →
                </span>
              </Reveal>
            </Link>
          </div>
        </article>
      </SwipeCard>
    </section>
  );
}

// Homepage card order — sequenced for a hiring reader (leadership/range first,
// then browsable). Change this list to reorder cards; any slug not listed falls
// to the end.
const CARD_ORDER = [
  "homelane",
  "oyo",
  "nexttt-one",
  "nepal-election",
  "lepton",
  "beato",
  "troost",
  "zero-se-restart",
  "big-muscles",
  "blanket-wars",
];

const cardRank = (slug: string) => {
  const i = CARD_ORDER.indexOf(slug);
  return i === -1 ? CARD_ORDER.length : i;
};

export default async function HomePage() {
  const visibilityMap = await getProjectVisibility();

  const visibleProjects = projects
    .filter((p) =>
      visibilityMap[p.slug] !== undefined ? visibilityMap[p.slug] : p.visible
    )
    .sort((a, b) => cardRank(a.slug) - cardRank(b.slug));

  const tickerLine = BRANDS.join("  ·  ") + "  ·  ";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aditya Gopalka",
    jobTitle: ["Creative Director", "Brand Manager", "Copywriter", "Fractional CMO"],
    description:
      "Creative Director, Brand Manager, and Fractional CMO based in Delhi, India. Specialises in brand strategy, ad films, and creative direction.",
    url: "https://www.adityagopalka.com",
    image: "https://www.adityagopalka.com/assets/aditya-photo.jpg",
    email: "mistergopalka@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Delhi",
      addressCountry: "IN",
    },
    knowsAbout: [
      "Creative Direction",
      "Copywriting",
      "Brand Strategy",
      "Ad Film Direction",
      "Product Marketing",
      "Digital Marketing",
      "Performance Marketing",
      "Content Strategy",
    ],
    worksFor: [
      { "@type": "Organization", name: "OYO" },
      { "@type": "Organization", name: "HomeLane" },
      { "@type": "Organization", name: "Vinod Chopra Films" },
      { "@type": "Organization", name: "Wunderman Thompson" },
      { "@type": "Organization", name: "L&K Saatchi & Saatchi" },
    ],
    sameAs: [
      "https://www.linkedin.com/in/adityagopalka/",
      "https://www.instagram.com/adityagopalka/",
      "https://www.youtube.com/@MisterGopalka",
      "https://linktr.ee/adityagopalka",
      "https://adityagopalka.wordpress.com",
    ],
  };

  return (
    <main
      className="v2-root min-h-screen text-[#FFF8F3]"
      style={{
        background:
          "radial-gradient(140% 100% at 50% 0%, #1A0C04 0%, #120600 45%, #0B0300 100%)",
      }}
    >
      <Script
        id="schema-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <SideNav />

      {/* Brand ticker — the credits strip, at the very top */}
      <div className="overflow-hidden py-2.5 border-b border-[#FFF8F3]/10">
        <div className="v2-marquee whitespace-nowrap text-[11px] uppercase tracking-[0.25em] text-[#FFF8F3]/40">
          {tickerLine}
          {tickerLine}
        </div>
      </div>

      {/* Header — wordmark + WhatsApp logo only (over the dark hero) */}
      <header className="absolute top-10 inset-x-0 z-20 flex items-center justify-between px-6 md:px-12 py-5">
        <a
          href="mailto:mistergopalka@gmail.com"
          aria-label="Email Aditya Gopalka"
          className="font-bold tracking-tight text-lg text-[#FFF8F3] hover:text-[#A0281A] transition-colors"
        >
          MisterGopalka
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex items-center justify-center w-10 h-10 rounded-full border border-[#FFF8F3]/25 text-[#FFF8F3] hover:bg-[#A0281A] hover:border-[#A0281A] transition-colors"
        >
          <WhatsAppIcon />
        </a>
      </header>

      {/* Hero — the dark cover of the monograph */}
      <section
        id="top"
        data-nav-label="Top"
        className="relative min-h-[94svh] flex items-end overflow-hidden bg-[#120600]"
      >
        <Image
          src="/assets/aditya-photo.jpg"
          alt="Aditya Gopalka — Creative Director, Delhi"
          fill
          className="object-cover"
          style={{ objectPosition: "68% 12%" }}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120600] via-[#120600]/65 to-[#120600]/25" />

        {/* Kicker — printed in espresso ink on the light wall, echoing the
            ticker band, on every screen size. Positioned above the hairline. */}
        <div className="absolute top-16 md:top-36 inset-x-0 z-10 px-6 md:px-12">
          <Reveal>
            <p className="text-[11px] md:text-sm font-medium uppercase tracking-[0.2em] md:tracking-[0.3em] leading-[1.15] md:leading-snug text-[#120600]">
              Shaping&nbsp;brands, people&nbsp;&amp;&nbsp;life into&nbsp;stories since&nbsp;2015
            </p>
          </Reveal>
        </div>

        <div className="relative z-10 w-full px-6 md:px-12 pb-24 text-[#FFF8F3]">
          <Reveal delay={100}>
            <h1
              style={{
                fontFamily: "var(--font-fraunces)",
                textShadow: "0 4px 28px rgba(0,0,0,0.6)",
              }}
              className="font-semibold text-[clamp(3.2rem,9.5vw,8rem)] leading-[0.95] tracking-tight text-[#FFF8F3] mb-8"
            >
              Aditya
              <br />
              Gopalka
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p
              className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#FFF8F3]/95 mb-8"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.85)" }}
            >
              Creative{" "}Director · Brand{" "}Manager · Fractional{" "}CMO
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div
              className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs md:text-[13px] text-[#FFF8F3]/55 leading-relaxed max-w-2xl mb-4"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
            >
              {CAPABILITIES.map((cap, i) => (
                <span key={cap} className="contents">
                  <span className="whitespace-nowrap flex items-center gap-2">
                    {cap}
                    {i < CAPABILITIES.length - 1 && <span aria-hidden="true">·</span>}
                  </span>
                  {/* Force a line break after the 4th item, desktop only — flex
                      full-width spacer trick. Mobile wraps naturally between
                      whole phrases instead (each phrase above is nowrap). */}
                  {i === 3 && (
                    <span className="hidden md:block basis-full h-0" aria-hidden="true" />
                  )}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={400}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#FFF8F3]/35">
              Delhi · Mumbai · Remote
            </p>
          </Reveal>
        </div>

        <div className="v2-bounce absolute bottom-5 left-1/2 z-10 text-[10px] uppercase tracking-[0.35em] text-[#FFF8F3]/40">
          Scroll
        </div>
      </section>

      {/* The work — glass cards, swipe right to open */}
      <div className="pt-4 pb-10">
        {visibleProjects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      {/* Final scene — contact, on the same continuous ground */}
      <div id="contact" data-nav-label="Contact" className="scroll-mt-24">
        <ContactScene />
        <p className="text-center text-xs text-[#FFF8F3]/30 py-8">
          © {new Date().getFullYear()} · Built by Aditya Gopalka
        </p>
      </div>
    </main>
  );
}
