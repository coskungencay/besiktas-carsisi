import Image from "next/image";

import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { fill } from "@/i18n";
import { hasMenu, imageOrFallback } from "@/themes/_shared/data";
import { edgeBottom, pillLine, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Yapisik (sticky degil) ust serit: solda marka bloku, sagda rozet nav.
 *
 * Sticky OLMAMASI bilincli: afis tasariminda ust serit sayfanin bandrolu gibi
 * davranir, kaydirirken icerigin ustunu kapatmaz.
 */
export default function Header({ content }: SectionProps) {
  const { name, logoUrl, t } = content;

  /*
   * Bolumler icerik bosken kendini basmiyor (About, Menu, Gallery). Nav ayni
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
    <header className={`${surface} ${edgeBottom} brand-body`}>
      <div
        className={`${shell} flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-4`}
      >
        <a href="#hero" className="flex items-center gap-3">
          {logoUrl ? (
            <span className="relative size-10 shrink-0">
              <Image
                src={imageOrFallback(logoUrl)}
                alt={fill(t.hero.logoAlt, { name })}
                fill
                sizes="40px"
                className="brand-rounded object-contain"
              />
            </span>
          ) : null}
          <span className="brand-display text-xl leading-none sm:text-2xl">
            {name}
          </span>
        </a>

        <div className="flex flex-wrap items-center gap-2">
          <nav aria-label={name}>
            <ul className="flex flex-wrap items-center gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`${pillLine} transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]`}
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
