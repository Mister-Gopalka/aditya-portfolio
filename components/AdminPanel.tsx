"use client";

import { useState } from "react";
import { FontPairing, HeroPhotoSettings } from "@/lib/supabase";

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
  heroPhoto: HeroPhotoSettings;
}

export default function AdminPanel({ currentPairing, projects, heroPhoto }: Props) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activePairing, setActivePairing] = useState<FontPairing>(currentPairing);
  const [visibility, setVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(projects.map((p) => [p.slug, p.visible]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  const [photo, setPhoto] = useState<HeroPhotoSettings>(heroPhoto);

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

  async function handlePhotoSave() {
    setSaving(true);
    await fetch("/api/admin/hero-photo", {
      method: "POST",
      body: JSON.stringify(photo),
      headers: { "Content-Type": "application/json" },
    });
    setSaving(false);
    setSaved("Hero photo saved!");
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
            className="border border-[#1C0A00]/20 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#A0281A] text-[#1C0A00]"
          />
          {authError && <p className="text-[#A0281A] text-sm">{authError}</p>}
          <button
            type="submit"
            className="bg-[#A0281A] text-white font-medium rounded-xl py-3 text-sm hover:bg-[#8B1F13] transition-colors"
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
      {saved && <p className="text-sm text-[#A0281A] font-medium">{saved}</p>}

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
                  ? "border-[#A0281A]"
                  : "border-[#1C0A00]/10 hover:border-[#1C0A00]/30"
              }`}
            >
              <p className="text-xs font-medium text-[#A0281A] mb-3">Pairing {p.id} — {p.name}</p>
              <h3 style={{ fontFamily: p.headingFont }} className="text-lg font-bold text-[#1C0A00] mb-2">
                {p.heading}
              </h3>
              <p style={{ fontFamily: p.bodyFont }} className="text-sm text-[#1C0A00]/70">
                {p.body}
              </p>
              {activePairing === p.id && (
                <span className="inline-block mt-3 text-xs bg-[#A0281A] text-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Hero Card Photo */}
      <section>
        <h2 className="font-heading text-xl font-bold text-[#1C0A00] mb-1">Hero Card — Photo Position</h2>
        <p className="text-sm text-[#1C0A00]/50 mb-4">Adjust how your photo sits inside the hero card.</p>
        <div className="rounded-2xl border border-[#1C0A00]/10 bg-[#FFF8F3] shadow-md p-6 flex flex-col gap-5">
          {(["x", "y", "scale"] as const).map((key) => {
            const config = {
              x: { label: "X Position (left ↔ right)", min: 0, max: 100, step: 1, unit: "%" },
              y: { label: "Y Position (up ↕ down)", min: 0, max: 100, step: 1, unit: "%" },
              scale: { label: "Zoom", min: 1, max: 2.5, step: 0.05, unit: "×" },
            }[key];
            return (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-[#1C0A00]">{config.label}</label>
                  <span className="text-sm text-[#A0281A] font-medium">{photo[key]}{config.unit}</span>
                </div>
                <input
                  type="range"
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={photo[key]}
                  onChange={(e) => setPhoto((prev) => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                  className="w-full accent-[#A0281A]"
                />
              </div>
            );
          })}
          <button
            onClick={handlePhotoSave}
            className="self-start bg-[#A0281A] text-white font-medium rounded-xl px-6 py-2.5 text-sm hover:bg-[#8B1F13] transition-colors"
          >
            Save Photo Position
          </button>
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
                <div className="w-10 h-6 bg-[#1C0A00]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A0281A]" />
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
