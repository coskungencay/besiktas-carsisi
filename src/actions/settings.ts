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
import { siteSettingsSchema } from "@/lib/validators";

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

export async function saveSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const parsed = siteSettingsSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

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
