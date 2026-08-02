import Image from "next/image";
import Link from "next/link";

import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { fill } from "@/i18n";
import { hasMenu, imageOrFallback, menuHref } from "@/themes/_shared/data";
import {
  edgeBottom,
  navCta,
  navLink,
  shell,
  surface,
} from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ust serit: solda marka bloku, sagda rozet nav.
 *
 * Yapiskan (sticky) ve kendi zeminini tasiyor — tasarimda serit sayfanin
 * bandrolu gibi hep tepede duruyor; koyu zemin olmadan altindan gecen icerik
 * linklerin arasindan gorunurdu.
 */
export default function Header({ content }: SectionProps) {
  const { name, logoUrl, t } = content;

  /*
   * Bolumler icerik bosken kendini basmiyor (About, Menu, Gallery). Nav ayni
   * kosullari kullanmali; yoksa musteri galeri yuklemeden yayina alinca
   * "Galeri" linki hicbir yere gitmeyen kirik bir capa olurdu.
   *
   * Galeri icin `gallery.length` DEGIL isVisible("galeri") soruluyor: musteri
   * galeriyi panelden kapattiginda gorseller duruyor ama bolum basilmiyor;
   * eski kosul o durumda yine kirik bir link birakirdi.
   *
   * Yeni bolumlere (yorumlar, sss, konum) BILEREK link yok: tasarimda serit tek
   * satir ve dolu; sekiz rozet dar ekranda ikinci satira tasip bandrolu bozardi.
   */
  /*
   * `isPage`: menu artik bir capa degil, kendi adresi olan bir SAYFA. Capalar
   * duz <a> ile kaliyor (ayni sayfada kaydirma), sayfa baglantisi next/link
   * ile basiliyor — yoksa tam sayfa yenilemesi olurdu.
   */
  const links = [
    /* About artik yalnizca METIN varsa basiliyor (saatler iletisime tasindi). */
    content.about && {
      href: "#hakkimizda",
      label: t.about.title,
    },
    /* Kosul AYNI kaliyor: urun yoksa menu sayfasi da 404, link de olmamali. */
    hasMenu(content) && {
      href: menuHref(content),
      label: t.menu.eyebrow,
      isPage: true,
    },
    content.isVisible("galeri") && {
      href: "#galeri",
      label: t.gallery.eyebrow,
    },
  ].filter(
    (link): link is { href: string; label: string; isPage?: boolean } =>
      Boolean(link),
  );

  return (
    <header className={`${surface} ${edgeBottom} brand-body sticky top-0 z-20`}>
      <div
        className={`${shell} pe-14 sm:pe-0 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5`}
      >
        <a href="#hero" className="flex items-center gap-3">
          {logoUrl ? (
            <span className="relative size-10 shrink-0">
              <Image
                src={imageOrFallback(logoUrl)}
                alt={fill(t.hero.logoAlt, { name })}
                fill
                sizes="40px"
                className="rounded-[var(--brand-radius-media)] object-contain"
              />
            </span>
          ) : null}

          {/*
            Marka adi 22px, sikilastirilmis aralikla ve buyuk harf — tasarimdaki
            logotip. Sonundaki neon nokta dekoratif: ekran okuyucu okumasin.
          */}
          <span className="brand-display text-[1.375rem] leading-none tracking-[var(--brand-title-tracking)] uppercase">
            {name}
            <span aria-hidden="true" className="text-[var(--brand-primary)]">
              .
            </span>
          </span>
        </a>

        <div className="flex flex-wrap items-center gap-2">
          <nav aria-label={name}>
            <ul className="flex flex-wrap items-center gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  {link.isPage ? (
                    <Link href={link.href} className={navLink}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className={navLink}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}

              {/* Iletisim her zaman var ve tasarimda dolu (neon) cagri butonu. */}
              <li>
                <a href="#iletisim" className={navCta}>
                  {t.contact.eyebrow}
                </a>
              </li>
            </ul>
          </nav>

          {/* Tek dil aciksa secici hic basilmaz. */}
          {content.locales.length > 1 ? (
            <LocaleSwitcher content={content} />
          ) : null}
        </div>
      </div>
    </header>
  );
}
