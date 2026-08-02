import Image from "next/image";
import Link from "next/link";

import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { fill } from "@/i18n";
import { hasMenu, hoursRange, menuHref } from "@/themes/_shared/data";
import { labelBase, page, surface } from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dergi kunye seridi: tek satirda solda kucuk marka adi, ortada ince nav,
 * sonda calisma saati araligi. Tasarimda ust cubuk BILEREK ince — sayfanin
 * tipografik agirligi hero'daki dev serif baslikta, cubuk ona yol veriyor.
 *
 * Ogeler `items-baseline` ile hizali: farkli punto uc metnin alt cizgisi
 * ortak kalsin diye (dergi kunyesi hissi bundan geliyor).
 *
 * Nav linkleri, bolumlerin kendi "bos ise null don" kosullariyla AYNI
 * kosula bagli; yoksa musteri galeri yuklemeden yayina alinca "Galeri"
 * linki hicbir yere gitmeyen kirik bir capa olurdu.
 */
export default function Header({ content }: SectionProps) {
  const { name, logoUrl, openingHours, t } = content;

  const range = hoursRange(openingHours);

  /*
   * Capalar ana sayfaya MUTLAK yaziliyor ("/tr#galeri"), cunku bu serit menu
   * sayfasinda da basiliyor: orada ciplak "#galeri" hicbir yere gitmeyen bir
   * capa olurdu. Ana sayfada davranis degismez, link yine ayni sayfada kaydirir.
   */
  const home = `/${content.locale}`;

  const links = [
    // Calisma saatleri artik kapanis bolumunde (tasarimdaki yeri orasi), bu
    // yuzden hakkimizda yalnizca METIN varsa basiliyor — yoksa bolum de
    // basilmiyor ve link kirik bir capa olurdu.
    content.about && {
      href: `${home}#hakkimizda`,
      label: t.about.title,
    },
    // Menu artik capa degil, kendi sayfasi. Kosul AYNI kalir: urun yoksa hem
    // link hem sayfa olmamali (route de hasMenu ile 404 veriyor).
    hasMenu(content) && { href: menuHref(content), label: t.menu.eyebrow },
    // isVisible: musteri galeriyi panelden kapattiginda link de gitsin
    // (yalnizca "gorsel var mi" sorusu bunu kacirirdi).
    content.isVisible("galeri") && {
      href: `${home}#galeri`,
      label: t.gallery.eyebrow,
    },
    { href: `${home}#iletisim`, label: t.contact.eyebrow },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    <header className={`${surface} brand-body`}>
      {/* mera-fade: acilista serit yumusakca belirir (tasarim: meraFade .8s). */}
      <div
        className={`${page} mera-fade flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 pt-6 pe-14 sm:pt-[1.625rem] sm:pe-0`}
      >
        {/* Marka adi ana sayfaya doner: menu sayfasinda "#hero" capasi yok,
            kunye adi orada olu bir baglanti olurdu. */}
        <Link href={home} className="flex items-baseline gap-3">
          {/* Logo yoksa hic basilmaz: bu tasarimda marka adi zaten kunyenin
              kendisi, yer tutucu bir isaret ince seridi bozar. */}
          {logoUrl.trim() ? (
            <Image
              src={logoUrl}
              alt={fill(t.hero.logoAlt, { name })}
              width={120}
              height={40}
              priority
              className="h-5 w-auto self-center object-contain"
            />
          ) : null}
          {/* mera-regular: tasarimda marka adinda agirlik yazmiyor (=400);
              300'de 19px'lik serif kunye adi silik kaliyordu. */}
          <span className="brand-display mera-regular mera-mark text-[1.1875rem]">
            {name}
          </span>
        </Link>

        <nav aria-label={name} className="min-w-0">
          <ul className="flex flex-wrap items-baseline gap-x-[2.125rem] gap-y-2">
            {links.map((item) => (
              <li key={item.href}>
                {/* next/link: menu artik ayri bir sayfa, istemci tarafi gecis
                    sayfayi bastan yuklemez. Capalar icin de calisir. */}
                <Link
                  href={item.href}
                  className={`${labelBase} mera-nav text-[0.78rem] text-[var(--brand-ink-muted)] transition-colors hover:text-[var(--brand-ink)]`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Dil secicinin kendi cercevesi var; saat metniyle taban cizgisinde
            degil, DIKEY ORTADA hizalanmasi gerekiyor. */}
        <div className="flex items-center gap-5">
          {range ? (
            <p
              className="mera-time text-[0.78rem] text-[var(--brand-ink-muted)]"
              dir="ltr"
            >
              {range}
            </p>
          ) : null}
          {/* Tek dil aciksa LocaleSwitcher zaten null doner. */}
          <LocaleSwitcher content={content} />
        </div>
      </div>
    </header>
  );
}
