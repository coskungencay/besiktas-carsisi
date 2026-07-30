import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { extname, isAbsolute, join, resolve } from "node:path";
import sharp from "sharp";

import { uploadsDir } from "@/lib/env";

export const MAX_WIDTH = 1920;
export const THUMB_WIDTH = 400;
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024; // 12 MB
export const UPLOAD_URL_PREFIX = "/api/uploads/";

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

  const root = uploadsRoot();
  await mkdir(root, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());

  let width: number | undefined;
  let height: number | undefined;
  try {
    const meta = await sharp(buffer).metadata();
    width = meta.width;
    height = meta.height;
  } catch {
    throw new UploadError("Dosya geçerli bir görsel değil.");
  }
  if (!width || !height) {
    throw new UploadError("Görsel boyutları okunamadı.");
  }

  const id = randomUUID();
  const originalExt = (extname(file.name || "").toLowerCase().replace(/[^.a-z0-9]/g, "") || ".bin").slice(0, 6);

  const mainBuffer = await sharp(buffer, { animated: false })
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

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

  const scale = Math.min(1, MAX_WIDTH / width);
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
