import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { coordinateLabel, hasMenu } from "@/themes/_shared/data";
import { meta, shell, surface } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ince ust serit: solda marka, ortada koordinat, sagda bolum baglantilari.
 *
 * Koordinat ayri bir DB alani DEGIL — panelde girilen enlem/boylamdan turetilir.
 * Girilmemisse orta sutun bos kalir, duzen bozulmaz.
 */
export default function Header({ content }: SectionProps) {
  const { name, contact, t } = content;
  const coords = coordinateLabel(contact.lat, contact.lng);

  /*
   * Bolumler icerik bosken kendini basmiyor (About, Menu, Gallery). Nav de
   * ayni kosullari kullanmali; yoksa musteri henuz galeri yuklemeden siteyi
   * yayina alinca "Galeri" linki hicbir yere gitmeyen kirik bir capa olurdu.
   */
  const links = [
    (content.about || content.openingHours.length > 0) && {
      href: "#hakkimizda",
      label: t.about.title,
    },
    hasMenu(content) && { href: "#menu", label: t.menu.eyebrow },
    content.gallery.length > 0 && {
      href: "#galeri",
      label: t.gallery.eyebrow,
    },
    { href: "#iletisim", label: t.contact.eyebrow },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    <header
      className={`${surface} border-b border-[var(--brand-border)] brand-body`}
    >
      <div
        className={`${shell} flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5`}
      >
        <a
          href="#hero"
          className="brand-display text-base font-medium tracking-tight"
        >
          {name}
        </a>

        {coords ? (
          <p className={`${meta} order-3 w-full sm:order-none sm:w-auto`} dir="ltr">
            {coords}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <nav aria-label={name}>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="underline-offset-4 transition-colors hover:text-[var(--brand-ink-muted)] hover:underline"
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
