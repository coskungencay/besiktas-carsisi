/**
 * Buyuk Besiktas Carsisi — gercek icerigi veritabanina yukler.
 * Kullanim: pnpm tsx --env-file-if-exists=.env scripts/load-carsi.ts
 *
 * NEDEN AYRI SCRIPT (seed.ts'e yazmak yerine): seed sablonun ORNEK icerigidir
 * ve upstream'den guncelleme gelebilir. Musteriye ait gercek icerik ayri
 * dursun ki iki taraf birbirini ezmesin.
 *
 * IDEMPOTENT: magaza kategorileri ve magazalar her calistirmada sifirdan
 * yazilir (once silinir). site_settings, saatler ve SSS de guncellenir.
 * Panelden girilen galeri gorselleri ve mesajlar ASLA silinmez.
 *
 * KAYNAK: buyukbesiktascarsi.com (mevcut Joomla sitesi, 2022) + Vikipedi.
 * Magaza adlari oradaki kayitlardan alindi; carsi yonetimi panelden
 * guncelleyecek.
 */
import { eq } from "drizzle-orm";

import { SINGLETON_ID, db } from "../src/db";
import {
  faqs,
  menuCategories,
  menuItems,
  openingHours,
  siteSettings,
  testimonials,
} from "../src/db/schema";

/* -------------------------------------------------------------------------- */
/*                                 Magazalar                                   */
/* -------------------------------------------------------------------------- */

/**
 * Kategori sirasi ZIYARETCIYE gore: once alisveris yapilan raflar, sonra
 * hizmetler, en sonda kamu kurumlari. Eski sitedeki numaralandirma keyfiydi.
 *
 * `featured` isaretli magazalar ana sayfadaki vitrinde gorunur. Ucu de
 * carsinin kimligini anlatanlardan secildi: cizgi roman dukkani (Besiktas'ta
 * bilinen bir adres), PTT (carsinin "Postane Carsisi" adinin sebebi) ve
 * cay ocagi (yari acik avlunun bulusma noktasi).
 */
const CATEGORIES: { name: string; shops: string[] }[] = [
  {
    name: "Bay & Bayan Giyim",
    shops: [
      "Metin Karadeniz", "Cemal İslamoğlu Tekstil", "Trendbizz Erkek Giyim",
      "Renvino Bayan Giyim", "Rast Giyim", "Bahar Butik Bayan Giyim",
      "Bayram Akgün Erkek Giyim", "Butik Hatice Bayan Giyim",
      "Free Shop Erkek Giyim", "Karma Erkek Giyim", "Pablo Erkek Giyim",
      "Joker Erkek Giyim", "Batik Bayan Giyim", "Mask Erkek Giyim",
      "Tuğra Erkek Giyim", "Ananas Bayan Giyim", "Orange Bayan Giyim",
      "Fashion Bayan Giyim & Abiye", "Safari Erkek Giyim", "More Bayan Butik",
      "Boycot Tekstil & Aksesuar", "Corner Erkek Giyim", "Bohem Bayan Giyim",
      "Miyo Bayan Abiye", "SY Bayan Giyim", "Esengül Acarözgül Bayan Giyim",
      "Zing Erkek Giyim", "My Way Bayan Giyim",
      "Nurten Alaçatlı Bayan Tekstil & Aksesuar", "Selena Bayan Giyim & Abiye",
      "Butik Hatice 2 Bayan Giyim", "Mamin Boutique Bayan Giyim",
    ],
  },
  {
    name: "Ayakkabı",
    shops: [
      "Kateryna Shymbarieva", "Minrican Taysun Bozkurt Ayakkabı",
      "Exello Bayan Ayakkabı", "Ela Kundura Bayan Ayakkabı", "Vanna Ayakkabı",
      "Disay Spor Ayakkabıları", "Mustafa Dönmez Bay & Bayan Ayakkabı",
      "Modaliza Bayan Ayakkabı", "Tekin Bayan Ayakkabı",
    ],
  },
  {
    name: "Çanta & Valiz",
    shops: [
      "T-Bag Çanta & Valiz", "Sportfan Çanta & Valiz",
      "Sinan Aki Çanta ve Aksesuar", "Deniz Züleyha Durgun Bayan Çanta",
    ],
  },
  {
    name: "İç Giyim",
    shops: ["Papatya İç Giyim", "Underline İç Giyim", "Süreyya Cörüt Bayan İç Giyim"],
  },
  {
    name: "Bebe Giyim",
    shops: ["Panayır Bebe Giyim", "Ecem Bebe Giyim"],
  },
  {
    name: "Altın, Gümüş & Saat",
    shops: [
      "Recep Ali Ayar Saat", "Blardo Saat Tamir", "Betül Özinci Gümüş ve Tamir",
      "Hüseyin Çalışkan Gümüş ve Tamir", "Erdem Gözlük",
    ],
  },
  {
    name: "Bujiteri & Peruk",
    shops: ["İrlan Takı & Boncuk"],
  },
  {
    name: "Terzi",
    shops: ["Terzi Zeki", "Terzi Uğur", "Terzi Nehir", "Terzi Tekin", "Terzi Sami"],
  },
  {
    name: "Kitap, Çizgi Roman & Müzik",
    shops: [
      "Arkabahçe Kitap & Çizgi Roman", "Film Kulübü", "Studio 2000 Kaset & CD",
      "Uğurlu Gişe Kaset & CD", "Özgen Ülker Ertem", "Meltem Kabalcı", "Comics",
    ],
  },
  {
    name: "Reklam & Baskı",
    shops: ["Durul Reklam", "Tişört Baskı", "Hobi Merkezi"],
  },
  {
    name: "Elektronik & Telefon",
    shops: ["Trioservice Telefon Servisi", "Uğur Durukan Telefon Aksesuar"],
  },
  {
    name: "Kuaför",
    shops: ["Estetik Kuaför", "Salim Bartınlı Erkek Kuaförü"],
  },
  {
    name: "SPA & Güzellik",
    shops: ["Samui SPA Güzellik Merkezi", "Protez Tırnak"],
  },
  {
    name: "Kuru Temizleme",
    shops: ["Dry Hyatt Kuru Temizleme"],
  },
  {
    name: "Evcil Hayvan",
    shops: ["Flora Pet Shop"],
  },
  {
    name: "Oyuncak & Parti",
    shops: ["Oyuncak & Parti Malzemeleri"],
  },
  {
    name: "Gıda",
    shops: ["Ovacık Doğal Tohum Tüketim Kooperatifi"],
  },
  {
    name: "Kafeterya & Çay",
    shops: ["Kemah Çay Ocağı"],
  },
  {
    name: "Para Transferi",
    shops: ["Murat Taşatan", "Malouchie Gaudiano Nuique"],
  },
  {
    name: "Kamu Hizmetleri",
    shops: ["PTT Beşiktaş Şubesi", "İGDAŞ Fatura Tahsilat", "İSKİ Fatura Tahsilat"],
  },
];

/** Ana sayfadaki vitrinde gorunecek magazalar. */
const FEATURED = new Set([
  "Arkabahçe Kitap & Çizgi Roman",
  "PTT Beşiktaş Şubesi",
  "Kemah Çay Ocağı",
]);

/* -------------------------------------------------------------------------- */
/*                                   SSS                                       */
/* -------------------------------------------------------------------------- */

const FAQ: { question: string; answer: string }[] = [
  {
    question: "Çarşı hangi saatlerde açık?",
    answer:
      "Çarşı her gün 07:00 – 22:00 arasında açıktır. Mağazaların kendi açılış saatleri bu aralık içinde farklılık gösterebilir; belirli bir esnafa gidecekseniz aramanızı öneririz.",
  },
  {
    question: "Otopark var mı?",
    answer:
      "Evet. Çarşının en üst katı müşteri ve misafir otoparkı olarak kullanılır — Beşiktaş meydanında araçla gelenler için çarşının en pratik yanlarından biridir.",
  },
  {
    question: "Çarşıya nasıl gelebilirim?",
    answer:
      "Çarşı, Beşiktaş meydanında Sinan Paşa Camii'nin hemen arkasındadır. Beşiktaş vapur iskelesine, otobüs duraklarına ve Kabataş bağlantısına yürüme mesafesindedir.",
  },
  {
    question: "Neden \"Postane Çarşısı\" deniyor?",
    answer:
      "PTT'nin Beşiktaş şubesi çarşının alt katında yer aldığı için çarşı halk arasında uzun yıllardır Postane Çarşısı olarak da bilinir.",
  },
  {
    question: "Çarşıda dükkân kiralamak istiyorum, kime başvurmalıyım?",
    answer:
      "Kiralama ve esnaflık başvuruları için çarşı yönetimine iletişim sayfasındaki telefon ya da e-posta üzerinden ulaşabilirsiniz.",
  },
  {
    question: "Fatura ödemesi ve para transferi yapılabiliyor mu?",
    answer:
      "Evet. Çarşıda PTT şubesinin yanı sıra İGDAŞ ve İSKİ fatura tahsilat noktaları ile para transferi hizmeti veren esnaf bulunur.",
  },
];

/* -------------------------------------------------------------------------- */
/*                                  Yukleme                                    */
/* -------------------------------------------------------------------------- */

function loadSettings() {
  db.update(siteSettings)
    .set({
      name: "Büyük Beşiktaş Çarşısı",
      founded: "1985",
      tagline:
        "Beşiktaş meydanının göbeğinde, 1985'ten beri aynı çatı altında yüzlerce esnaf.",
      heroHeadline: "Beşiktaş'ın çarşısı,",
      heroSubline: "kırk yıldır aynı yerde.",
      about:
        "Büyük Beşiktaş Çarşısı 1985'te, Sinan Paşa Camii'nin arkasında kuruldu. " +
        "Türkiye'de alışveriş merkezi kültürünün henüz yeni yeni oluştuğu yıllarda " +
        "açılan ilk örneklerden biridir — ama bir AVM gibi değil, bir çarşı gibi " +
        "kurgulanmıştır.\n\n" +
        "Yarı açık mimarisi çarşının karakterini belirler: katlar avluya bakar, " +
        "gün ışığı içeri girer, koridorlar bir sokak gibi işler. Üst katta müşteri " +
        "ve misafir otoparkı vardır; alt katta ise PTT'nin Beşiktaş şubesi bulunur — " +
        "çarşının halk arasında \"Postane Çarşısı\" olarak anılmasının sebebi budur.\n\n" +
        "Bugün çarşıda giyimden ayakkabıya, terziden kuaföre, çizgi romandan evcil " +
        "hayvan ürünlerine kadar yüzlerce bağımsız bölüm hizmet veriyor. Çoğu esnaf " +
        "yıllardır aynı dükkânda; Beşiktaş'ta bir şeyi tamir ettirmek, ölçüye " +
        "diktirmek ya da uzun uzun bakınmak isteyenlerin ilk durağı hâlâ burası.",
      highlights: [
        { label: "Kuruluş", value: "1985" },
        { label: "Bağımsız bölüm", value: "184" },
        { label: "Kayıtlı esnaf", value: "92 mağaza" },
        { label: "Otopark", value: "Çatı katı" },
      ],
      phone: "0212 227 74 40",
      whatsapp: "",
      email: "bilgi@buyukbesiktascarsi.com",
      address:
        "Sinanpaşa Mah., Köyiçi Cad. No:11, 34353 Beşiktaş / İstanbul",
      lat: 41.042806,
      lng: 29.00525,
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=41.042806,29.005250",
      instagram: "buyukbesiktascarsisi",
      socialLinks: [
        { platform: "instagram", url: "https://www.instagram.com/buyukbesiktascarsisi/" },
        { platform: "facebook", url: "https://www.facebook.com/buyukbesiktascarsisi/" },
      ],
      announcement: "",
      themeSlug: "beyaz-oda",
      /*
       * Yorumlar KAPALI: carsinin dogrulanmis musteri yorumu henuz yok ve
       * uydurma yorum yazmak hem etik disi hem schema.org ihlali olurdu.
       * Google yorumlari cekildiginde panelden acilacak.
       */
      hiddenSections: ["yorumlar"],
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, SINGLETON_ID))
    .run();
  console.log("[carsi] site_settings guncellendi.");
}

function loadHours() {
  // Eski sitede tek aralik veriliyor: 07.00 - 22.00, gun ayrimi yok.
  for (let day = 0; day < 7; day += 1) {
    db.insert(openingHours)
      .values({ dayOfWeek: day, openTime: "07:00", closeTime: "22:00", isClosed: false })
      .onConflictDoUpdate({
        target: openingHours.dayOfWeek,
        set: { openTime: "07:00", closeTime: "22:00", isClosed: false },
      })
      .run();
  }
  console.log("[carsi] Calisma saatleri: her gun 07:00-22:00.");
}

function loadShops() {
  // Kategoriyi silmek icindeki magazalari da siler (onDelete: cascade).
  db.delete(menuCategories).run();
  db.delete(menuItems).run();

  let shopCount = 0;
  CATEGORIES.forEach((category, categoryIndex) => {
    const inserted = db
      .insert(menuCategories)
      .values({ name: category.name, sortOrder: categoryIndex })
      .returning()
      .get();

    category.shops.forEach((shop, shopIndex) => {
      db.insert(menuItems)
        .values({
          categoryId: inserted.id,
          name: shop,
          description: "",
          price: 0, // carside fiyat yok — 0 = sitede gosterilmez
          imageUrl: "",
          isFeatured: FEATURED.has(shop),
          isActive: true,
          sortOrder: shopIndex,
        })
        .run();
      shopCount += 1;
    });
  });

  console.log(`[carsi] ${CATEGORIES.length} kategori, ${shopCount} magaza yazildi.`);
}

function loadFaq() {
  db.delete(faqs).run();
  FAQ.forEach((item, index) => {
    db.insert(faqs)
      .values({ question: item.question, answer: item.answer, sortOrder: index, isActive: true })
      .run();
  });
  console.log(`[carsi] ${FAQ.length} SSS yazildi.`);
}

function clearSampleTestimonials() {
  /*
   * Seed'in ornek yorumlari SILINIR. Uydurma musteri yorumu yayinlamak
   * yaniltici; gercek yorumlar Google'dan cekilip panelden girilecek.
   */
  const removed = db.delete(testimonials).returning().all();
  console.log(`[carsi] ${removed.length} ornek yorum silindi (bolum kapali).`);
}

function main() {
  loadSettings();
  loadHours();
  loadShops();
  loadFaq();
  clearSampleTestimonials();
  console.log("[carsi] Tamamlandi.");
}

main();
