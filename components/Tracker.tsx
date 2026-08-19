"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Module scope, not a ref: React's dev-mode double mount and any genuine
// remount both hand the component a fresh ref, which let one page view record
// two rows. This survives both. A real revisit to the same path after the
// window has passed still counts.
const recentlySent = new Map<string, number>();
const DEDUPE_MS = 2000;

// A visit counts once it looks like reading rather than fetching.
//
//   engaged  + 10 seconds  -> counted
//   nothing  + 20 seconds  -> counted
//
// Engaged means either scrolling far enough down the homepage to reach the
// project cards, or being on a project page at all, since links to those are
// shared directly and opening one is the whole intent.
//
// An earlier version counted after 3 seconds plus any single event. It failed:
// in the 24 hours after it shipped, 23 of 24 recorded views came from AWS
// us-east-1 and Google us-central1, seven in duplicate pairs microseconds
// apart. Those scanners run headless Chrome, wait out timers and emit events.
// Longer thresholds raise the cost of faking a read but do not make it
// impossible, so if datacenter cities reappear in the panel the answer is to
// filter on network origin, not to keep inflating these numbers.
const ENGAGED_MS = 10_000;
const PATIENT_MS = 20_000;

// How far down counts as reaching the projects: the first project card sitting
// in the upper part of the viewport, after a scroll the visitor actually made.
const CARD_IN_VIEW_FRACTION = 0.6;

// Deliberately not sessionStorage. Nothing may be written to a visitor's
// browser, which is what keeps the site free of a consent banner (HANDOFF
// §2b). Module scope carries a visit across client-side navigation, which is
// the case that matters, and resets on a full reload.
let visitStart = 0;
let qualified = false;
let engaged = false;
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
 * Reports every page held back so far, then reports directly from here on.
 *
 * Pages are held rather than dropped. Someone who reads the homepage and then
 * opens two projects is one visit that read three pages, and all three are
 * recorded once they qualify. Nothing genuine is lost by making them wait.
 */
function qualify() {
  if (qualified) return;
  qualified = true;
  for (const path of pending) send(path);
  pending.clear();
}

export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Your own visits to the panel are not traffic worth counting. Visits from
    // a device you have signed in from are dropped server-side.
    if (pathname.startsWith("/admin")) return;

    if (!visitStart) visitStart = Date.now();

    if (qualified) {
      send(pathname);
      return;
    }

    pending.add(pathname);

    const timers: ReturnType<typeof setTimeout>[] = [];
    const qualifyIn = (ms: number) => {
      timers.push(setTimeout(qualify, Math.max(0, ms)));
    };

    // Thresholds run from the start of the visit, not of this page, so time
    // spent reading carries across a click into a project.
    const elapsed = () => Date.now() - visitStart;

    // The patient visitor: no engagement required, just real time on the site.
    qualifyIn(PATIENT_MS - elapsed());

    const markEngaged = () => {
      if (engaged || qualified) return;
      engaged = true;
      qualifyIn(ENGAGED_MS - elapsed());
    };

    // Opening a project is engagement in itself.
    if (pathname.startsWith("/projects/")) markEngaged();

    const onScroll = (event: Event) => {
      // Only a scroll the browser attributes to a person. A script calling
      // dispatchEvent produces isTrusted false, which costs an automated
      // client nothing to avoid but does filter the careless ones.
      if (!event.isTrusted) return;
      if (window.scrollY <= 0) return;

      const card = document.querySelector('a[href^="/projects/"]');
      if (!card) return;
      if (card.getBoundingClientRect().top <= window.innerHeight * CARD_IN_VIEW_FRACTION) {
        window.removeEventListener("scroll", onScroll);
        markEngaged();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      for (const timer of timers) clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
