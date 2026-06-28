"use client";

import { useState } from "react";

interface Props {
  lines: { featured: string[]; all: string[] };
}

export default function CopyLinesSectionClient({ lines }: Props) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? lines.all : lines.featured;

  return (
    <div className="mb-6">
      <h2 className="font-heading text-2xl font-bold text-[#1C0A00] mb-5">
        The Copy Lines — 39 Bottles
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {displayed.map((line, i) => (
          <div
            key={i}
            className="rounded-xl p-4 bg-[#1C0A00] text-[#FFF8F3] text-sm font-medium text-center leading-snug min-h-16 flex items-center justify-center"
          >
            {line}
          </div>
        ))}
      </div>
      {!showAll && lines.all.length > lines.featured.length && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 text-sm text-[#E8604A] font-medium hover:underline"
        >
          Show all {lines.all.length} lines →
        </button>
      )}
    </div>
  );
}
