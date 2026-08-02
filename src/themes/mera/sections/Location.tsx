import { Reveal } from "@/components/motion/Reveal";
import { placeStamp } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionHead,
  bodyText,
  label,
  labelBase,
  link,
  page,
  sectionPad,
  surface,
} from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Konum sayfasi: solda adres + saat ozeti + tasarimdaki "Yol tarifi al →"
 * baglantisi, sagda soyut harita dokusu.
 *
 * GOMULU HARITA YOK. Google/OSM iframe'i her ziyaretcide harici istek ve cerez
 * demek (KVKK + performans); ustelik renkli bir harita bu solgun dergi
 * sayfasinin ortasinda yamalik dururdu. Tasarimin kendi cozumu kullaniliyor:
 * iki capraz cizgi ve tek bir damga (bkz. tokens.css .mera-map / .mera-pin).
 *
 * SAAT YOK: tasarimda saatler kapanis bolumunun orta kolonunda, tek bir yerde
 * duruyor. Burada bir de ozet vermek, hemen altindaki tam dokumu tekrar etmek
 * olurdu.
 */
export default function Location({ content }: SectionProps) {
  if (!content.isVisible("konum")) return null;

  const { contact, t } = content;

  const coords = placeStamp(content);

  /*
   * Yol tarifi hedefi, elde ne varsa ona duser: musterinin girdigi harita
   * linki > koordinat > adres aramasi. Hicbiri yoksa link basilmaz — bos bir
   * capa birakmak yerine.
   */
  const directionsHref =
    contact.mapsUrl ||
    (contact.lat !== null && contact.lng !== null
      ? `https://www.google.com/maps?q=${contact.lat},${contact.lng}`
      : contact.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            contact.address,
          )}`
        : "");

  return (
    <section id="konum" aria-labelledby="location-title" className={surface}>
      <div className={`${page} ${sectionPad}`}>
        <Reveal>
          <SectionHead
            eyebrow={t.location.eyebrow}
            title={t.location.title}
            titleId="location-title"
            aside={
              coords ? (
                <p className={label} dir="ltr">
                  {coords}
                </p>
              ) : null
            }
          >
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
              <Reveal delay={0.08}>
                {contact.address ? (
                  <p className={`${bodyText} max-w-[420px]`}>
                    {contact.address}
                  </p>
                ) : null}

                {directionsHref ? (
                  /* Tasarimdaki "Yol tarifi al →": 12px kunye punto, .18em
                     aralik, marka renginde alt cizgi. Rengi de MARKA RENGI —
                     tasarimin global `a` kurali; ustune gelince mureekkebe
                     doner. */
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${labelBase} ${link} mera-caption mt-9 inline-flex items-center gap-3 border-b border-[var(--brand-primary)] pb-1 text-[0.75rem]`}
                  >
                    <span>{t.location.directions}</span>
                    <ArrowIcon className="size-3.5" />
                  </a>
                ) : null}
              </Reveal>

              {/* Doku salt dekoratif: gercek bir harita degil, okunacak bir
                  bilgi tasimiyor — ekran okuyucudan gizli. */}
              {/* Isaretci flex ile ortalaniyor: absolute + translate cozumu
                  RTL'de yon degistiren bir hesap gerektiriyordu. */}
              <Reveal
                delay={0.14}
                className="mera-map flex h-[200px] w-full items-center justify-center sm:h-[260px] lg:h-full lg:min-h-[280px]"
              >
                <span aria-hidden="true" className="mera-pin size-[9px]" />
              </Reveal>
            </div>
          </SectionHead>
        </Reveal>
      </div>
    </section>
  );
}
