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
 * tarayicidan geliyor, disari tiklaninca kapanmasi icin JS gerekmiyor
 * (mobilde acilir menu zaten tam ekran bir karar degil).
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
      {/*
        Dar ekran: sag ust kosede SABIT duran ikon + aktif dil; dokununca liste
        aciliyor.

        NEDEN SABIT (fixed): dokuz temanin header yapisi birbirinden farkli
        (kimi tek serit, kimi uc katli, kimi sticky). Seciciyi her header'in
        icine yerlestirmeye calismak dar ekranda ya ucuncu bir satir aciyor ya
        da acilan listeyi ekran disina tasiyordu. Sag ust kose her temada bos
        ve acilan liste end-0 ile hep sola dogru aciliyor — hicbir ekranda
        tasma olmuyor. Genis ekranda secici header'daki yerine donuyor.
      */}
      <details
        className={`brand-body fixed end-3 top-3 z-40 sm:hidden ${className}`}
        aria-label={content.t.nav.changeLanguage}
      >
        <summary className="brand-frame brand-rounded flex cursor-pointer list-none items-center gap-1.5 bg-[var(--brand-surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--brand-ink)] [&::-webkit-details-marker]:hidden">
          <GlobeIcon />
          <span>{active?.label ?? content.t.nav.languageLabel}</span>
        </summary>

        <nav
          aria-label={content.t.nav.changeLanguage}
          /*
            Mutlak konum: acilan liste sayfayi asagi itmemeli, yoksa ust serit
            her acilista zipliyor.
            
            TASMA: liste secicinin SAG kenarina hizali (end-0) ve genisligi
            ekrandan tasamayacak sekilde sinirli. Secici header'in sag ucunda
            durdugu icin liste sola dogru aciliyor ve hicbir ekranda disari
            cikmiyor; Arapca'da yon kendiliginden tersleniyor.
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
