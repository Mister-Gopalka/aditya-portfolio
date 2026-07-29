import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats; AVIF first (smaller), WebP fallback.
    formats: ["image/avif", "image/webp"],
  },
  // Dev-mode only, no effect on production. Next blocks cross-origin requests
  // to dev-only assets by default, so opening the dev server from a phone on
  // the LAN silently fails to hydrate — every scroll-reveal stays at opacity 0
  // and the page looks like it rendered blank. Allow the LAN address so device
  // testing against `npm run dev` actually works.
  // Update this if the machine's local IP changes (`ipconfig getifaddr en0`).
  allowedDevOrigins: ["192.168.1.18"],
};

export default nextConfig;
