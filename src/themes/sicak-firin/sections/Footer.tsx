import { CupIcon } from "@/themes/_shared/icons";
import { shell } from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Yumusak kapanis seridi: ikincil zemin, ortada tek satir.
 *
 * Semt bilgisi (locality) varsa telifin yanina ekleniyor; mahalle firininda
 * "nerede oldugu" imzanin parcasi.
 */
export default function Footer({ content }: SectionProps) {
  const { name, contact } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--brand-surface-alt)] text-[var(--brand-ink)]">
      <div className={`${shell} flex flex-col items-center gap-3 py-10 text-center`}>
        <CupIcon className="size-7 text-[var(--brand-primary)]" />

        <p className="text-sm text-[var(--brand-ink-muted)]">
          © {year} {name}
          {contact.locality ? (
            <>
              {" "}
              <span aria-hidden="true">·</span> {contact.locality}
            </>
          ) : null}
        </p>
      </div>
    </footer>
  );
}
