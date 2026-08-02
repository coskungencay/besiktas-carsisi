import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { placeStamp, hasMenu } from "@/themes/_shared/data";
import { hasAboutSection, shell, surface } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ince ust serit: solda marka, ortada koordinat, sagda bolum baglantilari.
 * Tasarimda 12 kolonluk izgara (4/4/4), 28px dikey bosluk, acilista boFade.
 *
 * Koordinat ayri bir DB alani DEGIL — panelde girilen enlem/boylamdan turetilir.
 * Girilmemisse orta sutun bos kalir, duzen bozulmaz.
 */
export default function Header({ content }: SectionProps) {
  const { name, t } = content;
  const coords = placeStamp(content);

  /*
   * Bolumler icerik bosken kendini basmiyor (About, Menu, Gallery). Nav de
   * ayni kosullari kullanmali; yoksa musteri henuz galeri yuklemeden siteyi
   * yayina alinca "Galeri" linki hicbir yere gitmeyen kirik bir capa olurdu.
   */
  const links = [
    hasAboutSection(content) && {
      href: "#hakkimizda",
      label: t.about.title,
    },
    hasMenu(content) && { href: "#menu", label: t.menu.eyebrow },
    /*
     * Galeri icin isVisible: musteri bolumu panelden kapattiginda link de
     * gitmeli, yoksa hicbir yere gitmeyen bir capa kalir.
     */
    content.isVisible("galeri") && {
      href: "#galeri",
      label: t.gallery.eyebrow,
    },
    { href: "#iletisim", label: t.contact.eyebrow },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    <header
      className={`${surface} bo-fade border-b border-[var(--brand-border)]`}
    >
      <div
        className={`${shell} pe-14 sm:pe-0 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-[28px] lg:grid lg:grid-cols-12 lg:gap-6`}
      >
        <a
          href="#hero"
          /*
            Tasarimda marka bir <div>, bizde hero'ya giden bir baglanti. Global
            "a:hover { color:#46606E }" kurali orada her baglantiyi kapsadigi
            icin vurgu rengi burada da EL ILE veriliyor; yoksa sayfadaki tek
            hover'siz baglanti bu olurdu.
          */
          className="brand-display text-[13px] font-medium tracking-[0.02em] transition-colors hover:text-[var(--brand-accent)] lg:col-span-4"
        >
          {name}
        </a>

        {coords ? (
          <p
            /*
              Koordinat tasarimda bolum indekslerinden (#A2A7AC) bir kademe
              KOYU (#8A8F94); ust seritte marka ile nav arasinda kaybolmasin
              diye. Karsiligi --brand-ink-dim.
            */
            className="bo-mono order-3 w-full font-light text-[11px] tracking-[0.02em] text-[var(--brand-ink-dim)] sm:order-none sm:w-auto lg:col-span-4"
            dir="ltr"
          >
            {coords}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-x-[26px] gap-y-3 lg:col-span-4 lg:col-start-9">
          <nav aria-label={name}>
            <ul className="flex flex-wrap items-center gap-x-[26px] gap-y-2 text-[12.5px] text-[var(--brand-ink-muted)]">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="underline-offset-4 transition-colors hover:text-[var(--brand-accent)]"
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
