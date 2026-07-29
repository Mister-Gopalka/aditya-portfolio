# Brief — "Fixed Stage" homepage restructure

**Status:** Not started. This doc is the handoff for a fresh chat.
**Written:** 2026-07-29, by Claude (Opus 5), from a discussion with Aditya.
**Read first:** `HANDOFF.md`, then `CLAUDE.md` / `AGENTS.md`, then this file.

---

## 0. How to start this work

1. **Model: Opus.** This is layout/positioning/cross-browser work with genuine
   traps (see §6). Haiku will move fast and hit them; Sonnet is an acceptable
   fallback if credits are tight.
2. **New chat**, not a continuation. Everything needed is in this file.
3. **Work on a branch:**
   ```bash
   git checkout -b feature/fixed-stage
   ```
   Push the branch and Vercel auto-builds a **preview URL** — Aditya can see it
   live on a real device without touching production. `main` stays untouched
   until he says merge. This is the whole reversibility strategy; do not build
   this behind a route like `/v3` (duplicates content, hurts SEO).
4. Iterate on the preview URL. Merge to `main` only on explicit approval.

---

## 1. The idea in one line

The hero photo stops being a section you scroll *past* and becomes a **fixed
stage** you scroll content *over*. The photo and the brand ticker stay put for
the entire page; the hero text, the project cards, and the contact section all
travel over them.

Today: `[hero photo] → [dark gradient page] → [cards] → [contact]`
After:  `[photo pinned behind everything] ← hero text, cards, contact scroll over it`

---

## 2. Confirmed decisions

| # | Decision | Detail |
|---|---|---|
| 1 | Photo is **completely still** | No parallax, no drift, no zoom. Fully fixed. |
| 2 | Photo is the background for the **whole page** | Hero → cards → contact. Never replaced by the flat dark ground. |
| 3 | Ticker stays **pinned at top** | Position fixed. The marquee text keeps animating; the strip itself never moves. |
| 4 | Hero text scrolls up and away | Kicker, name, roles, capabilities, location — all scroll off normally. |
| 5 | Header (`AdityaGopalka` + WhatsApp) **scrolls away too** | It is not sticky. It leaves with the hero text. |
| 6 | Scrolling back up **restores everything** | No one-way/destroyed states, no scroll-jacking, no pinned-scroll timeline. Plain document scroll. `Reveal` is already one-way (disconnects the observer), so revealed content stays revealed — that is correct and needs no change. |
| 7 | Cards are **translucent glass over the photo** | See §3 — the tint must flip from white to dark. |
| 8 | Ending = **Option A** | "Let's connect" scrolls in over the photo exactly like the hero text did. No separate brown takeover card. Option B was considered and rejected. |
| 9 | **Homepage only** | Project pages (`/projects/[slug]`) keep their current per-project hero images. Do not touch them. Keeps scope and risk down. |

---

## 3. Card translucency — the recommendation

Aditya's concern was right: translucent cards over a photo can wreck text
legibility. The fix is to **flip the tint from white to dark**, not to abandon
translucency.

**Current** (`app/page.tsx`, `ProjectCard`):
```
bg-[#FFF8F3]/[0.05] backdrop-blur-md
```
5% *white* glass. Works today only because it sits on a near-solid dark ground.
Over the photo — whose wall is bright — off-white text on 5% white glass will
fail.

**Proposed starting point:**
```
bg-[#120600]/[0.68] backdrop-blur-xl
```
- Dark espresso tint at ~68%, matching `--v2-ground`
- Heavier blur (≈16–24px)

Result: the photo stays visible through the card as a soft, defocused presence,
but never competes with the copy. Reads as *smoked glass over a photograph* —
which is the cinematic feel already being aimed for. Keep the existing border
(`border-[#FFF8F3]/12`), the top sheen, and the shadow; they all still work.

**Tune on the preview:** 0.55 (photo very present, riskier) → 0.80 (very safe,
photo barely reads). Start at 0.68 and let Aditya pick on a real screen.

**⚠ Performance:** ~10 large `backdrop-blur` cards moving over a fixed image is
the single biggest perf risk in this change. Mid-range Android will show it
first. If it stutters, drop the blur radius on mobile (or go near-opaque on
mobile, glass on desktop ≥768px). Test before merging.

---

## 4. The ticker — recommendation: keep it, but let it recede

Aditya asked whether to keep the ticker visible throughout. **Recommendation:
pin it for the whole page, but fade it down once past the hero.**

Why keep it:
- It is the credits strip (OYO, HomeLane, Vinod Chopra Films…) — continuous
  social proof at every scroll position, for an audience that is literally
  there to evaluate credibility.
- It completes the frame. The concept is "pinned stage, moving content." A
  pinned photo with a ticker that slides away leaves the composition
  half-finished, and cards start to feel like they float off the top edge.

Why not keep it at full strength:
- A permanently animating marquee in peripheral vision is tiring while reading
  case studies.
- Constant compositing = a small but real battery/perf cost.

**So:** full opacity over the hero → fade to roughly half once the hero is
past. Optionally slow the animation at the same time. It stays as frame and
proof; it stops competing with the case studies.

Alternative if the fade still distracts: keep it pinned but **pause** the
animation past the hero (static list, still legible). More aggressive, less
lively.

**Also add** `prefers-reduced-motion` handling to `.v2-marquee` — it currently
has none, and a permanently-visible marquee makes that omission much more
noticeable than it is today.

---

## 5. Open questions — ask Aditya before/while building

1. **Mobile.** The photo is cropped hard on phones (`.hero-photo` in
   `globals.css` does `scale(1.4)` + repositioning to keep the face visible).
   With a fixed stage, does that same crop hold for the whole scroll, or should
   mobile behave differently? **Not yet decided.** Show him a phone preview
   before assuming.
2. **Exact card tint.** Start 0.68, let him choose on a real screen (§3).
3. **Ticker fade.** Recommendation in §4 — confirm he wants the fade rather
   than constant full strength.
4. **Scrim.** The hero currently has its own gradient scrim
   (`from-[#120600] via-[#120600]/65 to-[#120600]/25`). Once the photo is the
   permanent stage, that per-hero scrim probably becomes a **constant** scrim
   over the fixed photo, so cards always sit on a predictable base. Needs a
   judgement call once it is on screen.

---

## 6. Technical traps — read before writing code

1. **`background-attachment: fixed` does not work on iOS Safari.** Do not use
   it. Use a `position: fixed` container holding the `next/image`, with page
   content in a higher stacking layer above it.

2. **Transformed/filtered ancestors break `position: fixed` descendants.** Any
   ancestor with `transform`, `filter`, `backdrop-filter`, `perspective`, or
   `will-change` creates a containing block, and a fixed child will anchor to
   *it* instead of the viewport. This page already has both a `transform:
   rotate(-0.7deg)` (the kicker highlight) and `backdrop-blur` (every card).
   **The fixed photo layer must not be nested inside any of them** — keep it a
   top-level child with a clean ancestor chain.

3. **iOS address-bar resize.** With a fixed photo, the viewport height change
   when Safari's chrome collapses can make the image jump. `svh`/`lvh`/`dvh`
   behave differently here — pick deliberately and test on a real iPhone, not
   just a resized desktop window.

4. **Stacking order.** Roughly: fixed photo (z-0) → constant scrim (z-1) →
   scrolling content incl. cards (z-10) → pinned ticker (z-40) → `SideNav`
   (already z-high, verify it still sits above the cards).

5. **`next/image` with `fill` inside a fixed container** needs the container to
   have real dimensions (`inset-0` on a fixed element is fine). Keep
   `priority` — it is the LCP element.

---

## 7. Files in play

| File | Role |
|---|---|
| `app/page.tsx` | Everything. Hero, header, ticker, `ProjectCard`, page shell. The main edit surface. |
| `app/globals.css` | `.v2-marquee`, `.v2-reveal`, `.hero-photo` mobile crop, `--v2-ground`. Ticker fade + reduced-motion go here. |
| `components/v2/ContactScene.tsx` | The "Let's connect" ending. Currently has `border-t` and assumes a dark ground — will need its background assumptions revisited for Option A. |
| `components/v2/Reveal.tsx` | One-way IntersectionObserver. **Correct as-is** — do not change. |
| `components/v2/SideNav.tsx` | Dot rail. Verify z-index against the new layers. |
| `components/v2/SwipeCard.tsx` | Swipe-to-open wrapper on each card. Should be unaffected; verify. |
| `app/projects/[slug]/page.tsx` | **Out of scope.** Do not touch. |

Recent related commits on `main`: `003167b`, `658d72a` (hero kicker highlight),
`acad402` (logo link), `31eb0fb` / `2f3cec3` (MisterGopalka → AdityaGopalka).

---

## 8. Definition of done

- [ ] Photo fixed and steady through the entire scroll, hero → contact
- [ ] Ticker pinned throughout, fading past the hero (§4)
- [ ] Hero text + header scroll away; scrolling back up restores them
- [ ] Cards read as dark glass over the photo, copy fully legible at every
      scroll position (check the bright wall *and* the dark shirt regions)
- [ ] "Let's connect" arrives over the photo, Option A
- [ ] Verified on real iPhone Safari — no jump on address-bar collapse
- [ ] Verified on a mid-range Android — blur does not stutter
- [ ] `prefers-reduced-motion` respected
- [ ] Project pages unchanged
- [ ] Reviewed on the Vercel preview URL and approved by Aditya before merge
