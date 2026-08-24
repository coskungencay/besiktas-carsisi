import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { placeStamp } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionIndex,
  isSectionShown,
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
            <div className="grid gap-10 lg:grid-cols-10 lg:gap-6">
              <div className="lg:col-span-4">
                {/*
                  Baslik BURADA TEKRAR EDILMIYOR: SectionIndex artik bolumun
                  buyuk basligini ortada basiyor, ayni cumleyi solda ikinci kez
                  yazmak sayfayi tekrara dusuruyordu.
                */}
                <Reveal delay={0.08}>
                  {contact.address ? (
                    <p className="text-[15px] leading-[1.85] text-pretty text-[var(--brand-ink-soft)]">
                      {contact.address}
                    </p>
                  ) : null}

                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-[3px] text-[13px] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                  >
                    <span>{t.location.directions}</span>
                    <ArrowIcon className="size-3.5" />
                  </a>
                </Reveal>
              </div>

              {/*
                Tasarimda sag blok 12'li izgaranin 7. kolonunda basliyor; bu ic
                izgara 3. kolondan basladigi icin karsiligi 5. kolon (Iletisim
                bolumuyle ayni hiza).
              */}
              <div className="lg:col-span-6 lg:col-start-5">
                <Reveal delay={0.14} variant="clip">
                  {/*
                    Haritanin TAMAMI yol tarifi baglantisi. Ziyaretcinin
                    beklentisi bu: haritaya tiklayinca kendi harita
                    uygulamasinda acilsin.
                  */}
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.location.directions}
                    className="group relative block aspect-3/2 w-full overflow-hidden border border-[var(--brand-border)]"
                  >
                    <Image
                      src="/harita/konum.png"
                      alt={fill(t.location.mapAlt, { name: content.name })}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      loading="lazy"
                      className="bo-map object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,0.8,0.24,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />

                    {/* Atif — ODbL geregi zorunlu. */}
                    <span className="bo-mono absolute end-0 bottom-0 bg-[color-mix(in_srgb,var(--brand-surface)_82%,transparent)] px-2 py-1 text-[9.5px] text-[var(--brand-ink-muted)]">
                      © OpenStreetMap
                    </span>
                  </a>

                  {/*
                    Koordinat, galeri kunyeleriyle ayni bicimde blogun altina
                    dusuyor; ayri bir etiket yazmiyoruz cunku sozlukte
                    karsiligi yok ve satirin kendisi zaten okunur.
                  */}
                  {coords ? (
                    <p className="bo-index-sm brand-eyebrow mt-[10px]" dir="ltr">
                      {coords}
                    </p>
                  ) : null}
                </Reveal>
              </div>
            </div>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
