import Image from "next/image";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { getSettings } from "@/lib/content";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * Giris ekrani.
 *
 * ONCEKI HALI ve NEDEN DEGISTI: ortada kucuk bir kutu ve ustunde duz metin
 * isletme adi vardi; hangi sitenin paneli oldugu ancak okunarak anlasiliyordu
 * ve ekran sitenin geri kalaniyla hicbir akrabalik tasimiyordu.
 *
 * Simdi: buyuk amblem, sitenin display serif'iyle isletme adi, altinda kart.
 * Zemin sitenin dokusuyla ayni aileden (nokta izgarasi + yumusak aydinlanma),
 * ama panelin KENDI notr olceginden — marka rengi buraya karismiyor.
 */
export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(user.mustChangePassword ? "/admin/sifre-degistir" : "/admin");
  }

  const settings = getSettings();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/*
        Zemin dokusu — sitedekiyle ayni fikir, panelin kendi renginde.
        Tamamen dekoratif; icerigin arkasinda ve tiklanamaz.
      */}
      <div
        aria-hidden="true"
        className="admin-login-bg pointer-events-none absolute inset-0"
      />

      <div className="relative w-full max-w-md">
        <div className="text-center">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt=""
              width={176}
              height={176}
              priority
              className="mx-auto size-24 object-contain sm:size-28"
            />
          ) : null}

          <h1 className="mt-7 text-[clamp(1.5rem,4vw,2rem)] leading-[1.15] text-balance">
            {settings.name || "Yönetim Paneli"}
          </h1>

          <p className="admin-eyebrow mt-3 text-zinc-500">Yönetim Paneli</p>
        </div>

        <div className="mt-9 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Bu sayfa arama motorlarına kapalıdır.
        </p>
      </div>
    </main>
  );
}
