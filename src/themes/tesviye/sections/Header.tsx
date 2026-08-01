import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { hasMenu } from "@/themes/_shared/data";
import { edgeBottom, mono, shell } from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kalin alt kenarlikli ust serit: solda marka buyuk harf, sagda koseli
 * parantezli monospace baglantilar.
 *
 * Bolumler icerik bosken kendini basmiyor (About, Menu, Gallery); nav de AYNI
 * kosullari kullaniyor. Yoksa musteri galeri yuklemeden yayina alinca link
 * hicbir yere gitmeyen kirik bir capa olurdu.
 */
export default function Header({ content }: SectionProps) {
  const { name, t } = content;

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
    <header className="brand-body bg-[var(--brand-surface)]" style={edgeBottom}>
      <div
        className={`${shell} flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4`}
      >
        <a
          href="#hero"
          className="brand-display text-lg leading-none uppercase sm:text-xl"
        >
          {name}
        </a>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <nav aria-label={name}>
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`${mono} inline-flex items-center transition-colors hover:text-[var(--brand-primary)]`}
                  >
                    <span aria-hidden="true">{"["}</span>
                    {link.label}
                    <span aria-hidden="true">{"]"}</span>
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
