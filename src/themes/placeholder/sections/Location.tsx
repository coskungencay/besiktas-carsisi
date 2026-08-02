import { Reveal } from "@/components/motion/Reveal";
import {
  ArrowIcon,
  SectionHeader,
  containerClass,
  sectionClass,
} from "@/themes/placeholder/parts";
import {
  closedDayLabels,
  coordinateLabel,
  hoursRange,
} from "@/themes/_shared/data";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; ltr: boolean };

export default function Location({ content }: SectionProps) {
  if (!content.isVisible("konum")) return null;

  const { contact, name, openingHours, t } = content;

  /*
   * GOMULU HARITA YOK: Google/OSM iframe'i her ziyarette harici istek ve
   * ucuncu taraf cerezi demek (KVKK + performans). Yerine adres, koordinat ve
   * haritayi yeni sekmede acan tek bir baglanti veriliyor.
   */
  const directionsHref =
    contact.mapsUrl ||
    (contact.lat !== null && contact.lng !== null
      ? `https://www.google.com/maps?q=${contact.lat},${contact.lng}`
      : contact.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`
        : "");

  const range = hoursRange(openingHours);
  const closed = closedDayLabels(openingHours);
  const coordinates = coordinateLabel(contact.lat, contact.lng);

  const rows: Row[] = [
    contact.address && {
      term: t.contact.address,
      value: contact.address,
      ltr: false,
    },
    range && { term: t.hours.label, value: range, ltr: true },
    closed.length > 0 && {
      term: t.hours.closed,
      value: closed.join(", "),
      ltr: false,
    },
  ].filter((row): row is Row => Boolean(row));

  return (
    <section id="konum" aria-labelledby="location-title" className={sectionClass}>
      <div className={`${containerClass} brand-section`}>
        <Reveal>
          <SectionHeader
            eyebrow={t.location.eyebrow}
            title={t.location.title}
            titleId="location-title"
          />
        </Reveal>

        {/* Iletisim bolumuyle ayni iki sutunlu kurgu: solda kunye, sagda kart. */}
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {rows.length > 0 ? (
            <Reveal>
              <dl className="flex flex-col">
                {rows.map((row) => (
                  <div
                    key={row.term}
                    className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-[var(--brand-border)] py-4"
                  >
                    <dt className="brand-eyebrow text-xs text-[var(--brand-ink-muted)]">
                      {row.term}
                    </dt>
                    <dd
                      className="flex-1 text-start text-base text-pretty"
                      {...(row.ltr ? { dir: "ltr" as const } : {})}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}

          <Reveal delay={0.1} className={rows.length === 0 ? "lg:col-span-2" : ""}>
            <div className="brand-frame flex flex-col gap-5 bg-[var(--brand-surface-alt)] p-6 sm:p-8">
              {/*
               * Eyebrow her zaman basligin USTUNDE ve ona yapisik (mt-4):
               * SectionHeader ile Hero (locality -> h1) ayni sirayi kullaniyor.
               */}
              <div>
                {contact.locality ? (
                  <p className="brand-eyebrow text-xs text-[var(--brand-ink-muted)]">
                    {contact.locality}
                  </p>
                ) : null}

                <h3
                  className={`brand-display text-xl ${contact.locality ? "mt-4" : ""}`}
                >
                  {name}
                </h3>
              </div>

              {coordinates ? (
                // Koordinat her dilde ayni yonde okunur; RTL'de ters donmesin.
                <p
                  dir="ltr"
                  className="text-start text-sm tabular-nums text-[var(--brand-ink-muted)]"
                >
                  {coordinates}
                </p>
              ) : null}

              {directionsHref ? (
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-rounded mt-1 inline-flex w-fit items-center gap-2 bg-[var(--brand-primary)] px-6 py-3 text-sm font-medium text-[var(--brand-primary-contrast)] transition-opacity hover:opacity-85"
                >
                  <span>{t.location.directions}</span>
                  <ArrowIcon />
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
