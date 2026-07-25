"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { supabase } from "@/lib/supabase";

const WHATSAPP = "919560501904";

const SOCIALS = [
  {
    label: "Instagram",
    url: "https://www.instagram.com/adityagopalka/",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/adityagopalka/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "YouTube",
    url: "https://www.youtube.com/@MisterGopalka",
    path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "Music — Linktree",
    url: "https://linktr.ee/adityagopalka",
    path: "m13.736 5.853 4.005-4.117 2.325 2.38-4.2 4.005h5.908v3.305h-5.937l4.229 4.108-2.325 2.334-5.74-5.769-5.741 5.769-2.325-2.325 4.229-4.108H2.226V8.121h5.909l-4.2-4.004 2.324-2.381 4.005 4.117V0h3.472zm-3.472 10.306h3.472V24h-3.472z",
  },
  {
    label: "Blog — WordPress",
    url: "https://adityagopalka.wordpress.com",
    path: "M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.109m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.607-3.582.607M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0",
  },
];

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.552 4.112 1.52 5.845L.057 23.386a.5.5 0 00.611.61l5.644-1.48A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.937 0-3.75-.525-5.3-1.438l-.38-.222-3.945 1.033 1.053-3.845-.244-.397A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

export default function ContactScene() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", requirement: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (supabase) {
      try {
        await supabase.from("contact_submissions").insert({
          name: form.name,
          phone: form.phone,
          requirement: form.requirement,
        });
      } catch {}
    }
    setSubmitted(true);
  }

  const inputClass =
    "bg-transparent border-b border-[#FFF8F3]/20 px-1 py-3 text-sm text-[#FFF8F3] placeholder:text-[#FFF8F3]/30 focus:outline-none focus:border-[#C9956A] transition-colors";

  return (
    <section className="relative min-h-[90svh] flex items-center border-t border-[#FFF8F3]/5">
      <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-24">
        <Reveal>
          <p className="text-[#C9956A] uppercase tracking-[0.3em] text-xs mb-6">
            The end — or the beginning
          </p>
        </Reveal>
        <Reveal delay={100}>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-5"
          >
            <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-bold leading-none tracking-tight">
              Let&apos;s connect
            </h2>
            <span className="flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#A0281A] text-[#FFF8F3] group-hover:scale-110 transition-transform duration-300 shrink-0">
              <WhatsAppIcon size={30} />
            </span>
          </a>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-16 max-w-md">
            {submitted ? (
              <p className="text-sm text-[#C9956A]">Got it! I&apos;ll be in touch.</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  required
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
                <input
                  required
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                />
                <input
                  required
                  placeholder="How can I help you?"
                  value={form.requirement}
                  onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                  className={inputClass}
                />
                <button
                  type="submit"
                  className="self-start mt-4 text-sm font-medium text-[#FFF8F3] border border-[#FFF8F3]/25 rounded-full px-8 py-3 hover:bg-[#A0281A] hover:border-[#A0281A] transition-colors"
                >
                  Send →
                </button>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-wrap gap-3 mt-20">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className="flex items-center justify-center w-11 h-11 rounded-full border border-[#FFF8F3]/20 text-[#FFF8F3]/65 hover:text-[#FFF8F3] hover:border-[#C9956A] hover:bg-[#FFF8F3]/5 transition-colors"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
