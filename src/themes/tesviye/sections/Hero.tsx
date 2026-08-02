import Image from "next/image";
import { Fragment } from "react";

import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  coordinateLabel,
  hasMenu,
  highlightsOrDerived,
  imageOrFallback,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  Sheet,
  bodyText,
  edgeBottom,
  edgeTop,
  hair,
  meta,
  mono,
  shell,
  specList,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tek kalin cerceveli pafta: ustte konum/koordinat seridi, altinda dosya
 * numarasi, dev baslik, cizgi ve iki bolmeli teknik ozet; en altta gorsel bandi.
 *
 * NEDEN burada <Reveal> YOK: bunlar ACILIS animasyonlari. Reveal viewport'a
 * girmeyi ve JS'i bekler; hero zaten ilk ekranda oldugu icin bu bekleme
 * gorunur bir gecikme yaratiyordu. Animasyonlar tokens.css'teki ts-* siniflari
 * ile CSS uzerinden, SSR ciktisiyla birlikte basliyor.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, heroImageUrl, contact, name, tagline, t } =
    content;

  // En fazla 4 kunye: tasarimdaki ozet tablosu da dort satiri gecmiyor.
  const highlights = highlightsOrDerived(content).slice(0, 4);
  const coords = coordinateLabel(contact.lat, contact.lng);

  /*
   * Baslik kelimelere bolunuyor.
   *
   * Tasarimda baslik UC satira elle bolunmus ve her satir sirayla yukseliyor.
   * Bizde baslik veritabanindan tek parca geliyor; satir sayisini bilemiyoruz.
   * Kelime bazinda bolmek ayni kademeli etkiyi veriyor ve satir sonu firsatini
   * bozmuyor (span'lar arasindaki bosluk gercek bir metin dugumu olarak kaliyor).
   */
  const headlineWords = heroHeadline.split(/\s+/).filter(Boolean);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="bg-[var(--brand-surface)]"
    >
      <div
        className={`${shell} py-[var(--brand-section-py)] sm:py-[var(--brand-section-py-lg)]`}
      >
        <Sheet>
          {contact.locality || coords ? (
            <div
              className={`ts-fade ${meta} flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-[18px] py-[14px] text-[var(--brand-ink-muted)]`}
              style={edgeBottom}
            >
              {contact.locality ? (
                <span className="inline-flex items-center gap-2">
                  {/* Tasarimdaki "acik" gostergesi: yaniyor-sonuyor kare. */}
                  <span
                    className="ts-blink size-2 shrink-0 bg-[var(--brand-primary)]"
                    aria-hidden="true"
                  />
                  {contact.locality}
                </span>
              ) : null}
              {coords ? (
                <span className="tabular-nums" dir="ltr">
                  {coords}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="px-4 py-10 sm:px-[var(--ts-pad)] sm:py-[2.5rem]">
            {tagline ? (
              <p
                className={`ts-fade-late brand-body text-[var(--ts-label-lg)] leading-[1.4] font-medium tracking-[var(--ts-track-eyebrow)] uppercase text-[var(--brand-primary)]`}
              >
                {tagline}
              </p>
            ) : null}

            <h1
              id="hero-title"
              className="ts-stagger brand-display mt-[22px] text-[var(--ts-hero)] leading-[var(--ts-hero-leading)] tracking-[var(--ts-hero-tracking)] text-balance uppercase"
            >
              {headlineWords.map((word, index) => (
                <Fragment key={index}>
                  {index > 0 ? " " : null}
                  <span className="inline-block">{word}</span>
                </Fragment>
              ))}
            </h1>

            {/* Tasarimin imzasi: soldan saga cizilen kalin ayrac. */}
            <div
              className="ts-wipe mt-[34px] mb-[26px] h-[var(--brand-border-width)] bg-[var(--brand-ink)]"
              aria-hidden="true"
            />

            <div className="ts-up-late">
              <div
                className={
                  heroSubline && highlights.length > 0
                    ? "grid gap-[34px] sm:grid-cols-2"
                    : "grid gap-[34px]"
                }
              >
                {heroSubline ? (
                  <p className={`${bodyText} text-[var(--brand-ink)]`}>
                    {heroSubline}
                  </p>
                ) : null}

                {highlights.length > 0 ? (
                  <dl className={specList}>
                    {highlights.map((highlight, index) => (
                      /*
                       * Satirlarda dikey dolgu YOK: tasarimda araligi 1.9'luk
                       * satir yuksekligi veriyor, ustune padding eklemek
                       * cetvel ritmini bozuyordu.
                       */
                      <div
                        key={index}
                        className={`${hair} flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1`}
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

              {hasMenu(content) ? (
                <a
                  href="#menu"
                  className={`${mono} mt-8 inline-flex items-center gap-2 bg-[var(--brand-primary)] px-6 py-4 text-[var(--brand-primary-contrast)] transition-colors hover:bg-[var(--brand-accent)]`}
                >
                  {t.hero.viewMenu}
                  <ArrowIcon className="size-3.5" />
                </a>
              ) : null}
            </div>
          </div>

          <div
            className="ts-fade-slow relative aspect-[16/10] w-full bg-[var(--brand-surface-alt)] sm:aspect-[21/8]"
            style={edgeTop}
          >
            <Image
              src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
              alt={fill(t.hero.coverAlt, { name })}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
        </Sheet>
      </div>
    </section>
  );
}
