import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
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
              <Reveal variant="clip">
                {/*
                  Haritanin TAMAMI yol tarifi baglantisi — ziyaretcinin
                  beklentisi bu. Cerceve icinde hafifce yaklasarak tepki
                  veriyor; disari tasmasin diye overflow-hidden.
                */}
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.location.directions}
                  className="group relative block aspect-16/10 w-full overflow-hidden border border-[var(--brand-border)] sm:aspect-2/1"
                >
                  <Image
                    src="/harita/konum.png"
                    alt={fill(t.location.mapAlt, { name: content.name })}
                    fill
                    sizes="(min-width: 1024px) 62rem, 100vw"
                    loading="lazy"
                    className="bo-map object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,0.8,0.24,1)] group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />

                  {/*
                    Uzerine gelince hafif bir perde: haritanin tikanabilir
                    oldugunu belli ediyor. Kapali dururken hicbir sey ortmuyor.
                  */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-[var(--brand-ink)] opacity-0 transition-opacity duration-500 group-hover:opacity-[0.07] motion-reduce:transition-none"
                  />

                  {/* Atif — ODbL geregi zorunlu. */}
                  <span className="bo-mono absolute end-0 bottom-0 bg-[color-mix(in_srgb,var(--brand-surface)_82%,transparent)] px-2 py-1 text-[9.5px] text-[var(--brand-ink-muted)]">
                    © OpenStreetMap
                  </span>
                </a>
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
