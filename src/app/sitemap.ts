import type { MetadataRoute } from "next";

import { getSettings } from "@/lib/content";
import { appUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = appUrl();
  const settings = getSettings();

  return [
    {
      url: base,
      lastModified: settings.updatedAt ?? new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
