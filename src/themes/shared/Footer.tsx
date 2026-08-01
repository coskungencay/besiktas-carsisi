/*
 * LEGACY ORTAK BILESEN
 *
 * Bu klasordeki bilesenler, tasarimina gore HENUZ yeniden yazilmamis temalarin
 * ortak iskeletidir — dokuz temanin ayni gorunmesinin sebebi de buydu.
 *
 * YENI TEMA YAZARKEN KULLANMAYIN. Ornek yapi: src/themes/beyaz-oda/
 * Ortak MANTIK icin: src/themes/_shared/  (bkz. THEMING.md)
 */
import type { SectionProps } from "@/themes/types";

/**
 * LEGACY footer — henuz tasarimina gore yeniden yazilmamis temalar kullanir.
 * Yeni temalar kendi Footer'ini yazar (bkz. THEMING.md).
 *
 * Zemin olarak `--brand-ink` degil `--brand-surface-alt` kullanilir: ink'i zemin
 * yapmak koyu temalarda (patika, vela) rengi ters cevirirdi.
 */
export default function Footer({ content }: SectionProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="brand-body border-t border-[var(--brand-border)] bg-[var(--brand-surface-alt)] py-10 text-[var(--brand-ink-muted)]">
      <div className="mx-auto flex w-full max-w-[var(--brand-container)] flex-col gap-2 px-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p>
          © {year} {content.name}
        </p>
        {content.contact.address ? (
          <p className="text-pretty">{content.contact.address}</p>
        ) : null}
      </div>
    </footer>
  );
}
