import type { MetadataRoute } from "next";

import { getSettings } from "@/lib/content";
import { thumbUrl } from "@/lib/format";
import { DEFAULT_LOCALE } from "@/i18n/config";

export const dynamic = "force-dynamic";

/**
 * Web app manifest — telefonda "ana ekrana ekle" dendiginde isletmenin adi ve
 * logosu gorunsun diye.
 *
 * Ikonlar musterinin logosundan geliyor; logo yuklenmemisse ikon listesi BOS
 * kalir ve tarayici favicon'a duser. Var olmayan bir dosyayi manifest'e
 * yazmak "indirilemedi" hatasi uretirdi.
 *
 * `purpose: "any"` bilincli: logonun guvenli alani (safe zone) bizim
 * kontrolumuzde degil, "maskable" desek Android logoyu daire icine kirpip
 * kenarlarini kesebilirdi.
 */
export default function manifest(): MetadataRoute.Manifest {
  const settings = getSettings();
  const name = settings.name || "İşletme";
  const colors = settings.brandColors ?? {};

  const icons: MetadataRoute.Manifest["icons"] = settings.logoUrl
    ? [
        {
          src: thumbUrl(settings.logoUrl),
          sizes: "400x400",
          type: "image/webp",
          purpose: "any",
        },
        {
          src: settings.logoUrl,
          sizes: "any",
          type: "image/webp",
          purpose: "any",
        },
      ]
    : [];

  return {
    name,
    short_name: name.slice(0, 12),
    description: settings.tagline || undefined,
    start_url: `/${DEFAULT_LOCALE}`,
    display: "standalone",
    background_color: colors["--brand-surface"] ?? "#ffffff",
    theme_color: colors["--brand-primary"] ?? "#7a4a2b",
    icons,
  };
}
