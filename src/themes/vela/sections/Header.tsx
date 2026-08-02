import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { hasMenu } from "@/themes/_shared/data";
import { labelInk, shell, surface } from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Otel lobisi seridi: cok ince, solda genis harf arali marka, sagda kucuk nav.
 * Alt kenarda saydam altin bir cizgi var — bu yuzden border yerine ayri bir
 * mutlak konumlu cizgi kullanildi; border-color'a opaklik verilemiyor.
 */
export default function Header({ content }: SectionProps) {
  const { name, t } = content;

  /*
   * Bos icerikli bolumler kendini basmiyor; nav ayni kosullari tekrarlamali,
   * yoksa musteri galeri yuklemeden yayina alinca link hicbir yere gitmez.
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
    <header className={`${surface} relative brand-body`}>
      <div
        className={`${shell} flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-6`}
      >
        <a href="#hero" className={labelInk}>
          {name}
        </a>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <nav aria-label={name}>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="brand-eyebrow text-[0.625rem] text-[var(--brand-ink-muted)] transition-colors hover:text-[var(--brand-primary)]"
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

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-[var(--brand-primary)] opacity-30"
      />
    </header>
  );
}
