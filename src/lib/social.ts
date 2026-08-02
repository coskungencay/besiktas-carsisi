/**
 * Desteklenen sosyal medya platformlari.
 *
 * NEDEN SABIT LISTE: musteri serbest metin girseydi her tema bilinmeyen bir
 * platform icin ikon bulmak zorunda kalirdi. Liste buradan buyur; yeni bir
 * platform eklemek icin buraya bir satir ve _shared/icons.tsx'e bir ikon.
 *
 * DIKKAT: `key` degeri DB'de saklanir (site_settings.socialLinks); yeniden
 * adlandirmayin.
 */
export const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
  { key: "x", label: "X (Twitter)" },
  { key: "youtube", label: "YouTube" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "tripadvisor", label: "Tripadvisor" },
  { key: "yelp", label: "Yelp" },
] as const;

export type SocialPlatformKey = (typeof SOCIAL_PLATFORMS)[number]["key"];

export const SOCIAL_PLATFORM_KEYS = SOCIAL_PLATFORMS.map((p) => p.key);

export function socialLabel(key: string): string {
  return SOCIAL_PLATFORMS.find((p) => p.key === key)?.label ?? key;
}
