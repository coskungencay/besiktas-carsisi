# design-input/ — ham tasarım dosyaları

Claude Design (veya başka bir araç) ile ürettiğiniz **ham tasarım çıktılarını**
buraya koyun. Burası bir **çalışma alanı**dır; uygulama bu klasörden hiçbir şey
import etmez, build'e dahil değildir.

```
design-input/
├── README.md              ← bu dosya (repo'da tutulur)
└── <tema-slug>/           ← tasarım başına bir klasör (git'e girmez)
    ├── index.html         ← veya page.jsx / page.tsx
    ├── styles.css         ← varsa
    └── assets/            ← tasarımın görselleri, ikonları
```

> `design-input/*` içeriği `.gitignore`'dadır — sadece bu README izlenir.
> Tasarımı temaya çevirdikten sonra ham dosyaları silebilirsiniz; kalıcı
> sürüm artık `src/themes/<slug>/` altındadır.

---

## Hangi format?

**Tercih sırası:**

1. **JSX / TSX** (`page.jsx`, `Hero.jsx`) — en hızlısı. Zaten React; `class` →
   `className` dönüşümü yapılmış olur, doğrudan taşıyabilirsiniz.
2. **Tek dosya HTML** (`index.html`, Tailwind sınıflarıyla) — çok iyi çalışır.
   Tailwind sınıfları JSX'e olduğu gibi geçer.
3. **HTML + ayrı CSS** — çalışır ama CSS'i Tailwind sınıflarına ya da
   `tokens.css` değişkenlerine çevirmek ek iş demektir.

**İstenmeyen:** Figma linki, ekran görüntüsü, PDF. Bunlardan koda geçmek
manuel iş gerektirir.

## Tasarımı isterken şunları söyleyin

Claude Design'a brief verirken bunları belirtmek dönüşümü çok kısaltır:

- "Tailwind CSS kullan, ayrı CSS dosyası yazma"
- "Renkleri `var(--brand-primary)`, `var(--brand-surface)`, `var(--brand-ink)`,
  `var(--brand-accent)`, `var(--brand-surface-alt)`, `var(--brand-ink-muted)`,
  `var(--brand-border)`, `var(--brand-primary-contrast)` CSS değişkenleriyle ver,
  sabit hex yazma"
- "Sayfayı 5 bölüme ayır: Hero, About (hakkımızda + çalışma saatleri),
  Menu (kategori → ürün listesi), Gallery (grid), Contact (bilgi + form)"
- "Semantik HTML kullan: section, h1/h2/h3 hiyerarşisi, ul/li, dl/dt/dd"
- "Harici font veya CDN görseli kullanma"

---

Dönüşümün adım adım anlatımı: **[../THEMING.md](../THEMING.md)** (bölüm 4 ve 5)
