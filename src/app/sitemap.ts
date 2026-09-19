import type { MetadataRoute } from "next";
import { organization, routes, news } from "@/lib/data";
import { getPublishedProfessionals } from "@/lib/professionals-repository";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const professionals = await getPublishedProfessionals();
  return [
    ...routes
      .filter((r) => r !== "news" || news.length > 0)
      .map((r) => ({
        url: `${organization.url}/${r}`,
        changeFrequency: "monthly" as const,
        priority: r === "" ? 1 : r === "top-50" ? 0.9 : 0.7,
      })),
    ...professionals.map((p) => ({
      url: `${organization.url}/professionals/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...news.map((n) => ({
      url: `${organization.url}/news/${n.slug}`,
      lastModified: new Date(n.date),
      priority: 0.6,
    })),
  ];
}
