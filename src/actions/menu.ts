"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { menuCategories, menuItems } from "@/db/schema";
import {
  type ActionState,
  fail,
  formToObject,
  fromZodError,
  ok,
} from "@/lib/action-result";
import { requirePanelUser } from "@/lib/session";
import { deleteImage, storeImage, UploadError } from "@/lib/uploads";
import {
  menuCategorySchema,
  menuItemSchema,
  reorderSchema,
} from "@/lib/validators";

function revalidateMenu() {
  revalidatePath("/");
  revalidatePath("/admin/menu");
}

function nextSortOrder(table: typeof menuCategories | typeof menuItems) {
  const row = db
    .select({ max: sql<number | null>`max(${table.sortOrder})` })
    .from(table)
    .get();
  return (row?.max ?? -1) + 1;
}

/* -------------------------------- Kategori -------------------------------- */

export async function saveCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const parsed = menuCategorySchema.safeParse(formToObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  try {
    if (parsed.data.id) {
      db.update(menuCategories)
        .set({ name: parsed.data.name })
        .where(eq(menuCategories.id, parsed.data.id))
        .run();
    } else {
      db.insert(menuCategories)
        .values({
          name: parsed.data.name,
          sortOrder: nextSortOrder(menuCategories),
        })
        .run();
    }
  } catch (error) {
    console.error("[menu] kategori kayit hatasi:", error);
    return fail("Kategori kaydedilemedi.");
  }

  revalidateMenu();
  return ok(parsed.data.id ? "Kategori güncellendi." : "Kategori eklendi.");
}

export async function deleteCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return fail("Geçersiz kategori.");

  // Kategoriye bagli urunlerin gorselleri de temizlensin.
  const items = db
    .select({ imageUrl: menuItems.imageUrl })
    .from(menuItems)
    .where(eq(menuItems.categoryId, id))
    .all();

  db.delete(menuCategories).where(eq(menuCategories.id, id)).run();
  await Promise.all(
    items.filter((i) => i.imageUrl).map((i) => deleteImage(i.imageUrl)),
  );

  revalidateMenu();
  return ok("Kategori ve içindeki ürünler silindi.");
}

/* ---------------------------------- Urun ---------------------------------- */

export async function saveItemAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const parsed = menuItemSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  try {
    let imageUrl = parsed.data.imageUrl;
    const file = formData.get("imageFile");

    if (file instanceof File && file.size > 0) {
      const stored = await storeImage(file);
      if (parsed.data.id) {
        const existing = db
          .select({ imageUrl: menuItems.imageUrl })
          .from(menuItems)
          .where(eq(menuItems.id, parsed.data.id))
          .get();
        if (existing?.imageUrl) await deleteImage(existing.imageUrl);
      }
      imageUrl = stored.url;
    }

    if (parsed.data.id) {
      db.update(menuItems)
        .set({
          categoryId: parsed.data.categoryId,
          name: parsed.data.name,
          description: parsed.data.description,
          price: parsed.data.price,
          imageUrl,
          isFeatured: parsed.data.isFeatured,
          isActive: parsed.data.isActive,
        })
        .where(eq(menuItems.id, parsed.data.id))
        .run();
    } else {
      db.insert(menuItems)
        .values({
          categoryId: parsed.data.categoryId,
          name: parsed.data.name,
          description: parsed.data.description,
          price: parsed.data.price,
          imageUrl,
          isFeatured: parsed.data.isFeatured,
          isActive: parsed.data.isActive,
          sortOrder: nextSortOrder(menuItems),
        })
        .run();
    }
  } catch (error) {
    if (error instanceof UploadError) return fail(error.message);
    console.error("[menu] urun kayit hatasi:", error);
    return fail("Ürün kaydedilemedi.");
  }

  revalidateMenu();
  return ok(parsed.data.id ? "Ürün güncellendi." : "Ürün eklendi.");
}

export async function deleteItemAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return fail("Geçersiz ürün.");

  const existing = db
    .select({ imageUrl: menuItems.imageUrl })
    .from(menuItems)
    .where(eq(menuItems.id, id))
    .get();

  db.delete(menuItems).where(eq(menuItems.id, id)).run();
  if (existing?.imageUrl) await deleteImage(existing.imageUrl);

  revalidateMenu();
  return ok("Ürün silindi.");
}

/* -------------------------------- Siralama -------------------------------- */

async function reorder(
  table: typeof menuCategories | typeof menuItems,
  rawIds: unknown,
): Promise<ActionState> {
  const parsed = reorderSchema.safeParse({ ids: rawIds });
  if (!parsed.success) return fromZodError(parsed.error);

  db.transaction((tx) => {
    parsed.data.ids.forEach((id, index) => {
      tx.update(table)
        .set({ sortOrder: index })
        .where(eq(table.id, id))
        .run();
    });
  });

  revalidateMenu();
  return ok("Sıralama kaydedildi.");
}

export async function reorderCategoriesAction(ids: number[]) {
  await requirePanelUser();
  return reorder(menuCategories, ids);
}

export async function reorderItemsAction(ids: number[]) {
  await requirePanelUser();
  return reorder(menuItems, ids);
}
