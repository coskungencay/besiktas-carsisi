import Link from "next/link";
import { Fragment } from "react";

import { ImageZoom } from "@/components/site/ImageZoom";
import { fill } from "@/i18n";
import {
  anyItemHasImage,
  hasMenu,
  itemThumb,
  menuWithItems,
} from "@/themes/_shared/data";
import { Latin } from "@/components/site/Latin";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  actionLabel,
  cell,
  edgeBottom,
  edgeTop,
  hair,
  label,
  mono,
  padStrip,
  sheet,
  sheetEdge,
  sheetMat,
  splitGrid,
  tableHead,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ayri menu sayfasinin govdesi (/tr/menu) — tasarimin "liste" paftasinin
 * TAM hali: fiyat cetvelinin kendisi.
 *
 * NEDEN AYRI SAYFA: ana sayfadaki menu bolumu artik birkac urunluk bir vitrin;
 * 30+ satirlik cetvel ana sayfayi okunamaz kiliyordu. Cetvel zaten kendi
 * basina bir belge, bir sayfa olmasi tasarimin diline de uyuyor.
 *
 * NEDEN KENARDAN KENARA DEGIL, CERCEVELI BIR YAPRAK: sitenin geri kalani tek
 * bir kenardan kenara paftadir, ama o pafta 2200px'e kadar aciliyor. Cetvel
 * orada aktiginda goz satirin basindan fiyatina varamiyor. Burada belge kendi
 * kabina alindi: sayfa zemini koyulasir (surface-alt), ortada ~1000px'lik bir
 * yaprak durur, yapragin cevresinde kalin cerceve ve (genis ekranda) ikinci
 * bir cizgi — paspartuya oturtulmus bir pafta. Kap tasarimin kendi dilinden:
 * bu temada her kutu zaten 2px murekkep cizgiyle cevrili, degisen tek sey
 * cizginin bu sefer SAYFA olcusunde olmasi.
 *
 * DUZEN: yapragin ilk seridi kunye (bolum adi + numara), altinda baslik
 * bolmesi, sonra kategori bloklari, en altta donus seridi. Kunye rayi burada
 * SOLDA DEGIL USTTE: 200px'lik dikey ray 1000px'lik yapragin besde birini
 * yiyip cetvelin fiyat sutununu sikistiriyordu; ust serit tasarimin kendi ust
 * kunye seridiyle (Header) ayni bicimde.
 *
 * NEDEN iki kolonlu urun izgarasi DEGIL: bu tasarimda menu bir kart dizisi
 * degil, sutunlari hizali bir cetvel (no · urun · not · fiyat). Cetveli ikiye
 * bolmek fiyat sutununu iki ayri yere dagitip belgeyi okunmaz yapardi;
 * uzunluga karsi cozum yapiskan kategori basligi ve ustteki capa listesi.
 *
 * NEDEN <Reveal> YOK: 30+ satir tek tek belirince liste titriyor; sayfanin
 * acilisini tokens.css'teki ts-* animasyonlari (baslik bolmesi) tasiyor.
 */
export default function MenuPage({ content }: SectionProps) {
  // Menu bossa route zaten 404 veriyor; bilesen yine de tek basina guvenli.
  if (!hasMenu(content)) return null;

  const categories = menuWithItems(content);
  const { t } = content;

  const anchorId = (categoryId: number) => `menu-kategori-${categoryId}`;

  // Sira numarasi kategoriler boyunca KESINTISIZ artar: cetvel tek bir belge.
  let row = 0;

  return (
    <section
      id="menu"
      aria-labelledby="menu-page-title"
      /*
       * Sayfa zemini surface DEGIL surface-alt: yaprak kendi zemininden
       * ayrilsin, elde tutulan bir belge gibi ustte dursun. Dikey dolgu
       * ferah, yatay dolgu dar ekranda 12px'e iner ki kap tum genisligi
       * kullansin. Alt kenarlik YOK: cizgiyi Footer'in ust kenarligi cizer.
       */
      className="bg-[var(--brand-surface-alt)] px-3 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-20"
    >
      {/* Passe-partout: dis cizgi + araligi (dar ekranda ikisi de 0). */}
      <div className={sheet} style={sheetMat}>
        {/* Yapragin kendisi: kagit zemini + kalin cerceve. */}
        <div className={cell} style={sheetEdge}>
          {/*
            Kunye seridi: ana sayfadaki menu bolumuyle AYNI numara (02) — ikisi
            de ayni dosyanin ayni bolumu, biri ozet biri tam hali. Bicim
            Header'in ust seridiyle ayni (mono etiket + 2px dikey ayrac).
          */}
          <div
            className={`${splitGrid} grid-cols-[minmax(0,1fr)_auto]`}
            style={edgeBottom}
          >
            <p className={`${cell} ${mono} ${padStrip}`}>{t.menu.eyebrow}</p>
            {/* Numara sadece gorsel bir isaret; ekran okuyucuya bilgi vermez. */}
            <p
              className={`${cell} ${mono} ${padStrip} tabular-nums text-[var(--brand-primary)]`}
              aria-hidden="true"
            >
              02
            </p>
          </div>

          {/*
            Baslik bolmesi. Ustunde hero YOK, o yuzden dolgu ana sayfadaki
            bolum basligindan (34px) belirgin sekilde genis: sayfa kendi
            nefesini burada aliyor.
          */}
          <div
            className="px-4 py-10 sm:px-[var(--ts-pad)] sm:pt-[3.25rem] sm:pb-10"
            style={edgeBottom}
          >
            <p className="ts-fade-late brand-body text-[length:var(--ts-label-lg)] leading-[1.4] font-medium tracking-[var(--ts-track-eyebrow)] uppercase text-[var(--brand-primary)]">
              {t.menu.pageIntro}
            </p>

            {/*
              Sayfanin tek h1'i. Olcu hero ile bolum basligi arasinda
              (--ts-page-title): hero kadar dev olmasi cetvelin kendisini
              ezerdi, bolum basligi kadar kucuk olmasi sayfayi bassiz
              birakirdi.

              ts-stagger: tasarimin acilis hareketi; tek cocuk oldugu icin
              baslik tek parca halinde yukselir.
            */}
            <h1
              id="menu-page-title"
              className="ts-stagger brand-display mt-[22px] text-[length:var(--ts-page-title)] leading-[var(--ts-hero-leading)] tracking-[var(--ts-hero-tracking)] text-balance uppercase"
            >
              <span className="inline-block">{t.menu.title}</span>
            </h1>

            {/* Tasarimin imzasi: soldan saga cizilen kalin ayrac. */}
            <div
              className="ts-wipe mt-[30px] h-[var(--brand-border-width)] bg-[var(--brand-ink)]"
              aria-hidden="true"
            />

            {/*
              Kategori capalari: uzun cetvelde asagi kaydirmadan istenen
              bloga gitmek icin. Tek kategori varsa gereksiz gurultu.
              Ayrac ust seritteki egik cizginin aynisi. flex-wrap: dar
              ekranda liste alt satira sarar, yatay tasma birakmaz.
            */}
            {categories.length > 1 ? (
              <nav aria-label={t.menu.eyebrow} className="ts-up-late mt-6">
                <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[length:var(--ts-label-lg)] leading-[1.4] font-medium tracking-[var(--ts-track-nav)] uppercase">
                  {categories.map((category, index) => (
                    <Fragment key={category.id}>
                      {index > 0 ? (
                        <li aria-hidden="true" className="opacity-30">
                          /
                        </li>
                      ) : null}
                      <li>
                        <a
                          href={`#${anchorId(category.id)}`}
                          className="transition-colors hover:text-[var(--brand-primary)]"
                        >
                          <Latin>{category.name}</Latin>
                        </a>
                      </li>
                    </Fragment>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>

          {categories.map((category) => {
            /* Fotograf sutunu kategori bazinda acilir. */
            const withImages = anyItemHasImage(content, category.items);

            return (
            <div key={category.id} id={anchorId(category.id)}>
              {/*
                Yapiskan kategori seridi: uzun listede asagi inildikce
                hangi kategoride olundugu kaybolmasin diye. Tasarimda bu
                serit zaten koyu zeminli tablo basligiydi; sagindaki sayi,
                tasarimdaki teknik sutun etiketlerinin yerini tutan bir
                okuma (kalem adedi) — cevrilecek bir metin degil.
              */}
              <h2
                className={`${tableHead} sticky top-0 z-10 flex items-baseline justify-between gap-3 bg-[var(--brand-accent)] px-4 py-3 text-[var(--brand-primary-contrast)] sm:px-[14px]`}
                style={edgeBottom}
              >
                <span><Latin>{category.name}</Latin></span>
                {/*
                  Dar ekranda kalem adedi BASILMAZ: serit top-0'da yapiskan
                  duruyor, dil secici ise mobilde tam o kosede sabit
                  (fixed end-3 top-3, sm:hidden) — olculdu, ikisinin
                  dikdortgeni birebir cakisiyor. Cakisan koseye ikinci bir
                  okuma koymak (hangisi ustte cizilirse cizilsin) gurultu.
                  Kirilim noktasi secicininkiyle ayni: sm'de secici header'a
                  dondugu icin kose serbest kalir ve sayi geri gelir.
                */}
                <span
                  className="hidden tabular-nums text-[var(--ts-primary-on-dark)] sm:inline"
                  aria-hidden="true"
                >
                  {String(category.items.length).padStart(2, "0")}
                </span>
              </h2>

              <ul>
                {category.items.map((item) => {
                  row += 1;

                  return (
                    <li
                      key={item.id}
                      /*
                       * Dar ekranda uc sutun (no · ad · fiyat) kalir, not
                       * alt satira gecer; md ustunde tasarimin dort sutunlu
                       * cetveli acilir. Hucre yerlesimi acikca yazildi ki
                       * DOM sirasi (no, ad, fiyat, not) iki duzende de
                       * dogru okunsun.
                       *
                       * NEDEN md (sm DEGIL): cetvel artik 2200px'lik paftada
                       * degil ~1000px'lik yaprakta. 640px'te dort sutun
                       * acilinca urun adina 220px kaliyor, uzun adlar uc
                       * satira boluniyordu. minmax(0,1fr) sutunlari ayrica
                       * tasmayi engeller: uzun ad fiyatin uzerine binmez,
                       * kendi hucresinde sarar.
                       */
                      className={`${hair} grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-1 px-4 py-[15px] transition-colors hover:bg-[var(--ts-row-hover)] md:grid-cols-[52px_minmax(0,1.4fr)_minmax(0,1fr)_100px] md:gap-0 md:p-0`}
                    >
                      {/* Sira numarasi: sadece gorsel bir cetvel isareti. */}
                      <span
                        className="col-start-1 row-start-1 text-[length:var(--ts-body)] font-light tabular-nums text-[var(--brand-ink-muted)] md:px-[14px] md:py-[15px]"
                        aria-hidden="true"
                      >
                        {String(row).padStart(2, "0")}
                      </span>

                      {/*
                        Fotograf AD HUCRESININ icinde duruyor, cetvele yeni bir
                        sutun eklenmiyor: aciklama ve fiyat acikca col-start ile
                        konumlandigi icin araya sutun sokmak butun satiri
                        kaydirirdi.
                      */}
                      <div className="col-start-2 row-start-1 flex min-w-0 items-center gap-3 md:px-[14px] md:py-[15px]">
                        {withImages ? (
                          <span
                            className={`relative block size-12 shrink-0 overflow-hidden rounded-[var(--brand-radius)] ${itemThumb(content, item) ? "border-[length:var(--brand-border-width)] border-[var(--brand-border)] bg-[var(--brand-surface-alt)]" : ""}`}
                          >
                            {itemThumb(content, item) ? (
                              /*
                                Kucuk kare TIKLANABILIR: bu boyuttan urunun neye benzedigi
                                anlasilmiyor. ImageZoom yerinde bir <button> basar (kutu ayni
                                kalir) ve tiklaninca tarayicinin kendi <dialog>'unda buyutur.
                              */
                              <ImageZoom
                                thumbSrc={itemThumb(content, item) as string}
                                fullSrc={item.imageUrl}
                                alt={item.name}
                                openLabel={fill(t.menu.enlarge, { name: item.name })}
                                closeLabel={t.menu.closeImage}
                                sizes="48px"
                              />
                            ) : null}
                          </span>
                        ) : null}

                        <p className="brand-display min-w-0 text-[length:var(--ts-item)] leading-[1.25] tracking-[0.01em] uppercase">
                          <Latin>{item.name}</Latin>
                          {item.isFeatured ? (
                            <span
                              className={`${label} ms-3 align-middle text-[var(--brand-primary)]`}
                            >
                              {t.menu.featured}
                            </span>
                          ) : null}
                        </p>
                      </div>

                      {item.price ? (
                        /*
                         * Fiyat sutunu dar ekranda `auto`: kendi genisligi
                         * kadar yer alir, kalani esnek ad sutunu (1fr)
                         * karsilar. Boylece uzun urun adi fiyatin ustune
                         * BINMEZ, kendi hucresinde satir sarar.
                         */
                        <p
                          className="col-start-3 row-start-1 text-[length:var(--ts-body)] font-medium tabular-nums md:col-start-4 md:px-[14px] md:py-[15px] md:text-end"
                          dir="ltr"
                        >
                          {item.price}
                        </p>
                      ) : null}

                      {item.description ? (
                        <p className="col-start-2 col-end-4 row-start-2 text-[length:var(--ts-body-sm)] leading-[var(--ts-body-sm-leading)] font-light text-pretty text-[var(--brand-ink-muted)] md:col-start-3 md:col-end-4 md:row-start-1 md:px-[14px] md:py-[15px]">
                          {item.description}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
            );
          })}

          {/*
            Donus seridi: menu ayri bir sayfa oldugu icin ziyaretcinin tek
            cikisi tarayicinin geri tusu olmamali. Bicim hero'nun altindaki
            eylem hucresiyle ayni (96px serit, mavi zemin) — temada "ana
            baglanti" bu demek. Yapragin son seridi oldugu icin cerceveye
            kadar uzanir: belge mavi bir bantla kapanir.

            Metin isletme adi: sozlukte "ana sayfaya don" karsiligi yok,
            uydurma metin yazmak yerine belgenin sahibi yaziliyor.
          */}
          <Link
            href={`/${content.locale}`}
            className={`${actionLabel} flex min-h-[4.5rem] items-center justify-center gap-2 bg-[var(--brand-primary)] px-4 text-center text-[var(--brand-primary-contrast)] transition-colors sm:min-h-[6rem] hover:bg-[var(--brand-accent)]`}
            style={edgeTop}
          >
            {/*
              rotate-180: ok geri yonu gosterir. Ikonun kendi rtl kurali
              once yonu cevirdigi icin Arapca'da da dogru tarafa bakar.
            */}
            <span className="inline-flex rotate-180">
              <ArrowIcon className="size-3.5" />
            </span>
            {content.name}
          </Link>
        </div>
      </div>
    </section>
  );
}
