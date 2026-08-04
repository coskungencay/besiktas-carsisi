import Image from "next/image";
import Link from "next/link";

import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { fill } from "@/i18n";
import { hasMenu, hoursRange, menuHref } from "@/themes/_shared/data";
import { shell } from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/** `page`: ayri bir sayfaya gider (capa degil). */
type NavLink = { href: string; label: string; page?: boolean };

/** Serit baglantisi — capa ve sayfa baglantisinda ayni gorunum. */
const navLink =
  "block text-[var(--brand-nav-ink)] transition-colors hover:text-[var(--brand-accent)]";

/**
 * Ince ust serit — TEK satir, UC parca: marka · nav · acilis saati.
 *
 * Tasarimda serit sayfa zemininin uzerinde duruyor ve altinda TEK bir kesik
 * cizgi var — dolgulu bir bant degil. Kesik cizgi bu temanin tek ayrac turu;
 * duz cizgi kullanmak mahalle firininin el yapimi hissini soguturdu.
 *
 * Marka adi tasarimda header'DA: hero'daki dev baslik isletme adi degil, bir
 * cumle ("Mahallenin firini, bir de kahvesi"). Yani ad iki kez gorunmuyor.
 *
 * Seridin sag ucu tasarimda "Sabah 06:00'da firin yanar" — yani ne zaman acik
 * oldugumuz. Bizde bunun karsiligi calisma saatlerinden uretilen aralik.
 *
 * sf-fade: acilista serit sayfayla birlikte belirir (CSS, JS beklemez).
 */
export default function Header({ content }: SectionProps) {
  const { name, logoUrl, openingHours, t } = content;

  // Saat girilmemisse sag uc hic basilmaz; bos bir sutun serit dengesini bozar.
  const range = hoursRange(openingHours);
  const showLocales = content.locales.length > 1;

  /*
   * Bolumler icerik bosken kendini basmiyor (About, Menu, Gallery). Nav de ayni
   * kosullari kullanmali; yoksa musteri galeri yuklemeden yayina alinca "Galeri"
   * linki hicbir yere gitmeyen kirik bir capa olur.
   *
   * Galeri icin gallery.length yerine isVisible("galeri") soruluyor: musteri
   * bolumu panelden kapattiginda gorseller dururken bolum basilmiyor, link de
   * onunla birlikte gitmeli.
   *
   * Yeni bolumler (yorumlar, sss, konum) nav'a EKLENMEDI: serit tasarimda dort
   * baglantiyla dengede duruyor, yedi baglantı ikinci satira tasip ust seridi
   * kalinlastirirdi.
   *
   * Menu artik sayfa ici capa DEGIL, kendi sayfasi (page: true). Kosul yine
   * hasMenu: urun yoksa ne link ne de sayfa olmali.
   */
  const links: NavLink[] = [
    // Hakkimizda seridi hikaye ya da fotograf varsa basiliyor; ikisi de yoksa
    // link hicbir yere gitmeyen kirik bir capa olurdu.
    (content.about || content.isVisible("galeri")) && {
      href: "#hakkimizda",
      label: t.about.title,
    },
    hasMenu(content) && {
      href: menuHref(content),
      label: t.menu.eyebrow,
      page: true,
    },
    content.isVisible("galeri") && {
      href: "#galeri",
      label: t.gallery.eyebrow,
    },
    { href: "#iletisim", label: t.contact.eyebrow },
  ].filter((link): link is NavLink => Boolean(link));

  return (
    <header
      className="sf-fade brand-body border-b border-dashed border-[var(--brand-hairline)] bg-[var(--brand-surface)] text-[var(--brand-ink)]"
    >
      <div
        className={`${shell} pe-14 sm:pe-0 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-5`}
      >
        {/*
          Marka blogu tasarimda YALIN yazi: 20px slab, sonunda vurgu noktasi.
          Logo yuklenmediginde ikona dusmuyoruz — tasarimda hicbir ikon yok ve
          fincan rozeti seridi kalinlastirip yaziyi ikinci plana atiyordu.
        */}
        <a href="#hero" className="flex items-center gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={fill(t.hero.logoAlt, { name })}
              width={44}
              height={44}
              className="brand-rounded size-11 object-cover"
            />
          ) : null}
          <span className="brand-display text-xl font-semibold tracking-[-0.01em]">
            {name}
            {/* Tasarimin imzasi: marka adinin sonundaki vurgu noktasi. Icerik
                degil susleme oldugu icin ekran okuyucudan gizli. */}
            <span aria-hidden="true" className="text-[var(--brand-accent)]">
              .
            </span>
          </span>
        </a>

        {/* Tasarimda nav seridin ORTASINDA, iki ucun arasinda duruyor. */}
        <nav aria-label={name}>
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[length:var(--brand-text-nav)]">
            {links.map((link) => (
              <li key={link.href}>
                {/*
                  Ayri sayfaya giden baglanti <Link> (istemci tarafi gecis);
                  sayfa ici capalar duz <a> kalir — capa icin Link'in yonlendirme
                  makinesini calistirmanin bir faydasi yok.
                */}
                {link.page ? (
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
          </ul>
        </nav>

        {/*
          Sag uc. Ikisi de yoksa bu kutu hic basilmaz: bos bir esnek kutu
          nav'i seridin sagina yapistiriyordu.
        */}
        {range || showLocales ? (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {/* Dar ekranda gizli: serit zaten marka + nav ile iki satira
                cikiyor, ucuncu bilgi onu tasarimdaki ince cizgi olmaktan
                cikarip bir blogu cevirirdi. */}
            {range ? (
              <p className="hidden text-[length:var(--brand-text-nav)] text-[var(--brand-ink-muted)] md:block">
                {t.hours.label}{" "}
                <span dir="ltr" className="tabular-nums">
                  {range}
                </span>
              </p>
            ) : null}

            {/* Tek dil aciksa secici hic basilmaz. */}
            {showLocales ? <LocaleSwitcher content={content} /> : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
