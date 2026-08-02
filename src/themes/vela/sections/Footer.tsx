import { labelMuted, shell, surface } from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kapanis: tek satir, ortada, cok ince. Ust cizgi altin tonda oldugu icin
 * border yerine ayri bir eleman kullanildi (border-color'a opaklik verilemez).
 */
export default function Footer({ content }: SectionProps) {
  const { name } = content;
  const year = new Date().getFullYear();

  return (
    <footer className={`${surface} relative brand-body`}>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[var(--brand-primary)] opacity-30"
      />
      <div className={`${shell} py-10 text-center`}>
        <p className={labelMuted}>
          {name} · {year}
        </p>
      </div>
    </footer>
  );
}
