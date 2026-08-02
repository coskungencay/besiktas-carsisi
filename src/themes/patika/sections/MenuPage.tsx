import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { hasMenu, menuWithItems } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import { navLink, pillSolid, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/** Kategori capasi; hem nav rozeti hem blok bu adi kullanir. */
const categoryAnchor = (categoryId: number) => `menu-kategori-${categoryId}`;

/**
 * Ayri menu sayfasinin govdesi (/tr/menu).
 *
 * NEDEN AYRI DUZEN: ana sayfadaki bolum bir VITRIN — dort kolonluk afis
 * kartlari, her birinde 60px'lik bilincli bosluk. Ayni kart 30+ urunle
 * tekrarlandiginda sayfa metrelerce uzuyor ve fiyat karsilastirmasi
 * imkansizlasiyor. Bu yuzden sayfa, tasarimin IKINCI listeleme dilini
 * kullaniyor: kapanis blogundaki saat cetveli (ad solda, deger sagda, aralarda
 * 2px ayrac). Ayni malzeme, farkli is: kart tanitir, cetvel karsilastirir.
 *
 * KATEGORI BLOKLARI: vitrinde kategori adi kartin numara satirindaydi; burada
 * tam liste var ve okuyucu "kahveler nerede bitiyor" sorusunun cevabini
 * gormek zorunda. Her blok kendi <section>'i — tokens.css'teki
 * `section[id] { scroll-margin-top }` kurali yapiskan seridin altina
 * girmelerini kendiliginden engelliyor.
 *
 * UST BOSLUK: bu sayfada hero yok, baslik dogrudan seridin altinda. pk-section
 * (96px) burada dar kaliyordu; bolum araligindan bir kademe genis bir ust
 * bosluk veriliyor. Alt bosluk da BURADA: footer'in 26px'lik ust boslugu
 * ana sayfadaki lime kapanis blogu icin olculmustu, cetvelin altinda yetmiyor.
 */
export default function MenuPage({ content }: SectionProps) {
  // Sayfa zaten bos menude 404 veriyor; bilesen tek basina da guvenli olmali.
  if (!hasMenu(content)) return null;

  const categories = menuWithItems(content);
  const { t } = content;

  return (
    <section id="menu" aria-labelledby="menu-page-title" className={surface}>
      <div className={`${shell} pt-16 pb-16 sm:pt-24 sm:pb-24 lg:pt-32`}>
        <Reveal>
          {/*
            Tasarimdaki menu basligi satiri: solda dev baslik, sagda kisa bir
            tanitim metni ve ikisi ALT kenardan hizali (align-items:flex-end).
            O metnin ana sayfada veri karsiligi yoktu ve SectionHead'e hic
            konmamisti; burada sozlukteki sayfa girisi tam o yeri dolduruyor.
          */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-11">
            <div>
              {/* Hero'daki semt satiriyla ayni ses: kucuk, genis arali, neon. */}
              <p className="pk-eyebrow text-[var(--brand-primary)]">
                {t.menu.eyebrow}
              </p>

              {/*
                Sayfanin TEK h1'i. Olcu pk-h2 (76px): tasarimin en yuksek sesi
                hero'nun 168px'i, o da bu sayfada yok — menu basligi burada
                sayfanin tepesini tek basina tasiyor.
              */}
              <h1 id="menu-page-title" className="pk-h2 mt-[1.125rem] text-balance">
                {t.menu.title}
              </h1>
            </div>

            {/* Tasarimdaki 420px'lik soluk paragraf. */}
            <p className="pk-body max-w-[26.25rem] text-pretty text-[var(--brand-ink-muted)]">
              {t.menu.pageIntro}
            </p>
          </div>
        </Reveal>

        {/*
          Kategori atlama rozetleri — ust serit nav'inin AYNI bicimi; tema
          zaten "gidilecek yer" fikrini bu rozetle anlatiyor. Tek kategoride
          hicbir sey secmeyen bir secim satiri olurdu, o yuzden basilmaz.
        */}
        {categories.length > 1 ? (
          <Reveal delay={0.06}>
            <nav aria-label={t.menu.eyebrow} className="mt-9">
              <ul className="flex flex-wrap items-center gap-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a href={`#${categoryAnchor(category.id)}`} className={navLink}>
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        ) : null}

        <div className="mt-14 flex flex-col gap-14 sm:gap-16">
          {categories.map((category, categoryIndex) => {
            const anchor = categoryAnchor(category.id);

            return (
              <section
                key={category.id}
                id={anchor}
                aria-labelledby={`${anchor}-title`}
              >
                <Reveal>
                  {/*
                    Blok basligi: numara + ad ayni taban cizgisinde, altinda
                    2px ayrac. Numara vitrindeki kart satirindan devralindi
                    (tasarim: "01 · Espresso bazli"); burada kategoriyi
                    numaralandiriyor, boylece uzun sayfada kacinci bloktayiz
                    belli oluyor. Dekoratif oldugu icin ekran okuyucu atlar.
                  */}
                  <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b-[length:var(--brand-border-width)] border-[var(--brand-border)] pb-5">
                    <span
                      aria-hidden="true"
                      className="pk-caps text-[var(--brand-primary)]"
                    >
                      {String(categoryIndex + 1).padStart(2, "0")}
                    </span>
                    <h2 id={`${anchor}-title`} className="pk-h3 text-balance">
                      {category.name}
                    </h2>
                  </div>
                </Reveal>

                {/*
                  Iki kolon YALNIZCA sm ve ustu; 390px'te tek kolon (grid
                  varsayilani). Satir araligi YOK: her satirin kendi alt
                  ayraci var, aralik verilirse cetvel kopuk kopuk okunur.
                  Kolonlar arasi bosluk genis — iki cetvel birbirine
                  yapismasin diye.

                  LISTEDE <Reveal> YOK — bilincli. Reveal, elemanin %20'si
                  ekrana girince aciliyor; ekrandan bes kat uzun bir eleman bu
                  orana HIC ulasamaz ve kalici olarak gorunmez kalir. Tek
                  kategoride 30+ urun tam da bu boyda (mobilde tek kolon), yani
                  sayfanin var olma sebebi olan uzun liste kaybolurdu. Kategori
                  basligi zaten aciliyor, cetvel onun altinda duruyor.
                */}
                <ul className="grid sm:grid-cols-2 sm:gap-x-10 lg:gap-x-16">
                  {category.items.map((item) => (
                    <li
                      key={item.id}
                      className="border-b-[length:var(--brand-border-width)] border-[var(--brand-border)] py-6"
                    >
                      {/*
                        One cikan urunun isareti: kart numarasiyla ayni kucuk
                        buyuk-harf satiri, ama neon. Vitrinde bu isi kartin
                        hover rengi yapiyordu; cetvelde renk tasiyacak zemin
                        yok, isaret metne dusuyor.
                      */}
                      {item.isFeatured ? (
                        <p className="pk-caps text-[var(--brand-primary)]">
                          {t.menu.featured}
                        </p>
                      ) : null}

                      {/*
                        Ad ve fiyat AYNI taban cizgisinde, aralarinda esnek
                        bosluk. Ad min-w-0 + break-words: dar ekranda uzun ad
                        satir atlar; fiyat shrink-0, yani asla ezilmez ve adin
                        uzerine binmez.
                      */}
                      <div
                        className={`flex items-baseline justify-between gap-x-6 ${
                          item.isFeatured ? "mt-2.5" : ""
                        }`}
                      >
                        <h3 className="pk-title min-w-0 break-words">
                          {item.name}
                        </h3>

                        {item.price ? (
                          /* Fiyat her dilde soldan saga okunur (Arapca dahil). */
                          <p className="pk-price shrink-0 tabular-nums" dir="ltr">
                            {item.price}
                          </p>
                        ) : null}
                      </div>

                      {/*
                        Aciklama TAM GENISLIK: adin altinda, fiyat kolonunun da
                        altini kullanir. Sayfanin isi tam bilgi vermek; dar bir
                        kolona sikistirmak satirlari kirpik gosteriyordu.
                      */}
                      {item.description ? (
                        <p className="mt-2 text-sm leading-[1.5] text-pretty text-[var(--brand-ink-muted)]">
                          {item.description}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        {/*
          Ana sayfaya donus. Menu artik ayri bir adres oldugu icin ziyaretcinin
          tek cikisi tarayicinin geri tusu olmamali. Uygun bir sozluk anahtari
          yok (skipToContent bambaska bir is yapiyor), o yuzden baglantiyi
          isletme adi tasiyor — ust serittteki logotipin ayni isi.
        */}
        <Reveal delay={0.08}>
          <div className="mt-16 border-t-[length:var(--brand-border-width)] border-[var(--brand-border)] pt-10">
            <Link
              href={`/${content.locale}`}
              className={`${pillSolid} transition-colors hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent)]`}
            >
              {/* rotate-180: ok geri yonu gosterir; ikon RTL'de zaten donuyor. */}
              <span className="inline-flex rotate-180">
                <ArrowIcon className="size-4" />
              </span>
              <span>{content.name}</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
