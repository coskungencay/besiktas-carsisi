import { coordinateLabel } from "@/themes/_shared/data";
import { label, page, surface } from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dergi kunyesi gibi ince kapanis: ortada serif marka adi, altinda adres,
 * en altta telif ve koordinat. Ortalanmis olmasi bilinçli — sayfanin geri
 * kalani baslangic kenarina yasliyken kapanis simetriyle biter.
 */
export default function Footer({ content }: SectionProps) {
  const { name, contact } = content;
  const year = new Date().getFullYear();
  const coords = coordinateLabel(contact.lat, contact.lng);

  return (
    <footer
      className={`${surface} border-t border-[var(--brand-border)] brand-body`}
    >
      <div className={`${page} py-12 text-center`}>
        <p className="brand-display text-2xl leading-none">{name}</p>

        {contact.address ? (
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
            {contact.address}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[var(--brand-border)] pt-6">
          <p className={label}>
            © {year} {name}
          </p>
          {coords ? (
            <p className={label} dir="ltr">
              {coords}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
