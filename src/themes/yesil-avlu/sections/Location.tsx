import { Reveal } from "@/components/motion/Reveal";
import {
  closedDayLabels,
  coordinateLabel,
  hoursRange,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionHeading,
  eyebrow,
  shell,
  surface,
} from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; ltr: boolean };

/**
 * Adres paneli ve yaninda avlunun sematik krokisi.
 *
 * GOMULU HARITA YOK: Google/OSM iframe'i her ziyaretcide harici bir istek ve
 * ucuncu taraf cerezi demek (KVKK + ilk boyama maliyeti). Yerine tasarimdaki
 * soyut plan dokusu (bkz. .ya-plot) duruyor; gercek yol tarifi tek bir
 * baglantiyla haritaya devrediliyor.
 *
 * Duzen Iletisim bolumunun ikizi: ortalanmis baslik, altinda iki kolon ve
 * solda dolgusuz cerceveli bilgi paneli.
 */
export default function Location({ content }: SectionProps) {
  if (!content.isVisible("konum")) return null;

  const { contact, openingHours, t } = content;

  const coords = coordinateLabel(contact.lat, contact.lng);
  const range = hoursRange(openingHours);
  const closed = closedDayLabels(openingHours);

  /*
   * Saatlerin TAM listesi Hakkimizda'da; burada yalnizca ozet var. Ayni yedi
   * satiri iki kez basmak bu sakin ritmi tekrara dusururdu.
   */
  const rows: Row[] = [
    contact.address && {
      term: t.contact.address,
      value: contact.address,
      ltr: false,
    },
    range && { term: t.about.openingHours, value: range, ltr: true },
    closed.length > 0 && {
      term: t.hours.closed,
      value: closed.join(", "),
      ltr: false,
    },
  ].filter((row): row is Row => Boolean(row));

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
        <Reveal>
          <SectionHeading
            eyebrowText={t.location.eyebrow}
            title={t.location.title}
            titleId="location-title"
          />
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2 lg:gap-10">
          {rows.length > 0 ? (
            <Reveal>
              {/* Iletisim panelinin olculeri birebir: 32px yan, 34px dikey ic bosluk. */}
              <div className="brand-frame h-full px-8 py-[2.125rem]">
                <dl className="flex flex-col gap-6">
                  {rows.map((row) => (
                    <div key={row.term}>
                      <dt className={eyebrow}>{row.term}</dt>
                      <dd
                        className="mt-2 text-base leading-[1.9] font-light text-pretty"
                        {...(row.ltr ? { dir: "ltr" as const } : {})}
                      >
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {coords ? (
                  <p
                    className="mt-6 text-xs tabular-nums text-[var(--brand-ink-muted)]"
                    dir="ltr"
                  >
                    {coords}
                  </p>
                ) : null}
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.08} className={rows.length === 0 ? "lg:col-span-2" : ""}>
            {/*
             * Kroki tamamen DEKORATIF: gercek bir harita degil, tasarimdaki
             * plan dokusunun kendisi. Bu yuzden erisilebilirlik agacindan
             * gizli — adres ve saatler zaten yandaki panelde okunuyor.
             */}
            <div
              aria-hidden="true"
              className="ya-plot brand-rounded relative h-full min-h-56 overflow-hidden"
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

        {directionsHref ? (
          <Reveal delay={0.12}>
            {/* Hero'daki cagri dugmesinin aynisi: hap bicimi, koyu zemin, ok. */}
            <div className="mt-10 text-center">
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="ya-nav ya-pill brand-body inline-flex items-center gap-2 bg-[var(--brand-primary)] px-7 py-3.5 text-[var(--brand-primary-contrast)] transition-opacity hover:opacity-85"
              >
                <span>{t.location.directions}</span>
                <ArrowIcon className="size-4" />
              </a>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
