import { headers } from "next/headers";
import type { Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";

import { DEFAULT_LOCALE, LOCALE_META, isLocale } from "@/i18n/config";
import { getSettings } from "@/lib/content";
import { themeFontClassNames } from "@/themes/fonts";
import { getTheme, resolveThemeSlug } from "@/themes/registry";

import "./globals.css";

export const dynamic = "force-dynamic";

/** Aktif temanin (veya musterinin sectigi) ana rengini dondurur. */
function activeThemeColor(): string {
  const settings = getSettings();
  const theme = getTheme(resolveThemeSlug(settings.themeSlug));
  return (
    settings.brandColors?.["--brand-primary"] ??
    theme.defaultColors["--brand-primary"] ??
    "#7a4a2b"
  );
}

/**
 * Mobil tarayici cubugunun rengi aktif temadan gelir; sabit birakilsaydi
 * 9 temanin 8'inde yanlis renk gorunurdu.
 */
export function generateViewport(): Viewport {
  return {
    themeColor: activeThemeColor(),
    width: "device-width",
    initialScale: 1,
  };
}

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
      data-theme={resolveThemeSlug(settings.themeSlug)}
      // Font degiskenleri burada tanimlanir; hangisinin kullanilacagini
      // temanin tokens.css'i secer (bkz. src/themes/fonts.ts).
      className={themeFontClassNames}
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
