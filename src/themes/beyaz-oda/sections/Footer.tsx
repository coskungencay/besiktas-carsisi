import Image from "next/image";

import { Latin } from "@/components/site/Latin";
import { placeStamp } from "@/themes/_shared/data";
import { SocialIcon, hasSocialIcon } from "@/themes/_shared/icons";
import { shell, surface } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kapanis blogu.
 *
 * ONCEKI HALI ve NEDEN DEGISTI: 12 kolonluk bir izgaraya dagilmis uc mono
 * hucre vardi (marka solda, kunye ortada, telif sagda) ve ustunde ayri bir
 * "bizi takip edin" satiri duruyordu. Hucreler icerik uzunluguna gore
 * kaydigi icin serit hicbir zaman hizali gorunmuyordu — asimetrik ve dagilmis
 * duruyordu.
 *
 * Simdi tamamen ORTALANMIS ve simetrik bir kule: amblem, kelime-marka, sosyal
 * ikonlar, ince ayrac, en altta tek satirlik kunye. Her oge kendi satirinda
 * ortada; icerik degisse de hiza bozulmuyor.
 */
export default function Footer({ content }: SectionProps) {
  const { name, logoUrl, socialLinks, t } = content;
  const year = new Date().getFullYear();
  const coords = placeStamp(content);

  return (
    <footer className={surface}>
      <div className={`${shell} pt-20 pb-16 text-center sm:pt-24`}>
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt=""
            aria-hidden="true"
            width={96}
            height={96}
            className="mx-auto size-14 object-contain sm:size-16"
          />
        ) : null}

        <p className="bo-serif mt-6 text-[clamp(0.9375rem,1.6vw,1.25rem)] tracking-[0.16em] uppercase">
          <Latin>{name}</Latin>
        </p>

        {socialLinks.length > 0 ? (
          <>
            <h2 id="social-title" className="sr-only">
              {t.social.title}
            </h2>
            <nav aria-labelledby="social-title" className="mt-8">
              <ul className="flex flex-wrap items-center justify-center gap-3">
                {socialLinks.map((link) => (
                  <li key={`${link.platform}-${link.url}`}>
                    {/*
                      IKON + kare cerceve. Tasarimda baska hicbir yerde marka
                      glifi yok, ama sosyal medya baglantisi metin olarak
                      ("INSTAGRAM  FACEBOOK") seride yapisiyor ve tiklanabilir
                      oldugu anlasilmiyordu. Kare cerceve temanin kendi
                      dilinden: ayni hairline, ayni radius.

                      Bilinmeyen bir platform gelirse (panelden yeni bir
                      satir) glif yok demektir; o zaman metne dusuyoruz.
                    */}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      title={link.label}
                      className="brand-frame grid size-11 place-items-center text-[var(--brand-ink-muted)] transition-colors duration-300 hover:border-[var(--brand-ink)] hover:text-[var(--brand-ink)]"
                    >
                      {hasSocialIcon(link.platform) ? (
                        <SocialIcon platform={link.platform} />
                      ) : (
                        <span className="bo-mono brand-eyebrow text-[10px]">
                          {link.label.slice(0, 2)}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        ) : null}

        {/* Ince ayrac — seridin kapanisi. */}
        <div
          aria-hidden="true"
          className="mx-auto mt-12 h-px w-16 bg-[var(--brand-border)]"
        />

        {/*
          Tek satirlik kunye. Ayni harf araligi butun satirda: brand-eyebrow
          kullaniliyor cunku sabit tracking Arapca'da bitisik yaziyi koparir,
          utility Arapca'da araligi sifirliyor.
        */}
        <p className="bo-index-sm brand-eyebrow mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          {coords ? (
            <>
              <span dir="ltr">{coords}</span>
              <span aria-hidden="true">·</span>
            </>
          ) : null}
          <span>© {year}</span>
        </p>
      </div>
    </footer>
  );
}
