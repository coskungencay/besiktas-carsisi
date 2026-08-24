/**
 * Konum bolumu icin STATIK harita gorseli uretir.
 * Kullanim: pnpm tsx --conditions=react-server --env-file-if-exists=.env scripts/build-map.ts
 *
 * NEDEN GOMULU HARITA DEGIL:
 *   - Google Maps iframe'i her sayfa acilisinda ziyaretciyi Google'a tanitir
 *     (KVKK/GDPR'de acik riza gerektirir) ve sayfaya ~1MB script yukler.
 *   - Google Static Maps API her goruntulemede UCRETLENDIRILIR ve calisma
 *     aninda API anahtari ister.
 *
 * Bu script OpenStreetMap karolarini BIR KEZ indirip tek bir PNG'ye birlestirir.
 * Sonuc `public/harita/` altinda durur: calisma aninda hicbir dis istek yok,
 * hicbir ucret yok, hicbir izleme yok. Tiklaninca ziyaretcinin kendi harita
 * uygulamasi aciliyor (yol tarifi baglantisi) — yani islev de kayboluyor degil.
 *
 * Koordinat degisirse bu script yeniden calistirilir.
 *
 * ATIF ZORUNLU: OpenStreetMap katkida bulunanlar. Konum bolumu bu atfi basiyor;
 * kaldirmayin (ODbL).
 */
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import type { OverlayOptions } from "sharp";

import { SINGLETON_ID, db } from "../src/db";
import { siteSettings } from "../src/db/schema";

/*
 * ZOOM 17 -> 16 ve izgara 4x3 -> 6x3.
 *
 * NEDEN: zoom 17'de kare yalnizca carsinin sokaklarini gosteriyordu; Besiktas'i
 * Besiktas yapan BOGAZ cerceveye hic girmiyordu ve harita "herhangi bir mahalle
 * plani" gibi duruyordu. Zoom 16'da piksel basina ~1,8 m dusuyor; 1536px
 * genislik ~2,8 km ediyor. Carsi ortada dururken sahil (dogusunda ~400 m) ve
 * Besiktas iskelesi cerceveye giriyor.
 *
 * Oran da 2:1'e yaklasiyor (1536x768) — bolumdeki genis serit kutusuyla ayni.
 */
const ZOOM = 16;
const TILE = 256;
const COLS = 6;
const ROWS = 3;

const OUT_DIR = join(process.cwd(), "public", "harita");
/**
 * Bilesenin okudugu yol buraya yaziliyor.
 *
 * NEDEN SABIT "konum.png" DEGIL: dosya adi sabit kalinca harita yeniden
 * uretildiginde Next'in gorsel onbellegi (ve tarayici/CDN) ESKI kareyi
 * servis etmeye devam ediyor — koordinat ya da zoom degistiginde sayfada
 * hicbir sey degismiyor gibi gorunuyor. Bu bir kez yasandi: zoom 17'den
 * 16'ya gecildi ama sayfada hala eski dar kare duruyordu.
 *
 * Dosya adi artik ICERIK OZETINI tasiyor; icerik degisince ad da degisiyor
 * ve onbellek kendiliginden gecersizlesiyor.
 */
const ASSET_MODULE = join(process.cwd(), "src", "themes", "beyaz-oda", "map-asset.ts");

/** OSM kullanim politikasi: gercek bir User-Agent zorunlu. */
const USER_AGENT =
  "buyuk-besiktas-carsisi-site/1.0 (tek seferlik statik harita uretimi; bilgi@buyukbesiktascarsi.com)";

/* --------------------------------- karo matematigi ------------------------ */

function lngToTileX(lng: number, zoom: number): number {
  return ((lng + 180) / 360) * 2 ** zoom;
}

function latToTileY(lat: number, zoom: number): number {
  const rad = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** zoom;
}

async function fetchTile(x: number, y: number, z: number): Promise<Buffer> {
  const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok) {
    throw new Error(`Karo alinamadi ${z}/${x}/${y}: HTTP ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

/* ----------------------------------- isaretci ----------------------------- */

/**
 * Konum isaretcisi. Carsinin amblem sarisi + koyu kontur: haritanin acik
 * gri/bej tonlari uzerinde her iki modda da secilir.
 */
function markerSvg(size: number): Buffer {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
    <path d="M24 3c-7.2 0-13 5.8-13 13 0 9.8 13 29 13 29s13-19.2 13-29c0-7.2-5.8-13-13-13z"
          fill="#FFE400" stroke="#101112" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="24" cy="16" r="4.6" fill="#101112"/>
  </svg>`);
}

/* ------------------------------------ ana --------------------------------- */

async function main() {
  const settings = db
    .select({ lat: siteSettings.lat, lng: siteSettings.lng })
    .from(siteSettings)
    .where(eq(siteSettings.id, SINGLETON_ID))
    .get();

  if (!settings?.lat || !settings?.lng) {
    console.error("[harita] Koordinat girilmemis; harita uretilmedi.");
    return;
  }

  const centerX = lngToTileX(settings.lng, ZOOM);
  const centerY = latToTileY(settings.lat, ZOOM);

  // Izgaranin sol ust karosu
  const startX = Math.floor(centerX - COLS / 2);
  const startY = Math.floor(centerY - ROWS / 2);

  console.log(`[harita] ${COLS * ROWS} karo indiriliyor (zoom ${ZOOM})…`);

  const composites: OverlayOptions[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const tile = await fetchTile(startX + col, startY + row, ZOOM);
      composites.push({ input: tile, left: col * TILE, top: row * TILE });
      // OSM'ye nazik davran: karolar arasinda kisa bekleme.
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  }

  const width = COLS * TILE;
  const height = ROWS * TILE;

  // Merkezin izgara icindeki piksel konumu — isaretci tam oraya oturacak.
  const pinX = Math.round((centerX - startX) * TILE);
  const pinY = Math.round((centerY - startY) * TILE);

  const MARKER = 46;
  composites.push({
    input: markerSvg(MARKER),
    left: Math.round(pinX - MARKER / 2),
    // Isaretcinin UCU koordinati gostermeli, merkezi degil.
    top: Math.round(pinY - MARKER),
  });

  const image = await sharp({
    create: { width, height, channels: 3, background: "#e8e4dd" },
  })
    .composite(composites)
    .png()
    .toBuffer();

  mkdirSync(OUT_DIR, { recursive: true });

  const hash = createHash("sha256").update(image).digest("hex").slice(0, 10);
  const fileName = `konum-${hash}.png`;

  // Eski karelerimizi birak etme; public/ sismesin.
  for (const entry of readdirSync(OUT_DIR)) {
    if (entry.startsWith("konum") && entry !== fileName) {
      rmSync(join(OUT_DIR, entry), { force: true });
    }
  }

  writeFileSync(join(OUT_DIR, fileName), image);

  writeFileSync(
    ASSET_MODULE,
    `/**
 * OTOMATIK URETILDI — elle duzenlemeyin.
 * Kaynak: scripts/build-map.ts  (pnpm tsx --conditions=react-server scripts/build-map.ts)
 *
 * Dosya adi haritanin icerik ozetini tasir: koordinat ya da zoom degisip
 * harita yeniden uretildiginde ad da degisir ve onbellek gecersizlesir.
 */
export const MAP_IMAGE = "/harita/${fileName}";
export const MAP_WIDTH = ${width};
export const MAP_HEIGHT = ${height};
`,
    "utf8",
  );

  console.log(`[harita] public/harita/${fileName} yazildi (${width}x${height}).`);
  console.log("[harita] src/themes/beyaz-oda/map-asset.ts guncellendi.");
  console.log("[harita] Atif zorunlu: © OpenStreetMap katkida bulunanlar.");
}

void main();
