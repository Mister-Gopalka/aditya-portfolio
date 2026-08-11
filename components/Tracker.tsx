"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Module scope, not a ref: React's dev-mode double mount and any genuine
// remount both hand the component a fresh ref, which let one page view record
// two rows. This survives both. A real revisit to the same path after the
// window has passed still counts.
const recentlySent = new Map<string, number>();
const DEDUPE_MS = 2000;

/**
 * Fires one /api/track call per page view.
 *
 * Deliberately tiny and dependency-free: no third-party script, no cookie, no
 * localStorage, nothing that blocks or delays render. Load speed outranks
 * everything on this site, so this must stay cheap.
 */
export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Your own visits to the panel are not traffic worth counting.
    if (pathname.startsWith("/admin")) return;

    const now = Date.now();
    const last = recentlySent.get(pathname);
    if (last && now - last < DEDUPE_MS) return;
    recentlySent.set(pathname, now);

    const payload = JSON.stringify({ path: pathname, referrer: document.referrer || null });

    // keepalive so the request survives the visitor navigating away immediately.
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
