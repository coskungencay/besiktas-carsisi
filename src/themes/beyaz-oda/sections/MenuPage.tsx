import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { hasMenu, menuWithItems } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import { meta, rowNumber } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tam menu SAYFASI (/tr/menu) — basili bir MENU KARTI olarak.
 *
 * NEDEN kap: sayfanin geri kalani 2200px'e kadar acilan editoryal izgarayi
 * kullaniyor, ama 30+ urunluk bir listede o genislik okunmuyor; goz urun
 * adindan fiyata varamiyor. Bu yuzden menu sayfasi kendi kabina aliniyor:
 * zemini soluk gri "masa", ustunde beyaz bir KAGIT.
 *
 * Kabin dili temanin dili — tasarimda gole, radius veya dolgulu kutu yok,
 * her sey 1px hairline. Kagit da oyle kuruluyor:
 *   - dis cerceve 1px, icinde ~14px passe-partout boslugu, sonra IKINCI 1px
 *     hairline (cift cerceve = basili kartin kenar suslemesi),
 *   - dar ekranda ic cerceve kalkar, boslugu kucuulur: 390px'te kagidin
 *     kendisi sayfayi doldurur, sadece 16px kenar boslugu kalir.
 *
 * Genislik 980px: 32px sira no + urun adi + 240px aciklama + 88px fiyat
 * dortlusunun ferah oturdugu, satirin bastan sona tek bakista okundugu
 * aralik. Genis ekranda BUYUMEZ, ortada durur.
 *
 * Yapiskan sol serit KALKTI: 980px'lik bir kagidin yaninda asili duran ikinci
 * bir kolon kabin butunlugunu bozuyordu. Kategori capalari artik kagidin
 * icinde, mastheadin altinda yatay bir "fihrist" satiri; dar ekranda sarar.
 *
 * Satir bicimi ana sayfadaki tasarimla ayni dort kolon: sira no / ad /
 * aciklama / fiyat. Urun gorseli YOK — tasarimin sadeligi bunu istiyor.
 */
export default function MenuPage({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { t } = content;
  const categories = menuWithItems(content);

  // Tasarimda urunler bastan sona numarali; numara kategoriye degil listeye ait.
  let counter = 0;

  // Tek kategori varsa capa listesi bir ise yaramaz, sadece etiketi tekrar eder.
  const showAnchors = categories.length > 1;

  const anchorId = (categoryId: number) => `menu-kategori-${categoryId}`;

  return (
    /*
     * Sayfa zemini surface-alt: kagidin (surface) kenari ancak farkli bir
     * zemin uzerinde okunur. Iki renk de tokens.css'ten geliyor.
     */
    <section
      id="menu"
      aria-labelledby="menu-page-title"
      className="bg-[var(--brand-surface-alt)] text-[var(--brand-ink)]"
    >
      {/*
        Kenar boslugu KABIN DISINDA: 390px'te 16px, tablette 32px, genis
        ekranda 48px (tasarimin kendi yan boslugu). Boylece kap kucuk ekranda
        tasmaz, buyuk ekranda kendi max genisliginde kalir.
      */}
      <div className="w-full px-4 pt-12 pb-16 sm:px-8 sm:pt-20 sm:pb-24 lg:px-12 lg:pt-28 lg:pb-32">
        {/*
          Kagit. Dis cerceve + passe-partout boslugu. p-2 (8px) dar ekranda,
          sm'den itibaren 14px — ic cerceve de orada devreye giriyor.
        */}
        <article className="mx-auto w-full max-w-[980px] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-2 sm:p-3.5">
          <div className="px-4 py-9 sm:border sm:border-[var(--brand-border)] sm:px-9 sm:py-12 lg:px-14 lg:py-16">
            {/*
              Masthead — kartin kunyesi. Tasarimda bolum indeksi alt alta iki
              satirdi; burada kagidin ust kenarinda soldan saga bir "sayfa
              basligi" seridi olarak duruyor. Dar ekranda alta sarar.
            */}
            <header>
              <div className="bo-index flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <p aria-hidden="true">— 02</p>
                <p className="brand-eyebrow">{t.menu.eyebrow}</p>
              </div>

              {/*
                Sayfanin h1'i: bu sayfada baska baslik yok (Header'daki marka
                bir baglanti). Punto tasarimin iletisim bolumuyle ayni olcekte;
                kap daraldigi icin vw katsayisi da kuculdu.
              */}
              <h1
                id="menu-page-title"
                className="brand-display mt-6 text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.18] tracking-[-0.025em] text-balance"
              >
                {t.menu.title}
              </h1>

              <p className={`${meta} brand-eyebrow mt-4`}>{t.menu.pageIntro}</p>
            </header>

            <div
              className={`mt-9 border-t border-[var(--brand-border)] ${showAnchors ? "pt-5" : "pt-10 sm:pt-12"}`}
            >
              {showAnchors ? (
                /*
                  Fihrist. flex-wrap: 8-10 kategoride dar ekranda yatay kaydirma
                  yerine alt satira sarmak tercih edildi — kaydirilabilir serit
                  gizli kalan kategorileri kullaniciya hic gostermiyor.
                */
                <nav aria-label={t.menu.eyebrow} className="pb-9 sm:pb-11">
                  <ul className={`${meta} flex flex-wrap gap-x-5 gap-y-2`}>
                    {categories.map((category) => (
                      <li key={category.id}>
                        {/*
                          Sayfa ici capa: next/link degil duz <a>. Ayni sayfada
                          kaldigimiz icin yonlendirmeye gerek yok, tarayicinin
                          kendi kaydirmasi yeterli.
                        */}
                        <a
                          href={`#${anchorId(category.id)}`}
                          className="brand-eyebrow border-b border-transparent pb-[2px] break-words transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                        >
                          {category.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}

              <div className="flex flex-col gap-12 sm:gap-14">
                {categories.map((category, categoryIndex) => (
                  <div key={category.id}>
                    <Reveal delay={categoryIndex === 0 ? 0 : 0.06}>
                      {/*
                        scroll-mt: capa ile gelindiginde kategori basligi
                        ekranin en ust pikseline yapismasin.
                      */}
                      <h2
                        id={anchorId(category.id)}
                        className={`${meta} brand-eyebrow scroll-mt-24`}
                      >
                        {category.name}
                      </h2>
                    </Reveal>

                    <ul className="mt-4">
                      {category.items.map((item, itemIndex) => {
                        counter += 1;
                        const number = String(counter).padStart(2, "0");

                        return (
                          <Reveal
                            as="li"
                            key={item.id}
                            delay={Math.min(itemIndex, 4) * 0.06}
                          >
                            {/*
                              Dar ekranda IKI kolon: soldaki dar serit sadece
                              sira numarasi, ad/aciklama/fiyat ikinci kolonda
                              alt alta. Kolon baslangiclari acikca yazili
                              (col-start) — aciklama ya da fiyat girilmediginde
                              kalan hucreler bosluga kaymasin diye.

                              lg'deki aciklama/fiyat kolonlari (240/88) kabin
                              980px'ine gore kisaldi: eski 320/100 bu genislikte
                              urun adina yer birakmiyordu.
                            */}
                            <div className="grid grid-cols-[28px_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 border-b border-[var(--brand-border)] py-5 sm:gap-x-6 sm:py-6 lg:grid-cols-[32px_minmax(0,1fr)_240px_88px]">
                              <span className={rowNumber} aria-hidden="true">
                                {number}
                              </span>

                              {/*
                                break-words: ad kolonu minmax(0,1fr) oldugu icin
                                track daralabiliyor, ama BOSLUKSUZ uzun bir urun
                                adi (bilesik yazilmis isimler) kendi hucresinden
                                tasip genis ekranda fiyat kolonunun uzerine
                                binerdi, dar ekranda da sayfayi yana kaydirirdi.
                              */}
                              <p className="brand-display text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.2] tracking-[-0.02em] break-words">
                                {item.name}
                                {item.isFeatured ? (
                                  <span className={`${meta} brand-eyebrow ms-3`}>
                                    {t.menu.featured}
                                  </span>
                                ) : null}
                              </p>

                              {/*
                                break-words aciklamada da gerekli: aciklama
                                kolonu (mobilde 1fr, lg'de 240px) dar, panelden
                                girilen bosluksuz uzun bir kelime (adres, uzun
                                bilesik ad) hucreden tasip lg'de fiyatin uzerine
                                biniyor, 390px'te sayfayi yana kaydiriyordu.
                              */}
                              {item.description ? (
                                <p className="col-start-2 text-[13.5px] leading-[1.6] break-words text-pretty text-[var(--brand-ink-muted)] lg:col-start-3">
                                  {item.description}
                                </p>
                              ) : null}

                              {/*
                                Fiyat her zaman soldan saga okunur (₺185,00),
                                ama yon ISARETI paragrafin KENDISINE verilemez:
                                o zaman text-end de "ltr sonu" = SAG olur ve
                                Arapca'da fiyat, satirin sonuna (sol kenar)
                                degil aciklama kolonuna yaslanirdi. Yon sadece
                                sayiyi saran bdi'ye veriliyor; hizalama
                                paragrafta mantiksal kaliyor.
                              */}
                              {item.price ? (
                                <p className="bo-mono col-start-2 text-[14px] tabular-nums lg:col-start-4 lg:text-end">
                                  <bdi dir="ltr">{item.price}</bdi>
                                </p>
                              ) : null}
                            </div>
                          </Reveal>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/*
              Ana sayfaya donus — kagidin ICINDE, son satirin altinda. Tasarimda
              "buton" diye bir bicim yok; birincil eylem hero ve iletisimdeki
              gibi alt cizgili metin + ok. Ok RTL'de kendiliginden donuyor, bu
              yuzden geri baglantisinda da ayni ikon kullanilabiliyor.
            */}
            <div className="mt-12 border-t border-[var(--brand-border)] pt-8">
              <Link
                href={`/${content.locale}`}
                className="inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-[3px] text-[13px] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
              >
                {/* Uygun sozluk anahtari yok; isletme adi baglantiyi anlatiyor. */}
                <span>{content.name}</span>
                <ArrowIcon className="size-3.5" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
