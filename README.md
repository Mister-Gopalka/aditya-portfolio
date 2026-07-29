# Aditya Gopalka — Portfolio

Personal portfolio for **Aditya Gopalka**, Creative Director / Brand Manager /
Fractional CMO (Delhi). A homepage listing ten projects as cards, plus a full
case-study page for each.

Live: **https://www.adityagopalka.com**

## Stack

- **Next.js 16.2.9** (App Router) + **React 19.2.4**
- **Tailwind CSS v4** (CSS-variable syntax)
- **TypeScript**
- **Supabase** (`lib/supabase.ts`) — backs `/admin`, which only toggles
  per-project visibility
- Hosted on **Vercel**

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build (21 static pages)
npm run start        # serve the production build
npx tsc --noEmit     # type check
npm run lint
```

### Testing on a real device

Open the machine's LAN address on the same Wi-Fi — `ipconfig getifaddr en0`.

If the page renders but the content is invisible — cards look like empty
panels, hero text missing — **it is not a styling bug.** Next.js blocks
cross-origin requests to dev-only assets, so React never hydrates and every
scroll-reveal stays at `opacity: 0`. The address must be listed in
`allowedDevOrigins` in `next.config.ts`; update it when DHCP changes the IP.

For anything performance-related, test a production build rather than the dev
server — dev mode is not a fair measure of compositing cost:

```bash
npm run build && PORT=4321 npm run start
```

## Structure

```
app/
  page.tsx              homepage — fixed photo stage, ticker, project cards
  projects/[slug]/      one shared template renders every case study
  admin/                visibility toggles
  globals.css           design tokens, scroll-reveal, marquee
components/
  v2/                   Reveal, SideNav, SwipeCard, ContactScene, LiteYouTube,
                        ScrollProgress
  SmartImage, DeckCarousel, VideoEmbed, AdminPanel, Header
lib/projects.ts         all project content
public/assets/<slug>/   per-project images and media
```

## Deploying

**`git push origin main` is the deploy.** Vercel builds from `main`; there is
no staging step.

Roll back a merged feature with:

```bash
git revert -m 1 <merge-sha> && git push origin main
```

Merges use `--no-ff` so a whole feature reverses as a single commit.

The admin password is set in the Vercel dashboard and is never committed.

> **Asset paths are case-sensitive in production and not on your Mac.** macOS
> ignores case, Vercel's Linux build does not — so an asset referenced as
> `oyo-ad1.png` when the file is `OYO Ad1.png` works locally and 404s only once
> deployed. Match the filename exactly, including capitals and spaces.

## Before changing anything

Read **`HANDOFF.md`** for the current state, the content model, and the
non-obvious constraints — particularly the homepage's fixed photo stage, which
has several load-bearing rules that are easy to break by accident. Then
**`AGENTS.md`**.

Project conventions, design decisions, and the site's purpose live in
`../CLAUDE.md`.
