import { Latin } from "@/components/site/Latin";
import { shell } from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ince kunye seridi: uc parca duz yazi, iki uca yaslanmis.
 *
 * Tasarimda kapanis dolgulu bir bant DEGIL, ustunde bir cizgi de YOK — son
 * panelin kenari sayfayi zaten kapatiyor. Bant ya da ayrac eklemek kapanisa
 * ikinci bir kat cikariyordu.
 *
 * IKON YOK: bu serit 12.5px duz yazidan olusuyor; araya rozet koymak seridi
 * kalinlastirir ve sayfanin en sessiz yerini gurultulu yapardi.
 *
 * Semt bilgisi (locality) varsa imzanin yanina ekleniyor; mahalle firininda
 * "nerede oldugu" imzanin parcasi.
 *
 * Sosyal baglantilar ortada, imza ile telif arasinda: tasarimdaki uc parcali
 * kunye satirinin (ad · aciklama · yil) orta parcasinin yerinde.
 */
export default function Footer({ content }: SectionProps) {
  const { name, contact, socialLinks, t } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--brand-surface)] text-[var(--brand-ink)]">
      <div
        className={`${shell} flex flex-wrap items-center justify-between gap-x-8 gap-y-3 pb-14 text-[length:var(--brand-text-meta)] text-[var(--brand-eyebrow-color)]`}
      >
        <p>
          {name}
          {contact.locality ? (
            <>
              {" "}
              <span aria-hidden="true">·</span> {contact.locality}
            </>
          ) : null}
        </p>

        {/* Hic hesap girilmemisse liste de baslik da hic basilmaz. */}
        {socialLinks.length > 0 ? (
          <nav aria-label={t.social.title}>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {socialLinks.map((link) => (
                <li key={`${link.platform}-${link.url}`}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    /* Tasarimin global kurali: baglanti = marka rengi,
                       uzerine gelince vurgu rengi, alt cizgi yok. */
                    className="text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-accent)]"
                  >
                    <Latin>{link.label}</Latin>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <p>© {year}</p>
      </div>
    </footer>
  );
}
