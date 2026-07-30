import { notFound } from "next/navigation";

import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { isLocale } from "@/i18n/config";
import { getSiteContent } from "@/lib/content";
import { buildJsonLd } from "@/lib/seo";
import { getTheme } from "@/themes/registry";
import { SECTION_ORDER } from "@/themes/types";

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
  const year = new Date().getFullYear();

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

      {content.locales.length > 1 ? (
        <div className="absolute end-4 top-4 z-40">
          <LocaleSwitcher content={content} />
        </div>
      ) : null}

      <main id="main">
        {SECTION_ORDER.map((key) => {
          const Section = theme.sections[key];
          return <Section key={key} content={content} />;
        })}
      </main>

      <footer className="bg-[var(--brand-ink)] py-10 text-[color-mix(in_srgb,var(--brand-primary-contrast)_75%,transparent)]">
        <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-2 px-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {year} {content.name}
          </p>
          {content.contact.address ? (
            <p className="text-pretty">{content.contact.address}</p>
          ) : null}
        </div>
      </footer>
    </>
  );
}
