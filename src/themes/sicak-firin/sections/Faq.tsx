import { Reveal } from "@/components/motion/Reveal";
import {
  SectionHead,
  dashedRow,
  shell,
  surface,
} from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tezgahtaki tabela: soru satirlari, aralarinda kesik cizgi.
 *
 * Izgara ILETISIM ile AYNI (5 + 7 kolon): ikisi de "solda baslik, sagda uzun
 * liste" duzeni. Hakkimizda artik uc esit kolon oldugu icin ona benzemiyor.
 *
 * Zemin BILEREK krem panel DEGIL, sayfanin kendi rengi: hemen ardindan gelen
 * konum ve iletisim bolumleri panel, uc panel arka arkaya sayfanin sonunu tek
 * bir bloga cevirirdi. Menu satirlari gibi cizgiyle akan bir liste araya nefes
 * koyuyor.
 *
 * NEDEN <details>: acilir cevap icin JS gerekmiyor, tarayici erisilebilirligi
 * kendi veriyor (klavye + ekran okuyucuya acik/kapali durumu) ve arama motoru
 * kapali cevabi da goruyor. Varsayilan ucgen isareti gizlenip yerine temanin
 * kendi arti isareti konuyor.
 */
export default function Faq({ content }: SectionProps) {
  // Panelden kapatilmis ya da hic soru girilmemisse bolum hic basilmaz.
  if (!content.isVisible("sss")) return null;

  const { faq, t } = content;

  return (
    <section id="sss" aria-labelledby="faq-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-13">
          <Reveal className="lg:col-span-5">
            <SectionHead
              eyebrow={t.faq.eyebrow}
              title={t.faq.title}
              titleId="faq-title"
            />
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7">
            <ul className="flex flex-col">
              {faq.map((item) => (
                <li key={item.id} className={dashedRow}>
                  <details className="group">
                    {/*
                      list-none + ::-webkit-details-marker: tarayicinin ucgeni
                      kapatiliyor. Satir ritmi menu satirlariyla ayni
                      (16px alt-ust, arada kesik cizgi).
                    */}
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 text-[length:var(--brand-lead)] text-pretty transition-colors group-open:text-[var(--brand-primary)] hover:text-[var(--brand-primary)] [&::-webkit-details-marker]:hidden">
                      <span className="min-w-0">{item.question}</span>

                      {/*
                        Arti isareti; acikken 45 derece donup carpiya donusuyor.
                        Susleme oldugu icin ekran okuyucudan gizli — durumu
                        zaten <details> kendisi bildiriyor.
                      */}
                      <span
                        aria-hidden="true"
                        className="relative mt-0.5 grid size-7 shrink-0 place-items-center rounded-[var(--brand-radius-pill)] bg-[var(--brand-surface-alt)] text-[var(--brand-primary)] transition-transform duration-300 group-open:rotate-45"
                      >
                        <span className="absolute h-px w-3 bg-current" />
                        <span className="absolute h-3 w-px bg-current" />
                      </span>
                    </summary>

                    {/*
                      Cevap govde tonunda ve satir olcusunde (15px): soru 17px
                      kaliyor, aradaki fark hiyerarsiyi kalin yazi kullanmadan
                      veriyor. pe-12, metnin arti isaretinin altina girmesini
                      onluyor.
                    */}
                    <p className="pb-5 pe-12 text-[length:var(--brand-text-row)] leading-relaxed font-light text-pretty text-[var(--brand-ink-soft)]">
                      {item.answer}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
