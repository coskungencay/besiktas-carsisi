/**
 * Temalarin ortak ikonlari.
 *
 * NEDEN ORTAK: Ikonlar `currentColor` ve `em` tabanli olculerle cizildi; renk ve
 * boyut karari cagiran temaya ait. Yani burada GORSEL karar yok, sadece cizim
 * var — ortak katmanin "gorsel karar tasimaz" kurali bozulmuyor.
 *
 * Yeni ikon eklerken: sabit renk, sabit px olcu ve `class` icinde renk YAZMAYIN.
 */

type IconProps = { className?: string };

/** RTL'de otomatik donen ileri oku. */
export function ArrowIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={`${className} shrink-0 rtl:-scale-x-100`}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={`${className} shrink-0`}
    >
      <path
        d="M6.6 3.5 9 3.9l1.2 3.4-1.9 1.4a12 12 0 0 0 5 5l1.4-1.9 3.4 1.2.4 2.4a1.8 1.8 0 0 1-1.9 2A16.5 16.5 0 0 1 4.6 5.4a1.8 1.8 0 0 1 2-1.9Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Musteri logo yuklemediginde kullanilan marka isareti. */
export function CupIcon({ className = "size-9" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`${className} shrink-0`}
    >
      <circle cx="20" cy="20" r="18" />
      <path
        d="M13 15h11a4 4 0 0 1 0 8h-1a5 5 0 0 1-10 0v-8Zm12 1.5h.5a2.5 2.5 0 0 1 0 5H25"
        strokeLinejoin="round"
      />
    </svg>
  );
}
