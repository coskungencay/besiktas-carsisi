"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { getMessages } from "@/i18n";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import {
  type ActionState,
  fail,
  formToObject,
  fromZodError,
  ok,
} from "@/lib/action-result";
import { getSettings } from "@/lib/content";
import { contactRateLimitPerHour } from "@/lib/env";
import { sendContactMail } from "@/lib/mailer";
import { clientIp, hit } from "@/lib/rate-limit";
import { makeContactMessageSchema } from "@/lib/validators";

export async function submitContactAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = formToObject(formData);

  // Ziyaretcinin dili: form ile gelir, gecersizse varsayilana duser.
  const localeField = raw.locale;
  const locale = isLocale(localeField) ? localeField : DEFAULT_LOCALE;
  const m = getMessages(locale);

  const parsed = makeContactMessageSchema(m).safeParse(raw);
  if (!parsed.success) return fromZodError(parsed.error);

  // Honeypot: bot doldurdugu icin basarili gibi davran, hicbir sey kaydetme.
  if (parsed.data.website.trim().length > 0) {
    return ok(m.form.success);
  }

  const ip = clientIp(await headers());
  const limit = hit(`contact:${ip}`, contactRateLimitPerHour());
  if (!limit.allowed) {
    return fail(m.errors.rateLimited);
  }

  try {
    db.insert(contactMessages)
      .values({
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        message: parsed.data.message,
        isRead: false,
        createdAt: new Date(),
      })
      .run();
  } catch (error) {
    console.error("[contact] mesaj kaydedilemedi:", error);
    return fail(m.errors.generic);
  }

  // Mail gonderimi best-effort; basarisiz olursa kullaniciya yansitilmaz.
  const settings = getSettings();
  void sendContactMail({
    siteName: settings.name,
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    message: parsed.data.message,
    locale,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mesajlar");
  return ok(m.form.success);
}
