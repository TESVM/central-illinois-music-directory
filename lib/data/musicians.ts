import "server-only";
import { prisma } from "@/lib/prisma/client";
import { enforceFloor } from "@/lib/rates";
import { musicians as seedMusicians, type Musician, type MusicianCard } from "@/lib/site-data";

/**
 * Musician reads for the public directory.
 *
 * Two sources, chosen at call time:
 *
 *  - **Database** when `DATABASE_URL` is set. Adding or editing a musician is
 *    then a data change, not a code change and a redeploy.
 *  - **The seeded array in lib/site-data.ts** otherwise, so the site keeps
 *    working before a database is provisioned and in any checkout without one.
 *
 * The fallback is deliberate. It lets the database land without a flag day,
 * and means a database outage degrades the directory to its last known
 * content rather than to an error page.
 */

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * A musician as the public site may see them.
 *
 * Contact fields appear only when the musician consented to that specific
 * field being published. Absent means "do not show", never "unknown".
 */
export type DirectoryMusician = MusicianCard & {
  churchExperience?: string;
  bio: string;
  churches: string[];
  events: string[];
  media: string[];
  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
};

type MusicianRow = Awaited<ReturnType<typeof prisma.musician.findFirst>>;

/**
 * Applies per-field consent.
 *
 * Example listings never expose contact details whatever their flags say:
 * their values are placeholders, and a church emailing one would reach nobody.
 */
function publishableContact(row: NonNullable<MusicianRow>): DirectoryMusician["contact"] {
  if (row.example) return {};
  return {
    phone: row.showPhone ? row.phone ?? undefined : undefined,
    email: row.showEmail ? row.email ?? undefined : undefined,
    whatsapp: row.showWhatsapp ? row.whatsapp ?? undefined : undefined,
    facebook: row.showSocials ? row.facebook ?? undefined : undefined,
    instagram: row.showSocials ? row.instagram ?? undefined : undefined,
    linkedin: row.showSocials ? row.linkedin ?? undefined : undefined
  };
}

function fromRow(row: NonNullable<MusicianRow>): DirectoryMusician {
  return {
    slug: row.slug,
    name: row.name,
    initials: row.initials,
    primaryRole: row.primaryRole,
    instruments: row.instruments,
    city: row.city,
    yearsExperience: row.yearsExperience,
    genres: row.genres,
    availability: row.availability,
    churchTypes: row.churchTypes,
    hourlyRate: enforceFloor(row.hourlyRate),
    shortBio: row.shortBio,
    distanceMiles: row.distanceMiles,
    updatedAt: row.updatedAt.toISOString(),
    example: row.example,
    churchExperience: row.churchExperience ?? undefined,
    bio: row.bio,
    churches: row.churches,
    events: row.events,
    media: row.media,
    contact: publishableContact(row)
  };
}

/**
 * Seed fallback. The seeded people are all examples, so no contact details are
 * published — matching the database path's treatment of example rows.
 */
function fromSeed(musician: Musician): DirectoryMusician {
  return {
    slug: musician.slug,
    name: musician.name,
    initials: musician.initials,
    primaryRole: musician.primaryRole,
    instruments: musician.instruments,
    city: musician.city,
    yearsExperience: musician.yearsExperience,
    genres: musician.genres,
    availability: musician.availability,
    churchTypes: musician.churchTypes,
    hourlyRate: enforceFloor(musician.hourlyRate),
    shortBio: musician.shortBio,
    distanceMiles: musician.distanceMiles,
    updatedAt: musician.updatedAt,
    example: musician.example,
    churchExperience: musician.churchExperience,
    bio: musician.bio,
    churches: musician.churches,
    events: musician.events,
    media: musician.media,
    contact: musician.example
      ? {}
      : {
          phone: musician.phone,
          email: musician.email,
          whatsapp: musician.whatsapp,
          facebook: musician.facebook,
          instagram: musician.instagram,
          linkedin: musician.linkedin
        }
  };
}

/** Published musicians, newest first. Drafts and archived rows never appear. */
export async function getDirectoryMusicians(): Promise<DirectoryMusician[]> {
  if (!hasDatabase()) return seedMusicians.map(fromSeed);

  try {
    const rows = await prisma.musician.findMany({
      where: { state: "PUBLISHED" },
      orderBy: { updatedAt: "desc" }
    });
    return rows.map(fromRow);
  } catch (error) {
    // A database problem should not blank the directory.
    console.error("[musicians] read failed, falling back to seed data", error);
    return seedMusicians.map(fromSeed);
  }
}

/** The display-only projection the browse page hands to its client component. */
export async function getDirectoryCards(): Promise<MusicianCard[]> {
  const all = await getDirectoryMusicians();
  return all.map(({ contact: _contact, bio: _bio, churches: _c, events: _e, media: _m, ...card }) => card);
}

export async function getDirectoryMusicianBySlug(
  slug: string
): Promise<DirectoryMusician | undefined> {
  if (!hasDatabase()) {
    const match = seedMusicians.find((musician) => musician.slug === slug);
    return match ? fromSeed(match) : undefined;
  }

  try {
    const row = await prisma.musician.findFirst({ where: { slug, state: "PUBLISHED" } });
    return row ? fromRow(row) : undefined;
  } catch (error) {
    console.error("[musicians] slug read failed, falling back to seed data", error);
    const match = seedMusicians.find((musician) => musician.slug === slug);
    return match ? fromSeed(match) : undefined;
  }
}

export async function getFeaturedDirectoryMusicians(limit = 3): Promise<DirectoryMusician[]> {
  const all = await getDirectoryMusicians();
  const featured = all.filter((musician) => musician.example !== undefined);
  return (featured.length ? featured : all).slice(0, limit);
}

/** Counts used by the homepage and trust strip, so claims track reality. */
export async function getDirectoryCounts() {
  const all = await getDirectoryMusicians();
  const real = all.filter((musician) => !musician.example).length;
  return {
    total: all.length,
    real,
    examples: all.length - real,
    allExamples: real === 0 && all.length > 0,
    cities: new Set(all.map((musician) => musician.city)).size
  };
}
