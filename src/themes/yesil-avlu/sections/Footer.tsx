import { coordinateLabel } from "@/themes/_shared/data";
import { Sprig, eyebrow, shell, surface } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ince, ortalanmis kapanis. Kenarlik yerine bir ayrac kullaniliyor; bu tema
 * boyunca bolumleri ayiran sey cizgi degil, bosluk.
 */
export default function Footer({ content }: SectionProps) {
  const { name, contact } = content;
  const year = new Date().getFullYear();
  // Koordinat ayri bir DB alani DEGIL; panelde girilen enlem/boylamdan turetilir.
  const coords = coordinateLabel(contact.lat, contact.lng);

  return (
    <footer className={surface}>
      <div
        className={`${shell} flex flex-col items-center gap-4 pt-4 pb-14 text-center`}
      >
        <Sprig />

        <p className="brand-display text-lg">{name}</p>

        {contact.locality ? <p className={eyebrow}>{contact.locality}</p> : null}

        {coords ? (
          <p className="text-xs tabular-nums text-[var(--brand-ink-muted)]" dir="ltr">
            {coords}
          </p>
        ) : null}

        <p className="text-xs text-[var(--brand-ink-muted)]">
          © {year} {name}
        </p>
      </div>
    </footer>
  );
}
