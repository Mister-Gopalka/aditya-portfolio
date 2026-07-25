"use client";

import { useEffect, useState } from "react";

// Subtle progress rail: one dot per section, active dot fills in burgundy,
// label appears on hover. Reads sections tagged with [data-nav-label].
export default function SideNav() {
  const [items, setItems] = useState<{ id: string; label: string }[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-label]")
    );
    setItems(els.map((el) => ({ id: el.id, label: el.dataset.navLabel || "" })));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = els.indexOf(e.target as HTMLElement);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  if (!items.length) return null;

  return (
    <nav className="hidden md:flex fixed right-7 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3.5">
      {items.map((it, i) => (
        <button
          key={it.id + i}
          onClick={() =>
            document
              .getElementById(it.id)
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="group flex items-center gap-2.5"
          aria-label={`Go to ${it.label}`}
        >
          <span
            className={`text-[10px] uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
              active === i ? "text-[#C9956A]" : "text-[#C9956A]/60"
            }`}
          >
            {it.label}
          </span>
          <span
            className={`rounded-full transition-all duration-300 ${
              active === i
                ? "w-2.5 h-2.5 bg-[#C9956A]"
                : "w-1.5 h-1.5 bg-[#C9956A]/35 group-hover:bg-[#C9956A]/70"
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
