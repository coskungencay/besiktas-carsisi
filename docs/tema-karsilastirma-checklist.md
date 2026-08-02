# Tema ↔ tasarım karşılaştırma checklist'i

Bir temayı orijinal tasarımıyla hizalarken izlenecek yol. Kırk Yıl turunda
bulunan hataların hepsi buradaki bir maddeye karşılık geliyor — sırayla
uygulanırsa aynı hatalar tekrar etmez.

## 0. Yöntem (bunu atlamak en pahalı hata)

**Kodu okuyup "uyumlu görünüyor" demek yetmiyor.** İki sunucu da ayağa
kalkmalı ve ekranlar Playwright'ta yan yana konmalı:

```bash
# tasarımlar
cd ~/Downloads/coffee-concepts && python3 -m http.server 8080
# uygulama
pnpm dev
```

- Tasarım: `http://localhost:8080/<NN Tema Adı>.dc.html`
- Bizimki: `http://localhost:3000/tr` (panelden ilgili tema seçili)

Her iki sayfayı **1440 / 2000 / 390px** genişlikte aç, **tam sayfa** ve
**bölüm bölüm** ekran görüntüsü al.

> Bizim sayfada tam sayfa görüntü almadan önce `Reveal` bloklarını aç, yoksa
> scroll ile beliren bölümler boş çıkar:
> ```js
> document.querySelectorAll('[data-reveal]').forEach(el => {
>   el.style.opacity = '1'; el.style.transform = 'none';
> });
> ```

**İlk ölçüm: iki sayfanın toplam yüksekliği.** Kırk Yıl'da tasarım 3259px,
bizimki 7917px'di — 2.4 kat fark yapısal bir sorunun ilk işareti.

## 1. Tasarımın global stilleri

`.dc.html` içindeki `<style>` bloğunu **mutlaka** oku. Kırk Yıl'da
`a { color: #6E1F26 }` vardı: tasarımdaki tüm bağlantılar bordo, bizde ise
nav gri kalmıştı. Kolayca gözden kaçar çünkü inline style'larda görünmez.

- [ ] Global `a` rengi ve hover rengi
- [ ] `body` zemin rengi ve varsa doku (`background-image`)
- [ ] `@keyframes` listesi — hepsi temaya taşındı mı, hepsi kullanılıyor mu

## 2. Sayfa genişliği

- [ ] Tasarımda sayfa genelinde `max-width` **var mı?** (`grep -o 'max-width:[0-9]*px'`)
      Genelde YOKTUR: içerik ekranı doldurur, sadece kenar boşluğu bırakılır.
- [ ] Kenar boşluğu kaç px? (`padding: Xpx Ypx` — Y kenar boşluğudur)
- [ ] Bizim `--brand-container` ve kabuk `px-*` değerleri buna uyuyor mu?

## 3. Header

- [ ] Kaç kat? (Kırk Yıl'da tasarım tek şerit, bizde üç kat vardı)
- [ ] Hangi öğeler var: marka / semt / nav / telefon / saat?
- [ ] **Marka adı header'da var mı?** Bazı tasarımlarda marka adı hero'nun
      kendisidir; iki yerde göstermek tabelanın etkisini dağıtır.
- [ ] Nav bağlantılarının rengi, puntosu, harf aralığı

## 4. Bölüm zeminleri ve sıralama

- [ ] Hangi bölüm koyu, hangisi açık? (Kırk Yıl'da menü sayfanın tek koyu
      alanı; bizde açık zeminde kart içindeydi ve hiç ayrılmıyordu)
- [ ] Bölüm sırası tasarımdaki gibi mi?
- [ ] **İçerik doğru bölümde mi?** (Kırk Yıl'da çalışma saatleri tasarımda
      iletişimde, bizde hakkımızdanın ortasındaydı ve bölümü iki katına
      çıkarıyordu)

## 5. Görseller

- [ ] Oran **yatay mı dikey mi**? Tasarımda genelde sabit yükseklik verilir
      (`height:470px`); kolon genişliğine bölüp oranı çıkar.
- [ ] Çerçeve/iç boşluk/altyazı var mı?
- [ ] Koyu temada koyu yer tutucu kullanılıyor mu?

## 6. Tipografi (en çok gözden kaçan)

Her metin öğesi için tasarımdaki inline style'dan oku:

- [ ] `font-size` — clamp üst sınırı tasarımdaki değere yakın mı?
- [ ] `font-weight` — 300 mü 400 mü? (Kırk Yıl menüsünde ürünler 300)
- [ ] `letter-spacing`
- [ ] `line-height`
- [ ] **Renk** — özellikle vurgu rengi (altın/bordo) doğru öğede mi?

## 7. Vurgu öğeleri

- [ ] Tasarımda diziyi kıran bir öğe var mı? (Kırk Yıl'da üçüncü yorum kartı
      bordo dolu) Bu tür tekil vurgular tasarımın imzasıdır.
- [ ] Dekoratif öğeler: damga, rozet, ayraç motifi, kayan şerit, kroki

## 8. Izgara ve denge

- [ ] Kolon oranları (`grid-template-columns: 1.2fr .85fr .85fr`)
- [ ] Kolonlar **dengeli doluyor mu?** Kategoriler sırayla dizilince bir kolon
      yarım kalıyorsa elle bölmek gerekir.
- [ ] Alt bölümlerde (konum, iletişim, SSS) `max-w-*` sınırları sayfayı
      gereksiz daraltıyor mu?

## 9. Bizde olup tasarımda olmayanlar

Bunlar hata değil, bilinçli eklerimiz — ama yerleşimleri tasarımın diline
uymalı: S.S.S., ayrı Konum bölümü, iletişim formu, dil seçici, WhatsApp butonu.

## 10. Son kontroller

- [ ] 390px: dev başlık taşmıyor, mutlak konumlu öğe (damga/rozet) ekrandan
      çıkmıyor ve sabit WhatsApp butonuyla çakışmıyor
- [ ] Arapça (`/ar`): düzen aynalanıyor, harf aralığı sıfırlanıyor
- [ ] `pnpm typecheck && pnpm lint`
- [ ] `pnpm new:customer --theme=<slug>` ile açılan kopyada `build`
