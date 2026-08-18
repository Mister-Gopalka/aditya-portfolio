"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Module scope, not a ref: React's dev-mode double mount and any genuine
// remount both hand the component a fresh ref, which let one page view record
// two rows. This survives both. A real revisit to the same path after the
// window has passed still counts.
const recentlySent = new Map<string, number>();
const DEDUPE_MS = 2000;

// A view is only reported once someone has behaved like a person: the page
// visible, a few seconds passed, and one real input.
//
// Reporting on load counted machines. Over one week, 90 of 108 "visitors"
// came from Google, Azure and AWS datacenter cities, opened the homepage,
// never opened a project page, and never carried a referrer — link scanners
// and previewers firing every time the portfolio was shared by email or chat.
// Blocking them by user agent alone does not work, because those scanners
// send a real Chrome user agent. What they do not do is scroll.
const DWELL_MS = 3000;
const HUMAN_EVENTS = ["scroll", "pointermove", "touchstart", "keydown", "click"] as const;

/**
 * Fires at most one /api/track call per page view.
 *
 * Deliberately tiny and dependency-free: no third-party script, no cookie, no
 * localStorage, nothing that blocks or delays render. The gate below only
 * delays a background beacon, so it costs a visitor nothing.
 */
export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Your own visits to the panel are not traffic worth counting. Visits from
    // a device you have signed in from are dropped server-side.
    if (pathname.startsWith("/admin")) return;

    let dwelled = false;
    let interacted = false;
    let done = false;

    const send = () => {
      const now = Date.now();
      const last = recentlySent.get(pathname);
      if (last && now - last < DEDUPE_MS) return;
      recentlySent.set(pathname, now);

      // keepalive so the request survives the visitor navigating away.
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname, referrer: document.referrer || null }),
        keepalive: true,
      }).catch(() => {});
    };

    // No visibility check here on purpose. Interaction already proves someone
    // is present — a page cannot be scrolled or clicked while it is not being
    // looked at — so gating on visibilityState as well adds nothing except a
    // way to lose a real visitor silently if a browser reports it wrongly.
    const maybeSend = () => {
      if (done || !dwelled || !interacted) return;
      done = true;
      cleanup();
      send();
    };

    const onInteract = () => {
      interacted = true;
      maybeSend();
    };

    const timer = setTimeout(() => {
      dwelled = true;
      maybeSend();
    }, DWELL_MS);

    for (const event of HUMAN_EVENTS) {
      window.addEventListener(event, onInteract, { passive: true });
    }

    function cleanup() {
      clearTimeout(timer);
      for (const event of HUMAN_EVENTS) window.removeEventListener(event, onInteract);
    }

    return cleanup;
  }, [pathname]);

  return null;
}
