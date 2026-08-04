import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { paragraphs } from "@/themes/_shared/data";
import {
  Plate,
  bodyTextSm,
  cellEdge,
  edgeBottom,
  gridBleed,
  gridClip,
  label,
  pad,
  padSm,
  shell,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimin "kayit" paftasi: beyan cumlesi (Plate'in basligi), altinda kalin
 * cizgilerle bolunmus numarali kutucuklar.
 *
 * NEDEN CALISMA SAATLERI BURADA DEGIL: tasarimda gun gun saat tablosu KONUM
 * bolumunun orta sutununda duruyor. Burada durdugunda yedi satirlik tablo
 * hakkimizda bolumunu iki katina cikariyor ve metni kenara itiyordu.
 *
 * NEDEN PARAGRAFLAR KUTUCUK: tasarimda bu bolum uc esit kutuya bolunmus, her
 * kutunun tepesinde mavi bir numara etiketi var. Duz bir metin blogu bu
 * paftayi sayfadaki tek "serbest" alan yapiyordu.
 */
export default function About({ content }: SectionProps) {
  const { about, name, openingHours, t } = content;

  // Gorunurluk kurali degismedi: metin de saat de yoksa bolum hic basilmaz.
  if (!about && openingHours.length === 0) return null;

  const body = paragraphs(about);
  const boxes = body.length > 0 ? body : [fill(t.about.placeholder, { name })];

  /*
   * Sutun sayisi kutu adediyle SINIRLI (en fazla 3): sabit uc sutunda tek
   * paragrafli bir metin, yaninda iki bos hucreyle asili kaliyordu.
   * Siniflar sabit yazilir; Tailwind calisma aninda uretilen sinif adini
   * goremez ve kural hic olusmaz.
   */
  const columns =
    boxes.length >= 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : boxes.length === 2
        ? "sm:grid-cols-2"
        : "";

  return (
    <section
      id="hakkimizda"
      aria-labelledby="about-title"
      className="bg-[var(--brand-surface)]"
    >
      {/* Bolumler birbirinden yalnizca 2px cizgiyle ayrilir; yan dolgu yok. */}
      <div className={shell} style={edgeBottom}>
        <Reveal>
          <Plate
            code="01"
            eyebrow={t.about.eyebrow}
            title={t.about.title}
            titleId="about-title"
          >
            {/*
              Tasarimda bu bolum sayfanin TEK ic dolgulu alani: kutucuk dizisi
              kenardan kenara degil, 34px iceride ve etrafinda 2px'lik kendi
              cercevesi var (liste ve saha paftalari tersine tam kenardan
              kenara). Diziyi tam kenara yaslamak bu paftayi digerlerinden
              ayirt edilemez hale getiriyordu.

              Cerceve KIRPMA KABINDA: hucreler kendi sag/alt kenarligini
              tasiyor, tasan son sutun/satir kirpiliyor ve dis cizgiyi cerceve
              veriyor — boylece kenarda cift cizgi olusmuyor.
            */}
            <div className={pad}>
              <div className={`${gridClip} brand-frame`}>
                <div className={`grid ${columns} ${gridBleed}`}>
                  {boxes.map((paragraph, index) => {
                    /*
                     * Tasarimin imzasi: dizinin SON kutusu ters murekkep. Tek
                     * kutu varsa uygulanmaz — o zaman bolumun tamami koyu bir
                     * bloga donusup sayfanin dengesini bozuyor.
                     */
                    const isInverted =
                      boxes.length > 1 && index === boxes.length - 1;

                    return (
                      <div
                        key={index}
                        /*
                         * Metin rengi TAM MUREKKEP, soluk degil: tasarimda bu
                         * kutulardaki paragraflara renk yazilmamis, yani govde
                         * rengini (#16171A) aliyorlar. Soluk murekkep kutulari
                         * dipnot gibi gosteriyordu.
                         */
                        className={`${padSm} ${
                          isInverted
                            ? "bg-[var(--brand-accent)] text-[var(--brand-primary-contrast)]"
                            : "bg-[var(--brand-surface)] text-[var(--brand-ink)]"
                        }`}
                        style={cellEdge}
                      >
                        {/* Kutu numarasi: sadece gorsel bir isaret. */}
                        <p
                          className={`${label} mb-[14px] tabular-nums ${
                            isInverted
                              ? "text-[var(--ts-primary-on-dark)]"
                              : "text-[var(--brand-primary)]"
                          }`}
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </p>

                        <p className={bodyTextSm}>{paragraph}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Plate>
        </Reveal>
      </div>
    </section>
  );
}
