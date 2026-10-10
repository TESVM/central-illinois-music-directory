# Decisions

Why things are the way they are. Read before reversing one of these — most
were made to prevent the site misleading someone.

---

## The $35 floor lives in exactly one constant

`FLOOR_RATE` in `lib/rates.ts`, applied through `enforceFloor()`.

**Why:** a minimum rate that's enforced in three places is enforced in zero.
Every display and calculation path runs through one clamp, so a bad record, a
hand-typed custom rate, or a malformed number all resolve to $35 rather than
quietly undercutting a musician.

`computeQuote()` is pure so the server can re-price a submission rather than
trusting a total computed in the browser.

---

## Sample listings are labeled rather than deleted

Six placeholder musicians remain, flagged `example: true`.

**Why:** an empty directory shows nothing of what a profile looks like, and
deleting them would leave the browse page blank. But presenting them as real
people meant a church could email `moriah@example.com` and wait for a reply
that could never come.

So they stay, labeled on every card and profile, with their fake contact
details, phone numbers, and social links suppressed entirely and the contact
button replaced.

`allListingsAreExamples` drives this. Add one real musician and the labelling
and the homepage copy both correct themselves.

---

## User-facing claims are derived, not written

The homepage once said "80+ profiles" and "24h typical response window". Both
were invented — there were six profiles and no response process.

**Why it matters:** these are the first things a visitor reads, and both were
false. Hardcoded numbers also rot silently.

Counts now derive from the data and revert to real figures automatically once
genuine listings exist.

---

## Client-component forms post explicitly

Forms in client components set `method="post"`. Server-component forms don't
need it — Next.js emits POST for them automatically.

**Why:** found in testing on `/contact` — that form is a client component using
`useActionState`, and a submit landing before React hydrated fell back to a
GET, putting the sender's name, email, and message into the URL, where they
reach browser history, server logs, and referrer headers. One attribute
prevents it.

Worth knowing the distinction before "fixing" a server-component form that
looks like it's missing the attribute. `claim-form.tsx` is correct as-is —
verified against the rendered HTML.

---

## Delivery failure is reported, never swallowed

`sendGigNotification` never throws and returns whether delivery happened.
Confirmation screens say so.

**Why:** a submission that reached the server must not be lost because an email
provider had a bad minute. And a user who is told "we'll be in touch" when
nothing was sent has been lied to. When mail isn't configured, the UI says so
and offers a direct address.

---

## Dead buttons were disabled, not wired to fakes

Five controls across the admin and church dashboards had no handlers.

**Why disabled rather than implemented:** implementing them means the database
layer, which is a much larger piece of work. Leaving them clickable meant an
admin could hit Save and believe a change persisted. Disabling with a
"Read-only preview" note is honest and took minutes.

---

## `/church-search-request` was deleted rather than fixed

It was a second musician request form with no action, no `name` attributes, and
no field for who was asking.

**Why delete:** `/request-musician` already did the job properly, with contact
capture, validation, and a live quote. Fixing the broken one would have meant
maintaining two forms for one purpose. Redirected 308 so old links survive.

Lost in the move: budget, church size, and worship style fields. Budget is
covered by the live quote. The other two are worth re-adding to the request
form if matching needs them.

---

## Billing is gated behind one flag

`BILLING_LIVE = false` in `lib/plans.ts`.

**Why:** the pricing page is genuinely useful now — it validates pricing and
lets people see what's coming. But subscriptions need accounts, a database,
Stripe, and the actual paid features, none of which exist. A checkout button
that cannot complete is worse than no button.

Paid plans instead register interest through the contact form, which records
which plan prompted the enquiry. That's real demand data, collected honestly.

---

## Promoted placement is labeled by construction

`PROMOTED_LABEL` and `PROMOTED_EXPLAINER` are exported constants, and the
musician tiers carry a `caveat` field stating visibility doesn't guarantee
bookings.

**Why constants rather than copy:** a rule written only in marketing text gets
forgotten the first time someone builds a new surface. Keeping them in the plan
catalog means the next ranking feature has the label already to hand.

---

## Free tiers are deliberately useful

A free musician gets a real listing, three instruments, two samples, and three
opportunity responses a month. A free church gets search and one active
opportunity.

**Why:** a directory with no musicians has no value to churches, and vice
versa. Charging for basic presence starves both sides. Paid tiers sell reach,
speed, and tools — not access.

---

## The design system was applied by remapping tokens

Rather than restyling each page, `tailwind.config.ts` remapped the existing
semantic names (`brand-*`, `ink`, `canvas`, `surface`, `line`) to the Apple
palette, and the section helpers in `globals.css` were flattened in place.

**Why:** the site had dozens of pages using these tokens. Remapping moved all
of them at once and kept old markup compiling. The trade-off is that class
names no longer describe their colour — `brand-700` is blue, not teal.

---

## Prisma stays even though it's unused

`schema.prisma` models the church directory and is not read by any public page.

**Why keep it:** it's a reasonable starting point for the eventual database
work, and the church-side admin code references its types. Worth knowing it
describes churches only — there is no Musician model yet.
