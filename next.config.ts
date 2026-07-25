import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats; AVIF first (smaller), WebP fallback.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
