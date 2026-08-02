import { Reveal } from "@/components/motion/Reveal";
import { placeStamp } from "@/themes/_shared/data";
import { SectionHeading, eyebrow, shell, surface } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ziyaret blogu: solda sola dayali baslik, adres ve iki hap dugme; sagda
 * avlunun sematik krokisi.
 *
 * GOMULU HARITA YOK: Google/OSM iframe'i her ziyaretcide harici bir istek ve
 * ucuncu taraf cerezi demek (KVKK + ilk boyama maliyeti). Yerine tasarimdaki
 * soyut plan dokusu (bkz. .ya-plot) duruyor; gercek yol tarifi tek bir
 * baglantiyla haritaya devrediliyor.
 *
 * GENISLIK: iki kolon sayfanin TAMAMINA yayilir. Onceki hali max-w-5xl ile
 * ortalanmisti; 1336px'lik seritte iki yan bos kaliyor, bolum tasarimdakinden
 * belirgin dar duruyordu. Tasarimda ziyaret 1fr 1fr / 80px bosluk.
 *
 * SAATLER BURADA DEGIL: tam liste Iletisim bolumunun kartinda; ayni yedi satiri
 * iki kez basmak sayfayi tekrara dusururdu.
 */
export default function Location({ content }: SectionProps) {
  if (!content.isVisible("konum")) return null;

  const { contact, t } = content;

  const coords = placeStamp(content);

  /*
   * Yol tarifi hedefi: once musterinin girdigi hazir harita linki, sonra
   * koordinat, en sonda adres aramasi. isVisible("konum") adres ya da harita
   * linkinden en az birini garanti ettigi icin pratikte hep dolu.
   */
  const directionsHref =
    contact.mapsUrl ||
    (contact.lat !== null && contact.lng !== null
      ? `https://www.google.com/maps?q=${contact.lat},${contact.lng}`
      : contact.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`
        : "");

  return (
    <section id="konum" aria-labelledby="location-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrowText={t.location.eyebrow}
              title={t.location.title}
              titleId="location-title"
              align="start"
            />

            {contact.address ? (
              /* Tasarimda adres blogu 16px / 1.9 ve 300 agirlikta. */
              <p className="mt-8 max-w-[32.5rem] text-base leading-[1.9] font-light text-pretty text-[var(--ya-prose)]">
                {contact.address}
              </p>
            ) : null}

            {/* Tasarimdaki ikili: dolu "yol tarifi" ve cerceveli telefon. */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              {directionsHref ? (
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ya-nav ya-pill brand-body inline-flex items-center bg-[var(--brand-primary)] px-[1.625rem] py-3.5 whitespace-nowrap text-[var(--brand-primary-contrast)] transition-opacity hover:opacity-85"
                >
                  {t.location.directions}
                </a>
              ) : null}

              {contact.phone ? (
                <a
                  href={contact.phoneHref}
                  dir="ltr"
                  className="ya-nav ya-pill brand-body inline-flex items-center border border-[color-mix(in_srgb,var(--brand-ink)_30%,transparent)] px-[1.625rem] py-3.5 whitespace-nowrap transition-colors hover:border-[var(--brand-ink)]"
                >
                  {contact.phone}
                </a>
              ) : null}
            </div>

            {coords ? (
              <p
                className="mt-6 text-xs tabular-nums text-[var(--brand-ink-muted)]"
                dir="ltr"
              >
                {coords}
              </p>
            ) : null}
          </Reveal>

          <Reveal delay={0.08}>
            {/*
             * Kroki tamamen DEKORATIF: gercek bir harita degil, tasarimdaki
             * plan dokusunun kendisi. Bu yuzden erisilebilirlik agacindan
             * gizli — adres ve saatler zaten metin olarak okunuyor.
             */}
            <div
              aria-hidden="true"
              className="ya-plot brand-rounded relative min-h-72 overflow-hidden"
            >
              {/* pb: isaret tasarimdaki gibi merkezin bir tik ustunde dursun. */}
              <div className="absolute inset-0 flex items-center justify-center pb-6">
                <span className="flex size-6 items-center justify-center rounded-full bg-[var(--brand-surface)]">
                  <span className="size-2.5 rounded-full bg-[var(--brand-primary)]" />
                </span>
              </div>

              {contact.locality ? (
                <p className={`${eyebrow} absolute bottom-4 start-5`}>
                  {contact.locality}
                </p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
