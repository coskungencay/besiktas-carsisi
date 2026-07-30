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
import { isThemeSlug } from "@/themes/registry";
import { themeSchema } from "@/lib/validators";


export async function saveThemeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const colors: Record<string, string> = {};
  for (const { key } of EDITABLE_COLOR_VARS) {
    const value = formData.get(key);
    if (typeof value === "string" && value.trim()) {
      colors[key] = value.trim();
    }
  }

  const parsed = themeSchema.safeParse({
    themeSlug: String(formData.get("themeSlug") ?? "placeholder"),
    colors,
  });
  if (!parsed.success) return fromZodError(parsed.error);

  if (!isThemeSlug(parsed.data.themeSlug)) {
    return fail("Seçilen tema bulunamadı.");
  }

  db.update(siteSettings)
    .set({
      themeSlug: parsed.data.themeSlug,
      brandColors: parsed.data.colors,
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, SINGLETON_ID))
    .run();

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  return ok("Tema ve renkler kaydedildi.");
}

export async function resetThemeColorsAction(): Promise<ActionState> {
  await requirePanelUser();

  db.update(siteSettings)
    .set({ brandColors: {}, updatedAt: new Date() })
    .where(eq(siteSettings.id, SINGLETON_ID))
    .run();

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  return ok("Renkler tema varsayılanlarına döndürüldü.");
}
