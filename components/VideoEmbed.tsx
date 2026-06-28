"use client";

interface VideoEmbedProps {
  videoId: string;
  type: "youtube" | "shorts" | "spotify";
  label?: string;
  fbUrl?: string;
  fbViews?: string;
}

export default function VideoEmbed({ videoId, type, label, fbUrl, fbViews }: VideoEmbedProps) {
  if (type === "spotify") {
    return (
      <div className="w-full">
        {label && <p className="text-sm font-medium text-[#1C0A00]/60 mb-2">{label}</p>}
        <iframe
          style={{ borderRadius: "12px" }}
          src={`https://open.spotify.com/embed/track/${videoId}?utm_source=generator`}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    );
  }

  if (type === "shorts") {
    return (
      <div className="flex flex-col items-center">
        {label && <p className="text-sm font-medium text-[#1C0A00]/60 mb-2 self-start">{label}</p>}
        <div className="relative w-full max-w-[320px] mx-auto" style={{ paddingBottom: "177.78%" }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-xl"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={label || "Video"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  // Standard YouTube
  return (
    <div className="w-full">
      {label && <p className="text-sm font-medium text-[#1C0A00]/60 mb-2">{label}</p>}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={label || "Video"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {fbUrl && (
        <a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-xs text-[#1C0A00]/50 hover:text-[#E8604A] transition-colors"
        >
          View original post on Facebook {fbViews && `(${fbViews} views)`} →
        </a>
      )}
    </div>
  );
}
