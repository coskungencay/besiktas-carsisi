import Link from "next/link";

import { ImageZoom } from "@/components/site/ImageZoom";
import { fill } from "@/i18n";
import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import {
  allMenuItems,
  anyItemHasImage,
  featuredItems,
  hasMenu,
  itemThumb,
  menuHref,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  Plate,
  actionLabel,
  bodyTextSm,
  cellEdge,
  edgeBottom,
  edgeTop,
  gridBleed,
  gridClip,
  hair,
  label,
  padSm,
  shell,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ana sayfadaki menu VITRINI.
 *
 * NEDEN VITRIN: tam fiyat cetveli artik /[locale]/menu sayfasinda. 30+ satirlik
 * cetvel ana sayfada okunmaz bir blok haline geliyordu; burada yalnizca birkac
 * urun ve tam listeye giden belirgin bir baglanti var.
 *
 * NEDEN CETVEL DEGIL KUTU: uc satirlik bir cetvel cetvel gibi durmuyor —
 * sutun basliklari ve kesintisiz numaralandirma anlamini yitiriyor. Onun
 * yerine tasarimin diger imzasi kullanildi: 2px cizgilerle bolunmus esit
 * hucreler (bkz. Hakkimizda'nin uc kutusu, Galeri'nin dort hucresi).
 *
 * Bolum id'si "menu" KALIR: nav capalari ve isVisible mantigi buna bagli.
 */
export default function Menu({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { t } = content;

  /*
   * Musteri hic urunu "one cikan" isaretlemediyse bolum bos kalmasin diye
   * menunun ilk urunlerine duseriz.
   */
  const featured = featuredItems(content, 3);
  const items =
    featured.length > 0 ? featured : allMenuItems(content).slice(0, 3);

  const withImages = anyItemHasImage(content, items);

  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      className="bg-[var(--brand-surface)]"
    >
      <div className={shell} style={edgeBottom}>
        <Reveal>
          <Plate
            code="02"
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          >
            {/*
              gridClip/gridBleed: hucre adedi 1-3 arasinda degisebilir; splitGrid'in
              zemin hilesi eksik satirda koyu bir blok birakirdi.
            */}
            <div className={gridClip}>
              <ul className={`grid sm:grid-cols-2 lg:grid-cols-3 ${gridBleed}`}>
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    className={`${padSm} flex flex-col gap-3`}
                    style={cellEdge}
                  >
                    {/*
                      Hucre kunyesi: tasarimda kutular "01 · Seffaflik" gibi
                      numarali mavi etiketle acilir. Numara gorsel bir isaret,
                      "one cikan" ise gercek bilgi — o yuzden ayri span'lar.
                    */}
                    <p
                      className={`${label} flex flex-wrap items-baseline gap-x-2 text-[var(--brand-primary)]`}
                    >
                      <span className="tabular-nums" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.isFeatured ? <span>{t.menu.featured}</span> : null}
                    </p>

                    {withImages ? (
                      /*
                        Fotograf hucrenin kunyesinden SONRA, kalin kenarlikli
                        bir kutu icinde: bu temada her sey cerceveli, cerceve
                        olmadan gorsel teknik belgeye yapistirilmis gibi durur.
                        Fotografsiz urunde ayni yer bos kalir ki uc hucrenin
                        basliklari ayni hizadan bassin.
                      */
                      <div
                        className={`relative aspect-[4/3] w-full overflow-hidden rounded-[var(--brand-radius)] ${itemThumb(content, item) ? "border-[length:var(--brand-border-width)] border-[var(--brand-border)] bg-[var(--brand-surface-alt)]" : ""}`}
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
                            sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 90vw"
                          />
                        ) : null}
                      </div>
                    ) : null}

                    {/*
                      Urun adi kart olcusunde (30px) Anton: cetveldeki 19px'lik
                      satirdan buyuk, cunku burada urun tek basina duruyor.
                    */}
                    <h3 className="brand-display text-[length:var(--ts-card-title)] leading-[var(--ts-title-leading)] text-balance uppercase">
                      <Latin>{item.name}</Latin>
                    </h3>

                    {item.description ? (
                      /*
                       * line-clamp: vitrinde aciklama kisa tutulur, tam metin
                       * menu sayfasinda. Ayni zamanda uc hucrenin yuksekligini
                       * birbirine yaklastirir.
                       */
                      <p
                        className={`${bodyTextSm} line-clamp-2 flex-1 text-[var(--brand-ink-muted)]`}
                      >
                        {item.description}
                      </p>
                    ) : null}

                    {item.price ? (
                      /*
                       * Fiyat hucrenin ALTINA yaslanir (mt-auto): hucreler
                       * farkli yukseklikte bile fiyatlar ayni hizada okunur.
                       * Ince ayrac cetveldeki satir cizgisinin ayni kalemi.
                       */
                      <p
                        className={`${hair} mt-auto pt-3 text-[length:var(--ts-body)] font-medium tabular-nums`}
                        dir="ltr"
                      >
                        {item.price}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            {/*
              Bolumun asil isi: tam menuye gonderen cagri. Bicim hero'nun
              altindaki mavi eylem hucresiyle AYNI — temada "ana buton" bu.
            */}
            <Link
              href={menuHref(content)}
              className={`${actionLabel} flex min-h-[4.5rem] items-center justify-center gap-2 bg-[var(--brand-primary)] px-4 text-center text-[var(--brand-primary-contrast)] transition-colors sm:min-h-[6rem] hover:bg-[var(--brand-accent)]`}
              style={edgeTop}
            >
              {t.menu.viewAll}
              <ArrowIcon className="size-3.5" />
            </Link>
          </Plate>
        </Reveal>
      </div>
    </section>
  );
}
