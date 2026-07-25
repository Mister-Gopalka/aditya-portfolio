"use client";

import { useState, useRef, type ReactNode } from "react";
import SmartImage from "@/components/SmartImage";

export default function DeckCarousel({
  images,
  slides,
  alt = "Slide",
  frameless = false,
  loop = false,
}: {
  images?: string[];
  slides?: ReactNode[];
  alt?: string;
  /** Omit the border/rounded corners on the slide track — use when nesting inside a parent frame (e.g. a browser-chrome mockup). */
  frameless?: boolean;
  /** Forward navigation only: Next wraps from the last slide back to the first. Previous stays clamped at the first slide. */
  loop?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const items: ReactNode[] =
    slides ??
    (images ?? []).map((src, i) => (
      <SmartImage
        key={i}
        src={src}
        alt={`${alt}, page ${i + 1}`}
        className="w-full block"
        draggable={false}
        priority={i === 0}
      />
    ));
  const n = items.length;

  const go = (next: number) => setIndex(Math.max(0, Math.min(n - 1, next)));
  const goNext = () => (loop && index === n - 1 ? setIndex(0) : go(index + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? goNext() : go(index - 1));
    touchStartX.current = null;
  };

  if (n === 0) return null;

  return (
    <div>
      <div
        className={`relative overflow-hidden select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9956A]/40 ${frameless ? "" : "rounded-xl border border-[#FFF8F3]/10"}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") goNext();
          if (e.key === "ArrowLeft") go(index - 1);
        }}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={alt}
      >
        <div
          className="flex items-stretch transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((node, i) => (
            <div key={i} className="w-full shrink-0" aria-hidden={i !== index}>
              {node}
            </div>
          ))}
        </div>
      </div>

      <div className={`flex items-center justify-between ${frameless ? "px-4 py-3 bg-[#FFF8F3]/[0.06]" : "mt-4"}`}>
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous page"
          className="text-sm text-[#FFF8F3]/60 hover:text-[#FFF8F3] disabled:opacity-25 disabled:pointer-events-none transition-colors"
        >
          ← Previous
        </button>
        <span className="text-[#FFF8F3]/45 text-xs uppercase tracking-[0.15em] tabular-nums">
          {index + 1} of {n}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={!loop && index === n - 1}
          aria-label="Next page"
          className="text-sm text-[#FFF8F3]/60 hover:text-[#FFF8F3] disabled:opacity-25 disabled:pointer-events-none transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
