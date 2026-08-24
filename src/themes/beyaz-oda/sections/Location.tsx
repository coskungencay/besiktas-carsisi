import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { MAP_IMAGE } from "@/themes/beyaz-oda/map-asset";
import { fill } from "@/i18n";
import { placeStamp } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionIndex,
  isSectionShown,
  meta,
  sectionGrid,
  sectionIndex,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Konum.
 *
 * HARITA GERCEK, AMA GOMULU DEGIL: sagdaki kare artik soyut bir doku degil,
 * carsinin bulundugu sokaklarin gercek haritasi. `scripts/build-map.ts` OSM
 * karolarini BIR KEZ indirip tek bir PNG'ye birlestiriyor ve
 * `public/harita/konum.png` olarak sakliyor.
 *
 * NEDEN BOYLE: gomulu bir iframe her ziyaretciyi ucuncu tarafa tanitirdi
 * (KVKK'da acik riza) ve sayfanin en agir parcasi olurdu; Google Static Maps
 * ise her goruntulemede ucretlendirilirdi. Bu yontemde calisma aninda hicbir
 * dis istek yok — ama harita gercek ve tiklaninca yol tarifi aciliyor.
 *
 * Koordinat degisirse build-map.ts yeniden calistirilmali.
 * ATIF (ODbL) zorunlu ve asagida basiliyor; kaldirmayin.
 *
 * SAAT OZETI YOK: ayni iki satir ("Saat · 08–18", "Kapali · Pazar") hero'nun
 * kunye blogunda zaten duruyor, gun gun tablo da hemen alttaki iletisim
 * bolumunde. Ucuncu kez yazmak sayfayi uzatmaktan baska bir sey yapmiyordu.
 */
export default function Location({ content }: SectionProps) {
  if (!isSectionShown(content, "konum")) return null;

  const { contact, t } = content;

  const coords = placeStamp(content);

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
            index={sectionIndex(content, "konum")}
            eyebrow={t.location.eyebrow}
            title={t.location.title}
            titleId="location-title"
          >
            {/*
              ORTALANMIS DUZEN. Onceden solda adres, sagda harita vardi ve
              ortalanmis bolum basliginin altinda dengesiz duruyordu. Simdi
              sira dogal: once NEREDE oldugunu goruyorsun (harita), sonra
              adresi okuyorsun, sonra yol tarifini aliyorsun.
            */}
            <div className="mx-auto max-w-[62rem]">
              {/*
                HARITA CERCEVESI.

                Onceki hali duz bir dikdortgendi ve sayfaya "yapistirilmis"
                gibi duruyordu. Simdi uc katman var:
                  1. disarida ince bir kenarlik ve ic bosluk — harita bir
                     belge gibi cerceveleniyor, sayfaya degil cerceveye ait
                  2. koselerde ince cizgi parcalari — temanin kendi dilinden
                     bir nisan (hairline), harita ustune "isaret konmus" hissi
                  3. uzerine gelince harita hafifce yaklasiyor ve alt seritte
                     "yol tarifi al" beliriyor

                Cerceve ile harita arasindaki bosluk zemin renginde: koyu
                modda cerceve de koyulasiyor, harita da (bo-map filtresi).
              */}
              <Reveal variant="clip">
                <div className="relative border border-[var(--brand-border)] bg-[var(--brand-surface)] p-2 sm:p-3">
                  {/* Kose nisanlari — tamamen dekoratif. */}
                  {(
                    [
                      "start-0 top-0 border-t border-s",
                      "end-0 top-0 border-t border-e",
                      "start-0 bottom-0 border-b border-s",
                      "end-0 bottom-0 border-b border-e",
                    ] as const
                  ).map((corner) => (
                    <span
                      key={corner}
                      aria-hidden="true"
                      className={`pointer-events-none absolute size-5 border-[var(--brand-ink)] ${corner}`}
                    />
                  ))}

                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.location.directions}
                    className="group relative block aspect-16/10 w-full overflow-hidden sm:aspect-2/1"
                  >
                    <Image
                      src={MAP_IMAGE}
                      alt={fill(t.location.mapAlt, { name: content.name })}
                      fill
                      sizes="(min-width: 1024px) 62rem, 100vw"
                      loading="lazy"
                      className="bo-map object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,0.8,0.24,1)] group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />

                    {/* Uzerine gelince koyulasan ince perde. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-[var(--brand-ink)] opacity-0 transition-opacity duration-500 group-hover:opacity-[0.12] motion-reduce:transition-none"
                    />

                    {/* Atif — ODbL geregi zorunlu. */}
                    <span className="bo-mono absolute end-0 top-0 bg-[color-mix(in_srgb,var(--brand-surface)_82%,transparent)] px-2 py-1 text-[9.5px] text-[var(--brand-ink-muted)]">
                      © OpenStreetMap
                    </span>
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="mt-10 text-center">
                  {contact.address ? (
                    <p className="brand-display mx-auto max-w-[36ch] text-[clamp(1.0625rem,1.8vw,1.375rem)] leading-[1.5] tracking-[-0.015em] text-balance">
                      {contact.address}
                    </p>
                  ) : null}

                  {coords ? (
                    <p className={`${meta} brand-eyebrow mt-3`} dir="ltr">
                      {coords}
                    </p>
                  ) : null}

                  {/*
                    Tasarimin tek DOLGULU butonu burada: "yol tarifi al" bu
                    bolumun tek eylemi ve sayfanin en somut cagrisi. Diger
                    yerlerde alt cizgili metin bicimi korunuyor.
                  */}
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brand-rounded mt-8 inline-flex items-center gap-2.5 bg-[var(--brand-primary)] px-7 py-3.5 text-[14px] font-medium text-[var(--brand-primary-contrast)] transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <span>{t.location.directions}</span>
                    <ArrowIcon className="size-4" />
                  </a>
                </div>
              </Reveal>
            </div>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
