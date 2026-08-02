import { Reveal } from "@/components/motion/Reveal";
import {
  closedDayLabels,
  coordinateLabel,
  hoursRange,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionHead,
  pillLine,
  pillSolid,
  shell,
  surface,
} from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

type HourRow = { term: string; value: string; accent: boolean };

/**
 * "Bizi bul" bloku — GOMULU HARITA YOK.
 *
 * NEDEN: Google/OSM iframe'i ziyaretcinin IP'sini ucuncu tarafa acar (KVKK) ve
 * koyu temada kendi acik gri karesiyle afisin icinde delik gibi durur. Yerine
 * tasarimin kendi malzemesi kullaniliyor: kalin cerceve, koordinat rozeti ve
 * dolu neon bir "yol tarifi" butonu.
 *
 * BLOK KOYU: hemen altindaki iletisim bolumu tasarimda lime bir kutu. Burasi da
 * dolu renk olsaydi sayfa iki dev renk blogu ile ust uste kapanirdi; koyu blok
 * lime kapanisa dogru bir kademe hazirliyor.
 *
 * Saatler burada OZET: tam hafta cetveli zaten "hakkimizda" bolumunde gun
 * kartlari olarak var, ayni listeyi ikinci kez basmak tekrar olurdu.
 */
export default function Location({ content }: SectionProps) {
  // Musteri panelden kapattiysa ya da adres/harita linki yoksa bolum basilmaz.
  if (!content.isVisible("konum")) return null;

  const { contact, openingHours, t } = content;

  const coords = coordinateLabel(contact.lat, contact.lng);
  const address = contact.address.trim();

  /*
   * Yol tarifi hedefi, elde ne varsa ona gore: once musterinin kendi harita
   * linki, sonra koordinat, en son adres aramasi. Ucu de yoksa buton basilmaz
   * (bolum zaten adres ya da harita linki olmadan gorunmuyor).
   */
  const directionsHref =
    contact.mapsUrl ||
    (contact.lat !== null && contact.lng !== null
      ? `https://www.google.com/maps?q=${contact.lat},${contact.lng}`
      : address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
        : "");

  const range = hoursRange(openingHours);
  const closed = closedDayLabels(openingHours);

  const hourRows: HourRow[] = [
    range && { term: t.hours.label, value: range, accent: false },
    closed.length > 0 && {
      term: t.hours.closed,
      value: closed.join(", "),
      accent: true,
    },
  ].filter((row): row is HourRow => Boolean(row));

  return (
    <section id="konum" aria-labelledby="location-title" className={surface}>
      <div className={`${shell} pk-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.location.eyebrow}
            title={t.location.title}
            titleId="location-title"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="brand-frame mt-10 grid gap-10 bg-[var(--brand-surface-alt)] p-6 sm:p-10 lg:grid-cols-[1.25fr_0.8fr] lg:gap-11">
            <div>
              {address ? (
                <p className="pk-title max-w-[30rem] text-balance">{address}</p>
              ) : null}

              {coords ? (
                /* Koordinat her zaman soldan saga okunur; Arapca'da da ters cevrilmez. */
                <p className={`${pillLine} pk-meta mt-6`} dir="ltr">
                  {coords}
                </p>
              ) : null}

              {directionsHref ? (
                <p className="mt-8">
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${pillSolid} transition-colors hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent)]`}
                  >
                    <span>{t.location.directions}</span>
                    <ArrowIcon className="size-4" />
                  </a>
                </p>
              ) : null}
            </div>

            {hourRows.length > 0 ? (
              <div>
                <h3 className="pk-eyebrow text-[var(--brand-primary)]">
                  {t.about.openingHours}
                </h3>

                {/*
                  Tasarimdaki saat kolonu: her satir 9px ic bosluk ve 2px ayirici
                  cizgi; sonuncuda cizgi yok ki blok kendi kenarligiyla bitsin.
                */}
                <dl className="mt-5">
                  {hourRows.map((row) => (
                    <div
                      key={row.term}
                      className="flex items-baseline justify-between gap-6 border-b-[length:var(--brand-border-width)] border-[var(--brand-border)] py-[0.5625rem] last:border-b-0"
                    >
                      <dt className="pk-caps text-[var(--brand-ink-muted)]">
                        {row.term}
                      </dt>
                      <dd
                        className={`brand-display text-base tabular-nums ${
                          row.accent
                            ? "text-[var(--brand-accent)]"
                            : "text-[var(--brand-primary)]"
                        }`}
                      >
                        {row.accent ? (
                          row.value
                        ) : (
                          <span dir="ltr">{row.value}</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-5 text-xs leading-relaxed text-[var(--brand-ink-muted)]">
                  {t.about.hoursNote}
                </p>
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
