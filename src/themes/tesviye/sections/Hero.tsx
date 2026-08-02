import Image from "next/image";
import { Fragment } from "react";

import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  hasMenu,
  highlightsOrDerived,
  imageOrFallback,
  paragraphs,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  actionLabel,
  bodyText,
  cell,
  edgeBottom,
  hair,
  shell,
  specList,
  splitGrid,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tek kalin cerceveli pafta, IKI BOLMELI: solda (1.55 pay) dosya numarasi,
 * dev baslik, kalin ayrac ve iki sutunlu teknik ozet; sagda (1 pay) mekan
 * gorseli ve altinda 96px yuksekliginde iki hucreli eylem seridi.
 *
 * NEDEN iki bolme: tasarimin imzasi bu bolunmus pafta. Gorseli basligin ALTINA
 * tam genislikte bir bant olarak koymak paftayi siradan bir "yazi + kapak
 * fotografi" duzenine dusuruyordu; sag bolme ve icindeki mavi eylem hucresi
 * hero'nun agirlik merkezini olusturuyor.
 *
 * NEDEN burada <Reveal> YOK: bunlar ACILIS animasyonlari. Reveal viewport'a
 * girmeyi ve JS'i bekler; hero zaten ilk ekranda oldugu icin bu bekleme
 * gorunur bir gecikme yaratiyordu. Animasyonlar tokens.css'teki ts-* siniflari
 * ile CSS uzerinden, SSR ciktisiyla birlikte basliyor.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, heroImageUrl, name, tagline, t } = content;

  // En fazla 4 kunye: tasarimdaki ozet tablosu da dort satiri gecmiyor.
  const highlights = highlightsOrDerived(content).slice(0, 4);

  /*
   * Sol bolmenin alt metni: tasarimda burada mekani anlatan kisa bir paragraf
   * var (slogan degil), o yuzden kaynak "hakkimizda"nin ilk paragrafi.
   *
   * NEDEN slogan yedegi YOK: slogan zaten ustteki dosya satirinda basiliyor;
   * ayni cumleyi paftada iki kez gostermek bolmeyi tekrar eden bir etikete
   * cevirirdi. Hakkimizda bossa bu satir hic cikmaz.
   */
  const intro = paragraphs(content.about)[0] ?? "";

  /*
   * Baslik kelimelere bolunuyor.
   *
   * Tasarimda baslik UC satira elle bolunmus ve her satir sirayla yukseliyor.
   * Bizde baslik veritabanindan tek parca geliyor; satir sayisini bilemiyoruz.
   * Kelime bazinda bolmek ayni kademeli etkiyi veriyor ve satir sonu firsatini
   * bozmuyor (span'lar arasindaki bosluk gercek bir metin dugumu olarak kaliyor).
   */
  const headlineWords = heroHeadline.split(/\s+/).filter(Boolean);

  /*
   * Tasarimdaki eylem seridi: solda mavi zeminli fiyat listesi, saginda konum.
   * Hedef bolum basilmiyorsa (menu bos, konum panelden kapali) hucre de
   * cikmaz; serit tek hucreye duser, hicbiri yoksa serit hic basilmaz.
   */
  const actions = [
    hasMenu(content) && {
      href: "#menu",
      label: t.hero.viewMenu,
      isPrimary: true,
    },
    content.isVisible("konum") && {
      href: "#konum",
      label: t.location.eyebrow,
      isPrimary: false,
    },
  ].filter(
    (action): action is { href: string; label: string; isPrimary: boolean } =>
      Boolean(action),
  );

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="bg-[var(--brand-surface)]"
    >
      {/*
        Bolum kenardan kenara: tasarimda hero'nun yani sira hicbir bolumde yan
        dolgu yok, bolumler birbirinden yalnizca alt cizgiyle ayriliyor.
        Semt ve calisma saati ust seride tasindi (tasarimda oradalar).
      */}
      <div className={shell} style={edgeBottom}>
        {/*
          Paftanin iki bolmesi. Ayirici cizgiyi izgara BOSLUGU veriyor
          (splitGrid): boylece dar ekranda bolmeler alt alta yigildiginda
          cizgi kendiliginden yatay olur, ayri bir kural gerekmez.
        */}
        <div
          className={`${splitGrid} lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]`}
        >
          {/* Tasarimda sol bolme dolgusu: 40px ust, 34px yan, 30px alt. */}
          <div
            className={`${cell} px-4 py-10 sm:px-[var(--ts-pad)] sm:pt-10 sm:pb-[1.875rem]`}
          >
            {tagline ? (
              <p
                className={`ts-fade-late brand-body text-[length:var(--ts-label-lg)] leading-[1.4] font-medium tracking-[var(--ts-track-eyebrow)] uppercase text-[var(--brand-primary)]`}
              >
                {/*
                  Tasarimin "dosya no 001" imzasi. Sadece gorsel bir isaret
                  (bolum paftalarindaki 01..07 kunyeleriyle ayni aile, ama uc
                  haneli — dosyanin kendisini isaret eder), o yuzden ekran
                  okuyuculardan gizli.
                */}
                <span aria-hidden="true" className="tabular-nums">
                  001 —{" "}
                </span>
                {tagline}
              </p>
            ) : null}

            <h1
              id="hero-title"
              className="ts-stagger brand-display mt-[22px] text-[length:var(--ts-hero)] leading-[var(--ts-hero-leading)] tracking-[var(--ts-hero-tracking)] break-words text-balance uppercase"
            >
              {headlineWords.map((word, index) => (
                <Fragment key={index}>
                  {index > 0 ? " " : null}
                  <span className="inline-block">{word}</span>
                </Fragment>
              ))}

              {/*
                Tasarimin imzasi: basligin bir parcasi mavi ve AYNI puntoda.
                Panelde baslik tek satirlik bir alan oldugu icin ikinci rengi
                "baslik devami" alanindan aliyoruz; boylece musteri kendi
                metnini yazdiginda da iki tonlu ritim korunuyor. Bu satiri
                kucuk puntoyla basmak tasarimin karakterini bozar.
              */}
              {heroSubline ? (
                <span className="block text-[var(--brand-primary)]">
                  {heroSubline}
                </span>
              ) : null}
            </h1>

            {/* Tasarimin imzasi: soldan saga cizilen kalin ayrac. */}
            <div
              className="ts-wipe mt-[34px] mb-[26px] h-[var(--brand-border-width)] bg-[var(--brand-ink)]"
              aria-hidden="true"
            />

            <div
              className={`ts-up-late grid gap-[34px] ${
                intro && highlights.length > 0 ? "sm:grid-cols-2" : ""
              }`}
            >
              {intro ? (
                <p className={`${bodyText} text-[var(--brand-ink)]`}>{intro}</p>
              ) : null}

              {highlights.length > 0 ? (
                <dl className={specList}>
                  {highlights.map((highlight, index) => (
                    /*
                     * Ayrac SATIRLAR ARASINDA: tasarimda ilk satirin ustunde
                     * cizgi yok, cetvel asagi dogru bolunuyor.
                     *
                     * Satirlarda dikey dolgu YOK: tasarimda araligi 1.9'luk
                     * satir yuksekligi veriyor, ustune padding eklemek
                     * cetvel ritmini bozuyordu.
                     */
                    <div
                      key={index}
                      className={`${index > 0 ? hair : ""} flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1`}
                    >
                      <dt>{highlight.label}</dt>
                      <dd className="text-[var(--brand-ink)]">
                        {highlight.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </div>

          {/* Sag bolme: gorsel + altinda eylem seridi, aralarinda kalin cizgi. */}
          <div
            className={`${splitGrid} ${
              actions.length > 0 ? "lg:grid-rows-[minmax(0,1fr)_auto]" : ""
            }`}
          >
            {/*
              Tasarimda gorsel bolmesi en az 380px ve KALAN yuksekligi doldurur
              (sol bolme uzadikca gorsel de uzar). Dar ekranda izgara tek
              sutuna dustugu icin yukseklik oran ile veriliyor.
            */}
            <div className="ts-fade-slow relative aspect-[16/10] w-full bg-[var(--brand-surface-alt)] sm:aspect-[21/9] lg:aspect-auto lg:min-h-[23.75rem]">
              <Image
                src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
                alt={fill(t.hero.coverAlt, { name })}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
                className="object-cover"
              />
            </div>

            {actions.length > 0 ? (
              <div
                className={`${splitGrid} ${
                  actions.length > 1 ? "sm:grid-cols-2" : ""
                }`}
              >
                {actions.map((action) => (
                  <a
                    key={action.href}
                    href={action.href}
                    /*
                     * Tasarimda serit 96px; metin ortalanmis ve tek satir.
                     * Dar ekranda hucreler ALT ALTA gectigi icin yukseklik
                     * 72px'e cekildi — iki kez 96px, telefonda gorselden
                     * daha fazla yer kaplayan bir dugme blogu yapiyordu.
                     * Ayni sebeple nowrap YOK: uzun cevirilerde metin ikinci
                     * satira sarkabilmeli.
                     */
                    className={`${actionLabel} flex min-h-[4.5rem] items-center justify-center gap-2 px-4 text-center transition-colors sm:min-h-[6rem] hover:bg-[var(--brand-accent)] hover:text-[var(--brand-primary-contrast)] ${
                      action.isPrimary
                        ? "bg-[var(--brand-primary)] text-[var(--brand-primary-contrast)]"
                        : "bg-[var(--brand-surface)] text-[var(--brand-ink)]"
                    }`}
                  >
                    {action.label}
                    {/* Tasarimda yalnizca ikinci hucrede ok var. */}
                    {action.isPrimary ? null : (
                      <ArrowIcon className="size-3.5" />
                    )}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
