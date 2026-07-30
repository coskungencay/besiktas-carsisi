import { sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

/* -------------------------------------------------------------------------- */
/*                              Better Auth tablolari                          */
/* -------------------------------------------------------------------------- */

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  image: text("image"),
  /** Ilk giriste sifre degistirme zorunlulugu icin. */
  mustChangePassword: integer("must_change_password", { mode: "boolean" })
    .notNull()
    .default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

/* -------------------------------------------------------------------------- */
/*                                Site icerigi                                 */
/* -------------------------------------------------------------------------- */

/**
 * Tekil satir. Her zaman id = 1 kullanilir (SINGLETON_ID).
 */
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().default(""),
  tagline: text("tagline").notNull().default(""),
  about: text("about").notNull().default(""),
  phone: text("phone").notNull().default(""),
  whatsapp: text("whatsapp").notNull().default(""),
  email: text("email").notNull().default(""),
  address: text("address").notNull().default(""),
  lat: real("lat"),
  lng: real("lng"),
  mapsUrl: text("maps_url").notNull().default(""),
  instagram: text("instagram").notNull().default(""),
  logoUrl: text("logo_url").notNull().default(""),
  heroImageUrl: text("hero_image_url").notNull().default(""),
  /** JSON: { "--brand-primary": "#...", ... } */
  brandColors: text("brand_colors", { mode: "json" })
    .notNull()
    .$type<Record<string, string>>()
    .default({}),
  themeSlug: text("theme_slug").notNull().default("placeholder"),
  /**
   * JSON dizisi: sitede secilebilir diller, orn. ["tr","en"].
   * Ilk eleman varsayilan dildir. Bos dizi = sadece NEXT_PUBLIC_DEFAULT_LOCALE.
   */
  enabledLocales: text("enabled_locales", { mode: "json" })
    .notNull()
    .$type<string[]>()
    .default([]),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Musteri iceriginin dil cevirileri.
 *
 * Polimorfik (namespace + refId) tutuldu ki yeni ceviri alani eklemek
 * migration gerektirmesin. Ceviri yoksa varsayilan dildeki asil deger kullanilir.
 *
 *   namespace      refId              field
 *   -------------  -----------------  --------------------------
 *   settings       0 (tekil)          name | tagline | about | address
 *   menu_category  menu_categories.id name
 *   menu_item      menu_items.id      name | description
 *   gallery        gallery_images.id  alt
 */
export const translations = sqliteTable(
  "translations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    locale: text("locale").notNull(),
    namespace: text("namespace").notNull(),
    refId: integer("ref_id").notNull().default(0),
    field: text("field").notNull(),
    value: text("value").notNull().default(""),
  },
  (t) => [
    uniqueIndex("translations_unique_idx").on(
      t.locale,
      t.namespace,
      t.refId,
      t.field,
    ),
    index("translations_lookup_idx").on(t.locale, t.namespace),
  ],
);

export const openingHours = sqliteTable(
  "opening_hours",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    /** 0 = Pazar ... 6 = Cumartesi */
    dayOfWeek: integer("day_of_week").notNull(),
    openTime: text("open_time").notNull().default("09:00"),
    closeTime: text("close_time").notNull().default("22:00"),
    isClosed: integer("is_closed", { mode: "boolean" }).notNull().default(false),
  },
  (t) => [uniqueIndex("opening_hours_day_idx").on(t.dayOfWeek)],
);

export const menuCategories = sqliteTable(
  "menu_categories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("menu_categories_sort_idx").on(t.sortOrder)],
);

export const menuItems = sqliteTable(
  "menu_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => menuCategories.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    /** Kurus/cent cinsinden degil, serbest metin degil: TL cinsinden ondalik. */
    price: real("price").notNull().default(0),
    imageUrl: text("image_url").notNull().default(""),
    isFeatured: integer("is_featured", { mode: "boolean" })
      .notNull()
      .default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  },
  (t) => [
    index("menu_items_category_idx").on(t.categoryId),
    index("menu_items_sort_idx").on(t.sortOrder),
  ],
);

export const galleryImages = sqliteTable(
  "gallery_images",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    url: text("url").notNull(),
    alt: text("alt").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("gallery_images_sort_idx").on(t.sortOrder)],
);

export const contactMessages = sqliteTable(
  "contact_messages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    phone: text("phone").notNull().default(""),
    email: text("email").notNull().default(""),
    message: text("message").notNull(),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("contact_messages_created_idx").on(t.createdAt)],
);

/**
 * Iletisim formu icin IP basina saatlik rate limit sayaci.
 * Uygulama tek container'da calistigi icin DB tabanli sayac yeterli ve
 * restart'a dayaniklidir.
 */
export const rateLimits = sqliteTable(
  "rate_limits",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    bucket: text("bucket").notNull(),
    hits: integer("hits").notNull().default(0),
    /** Pencerenin basladigi epoch saniye. */
    windowStart: integer("window_start").notNull(),
  },
  (t) => [uniqueIndex("rate_limits_bucket_idx").on(t.bucket)],
);

export type SiteSettingsRow = typeof siteSettings.$inferSelect;
export type OpeningHourRow = typeof openingHours.$inferSelect;
export type MenuCategoryRow = typeof menuCategories.$inferSelect;
export type MenuItemRow = typeof menuItems.$inferSelect;
export type GalleryImageRow = typeof galleryImages.$inferSelect;
export type ContactMessageRow = typeof contactMessages.$inferSelect;
export type TranslationRow = typeof translations.$inferSelect;

/** translations.namespace icin gecerli degerler. */
export const TRANSLATION_NAMESPACES = [
  "settings",
  "menu_category",
  "menu_item",
  "gallery",
] as const;

export type TranslationNamespace = (typeof TRANSLATION_NAMESPACES)[number];
