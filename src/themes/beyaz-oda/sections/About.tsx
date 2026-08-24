import Image from "next/image";

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
  const { about, name, logoUrl, t } = content;
  if (!isSectionShown(content, "hakkimizda")) return null;

  const body = paragraphs(about);
  const stats = metaColumns(content).about;

  // Ilk paragraf tasarimda buyuk puntolu giris cumlesi; kalani govde metni.
  const [lead, ...rest] = body;

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={sectionTop}>
        <div className={sectionGrid}>
          <SectionIndex index={sectionIndex(content, "hakkimizda")} eyebrow={t.about.eyebrow}
            title={t.about.title} titleId="about-title">
            {/*
              GENIS YAYILAN DUZEN — dar bir metin sutunu DEGIL.

              Onceki iki hali de calismadi: once iki kolonlu sol hizali duzendi
              (ortalanmis basligin altinda kopuk duruyordu), sonra 68ch'lik dar
              bir ortalanmis sutun oldu (bu sefer sayfanin ortasinda ince bir
              serit gibi kaldi, saglar sollar bombos).

              Simdi: amblem ustte ortada, metin ONUN altinda IKI KOLONA
              yayiliyor ve kunye tablosu genis bir serit olarak en altta.
              Icerik ortalanmis ama sayfanin genisligini gercekten kullaniyor.
            */}
            <div className="mx-auto max-w-[76rem]">
              {logoUrl ? (
                <Reveal variant="scale">
                  <Image
                    src={logoUrl}
                    alt=""
                    aria-hidden="true"
                    width={128}
                    height={128}
                    /*
                      Amblemin kaynagi 185px; 112px'te 2x ekranda hala keskin.
                      Daha buyugu bulaniklasir (bkz. scripts/assets/README.md).
                    */
                    className="mx-auto mb-12 size-20 object-contain sm:size-28"
                  />
                </Reveal>
              ) : null}

              <Reveal variant="scale">
                <p /*
                    max-w OLCUSU 24ch DEGIL 34ch: display serif buyuk puntoda
                    zaten genis yer kapliyor, dar bir olcude 200 karakterlik
                    giris cumlesi sekiz satira bolunup blok gibi duruyordu.
                  */
                  className="bo-statement mx-auto max-w-[34ch] text-center text-[clamp(1.5rem,2.9vw,2.5rem)] leading-[1.28] text-balance">
                  {lead || fill(t.about.placeholder, { name })}
                </p>
              </Reveal>

              {rest.length > 0 ? (
                <Reveal delay={0.1}>
                  {/*
                    Govde IKI KOLON: tek sutunda satirlar ya cok uzuyor ya da
                    sayfanin ortasinda dar bir serit kaliyordu. Iki kolonda
                    satir uzunlugu okunur kaliyor ve blok genisligi doluyor.
                    Dar ekranda tek kolona duser.
                  */}
                  <div className="mt-14 columns-1 gap-12 text-[15px] leading-[1.9] text-pretty text-[var(--brand-ink-soft)] sm:text-[16px] md:columns-2">
                    {rest.map((paragraph, index) => (
                      <p key={index} className="mb-5 break-inside-avoid last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </Reveal>
              ) : null}

              {stats.length > 0 ? (
                <Reveal delay={0.18}>
                  {/*
                    Kunye artik alt alta bir tablo degil, genis bir SERIT:
                    dort deger yan yana, aralarinda dikey ayirac. Sayfanin
                    en altini kapatan yatay bir ritim.
                  */}
                  <dl className="mt-16 grid grid-cols-2 gap-px border-t border-[var(--brand-border)] bg-[var(--brand-border)] sm:mt-20 sm:grid-cols-4">
                    {stats.map((row, index) => (
                      <div
                        key={`${row.label}-${index}`}
                        className="flex flex-col items-center gap-2 bg-[var(--brand-surface)] px-4 py-8 text-center"
                      >
                        <dt className={`${meta} brand-eyebrow`}>{row.label}</dt>
                        <dd className="bo-title text-[clamp(1.375rem,2.4vw,1.875rem)] leading-none tabular-nums text-[var(--brand-ink)]">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              ) : null}
            </div>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
