import { headers } from "next/headers";
import type { Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";

import { LOCALE_META, isLocale, DEFAULT_LOCALE } from "@/i18n/config";
import { getSettings } from "@/lib/content";

import "./globals.css";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#7a4a2b",
  width: "device-width",
  initialScale: 1,
};

/**
 * Kok layout yalnizca <html> kabugunu kurar.
 *  - lang / dir : middleware'in koydugu x-locale basligindan (panelde her zaman tr)
 *  - style      : panelden secilen marka renkleri, tema token'larini ezer
 * Sayfa metadata'si src/app/[locale]/layout.tsx icinde uretilir.
 */
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerLocale = (await headers()).get("x-locale");
  const locale = isLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE;
  const { dir } = LOCALE_META[locale];

  const settings = getSettings();
  const brandStyle = (settings.brandColors ?? {}) as CSSProperties;

  return (
    <html
      lang={locale}
      dir={dir}
      data-theme={settings.themeSlug}
      style={brandStyle}
    >
      <body>
        {/*
          JavaScript kapaliysa animasyonlu bolumler opacity:0 ile gomulu kalir
          ve sayfa BOS gorunur. Bu kural yalnizca JS kapaliyken devreye girer.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
