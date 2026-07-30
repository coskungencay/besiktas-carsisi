"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { openingHours } from "@/db/schema";
import {
  type ActionState,
  fail,
  fromZodError,
  ok,
} from "@/lib/action-result";
import { requirePanelUser } from "@/lib/session";
import { openingHoursSchema } from "@/lib/validators";

export async function saveOpeningHoursAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePanelUser();

  const hours = Array.from({ length: 7 }, (_, day) => ({
    dayOfWeek: day,
    openTime: String(formData.get(`open-${day}`) ?? "09:00"),
    closeTime: String(formData.get(`close-${day}`) ?? "22:00"),
    isClosed: formData.get(`closed-${day}`),
  }));

  const parsed = openingHoursSchema.safeParse({ hours });
  if (!parsed.success) return fromZodError(parsed.error);

  try {
    db.transaction((tx) => {
      for (const hour of parsed.data.hours) {
        tx.insert(openingHours)
          .values(hour)
          .onConflictDoUpdate({
            target: openingHours.dayOfWeek,
            set: {
              openTime: hour.openTime,
              closeTime: hour.closeTime,
              isClosed: hour.isClosed,
            },
          })
          .run();
      }
    });
  } catch (error) {
    console.error("[hours] kayit hatasi:", error);
    return fail("Çalışma saatleri kaydedilemedi.");
  }

  revalidatePath("/");
  return ok("Çalışma saatleri kaydedildi.");
}
