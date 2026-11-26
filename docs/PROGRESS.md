# Progress

What has been built, in order. Commit hashes included so anything here can be
checked against the actual diff.

---

## 2026-04-13 — Original site

`381f9d2` · `5d5272a` · `655c687`

Next.js 15 / React 19 directory for Central Illinois church musicians. Six
musician profiles, filterable browse page, individual profile pages, plus a
church-directory side (cities, churches, claims, admin review queues).

Teal and parchment visual style, Fraunces display font. Prisma schema present
but unused by the public pages — all data read from hardcoded modules.

---

## 2026-07-27 — Broker layer, rate floor, redesign

`ee529c5`

**The $35/hour floor.** Added `lib/rates.ts` as the single source of truth for
every dollar figure on the site. `enforceFloor()` clamps any rate to the
minimum, so no surface can display or quote below it. Added `hourlyRate` to all
six musician records.

**Gig booking.** Built the rate calculator and a three-step gig request form,
both reading from `lib/rates.ts`. Live quote updates as you adjust sliders.
Added `/rates` and `/request-musician`.

Two components from a previous session were found sitting in `~/Downloads`,
never integrated. They were rebuilt against the shared rate engine rather than
dropped in as-is.

**Apple-influenced redesign.** Installed `DESIGN.md` via
`npx getdesign@latest add apple` and applied it by remapping the existing
semantic Tailwind tokens, which shifted the whole site at once rather than
page by page. Two-row navigation, single Action Blue accent, flat surfaces,
17px body text, system font stack resolving to SF Pro on Apple devices and
Inter elsewhere.

**SEO fixes.** The sitemap had been advertising the admin panel; `robots.txt`
invited crawlers into `/admin`, `/dashboard`, and `/login`. Both corrected.

---

## 2026-07-27 — Forms that discarded input; sample-data honesty

`0b05a93`

Three contact paths accepted input and threw it away.

- **`/contact`** — the form had no `action` attribute at all. It submitted
  nowhere. Wired to a server action with real confirmation.
- **Privacy leak found while testing.** Before hydration the form fell back to
  a GET submit, putting the sender's name, email, and message into the URL,
  where they reach browser history, server logs, and referrer headers. Fixed by
  setting `method="post"` explicitly.
- **`/create-profile`** — the submit button cleared the local draft and
  displayed "Profile submitted successfully" without sending anything. A
  message shown to real musicians that was simply false. Now awaits the server
  and only clears the draft once accepted.

**Sample-data honesty.** All six musicians flagged `example: true` and labeled
with a notice on the directory and a badge on every card and profile. Their
fake emails, phone numbers, and dead social links are no longer rendered, and
the contact button that would have gone nowhere is replaced.

The homepage previously claimed "80+ profiles" and a "24h response window".
Both were invented. Replaced with figures derived from real data, which revert
automatically once genuine listings exist.

**Mistakes made here:** first edited a contact form component that wasn't the
one in use (dead code), and broke the build once with a misplaced JSX comment.
Both caught before shipping.

---

## 2026-07-27 — Email notification plumbing

`be5a254`

`lib/notify.ts` posts to the Resend REST API directly — no SDK, no dependency.
Delivery failure never throws, so a submission that reached the server is never
lost to a provider outage. Callers learn whether delivery happened, so the UI
can be honest about it.

`npm run check:email` reports what is configured and sends a real test,
naming the specific failure — bad key, unverified sender domain, missing
recipient — rather than a generic error. Verified against Resend's live API
with a deliberately invalid key.

`GIG_NOTIFICATION_FROM` is optional; without it the code falls back to Resend's
sandbox sender, which needs no domain verification. The API key is never logged
— only its length, which is enough to spot a truncated paste.

**This was never activated.** No environment variables were set, so everything
since has gone to logs only.

---

## 2026-10-10 — Remaining broken forms; membership catalog

`496027b`

A full audit of every `<form>` in the app found the same bug class in two more
places.

- **`/submit`** discarded every church listing — `submitListingAction`
  validated and returned without storing or sending. Now records, emails,
  reports field errors, and confirms.
- **`/church-search-request`** was a second, broken copy of the musician
  request form: no action, no `name` attributes on any input, and no field for
  who was asking, so a submission could not have been answered even if it had
  sent. Retired and 308-redirected to `/request-musician`.
- **Five dead buttons** in the admin and church dashboard editors — Save,
  Mark verified, Mark claimed, Submit for review, Invite editor — all
  `type="button"` with no handler. Disabled with an explanatory note.

Checked and left alone: `/claim` persists and redirects correctly; the hero
search submits via the router.

**Membership catalog.** `lib/plans.ts` holds all seven plans across three
audiences, with prices, trials, and features. Annual is priced at ten months so
"two months free" is literally true. Pricing page with audience tabs,
monthly/annual toggle, resolved-feature comparison table, FAQs.

Billing is **not** connected. `BILLING_LIVE` is `false`, so paid plans route to
the contact form to register interest rather than a checkout that cannot
complete. The contact form captures which plan prompted the enquiry, validated
against the catalog so a crafted query value is never echoed into email.

**Bug caught in testing:** the message textarea was `required`, so the browser
blocked interest-only submissions before the server could apply its default.
Made conditional.

---

## 2026-11-25 — Review: regressions, accessibility, privacy, abuse

Uncommitted at time of writing.

### Known regressions, re-verified

- **Dev/build `.next` collision — was still present, now fixed.** Neither
  process set `distDir`, so a production build overwrote the running dev
  server's chunk map and the site rendered unstyled. `next.config.mjs` is now
  phase-aware: dev writes `.next-dev`, builds write `.next`. Verified by
  running a full build against a live dev server and confirming CSS still
  served (52 KB, 200). `next start` and Vercel are unaffected.
- **`claim-form.tsx` — already correct, left alone.** It is a server component
  passing a Server Action, and Next emits `method="POST"` without the explicit
  attribute. Confirmed against rendered HTML.
- **Contact and interest forms — already correct, verified.** The route does
  render `components/forms/contact-form.tsx`. Interest-only submissions
  succeed with an empty message; plain submissions are blocked empty by the
  browser and rejected server-side when under ten characters.
- **Git identity — already correct.** Repo-local author matches recent
  commits; the hostname had also reverted. Global config untouched.

### Privacy

- **`/musicians` was publishing every musician's contact details.** The page
  passed the full records to a client component, so email, phone, WhatsApp,
  and social URLs were serialised into the page source even though the UI
  suppresses them. Harmless with placeholder data, a real leak the moment a
  genuine musician is listed. Added `MusicianCard`, a display-only projection;
  the payload now contains none of those fields.

### Abuse and honesty

- **Rate limiting** on all four submission endpoints, applied before email
  dispatch, with a message naming the wait and an alternative.
- **Success is gated on delivery.** With nothing stored durably, an
  undelivered notification means the submission is gone; reporting it as
  received was a lie. All four forms now show an actionable error instead. A
  failed profile submit also persists the draft so a refresh cannot lose it.

### Accessibility (WCAG 2.2 AA)

- **Eleven pages had no `<h1>`** — `SectionHeading` rendered `h2` everywhere.
  It now takes `as`, and the eleven page-title usages pass `as="h1"` (1.3.1,
  2.4.6).
- **Contrast** — muted text measured 3.94–4.29:1. `ink-subtle` moved to
  `#707070`, the lightest neutral clearing 4.5:1 on all three surfaces in use
  (1.4.3). Two homepage gradients put white text at 1.63:1 and 2.6:1; both
  flattened to the near-black tile used elsewhere.
- **Target size** — global nav links were 16 px tall, now 24 px minimum
  (2.5.8). The two remaining sub-24 px links are inline within a sentence,
  which the criterion exempts.
- **Checked and found already compliant:** focus visibility (2.4.7 — a 2 px
  Action Blue outline on real keyboard focus; an earlier programmatic test
  was a false positive) and focus not obscured by the sticky header (2.4.11).

### Dependencies

Production advisories 13 → 7 via in-range updates. `npm audit fix` also
downgraded `@types/node` to v20, which broke the typecheck; restored to v22.

All seven remaining need major upgrades: zod 4, Next 16, Prisma 7. Only zod
reaches attacker-facing shipped code, so every public input now has explicit
length and array bounds as a compensating control.
