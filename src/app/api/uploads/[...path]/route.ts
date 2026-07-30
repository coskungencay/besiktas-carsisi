import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname } from "node:path";
import type { ReadableOptions } from "node:stream";

import { safeUploadPath } from "@/lib/uploads";

export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
};

function toWebStream(
  path: string,
  options?: ReadableOptions,
): ReadableStream<Uint8Array> {
  const nodeStream = createReadStream(path, options);
  return new ReadableStream<Uint8Array>({
    start(controller) {
      nodeStream.on("data", (chunk) => {
        controller.enqueue(
          typeof chunk === "string" ? new TextEncoder().encode(chunk) : new Uint8Array(chunk),
        );
      });
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (error) => controller.error(error));
    },
    cancel() {
      nodeStream.destroy();
    },
  });
}

/**
 * /data/uploads altindaki gorselleri servis eder.
 * Sadece uuid formatindaki dosya adlarina izin verilir; path traversal engelli.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  if (segments.length !== 1) {
    return new Response("Bulunamadı", { status: 404 });
  }

  const fileName = segments[0] ?? "";
  const fullPath = safeUploadPath(fileName);
  if (!fullPath) {
    return new Response("Bulunamadı", { status: 404 });
  }

  let stats;
  try {
    stats = await stat(fullPath);
  } catch {
    return new Response("Bulunamadı", { status: 404 });
  }
  if (!stats.isFile()) {
    return new Response("Bulunamadı", { status: 404 });
  }

  const contentType = MIME[extname(fileName).toLowerCase()] ?? "application/octet-stream";
  const etag = `"${stats.size.toString(16)}-${stats.mtimeMs.toString(16)}"`;

  return new Response(toWebStream(fullPath), {
    headers: {
      "content-type": contentType,
      "content-length": String(stats.size),
      etag,
      // Dosya adlari uuid oldugu icin icerik hicbir zaman degismez.
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}
