/**
 * GALERI ve YORUMLAR — sitenin medya icerigini yazar.
 * Kullanim: pnpm tsx --conditions=react-server --env-file-if-exists=.env scripts/import-media.ts
 *
 * Galerinin TEK sahibi bu script: her calistirmada sifirlayip yeniden yazar.
 * Iki kaynaktan besleniyor ve her gorselin kaynagi asagida yazili:
 *   - scripts/assets/      : carsinin kendi fotograflari (eski resmi sitesi)
 *   - venue-scraper/output : Google Places (Maps Platform sartlarina tabi)
 *
 * Amblem ve KAPAK gorseli burada DEGIL — onlar site ayari: import-assets.ts.
 * Adres/koordinat/saat de burada degil — load-carsi.ts.
 *
 * CALISTIRMA SIRASI:  load-carsi  ->  import-assets  ->  import-media
 *
 * IDEMPOTENT: galeri ve yorumlar sifirlanip yeniden yazilir, eski gorseller
 * diskten silinir. Iki kez calistirmak kopya olusturmaz.
 */
import { readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { eq } from "drizzle-orm";
import sharp from "sharp";

import { SINGLETON_ID, db } from "../src/db";
import { galleryImages, siteSettings, testimonials } from "../src/db/schema";
import { deleteImage, storeImage } from "../src/lib/uploads";

/*
 * Google Places'ten cekilmis fotograflarin bulundugu dizin.
 *
 * Bu dosyalar REPODA DEGIL ve olmamali: venue-scraper'in ciktisi, Google'in
 * kendi lisansi altinda ve depoya konursa yeniden dagitim olur. Script
 * yalnizca ilk yuklemede, gelistiricinin kendi makinesinde calisiyor;
 * sunucuda calistirilmiyor (icerik /data biriminde duruyor).
 *
 * Yol artik SABIT DEGIL: public repoda "/Users/camoka/..." diye bir satir
 * hem anlamsiz hem de baskasinin makinesinde sessizce patliyordu. Ortam
 * degiskeniyle veriliyor, verilmemisse Google kaynakli isler atlaniyor ve
 * carsinin kendi fotograflari yine de yukleniyor.
 */
const GOOGLE_SRC = process.env.GOOGLE_PHOTOS_DIR?.trim() ?? "";
const OWN_SRC = join(import.meta.dirname, "assets");

/* -------------------------------------------------------------------------- */
/*                             2. Fotograflar                                  */
/* -------------------------------------------------------------------------- */

/**
 * 10 fotografin hepsi kullanilmadi. Google Places fotograflari kullanicilarin
 * yukledigi karisik bir kume: bir kismi carsinin kendisi degil, cevresindeki
 * Besiktas carsi sokaklari (balik pazari, acik pazar tezgahi).
 *
 * Elenenler ve NEDENI:
 *   google-01  sokak/kedi karesi   — bina degil, cevre
 *   google-02  balik pazari        — bina degil, baska bir yer
 *   google-03  magaza ici          — TANINABILIR COCUK YUZU + telefon filigrani
 *   google-07  koridor             — karenin 2/3'u zemin, bulanik
 *   google-08  acik pazar tezgahi  — bina degil, ustelik bakimsiz gorunuyor
 *   google-06  antika vitrini      — net ama cok kalabalik; ustelik uzerinde
 *                                    kirpilmasi gereken bir tarih damgasi var.
 *                                    6 gorsel 3'lu izgarada tam iki satir;
 *                                    yedincisi son satiri tek basina birakiyordu.
 */
type PhotoJob = {
  file: string;
  alt: string;
  /** "own" = carsinin kendi fotografi, "google" = Google Places. */
  source: "own" | "google";
  /** Alt kenardan kirpilacak oran (filigran temizligi icin). */
  cropBottom?: number;
};

/*
 * Sira ZIYARETCININ carsiyi taniyis sirasi: once avlu, sonra ic koridorlar ve
 * tek tek dukkanlar. 6 gorsel = 3'lu izgarada tam iki satir.
 *
 * KALITE ELEMESI: `cephe-tabela.jpg` galeriden CIKARILDI — 1920x850 olmasina
 * ragmen bir VIDEO KARESI, yani yumusak. Yanindaki 1200-1600px'lik kamera
 * kareleriyle yan yana durunca fark aciktan belli oluyordu. Ayni binanin
 * keskin bir karesi zaten hero'da (cephe-giris.jpg).
 *
 * Buna karsilik eski sitenin KATEGORI kareleri (1020x1094, net kamera
 * cekimleri) galeriye alindi: carsinin gercek dukkanlarini gosteriyorlar ve
 * Google'dan gelen kullanici fotograflarindan daha temizler.
 */
const PHOTOS: PhotoJob[] = [
  {
    file: "google-09.jpg",
    source: "google",
    alt: "Büyük Beşiktaş Çarşısı'nın avlusu: üç kat galeri ve ortasından yükselen ağaç",
  },
  {
    file: "google-04.jpg",
    source: "google",
    alt: "Gümüş ve antika dükkânlarının sıralandığı koridor; tavanda asılı bakır kaplar",
  },
  {
    file: "kategori/muzik.jpg",
    source: "own",
    alt: "Studio 2000: çarşının kaset ve plak dükkânının vitrini",
  },
  {
    file: "google-05.jpg",
    source: "google",
    alt: "Arkabahçe Kitap & Çizgi Roman'ın raflarında çizgi roman ve manga",
  },
  {
    file: "kategori/terzi.jpg",
    source: "own",
    alt: "Terzi Zeki'nin dükkânında çalışan iki terzi",
  },
  {
    file: "google-10.jpg",
    source: "google",
    alt: "Çarşının üst katlarındaki giyim, ayakkabı ve takı mağazaları",
  },
];

async function toFile(job: PhotoJob): Promise<File> {
  let buffer = readFileSync(join(job.source === "own" ? OWN_SRC : GOOGLE_SRC, job.file));

  if (job.cropBottom) {
    const meta = await sharp(buffer).metadata();
    const height = meta.height ?? 0;
    const keep = Math.round(height * (1 - job.cropBottom));
    buffer = await sharp(buffer)
      .extract({ left: 0, top: 0, width: meta.width ?? 0, height: keep })
      .jpeg({ quality: 95 })
      .toBuffer();
  }

  return new File([new Uint8Array(buffer)], basename(job.file), { type: "image/jpeg" });
}

async function importPhotos() {
  /*
   * Onceki calistirmadan kalan gorseller once diskten VE tablodan silinir;
   * aksi halde her calistirma galeriye kopya ekler ve medya kotasini yer.
   */
  for (const row of db.select().from(galleryImages).all()) {
    await deleteImage(row.url);
  }
  db.delete(galleryImages).run();

  let sortOrder = 0;

  for (const job of PHOTOS) {
    /*
     * Google kaynakli kareler ancak GOOGLE_PHOTOS_DIR verilmisse yuklenebilir
     * (o dosyalar repoda degil — bkz. GOOGLE_SRC). Verilmemisse is atlaniyor
     * ve carsinin KENDI fotograflari yine de yukleniyor; script yarida
     * patlamak yerine ne yaptigini soyluyor.
     */
    if (job.source === "google" && GOOGLE_SRC === "") {
      console.log(`[medya] ATLANDI (GOOGLE_PHOTOS_DIR tanimsiz): ${job.file}`);
      continue;
    }

    const stored = await storeImage(await toFile(job));
    db.insert(galleryImages)
      .values({ url: stored.url, alt: job.alt, sortOrder: sortOrder++ })
      .run();
    console.log(`[medya] Galeri ${sortOrder}: ${job.file} (${job.source})`);
  }
}

/* -------------------------------------------------------------------------- */
/*                              3. Yorumlar                                    */
/* -------------------------------------------------------------------------- */

/**
 * ON GERCEK Google yorumu + iki pasif. HICBIRI UYDURMA DEGIL.
 *
 * NASIL BULUNDU: Places API cagri basina yalnizca 5 yorum donduruyor — ama
 * `languageCode` degistirildiginde FARKLI bir 5'li set geliyor. 25 dil kodu
 * denenerek 58 benzersiz gercek yorum toplandi, icinden carsiyla ilgili ve
 * icerik tasiyan 10 tanesi secildi (bkz. git gecmisi).
 *
 * Turkce olmayan yorumlar cevrildi ve yazar adinin yaninda "· çeviri" ile
 * ACIKCA isaretlendi — Google Haritalar da yabanci yorumlari ayni sekilde
 * cevirip etiketliyor. Metinler kisaltilmadi, anlam degistirilmedi.
 *
 * Iki yorum SITEDE PASIF baslatiliyor; carsi yonetimi tek tikla acabilir.
 *
 * Pasif baslatma gerekcesi asagida her biri icin ayri ayri yazili. Bu bir
 * "kotu yorumu sakla" hamlesi degil: biri hukuki risk tasiyor, digeri bilgi
 * tasimiyor. Yorum METINLERI hicbir sekilde degistirilmedi.
 *
 * NOT: Google'in kendi ortalamasi 4,3 (7.568 degerlendirme). Sitede gosterilen
 * yorumlardan uretilen AggregateRating yalnizca BU SAYFADA gorunenleri anlatir
 * — sablonun kurali da bu (bkz. lib/seo.ts).
 */
const REVIEWS: {
  author: string;
  text: string;
  rating: number;
  isActive: boolean;
  note?: string;
}[] = [
  /* ------------------------------ Turkce asil ---------------------------- */
  {
    author: "Atilla Aslıhan",
    rating: 5,
    isActive: true,
    text: "Henüz avm'ler yokken butikleri, teknoloji dükkanları ve dostane esnafıyla kalplerimizde yer kurmuş bir mekandı. Uzun yıllar sonra tekrar gittim, eskimiş ve yıpranmış yüzüne rağmen yine güler yüzle karşıladı beni. Direniyordu çarşı, değişen her şeye rağmen geliştiriyordu kendini. Yine teknolojik yardımıma koştu, yine güzel pamuklu tshirtler sundu, yine kafesinde güzel bir kahvaltı yaptım. Varolsun",
  },
  {
    author: "Sonay Özpınar Ak",
    rating: 4,
    isActive: true,
    text: "Güzel dükkanlar var, biz Arka Bahçe dükkanı için gidiyoruz — çizgi roman, manga vb. almak için. Fiyatlar birçok dükkânda makul; ayakkabı, elbise, takı tasarım malzemeleri, kaset ve plaklar gibi birçok şey mevcut.",
  },
  {
    author: "Gezgin Gurme",
    rating: 3,
    isActive: true,
    text: "Beşiktaş çarşı otoparkını kullandım. Çarşının en üst katı otopark, fiyatlar normal piyasaya göre, direkt çarşıya çıkıyorsunuz, kartlı ödeme mevcut. Tavsiye ederim.",
  },

  /* --------------------------- Cevrilmis yorumlar -------------------------
   * Asillari Ingilizce/Almanca/Fransizca/Arapca. Google Haritalar'in kendisi
   * de yabanci yorumlari cevirip "Google tarafindan cevrildi" notuyla
   * gosteriyor; ayni seffaflik icin yazar adinin yaninda "· çeviri" duruyor.
   * Ceviriler anlam koruyacak sekilde yapildi, kisaltilmadi.
   * ---------------------------------------------------------------------- */
  {
    author: "Dalia Eldaly · çeviri",
    rating: 5,
    isActive: true,
    note: "Asli Ingilizce (01.04.2026).",
    text: "Büyük Beşiktaş Çarşısı, tam Beşiktaş'ın kalbinde canlı ve otantik bir İstanbul deneyimi sunuyor. Atmosfer hareketli ve enerji dolu; semtin gerçek ruhunu yansıtan çok çeşitli küçük dükkânlar, kafeler ve yerel mekânlar var. Gezmek, hızlıca bir şeyler atıştırmak ya da sadece sokağın dinamizmini izlemek için harika bir yer. Fiyatlar genel olarak makul ve giyimden günlük ihtiyaçlara kadar hemen her şeyi tek bir yerde bulabiliyorsunuz. Turistik noktaların ötesinde İstanbul'un daha yerel ve otantik yüzünü görmek isteyenler için mutlaka görülmesi gereken bir yer.",
  },
  {
    author: "Ahmed Al-Akki · çeviri",
    rating: 4,
    isActive: true,
    note: "Asli Ingilizce (01.02.2024).",
    text: "Üç katlı, yarı açık bir çarşı. İçinde her türden dükkân var; geniş bir yelpazede giyim, aksesuar, ayakkabı ve benzeri ürünler satılıyor. Lüks bir alışveriş merkezi değil, fiyatlar oldukça makul. Çarşının çevresinde birkaç kafe, içinde de umumi tuvalet bulunuyor.",
  },
  {
    author: "Betty Kermen · çeviri",
    rating: 5,
    isActive: true,
    note: "Asli Ingilizce (04.07.2022).",
    text: "Burası alışveriş merkezi değil, daha çok bir outlet çarşısı gibi. Kaliteli ve uygun fiyatlı ürünler bulabiliyorsunuz. İstanbul'a her gelişimde uğruyorum. Tavsiye ederim.",
  },
  {
    author: "Günther Jonitz · çeviri",
    rating: 4,
    isActive: true,
    note: "Asli Ingilizce (11.07.2026).",
    text: "Otantik tezgâhları ve dükkânlarıyla, günlük ihtiyaca yönelik sade ve gerçek bir çarşı. Hayatın kendisi.",
  },
  {
    author: "Devran Gündogan · çeviri",
    rating: 5,
    isActive: true,
    note: "Asli Almanca (07.11.2018).",
    text: "İstanbul'da bir cazibe noktası. Burada sadece küçük butiklerde keyifle alışveriş yapmakla kalmıyor, çevresinde uygun fiyata lezzetli yerel yemekler de yiyebiliyorsunuz.",
  },
  {
    author: "mourad kahoul · çeviri",
    rating: 5,
    isActive: true,
    note: "Asli Fransizca (01.04.2022).",
    text: "Çok iyi karşılanıyorsunuz; ürünlerin kalitesi kusursuz.",
  },
  {
    author: "alali kam · çeviri",
    rating: 5,
    isActive: true,
    note: "Asli Arapca (07.04.2026).",
    text: "Çeşit çeşit bir çarşı; fiyatları herkese uygun ve güzel bir yer.",
  },

  /* ------------------------------- Pasifler ------------------------------ */
  {
    author: "tarik ahmet senturk",
    rating: 5,
    isActive: false,
    note:
      "PASIF: metin carside 'cakma, replika kiyafet' satildigini soyluyor. " +
      "Isletmenin KENDI sitesinde bu ifadeyi yayinlamak marka hakki acisindan " +
      "aleyhte delil olarak okunabilir. Karar carsi yonetiminin.",
    text: "Her türlü çakma, replika kıyafetin bulunduğu bir çarşı. Çoğu orjinaliyle birebir ürünler. Beşiktaş iskeleye çok yakın bir konumda. Çarşı çok eski neredeyse yıkılacak gibiydi. Biraz içine bakım istiyor.",
  },
  {
    author: "Dj",
    rating: 4,
    isActive: false,
    note: "PASIF: tek cumlelik, ziyaretciye bilgi tasimayan bir yorum.",
    text: "Çarşı eskiden daha uygun yerler vardı otopark yer var her türlü eşya kıyafet vs var",
  },
];

function importReviews() {
  db.delete(testimonials).run();

  REVIEWS.forEach((review, index) => {
    db.insert(testimonials)
      .values({
        author: review.author,
        text: review.text,
        rating: review.rating,
        sortOrder: index,
        isActive: review.isActive,
      })
      .run();
  });

  const active = REVIEWS.filter((r) => r.isActive).length;
  console.log(`[medya] ${REVIEWS.length} gercek yorum yazildi (${active} aktif, ${REVIEWS.length - active} pasif).`);

  // Yorum bolumu artik gercek icerige sahip; panelden kapatilmis olan aciliyor.
  const row = db
    .select({ hidden: siteSettings.hiddenSections })
    .from(siteSettings)
    .where(eq(siteSettings.id, SINGLETON_ID))
    .get();
  const before = row?.hidden ?? [];
  const hidden = before.filter((key) => key !== "yorumlar");
  if (hidden.length !== before.length) {
    db.update(siteSettings)
      .set({ hiddenSections: hidden, updatedAt: new Date() })
      .where(eq(siteSettings.id, SINGLETON_ID))
      .run();
    console.log("[medya] Yorumlar bolumu acildi.");
  }
}

async function main() {
  await importPhotos();
  importReviews();
  console.log("[medya] Tamamlandi.");
}

void main();
