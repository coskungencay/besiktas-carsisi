import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  mustChangePassword: boolean;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const result = await auth.api.getSession({ headers: await headers() });
  if (!result?.user) return null;

  const raw = result.user as typeof result.user & {
    mustChangePassword?: boolean | null;
  };

  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    mustChangePassword: raw.mustChangePassword === true,
  };
}

/** Oturum yoksa giris sayfasina yonlendirir. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/giris");
  return user;
}

/**
 * Panel sayfalari icin: oturum + zorunlu sifre degisimi kontrolu.
 * Ilk giriste kullanici sifresini degistirene kadar panele giremez.
 */
export async function requirePanelUser(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.mustChangePassword) redirect("/admin/sifre-degistir");
  return user;
}
