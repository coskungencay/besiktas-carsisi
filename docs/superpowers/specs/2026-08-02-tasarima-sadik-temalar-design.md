# Tasarıma sadık temalar — tasarım dokümanı

**Tarih:** 2026-08-02
**Durum:** Onaylandı (bölüm 1 kullanıcı onayı ile; kalan bölümler "kendi kararını ver" yetkisiyle)

---

## Problem

9 tema var ama hepsi aynı siteye benziyor. Sebep iki kademeli düzleşme:

1. **Tasarım → kod adımı kayıplı.** `design-input/designs/*/Hero.jsx` dosyalarının
   sekizi de aynı iskelette: `h1={content.name}`, aynı ikili CTA, aynı görsel oranı.
   Tasarımın özgün başlığı (`"Beyaz bir oda, siyah bir kahve."`) `tagline` slotuna
   sıkışmış; nav, koordinat satırı, indeks işareti, stat bloğu hiç aktarılmamış.
2. **Tema katmanı bir kez daha sıkıştırmış.** 9 tema 5 paylaşılan hero düzenini
   kullanıyor; `About/Menu/Gallery/Contact` dokuz temada da birebir aynı bileşen.
   Tema pratikte sadece `tokens.css` = renk + font + radius.

Ek olarak veri modeli tasarımın istediği alanları taşımıyor (hero başlığı `name`'den
ayrı değil, stat satırları yok) ve sayfada header/nav hiç yok.

## Hedef

Sekiz tasarım, tasarıma **sadık** biçimde kodlanmış olarak bu repoda dursun. Müşteri
işine başlarken bir temayı seçip yeni repo açalım; müşteri panelden **sadece renkleri**
değiştirebilsin, tema seçemesin.

## Kapsam

Bu spec: **yeni mimari + `beyaz-oda` pilot teması + müşteri repo komutu**.
Kalan 7 temanın tasarıma sadık yeniden yazımı ayrı turlarda; bu turda yalnızca
klasör bağımsızlığı kazanırlar (görsel olarak bugünkü halleri korunur).

## Kararlar (kullanıcı onaylı)

| Konu | Karar |
|---|---|
| Sadakat ölçütü | Tasarımın görsel diline sadık; piksel eşitliği şart değil. Responsive davranışı biz kurgularız (tasarımda yok). |
| Referans kaynak | Design uygulamasının **Project HTML** export'u. Gelmediyse ekran görüntüsü + mevcut token'lar. |
| İçerik | Sınırlı sayıda yeni standart alan (hero başlık/alt satır, en çok 4 "öne çıkan" satırı), hepsi panelden düzenlenir ve çevrilir. |
| Bölümler | Tema kendi bölüm listesini ve sırasını verir; header/footer de temaya ait. |
| Paylaşım | "Headless" ortak katman: yalnızca mantık paylaşılır, hiçbir görsel karar paylaşılmaz. |
| Fork stratejisi | Müşteri repo'su şablonu `upstream` remote olarak tutar; düzeltmeler cherry-pick ile akar. |
| Tema seçimi | Müşteri repo'sunda `NEXT_PUBLIC_THEME` pinlenir, panelde seçici gizlenir; renk formu kalır. |

---

## 1. Tema sözleşmesi

`src/themes/types.ts`:

```ts
type ThemeSection = { id: string; Component: ComponentType<SectionProps> };

type ThemeDefinition = {
  name; description; scheme; tokensPath; defaultColors;  // değişmedi
  Header?: ComponentType<SectionProps>;
  sections: ThemeSection[];   // sıra ve sayı temanın kararı
  Footer?: ComponentType<SectionProps>;
};
```

- Sabit `SECTION_ORDER` ve `SectionKey` kalkar.
- `src/app/[locale]/page.tsx` yalnızca `Header → sections.map → Footer` render eder.
  JSON-LD, skip-link ve dil seçici sayfada kalır (tema bağımsız, SEO/erişilebilirlik).
- `section.id` HTML anchor'ı olur; temanın kendi nav'ı bu id'lere bağlanır.

**Neden:** Tasarımlar farklı sayıda ve sırada bölüm istiyor; sabit beşli sözleşme
sadakatin önündeki tek yapısal engeldi.

## 2. Dosya yapısı

```
src/themes/
├── _shared/            # SADECE mantık — görsel karar yok
│   ├── data.ts         # groupMenu, todayIndex, imageOrFallback, hasContent…
│   ├── contact.ts      # useContactForm() — durum/hata/pending, işaretleme yok
│   └── icons.tsx       # currentColor ile çizilmiş ikonlar
└── <slug>/
    ├── index.ts        # ThemeDefinition
    ├── tokens.css      # tek görsel kaynak
    └── sections/       # Header.tsx, Hero.tsx, … temaya özel
```

- `src/themes/shared/*` **silinir** (ikinci turda tamamlandı — aşağıdaki nota bakın).

  > **Uygulama sırasında değişen karar.** Spec başta bu klasörün silinmesini
  > öngörüyordu. Ama kalan 7 tema bu bileşenleri kullanıyor; silmek için her
  > temaya birer kopya koymak gerekirdi — 42 dosyalık, birkaç hafta içinde
  > yeniden yazılacak ölü tekrar. Bunun yerine klasörün her dosyasına "yeni tema
  > yazarken kullanmayın" başlığı eklendi. Bir tema tasarımına göre yeniden
  > yazıldıkça legacy bağımlılığı azalır; son tema da kurtulduğunda klasör
  > silinir. `pnpm new:customer` zaten kalan tema legacy kod kullanmıyorsa
  > klasörü müşteri repo'sundan otomatik kaldırıyor.
- Her tema klasörü kendi kendine yeter: dışarıdan yalnızca `@/themes/_shared/*`,
  `@/i18n`, `@/components/motion` ve `@/themes/types` import eder. Bu kural, müşteri
  repo komutunun bir temayı bırakıp diğerlerini silebilmesinin ön koşuludur.
- `placeholder` teması korunur (tema pinlenmediğinde fallback, yeni tema için başlangıç
  noktası); bugünkü ortak bileşenlerin kopyasıyla kendi kendine yeter hale gelir.

## 3. İçerik modeli

`site_settings` tablosuna üç sütun:

| Sütun | Tip | Anlam |
|---|---|---|
| `hero_headline` | TEXT `""` | Hero'daki büyük başlık. Boşsa `name` kullanılır. |
| `hero_subline` | TEXT `""` | Başlığın soluk devamı (örn. "Fazlası yok."). |
| `highlights` | JSON `[]` | En çok 4 adet `{label, value}` (örn. `SAAT` / `08–18`). |

- `SiteContent` üç yeni alan kazanır: `heroHeadline` (fallback uygulanmış),
  `heroSubline`, `highlights`.
- **Çeviri:** `heroHeadline`/`heroSubline` mevcut `settings` namespace'ine iki yeni
  alan olarak girer (translations tablosu polimorfik — migration gerekmez).
  `highlights` için yeni namespace `highlight`, `refId` = dizideki sıra (0-3),
  `field` = `label` | `value`.
- **Admin:** Genel Bilgiler formuna iki metin alanı + 4 sabit `label/value` satırı.
  Boş satırlar kaydedilirken atılır. Diller sayfası bu alanları otomatik listeler.
- Koordinat, çalışma saatleri, adres gibi türetilebilir veriler **yeni alan almaz**;
  tema bunları mevcut `contact`/`openingHours` verisinden okur.

**Neden bu kadar az alan:** Her tasarımın süsünü ayrı alan yapmak admin panelini
tema başına değişken forma zorlardı (reddedilen seçenek). Üç alan, sekiz tasarımın
ortak paydası; geri kalanı ya türetilir ya tema metnidir.

## 4. Pilot tema: beyaz-oda

Tasarım: üstte ince header (marka / koordinat / nav), hero'da sol kenarda indeks
işareti + iki satırlık büyük başlık + soluk alt satır, ince ayraç, altında üç kolon
(hakkında metni / highlights / adres bağlantısı), en altta tam genişlik görsel bandı.
Devamında About, Menu, Gallery, Contact bölümleri aynı editoryal ızgara ve
monospace detay diliyle.

- Görsel kimlik `tokens.css`'ten okunur; bileşenlerde sabit renk/font **yasak**.
- Responsive: header mobilde tek satıra iner, üç kolon tek kolona yığılır, tipografi
  `clamp()` ile ölçeklenir.
- RTL: yalnızca `ms/me`, `ps/pe`, `start/end` mantıksal sınıfları kullanılır.
- Arapça'da monospace gövde yazısı kırıldığı için mevcut `html[lang="ar"]` istisnası
  korunur.

## 5. Müşteri repo komutu

`pnpm new:customer --theme=<slug> [--name="Müşteri Adı"] [--dry-run]`

1. `--theme` geçerli mi, temiz çalışma ağacı var mı kontrol eder.
2. Seçilen tema dışındaki tema klasörlerini siler.
3. `src/themes/registry.ts` ve `src/app/globals.css` import satırlarını kalan temaya
   göre yeniden yazar.
4. `.env.example` içine `NEXT_PUBLIC_THEME=<slug>` yazar.
5. `design-input/` içeriğini temizler.
6. Ne yapacağını önce özet olarak basar; `--dry-run` ile hiçbir şeye dokunmaz.

Komut **kopya repoda** çalıştırılmak üzere tasarlanır; şablon repoda yanlışlıkla
çalıştırılmaya karşı onay ister.

## 6. Doğrulama

- `pnpm typecheck && pnpm lint && pnpm build` temiz geçer.
- Dev sunucuda `beyaz-oda` pinlenip `/tr`, `/en`, `/ar` sayfaları Playwright ile
  masaüstü ve mobil genişlikte açılır; ekran görüntüsü tasarımla karşılaştırılır.
- Sınır durumları elle sınanır: menü boş, galeri boş, hero görseli yok, çok uzun
  işletme adı, `highlights` boş, tek dil açık, Arapça RTL.
- `new:customer` komutu `--dry-run` ile ve tek kullanımlık bir kopyada denenir.

## Uygulama sonrası notlar (2026-08-02)

- **Pilot tema kısmen kör yazıldı.** Design'ın Project HTML export'u iş sırasında
  elimize ulaşmadı; `beyaz-oda` ekran görüntüsündeki 1. sayfaya (header, hero,
  künye satırları, adres bağlantısı, görsel bandı) sadık biçimde yazıldı. Kalan
  bölümler (About, Menu, Gallery, Contact) aynı görsel dilde — editoryal ızgara,
  monospace künye, ince ayraç, bölüm indeksi — kurgulandı. **Export gelince bu
  dört bölüm tasarımla karşılaştırılıp revize edilmeli.**
- **Nav ve bölüm görünürlüğü aynı koşula bağlı.** Bölümler içerik boşken kendini
  basmıyor; header'daki bağlantılar da aynı koşulla gizleniyor, yoksa kırık çapa
  kalıyordu.
- **Dil seçici temanın işi.** Kendi header'ı olan tema dil seçiciyi kendi basar;
  header'ı olmayan temalar için sayfa sağ üst köşeye koyar. Aksi halde yeni
  header ile üst üste biniyordu.
- **Doğrulama tuzağı:** `Reveal` bileşeni viewport'a girince açıldığı için tam
  sayfa (fullPage) ekran görüntüsünde bölümler boş çıkıyor. Bölüm doğrulaması
  viewport ekran görüntüsüyle yapılmalı.

## İkinci tur: kalan 8 tema (2026-08-02)

Pilotun ardından `mera`, `patika`, `yesil-avlu`, `kirk-yil`, `vela`, `tesviye`,
`sicak-firin` ve `placeholder` da kendi bölümlerine kavuştu. 7 tema paralel
ajanlarla yazıldı (her ajan yalnızca kendi tema klasörüne), ardından her tema
bağımsız bir denetim ajanından geçti; `placeholder` elle taşındı.

Sonuç: `src/themes/shared/` ve `src/components/site/ContactForm.tsx` **silindi** —
artık hiçbir tema ortak bir bölüm bileşeni kullanmıyor. `new:customer` komutundaki
legacy temizleme mantığı da ölü kod olduğu için kaldırıldı.

Her temaya verilen düzen kimlikleri THEMING.md'de tablo hâlinde duruyor. Kimlikler
Design export'u hâlâ gelmediği için `tokens.css` (font/ağırlık/radius/tracking) ve
tema açıklamalarından türetildi — yani "orijinal tasarıma birebir sadık" değil,
"temanın görsel kimliğine sadık ve birbirinden gerçekten farklı". Export geldiğinde
tema tema karşılaştırılmalı.

Elle yakalanan ve düzeltilen üç sorun:
- `patika` ve `tesviye` hero başlıklarında çok sıkı `leading`, Türkçe'de `Ç`/`Ş`
  kuyruklarının alt satıra girmesine yol açıyordu.
- `placeholder`'ın hero CTA'sı menü boşken bile `#menu`'ye gidiyordu (kırık çapa).

## Kapsam dışı

- Kalan 7 temanın tasarıma sadık yeniden yazımı (ayrı turlar).
- Instagram/Google'dan otomatik içerik toplama (ayrı proje).
- Coolify provisioning otomasyonu.
