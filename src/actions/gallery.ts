"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import {
  type ActionState,
  fail,
  formToObject,
  fromZodError,
  ok,
} from "@/lib/action-result";
import { purgeTranslations } from "@/actions/locales";
import { requirePanelUser } from "@/lib/session";
import { deleteImage, storeImage, UploadError } from "@/lib/uploads";
import { galleryImageSchema, reorderSchema } from "@/lib/validators";

function revalidateGallery() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/galeri");
}

export async function uploadGalleryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) return fail("Yüklenecek görsel seçin.");
  if (files.length > 30) return fail("Tek seferde en fazla 30 görsel.");

  const startRow = db
    .select({ max: sql<number | null>`max(${galleryImages.sortOrder})` })
    .from(galleryImages)
    .get();
  let sortOrder = (startRow?.max ?? -1) + 1;

  let uploaded = 0;
  const errors: string[] = [];

  for (const file of files) {
    try {
      const stored = await storeImage(file);
      db.insert(galleryImages)
        .values({ url: stored.url, alt: "", sortOrder: sortOrder++ })
        .run();
      uploaded += 1;
    } catch (error) {
      if (error instanceof UploadError) {
        errors.push(`${file.name}: ${error.message}`);
      } else {
        console.error("[gallery] yukleme hatasi:", error);
        errors.push(`${file.name}: yüklenemedi.`);
      }
    }
  }

  revalidateGallery();

  if (uploaded === 0) {
    return fail(errors[0] ?? "Hiçbir görsel yüklenemedi.");
  }
  if (errors.length > 0) {
    return ok(`${uploaded} görsel yüklendi. ${errors.length} tanesi atlandı.`);
  }
  return ok(`${uploaded} görsel yüklendi.`);
}

export async function updateGalleryAltAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const parsed = galleryImageSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  db.update(galleryImages)
    .set({ alt: parsed.data.alt })
    .where(eq(galleryImages.id, parsed.data.id))
    .run();

  revalidateGallery();
  return ok("Açıklama güncellendi.");
}

export async function deleteGalleryImageAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return fail("Geçersiz görsel.");

  const existing = db
    .select({ url: galleryImages.url })
    .from(galleryImages)
    .where(eq(galleryImages.id, id))
    .get();

  db.delete(galleryImages).where(eq(galleryImages.id, id)).run();
  await purgeTranslations("gallery", id);
  if (existing?.url) await deleteImage(existing.url);

  revalidateGallery();
  return ok("Görsel silindi.");
}

export async function reorderGalleryAction(ids: number[]): Promise<ActionState> {
  await requirePanelUser();

  const parsed = reorderSchema.safeParse({ ids });
  if (!parsed.success) return fromZodError(parsed.error);

  db.transaction((tx) => {
    parsed.data.ids.forEach((id, index) => {
      tx.update(galleryImages)
        .set({ sortOrder: index })
        .where(eq(galleryImages.id, id))
        .run();
    });
  });

  revalidateGallery();
  return ok("Sıralama kaydedildi.");
}
