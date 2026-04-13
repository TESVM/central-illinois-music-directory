# Central Illinois Music Directory

Public-facing musician directory for Central Illinois, especially Champaign-Urbana. This app helps pastors, churches, worship leaders, and event planners find musicians, and it helps musicians create public-facing ministry profiles.

GitHub:
- https://github.com/TESVM/central-illinois-music-directory

## What This Site Includes

- Musician-focused homepage with guided search
- Browse musicians page with filters and sorting
- Individual musician profile pages
- Multi-step create-profile flow
- Musician dashboard
- Church/pastor request page
- FAQ, about, contact, terms, and moderation pages
- Instrument photo gallery
- Cross-link back to the church directory

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL-ready schema
- NextAuth scaffolding

## Local Development

```bash
npm install
npm run dev
```

Local URL:
- `http://localhost:3005`

## Environment Variables

Copy `.env.example` to `.env.local` and update values as needed.

Important values:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_CHURCH_DIRECTORY_URL`
- `NEXT_PUBLIC_MUSICIAN_DIRECTORY_URL`
- `CRON_SECRET`

## Project Structure

```text
app/
  about/
  admin/
  api/
  church-search-request/
  contact/
  create-profile/
  dashboard/
  faq/
  musicians/[slug]/
  musicians/
  terms-privacy/
components/
  layout/
  site/
  ui/
lib/
  site-data.ts
  utils.ts
  data/
  prisma/
prisma/
  schema.prisma
  seed.ts
```

## Accessibility

This repo was updated to better align with WCAG 2.1 Level AA patterns and Illinois accessibility expectations.

Implemented examples:

- skip link
- stronger focus states
- reduced-motion support
- clearer helper text
- mobile-friendly navigation
- labeled controls and status messaging
- photo alt text for instrument imagery

See:
- [ACCESSIBILITY_NOTES.md](./ACCESSIBILITY_NOTES.md)

## Deployment Notes

- Designed for Vercel deployment
- Uses local/mock profile data for the directory experience
- Production launch should include a real data layer, moderation workflow, and audited environment settings

## Companion Project

If users want to browse churches first, use the companion repo:

- https://github.com/TESVM/champaign-county-church-directory
