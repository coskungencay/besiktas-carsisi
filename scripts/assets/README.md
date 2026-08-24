# scripts/assets — çarşının kendi marka varlıkları

Bu dosyalar **Büyük Beşiktaş Çarşısı'na aittir**; eski resmî siteden
(buyukbesiktascarsi.com) alınmıştır ve müşterinin kendi malıdır.

| Dosya | Ne | Nereden |
|---|---|---|
| `amblem.gif` | Sarı yuvarlak amblem (185×181) | `/images/banners/logo.gif` |
| `cephe-tabela.jpg` | Çatıdaki tabelayla bina cephesi (1920×850) | `/images/2022/08/30/slide1.jpg` |
| `cephe-giris.jpg` | Merdivenli giriş cephesi (1920×850) | `/images/2022/08/30/slide2.jpg` |

`scripts/import-assets.ts` bunları uygulamanın kendi yükleme hattından
geçirir (sharp → WebP + thumbnail + orijinal).

> **Amblem düşük çözünürlüklü (185px).** Sitede en fazla ~96px basılıyor,
> o ölçüde keskin duruyor. Çarşı yönetiminden vektör (SVG/AI/EPS) ya da
> yüksek çözünürlüklü sürüm istenmeli — açılış ekranı ve favicon o zaman
> her ekranda net olur.
