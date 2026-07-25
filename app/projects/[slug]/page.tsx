import { Fragment } from "react";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";

// Performance ads are curated by dropping files into this folder — whatever is
// present (sorted by filename) renders in the HomeLane "Performance Ads" section.
function getPerformanceAds(): string[] {
  const rel = "public/assets/homelane/performance-ads";
  try {
    return fs
      .readdirSync(path.join(process.cwd(), rel))
      .filter((f) => /\.(jpe?g|png|gif|webp|avif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/assets/homelane/performance-ads/${f}`);
  } catch {
    return [];
  }
}
function fileExists(publicRelPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", publicRelPath.replace(/^\//, "")));
  } catch {
    return false;
  }
}

// Renders **highlighted** skim-leads as brighter, semibold spans within body copy.
function renderRich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) => {
    const m = chunk.match(/^\*\*([^*]+)\*\*$/);
    return m ? (
      <strong key={i} className="font-semibold text-[#FFF8F3]">
        {m[1]}
      </strong>
    ) : (
      <span key={i}>{chunk}</span>
    );
  });
}
import VideoEmbed from "@/components/VideoEmbed";
import DeckCarousel from "@/components/DeckCarousel";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/v2/Reveal";
import ScrollProgress from "@/components/v2/ScrollProgress";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const desc = `${project.summary}${project.result ? ` Result: ${project.result}.` : ""} Creative direction by Aditya Gopalka, Delhi.`;
  return {
    title: `${project.title} — Aditya Gopalka | Creative Director, Delhi`,
    description: desc,
    keywords: [
      project.client,
      "Creative Director Delhi",
      "Aditya Gopalka",
      ...project.categories,
    ],
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} — Aditya Gopalka`,
      description: desc,
      type: "article",
      url: `/projects/${project.slug}`,
      images: [{ url: project.coverImage, alt: `${project.title} — ${project.client}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Aditya Gopalka`,
      description: desc,
      images: [project.coverImage],
    },
  };
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.552 4.112 1.52 5.845L.057 23.386a.5.5 0 00.611.61l5.644-1.48A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.937 0-3.75-.525-5.3-1.438l-.38-.222-3.945 1.033 1.053-3.845-.244-.397A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

function GroupHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <Reveal>
      <div className="mb-10">
        <h2 className="text-[#C9956A] text-xs uppercase tracking-[0.35em]">{title}</h2>
        {sub && (
          <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed max-w-3xl mt-4">{sub}</p>
        )}
      </div>
    </Reveal>
  );
}

function SceneHeading({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <Reveal>
      <div className="mb-8">
        {eyebrow && (
          <p className="text-[#C9956A] text-xs uppercase tracking-[0.35em] mb-3">{eyebrow}</p>
        )}
        <h2
          style={{ fontFamily: "var(--font-fraunces)" }}
          className="text-2xl md:text-3xl font-semibold tracking-tight"
        >
          {title}
        </h2>
        {sub && <p className="text-[#FFF8F3]/50 text-sm mt-2">{sub}</p>}
      </div>
    </Reveal>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const { content } = project;
  const whatsappUrl = "https://wa.me/919560501904";
  const performanceAds = project.slug === "homelane" ? getPerformanceAds() : [];

  const SITE = "https://www.adityagopalka.com";
  const projectSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: project.title,
        headline: project.title,
        abstract: project.summary,
        about: project.client,
        genre: project.categories,
        url: `${SITE}/projects/${project.slug}`,
        image: `${SITE}${project.coverImage}`,
        author: {
          "@type": "Person",
          name: "Aditya Gopalka",
          url: SITE,
          jobTitle: project.role,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: project.title,
            item: `${SITE}/projects/${project.slug}`,
          },
        ],
      },
    ],
  };

  const splitIdx = content.imagesAfterSection && content.sections
    ? content.sections.findIndex((s) => s.heading === content.imagesAfterSection)
    : -1;
  const sectionsBeforeImages = splitIdx >= 0 ? content.sections!.slice(0, splitIdx + 1) : (content.sections ?? []);
  const sectionsAfterImages = splitIdx >= 0 ? content.sections!.slice(splitIdx + 1) : [];

  return (
    <main className="v2-root min-h-screen bg-(--v2-ground) text-[#FFF8F3]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <ScrollProgress />

      {/* Header — same language as the reel */}
      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 md:px-12 py-5">
        <Link href="/" className="font-bold tracking-tight text-lg hover:text-[#A0281A] transition-colors">
          MisterGopalka
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex items-center justify-center w-10 h-10 rounded-full border border-[#FFF8F3]/25 text-[#FFF8F3] hover:bg-[#A0281A] hover:border-[#A0281A] transition-colors"
        >
          <WhatsAppIcon />
        </a>
      </header>

      {/* Title card — the scene opener */}
      <section className="relative min-h-[72svh] flex items-end overflow-hidden">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={85}
          />
        )}
        <div className="absolute inset-0 bg-(--v2-ground)/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-(--v2-ground) via-(--v2-ground)/50 to-(--v2-ground)/20" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 pb-14 pt-32">
          <Reveal>
            <Link
              href={`/#${slug}`}
              className="inline-block text-xs uppercase tracking-[0.3em] text-[#FFF8F3]/45 hover:text-[#FFF8F3] transition-colors mb-6"
            >
              ← Back to the work
            </Link>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-[#FFF8F3]/45 text-xs uppercase tracking-[0.25em] mb-4">
              {project.categories.join(" · ")}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <h1
              style={{
                fontFamily: "var(--font-fraunces)",
                textShadow: "0 4px 28px rgba(0,0,0,0.6)",
              }}
              className="font-semibold text-[clamp(2.2rem,6vw,4.8rem)] leading-[1.02] tracking-tight mb-5"
            >
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="text-sm text-[#FFF8F3]/55">
              <span className="text-[#FFF8F3]/35">Client — </span>
              {project.client}
            </p>
            <p className="text-sm text-[#FFF8F3]/55 mt-1">
              <span className="text-[#FFF8F3]/35">Role — </span>
              {project.role}
            </p>
          </Reveal>
          {content.tagline && (
            <Reveal delay={320}>
              <p className="text-xl md:text-2xl text-[#C9956A] font-light mt-6 max-w-2xl">
                {content.tagline}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-10">
        {/* Content sections — first chunk (or all if no imagesAfterSection) */}
        {sectionsBeforeImages.length > 0 && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {sectionsBeforeImages.map((section) => (
                <Reveal key={section.heading}>
                  <div>
                    <h2 className="text-[#C9956A] text-xs uppercase tracking-[0.35em] mb-4">
                      {section.heading}
                    </h2>
                    <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed whitespace-pre-line">
                      {section.body.split(/(\[\[[^\]]+\]\])/g).map((chunk, i) => {
                        const match = chunk.match(/^\[\[([^\]]+)\]\]$/);
                        return match ? (
                          <span key={i} style={{ color: "#E85D45" }}>{match[1]}</span>
                        ) : (
                          <span key={i}>{chunk}</span>
                        );
                      })}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Project images */}
        {content.images && content.images.length > 0 && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.images.map((src, i) => (
                <div key={i} className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                  <Image
                    src={src}
                    alt={`${project.title} — image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={85}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Brand block — vision, mission, tagline */}
        {content.brandBlock && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            <Reveal>
              <h2 className="text-[#C9956A] text-xs uppercase tracking-[0.35em] mb-8">Branding</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
              <Reveal>
                <div>
                  <h3 className="text-[#FFF8F3]/45 text-xs uppercase tracking-[0.2em] mb-3">Vision</h3>
                  <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed">{content.brandBlock.vision}</p>
                </div>
              </Reveal>
              <Reveal>
                <div>
                  <h3 className="text-[#FFF8F3]/45 text-xs uppercase tracking-[0.2em] mb-3">Mission</h3>
                  <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed">{content.brandBlock.mission}</p>
                </div>
              </Reveal>
              <Reveal>
                <div>
                  <h3 className="text-[#FFF8F3]/45 text-xs uppercase tracking-[0.2em] mb-3">Tagline</h3>
                  <p style={{ fontFamily: "var(--font-fraunces)" }} className="text-2xl font-semibold text-[#E85D45] mb-3">
                    {content.brandBlock.tagline}
                  </p>
                  <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed">{content.brandBlock.taglineDesc}</p>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* Content sections — second chunk (only when imagesAfterSection is set) */}
        {sectionsAfterImages.length > 0 && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {sectionsAfterImages.map((section) => (
                <Reveal key={section.heading}>
                  <div>
                    <h2 className="text-[#C9956A] text-xs uppercase tracking-[0.35em] mb-4">
                      {section.heading}
                    </h2>
                    <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed whitespace-pre-line">
                      {section.body.split(/(\[\[[^\]]+\]\])/g).map((chunk, i) => {
                        const match = chunk.match(/^\[\[([^\]]+)\]\]$/);
                        return match ? (
                          <span key={i} style={{ color: "#E85D45" }}>{match[1]}</span>
                        ) : (
                          <span key={i}>{chunk}</span>
                        );
                      })}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Sales Pitch — example email with the Map→Scale framework */}
        {content.salesPitch && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            <Reveal>
              <h2 className="text-[#C9956A] text-xs uppercase tracking-[0.35em] mb-4">The Sales Pitch</h2>
              <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed max-w-3xl mb-8">{content.salesPitch.intro}</p>
            </Reveal>
            <Reveal>
              <div className="max-w-2xl rounded-xl border border-[#FFF8F3]/12 bg-[#FFF8F3]/[0.04] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#FFF8F3]/10">
                  <p className="text-xs uppercase tracking-[0.15em] text-[#FFF8F3]/40 mb-1.5">Subject</p>
                  <p style={{ fontFamily: "var(--font-fraunces)" }} className="text-lg md:text-xl font-semibold text-[#E85D45]">
                    {content.salesPitch.subject}
                  </p>
                </div>
                <div className="px-6 py-6">
                  <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed mb-6">{content.salesPitch.subjectLead}</p>
                  <div>
                    {content.salesPitch.steps.map((s, i) => (
                      <div key={s.step}>
                        <p className="text-[15px] leading-relaxed">
                          <span style={{ fontFamily: "var(--font-fraunces)" }} className="text-[#C9956A] font-semibold">
                            {i + 1}. {s.step}:
                          </span>
                          <span className="text-[#FFF8F3]/70"> {s.desc}</span>
                        </p>
                        {i < content.salesPitch!.steps.length - 1 && (
                          <p className="text-[#FFF8F3]/30 text-center text-sm py-1.5" aria-hidden="true">↓</p>
                        )}
                      </div>
                    ))}
                  </div>
                  {content.salesPitch.closingLine && (
                    <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed mt-7 mb-4">{content.salesPitch.closingLine}</p>
                  )}
                  {content.salesPitch.closingVideoId && (
                    <div className="rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                      <iframe
                        src={`https://www.youtube.com/embed/${content.salesPitch.closingVideoId}`}
                        className="w-full block"
                        style={{ aspectRatio: "16/9" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* Customer Acquisition Funnel — playbook, sales enablement, campaign spotlight */}
        {content.funnelGroups && content.funnelGroups.length > 0 && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            <Reveal>
              <h2 className="text-[#C9956A] text-xs uppercase tracking-[0.35em] mb-4">Customer Acquisition Funnel</h2>
              {content.funnelIntro && (
                <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed max-w-3xl">{content.funnelIntro}</p>
              )}
            </Reveal>

            {/* Marketing Playbook */}
            <div className="mt-16 max-w-3xl">
              <Reveal>
                <h3 style={{ fontFamily: "var(--font-fraunces)" }} className="text-xl md:text-2xl font-semibold text-[#FFF8F3] mb-3">
                  Marketing Playbook
                </h3>
                {content.playbookNote && (
                  <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed mb-8">{content.playbookNote}</p>
                )}
                <DeckCarousel
                  alt="Marketing Playbook"
                  slides={content.funnelGroups.map((group) => (
                    <div key={group.stage} className="p-6 md:p-8">
                      <h4 className="text-[#C9956A] text-xs uppercase tracking-[0.25em] mb-5">{group.stage}</h4>
                      <div className="space-y-5">
                        {group.items.map((item) => (
                          <div key={item.title}>
                            <p className="text-[#FFF8F3] text-sm font-semibold mb-1">{item.title}</p>
                            <p className="text-[#FFF8F3]/65 text-sm leading-relaxed">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                />
              </Reveal>
            </div>

            {/* Sales Enablement */}
            {content.funnelCaseStudy && (
              <div className="mt-20">
                <Reveal>
                  <div className="max-w-3xl">
                    <h3 style={{ fontFamily: "var(--font-fraunces)" }} className="text-xl md:text-2xl font-semibold text-[#FFF8F3] mb-3">
                      {content.funnelCaseStudy.caption}
                    </h3>
                    <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed mb-6">{content.funnelCaseStudy.note}</p>
                    <DeckCarousel images={content.funnelCaseStudy.images} alt="BluSmart case study" />
                  </div>
                </Reveal>
              </div>
            )}

            {/* Campaign Spotlight */}
            {content.campaignSpotlight && (
              <div className="mt-20">
                <Reveal>
                  <div className="max-w-3xl">
                    <h3 style={{ fontFamily: "var(--font-fraunces)" }} className="text-xl md:text-2xl font-semibold text-[#FFF8F3] mb-3">
                      Integrated Campaign
                    </h3>
                    <p className="text-[#C9956A] text-sm font-semibold mb-3">{content.campaignSpotlight.title}</p>
                    <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed whitespace-pre-line">
                      {content.campaignSpotlight.body}
                    </p>
                  </div>
                </Reveal>
              </div>
            )}
          </section>
        )}

        {/* Blanket Wars — staged music release */}
        {content.musicStages &&
          content.musicStages.map((s) => {
            const portraitVids = (s.videos ?? []).filter((v) => v.portrait);
            const landscapeVids = (s.videos ?? []).filter((v) => !v.portrait);
            const videoBlock =
              s.videos && s.videos.length > 0 ? (
                <div className="space-y-4">
                  {landscapeVids.map((v) => (
                    <div key={v.id} className="rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        className="w-full block"
                        style={{ aspectRatio: "16/9" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ))}
                  {portraitVids.length > 0 && (
                    <div className={`grid gap-4 ${portraitVids.length > 1 ? "grid-cols-2 max-w-md" : "max-w-[280px]"}`}>
                      {portraitVids.map((v) => (
                        <div key={v.id} className="rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                          <iframe
                            src={`https://www.youtube.com/embed/${v.id}`}
                            className="w-full block"
                            style={{ aspectRatio: "9/16" }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null;
            const imageBlock =
              s.images && s.images.length > 0 ? (
                <div className={s.images.length === 1 ? "" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                  {s.images.map((src, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                      <SmartImage src={src} alt={`${s.title} — ${i + 1}`} className="w-full h-auto block" />
                    </div>
                  ))}
                </div>
              ) : null;
            const renderMediaInner = (m: NonNullable<typeof s.media>[number]) =>
              m.type === "video" ? (
                <iframe
                  src={`https://www.youtube.com/embed/${m.id}`}
                  className="w-full block"
                  style={{ aspectRatio: m.portrait ? "9/16" : "16/9" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : m.src ? (
                <SmartImage src={m.src} alt={m.caption ?? m.label ?? s.title} className="w-full h-auto block" />
              ) : null;
            const mediaBlock =
              s.media && s.media.length > 0 ? (
                s.mediaLayout === "stack" ? (
                  <div className="space-y-10 max-w-3xl">
                    {s.media.map((m, i) => (
                      <div key={i}>
                        {m.label && <p className="text-[#C9956A] text-xs uppercase tracking-[0.25em] mb-2">{m.label}</p>}
                        {m.desc && <p className="text-[#FFF8F3]/65 text-sm leading-relaxed mb-4 max-w-xl">{m.desc}</p>}
                        <div className={`rounded-xl overflow-hidden border border-[#FFF8F3]/10 ${m.portrait ? "max-w-xs" : ""}`}>
                          {renderMediaInner(m)}
                        </div>
                        {m.caption && <p className="text-[#FFF8F3]/45 text-xs mt-2">{m.caption}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 items-start max-w-2xl">
                    {s.media.map((m, i) => (
                      <div key={i}>
                        <div className="rounded-xl overflow-hidden border border-[#FFF8F3]/10">{renderMediaInner(m)}</div>
                        {m.caption && <p className="text-center text-[#FFF8F3]/45 text-xs mt-2">{m.caption}</p>}
                      </div>
                    ))}
                  </div>
                )
              ) : null;
            return (
              <section key={s.stage} className="py-14 border-t border-[#FFF8F3]/10">
                <Reveal>
                  <p className="text-[#C9956A] text-xs uppercase tracking-[0.35em] mb-3">{s.stage}</p>
                  <h2 style={{ fontFamily: "var(--font-fraunces)" }} className="text-2xl md:text-3xl font-semibold text-[#FFF8F3] mb-4">
                    {s.title}
                  </h2>
                  <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed whitespace-pre-line max-w-3xl">{s.body}</p>
                </Reveal>
                {(mediaBlock || videoBlock || imageBlock) && (
                  <div className="mt-8 space-y-4">
                    {mediaBlock ? (
                      mediaBlock
                    ) : s.videosFirst ? (
                      <>
                        {videoBlock}
                        {imageBlock}
                      </>
                    ) : (
                      <>
                        {imageBlock}
                        {videoBlock}
                      </>
                    )}
                  </div>
                )}
                {s.note && (
                  <Reveal>
                    <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed max-w-3xl mt-8">{s.note}</p>
                  </Reveal>
                )}
                {s.result && (
                  <Reveal>
                    <p style={{ fontFamily: "var(--font-fraunces)" }} className="text-xl md:text-2xl font-light text-[#C9956A] mt-8 max-w-3xl">
                      {s.result}
                    </p>
                  </Reveal>
                )}
                {s.resultImage && (
                  <div className="mt-5 max-w-3xl rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                    <SmartImage src={s.resultImage} alt={`${s.title} result`} className="w-full h-auto block" />
                  </div>
                )}
                {s.link && (
                  <div className="mt-6">
                    <a
                      href={s.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center border border-[#FFF8F3]/25 text-[#FFF8F3]/75 text-sm font-medium px-5 py-2.5 rounded-full hover:border-[#C9956A] hover:text-[#FFF8F3] transition-colors"
                    >
                      {s.link.label}
                    </a>
                  </div>
                )}
              </section>
            );
          })}

        {/* Nexttt One — chapter/part/phase narrative */}
        {content.nextttChapters &&
          content.nextttChapters.map((ch, ci) => (
            <section key={ci} className="py-14 border-t border-[#FFF8F3]/10">
              <Reveal>
                {ch.eyebrow && (
                  <p className="text-[#C9956A] text-xs uppercase tracking-[0.35em] mb-3">{ch.eyebrow}</p>
                )}
                <h2
                  style={{ fontFamily: "var(--font-fraunces)" }}
                  className="text-3xl md:text-4xl font-semibold text-[#FFF8F3] tracking-tight"
                >
                  {ch.title}
                </h2>
              </Reveal>

              {ch.blocks.map((b, bi) => {
                if (b.kind === "sub") {
                  return (
                    <Reveal key={bi}>
                      <h3
                        style={{ fontFamily: "var(--font-fraunces)" }}
                        className={
                          b.deep
                            ? "text-lg md:text-xl font-semibold text-[#FFF8F3] mt-10 mb-3"
                            : "text-xl md:text-2xl font-semibold text-[#C9956A] mt-12 mb-4"
                        }
                      >
                        {b.text}
                      </h3>
                    </Reveal>
                  );
                }
                if (b.kind === "para") {
                  return (
                    <Reveal key={bi}>
                      <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed whitespace-pre-line max-w-3xl mt-5">
                        {renderRich(b.text)}
                      </p>
                    </Reveal>
                  );
                }
                if (b.kind === "list") {
                  return b.ordered ? (
                    <Reveal key={bi}>
                      <ol className="mt-5 space-y-3 max-w-3xl">
                        {b.items.map((it, i) => (
                          <li key={i} className="flex gap-4">
                            <span
                              style={{ fontFamily: "var(--font-fraunces)" }}
                              className="text-[#C9956A] text-lg font-semibold tabular-nums shrink-0 w-6"
                            >
                              {i + 1}
                            </span>
                            <span className="text-[#FFF8F3]/85 text-[15px] leading-relaxed">
                              {renderRich(it)}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </Reveal>
                  ) : (
                    <Reveal key={bi}>
                      <ul className="mt-4 space-y-2 max-w-3xl">
                        {b.items.map((it, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#C9956A]/70 shrink-0" />
                            <span className="text-[#FFF8F3]/85 text-[15px] leading-relaxed">
                              {renderRich(it)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  );
                }
                if (b.kind === "reels") {
                  const vids = b.reels.filter((r) => r.youtube);
                  const links = b.reels.filter((r) => !r.youtube);
                  return (
                    <div key={bi} className="mt-8">
                      <div className="flex flex-wrap gap-4">
                        {vids.map((r) => (
                          <div key={r.url} className="w-full max-w-[260px]">
                            <div className="rounded-xl overflow-hidden border border-[#FFF8F3]/10 aspect-[9/16]">
                              <iframe
                                src={`https://www.youtube.com/embed/${r.youtube}`}
                                className="w-full h-full block"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={`${r.label} reel`}
                              />
                            </div>
                            <p className="text-[#FFF8F3]/55 text-xs mt-2 uppercase tracking-[0.15em]">
                              {r.label}
                            </p>
                          </div>
                        ))}
                      </div>
                      {links.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-5">
                          {links.map((r) => (
                            <a
                              key={r.url}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-2.5 rounded-full border border-[#FFF8F3]/15 pl-3 pr-4 py-2 hover:border-[#C9956A] transition-colors"
                            >
                              <span className="flex items-center justify-center w-6 h-6 rounded-full border border-[#FFF8F3]/25 group-hover:border-[#C9956A] transition-colors shrink-0">
                                <span className="ml-0.5 border-y-[5px] border-y-transparent border-l-[8px] border-l-[#FFF8F3]/70 group-hover:border-l-[#C9956A] transition-colors" />
                              </span>
                              <span className="text-[#FFF8F3]/80 text-sm font-medium group-hover:text-[#FFF8F3] transition-colors">
                                {r.label}
                              </span>
                              <span className="text-[#FFF8F3]/40 text-[11px] uppercase tracking-[0.12em]">
                                Instagram →
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                if (b.kind === "table") {
                  return (
                    <Reveal key={bi}>
                      <div className="mt-8 max-w-3xl overflow-x-auto rounded-xl border border-[#FFF8F3]/10">
                        <table className="w-full text-left border-collapse text-[15px]">
                          <thead>
                            <tr className="bg-[#FFF8F3]/[0.06]">
                              <th className="px-4 py-3 text-[#C9956A] text-xs uppercase tracking-[0.15em] font-medium whitespace-nowrap">
                                {b.firstHead}
                              </th>
                              {b.numHeads.map((h, i) => (
                                <th
                                  key={i}
                                  className="px-4 py-3 text-[#C9956A] text-xs uppercase tracking-[0.15em] font-medium text-right whitespace-nowrap"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {b.rows.map((row, ri) => (
                              <Fragment key={ri}>
                                {row.groupBefore && (
                                  <tr className="border-t border-[#FFF8F3]/10">
                                    <td
                                      colSpan={b.numHeads.length + 1}
                                      className="px-4 pt-4 pb-1 text-[#C9956A]/80 text-[10px] uppercase tracking-[0.25em]"
                                    >
                                      {row.groupBefore}
                                    </td>
                                  </tr>
                                )}
                                <tr className={row.groupBefore ? "" : "border-t border-[#FFF8F3]/10"}>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2.5">
                                      <span className={row.stopped ? "text-[#FFF8F3]/45" : "text-[#FFF8F3]/85"}>
                                        {row.name}
                                      </span>
                                      <span
                                        className={`text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full ${
                                          row.stopped
                                            ? "bg-[#FFF8F3]/[0.06] text-[#FFF8F3]/40"
                                            : "bg-[#C9956A]/15 text-[#C9956A]"
                                        }`}
                                      >
                                        {row.status}
                                      </span>
                                    </div>
                                  </td>
                                  {row.nums.map((n, ni) => (
                                    <td
                                      key={ni}
                                      className={`px-4 py-3 text-right tabular-nums whitespace-nowrap ${
                                        row.stopped ? "text-[#FFF8F3]/40" : "text-[#FFF8F3]/70"
                                      }`}
                                    >
                                      {n}
                                    </td>
                                  ))}
                                </tr>
                              </Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Reveal>
                  );
                }
                if (b.kind === "film") {
                  return (
                    <div key={bi} className="mt-8">
                      {b.label && (
                        <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed mb-3">
                          <strong className="font-semibold text-[#FFF8F3]">{b.label}</strong>
                        </p>
                      )}
                      <div className="rounded-xl overflow-hidden border border-[#FFF8F3]/10 max-w-[280px]">
                        <iframe
                          src={`https://www.youtube.com/embed/${b.id}`}
                          className="w-full block"
                          style={{ aspectRatio: "9/16" }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  );
                }
                if (b.kind === "carousel") {
                  return (
                    <div key={bi} className="mt-6 max-w-3xl">
                      <DeckCarousel images={b.images} alt="Portfolio deck" loop />
                    </div>
                  );
                }
                if (b.kind === "image") {
                  return (
                    <div
                      key={bi}
                      className={`mt-6 ${b.width === "xs" ? "max-w-xs" : b.width === "md" ? "max-w-md" : "max-w-sm"}`}
                    >
                      <div className="rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                        <SmartImage src={b.src} alt="" className="w-full h-auto block" />
                      </div>
                      {b.caption && (
                        <p className="text-[#FFF8F3]/45 text-xs mt-2">{b.caption}</p>
                      )}
                    </div>
                  );
                }
                if (b.kind === "week") {
                  return (
                    <Reveal key={bi}>
                      <div className="mt-8 max-w-3xl rounded-xl border border-[#FFF8F3]/10 overflow-hidden">
                        {b.rows.map((w, i) => (
                          <div
                            key={w.day}
                            className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 px-4 py-3 ${i === 0 ? "" : "border-t border-[#FFF8F3]/10"}`}
                          >
                            <span className="text-[#C9956A] text-xs uppercase tracking-[0.15em] sm:w-52 shrink-0">
                              {w.day}
                            </span>
                            <span className="text-[#FFF8F3]/75 text-[15px]">{w.what}</span>
                          </div>
                        ))}
                      </div>
                    </Reveal>
                  );
                }
                return null;
              })}
            </section>
          ))}

        {/* HomeLane — structured campaign layout */}
        {content.homelane && (
          <div>
            {/* 1. Campaigns */}
            <section className="py-14 border-t border-[#FFF8F3]/10">
              <GroupHeading title="Campaigns" />
              <div className="space-y-16">
                {content.homelane.campaigns.map((c) => (
                  <Reveal key={c.title}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-fraunces)" }} className="text-xl md:text-2xl font-semibold text-[#FFF8F3] mb-6">{c.title}</h3>
                      {c.youtubeId && !c.isShort && (
                        <div className="rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                          <iframe
                            src={`https://www.youtube.com/embed/${c.youtubeId}`}
                            className="w-full block"
                            style={{ aspectRatio: "16/9" }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                      {c.youtubeId && c.isShort && (
                        <div className="rounded-xl overflow-hidden border border-[#FFF8F3]/10 w-[300px]">
                          <iframe
                            src={`https://www.youtube.com/embed/${c.youtubeId}`}
                            className="w-full block"
                            style={{ aspectRatio: "9/16" }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                      {c.videoSrc && (
                        <video controls className="w-full rounded-xl border border-[#FFF8F3]/10">
                          <source src={c.videoSrc} type="video/mp4" />
                        </video>
                      )}
                      {c.images && c.images.length > 0 && (
                        <div className={`grid gap-3 ${c.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                          {c.images.map((src, i) => (
                            <div key={i} className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                              <Image src={src} alt={`${c.title} — ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" quality={85} />
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed max-w-3xl mt-6">{c.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* 2. Brand Extensions */}
            <section className="py-14 border-t border-[#FFF8F3]/10">
              <GroupHeading title="Brand Extensions" sub="Two sub brands launched in my time. I wrote their copy." />
              <div className="space-y-16">
                {content.homelane.brandExtensions.map((b) => (
                  <Reveal key={b.title}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-fraunces)" }} className="text-xl md:text-2xl font-semibold text-[#FFF8F3] mb-3">{b.title}</h3>
                      <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed max-w-3xl mb-6">{b.desc}</p>
                      {b.browserFrame ? (
                        <div className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                          <div className="flex items-center gap-2 bg-[#FFF8F3]/[0.06] px-4 py-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]/70" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]/70" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]/70" />
                            <span className="flex-1 text-center text-xs text-[#FFF8F3]/40 bg-[#FFF8F3]/[0.06] rounded-full px-4 py-1 mx-4 truncate">
                              cubico.homelane.com
                            </span>
                          </div>
                          <DeckCarousel images={b.images} alt={b.title} frameless loop />
                        </div>
                      ) : (
                        <div className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                          {b.images.map((src, i) => (
                            <SmartImage key={i} alt={`${b.title} — ${i + 1}`} src={src} className="w-full h-auto block" />
                          ))}
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* 3. Product Ads */}
            <section className="py-14 border-t border-[#FFF8F3]/10">
              <GroupHeading title="Product Ads" sub="For every home interiors product we installed, we had a PDF that listed its features and cost. I turned them into print ads." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 md:items-start">
                {content.homelane.productAds.map((p) => (
                  <Reveal key={p.product}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-fraunces)" }} className="text-xl md:text-2xl font-semibold text-[#FFF8F3] mb-6">{p.product}</h3>
                      {p.connected ? (
                        <div className="rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                          {p.images.map((src, i) => (
                            <SmartImage key={i} src={src} alt={`${p.product} — ${i + 1}`} className="w-full h-auto block" />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {p.images.map((src, i) => (
                            <SmartImage key={i} src={src} alt={`${p.product} — ${i + 1}`} className="w-full h-auto block rounded-xl border border-[#FFF8F3]/10" />
                          ))}
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* 4. Performance Ads */}
            {(performanceAds.length > 0 || (content.homelane.performanceVideos?.length ?? 0) > 0) && (
              <section className="py-14 border-t border-[#FFF8F3]/10">
                <GroupHeading title="Performance Ads" sub="Meta and Google ads drove HomeLane's revenue. The performance team sent weekly updates: what was working, what was not, and other brand ads that were pulling numbers. I ran my own research too. Then I made the next batch. Statics with the in-house designers. Videos with external editors. A few I cut myself." />
                <div className="columns-2 md:columns-3 gap-3 space-y-3">
                  {content.homelane.performanceVideos?.map((vid) => (
                    <div key={vid} className="break-inside-avoid rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                      <iframe
                        src={`https://www.youtube.com/embed/${vid}`}
                        className="w-full block"
                        style={{ aspectRatio: "9/16" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ))}
                  {performanceAds.map((src, i) => (
                    <div key={src} className="break-inside-avoid rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                      <SmartImage src={src} alt={`Performance ad ${i + 1}`} className="w-full h-auto block" />
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

        {/* Stats */}
        {content.stats && content.stats.length > 0 && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            <Reveal>
              <p className="text-[#C9956A] text-xs uppercase tracking-[0.35em] mb-8">The numbers</p>
            </Reveal>
            <div className={`grid grid-cols-2 gap-x-6 gap-y-10 ${content.stats.length === 4 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {content.stats.map((stat) => (
                <div key={stat.value}>
                  {stat.prefix && (
                    <p className="text-xs uppercase tracking-[0.15em] text-[#FFF8F3]/45 mb-2">{stat.prefix}</p>
                  )}
                  <p style={{ fontFamily: "var(--font-fraunces)" }} className="text-4xl md:text-5xl font-light text-[#C9956A]">{stat.value}</p>
                  {stat.label && (
                    <p className="text-xs uppercase tracking-[0.15em] text-[#FFF8F3]/45 mt-2">{stat.label}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Takeaway — full-width thesis close */}
        {content.keyTakeaway && (
          <section className="py-20 border-t border-[#FFF8F3]/10">
            <Reveal>
              <p
                style={{ fontFamily: "var(--font-fraunces)" }}
                className="text-3xl md:text-5xl leading-tight font-light text-[#C9956A] max-w-4xl"
              >
                {content.keyTakeaway}
              </p>
              {content.keyTakeawayAttribution && (
                <p className="text-sm uppercase tracking-[0.2em] text-[#FFF8F3]/45 mt-5">
                  {content.keyTakeawayAttribution}
                </p>
              )}
            </Reveal>
          </section>
        )}

        {/* Ad copy lines */}
        {content.adCopy && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            <SceneHeading eyebrow="The words" title="The Ads" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.adCopy.lines.map((line, i) => (
                <div
                  key={i}
                  className="rounded-xl p-5 border border-[#FFF8F3]/12 bg-[#FFF8F3]/[0.05] backdrop-blur-sm"
                >
                  <p
                    className="text-sm leading-relaxed text-[#FFF8F3]/85"
                    dangerouslySetInnerHTML={{
                      __html: line.replace(/~~(.+?)~~/g, "<del>$1</del>"),
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Script quote (Troost) */}
        {content.scriptQuote && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            <SceneHeading eyebrow="The words" title="The Script" />
            <blockquote className="border-l-2 border-[#C9956A] pl-6 md:pl-8 text-lg md:text-2xl font-light leading-relaxed whitespace-pre-line text-[#FFF8F3]/90">
              {content.scriptQuote}
            </blockquote>
          </section>
        )}

        {/* Workshop copy (Nexttt One) */}
        {content.workshopCopy && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            <SceneHeading eyebrow="The words" title={'The Copy — "Face the Camera" Workshop'} />
            <p className="text-[#FFF8F3]/80 leading-relaxed whitespace-pre-line font-light text-lg">
              {content.workshopCopy}
            </p>
          </section>
        )}

        {/* Meta ads results (Nexttt One) */}
        {content.metaResults && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            <SceneHeading eyebrow="The numbers" title="Meta Ads Results" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.metaResults.map((r) => (
                <div key={r.label} className="rounded-xl p-5 border border-[#FFF8F3]/12 bg-[#FFF8F3]/[0.05] backdrop-blur-sm">
                  <p className="text-xs text-[#FFF8F3]/45 mb-1">{r.label}</p>
                  <p className="font-medium">{r.value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Strategy pillars (Nexttt One) */}
        {content.strategyPillars && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            <SceneHeading eyebrow="The system" title="5-Pillar Strategic Reboot" />
            <ol className="space-y-4">
              {content.strategyPillars.map((pillar, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#A0281A] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-[#FFF8F3]/75 text-sm leading-relaxed">{pillar}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Videos */}
        {content.videos && content.videos.length > 0 && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            <SceneHeading
              eyebrow={content.videosEyebrow ?? "The film"}
              title={content.videosTitle ?? "Watch"}
            />
            {project.slug === "troost" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {content.videos.map((v) => (
                  <VideoEmbed
                    key={v.id}
                    videoId={v.id}
                    type={v.type}
                    label={v.label}
                    fbUrl={v.fbUrl}
                    fbViews={v.fbViews}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {content.videos.map((v) => (
                  <VideoEmbed
                    key={v.id}
                    videoId={v.id}
                    type={v.type}
                    label={v.label}
                    fbUrl={v.fbUrl}
                    fbViews={v.fbViews}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Spotify */}
        {content.spotifyTrackId && (
          <section className="py-14 border-t border-[#FFF8F3]/10">
            {content.spotifyCopy ? (
              <>
                <h2 className="text-[#C9956A] text-xs uppercase tracking-[0.35em] mb-4">The Song</h2>
                <Reveal>
                  <p className="text-[#FFF8F3]/75 text-[15px] leading-relaxed mb-8 max-w-3xl">
                    {content.spotifyCopy}
                  </p>
                </Reveal>
              </>
            ) : (
              <SceneHeading eyebrow="The sound" title="Listen" />
            )}
            {content.spotifyImage && (
              <div className="mb-8 max-w-2xl rounded-xl overflow-hidden border border-[#FFF8F3]/10">
                <SmartImage
                  src={content.spotifyImage}
                  alt="Blanket Wars — the idea behind the song"
                  className="w-full h-auto block"
                />
              </div>
            )}
            <VideoEmbed videoId={content.spotifyTrackId} type="spotify" />
            {content.songYoutubeUrl && (
              <div className="mt-6">
                <a
                  href={content.songYoutubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border border-[#FFF8F3]/25 text-[#FFF8F3]/75 text-sm font-medium px-5 py-2.5 rounded-full hover:border-[#C9956A] hover:text-[#FFF8F3] transition-colors"
                >
                  Watch on YouTube →
                </a>
              </div>
            )}
          </section>
        )}

        {/* Closing scene — CTA */}
        <section className="py-20 border-t border-[#FFF8F3]/10">
          <Reveal>
            <p className="text-[#C9956A] text-xs uppercase tracking-[0.35em] mb-5">Next scene</p>
            <h2
              style={{ fontFamily: "var(--font-fraunces)" }}
              className="font-semibold text-[clamp(1.8rem,5vw,3.5rem)] tracking-tight mb-8"
            >
              Let&apos;s build something together.
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/#${slug}`}
                className="inline-flex items-center gap-2 border border-[#FFF8F3]/25 text-[#FFF8F3]/80 font-medium px-6 py-3 rounded-full hover:border-[#FFF8F3]/60 hover:text-[#FFF8F3] transition-colors"
              >
                ← See more work
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#A0281A] text-white font-medium px-6 py-3 rounded-full hover:bg-[#8B1F13] transition-colors"
              >
                <WhatsAppIcon />
                Let&apos;s connect
              </a>
            </div>
          </Reveal>
        </section>

        {/* Extra links */}
        {content.extraLinks && content.extraLinks.length > 0 && (
          <section className="py-10 border-t border-[#FFF8F3]/10">
            <div className="flex flex-wrap gap-3">
              {content.extraLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border border-[#FFF8F3]/25 text-[#FFF8F3]/75 text-sm font-medium px-5 py-2.5 rounded-full hover:border-[#C9956A] hover:text-[#FFF8F3] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
