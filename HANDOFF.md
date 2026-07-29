# Handoff — current state

**This is the live state doc. It changes every session; the other docs mostly don't.**

Read `../CLAUDE.md` first (purpose, rules, design decisions), then this.
Stack, commands and deploy are in `README.md` — not repeated here.

Last updated: **2026-07-29**

---

## 1. Status

The site is **live and complete**. Ten project pages plus a homepage that lists
them as cards. Everything below is done unless it appears in §5.

## 2. Content model

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
`visibleProjects` sorts by. Reordering means editing that list; nothing else
depends on array order, since links, anchors and nav are all slug-keyed.

Current locked order:
`homelane · oyo · nexttt-one · nepal-election · lepton · beato · troost ·
zero-se-restart · big-muscles · blanket-wars`

### Project page renderer — `app/projects/[slug]/page.tsx`
One shared template renders every project from its `content`. Several shapes
coexist, added per-project over time:

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
- **`DeckCarousel`** — swipeable one-at-a-time carousel. Props: `images` |
  `slides`, `alt`, `frameless`, `loop`.
- **`VideoEmbed`** — `type` = `youtube` | `shorts` | `spotify`.
- **`Reveal`** — one-way IntersectionObserver scroll-reveal, wraps most blocks.
  It disconnects after firing; revealed content stays revealed. Correct as-is.

### Assets
`public/assets/<slug>/…`. Instagram reels are login-walled and render as
click-out buttons; reels that exist on YouTube play inline.

## 3. Homepage — the "fixed stage" (shipped 2026-07-29)

The hero photo does not scroll away. It and its gradient sit in a
`position: fixed` layer behind the whole page; hero text, cards and contact
travel over them. The photo and scrim were not redesigned — same framing, same
gradient.

**Load-bearing constraints. Breaking any of these breaks the page:**

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
  of the photo. Contact-section alphas were raised for exactly this reason.
  Check contrast against the photo, not against the dark ground.

Project pages keep their own per-project hero images and were left alone.

## 4. Recent history

- **2026-07-29** — Fixed stage shipped and deployed. Docs restructured so each
  fact has one owner. Orphaned favicons, zero-byte junk files and a
  backslash-named debris folder deleted.
- **2026-07-25** — Perf pass: dead `content.nexttt` renderer removed, assets
  compressed. Black Water Bottle project removed (may return; its assets are in
  `../_deleted-assets-backup-2026-07-25/`, kept deliberately).

## 5. Open tasks

1. **Troost card — reframe toward ownership.** It sits in an
   ownership/direction slot but the copy sells speed and volume ("7 Scripts
   Into 7 Reels", "14 reel ads"). Aditya was the creative director: he built
   the team and directed the shoot. Rewrite `summary` and `result` to lead with
   the role. Worth a role-forward gut-check across all ten cards at the same
   time. *(Agreed in principle, not done.)*

---

## Keeping this doc current

At the end of a working session, update **§1 status**, **§4 history** and
**§5 open tasks**, and add anything to **§3** that a future session could break
without knowing why it was done that way. Leave the rest alone.

If something belongs to purpose, rules or design decisions, it goes in
`../CLAUDE.md` instead. If it is stack, commands or deploy, it goes in
`README.md`. Nothing should be stated in two files.
