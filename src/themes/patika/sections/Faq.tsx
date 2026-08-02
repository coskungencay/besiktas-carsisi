import { Reveal } from "@/components/motion/Reveal";
import { SectionHead, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Acilir kapanir soru satirlari.
 *
 * NEDEN <details>: JS gerektirmez, klavye ve ekran okuyucu destegi tarayicidan
 * gelir, cevap kapaliyken bile isaretlemede durur (arama motoru gorur).
 *
 * IZGARA DEGIL TEK KOLON: sorular farkli uzunlukta ve acilinca yukseklikleri
 * degisiyor; iki kolonda her tiklama komsu kolonu zipzip oynatirdi. Kartlar
 * yine menu izgarasinin 16px araligini (gap-4) ve kalin cercevesini tasiyor.
 *
 * Soru basligi BUYUK HARF degil (pk-title): menu kartlarindaki urun adlariyla
 * ayni kademede — bolum basliklari zaten dev buyuk harfi ustleniyor.
 */
export default function Faq({ content }: SectionProps) {
  // Musteri panelden kapattiysa ya da hic soru yoksa bolum hic basilmaz.
  if (!content.isVisible("sss")) return null;

  const { faq, t } = content;

  return (
    <section id="sss" aria-labelledby="faq-title" className={surface}>
      <div className={`${shell} pk-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.faq.eyebrow}
            title={t.faq.title}
            titleId="faq-title"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-10 flex flex-col gap-4">
            {faq.map((item) => (
              <li key={item.id}>
                <details className="pk-faq brand-frame bg-[var(--brand-surface-alt)] px-6 py-5 transition-colors hover:border-[var(--brand-primary)] sm:px-8 sm:py-7">
                  <summary className="flex items-start justify-between gap-6">
                    <h3 className="pk-title text-balance">{item.question}</h3>

                    {/*
                      Arti isareti: acikken tokens.css onu 45 derece dondurup
                      carpiya cevirir. Durum bilgisini <details> zaten ekran
                      okuyucuya veriyor, bu yuzden isaret dekoratif.
                    */}
                    <span
                      aria-hidden="true"
                      className="pk-faq-sign inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--brand-radius-pill)] border-[length:var(--brand-border-width)] border-[var(--brand-border)] text-[var(--brand-primary)]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        className="size-4"
                      >
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>

                  <p className="pk-lead mt-5 max-w-[52rem] text-pretty text-[var(--brand-ink-muted)]">
                    {item.answer}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
