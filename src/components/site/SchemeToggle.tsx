"use client";

import { useEffect, useState } from "react";

export type Scheme = "light" | "dark";

/** localStorage anahtari — `scheme-script.ts` ile AYNI olmali. */
export const SCHEME_KEY = "bbc:scheme";

/**
 * Acik / koyu mod dugmesi.
 *
 * MOD UC DURUMLU DEGIL, IKI DURUMLU: ziyaretci ya acik ya koyu secer. "Sistem"
 * secenegi bilerek yok — dugmede uc durum dondurmek, kullanicinin o an hangi
 * modda oldugunu anlamasini zorlastiriyor. Ilk acilista sistem tercihi zaten
 * uygulaniyor (bkz. tokens.css `prefers-color-scheme` blogu); dugmeye basildigi
 * an secim `data-scheme` olarak sabitlenir ve hatirlanir.
 *
 * SSR'da hicbir sey basmaz (`mounted` false): sunucu ziyaretcinin modunu
 * bilemez, bilmeden bir ikon basmak yanlis ikonla hydration uyusmazligi
 * demektir. Yerini korumak icin ayni olcude bos bir kutu birakiyor.
 */
export function SchemeToggle({ label }: { label: string }) {
  const [mounted, setMounted] = useState(false);
  const [scheme, setScheme] = useState<Scheme>("light");

  useEffect(() => {
    const root = document.documentElement;
    const explicit = root.getAttribute("data-scheme") as Scheme | null;
    setScheme(
      explicit ??
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
    );
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Scheme = scheme === "dark" ? "light" : "dark";
    setScheme(next);
    document.documentElement.setAttribute("data-scheme", next);
    try {
      localStorage.setItem(SCHEME_KEY, next);
    } catch {
      /* gizli sekmede yazilamaz; mod yine de bu sayfada gecerli olur */
    }
  };

  // Yer tutucu: dugme sonradan belirince ust seridin duzeni kaymasin.
  if (!mounted) return <span aria-hidden="true" className="block size-9" />;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={scheme === "dark"}
      className="grid size-9 shrink-0 place-items-center text-[var(--brand-ink-muted)] transition-colors hover:text-[var(--brand-ink)]"
    >
      {scheme === "dark" ? (
        /* Koyu moddayken GUNES gosteriyoruz: dugme "ne olacagini" anlatir. */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-[18px]">
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-[18px]">
          <path
            d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
