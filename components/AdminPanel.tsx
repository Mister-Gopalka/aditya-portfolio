"use client";

import { useState } from "react";
import { FontPairing } from "@/lib/supabase";

const PAIRINGS: {
  id: FontPairing;
  name: string;
  heading: string;
  body: string;
  headingFont: string;
  bodyFont: string;
}[] = [
  {
    id: "A",
    name: "Editorial",
    heading: "The Story Begins Here",
    body: "Creative direction for brands that want to be remembered.",
    headingFont: '"Playfair Display", serif',
    bodyFont: '"DM Sans", sans-serif',
  },
  {
    id: "B",
    name: "Modern Warm",
    heading: "The Story Begins Here",
    body: "Creative direction for brands that want to be remembered.",
    headingFont: '"Fraunces", serif',
    bodyFont: '"Inter", sans-serif',
  },
  {
    id: "C",
    name: "Bold Sans",
    heading: "The Story Begins Here",
    body: "Creative direction for brands that want to be remembered.",
    headingFont: '"Plus Jakarta Sans", sans-serif',
    bodyFont: '"Lato", sans-serif',
  },
];

interface Props {
  currentPairing: FontPairing;
  projects: { slug: string; title: string; visible: boolean }[];
}

export default function AdminPanel({ currentPairing, projects }: Props) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activePairing, setActivePairing] = useState<FontPairing>(currentPairing);
  const [visibility, setVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(projects.map((p) => [p.slug, p.visible]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setAuthError("Wrong password.");
    }
  }

  async function handlePairingChange(pairing: FontPairing) {
    setActivePairing(pairing);
    setSaving(true);
    await fetch("/api/admin/font", {
      method: "POST",
      body: JSON.stringify({ pairing }),
      headers: { "Content-Type": "application/json" },
    });
    setSaving(false);
    setSaved("Font saved!");
    setTimeout(() => setSaved(""), 2000);
  }

  async function handleVisibilityChange(slug: string, val: boolean) {
    const updated = { ...visibility, [slug]: val };
    setVisibility(updated);
    await fetch("/api/admin/visibility", {
      method: "POST",
      body: JSON.stringify({ visibility: updated }),
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!authed) {
    return (
      <div className="rounded-2xl p-8 bg-[#FFF8F3] border border-[#1C0A00]/10 shadow-md max-w-sm">
        <h2 className="font-heading text-xl font-bold text-[#1C0A00] mb-6">Enter password</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#1C0A00]/20 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#E8604A] text-[#1C0A00]"
          />
          {authError && <p className="text-[#E8604A] text-sm">{authError}</p>}
          <button
            type="submit"
            className="bg-[#E8604A] text-white font-medium rounded-xl py-3 text-sm hover:bg-[#d4513c] transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {saving && <p className="text-sm text-[#1C0A00]/50">Saving…</p>}
      {saved && <p className="text-sm text-[#E8604A] font-medium">{saved}</p>}

      {/* Font Pairing */}
      <section>
        <h2 className="font-heading text-xl font-bold text-[#1C0A00] mb-4">Font Pairing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAIRINGS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePairingChange(p.id)}
              className={`rounded-2xl p-6 text-left border-2 transition-all shadow-md bg-[#FFF8F3] ${
                activePairing === p.id
                  ? "border-[#E8604A]"
                  : "border-[#1C0A00]/10 hover:border-[#1C0A00]/30"
              }`}
            >
              <p className="text-xs font-medium text-[#E8604A] mb-3">Pairing {p.id} — {p.name}</p>
              <h3 style={{ fontFamily: p.headingFont }} className="text-lg font-bold text-[#1C0A00] mb-2">
                {p.heading}
              </h3>
              <p style={{ fontFamily: p.bodyFont }} className="text-sm text-[#1C0A00]/70">
                {p.body}
              </p>
              {activePairing === p.id && (
                <span className="inline-block mt-3 text-xs bg-[#E8604A] text-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Project Visibility */}
      <section>
        <h2 className="font-heading text-xl font-bold text-[#1C0A00] mb-4">Project Visibility</h2>
        <div className="rounded-2xl border border-[#1C0A00]/10 overflow-hidden shadow-md">
          {projects.map((project, i) => (
            <div
              key={project.slug}
              className={`flex items-center justify-between px-6 py-4 ${
                i !== projects.length - 1 ? "border-b border-[#1C0A00]/8" : ""
              } bg-[#FFF8F3]`}
            >
              <span className="text-sm text-[#1C0A00] font-medium">{project.title}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={visibility[project.slug]}
                  onChange={(e) => handleVisibilityChange(project.slug, e.target.checked)}
                />
                <div className="w-10 h-6 bg-[#1C0A00]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E8604A]" />
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
