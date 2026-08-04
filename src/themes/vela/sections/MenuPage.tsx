import Image from "next/image";
import Link from "next/link";

import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import {
  anyItemHasImage,
  hasMenu,
  itemThumb,
  menuWithItems,
} from "@/themes/_shared/data";
import {
  goldButton,
  Hairline,
  meta,
  SectionHead,
  surface,
} from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/** Kategori capasi; hem sayfa ici gezinme hem panel id'si buradan uretilir. */
function anchorId(categoryId: number) {
  return `kategori-${categoryId}`;
}

/**
 * TAM MENU SAYFASI (/<dil>/menu) — bir bolum degil, ELDE TUTULAN BIR MENU KARTI.
 *
 * NEDEN KAP: bu tema 2200px'lik bir kabuk kullaniyor. Ana sayfada bu dogru
 * (bantlar ve fotograflar genisligi tasir) ama 30+ urunluk bir listede goz
 * urun adindan fiyata varamiyor: satirin iki ucu arasi bir kol boyu. Menu
 * sayfasi bu yuzden sayfa kabugunu HIC kullanmaz, kendi dar kabina girer.
 *
 * KABIN BICIMI — PASSE-PARTOUT (cift cerceve): disarida ince altin bir cerceve,
 * icinde bir parmak boslugu (sayfa zemini gorunur), sonra ikinci altin cerceve
 * ve kartin kendi zemini (--brand-surface-alt). Bu, tasarimdaki menu panelinin
 * (koyu zemin + rgba altin kenarlik) cerceveletilmis hali: butik bir mekanin
 * altin kenarli menu kartina en yakin duran dil. Kap 1040px'de durur; icinde
 * urun satiri ~840px, yani ad ile fiyat ayni bakista.
 *
 * ICERIK DUZENI: kategori adi (altin etiket + sac teli ayrac) LISTENIN USTUNDE,
 * kartin genisligince — dar bir kapta yan kolon yer yiyor ve "dergi" degil
 * "uygulama" hissi veriyor. Kategoriler sirayla koyu ve krem YAPRAKLAR halinde,
 * cerceveden cerceveye tam genislikte: kartin ic sayfalari. Satir tipografisi
 * (serif ad, 13px aciklama, ayni taban cizgisinde fiyat, aralarinda sac teli)
 * ana sayfadaki menu vitrini ile birebir ayni kalir.
 */
export default function MenuPage({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const categories = menuWithItems(content);
  const { t } = content;

  /*
   * Yaprak dolgusu tek yerde: kartin ic kenari boyunca kunye blogu ve tum
   * yapraklar AYNI hizada baslamali, yoksa cift cerceve egri gorunur.
   * Kademe 20 → 40 → 56px; tasarimin panel dolgusu (60px) genis ekranda.
   */
  const leafPadding = "px-5 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16";

  return (
    <section aria-labelledby="menu-page-title" className={surface}>
      {/*
       * Kabin dis olcusu.
       *
       * max-w 65rem (1040px) + yatay dolgu: cerceve genis ekranda ~992px'te
       * durur ve BUYUMEZ, 2000px'te de ayni genislikte ortada kalir. Dolgu
       * 12 → 24px: 390px'lik ekranda kap kenardan 12px bosluk birakip geri
       * kalan her seyi kullanir.
       *
       * Ust bosluk bolum ritminin (4.5 / 7.375rem) uzerinde: bu sayfa bir bolum
       * degil, kendi basina duran bir sayfa ve ustunde fotograf yok.
       */}
      <div className="mx-auto w-full max-w-[65rem] px-3 pt-[6rem] pb-20 sm:px-6 sm:pt-[9.5rem] sm:pb-28">
        <Reveal>
          {/*
           * DIS CERCEVE (passe-partout): zemini YOK — dolgunun icinde sayfanin
           * kendi koyu zemini gorunur, kart bir parmak boslukla cerceveden
           * ayrilir. Bosluk 8 → 12 → 16px: dar ekranda incelir, yoksa 366px'lik
           * bir kartin icinden iki yandan 32px daha gider.
           */}
          <div className="border border-[var(--brand-frame-gold)] p-2 sm:p-3 lg:p-4">
            {/* IC CERCEVE + KART ZEMINI: tasarimdaki menu panelinin ta kendisi. */}
            <div className="border border-[var(--brand-frame-gold)] bg-[var(--brand-surface-alt)]">
              {/*
               * KUNYE + BASLIK kabin ICINDE: kartin kapak sayfasi. Altinda
               * kategori capalari, ikisini yapraklardan altin bir cizgi ayirir.
               */}
              <div
                className={`${leafPadding} border-b border-[var(--brand-frame-gold)]`}
              >
                <SectionHead
                  eyebrow={t.menu.eyebrow}
                  title={t.menu.title}
                  titleId="menu-page-title"
                  note={t.menu.pageIntro}
                />

                {/*
                 * Kategori capalari: tek kategori varsa gezinmeye gerek yok,
                 * liste zaten tek parca. flex-wrap: dar ekranda alt alta sarar,
                 * yatay kaydirma gerektirmez.
                 */}
                {categories.length > 1 ? (
                  <nav aria-label={t.menu.eyebrow} className="mt-10">
                    <Hairline tone="gold" />
                    <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-3 pt-6">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <a
                            href={`#${anchorId(category.id)}`}
                            className={`${meta} transition-colors hover:text-[var(--brand-accent)]`}
                          >
                            <Latin>{category.name}</Latin>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ) : null}
              </div>

              {/*
               * YAPRAKLAR: aralarinda bosluk YOK, ayrim yalnizca renk
               * kontrastindan geliyor (tasarimdaki iki menu panelinin ayni
               * kontrasti). Siralama tek/cift oldugu icin ard arda iki ayni
               * renk gelmez; ayri bir ayrac cizgisine gerek kalmaz.
               */}
              {categories.map((category, index) => {
                // Tek sayili kategoriler krem yaprak (tasarimdaki sag panel).
                const isLight = index % 2 === 1;
                /* Fotograf sutunu kategori bazinda acilir. */
                const withImages = anyItemHasImage(content, category.items);

                const leaf = isLight
                  ? "bg-[var(--brand-accent)] text-[var(--brand-surface)]"
                  : "text-[var(--brand-ink)]";
                const accentTone = isLight
                  ? "text-[var(--brand-primary-deep)]"
                  : "text-[var(--brand-primary)]";
                const ruleTone = isLight
                  ? "border-[var(--brand-rule-on-accent)]"
                  : "border-[var(--brand-rule-soft)]";
                const descTone = isLight
                  ? "text-[var(--brand-ink-on-accent-muted)]"
                  : "text-[var(--brand-ink-muted)]";

                return (
                  <div
                    key={category.id}
                    id={anchorId(category.id)}
                    /*
                     * scroll-mt: capadan gelindiginde kategori adi ekranin en
                     * ust kenarina yapismasin.
                     */
                    className={`${leaf} ${leafPadding} scroll-mt-8`}
                  >
                    {/*
                     * Kategori basligi listenin USTUNDE, yaprak genisligince.
                     * NEDEN YAN KOLON DEGIL: 840px'lik bir kapta 280px'lik
                     * yapiskan bir kategori kolonu urun satirina kol boyu yer
                     * birakmiyordu; dar kapta baslik listeyi tasiyan bir ust
                     * bant olarak daha basili menu gibi duruyor.
                     */}
                    <h3
                      className={`brand-body brand-eyebrow text-[0.6875rem] leading-[1.6] ${accentTone}`}
                    >
                      <Latin>{category.name}</Latin>
                    </h3>

                    {/*
                     * gap-y YOK: dikey ritmi satirlarin kendi dolgusu ve ust
                     * ayraci kuruyor. Tek kolon — kap zaten okunur genislikte,
                     * ikiye bolmek satiri gereksiz kisaltirdi.
                     */}
                    <ul className="mt-6">
                      {category.items.map((item) => (
                        <li
                          key={item.id}
                          className={`flex items-baseline justify-between gap-4 border-t py-[1.1875rem] sm:gap-8 ${ruleTone}`}
                        >
                          {/*
                           * min-w-0: uzun ad sarsin, fiyatin uzerine binmesin.
                           *
                           * break-words TEK BASINA min-w-0 YETMEDIGI ICIN: bosluksuz
                           * uzun bir urun adi (ornegin Almanca bir bilesik kelime)
                           * sarilamayinca kolon sifira kadar eziliyor ve metin
                           * kabin disina tasiyor — 390px'te sayfa yatay kayiyordu.
                           * overflow-wrap kalitsal oldugu icin ad, "one cikan"
                           * etiketi ve aciklama tek yerden kapsanir.
                           */}
                          <div className="flex min-w-0 items-center gap-4 break-words">
                            {withImages ? (
                              /* Ayni altin cerceveli kare; ana sayfadaki
                                 vitrinle ayni dil. */
                              <span
                                className={`relative block size-14 shrink-0 overflow-hidden rounded-[var(--brand-radius)] sm:size-16 ${itemThumb(content, item) ? "border border-[var(--brand-rule-soft)] bg-[var(--brand-surface-alt)]" : ""}`}
                              >
                                {itemThumb(content, item) ? (
                                  <Image
                                    src={itemThumb(content, item) as string}
                                    alt=""
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                  />
                                ) : null}
                              </span>
                            ) : null}

                            <div className="min-w-0">
                            <p className="brand-display text-[1.3125rem] leading-[1.3] text-pretty">
                              <Latin>{item.name}</Latin>
                            </p>

                            {item.isFeatured ? (
                              <p
                                className={`brand-body brand-eyebrow mt-[0.3125rem] text-[0.6875rem] leading-[1.6] ${accentTone}`}
                              >
                                {t.menu.featured}
                              </p>
                            ) : null}

                            {item.description ? (
                              <p
                                className={`mt-[0.3125rem] text-[0.8125rem] leading-[1.6] text-pretty ${descTone}`}
                              >
                                {item.description}
                              </p>
                            ) : null}
                            </div>
                          </div>

                          {item.price ? (
                            <p
                              className={`brand-display shrink-0 text-[1.1875rem] leading-[1.3] tabular-nums ${accentTone}`}
                              dir="ltr"
                            >
                              {item.price}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/*
         * Sayfanin kapanisi: ana sayfaya donus. Kabin DISINDA — kart bitti,
         * bu satir artik sayfanin kendisine ait.
         *
         * NEDEN ISLETME ADI: sozlukte "geri don" karsiligi yok ve uydurma metin
         * yazmak yasak. Isletme adi zaten ust seritteki marka baglantisinin
         * ayni isi yapiyor; burada temanin buton bicimiyle tekrarlaniyor.
         */}
        <div className="mt-14">
          <Hairline tone="gold" />
          <div className="pt-10">
            <Link href={`/${content.locale}`} className={goldButton}>
              <span className="tracking-[var(--brand-wordmark-tracking)]">
                {content.name}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
