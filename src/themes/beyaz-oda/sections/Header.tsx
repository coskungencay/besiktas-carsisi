import Image from "next/image";
import Link from "next/link";

import { Latin } from "@/components/site/Latin";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { SchemeToggle } from "@/components/site/SchemeToggle";
import { placeStamp, hasMenu, menuHref } from "@/themes/_shared/data";
import { hasAboutSection, shell } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

type NavLink = {
  href: string;
  label: string;
  /** true = ayri sayfa (istemci tarafi gecis), false = ayni sayfada capa. */
  isPage?: boolean;
};

/**
 * Ince ust serit: solda marka, ortada koordinat, sagda bolum baglantilari.
 * Tasarimda 12 kolonluk izgara (4/4/4), 28px dikey bosluk, acilista boFade.
 *
 * Koordinat ayri bir DB alani DEGIL — panelde girilen enlem/boylamdan turetilir.
 * Girilmemisse orta sutun bos kalir, duzen bozulmaz.
 */
export default function Header({ content }: SectionProps) {
  const { name, logoUrl, t } = content;
  const coords = placeStamp(content);

  /*
   * Bolumler icerik bosken kendini basmiyor (About, Menu, Gallery). Nav de
   * ayni kosullari kullanmali; yoksa musteri henuz galeri yuklemeden siteyi
   * yayina alinca "Galeri" linki hicbir yere gitmeyen kirik bir capa olurdu.
   */
  /*
   * Bolum capalari ana sayfaya MUTLAK yazilir ("/tr#galeri", sadece "#galeri"
   * degil). NEDEN: ayni ust serit menu sayfasinda da basiliyor; orada o
   * bolumler yok ve salt "#galeri" hicbir yere gitmeyen bir capa olurdu.
   * Ana sayfada davranis degismez — yalnizca fragment farki oldugu icin
   * tarayici sayfayi yeniden yuklemez, sadece kaydirir.
   */
  const home = `/${content.locale}`;

  const links: NavLink[] = [
    hasAboutSection(content) && {
      href: `${home}#hakkimizda`,
      label: t.about.title,
    },
    /*
     * Menu artik ayri bir SAYFA: capa degil, adres. Kosul hasMenu olarak
     * kaliyor — urun yoksa hem link hem sayfa olmamali (sayfa 404 veriyor).
     */
    hasMenu(content) && {
      href: menuHref(content),
      label: t.menu.eyebrow,
      isPage: true,
    },
    /*
     * Galeri icin isVisible: musteri bolumu panelden kapattiginda link de
     * gitmeli, yoksa hicbir yere gitmeyen bir capa kalir.
     */
    content.isVisible("galeri") && {
      href: `${home}#galeri`,
      label: t.gallery.eyebrow,
    },
    { href: `${home}#iletisim`, label: t.contact.eyebrow },
  ].filter((link): link is NavLink => Boolean(link));

  /*
   * Gezinti baglantilari: serif, buyuk punto, genis harf araligi ve alttan
   * cizilen ince bir vurgu. Onceki hali 12.5px grotesk'ti ve seridi
   * dolduramiyordu.
   */
  const navLinkClass =
    "bo-serif relative py-1 text-[clamp(1rem,1.5vw,1.1875rem)] tracking-[0.04em] transition-colors hover:text-[var(--brand-accent)] " +
    "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-0 after:bg-[var(--brand-accent)] " +
    "after:transition-transform after:duration-300 hover:after:scale-x-100 motion-reduce:after:transition-none";

  /*
   * YAPISKAN SERIT. Onceden sayfa kayinca gozden kayboluyordu; 87 magazali
   * bir sitede gezinti her an elin altinda olmali.
   *
   * Zemin tam opak DEGIL, hafif saydam + blur (bkz. tokens.css .bo-header):
   * hero'nun fotografi seridin altindan gecerken tamamen kesilmiyor, ama yazi
   * her zaman okunur kaliyor.
   */
  return (
    <header className="bo-header bo-fade sticky top-0 z-50 border-b border-[var(--brand-border)]">
      <div
        /*
          12 KOLONLUK IZGARA KALDIRILDI. Serif yazilar buyuyunce hucreler
          tasiyor, mod dugmesi alt satira dusuyor ve serit iki sira
          yuksekliginde kaliyordu. Basit bir flex satiri her genislikte
          dogru davraniyor: marka solda, kunye ortada, gezinti sagda.
        */
        className={`${shell} flex items-center justify-between gap-6 py-4 sm:py-5`}
      >
        <a
          /* Capalarla ayni gerekce: menu sayfasindan da ana sayfaya donmeli. */
          href={`${home}#hero`}
          /*
            Tasarimda marka bir <div>, bizde hero'ya giden bir baglanti. Global
            "a:hover { color:#46606E }" kurali orada her baglantiyi kapsadigi
            icin vurgu rengi burada da EL ILE veriliyor; yoksa sayfadaki tek
            hover'siz baglanti bu olurdu.
          */
          className="bo-serif flex items-center gap-3.5 text-[clamp(1.0625rem,1.7vw,1.375rem)] font-medium tracking-[0.06em] transition-colors hover:text-[var(--brand-accent)] shrink-0"
        >
          {/*
            Logo yuklendiyse kelime-markanin ONUNDE kucuk bir kare olarak
            durur. Tasarimda logo yok, o yuzden hicbir zaman yer TUTMAZ:
            yuklenmemisse eleman hic basilmaz ve serit tasarimdaki haline
            birebir doner. Olcu 20px — bu seritteki yazi 13px, daha buyuk bir
            isaret uc kolonluk marka alanini tasardi.
          */}
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={48}
              height={48}
              /*
                20px'ten 44px'e cikti. Amblemin kaynagi 185px oldugu icin
                2x ekranda 44px hala keskin; daha buyugu bulaniklasir.
              */
              className="size-9 shrink-0 object-contain sm:size-11"
            />
          ) : null}
          <Latin>{name}</Latin>
        </a>

        {coords ? (
          <p
            /*
              Koordinat tasarimda bolum indekslerinden (#A2A7AC) bir kademe
              KOYU (#8A8F94); ust seritte marka ile nav arasinda kaybolmasin
              diye. Karsiligi --brand-ink-dim.
            */
            /*
              Kunye yalnizca GENIS ekranda: dar ekranda marka ile gezinti
              arasina sikisip ikisini de daraltiyordu.
            */
            className="bo-serif hidden shrink-0 text-[13px] tracking-[0.16em] text-[var(--brand-ink-dim)] uppercase xl:block"
            dir="ltr"
          >
            {coords}
          </p>
        ) : null}

        <div className="flex shrink-0 items-center justify-end gap-x-5">
          <nav aria-label={name}>
            {/*
              Dar ekranda gezinti gizleniyor. Sayfa TEK sayfa oldugu ve tum
              bolumler asagida sirayla geldigi icin mobilde capa listesi
              tasimanin degeri yok; ayrica dort serif baglanti seridi tek
              basina dolduruyordu. Magazalar sayfasina giden yol yine var:
              hero'daki "Magazalari Gor" ve her bolumun kendi baglantisi.
            */}
            <ul className="hidden items-center gap-x-8 text-[var(--brand-ink-muted)] md:flex">
              {links.map((link) => (
                <li key={link.href}>
                  {/*
                    Ayri sayfaya giden tek link menu: istemci tarafi gecis icin
                    next/link. Capalar duz <a> kaliyor — ayni belge icinde
                    kaydirma zaten tarayicinin isi.
                  */}
                  {link.isPage ? (
                    <Link href={link.href} className={navLinkClass}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className={navLinkClass}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Tek dil aciksa secici hic basilmaz. */}
          {content.locales.length > 1 ? <LocaleSwitcher content={content} /> : null}

          <SchemeToggle label={t.nav.toggleScheme} />
        </div>
      </div>
    </header>
  );
}
