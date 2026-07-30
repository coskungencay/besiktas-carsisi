# THEMING.md — Yeni tema ekleme

Bu dokümanın amacı: **elinizdeki bir HTML/JSX tasarımı, 30–60 dakikada
çalışan bir temaya dönüştürmek.**

---

## 1. Temel kural

> **Tema kodu asla veritabanına dokunmaz.**

```
DB ──► src/lib/content.ts ──► SiteContent ──► tema section'ları
       (tek dönüşüm yeri)     (tek tip)       (SADECE görsel iş)
```

Bir tema yazarken hiçbir zaman `db`, `drizzle`, `getSettings()`, `fetch()` gibi
şeylere ihtiyacınız olmaz. Elinizde hazır, sunuma uygun bir `SiteContent`
objesi vardır — sadece onu HTML'e dökersiniz.

Bir de ikinci kural var:

> **Tema içinde sabit renk (hex/rgb) yazılmaz.** Her renk bir CSS değişkeninden gelir.
> Aksi halde admin panelindeki renk seçici o rengi değiştiremez.

---

## 2. Bir temanın anatomisi

```
src/themes/<slug>/
├── index.ts                 # ThemeDefinition — registry'ye bunu veriyoruz
├── tokens.css               # [data-theme="<slug>"] altındaki CSS değişkenleri
└── sections/
    ├── Hero.tsx
    ├── About.tsx
    ├── Menu.tsx
    ├── Gallery.tsx
    └── Contact.tsx
```

Beş section da zorunludur (landing sayfası hepsini bu sırayla render eder).
Bir section'ın gösterilecek verisi yoksa `return null` demesi yeterlidir.

---

## 3. `SiteContent` — elinizdeki tüm veri

Tam tanım: `src/themes/types.ts`

```ts
type SiteContent = {
  name: string;              // İşletme adı
  tagline: string;           // Slogan
  about: string;             // Hakkımızda (paragraflar \n\n ile ayrık)
  logoUrl: string;           // "" olabilir
  heroImageUrl: string;      // "" olabilir

  contact: {
    phone: string;           phoneHref: string;      // "tel:+90..."
    whatsapp: string;        whatsappHref: string;   // "https://wa.me/90..."
    email: string;
    address: string;
    lat: number | null;      lng: number | null;
    mapsUrl: string;
    instagram: string;       instagramHref: string;  // handle + tam URL
  };

  openingHours: {
    dayOfWeek: number;       // 0 = Pazar
    dayLabel: string;        // "Pazartesi"
    openTime: string;        // "08:00"
    closeTime: string;       // "22:00"
    isClosed: boolean;
  }[];

  menu: {
    id: number;
    name: string;            // Kategori adı
    items: {
      id: number;
      name: string;
      description: string;
      price: string;         // "₺85,00" — boşsa fiyat gösterilmesin
      priceValue: number;    // ham sayı
      imageUrl: string;      // "" olabilir
      thumbUrl: string;      // 400px küçük hâli
      isFeatured: boolean;
    }[];
  }[];

  gallery: { id: number; url: string; thumbUrl: string; alt: string }[];

  brandColors: Record<string, string>;   // panelde seçilen renkler (tema kullanmaz)
  themeSlug: string;
};
```

Her section şu tek props'u alır:

```ts
type SectionProps = { content: SiteContent };
```

**Boş veri her zaman mümkün.** Yeni kurulan bir sitede galeri boş, logo yok,
telefon girilmemiş olabilir. Her alanı `if (!x) return null` / koşullu render ile koruyun.

---

## 4. Adım adım: yeni tema ekleme

### Adım 1 — Klasörü oluşturun

En hızlı yol, çalışan temayı kopyalamak:

```bash
cp -r src/themes/placeholder src/themes/vintage
```

### Adım 2 — `tokens.css`'i güncelleyin

Seçici **mutlaka** yeni slug olmalı:

```css
/* src/themes/vintage/tokens.css */
[data-theme="vintage"] {
  --brand-primary: #2f4f4f;
  --brand-primary-contrast: #fdfaf3;
  --brand-accent: #b08968;
  --brand-surface: #fdfaf3;
  --brand-surface-alt: #efe6d8;
  --brand-ink: #1c1c1c;
  --brand-ink-muted: #5a5a5a;
  --brand-border: #ded2be;

  --font-display: "Playfair Display", Georgia, serif;
  --font-body: var(--font-sans);

  --radius-sm: 0;          /* bu temada köşeler keskin */
  --radius-md: 0;
  --radius-lg: 0;
  --section-py: clamp(4rem, 9vw, 8rem);
  --container-max: 68rem;

  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.08);
  --shadow-md: 0 10px 30px -14px rgb(0 0 0 / 0.3);
}
```

> **Sekiz `--brand-*` değişkenini mutlaka tanımlayın.** Bunlar admin panelindeki
> renk seçiciye bağlıdır (`src/lib/theme-vars.ts`). Eksik bırakırsanız müşteri
> o rengi değiştirdiğinde beklenmedik sonuç alır.

### Adım 3 — `globals.css`'e import ekleyin

```css
/* src/app/globals.css — mevcut import'ların altına */
@import "../themes/placeholder/tokens.css";
@import "../themes/vintage/tokens.css";      /* ← yeni satır */
```

Tüm temaların token'ları yüklenir ama yalnızca `<html data-theme="...">`
ile eşleşen blok devreye girer.

### Adım 4 — Section'ları yazın

Tasarımınızı `sections/*.tsx` içine taşıyın (detaylı checklist: bölüm 5).

### Adım 5 — `index.ts`

```ts
// src/themes/vintage/index.ts
import type { ThemeDefinition } from "@/themes/types";

import About from "./sections/About";
import Contact from "./sections/Contact";
import Gallery from "./sections/Gallery";
import Hero from "./sections/Hero";
import Menu from "./sections/Menu";

const vintage: ThemeDefinition = {
  name: "Vintage (klasik, serif)",       // panelde görünecek ad
  sections: { Hero, About, Menu, Gallery, Contact },
  tokensPath: "src/themes/vintage/tokens.css",
};

export default vintage;
```

### Adım 6 — Registry'ye kaydedin

```ts
// src/themes/registry.ts
import placeholder from "./placeholder";
import vintage from "./vintage";           // ← yeni

export const themeRegistry: Record<string, ThemeDefinition> = {
  placeholder,
  vintage,                                  // ← yeni
};
```

### Adım 7 — Test edin

```bash
pnpm dev
# /admin/tema → "Vintage" seçin → Kaydet → / adresine bakın
```

Ya da env ile sabitleyin: `NEXT_PUBLIC_THEME=vintage pnpm dev`

### Adım 8 — Kalite kapısı

```bash
pnpm lint && pnpm tsc --noEmit && pnpm build
```

---

## 5. Bir HTML tasarımını temaya çevirme checklist'i

Elinizde statik bir HTML (veya JSX) tasarım var. Sırayla:

### A. Hazırlık

- [ ] Tasarımı 5 parçaya bölün: Hero / About / Menu / Gallery / Contact.
      Tasarımda karşılığı olmayan bir bölüm varsa o section `return null` desin.
- [ ] Tasarımın header/nav ve footer'ı varsa: nav'ı Hero içine koyun,
      footer zaten `src/app/page.tsx` içinde ortak olarak var.

### B. Markup'ı taşıyın

- [ ] HTML'i JSX'e çevirin: `class` → `className`, `for` → `htmlFor`,
      kendiliğinden kapanan etiketler (`<img />`, `<br />`), stil objesi `style={{}}`
- [ ] `<div>` çorbasını semantik etiketlerle değiştirin:
      `<section>`, `<article>`, `<figure>`, `<ul>/<li>`, `<dl>/<dt>/<dd>`, `<time>`
- [ ] Her section'a `id` ve `aria-labelledby` verin:
      ```tsx
      <section id="menu" aria-labelledby="menu-title">
        <h2 id="menu-title">Menü</h2>
      ```
      Kullanılan id'ler: `hero`, `hakkimizda`, `menu`, `galeri`, `iletisim`
      (Hero'daki "Menüyü İncele" butonu `#menu` bağlantısını kullanır)
- [ ] Başlık hiyerarşisi doğru olsun: sayfada **tek bir `<h1>`** (Hero'da),
      section başlıkları `<h2>`, alt başlıklar `<h3>`

### C. Sabit metinleri veriyle değiştirin

| Tasarımdaki | Yerine |
|---|---|
| "Coffee House" | `{content.name}` |
| Slogan cümlesi | `{content.tagline}` |
| Lorem ipsum paragraf | `content.about` (bkz. paragraf bölme örneği) |
| "+1 234 567" | `{content.contact.phone}` / `href={content.contact.phoneHref}` |
| Adres | `{content.contact.address}` |
| Menü ürünleri | `content.menu.map(...)` |
| Galeri kutuları | `content.gallery.map(...)` |
| Sosyal medya ikonları | `content.contact.instagramHref` (boşsa gizleyin) |
| Çalışma saatleri tablosu | `content.openingHours.map(...)` |

Paragraf bölme:

```tsx
{content.about
  .split(/\n{2,}/)
  .map((p) => p.trim())
  .filter(Boolean)
  .map((p, i) => <p key={i}>{p}</p>)}
```

### D. Renkleri token'a çevirin

- [ ] Tasarımdaki her hex rengi bul-değiştir ile bir değişkene bağlayın:
      ```
      #2f4f4f  →  var(--brand-primary)
      #fdfaf3  →  var(--brand-surface)
      #1c1c1c  →  var(--brand-ink)
      ```
      Tailwind ile: `bg-[var(--brand-surface)]`, `text-[var(--brand-ink)]`
- [ ] Yarı saydam tonlar için `color-mix` kullanın (yeni değişken eklemeden):
      ```
      bg-[color-mix(in_srgb,var(--brand-ink)_62%,transparent)]
      ```
- [ ] Bittiğinde doğrulayın — hiç hex kalmamalı:
      ```bash
      grep -rn "#[0-9a-fA-F]\{3,6\}" src/themes/vintage/sections/
      ```

### E. Görseller

- [ ] `<img>` yerine `next/image` kullanın
- [ ] **Harici URL yok.** Yer tutucu gerekirse `public/placeholders/*.svg`:
      ```tsx
      const image = content.heroImageUrl || "/placeholders/hero.svg";
      ```
- [ ] Hero görseline `priority` verin (LCP), diğerlerine vermeyin
- [ ] `sizes` mutlaka doğru olsun:
      ```tsx
      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
      ```
- [ ] Listelerde `thumbUrl` kullanın, tam boy `url`'i değil
- [ ] Dekoratif görsellere `alt=""` + `aria-hidden="true"`;
      içerik görsellerine anlamlı `alt` (galeride `image.alt`)

### F. Animasyon

- [ ] Kendi `framer-motion` kodunuzu yazmak yerine hazır sarmalayıcıyı kullanın:
      ```tsx
      import { Reveal } from "@/components/motion/Reveal";

      <Reveal delay={0.1}>...</Reveal>
      <Reveal as="li" key={item.id}>...</Reveal>
      ```
      `Reveal`, `prefers-reduced-motion` açıkken animasyonu **tamamen** devre dışı bırakır.
- [ ] CSS transition/hover efektlerine `motion-reduce:` varyantı ekleyin:
      ```
      transition-transform hover:-translate-y-0.5
      motion-reduce:transition-none motion-reduce:hover:translate-y-0
      ```
- [ ] Otomatik oynayan carousel / parallax kullanmayın (erişilebilirlik + performans)

### G. İletişim formu

- [ ] Formu **sıfırdan yazmayın.** Hazır bileşeni yerleştirin:
      ```tsx
      import { ContactForm } from "@/components/site/ContactForm";
      ```
      Honeypot, rate limit, zod doğrulaması ve server action bunun içinde.
- [ ] Formun dış kutusunu tasarımınıza göre stillendirin; iç alanlar CSS
      değişkenlerini zaten kullanıyor.

### H. Son kontroller

- [ ] `pnpm tsc --noEmit` temiz
- [ ] `pnpm lint` temiz
- [ ] `pnpm build` temiz
- [ ] **Boş veri testi:** panelden galeriyi ve menüyü boşaltın — sayfa
      bozulmadan çalışmalı
- [ ] **Renk testi:** `/admin/tema`'dan ana rengi değiştirin — tasarımda
      değişmeyen bir yer kalmamalı
- [ ] **Mobil:** 360px genişlikte yatay kaydırma olmamalı
- [ ] **Klavye:** Tab ile gezinin, odak halkası her yerde görünür olmalı
- [ ] **Reduced motion:** işletim sisteminden "hareketi azalt"ı açıp sayfayı
      yenileyin — hiçbir şey hareket etmemeli
- [ ] **Lighthouse:** Performance / Accessibility / Best Practices / SEO ≥ 95

---

## 6. Referans olarak `placeholder`

`src/themes/placeholder/` kasıtlı olarak sade tutuldu ve **her kalıbı** içeriyor:

| Nerede | Ne gösteriyor |
|---|---|
| `Hero.tsx` | `fill` görsel + `color-mix` overlay, `priority`, koşullu logo/telefon |
| `About.tsx` | Paragraf bölme, `<dl>` ile çalışma saatleri |
| `Menu.tsx` | İç içe map, thumbnail, koşullu fiyat, "öne çıkan" rozeti |
| `Gallery.tsx` | Responsive grid, `sizes`, `Reveal as="li"`, motion-reduce hover |
| `Contact.tsx` | Koşullu iletişim satırları, harici link `rel`, `ContactForm` |

Yeni tema yazarken bu dosyaları yan yana açık tutun.

---

## 7. Sık yapılan hatalar

| Hata | Sonuç | Doğrusu |
|---|---|---|
| `tokens.css` seçicisini değiştirmeyi unutmak | Yeni tema `placeholder`'ın renklerini ezer | `[data-theme="<yeni-slug>"]` |
| `globals.css`'e import eklememek | Tema renksiz görünür | `@import "../themes/<slug>/tokens.css";` |
| Section'da sabit hex renk | Panelden renk değişmez | `var(--brand-*)` |
| Boş veri kontrolü yapmamak | Yeni sitede sayfa patlar | `if (!x) return null` |
| Tema içinden DB okumak | Mimari bozulur, build kırılır | Sadece `content` props'u |
| Harici görsel/font URL'i | Docker build ve CSP kırılır | Yerel SVG / sistem fontu |
| `sizes` vermeden `next/image` | Lighthouse düşer | Doğru `sizes` yazın |
| Her section'da `<h1>` | Erişilebilirlik hatası | Tek `<h1>` (Hero), diğerleri `<h2>` |

---

## 8. Yeni bir renk değişkenini panele açmak

Diyelim temanız `--brand-highlight` kullanıyor ve müşteri bunu değiştirebilsin:

```ts
// src/lib/theme-vars.ts
export const EDITABLE_COLOR_VARS = [
  // ... mevcutlar
  { key: "--brand-highlight", label: "Işıltı rengi", fallback: "#ffd166" },
] as const;
```

Sonra **tüm temaların** `tokens.css` dosyalarına bu değişkeni ekleyin
(bir temada eksikse müşteri onu seçtiğinde etkisiz kalır) ve
`src/app/globals.css` içindeki `:root` fallback bloğuna da bir varsayılan koyun.
