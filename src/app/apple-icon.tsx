import { ImageResponse } from "next/og";

import { getSettings } from "@/lib/content";
import { brandInitial } from "@/lib/brand-mark";

export const dynamic = "force-dynamic";
/** iOS "ana ekrana ekle" ikonu icin beklenen boyut. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS ana ekran ikonu — icon.tsx ile ayni tasarim, daha buyuk tuvalde.
 *
 * Ayri dosya olmasi Next'in kurali: apple-icon adi 180px'lik varyanti
 * <link rel="apple-touch-icon"> olarak basar. iOS bu gorseli kendi kose
 * yuvarlatmasiyla kirptigi icin tasarim tam kanama (kenar boslugu yok) degil,
 * harf ortada ve kenarlardan uzak duruyor.
 */
export default function AppleIcon() {
  const settings = getSettings();
  const colors = settings.brandColors ?? {};

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors["--brand-primary"] ?? "#7a4a2b",
          color: colors["--brand-primary-contrast"] ?? "#fffaf4",
          fontSize: 116,
          fontWeight: 700,
          fontFamily: "sans-serif",
          lineHeight: 1,
        }}
      >
        {brandInitial(settings.name)}
      </div>
    ),
    { ...size },
  );
}
