import { ImageResponse } from "next/og";

import { getSettings } from "@/lib/content";
import { brandInitial } from "@/lib/brand-mark";

export const dynamic = "force-dynamic";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Tarayici sekmesi ikonu — ISLETMENIN kendi renginde ve bas harfiyle.
 *
 * NEDEN SABIT SVG DEGIL: onceki surumde repoda duran tek bir kahve fincani
 * cizimi vardi; her musteri sitesi ayni ikonu tasiyordu ve markayla hicbir
 * iliskisi yoktu. Bu surum ikonu site ayarlarindan uretir, yani musteri
 * panelden rengini ya da adini degistirdiginde sekme ikonu da onunla gider.
 *
 * NEDEN LOGO KULLANILMIYOR: musteri logolari cogunlukla YATAY kelime
 * isaretidir (Moni Corner'inki 644x248). 16px'lik bir kareye sigdirildiginda
 * okunaksiz bir kivrima donusuyor — kullanicinin sekmede gordugu sey bu oldu.
 * Tek bir harf her zaman okunur; logo, yeri olan yerlerde (ust cubuk, manifest,
 * onizleme gorseli) zaten kullaniliyor.
 *
 * Harf, sayfa dolgusunun disina tasmasin diye kutuya gore olceklendi; punto
 * 64px'lik tuvalde 44px, yani kucuk boyutlarda bile govdesi kalin kaliyor.
 */
export default function Icon() {
  const settings = getSettings();
  const colors = settings.brandColors ?? {};

  const background = colors["--brand-primary"] ?? "#7a4a2b";
  const color = colors["--brand-primary-contrast"] ?? "#fffaf4";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background,
          color,
          fontSize: 44,
          fontWeight: 700,
          // ImageResponse'a font dosyasi vermiyoruz: harici indirme olmadan
          // calismali (Docker build ve kapali agda da uretilebilsin).
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
