import { coordinateLabel } from "@/themes/_shared/data";
import { Sprig, eyebrow, shell, surface } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ince, ortalanmis kapanis. Kenarlik yerine bir ayrac kullaniliyor; bu tema
 * boyunca bolumleri ayiran sey cizgi degil, bosluk.
 */
export default function Footer({ content }: SectionProps) {
  const { name, contact, socialLinks, t } = content;
  const year = new Date().getFullYear();
  // Koordinat ayri bir DB alani DEGIL; panelde girilen enlem/boylamdan turetilir.
  const coords = coordinateLabel(contact.lat, contact.lng);

  return (
    <footer className={surface}>
      <div
        className={`${shell} flex flex-col items-center gap-4 pt-4 pb-14 text-center`}
      >
        <Sprig />

        {/* Tasarimin kapanis satiri: italik serif, 19px. */}
        <p className="brand-display ya-serif-book text-[1.1875rem] italic">{name}</p>

        {contact.locality ? <p className={eyebrow}>{contact.locality}</p> : null}

        {coords ? (
          <p className="text-xs tabular-nums text-[var(--brand-ink-muted)]" dir="ltr">
            {coords}
          </p>
        ) : null}

        {/*
          Sosyal baglantilar: hicbiri girilmemisse baslik da liste de basilmaz.
          Ikon yerine ADLARI yaziliyor — bu tasarimda hicbir yerde ikon yok,
          navigasyon da ayni genis harf arali kucuk metinle veriliyor.
        */}
        {socialLinks.length > 0 ? (
          <nav
            aria-labelledby="footer-social-title"
            className="mt-2 flex flex-col items-center gap-3"
          >
            <h2 id="footer-social-title" className={eyebrow}>
              {t.social.title}
            </h2>

            {/* Ust seritteki nav ritmi: 30px yatay bosluk, 12.5px, .14em. */}
            <ul className="flex flex-wrap items-center justify-center gap-x-[1.875rem] gap-y-2">
              {socialLinks.map((link) => (
                <li key={`${link.platform}-${link.url}`}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="ya-nav brand-body transition-colors hover:text-[var(--brand-accent)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <p className="text-xs text-[var(--brand-ink-muted)]">
          © {year} {name}
        </p>
      </div>
    </footer>
  );
}
