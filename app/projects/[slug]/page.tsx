import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";
import VideoEmbed from "@/components/VideoEmbed";
import CopyLinesSectionClient from "@/components/CopyLinesSection";
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
  return {
    title: `${project.title} — Aditya Gopalka`,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
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

  return (
    <div className="min-h-screen bg-[#FFF8F3]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back nav */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#1C0A00]/60 hover:text-[#E8604A] transition-colors mb-8"
        >
          ← All work
        </Link>

        {/* Project header card */}
        <div className="rounded-2xl p-8 md:p-10 bg-[#1C0A00] text-[#FFF8F3] mb-6 shadow-md">
          <div className="flex gap-2 mb-4 flex-wrap">
            {project.categories.map((cat) => (
              <span
                key={cat}
                className="text-xs font-medium bg-[#F4A435]/30 text-[#F4A435] px-3 py-0.5 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold leading-tight mb-3">
            {project.title}
          </h1>
          <p className="text-[#FFF8F3]/60 text-sm mb-1">
            <span className="text-[#FFF8F3]/40">Client: </span>
            {project.client}
          </p>
          <p className="text-[#FFF8F3]/60 text-sm">
            <span className="text-[#FFF8F3]/40">Role: </span>
            {project.role}
          </p>
          {content.tagline && (
            <p className="font-heading text-xl md:text-2xl text-[#F4A435] mt-5 italic">
              {content.tagline}
            </p>
          )}
        </div>

        {/* Cover image */}
        {project.coverImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 shadow-md bg-[#1C0A00]/5">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              quality={85}
            />
          </div>
        )}

        {/* Content sections */}
        {content.sections && content.sections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {content.sections.map((section) => (
              <div
                key={section.heading}
                className="rounded-2xl p-6 md:p-8 bg-[#FFF8F3] border border-[#1C0A00]/10 shadow-md"
              >
                <h2 className="font-heading text-lg font-bold text-[#E8604A] mb-3">
                  {section.heading}
                </h2>
                <p className="text-[#1C0A00]/80 text-sm leading-relaxed whitespace-pre-line">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {content.stats && content.stats.length > 0 && (
          <div className="rounded-2xl p-6 md:p-8 bg-[#F4A435]/10 border border-[#F4A435]/30 mb-6 shadow-md">
            <h2 className="font-heading text-xl font-bold text-[#1C0A00] mb-5">Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {content.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-bold text-[#E8604A]">{stat.value}</p>
                  <p className="text-xs text-[#1C0A00]/60 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ad copy lines */}
        {content.adCopy && (
          <div className="rounded-2xl p-6 md:p-8 bg-[#FFF8F3] border border-[#1C0A00]/10 mb-6 shadow-md">
            <h2 className="font-heading text-xl font-bold text-[#1C0A00] mb-5">The Ads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.adCopy.lines.map((line, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 bg-[#1C0A00] text-[#FFF8F3]"
                >
                  <p
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: line.replace(/~~(.+?)~~/g, "<del>$1</del>"),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Script quote (Troost) */}
        {content.scriptQuote && (
          <div className="rounded-2xl p-6 md:p-8 bg-[#1C0A00] text-[#FFF8F3] mb-6 shadow-md">
            <h2 className="font-heading text-xl font-bold text-[#F4A435] mb-4">The Script</h2>
            <blockquote className="font-heading text-lg md:text-xl italic leading-relaxed whitespace-pre-line text-[#FFF8F3]/90">
              {content.scriptQuote}
            </blockquote>
          </div>
        )}

        {/* Workshop copy (Nexttt One) */}
        {content.workshopCopy && (
          <div className="rounded-2xl p-6 md:p-8 bg-[#FFF8F3] border border-[#1C0A00]/10 mb-6 shadow-md">
            <h2 className="font-heading text-xl font-bold text-[#E8604A] mb-4">
              The Copy — "Face the Camera" Workshop
            </h2>
            <p className="text-[#1C0A00]/80 leading-relaxed whitespace-pre-line italic">
              {content.workshopCopy}
            </p>
          </div>
        )}

        {/* Meta ads results (Nexttt One) */}
        {content.metaResults && (
          <div className="rounded-2xl p-6 md:p-8 bg-[#F4A435]/10 border border-[#F4A435]/30 mb-6 shadow-md">
            <h2 className="font-heading text-xl font-bold text-[#1C0A00] mb-5">Meta Ads Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.metaResults.map((r) => (
                <div key={r.label} className="rounded-xl p-4 bg-white/60">
                  <p className="text-xs text-[#1C0A00]/50 mb-1">{r.label}</p>
                  <p className="font-medium text-[#1C0A00]">{r.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategy pillars (Nexttt One) */}
        {content.strategyPillars && (
          <div className="rounded-2xl p-6 md:p-8 bg-[#FFF8F3] border border-[#1C0A00]/10 mb-6 shadow-md">
            <h2 className="font-heading text-xl font-bold text-[#1C0A00] mb-5">
              5-Pillar Strategic Reboot
            </h2>
            <ol className="space-y-3">
              {content.strategyPillars.map((pillar, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E8604A] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-[#1C0A00]/80 text-sm leading-relaxed">{pillar}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Copy lines grid (Black Water Bottle) */}
        {content.copyLines && (
          <CopyLinesSectionClient lines={content.copyLines} />
        )}

        {/* Project images */}
        {content.images && content.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {content.images.map((src, i) => (
              <div key={i} className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md bg-[#1C0A00]/5">
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
        )}

        {/* Videos */}
        {content.videos && content.videos.length > 0 && (
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-[#1C0A00] mb-5">Watch</h2>
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
          </div>
        )}

        {/* Spotify */}
        {content.spotifyTrackId && (
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-[#1C0A00] mb-5">Listen</h2>
            <VideoEmbed videoId={content.spotifyTrackId} type="spotify" label="Blanket Wars" />
          </div>
        )}

        {/* Extra links */}
        {content.extraLinks && content.extraLinks.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {content.extraLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-[#FFF8F3] border border-[#1C0A00]/20 text-[#1C0A00] text-sm font-medium px-4 py-2 rounded-full hover:border-[#E8604A] hover:text-[#E8604A] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* CTA card */}
        <div className="rounded-2xl p-8 md:p-10 bg-[#E8604A] text-white mt-8 shadow-md">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">
            Like what you see?
          </h2>
          <p className="text-white/80 mb-6">Let's build something together.</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#E8604A] font-medium px-6 py-3 rounded-full hover:bg-[#FFF8F3] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.552 4.112 1.52 5.845L.057 23.386a.5.5 0 00.611.61l5.644-1.48A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.937 0-3.75-.525-5.3-1.438l-.38-.222-3.945 1.033 1.053-3.845-.244-.397A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Open WhatsApp →
          </a>
        </div>
      </div>
    </div>
  );
}
