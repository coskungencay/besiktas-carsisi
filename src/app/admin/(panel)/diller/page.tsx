import { eq } from "drizzle-orm";

import { LocalesManager } from "@/components/admin/LocalesManager";
import { db } from "@/db";
import { translations } from "@/db/schema";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, isLocale } from "@/i18n/config";
import {
  getEnabledLocales,
  getGalleryImages,
  getMenuCategories,
  getMenuItems,
  getSettings,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function LocalesPage({
  searchParams,
}: {
  searchParams: Promise<{ dil?: string }>;
}) {
  const { dil } = await searchParams;

  const settings = getSettings();
  const enabled = getEnabledLocales(settings);
  const categories = getMenuCategories();
  const items = getMenuItems();
  const gallery = getGalleryImages();

  // Duzenlenecek dil: varsayilan dil disindaki ilk acik dil.
  const editable = enabled.filter((l) => l !== DEFAULT_LOCALE);
  const requested = isLocale(dil) && editable.includes(dil) ? dil : editable[0];

  const existing = requested
    ? db
        .select()
        .from(translations)
        .where(eq(translations.locale, requested))
        .all()
    : [];

  const values: Record<string, string> = {};
  for (const row of existing) {
    values[`${row.namespace}|${row.refId}|${row.field}`] = row.value;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Diller & Çeviriler
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Sitenizin hangi dillerde yayınlanacağını seçin ve metinlerin
          çevirilerini girin. Boş bıraktığınız her alan otomatik olarak{" "}
          <strong>{LOCALE_META[DEFAULT_LOCALE].adminLabel}</strong> metnini
          gösterir.
        </p>
      </header>

      <LocalesManager
        allLocales={LOCALES.map((locale) => ({
          locale,
          adminLabel: LOCALE_META[locale].adminLabel,
          nativeLabel: LOCALE_META[locale].nativeLabel,
          isDefault: locale === DEFAULT_LOCALE,
          isEnabled: enabled.includes(locale),
        }))}
        editableLocales={editable.map((locale) => ({
          locale,
          adminLabel: LOCALE_META[locale].adminLabel,
        }))}
        activeLocale={requested ?? null}
        values={values}
        base={{
          settings: {
            name: settings.name,
            tagline: settings.tagline,
            heroHeadline: settings.heroHeadline,
            heroSubline: settings.heroSubline,
            about: settings.about,
            address: settings.address,
          },
          // Yalnizca gercekten girilmis kunye satirlari cevrilebilir.
          highlights: (Array.isArray(settings.highlights)
            ? settings.highlights
            : []
          ).map((highlight, index) => ({
            index,
            label: highlight?.label ?? "",
            value: highlight?.value ?? "",
          })),
          categories: categories.map((c) => ({ id: c.id, name: c.name })),
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            description: i.description,
          })),
          gallery: gallery.map((g) => ({
            id: g.id,
            alt: g.alt,
            thumb: g.url,
          })),
        }}
      />
    </div>
  );
}
