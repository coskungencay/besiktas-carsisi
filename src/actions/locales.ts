"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

import { SINGLETON_ID, db } from "@/db";
import { siteSettings, translations } from "@/db/schema";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/i18n/config";
import {
  type ActionState,
  fail,
  fromZodError,
  ok,
} from "@/lib/action-result";
import { requirePanelUser } from "@/lib/session";
import { localesSchema, translationsSchema } from "@/lib/validators";

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

/** Sitede hangi dillerin acik olacagini kaydeder. */
export async function saveEnabledLocalesAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const selected = LOCALES.filter((locale) => formData.get(locale) !== null);
  // Varsayilan dil kapatilamaz.
  if (!selected.includes(DEFAULT_LOCALE)) selected.unshift(DEFAULT_LOCALE);

  const parsed = localesSchema.safeParse({ locales: selected });
  if (!parsed.success) return fromZodError(parsed.error);

  db.update(siteSettings)
    .set({ enabledLocales: parsed.data.locales, updatedAt: new Date() })
    .where(eq(siteSettings.id, SINGLETON_ID))
    .run();

  revalidateAll();
  return ok("Diller kaydedildi.");
}

/**
 * Bir dilin tum cevirilerini tek seferde kaydeder.
 * Bos birakilan alanlar silinir -> site o alanda varsayilan dile duser.
 */
export async function saveTranslationsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const locale = String(formData.get("locale") ?? "");
  if (!isLocale(locale)) return fail("Geçersiz dil.");
  if (locale === DEFAULT_LOCALE) {
    return fail(
      "Varsayılan dilin metinleri ilgili sayfalardan (Genel Bilgiler, Menü, Galeri) düzenlenir.",
    );
  }

  // Alan adlari: "t|<namespace>|<refId>|<field>"
  const entries: {
    namespace: string;
    refId: number;
    field: string;
    value: string;
  }[] = [];

  for (const [key, raw] of formData.entries()) {
    if (typeof raw !== "string" || !key.startsWith("t|")) continue;
    const [, namespace, refId, field] = key.split("|");
    if (!namespace || !refId || !field) continue;
    entries.push({
      namespace,
      refId: Number(refId),
      field,
      value: raw,
    });
  }

  const parsed = translationsSchema.safeParse({ locale, entries });
  if (!parsed.success) return fromZodError(parsed.error);

  try {
    db.transaction((tx) => {
      for (const entry of parsed.data.entries) {
        const value = entry.value.trim();

        if (value.length === 0) {
          // Bos -> kaydi sil, varsayilan dile geri dus.
          tx.delete(translations)
            .where(
              and(
                eq(translations.locale, parsed.data.locale),
                eq(translations.namespace, entry.namespace),
                eq(translations.refId, entry.refId),
                eq(translations.field, entry.field),
              ),
            )
            .run();
          continue;
        }

        tx.insert(translations)
          .values({
            locale: parsed.data.locale,
            namespace: entry.namespace,
            refId: entry.refId,
            field: entry.field,
            value,
          })
          .onConflictDoUpdate({
            target: [
              translations.locale,
              translations.namespace,
              translations.refId,
              translations.field,
            ],
            set: { value },
          })
          .run();
      }
    });
  } catch (error) {
    console.error("[locales] ceviri kaydedilemedi:", error);
    return fail("Çeviriler kaydedilemedi.");
  }

  revalidateAll();
  return ok("Çeviriler kaydedildi.");
}

/** Bir kayit silindiginde ona ait cevirileri de temizler. */
export async function purgeTranslations(
  namespace: string,
  refId: number,
): Promise<void> {
  db.delete(translations)
    .where(
      and(
        eq(translations.namespace, namespace),
        eq(translations.refId, refId),
      ),
    )
    .run();
}
