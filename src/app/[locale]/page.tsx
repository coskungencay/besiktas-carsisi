import { notFound } from "next/navigation";

import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { isLocale } from "@/i18n/config";
import { getSiteContent } from "@/lib/content";
import { buildJsonLd } from "@/lib/seo";
import { getTheme } from "@/themes/registry";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getSiteContent(locale);
  const theme = getTheme(content.themeSlug);
  const jsonLd = buildJsonLd(content);

  const { Header, Footer } = theme;

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify cikti guvenli; `<` kaciriliyor.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <a href="#main" className="skip-link">
        {content.t.nav.skipToContent}
      </a>

      {/*
        Dil seciciyi kendi header'i olan tema KENDI basar (kendi tasarimina
        oturtsun diye). Header'i olmayan temalar icin sayfa sag ust koseye
        koyar; yoksa cok dilli sitede dil degistirmek imkansiz olurdu.
      */}
      {content.locales.length > 1 && !Header ? (
        <div className="absolute end-4 top-4 z-40">
          <LocaleSwitcher content={content} />
        </div>
      ) : null}

      <AnnouncementBar content={content} />

      {Header ? <Header content={content} /> : null}

      {/*
        Bolumlerin sayisi ve sirasi TEMANIN karari (bkz. ThemeDefinition).
        Sayfa yalnizca sirayla basar; sabit bir bolum sablonu dayatmaz.
      */}
      <main id="main">
        {theme.sections.map(({ id, Component }) => (
          <Component key={id} content={content} />
        ))}
      </main>

      {Footer ? <Footer content={content} /> : null}

      <FloatingWhatsApp content={content} />
    </>
  );
}
