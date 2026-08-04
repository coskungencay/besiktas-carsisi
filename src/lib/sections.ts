/**
 * Musterinin panelden acip kapatabildigi bolumler.
 *
 * NEDEN AYRI DOSYA: Bu liste hem sunucuda (icerik katmani, admin sayfasi) hem
 * istemci bilesenlerinde (gorunurluk formu) gerekiyor; ikisi de drizzle'i
 * import etmek zorunda kalmasin diye bagimsiz duruyor.
 *
 * DIKKAT: buradaki `key` degeri DB'de saklanir (site_settings.hiddenSections).
 * Bir anahtari yeniden adlandirmak, musterinin kapattigi bolumu geri acar —
 * yeniden adlandirmayin, gerekiyorsa yenisini ekleyip eskisini birakin.
 */
export const TOGGLEABLE_SECTIONS = [
  {
    key: "yorumlar",
    label: "Yorumlar",
    hint: "Müşteri yorumları bölümü. Kapatırsanız girdiğiniz yorumlar silinmez, yalnızca sitede görünmez.",
  },
  {
    key: "sss",
    label: "Sıkça Sorulan Sorular",
    hint: "Soru-cevap bölümü.",
  },
  {
    key: "konum",
    label: "Konum ve yol tarifi",
    hint: "Haritalı konum bölümü. Adres veya koordinat girilmemişse zaten görünmez.",
  },
  {
    key: "galeri",
    label: "Galeri",
    hint: "Mekân fotoğrafları. Hiç görsel yüklemediyseniz zaten görünmez.",
  },
  {
    key: "whatsapp",
    label: "WhatsApp butonu",
    hint: "Sayfanın köşesinde duran sabit buton. WhatsApp numarası girilmemişse görünmez.",
  },
  {
    key: "duyuru",
    label: "Duyuru şeridi",
    hint: "Sayfanın en üstündeki tek satırlık duyuru. Duyuru metni boşsa görünmez.",
  },
  {
    key: "menuGorselleri",
    label: "Menüde ürün fotoğrafları",
    hint: "Menü sayfasında ve ana sayfadaki vitrinde ürün fotoğraflarını gösterir. Hiçbir ürüne fotoğraf eklemediyseniz zaten görünmez.",
  },
] as const;

export type ToggleableSectionKey = (typeof TOGGLEABLE_SECTIONS)[number]["key"];

export const TOGGLEABLE_SECTION_KEYS = TOGGLEABLE_SECTIONS.map((s) => s.key);

/** Bilinmeyen anahtarlari eleyerek temiz bir liste dondurur. */
export function normalizeHiddenSections(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (key): key is string =>
      typeof key === "string" &&
      (TOGGLEABLE_SECTION_KEYS as readonly string[]).includes(key),
  );
}
