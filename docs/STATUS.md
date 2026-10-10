# Status

As of **2026-10-10**. Live at https://central-illinois-music-directory.vercel.app

## The short version

The site looks finished and is not. Presentation, pricing logic, and form
handling are solid. The things that make it an actual business — real
musicians, a database, accounts, and notifications — are absent.

Nothing currently lies to a visitor. That took deliberate work (see
[DECISIONS.md](DECISIONS.md)) and is worth preserving.

## Working

- All 10 public pages render and return 200
- Four forms capture input correctly and confirm receipt:
  contact, musician profile, church listing, gig request
- The $35/hour floor is enforced in one place and cannot be bypassed
- Quote maths verified correct, including travel, equipment, and the 15%
  coordination fee
- Pricing page with all three plan families, monthly/annual toggle, and a full
  feature comparison
- Apple-influenced design system applied site-wide, responsive to 375px
- Sample listings labeled honestly everywhere they appear
- `robots.txt` excludes admin, dashboard, login, and claim; sitemap lists only
  real public pages
- Clean TypeScript, clean lint, clean production build

## Blocking — nothing else matters until these are done

### 1. No email delivery configured

**Vercel has zero environment variables set.** Every submission is validated
and written to the server log, and no human is notified.

A church that submits a request today sees a friendly confirmation and you
never find out. This is the single highest-value fix and takes about ten
minutes — see [SETUP.md](SETUP.md).

The code is finished and waiting. Adding `RESEND_API_KEY` and
`GIG_NOTIFICATION_EMAIL` switches on all four forms at once.

Note: Vercel's runtime logs on this plan are ephemeral. Any submission from
before today is unrecoverable.

### 2. No real musicians

All six listings are placeholders with `example.com` addresses and 555 phone
numbers. They are flagged `example: true` and labeled throughout, so nobody is
misled — but the directory cannot yet do the one thing it promises.

One real profile flips the homepage copy from "Directory launching" to the real
count automatically. This is a phone call, not a coding task.

## Not built

| Thing | Consequence |
|---|---|
| Database | Musicians live in `lib/site-data.ts`. Adding one means editing code and redeploying. |
| Working login | No `NEXTAUTH_SECRET` is set, so authentication cannot function. Admin and dashboard are unreachable. |
| Subscription billing | `BILLING_LIVE` is `false`. Paid plans register interest via the contact form instead of taking payment. |
| Entitlements | Nothing checks what tier a user is on, because there are no users. |
| The features paid plans describe | Analytics, alerts, saved talent lists, availability calendars, team seats — all are listed on the pricing page as upcoming, none exist. |

## Deliberately disabled

Not bugs. Disabled on purpose so they don't appear to work:

- Admin church editor — Save / Mark verified / Mark claimed
- Church dashboard listing editor — Save draft / Submit for review / Invite editor

Both show a "Read-only preview" note explaining that editing needs the database
layer. Previously these were live-looking buttons with no handlers.

## Honest-labelling invariants

If you change the site, don't break these:

- Sample listings must stay labeled, and must not display their fake contact
  details or social links
- Paid placement must stay labeled as `Featured` and never pass as neutral
  ranking
- Musician tiers must keep the note that visibility does not guarantee bookings
- No musician may be listed below $35/hour
- Don't claim a roster size the data doesn't support — the homepage and trust
  strip derive their numbers from real (non-example) listings
