import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import {
  SectionIndex,
  isSectionShown,
  rowNumber,
  sectionGrid,
  sectionIndex,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Sikca sorulanlar.
 *
 * <details>/<summary> kullaniliyor: JS gerekmez, klavyeyle acilir, arama
 * motoru cevabi HTML'de gorur. Tarayicinin uggen marker'i tokens.css'te
 * gizlendi; yerine iki hairline'dan cizilen "+" isareti var (.bo-plus) —
 * tasarimda ikon olmadigi icin isaret de cizgiden uretildi.
 *
 * Satir bicimi menu/yorumlar listeleriyle ayni: 36px indeks + metin + sagda
 * isaret, ince alt cizgi. Cevap acilinca soru hizasindan devam eder.
 */
export default function Faq({ content }: SectionProps) {
  if (!isSectionShown(content, "sss")) return null;

  const { faq, t } = content;

  return (
    <section id="sss" aria-labelledby="faq-title" className={surface}>
      <div className={sectionTop}>
        <div className={sectionGrid}>
          {/* Kisa etiket — gerekce Menu.tsx'te. */}
          <SectionIndex index={sectionIndex(content, "sss")} eyebrow={t.faq.eyebrow}
            title={t.faq.title} titleId="faq-title">
            <ul>
              {faq.map((item, index) => {
                const number = String(index + 1).padStart(2, "0");

                return (
                  <Reveal
                    as="li"
                    key={item.id}
                    delay={Math.min(index, 4) * 0.06}
                  >
                    <details className="border-b border-[var(--brand-border)]">
                      {/*
                        summary'nin icerigi TEK bir baslik elemani: HTML
                        summary'de ya duz metin ya da tek bir baslik kabul
                        ediyor. Bu yuzden izgarayi h3 tasiyor.
                      */}
                      <summary className="bo-summary transition-colors hover:text-[var(--brand-accent)]">
                        <h3 className="grid grid-cols-[36px_minmax(0,1fr)_11px] items-baseline gap-x-6 py-[22px]">
                          <span className={rowNumber} aria-hidden="true">
                            {number}
                          </span>

                          <span className="brand-display text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.35] tracking-[-0.015em] text-pretty">
                            <Latin>{item.question}</Latin>
                          </span>

                          {/*
                            Isaret baslikla ayni satirda dursun diye kucuk bir
                            ust bosluk; 1px cizgide baseline hizasi calismiyor.
                          */}
                          <span className="bo-plus mt-[7px]" aria-hidden="true" />
                        </h3>
                      </summary>

                      {/*
                        Cevap sorunun hizasindan basliyor: 36px indeks + 24px
                        gap = 60px. Mantiksal padding (ps) — Arapca'da sagdan.
                      */}
                      <div className="bo-answer pb-[24px] lg:ps-[60px]">
                        <p className="max-w-[620px] text-[15px] leading-[1.8] text-pretty text-[var(--brand-ink-soft)]">
                          {item.answer}
                        </p>
                      </div>
                    </details>
                  </Reveal>
                );
              })}
            </ul>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
