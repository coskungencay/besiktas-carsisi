import { Reveal } from "@/components/motion/Reveal";
import { coordinateLabel } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionHead,
  pillLine,
  pillSolid,
  shell,
  surface,
} from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

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
 * SAAT YOK: tasarimda saatler kapanis blogunun orta kolonunda. Adresin yaninda
 * bir de cetvel olsaydi ayni bilgi iki bolumde ust uste cikardi.
 */
export default function Location({ content }: SectionProps) {
  // Musteri panelden kapattiysa ya da adres/harita linki yoksa bolum basilmaz.
  if (!content.isVisible("konum")) return null;

  const { contact, t } = content;

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

  return (
    <section id="konum" aria-labelledby="location-title" className={surface}>
      <div className={`${shell} pk-section`}>
        <Reveal>
          <SectionHead title={t.location.title} titleId="location-title" />
        </Reveal>

        <Reveal delay={0.08}>
          {/*
            Tek satir, TAM GENISLIK: adres solda, harekete cagiran ogeler sagda
            ve ayni taban cizgisinde (tasarimin butun satirlari boyle bitiyor).
            Dar bir kutuya sikistirmak sayfanin iki yanini bos birakiyordu.
          */}
          <div className="brand-frame mt-10 flex flex-col gap-8 bg-[var(--brand-surface-alt)] p-6 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:gap-11">
            {address ? (
              <p className="pk-title max-w-[34rem] text-balance">{address}</p>
            ) : null}

            <div className="flex flex-wrap items-center gap-4">
              {coords ? (
                /* Koordinat her zaman soldan saga okunur; Arapca'da da ters cevrilmez. */
                <p className={`${pillLine} pk-meta`} dir="ltr">
                  {coords}
                </p>
              ) : null}

              {directionsHref ? (
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${pillSolid} transition-colors hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent)]`}
                >
                  <span>{t.location.directions}</span>
                  <ArrowIcon className="size-4" />
                </a>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
