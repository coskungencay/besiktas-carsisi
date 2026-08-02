import type { SiteContent } from "@/themes/types";

/**
 * Kosede duran sabit WhatsApp baglantisi.
 *
 * NEDEN TEMAYA AIT DEGIL: Bu bir bolum degil, sayfanin uzerinde duran bir
 * yardimci ogedir; konumu 9 tasarimda da aynidir. Gorunumu tamamen tema
 * token'larindan geldigi icin her temada yerinde durur.
 *
 * Gorunurlugu content.isVisible("whatsapp") belirler: numara girilmemisse ya
 * da musteri panelden kapattiysa hic basilmaz.
 */
export function FloatingWhatsApp({ content }: { content: SiteContent }) {
  if (!content.isVisible("whatsapp")) return null;
  if (!content.contact.whatsappHref) return null;

  return (
    <a
      href={content.contact.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={content.t.whatsapp.label}
      title={content.t.whatsapp.label}
      className="brand-rounded fixed bottom-5 end-5 z-40 inline-flex size-13 items-center justify-center bg-[var(--brand-primary)] text-[var(--brand-primary-contrast)] shadow-lg transition-opacity hover:opacity-85"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
      >
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.2.84 5.73 2.37a8.06 8.06 0 0 1 2.37 5.73c0 4.47-3.63 8.1-8.1 8.1a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.07.8.82-3-.19-.31a8.06 8.06 0 0 1-1.24-4.31c0-4.46 3.64-8.07 8.11-8.07Zm-2.7 4.02c-.15 0-.4.06-.6.28-.21.22-.8.78-.8 1.9s.82 2.2.93 2.35c.12.15 1.6 2.45 3.89 3.43.54.24.97.38 1.3.48.55.18 1.05.15 1.44.09.44-.06 1.35-.55 1.54-1.09.19-.54.19-1 .13-1.1-.06-.09-.21-.15-.44-.27-.23-.12-1.35-.66-1.56-.74-.21-.08-.36-.12-.51.11-.15.23-.58.74-.71.89-.13.15-.26.17-.49.06-.23-.12-.97-.36-1.85-1.14-.68-.61-1.14-1.36-1.28-1.59-.13-.23-.01-.35.1-.47.1-.1.23-.26.34-.4.11-.13.15-.22.23-.37.08-.15.04-.28-.02-.4-.06-.11-.51-1.24-.7-1.7-.18-.44-.37-.38-.51-.39l-.43-.01Z" />
      </svg>
    </a>
  );
}
