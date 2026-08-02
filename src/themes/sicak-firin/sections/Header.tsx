import Image from "next/image";

import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { fill } from "@/i18n";
import { hasMenu } from "@/themes/_shared/data";
import { CupIcon } from "@/themes/_shared/icons";
import { shell } from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ince ust serit.
 *
 * Tasarimda serit sayfa zemininin uzerinde duruyor ve altinda TEK bir kesik
 * cizgi var — dolgulu bir bant degil. Kesik cizgi bu temanin tek ayrac turu;
 * duz cizgi kullanmak mahalle firininin el yapimi hissini soguturdu.
 *
 * sf-fade: acilista serit sayfayla birlikte belirir (CSS, JS beklemez).
 */
export default function Header({ content }: SectionProps) {
  const { name, logoUrl, t } = content;

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
    <header
      className="sf-fade brand-body border-b border-dashed border-[var(--brand-hairline)] bg-[var(--brand-surface)] text-[var(--brand-ink)]"
    >
      <div
        className={`${shell} flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-5`}
      >
        <a href="#hero" className="flex items-center gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={fill(t.hero.logoAlt, { name })}
              width={44}
              height={44}
              className="brand-rounded size-11 object-cover"
            />
          ) : (
            <CupIcon className="size-8 text-[var(--brand-primary)]" />
          )}
          <span className="brand-display text-xl font-semibold tracking-[-0.01em]">
            {name}
            {/* Tasarimin imzasi: marka adinin sonundaki vurgu noktasi. Icerik
                degil susleme oldugu icin ekran okuyucudan gizli. */}
            <span aria-hidden="true" className="text-[var(--brand-accent)]">
              .
            </span>
          </span>
        </a>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          <nav aria-label={name}>
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[length:var(--brand-text-nav)]">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block text-[var(--brand-nav-ink)] transition-colors hover:text-[var(--brand-accent)]"
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
      </div>
    </header>
  );
}
