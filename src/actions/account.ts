"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import {
  type ActionState,
  fail,
  formToObject,
  fromZodError,
  ok,
} from "@/lib/action-result";
import { auth } from "@/lib/auth";
import { requireUser } from "@/lib/session";
import { changePasswordSchema } from "@/lib/validators";

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const current = await requireUser();

  const parsed = changePasswordSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fromZodError(parsed.error);

  if (parsed.data.currentPassword === parsed.data.newPassword) {
    return fail("Yeni şifre mevcut şifreden farklı olmalı.", {
      newPassword: "Yeni şifre mevcut şifreden farklı olmalı.",
    });
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true,
      },
    });
  } catch (error) {
    console.error("[account] sifre degistirilemedi:", error);
    return fail("Mevcut şifreniz hatalı.", {
      currentPassword: "Mevcut şifreniz hatalı.",
    });
  }

  db.update(userTable)
    .set({ mustChangePassword: false, updatedAt: new Date() })
    .where(eq(userTable.id, current.id))
    .run();

  return ok("Şifreniz güncellendi.");
}

export async function signOutAction(): Promise<void> {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (error) {
    console.error("[account] cikis hatasi:", error);
  }
  redirect("/admin/giris");
}
