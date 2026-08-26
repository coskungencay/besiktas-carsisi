import type { Metadata } from "next";
import type { ReactNode } from "react";

import { appUrl } from "@/lib/env";

export const metadata: Metadata = {
  /*
   * metadataBase panel icin de yaziliyor.
   *
   * Uygulamanin kokunde bir opengraph-image.tsx var; Next onu MUTLAK bir
   * adrese cevirmek zorunda ve metadataBase yoksa "http://localhost:3000"a
   * dusuyor. Bu, uretim loglarina her acilista bir uyari birakiyordu
   * (canli sunucuda goruldu) ve panelin OG adresleri yerel makineyi
   * gosteriyordu. Panel zaten noindex, ama loglar temiz olmali ve yanlis
   * adres hicbir yerde uretilmemeli.
   *
   * Kamuya acik sayfalarin metadataBase'i src/lib/seo.ts'te ayrica veriliyor.
   */
  metadataBase: new URL(appUrl()),
  title: "Yönetim Paneli",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  /*
   * Panel sitenin YAZI TIPLERINI kullanir ama RENKLERINI kullanmaz.
   *
   * Font riski yok: tema pinli (NEXT_PUBLIC_THEME), musteri font
   * degistiremiyor. Renk riski duruyor — musteri panelden marka rengini
   * degistirebiliyor — bu yuzden panel kendi notr olcegini kullanir ve kotu
   * bir marka rengi paneli okunamaz hale getiremez. (bkz. globals.css)
   */
  return (
    <div className="admin-shell min-h-screen bg-zinc-100 text-zinc-900">
      {children}
    </div>
  );
}
