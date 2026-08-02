import { Reveal } from "@/components/motion/Reveal";
import {
  closedDayLabels,
  coordinateLabel,
  hoursRange,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  metaMuted,
  SectionHead,
  sectionTop,
  shell,
  surface,
} from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Konum: solda okunacak veri (adres, koordinat, saat ozeti, yol tarifi),
 * sagda tasarimin iletisim kosesindeki kucuk harita dokusunun buyutulmus
 * hali — altin cerceve, kesisen ince cizgiler, tek bir altin nokta.
 *
 * NEDEN GOMULU HARITA YOK: Google/OSM iframe'i her ziyaretcide harici bir
 * istek acar (KVKK) ve sayfanin en agir parcasi olur. Ihtiyac duyan zaten
 * "Yol tarifi al" ile kendi harita uygulamasina gidiyor; orada zoom da,
 * trafik de hazir.
 *
 * Veri satirlari About'un saat izgarasiyla ayni: ustte ince cizgi, altinda
 * genis harf arali kucuk terim, sonra serif deger.
 */
export default function Location({ content }: SectionProps) {
  if (!content.isVisible("konum")) return null;

  const { contact, openingHours, t } = content;

  const coords = coordinateLabel(contact.lat, contact.lng);
  const range = hoursRange(openingHours);
  const closed = closedDayLabels(openingHours);

  /*
   * Yol tarifi hedefi, elde ne varsa ona gore: musteri kendi harita linkini
   * girdiyse o, yoksa koordinat, o da yoksa adres aramasi. Hicbiri yoksa
   * baglanti hic basilmaz — "bos link" tiklayana yalan soyler.
   */
  const directionsHref =
    contact.mapsUrl ||
    (contact.lat !== null && contact.lng !== null
      ? `https://www.google.com/maps?q=${contact.lat},${contact.lng}`
      : "") ||
    (contact.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          contact.address,
        )}`
      : "");

  const rows = [
    contact.address && { term: t.contact.address, value: contact.address },
    range && { term: t.hours.label, value: range },
    closed.length > 0 && { term: t.hours.closed, value: closed.join(", ") },
  ].filter((row): row is { term: string; value: string } => Boolean(row));

  return (
    <section id="konum" aria-labelledby="location-title" className={surface}>
      <div className={`${shell} ${sectionTop}`}>
        <Reveal>
          <SectionHead
            eyebrow={t.location.eyebrow}
            title={t.location.title}
            titleId="location-title"
          />
        </Reveal>

        {/* 60px kolon araligi — tasarimin kapanis bolumuyle ayni. */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-[3.75rem]">
          <Reveal delay={0.08}>
            {rows.length > 0 ? (
              <dl className="grid gap-x-[3.25rem] gap-y-8 sm:grid-cols-2">
                {rows.map((row) => (
                  <div
                    key={row.term}
                    className="flex flex-col gap-3 border-t border-[var(--brand-border)] pt-[1.1875rem]"
                  >
                    <dt className={metaMuted}>{row.term}</dt>
                    <dd className="brand-display text-[1.3125rem] leading-[1.4] text-pretty">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {/* Koordinat ayri bir alan degil; enlem/boylamdan turetiliyor. */}
            {coords ? (
              <p className={`${metaMuted} mt-10`} dir="ltr">
                {coords}
              </p>
            ) : null}

            {directionsHref ? (
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                /*
                 * Tasarimdaki tek "buton": ince altin cerceve, 15/32px dolgu,
                 * uzerine gelince zemin altina donuyor. Radius yok — tema
                 * genelinde kose yok.
                 */
                className="mt-9 inline-flex items-center gap-3 border border-[var(--brand-primary)] px-8 py-[0.9375rem] text-[0.71875rem] leading-[1.6] uppercase tracking-[var(--brand-meta-tracking)] text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-contrast)]"
              >
                {t.location.directions}
                <ArrowIcon className="size-3.5" />
              </a>
            ) : null}
          </Reveal>

          <Reveal delay={0.14}>
            {/*
             * Soyut harita: gercek harita verisi TASIMAZ, bu yuzden tamamen
             * dekoratif (aria-hidden). Yukaridaki adres ve yol tarifi
             * baglantisi bilgiyi zaten metin olarak veriyor.
             */}
            <div
              aria-hidden="true"
              className="vl-map relative aspect-[4/3] w-full overflow-hidden border border-[var(--brand-frame-gold)] bg-[var(--brand-surface-alt)] sm:aspect-[16/10]"
            >
              <div className="absolute inset-0 grid place-items-center">
                {/* Yuvarlaklik ve halka tokens.css'te: temada radius yok. */}
                <span className="vl-pin block size-2 bg-[var(--brand-primary)]" />
              </div>

              {/*
               * Semt etiketi: tasarimda 10px / .2em. metaMuted ile yazip
               * uzerine ikinci bir text-* eklemedim; ayni utility'nin iki
               * ornegi arasinda dosya sirasi kazanir, sinif sirasi degil.
               */}
              {contact.locality ? (
                <span className="brand-body absolute bottom-4 start-4 text-[0.625rem] leading-[1.6] uppercase tracking-[var(--brand-nav-tracking)] text-[var(--brand-ink-muted)]">
                  {contact.locality}
                </span>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
