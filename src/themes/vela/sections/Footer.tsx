import { metaMuted, shell, surface } from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kunye: tasarimda tek satir, iki ucta hizalanmis, 10.5px ve .24em harf
 * arali. Ust cizgi altin tonda oldugu icin border yerine ayri bir eleman
 * kullanildi (border-color'a opaklik verilemez).
 *
 * Slogan varsa ortaya giriyor; yoksa satir iki parcaya duser ve hizalama
 * kendiliginden dogru kalir (justify-between).
 *
 * Sosyal baglantilar kunyenin USTUNDE ayri bir satir: ayni kucuk uppercase
 * olcu, ikon yok. Vela'da marka isareti yalnizca metin ve cizgi; renkli
 * platform logolari bu sayfanin sessizligini bozardi. Baglanti yoksa satir
 * hic basilmaz, kunye de tek basina tasarimdaki haline doner.
 */
export default function Footer({ content }: SectionProps) {
  const { name, socialLinks, tagline, t } = content;
  const year = new Date().getFullYear();
  const hasSocial = socialLinks.length > 0;

  return (
    <footer className={`${surface} relative brand-body`}>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[var(--brand-primary)] opacity-30"
      />

      {hasSocial ? (
        <div
          className={`${shell} flex flex-wrap items-baseline gap-x-10 gap-y-4 pt-12 pb-10`}
        >
          {/*
           * Baslik gorunur duruyor: bir "izle bizi" satiri etiketsiz kalirsa
           * ekran okuyucuda sadece platform adlari sirasi olur.
           */}
          <h2 className="brand-body brand-eyebrow text-[0.6875rem] leading-[1.6] text-[var(--brand-primary)]">
            {t.social.title}
          </h2>

          {/* Ogeler arasi 34px — ust seritteki nav ile ayni aralik. */}
          <ul className="flex flex-wrap items-center gap-x-[2.125rem] gap-y-2">
            {socialLinks.map((link) => (
              <li key={`${link.platform}-${link.url}`}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`${metaMuted} transition-colors hover:text-[var(--brand-primary)]`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div
        className={`${shell} flex flex-wrap items-center justify-between gap-x-10 gap-y-3 pt-[1.375rem] pb-10 text-[0.65625rem] leading-[1.8] uppercase tracking-[var(--brand-meta-tracking)] text-[var(--brand-ink-muted)] ${
          // Sosyal satir varsa kunyeyi ondan ayiran sac teli cizgi gerekiyor;
          // yoksa footer'in ustundeki altin cizgi zaten ayirici.
          hasSocial ? "border-t border-[var(--brand-rule-soft)]" : ""
        }`}
      >
        <span>{name}</span>
        {tagline ? <span className="text-pretty">{tagline}</span> : null}
        <span dir="ltr">© {year}</span>
      </div>
    </footer>
  );
}
