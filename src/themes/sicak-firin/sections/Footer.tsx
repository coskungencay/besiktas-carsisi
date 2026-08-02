import { CupIcon } from "@/themes/_shared/icons";
import { shell } from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ince kunye seridi: sayfa zemini, ustunde kesik cizgi, iki uca yaslanmis
 * kucuk yazi.
 *
 * Tasarimda kapanis dolgulu bir bant DEGIL — son panel zaten agir, altina
 * ikinci bir yuzey koymak sayfayi kapatmak yerine bogardi.
 *
 * Semt bilgisi (locality) varsa telifin yanina ekleniyor; mahalle firininda
 * "nerede oldugu" imzanin parcasi.
 *
 * Sosyal baglantilar ortada, imza ile telif arasinda: tasarimdaki uc parcali
 * kunye satirinin (ad · aciklama · yil) orta parcasinin yerinde. Ikon YOK —
 * bu serit 12.5px duz yazidan olusuyor, araya rozet koymak seridi kalinlastirir
 * ve sayfanin en sessiz yerini gurultulu yapardi.
 */
export default function Footer({ content }: SectionProps) {
  const { name, contact, socialLinks, t } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--brand-surface)] text-[var(--brand-ink)]">
      <div
        className={`${shell} flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-dashed border-[var(--brand-hairline-soft)] py-7 text-[length:var(--brand-text-meta)] text-[var(--brand-eyebrow-color)]`}
      >
        <p className="flex items-center gap-2.5">
          <CupIcon className="size-5 text-[var(--brand-primary)]" />
          <span>
            {name}
            {contact.locality ? (
              <>
                {" "}
                <span aria-hidden="true">·</span> {contact.locality}
              </>
            ) : null}
          </span>
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
                    className="underline-offset-4 transition-colors hover:text-[var(--brand-accent)] hover:underline"
                  >
                    {link.label}
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
