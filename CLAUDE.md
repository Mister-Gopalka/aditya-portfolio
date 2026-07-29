# Aditya Gopalka Portfolio — Project Instructions

The site is **built and live** at https://www.adityagopalka.com. This is
maintenance work, not a build.

---

## 1. What this site is for

**This site is for getting Aditya hired as a Creative Director, Brand Manager,
or Fractional CMO.**

The reader is a hiring manager or founder with very little time, deciding one
thing: *can this person own creative and deliver business outcomes?*

Everything else follows from that:

- **Proof over polish.** A number a reader can check beats any adjective.
- **Ownership over volume.** What he decided, led, and was accountable for
  matters more than how much got produced. "Directed the shoot and built the
  team" outranks "made 14 films."
- **Built to skim.** Assume they read the bolded leads and the gold result
  lines and nothing else. Each must stand alone.
- **Nothing may obstruct the judgement.** Legibility, load speed, and clarity
  outrank visual ambition every time.

When a decision is genuinely ambiguous, pick whatever makes a hiring reader's
decision easier. That is the tiebreaker.

## 2. Hard rules

- **Start by checking `git status` and `git log --oneline -5`.** Git is the
  only account of current state that is never stale. Do this instead of
  assuming what happened last session.
- **Never commit the admin password.** It lives in Vercel env vars only.
- **Never edit `main` directly.** Branch, verify, then merge as one revertible
  commit.
- **Never push to `main` without explicit approval** — pushing publishes to the
  live site immediately.
- **Content lives in `lib/projects.ts`**, never in a document.
- **Project pages and the homepage are separate concerns.** Changing one does
  not license changing the other.
- **Verify by DOM, not screenshots.** Screen captures in this project return
  blank or partial images often enough to be untrustworthy. Read computed
  styles, rects, and text content instead.

## 2b. Shipping a change

Branch → build passes → verify → one commit → `merge --no-ff` → push **only
with approval** → confirm the live site serves it.

Skip the ceremony for a copy tweak if asked to, but never skip *verify*, and
never skip *approval before push*.

## 3. Design decisions

These are settled. Do not drift from them without being asked.

- **Fonts:** Fraunces (display, `var(--font-fraunces)`) + Space Grotesk (body).
- **Colour roles:** body text `#FFF8F3` at ~75% opacity · **gold `#C9956A`**
  for eyebrows, phase headings, result lines, numerals and badges · orange
  `#E85D45` for `[[accent]]` words · full-white `#FFF8F3` semibold for
  `**highlighted**` skim leads. These are settled and written directly as hex.
- **The dark ground is the one colour that must never be hardcoded.** Always
  reference `--v2-ground` (`bg-(--v2-ground)`, `var(--v2-ground)` in inline
  styles) rather than typing `#120600`. It is the one colour still open to
  being swapped, and a hardcoded copy will not update if it is.
- **Voice — "Bare Bones":** problem first, then fact, then action. Short
  sentences. No em-dashes in body copy. No self-praising adjectives. Precise
  about ownership, specific with credit. Default for all project body copy.
- **Currency:** full numbers with `₹` (`₹5,000`, `₹1,00,000`). Never "k".
- **Highlights** (`**phrase**`) must be self-sufficient — someone reading only
  the bolds should still get the whole story.

## 4. Working with Aditya

- Propose → he approves or edits → implement → verify. Confirm before big
  structural changes; small copy edits can be applied then verified.
- He gives precise copy edits and expects them applied exactly. Flag any
  automatic restyling, such as title-casing.
- Keep zero redundancy across cards, sections, and docs.
- Optimise for fewer, larger steps rather than many small round trips.

## 5. How much to read before starting

Everything above is already loaded. Read further only when the task needs it:

| Task | Read first |
|---|---|
| Copy or content edit to an existing project | Nothing. Go to `lib/projects.ts`. |
| Adding or restructuring a project page | `HANDOFF.md` §1 — content model |
| **Anything touching the homepage** | `HANDOFF.md` §2 — fixed-stage constraints. Non-negotiable; they look like arbitrary code and are not. |
| Resuming earlier work, or state is unclear | All of `HANDOFF.md`, after `git log` |
| Running, building, deploying, device testing | `README.md` |
| Original source content, links, asset paths | `../Website Brief — …md` (archive) |

The Website Brief is kept for its source content only. Its design decisions and
build order are obsolete. **Where any two documents disagree, `HANDOFF.md`
wins, and this file wins over both on purpose and rules.**

@AGENTS.md
