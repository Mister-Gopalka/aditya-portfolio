# Aditya Gopalka — Portfolio

Personal portfolio for **Aditya Gopalka**, Creative Director / Brand Manager /
Fractional CMO (Delhi). A homepage listing ten projects as cards, plus a full
case-study page for each.

Live: **https://www.adityagopalka.com**

## Stack

- **Next.js 16.2.9** (App Router) + **React 19.2.4**
- **Tailwind CSS v4** (CSS-variable syntax)
- **TypeScript**
- **Supabase** (`lib/supabase.ts`) — backs `/admin`: the contact inbox, visitor
  stats, and per-project visibility
- Hosted on **Vercel**

### Environment variables

Set in `.env.local` locally and in the Vercel dashboard for production. None
are committed.

| Variable | Required | What it does |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Public key. Ships in the browser bundle — RLS is what limits it |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | **Server-only.** Reads the inbox and visitor stats, writes site settings. Without it the contact form returns 500 |
| `ADMIN_PASSWORD` | yes | Sign-in for `/admin`. Also the default key that signs session cookies, so changing it signs you out |
| `RESEND_API_KEY` | no | Emails each new enquiry. Without it messages still save, they just do not alert |
| `CONTACT_TO_EMAIL` | no | Defaults to `mistergopalka@gmail.com` |
| `CONTACT_FROM_EMAIL` | no | Defaults to Resend's shared sender, which only delivers to the Resend account owner. Set once a domain is verified |
| `ADMIN_SESSION_SECRET` | no | Signs session cookies independently of the password |

**`SUPABASE_SERVICE_ROLE_KEY` must never carry a `NEXT_PUBLIC_` prefix.** It
bypasses row-level security entirely; prefixing it would publish it.

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
  admin/                inbox, visitor stats, visibility toggles
  api/admin/            auth, inbox actions, visibility — all behind proxy.ts
  api/contact/          saves a form submission and emails it on
  api/track/            records one pageview
  globals.css           design tokens, scroll-reveal, marquee
proxy.ts                session gate for /api/admin/* (Next 16's middleware)
components/
  v2/                   Reveal, SideNav, SwipeCard, ContactScene, LiteYouTube,
                        ScrollProgress
  SmartImage, DeckCarousel, VideoEmbed, AdminPanel, AdminLogin, Tracker, Header
lib/projects.ts         all project content
lib/admin-auth.ts       signs and verifies the session cookie
lib/inbox.ts            contact submissions
lib/analytics.ts        pageview recording and aggregation
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

The admin password is set in the Vercel dashboard and is never committed. Any
new environment variable has to be added there before the deploy that needs it,
or the deploy ships broken — see the table above.

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
`CLAUDE.md`.
