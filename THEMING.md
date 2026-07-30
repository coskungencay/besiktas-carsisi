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

## 2. Mimari: neden 9 tema ama 4 bölüm dosyası?

Elimizdeki 8 tasarım ölçüldüğünde şu çıktı:

| Bölüm | Tasarımlar arası fark |
|---|---|
| About, Menu, Gallery, Contact | **Yapısal olarak birebir aynı.** Fark yalnızca radius, kenarlık kalınlığı, başlık ağırlığı ve harf aralığı |
| Hero | **5 gerçek düzen** var (split, overlay, centered, editorial, framed) |

Bu yüzden:

- Yapısal olarak aynı olan 4 bölüm **bir kez** yazıldı → `src/themes/shared/sections/`
- Hero'nun 5 düzeni ayrı bileşen → `src/themes/shared/heroes/`
- Tasarımlar arası tüm görsel fark **token'lara** indirildi → her temanın `tokens.css`'i

Sonuç: aynı `Menu.tsx`'i 8 kez kopyalamıyoruz. Bir erişilebilirlik ya da RTL
hatası düzeltildiğinde 9 temanın hepsi birden düzeliyor.

```
src/themes/
├── types.ts                     # SiteContent + ThemeDefinition sözleşmesi
├── registry.ts                  # Record<slug, ThemeDefinition>
├── shared/
│   ├── parts.tsx                # BrandMark, HeroActions, SectionHeader, ikonlar
│   ├── heroes/                  # SplitHero, OverlayHero, CenteredHero,
│   │                            #   EditorialHero, FramedHero
│   └── sections/                # About, Menu, Gallery, Contact
├── placeholder/                 # index.ts + tokens.css
├── mera/  patika/  yesil-avlu/  kirk-yil/
└── vela/  beyaz-oda/  tesviye/  sicak-firin/
```

Her tema klasöründe **yalnızca iki dosya** vardır:

```
src/themes/<slug>/
├── tokens.css     # görsel kimliğin TAMAMI
└── index.ts       # hangi hero düzeni + panelde görünen ad/açıklama/renkler
```

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

## 4. Yeni tema ekleme (token-only) — 10 dakika

Yeni tasarım mevcut 5 hero düzeninden birine uyuyorsa yapılacak iş budur.

### Adım 0 — Ham tasarımı `design-input/` içine koyun

Format ve brief önerileri: [`design-input/README.md`](./design-input/README.md).

### Adım 1 — `tokens.css`

```bash
cp -r src/themes/mera src/themes/yeni-tema
```

`src/themes/yeni-tema/tokens.css` içinde seçiciyi ve değerleri değiştirin:

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

### Adım 2 — `index.ts`

```ts
import type { ThemeDefinition } from "@/themes/types";
import SplitHero from "@/themes/shared/heroes/SplitHero";   // ← düzeni seçin
import About from "@/themes/shared/sections/About";
import Contact from "@/themes/shared/sections/Contact";
import Gallery from "@/themes/shared/sections/Gallery";
import Menu from "@/themes/shared/sections/Menu";

const theme: ThemeDefinition = {
  name: "Yeni Tema",
  description: "Panelde görünecek tek cümlelik açıklama.",
  scheme: "light",
  sections: { Hero: SplitHero, About, Menu, Gallery, Contact },
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

### Adım 3 — İki satır kayıt

```css
/* src/app/globals.css — diğer import'ların altına */
@import "../themes/yeni-tema/tokens.css";
```

```ts
// src/themes/registry.ts
import yeniTema from "./yeni-tema";
export const themeRegistry = { …, "yeni-tema": yeniTema };
```

### Adım 4 — Test

```bash
pnpm dev            # /admin/tema → yeni temayı seç → / adresine bak
pnpm lint && pnpm tsc --noEmit && pnpm build
```

### Hero düzeni seçimi

| Bileşen | Düzen | Kullanan |
|---|---|---|
| `SplitHero` | Metin bir yanda, 4:3 görsel diğer yanda | mera, yeşil avlu, sıcak fırın, placeholder |
| `OverlayHero` | Tam genişlik görsel + yarı saydam örtü | patika, vela |
| `CenteredHero` | Ortalanmış metin, altta 21:9 görsel | kırk yıl |
| `EditorialHero` | Üstte marka satırı, 12'li ızgara, altta geniş görsel | beyaz oda |
| `FramedHero` | Çerçeve içinde iki sütun | tesviye |

---

## 5. Mevcut düzene uymayan tasarım (escape hatch)

Yeni tasarımın Menü bölümü gerçekten farklıysa, o bölümü **kendi tema
klasörünüzde** yazın ve `index.ts`'te değiştirin:

```
src/themes/yeni-tema/
├── tokens.css
├── index.ts
└── sections/
    └── Menu.tsx          # sadece bu bölüm özel
```

```ts
import Menu from "./sections/Menu";                 // ← kendi dosyanız
import About from "@/themes/shared/sections/About"; // ← diğerleri paylaşılan
sections: { Hero: SplitHero, About, Menu, Gallery, Contact },
```

Aynısı Hero için de geçerli: yeni bir düzen gerekiyorsa ya `shared/heroes/`
altına ekleyin (başka temalar da kullanacaksa) ya da tema klasörünüzde tutun.

**Ne zaman paylaşılana taşımalı?** İkinci bir tema aynı düzeni isterse.
Tek temaya özelse orada kalsın.

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
