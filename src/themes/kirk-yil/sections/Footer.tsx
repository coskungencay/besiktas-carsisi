import { coordinateLabel } from "@/themes/_shared/data";
import {
  DoubleRule,
  Ornament,
  meta,
  shell,
  surface,
} from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kapanis seridi: ustte cift cizgi, altinda ortalanmis marka adi ve telif.
 * Koordinat (varsa) en altta; ayri bir DB alani degil, enlem/boylamdan turetilir.
 */
export default function Footer({ content }: SectionProps) {
  const { name, contact } = content;
  const year = new Date().getFullYear();
  const coords = coordinateLabel(contact.lat, contact.lng);

  return (
    <footer className={`${surface} brand-body`}>
      <div className={shell}>
        <DoubleRule />

        <div className="py-12 text-center">
          <p className="brand-display brand-eyebrow text-sm text-[var(--brand-primary)]">
            {name}
          </p>

          <Ornament className="mt-5" />

          {contact.phone ? (
            <p className="mt-6 text-sm">
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
            <p className={`${meta} mt-3`}>{contact.locality}</p>
          ) : null}

          <p className={`${meta} mt-8`}>
            © {year} {name}
          </p>

          {coords ? (
            <p className={`${meta} mt-2`} dir="ltr">
              {coords}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
