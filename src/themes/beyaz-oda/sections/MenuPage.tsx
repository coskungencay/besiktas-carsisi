import Image from "next/image";
import Link from "next/link";

import { Latin } from "@/components/site/Latin";
import { fill } from "@/i18n";
import { Reveal } from "@/components/motion/Reveal";
import {
  hasMenu,
  itemThumb,
  menuWithItems,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import { meta } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tam magazalar SAYFASI (/tr/magazalar) — basili bir MENU KARTI olarak.
 *
 * NEDEN kap: sayfanin geri kalani 2200px'e kadar acilan editoryal izgarayi
 * kullaniyor, ama 30+ urunluk bir listede o genislik okunmuyor; goz urun
 * adindan fiyata varamiyor. Bu yuzden menu sayfasi kendi kabina aliniyor:
 * zemini soluk gri "masa", ustunde beyaz bir KAGIT.
 *
 * Kabin dili temanin dili — tasarimda gole, radius veya dolgulu kutu yok,
 * her sey 1px hairline. Kagit da oyle kuruluyor:
 *   - dis cerceve 1px, icinde ~14px passe-partout boslugu, sonra IKINCI 1px
 *     hairline (cift cerceve = basili kartin kenar suslemesi),
 *   - dar ekranda ic cerceve kalkar, boslugu kucuulur: 390px'te kagidin
 *     kendisi sayfayi doldurur, sadece 16px kenar boslugu kalir.
 *
 * Genislik 980px: 32px sira no + urun adi + 240px aciklama + 88px fiyat
 * dortlusunun ferah oturdugu, satirin bastan sona tek bakista okundugu
 * aralik. Genis ekranda BUYUMEZ, ortada durur.
 *
 * Yapiskan sol serit KALKTI: 980px'lik bir kagidin yaninda asili duran ikinci
 * bir kolon kabin butunlugunu bozuyordu. Kategori capalari artik kagidin
 * icinde, mastheadin altinda yatay bir "fihrist" satiri; dar ekranda sarar.
 *
 * Satir bicimi ana sayfadaki tasarimla ayni dort kolon: sira no / ad /
 * aciklama / fiyat. Urun gorseli YOK — tasarimin sadeligi bunu istiyor.
 */
export default function MenuPage({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { t } = content;
  const categories = menuWithItems(content);

  // Tasarimda urunler bastan sona numarali; numara kategoriye degil listeye ait.
  let counter = 0;

  // Tek kategori varsa capa listesi bir ise yaramaz, sadece etiketi tekrar eder.
  const showAnchors = categories.length > 1;

  const anchorId = (categoryId: number) => `menu-kategori-${categoryId}`;

  return (
    /*
     * Sayfa zemini surface-alt: kagidin (surface) kenari ancak farkli bir
     * zemin uzerinde okunur. Iki renk de tokens.css'ten geliyor.
     */
    <section
      id="magazalar"
      aria-labelledby="menu-page-title"
      className="bg-[var(--brand-surface-alt)] text-[var(--brand-ink)]"
    >
      {/*
        Kenar boslugu KABIN DISINDA: 390px'te 16px, tablette 32px, genis
        ekranda 48px (tasarimin kendi yan boslugu). Boylece kap kucuk ekranda
        tasmaz, buyuk ekranda kendi max genisliginde kalir.
      */}
      <div className="w-full px-4 pt-12 pb-16 sm:px-8 sm:pt-20 sm:pb-24 lg:px-12 lg:pt-28 lg:pb-32">
        {/*
          Kagit. Dis cerceve + passe-partout boslugu. p-2 (8px) dar ekranda,
          sm'den itibaren 14px — ic cerceve de orada devreye giriyor.
        */}
        <article className="mx-auto w-full max-w-[980px] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-2 sm:p-3.5">
          <div className="px-4 py-9 sm:border sm:border-[var(--brand-border)] sm:px-9 sm:py-12 lg:px-14 lg:py-16">
            {/*
              Masthead — kartin kunyesi. Tasarimda bolum indeksi alt alta iki
              satirdi; burada kagidin ust kenarinda soldan saga bir "sayfa
              basligi" seridi olarak duruyor. Dar ekranda alta sarar.
            */}
            <header>
              <div className="bo-index flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <p aria-hidden="true">— 02</p>
                <p className="brand-eyebrow">{t.menu.eyebrow}</p>
              </div>

              {/*
                Sayfanin h1'i: bu sayfada baska baslik yok (Header'daki marka
                bir baglanti). Punto tasarimin iletisim bolumuyle ayni olcekte;
                kap daraldigi icin vw katsayisi da kuculdu.
              */}
              <h1
                id="menu-page-title"
                className="brand-display mt-6 text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.18] tracking-[-0.025em] text-balance"
              >
                {t.menu.title}
              </h1>

              <p className={`${meta} brand-eyebrow mt-4`}>{t.menu.pageIntro}</p>
            </header>

            <div
              className={`mt-9 border-t border-[var(--brand-border)] ${showAnchors ? "pt-5" : "pt-10 sm:pt-12"}`}
            >
              {showAnchors ? (
                /*
                  Fihrist. flex-wrap: 8-10 kategoride dar ekranda yatay kaydirma
                  yerine alt satira sarmak tercih edildi — kaydirilabilir serit
                  gizli kalan kategorileri kullaniciya hic gostermiyor.
                */
                <nav aria-label={t.menu.eyebrow} className="pb-10 sm:pb-12">
                  {/*
                    Kategoriler arasina AYRAC kondu ve fihrist ortalandi.
                    Onceden yalnizca bosluk vardi; "BAY & BAYAN GIYIM AYAKKABI
                    CANTA & VALIZ" seklinde birbirine giriyor ve nerede bir
                    kategorinin bitip digerinin basladigi okunmuyordu — cogu
                    kategori adi zaten iki kelimeli.

                    Ayrac ayri bir <li> DEGIL, her ogenin oncesine `before`
                    ile basiliyor: boylece liste anlamsal olarak temiz kaliyor
                    (ekran okuyucu ayraclari okumaz) ve satir sarmasinda ayrac
                    satir basina dusmuyor.
                  */}
                  <ul
                    /*
                      Satir araligi telefonda 20px: bo-tap her baglantinin
                      ustune/altina 10'ar piksel ekliyor, yani hedefler tam
                      bitisik doseniyor ve UST USTE BINMIYOR. Daha dar bir
                      aralikta bir kategoriye dokunurken ustundekinin hedef
                      alanina denk gelmek mumkun olurdu.
                    */
                    className={`${meta} flex flex-wrap items-center justify-center gap-x-4 gap-y-5 sm:gap-y-2`}
                  >
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        className="before:me-4 before:text-[var(--brand-ink-faint)] before:content-['·'] first:before:hidden"
                      >
                        {/*
                          Sayfa ici capa: next/link degil duz <a>. Ayni sayfada
                          kaldigimiz icin yonlendirmeye gerek yok, tarayicinin
                          kendi kaydirmasi yeterli.
                        */}
                        <a
                          href={`#${anchorId(category.id)}`}
                          /*
                            bo-tap: fihristteki 20 kategori 18px yuksekligindeydi
                            ve yan yana diziliydi; telefonda birine dokunmaya
                            calisirken komsusu aciliyordu. Gorunmez katman
                            hedefi ~38px'e cikariyor, satir araligi (gap-y-2 ->
                            gap-y-3) da acildigi icin hedefler ust uste binmiyor.
                          */
                          className="bo-tap brand-eyebrow border-b border-transparent pb-[2px] break-words transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                        >
                          <Latin>{category.name}</Latin>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}

              <div className="flex flex-col gap-12 sm:gap-14">
                {categories.map((category, categoryIndex) => (
                  <div key={category.id}>
                    <Reveal delay={categoryIndex === 0 ? 0 : 0.06}>
                      {/*
                        Kategori basligi + kapak karesi.

                        NEDEN GORSEL: 20 kategori alt alta yalnizca kucuk mono
                        etiketlerle ayriliyordu; sayfa 87 satirlik tek bir liste
                        gibi okunuyordu. Carsinin elinde her kategori icin
                        gercek bir vitrin karesi var (eski resmi sitesinden) —
                        kategoriyi hem ayiriyor hem ne satildigini bir bakista
                        anlatiyor. Gorsel yoksa baslik tek basina basilir.

                        scroll-mt: capa ile gelindiginde baslik ekranin en ust
                        pikseline yapismasin.

                        DEGER 28'DEN 3'E INDI: yapiskan seridin payi artik
                        tema genelinde `scroll-padding-top` ile veriliyor
                        (bkz. tokens.css). Ikisi TOPLANIYOR; 112px + 84px ile
                        kategori basligi ekranin ortasina dusuyor ve ustunde
                        bir ekran boyu bosluk kaliyordu. Burada kalan tek is
                        seridin altina bir nefes payi birakmak.
                      */}
                      <div
                        id={anchorId(category.id)}
                        className="flex scroll-mt-3 flex-col items-center border-b border-[var(--brand-border)] pb-7 text-center"
                      >
                        {/*
                          KATEGORI KAPAK GORSELI KALDIRILDI. Kategori
                          basliginin yanindaki yuvarlak kare, altindaki kart
                          izgarasiyla ayni fotograf ailesinden oldugu icin
                          sayfada iki kez ayni goruntuyu tekrar ediyordu ve
                          basligin onune geciyordu. Kategori artik yalnizca
                          adiyla ve magaza sayisiyla duruyor.

                          Gorseller SILINMEDI: veritabaninda duruyor ve ana
                          sayfadaki vitrin kartlari onlari kullanmaya devam
                          ediyor; panelden de yonetilebiliyorlar.
                        */}

                        <div className="min-w-0">
                          <h2 className="bo-title text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] tracking-[-0.01em]">
                            <Latin>{category.name}</Latin>
                          </h2>
                          <p className={`${meta} brand-eyebrow mt-2`}>
                            {fill(t.menu.shopCount, {
                              count: String(category.items.length),
                            })}
                          </p>
                        </div>
                      </div>
                    </Reveal>

                    {/*
                      UCLU IZGARA — onceden tek sutunlu bir LISTEYDI.
                      87 magaza alt alta yalnizca adlariyla siralandiginda
                      sayfa bir dizin gibi okunuyordu; magazanin ne sattigi,
                      neye benzedigi hic gorunmuyordu. Simdi her magaza kendi
                      karti: fotograf + ad + aciklama.

                      FOTOGRAF YEDEGI YOK — bilerek. Ilk denemede fotografi
                      olmayan magazalar kategorinin kapak karesine dusuyordu;
                      "Bay & Bayan Giyim"de 32 magaza ust uste AYNI vitrin
                      fotografini gosterdi ve izgara bozuk bir tekrar gibi
                      okundu. Kategorinin karesi zaten bolum basliginda bir kez
                      duruyor.

                      Fotografi olmayan magaza bunun yerine TIPOGRAFIK bir kart
                      aliyor: ayni oranda bir kutu, icinde adin bas harfi.
                      Izgaranin ritmi bozulmuyor, tekrar da olusmuyor. Carsi
                      yonetimi panelden fotograf ekledigi anda kart fotografa
                      geciyor.
                    */}
                    {/*
                      TELEFONDA DA IKILI. Onceden dar ekranda tek sutundu ve
                      87 magazanin 84'unun fotografi henuz yok; her biri tam
                      genislikte, 4:5 oraninda, icinde yalnizca bir bas harf
                      olan ~440px'lik gri bir kutuya donuyordu. Sayfa telefonda
                      44.000 piksel uzunluguna cikiyor ve neredeyse tamami bos
                      kutulardan olusuyordu — kategori fihristi olmasa dibine
                      inmek dakikalar suruyordu.

                      Ikili izgarada ayni kutu ~160px'e iniyor, sayfa ucte
                      birine kadar kisaliyor ve izgara "vitrin" gibi okunuyor.
                      Fotografi olan magaza da bundan zarar gormuyor: 160px
                      telefon icin yeterli bir vitrin karesi.

                      Yatay bosluk telefonda daraliyor (24px iki sutun
                      arasinda cok yer yiyordu), sm'den itibaren tasarimin
                      kendi olcusune donuyor.
                    */}
                    <ul className="mt-8 grid grid-cols-2 gap-x-3.5 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3">
                      {category.items.map((item, itemIndex) => {
                        counter += 1;
                        const number = String(counter).padStart(2, "0");
                        const image = itemThumb(content, item);

                        return (
                          <Reveal
                            as="li"
                            key={item.id}
                            variant="clip"
                            delay={Math.min(itemIndex, 5) * 0.06}
                          >
                            <article className="group">
                              <div className="relative aspect-4/5 overflow-hidden bg-[var(--brand-surface-alt)]">
                                {image ? (
                                  <Image
                                    src={image}
                                    alt=""
                                    fill
                                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                                    loading="lazy"
                                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,0.8,0.24,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                  />
                                ) : (
                                  /*
                                    Tipografik kart: adin bas harfi, cok soluk
                                    ve buyuk. `aria-hidden` cunku harf bir bilgi
                                    tasimiyor — magazanin adi hemen altinda
                                    yazili.
                                  */
                                  <span
                                    aria-hidden="true"
                                    className="brand-display absolute inset-0 grid place-items-center text-[clamp(3rem,7vw,4.5rem)] font-black text-[var(--brand-ink-faint)] transition-transform duration-700 ease-[cubic-bezier(0.16,0.8,0.24,1)] group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                  >
                                    {item.name.trim().charAt(0).toLocaleUpperCase("tr")}
                                  </span>
                                )}

                                {/* Sira numarasi fotografin kosesinde. */}
                                <span
                                  aria-hidden="true"
                                  className="bo-mono absolute start-0 top-0 bg-[var(--brand-surface)] px-2 py-1 text-[11px] text-[var(--brand-ink-muted)] sm:px-2.5 sm:text-[10.5px]"
                                >
                                  {number}
                                </span>
                              </div>

                              <h3 className="bo-title mt-4 text-center text-[clamp(0.9375rem,1.6vw,1.25rem)] leading-[1.3] text-balance sm:mt-5">
                                <Latin>{item.name}</Latin>
                              </h3>

                              {item.description ? (
                                <p className="mt-2 text-center text-[12.5px] leading-[1.55] break-words text-pretty text-[var(--brand-ink-muted)] sm:text-[13.5px] sm:leading-[1.6]">
                                  {item.description}
                                </p>
                              ) : null}
                            </article>
                          </Reveal>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/*
              Ana sayfaya donus — kagidin ICINDE, son satirin altinda. Tasarimda
              "buton" diye bir bicim yok; birincil eylem hero ve iletisimdeki
              gibi alt cizgili metin + ok. Ok RTL'de kendiliginden donuyor, bu
              yuzden geri baglantisinda da ayni ikon kullanilabiliyor.
            */}
            <div className="mt-12 border-t border-[var(--brand-border)] pt-8">
              <Link
                href={`/${content.locale}`}
                className="bo-tap inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-[3px] text-[13px] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
              >
                {/* Uygun sozluk anahtari yok; isletme adi baglantiyi anlatiyor. */}
                <span>{content.name}</span>
                <ArrowIcon className="size-3.5" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
