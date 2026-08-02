import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { hasMenu } from "@/themes/_shared/data";
import { metaMuted, shell, surface } from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Otel lobisi seridi. Tasarimda marka adi ORTADA duruyor: iki yanindaki
 * 1fr kolonlar onu optik olarak ortalar (nav ne kadar uzarsa uzasin).
 * Yukseklik tasarimdaki 30px dikey bosluktan geliyor.
 *
 * Alt kenarda saydam altin bir cizgi var — bu yuzden border yerine ayri bir
 * mutlak konumlu cizgi kullanildi; border-color'a opaklik verilemiyor.
 *
 * vl-fade: acilista yalnizca opaklik degisir. Serit kaymasin diye bilerek
 * translate YOK; ust seritte hareket goz yorar.
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
    // isVisible: musteri galeriyi panelden kapatinca link de gitmeli.
    content.isVisible("galeri") && {
      href: "#galeri",
      label: t.gallery.eyebrow,
    },
    { href: "#iletisim", label: t.contact.eyebrow },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    <header className={`${surface} vl-fade relative brand-body`}>
      <div
        className={`${shell} flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-[1.875rem] lg:grid lg:grid-cols-[1fr_auto_1fr]`}
      >
        <nav aria-label={name} className="order-2 lg:order-none">
          {/* Nav ogeleri arasi 34px — tasarimdaki deger. */}
          <ul className="flex flex-wrap items-center justify-center gap-x-[2.125rem] gap-y-2 lg:justify-start">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`${metaMuted} transition-colors hover:text-[var(--brand-primary)]`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/*
         * Marka adi: 24px Bodoni, .44em harf araligi.
         * ps-[...] son harften sonra kalan bosluk kadar bastan bosluk ekler;
         * yoksa cok genis aralikli yazi optik olarak sola kacar.
         */}
        <a
          href="#hero"
          className="order-1 w-full text-center uppercase brand-display text-2xl leading-none tracking-[var(--brand-wordmark-tracking)] ps-[var(--brand-wordmark-tracking)] lg:order-none lg:w-auto"
        >
          {name}
        </a>

        {/* Tek dil aciksa secici hic basilmaz. */}
        {content.locales.length > 1 ? (
          <div className="order-3 flex items-center justify-center lg:order-none lg:justify-end">
            <LocaleSwitcher content={content} />
          </div>
        ) : (
          <div aria-hidden="true" className="order-3 hidden lg:block" />
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-[var(--brand-primary)] opacity-30"
      />
    </header>
  );
}
