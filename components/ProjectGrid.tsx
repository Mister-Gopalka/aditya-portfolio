"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Project, Category } from "@/lib/projects";

const TABS: ("All" | Category)[] = ["All", "Ads", "Copy", "Campaigns"];

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [active, setActive] = useState<"All" | Category>("All");

  const filtered =
    active === "All"
      ? projects.filter((p) => p.visible)
      : projects.filter((p) => p.visible && p.categories.includes(active));

  return (
    <section className="max-w-5xl mx-auto px-4 pb-8">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              active === tab
                ? "bg-[#E8604A] text-white"
                : "bg-[#1C0A00]/8 text-[#1C0A00] hover:bg-[#1C0A00]/15"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="group block">
            <div className="rounded-2xl overflow-hidden bg-[#FFF8F3] border border-[#1C0A00]/10 shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="relative w-full aspect-video bg-[#1C0A00]/5">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                  onError={() => {}}
                />
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-3 flex-wrap">
                  {project.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs font-medium bg-[#F4A435]/20 text-[#1C0A00] px-2 py-0.5 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <h3 className="font-heading text-lg font-bold text-[#1C0A00] mb-1 leading-tight group-hover:text-[#E8604A] transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-[#1C0A00]/60 mb-1">{project.client}</p>
                <p className="text-sm text-[#1C0A00]/80 mt-2 leading-relaxed">{project.summary}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
