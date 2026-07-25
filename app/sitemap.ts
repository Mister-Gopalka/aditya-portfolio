import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

const BASE_URL = "https://www.adityagopalka.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectUrls,
  ];
}
