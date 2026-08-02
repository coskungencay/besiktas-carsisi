"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutAction } from "@/actions/account";

const LINKS = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/genel", label: "Genel Bilgiler" },
  { href: "/admin/saatler", label: "Çalışma Saatleri" },
  { href: "/admin/menu", label: "Menü" },
  { href: "/admin/galeri", label: "Galeri" },
  { href: "/admin/yorumlar", label: "Yorumlar" },
  { href: "/admin/sss", label: "S.S.S." },
  { href: "/admin/mesajlar", label: "Mesajlar" },
  { href: "/admin/diller", label: "Diller & Çeviriler" },
  { href: "/admin/tema", label: "Tema & Renkler" },
] as const;

export function AdminNav({
  siteName,
  userEmail,
  unread,
}: {
  siteName: string;
  userEmail: string;
  unread: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="lg:w-60 lg:shrink-0">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <p className="truncate text-sm font-semibold">{siteName}</p>
        <p className="mt-0.5 truncate text-xs text-zinc-500">{userEmail}</p>

        <nav aria-label="Panel menüsü" className="mt-4">
          <ul className="flex flex-wrap gap-1 lg:flex-col">
            {LINKS.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-zinc-900 font-semibold text-white"
                        : "text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.href === "/admin/mesajlar" && unread > 0 ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          active ? "bg-white text-zinc-900" : "bg-red-600 text-white"
                        }`}
                      >
                        {unread}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-4 space-y-2 border-t border-zinc-200 pt-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Siteyi görüntüle ↗
          </Link>
          <Link
            href="/admin/sifre-degistir"
            className="block rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Şifre değiştir
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-700 transition-colors hover:bg-red-50"
            >
              Çıkış yap
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
