import { coordinateLabel } from "@/themes/_shared/data";
import { edgeTop, pillLine, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/** Rozet baglantilarinin ortak hali: kunye rozeti + neon hover. */
const metaLink = `${pillLine} pk-meta transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]`;

/**
 * Kapanis afisi: kalin ust kenarlik ve sayfayi kapatan DEV marka adi.
 * Altinda sosyal baglanti rozetleri, en altta tasarimdaki ince kunye satiri
 * (11px, genis aralikli, buyuk harf).
 *
 * SOSYAL BAGLANTILAR IKON DEGIL METIN: bu temanin dili tipografi; kucuk ikon
 * setleri afisin kalin harfleri yaninda cerezlesirdi. Platform adlari zaten
 * rozet formunda ve nav ile ayni sekli tasiyor.
 */
export default function Footer({ content }: SectionProps) {
  const { name, contact, socialLinks, t } = content;
  const year = new Date().getFullYear();
  const coords = coordinateLabel(contact.lat, contact.lng);

  /*
   * Instagram iki yerden gelebiliyor: iletisim alani (kullanici adi) ve sosyal
   * baglanti listesi. Ikisi de doluysa alttaki kunye satirinda ayni hesap iki
   * kez rozet olurdu; sosyal listede varsa kunye rozeti basilmaz.
   */
  const hasSocialInstagram = socialLinks.some(
    (link) => link.platform === "instagram",
  );
  const showInstagramMeta =
    !hasSocialInstagram && Boolean(contact.instagram && contact.instagramHref);

  return (
    <footer className={`${surface} ${edgeTop}`}>
      <div className={`${shell} py-12 sm:py-16`}>
        <p className="pk-h2 text-balance text-[var(--brand-primary)]">{name}</p>

        {socialLinks.length > 0 ? (
          <nav aria-labelledby="footer-social-title" className="mt-9">
            <h2
              id="footer-social-title"
              className="pk-eyebrow text-[var(--brand-primary)]"
            >
              {t.social.title}
            </h2>

            <ul className="mt-4 flex flex-wrap items-center gap-2.5">
              {socialLinks.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={metaLink}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <p className={`${pillLine} pk-meta`}>
            © {year} {name}
          </p>

          {coords ? (
            <p className={`${pillLine} pk-meta`} dir="ltr">
              {coords}
            </p>
          ) : null}

          {showInstagramMeta ? (
            <a
              href={contact.instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className={metaLink}
              dir="ltr"
            >
              @{contact.instagram}
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
