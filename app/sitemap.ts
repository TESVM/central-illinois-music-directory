import type { MetadataRoute } from "next";
import { musicians } from "@/lib/site-data";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/musicians",
    "/create-profile",
    "/dashboard",
    "/church-search-request",
    "/about",
    "/faq",
    "/contact",
    "/terms-privacy",
    "/admin/moderation"
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date()
  }));

  const musicianRoutes = musicians.map((musician) => ({
    url: absoluteUrl(`/musicians/${musician.slug}`),
    lastModified: new Date(musician.updatedAt)
  }));

  return [...routes, ...musicianRoutes];
}
