import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { extname, isAbsolute, join, resolve } from "node:path";
import sharp from "sharp";

import { uploadsDir } from "@/lib/env";
import { MAX_UPLOAD_BYTES } from "@/lib/upload-limits";

export const MAX_WIDTH = 1920;
export const THUMB_WIDTH = 400;
export const UPLOAD_URL_PREFIX = "/api/uploads/";

/*
 * Dosya tavani artik upload-limits.ts'te: ayni sayi istemci tarafinda da
 * gerekiyor ve bu dosya `server-only` oldugu icin oradan okunamiyor.
 * Disariya buradan da veriliyor ki mevcut import'lar kirilmasin.
 */
export { MAX_UPLOAD_BYTES };

/**
 * Hareketli gorseller icin daha dar bir tavan. Animasyonlu bir WebP'de her kare
 * ayri ayri kodlanir; 1920px'te 60 karelik bir GIF onlarca MB'a cikar ve
 * musterinin kotasini tek dosyayla yer. 960px animasyon icin fazlasiyla yeterli.
 */
export const MAX_ANIMATED_WIDTH = 960;

/* -------------------------------------------------------------------------- */
/*                                    Kota                                     */
/* -------------------------------------------------------------------------- */

/** Musteri basina yuklenebilecek medya adedi (her yukleme = 1 medya). */
export const MAX_MEDIA_COUNT = 100;

/**
 * Diskte kaplanabilecek toplam alan. DIKKAT: bu, yuklenen dosyalarin degil
 * diskteki UC varyantin (ana WebP + thumb + orijinal) toplamidir; kullanici
 * "1200 MB" gordugunde sunucuda gercekten o kadar yer tutuldugunu bilir.
 */
export const MAX_MEDIA_BYTES = 1200 * 1024 * 1024; // 1200 MB

export type MediaUsage = {
  /** Yuklenmis medya adedi (uuid sayisi, varyantlar tek sayilir). */
  count: number;
  /** Diskteki toplam bayt (tum varyantlar dahil). */
  bytes: number;
  maxCount: number;
  maxBytes: number;
};

/**
 * Kotayi DB'de sayac tutarak degil, DISKI okuyarak olcuyoruz. Sayac tutmak
 * silme/hata yollarinda kolayca gercekle uyusmaz hale gelir; dizin taramasi
 * ~300 dosyada milisaniyeler suruyor ve her zaman dogru.
 */
export async function mediaUsage(): Promise<MediaUsage> {
  const root = uploadsRoot();
  const { readdir, stat } = await import("node:fs/promises");

  let entries: string[] = [];
  try {
    entries = await readdir(root);
  } catch {
    // Dizin henuz yoksa hicbir sey yuklenmemis demektir.
    return { count: 0, bytes: 0, maxCount: MAX_MEDIA_COUNT, maxBytes: MAX_MEDIA_BYTES };
  }

  const ids = new Set<string>();
  let bytes = 0;

  await Promise.all(
    entries.map(async (entry) => {
      const id = entry.slice(0, 36);
      if (!/^[a-f0-9-]{36}$/i.test(id)) return;
      ids.add(id);
      try {
        const info = await stat(join(root, entry));
        bytes += info.size;
      } catch {
        /* dosya arada silinmis olabilir; sayima girmez */
      }
    }),
  );

  return {
    count: ids.size,
    bytes,
    maxCount: MAX_MEDIA_COUNT,
    maxBytes: MAX_MEDIA_BYTES,
  };
}

function formatMb(bytes: number): string {
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/tiff",
]);

export function uploadsRoot(): string {
  const raw = uploadsDir();
  return isAbsolute(raw) ? raw : resolve(process.cwd(), raw);
}

/**
 * Dosya adini guvenli hale getirir: sadece uuid tabanli isimlere izin verilir.
 * Path traversal ("../") kesin olarak engellenir.
 */
export function safeUploadPath(fileName: string): string | null {
  if (!/^[a-f0-9-]{36}(\.thumb|\.orig)?\.[a-z0-9]{2,5}$/i.test(fileName)) {
    return null;
  }
  const root = uploadsRoot();
  const full = resolve(root, fileName);
  return full.startsWith(root) ? full : null;
}

export type StoredImage = {
  /** DB'ye yazilacak public URL: /api/uploads/<uuid>.webp */
  url: string;
  /** /api/uploads/<uuid>.thumb.webp */
  thumbUrl: string;
  width: number;
  height: number;
};

export class UploadError extends Error {}

/**
 * Yuklenen gorseli isler:
 *   <uuid>.webp        -> max 1920px genislikte WebP (ana gorsel)
 *   <uuid>.thumb.webp  -> 400px genislikte WebP (kucuk onizleme)
 *   <uuid>.orig.<ext>  -> orijinal dosya (dokunulmadan saklanir)
 */
export async function storeImage(file: File): Promise<StoredImage> {
  if (!file || file.size === 0) {
    throw new UploadError("Dosya boş.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError(
      `Dosya çok büyük (en fazla ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB).`,
    );
  }
  if (file.type && !ALLOWED_MIME.has(file.type)) {
    throw new UploadError("Sadece görsel dosyaları yükleyebilirsiniz.");
  }

  /*
   * Kota kontrolu diske YAZMADAN once yapilir. Dosya boyutunu oldugu gibi
   * eklemek yeterli degil ama iyi bir ust tahmin: orijinal zaten aynen
   * saklaniyor, WebP varyantlari onun yaninda kucuk kaliyor.
   */
  const usage = await mediaUsage();
  if (usage.count >= usage.maxCount) {
    throw new UploadError(
      `Medya sınırına ulaşıldı (${usage.maxCount} dosya). Yeni yükleme için ` +
        `galeriden veya menüden kullanmadığınız görselleri silin.`,
    );
  }
  if (usage.bytes + file.size > usage.maxBytes) {
    throw new UploadError(
      `Depolama alanı dolmak üzere (${formatMb(usage.bytes)} / ` +
        `${formatMb(usage.maxBytes)}). Kullanmadığınız görselleri silin.`,
    );
  }

  const root = uploadsRoot();
  await mkdir(root, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());

  let width: number | undefined;
  let height: number | undefined;
  let pages = 1;
  try {
    const meta = await sharp(buffer).metadata();
    width = meta.width;
    height = meta.height;
    pages = meta.pages ?? 1;
  } catch {
    throw new UploadError("Dosya geçerli bir görsel değil.");
  }
  if (!width || !height) {
    throw new UploadError("Görsel boyutları okunamadı.");
  }

  /*
   * Hareketli gorsel (GIF ya da animasyonlu WebP) ise animasyonu KORUYORUZ.
   * Onceden butun yuklemeler animated:false ile isleniyordu; musteri hareketli
   * bir GIF yukleyip donuk bir kare goruyordu.
   */
  const isAnimated = pages > 1;
  const targetWidth = isAnimated ? MAX_ANIMATED_WIDTH : MAX_WIDTH;

  const id = randomUUID();
  const originalExt = (extname(file.name || "").toLowerCase().replace(/[^.a-z0-9]/g, "") || ".bin").slice(0, 6);

  /*
   * .rotate() yalnizca durgun gorselde: EXIF yonlendirmesi pratikte JPEG'den
   * gelir, animasyonlu bir akista kare kare dondurmek hem gereksiz hem riskli.
   */
  const mainPipeline = sharp(buffer, { animated: isAnimated });
  const mainBuffer = await (isAnimated ? mainPipeline : mainPipeline.rotate())
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  /*
   * Kucuk onizleme her zaman DURGUN: panelde ve izgarada yan yana duran
   * onlarca kare animasyonu ayni anda oynatmak sayfayi bogar.
   */
  const thumbBuffer = await sharp(buffer, { animated: false })
    .rotate()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 74 })
    .toBuffer();

  await Promise.all([
    writeFile(join(root, `${id}.webp`), mainBuffer),
    writeFile(join(root, `${id}.thumb.webp`), thumbBuffer),
    writeFile(join(root, `${id}.orig${originalExt}`), buffer),
  ]);

  const scale = Math.min(1, targetWidth / width);
  return {
    url: `${UPLOAD_URL_PREFIX}${id}.webp`,
    thumbUrl: `${UPLOAD_URL_PREFIX}${id}.thumb.webp`,
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

/** Bir gorselin uc varyantini da diskten siler. Hata olursa sessizce gecer. */
export async function deleteImage(url: string): Promise<void> {
  if (!url.startsWith(UPLOAD_URL_PREFIX)) return;
  const fileName = url.slice(UPLOAD_URL_PREFIX.length);
  const id = fileName.replace(/\.(thumb|orig)?\.?[a-z0-9]+$/i, "").split(".")[0];
  if (!id || !/^[a-f0-9-]{36}$/i.test(id)) return;

  const root = uploadsRoot();
  const { readdir } = await import("node:fs/promises");
  let entries: string[] = [];
  try {
    entries = await readdir(root);
  } catch {
    return;
  }

  await Promise.all(
    entries
      .filter((entry) => entry.startsWith(id))
      .map((entry) => unlink(join(root, entry)).catch(() => undefined)),
  );
}
