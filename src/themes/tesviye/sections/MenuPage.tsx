import Link from "next/link";
import { Fragment } from "react";

import { hasMenu, menuWithItems } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  actionLabel,
  cell,
  edgeBottom,
  edgeTop,
  hair,
  label,
  mono,
  shell,
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
 * DUZEN: tasarimdaki gibi TEK bir pafta — solda 200px kunye rayi, saginda
 * belgenin kendisi. Ray bu sefer sayfanin tamamini kapsar; sagdaki sutun
 * sirayla sayfa basligi, kategori bloklari ve donus seridini tasir.
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
      className="bg-[var(--brand-surface)]"
    >
      {/*
        Kabukta edgeBottom YOK: sayfanin son bolumu bu, alt cizgiyi Footer'in
        kendi ust kenarligi cizer (bkz. Contact). Ikisi birden konulunca cizgi
        4px cikiyor ve pafta ritmi bozuluyordu.
      */}
      <div className={shell}>
        <div
          className={`${splitGrid} lg:grid-cols-[var(--ts-rail)_minmax(0,1fr)]`}
        >
          {/*
            Kunye rayi: ana sayfadaki menu bolumuyle AYNI numara (02) — ikisi
            de ayni dosyanin ayni bolumu, biri ozet biri tam hali.
          */}
          <p className={`${cell} ${mono} px-4 py-[26px] sm:px-[18px]`}>
            {t.menu.eyebrow}
            <br />
            {/* Numara sadece gorsel bir isaret; ekran okuyucuya bilgi vermez. */}
            <span
              className="tabular-nums text-[var(--brand-primary)]"
              aria-hidden="true"
            >
              02
            </span>
          </p>

          <div className={cell}>
            {/*
              Baslik bolmesi. Ustunde hero YOK, o yuzden dolgu ana sayfadaki
              bolum basligindan (34px) belirgin sekilde genis: sayfa kendi
              nefesini burada aliyor.
            */}
            <div
              className="px-4 py-12 sm:px-[var(--ts-pad)] sm:pt-[3.75rem] sm:pb-10"
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
                className="ts-wipe mt-[34px] h-[var(--brand-border-width)] bg-[var(--brand-ink)]"
                aria-hidden="true"
              />

              {/*
                Kategori capalari: uzun cetvelde asagi kaydirmadan istenen
                bloga gitmek icin. Tek kategori varsa gereksiz gurultu.
                Ayrac ust seritteki egik cizginin aynisi.
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
                            {category.name}
                          </a>
                        </li>
                      </Fragment>
                    ))}
                  </ul>
                </nav>
              ) : null}
            </div>

            {categories.map((category) => (
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
                  <span>{category.name}</span>
                  {/*
                    Dar ekranda kalem adedi BASILMAZ: serit top-0'da yapiskan
                    duruyor, dil secici ise mobilde tam o kosede sabit
                    (fixed end-3 top-3, sm:hidden). Ikisi ust uste binince
                    acik zeminli secici rozeti sayinin uzerine oturuyordu.
                    Kirilim noktasi secicininkiyle ayni: sm'de secici header'a
                    dondugu icin kose serbest kalir.
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
                         * alt satira gecer; sm ustunde tasarimin dort sutunlu
                         * cetveli acilir. Hucre yerlesimi acikca yazildi ki
                         * DOM sirasi (no, ad, fiyat, not) iki duzende de
                         * dogru okunsun.
                         */
                        className={`${hair} grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-1 px-4 py-[15px] transition-colors hover:bg-[var(--ts-row-hover)] sm:grid-cols-[60px_minmax(0,1.4fr)_minmax(0,1fr)_110px] sm:gap-0 sm:p-0`}
                      >
                        {/* Sira numarasi: sadece gorsel bir cetvel isareti. */}
                        <span
                          className="col-start-1 row-start-1 text-[length:var(--ts-body)] font-light tabular-nums text-[var(--brand-ink-muted)] sm:px-[14px] sm:py-[15px]"
                          aria-hidden="true"
                        >
                          {String(row).padStart(2, "0")}
                        </span>

                        <p className="col-start-2 row-start-1 brand-display text-[length:var(--ts-item)] leading-[1.25] tracking-[0.01em] uppercase sm:px-[14px] sm:py-[15px]">
                          {item.name}
                          {item.isFeatured ? (
                            <span
                              className={`${label} ms-3 align-middle text-[var(--brand-primary)]`}
                            >
                              {t.menu.featured}
                            </span>
                          ) : null}
                        </p>

                        {item.price ? (
                          <p
                            className="col-start-3 row-start-1 text-[length:var(--ts-body)] font-medium tabular-nums sm:col-start-4 sm:px-[14px] sm:py-[15px] sm:text-end"
                            dir="ltr"
                          >
                            {item.price}
                          </p>
                        ) : null}

                        {item.description ? (
                          <p className="col-start-2 col-end-4 row-start-2 text-[length:var(--ts-body-sm)] leading-[var(--ts-body-sm-leading)] font-light text-pretty text-[var(--brand-ink-muted)] sm:col-start-3 sm:col-end-4 sm:row-start-1 sm:px-[14px] sm:py-[15px]">
                            {item.description}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {/*
              Donus seridi: menu ayri bir sayfa oldugu icin ziyaretcinin tek
              cikisi tarayicinin geri tusu olmamali. Bicim hero'nun altindaki
              eylem hucresiyle ayni (96px serit, mavi zemin) — temada "ana
              baglanti" bu demek.

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
      </div>
    </section>
  );
}
