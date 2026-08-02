/**
 * translations.namespace icin gecerli degerler.
 *
 * NEDEN AYRI DOSYA: Bu liste hem sunucuda (schema, action) hem de istemci
 * tarafina giden dogrulama semasinda (validators.ts) gerekiyor. schema.ts
 * drizzle'i import ettigi icin oradan almak drizzle'i istemci paketine
 * tasirdi. Burasi bagimsiz — sadece dizi.
 */
export const TRANSLATION_NAMESPACES = [
  "settings",
  "menu_category",
  "menu_item",
  "gallery",
  /** refId = highlights dizisindeki sira (0-3), field = label | value */
  "highlight",
  /** refId = testimonials.id, field = author | text */
  "testimonial",
  /** refId = faqs.id, field = question | answer */
  "faq",
] as const;

export type TranslationNamespace = (typeof TRANSLATION_NAMESPACES)[number];
