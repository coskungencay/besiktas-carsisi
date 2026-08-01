import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
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
  cell,
  edgeBottom,
  edgeTop,
  mono,
  shell,
  splitGrid,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Sutun sayisi kunye adedine gore secilir.
 *
 * NEDEN: splitGrid'de hucreler arasi bosluk kabin koyu zeminidir; son satir
 * eksik kalirsa bos hucre koyu bir blok olarak gorunur. Bu yuzden izgara her
 * zaman TAM dolacak sekilde kuruluyor.
 */
const HIGHLIGHT_COLUMNS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/**
 * Tek bir kalin cerceveli pafta: ustte koordinat/konum seridi, ortada dev
 * baslik, altinda kunyeler ayri ayri hucrelerde, en altta gorsel bandi.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, heroImageUrl, contact, name, tagline, t } =
    content;

  // En fazla 4 kunye: izgara sutun haritasi bu adede gore kurulu.
  const highlights = highlightsOrDerived(content).slice(0, 4);
  const coords = coordinateLabel(contact.lat, contact.lng);
  // Ust serit ayri bir DB alani degil: konum yoksa slogan ayni yeri doldurur.
  const strip = contact.locality || tagline;

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="bg-[var(--brand-surface)]"
    >
      <div className={`${shell} py-6 sm:py-10`}>
        <Reveal>
          <Sheet>
            {strip || coords ? (
              <div
                className={`${mono} flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2.5 text-[var(--brand-ink-muted)] sm:px-6`}
                style={edgeBottom}
              >
                {strip ? <span>{strip}</span> : null}
                {coords ? (
                  <span className="tabular-nums" dir="ltr">
                    {coords}
                  </span>
                ) : null}
              </div>
            ) : null}

            <div className="px-4 py-10 sm:px-6 sm:py-16">
              <h1
                id="hero-title"
                /*
                 * leading 0.9 + uppercase Turkce'de sorunlu: buyuk Ç ve Ş'nin
                 * kuyrugu satir kutusunun disina tasip alttaki metne giriyor.
                 * 1.02 blueprint sikiligini bozmadan kuyrugu iceride tutar.
                 */
                className="brand-display text-[clamp(2.5rem,9vw,6.5rem)] leading-[1.02] text-balance uppercase"
              >
                {heroHeadline}
              </h1>

              {heroSubline ? (
                <p className="mt-6 max-w-2xl text-sm leading-relaxed text-pretty text-[var(--brand-ink-muted)] sm:text-base">
                  {heroSubline}
                </p>
              ) : null}

              {hasMenu(content) ? (
                <a
                  href="#menu"
                  className={`${mono} mt-8 inline-flex items-center gap-2 bg-[var(--brand-primary)] px-5 py-3 text-[var(--brand-primary-contrast)] transition-opacity hover:opacity-85`}
                >
                  {t.hero.viewMenu}
                  <ArrowIcon className="size-3.5" />
                </a>
              ) : null}
            </div>

            {highlights.length > 0 ? (
              <dl
                className={`${splitGrid} ${
                  HIGHLIGHT_COLUMNS[highlights.length] ?? "grid-cols-2"
                }`}
                style={edgeTop}
              >
                {highlights.map((highlight, index) => (
                  <div key={index} className={`${cell} px-4 py-5 sm:px-6`}>
                    <dt className={`${mono} text-[var(--brand-ink-muted)]`}>
                      {highlight.label}
                    </dt>
                    <dd className="brand-display mt-2 text-xl uppercase sm:text-2xl">
                      {highlight.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div
              className="relative aspect-[16/10] w-full bg-[var(--brand-surface-alt)] sm:aspect-[21/8]"
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
        </Reveal>
      </div>
    </section>
  );
}
