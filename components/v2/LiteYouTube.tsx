"use client";

import { useState } from "react";

interface Props {
  videoId: string;
  title: string;
}

// Lite embed: shows the video thumbnail with a play button; the real YouTube
// iframe only loads on click (autoplaying) — keeps the page light with many videos.
export default function LiteYouTube({ videoId, title }: Props) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full z-10"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
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

      {/* YouTube corner mark — matches the branding shown on a real, un-played
          YouTube embed, confirming this is an inline player. */}
      <span className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/60 backdrop-blur-sm">
        <svg width="16" height="12" viewBox="0 0 28 20" aria-hidden="true">
          <rect width="28" height="20" rx="5" fill="#FF0000" />
          <path d="M11 5.5v9l8-4.5-8-4.5z" fill="#FFFFFF" />
        </svg>
        <span className="text-[11px] font-medium text-white tracking-wide">YouTube</span>
      </span>
    </button>
  );
}
