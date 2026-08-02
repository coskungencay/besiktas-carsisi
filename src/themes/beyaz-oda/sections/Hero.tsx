import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  highlightsOrDerived,
  imageOrFallback,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import { meta, shell, surface } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimin imzasi: solda "— 00" indeksi, iki tonlu 60px baslik, soldan saga
 * cizilen ince ayrac, altinda uc kolon (metin / kunye / adres), en altta
 * kenardan kenara gorsel bandi.
 *
 * Acilis animasyonu Reveal ile DEGIL, tokens.css'teki CSS keyframe'leriyle
 * yapiliyor (bo-fade-2 / bo-up / bo-rule / bo-up-2). NEDEN: hero ilk ekranda;
 * scroll bekleyen bir gozlemci burada gec kalir, sunucudan gelen HTML aninda
 * animasyona baslamali. Ayrica ayracin "cizilme" hareketi scaleX gerektiriyor,
 * Reveal bunu vermiyor.
 *
 * Baslik `heroHeadline`ten gelir; musteri panelde bos biraktiysa icerik katmani
 * isletme adini koyar, yani burada asla bos olmaz.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, about, contact, heroImageUrl, name, t } =
    content;

  const highlights = highlightsOrDerived(content);
  // Hero'daki kisa tanitim: "hakkimizda"nin ilk paragrafi, yoksa slogan.
  const intro = about.split(/\n{2,}/)[0]?.trim() || content.tagline;

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      <div className={`${shell} pt-20 pb-24 sm:pt-[150px] sm:pb-[130px]`}>
        <div className="grid gap-6 lg:grid-cols-12">
          <p
            className="bo-index bo-fade-2 tracking-[0.04em] lg:col-span-2"
            aria-hidden="true"
          >
            — 00
          </p>

          <div className="lg:col-span-8 lg:col-start-3">
            <h1
              id="hero-title"
              className="bo-up brand-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.18] tracking-[-0.025em] text-balance"
            >
              {heroHeadline}
              {heroSubline ? (
                /*
                 * Tasarimda soluk devam KENDI satirinda basliyor; ayni satirda
                 * akmasi basligin iki tonlu ritmini bozuyor. block + bosluk
                 * yerine satir kirilmasi kullaniliyor ki metin uzunlugu
                 * degistiginde de ayni kalsin.
                 */
                <span className="block text-[var(--brand-ink-faint)]">
                  {heroSubline}
                </span>
              ) : null}
            </h1>

            {/* Tasarimda bu cizgi koyu (ink) ve soldan saga cizilir. */}
            <div className="bo-rule mt-10 mb-[30px] h-px bg-[var(--brand-ink)] sm:mt-16" />

            <div className="bo-up-2 grid gap-6 sm:grid-cols-8">
              {intro ? (
                <p className="text-[15px] leading-[1.72] text-pretty text-[var(--brand-ink-soft)] sm:col-span-3">
                  {intro}
                </p>
              ) : null}

              {highlights.length > 0 ? (
                <dl className={`${meta} leading-[2] sm:col-span-2`}>
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-baseline gap-2">
                      <dt className="brand-eyebrow">{highlight.label}</dt>
                      {highlight.label && highlight.value ? (
                        <span aria-hidden="true">·</span>
                      ) : null}
                      <dd className="text-[var(--brand-ink)]">{highlight.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {contact.address ? (
                <div className="flex items-end justify-start sm:col-span-3 sm:justify-end">
                  <a
                    href={contact.mapsUrl || "#iletisim"}
                    {...(contact.mapsUrl
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-[3px] text-[13px] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                  >
                    <span className="text-pretty">{contact.address}</span>
                    <ArrowIcon className="size-3.5" />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Gorsel bandi kenardan kenara: tasarimda sayfanin alt sinirini o cizer. */}
      <Reveal>
        <div className="relative h-[320px] w-full bg-[var(--brand-surface-alt)] sm:h-[520px]">
          <Image
            src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
            alt={fill(t.hero.coverAlt, { name })}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
      </Reveal>
    </section>
  );
}
