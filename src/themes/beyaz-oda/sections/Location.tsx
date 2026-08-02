import { Reveal } from "@/components/motion/Reveal";
import { coordinateLabel } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionIndex,
  sectionGrid,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Konum.
 *
 * GOMULU HARITA YOK: iframe harici bir isteme ve ucuncu taraf cerezine yol
 * acardi (KVKK) ve sayfanin en agir parcasi olurdu. Yerine adres, koordinat,
 * calisma saati ozeti ve haritaya giden tek bir baglanti var.
 *
 * Harita yerine duran doku temanin kendi dilinden: 28px'lik hairline izgara
 * (.bo-plot) ve ortasinda cizgilerden kurulu bir nisan. Tamamen dekoratif,
 * bu yuzden aria-hidden — anlam tasiyan her sey yanindaki metinde.
 *
 * SAAT OZETI YOK: ayni iki satir ("Saat · 08–18", "Kapali · Pazar") hero'nun
 * kunye blogunda zaten duruyor, gun gun tablo da hemen alttaki iletisim
 * bolumunde. Ucuncu kez yazmak sayfayi uzatmaktan baska bir sey yapmiyordu.
 */
export default function Location({ content }: SectionProps) {
  if (!content.isVisible("konum")) return null;

  const { contact, t } = content;

  const coords = coordinateLabel(contact.lat, contact.lng);

  /*
   * Yol tarifi hedefi, elde olan en kesin veriden secilir: musterinin girdigi
   * harita linki > koordinat > adres aramasi. isVisible("konum") en az birinin
   * (adres veya mapsUrl) dolu oldugunu garanti ediyor, yani href asla bos kalmaz.
   */
  const directionsHref =
    contact.mapsUrl ||
    (contact.lat !== null && contact.lng !== null
      ? `https://www.google.com/maps?q=${contact.lat},${contact.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          contact.address,
        )}`);

  return (
    <section id="konum" aria-labelledby="location-title" className={surface}>
      <div className={sectionTop}>
        <div className={sectionGrid}>
          {/* Kisa etiket — gerekce Menu.tsx'te. */}
          <SectionIndex
            index="06"
            title={t.location.eyebrow}
            titleId="location-title"
          >
            <div className="grid gap-10 lg:grid-cols-10 lg:gap-6">
              <div className="lg:col-span-4">
                <Reveal>
                  <p className="brand-display text-[clamp(1.25rem,2vw,1.6875rem)] leading-[1.42] tracking-[-0.015em] text-balance">
                    {t.location.title}
                  </p>
                </Reveal>

                <Reveal delay={0.08}>
                  {contact.address ? (
                    <p className="mt-[26px] text-[15px] leading-[1.85] text-pretty text-[var(--brand-ink-soft)]">
                      {contact.address}
                    </p>
                  ) : null}

                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-[3px] text-[13px] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                  >
                    <span>{t.location.directions}</span>
                    <ArrowIcon className="size-3.5" />
                  </a>
                </Reveal>
              </div>

              {/*
                Tasarimda sag blok 12'li izgaranin 7. kolonunda basliyor; bu ic
                izgara 3. kolondan basladigi icin karsiligi 5. kolon (Iletisim
                bolumuyle ayni hiza).
              */}
              <div className="lg:col-span-6 lg:col-start-5">
                <Reveal delay={0.14}>
                  <div
                    className="bo-plot grid h-[200px] w-full place-items-center border border-[var(--brand-border)] sm:h-[260px]"
                    aria-hidden="true"
                  >
                    {/*
                      Uc parca da AYNI izgara hucresinde ust uste duruyor;
                      absolute + translate kullanilmadi cunku yatay ortalama
                      Arapca'da ters donerdi.
                    */}
                    <span className="h-px w-16 bg-[var(--brand-ink-faint)] [grid-row:1] [grid-column:1]" />
                    <span className="h-16 w-px bg-[var(--brand-ink-faint)] [grid-row:1] [grid-column:1]" />
                    <span className="size-[9px] bg-[var(--brand-accent)] [grid-row:1] [grid-column:1]" />
                  </div>

                  {/*
                    Koordinat, galeri kunyeleriyle ayni bicimde blogun altina
                    dusuyor; ayri bir etiket yazmiyoruz cunku sozlukte
                    karsiligi yok ve satirin kendisi zaten okunur.
                  */}
                  {coords ? (
                    <p
                      className="bo-index-sm brand-eyebrow mt-[10px]"
                      dir="ltr"
                    >
                      {coords}
                    </p>
                  ) : null}
                </Reveal>
              </div>
            </div>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
