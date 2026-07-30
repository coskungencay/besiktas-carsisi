import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  // better-sqlite3 / sharp native modulleri bundle edilmemeli.
  serverExternalPackages: ["better-sqlite3", "sharp", "nodemailer"],
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
