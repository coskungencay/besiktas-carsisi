import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { hasMenu, hoursRange, menuHref } from "@/themes/_shared/data";
import {
  edgeBottom,
  edgeEnd,
  meta,
  padStrip,
  shell,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kalin alt kenarlikli ust serit — tasarimda TEK satir, dort hucre:
 * marka / semt / calisma durumu / navigasyon. Hucreler 2px dikey cizgilerle
 * ayrilir; serit sayfanin ilk cetvel satiridir.
 *
 * NEDEN semt ve saat BURADA: tasarimda bu iki bilgi ust seritte duruyor,
 * hero'da degil. Onceki turda ikisi hero'nun tepesine ikinci bir serit olarak
 * konmustu; bu hem seridi ikiye katliyor hem de hero'nun dosya numarasiyla
 * baslamasini engelliyordu.
 *
 * Marka adi header'da KALIR: bu tasarimda marka da bir kunye hucresi (12px
 * monospace), hero'nun dev basligiyla yarismiyor.
 *
 * Bolumler icerik bosken kendini basmiyor (About, Menu, Gallery); nav de AYNI
 * kosullari kullaniyor. Yoksa musteri galeri yuklemeden yayina alinca link
 * hicbir yere gitmeyen kirik bir capa olurdu. Galeri icin kosul artik
 * isVisible: musteri bolumu panelden kapattiginda link de gitmeli.
 *
 * Yorumlar/SSS/Konum nav'a EKLENMEDI: serit tek satir kalmali, dort baslik
 * ust siniri. Yeni bolumler sayfa akisinda zaten sirayla geliyor.
 */
export default function Header({ content }: SectionProps) {
  const { name, contact, logoUrl, openingHours, t } = content;

  const range = hoursRange(openingHours);

  /*
   * `isPage`: menu artik bir capa degil, kendi sayfasi (/tr/menu). Sayfa
   * baglantilari <Link> ile basilir (istemci tarafi gecis + on yukleme),
   * ayni sayfadaki capalar duz <a> kalir.
   *
   * Menu kosulu hasMenu OLARAK KALIR: urun yoksa hem link hem sayfa yok.
   */
  const links = [
    (content.about || content.openingHours.length > 0) && {
      href: "#hakkimizda",
      label: t.about.title,
      isPage: false,
    },
    hasMenu(content) && {
      href: menuHref(content),
      label: t.menu.eyebrow,
      isPage: true,
    },
    content.isVisible("galeri") && {
      href: "#galeri",
      label: t.gallery.eyebrow,
      isPage: false,
    },
    { href: "#iletisim", label: t.contact.eyebrow, isPage: false },
  ].filter(
    (link): link is { href: string; label: string; isPage: boolean } =>
      Boolean(link),
  );

  // Iki baglanti bicimi de ayni gorunmeli; sinif tek yerde.
  const navLink = "transition-colors hover:text-[var(--brand-primary)]";

  return (
    <header
      // ts-fade: tasarimda serit sayfa acilirken yumusakca beliriyor.
      className="ts-fade brand-body bg-[var(--brand-surface)]"
    >
      <div
        className={`${shell} pe-14 sm:pe-0 flex flex-wrap items-stretch`}
        style={edgeBottom}
      >
        {/*
          Marka hucresi: 12px / 600 / ls .06em — hero'dan yarim ton geride.

          lg:flex-1: tasarimda serit dort hucre ve ilk uc hucre esit paylarda
          (minmax(0,1fr) x3), nav ise icerigi kadar. Hucreleri iceriklerine
          birakinca uc dikey cizgi soldaki ilk 300px'e sikisiyor, seridin geri
          kalani bos bir alan olarak kaliyordu. Genisleme sadece lg ustunde:
          altinda hucreler alt alta sariyor ve esitleme anlamsiz.
        */}
        <a
          href="#hero"
          className={`${padStrip} flex items-center gap-2.5 text-[length:var(--ts-meta)] leading-[1.5] font-semibold tracking-[var(--ts-track-brand)] uppercase transition-colors hover:text-[var(--brand-primary)] lg:flex-1`}
          style={edgeEnd}
        >
          {/*
            Logo marka hucresinin basinda, KARE: bu temada yuvarlak hicbir sey
            yok. Tasarimda logo bulunmadigi icin yuklenmemisse hic basilmaz ve
            serit tasarimdaki haline birebir doner.
          */}
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={20}
              height={20}
              className="size-5 shrink-0 object-contain"
            />
          ) : null}
          {name}
        </a>

        {contact.locality ? (
          <p
            className={`${meta} ${padStrip} flex items-center lg:flex-1`}
            style={edgeEnd}
          >
            {contact.locality}
          </p>
        ) : null}

        {range ? (
          <p
            className={`${meta} ${padStrip} flex items-center gap-2 lg:flex-1`}
            style={edgeEnd}
          >
            {/* Tasarimdaki "acik" gostergesi: yaniyor-sonuyor kare. */}
            <span
              className="ts-blink size-2 shrink-0 bg-[var(--brand-primary)]"
              aria-hidden="true"
            />
            <span>
              {t.hours.label}
              {" · "}
              <span className="tabular-nums" dir="ltr">
                {range}
              </span>
            </span>
          </p>
        ) : null}

        {/* ms-auto: nav tasarimdaki gibi seridin sonuna yaslanir. */}
        <div
          className={`${padStrip} ms-auto flex flex-wrap items-center gap-x-5 gap-y-3`}
        >
          <nav aria-label={name}>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[length:var(--ts-label-lg)] leading-[1.4] font-medium tracking-[var(--ts-track-nav)] uppercase">
              {links.map((link, index) => (
                <Fragment key={link.href}>
                  {/* Tasarimdaki egik cizgi ayraci; sadece gorsel. */}
                  {index > 0 ? (
                    <li aria-hidden="true" className="opacity-30">
                      /
                    </li>
                  ) : null}
                  <li>
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
                </Fragment>
              ))}
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
