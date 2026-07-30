import "server-only";

import type { Metadata } from "next";

import { appUrl } from "@/lib/env";
import { SCHEMA_DAYS } from "@/lib/format";
import type { SiteContent } from "@/themes/types";

export function buildMetadata(content: SiteContent): Metadata {
  const base = appUrl();
  const title = content.name;
  const description =
    content.tagline ||
    content.about.slice(0, 155) ||
    `${content.name} — kahve, tatlı ve sıcak bir atmosfer.`;

  return {
    metadataBase: new URL(base),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    applicationName: title,
    keywords: [
      content.name,
      "kahve",
      "kafe",
      "pastane",
      "menü",
      content.contact.address.split(",").pop()?.trim() ?? "",
    ].filter(Boolean),
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: base,
      siteName: title,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    icons: content.logoUrl ? { icon: content.logoUrl } : undefined,
  };
}

/**
 * schema.org CafeOrCoffeeShop JSON-LD.
 * Adres, telefon, acilis saatleri ve koordinatlar site_settings'ten uretilir.
 */
export function buildJsonLd(content: SiteContent): Record<string, unknown> {
  const base = appUrl();
  const { contact } = content;

  const openingHoursSpecification = content.openingHours
    .filter((h) => !h.isClosed)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${SCHEMA_DAYS[h.dayOfWeek] ?? "Monday"}`,
      opens: h.openTime,
      closes: h.closeTime,
    }));

  const sameAs = [contact.instagramHref].filter(Boolean);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${base}/#business`,
    name: content.name,
    url: base,
    description: content.tagline || content.about.slice(0, 300) || undefined,
    servesCuisine: "Kahve",
    priceRange: "₺₺",
  };

  if (content.logoUrl) jsonLd.logo = `${base}${content.logoUrl}`;
  if (content.heroImageUrl) jsonLd.image = `${base}${content.heroImageUrl}`;
  if (contact.phone) jsonLd.telephone = contact.phone;
  if (contact.email) jsonLd.email = contact.email;
  if (sameAs.length > 0) jsonLd.sameAs = sameAs;
  if (contact.mapsUrl) jsonLd.hasMap = contact.mapsUrl;

  if (contact.address) {
    jsonLd.address = {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressCountry: "TR",
    };
  }

  if (contact.lat !== null && contact.lng !== null) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: contact.lat,
      longitude: contact.lng,
    };
  }

  if (openingHoursSpecification.length > 0) {
    jsonLd.openingHoursSpecification = openingHoursSpecification;
  }

  const menuItems = content.menu.flatMap((c) => c.items);
  if (menuItems.length > 0) {
    jsonLd.hasMenu = {
      "@type": "Menu",
      name: `${content.name} Menü`,
      hasMenuSection: content.menu
        .filter((c) => c.items.length > 0)
        .map((category) => ({
          "@type": "MenuSection",
          name: category.name,
          hasMenuItem: category.items.map((item) => ({
            "@type": "MenuItem",
            name: item.name,
            description: item.description || undefined,
            offers:
              item.priceValue > 0
                ? {
                    "@type": "Offer",
                    price: item.priceValue.toFixed(2),
                    priceCurrency: "TRY",
                  }
                : undefined,
          })),
        })),
    };
  }

  return jsonLd;
}
