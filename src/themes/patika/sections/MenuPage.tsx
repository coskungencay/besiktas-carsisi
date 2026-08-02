import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { hasMenu, menuWithItems } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import { navLink, pillSolid, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/** Kategori capasi; hem nav rozeti hem blok bu adi kullanir. */
const categoryAnchor = (categoryId: number) => `menu-kategori-${categoryId}`;

/**
 * Sayfa kabugu — KITAPCIK olcusu.
 *
 * Tema genelinde `shell` 2200px: afis dili ekrani doldurmak ister. Ama menu
 * sayfasi afis degil, KATALOG; 2200px'te "ad ... fiyat" ucusu o kadar uzuyor
 * ki goz satirin basindan sonuna varamiyor. 65rem (1040px) iki kolonlu
 * cetvelde her kolona ~440px birakir — basili menu kartinin gercek olcusu.
 * Deger max-width oldugu icin 2000px+ ekranda kap BUYUMEZ, ortada durur.
 *
 * Yatay bosluk mobilde bilerek kucuk (12px): kagit kenardan kenara gitsin,
 * dar ekranda okunacak alan kaybolmasin.
 */
const sheetShell = "mx-auto w-full max-w-[65rem] px-3 sm:px-6 lg:px-8";

/**
 * Kitapcigin IC bosluklari. Tasarimin en buyuk kabi olan lime kapanis blogu
 * 52px/46px ile nefes aliyor; kagit da o kademede. Mobilde 20px'e iniyor,
 * yoksa 366px'lik kagitta metne 280px kaliyordu.
 */
const sheetPadX = "px-5 sm:px-9 lg:px-12";

/**
 * Ayri menu sayfasinin govdesi (/tr/menu).
 *
 * NEDEN KAP: ana sayfadaki bolum bir VITRIN — dort kolonluk afis kartlari,
 * her birinde 60px'lik bilincli bosluk. Ayni kart 30+ urunle tekrarlandiginda
 * sayfa metrelerce uzuyor ve fiyat karsilastirmasi imkansizlasiyor. Bu yuzden
 * sayfa, tasarimin IKINCI listeleme dilini kullaniyor: kapanis blogundaki saat
 * cetveli (ad solda, deger sagda, aralarda 2px ayrac). Ayni malzeme, farkli
 * is: kart tanitir, cetvel karsilastirir.
 *
 * KAP TEMANIN DILINDE: tasarimin kart tarifi zaten hazir — #16160F zemin,
 * 2px kenarlik, buyuk radius. Menu kartlarindaki o tarif burada TEK BIR
 * SAYFAYA buyutuluyor: koyu sayfa zemininin uzerinde duran, kenarlikli bir
 * kagit. Tepesindeki lime bant da temadan: tasarimda kayan seridi cerceveleyen
 * "lime zemin + 2px kenarlik" ayni kaliptir, burada kitapcigin kapagi oluyor.
 * Boylece kap yalnizca "dar bir kolon" degil, gorunur bir nesne.
 *
 * KATEGORI BLOKLARI: vitrinde kategori adi kartin numara satirindaydi; burada
 * tam liste var ve okuyucu "kahveler nerede bitiyor" sorusunun cevabini
 * gormek zorunda. Her blok kendi <section>'i — tokens.css'teki
 * `section[id] { scroll-margin-top }` kurali yapiskan seridin altina
 * girmelerini kendiliginden engelliyor.
 */
export default function MenuPage({ content }: SectionProps) {
  // Sayfa zaten bos menude 404 veriyor; bilesen tek basina da guvenli olmali.
  if (!hasMenu(content)) return null;

  const categories = menuWithItems(content);
  const { t } = content;

  return (
    <section id="menu" aria-labelledby="menu-page-title" className={surface}>
      {/* Ust/alt bosluk kagidin sayfa zemininde YUZDUGUNU gostermeli; bu
          yuzden pk-section'dan (tek tarafli) ayrilip iki tarafli veriliyor. */}
      <div className={`${sheetShell} pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28`}>
        {/*
          KAGIT. overflow-hidden zorunlu: lime kapak bandi kenardan kenara
          gidiyor, koseleri kirpan tek sey kabin kendi radius'u.

          Radius mobilde bir kademe kucuk (kart olcusu, 20px), sm ustunde
          tasarimin buyuk blok olcusune (28px) cikiyor — dar ekranda 28px'lik
          kose 366px'lik bir kagitta orantisiz duruyor.

          Kenarlik her olcude 2px kaliyor: temanin imzasi bu kalinlik, ve zaten
          "kalin cerceve" degil. Dar ekranda incelen sey IC BOSLUK.
        */}
        <article className="overflow-hidden rounded-[var(--brand-radius)] border-[length:var(--brand-border-width)] border-[var(--brand-border)] bg-[var(--brand-surface-alt)] sm:rounded-[var(--brand-radius-block)]">
          <Reveal>
            {/*
              KAPAK BANDI — tasarimdaki lime serit kaliba bire bir: lime zemin,
              altinda 2px koyu ayrac. Menu sayfasinda hero yok; sayfanin tepesini
              tek basina bu bant tasiyor ve kitapcigi ilk bakista "menu karti"
              yapan sey de o.
            */}
            <header
              className={`${sheetPadX} border-b-[length:var(--brand-border-width)] border-[var(--brand-border)] bg-[var(--brand-primary)] py-9 text-[var(--brand-primary-contrast)] sm:py-11 lg:py-13`}
            >
              {/* Hero'daki semt satiriyla ayni ses; lime zeminde renk yerine
                  soluklukla geri cekiliyor (tasarim: lime blok icinde opacity .6). */}
              <p className="pk-eyebrow opacity-60">{t.menu.eyebrow}</p>

              {/*
                Sayfanin TEK h1'i. Olcu pk-h2 (76px): tasarimin en yuksek sesi
                hero'nun 168px'i, o da bu sayfada yok.
              */}
              <h1 id="menu-page-title" className="pk-h2 mt-[1.125rem] text-balance">
                {t.menu.title}
              </h1>

              {/*
                Tanitim metni tasarimda basligin SAGINDA duruyordu (1440px'lik
                acik yerlesimde). 1040px'lik kagitta yan yana koymak hem 76px'lik
                basligi hem 420px'lik paragrafi sikistiriyor — ustelik baslik
                sozlukten geliyor, uzunlugu dile gore degisiyor. Kapak dilinde
                dogru siralama zaten dikey: kunye, baslik, spot.
              */}
              <p className="pk-body mt-5 max-w-[42ch] font-medium text-pretty opacity-75">
                {t.menu.pageIntro}
              </p>
            </header>
          </Reveal>

          <div className={`${sheetPadX} py-10 sm:py-12 lg:py-14`}>
            {/*
              Kategori atlama rozetleri — ust serit nav'inin AYNI bicimi; tema
              zaten "gidilecek yer" fikrini bu rozetle anlatiyor. flex-wrap:
              dar ekranda alt satira dokuluyorlar, yatay tasma olmuyor. Tek
              kategoride hicbir sey secmeyen bir secim satiri olurdu, basilmaz.
            */}
            {categories.length > 1 ? (
              <Reveal>
                <nav aria-label={t.menu.eyebrow} className="mb-12 sm:mb-14">
                  <ul className="flex flex-wrap items-center gap-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <a
                          href={`#${categoryAnchor(category.id)}`}
                          className={navLink}
                        >
                          {category.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Reveal>
            ) : null}

            <div className="flex flex-col gap-12 sm:gap-14">
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
                      Iki kolon YALNIZCA lg ve ustu. Esik bilerek sm degil:
                      kagit 1040px'e kilitli oldugu icin sm'de (640px) iki kolon
                      her birine ~240px birakiyordu — 32px'lik urun adi ile
                      26px'lik fiyat orada ayni satira sigmiyor, cetvel kirilip
                      okunmaz oluyordu. lg'de kolon basina ~440px kaliyor.
                      Altinda TEK kolon: satirlar kagidin tam genisligini kullanir.

                      grid-cols-1 ACIKCA yaziliyor; ciplak `grid` YETMEZ. Kolon
                      belirtilmeyince izgaranin tek kolonu `auto` olur ve icerigin
                      min-content olcusune GENISLER. Bolunemez uzun bir urun adi
                      (break-words min-content'i kucultmez) kolonu kagittan tasirir,
                      kabin overflow-hidden'i da tasan metni sessizce kirpar — yani
                      urun 390px'te gorunmez olurdu. grid-cols-1 kolonu
                      minmax(0,1fr) yapar: kolon kaba kilitlenir, uzun ad satir
                      icinde kirilir.

                      Satir araligi YOK: her satirin kendi alt ayraci var,
                      aralik verilirse cetvel kopuk kopuk okunur.

                      LISTEDE <Reveal> YOK — bilincli. Reveal, elemanin %20'si
                      ekrana girince aciliyor; ekrandan bes kat uzun bir eleman bu
                      orana HIC ulasamaz ve kalici olarak gorunmez kalir. Tek
                      kategoride 30+ urun tam da bu boyda, yani sayfanin var olma
                      sebebi olan uzun liste kaybolurdu. Kategori basligi zaten
                      aciliyor, cetvel onun altinda duruyor.
                    */}
                    <ul className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
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
                            bosluk. flex-wrap + min-w-0 + break-words: 390px'te
                            uzun ad once kendi icinde sarar, sigmazsa fiyat alt
                            satira gecer. Fiyat shrink-0 — asla ezilmez ve adin
                            uzerine binmez.
                          */}
                          <div
                            className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 ${
                              item.isFeatured ? "mt-2.5" : ""
                            }`}
                          >
                            <h3 className="pk-title min-w-0 break-words">
                              {item.name}
                            </h3>

                            {item.price ? (
                              /* Fiyat her dilde soldan saga okunur (Arapca dahil). */
                              <p
                                className="pk-price shrink-0 tabular-nums"
                                dir="ltr"
                              >
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
          </div>
        </article>

        {/*
          Ana sayfaya donus — kagidin DISINDA. Tasarimda da en buyuk kap (lime
          kapanis blogu) sayfayi bitirmiyor: kunye satiri onun 26px altinda,
          kabin disinda duruyor. Ayni mesafe burada donus rozetine veriliyor;
          boylece rozet menunun bir parcasi degil, menuden cikis olarak okunuyor.

          Uygun bir sozluk anahtari yok (skipToContent bambaska bir is yapiyor),
          o yuzden baglantiyi isletme adi tasiyor — ust seritteki logotipin isi.
        */}
        <Reveal delay={0.08}>
          <div className="mt-[1.625rem]">
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
