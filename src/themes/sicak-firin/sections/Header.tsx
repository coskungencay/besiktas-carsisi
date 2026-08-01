import Image from "next/image";

import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { fill } from "@/i18n";
import { hasMenu } from "@/themes/_shared/data";
import { CupIcon } from "@/themes/_shared/icons";
import { shell } from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Yumusak ust serit.
 *
 * Alt kenarlik YOK: serit ikincil zemine oturuyor, sayfanin ustunde sicak bir
 * bant birakiyor. Cizgi eklemek bu temanin "kenarliksiz" hissini bozar.
 */
export default function Header({ content }: SectionProps) {
  const { name, logoUrl, t } = content;

  /*
   * Bolumler icerik bosken kendini basmiyor (About, Menu, Gallery). Nav de ayni
   * kosullari kullanmali; yoksa musteri galeri yuklemeden yayina alinca "Galeri"
   * linki hicbir yere gitmeyen kirik bir capa olur.
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
    <header className="brand-body bg-[var(--brand-surface-alt)] text-[var(--brand-ink)]">
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
            <CupIcon className="size-9 text-[var(--brand-primary)]" />
          )}
          <span className="brand-display text-lg sm:text-xl">{name}</span>
        </a>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <nav aria-label={name}>
            <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="brand-rounded block px-3 py-2 text-[var(--brand-ink-muted)] transition-colors hover:bg-[var(--brand-surface)] hover:text-[var(--brand-ink)]"
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
