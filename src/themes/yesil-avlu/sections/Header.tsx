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
   */
  const links = [
    (content.about || content.openingHours.length > 0) && {
      href: "#hakkimizda",
      label: t.about.title,
    },
    hasMenu(content) && { href: "#menu", label: t.menu.eyebrow },
    content.gallery.length > 0 && { href: "#galeri", label: t.gallery.eyebrow },
    { href: "#iletisim", label: t.contact.eyebrow },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    <header className={`${surface} brand-body`}>
      <div
        className={`${shell} flex flex-col items-center gap-6 py-8 text-center sm:py-10`}
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
          <span className="brand-display text-xl leading-none sm:text-2xl">
            {name}
          </span>
          {tagline ? <span className={eyebrow}>{tagline}</span> : null}
        </a>

        <nav aria-label={name}>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`${eyebrow} transition-colors hover:text-[var(--brand-ink)]`}
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
