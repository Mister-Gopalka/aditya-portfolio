"use client";

import { useRef, useState } from "react";

// Swipe a card to the right to open its full story in a new tab.
// A plain click still navigates (same tab) via the inner links; the play
// button stops propagation so watching a video never triggers navigation.
// Animation is deliberately restrained — a little give, a soft snap back.
export default function SwipeCard({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0 });
  const axis = useRef<"h" | "v" | null>(null);
  const active = useRef(false);
  const rawXRef = useRef(0); // synchronous travel — the source of truth for onUp

  const RESIST = 0.65;
  const THRESHOLD = 96; // px of real travel needed to trigger
  const MAX = 128; // px the card can visually move

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).tagName === "IFRAME") return;
    start.current = { x: e.clientX, y: e.clientY };
    axis.current = null;
    active.current = true;
    rawXRef.current = 0;
  };

  const onMove = (e: React.PointerEvent) => {
    if (!active.current) return;
    const rawX = e.clientX - start.current.x;
    const rawY = e.clientY - start.current.y;
    if (axis.current === null) {
      if (Math.abs(rawX) > 8 || Math.abs(rawY) > 8) {
        axis.current = Math.abs(rawX) > Math.abs(rawY) ? "h" : "v";
      }
    }
    if (axis.current !== "h") return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    rawXRef.current = rawX;
    setDragging(true);
    setDx(Math.max(0, Math.min(MAX, rawX * RESIST))); // resistance
  };

  const onUp = () => {
    if (axis.current === "h" && rawXRef.current >= THRESHOLD) {
      window.open(href, "_blank", "noopener");
    }
    active.current = false;
    axis.current = null;
    rawXRef.current = 0;
    setDragging(false);
    setDx(0);
  };

  // If the pointer moved horizontally, swallow the click it would otherwise fire
  const onClickCapture = (e: React.MouseEvent) => {
    if (dx > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const progress = Math.min(1, (dx / RESIST) / THRESHOLD);

  return (
    <div
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onClickCapture={onClickCapture}
      style={{
        transform: `translateX(${dx}px)`,
        transition: dragging
          ? "none"
          : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        touchAction: "pan-y",
      }}
      className="relative select-none"
    >
      {children}
      {/* Swipe affordance — only visible while dragging */}
      <div
        className="pointer-events-none absolute inset-y-0 right-7 flex items-center"
        style={{ opacity: progress }}
      >
        <span className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#FFF8F3]">
          Open
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </div>
  );
}
