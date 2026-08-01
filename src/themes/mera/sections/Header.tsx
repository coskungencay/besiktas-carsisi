import Image from "next/image";

import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { fill } from "@/i18n";
import { coordinateLabel, hasMenu } from "@/themes/_shared/data";
import { label, page, surface } from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dergi kapagi mastheadi: en ustte ince kunye seridi (yer + dil),
 * ortada buyuk serif marka adi, altinda ortalanmis ince nav satiri.
 *
 * Nav linkleri, bolumlerin kendi "bos ise null don" kosullariyla AYNI
 * kosula bagli; yoksa musteri galeri yuklemeden yayina alinca "Galeri"
 * linki hicbir yere gitmeyen kirik bir capa olurdu.
 */
export default function Header({ content }: SectionProps) {
  const { name, tagline, logoUrl, contact, t } = content;

  const strap = contact.locality || coordinateLabel(contact.lat, contact.lng);
  // Serit ne yer bilgisi ne de dil secici tasiyorsa hic basilmaz; yoksa
  // sayfanin tepesinde bos ama cizgili bir bant kalirdi.
  const hasStrapRow = Boolean(strap) || content.locales.length > 1;

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
      {hasStrapRow ? (
        <div
          className={`${page} flex items-center gap-4 border-b border-[var(--brand-border)] py-3`}
        >
          {strap ? <p className={label}>{strap}</p> : null}
          {/* Tek dil aciksa LocaleSwitcher zaten null doner. */}
          <div className="ms-auto">
            <LocaleSwitcher content={content} />
          </div>
        </div>
      ) : null}

      <div className={`${page} py-9 text-center sm:py-12`}>
        {/* Logo yoksa hic basilmaz: bu tasarimda marka adi zaten mastheadin
            kendisi, yer tutucu bir isaret duzeni bozar. */}
        {logoUrl.trim() ? (
          <Image
            src={logoUrl}
            alt={fill(t.hero.logoAlt, { name })}
            width={160}
            height={56}
            priority
            className="mx-auto mb-5 h-10 w-auto object-contain"
          />
        ) : null}

        <a
          href="#hero"
          className="brand-display block text-[clamp(1.9rem,6vw,3.25rem)] leading-none tracking-[-0.01em] text-balance"
        >
          {name}
        </a>

        {tagline ? <p className={`${label} mt-5`}>{tagline}</p> : null}
      </div>

      <nav
        aria-label={name}
        className="border-t border-b border-[var(--brand-border)]"
      >
        <ul
          className={`${page} flex flex-wrap items-center justify-center gap-x-9 gap-y-2 py-3.5`}
        >
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`${label} underline-offset-[6px] transition-colors hover:text-[var(--brand-primary)] hover:underline`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
