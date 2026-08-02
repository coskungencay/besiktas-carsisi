import { coordinateLabel } from "@/themes/_shared/data";
import { edgeTop, pillLine, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kapanis afisi: kalin ust kenarlik ve sayfayi kapatan DEV marka adi.
 * Kunye satirlari (telif, koordinat, instagram) adin altinda rozet olarak.
 */
export default function Footer({ content }: SectionProps) {
  const { name, contact } = content;
  const year = new Date().getFullYear();
  const coords = coordinateLabel(contact.lat, contact.lng);

  return (
    <footer className={`${surface} ${edgeTop}`}>
      <div className={`${shell} py-12 sm:py-16`}>
        <p className="brand-display text-[clamp(2.5rem,12vw,7rem)] leading-[0.95] text-balance text-[var(--brand-primary)]">
          {name}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <p className={pillLine}>
            © {year} {name}
          </p>

          {coords ? (
            <p className={pillLine} dir="ltr">
              {coords}
            </p>
          ) : null}

          {contact.instagram && contact.instagramHref ? (
            <a
              href={contact.instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${pillLine} transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]`}
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
