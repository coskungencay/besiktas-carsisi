import Link from "next/link";

import type { SiteContent } from "@/themes/types";

/**
 * Dil secici. Sunucu bileseni — JavaScript gerektirmez, sadece linkler.
 * Renkleri ve bicimi tema token'larindan alir, 9 temada da yerinde durur.
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
      className={`brand-frame brand-body flex flex-wrap items-center gap-1 bg-[var(--brand-surface)] p-1 ${className}`}
    >
      <span className="sr-only">{content.t.nav.languageLabel}</span>
      {content.locales.map((option) => (
        <Link
          key={option.locale}
          href={option.href}
          hrefLang={option.locale}
          lang={option.locale}
          aria-current={option.isActive ? "true" : undefined}
          className={`brand-rounded px-2.5 py-1 text-xs font-medium transition-colors ${
            option.isActive
              ? "bg-[var(--brand-primary)] text-[var(--brand-primary-contrast)]"
              : "text-[var(--brand-ink-muted)] hover:bg-[var(--brand-surface-alt)] hover:text-[var(--brand-ink)]"
          }`}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
}
