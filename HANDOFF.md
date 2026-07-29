# Aditya Gopalka Portfolio — Handoff / State Doc

Snapshot for continuing work in a fresh chat. Read this + `CLAUDE.md` (→ `AGENTS.md`) before touching code.

---

## 1. What this is & where it lives

A bespoke Next.js portfolio site for **Aditya Gopalka** (Creative Director / Copywriter / marketing leader, Delhi). Ten project case-study pages + a homepage that lists them as cards. (Black Water Bottle removed 2026-07-25; `/v1` archive route also deleted.)

- **Codebase:** `/Users/adityagopalka/Downloads/Portfolio by Claude/aditya-portfolio/`
- **Single source of truth for all content:** `lib/projects.ts` (one big `projects` array of typed objects).
- **Website Brief (original spec):** `/Users/adityagopalka/Downloads/Portfolio by Claude/Website Brief — Aditya Gopalka Portfolio.md`
- **Auto-memory (persists across chats):** `/Users/adityagopalka/.claude/projects/-Users-adityagopalka-Downloads-Portfolio-by-Claude/memory/` — notably `bare-bones-voice.md` (the writing voice) and `preview-screenshot-flakiness.md`.

## 2. Tech stack & gotchas

- **Next.js 16.2.9, React 19.2.4** (App Router). This is newer than most training data — `AGENTS.md` warns: "This is NOT the Next.js you know." Check `node_modules/next/dist/docs/` before writing framework code.
- **Tailwind v4** (CSS-variable syntax). Fonts: **Fraunces** (serif/display, `var(--font-fraunces)`) + **Space Grotesk** (sans/body).
- **Supabase** (`lib/supabase.ts`) backs the admin panel (`/admin`, `components/AdminPanel.tsx`) which only toggles per-project **visibility**. Admin password lives in **Vercel env vars only, never in code**.
- **Deploy target:** Vercel (not yet deployed).

## 3. Run & verify

- Dev server: preview config name **`portfolio`** in `.claude/launch.json`, port **3000** (`npm run dev`). Use the browser preview tools, not Bash, to run it.
- Production check: `npm run build` (currently passes, 21 static pages). `npx tsc --noEmit` for types.
- **Verify via DOM, not screenshots.** The browser screenshot tool frequently returns blank/partial captures in this project (see memory). Use `javascript_tool` (`getBoundingClientRect`, `textContent`, computed styles) or `get_page_text` to confirm changes reliably.
- **Testing on a real phone.** Same Wi-Fi, open the machine's LAN IP (`ipconfig getifaddr en0`). If the page renders but everything is invisible — cards look like empty panels, hero text missing — that is **not** a CSS bug: Next blocks cross-origin requests to dev-only assets, React never hydrates, and every `.v2-reveal` stays at `opacity: 0`. `allowedDevOrigins` in `next.config.ts` allows it (update the IP when DHCP changes it). For an accurate read on performance use a production server instead: `npm run build && PORT=4321 npm run start`. Dev mode is not a fair test of blur/compositing cost.

## 4. Content model (the important part)

Everything renders from `lib/projects.ts`. Each project object has **card fields** (top level) + a **`content` object** (the project page body).

### Card fields (homepage + page hero + SEO)
`slug`, `title` (also the page H1 + SEO title), `client`, `role`, `categories`, `summary`, `result`, `coverImage`, `visible`.
- **Card formula:** `title` = outcome/hook · `summary` = "Role — terse deliverables" (no numbers) · `result` = the proof/number (renders as a gold `↗` line). Zero fact repeated across the three.

### Homepage card ORDER
Controlled by the **`CARD_ORDER`** array in `app/page.tsx` (a list of slugs; `visibleProjects` is sorted by it). Reordering = edit that list. Nothing else depends on array order (all links/anchors/nav are slug-keyed). Current locked order (10 projects; Black Water Bottle deleted 2026-07-25):
`homelane, oyo, nexttt-one, nepal-election, lepton, beato, troost, zero-se-restart, big-muscles, blanket-wars`.

### Project page renderer: `app/projects/[slug]/page.tsx`
One shared template renders every project from its `content`. Several content **shapes** coexist (added per-project over time):

- **`content.sections`** — generic `{heading, body}[]` (legacy simple pages). `[[word]]` in a body renders as an orange accent.
- **`content.nextttChapters`** — the newest, most flexible system, built for Nexttt One. An array of **chapters** `{eyebrow?, title, blocks[]}`, each rendered as a `<section>`. `blocks` is an ordered typed union (`kind`): `sub` (Part/Phase heading; `deep:true` = smaller nested heading), `para`, `list` (`ordered?`), `reels`, `table` (A/B table w/ `groupBefore` sub-headers + status badges), `film` (portrait YouTube + bold `label`), `carousel` (DeckCarousel), `image` (`width`, `caption`), `week` (day/what rows). **This block system is the best pattern for any future free-form page.**
- **`content.nexttt`** — the OLDER flat Nexttt One renderer. **DELETED** (2026-07-25 optimization pass) — type in `lib/projects.ts` and the renderer block in `page.tsx` both removed. Nexttt One uses `nextttChapters`.
- **Per-project structures:** `homelane` (`content.homelane`: campaigns, brand extensions w/ browser-frame mockups, Cubico DeckCarousel, performance ads folder-driven via `getPerformanceAds()`), `blanket-wars` (`content.musicStages`), `lepton` (`funnelGroups`, `salesPitch`, `brandBlock`, `campaignSpotlight`, etc.), plus `keyTakeaway`/`keyTakeawayAttribution` (closing pull-quote), `spotifyTrackId`/`spotifyCopy`/`songYoutubeUrl` (Blanket Wars), `videos`/`extraLinks`.

### Shared components
- **`renderRich(text)`** (in `page.tsx`): parses **`**highlighted**`** spans → brighter/semibold white "skim leads". Used across nexttt/chapter bodies. This is the **highlight system** — a `**phrase**` at a paragraph start is a skim anchor.
- **`DeckCarousel`** (`components/DeckCarousel.tsx`): swipeable one-at-a-time image/slide carousel. Props: `images` | `slides`, `alt`, `frameless`, `loop` (forward-only wrap).
- **`VideoEmbed`** (`components/VideoEmbed.tsx`): `type` = `youtube` | `shorts` | `spotify`.
- **`Reveal`** (`components/v2/`): scroll-reveal wrapper used around most blocks.

### Assets
`public/assets/<slug>/…`. Reels that can't embed (Instagram is login-walled) render as click-out buttons; where a reel is on YouTube it plays inline (e.g. Nexttt One Supply6 = YouTube Short `L-kP_X8-8Ok`).

## 5. Conventions

- **Voice = "Bare Bones"** (see memory `bare-bones-voice.md`): problem-first, fact-then-action, short sentences, no em-dashes in body copy, no self-praising adjectives, precise ownership, specific credit. Default for project body copy.
- **Highlights:** wrap the skim-lead phrase in `**…**`. Keep them **self-sufficient** (each must impart info on its own — a reader skimming only the bolds should get the whole story).
- **Colors:** ground is dark (`--v2-ground`); body text `#FFF8F3` at ~75% opacity; **gold accent `#C9956A`** (eyebrows, phase headings, result line, numerals, badges); orange `#E85D45` for `[[accent]]` words; highlight bold = full-white `#FFF8F3` semibold.
- **Currency:** full numbers with `₹` (e.g. `₹5,000`, `₹1,00,000`) — no "k" shorthand in copy.
- **Brand name:** "Nexttt One" in body copy (caps like "NEXTTT ONE" only inside deliberate product-name headings).

## 6. Status — DONE

All 10 project pages + cards are written, styled, and building. In current card order:
1. **HomeLane** — "Built Ads That Drove Revenue and Brand Equity" (de-carded editorial layout; Cubico browser-frame carousel; performance-ads folder).
2. **OYO** — "A Viral Campaign That Got Couples A Room".
3. **Nexttt One** — "Business Reboot" (fully rebuilt into the `nextttChapters` block system: The Business → Ch.1 Strengthen the Agency → Ch.2 Strengthen the Academy → Ch.3 Make every part work together → key takeaway. All creatives placed: Supply6 reel + IG buttons, NTA brochure, A/B table + winning-ad video, portfolio carousel, workshop creative + caption, weekly planner).
4. **Nepal** — "Scaling a Political Campaign to 16M Views in 60 Days".
5. **Lepton** — "Made a Complex Geospatial SaaS Easy to Sell".
6. **BeatO** — "Built a Timeless Campaign" · result "5 years · Still building community".
7. **Troost** — "Turning 7 Scripts Into 7 Reels in One Day".
8. **Vinod Chopra Films / 12th Fail** (slug `zero-se-restart`) — "My Third Film With VCF: The Making of 12th Fail".
9. **Big Muscles** — "Wrote the Tagline and TVC Scripts for Big Muscles".
10. **Blanket Wars** — "Released and Marketed My Own Song" (musicStages). *(now the closing card)*

*(Removed 2026-07-25: **Black Water Bottle** — brand being reworked, may return later; its assets are in the `_deleted-assets-backup-2026-07-25/` folder.)*

## 6b. Homepage — the "fixed stage" (shipped 2026-07-29)

The hero photo no longer scrolls away. It and its gradient sit in a
`position: fixed` layer behind the **whole** page; hero text, cards and contact
all travel over them. The photo and scrim themselves were not redesigned — same
framing, same gradient — so the top of the page looks as it always did.

Constraints that are load-bearing, do not break them:

- The stage is a **top-level child of `<main>`**. Any ancestor with `transform`,
  `filter`, `backdrop-filter` or `perspective` becomes the containing block for
  a fixed descendant and breaks the pinning. The kicker's `rotate()` and the
  cards' blur both sit *below* it in the tree deliberately.
- Height is **`100lvh`**, not `svh`/`dvh`, so the layer does not resize when iOS
  Safari's address bar collapses. `svh` makes the photo jump mid-scroll.
- The ticker is **`fixed`, not `sticky`** — sticky repositions on the main thread
  and visibly lags during iOS momentum scroll. An in-flow placeholder `<div>`
  directly after it mirrors its box to reserve the height it no longer occupies.
  Delete that placeholder and the whole page rides up ~45px and the hero kicker
  collides with the wordmark.
- Cards are dark glass over the photo, tint in `--v2-card-tint`. **Mobile gets a
  near-solid tint and no `backdrop-filter`** (`md:backdrop-blur-lg`): opacity is
  nearly free, blur is the expensive part, and ~10 blurred layers over a fixed
  photo is the main perf risk on this page.
- Contact-section alphas were raised for legibility over the bright wall. Anything
  landing in the **top third of the viewport** sits over the brightest part of the
  photo, because the scrim gradient is anchored to the viewport, not the document.

Project pages (`/projects/[slug]`) were deliberately left alone — they keep their
own per-project hero images.

## 7. Remaining tasks

1. **Troost card — reframe copy toward ownership.** It's #7 (an "ownership/direction" slot) but the card sells speed/volume ("7 Scripts Into 7 Reels" / "14 reel ads"). Aditya was the **creative director — built the team, directed the shoot**. Rewrite summary/result to foreground the role. *(Discussed, approved in principle, not yet done.)* Worth a quick role-forward gut-check across all cards while at it.
2. **`README.md` is still create-next-app boilerplate** — it references Geist, which this project does not use. Replace or leave, but do not trust it.

*(Done: dead `content.nexttt` renderer deleted; image/perf pass done 2026-07-25;
deployed to Vercel — `git push origin main` **is** the deploy, no staging step.
Rollback is `git revert -m 1 <merge-sha> && git push origin main`.)*

## 8. Working style Aditya prefers

- Discuss/propose → he approves or edits → implement → verify. He gives precise copy edits and expects them applied exactly (flag any auto-styling like title-casing).
- He iterates heavily on copy; keep zero redundancy across sections and cards.
- Confirm before big structural changes; small copy edits can be applied directly then verified.
