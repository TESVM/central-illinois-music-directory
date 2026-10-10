# Roadmap

Ordered by dependency, not by appeal. Each step unblocks the next.

---

## Now

### 1. Switch on email — ~10 minutes

Four forms work and notify nobody. A church that submits today gets a
confirmation and you never find out.

Add `RESEND_API_KEY` and `GIG_NOTIFICATION_EMAIL` in Vercel, redeploy, verify
with `npm run check:email`. Full steps in [SETUP.md](SETUP.md).

Nothing else on this list matters while leads are being dropped.

### 2. Get one real musician listed

Every listing is a labeled placeholder. The directory cannot yet do the one
thing it promises.

One real profile flips the homepage from "Directory launching" to a real count
automatically. A phone call, not a coding task.

Today that means editing `lib/site-data.ts` and redeploying. Fine for the first
few; the reason to build a database is the tenth.

---

## Next

### 3. Database

The constraint behind almost everything else. Musicians are hardcoded;
submitted profiles land in a log; nothing can be edited without a deploy.

- Add a `Musician` model to `schema.prisma` (it currently models churches only)
- Move `lib/site-data.ts` behind a query layer, keeping the `Musician` type as
  the boundary so pages don't change
- Persist the four submission types instead of only logging them
- Keep `example` as a column — the honest-labelling logic depends on it

Vercel Postgres or Neon both have usable free tiers.

### 4. Working authentication

`NEXTAUTH_SECRET` isn't set, so login cannot function and the admin and
dashboard areas are unreachable.

Needed before anyone can own a profile, and therefore before anyone can
subscribe. Once it works, re-enable the editors that are currently disabled.

### 5. Musician self-service

With 3 and 4 done: claim a listing, edit a profile, upload samples, set
availability. This is the point at which the directory stops depending on you
to type things in.

---

## Later

### 6. Opportunities

Churches post a need, musicians respond. The spec's free tiers already
reference "3 opportunity responses a month", so the model is sketched — it just
needs the data layer.

### 7. Billing

Only after 3, 4, and the paid features actually exist.

- Stripe products and prices mirroring `lib/plans.ts`
- Checkout, customer portal, webhooks for subscription state
- Entitlement checks at every gated feature
- Trials, receipts, renewal notices, cancellation that keeps the free profile
- Admin-editable prices, as the original spec asked
- Flip `BILLING_LIVE` **last**

### 8. The features people would be paying for

None of these exist. Listing them on the pricing page is fine while it says
"opening soon"; charging for them is not.

Profile analytics · opportunity alerts · availability calendars · saved talent
lists · team seats · verification badges · featured rotation · downloadable
one-sheets

---

## Worth doing whenever

- **Verify a sending domain** in Resend — lets the site email churches directly,
  not just you
- **Re-add worship style** to the request form (lost when
  `/church-search-request` was retired; a real matching signal)
- **Soften the "within one business day" claim** on `/contact` until there's a
  process behind it
- **Real photographs** — profiles currently use initials placeholders
- **Remove dead code** — `components/forms/claim-form.tsx` is referenced,
  but check `form-shell.tsx` and the unused directory components
- **Automated tests** — there are none. `computeQuote` is pure and the obvious
  first candidate.

---

## Deliberately not doing

- **Taking commission on musician pay.** Stated publicly in the FAQ. Reversing
  it would break a published promise.
- **Hiding the directory behind a paywall.** Free tiers stay useful.
- **Unlabeled promoted placement.** See [DECISIONS.md](DECISIONS.md).
