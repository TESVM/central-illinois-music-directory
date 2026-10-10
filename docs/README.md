# Project notes

Working notes for the Central Illinois Musician Directory — what exists, what
was decided and why, and what is still missing.

Written to be read by someone picking this up cold, including a future version
of you who has forgotten the details.

| Document | What's in it |
|---|---|
| [STATUS.md](STATUS.md) | **Start here.** Honest state of the platform right now — what works, what doesn't, what's blocking. |
| [PROGRESS.md](PROGRESS.md) | What was built and fixed, in order, with dates. |
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the code is organised and where things live. |
| [PRICING.md](PRICING.md) | The $35 rate floor, how quotes are calculated, and the membership plans. |
| [SETUP.md](SETUP.md) | Running locally, environment variables, deploying. |
| [DECISIONS.md](DECISIONS.md) | Why things were done a particular way. Read before reversing something. |
| [ROADMAP.md](ROADMAP.md) | What comes next, in dependency order. |

## Other documents in this repo

These predate these notes and live in the project root:

- `README.md` — public-facing repo readme
- `DESIGN.md` — the Apple-influenced design system the UI follows
- `CODEBASE_OVERVIEW.md` — original structure notes
- `ACCESSIBILITY_NOTES.md` — accessibility commitments
- `FAITH_CHURCH_RESEARCH_NOTES.md`, `FAITHSTREET_IMPORT_NOTES.md` — research
  notes from the sibling church directory project

## The one-line version

The site is a well-built shell with no real data behind it. Every public page
works, every form captures input correctly, and the pricing is honest — but
there are no real musicians listed, no database, no working login, and no email
delivery configured, so submissions are recorded and nobody is notified.

Last updated: 2026-10-10
