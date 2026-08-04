import Image from "next/image";
import Link from "next/link";

import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { fill } from "@/i18n";
import { hasMenu, menuHref } from "@/themes/_shared/data";
import { shell, surface } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Serit navigasyonunun tek ogesi.
 *
 * `isRoute`: menu artik ana sayfada bir capa degil, AYRI BIR SAYFA. Capa
 * baglantilari duz <a> kalmali (ayni sayfada kaydirma), sayfa baglantisi ise
 * <Link> olmali — istemci tarafi gecis ve on-yukleme onunla geliyor.
 */
type NavItem = { href: string; label: string; isRoute?: boolean };

function NavLink({ href, label, isRoute }: NavItem) {
  // Hover rengi tema genelinde tanimli (tokens.css); burada yalnizca gecisi var.
  const className = "ya-nav transition-colors";

  return isRoute ? (
    <Link href={href} className={className}>
      {label}
    </Link>
  ) : (
    <a href={href} className={className}>
      {label}
    </a>
  );
}

/**
 * TEK ince serit: solda nav'in yarisi, ORTADA marka adi, sagda nav'in diger
 * yarisi. Tasarimda serit 24px dolgulu tek satir.
 *
 * NEDEN TEK KAT: onceki hali marka + slogan + nav + dil secici = dort kat
 * yuksekligindeydi ve hero kemerini asagi itiyordu. Slogan burada YOK cunku
 * hero'nun tepesindeki italik fisilti satiri zaten o metni tasiyor; ayni cumleyi
 * 100px arayla iki kez gostermek acilisin etkisini dagitiyordu.
 *
 * Marka adi tasarimda header'in TA KENDISI (ortadaki 17px'lik genis harf arali
 * kelime), o yuzden Kirk Yil'in aksine burada kalir.
 */
export default function Header({ content }: SectionProps) {
  const { name, logoUrl, t } = content;

  /*
   * Bolumler icerik bosken kendini basmiyor (About, Menu, Gallery). Nav de ayni
   * kosullari kullanmali; yoksa musteri galeri yuklemeden yayina alinca
   * "Galeri" linki hicbir yere gitmeyen kirik bir capa olurdu.
   *
   * Galeri icin gallery.length DEGIL isVisible("galeri") soruluyor: musteri
   * galeriyi panelden kapatinca bolum gidiyor, link de onunla birlikte gitmeli.
   */
  const links = [
    (content.about || content.openingHours.length > 0) && {
      href: "#hakkimizda",
      label: t.about.title,
    },
    /*
     * Menu artik ayri bir sayfa; kosul yine hasMenu cunku menude urun yoksa
     * hem link hem sayfa (404) olmamali.
     */
    hasMenu(content) && {
      href: menuHref(content),
      label: t.menu.eyebrow,
      isRoute: true,
    },
    content.isVisible("galeri") && {
      href: "#galeri",
      label: t.gallery.eyebrow,
    },
    { href: "#iletisim", label: t.contact.eyebrow },
  ].filter((link): link is NavItem => Boolean(link));

  /*
   * Tasarimda serit iki yana iki linkle simetrik duruyor. Link sayisi musteriye
   * gore degistigi icin liste ikiye BOLUNUYOR; tek sayida linkte fazlalik sola
   * gider (soldan okunan dilde serit basi daha dolu durur).
   */
  const half = Math.ceil(links.length / 2);
  const leadingLinks = links.slice(0, half);
  const trailingLinks = links.slice(half);

  return (
    // ya-fade: tasarimda ust serit sayfa acilir acilmaz yerinde beliriyor.
    <header className={`${surface} brand-body ya-fade`}>
      {/*
        Uc esit kolonlu izgara: marka adinin GERCEKTEN ortada durmasi buna
        bagli. flex + justify-between kullanilsaydi dil secici sag ucu
        sisirdigi icin marka adi sola kayardi.

        Dar ekranda tek kolona duser ve marka adi (order-first) en uste cikar.
      */}
      <nav
        aria-label={name}
        className={`${shell} pe-14 sm:pe-0 grid items-center gap-x-8 gap-y-4 py-6 sm:grid-cols-3`}
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-[1.875rem] gap-y-2 sm:justify-start">
          {leadingLinks.map((link) => (
            <li key={link.href}>
              <NavLink {...link} />
            </li>
          ))}
        </ul>

        <a
          href="#hero"
          className="order-first flex items-center justify-center gap-3 sm:order-none"
        >
          {/* trim(): sadece bosluk iceren bir logo alani next/image'i patlatirdi. */}
          {logoUrl.trim() ? (
            <Image
              src={logoUrl}
              alt={fill(t.hero.logoAlt, { name })}
              width={36}
              height={36}
              className="size-9 object-contain"
            />
          ) : null}
          {/*
            Tasarimda marka adi serif ama KUCUK ve cok genis harf arali
            (17px / .34em); boyutunu degil araligini tasiyor.
          */}
          <span className="brand-display ya-serif-book ya-wordmark text-[1.0625rem] leading-none">
            {name}
          </span>
        </a>

        <div className="flex flex-wrap items-center justify-center gap-x-[1.875rem] gap-y-3 sm:justify-end">
          {trailingLinks.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-[1.875rem] gap-y-2">
              {trailingLinks.map((link) => (
                <li key={link.href}>
                  <NavLink {...link} />
                </li>
              ))}
            </ul>
          ) : null}

          {/* Tek dil aciksa secici hic basilmaz. */}
          {content.locales.length > 1 ? (
            <LocaleSwitcher content={content} />
          ) : null}
        </div>
      </nav>
    </header>
  );
}
