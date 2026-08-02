import { coordinateLabel } from "@/themes/_shared/data";
import {
  labelStrip,
  labelStripBase,
  link,
  page,
  surface,
} from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dergi kunye seridi gibi kapanis: ortalanmis bir masthead degil, sayfanin
 * iki ucuna dagilmis tek satirlik ince bir bant (tasarimda 11px, .16em harf
 * araligi, cizginin 20px altinda). Adres burada TEKRARLANMAZ — hemen ustteki
 * iletisim bolumunde zaten tam haliyle duruyor.
 *
 * Sosyal baglantilar ayni seridin ikinci satirinda, ikonsuz: bu tasarimda
 * marka isaretleri yok, her sey ayni kucuk kunye yazisi. Baglanti yoksa satir
 * hic basilmaz.
 */
export default function Footer({ content }: SectionProps) {
  const { name, tagline, contact, socialLinks, t } = content;
  const year = new Date().getFullYear();
  const coords = coordinateLabel(contact.lat, contact.lng);

  const mark = contact.locality ? `${name} · ${contact.locality}` : name;

  return (
    <footer className={`${surface} brand-body`}>
      <div className={`${page} pb-16`}>
        {/* Serit cizgisi tasarimda murekkebin %12 opakligi (bolum ayracindan
            daha ince): kapanis bandi sayfayi bolmez, yalnizca kapatir. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 border-t border-[var(--mera-hair)] pt-5">
          <p className={labelStrip}>{mark}</p>

          {tagline ? (
            <p className={`${labelStrip} max-w-md`}>{tagline}</p>
          ) : null}

          <p className={labelStrip} dir="ltr">
            © {year}
          </p>

          {coords ? (
            <p className={`${labelStrip} w-full`} dir="ltr">
              {coords}
            </p>
          ) : null}

          {socialLinks.length > 0 ? (
            /* Baslik gorunur degil, nav'in adi olarak veriliyor: serit tek
               satirlik kalmali, ustune bir baslik satiri eklemek dergi
               kunyesinin ritmini bozardi. */
            <nav aria-label={t.social.title} className="w-full">
              <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
                {socialLinks.map((social) => (
                  <li key={`${social.platform}-${social.url}`}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      /* Tasarimin global `a` kurali: marka renginde, ustune
                         gelince mureekkebe doner. */
                      className={`${labelStripBase} ${link} underline-offset-[6px] hover:underline`}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
