/**
 * Veritabanini ilk icerikle doldurur ve tek admin kullanicisini olusturur.
 * Kullanim: pnpm db:seed
 *
 * Idempotent: birden fazla kez calistirilabilir, mevcut kayitlari ezmez.
 * Admin sifresi ADMIN_PASSWORD env'inden gelir; kullanici ilk giriste
 * sifresini degistirmek ZORUNDADIR (mustChangePassword = true).
 */
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

import { SINGLETON_ID, db, resolveDatabasePath } from "../src/db";
import {
  account,
  galleryImages,
  menuCategories,
  menuItems,
  openingHours,
  siteSettings,
  user,
} from "../src/db/schema";
import { auth } from "../src/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim() || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim() || "";
const ADMIN_NAME = process.env.ADMIN_NAME?.trim() || "Yönetici";

async function seedAdmin() {
  const existing = db
    .select()
    .from(user)
    .where(eq(user.email, ADMIN_EMAIL))
    .get();

  if (existing) {
    console.log(`[seed] Admin kullanici zaten var: ${ADMIN_EMAIL}`);
    return;
  }

  if (!ADMIN_PASSWORD) {
    console.error(
      "[seed] ADMIN_PASSWORD tanimli degil. Admin kullanici olusturulamadi.\n" +
        "       .env dosyaniza ADMIN_EMAIL ve ADMIN_PASSWORD ekleyip tekrar calistirin.",
    );
    return;
  }
  if (ADMIN_PASSWORD.length < 8) {
    console.error("[seed] ADMIN_PASSWORD en az 8 karakter olmali.");
    return;
  }

  // Better Auth'un kendi hash algoritmasini kullaniyoruz ki giris calissin.
  const ctx = await auth.$context;
  const hashed = await ctx.password.hash(ADMIN_PASSWORD);

  const now = new Date();
  const userId = randomUUID();

  db.transaction((tx) => {
    tx.insert(user)
      .values({
        id: userId,
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        emailVerified: true,
        mustChangePassword: true,
        createdAt: now,
        updatedAt: now,
      })
      .run();

    tx.insert(account)
      .values({
        id: randomUUID(),
        accountId: userId,
        providerId: "credential",
        userId,
        password: hashed,
        createdAt: now,
        updatedAt: now,
      })
      .run();
  });

  console.log(`[seed] Admin kullanici olusturuldu: ${ADMIN_EMAIL}`);
  console.log("[seed] Ilk giriste sifre degistirme ZORUNLU.");
}

function seedSettings() {
  const existing = db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SINGLETON_ID))
    .get();

  if (existing) {
    console.log("[seed] site_settings zaten dolu, atlandi.");
    return;
  }

  db.insert(siteSettings)
    .values({
      id: SINGLETON_ID,
      name: "Kahve Durağı",
      tagline: "Her fincanda taze çekilmiş kahve, her tabakta ev yapımı tat.",
      // Hero basligi: musteri panelden degistirir. Bos birakilirsa `name` kullanilir.
      heroHeadline: "Küçük bir dükkân,",
      heroSubline: "büyük bir fincan.",
      highlights: [
        { label: "Saat", value: "08–22" },
        { label: "Kapalı", value: "Pazar" },
        { label: "Oturma", value: "24" },
      ],
      about:
        "2015'ten beri mahallemizin buluşma noktasıyız. Kahvelerimizi kendi kavurma tesisimizde haftalık partiler hâlinde kavuruyor, tatlılarımızı her sabah taze hazırlıyoruz.\n\nİster kitabınızla sessiz bir köşede, ister arkadaşlarınızla uzun sohbetlerde — kapımız her zaman açık.",
      phone: "+90 555 111 22 33",
      whatsapp: "0555 111 22 33",
      email: "merhaba@ornek-kafe.com",
      address: "Örnek Mahallesi, Kahve Sokak No:12, Kadıköy / İstanbul",
      lat: 40.9903,
      lng: 29.0272,
      mapsUrl: "",
      instagram: "ornekkafe",
      logoUrl: "",
      heroImageUrl: "",
      brandColors: {},
      themeSlug: "placeholder",
      updatedAt: new Date(),
    })
    .run();

  console.log("[seed] site_settings olusturuldu.");
}

function seedHours() {
  const existing = db.select().from(openingHours).all();
  if (existing.length > 0) {
    console.log("[seed] opening_hours zaten dolu, atlandi.");
    return;
  }

  for (let day = 0; day < 7; day += 1) {
    db.insert(openingHours)
      .values({
        dayOfWeek: day,
        openTime: day === 0 ? "10:00" : "08:00",
        closeTime: day === 0 ? "20:00" : "22:00",
        isClosed: false,
      })
      .run();
  }

  console.log("[seed] opening_hours olusturuldu.");
}

function seedMenu() {
  const existing = db.select().from(menuCategories).all();
  if (existing.length > 0) {
    console.log("[seed] Menu zaten dolu, atlandi.");
    return;
  }

  const data: {
    name: string;
    items: { name: string; description: string; price: number; featured?: boolean }[];
  }[] = [
    {
      name: "Sıcak İçecekler",
      items: [
        {
          name: "Filtre Kahve",
          description: "Günün çekirdeği, V60 ya da French Press.",
          price: 85,
          featured: true,
        },
        {
          name: "Flat White",
          description: "Çift shot espresso, ipeksi süt köpüğü.",
          price: 110,
        },
        {
          name: "Türk Kahvesi",
          description: "Bakır cezvede, lokum eşliğinde.",
          price: 70,
        },
      ],
    },
    {
      name: "Soğuk İçecekler",
      items: [
        {
          name: "Cold Brew",
          description: "18 saat demlenmiş, yumuşak içimli.",
          price: 105,
          featured: true,
        },
        {
          name: "Ev Yapımı Limonata",
          description: "Taze nane ve limon.",
          price: 80,
        },
      ],
    },
    {
      name: "Tatlılar",
      items: [
        {
          name: "San Sebastian Cheesecake",
          description: "Dışı karamelize, içi akışkan.",
          price: 145,
        },
        {
          name: "Günün Kurabiyesi",
          description: "Her sabah fırından yeni çıkmış.",
          price: 55,
        },
      ],
    },
  ];

  data.forEach((category, categoryIndex) => {
    const inserted = db
      .insert(menuCategories)
      .values({ name: category.name, sortOrder: categoryIndex })
      .returning()
      .get();

    category.items.forEach((item, itemIndex) => {
      db.insert(menuItems)
        .values({
          categoryId: inserted.id,
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: "",
          isFeatured: item.featured ?? false,
          sortOrder: categoryIndex * 100 + itemIndex,
          isActive: true,
        })
        .run();
    });
  });

  console.log("[seed] Ornek menu olusturuldu.");
}

function reportGallery() {
  const count = db.select().from(galleryImages).all().length;
  console.log(
    `[seed] Galeri: ${count} gorsel. Gorseller admin panelinden yuklenir.`,
  );
}

async function main() {
  console.log(`[seed] Veritabani: ${resolveDatabasePath()}`);
  seedSettings();
  seedHours();
  seedMenu();
  reportGallery();
  await seedAdmin();
  console.log("[seed] Tamamlandi.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[seed] HATA:", error);
    process.exit(1);
  });
