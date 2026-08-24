"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutAction } from "@/actions/account";
import { SchemeToggle } from "@/components/site/SchemeToggle";

const LINKS = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/genel", label: "Genel Bilgiler" },
  { href: "/admin/saatler", label: "Çalışma Saatleri" },
  { href: "/admin/menu", label: "Mağazalar" },
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
  logoUrl,
}: {
  siteName: string;
  userEmail: string;
  unread: number;
  /** Carsinin amblemi; panelde de sitenin markasi gorunsun diye. */
  logoUrl: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="lg:w-60 lg:shrink-0">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        {/*
          Marka bloğu: amblem + isletme adi + oturum acan hesap.
          Amblem paneli sitenin markasina bagliyor; sablonda panel tamamen
          markasizdi ve hangi sitenin paneli oldugu yalnizca yazidan
          anlasiliyordu.
        */}
        {/*
          Amblem ve mod dugmesi ustte, isim ALTTA.
          Uc ogeyi tek satira dizmek 240px'lik yan seritte isletme adina
          ~130px birakiyordu ve "Büyük Beşikt…" diye kirpiliyordu.
        */}
        <div className="flex items-start justify-between gap-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={80}
              height={80}
              className="size-11 shrink-0 object-contain"
            />
          ) : (
            <span />
          )}
          {/*
            Mod dugmesi sitedekiyle AYNI bilesen ve AYNI localStorage anahtari:
            panelde koyu moda gecen biri siteyi actiginda da koyu goruyor.
          */}
          <SchemeToggle label="Açık / koyu modu değiştir" />
        </div>

        <p className="mt-3 text-sm leading-snug font-semibold text-balance">
          {siteName}
        </p>
        <p className="mt-1 truncate text-xs text-zinc-500">{userEmail}</p>

        <nav aria-label="Panel menüsü" className="mt-5">
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
