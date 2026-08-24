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

/*
 * IKI KARE URETILIYOR — telefon icin AYRI bir harita.
 *
 * Tek kare vardi (1600x800) ve telefonda 342px genisligindeki kutuya
 * sigdiriliyordu: yani harita %32 olcekte basiliyor, OSM'nin sokak adlari
 * 3-4 piksele iniyor ve harita "gri bir doku"ya donuyordu. Ustelik oran
 * telefonda 4:3, kaynak 2:1 oldugu icin object-cover kenarlardan da
 * kirpiyordu — yani indirilen 651 KB'lik karenin cogu hic gorunmuyordu.
 *
 * Cozum zoom'u degistirmek DEGIL (o sokak adlarini da buyutur, cerceveyi de
 * daraltir): ayni zoom'da DAHA KUCUK BIR PENCERE almak. 800x600'luk kare
 * ~1,4 km x 1,05 km ediyor — Bogaz ve iskele hala cercevede, cunku carsi
 * kiyiya ~400 m. Telefonda 342 CSS px = 684 aygit pikseli; 800px'lik kaynak
 * neredeyse 1:1 basiliyor ve sokak adlari okunuyor.
 *
 * `aspect` degeri Location.tsx'teki kutuyla ayni olmali; yoksa object-cover
 * yine kirpar.
 */
type Variant = {
  /** Dosya adi oneki. */
  key: string;
  width: number;
  height: number;
  /** Isaretci boyu — kucuk karede oransal olarak kucuk kalmali. */
  marker: number;
};

const VARIANTS: Variant[] = [
  { key: "genis", width: 1600, height: 800, marker: 54 },
  { key: "dar", width: 800, height: 600, marker: 46 },
];

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

  /*
   * Karolar BIR KEZ indiriliyor.
   *
   * Iki kare de ayni zoom'da ve ayni merkezde; dar kare genis karenin tam
   * ortasinda kalan bir alt pencere. Yani en genis pencereyi kaplayan tek bir
   * izgara ikisine de yetiyor. Varyant basina ayri indirme, OSM'nin karo
   * sunucusuna iki kat gereksiz yuk bindirirdi.
   */
  const gridW = Math.max(...VARIANTS.map((v) => v.width));
  const gridH = Math.max(...VARIANTS.map((v) => v.height));

  const centerPxX = lngToTileX(settings.lng, ZOOM) * TILE;
  const centerPxY = latToTileY(settings.lat, ZOOM) * TILE;

  /*
   * Izgara, KIRPMA PENCERESINE gore kuruluyor — merkeze gore degil.
   *
   * Once dunya piksel uzayinda en genis pencerenin sol/ust kosesi bulunuyor
   * (carsi tam ortada kalacak sekilde), sonra o kosenin dustugu karodan
   * baslaniyor. Boylece pencere HER ZAMAN izgaranin icinde kaliyor ve
   * isaretci tam merkeze oturuyor.
   *
   * Onceki surumde izgara merkeze gore kuruluyordu ve pencere kenara dayanip
   * kirpiliyordu: isaretci merkezden 130px kayik duruyordu.
   */
  const windowX = centerPxX - gridW / 2;
  const windowY = centerPxY - gridH / 2;
  const startX = Math.floor(windowX / TILE);
  const startY = Math.floor(windowY / TILE);

  // Pencere + bir karoluk tasma payi.
  const cols = Math.ceil(gridW / TILE) + 1;
  const rows = Math.ceil(gridH / TILE) + 1;

  console.log(`[harita] ${cols * rows} karo indiriliyor (zoom ${ZOOM})…`);

  const composites: OverlayOptions[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const tile = await fetchTile(startX + col, startY + row, ZOOM);
      composites.push({ input: tile, left: col * TILE, top: row * TILE });
      // OSM'ye nazik davran: karolar arasinda kisa bekleme.
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  }

  // Once yalnizca karolari birlestir (isaretci kirpmadan SONRA basilacak).
  const grid = await sharp({
    create: { width: cols * TILE, height: rows * TILE, channels: 3, background: "#e8e4dd" },
  })
    .composite(composites)
    .png()
    .toBuffer();

  // Carsinin izgara icindeki piksel konumu.
  const centerInGridX = centerPxX - startX * TILE;
  const centerInGridY = centerPxY - startY * TILE;

  mkdirSync(OUT_DIR, { recursive: true });

  const written: { key: string; file: string; width: number; height: number }[] = [];

  for (const variant of VARIANTS) {
    /*
     * Her varyantin penceresi carsi MERKEZDE kalacak sekilde kirpiliyor.
     * Yuvarlama sonrasi pencere izgaranin disina tasmasin diye sinirlaniyor;
     * pratikte tasmiyor (izgara en genis pencereden bir karo buyuk).
     */
    const left = Math.round(centerInGridX - variant.width / 2);
    const top = Math.round(centerInGridY - variant.height / 2);

    const image = await sharp(grid)
      .extract({ left, top, width: variant.width, height: variant.height })
      .composite([
        {
          input: markerSvg(variant.marker),
          // Carsi kirpilmis karenin TAM ORTASINDA.
          left: Math.round(variant.width / 2 - variant.marker / 2),
          // Isaretcinin UCU koordinati gostermeli, merkezi degil.
          top: Math.round(variant.height / 2 - variant.marker),
        },
      ])
      /*
       * WEBP, PNG DEGIL.
       *
       * Onceki tek kare 651 KB'lik bir PNG'ydi ve Next'in gorsel
       * iyilestiricisinden geciyordu. Iki kare uretince ikisini de <picture>
       * ile sunmak gerekiyor (Next/Image sanat yonlendirmesi yapmiyor), yani
       * iyilestirici devrede degil — sikistirma artik BIZIM isimiz.
       * Karo grafiginde webp/q82 gozle ayirt edilemiyor ve dosya ~5 kat
       * kuculuyor.
       */
      .webp({ quality: 82 })
      .toBuffer();

    const hash = createHash("sha256").update(image).digest("hex").slice(0, 10);
    const fileName = `konum-${variant.key}-${hash}.webp`;
    writeFileSync(join(OUT_DIR, fileName), image);
    written.push({ key: variant.key, file: fileName, width: variant.width, height: variant.height });

    const kb = Math.round(image.byteLength / 1024);
    console.log(`[harita] public/harita/${fileName} (${variant.width}x${variant.height}, ${kb} KB)`);
  }

  // Eski karelerimizi birak etme; public/ sismesin.
  const keep = new Set(written.map((w) => w.file));
  for (const entry of readdirSync(OUT_DIR)) {
    if (entry.startsWith("konum") && !keep.has(entry)) {
      rmSync(join(OUT_DIR, entry), { force: true });
      console.log(`[harita] eski kare silindi: ${entry}`);
    }
  }

  const wide = written.find((w) => w.key === "genis")!;
  const narrow = written.find((w) => w.key === "dar")!;

  writeFileSync(
    ASSET_MODULE,
    `/**
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
  src: "/harita/${wide.file}",
  width: ${wide.width},
  height: ${wide.height},
} as const;

export const MAP_NARROW = {
  src: "/harita/${narrow.file}",
  width: ${narrow.width},
  height: ${narrow.height},
} as const;
`,
    "utf8",
  );

  console.log("[harita] src/themes/beyaz-oda/map-asset.ts guncellendi.");
  console.log("[harita] Atif zorunlu: © OpenStreetMap katkida bulunanlar.");
}

void main();
