"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { SINGLETON_ID, db } from "@/db";
import { siteSettings } from "@/db/schema";
import {
  type ActionState,
  fail,
  formToObject,
  fromZodError,
  ok,
} from "@/lib/action-result";
import { getSettings } from "@/lib/content";
import { requirePanelUser } from "@/lib/session";
import { deleteImage, storeImage, UploadError } from "@/lib/uploads";
import { TOGGLEABLE_SECTION_KEYS } from "@/lib/sections";
import { SOCIAL_PLATFORMS } from "@/lib/social";
import {
  MAX_HIGHLIGHTS,
  hiddenSectionsSchema,
  highlightsSchema,
  siteSettingsSchema,
  socialLinksSchema,
} from "@/lib/validators";

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

/**
 * Kunye satirlarini duz form alanlarindan toplar:
 *   highlightLabel0 / highlightValue0 … highlightLabel3 / highlightValue3
 *
 * Iki tarafi da bos olan satirlar atilir; boylece musteri bir satiri
 * temizleyerek kaldirabilir. Yalnizca degeri girilip etiketi bos birakilan
 * satirlar korunur — tasarimlar etiketsiz satiri da basabiliyor.
 */
function readHighlights(formData: FormData) {
  const rows: { label: string; value: string }[] = [];

  for (let index = 0; index < MAX_HIGHLIGHTS; index += 1) {
    const label = String(formData.get(`highlightLabel${index}`) ?? "").trim();
    const value = String(formData.get(`highlightValue${index}`) ?? "").trim();
    if (!label && !value) continue;
    rows.push({ label, value });
  }

  return highlightsSchema.safeParse(rows);
}

/**
 * Sosyal baglantilari duz form alanlarindan toplar: social_<platform>.
 * Bos birakilan platformlar hic kaydedilmez — musteri sadece kullandiklarini
 * doldurur, digerleri sitede gorunmez.
 */
function readSocialLinks(formData: FormData) {
  const rows = SOCIAL_PLATFORMS.map((platform) => ({
    platform: platform.key as string,
    url: String(formData.get(`social_${platform.key}`) ?? "").trim(),
  })).filter((row) => row.url.length > 0);

  return socialLinksSchema.safeParse(rows);
}

export async function saveSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const parsed = siteSettingsSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const highlights = readHighlights(formData);
  if (!highlights.success) return fromZodError(highlights.error);

  const socialLinks = readSocialLinks(formData);
  if (!socialLinks.success) return fromZodError(socialLinks.error);

  const current = getSettings();

  try {
    const logoFile = formData.get("logoFile");
    const heroFile = formData.get("heroFile");

    let logoUrl = parsed.data.logoUrl;
    let heroImageUrl = parsed.data.heroImageUrl;

    if (logoFile instanceof File && logoFile.size > 0) {
      const stored = await storeImage(logoFile);
      if (current.logoUrl) await deleteImage(current.logoUrl);
      logoUrl = stored.url;
    }
    if (heroFile instanceof File && heroFile.size > 0) {
      const stored = await storeImage(heroFile);
      if (current.heroImageUrl) await deleteImage(current.heroImageUrl);
      heroImageUrl = stored.url;
    }

    db.update(siteSettings)
      .set({
        ...parsed.data,
        highlights: highlights.data,
        socialLinks: socialLinks.data,
        logoUrl,
        heroImageUrl,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, SINGLETON_ID))
      .run();
  } catch (error) {
    if (error instanceof UploadError) return fail(error.message);
    console.error("[settings] kayit hatasi:", error);
    return fail("Kaydedilemedi. Lütfen tekrar deneyin.");
  }

  revalidateSite();
  return ok("Genel bilgiler kaydedildi.");
}

export async function removeSettingsImageAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const field = formData.get("field");
  if (field !== "logoUrl" && field !== "heroImageUrl") {
    return fail("Geçersiz alan.");
  }

  const current = getSettings();
  const url = field === "logoUrl" ? current.logoUrl : current.heroImageUrl;
  if (url) await deleteImage(url);

  db.update(siteSettings)
    .set({ [field]: "", updatedAt: new Date() })
    .where(eq(siteSettings.id, SINGLETON_ID))
    .run();

  revalidateSite();
  return ok("Görsel kaldırıldı.");
}

/**
 * Bolum gorunurlugu. Form yalnizca ACIK kutulari gonderir; kaydedilen deger
 * ise KAPALI olanlarin listesidir (bkz. lib/sections.ts — yeni bolum eklendiginde
 * mevcut kurulumlar otomatik acik gelsin diye).
 */
export async function saveHiddenSectionsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const visible = new Set(formData.getAll("visible").map(String));
  const hidden = TOGGLEABLE_SECTION_KEYS.filter((key) => !visible.has(key));

  const parsed = hiddenSectionsSchema.safeParse({ hidden });
  if (!parsed.success) return fromZodError(parsed.error);

  db.update(siteSettings)
    .set({ hiddenSections: parsed.data.hidden, updatedAt: new Date() })
    .where(eq(siteSettings.id, SINGLETON_ID))
    .run();

  revalidateSite();
  return ok("Bölüm görünürlüğü kaydedildi.");
}
