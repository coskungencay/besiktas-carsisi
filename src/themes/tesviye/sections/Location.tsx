import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  closedDayLabels,
  coordinateLabel,
  hoursFromMonday,
  hoursRange,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  Sheet,
  SheetHead,
  bodyText,
  bodyTextSm,
  cell,
  hair,
  label,
  meta,
  mono,
  pad,
  shell,
  splitGrid,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimin konum bolmesi: solda adres ve "yol tarifi" dugmesi, ortada
 * calisma saati ozeti, sagda sematik plan kutusu.
 *
 * NEDEN GOMULU HARITA YOK: Google/OSM iframe'i her ziyaretcide ucuncu tarafa
 * istek atar (KVKK) ve sayfanin en agir kaynagi olur. Tasarimda da gercek bir
 * harita degil, cizgisel bir plan dokusu vardi; adres, koordinat ve harici
 * "yol tarifi al" baglantisi ayni isi harici istek olmadan goruyor.
 */
export default function Location({ content }: SectionProps) {
  if (!content.isVisible("konum")) return null;

  const { contact, name, openingHours, t } = content;

  const coords = coordinateLabel(contact.lat, contact.lng);
  const range = hoursRange(openingHours);
  const closed = closedDayLabels(hoursFromMonday(openingHours));

  /*
   * Yol tarifi hedefi, elde olan en kesin veriden secilir:
   * musterinin girdigi harita linki > koordinat > adres aramasi.
   */
  const directionsHref =
    contact.mapsUrl ||
    (contact.lat !== null && contact.lng !== null
      ? `https://www.google.com/maps?q=${contact.lat},${contact.lng}`
      : contact.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            contact.address,
          )}`
        : "");

  // Bos hucre koyu bir blok birakir; sutun sayisi dolu bolme sayisiyla ayni.
  const hasHours = Boolean(range) || closed.length > 0;

  return (
    <section
      id="konum"
      aria-labelledby="location-title"
      className="bg-[var(--brand-surface)]"
    >
      <div
        className={`${shell} pb-[var(--brand-section-py)] sm:pb-[var(--brand-section-py-lg)]`}
      >
        <Sheet>
          <Reveal>
            <SheetHead
              code="06"
              eyebrow={t.location.eyebrow}
              title={t.location.title}
              titleId="location-title"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div
              className={`${splitGrid} ${
                hasHours
                  ? "lg:grid-cols-[1.2fr_0.9fr_0.9fr]"
                  : "lg:grid-cols-[1.2fr_0.9fr]"
              }`}
            >
              <div className={`${cell} ${pad}`}>
                <h3 className={`${label} text-[var(--brand-primary)]`}>
                  {t.contact.address}
                </h3>

                {contact.address ? (
                  <p className={`${bodyText} mt-[18px] text-[var(--brand-ink)]`}>
                    {contact.address}
                  </p>
                ) : null}

                {coords ? (
                  <p
                    className={`${meta} mt-4 tabular-nums text-[var(--brand-ink-muted)]`}
                    dir="ltr"
                  >
                    {coords}
                  </p>
                ) : null}

                {directionsHref ? (
                  /* Tasarimdaki "Haritada aç": kalin cerceve, hover'da ters murekkep. */
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${mono} brand-frame mt-[22px] inline-flex items-center gap-2 px-6 py-3 transition-colors hover:bg-[var(--brand-accent)] hover:text-[var(--brand-primary-contrast)]`}
                  >
                    {t.location.directions}
                    <ArrowIcon className="size-3.5" />
                  </a>
                ) : null}
              </div>

              {hasHours ? (
                <div className={`${cell} ${pad}`}>
                  <h3 className={`${label} text-[var(--brand-primary)]`}>
                    {t.about.openingHours}
                  </h3>

                  {range ? (
                    /*
                     * Gunluk tablo Hakkimizda paftasinda zaten var; burada
                     * yalnizca ozet aralik, tasarimin buyuk rakam dilinde.
                     */
                    <p
                      className="brand-display mt-[18px] text-[var(--ts-title)] leading-[var(--ts-title-leading)] tabular-nums"
                      dir="ltr"
                    >
                      {range}
                    </p>
                  ) : null}

                  {closed.length > 0 ? (
                    <dl className="mt-5">
                      {closed.map((dayLabel) => (
                        <div
                          key={dayLabel}
                          className={`${hair} ${bodyTextSm} flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-[10px]`}
                        >
                          <dt>{dayLabel}</dt>
                          <dd className="font-medium">{t.hours.closed}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  <p className="mt-5 text-[var(--ts-label)] leading-[1.8] font-light text-[var(--brand-ink-muted)]">
                    {t.about.hoursNote}
                  </p>
                </div>
              ) : null}

              <div className={`${cell} ${pad}`}>
                <h3 className={`${label} text-[var(--brand-primary)]`}>
                  {t.location.eyebrow}
                </h3>

                {/*
                 * Sematik plan: doku tokens.css'teki --ts-plan'dan geliyor.
                 * Isaret ortalamasi flex ile yapiliyor — start/translate ikilisi
                 * RTL'de isareti ters yone kaydiriyordu.
                 */}
                <div
                  role="img"
                  aria-label={fill(t.location.mapAlt, { name })}
                  className="brand-frame mt-[18px] flex h-[132px] items-center justify-center bg-[var(--brand-surface-alt)] sm:h-[160px]"
                  style={{ backgroundImage: "var(--ts-plan)" }}
                >
                  <span
                    className="size-[10px] bg-[var(--brand-primary)]"
                    style={{
                      boxShadow:
                        "0 0 0 var(--brand-border-width) var(--brand-border)",
                    }}
                    aria-hidden="true"
                  />
                </div>

                {contact.locality ? (
                  <p className={`${meta} mt-4 text-[var(--brand-ink-muted)]`}>
                    {contact.locality}
                  </p>
                ) : null}
              </div>
            </div>
          </Reveal>
        </Sheet>
      </div>
    </section>
  );
}
