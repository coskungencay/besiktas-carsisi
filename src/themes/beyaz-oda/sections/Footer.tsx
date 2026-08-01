import { coordinateLabel } from "@/themes/_shared/data";
import { meta, shell, surface } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/** Ince kapanis serit: telif solda, koordinat sagda. */
export default function Footer({ content }: SectionProps) {
  const { name, contact } = content;
  const year = new Date().getFullYear();
  const coords = coordinateLabel(contact.lat, contact.lng);

  return (
    <footer className={`${surface} border-t border-[var(--brand-border)]`}>
      <div
        className={`${shell} flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-8`}
      >
        <p className={meta}>
          © {year} {name}
        </p>
        {coords ? (
          <p className={meta} dir="ltr">
            {coords}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
