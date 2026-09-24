# Büyük Beşiktaş Çarşısı — QR kodu

Okutan kişi doğrudan **https://büyükbesiktascarsisi.com** adresine gider.

## Bu QR değişmez

Kodun içinde adresin kendisi gömülü — araya hiçbir kısaltma servisi
(bit.ly, qr.co vb.) girmiyor. Bunun sebebi kalıcılık: kısaltma servisi
kapanır, ücretli olur ya da hesabı askıya alınırsa **basılmış bütün QR'lar
aynı anda ölür**. Burada tek bağımlılık alan adının kendisi; o sizde
kaldığı sürece kod çalışır.

Dolayısıyla bu dosyalar bir kez basılır ve bir daha üretilmesi gerekmez.

## Kodun içinde ne yazıyor

```
https://xn--bykbesiktascarsisi-m6bb.com
```

Bu, `büyükbesiktascarsisi.com` adresinin makine karşılığı (punycode).
**Türkçe karakterli hâli bilerek gömülmedi.** QR standardının varsayılan
karakter seti ISO-8859-1'dir; `ü` harfini içeren bir kod, UTF-8 varsaymayan
bir okuyucuda şöyle okunur:

```
https://bÃ¼yÃ¼kbesiktascarsisi.com     ← var olmayan adres, ölü QR
```

Punycode saf ASCII olduğu için hangi karakter setiyle okunursa okunsun aynı
sonucu verir. Telefon açtığında adres çubuğunda yine `büyükbesiktascarsisi.com`
görünür — kullanıcı farkı hissetmez.

## Hangi dosyayı kullanmalı

| Dosya | Nerede |
|---|---|
| `bbc-qr.svg` | **Matbaa/tasarımcı için asıl dosya.** Vektör: tabelada da kartvizitte de keskin. |
| `bbc-qr.pdf` | Matbaa SVG istemiyorsa. Yine vektör. |
| `bbc-qr.eps` | Eski matbaa programları için. Yine vektör. |
| `bbc-qr.png` | Dijital kullanım — WhatsApp, e-posta, sosyal medya (2250×2250) |
| `bbc-qr-amblemli.png` | Ortasında çarşının amblemi (3600×3600). Afiş, sosyal medya. |
| `bbc-qr-seffaf.png` | Zemini şeffaf; renkli/koyu bir zemine yerleştirmek için |

Büyük basılacaksa (tabela, vitrin, afiş) **vektör olanı** verin — PNG büyütünce
kenarlar bozulur.

## Basarken üç kural

**1. Beyaz çerçeveyi kırpmayın.** Kodun etrafındaki boşluk süs değil, standardın
parçası ("sessiz bölge"); tarayıcı kodun nerede bittiğini oradan anlar.
Kırpılırsa okunmaz.

**2. Kontrastı düşürmeyin.** Koyu desen / açık zemin kalmalı. Renk
değiştirecekseniz koyu tarafı koyu tutun; açık gri üzerine açık sarı gibi
denemeler okunmaz hâle getirir. Negatif (açık desen / koyu zemin) bazı
telefonlarda okunmaz — `bbc-qr-seffaf.png` kullanacaksanız arkasına açık bir
zemin koyun.

**3. Yeterince büyük basın.** Kaba kural: **kodun kenarı, okunacağı mesafenin
onda biri.** Yani 1 metreden okunacaksa en az 10 cm. Elde tutulan bir kartvizit
için 2 cm yeterli.

## Test edildi

`bbc-qr.png` ve `bbc-qr-amblemli.png`, zbar çözücüsüyle (telefon
tarayıcılarına yakın davranır) 36 senaryoda sınandı ve **36/36 doğru okundu**:
3/2/1,5/1/0,8 cm baskı boyutlarında, bulanık, çok bulanık, 10°/25°/45°/90°/180°
eğik, düşük kontrast, karanlık ortam, aşırı parlak ve veri alanında 12 lekeyle.

Amblemli sürümdeki amblem karenin %18'ini kaplıyor; hata düzeltme seviyesi **H**
(%30 kurtarma) seçildiği için bu güvenli bir pay bırakıyor — amblem okunabilirliği
bozmuyor, ölçüldü.

## Yeniden üretmek gerekirse

Alan adı değişirse (ya da başka bir sayfaya yönlendirmek isterseniz) kodlar
`qr/build.py` mantığıyla yeniden üretilir: `segno.make(URL, error="h")`.
Adresi değiştirirseniz **basılmış tüm kodlar geçersiz olur** — bu yüzden alan
adını değiştirmemek en iyisi.
