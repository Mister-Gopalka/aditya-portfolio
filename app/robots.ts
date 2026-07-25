import type { MetadataRoute } from "next";

const BASE_URL = "https://www.adityagopalka.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the admin panel and API routes out of search indexes.
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
