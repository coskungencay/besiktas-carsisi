"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { SINGLETON_ID, db } from "@/db";
import { siteSettings } from "@/db/schema";
import {
  type ActionState,
  fail,
  fromZodError,
  ok,
} from "@/lib/action-result";
import { requirePanelUser } from "@/lib/session";
import { EDITABLE_COLOR_VARS } from "@/lib/theme-vars";
import { getTheme, isThemeSlug } from "@/themes/registry";
import { colorsSchema, themeSlugSchema } from "@/lib/validators";

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

/**
 * Tema secimi.
 *
 * ONEMLI: tema degisince ozel renkler SIFIRLANIR. Aksi halde onceki temanin
 * paleti yeni temanin uzerine yazilir ve (orn. acik temadan koyu temaya
 * gecerken) site okunamaz hale gelir.
 */
export async function saveThemeSlugAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const parsed = themeSlugSchema.safeParse({
    themeSlug: String(formData.get("themeSlug") ?? ""),
  });
  if (!parsed.success) return fromZodError(parsed.error);
  if (!isThemeSlug(parsed.data.themeSlug)) return fail("Seçilen tema bulunamadı.");

  const current = db
    .select({ themeSlug: siteSettings.themeSlug })
    .from(siteSettings)
    .where(eq(siteSettings.id, SINGLETON_ID))
    .get();

  const changed = current?.themeSlug !== parsed.data.themeSlug;

  db.update(siteSettings)
    .set({
      themeSlug: parsed.data.themeSlug,
      // Tema degistiyse ozel renkleri temizle -> yeni temanin paleti gecerli olur.
      ...(changed ? { brandColors: {} } : {}),
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, SINGLETON_ID))
    .run();

  revalidateAll();
  return ok(
    changed
      ? `Tema "${getTheme(parsed.data.themeSlug).name}" olarak değiştirildi ve renkler bu temanın varsayılanlarına ayarlandı.`
      : "Tema kaydedildi.",
  );
}

/** Marka renkleri. Aktif temanin varsayilanlariyla ayni olanlar kaydedilmez. */
export async function saveThemeColorsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const colors: Record<string, string> = {};
  for (const { key } of EDITABLE_COLOR_VARS) {
    const value = formData.get(key);
    if (typeof value === "string" && value.trim()) {
      colors[key] = value.trim().toUpperCase();
    }
  }

  const parsed = colorsSchema.safeParse({ colors });
  if (!parsed.success) return fromZodError(parsed.error);

  const current = db
    .select({ themeSlug: siteSettings.themeSlug })
    .from(siteSettings)
    .where(eq(siteSettings.id, SINGLETON_ID))
    .get();

  const defaults = getTheme(current?.themeSlug).defaultColors;

  // Temanin varsayilanindan farkli OLMAYAN renkleri saklama; boylece tema
  // guncellenirse musteri otomatik olarak yeni paleti alir.
  const overrides: Record<string, string> = {};
  for (const [key, value] of Object.entries(parsed.data.colors)) {
    if ((defaults[key] ?? "").toUpperCase() !== value) overrides[key] = value;
  }

  db.update(siteSettings)
    .set({ brandColors: overrides, updatedAt: new Date() })
    .where(eq(siteSettings.id, SINGLETON_ID))
    .run();

  revalidateAll();
  return ok(
    Object.keys(overrides).length === 0
      ? "Renkler temanın varsayılanlarına ayarlandı."
      : "Renkler kaydedildi.",
  );
}

export async function resetThemeColorsAction(): Promise<ActionState> {
  await requirePanelUser();

  db.update(siteSettings)
    .set({ brandColors: {}, updatedAt: new Date() })
    .where(eq(siteSettings.id, SINGLETON_ID))
    .run();

  revalidateAll();
  return ok("Renkler tema varsayılanlarına döndürüldü.");
}
