"use client";

import { useState } from "react";

const WHATSAPP = "919560501904";

const SOCIALS = [
  { label: "Instagram", url: "https://www.instagram.com/adityagopalka/", icon: "IG" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/adityagopalka/", icon: "LI" },
  { label: "YouTube", url: "https://www.youtube.com/@MisterGopalka", icon: "YT" },
  { label: "Music (Linktree)", url: "https://linktr.ee/adityagopalka", icon: "🎵" },
  { label: "Blog", url: "https://adityagopalka.wordpress.com", icon: "✍️" },
];

function SocialsCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`flip-card h-44 cursor-pointer ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front rounded-2xl border border-[#1C0A00]/10 shadow-md bg-[#FFF8F3] flex flex-col items-center justify-center gap-2">
          <span className="font-heading text-xl font-bold text-[#1C0A00]">Socials</span>
          <span className="text-2xl">↗</span>
          <span className="text-xs text-[#1C0A00]/50">Tap to reveal</span>
        </div>
        <div className="flip-card-back rounded-2xl border border-[#1C0A00]/10 shadow-md bg-[#FFF8F3] flex flex-col justify-center p-5 gap-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-sm text-[#1C0A00] hover:text-[#E8604A] transition-colors"
            >
              <span className="w-6 text-center text-xs font-bold">{s.icon}</span>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactFormCard() {
  const [flipped, setFlipped] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", requirement: "" });

  const FORM_ACTION = process.env.NEXT_PUBLIC_GOOGLE_FORM_ACTION_URL || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!FORM_ACTION) {
      setSubmitted(true);
      return;
    }
    try {
      await fetch(FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "entry.name": form.name,
          "entry.phone": form.phone,
          "entry.requirement": form.requirement,
        }).toString(),
      });
    } catch {}
    setSubmitted(true);
  }

  return (
    <div
      className={`flip-card h-44 cursor-pointer ${flipped ? "flipped" : ""}`}
      onClick={() => !flipped && setFlipped(true)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front rounded-2xl border border-[#1C0A00]/10 shadow-md bg-[#FFF8F3] flex flex-col items-center justify-center gap-2">
          <span className="font-heading text-xl font-bold text-[#1C0A00]">Work with me</span>
          <span className="text-2xl">✉️</span>
          <span className="text-xs text-[#1C0A00]/50">Tap to send a note</span>
        </div>
        <div
          className="flip-card-back rounded-2xl border border-[#1C0A00]/10 shadow-md bg-[#FFF8F3] p-5"
          onClick={(e) => e.stopPropagation()}
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <span className="text-2xl">✅</span>
              <p className="text-sm font-medium text-[#1C0A00]">Got it! I'll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 h-full">
              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="text-xs border border-[#1C0A00]/20 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#E8604A] text-[#1C0A00]"
              />
              <input
                required
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="text-xs border border-[#1C0A00]/20 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#E8604A] text-[#1C0A00]"
              />
              <input
                required
                placeholder="What do you need?"
                value={form.requirement}
                onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                className="text-xs border border-[#1C0A00]/20 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#E8604A] text-[#1C0A00]"
              />
              <button
                type="submit"
                className="bg-[#E8604A] text-white text-xs font-medium rounded-lg py-1.5 hover:bg-[#d4513c] transition-colors mt-auto"
              >
                Send →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-4 py-12 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp — large card */}
        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="md:col-span-1 rounded-2xl p-8 bg-[#E8604A] text-white flex flex-col justify-between min-h-44 hover:-translate-y-1 transition-all duration-200 shadow-md"
        >
          <div>
            <p className="text-sm font-medium opacity-80">Let's talk</p>
            <h3 className="font-heading text-2xl font-bold mt-1">WhatsApp / Text me</h3>
          </div>
          <span className="inline-flex items-center gap-2 mt-6 font-medium text-sm bg-white/20 rounded-full px-4 py-2 w-fit">
            Open WhatsApp →
          </span>
        </a>

        {/* Socials + Contact stacked */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SocialsCard />
          <ContactFormCard />
        </div>
      </div>

      <p className="text-center text-xs text-[#1C0A00]/30 mt-10">
        © {new Date().getFullYear()} Aditya Gopalka. Delhi / Mumbai.
      </p>
    </footer>
  );
}
