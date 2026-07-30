import Link from "next/link";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  contactMessages,
  galleryImages,
  menuCategories,
  menuItems,
} from "@/db/schema";
import { getSettings } from "@/lib/content";
import { formatDateTime } from "@/lib/format";
import { pinnedThemeSlug } from "@/themes/registry";

export const dynamic = "force-dynamic";

const QUICK_LINKS = [
  {
    href: "/admin/genel",
    label: "Genel Bilgiler",
    description: "İşletme adı, adres, telefon, logo ve kapak görseli.",
  },
  {
    href: "/admin/saatler",
    label: "Çalışma Saatleri",
    description: "Haftanın 7 günü için açılış/kapanış saatleri.",
  },
  {
    href: "/admin/menu",
    label: "Menü",
    description: "Kategori ve ürünleri ekleyin, sıralayın, fiyat girin.",
  },
  {
    href: "/admin/galeri",
    label: "Galeri",
    description: "Mekân fotoğraflarını toplu yükleyin ve sıralayın.",
  },
  {
    href: "/admin/mesajlar",
    label: "Mesajlar",
    description: "Siteden gelen iletişim mesajları.",
  },
  {
    href: "/admin/diller",
    label: "Diller & Çeviriler",
    description: "Sitenin dillerini açın ve metin çevirilerini girin.",
  },
  {
    href: "/admin/tema",
    label: "Tema & Renkler",
    description: "Site temasını ve marka renklerini değiştirin.",
  },
] as const;

export default function DashboardPage() {
  const settings = getSettings();

  const unread = db
    .select({ id: contactMessages.id })
    .from(contactMessages)
    .where(eq(contactMessages.isRead, false))
    .all().length;

  const totalMessages = db
    .select({ id: contactMessages.id })
    .from(contactMessages)
    .all().length;

  const categoryCount = db
    .select({ id: menuCategories.id })
    .from(menuCategories)
    .all().length;

  const itemCount = db.select({ id: menuItems.id }).from(menuItems).all().length;

  const galleryCount = db
    .select({ id: galleryImages.id })
    .from(galleryImages)
    .all().length;

  const latest = db
    .select()
    .from(contactMessages)
    .where(eq(contactMessages.isRead, false))
    .all()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  const stats = [
    { label: "Okunmamış mesaj", value: unread, highlight: unread > 0 },
    { label: "Toplam mesaj", value: totalMessages, highlight: false },
    { label: "Menü kategorisi", value: categoryCount, highlight: false },
    { label: "Menü ürünü", value: itemCount, highlight: false },
    { label: "Galeri görseli", value: galleryCount, highlight: false },
  ];

  const pinned = pinnedThemeSlug();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Hoş geldiniz{settings.name ? `, ${settings.name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Sitenizin tüm içeriğini buradan yönetebilirsiniz.
        </p>
      </header>

      <section aria-labelledby="stats-title">
        <h2 id="stats-title" className="sr-only">
          Özet
        </h2>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border p-4 shadow-sm ${
                stat.highlight
                  ? "border-red-200 bg-red-50"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <dt className="text-xs font-medium text-zinc-600">{stat.label}</dt>
              <dd
                className={`mt-1 text-2xl font-semibold tabular-nums ${
                  stat.highlight ? "text-red-700" : "text-zinc-900"
                }`}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {latest.length > 0 ? (
        <section aria-labelledby="latest-title">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="latest-title" className="text-lg font-semibold">
              Son okunmamış mesajlar
            </h2>
            <Link
              href="/admin/mesajlar"
              className="text-sm text-zinc-600 underline underline-offset-4"
            >
              Tümünü gör
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {latest.map((message) => (
              <li
                key={message.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium">{message.name}</p>
                  <p className="text-xs text-zinc-500">
                    {formatDateTime(message.createdAt)}
                  </p>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                  {message.message}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="quick-title">
        <h2 id="quick-title" className="text-lg font-semibold">
          Hızlı erişim
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block h-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-zinc-400"
              >
                <p className="font-semibold">{link.label}</p>
                <p className="mt-1 text-sm text-zinc-600">{link.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {pinned ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Not: Tema <strong>{pinned}</strong> olarak sunucu ayarlarında
          (NEXT_PUBLIC_THEME) sabitlenmiş. Tema seçimi panelden değiştirilemez;
          renkler değiştirilebilir.
        </p>
      ) : null}
    </div>
  );
}
