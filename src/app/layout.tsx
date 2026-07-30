import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";

import { getSiteContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(getSiteContent());
}

export const viewport: Viewport = {
  themeColor: "#7a4a2b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const content = getSiteContent();

  // Admin panelinden secilen renkler tema token'larini <html> uzerinde ezer.
  const brandStyle = content.brandColors as CSSProperties;

  return (
    <html lang="tr" data-theme={content.themeSlug} style={brandStyle}>
      <body>{children}</body>
    </html>
  );
}
