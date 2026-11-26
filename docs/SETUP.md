# Setup

## Running locally

```bash
npm install
npm run dev
```

Serves on http://127.0.0.1:3005.

The site runs with no environment variables at all — musicians and churches
come from hardcoded modules. Forms will work and record to the console; they
just won't email anyone.

### Useful commands

| Command | Does |
|---|---|
| `npm run dev` | Dev server on port 3005 |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Typecheck |
| `npm run check:email` | Reports email config and sends a real test |

**Don't run `npm run build` while `npm run dev` is running.** They share
`.next`, and the production build overwrites the dev server's chunk map,
which breaks the running site in a confusing way — the page renders with no
CSS at all. If that happens: stop the server, `rm -rf .next`, restart.

## Database

Optional. The site runs without one, serving the seeded musicians from
`lib/site-data.ts`. With a database, musicians are editable without a deploy
and every submission is stored before its notification email is attempted.

### Local development

```bash
docker run -d --name ciid-postgres -e POSTGRES_PASSWORD=devpassword -e POSTGRES_USER=postgres -e POSTGRES_DB=ciid_dev -p 55432:5432 postgres:16-alpine
```

Port 55432 avoids clashing with any Postgres already on 5432. Then put this in
`.env.local` (gitignored):

```
DATABASE_URL="postgresql://postgres:devpassword@localhost:55432/ciid_dev"
```

Apply the schema and seed:

```bash
npx prisma migrate dev
```

```bash
npx tsx prisma/seed.ts
```

The seed is idempotent — it upserts, so re-running is safe. It preserves
`example: true` on all six sample musicians and leaves every contact-consent
flag false.

### Production

Vercel Postgres or Neon; both have free tiers. Set `DATABASE_URL` in Vercel,
then apply migrations against it:

```bash
npx prisma migrate deploy
```

Run that with the production `DATABASE_URL` in your shell, not committed.
`migrate deploy` only applies existing migrations and never generates or
resets, which is what you want against real data.

### Editing musicians without a deploy

Once the database is live, a musician is a row. Changing a rate, publishing a
profile, or granting contact-publication consent is a `UPDATE`, visible on the
next request — verified locally by changing `hourlyRate` in SQL and seeing the
browse page follow without a rebuild.

Publication state is `DRAFT`, `PUBLISHED`, or `ARCHIVED`; only `PUBLISHED`
rows appear publicly.

## Environment variables

None are currently set in production. Nothing crashes without them; features
silently degrade.

### Email notifications — the one that matters

| Variable | Required | Notes |
|---|---|---|
| `RESEND_API_KEY` | Yes | From resend.com. Free tier covers 3,000/month. |
| `GIG_NOTIFICATION_EMAIL` | Yes | Where submissions land. Falls back to `ADMIN_EMAIL`. |
| `GIG_NOTIFICATION_FROM` | No | Omit to use Resend's sandbox sender. |

**Without a verified domain:** leave `GIG_NOTIFICATION_FROM` unset. The code
falls back to `onboarding@resend.dev`, which needs no verification but will
**only deliver to the email address that owns the Resend account**. Set
`GIG_NOTIFICATION_EMAIL` to exactly that address.

**With a verified domain:** set `GIG_NOTIFICATION_FROM` to something like
`Central Illinois Musicians <requests@yourdomain.com>`. Mail then comes from
your own address and can reach anyone — including sending confirmations to the
churches themselves, which the sandbox cannot do.

### Setting them on Vercel

1. Vercel → project → **Settings** → **Environment Variables**
2. Add each with **Production** ticked
3. **Deployments** → **⋯** on the newest → **Redeploy**

Step 3 is not optional. Variables are read at build time.

### Testing locally

Create `.env.local` (already gitignored — verified):

```
RESEND_API_KEY=re_your_key_here
GIG_NOTIFICATION_EMAIL=you@yourdomain.com
```

Then:

```bash
npm run check:email
```

It prints what's configured and sends a real message. On failure it names the
cause — invalid key, unverified sender domain, missing recipient — rather than
failing vaguely. Check spam the first time; sandbox mail often gets filtered.

### Other variables

| Variable | For | Status |
|---|---|---|
| `NEXTAUTH_SECRET` | Login | Not set — authentication cannot work without it |
| `NEXTAUTH_URL` | Login | Not set |
| `DATABASE_URL` | Prisma | Not set; public site doesn't read the database |
| `NEXT_PUBLIC_CHURCH_DIRECTORY_URL` | Cross-links to sibling site | Falls back to a default |
| `CRON_SECRET` | Weekly scan route | Not set |
| `ADMIN_EMAIL` | Notification fallback | Not set |

See `.env.example` for the full annotated list.

## Deploying

```bash
npm run build
```

Then:

```bash
npx vercel --prod --yes
```

Pushing to `main` on GitHub also triggers a deploy. Production alias:
https://central-illinois-music-directory.vercel.app

### Post-deploy checks

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://central-illinois-music-directory.vercel.app/
```

Worth spot-checking after any significant change:

- Key pages return 200
- `/church-search-request` returns 308 to `/request-musician`
- Musician profiles leak no `example.com` or `555-` contact details
- Forms render `method="POST"`, not GET
- `robots.txt` still disallows `/admin`, `/dashboard`, `/login`, `/claim`

## Logs

Vercel's runtime logs on this plan are **ephemeral**. Form submissions written
with `console.info` are visible only briefly and are not recoverable later.

This is precisely why email delivery matters — the log is not a storage layer.

```bash
npx vercel logs central-illinois-music-directory.vercel.app
```
