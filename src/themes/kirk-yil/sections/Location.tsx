import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  closedDayLabels,
  placeStamp,
  hoursRange,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  Ornament,
  SectionTitle,
  metaMuted,
  shell,
  surface,
} from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; ltr: boolean };

/**
 * GOMULU HARITA YOK. Google/OSM iframe'i her ziyaretcide harici bir istek
 * (KVKK + performans) demek; tasarimin dili de zaten canli harita degil, elle
 * cizilmis bir kroki (bkz. tokens.css .ky-map).
 *
 * Bolum tam simetrik: kroki cerceve icinde ortada, altinda adres, koordinat ve
 * saat ozeti, en altta hero'daki ile AYNI cerceveli bordo buton.
 *
 * Saat ozeti bilerek kisa: tam tablo Hakkimizda bolumunde, burada tekrar
 * edilirse sayfa ayni bilgiyi iki kez soylemis olur.
 */
export default function Location({ content }: SectionProps) {
  if (!content.isVisible("konum")) return null;

  const { contact, name, openingHours, t } = content;

  const coords = placeStamp(content);
  const range = hoursRange(openingHours);
  const closed = closedDayLabels(openingHours);

  const rows: Row[] = [
    range && { term: t.hours.label, value: range, ltr: true },
    closed.length > 0 && {
      term: t.hours.closed,
      value: closed.join(", "),
      ltr: false,
    },
  ].filter((row): row is Row => Boolean(row));

  /*
   * Yol tarifi hedefi: once musterinin panelde verdigi hazir harita linki,
   * yoksa koordinat, o da yoksa adres aramasi. Bolum zaten adres ya da harita
   * linki varken goruntulendigi icin son basamak daima calisir.
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
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionTitle
            eyebrow={t.location.eyebrow}
            title={t.location.title}
            titleId="location-title"
          />
        </Reveal>

        <Reveal delay={0.08}>
          {/* Kroki 1240px kapta max-w-3xl ile daraliyordu; tasarimda bolum sayfa
              genisliginde duruyor. */}
          <div className="mx-auto mt-12 w-full max-w-5xl text-center">
            {/*
              Passe-partout ile ayni cerceve mantigi, ama ky-sepia YOK: sepya
              arsiv fotografina ait, cizime uygulaninca kirli gorunuyor.
            */}
            <div className="brand-frame bg-[var(--brand-surface-alt)] p-2.5 sm:p-3">
              <div
                role="img"
                aria-label={fill(t.location.mapAlt, { name })}
                className="ky-map ky-paper relative aspect-[16/6] border border-[var(--brand-border)]"
              >
                {/* Isaret ortada: bu temada hicbir sey kenara yaslanmaz. */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    aria-hidden="true"
                    className="ky-pin size-2.5 rounded-full bg-[var(--brand-primary)]"
                  />
                </div>
              </div>
            </div>

            {contact.address ? (
              <p className="ky-prose mt-8 text-pretty">{contact.address}</p>
            ) : null}

            {coords ? (
              <p className={`${metaMuted} mt-3`} dir="ltr">
                {coords}
              </p>
            ) : null}

            {rows.length > 0 ? (
              <>
                <Ornament className="mt-7" />

                {/*
                  Hero kunyesiyle ayni satir duzeni: ayraclar ilk ogeden SONRA
                  basildigi icin RTL'de de dogru tarafta kalir.
                */}
                <dl className="mt-7 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-3">
                  {rows.map((row, index) => (
                    <div key={row.term} className="flex items-baseline gap-3">
                      {index > 0 ? (
                        <span
                          aria-hidden="true"
                          className="text-[var(--brand-accent)]"
                        >
                          |
                        </span>
                      ) : null}
                      <dt className={metaMuted}>{row.term}</dt>
                      <dd
                        className="ky-detail"
                        {...(row.ltr ? { dir: "ltr" as const } : {})}
                      >
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : null}

            {/*
              Olcusu hero'daki butonlarla ayni (12.5px / .2em yazi, 15px 32px);
              rengi bilerek bordo cerceve: bu sayfadan CIKAN tek baglanti,
              hero'daki cerceveli butondan ayrilmali.
            */}
            <p className="mt-9">
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-frame ky-btn-label inline-flex items-center gap-3 border-[var(--brand-primary)] px-8 py-[15px] text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-contrast)]"
              >
                <span>{t.location.directions}</span>
                <ArrowIcon className="size-3.5" />
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
