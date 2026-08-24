import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
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
