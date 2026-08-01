# THEMING.md — Tema sistemi

Bu doküman iki soruyu yanıtlar:

1. **Yeni bir tema nasıl eklenir?** (çoğu durumda: bir CSS dosyası + iki satır kayıt)
2. **Yeni tasarım mevcut düzenlere uymuyorsa ne yapılır?**

---

## 1. Üç temel kural

> **1. Tema kodu asla veritabanına dokunmaz.**
> Tüm veri `SiteContent` tipinden gelir. `db`, `drizzle`, `getSettings()`, `fetch()` yok.

> **2. Tema içinde sabit renk / radius / font / harf aralığı yazılmaz.**
> Hepsi CSS değişkenlerinden gelir. Aksi halde admin panelindeki renk seçici çalışmaz.

> **3. Tema içinde sabit metin yazılmaz.**
> "Menü", "İletişim" gibi her yazı `content.t.*` sözlüğünden gelir. Aksi halde site 5 dilde çalışmaz.

```
DB ──► src/lib/content.ts ──► SiteContent ──► tema bölümleri
       (tek dönüşüm yeri)     (tek tip)       (sadece görsel iş)
```

---

## 2. Mimari: her tema kendi bölümlerini yazar

**Eski yaklaşım terk edildi.** Başlangıçta 4 bölüm (About/Menu/Gallery/Contact)
tüm temalarda ortak, hero ise 5 hazır düzenden biriydi. Sonuç: 9 tema aynı siteye
benziyordu, sadece rengi değişiyordu. Tasarımların özgün düzeni (kendi nav'ı, kendi
ızgarası, kendi bölüm sırası) bu ortak iskelete sığmıyordu.

Artık **bölümlerin sayısı ve sırası temanın kararı**:

```ts
const theme: ThemeDefinition = {
  Header,                      // opsiyonel — temanın kendi üst şeridi
  sections: [                  // sıra ve sayı serbest
    { id: "hero", Component: Hero },
    { id: "menu", Component: Menu },
  ],
  Footer,                      // opsiyonel
  tokensPath, defaultColors, name, description, scheme,
};
```

`src/app/[locale]/page.tsx` yalnızca `Header → sections → Footer` basar.
`section.id` HTML anchor'ıdır; temanın kendi nav'ı bu id'lere bağlanır.

### Neyi paylaşıyoruz, neyi paylaşmıyoruz

| Katman | İçerik | Kural |
|---|---|---|
| `src/themes/_shared/` | Menü gruplama, saat aralığı, koordinat biçimi, görsel fallback, `useContactForm` hook'u, ikonlar | **Sadece mantık.** Renk, ızgara, boşluk, sınıf adı buraya giremez |
| `src/themes/<slug>/` | Header, bölümler, footer, `tokens.css` | Görsel kararların tamamı |
| `src/themes/shared/` | **LEGACY** — henüz tasarımına göre yeniden yazılmamış temaların ortak iskeleti | Yeni tema burayı kullanmaz |

Örnek alınacak yapı: **`src/themes/beyaz-oda/`** — tasarımına göre yeniden
yazılmış ilk tema.

```
src/themes/
├── types.ts                     # SiteContent + ThemeDefinition sözleşmesi
├── registry.ts                  # Record<slug, ThemeDefinition>
├── _shared/                     # ORTAK MANTIK (görsel karar yok)
│   ├── data.ts                  #   menuWithItems, hoursRange, coordinateLabel…
│   ├── icons.tsx                #   currentColor ile çizilmiş ikonlar
│   └── useContactForm.ts        #   form mantığı — işaretleme yok
├── beyaz-oda/                   # YENİ YAPI: kendi bölümleri
│   ├── index.ts
│   ├── tokens.css
│   ├── parts.tsx                #   temaya özel küçük parçalar
│   └── sections/                #   Header, Hero, About, Menu, Gallery, Contact, Footer
├── shared/                      # LEGACY (aşağıdaki temalar hâlâ kullanıyor)
└── placeholder/ mera/ patika/ yesil-avlu/ kirk-yil/ vela/ tesviye/ sicak-firin/
```

### Bir temayı tasarımına göre yeniden yazmak

1. `src/themes/<slug>/sections/` klasörünü açın.
2. Bölümleri tek tek yazın; veri `SiteContent`ten, görsel `tokens.css`ten gelir.
3. `index.ts` içinde `sections` dizisini kendi bileşenlerinize çevirin, gerekiyorsa
   `Header`/`Footer` ekleyin.
4. Artık `@/themes/shared/*` import etmediğinizden emin olun — o tema legacy
   katmandan kurtulmuş olur.

---

## 3. Token seti

`tokens.css` içindeki her değişken, tasarımlar arasında gerçekten değişen bir şeydir:

| Token | Ne yapar | Örnek değerler |
|---|---|---|
| `--brand-primary` | Butonlar, vurgular, fiyatlar | `#A9502F` |
| `--brand-primary-contrast` | Ana renk üzerindeki yazı | `#FFFFFF` |
| `--brand-accent` | Rozet, hata metni | `#FF6B3D` |
| `--brand-surface` | Sayfa zemini | `#F2EFE7` |
| `--brand-surface-alt` | Kart / kutu zemini | `#E5E0D3` |
| `--brand-ink` | Ana metin | `#1A1714` |
| `--brand-ink-muted` | İkincil metin | `#6F675C` |
| `--brand-border` | Kenarlıklar | `#DDD6C8` |
| `--brand-font-display` | Başlık fontu | `Georgia, serif` |
| `--brand-font-body` | Gövde fontu | `system-ui, …` |
| `--brand-display-weight` | Başlık kalınlığı | `300` `400` `500` `900` |
| `--brand-eyebrow-tracking` | Küçük etiket harf aralığı | `0.24em` |
| `--brand-eyebrow-transform` | Etiket büyük harf mi | `uppercase` \| `none` |
| `--brand-radius` | Köşe yuvarlaklığı | `0rem` `1rem` `1.5rem` |
| `--brand-border-width` | Kenarlık kalınlığı | `1px` `2px` |
| `--brand-container` | İçerik genişliği | `1280px` |
| `--brand-section-py` / `-lg` | Bölüm dikey boşluğu | `4rem` / `6rem` |
| `color-scheme` | Tarayıcı form/scrollbar rengi | `light` \| `dark` |

### Yardımcı sınıflar

Tekrar eden token üçlüleri `globals.css` içinde `@utility` olarak tanımlı:

| Sınıf | Karşılığı |
|---|---|
| `brand-display` | `font-family: display` + `font-weight: display-weight` |
| `brand-body` | `font-family: body` |
| `brand-frame` | kenarlık (renk + kalınlık + stil) + radius |
| `brand-rounded` | sadece radius |
| `brand-eyebrow` | harf aralığı + büyük harf |
| `brand-section` | bölüm dikey boşluğu (responsive) |

---

## 4. Yeni tema ekleme

Yeni tasarımı temaya çevirirken izlenecek yol.

### Adım 0 — Ham tasarımı `design-input/` içine koyun

Format ve brief önerileri: [`design-input/README.md`](./design-input/README.md).
Claude Design kullanıyorsanız **Share → Export → Project HTML** çıktısı en
güvenilir kaynaktır: gerçek boşluk/ölçü değerleri kodda gelir.

### Adım 1 — Klasörü açın

```bash
mkdir -p src/themes/yeni-tema/sections
cp src/themes/beyaz-oda/tokens.css src/themes/yeni-tema/tokens.css
```

`tokens.css` içinde seçiciyi ve değerleri değiştirin:

```css
html[data-theme="yeni-tema"] {
  color-scheme: light;
  --brand-primary: #2F4F4F;
  /* … 8 renk, 3 tipografi, 2 etiket, 2 biçim, 3 ölçek token'ı … */
}
```

> ⚠️ **Seçici `html[data-theme="…"]` olmalı**, sadece `[data-theme="…"]` değil.
> `:root` fallback bloğuyla aynı özgüllükte olursa dosya sırası yüzünden tema
> hiç uygulanmaz. (Bu hata bir kez yaşandı: 9 tema da aynı görünüyordu.)

### Adım 2 — Bölümleri yazın

`src/themes/yeni-tema/sections/` altına tasarımın bölümlerini yazın. Örnek
alınacak tema: `src/themes/beyaz-oda/sections/`.

- Veri **yalnızca** `content` (`SiteContent`) üzerinden gelir.
- Tekrar eden mantık için `@/themes/_shared/data` (menü gruplama, saat aralığı,
  koordinat, görsel fallback) ve `@/themes/_shared/icons`.
- İletişim formu için `@/themes/_shared/useContactForm` — işaretlemeyi siz yazarsınız.

### Adım 3 — `index.ts`

```ts
import type { ThemeDefinition } from "@/themes/types";
import Header from "@/themes/yeni-tema/sections/Header";
import Hero from "@/themes/yeni-tema/sections/Hero";
/* … */

const theme: ThemeDefinition = {
  name: "Yeni Tema",
  description: "Panelde görünecek tek cümlelik açıklama.",
  scheme: "light",
  Header,
  sections: [
    { id: "hero", Component: Hero },
    /* tasarımın istediği sıra ve sayı */
  ],
  Footer,
  tokensPath: "src/themes/yeni-tema/tokens.css",
  // tokens.css'teki 8 renkle AYNI olmalı — panel bunları okur
  defaultColors: {
    "--brand-primary": "#2F4F4F",
    /* … 8 renk … */
  },
};

export default theme;
```

> **`defaultColors` neden var?** Admin panelindeki renk seçici, müşteri henüz
> renk seçmemişken hangi değerleri göstereceğini bilmek zorunda. Bu olmadan tema
> değiştirildiğinde form önceki temanın renklerini kaydeder ve yeni temanın
> paletini ezer (açık temadan koyuya geçişte site okunamaz hale gelir).
> **tokens.css ile senkron tutun.**

### Adım 4 — İki satır kayıt

```css
/* src/app/globals.css — diğer import'ların altına */
@import "../themes/yeni-tema/tokens.css";
```

```ts
// src/themes/registry.ts
import yeniTema from "./yeni-tema";
export const themeRegistry = { …, "yeni-tema": yeniTema };
```

### Adım 5 — Test

```bash
pnpm dev            # /admin/tema → yeni temayı seç → / adresine bak
pnpm lint && pnpm typecheck && pnpm build
```

Sınır durumlarını mutlaka deneyin: menü boş, galeri boş, hero görseli yok, çok
uzun işletme adı, tek dil, Arapça (RTL).

> Bölümü içerik boşken gizliyorsanız (örn. galeri yoksa `return null`), temanın
> nav'ındaki bağlantıyı da aynı koşulla gizleyin — yoksa hiçbir yere gitmeyen
> kırık bir çapa kalır.

---

## 5. Müşteri repo'su: temayı pinlemek

Müşteri işine başlarken bu şablonun bir kopyasını alır, seçtiğimiz temayı bırakır,
kalanları sileriz:

```bash
pnpm new:customer --theme=beyaz-oda --dry-run   # ne yapacağını gösterir
pnpm new:customer --theme=beyaz-oda             # onay sorar, sonra uygular
```

Komut şunları yapar: diğer tema klasörlerini siler, `registry.ts` ve
`globals.css` import'larını tek temaya indirir, `.env.example` içine
`NEXT_PUBLIC_THEME=<slug>` yazar, kalan tema legacy ortak kodu kullanmıyorsa
`src/themes/shared/` klasörünü de kaldırır.

`NEXT_PUBLIC_THEME` dolu olduğunda panelde tema seçici **hiç görünmez** ve sunucu
tarafı tema değişikliğini reddeder — müşteri yalnızca renkleri değiştirebilir.

> Şablon repoda çalıştırmayın. Komut geri alınamaz; önce `--dry-run` ile bakın.

Müşteri repo'su şablonu `upstream` remote olarak tutar; şablonda kritik bir
düzeltme olduğunda `git cherry-pick` ile o repoya taşınabilir.

---

## 6. Bölüm yazma / değiştirme checklist'i

Bu bölüm yalnızca **paylaşılan bir bölümü değiştirirken** veya yeni bir hero
düzeni yazarken gerekir.

### A. Markup

- [ ] `class` → `className`, `for` → `htmlFor`, kendiliğinden kapanan etiketler
- [ ] Semantik etiketler: `<section>`, `<ul>/<li>`, `<dl>/<dt>/<dd>`, `<figure>`
- [ ] Bölüm id'leri sabit: `hero`, `hakkimizda`, `menu`, `galeri`, `iletisim`
- [ ] `aria-labelledby` + başlık id'si
- [ ] Sayfada **tek `<h1>`** (Hero'da), bölüm başlıkları `<h2>`

### B. Veriye bağlama

| Tasarımdaki | Yerine |
|---|---|
| "Coffee House" | `{content.name}` |
| Slogan | `{content.tagline}` |
| Lorem paragraf | `content.about` (`\n\n` ile bölün) |
| "Alaçatı / İzmir" | `{content.contact.locality}` (adresin son parçası) |
| Menü ürünleri | `content.menu.map(...)` |
| Galeri | `content.gallery.map(...)` |
| Saat tablosu | `content.openingHours.map(...)` |
| Form | `<ContactForm locale={content.locale} messages={content.t} />` |

**Boş veri her zaman mümkün.** Yeni kurulan sitede galeri boş, logo yok,
telefon girilmemiş olabilir:

```tsx
if (images.length === 0) return null;
{content.tagline ? <p>{content.tagline}</p> : null}
<Image src={content.heroImageUrl || HERO_FALLBACK} … />
```

### C. Metinleri sözlüğe taşıma (5 dil)

- [ ] Her arayüz yazısı `content.t.*` ile:
      ```tsx
      <h2>{t.menu.title}</h2>
      <a href="#menu">{t.hero.viewMenu}</a>
      ```
- [ ] Kalıplı metinler `fill` ile:
      ```tsx
      import { fill } from "@/i18n";
      <p>{fill(t.contact.intro, { name: content.name })}</p>
      ```
- [ ] Yeni anahtar gerekiyorsa **önce `src/i18n/messages/tr.ts`'e** ekleyin —
      TypeScript diğer 4 dilin eksik olduğunu derleme anında söyler.
- [ ] Doğrulayın:
      ```bash
      grep -rnE '>[^<>{}]*[çğıöşüÇĞİÖŞÜ][^<>{}]*<' src/themes/shared/
      ```

### D. Token'a çevirme

- [ ] Sabit hex → `var(--brand-*)`; Tailwind ile `bg-[var(--brand-surface)]`
- [ ] `rounded-2xl` → `brand-rounded` / `brand-frame`
- [ ] `border` / `border-2` → `brand-frame`
- [ ] `font-light` + `font-[family-name:…]` → `brand-display`
- [ ] `tracking-[0.24em] uppercase` → `brand-eyebrow`
- [ ] Yarı saydamlar `color-mix` ile:
      `bg-[color-mix(in_srgb,var(--brand-surface)_78%,transparent)]`
- [ ] Doğrulayın — hiç hex kalmamalı:
      ```bash
      grep -rn "#[0-9a-fA-F]\{3,6\}" src/themes/shared/
      ```

### E. Görseller

- [ ] `<img>` yerine `next/image`; `sizes` mutlaka doğru
- [ ] **Harici URL yok.** Yer tutucu: `/placeholders/hero.svg`
- [ ] Hero görseline `priority`, diğerlerine hayır
- [ ] Listelerde `thumbUrl`, tam boyda `url`
- [ ] Dekoratif görsel: `alt=""` + `aria-hidden="true"`

### F. Animasyon

- [ ] Kendi motion kodunuz yerine hazır sarmalayıcı:
      ```tsx
      import { Reveal } from "@/components/motion/Reveal";
      <Reveal delay={0.1}>…</Reveal>
      <Reveal as="li" key={item.id}>…</Reveal>
      ```
      `prefers-reduced-motion` açıkken animasyon tamamen kapanır; JavaScript
      kapalıyken `<noscript>` kuralı içeriği görünür yapar.
- [ ] CSS hover efektlerine `motion-reduce:` varyantı ekleyin

### G. RTL (Arapça)

- [ ] Yön bağımlı sınıfları mantıksal olanlarla değiştirin:

      | Kullanmayın | Kullanın |
      |---|---|
      | `ml-2` / `mr-2` | `ms-2` / `me-2` |
      | `pl-4` / `pr-4` | `ps-4` / `pe-4` |
      | `left-0` / `right-0` | `start-0` / `end-0` |
      | `text-left` / `text-right` | `text-start` / `text-end` |
      | `border-l` / `border-r` | `border-s` / `border-e` |
      | CSS `left:` / `right:` | `inset-inline-start/end:` |

- [ ] Soldan sağa kalması gerekenlere `dir="ltr"`: telefon, saat aralığı, e-posta, URL
- [ ] Yön bağımlı ikonlara `rtl:-scale-x-100`
- [ ] **Temanız monospace font kullanıyorsa** `tokens.css`'e Arapça istisnası ekleyin —
      monospace yığınlar Arapça'da bitişik yazıyı koparır:
      ```css
      html[lang="ar"][data-theme="<slug>"] {
        --brand-font-body: system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif;
      }
      ```
      (Harf aralığı zaten `html[lang="ar"]` ile global olarak sıfırlanır.)

---

## 7. Bitirmeden önce

```bash
pnpm lint && pnpm tsc --noEmit && pnpm build
```

- [ ] **Boş veri:** panelden galeriyi ve menüyü boşaltın — sayfa bozulmamalı
- [ ] **Renk:** `/admin/tema`'dan ana rengi değiştirin — değişmeyen yer kalmamalı
- [ ] **Tema geçişi:** başka temaya geçin, sonra geri dönün — palet doğru gelmeli
- [ ] **Dil:** `/en`, `/es`, `/de` — Türkçe kalmış arayüz metni olmamalı
- [ ] **RTL:** `/ar` — düzen aynalanmalı, yatay kaydırma olmamalı, telefon LTR kalmalı
- [ ] **Mobil:** 360px genişlikte yatay kaydırma yok
- [ ] **Klavye:** Tab ile gezin, odak halkası her yerde görünür
- [ ] **Reduced motion:** işletim sisteminden açıp yenileyin — hiçbir şey hareket etmemeli
- [ ] **JS kapalı:** içerik görünür kalmalı
- [ ] **Lighthouse:** Performance / A11y / Best Practices / SEO ≥ 95

---

## 8. Sık yapılan hatalar

| Hata | Sonuç | Doğrusu |
|---|---|---|
| `[data-theme="x"]` (html'siz) | Tema hiç uygulanmaz, hepsi aynı görünür | `html[data-theme="x"]` |
| `globals.css`'e import eklememek | Tema renksiz | `@import "../themes/<slug>/tokens.css";` |
| `defaultColors` ≠ `tokens.css` | Panelde yanlış renk, tema geçişinde palet bozulur | İkisini senkron tutun |
| Bölümde sabit hex | Panelden renk değişmez | `var(--brand-*)` |
| Bölümde sabit Türkçe metin | Site 5 dilde çalışmaz | `content.t.*` |
| `ml-2`, `text-left`, `left-0` | Arapça'da düzen bozulur | `ms-2`, `text-start`, `start-0` |
| Telefona `dir="ltr"` vermemek | Arapça'da numara ters okunur | `<a dir="ltr">` |
| Monospace tema + Arapça istisnası yok | Arapça harfler kopuk görünür | `html[lang="ar"][data-theme="…"]` bloğu |
| Boş veri kontrolü yok | Yeni sitede sayfa patlar | `if (!x) return null` |
| Tema içinden DB okumak | Mimari bozulur | Sadece `content` props'u |

---

## 9. Yeni bir renk değişkenini panele açmak

1. `src/lib/theme-vars.ts` → `EDITABLE_COLOR_VARS`'a bir satır
2. **Tüm** temaların `tokens.css` dosyalarına değişkeni ekleyin
3. **Tüm** temaların `index.ts` → `defaultColors` kaydına ekleyin
4. `src/app/globals.css` içindeki `:root` fallback bloğuna bir varsayılan koyun
