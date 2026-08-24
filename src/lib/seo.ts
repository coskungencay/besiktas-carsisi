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
  /*
   * CARSI UYARLAMASI: sablon burada `CafeOrCoffeeShop` uretiyordu. Bu site bir
   * carsi oldugu icin dogru tip `ShoppingCenter` — schema.org'da LocalBusiness
   * altinda ve "icinde bagimsiz magazalar barindiran yapi" anlamina geliyor.
   * Kafe tipini birakmak arama motoruna yanlis isletme turu bildirirdi.
   *
   * `servesCuisine` ve `priceRange` de bu yuzden kaldirildi: ikisi de yeme-icme
   * isletmesine ait alanlar, bir carsi icin anlamsiz.
   */
  const jsonLd: Record<string, unknown> = {
    "@type": "ShoppingCenter",
    "@id": `${base}/#business`,
    name: content.name,
    url: `${base}/${content.locale}`,
    inLanguage: content.locale,
    description: content.tagline || content.about.slice(0, 300) || undefined,
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

  /*
   * CARSI UYARLAMASI: sablon burada tum menuyu `hasMenu` altinda basiyordu.
   *
   * Burada TAM magaza listesi BILEREK YOK. Ana sayfadaki magazalar bolumu
   * yalnizca birkac one cikan esnafi gosteren bir vitrin; 87 magazanin
   * tamami /<dil>/magazalar sayfasinda. Sablonun kendi kurali da bu:
   * "yalnizca SAYFADA GORUNEN icerik isaretlenir". Tam listeyi burada da
   * basmak, sayfada olmayan icerigi arama motoruna bildirmek olurdu.
   *
   * Magaza sayisi yine de degerli bir sinyal — onu veriyoruz.
   */
  const shopCount = content.menu.reduce((sum, c) => sum + c.items.length, 0);
  if (shopCount > 0) {
    jsonLd.additionalProperty = {
      "@type": "PropertyValue",
      name: content.t.menu.eyebrow,
      value: shopCount,
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

  /*
   * AggregateRating, sitede GOSTERILEN yorumlardan DEGIL, isletmenin GERCEK
   * Google ortalamasindan uretiliyor.
   *
   * NEDEN: sitede 10 secilmis yorum var ve ortalamalari 4,5 cikiyor; carsinin
   * 7.568 degerlendirmeden gercek ortalamasi ise 4,3. Secilmis bir alt kumenin
   * ortalamasini isletmenin puani diye bildirmek, sayiyi yukari cekmek icin
   * yorum secmek anlamina gelirdi. Panelde puan girilmemisse (null) hic
   * aggregateRating basilmaz — uydurma bir sayi uretmektense hic vermemek dogru.
   */
  if (content.googleRating !== null && content.googleRatingCount !== null) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: content.googleRating,
      reviewCount: content.googleRatingCount,
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
 * MAGAZALAR SAYFASI icin yapilandirilmis veri.
 *
 * CARSI UYARLAMASI: sablon burada bir `Menu` + `MenuSection` agaci uretiyordu.
 * Carsida satilan sey yemek degil, kiralanmis bagimsiz DUKKANLAR; dogru
 * karsilik `ShoppingCenter.containsPlace` -> `Store`.
 *
 * Tam liste YALNIZCA burada uretilir cunku yalnizca bu sayfa 92 magazanin
 * hepsini basiyor (ana sayfa sadece vitrin gosteriyor).
 *
 * Ayrica kategori sirasini ve magaza sirasini koruyan bir `ItemList`
 * veriyoruz: `containsPlace` sirasiz bir kume, `ItemList` ise sayfadaki
 * gercek sirayi tasiyor. Breadcrumb da arama sonucunda "Ana sayfa >
 * Magazalar" yolunu gostermek icin.
 */
export function buildMenuJsonLd(content: SiteContent): Record<string, unknown> {
  const base = appUrl();
  const home = `${base}/${content.locale}`;

  const categories = content.menu.filter((category) => category.items.length > 0);

  /*
   * Her magaza bir `Store`. `department` alani hangi kategoride durdugunu
   * tasiyor — carsida "kat/blok" karsiligi olarak okunabilir bir sinyal.
   */
  const stores = categories.flatMap((category) =>
    category.items.map((item) => ({
      "@type": "Store",
      name: item.name,
      description: item.description || undefined,
      department: category.name,
      image: item.imageUrl ? `${base}${item.imageUrl}` : undefined,
      containedInPlace: { "@id": `${base}/#business` },
    })),
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ShoppingCenter",
        "@id": `${base}/#business`,
        name: content.name,
        url: `${home}/magazalar`,
        inLanguage: content.locale,
        containsPlace: stores,
      },
      {
        "@type": "ItemList",
        "@id": `${home}/magazalar#liste`,
        name: `${content.name} — ${content.t.menu.eyebrow}`,
        numberOfItems: stores.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: stores.map((store, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: store.name,
        })),
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
            item: `${home}/magazalar`,
          },
        ],
      },
    ],
  };
}
