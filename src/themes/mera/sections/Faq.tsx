import { Reveal } from "@/components/motion/Reveal";
import {
  SectionHead,
  bodyText,
  page,
  sectionPad,
  surface,
} from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Sorular menu satirlariyla ayni ritimde okunur: her satir yalnizca alt
 * cizgisiyle ayrilir, kutu yoktur. Fark, satirin acilabilir olmasi.
 *
 * <details>/<summary> kullaniliyor: acilip kapanma tarayicinin isi, JavaScript
 * ve aria-expanded yonetimi gerekmiyor; cevap kapaliyken de belgede oldugu
 * icin arama motoru goruyor. Varsayilan ucgen isaretci tokens.css'te gizlenip
 * yerine tasarimin dilinden bir artı/eksi cizgisi konuyor.
 *
 * Cevap 620px'te durur — hero girisi ve bolum girislerinin okuma genisligi.
 */
export default function Faq({ content }: SectionProps) {
  if (!content.isVisible("sss")) return null;

  const { faq, t } = content;

  return (
    <section id="sss" aria-labelledby="faq-title" className={surface}>
      <div className={`${page} ${sectionPad}`}>
        <Reveal>
          <SectionHead
            eyebrow={t.faq.eyebrow}
            title={t.faq.title}
            titleId="faq-title"
          >
            <ul className="max-w-[820px] border-t border-[var(--brand-border)]">
              {faq.map((item, index) => (
                <Reveal
                  key={item.id}
                  as="li"
                  delay={index < 3 ? 0.08 : 0.14}
                  className="border-b border-[var(--brand-border)]"
                >
                  <details className="mera-detail">
                    <summary className="flex cursor-pointer items-baseline justify-between gap-8 py-4 text-[1rem] leading-[1.5] text-pretty transition-colors hover:text-[var(--brand-primary)]">
                      <span>{item.question}</span>
                      {/* Isaret salt gorsel; soruyu okuyan zaten satirin
                          acilabilir oldugunu <details> sayesinde biliyor. */}
                      <span
                        aria-hidden="true"
                        className="mera-sign relative mt-1.5 size-2.5 shrink-0 text-[var(--brand-primary)]"
                      />
                    </summary>

                    <p className={`${bodyText} mera-answer max-w-[620px] pb-5`}>
                      {item.answer}
                    </p>
                  </details>
                </Reveal>
              ))}
            </ul>
          </SectionHead>
        </Reveal>
      </div>
    </section>
  );
}
