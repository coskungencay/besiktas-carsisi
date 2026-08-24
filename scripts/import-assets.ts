/**
 * Carsinin KENDI marka varliklarini siteye aktarir (amblem + cephe fotograflari).
 * Kullanim: pnpm tsx --conditions=react-server --env-file-if-exists=.env scripts/import-assets.ts
 *
 * NEDEN GOOGLE'DAN AYRI: bu dosyalar carsinin kendi mali (eski resmi
 * sitesinden), Google fotograflari ise kullanicilarin yukledigi ve Maps
 * Platform sartlarina tabi iceriktir. Kaynagi ayirmak, ileride biri
 * degistiginde digerine dokunmadan yeniden calistirmayi mumkun kiliyor.
 *
 * CALISTIRMA SIRASI:  load-carsi  ->  import-assets  ->  import-google
 *
 * IDEMPOTENT: her calistirmada logo ve kapak yeniden yuklenir, eskisi
 * diskten silinir.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";

import { SINGLETON_ID, db } from "../src/db";
import { siteSettings } from "../src/db/schema";
import { deleteImage, storeImage } from "../src/lib/uploads";

const ASSETS = join(import.meta.dirname, "assets");

async function upload(file: string, mime: string) {
  const buffer = readFileSync(join(ASSETS, file));
  return storeImage(new File([new Uint8Array(buffer)], file, { type: mime }));
}

async function main() {
  const current = db
    .select({ logoUrl: siteSettings.logoUrl, heroImageUrl: siteSettings.heroImageUrl })
    .from(siteSettings)
    .where(eq(siteSettings.id, SINGLETON_ID))
    .get();

  if (current?.logoUrl) await deleteImage(current.logoUrl);
  if (current?.heroImageUrl) await deleteImage(current.heroImageUrl);

  /*
   * AMBLEM. Kaynak 185x181 — kucuk. Sitede en fazla 96px basiliyor, o olcude
   * keskin duruyor; acilis ekraninda da 88px. Carsi yonetiminden vektor
   * surum istenmeli (bkz. scripts/assets/README.md).
   */
  const logo = await upload("amblem.gif", "image/gif");

  /*
   * KAPAK: merdivenli giris cephesi.
   *
   * NEDEN TABELALI KARE DEGIL: hero'da zaten devasa bir kelime-marka var.
   * Catidaki tabela da ayni uc kelimeyi yaziyor ve fonda "cizgi roman-comics"
   * afisiyle birlikte basligin altinda okunmaya calisiyor — iki metin
   * birbiriyle yarisiyordu. Giris karesi ayni binayi gosteriyor ama fonda
   * rakip yazi yok; merdiven de goze dogal bir derinlik veriyor.
   * Tabelali kare galeride ilk sirada duruyor.
   */
  const hero = await upload("cephe-giris.jpg", "image/jpeg");

  db.update(siteSettings)
    .set({ logoUrl: logo.url, heroImageUrl: hero.url, updatedAt: new Date() })
    .where(eq(siteSettings.id, SINGLETON_ID))
    .run();

  console.log(`[varlik] Amblem  -> ${logo.url}`);
  console.log(`[varlik] Kapak   -> ${hero.url}`);
  console.log("[varlik] Tamamlandi.");
}

void main();
