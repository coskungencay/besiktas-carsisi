import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { hasMenu } from "@/themes/_shared/data";
import { metaSoft, shell } from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ust serit. Tasarimda bu serit AYRI BIR BANT DEGIL: hero fotografinin
 * uzerinde duruyor (position:relative, zemin yok, alt cizgi yok) ve marka adi
 * fotografin ortasina oturuyor. Koyu dolu bir serit + altin ayrac koymak
 * tasarimin en gosterisli hamlesini — tabelanin fotograf uzerinde durmasini —
 * yok ediyordu.
 *
 * Nav ISE IKI PARCA: marka adinin solunda ve saginda esit birer 1fr kolon.
 * Boylece isim, nav ne kadar uzarsa uzasin optik olarak ortada kalir.
 *
 * Zemin YOK: kucuk ekranlarda serit hero'nun uzerine cikmadigi icin arkasinda
 * sayfa zemini (--brand-surface) gorunur, yani gorunum yine tasarimdaki gibi
 * koyu kalir. lg'de Hero kendini bu seridin altina cekiyor (bkz. Hero.tsx).
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
    // Saatler artik iletisim bolumunde; "hakkimizda" sadece metne bagli.
    content.about && { href: "#hakkimizda", label: t.about.title },
    hasMenu(content) && { href: "#menu", label: t.menu.eyebrow },
    // isVisible: musteri galeriyi panelden kapatinca link de gitmeli.
    content.isVisible("galeri") && {
      href: "#galeri",
      label: t.gallery.eyebrow,
    },
    { href: "#iletisim", label: t.contact.eyebrow },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  /*
   * Baglantilar ikiye bolunuyor. Tek sayida link varsa fazlalik SOLA gidiyor:
   * sagda dil secici de durdugu icin denge boyle kuruluyor.
   */
  const split = Math.ceil(links.length / 2);
  const leadingLinks = links.slice(0, split);
  const trailingLinks = links.slice(split);

  const navItem = (link: { href: string; label: string }) => (
    <li key={link.href}>
      <a
        href={link.href}
        className={`${metaSoft} transition-colors hover:text-[var(--brand-primary)]`}
      >
        {link.label}
      </a>
    </li>
  );

  return (
    <header className="vl-fade relative z-20 brand-body">
      {/*
       * Tek bir nav landmark: iki liste de ayni gezinmenin parcasi. Ikiye
       * ayri <nav> koymak ekran okuyucuda ayni adla iki landmark uretirdi.
       */}
      <nav
        aria-label={name}
        className={`${shell} pe-14 sm:pe-0 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-[1.875rem] lg:grid lg:grid-cols-[1fr_auto_1fr]`}
      >
        {/* Nav ogeleri arasi 34px — tasarimdaki deger. */}
        <ul className="order-2 flex flex-wrap items-center justify-center gap-x-[2.125rem] gap-y-2 lg:order-none lg:justify-start">
          {leadingLinks.map(navItem)}
        </ul>

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

        <div className="order-3 flex flex-wrap items-center justify-center gap-x-[2.125rem] gap-y-2 lg:justify-end">
          {trailingLinks.length > 0 ? (
            <ul className="flex flex-wrap items-center justify-center gap-x-[2.125rem] gap-y-2">
              {trailingLinks.map(navItem)}
            </ul>
          ) : null}

          {/* Tek dil aciksa secici hic basilmaz. */}
          {content.locales.length > 1 ? (
            <LocaleSwitcher content={content} />
          ) : null}
        </div>
      </nav>
    </header>
  );
}
