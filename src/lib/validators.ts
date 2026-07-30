import { z } from "zod";

const trimmed = (max: number) => z.string().trim().max(max);

/** Bos string'i undefined'a cevirir; opsiyonel alanlar icin. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v ?? "");

/**
 * FormData checkbox'lari icin. Dikkat: z.coerce.boolean() burada KULLANILAMAZ,
 * cunku "false" string'ini de true'ya cevirir.
 */
const checkbox = z.preprocess(
  (v) => v === true || v === "on" || v === "true" || v === "1",
  z.boolean(),
);

export const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Saat HH:MM formatinda olmali");

export const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Gecerli bir renk kodu girin");

/* ----------------------------- Genel bilgiler ----------------------------- */

export const siteSettingsSchema = z.object({
  name: trimmed(120).min(1, "İşletme adı zorunlu"),
  tagline: optionalText(200),
  about: optionalText(4000),
  phone: optionalText(40),
  whatsapp: optionalText(40),
  email: z
    .union([z.literal(""), z.string().trim().email("Geçerli bir e-posta girin")])
    .optional()
    .transform((v) => v ?? ""),
  address: optionalText(400),
  lat: z
    .union([z.literal(""), z.coerce.number().min(-90).max(90)])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : Number(v))),
  lng: z
    .union([z.literal(""), z.coerce.number().min(-180).max(180)])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : Number(v))),
  mapsUrl: z
    .union([z.literal(""), z.string().trim().url("Geçerli bir URL girin")])
    .optional()
    .transform((v) => v ?? ""),
  instagram: optionalText(80),
  logoUrl: optionalText(400),
  heroImageUrl: optionalText(400),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

/* ---------------------------- Calisma saatleri ---------------------------- */

export const openingHoursSchema = z.object({
  hours: z
    .array(
      z.object({
        dayOfWeek: z.coerce.number().int().min(0).max(6),
        openTime: timeSchema,
        closeTime: timeSchema,
        isClosed: checkbox,
      }),
    )
    .length(7, "7 gün de gönderilmeli"),
});

/* ---------------------------------- Menu ---------------------------------- */

export const menuCategorySchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  name: trimmed(80).min(1, "Kategori adı zorunlu"),
});

export const menuItemSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive({ message: "Kategori seçin" }),
  name: trimmed(120).min(1, "Ürün adı zorunlu"),
  description: optionalText(600),
  price: z.coerce.number().min(0).max(1_000_000).default(0),
  imageUrl: optionalText(400),
  isFeatured: checkbox,
  isActive: checkbox,
});

export const reorderSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).max(2000),
});

/* --------------------------------- Galeri --------------------------------- */

export const galleryImageSchema = z.object({
  id: z.coerce.number().int().positive(),
  alt: optionalText(200),
});

/* --------------------------------- Tema ----------------------------------- */

export const themeSchema = z.object({
  themeSlug: trimmed(60).min(1),
  colors: z.record(
    z.string().regex(/^--[a-z0-9-]+$/, "Geçersiz değişken adı"),
    hexColorSchema,
  ),
});

/* ------------------------------ Iletisim formu ---------------------------- */

export const contactMessageSchema = z
  .object({
    name: trimmed(120).min(2, "Adınızı yazın"),
    phone: optionalText(40),
    email: z
      .union([
        z.literal(""),
        z.string().trim().email("Geçerli bir e-posta girin"),
      ])
      .optional()
      .transform((v) => v ?? ""),
    message: trimmed(2000).min(10, "Mesajınız en az 10 karakter olmalı"),
    /** Honeypot: botlar doldurur, insanlar gormez. */
    website: z.string().max(200).optional().default(""),
  })
  .refine((v) => v.phone.length > 0 || v.email.length > 0, {
    message: "Telefon veya e-posta adresinden en az birini girin",
    path: ["phone"],
  });

export type ContactMessageInput = z.input<typeof contactMessageSchema>;

/* --------------------------------- Sifre ---------------------------------- */

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifrenizi girin"),
    newPassword: z
      .string()
      .min(8, "Yeni şifre en az 8 karakter olmalı")
      .max(128),
    confirmPassword: z.string().min(1, "Şifreyi tekrar girin"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });
