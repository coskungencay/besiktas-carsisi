/**
 * OTOMATIK URETILDI — elle duzenlemeyin.
 * Kaynak: scripts/build-map.ts  (pnpm tsx --conditions=react-server scripts/build-map.ts)
 *
 * Dosya adi haritanin icerik ozetini tasir: koordinat ya da zoom degisip
 * harita yeniden uretildiginde ad da degisir ve onbellek gecersizlesir.
 *
 * IKI KARE: genis (masaustu, 2:1) ve dar (telefon, 4:3). Gerekcesi
 * build-map.ts icinde yazili — ozeti: tek kare telefonda %32 olcekte
 * basiliyor ve sokak adlari okunmuyordu.
 */
export const MAP_WIDE = {
  src: "/harita/konum-genis-cee96174ef.webp",
  width: 1600,
  height: 800,
} as const;

export const MAP_NARROW = {
  src: "/harita/konum-dar-f5c610e464.webp",
  width: 800,
  height: 600,
} as const;
