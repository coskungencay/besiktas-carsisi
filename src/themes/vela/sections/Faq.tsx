import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import {
  Hairline,
  label,
  proseSm,
  sectionTop,
  shell,
  surface,
} from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * SSS, "deneyim" bolumunun asimetrik duzenini tekrar eder: solda 280px'lik
 * kolonda SADECE etiket ve altinda kisa altin cizgi, sagda 1fr icerik.
 * Boylece sayfada ikinci bir "sakin baslik" ritmi olusuyor.
 *
 * NEDEN details/summary: acilir-kapanir davranis icin JS gerekmiyor, klavye
 * ve ekran okuyucu desteği tarayicidan geliyor, kapali cevaplar yine de
 * sayfa kaynaginda oldugu icin arama motoru goruyor.
 *
 * Isaret olarak ucgen degil ARTI kullanildi (acilinca dikey cubuk kayboluyor,
 * eksiye donuyor): tasarimda hicbir yerde dolu ucgen yok, her sey cizgi.
 * Varsayilan marker tokens.css'te gizleniyor.
 */
export default function Faq({ content }: SectionProps) {
  if (!content.isVisible("sss")) return null;

  const { faq, t } = content;

  return (
    <section id="sss" aria-labelledby="faq-title" className={surface}>
      <div className={`${shell} ${sectionTop}`}>
        <div className="grid gap-10 lg:grid-cols-[17.5rem_1fr] lg:gap-[4.375rem]">
          <Reveal>
            <p className={label}>{t.faq.eyebrow}</p>
            <Hairline tone="gold" className="mt-4" />
          </Reveal>

          <div>
            <Reveal delay={0.08}>
              {/* "Acilis cumlesi" olcusu — About ile ayni 38px / 1.4. */}
              <h2
                id="faq-title"
                className="brand-display max-w-[62.5rem] text-[clamp(1.625rem,3.4vw,2.375rem)] leading-[1.4] tracking-[-0.005em] text-pretty"
              >
                {t.faq.title}
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <ul className="mt-[3.625rem] border-t border-[var(--brand-rule-soft)]">
                {faq.map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-[var(--brand-rule-soft)]"
                  >
                    {/* group: arti isareti details'in acik halini dinliyor. */}
                    <details className="group">
                      <summary className="vl-summary flex cursor-pointer list-none items-start justify-between gap-8 py-[1.1875rem] transition-colors hover:text-[var(--brand-primary)]">
                        <span className="brand-display text-[1.3125rem] leading-[1.4] text-pretty">
                          <Latin>{item.question}</Latin>
                        </span>

                        {/*
                         * Arti isareti: iki cizgi ust uste. Ortalamayi grid
                         * yapiyor — mutlak konum + translate RTL'de kayardi.
                         */}
                        <span
                          aria-hidden="true"
                          className="mt-[0.4375rem] grid size-3 shrink-0 place-items-center"
                        >
                          <span className="col-start-1 row-start-1 h-px w-3 bg-[var(--brand-primary)]" />
                          <span className="col-start-1 row-start-1 h-3 w-px bg-[var(--brand-primary)] transition-transform duration-300 group-open:scale-y-0" />
                        </span>
                      </summary>

                      {/* Cevap satiri 46rem'de kesiliyor: uzun satir yorar. */}
                      <p
                        className={`vl-answer ${proseSm} max-w-[46rem] pb-[1.375rem]`}
                      >
                        {item.answer}
                      </p>
                    </details>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
