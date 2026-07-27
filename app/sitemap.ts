import type { MetadataRoute } from "next";
import { musicians } from "@/lib/site-data";
import { absoluteUrl } from "@/lib/utils";

/**
 * Public pages only. Admin and authenticated routes are deliberately excluded
 * here and disallowed in robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<[string, number]> = [
    ["", 1],
    ["/musicians", 0.9],
    ["/request-musician", 0.9],
    ["/rates", 0.8],
    ["/create-profile", 0.7],
    ["/church-search-request", 0.6],
    ["/about", 0.5],
    ["/faq", 0.5],
    ["/contact", 0.5],
    ["/terms-privacy", 0.3]
  ];

  const staticRoutes = routes.map(([path, priority]) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    priority
  }));

  const musicianRoutes = musicians.map((musician) => ({
    url: absoluteUrl(`/musicians/${musician.slug}`),
    lastModified: new Date(musician.updatedAt),
    priority: 0.7
  }));

  return [...staticRoutes, ...musicianRoutes];
}
