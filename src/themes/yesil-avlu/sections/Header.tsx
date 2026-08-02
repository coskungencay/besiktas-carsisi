import Image from "next/image";

import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { fill } from "@/i18n";
import { hasMenu } from "@/themes/_shared/data";
import { eyebrow, shell, surface } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kenarliksiz, ortalanmis ust serit: once marka, altinda nav.
 *
 * Bilerek cizgi yok — bu tasarimda bolumleri ayiran sey bosluk, kenarlik degil.
 */
export default function Header({ content }: SectionProps) {
  const { name, logoUrl, tagline, t } = content;

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
    hasMenu(content) && { href: "#menu", label: t.menu.eyebrow },
    content.isVisible("galeri") && {
      href: "#galeri",
      label: t.gallery.eyebrow,
    },
    { href: "#iletisim", label: t.contact.eyebrow },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    // ya-fade: tasarimda ust serit sayfa acilir acilmaz yerinde beliriyor.
    <header className={`${surface} brand-body ya-fade`}>
      <div
        className={`${shell} flex flex-col items-center gap-5 py-6 text-center sm:gap-6 sm:py-7`}
      >
        <a href="#hero" className="flex flex-col items-center gap-3">
          {/* trim(): sadece bosluk iceren bir logo alani next/image'i patlatirdi. */}
          {logoUrl.trim() ? (
            <Image
              src={logoUrl}
              alt={fill(t.hero.logoAlt, { name })}
              width={48}
              height={48}
              className="size-12 object-contain"
            />
          ) : null}
          {/*
            Tasarimda marka adi serif ama BUYUK ve cok genis harf arali
            (17px / .34em); boyutunu degil araligini tasiyor.
          */}
          <span className="brand-display ya-serif-book ya-wordmark text-[1.0625rem] leading-none sm:text-xl">
            {name}
          </span>
          {tagline ? <span className={eyebrow}>{tagline}</span> : null}
        </a>

        <nav aria-label={name}>
          {/* Tasarimdaki nav ritmi: 30px bosluk, 12.5px, .14em. */}
          <ul className="flex flex-wrap items-center justify-center gap-x-[1.875rem] gap-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="ya-nav transition-colors hover:text-[var(--brand-accent)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tek dil aciksa secici hic basilmaz. */}
        {content.locales.length > 1 ? <LocaleSwitcher content={content} /> : null}
      </div>
    </header>
  );
}
