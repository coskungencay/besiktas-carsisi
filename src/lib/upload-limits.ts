/**
 * Yukleme tavanlari.
 *
 * NEDEN AYRI DOSYA: bu sayilarin hem SUNUCUDA (dogrulama) hem ISTEMCIDE
 * (form gonderilmeden once uyarmak) bilinmesi gerekiyor. `uploads.ts` en
 * ustunde `import "server-only"` tasidigi icin bir istemci bileseninden
 * import edilemez; sabitler oradan alinsaydi tarayici tarafinda sayilari
 * elle tekrar yazmak gerekirdi ve iki kopya kaciniLmaz olarak birbirinden
 * ayrilirdi. Burasi ikisinin de guvenle okuyabildigi tek kaynak.
 */

/** Tek bir dosyanin tavani. Panelde de bu sayi yaziyor. */
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024; // 12 MB

/**
 * TEK BIR server action govdesinin tavani.
 *
 * Next.js'in Server Actions varsayilani 1 MB'dir ve asildiginda istek daha
 * uygulama koduna VARMADAN 413 ile duser; kullanici anlamli bir uyari degil
 * ham "Application error" ekrani gorur. Bu, panelde canli olarak yasandi:
 * galeri formu "30 dosya, dosya basina 12 MB" (yani 360 MB) vaat ediyordu
 * ama cerceve 1 MB'da kesiyordu — telefonla cekilmis HERHANGI bir fotograf
 * yuklenemiyordu.
 *
 * Tavan next.config.ts'te 64mb'a cikarildi; buradaki 60 MB ondan kasitli
 * olarak dusuk: multipart sinirlari, alan adlari ve formun diger alanlari da
 * ayni govdede gidiyor. Aradaki 4 MB o pay.
 *
 * NEDEN 360 MB DEGIL: server action govdesi bellekte TAMAMEN tamponlanir.
 * Sunucuda 3,8 GB RAM var ve uzerinde baska uygulamalar da calisiyor;
 * 360 MB'lik bir tampon tek bir yuklemeyle konteyneri dusururdu.
 *
 * DEGISTIRIRSEN next.config.ts'teki `bodySizeLimit` degerini de guncelle.
 */
export const MAX_ACTION_BYTES = 60 * 1024 * 1024; // 60 MB

/** Galeriye tek seferde secilebilecek dosya adedi. */
export const MAX_BATCH_FILES = 30;

/** Insan okur bicimde boyut ("3,4 MB"). Hata metinlerinde kullaniliyor. */
export function formatBytes(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  if (mb >= 10) return `${Math.round(mb)} MB`;
  return `${mb.toFixed(1).replace(".", ",")} MB`;
}
