/**
 * Amblemden tarayici ikonlarini uretir.
 * Kullanim: pnpm tsx --conditions=react-server scripts/build-icons.ts
 *
 * NEDEN SABLONDAN AYRILDIK: sablon ikonu ISLETMENIN BAS HARFINDEN uretiyordu
 * (src/app/icon.tsx). Gerekcesi soyleydi: musteri logolari cogunlukla YATAY
 * kelime isaretidir ve 16px'lik kareye sigdirildiginda okunaksiz bir kivrima
 * doner.
 *
 * Bu carsida durum tam tersi: amblem zaten DAIRESEL ve tek bir monogramdan
 * ibaret — favicon icin bicilmis kaftan. Sari zemin sekme cubugunda da
 * hemen secilir. Yani sablonun gerekcesi burada gecerli degil.
 *
 * Uretilen dosyalar Next'in DOSYA TABANLI ikon kuralina giriyor:
 *   src/app/icon.png        -> <link rel="icon">
 *   src/app/apple-icon.png  -> <link rel="apple-touch-icon">
 * Bu dosyalar varken icon.tsx / apple-icon.tsx calismaz; ikisi de silindi.
 *
 * Kaynak 185x181 ve kare degil. Once kisa kenara gore KARE kirpiliyor
 * (amblem dairesel oldugu icin kayip yok), sonra hedef olcuye buyutuluyor.
 * Buyutme `kernel: "lanczos3"` ile: dairesel kenar 180px'te bile temiz kaliyor.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import type { Color } from "sharp";

const SRC = join(import.meta.dirname, "assets", "amblem.gif");

/** Apple dokunma ikonu seffaflik desteklemez; zemin beyaz basiliyor. */
const APPLE_BG = { r: 255, g: 255, b: 255, alpha: 1 };

async function square(size: number, background?: Color) {
  const image = sharp(SRC).ensureAlpha();
  const meta = await image.metadata();
  const side = Math.min(meta.width ?? 0, meta.height ?? 0);

  let pipeline = sharp(SRC)
    .ensureAlpha()
    .extract({
      left: Math.round(((meta.width ?? 0) - side) / 2),
      top: Math.round(((meta.height ?? 0) - side) / 2),
      width: side,
      height: side,
    })
    .resize(size, size, { kernel: "lanczos3", fit: "fill" });

  if (background) pipeline = pipeline.flatten({ background });
  return pipeline.png().toBuffer();
}

async function main() {
  const appDir = join(process.cwd(), "src", "app");

  writeFileSync(join(appDir, "icon.png"), await square(180));
  console.log("[ikon] src/app/icon.png (180x180)");

  writeFileSync(join(appDir, "apple-icon.png"), await square(180, APPLE_BG));
  console.log("[ikon] src/app/apple-icon.png (180x180, beyaz zemin)");
}

void main();
