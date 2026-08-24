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
import { menuCategories, siteSettings } from "../src/db/schema";
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

  await importCategoryCovers();
  console.log("[varlik] Tamamlandi.");
}

/* -------------------------------------------------------------------------- */
/*                          Kategori kapak gorselleri                          */
/* -------------------------------------------------------------------------- */

/**
 * Her kategoriye eski resmi sitedeki vitrin karesi.
 *
 * Bunlar carsinin GERCEK dukkan cepheleri (1020x1094, net kamera kareleri) —
 * Google'dan gelen kullanici fotograflarindan belirgin sekilde kaliteli ve
 * dogrudan o kategoriyi anlatiyorlar. Anahtar, kategorinin ADI: script
 * kategoriyi adiyla bulur, boylece panelden sira degistirilse de calisir.
 */
const CATEGORY_COVERS: Record<string, string> = {
  "Bay & Bayan Giyim": "bay-bayan.jpg",
  "Ayakkabı": "ayakkabi.jpg",
  "Çanta & Valiz": "canta.jpg",
  "İç Giyim": "icgiyim-on.jpg",
  "Bebe Giyim": "bebegiyim.jpg",
  "Altın, Gümüş & Saat": "altn-saat-gumus.jpg",
  "Bujiteri & Peruk": "bujiteri-peruk.jpg",
  "Terzi": "terzi.jpg",
  "Kitap, Çizgi Roman & Müzik": "muzik.jpg",
  "Reklam & Baskı": "reklam.jpg",
  "Elektronik & Telefon": "elektrik-elektronik.jpg",
  "Kuaför": "kuafr.jpg",
  "SPA & Güzellik": "spa.jpg",
  "Kuru Temizleme": "kurutemizleme.jpg",
  "Evcil Hayvan": "evcilhayvanlar-pets.jpg",
  "Oyuncak & Parti": "oyuncaki.jpg",
  "Gıda": "gida.jpg",
  "Kafeterya & Çay": "kafe.jpg",
  "Para Transferi": "sender.jpg",
  "Kamu Hizmetleri": "ptt.jpg",
};

async function importCategoryCovers() {
  const rows = db.select().from(menuCategories).all();
  let done = 0;
  const missing: string[] = [];

  for (const row of rows) {
    const file = CATEGORY_COVERS[row.name];
    if (!file) {
      missing.push(row.name);
      continue;
    }
    if (row.imageUrl) await deleteImage(row.imageUrl);

    const buffer = readFileSync(join(ASSETS, "kategori", file));
    const stored = await storeImage(
      new File([new Uint8Array(buffer)], file, { type: "image/jpeg" }),
    );
    db.update(menuCategories)
      .set({ imageUrl: stored.url })
      .where(eq(menuCategories.id, row.id))
      .run();
    done += 1;
  }

  console.log(`[varlik] ${done}/${rows.length} kategoriye kapak gorseli yazildi.`);
  if (missing.length > 0) {
    console.log(`[varlik] Gorseli olmayan kategoriler: ${missing.join(", ")}`);
  }
}

void main();
