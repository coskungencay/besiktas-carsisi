import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { paragraphs } from "@/themes/_shared/data";
import {
  SectionIndex,
  isSectionShown,
  meta,
  metaColumns,
  sectionGrid,
  sectionIndex,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Editoryal iki kolon: solda metin (ilk paragraf 27px "lead", devami 15px),
 * sagda isletmenin SAYISAL KUNYESI (monospace etiket/deger tablosu).
 *
 * DIKKAT: burasi calisma saatlerinin yeri DEGIL. Tasarimda gun gun saat
 * tablosu iletisim bolumunde duruyor; buraya konulunca yedi satirlik tablo bu
 * bolumu iki katina cikariyor ve sagdaki kunye tablosunun yerini aliyordu.
 *
 * Ne metin ne kunye varsa bolum hic basilmaz.
 */
export default function About({ content }: SectionProps) {
  const { about, name, t } = content;
  if (!isSectionShown(content, "hakkimizda")) return null;

  const body = paragraphs(about);
  const stats = metaColumns(content).about;

  // Ilk paragraf tasarimda buyuk puntolu giris cumlesi; kalani govde metni.
  const [lead, ...rest] = body;

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={sectionTop}>
        <div className={sectionGrid}>
          <SectionIndex index={sectionIndex(content, "hakkimizda")} title={t.about.title} titleId="about-title">
            <div className="grid gap-10 lg:grid-cols-10 lg:gap-6">
              <div className="lg:col-span-5">
                <Reveal variant="scale">
                  <p className="brand-display text-[clamp(1.25rem,2vw,1.6875rem)] leading-[1.42] tracking-[-0.015em] text-pretty">
                    {lead || fill(t.about.placeholder, { name })}
                  </p>
                </Reveal>

                {rest.length > 0 ? (
                  <Reveal delay={0.09}>
                    <div className="mt-[26px] flex max-w-[460px] flex-col gap-4 text-[15px] leading-[1.8] text-pretty text-[var(--brand-ink-soft)]">
                      {rest.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </Reveal>
                ) : null}
              </div>

              {stats.length > 0 ? (
                <div className="lg:col-span-4 lg:col-start-7">
                  <Reveal delay={0.16}>
                    {/*
                      Tasarimda bu tablonun USTUNDE baslik yok: etiketlerin
                      kendisi (MENU KALEMI, METREKARE) zaten sutunu acikliyor.
                      Son satirda alt cizgi de yok — tablo bosluga acik biter.
                    */}
                    <dl className="flex flex-col">
                      {stats.map((row, index) => (
                        <div
                          key={`${row.label}-${index}`}
                          className={`${meta} flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--brand-border)] py-[13px] last:border-b-0`}
                        >
                          <dt className="brand-eyebrow">{row.label}</dt>
                          {/* Deger koyu: tasarimda tablonun tek vurgusu bu. */}
                          <dd className="tabular-nums text-[var(--brand-ink)]">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </Reveal>
                </div>
              ) : null}
            </div>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
