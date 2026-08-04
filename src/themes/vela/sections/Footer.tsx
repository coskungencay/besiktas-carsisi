import { Latin } from "@/components/site/Latin";
import { goldLink, label, shell, surface } from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kunye: tasarimda tek satir, iki ucta hizalanmis, 10.5px ve .24em harf
 * arali, murekkebin yalnizca %38'i (--brand-ink-faint).
 *
 * Ust ayrac ALTIN DEGIL: tasarimda altin cizgi kapanis bolumunun BASINDA
 * (bkz. Contact.tsx), kunyenin ustundeki cizgi ise murekkebin %10'u. Ikisini
 * de altin yapmak sayfanin sonunda iki esit agirlikta cizgi birakiyordu.
 * Cizgi kabuk dolgusunun ICINDE: tasarimda da 60px'lik kenar boslugunda
 * bitiyor, kenardan kenara uzamiyor.
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
    <footer className={`${surface} brand-body`}>
      {hasSocial ? (
        <div className={shell}>
          <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-[var(--brand-rule-soft)] pt-12 pb-10">
            {/*
             * Baslik gorunur duruyor: bir "izle bizi" satiri etiketsiz kalirsa
             * ekran okuyucuda sadece platform adlari sirasi olur.
             */}
            <h2 className={label}>{t.social.title}</h2>

            {/* Ogeler arasi 34px — ust seritteki nav ile ayni aralik. */}
            <ul className="flex flex-wrap items-center gap-x-[2.125rem] gap-y-2">
              {socialLinks.map((link) => (
                <li key={`${link.platform}-${link.url}`}>
                  {/*
                   * Altin: tasarimin global `a` kurali. Uzerine gelince krem.
                   */}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={`brand-body brand-eyebrow text-[0.6875rem] leading-[1.6] ${goldLink}`}
                  >
                    <Latin>{link.label}</Latin>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div className={shell}>
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-3 border-t border-[var(--brand-rule-soft)] pt-[1.375rem] pb-10 text-[0.65625rem] leading-[1.8] uppercase tracking-[var(--brand-meta-tracking)] text-[var(--brand-ink-faint)]">
          <span>{name}</span>
          {tagline ? <span className="text-pretty">{tagline}</span> : null}
          <span dir="ltr">© {year}</span>
        </div>
      </div>
    </footer>
  );
}
