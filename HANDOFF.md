# Handoff — decisions, constraints, open work

**What this file is for:** the things git cannot tell you. Why a decision was
made, what is fragile, and what has been agreed but not built.

**What it deliberately does not contain:** current state or history. `git log
--oneline` and `git status` cover those perfectly and are never stale. Stack,
commands and deploy live in `README.md`; purpose, rules and design decisions
live in `CLAUDE.md`.

---

## 1. Content model

Everything renders from `lib/projects.ts`. Each project has **card fields** at
the top level and a **`content` object** for the case-study body.

### Card fields
`slug`, `title` (also page H1 + SEO title), `client`, `role`, `categories`,
`summary`, `result`, `coverImage`, `visible`.

**Card formula:** `title` = the outcome or hook · `summary` = "Role — terse
deliverables", no numbers · `result` = the proof or number, rendered as a gold
`↗` line. **No fact appears in more than one of the three.**

### Card order
The `CARD_ORDER` array in `app/page.tsx` — a list of slugs that
`visibleProjects` sorts by. Reordering means editing that list and nothing
else; links, anchors and nav are all slug-keyed, so array order carries no
other meaning.

### Project page renderer — `app/projects/[slug]/page.tsx`
One shared template renders every project from its `content`. Several shapes
coexist, added per-project over time. **Check which shape a project uses before
adding to it** — mixing two on one project is the easiest mistake to make here.

- **`content.sections`** — generic `{heading, body}[]` for simple pages.
  `[[word]]` renders as an orange accent.
- **`content.nextttChapters`** — the newest and most flexible system. Chapters
  `{eyebrow?, title, blocks[]}`, each a `<section>`; `blocks` is an ordered
  typed union by `kind`: `sub` (Part/Phase heading, `deep:true` nests smaller),
  `para`, `list` (`ordered?`), `reels`, `table` (A/B with `groupBefore`
  sub-headers and status badges), `film` (portrait YouTube + bold `label`),
  `carousel`, `image` (`width`, `caption`), `week` (day/what rows).
  **Use this block system for any new free-form page.**
- **Per-project shapes:** `homelane` (campaigns, brand extensions with
  browser-frame mockups, Cubico carousel, performance ads via
  `getPerformanceAds()`), `blanket-wars` (`musicStages`), `lepton`
  (`funnelGroups`, `salesPitch`, `brandBlock`, `campaignSpotlight`), plus
  `keyTakeaway`/`keyTakeawayAttribution`, `spotifyTrackId`/`spotifyCopy`/
  `songYoutubeUrl`, `videos`, `extraLinks`.

### Shared components
- **`renderRich(text)`** (in `page.tsx`) — parses `**highlighted**` into
  brighter semibold "skim leads". This is the highlight system.
- **`SmartImage`** — local images go through this (next/image
  `width=0/height=0/sizes` pattern), not raw `<img>`.
- **`DeckCarousel`** — swipeable one-at-a-time carousel. Props: `images` |
  `slides`, `alt`, `frameless`, `loop`.
- **`VideoEmbed`** — `type` = `youtube` | `shorts` | `spotify`.
- **`Reveal`** — one-way IntersectionObserver scroll-reveal, wraps most blocks.
  It disconnects after firing, so revealed content stays revealed. Correct
  as-is; do not "fix" it to re-hide on scroll-up.
- **`LiteYouTube`** — its remote thumbnail is a raw `<img>` on purpose, for the
  `onError` fallback. Do not migrate it to next/image.

### Assets
`public/assets/<slug>/…`. Instagram reels are login-walled and render as
click-out buttons; reels that also exist on YouTube play inline.

## 2. Homepage — the "fixed stage"

The hero photo does not scroll away. It and its gradient sit in a
`position: fixed` layer behind the whole page; hero text, cards and contact
travel over them. The photo and scrim were not redesigned — same framing, same
gradient as before the change.

**Load-bearing constraints. Each of these looks like arbitrary code and is not:**

- The stage is a **top-level child of `<main>`**. Any ancestor with
  `transform`, `filter`, `backdrop-filter` or `perspective` becomes the
  containing block for a fixed descendant and kills the pinning. The kicker's
  `rotate()` and the cards' blur sit *below* it in the tree deliberately.
- Height is **`100lvh`**, not `svh`/`dvh`, so the layer does not resize when
  iOS Safari's address bar collapses. `svh` makes the photo jump mid-scroll.
- The ticker is **`fixed`, not `sticky`** — sticky repositions on the main
  thread and visibly lags during iOS momentum scroll. The in-flow placeholder
  `<div>` immediately after it reserves the height it no longer occupies.
  **Delete that placeholder and the whole page rides up ~45px**, putting the
  hero kicker on top of the wordmark.
- Cards are dark glass, tint in `--v2-card-tint`. **Mobile gets a near-solid
  tint and no `backdrop-filter`** (`md:backdrop-blur-lg`). Opacity is nearly
  free; blur is expensive, and ten blurred layers over a fixed photo is the
  main performance risk on this page.
- The scrim gradient is anchored to the **viewport**, not the document, so
  anything landing in the top third of the screen sits over the brightest part
  of the photo. Contact-section text alphas were raised for exactly this
  reason. **Check contrast against the photo composite, not the dark ground.**

Project pages keep their own per-project hero images and were left alone.

## 2b. Admin panel and data — load-bearing rules

The panel holds real enquiries from real people. These are not style choices.

- **`SUPABASE_SERVICE_ROLE_KEY` is server-only and must never gain a
  `NEXT_PUBLIC_` prefix.** It bypasses row-level security completely. The
  prefix is the only thing standing between it and the published bundle.
- **RLS is the real access control, not the API routes.** The anon key is
  public by design, so anything the anon role may do, the internet may do.
  `site_settings` is public-read and server-write; `contact_submissions` is
  insert-only; `pageviews` has no public policy at all. Adding a convenience
  policy to any of them reopens what `fbbbfa5` closed — before that commit a
  `Public write` policy on `site_settings` let anyone hide every project.
- **`proxy.ts` is the gate for `/api/admin/*`.** Next 16 renamed the
  `middleware` convention to `proxy`. A new admin route is protected the
  moment it lives under that path and unprotected the moment it does not.
  `/admin` itself is guarded separately, in the page's own server component,
  so nothing is fetched before the session is verified.
- **The contact form must fail loudly.** It previously inserted from the
  browser and always showed the success state, so a rejected write looked
  exactly like a delivered message. Two submissions sat unread for weeks.
- **Visitor logging stores a daily-salted hash of the IP, never the IP.** The
  salt rotates daily on purpose: enough to count distinct people per day, not
  enough to follow anyone between days. Nothing is written to the visitor's
  browser, which is why the site needs no consent banner. Keep it that way.
- **`/admin` is excluded from tracking** in `components/Tracker.tsx`, and
  deduped at module scope rather than in a ref — a ref is recreated by React's
  double mount, which recorded two rows per view.

## 3. Open work

1. **Troost card — reframe toward ownership.** It sits in an
   ownership/direction slot but the copy sells speed and volume ("7 Scripts
   Into 7 Reels", "14 reel ads"). Aditya was the creative director: he built
   the team and directed the shoot. Rewrite `summary` and `result` to lead with
   the role. Worth a role-forward gut-check across all ten cards at the same
   time. *(Agreed in principle, not done.)*

2. **Homepage card reordering from `/admin`.** Card order is hardcoded in
   `lib/projects.ts`. Being able to reorder without a deploy would let the
   most relevant work lead when applying for a specific role. Discussed and
   deliberately deferred, not rejected. *(Not started.)*

3. **Rate limiting on `/api/contact`.** Length caps and required fields are
   enforced; nothing throttles repeat posts. Fine at current volume, and the
   first thing to add if the inbox ever gets spammed.

## 4. Removed, on purpose

- **Black Water Bottle** (2026-07-25) — brand being reworked, may return. Its
  assets, and ~80 other unreferenced files from the same cleanup, are in
  `../_deleted-assets-backup-2026-07-25/`. Kept deliberately; nothing in it is
  referenced by code.
- **`/v1` and `/v2` routes, `content.nexttt` renderer** — deleted. If an older
  note mentions them, that note is out of date.

---

## Keeping this file current

At the end of a session, update **§3 open work**, and add to **§1** or **§2**
anything a future session could break without knowing why it was done that way.
Leave the rest alone.

Do not add status or history here — git already has both. If a fact is about
purpose, rules or design, it belongs in `CLAUDE.md`; if it is about stack,
commands or deploy, it belongs in `README.md`. Nothing should appear twice.
