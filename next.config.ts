import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  // better-sqlite3 / sharp native modulleri bundle edilmemeli.
  serverExternalPackages: ["better-sqlite3", "sharp", "nodemailer"],
  experimental: {
    /*
     * SERVER ACTION GOVDE TAVANI.
     *
     * Next.js varsayilani 1 MB. Panelin tum yuklemeleri (logo, kapak, magaza
     * fotografi, galeri) server action uzerinden gittigi icin bu tavan
     * dogrudan urunun yukleme sinirini belirliyordu — ve yazili sinirla
     * catisiyordu: galeri formu "30 dosya, dosya basina 12 MB" diyor, cerceve
     * 1 MB'da kesiyordu. Asildiginda istek uygulama koduna hic varmadigi icin
     * kullanici anlamli bir uyari degil ham "Application error" goruyordu.
     * Canli panelde bu yasandi (digest 697821428).
     *
     * 64mb: govde bellekte tamamen tamponlanir; sunucuda 3,8 GB RAM var ve
     * uzerinde baska uygulamalar da calisiyor, bu yuzden vaat edilen 360 MB
     * gercekci degil. Istemci tarafi 60 MB'da uyariyor (upload-limits.ts),
     * aradaki fark multipart ek yuku icin pay.
     */
    serverActions: { bodySizeLimit: "64mb" },
  },
  images: {
    // Yerel SVG placeholder'lar icin gerekli. Harici kaynak tanimli degil,
    // bu yuzden sadece kendi public/ ve /api/uploads yollarimiz optimize edilir.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/webp"],
  },
  eslint: {
    dirs: ["src", "scripts"],
  },
};

export default nextConfig;
