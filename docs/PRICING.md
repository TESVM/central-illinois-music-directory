# Pricing

Two separate things that are easy to confuse:

1. **Booking rates** — what a church pays a musician. Page: `/rates`
2. **Memberships** — what the directory charges its users. Page: `/pricing`

The navigation labels them "Booking rates" and "Memberships" for this reason.

---

## 1. Booking rates

Defined in `lib/rates.ts`.

### The floor

**$35/hour minimum.** Enforced by `enforceFloor()`, which every display and
calculation path runs through. A musician record with a lower value, a hand-typed
custom rate, or a malformed number all resolve to $35.

The floor exists in exactly one constant. Change it there and it propagates to
the calculator, the request form, profile pages, the footer, and the FAQ.

### Current musician rates

| Musician | Rate | Role |
|---|---|---|
| Moriah Bennett | $45/hr | Worship vocalist, acoustic guitar |
| Isaiah Carter | $75/hr | Piano, keys, music direction |
| Elena Vasquez | $60/hr | Violin, strings arranging |
| Caleb Nguyen | $50/hr | Electric guitar, production support |
| Ruth Daniels | $70/hr | Choir director |
| Jonah Williams | $45/hr | Drums, percussion |

All six are sample listings. Rates were assigned by role and experience.

### Reference tiers

Shown to organisations without a specific musician in mind:

- **Standard — $35/hr** — vocalists and rhythm players joining an existing set
- **Experienced — $50/hr** — keys, strings, horns reading charts on short notice
- **Lead / Director — $75/hr** — worship leaders, directors, arrangers

### Quote calculation

```
musician pay   = rate × hours × musicians
travel         = miles × $0.67 × musicians     (IRS standard rate)
equipment      = flat fee
subtotal       = pay + travel + equipment
coordination   = subtotal × 15%
total          = subtotal + coordination
```

The 15% applies to the whole engagement, not just labour — the reasoning being
that coordination covers the entire booking. Change `DEFAULT_BROKER_PCT` or the
`computeQuote` body if that model changes.

It is **not** adjustable by the organisation. It's a business constant shown as
its own line item.

Minimum billable block is 1 hour (`MIN_HOURS`).

### Worked example

2 musicians, 3 hours, $50/hr, 20 miles round trip, no equipment:

```
pay          $50 × 3 × 2        = $300.00
travel       20 × 0.67 × 2      =  $26.80
subtotal                        = $326.80
coordination 15%                =  $49.02
total                           = $375.82
```

---

## 2. Memberships

Defined in `lib/plans.ts`. **Not yet sellable** — `BILLING_LIVE` is `false`.

Annual is priced at **ten months**, so "two months free" is literally true
rather than rounded marketing.

| Plan | Audience | Monthly | Annual | Trial |
|---|---|---|---|---|
| Free Profile | Musician | $0 | — | — |
| Musician Pro | Musician | $12 | $120 | 14 days |
| Ministry Partner | Musician | $24 | $240 | 14 days |
| Group Pro | Groups | $29 | $290 | 14 days |
| Free Account | Church | $0 | — | — |
| Church Pro | Church | $29 | $290 | 14 days |
| Ministry Network | Church | $69 | $690 | 14 days |

Prices sit at the lower-middle of the ranges in the original spec, on the
reasoning that a new directory in one county has to earn its pricing.

### What free must always include

The free tiers are deliberately useful, not crippled. A musician gets a real
listing, three instruments, two samples, and three opportunity responses a
month. A church gets search, saved profiles, and one active opportunity.

Paid tiers buy **reach, speed, and tools** — never basic access or dignity.
This is a product principle, not a pricing accident. See
[DECISIONS.md](DECISIONS.md).

### Commission

**None.** The directory takes no percentage of a musician's pay, honorarium, or
offering. The 15% coordination fee is charged to the *organisation* on top of
the musician's rate — it does not come out of what the musician earns.

### Constraints encoded in code

- `PROMOTED_LABEL` / `PROMOTED_EXPLAINER` — featured placement is always
  labeled and never presented as neutral ranking
- Musician tiers carry an explicit `caveat` that visibility does not guarantee
  bookings
- The FAQ states cancelling keeps the free profile active

### Before billing can go live

1. Accounts and working authentication
2. A database to attach subscriptions to
3. Stripe products, prices, checkout, customer portal, and webhooks
4. Entitlement checks at every gated feature
5. The features themselves — analytics, alerts, saved lists, calendars — none
   of which exist yet
6. Only then flip `BILLING_LIVE`

Flipping it earlier produces a checkout that cannot complete.
