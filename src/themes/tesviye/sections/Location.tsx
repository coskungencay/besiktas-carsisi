import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { coordinateLabel, hoursFromMonday } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  Plate,
  bodyText,
  bodyTextSm,
  cell,
  edgeBottom,
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
 * Tasarimin konum bolmesi UC SUTUN (1.2 / 0.9 / 0.9): solda adres ve
 * "haritada ac" dugmesi, ORTADA gun gun calisma saatleri, sagda sematik plan.
 *
 * NEDEN SAATLER BURADA: tasarimda gun gun tablo bu bolumun orta sutununda.
 * Hakkimizda bolumunde durdugunda hem orayi iki katina cikariyor hem de
 * ziyaretcinin "ne zaman acik, nerede" sorusunu iki ayri yere dagitiyordu.
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
  const hours = hoursFromMonday(openingHours);

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
  const hasHours = hours.length > 0;

  return (
    <section
      id="konum"
      aria-labelledby="location-title"
      className="bg-[var(--brand-surface)]"
    >
      <div className={shell} style={edgeBottom}>
        <Reveal>
          <Plate
            code="06"
            eyebrow={t.location.eyebrow}
            title={t.location.title}
            titleId="location-title"
          >
            <div
              className={`${splitGrid} ${
                hasHours
                  ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.9fr)]"
                  : "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]"
              }`}
            >
              <div className={`${cell} ${pad}`}>
                <h3 className={`${label} text-[var(--brand-primary)]`}>
                  {t.contact.address}
                </h3>

                {contact.address ? (
                  <p
                    className={`${bodyText} mt-[18px] text-[var(--brand-ink)]`}
                  >
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

                  {/* Tasarimda etiketle tablo arasi 18px. */}
                  <dl className="mt-[18px]">
                    {hours.map((hour, index) => (
                      /*
                       * Ayrac SATIRLAR ARASINDA: ilk satirin ustunde cizgi yok,
                       * cetvel asagi dogru bolunuyor.
                       */
                      <div
                        key={hour.dayOfWeek}
                        className={`${index > 0 ? hair : ""} ${bodyTextSm} flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-[10px]`}
                      >
                        <dt>{hour.dayLabel}</dt>
                        <dd className="font-medium tabular-nums">
                          {hour.isClosed ? (
                            t.hours.closed
                          ) : (
                            <span dir="ltr">
                              {hour.openTime}–{hour.closeTime}
                            </span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-5 text-[length:var(--ts-label)] leading-[1.8] font-light text-[var(--brand-ink-muted)]">
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
          </Plate>
        </Reveal>
      </div>
    </section>
  );
}
