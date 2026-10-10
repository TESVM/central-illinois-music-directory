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
