import { coordinateLabel } from "@/themes/_shared/data";
import {
  DoubleRule,
  Ornament,
  meta,
  metaMuted,
  shell,
  surface,
} from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kapanis seridi: ustte cift cizgi, altinda ortalanmis marka adi ve telif.
 * Koordinat (varsa) en altta; ayri bir DB alani degil, enlem/boylamdan turetilir.
 */
export default function Footer({ content }: SectionProps) {
  const { name, contact, socialLinks, t } = content;
  const year = new Date().getFullYear();
  const coords = coordinateLabel(contact.lat, contact.lng);

  return (
    <footer className={`${surface} brand-body`}>
      <div className={shell}>
        <DoubleRule />

        <div className="py-12 text-center">
          <p className="brand-display ky-brand text-[var(--brand-primary)]">
            {name}
          </p>

          <Ornament className="mt-5" />

          {contact.phone ? (
            <p className="ky-detail mt-6">
              <a
                href={contact.phoneHref}
                dir="ltr"
                className="underline-offset-4 transition-colors hover:text-[var(--brand-primary)] hover:underline"
              >
                {contact.phone}
              </a>
            </p>
          ) : null}

          {contact.locality ? (
            <p className={`${metaMuted} mt-3`}>{contact.locality}</p>
          ) : null}

          {/*
            Sosyal baglantilar: hesap yoksa baslik da dahil HIC basilmaz.
            Ikon degil METIN — bu tasarimda tek bir modern ikon bile tabela
            hissini bozuyor; adlar kunye serit olcusunde, ortalanmis.
          */}
          {socialLinks.length > 0 ? (
            <div className="mt-9">
              <h2 className={`${meta} text-[var(--brand-primary)]`}>
                {t.social.title}
              </h2>

              <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
                {socialLinks.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="ky-strip text-[var(--brand-ink-muted)] underline-offset-[6px] transition-colors hover:text-[var(--brand-primary)] hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Telif satiri tasarimda en genis harf araligina sahip: 12px/.24em. */}
          <p className="ky-credit mt-8 text-[var(--brand-ink-muted)]">
            © {year} {name}
          </p>

          {coords ? (
            <p className={`${metaMuted} mt-2`} dir="ltr">
              {coords}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
