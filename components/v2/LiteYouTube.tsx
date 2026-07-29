"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  videoId: string;
  title: string;
  revealOnScroll?: boolean;
}

const SEEN_KEY = "seenScrollReveal";

// Lite embed: shows the video thumbnail with a play button; the real YouTube
// iframe only loads on click (autoplaying) — keeps the page light with many videos.
//
// revealOnScroll is for whichever card sits in slot one — its whole purpose
// is proving to a first-time visitor that the videos are real and playable,
// without saying so in words. It autoplays muted the moment that card scrolls
// into view, and only ever does this once per browser (a localStorage flag),
// and never for visitors who've asked their OS to reduce motion.
export default function LiteYouTube({ videoId, title, revealOnScroll = false }: Props) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!revealOnScroll) return;
    if (localStorage.getItem(SEEN_KEY)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setMuted(true);
        setPlaying(true);
        localStorage.setItem(SEEN_KEY, "1");
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealOnScroll]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      {playing ? (
        <iframe
          className="absolute inset-0 w-full h-full z-10"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${muted ? "&mute=1" : ""}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${title}`}
          className="group/play absolute inset-0 w-full h-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.src.includes("hqdefault")) {
                img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
              }
            }}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <span className="absolute inset-0 bg-black/20 group-hover/play:bg-black/5 transition-colors" />

          {/* YouTube-style play button — the familiar rounded-rectangle + triangle
              shape reads instantly as "plays here", not "opens elsewhere". */}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-20 h-14 rounded-2xl bg-[#FF0000] shadow-lg group-hover/play:scale-110 group-hover/play:bg-[#FF0000]/90 transition-transform duration-300">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
