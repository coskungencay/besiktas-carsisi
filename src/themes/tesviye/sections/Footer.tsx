import { coordinateLabel } from "@/themes/_shared/data";
import { edgeTop, mono, shell } from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/** Kalin ust kenarlikli tek satirlik kunye seridi. */
export default function Footer({ content }: SectionProps) {
  const { name, contact } = content;
  const year = new Date().getFullYear();
  const coords = coordinateLabel(contact.lat, contact.lng);

  return (
    <footer className="brand-body bg-[var(--brand-surface)]" style={edgeTop}>
      <div
        className={`${shell} ${mono} flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 text-[var(--brand-ink-muted)]`}
      >
        <p>
          © {year} {name}
        </p>

        {contact.locality ? <p>{contact.locality}</p> : null}

        {coords ? (
          <p className="tabular-nums" dir="ltr">
            {coords}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
