import { Fragment } from "react";

import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { hasMenu } from "@/themes/_shared/data";
import { edgeBottom, shell } from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kalin alt kenarlikli ust serit.
 *
 * Tasarimda marka adi da buyuk bir logo degil, kunye seridindeki bir hucre:
 * 12px monospace, buyuk harf, dar harf araligi. Basliktaki agirlik hero'ya
 * birakiliyor; serit sadece bilgi tasiyor.
 *
 * Bolumler icerik bosken kendini basmiyor (About, Menu, Gallery); nav de AYNI
 * kosullari kullaniyor. Yoksa musteri galeri yuklemeden yayina alinca link
 * hicbir yere gitmeyen kirik bir capa olurdu. Galeri icin kosul artik
 * isVisible: musteri bolumu panelden kapattiginda link de gitmeli.
 *
 * Yorumlar/SSS/Konum nav'a EKLENMEDI: serit tek satir kalmali, dort baslik
 * ust siniri. Yeni bolumler sayfa akisinda zaten sirayla geliyor.
 */
export default function Header({ content }: SectionProps) {
  const { name, t } = content;

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
      // ts-fade: tasarimda serit sayfa acilirken yumusakca beliriyor.
      className="ts-fade brand-body bg-[var(--brand-surface)]"
      style={edgeBottom}
    >
      <div
        className={`${shell} flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-[14px]`}
      >
        <a
          href="#hero"
          className="text-[0.75rem] leading-[1.4] font-semibold tracking-[var(--ts-track-brand)] uppercase"
        >
          {name}
        </a>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <nav aria-label={name}>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[var(--ts-label-lg)] leading-[1.4] font-medium tracking-[var(--ts-track-nav)] uppercase">
              {links.map((link, index) => (
                <Fragment key={link.href}>
                  {/* Tasarimdaki egik cizgi ayraci; sadece gorsel. */}
                  {index > 0 ? (
                    <li aria-hidden="true" className="opacity-30">
                      /
                    </li>
                  ) : null}
                  <li>
                    <a
                      href={link.href}
                      className="transition-colors hover:text-[var(--brand-primary)]"
                    >
                      {link.label}
                    </a>
                  </li>
                </Fragment>
              ))}
            </ul>
          </nav>

          {/* Tek dil aciksa secici hic basilmaz. */}
          {content.locales.length > 1 ? (
            <LocaleSwitcher content={content} />
          ) : null}
        </div>
      </div>
    </header>
  );
}
