"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { faqs } from "@/db/schema";
import { purgeTranslations } from "@/actions/locales";
import {
  type ActionState,
  fail,
  formToObject,
  fromZodError,
  ok,
} from "@/lib/action-result";
import { requirePanelUser } from "@/lib/session";
import { faqSchema, reorderSchema } from "@/lib/validators";

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/sss");
}

export async function saveFaqAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const parsed = faqSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  const { id, ...values } = parsed.data;

  try {
    if (id) {
      db.update(faqs).set(values).where(eq(faqs.id, id)).run();
    } else {
      // Yeni soru en sona eklenir; sira panelden suruklenerek degistirilir.
      const row = db
        .select({ max: sql<number | null>`max(${faqs.sortOrder})` })
        .from(faqs)
        .get();

      db.insert(faqs)
        .values({ ...values, sortOrder: (row?.max ?? -1) + 1 })
        .run();
    }
  } catch (error) {
    console.error("[faqs] kayit hatasi:", error);
    return fail("Soru kaydedilemedi.");
  }

  revalidateAll();
  return ok(id ? "Soru güncellendi." : "Soru eklendi.");
}

export async function deleteFaqAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return fail("Geçersiz kayıt.");

  db.delete(faqs).where(eq(faqs.id, id)).run();
  // Ceviriler kayda bagli; kayit silinince onlar da gitmeli.
  await purgeTranslations("faq", id);

  revalidateAll();
  return ok("Soru silindi.");
}

export async function reorderFaqsAction(
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
      tx.update(faqs)
        .set({ sortOrder: index })
        .where(eq(faqs.id, id))
        .run();
    });
  });

  revalidateAll();
  return ok("Sıralama kaydedildi.");
}
