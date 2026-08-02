import type { SiteContent } from "@/themes/types";

/**
 * Sayfanin en ustundeki tek satirlik duyuru.
 *
 * NEDEN TEMAYA AIT DEGIL: her tasarimda ayni yerde (header'in da ustunde) ve
 * ayni islevde duran ince bir serit. Renkleri tema token'larindan geldigi icin
 * her temaya uyar; tema kendi Header'inda ayrica bir duyuru basmaz.
 */
export function AnnouncementBar({ content }: { content: SiteContent }) {
  if (!content.isVisible("duyuru")) return null;
  if (!content.announcement.trim()) return null;

  return (
    <div className="brand-body bg-[var(--brand-primary)] text-[var(--brand-primary-contrast)]">
      <p className="mx-auto w-full max-w-[var(--brand-container)] px-6 py-2.5 text-center text-sm text-pretty sm:px-10">
        {content.announcement}
      </p>
    </div>
  );
}
