"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Module scope, not a ref: React's dev-mode double mount and any genuine
// remount both hand the component a fresh ref, which let one page view record
// two rows. This survives both. A real revisit to the same path after the
// window has passed still counts.
const recentlySent = new Map<string, number>();
const DEDUPE_MS = 2000;

// A view is only reported once the session shows depth: a second page opened,
// or a real distance scrolled into one.
//
// An earlier version gated on dwell plus one interaction event. It failed.
// Over the 24 hours after it shipped, 23 of 24 recorded views still came from
// AWS us-east-1 and Google us-central1, seven of them in duplicate pairs
// microseconds apart. Those scanners run headless Chrome: they wait out a
// timer and they emit scroll and pointer events, so anything built on "did
// something happen" is spoofable and was.
//
// What none of them has ever done, across every row inspected, is open a
// second page. They fetch "/" and leave. Depth is the signal that survives,
// because it costs a scanner real work to fake and costs a reader nothing.
const SCROLL_FRACTION = 0.25;

// Deliberately not sessionStorage. Nothing may be written to a visitor's
// browser — that property is why the site needs no consent banner (HANDOFF
// §2b). Module scope carries qualification across client-side navigation,
// which is the case that matters, and resets on a full reload.
let qualified = false;
const seenPaths = new Set<string>();
const pending = new Set<string>();

function send(path: string) {
  const now = Date.now();
  const last = recentlySent.get(path);
  if (last && now - last < DEDUPE_MS) return;
  recentlySent.set(path, now);

  // keepalive so the request survives the visitor navigating away.
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, referrer: document.referrer || null }),
    keepalive: true,
  }).catch(() => {});
}

/**
 * Flushes everything held back, then reports directly from here on.
 *
 * The homepage view of someone who goes on to read a project is a real view
 * and is not thrown away — it is held until they prove themselves and sent
 * afterwards, so the first page of a genuine visit still counts.
 */
function qualify() {
  if (qualified) return;
  qualified = true;
  for (const path of pending) send(path);
  pending.clear();
}

/**
 * Fires at most one /api/track call per page view, once the session qualifies.
 *
 * Deliberately tiny and dependency-free: no third-party script, no cookie, no
 * storage of any kind, nothing that blocks or delays render.
 */
export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Your own visits to the panel are not traffic worth counting. Visits from
    // a device you have signed in from are dropped server-side.
    if (pathname.startsWith("/admin")) return;

    seenPaths.add(pathname);

    // A second distinct page in one session. No scanner observed has done it.
    if (seenPaths.size >= 2) qualify();

    if (qualified) {
      send(pathname);
      return;
    }

    pending.add(pathname);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // A page with nothing to scroll cannot qualify this way. It still
      // qualifies the moment a second page is opened.
      if (max <= 0) return;
      if (window.scrollY / max >= SCROLL_FRACTION) {
        window.removeEventListener("scroll", onScroll);
        qualify();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
