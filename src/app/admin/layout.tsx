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
  // Panel, sitenin marka renklerinden bagimsiz sabit bir arayuz kullanir;
  // musterinin sectigi renkler paneli asla okunamaz hale getiremez.
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">{children}</div>
  );
}
