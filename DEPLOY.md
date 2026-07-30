# DEPLOY.md — Yeni müşteri kurulumu (15 dakika)

Hetzner sunucusunda **Coolify + Traefik** ile bir müşteri sitesini yayına alma
adımları. Sırayla takip edin; her adımın yanında tahmini süre var.

> Ön koşul (bir kereye mahsus): Hetzner'de bir sunucu ve üzerinde kurulu Coolify.
> Coolify kurulumu: `curl -fsSL https://cdn.coolify.io/coolify/install.sh | bash`

---

## Hızlı checklist

- [ ] 1. Repo kopyası oluşturuldu (2 dk)
- [ ] 2. Domain DNS'i sunucuya yönlendirildi (2 dk)
- [ ] 3. Coolify'da uygulama oluşturuldu (3 dk)
- [ ] 4. Persistent volume `/data` tanımlandı (1 dk)
- [ ] 5. Ortam değişkenleri girildi (3 dk)
- [ ] 6. Domain + HTTPS ayarlandı (1 dk)
- [ ] 7. Deploy edildi, healthcheck yeşil (2 dk)
- [ ] 8. Panele girilip şifre değiştirildi (1 dk)
- [ ] 9. Yedekleme cron'u kuruldu (2 dk)
- [ ] 10. Müşteriye teslim (CUSTOMER.md)

---

## 1. Repo kopyası (2 dk)

Her müşteri **kendi** repo kopyasını alır — böylece bir müşteride yapılan
tema değişikliği diğerlerini etkilemez.

```bash
# Şablonu klonla, geçmişi sıfırla
git clone <cafe-infra-repo-url> musteri-adi-site
cd musteri-adi-site
rm -rf .git
git init
git add -A
git commit -m "chore: musteri-adi icin ilk kurulum"

# Kendi Git sunucunuza / GitHub'a gönderin
git remote add origin git@github.com:<hesap>/musteri-adi-site.git
git push -u origin main
```

**Bu müşteri için özelleştirilecekler:**

| Ne | Nerede |
|---|---|
| Tema | `NEXT_PUBLIC_THEME` (env) veya panelden seçim |
| Renkler | Panelden (`/admin/tema`) — kod değişikliği gerekmez |
| İçerik | Panelden — kod değişikliği gerekmez |
| Örnek seed içeriği | `scripts/seed.ts` (isteğe bağlı; müşteri zaten panelden değiştirebilir) |

---

## 2. DNS (2 dk)

Domain sağlayıcısında **A kaydı** oluşturun:

```
Tip   Ad    Değer
A     @     <sunucu-ip>
A     www   <sunucu-ip>
```

TTL'i düşük tutun (300 sn). Yayılmayı kontrol edin:

```bash
dig +short ornek-kafe.com
```

> Coolify'ın Traefik'i Let's Encrypt sertifikasını DNS doğru yayıldıktan sonra alır.
> DNS hazır değilken deploy ederseniz sertifika hata verir; DNS'i bekleyin.

---

## 3. Coolify'da uygulama oluştur (3 dk)

1. Coolify panelinde **+ New** → **Application**
2. Kaynak: **Public/Private Repository** → repo URL'sini girin
3. Branch: `main`
4. Build Pack: **Dockerfile**
5. Dockerfile yolu: `./Dockerfile`
6. **Port**: `3000`  (Traefik bu porta yönlendirecek)
7. Kaydet — henüz deploy etmeyin.

---

## 4. Persistent volume (1 dk)

> **En kritik adım.** Bunu atlarsanız her deploy'da müşterinin tüm verisi silinir.

Uygulama → **Storages** → **+ Add**:

| Alan | Değer |
|---|---|
| Name | `cafe-data` |
| Source (volume adı) | `cafe_data_<musteri>` |
| Destination (mount path) | `/data` |

`/data` altında hem `app.db` (SQLite) hem `uploads/` (görseller) tutulur.

---

## 5. Ortam değişkenleri (3 dk)

Uygulama → **Environment Variables**. `.env.example` referanstır.

**Zorunlu:**

```bash
NEXT_PUBLIC_APP_URL=https://ornek-kafe.com
BETTER_AUTH_URL=https://ornek-kafe.com
BETTER_AUTH_SECRET=<openssl rand -base64 32 ciktisi>

ADMIN_EMAIL=isletme@ornek-kafe.com
ADMIN_PASSWORD=<gecici-guclu-sifre>
ADMIN_NAME=Ahmet Yilmaz

DATABASE_PATH=/data/app.db
UPLOADS_DIR=/data/uploads
```

> `BETTER_AUTH_SECRET` **her müşteri için farklı** olmalı:
> ```bash
> openssl rand -base64 32
> ```

**Opsiyonel:**

```bash
# Temayı bu imaja sabitle (boş bırakılırsa müşteri panelden seçer)
NEXT_PUBLIC_THEME=placeholder

# Sitenin varsayılan dili (tr | en | es | de | ar). Kapatılamaz.
# Diğer dilleri müşteri /admin/diller sayfasından açar.
NEXT_PUBLIC_DEFAULT_LOCALE=tr

# İletişim formu limiti (IP başına / saat)
CONTACT_RATE_LIMIT_PER_HOUR=5

# Mesajlar ayrıca mail olarak da gelsin (boşsa sadece panelde görünür)
SMTP_HOST=smtp.eu.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@mg.ornek-kafe.com
SMTP_PASSWORD=<sifre>
SMTP_FROM=site@ornek-kafe.com
CONTACT_TO_EMAIL=isletme@ornek-kafe.com

# Her açılışta seed çalışsın mı (idempotent — mevcut veriyi ezmez)
RUN_SEED=true
```

> **Not:** `NEXT_PUBLIC_*` değişkenleri **build sırasında** gömülür.
> `NEXT_PUBLIC_THEME` veya `NEXT_PUBLIC_APP_URL` değiştirirseniz **yeniden deploy** gerekir.
> Coolify'da bu değişkenleri "Build Variable" olarak da işaretleyin.

---

## 6. Domain + HTTPS (1 dk)

Uygulama → **Domains**:

```
https://ornek-kafe.com
```

- Coolify Traefik etiketlerini ve Let's Encrypt sertifikasını otomatik ayarlar.
- `www` → apex yönlendirmesi istiyorsanız ikinci domain olarak `https://www.ornek-kafe.com` ekleyin.
- **Force HTTPS** açık olsun.

> Traefik reverse proxy arkasında olduğumuz için gerçek istemci IP'si
> `X-Forwarded-For` başlığından okunur (rate limit bunu kullanır). Coolify
> varsayılan olarak bu başlığı gönderir; ekstra ayar gerekmez.

---

## 7. Deploy (2 dk)

**Deploy** butonuna basın. Log'da sırayla şunları görmelisiniz:

```
[entrypoint] Migration'lar uygulaniyor...
[migrate] Tamamlandi -> /data/app.db
[entrypoint] Seed calistiriliyor...
[seed] site_settings olusturuldu.
[seed] Admin kullanici olusturuldu: isletme@ornek-kafe.com
[entrypoint] Uygulama baslatiliyor...
   ▲ Next.js 15.5.x
   - Local: http://0.0.0.0:3000
```

Doğrulama:

```bash
curl -fsS https://ornek-kafe.com/api/health
# {"status":"ok","time":"..."}

curl -fsS https://ornek-kafe.com/robots.txt
curl -fsS https://ornek-kafe.com/sitemap.xml
```

Coolify'daki healthcheck göstergesi yeşil olmalı.

---

## 8. İlk giriş ve şifre değişimi (1 dk)

1. `https://ornek-kafe.com/admin` adresine gidin
2. `ADMIN_EMAIL` + `ADMIN_PASSWORD` ile girin
3. Sistem sizi **zorunlu olarak** şifre değiştirme ekranına yönlendirir
4. Kalıcı şifreyi belirleyin

> Şifre değiştikten sonra `.env`'deki `ADMIN_PASSWORD` artık kullanılmaz
> (kullanıcı zaten var olduğu için seed onu yok sayar). İsterseniz env'den silin.

Ardından hızlıca kontrol edin:

- **Genel Bilgiler** → işletme adı, adres, telefon, koordinat, logo, kapak görseli
- **Çalışma Saatleri** → 7 gün
- **Menü** → seed'den gelen örnek kategorileri silin veya düzenleyin
- **Tema & Renkler** → marka renklerini ayarlayın
- **Diller & Çeviriler** → müşteri birden fazla dil istiyorsa açın ve çevirileri girin

---

## 9. Yedekleme cron'u (2 dk)

Sunucuda (host tarafında) günlük yedek:

```bash
sudo crontab -e
```

```cron
# Her gece 03:30'da yedek al, 14 günden eskileri sil
30 3 * * * docker exec <container-adi> /app/scripts/backup.sh >> /var/log/cafe-backup.log 2>&1
```

Container adını bulmak için:

```bash
docker ps --format '{{.Names}}' | grep -i <musteri>
```

Yedekleri sunucu dışına da kopyalamak isterseniz (önerilir):

```cron
0 4 * * * rsync -az /var/lib/docker/volumes/cafe_data_<musteri>/_data/ yedek@backup-host:/yedekler/<musteri>/
```

**Manuel yedek / geri yükleme:**

```bash
# Yedek al
docker exec <container> /app/scripts/backup.sh

# Geri yükle
docker compose down
docker run --rm -v cafe_data_<musteri>:/data -v $PWD/yedek:/yedek alpine \
  sh -c "cp /yedek/app.db /data/app.db && rm -f /data/app.db-wal /data/app.db-shm && tar -xzf /yedek/uploads.tar.gz -C /data"
docker compose up -d
```

---

## 10. Teslim

Müşteriye gönderin:

- Site adresi: `https://ornek-kafe.com`
- Panel adresi: `https://ornek-kafe.com/admin`
- E-posta + belirlediği şifre
- **[CUSTOMER.md](./CUSTOMER.md)** kılavuzu (PDF'e çevirip göndermek iyi olur)

---

## Docker Compose ile (Coolify olmadan)

Sunucuya doğrudan kurmak isterseniz:

```bash
git clone <repo> /opt/musteri-site && cd /opt/musteri-site
cp .env.example .env && nano .env      # değerleri doldurun
docker compose up -d --build
docker compose logs -f web
```

Traefik'i kendiniz yönetiyorsanız `docker-compose.yml` içindeki `ports:` bloğunu
kaldırıp Traefik etiketlerini ekleyin:

```yaml
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.cafe.rule=Host(`ornek-kafe.com`)"
      - "traefik.http.routers.cafe.entrypoints=websecure"
      - "traefik.http.routers.cafe.tls.certresolver=letsencrypt"
      - "traefik.http.services.cafe.loadbalancer.server.port=3000"
```

---

## Sorun giderme

| Belirti | Sebep / çözüm |
|---|---|
| Deploy sonrası içerik sıfırlandı | `/data` volume'ü tanımlanmamış. Adım 4'ü tekrarlayın |
| `/admin` sürekli giriş sayfasına atıyor | `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` gerçek domain ile aynı değil (HTTPS dahil) |
| Sertifika hatası | DNS henüz yayılmamış. `dig +short domain` ile kontrol edip tekrar deploy edin |
| Healthcheck kırmızı | `docker logs <container>`; genellikle `/data` yazma izni ya da eksik `BETTER_AUTH_SECRET` |
| `BETTER_AUTH_SECRET tanimli degil` hatası | Production'da bu değişken zorunlu; en az 16 karakter olmalı |
| Görseller 404 | `UPLOADS_DIR=/data/uploads` ve volume mount'unu kontrol edin |
| Tema değişmiyor | `NEXT_PUBLIC_THEME` dolu → tema imaja sabit. Boşaltıp yeniden deploy edin |
| `/en` açılmıyor, `/tr`'ye atıyor | O dil panelde açık değil. `/admin/diller` → dili işaretleyip kaydedin |
| Varsayılan dil yanlış | `NEXT_PUBLIC_DEFAULT_LOCALE` build'e gömülür — değiştirip **yeniden deploy** edin |
| Mesaj mail'i gelmiyor | SMTP env'leri eksik/yanlış. Mesaj yine de panelde görünür; log'a bakın |
| Form "çok fazla mesaj" diyor | Rate limit. `CONTACT_RATE_LIMIT_PER_HOUR` değerini artırın |

---

## Güncelleme (şablonda iyileştirme yaptıktan sonra)

```bash
cd musteri-site
git remote add upstream <cafe-infra-repo-url>   # bir kez
git fetch upstream
git merge upstream/main                          # çakışmaları çözün
git push
# Coolify → Redeploy
```

Şema değiştiyse yeni migration dosyası repo'da gelir ve container açılışında
otomatik uygulanır. **Önce yedek alın.**
