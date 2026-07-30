"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { type ActionState, fail, ok } from "@/lib/action-result";
import { requirePanelUser } from "@/lib/session";

function revalidateMessages() {
  revalidatePath("/admin");
  revalidatePath("/admin/mesajlar");
}

export async function toggleMessageReadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return fail("Geçersiz mesaj.");

  const existing = db
    .select({ isRead: contactMessages.isRead })
    .from(contactMessages)
    .where(eq(contactMessages.id, id))
    .get();
  if (!existing) return fail("Mesaj bulunamadı.");

  db.update(contactMessages)
    .set({ isRead: !existing.isRead })
    .where(eq(contactMessages.id, id))
    .run();

  revalidateMessages();
  return ok(existing.isRead ? "Okunmadı olarak işaretlendi." : "Okundu olarak işaretlendi.");
}

export async function deleteMessageAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return fail("Geçersiz mesaj.");

  db.delete(contactMessages).where(eq(contactMessages.id, id)).run();

  revalidateMessages();
  return ok("Mesaj silindi.");
}

/** Form action olarak dogrudan kullanilir; deger dondurmez. */
export async function markAllReadAction(): Promise<void> {
  await requirePanelUser();

  db.update(contactMessages)
    .set({ isRead: true })
    .where(eq(contactMessages.isRead, false))
    .run();

  revalidateMessages();
}
