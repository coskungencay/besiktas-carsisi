import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  coordinateLabel,
  hoursFromMonday,
  hoursRange,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionHead,
  chip,
  lead,
  metaText,
  panel,
  pillSolid,
  shell,
  surface,
} from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * "Kapi calmadan gir" bloku: tek krem panel, ucu birden ayni yuzeyde.
 *
 * Tasarimdaki uc kolonlu kapanis duzeni birebir: solda adres ve yol tarifi,
 * ortada saat satirlari (kesik cizgiyle), sagda kucuk kroki. Iletisim bolumu
 * ayni panel dolgusunu kullaniyor; ikisi sayfanin sonunu ayni masa gibi
 * topluyor.
 *
 * GOMULU HARITA YOK: iframe her ziyaretcide ucuncu taraf istegi ve cerezi
 * demek (KVKK) ve sayfanin en agir yuku olurdu. Yerine tasarimin kendi krokisi
 * (.sf-map) ve tek bir "yol tarifi" baglantisi var — tiklamayan ziyaretciye
 * hicbir maliyeti yok.
 */
export default function Location({ content }: SectionProps) {
  // Panelden kapatilmis ya da adres/harita baglantisi yoksa bolum basilmaz.
  if (!content.isVisible("konum")) return null;

  const { contact, name, openingHours, t } = content;

  const hours = hoursFromMonday(openingHours);
  const range = hoursRange(openingHours);
  const coords = coordinateLabel(contact.lat, contact.lng);

  /*
   * Yol tarifi hedefi, elde ne varsa ona gore: once musterinin girdigi harita
   * linki, sonra koordinat, en sonda adres aramasi. Ucu de yoksa buton hic
   * basilmaz — hicbir yere gitmeyen buyuk bir dugme birakmak istemiyoruz.
   */
  const directionsHref = contact.mapsUrl
    ? contact.mapsUrl
    : contact.lat !== null && contact.lng !== null
      ? `https://www.google.com/maps?q=${contact.lat},${contact.lng}`
      : contact.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`
        : "";

  return (
    <section id="konum" aria-labelledby="location-title" className={surface}>
      <div className={`${shell} brand-section`}>
        {/* Panel dolgusu iletisim bolumuyle ayni: 52px dikey, 48px yatay. */}
        <div className={`${panel} p-6 sm:px-12 sm:py-13`}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-13">
            <Reveal className="lg:col-span-5">
              <SectionHead
                eyebrow={t.location.eyebrow}
                title={t.location.title}
                titleId="location-title"
              />

              {contact.address ? (
                <p className={`${lead} mt-6 max-w-[22rem] text-pretty`}>
                  {contact.address}
                </p>
              ) : null}

              {/*
                Saat araligi hero'daki rozetle ayni hap bicimde: adresin hemen
                altinda "ne zaman aciksiniz" sorusunun tek satirlik cevabi.
              */}
              {range ? (
                <dl className="mt-6 flex">
                  <div className={chip}>
                    <dt className="brand-eyebrow">{t.hours.label}</dt>
                    <dd dir="ltr" className="tabular-nums">
                      {range}
                    </dd>
                  </div>
                </dl>
              ) : null}

              {directionsHref ? (
                <div className="mt-7">
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={pillSolid}
                  >
                    <span>{t.location.directions}</span>
                    <ArrowIcon />
                  </a>
                </div>
              ) : null}
            </Reveal>

            {hours.length > 0 ? (
              <Reveal delay={0.08} className="lg:col-span-4">
                <h3 className={metaText}>{t.about.openingHours}</h3>

                <dl className="mt-4 flex flex-col">
                  {hours.map((hour) => (
                    <div
                      key={hour.dayOfWeek}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-dashed border-[var(--brand-hairline-soft)] py-3 last:border-b-0"
                    >
                      <dt className="text-[length:var(--brand-text-row)] font-light text-[var(--brand-ink-soft)]">
                        {hour.dayLabel}
                      </dt>
                      <dd className="text-[length:var(--brand-text-row)] font-medium tabular-nums">
                        {hour.isClosed ? (
                          t.hours.closed
                        ) : (
                          <span dir="ltr">
                            {hour.openTime} – {hour.closeTime}
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}

            {/*
              Kroki kolonu, saat sutunu yoksa onun yerini de aliyor: 5 + 4 + 3
              olan izgara 5 + 3 kalinca panelin sonunda dort kolonluk olu bir
              bosluk birakiyordu (saat satiri hic girilmemis siteler).
            */}
            <Reveal
              delay={0.14}
              className={hours.length > 0 ? "lg:col-span-3" : "lg:col-span-7"}
            >
              {/*
                Kroki: iki sokak cizgisi ve tek isaret noktasi. Soyut ama bos
                degil — "burada bir yer var" hissini veriyor. role="img" +
                aria-label ile ekran okuyucuya tek cumlede aktariliyor.
              */}
              <div className="relative h-44 overflow-hidden rounded-[var(--brand-radius-sm)] bg-[var(--brand-surface)] sm:h-52">
                {/*
                  Cizim role="img": alt katmandaki nokta ve cizgiler ekran
                  okuyucuya tek tek degil, tek cumleyle aktariliyor.
                */}
                <span
                  role="img"
                  aria-label={fill(t.location.mapAlt, { name })}
                  className="sf-map absolute inset-0 flex items-center justify-center"
                >
                  <span className="size-2.5 rounded-[var(--brand-radius-pill)] bg-[var(--brand-accent)] shadow-[0_0_0_6px_var(--brand-pin-ring)]" />
                </span>

                {/*
                  Kroki kosesindeki kunye satiri: tasarimdaki "pazarin karsisi"
                  notunun yerinde. Koordinat girilmemisse semt adi kaliyor.
                  Cizimin KARDESI (icinde degil), yoksa role="img" metni ekran
                  okuyucudan gizlerdi.
                */}
                {coords || contact.locality ? (
                  <p
                    className={`${metaText} absolute bottom-3 start-4`}
                    {...(coords ? { dir: "ltr" as const } : {})}
                  >
                    {coords || contact.locality}
                  </p>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
