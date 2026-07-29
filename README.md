# Aditya Gopalka — Portfolio

Personal portfolio for **Aditya Gopalka**, Creative Director / Brand Manager /
Fractional CMO (Delhi). A homepage that lists ten projects as cards, plus a
full case-study page for each.

Live: **https://www.adityagopalka.com**

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** (CSS-variable syntax)
- **TypeScript**
- **Supabase** — backs the `/admin` panel, which only toggles per-project visibility
- Deployed on **Vercel**

Fonts are **Fraunces** (display) and **Space Grotesk** (body).

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build
npm run start        # serve the production build
npx tsc --noEmit     # type check
npm run lint
```

**Testing on a phone:** open the machine's LAN IP on the same Wi-Fi
(`ipconfig getifaddr en0`). If the page renders but text and cards are
invisible, that is not a styling bug — Next blocks cross-origin requests to
dev-only assets, so React never hydrates and every scroll-reveal stays at
`opacity: 0`. The LAN address must be listed in `allowedDevOrigins` in
`next.config.ts`. For a fair read on performance, use `npm run build && npm run start`
rather than the dev server.

## Structure

```
app/
  page.tsx              homepage — hero, fixed photo stage, ticker, project cards
  projects/[slug]/      one shared template renders every case study
  admin/                visibility toggles (password lives in Vercel env only)
  globals.css           design tokens, scroll-reveal, marquee
components/v2/          Reveal, SideNav, SwipeCard, ContactScene, LiteYouTube
lib/projects.ts         all project content — the single source of truth
public/assets/<slug>/   per-project images and media
```

**Content lives in `lib/projects.ts`**, not in any document. Homepage card order
is the `CARD_ORDER` array in `app/page.tsx`.

## Deploying

`git push origin main` **is** the deploy — Vercel builds from `main`, and there
is no staging step. To roll back a merged feature:

```bash
git revert -m 1 <merge-sha> && git push origin main
```

The admin password is set in the Vercel dashboard and must never be committed.

## Before changing anything

Read **`HANDOFF.md`** — current state, content model, conventions, and the
non-obvious constraints (particularly around the homepage's fixed photo stage,
which has several load-bearing rules that are easy to break by accident).
Then **`AGENTS.md`**.
