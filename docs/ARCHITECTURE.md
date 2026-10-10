# Architecture

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind · deployed on Vercel.

## Where data actually comes from

This trips people up, so it's first.

**Prisma is configured but the public site does not use it.** `schema.prisma`
models the *church* directory (Church, Pastor, ServiceTime, ClaimRequest) and
has no Musician model at all. Nothing on the live site reads from a database.

Real sources:

| Data | Lives in |
|---|---|
| Musicians | `lib/site-data.ts` — a hardcoded typed array |
| Churches, cities | `lib/data/mock.ts`, read via `lib/data/queries.ts` |
| Rates and quote maths | `lib/rates.ts` |
| Membership plans | `lib/plans.ts` |

Adding a musician means editing `lib/site-data.ts` and redeploying.

## Key modules

### `lib/rates.ts`

Every dollar figure on the site resolves through here.

- `FLOOR_RATE = 35` — the published minimum, enforced in exactly one place
- `enforceFloor(rate)` — clamps anything below the floor; non-numeric input
  falls back to the floor rather than throwing
- `computeQuote(input)` — pure function, safe on server or client. Returns
  musician pay, travel, equipment, coordination fee, total, and per-musician
  take-home
- `MILEAGE_RATE = 0.67` (IRS standard), `DEFAULT_BROKER_PCT = 15`
- Formatting helpers so currency renders identically everywhere

Because it's pure, the gig request server action re-prices submissions
server-side rather than trusting a total computed in the browser.

### `lib/plans.ts`

Single source of truth for memberships: seven plans across musician, group,
and church audiences. Prices in whole dollars; annual is `monthly × 10`.

- `BILLING_LIVE` — `false`. Gates every checkout path.
- `resolvedFeatures(plan)` — walks `inheritsFrom` so the comparison table can
  show the full set rather than "everything in the previous tier"
- `PROMOTED_LABEL` / `PROMOTED_EXPLAINER` — so featured placement is labeled
  by construction, not by remembering to

### `lib/notify.ts`

Outbound email via the Resend REST API. No SDK dependency.

Never throws — returns a `DeliveryResult` saying whether delivery happened and
why not, so the UI can tell the truth. Falls back to Resend's sandbox sender
when `GIG_NOTIFICATION_FROM` is unset. Never logs the API key.

### `lib/site-data.ts`

The musician array and its `Musician` type. Note `example?: boolean` — marks a
placeholder listing. Anything user-facing must respect it.

### `app/actions.ts`

All server actions. The four submission paths —
`submitContactAction`, `submitMusicianProfileAction`, `submitListingAction`,
`submitGigRequestAction` — follow the same shape: validate with Zod, log a
structured record, attempt email, return a `FormResult` saying whether delivery
succeeded.

## Routing

Public: `/`, `/musicians`, `/musicians/[slug]`, `/rates`, `/pricing`,
`/request-musician`, `/create-profile`, `/submit`, `/contact`, `/about`,
`/faq`, `/terms-privacy`, plus the church side (`/churches/[slug]`, `/cities`,
`/directory`, `/search`).

Gated: `/admin/*`, `/dashboard/*`, `/login`, `/claim` — excluded from the
sitemap and disallowed in `robots.txt`. Authentication does not currently
function (no `NEXTAUTH_SECRET`).

Redirect: `/church-search-request` → `/request-musician` (308, in
`next.config.mjs`).

## Styling

Follows `DESIGN.md` in the project root (Apple-influenced, installed via
`getdesign`).

The whole site was moved onto it by **remapping existing semantic tokens** in
`tailwind.config.ts` rather than editing every page. `brand-*` now resolves to
an Action Blue ramp, `ink`/`canvas`/`surface`/`line` to the Apple palette, and
`shadow-card`/`shadow-soft` to `none`. The three section helpers in
`globals.css` (`.section-wash`, `.section-strong`, `.tint-card`) were flattened
in place, which converted every page at once.

Consequences worth knowing:

- Old class names still compile; they just render in the new language
- One accent colour only. Don't introduce a second.
- Shadows are reserved for imagery (`.product-shadow`). Not cards, not buttons.
- Body text is 17px, not 16px
- Font stack puts `-apple-system` first so Apple devices get real SF Pro, with
  Inter (self-hosted via `next/font`) as the fallback elsewhere

## Conventions

- Server components by default; `"use client"` only where interaction needs it
- Forms use `useActionState` and always render a success state
- **Client-component forms must set `method="post"` explicitly.** Server
  components rendering `<form action={serverAction}>` get POST from Next.js
  automatically, but a client component using `useActionState` does not —
  without it a submit landing before hydration falls back to GET and puts
  personal data in the URL. This was a real leak on `/contact`.
  (`claim-form.tsx` is a server component and is correct without it.)
- Validation schemas live in `lib/validation/forms.ts`
- Prefer deriving user-facing claims from data over hardcoding them
