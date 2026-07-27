import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(input));
}

const PRODUCTION_URL = "https://central-illinois-music-directory.vercel.app";

/**
 * Canonical site origin. Used for the sitemap, robots, canonical tags, and the
 * metadataBase that resolves the social share image.
 *
 * Resolution order matters: an explicit site URL wins, then the origin Vercel
 * injects at build time, then the known production domain. localhost is only
 * ever used in development — if it leaked into a production build, every
 * canonical URL and the share-card URL would point at a machine nobody else
 * can reach.
 */
function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_MUSICIAN_DIRECTORY_URL;
  // A malformed value must fall through rather than throw — a typo in a Vercel
  // env var should not take down the whole production build.
  if (explicit && !explicit.includes("localhost") && isValidOrigin(explicit)) {
    return explicit;
  }

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_URL;
  }

  return process.env.NEXTAUTH_URL ?? "http://localhost:3005";
}

function isValidOrigin(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function absoluteUrl(path: string) {
  return new URL(path, siteOrigin()).toString();
}

export function churchDirectoryUrl(path = "/") {
  const base =
    process.env.NEXT_PUBLIC_CHURCH_DIRECTORY_URL ?? "https://champaign-county-church-directory.vercel.app";
  return new URL(path, base).toString();
}

export function musicianDirectoryUrl(path = "/") {
  const base =
    process.env.NEXT_PUBLIC_MUSICIAN_DIRECTORY_URL ?? "https://central-illinois-music-directory.vercel.app";
  return new URL(path, base).toString();
}
