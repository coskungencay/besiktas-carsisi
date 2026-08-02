import { Reveal } from "@/components/motion/Reveal";
import { paragraphs } from "@/themes/_shared/data";
import {
  SectionTitle,
  column,
  shell,
  surfaceAlt,
} from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Menu kartiyla AYNI kabuk: koyu zeminde ortalanmis dar bir kart, satirlari
 * ince cizgi ayirir. Boylece SSS sayfaya sonradan eklenmis bir blok gibi
 * degil, menunun arkasindaki ikinci sayfa gibi duruyor.
 *
 * <details>/<summary> KULLANILDI: JavaScript gerektirmez, klavyeyle acilir,
 * arama motoru cevabi kapali haldeyken de okur. Tarayicinin varsayilan ucgen
 * isareti tokens.css'te (.ky-summary) gizlenip yerine temanin elmasi konuldu.
 */
export default function Faq({ content }: SectionProps) {
  if (!content.isVisible("sss")) return null;

  const { faq, t } = content;

  return (
    <section id="sss" aria-labelledby="faq-title" className={surfaceAlt}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionTitle
            eyebrow={t.faq.eyebrow}
            title={t.faq.title}
            titleId="faq-title"
          />
        </Reveal>

        <div
          className={`${column} brand-frame mt-12 bg-[var(--brand-surface)] px-6 py-6 sm:px-12 sm:py-10`}
        >
          <ul className="flex flex-col">
            {faq.map((item, index) => (
              <Reveal
                key={item.id}
                as="li"
                delay={index === 0 ? 0 : 0.06}
                className="border-b border-[var(--brand-border)] last:border-b-0"
              >
                <details>
                  {/*
                    Soru satiri menu satiriyla ayni ritimde: 14px dikey bosluk,
                    metin basta, isaret sonda.
                  */}
                  <summary className="ky-summary flex cursor-pointer list-none items-baseline gap-5 py-3.5 text-start">
                    <span className="ky-prose flex-1 text-pretty">
                      {item.question}
                    </span>

                    {/* Ayractaki elmasin kucugu: kapali bos, acik dolu. */}
                    <span
                      aria-hidden="true"
                      className="ky-marker mt-2 size-1.5 shrink-0 border border-[var(--brand-accent)]"
                    />
                  </summary>

                  <div className="ky-detail flex flex-col gap-3 pb-5 pe-10 text-pretty text-[var(--brand-ink-muted)]">
                    {paragraphs(item.answer).map((paragraph, pIndex) => (
                      <p key={pIndex}>{paragraph}</p>
                    ))}
                  </div>
                </details>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
