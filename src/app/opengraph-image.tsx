import { ImageResponse } from "next/og";

import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";
export const alt = "Site önizleme görseli";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
