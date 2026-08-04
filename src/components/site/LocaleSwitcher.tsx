import Link from "next/link";

import type { SiteContent } from "@/themes/types";

/** Dunya/ceviri ikonu. currentColor ile cizildi; renk cagiran taraftan gelir. */
function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="size-4 shrink-0"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8M3.6 15h16.8" />
      <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
    </svg>
  );
}

/**
 * Dil secici.
 *
 * Sunucu bileseni — JavaScript GEREKTIRMEZ. Genis ekranda diller yan yana
 * duruyor; dar ekranda ayni liste <details> icinde bir acilir menuye
 * donusuyor. Mobilde uc-bes dili yan yana basmak ust seridin yarisini
 * yiyordu ve tasarimin ritmini bozuyordu.
 *
 * <details>/<summary> tercih edildi cunku klavye ve ekran okuyucu destegi
 * tarayicidan geliyor, disari tiklaninca kapanmasi icin JS gerekmiyor.
 *
 * KONUM: secici artik header'in NORMAL AKISINDA duruyor (fixed DEGIL).
 * Bir sure sabit konumda denendi; sayfanin sag ust kosesinde asili kalan kutu
 * her temada baska bir metnin (semt adi, saat, nav) uzerine biniyordu ve
 * kaydirinca da ekranda kaliyordu. Akista durunca hicbir seyi ortmuyor,
 * header'in kendi sarma duzenine katiliyor.
 *
 * Dar ekranda tetikleyici yalnizca ikon + IKI HARFLI dil kodu tasir ("TR"),
 * cunku "Türkçe"/"English" gibi tam adlar dar seritte bir satiri tek basina
 * dolduruyordu. Acilan listede tam adlar yaziyor.
 */
export function LocaleSwitcher({
  content,
  className = "",
}: {
  content: SiteContent;
  className?: string;
}) {
  if (content.locales.length < 2) return null;

  const active = content.locales.find((option) => option.isActive);

  const linkClass = (isActive: boolean) =>
    `brand-rounded px-2.5 py-1 text-xs font-medium transition-colors ${
      isActive
        ? "bg-[var(--brand-primary)] text-[var(--brand-primary-contrast)]"
        : "text-[var(--brand-ink-muted)] hover:bg-[var(--brand-surface-alt)] hover:text-[var(--brand-ink)]"
    }`;

  return (
    <>
      {/* Dar ekran: ikon + dil kodu; dokununca liste aciliyor. */}
      <details
        className={`brand-body relative sm:hidden ${className}`}
        aria-label={content.t.nav.changeLanguage}
      >
        <summary className="brand-frame brand-rounded flex cursor-pointer list-none items-center gap-1.5 bg-[var(--brand-surface)] px-2 py-1 text-xs font-medium text-[var(--brand-ink)] [&::-webkit-details-marker]:hidden">
          <GlobeIcon />
          {/*
            Dil KODU, tam ad degil. toUpperCase() burada guvenli: kodlar ascii
            (tr/en/es/de/ar) ve hicbirinde Turkce'nin "i" sorunu yok.
          */}
          <span>{(active?.locale ?? "").toUpperCase()}</span>
        </summary>

        <nav
          aria-label={content.t.nav.changeLanguage}
          /*
            Mutlak konum: acilan liste sayfayi asagi itmemeli, yoksa ust serit
            her acilista zipliyor.

            TASMA: liste secicinin SAG kenarina hizali (end-0) ve genisligi
            ekrandan tasamayacak sekilde sinirli; Arapca'da yon kendiliginden
            terslenir.
          */
          className="brand-frame brand-rounded absolute end-0 z-50 mt-1.5 flex w-max max-w-[calc(100vw-1.5rem)] min-w-32 flex-col gap-1 bg-[var(--brand-surface)] p-1.5 shadow-lg"
        >
          {content.locales.map((option) => (
            <Link
              key={option.locale}
              href={option.href}
              hrefLang={option.locale}
              lang={option.locale}
              aria-current={option.isActive ? "true" : undefined}
              className={linkClass(option.isActive)}
            >
              {option.label}
            </Link>
          ))}
        </nav>
      </details>

      {/* Genis ekran: diller yan yana. */}
      <nav
        aria-label={content.t.nav.changeLanguage}
        className={`brand-frame brand-body hidden flex-wrap items-center gap-1 bg-[var(--brand-surface)] p-1 sm:flex ${className}`}
      >
        <span className="sr-only">{content.t.nav.languageLabel}</span>
        {content.locales.map((option) => (
          <Link
            key={option.locale}
            href={option.href}
            hrefLang={option.locale}
            lang={option.locale}
            aria-current={option.isActive ? "true" : undefined}
            className={linkClass(option.isActive)}
          >
            {option.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
