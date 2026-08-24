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

const GOOGLE_SRC = "/Users/camoka/sites/venue-scraper/output/buyuk-besiktas-carsisi/photos";
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
 * Sira ZIYARETCININ carsiyi taniyis sirasi: once disaridan giris, sonra avlu,
 * sonra ic koridorlar ve dukkanlar. 6 gorsel = 3'lu izgarada tam iki satir;
 * 4 gorselde son satir tek basina kaliyordu.
 */
const PHOTOS: PhotoJob[] = [
  {
    file: "cephe-tabela.jpg",
    source: "own",
    alt: "Çarşının Beşiktaş meydanına bakan cephesi ve çatısındaki tabela",
  },
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
    file: "google-05.jpg",
    source: "google",
    alt: "Arkabahçe Kitap & Çizgi Roman'ın raflarında çizgi roman ve manga",
  },
  {
    file: "google-10.jpg",
    source: "google",
    alt: "Çarşının üst katlarındaki giyim, ayakkabı ve takı mağazaları",
  },
  {
    // Alt sol kosede tarih damgasi var; alttan %6 kirpinca temizleniyor.
    file: "google-06.jpg",
    source: "google",
    cropBottom: 0.06,
    alt: "Antika ve koleksiyon eşyalarıyla dolu bir çarşı vitrini",
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
 * Google'dan donen 5 yorumun tamami buraya yaziliyor — hicbiri gizlenmiyor,
 * hepsi panelde gorunuyor. Ikisi SITEDE PASIF (`isActive: false`) baslatiliyor;
 * carsi yonetimi tek tikla acabilir.
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
  {
    author: "Sonay Özpınar Ak",
    rating: 4,
    isActive: true,
    text: "Güzel dükkanlar var biz Arka Bahçe dükkanı için gidiyoruz çizgi roman manga vb.almak için fiyatlar bir çok dükkanda makul ayakkabı elbise takı tasarım malzemeleri kaset ve plaklar gibi bir çok şey mevcut",
  },
  {
    author: "Atilla Aslıhan",
    rating: 5,
    isActive: true,
    text: "Henüz avm’ler yokken butikleri, teknoloji dükkanları ve dostane esnafıyla kalplerimizde yer kurmuş bir mekandı. Uzun yıllar sonra tekrar gittim, eskimiş ve yıpranmış yüzüne rağmen yine güler yüzle karşıladı beni. Direniyordu çarşı, değişen her şeye rağmen geliştiriyordu kendini. Belki esnafı biraz daha sıratsızlaşmış belki eski yoğunluğu kalmamıştı ama hangimiz değişmedik ki! Yine teknolojik yardımıma koştu, yine güzel pamuklu tshirtler sundu, yine kafesinde güzel bir kahvaltı yaptım. Varolsun",
  },
  {
    author: "Gezgin Gurme",
    rating: 3,
    isActive: true,
    text: "Beşiktaş çarşı otoparkını kullandım, Çarşısının en üst katı otopark, Fiyatlar normal piyasaya göre, direkt çarşıya çıkıyorsunuz, Kartlı ödeme mevcut, Tavsiye ederim.",
  },
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
