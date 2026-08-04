import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import {
  PlusIcon,
  SectionHeader,
  containerClass,
  sectionClass,
} from "@/themes/placeholder/parts";
import type { SectionProps } from "@/themes/types";

export default function Faq({ content }: SectionProps) {
  if (!content.isVisible("sss")) return null;

  const { faq, t } = content;

  return (
    <section id="sss" aria-labelledby="faq-title" className={sectionClass}>
      <div className={`${containerClass} brand-section`}>
        <Reveal>
          <SectionHeader
            eyebrow={t.faq.eyebrow}
            title={t.faq.title}
            titleId="faq-title"
          />
        </Reveal>

        {/*
         * <details> secildi: acilir-kapanir davranis icin JavaScript gerekmez,
         * klavye ve ekran okuyucu destegi tarayicidan gelir, kapali cevaplar
         * yine de HTML'de bulunur (arama motorlari okur).
         */}
        <ul className="mt-12 flex max-w-3xl flex-col gap-3">
          {faq.map((item, i) => (
            <Reveal as="li" key={item.id} delay={Math.min(i, 6) * 0.04}>
              <details className="brand-frame group bg-[var(--brand-surface-alt)] transition-colors open:border-[var(--brand-primary)]">
                {/* list-none + webkit kurali: tarayicinin varsayilan ucgeni gizlenir. */}
                <summary className="brand-display flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-start text-base leading-snug [&::-webkit-details-marker]:hidden">
                  <span><Latin>{item.question}</Latin></span>
                  <PlusIcon className="text-[var(--brand-ink-muted)] transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none" />
                </summary>

                <div className="border-t border-[var(--brand-border)] px-6 py-5 text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                  <p>{item.answer}</p>
                </div>
              </details>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
