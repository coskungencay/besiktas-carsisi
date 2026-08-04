# cafe-infra

Kahveci / bakery / restoran gibi mekânlara satılan **landing page sitelerinin altyapı şablonu**.

Her müşteri için bu repodan bir kopya alınır, kendi sunucusunda Docker ile çalışır,
müşteri tüm içeriğini kendi admin panelinden yönetir. Kurulumdan sonra geliştirici
müdahalesine ihtiyaç kalmaz.

> **Yeni bir müşteri sitesi mi çıkaracaksınız?** Adım adım akış:
> **[YENI-PROJE.md](./YENI-PROJE.md)**

---

## 1. Ne yapar?

| Katman | Özet |
|---|---|
| **Public site** | Tek sayfa landing: Hero → Hakkımızda → Menü → Galeri → İletişim |
| **Tema sistemi** | **9 hazır tema** (placeholder + 8 tasarım). Her tema kendi bölümlerini, sırasını, fontunu ve açılış animasyonlarını tanımlar. Müşteri repo'sunda tema pinlenir (`pnpm new:customer`) |
| **Tipografi** | Tasarım başına Google Font çifti, `next/font` ile **self-host** — çalışma anında harici istek yok |
| **Bölümler** | Hero, Hakkımızda + Saatler, Menü, Galeri, **Yorumlar**, **S.S.S.**, **Konum**, İletişim; panelden tek tek açılıp kapatılabilir |
| **Dönüşüm** | Sabit WhatsApp butonu, üstte duyuru şeridi, footer'da sosyal medya bağlantıları (hepsi panelden yönetilir) |
| **Admin panel** | `/admin`, arayüz tamamen Türkçe. İçerik, menü, galeri, saatler, mesajlar, renkler |
| **Veritabanı** | SQLite tek dosya (`/data/app.db`), Drizzle ORM |
| **Görseller** | `/data/uploads` altında; sharp ile 1920px WebP + 400px thumbnail + orijinal |
| **Diller** | Türkçe, İngilizce, İspanyolca, Almanca, Arapça (RTL). Arayüz otomatik, müşteri içeriği panelden çevrilir |
| **SEO** | Metadata API, hreflang, çok dilli sitemap, robots, dinamik OG görseli. JSON-LD `@graph`: `CafeOrCoffeeShop` (adres, koordinat, saatler, tam menü, `sameAs`, `Review` + `AggregateRating`) ve `FAQPage`. Şema yalnızca **sayfada görünen** bölümler için üretilir |
| **Deploy** | Multi-stage Dockerfile (standalone), tek named volume, `/api/health` |

---

## 2. Teknoloji

- **Next.js 15** (App Router, `output: "standalone"`)
- **TypeScript** strict (+ `noUncheckedIndexedAccess`)
- **Tailwind CSS v4** — tema token'ları CSS değişkenleriyle
- **motion** (framer-motion) — `prefers-reduced-motion` destekli
- **Drizzle ORM + better-sqlite3**
- **Better Auth** (email + password, tek admin)
- **zod** + **react-hook-form** — tüm mutasyonlar Server Actions üzerinden
- **i18n** — bağımlılık yok; `/[locale]` route + middleware + tip güvenli sözlük
- **sharp** (görsel işleme), **nodemailer** (opsiyonel SMTP)
- **pnpm**

---

## 3. Klasör yapısı

```
cafe-infra/
├── drizzle/                      # üretilmiş SQL migration'ları (commit edilir)
├── public/placeholders/          # yerel SVG yer tutucular (harici URL yok)
├── scripts/
│   ├── migrate.ts                # pnpm db:migrate
│   ├── seed.ts                   # pnpm db:seed  (idempotent)
│   └── backup.sh                 # sqlite .backup + uploads tar
├── src/
│   ├── actions/                  # "use server" — TÜM mutasyonlar burada
│   │   ├── account.ts            #   şifre değiştirme, çıkış
│   │   ├── contact.ts            #   iletişim formu (honeypot + rate limit)
│   │   ├── gallery.ts  hours.ts  menu.ts  messages.ts  settings.ts  theme.ts
│   ├── app/
│   │   ├── [locale]/             #   /tr /en /es /de /ar — public landing
│   │   ├── admin/
│   │   │   ├── layout.tsx        #   panel kabuğu (noindex, her zaman Türkçe)
│   │   │   ├── giris/            #   /admin/giris          (korumasız)
│   │   │   ├── sifre-degistir/   #   /admin/sifre-degistir (oturum ister)
│   │   │   └── (panel)/          #   oturum + şifre değişimi tamamlanmış olmalı
│   │   │       ├── layout.tsx    #     guard + sol menü
│   │   │       ├── page.tsx      #     Dashboard
│   │   │       ├── genel/  saatler/  menu/  galeri/  mesajlar/  diller/  tema/
│   │   ├── api/
│   │   │   ├── auth/[...all]/    #   Better Auth handler
│   │   │   ├── health/           #   healthcheck
│   │   │   └── uploads/[...path] #   /data/uploads servisi (uuid + traversal koruması)
│   │   ├── globals.css           #   Tailwind + tema tokens.css import'ları
│   │   ├── layout.tsx  page.tsx  icon.svg
│   │   ├── opengraph-image.tsx  robots.ts  sitemap.ts
│   ├── components/
│   │   ├── admin/                #   panel UI (SortableList, formlar, nav)
│   │   ├── motion/Reveal.tsx     #   reduced-motion uyumlu animasyon sarmalayıcı
│   │   └── site/ContactForm.tsx  ·  site/LocaleSwitcher.tsx
│   ├── i18n/
│   │   ├── config.ts             #   diller, RTL, Accept-Language seçimi
│   │   ├── index.ts              #   sözlük seçici + {kalıp} doldurucu
│   │   └── messages/             #   tr.ts (referans) · en · es · de · ar
│   ├── middleware.ts             #   / → /<dil> yönlendirmesi, x-locale başlığı
│   ├── db/
│   │   ├── index.ts              #   bağlantı (WAL, foreign_keys)
│   │   └── schema.ts             #   tüm tablolar
│   ├── lib/
│   │   ├── auth.ts  auth-client.ts  session.ts
│   │   ├── content.ts            #   DB → SiteContent dönüşümü (TEK yer)
│   │   ├── action-result.ts  env.ts  format.ts  mailer.ts
│   │   ├── rate-limit.ts  seo.ts  theme-vars.ts  uploads.ts  validators.ts
│   └── themes/
│       ├── types.ts              #   SiteContent + ThemeDefinition sözleşmesi
│       ├── registry.ts           #   Record<slug, ThemeDefinition>
│       ├── shared/
│       │   ├── parts.tsx         #   BrandMark, HeroActions, SectionHeader, ikonlar
│       │   ├── heroes/           #   5 hero düzeni (Split/Overlay/Centered/
│       │   │                     #     Editorial/Framed)
│       │   └── sections/         #   About, Menu, Gallery, Contact (tek uygulama)
│       ├── placeholder/          #   tokens.css + index.ts
│       ├── mera/ patika/ yesil-avlu/ kirk-yil/
│       └── vela/ beyaz-oda/ tesviye/ sicak-firin/
├── Dockerfile  docker-compose.yml  docker-entrypoint.sh
├── .env.example
└── README.md  DEPLOY.md  CUSTOMER.md  THEMING.md
```

---

## 4. Yerel geliştirme

```bash
pnpm install

cp .env.example .env
# .env içinde en az şunları ayarlayın:
#   NEXT_PUBLIC_APP_URL=http://localhost:3000
#   BETTER_AUTH_SECRET=$(openssl rand -base64 32)
#   DATABASE_PATH=./data/app.db
#   UPLOADS_DIR=./data/uploads
#   ADMIN_EMAIL=admin@ornek.com
#   ADMIN_PASSWORD=degistir123

pnpm db:migrate     # tabloları oluştur
pnpm db:seed        # örnek içerik + admin kullanıcı
pnpm dev            # http://localhost:3000
```

Panel: `http://localhost:3000/admin` → ilk girişte şifre değiştirme zorunlu.

### Komutlar

| Komut | Ne yapar |
|---|---|
| `pnpm dev` | Geliştirme sunucusu |
| `pnpm build` | Production build (standalone) |
| `pnpm start` | Build edilmiş uygulamayı çalıştırır |
| `pnpm lint` | ESLint |
| `pnpm tsc --noEmit` | Tip kontrolü |
| `pnpm db:generate` | Şema değişikliğinden SQL migration üretir |
| `pnpm db:migrate` | Migration'ları uygular |
| `pnpm db:seed` | Başlangıç içeriği + admin kullanıcı (idempotent) |
| `pnpm db:studio` | Drizzle Studio |
| `./scripts/backup.sh` | DB + görsel yedeği |

---

## 5. Veri modeli

| Tablo | Açıklama |
|---|---|
| `site_settings` | **Tekil satır** (id = 1). Ad, slogan, hakkımızda, telefon, whatsapp, e-posta, adres, lat/lng, maps linki, instagram, logo, hero görseli, `brandColors` (JSON), `themeSlug`, `enabledLocales` (JSON) |
| `opening_hours` | `dayOfWeek` 0–6 (0 = Pazar), açılış/kapanış, `isClosed` |
| `menu_categories` | Ad, `sortOrder` |
| `menu_items` | Kategori, ad, açıklama, fiyat, görsel, `isFeatured`, `sortOrder`, `isActive` |
| `gallery_images` | URL, alt metni, `sortOrder` |
| `contact_messages` | Ad, telefon, e-posta, mesaj, `isRead`, `createdAt` |
| `translations` | Müşteri içeriğinin dil çevirileri (`locale` + `namespace` + `refId` + `field`). Çeviri yoksa varsayılan dil kullanılır |
| `rate_limits` | İletişim formu için IP başına saatlik sayaç |
| `user` / `session` / `account` / `verification` | Better Auth. `user.mustChangePassword` ilk giriş zorunluluğu için eklendi |

---

## 6. Tema sistemi (mimarinin kalbi)

**Kural: tema kodu asla veritabanına dokunmaz.**

```
DB ──► src/lib/content.ts ──► SiteContent ──► tema section'ları
       (tek dönüşüm yeri)     (tek tip)       (sadece görsel iş)
```

**9 tema hazır:** `placeholder`, `mera`, `patika`, `yesil-avlu`, `kirk-yil`,
`vela`, `beyaz-oda`, `tesviye`, `sicak-firin` (ikisi koyu tema).

- **Bölümlerin sayısı ve sırası temanın kararıdır**: `ThemeDefinition` bir
  `Header?`, bir `sections[]` dizisi ve bir `Footer?` verir; sayfa yalnızca sırayla basar
- **Her tema kendi bölümlerini yazar** (`src/themes/<slug>/sections/`). Ortak bölüm
  bileşeni yoktur — 9 temanın aynı görünmesinin sebebi oydu, kaldırıldı
- Temalar arasında **yalnızca mantık** paylaşılır (`src/themes/_shared/`): menü
  gruplama, saat aralığı, koordinat biçimi, form hook'u, ikonlar. Görsel karar paylaşılmaz
- Tüm section'lar tek bir props alır: `{ content: SiteContent }`
- Renk, radius, kenarlık kalınlığı, başlık ağırlığı, harf aralığı ve fontlar
  **yalnızca** CSS değişkenleriyle. Panelden seçilen renkler `<html>` üzerine
  inline style olarak basılır ve tema varsayılanlarını ezer

**Aktif tema çözümleme sırası:**
1. `NEXT_PUBLIC_THEME` (geçerli bir slug ise) → imaja sabitlenmiş tema
2. `site_settings.themeSlug` → panelden seçilen tema
3. `placeholder` → fallback

Yeni tema eklemek için: **[THEMING.md](./THEMING.md)**

---

## 6b. Dil desteği

Desteklenen diller: **Türkçe, İngilizce, İspanyolca, Almanca, Arapça**.
Arapça `dir="rtl"` ile sağdan sola render edilir.

**İki ayrı katman var:**

| Katman | Nerede | Kim çevirir |
|---|---|---|
| Arayüz metinleri ("Menü", "Mesaj Gönder", hata mesajları) | `src/i18n/messages/*.ts` | Hazır geliyor, kod tarafı |
| Müşteri içeriği (slogan, hakkımızda, ürün adları, galeri açıklamaları) | `translations` tablosu | Müşteri, `/admin/diller` sayfasından |

- **URL yapısı:** her dil kendi yolunda — `/tr`, `/en`, `/es`, `/de`, `/ar`.
  `/` isteği `Accept-Language` başlığına göre uygun dile yönlendirilir.
- **Fallback:** çevrilmemiş her alan otomatik olarak varsayılan dildeki metni gösterir.
  Yarım kalmış çeviri siteyi asla boş bırakmaz.
- **Aktif diller:** panelden seçilir (`site_settings.enabledLocales`). Kapalı bir
  dile gelen istek varsayılan dile yönlendirilir. Tek dil açıksa dil seçici gizlenir.
- **Varsayılan dil:** `NEXT_PUBLIC_DEFAULT_LOCALE` (yoksa `tr`). Kapatılamaz.
- **Gün adları ve fiyatlar** `Intl` ile üretilir — 7 gün × 5 dil elle yazılmaz.
- **SEO:** her dil için `hreflang` + `x-default`, çok dilli `sitemap.xml`,
  dile göre `og:locale` ve `inLanguage` içeren JSON-LD.

Tema yazarken: **sabit metin yazmayın**, `content.t.*` kullanın ve yön bağımlı
Tailwind sınıfları yerine mantıksal olanları seçin (`ms-*`, `text-start`, `end-*`).
Detay: [THEMING.md](./THEMING.md)

---

## 7. Güvenlik notları

- Kayıt (sign-up) endpoint'i kapalı; kullanıcı yalnızca seed ile oluşur.
- `/admin` altındaki her sayfa sunucu tarafında oturum kontrolünden geçer (`(panel)/layout.tsx`).
- İlk girişte şifre değiştirme zorunlu (`user.mustChangePassword`).
- Oturum cookie cache'i **kapalı** — açık olsaydı şifre değişiminden sonra 5 dakika eski kullanıcı verisi okunurdu.
- Yükleme yolları yalnızca `uuid.webp` / `uuid.thumb.webp` / `uuid.orig.<ext>` kalıbına izin verir; path traversal engellidir.
- İletişim formunda honeypot alanı + IP başına saatlik rate limit (DB tabanlı, restart'a dayanıklı).
- `robots.ts` `/admin` ve `/api` yollarını dışlar; panel `noindex`.

---

## 8. Assumptions (belirsizliklerde verilen kararlar)

Talimatta açık belirtilmeyen noktalarda alınan kararlar:

1. **Tema seçimi env mi DB mi?** İkisi de destekleniyor. `NEXT_PUBLIC_THEME` doluysa
   tema imaja sabitlenir, panelde seçici **hiç görünmez** ve sunucu tarafı tema
   değişikliğini reddeder; boşsa müşteri panelden seçer. Müşteri repo'larında tema
   her zaman pinlenir (`pnpm new:customer --theme=<slug>`), böylece müşteri yalnızca
   renkleri değiştirebilir.

2. **Render stratejisi.** Tüm rotalar `dynamic = "force-dynamic"`. Gerekçe: SQLite
   okuması sub-milisaniye, ve Docker build'inin veritabanına ihtiyaç duymaması
   gerekiyor (build sırasında `/data` volume'ü henüz yok). Mutasyonlar yine de
   şartname gereği `revalidatePath("/")` çağırıyor — ileride ISR'e geçilmek
   istenirse kod hazır.

3. **Rate limit nerede tutuluyor?** Bellek yerine `rate_limits` tablosunda.
   Container restart'ında sayaç sıfırlanmıyor. Tek container varsayımı geçerli.

4. **Sürükle-bırak.** Ek kütüphane eklenmedi; HTML5 drag & drop kullanıldı.
   Dokunmatik cihazlar ve klavye kullanıcıları için her satırda ↑ / ↓ butonları var
   (ikisi de aynı server action'ı çağırır).

5. **Fiyat tipi.** `real` (TL cinsinden ondalık) olarak saklanıyor, `Intl.NumberFormat("tr-TR")`
   ile biçimleniyor. `0` girilirse fiyat sitede gösterilmiyor.

6. **Font.** Harici font indirilmiyor (Google Fonts yok). Sistem font yığını
   kullanılıyor — böylece Docker build'i ağ erişimi olmadan çalışır, LCP daha iyi
   ve GDPR açısından sorun çıkmaz. Tema kendi fontunu `--font-display` ile ezebilir.

7. **Placeholder görseller.** Harici URL yok; `public/placeholders/*.svg` içinde
   yerel SVG'ler üretildi (hero, kare, logo).

8. **SMTP opsiyonel.** `SMTP_HOST` + `CONTACT_TO_EMAIL` doluysa mail gider.
   Mail gönderimi başarısız olsa bile form asla hata vermez — mesaj zaten DB'ye yazılmıştır.

9. **Seed davranışı.** `pnpm db:seed` idempotent ve container her açılışta çalışır
   (`RUN_SEED=false` ile kapatılabilir). Mevcut kayıtları ezmez; admin kullanıcı
   zaten varsa dokunmaz.

10. **Menü ürünü silinince** görselinin 3 varyantı da diskten silinir. Kategori
    silinince içindeki ürünler ve onların görselleri de silinir (`onDelete: cascade`).

11. **Admin panel teması.** Panel, müşterinin seçtiği marka renklerinden ve
    fontlarından bağımsız sabit bir nötr arayüz kullanır (`.admin-shell`) —
    aksi halde monospace bir tema seçildiğinde panel de monospace olur, kötü bir
    renk seçimi de paneli okunamaz hale getirebilirdi.

11b. **Tema mimarisi: 9 tema, 4 bölüm dosyası.** 8 tasarım ölçüldüğünde
    About/Menu/Gallery/Contact'ın yapısal olarak birebir aynı olduğu, farkın
    yalnızca 4 token (radius, kenarlık kalınlığı, başlık ağırlığı, harf aralığı)
    olduğu görüldü. Bu yüzden bu 4 bölüm bir kez yazıldı; Hero'nun ise 5 gerçek
    düzeni olduğu için 5 ayrı bileşen var. Alternatif (her tema için 5 dosya =
    40 dosya) 32 tanesi neredeyse birebir aynı dosya üretir ve bir hata
    düzeltmesini 8 kez tekrarlamayı gerektirirdi.

11c. **Tema değişince özel renkler sıfırlanır.** Aksi halde açık bir temadan
    koyu bir temaya geçerken önceki paletin üzerine yazılır ve site okunamaz
    hale gelirdi. Ayrıca yalnızca temanın varsayılanından **farklı** olan
    renkler saklanır; böylece tema güncellenirse müşteri dokunmadığı renklerde
    otomatik olarak yeni paleti alır.

12. **`better-sqlite3` sürümü ve Docker taban imajı.** 13.x kullanıldı — bu sürüm
    prebuilt binary'leri paketin içinde taşır, yani Docker build'inde `node-gyp`
    derlemesi gerekmez. Ancak bu binary **GLIBC ≥ 2.38** ister; bu yüzden taban
    imaj `node:22-trixie-slim` (Debian 13, GLIBC 2.41). `bookworm-slim`'e
    (GLIBC 2.36) düşürürseniz container açılışta `ERR_DLOPEN_FAILED` verir.
    Ayrıca Better Auth peer olarak 12.x istiyor; bu yalnızca kendi kysely
    adaptörü için geçerli, biz Drizzle adaptörünü kullandığımız için uyarı zararsızdır.

13. **Diller neden varsayılan olarak kapalı?** Yeni kurulumda sadece varsayılan dil
    açıktır. Beşini birden açık getirmek, müşteri çeviri girmeden İngilizce sayfada
    Türkçe menü göstermek anlamına gelirdi. Müşteri `/admin/diller`'den gerçekten
    çevireceği dilleri açar.

14. **Çeviri tablosu neden polimorfik?** `namespace + refId + field` şeklinde
    (EAV benzeri) tutuldu; her yeni çevrilebilir alan için migration gerekmesin diye.
    Boş bırakılan çeviri satırı **silinir** — kayıt yoksa fallback devreye girer.

15. **Middleware veritabanı okumaz.** Edge runtime'da `better-sqlite3` çalışmaz.
    Bu yüzden middleware yalnızca slug biçimini kontrol eder; hangi dillerin açık
    olduğu `[locale]/layout.tsx` içinde kontrol edilir ve kapalı dil varsayılana
    **yönlendirilir** (404 değil — tarayıcısı Almanca olan ziyaretçi 404 görmemeli).

16. **JavaScript kapalıysa.** `Reveal` animasyonu içeriği `opacity:0` ile başlatır;
    JS çalışmazsa sayfa boş görünürdü. `<noscript>` içindeki bir stil kuralı bu
    durumda tüm `[data-reveal]` öğelerini görünür yapar.

17. **Build sırasında gizli anahtar aranmaz.** `BETTER_AUTH_SECRET` production'da
    zorunludur ama `next build` sırasında (NEXT_PHASE = phase-production-build)
    kontrol atlanır — imaja sır gömülmemesi için. Eksikse container **çalışma
    anında ilk import'ta** hata verip durur (fail-fast).

---

## 9. Kalite kapısı

```bash
pnpm lint          # temiz
pnpm tsc --noEmit  # temiz
pnpm build         # temiz
```

Üçü de bu repoda doğrulanmıştır.

---

## 10. Sonraki adımlar

- Şablondan yeni müşteri sitesi çıkarma → **[YENI-PROJE.md](./YENI-PROJE.md)** (repo açmaktan yayına hazır commit'e)
- Sunucuya kurulum → **[DEPLOY.md](./DEPLOY.md)** (15 dakikalık checklist)
- Müşteriye verilecek kılavuz → **[CUSTOMER.md](./CUSTOMER.md)**
- Yeni tasarım/tema ekleme → **[THEMING.md](./THEMING.md)**
