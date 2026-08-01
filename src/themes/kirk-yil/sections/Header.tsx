import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { hasMenu } from "@/themes/_shared/data";
import { DoubleRule, meta, shell, surface } from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tabela serit: ustte cift cizgi, ortada marka adi, altta ortalanmis nav.
 *
 * Her sey ortada; bu temada hiclbir ust seviye ogesi kenara yaslanmaz — eski
 * kahvehane tabelalarinin simetrisi tasarimin ilk izlenimi.
 */
export default function Header({ content }: SectionProps) {
  const { name, tagline, t } = content;

  /*
   * Bolumler icerik bosken kendini basmiyor; nav de AYNI kosullari kullanmali,
   * yoksa musteri galeri yuklemeden yayina alinca "Galeri" linki hicbir yere
   * gitmeyen kirik bir capa olur.
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
      <div className={shell}>
        <DoubleRule className="mt-4" />

        <div className="py-7 text-center sm:py-9">
          <a
            href="#hero"
            className="brand-display brand-eyebrow text-lg text-[var(--brand-primary)] transition-opacity hover:opacity-75 sm:text-xl"
          >
            {name}
          </a>

          {tagline ? <p className={`${meta} mt-3`}>{tagline}</p> : null}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-[var(--brand-border)] py-4">
          <nav aria-label={name}>
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="brand-eyebrow text-xs underline-offset-[6px] transition-colors hover:text-[var(--brand-primary)] hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tek dil aciksa secici hic basilmaz. */}
          {content.locales.length > 1 ? (
            <LocaleSwitcher content={content} />
          ) : null}
        </div>

        <div
          aria-hidden="true"
          className="border-t border-[var(--brand-border)]"
        />
      </div>
    </header>
  );
}
