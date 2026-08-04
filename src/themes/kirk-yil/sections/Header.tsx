import Image from "next/image";
import Link from "next/link";

import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { hasMenu, menuHref } from "@/themes/_shared/data";
import { shell, surface } from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * TEK ince serit: solda kurulus/semt, ortada nav, sagda telefon.
 *
 * NEDEN MARKA ADI YOK: tasarimda isletme adi hero'nun kendisi — 132px'lik dev
 * baslik. Adi bir de header'a koymak ayni kelimeyi 100px arayla iki kez
 * gosteriyor ve tabelanin etkisini dagitiyordu. Onceki hali uc kat yuksekti
 * (marka + slogan + nav); tasarimda serit 16px dolgulu tek satir.
 *
 * Alt kenarlik cift cizgi (3px double) — tasarimin imzasi.
 */
export default function Header({ content }: SectionProps) {
  const { name, contact, logoUrl, t } = content;

  /*
   * Capalar dile ait ANA SAYFA yolu ile birlikte yaziliyor.
   *
   * NEDEN: bu serit artik iki sayfada birden basiliyor (ana sayfa ve /menu).
   * Ciplak "#hakkimizda" menu sayfasinda hicbir yere gitmezdi. next/link ayni
   * rotada kalindiginda yeniden yukleme yapmadan bolume kaydirir, menu
   * sayfasindan tiklandiginda once ana sayfaya gecer.
   */
  const home = `/${content.locale}`;

  /*
   * Bolumler icerik bosken kendini basmiyor; nav de AYNI kosullari kullanmali,
   * yoksa musteri galeri yuklemeden yayina alinca "Galeri" linki hicbir yere
   * gitmeyen kirik bir capa olur. Menu icin kosul hasMenu: urun yoksa hem
   * link hem sayfa olmamali (menu sayfasi da 404 doner).
   */
  const links = [
    (content.about || content.openingHours.length > 0) && {
      href: `${home}#hakkimizda`,
      label: t.about.title,
    },
    hasMenu(content) && { href: menuHref(content), label: t.menu.eyebrow },
    content.isVisible("galeri") && {
      href: `${home}#galeri`,
      label: t.gallery.eyebrow,
    },
    { href: `${home}#iletisim`, label: t.contact.eyebrow },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    // ky-fade: tasarimda serit sayfayla birlikte usulca beliriyor.
    <header
      /*
        Cift cizgi rengi tasarimda mürekkebin %32 opakligi; --brand-border
        (#D3C4A8) bunun yaninda belirgin sekilde soluk kaliyor ve serit
        sayfadan ayrilmiyordu. color-mix ile token'a dokunmadan tasarimdaki
        tonu uretiyoruz.
      */
      className={`${surface} brand-body ky-fade border-b-[3px] border-double border-[color-mix(in_srgb,var(--brand-ink)_32%,transparent)]`}
    >
      <div
        className={`${shell} pe-14 sm:pe-0 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4`}
      >
        {/*
          Sol uc: tasarimda "Est. 1986 · Beyoglu". Bizde kurulus yili diye bir
          alan yok; semt/sehir ayni islevi goruyor (nerede oldugumuz), yoksa
          slogana duseriz.
        */}
        {/*
          Bu seritte marka ADI yok — tasarimda marka hero'daki dev tabelada
          duruyor. Logo yuklendiyse serit'in sol ucune, kunye yazisinin onune
          kucuk bir isaret olarak giriyor; yuklenmemisse satir tasarimdaki
          haliyle tek basina kaliyor.
        */}
        <span className="ky-strip flex items-center gap-2.5 text-[var(--brand-ink-muted)]">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={22}
              height={22}
              className="size-[22px] shrink-0 object-contain"
            />
          ) : null}
          {contact.locality || content.tagline}
        </span>

        <nav aria-label={name}>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="ky-strip text-[var(--brand-primary)] underline-offset-[6px] transition-colors hover:text-[var(--brand-accent)] hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {/* Sag uc: tasarimda telefon numarasi. Girilmemisse hic basilmaz. */}
          {contact.phone ? (
            <a
              href={contact.phoneHref}
              dir="ltr"
              className="ky-strip text-[var(--brand-ink-muted)] transition-colors hover:text-[var(--brand-primary)]"
            >
              {contact.phone}
            </a>
          ) : null}

          {/* Tek dil aciksa secici hic basilmaz. */}
          {content.locales.length > 1 ? (
            <LocaleSwitcher content={content} />
          ) : null}
        </div>
      </div>
    </header>
  );
}
