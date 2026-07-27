import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated and administrative surfaces have no business in search
      // results, and indexing them advertises the attack surface.
      disallow: ["/admin", "/admin/", "/dashboard", "/dashboard/", "/login", "/claim"]
    },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
