"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { purgeTranslations } from "@/actions/locales";
import {
  type ActionState,
  fail,
  formToObject,
  fromZodError,
  ok,
} from "@/lib/action-result";
import { requirePanelUser } from "@/lib/session";
import { reorderSchema, testimonialSchema } from "@/lib/validators";

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/yorumlar");
}

export async function saveTestimonialAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const parsed = testimonialSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { id, ...values } = parsed.data;

  try {
    if (id) {
      db.update(testimonials).set(values).where(eq(testimonials.id, id)).run();
    } else {
      // Yeni yorum en sona eklenir; sira panelden suruklenerek degistirilir.
      const row = db
        .select({ max: sql<number | null>`max(${testimonials.sortOrder})` })
        .from(testimonials)
        .get();

      db.insert(testimonials)
        .values({ ...values, sortOrder: (row?.max ?? -1) + 1 })
        .run();
    }
  } catch (error) {
    console.error("[testimonials] kayit hatasi:", error);
    return fail("Yorum kaydedilemedi.");
  }

  revalidateAll();
  return ok(id ? "Yorum güncellendi." : "Yorum eklendi.");
}

export async function deleteTestimonialAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return fail("Geçersiz kayıt.");

  db.delete(testimonials).where(eq(testimonials.id, id)).run();
  // Ceviriler kayda bagli; kayit silinince onlar da gitmeli.
  await purgeTranslations("testimonial", id);

  revalidateAll();
  return ok("Yorum silindi.");
}

export async function reorderTestimonialsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const raw = String(formData.get("ids") ?? "");
  const parsed = reorderSchema.safeParse({
    ids: raw ? raw.split(",").filter(Boolean) : [],
  });
  if (!parsed.success) return fromZodError(parsed.error);

  db.transaction((tx) => {
    parsed.data.ids.forEach((id, index) => {
      tx.update(testimonials)
        .set({ sortOrder: index })
        .where(eq(testimonials.id, id))
        .run();
    });
  });

  revalidateAll();
  return ok("Sıralama kaydedildi.");
}
