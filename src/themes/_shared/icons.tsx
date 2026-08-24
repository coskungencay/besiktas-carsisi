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


/* -------------------------------------------------------------------------- */
/*                            Sosyal medya glifleri                            */
/* -------------------------------------------------------------------------- */

/**
 * Platform glifleri. Hepsi `currentColor` ve `em` tabanli — renk ve boyut
 * karari cagiran temaya ait, yani "ortak katman gorsel karar tasimaz" kurali
 * bozulmuyor.
 *
 * Anahtarlar lib/social.ts icindeki `key` degerleriyle AYNI olmali; bilinmeyen
 * bir platform gelirse `socialIcon` null doner ve tema metne duser.
 */
const SOCIAL_PATHS: Record<string, string> = {
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.86s0 3.6-.07 4.86c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.86.07s-3.6 0-4.86-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.86c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.46 2.2 8.84 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.74.07-.9.04-1.38.19-1.7.31-.43.17-.73.37-1.05.69-.32.32-.52.62-.69 1.05-.12.32-.27.8-.31 1.7-.06 1.23-.07 1.6-.07 4.18s.01 2.95.07 4.18c.04.9.19 1.38.31 1.7.17.43.37.73.69 1.05.32.32.62.52 1.05.69.32.12.8.27 1.7.31 1.23.06 1.6.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.38-.19 1.7-.31.43-.17.73-.37 1.05-.69.32-.32.52-.62.69-1.05.12-.32.27-.8.31-1.7.06-1.23.07-1.6.07-4.18s-.01-2.95-.07-4.18c-.04-.9-.19-1.38-.31-1.7a2.9 2.9 0 0 0-.69-1.05 2.9 2.9 0 0 0-1.05-.69c-.32-.12-.8-.27-1.7-.31C15.5 4.01 15.14 4 12 4Zm0 3.06a4.94 4.94 0 1 1 0 9.88 4.94 4.94 0 0 1 0-9.88Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.15-3.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z",
  facebook:
    "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z",
  x: "M17.53 3h3.2l-6.99 7.99L22 21h-6.44l-5.04-6.59L4.75 21H1.54l7.47-8.54L1.4 3h6.6l4.56 6.03L17.53 3Zm-1.12 16.06h1.77L7.68 4.84H5.78l10.63 14.22Z",
  youtube:
    "M21.58 7.19a2.51 2.51 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.81.41a2.51 2.51 0 0 0-1.77 1.78C2 8.76 2 12 2 12s0 3.24.42 4.81c.23.86.9 1.54 1.77 1.78C5.75 19 12 19 12 19s6.25 0 7.81-.41a2.51 2.51 0 0 0 1.77-1.78C22 15.24 22 12 22 12s0-3.24-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z",
  tiktok:
    "M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-1.85-2.48V9.77a5.68 5.68 0 1 0 4.94 5.63V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.24-1.48Z",
  linkedin:
    "M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94ZM20.44 21h-3.38v-6.09c0-1.45-.03-3.32-2.02-3.32-2.03 0-2.34 1.58-2.34 3.21V21H9.32V8.5h3.24v1.71h.05c.45-.86 1.55-1.76 3.2-1.76 3.42 0 4.05 2.25 4.05 5.18V21Z",
  tripadvisor:
    "M12 6.5c-2.3 0-4.42.6-6.2 1.7H2l1.6 1.75A4.55 4.55 0 0 0 6.9 17.5a4.5 4.5 0 0 0 3.28-1.42L12 18l1.82-1.92a4.5 4.5 0 0 0 3.28 1.42 4.55 4.55 0 0 0 3.3-7.55L22 8.2h-3.8A11.6 11.6 0 0 0 12 6.5Zm-5.1 9.2a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm10.2 0a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm-10.2-4a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Zm10.2 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z",
  yelp: "M12.3 3.1v8.2c0 .6.7.9 1.1.5l3.4-3.2c.4-.4.3-1-.2-1.2l-3.4-1.6a.7.7 0 0 0-.9.3Zm-2.6 6.2L6.2 7.5c-.5-.2-1 .1-1.1.6l-.6 2.9c-.1.5.3 1 .8 1l4.1.3c.6 0 .9-.7.5-1.1l-.2-.9Zm.4 3.4-3.7 1.4c-.5.2-.7.8-.3 1.2l2 2.2c.4.4 1 .3 1.2-.2l1.6-3.6c.2-.5-.3-1.1-.8-1Zm2.6.6c-.4-.4-1.1-.1-1.1.5v3.9c0 .5.5.9 1 .8l2.9-.7c.5-.1.8-.7.5-1.1l-3.3-3.4Z",
};

export function SocialIcon({
  platform,
  className = "size-5",
}: {
  platform: string;
  className?: string;
}) {
  const path = SOCIAL_PATHS[platform];
  if (!path) return null;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${className} shrink-0`}
    >
      <path d={path} />
    </svg>
  );
}

export function hasSocialIcon(platform: string): boolean {
  return platform in SOCIAL_PATHS;
}
