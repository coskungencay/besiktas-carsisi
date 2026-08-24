import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { isLocale } from "@/i18n/config";
import { getSiteContent } from "@/lib/content";
import { appUrl } from "@/lib/env";
import { buildMenuJsonLd } from "@/lib/seo";
import { getTheme } from "@/themes/registry";
import { hasMenu } from "@/themes/_shared/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const content = getSiteContent(locale);
  const base = appUrl();

  /*
   * Menunun kendi basligi ve adresi var: paylasildiginda "Menu — Isletme"
   * gorunuyor, arama motorunda ayri bir sonuc olarak cikabiliyor.
   * hreflang: acik olan her dilin menu adresi.
   */
  const languages: Record<string, string> = {};
  for (const option of content.locales) {
    languages[option.locale] = `${base}/${option.locale}/magazalar`;
  }

  return {
    title: content.t.menu.eyebrow,
    description: `${content.name} — ${content.t.menu.pageIntro}`,
    alternates: {
      canonical: `${base}/${locale}/magazalar`,
      languages,
    },
  };
}

/**
 * Ayri menu sayfasi.
 *
 * NEDEN AYRI SAYFA: menu buyudukce (30+ urun) ana sayfa okunamaz hale
 * geliyordu. Restoran sitelerinde yerlesik kalip da bu: ana sayfada birkac
 * one cikan urun + "tum menu" baglantisi, tam liste kendi sayfasinda.
 * Ayrica menunun kendi URL'i olmasi paylasilabilir ve aranabilir kiliyor.
 *
 * Sayfa temanin kendi Header/Footer'ini kullanir; govde temanin MenuPage
 * bileseninden gelir.
 */
export default async function MenuRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getSiteContent(locale);

  // Menude hic urun yoksa bu sayfanin varlik sebebi yok.
  if (!hasMenu(content)) notFound();

  const theme = getTheme(content.themeSlug);
  const { Header, Footer } = theme;

  /*
   * Tema kendi menu sayfasini yazmadiysa ana sayfadaki menu bolumune duseriz;
   * o bolum zaten tum kategorileri basiyor, yalnizca sayfa baglaminda duruyor.
   */
  const Body =
    theme.MenuPage ??
    theme.sections.find((section) => section.id === "magazalar")?.Component;

  if (!Body) notFound();

  const jsonLd = buildMenuJsonLd(content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <a href="#main" className="skip-link">
        {content.t.nav.skipToContent}
      </a>

      <AnnouncementBar content={content} />

      {Header ? <Header content={content} /> : null}

      {content.locales.length > 1 && !Header ? (
        <div className="absolute end-4 top-4 z-40">
          <LocaleSwitcher content={content} />
        </div>
      ) : null}

      <main id="main">
        <Body content={content} />
      </main>

      {Footer ? <Footer content={content} /> : null}

      <FloatingWhatsApp content={content} />
    </>
  );
}
