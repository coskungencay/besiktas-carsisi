import { ImageResponse } from "next/og";

import { getSettings } from "@/lib/content";
import { thumbUrl } from "@/lib/format";
import { UPLOAD_URL_PREFIX, uploadsRoot } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const alt = "Site önizleme görseli";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Musterinin logosunu PNG data URI olarak dondurur; logo yoksa/okunamazsa null.
 *
 * NEDEN DISKTEN: OG gorseli olusturan Satori'ye kendi sitemizin URL'sini
 * vermek, sunucunun kendi kendine HTTP istegi atmasi demek — deploy sirasinda
 * ya da kapali agda bu istek asilir ve TUM onizleme gorseli uretilemez.
 * Dosyayi dogrudan okuyup gomuyoruz.
 *
 * NEDEN PNG'ye CEVIRIYORUZ: yuklemeler WebP olarak saklaniyor, Satori ise
 * guvenilir bicimde PNG/JPEG isliyor.
 */
async function logoDataUri(logoUrl: string): Promise<string | null> {
  if (!logoUrl.startsWith(UPLOAD_URL_PREFIX)) return null;

  // Kucuk varyant yeterli: gorselde 132px'lik bir kare olarak duruyor.
  const fileName = thumbUrl(logoUrl).slice(UPLOAD_URL_PREFIX.length);
  if (!/^[a-f0-9-]{36}(\.thumb)?\.[a-z0-9]{2,5}$/i.test(fileName)) return null;

  try {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const sharp = (await import("sharp")).default;

    const raw = await readFile(join(uploadsRoot(), fileName));
    const png = await sharp(raw)
      .resize({ width: 264, height: 264, fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer();

    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    // Logo okunamadiysa onizleme gorseli logosuz uretilir — hic uretilmemesinden iyi.
    return null;
  }
}

/**
 * Dinamik OG gorseli. Harici font/gorsel indirmez; tamamen offline uretilir,
 * boylece Docker build ve kapali ag ortaminda da calisir.
 */
export default async function OpengraphImage() {
  const settings = getSettings();
  const colors = settings.brandColors ?? {};

  const primary = colors["--brand-primary"] ?? "#7a4a2b";
  const contrast = colors["--brand-primary-contrast"] ?? "#fffaf4";
  const accent = colors["--brand-accent"] ?? "#c98b4b";

  const name = settings.name || "İşletme Adı";
  const tagline = settings.tagline || settings.address || "";
  const logo = await logoDataUri(settings.logoUrl);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
          color: contrast,
          fontFamily: "sans-serif",
        }}
      >
        {logo ? (
          /*
           * Logo varsa cizginin YERINE gecer: ikisi birden ust uste durunca
           * gorselin ust bosluğu daralip baslik asagi kayiyordu.
           */
          <img
            src={logo}
            alt=""
            width={132}
            height={132}
            style={{
              width: 132,
              height: 132,
              marginBottom: 36,
              objectFit: "contain",
            }}
          />
        ) : (
        <div
          style={{
            display: "flex",
            width: 96,
            height: 8,
            background: contrast,
            borderRadius: 999,
            marginBottom: 40,
            opacity: 0.9,
          }}
        />
        )}
        <div
          style={{
            display: "flex",
            fontSize: name.length > 24 ? 68 : 88,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {name}
        </div>
        {tagline ? (
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 34,
              opacity: 0.88,
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            {tagline.slice(0, 120)}
          </div>
        ) : null}
      </div>
    ),
    size,
  );
}
