import Link from "next/link";

import type { SiteContent } from "@/themes/types";

/**
 * Dil secici. Sunucu bileseni — JavaScript gerektirmez, sadece linkler.
 * Renkleri tema token'larindan alir, her temada uyumlu gorunur.
 */
export function LocaleSwitcher({
  content,
  className = "",
}: {
  content: SiteContent;
  className?: string;
}) {
  if (content.locales.length < 2) return null;

  return (
    <nav
      aria-label={content.t.nav.changeLanguage}
      className={`flex flex-wrap items-center gap-1 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--brand-surface)_88%,transparent)] p-1 shadow-[var(--shadow-sm)] backdrop-blur ${className}`}
    >
      <span className="sr-only">{content.t.nav.languageLabel}</span>
      {content.locales.map((option) => (
        <Link
          key={option.locale}
          href={option.href}
          hrefLang={option.locale}
          lang={option.locale}
          aria-current={option.isActive ? "true" : undefined}
          className={`rounded-[calc(var(--radius-sm)-2px)] px-2.5 py-1 text-xs font-semibold transition-colors ${
            option.isActive
              ? "bg-[var(--brand-primary)] text-[var(--brand-primary-contrast)]"
              : "text-[var(--brand-ink)] hover:bg-[var(--brand-surface-alt)]"
          }`}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
}
