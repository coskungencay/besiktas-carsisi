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
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import type { OverlayOptions } from "sharp";

import { SINGLETON_ID, db } from "../src/db";
import { siteSettings } from "../src/db/schema";

const ZOOM = 17;
const TILE = 256;
/** Karo izgarasi: 4x3 = 1024x768, ardindan 3:2 orana kirpiliyor. */
const COLS = 4;
const ROWS = 3;

const OUT_DIR = join(process.cwd(), "public", "harita");
const OUT_FILE = "konum.png";

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
  writeFileSync(join(OUT_DIR, OUT_FILE), image);

  console.log(`[harita] public/harita/${OUT_FILE} yazildi (${width}x${height}).`);
  console.log("[harita] Atif zorunlu: © OpenStreetMap katkida bulunanlar.");
}

void main();
