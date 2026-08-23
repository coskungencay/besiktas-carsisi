import "server-only";

import type { Metadata } from "next";

import { LOCALE_META } from "@/i18n/config";
import { appUrl } from "@/lib/env";
import { SCHEMA_DAYS } from "@/lib/format";
import type { SiteContent } from "@/themes/types";

export function buildMetadata(content: SiteContent): Metadata {
  const base = appUrl();
  const title = content.name;
  const description =
    content.tagline ||
    content.about.slice(0, 155) ||
    content.t.contact.intro.replace("{name}", content.name);

  const path = `/${content.locale}`;

  // hreflang: acik olan her dil icin bir alternatif + x-default varsayilan dile.
  const languages: Record<string, string> = {};
  for (const option of content.locales) {
    languages[option.locale] = `${base}/${option.locale}`;
  }
  const fallback = content.locales[0];
  if (fallback) languages["x-default"] = `${base}/${fallback.locale}`;

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
      content.t.menu.eyebrow,
      content.t.contact.eyebrow,
      content.contact.address.split(",").pop()?.trim() ?? "",
    ].filter(Boolean),
    alternates: {
      canonical: `${base}${path}`,
      languages,
    },
    openGraph: {
      type: "website",
      locale: LOCALE_META[content.locale].ogLocale,
      alternateLocale: content.locales
        .filter((o) => o.locale !== content.locale)
        .map((o) => LOCALE_META[o.locale].ogLocale),
      url: `${base}${path}`,
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
    /*
     * BURADA `icons` YOK — bilerek.
     *
     * Onceki surumde favicon dogrudan musterinin logosuna baglaniyordu.
     * Sorun sudur: musteri logolari cogunlukla YATAY kelime isaretidir ve
     * tarayici sekmesindeki 16px'lik KAREYE sigdirildiginda okunaksiz bir
     * kivrima doner.
     *
     * metadata.icons verildiginde Next'in DOSYA TABANLI ikon kurali ezilir;
     * bu alan kaldirildigi icin artik src/app/icon.tsx ve apple-icon.tsx
     * devreye giriyor. Ikisi de marka renginde kare bir alana isletmenin bas
     * harfini basiyor: her boyutta okunur ve yine markanin kendi rengi.
     *
     * Logo, yeri olan yerlerde kullanilmaya devam ediyor: ust cubuk, sosyal
     * onizleme gorseli (opengraph-image) ve web manifest.
     */
  };
}

/**
 * schema.org yapilandirilmis veri.
 *
 * Cikti bir @graph: isletmenin kendisi (CafeOrCoffeeShop) ve varsa SSS bolumu
 * (FAQPage) ayri dugumler olarak yan yana durur.
 *
 * TEMEL KURAL: yalnizca SAYFADA GORUNEN icerik isaretlenir. Musteri bir bolumu
 * panelden kapattiysa (content.isVisible) o bolumun semasi da uretilmez —
 * gorunmeyen icerigi isaretlemek arama motorlari icin politika ihlalidir.
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

  /*
   * sameAs: Instagram alanina ek olarak panelden girilen tum sosyal hesaplar.
   * Ayni adres iki kez girilmis olabilir; Set ile tekillestiriliyor.
   */
  const sameAs = [
    ...new Set(
      [contact.instagramHref, ...content.socialLinks.map((l) => l.url)].filter(
        Boolean,
      ),
    ),
  ];

  /*
   * @context bilerek YOK: birden fazla dugum olustugunda hepsi tek bir
   * @graph'in altina giriyor ve baglam disarida tek kez tanimlaniyor.
   * Tek dugum kaldiginda asagida geri ekleniyor.
   */
  const jsonLd: Record<string, unknown> = {
    "@type": "CafeOrCoffeeShop",
    "@id": `${base}/#business`,
    name: content.name,
    url: `${base}/${content.locale}`,
    inLanguage: content.locale,
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
      name: `${content.name} — ${content.t.menu.eyebrow}`,
      inLanguage: content.locale,
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

  /* ---------------------------- Yorumlar --------------------------------- */

  /*
   * DIKKAT — beklentiyi dogru kurmak icin: Google, isletmenin KENDI sitesinde
   * topladigi yorumlari "self-serving" sayar ve bunlar icin arama sonucunda
   * yildiz (rich result) GOSTERMEZ. Yine de bu isaretleme degerli: yapay zeka
   * ozetleri ve Google disindaki motorlar icerigi buradan okuyabiliyor.
   * Yildizli sonuc isteniyorsa Google Business Profile uzerinden toplanan
   * yorumlar gerekir; onlar bu alandan bagimsizdir.
   */
  const reviews = content.isVisible("yorumlar") ? content.testimonials : [];
  const rated = reviews.filter((review) => review.rating !== null);

  if (reviews.length > 0) {
    jsonLd.review = reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      reviewBody: review.text,
      inLanguage: content.locale,
      ...(review.rating !== null
        ? {
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 5,
              worstRating: 1,
            },
          }
        : {}),
    }));
  }

  if (rated.length > 0) {
    const total = rated.reduce((sum, review) => sum + (review.rating ?? 0), 0);
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      // Bir ondalik yeter; 4.6666… gibi degerler hem cirkin hem gereksiz.
      ratingValue: Number((total / rated.length).toFixed(1)),
      reviewCount: rated.length,
      bestRating: 5,
      worstRating: 1,
    };
  }

  /* ------------------------------- Graf ---------------------------------- */

  const graph: Record<string, unknown>[] = [jsonLd];

  /*
   * SSS ayri bir dugum: FAQPage isletmenin bir ozelligi degil, sayfanin bir
   * bolumu. mainEntity sirasi sayfadaki sirayla ayni tutuluyor.
   */
  const faq = content.isVisible("sss") ? content.faq : [];
  if (faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${base}/${content.locale}#sss`,
      inLanguage: content.locale,
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  if (graph.length === 1) {
    return { "@context": "https://schema.org", ...jsonLd };
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/**
 * Menu SAYFASI icin yapilandirilmis veri.
 *
 * Ana sayfadaki CafeOrCoffeeShop dugumu menuyu `hasMenu` altinda zaten
 * tasiyor; burada menuyu SAYFANIN ANA VARLIGI olarak veriyoruz ve isletmeye
 * @id ile bagliyoruz. Ayrica breadcrumb: arama sonucunda "Ana sayfa > Menu"
 * yolunu gostermek icin.
 */
export function buildMenuJsonLd(content: SiteContent): Record<string, unknown> {
  const base = appUrl();
  const home = `${base}/${content.locale}`;

  const sections = content.menu
    .filter((category) => category.items.length > 0)
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
    }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Menu",
        "@id": `${home}/menu#menu`,
        name: `${content.name} — ${content.t.menu.eyebrow}`,
        inLanguage: content.locale,
        url: `${home}/menu`,
        hasMenuSection: sections,
        provider: { "@id": `${base}/#business` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: content.name,
            item: home,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: content.t.menu.eyebrow,
            item: `${home}/menu`,
          },
        ],
      },
    ],
  };
}
