import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  imageOrFallback,
  paragraphs,
} from "@/themes/_shared/data";
import { shell, surface } from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Hikaye: SOLDA cerceveli dikey fotograf, SAGDA metin ve kunye rakamlari.
 *
 * NEDEN IKI KOLON: tasarimda bu bolum sayfanin tek asimetrik yeri — her sey
 * ortalanmisken burada fotograf ve metin yan yana duruyor ve sayfaya nefes
 * aliyor. Onceki hali ortalanmis dar bir kolondu; hem tasarimdan uzaklasiyor
 * hem sayfayi gereksiz uzatiyordu.
 *
 * CALISMA SAATLERI BURADA DEGIL: tasarimda saatler adres bolumunde duruyor.
 * Yedi satirlik tablo hikayenin ortasinda bolumu iki katina cikariyordu.
 *
 * Fotograf cercevesi tasarimdaki gibi: 12px ic bosluk + ikincil zemin + ince
 * kenarlik; altinda italik altyazi.
 */
export default function About({ content }: SectionProps) {
  const { about, highlights, heroImageUrl, name, t } = content;

  if (!about && highlights.length === 0) return null;

  const body = paragraphs(about);

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${shell} pt-[110px]`}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-[76px]">
          <Reveal>
            {/*
              Panelde ayri bir "hikaye gorseli" alani yok; kapak gorseli
              kullaniliyor. Musteri gorsel yuklemediyse yer tutucu cercevede
              durur, bolum bos kalmaz.
            */}
            <div className="border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-3">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
                  alt={fill(t.hero.coverAlt, { name })}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            </div>

            <p className="ky-note mt-3 text-center text-[var(--brand-ink-muted)]">
              {fill(t.hero.coverAlt, { name })}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="ky-eyebrow text-[var(--brand-accent)]">
              {t.about.eyebrow}
            </p>

            <h2
              id="about-title"
              className="ky-h2 brand-display mt-3.5 text-balance"
            >
              {t.about.title}
            </h2>

            <div className="ky-prose mt-6 flex flex-col gap-5 text-pretty text-[var(--brand-ink-muted)]">
              {body.length > 0 ? (
                body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p>{fill(t.about.placeholder, { name })}</p>
              )}
            </div>

            {/*
              Kunye rakamlari (1986 / 3. kusak / kum ocaginda) tasarimda tam
              burada, metnin altinda ince cizginin uzerinde duruyor.

              DIKKAT: highlightsOrDerived KULLANILMAZ. Musteri kunye girmediginde
              o yardimci calisma saatinden satir uretiyor; ayni bilgi hero'daki
              muhurde ve adres bolumunde zaten var, ucuncu kez tekrar ederdi.
            */}
            {highlights.length > 0 ? (
              <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-6 border-t border-[var(--brand-border)] pt-7">
                {highlights.map((highlight, index) => (
                  <div key={index}>
                    <dd className="ky-stat brand-display text-[var(--brand-primary)]">
                      {highlight.value}
                    </dd>
                    <dt className="ky-eyebrow mt-1.5 text-[var(--brand-ink-muted)]">
                      {highlight.label}
                    </dt>
                  </div>
                ))}
              </dl>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
