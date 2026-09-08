import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://alma.almacity.workers.dev";

  return [
    "",
    "/map",
    "/collections",
    "/about",
    "/coffee",
    "/restaurants",
    "/romantic",
    "/walks",
    "/routes",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));
}
