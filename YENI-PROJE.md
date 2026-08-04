# YENI-PROJE.md — Şablondan yeni bir müşteri sitesi çıkarma

Bu repo bir **şablon**. Her müşteri için buradan ayrı bir repo kopyası alınır,
bir tema pinlenir, içerik doldurulur ve kendi sunucusunda yayına alınır.

Bu dosya **kod tarafını** anlatır: repo açmaktan yayına hazır commit'e kadar.
Sunucu tarafı (Coolify, DNS, volume, sertifika, yedek) ayrı bir dosyada:
**[DEPLOY.md](./DEPLOY.md)**. Müşteriye teslim edilecek kılavuz:
**[CUSTOMER.md](./CUSTOMER.md)**.

---

## Akış özeti

```
şablon repo
   └─ 1. müşteri repo'sunu aç          (git clone + remote düzeni)
      └─ 2. yerelde ayağa kaldır       (.env + db:migrate + db:seed + dev)
         └─ 3. temayı seç              (panelden 9 temayı gezerek)
            └─ 4. temayı pinle         (pnpm new:customer --theme=<slug>)
               └─ 5. içeriği doldur    (panelden; kod değişmez)
                  └─ 6. doğrula        (typecheck + lint + build)
                     └─ 7. commit + push
                        └─ 8. DEPLOY.md ile yayına al
```

Tahmini süre: içerik hazırsa **30–45 dakika**.

---

## 0. Ön koşullar

| Gereksinim | Not |
|---|---|
| Node.js 20+ | `node -v` |
| pnpm | `corepack enable && corepack prepare pnpm@latest --activate` |
| git | Müşteri için boş bir remote repo (GitHub/GitLab) |
| Müşteri içeriği | İşletme adı, adres, telefon, saatler, menü, fotoğraflar, slogan |

> İçerik henüz yoksa da başlayabilirsiniz: seed örnek bir menü, yorumlar ve
> S.S.S. kurar; hepsini panelden değiştirirsiniz.

---

## 1. Müşteri repo'sunu aç

Şablonu `upstream` olarak bırakın. Böylece şablonda kritik bir düzeltme
çıktığında müşteri repo'suna çekebilirsiniz.

```bash
git clone <cafe-infra-repo-url> ornek-kafe-site
cd ornek-kafe-site

git remote rename origin upstream
git remote add origin git@github.com:<hesap>/ornek-kafe-site.git
git push -u origin main

pnpm install
```

---

## 2. Yerelde ayağa kaldır

```bash
cp .env.example .env
```

`.env` içinde **yerel** için şu değerleri kullanın — `.env.example` production
değerleriyle gelir, olduğu gibi bırakırsanız giriş `Invalid origin` hatası verir:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<openssl rand -base64 32 çıktısı>

DATABASE_PATH=./data/app.db
UPLOADS_DIR=./data/uploads

ADMIN_EMAIL=admin@ornek-kafe.com
ADMIN_PASSWORD=gecici-sifre-123

NEXT_PUBLIC_THEME=            # bu adımda BOŞ kalmalı (tema seçebilmek için)
NEXT_PUBLIC_DEFAULT_LOCALE=tr
```

Sonra:

```bash
pnpm db:migrate     # tabloları oluşturur
pnpm db:seed        # site ayarları, saatler, örnek menü/yorum/SSS + admin kullanıcı
pnpm dev            # http://localhost:3000
```

Panel: **http://localhost:3000/admin** → `.env`'deki e-posta ve şifreyle girin.
İlk girişte sistem sizi şifre değiştirmeye zorlar.

> `.env` **gitignore'da**; production değerleri Coolify'dan gelir, repo'ya girmez.

---

## 3. Temayı seç

Tema `NEXT_PUBLIC_THEME` boşken panelden değiştirilebilir:
**/admin/tema** → istediğiniz temayı seçin, siteyi açıp bakın, beğenmediyseniz
başkasını seçin. Bu aşama müşteriye gitmeden **sizin** kararınızdır.

| Slug | Ad | Şema | Karakter |
|---|---|---|---|
| `mera` | Mera | açık | Editoryal serif başlıklar, sıcak toprak tonları, keskin köşeler |
| `beyaz-oda` | Beyaz Oda | açık | Saf beyaz, 12 kolonluk editoryal ızgara, grotesk + monospace |
| `kirk-yil` | Kırk Yıl | açık | Nostaljik bordo ve altın, baştan sona serif, ortalanmış klasik düzen |
| `patika` | Patika | **koyu** | Koyu zemin, neon sarı vurgu, kalın tipografi, yuvarlak köşeler |
| `vela` | Vela | **koyu** | Koyu butik atmosfer, altın vurgu, geniş harf aralıkları |
| `yesil-avlu` | Yeşil Avlu | açık | Botanik yeşiller, krem zemin, yumuşak geniş yuvarlatmalar |
| `sicak-firin` | Sıcak Fırın | açık | Mahalle fırını sıcaklığı, Zilla Slab başlıklar, kesik çizgiler |
| `tesviye` | Tesviye | açık | Brutalist çerçeveler, elektrik mavisi, kalın kenarlıklar, monospace |
| `placeholder` | Placeholder (nötr) | açık | Nötr başlangıç teması; müşteriye gitmez |

Bakarken şuna dikkat edin: müşterinin fotoğrafları koyu mu açık mı? Koyu
fotoğraflar `patika` / `vela` ile, aydınlık mekân fotoğrafları `beyaz-oda` /
`yesil-avlu` ile daha iyi duruyor.

> Renkler tema seçiminden bağımsız: her tema kendi varsayılan paletiyle gelir,
> müşteri **/admin/tema**'dan renkleri kendi markasına göre değiştirebilir.

---

## 4. Temayı pinle

Karar verdikten sonra:

```bash
pnpm new:customer --theme=vela --dry-run   # önce ne yapacağına bakın
pnpm new:customer --theme=vela             # onay sorar
```

Komut şunları yapar:

1. Seçilen tema dışındaki tema klasörlerini **siler**
2. `src/themes/registry.ts`'i tek temaya göre yeniden yazar
3. `src/app/globals.css` içindeki tema import'larını günceller
4. `src/themes/fonts.ts`'i yalnızca kalan temanın fontlarıyla bırakır
5. `.env.example` içine `NEXT_PUBLIC_THEME=<slug>` yazar
6. `design-input/designs` içeriğini temizler

Sonra **kendi `.env`'inize de** aynı satırı ekleyin:

```bash
NEXT_PUBLIC_THEME=vela
```

Bu andan sonra:

- Panelde **tema seçici hiç görünmez** (`src/app/admin/(panel)/tema/page.tsx`),
  sayfada yalnızca renk formu kalır.
- Sunucu tarafı da reddeder: elle hazırlanmış bir istek bile
  "Bu sitede tema sabitlenmiş; değiştirilemez." döner (`src/actions/theme.ts`).
- Müşteri panelden **yalnızca renkleri** değiştirebilir.

> `--yes` bayrağı onay sormadan çalıştırır (CI için). Komut idempotent:
> ikinci çalıştırmada yapacak iş kalmadığını söyler.
>
> **Geri dönüşü yoktur.** Başka bir tema gerekirse şablondan yeni bir kopya açın.

`NEXT_PUBLIC_THEME` build'e gömüldüğü için dev sunucusunu yeniden başlatın.

---

## 5. İçeriği doldur

Hepsi panelden, kod değişmeden. Sol menü sırası:

| Sayfa | Ne girilir |
|---|---|
| **Genel Bilgiler** | İşletme adı, slogan, hakkımızda, adres, telefon, WhatsApp, e-posta, Instagram, koordinat, logo, kapak görseli, sosyal medya bağlantıları, duyuru şeridi, **bölüm aç/kapa** |
| **Çalışma Saatleri** | 7 gün açılış/kapanış, kapalı günler |
| **Menü** | Kategoriler ve ürünler; "öne çıkan" işaretlenenler ana sayfadaki vitrinde görünür (hiçbiri işaretli değilse ilk birkaç ürün gösterilir), tamamı `/menu` sayfasında listelenir |
| **Galeri** | Mekân fotoğrafları (1920px WebP + thumbnail otomatik üretilir) |
| **Yorumlar** | Google/Instagram yorumları; `Review` + `AggregateRating` şeması buradan üretilir |
| **S.S.S.** | Soru-cevap; `FAQPage` şeması buradan üretilir |
| **Diller & Çeviriler** | Ek dilleri açın (tr/en/es/de/ar) ve içerik çevirilerini girin |
| **Tema & Renkler** | Marka renkleri |
| **Mesajlar** | İletişim formundan gelenler (giriş değil, çıktı) |

**Bölüm aç/kapa** (Genel Bilgiler sayfasında): Yorumlar, S.S.S., Konum, Galeri,
WhatsApp butonu, Duyuru şeridi. Kapatılan bölüm hem sayfadan hem de yapısal
veriden (JSON-LD) düşer — arama motoruna sayfada olmayan bir şey bildirilmez.
İçeriği boş olan bölüm zaten otomatik gizlenir.

> Menüde hiç ürün yoksa `/{dil}/menu` sayfası 404 döner ve sitemap'e girmez.

---

## 6. Doğrula

```bash
pnpm typecheck
pnpm lint
pnpm build
```

> `pnpm build`'i **dev sunucusu kapalıyken** çalıştırın — ikisi aynı `.next`
> klasörünü kullanır, açıkken build alırsanız dev tarafı `ChunkLoadError` verir.
>
> Temiz bir ortamda build alıyorsanız (DB dosyası henüz yokken) önce
> `pnpm db:migrate` çalıştırın; yoksa Next'in paralel worker'ları aynı anda
> veritabanını oluşturmaya çalışır ve build `SQLITE_BUSY` ile düşer.

Gözle kontrol (dev sunucusunda):

- [ ] `/tr` — hero, hakkımızda, menü vitrini, galeri, yorumlar, S.S.S., konum, iletişim
- [ ] `/tr/menu` — tüm menü, geri dönüş bağlantısı
- [ ] **390px genişlikte** aynı iki sayfa — yatay kaydırma olmamalı
- [ ] Açtığınız her ek dil (`/en`, `/ar` …) — Arapça'da düzen sağdan sola dönmeli
- [ ] `/admin/tema` — tema seçici **görünmemeli**, yalnızca renkler
- [ ] `/api/health` → `{"status":"ok",...}`

---

## 7. Commit + push

```bash
git add -A
git commit -m "chore: ornek-kafe icin tema pinlendi (vela)"
git push
```

> İçerik veritabanında olduğu için commit'e girmez. `data/` ve `.env`
> gitignore'da. Müşterinin içeriği yalnızca sunucudaki `/data` volume'ünde yaşar
> — yedekleme bu yüzden kritik (DEPLOY.md adım 9).

---

## 8. Yayına al

Buradan sonrası **[DEPLOY.md](./DEPLOY.md)**: DNS, Coolify uygulaması,
`/data` volume'ü, ortam değişkenleri, domain + HTTPS, deploy, ilk giriş,
yedekleme cron'u ve teslim.

Production `.env` değerlerinin yereldekinden farkı:

```bash
NEXT_PUBLIC_APP_URL=https://ornek-kafe.com    # localhost değil
BETTER_AUTH_URL=https://ornek-kafe.com
BETTER_AUTH_SECRET=<HER MÜŞTERİ İÇİN FARKLI>
DATABASE_PATH=/data/app.db                     # volume içinde
UPLOADS_DIR=/data/uploads
NEXT_PUBLIC_THEME=vela                         # pinli tema
```

---

## Sonrasında: şablondaki düzeltmeleri çekmek

```bash
git fetch upstream
git merge upstream/main      # çakışmaları çözün
# veya tek bir düzeltme için:
git cherry-pick <sha>

pnpm typecheck && pnpm build
git push                     # Coolify → Redeploy
```

Müşteri repo'sunda kalan tek tema olduğu için, şablonda **başka** temalara
dokunan commit'ler çakışabilir; bunları atlayın. Şema değiştiyse yeni migration
dosyası repo ile gelir ve container açılışında otomatik uygulanır —
**önce yedek alın**.

---

## Sık karşılaşılan yerel sorunlar

| Belirti | Sebep / çözüm |
|---|---|
| Girişte `Invalid origin: http://localhost:3000` | `.env`'de `NEXT_PUBLIC_APP_URL` / `BETTER_AUTH_URL` hâlâ production adresi. İkisini de `http://localhost:3000` yapın |
| `db:seed` → `ADMIN_PASSWORD tanimli degil` | `.env` yok ya da değer boş. Script `.env`'i `--env-file-if-exists` ile okur; dosyanın proje kökünde olduğundan emin olun |
| `db:seed` "Admin kullanici zaten var" diyor ama şifre tutmuyor | Şifre bir kez panelden değiştirilmiş. Seed idempotent olduğu için mevcut kullanıcıya dokunmaz — aşağıdaki şifre sıfırlama adımını uygulayın |
| `pnpm build` → `SqliteError: database is locked` | DB dosyası henüz yok. Önce `pnpm db:migrate` |
| Dev sunucusunda `ChunkLoadError` | Dev açıkken `pnpm build` alınmış. Dev'i durdurun, `rm -rf .next`, yeniden `pnpm dev` |
| Tema değiştiremiyorum | `.env`'de `NEXT_PUBLIC_THEME` dolu. Yerelde denemek için boşaltıp dev'i yeniden başlatın |
| `/en` açılmıyor, `/tr`'ye atıyor | O dil panelde açık değil: **Diller & Çeviriler** → işaretleyip kaydedin |
| Yüklenen görsel 404 | `UPLOADS_DIR` yanlış ya da `data/uploads` yok. `.env`'i kontrol edip `mkdir -p data/uploads` |

### Admin şifresini sıfırlama

Şifre sıfırlama ekranı yok (site tek kullanıcılı). Şifre unutulduğunda,
veritabanına erişimi olan kişi Better Auth'un kendi hash fonksiyonuyla yeniden
yazar. Proje kökünde geçici bir dosya oluşturun:

```ts
// scripts/tmp-reset-pw.ts
import { eq } from "drizzle-orm";

import { db } from "../src/db";
import { account, user } from "../src/db/schema";
import { auth } from "../src/lib/auth";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim() || "";
  const password = process.env.ADMIN_PASSWORD?.trim() || "";

  const row = db.select().from(user).where(eq(user.email, email)).get();
  if (!row) throw new Error(`Kullanici bulunamadi: ${email}`);

  const ctx = await auth.$context;
  const hashed = await ctx.password.hash(password);

  db.update(account)
    .set({ password: hashed, updatedAt: new Date() })
    .where(eq(account.userId, row.id))
    .run();

  console.log(`[reset] ${email} sifresi guncellendi.`);
}

void main();
```

```bash
pnpm exec tsx --env-file-if-exists=.env scripts/tmp-reset-pw.ts
rm scripts/tmp-reset-pw.ts
```

Yeni şifre `.env`'deki `ADMIN_PASSWORD` değeri olur.

**Sunucudaki bir siteyi sıfırlamak için** en pratik yol, yedeği yerele indirip
aynı komutu `DATABASE_PATH` o dosyayı gösterecek şekilde çalıştırmak, sonra
veritabanını geri yüklemektir (production imajı standalone build olduğu için
`tsx` içermez):

```bash
docker cp <container>:/data/app.db ./app.db
DATABASE_PATH=./app.db ADMIN_EMAIL=<mail> ADMIN_PASSWORD=<yeni-sifre> \
  pnpm exec tsx scripts/tmp-reset-pw.ts
docker cp ./app.db <container>:/data/app.db
docker restart <container>
```

> Geri yüklemeden önce container'ı durdurun ve `app.db-wal` / `app.db-shm`
> dosyalarının kalmadığından emin olun (bkz. DEPLOY.md, manuel geri yükleme).
>
> Bu geçici script repo'ya **commit edilmemeli**.

---

## Komut özeti

| Komut | Ne yapar |
|---|---|
| `pnpm install` | Bağımlılıklar |
| `pnpm db:migrate` | Tabloları oluşturur / günceller |
| `pnpm db:seed` | Başlangıç içeriği + admin kullanıcı (idempotent) |
| `pnpm dev` | Geliştirme sunucusu (`:3000`) |
| `pnpm new:customer --theme=<slug>` | Temayı pinler, diğer temaları siler |
| `pnpm new:customer --theme=<slug> --dry-run` | Hiçbir şeye dokunmadan ne yapacağını gösterir |
| `pnpm typecheck` | TypeScript kontrolü |
| `pnpm lint` | ESLint |
| `pnpm build` | Production build (standalone) |
| `pnpm db:studio` | Drizzle Studio (veritabanını gözle inceleme) |
| `./scripts/backup.sh` | DB + görsel yedeği |
