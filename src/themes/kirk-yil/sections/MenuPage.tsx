import Link from "next/link";

import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import {
  anyItemHasImage,
  hasMenu,
  itemThumb,
  menuWithItems,
} from "@/themes/_shared/data";
import {
  DoubleRuleDark,
  OrnamentDark,
  PriceRow,
  board,
  buttonGhostDark,
} from "@/themes/kirk-yil/parts";
import type { MenuCategory, SectionProps } from "@/themes/types";

/**
 * Kategorileri IKI KOLONA elle dagitir.
 *
 * NEDEN: grid-cols-2 kategorileri sirayla yerlestiriyor; 3+2+2 urunluk uc
 * kategoride sag kolon yarim kaliyor ve tasarimin dengeli iki sutunu
 * bozuluyordu. Burada SATIR sayisina gore boluyoruz (baslik da bir satir),
 * boylece iki kolon yaklasik ayni yukseklikte bitiyor.
 */
function splitIntoColumns(
  categories: MenuCategory[],
): [MenuCategory[], MenuCategory[]] {
  const totalRows = categories.reduce(
    (sum, category) => sum + category.items.length + 1,
    0,
  );

  const left: MenuCategory[] = [];
  const right: MenuCategory[] = [];
  let filled = 0;

  for (const category of categories) {
    const rows = category.items.length + 1;
    if (filled + rows / 2 <= totalRows / 2 || left.length === 0) {
      left.push(category);
      filled += rows;
    } else {
      right.push(category);
    }
  }

  return [left, right];
}

/** Kategori basliginin capa adresi; sayfa ici gezinme listesi buna baglanir. */
function anchorId(category: MenuCategory): string {
  return `menu-kategori-${category.id}`;
}

/**
 * TAM MENU SAYFASI (/tr/menu).
 *
 * DUZEN KARARI: sayfa zemini koyu (tasarimdaki "fiyat listesi tabelasi"), ama
 * menunun kendisi o zeminin uzerinde duran CERCEVELI BIR KART. Cerceve
 * temanin imzasi olan passe-partout'nun koyu surumu: disarida 3px cift cizgi
 * (tabelalarin kenari), ic bosluk, sonra ince bir ic cizgi. Kartin zemini
 * sayfadan bir tik acik (ink icine %6 kagit) — boylece kart sayfaya YAPISMAZ,
 * duvara asili cerceveli bir menu gibi one cikar.
 *
 * NEDEN CERCEVE: menu 30+ urune ciktiginda kenardan kenara akan liste
 * okunmuyor. Kart hem satiri okunur genislikte tutuyor (iki kolonda 1040px,
 * tek kolonda 900px) hem de "elde tutulan basili menu" hissini veriyor.
 *
 * Ana sayfadaki vitrin bolumunden FARKI: burada tam liste var, kategori
 * sayisi ikiden fazlaysa kartin icinde sayfa ici capa listesi cikiyor ve
 * kartin ALTINDA ana sayfaya donus baglantisi duruyor.
 */
export default function MenuPage({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { name, t } = content;
  const categories = menuWithItems(content);
  const [left, right] = splitIntoColumns(categories);

  /*
   * Tek kategorili menude ikinci kolon bos kalir; kartin sol yarisinda duran
   * bir liste bu tasarimin simetrisini bozuyor. O durumda iki kolon hic
   * acilmaz ve kart daha dar (900px) kurulur — tek kolon icin dogru olcu bu.
   */
  const twoColumns = right.length > 0;

  return (
    <section aria-labelledby="menu-page-title" className={board}>
      {/*
        Kenar boslugu `shell`den AYRI: shell'in mobil dolgusu (24px) burada
        karti gereksiz daraltiyor. Kart 390px'te ~14px bosluk birakip kalan
        genisligi tamamen kullanmali, genis ekranda ise kendi max genisliginde
        ortada kalmali (2000px'te de buyumez).
      */}
      <div className="mx-auto w-full max-w-[var(--brand-container)] px-3.5 pt-[72px] pb-[80px] sm:px-8 sm:pt-[104px] sm:pb-[112px] lg:px-10">
        <div
          className={`mx-auto w-full border-[3px] border-double border-[var(--brand-surface)]/30 bg-[color-mix(in_srgb,var(--brand-surface)_6%,var(--brand-ink))] p-2 sm:p-3.5 ${
            twoColumns ? "max-w-[1040px]" : "max-w-[900px]"
          }`}
        >
          {/*
            Passe-partout'nun ic cizgisi. Dar ekranda ic dolgu 16px'e iner:
            cerceve kalirken satirlar kagidin kenarina yaklasir, yoksa
            390px'te okunacak genislik kalmiyor.
          */}
          <div className="border border-[var(--brand-surface)]/20 px-4 py-11 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            {/*
              Baslik bloku KARTIN ICINDE: basili bir menunun kunyesi de
              kagidin uzerindedir. Bicim ana sayfadaki bolumle AYNI (kunye,
              dev serif baslik, elmas ayrac) — sayfa ile bolum arasindaki bag
              bu tekrarla kuruluyor. SectionTitle kullanilmiyor cunku o parca
              acik zemin icin yazildi.
            */}
            <Reveal>
              <div className="text-center">
                <p className="ky-eyebrow text-[var(--brand-accent)]">
                  {t.menu.eyebrow}
                </p>

                <h1
                  id="menu-page-title"
                  className="brand-display ky-h2 mt-3.5 text-balance"
                >
                  {t.menu.title}
                </h1>

                <OrnamentDark className="mt-[18px]" />
              </div>
            </Reveal>

            {/*
              Sayfa ici gezinme yalnizca liste uzadiginda anlamli: iki
              kategoride hepsi zaten ilk ekranda goruluyor ve capa listesi
              gereksiz gurultu. flex-wrap: dar ekranda alt satira sarar.
            */}
            {categories.length > 2 ? (
              <Reveal delay={0.06}>
                <nav
                  aria-label={t.menu.eyebrow}
                  className="mt-9 border-y border-[var(--brand-surface)]/15 py-4"
                >
                  <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 sm:gap-x-7">
                    {categories.map((category) => (
                      /*
                        min-w-0 + break-words: kategori adi da musteri
                        verisidir. Sarmalayan flex'te bir ogenin varsayilan
                        alt siniri min-content oldugu icin tek parca uzun bir
                        ad (orn. Almanca birlesik kelime) satira sigmayip
                        sayfayi yatayda tasiriyordu; boylece kirilarak sarar.
                      */
                      <li key={category.id} className="min-w-0">
                        <a
                          href={`#${anchorId(category)}`}
                          className="ky-strip break-words text-[var(--brand-surface)]/70 underline-offset-[6px] transition-colors hover:text-[var(--brand-accent)] hover:underline"
                        >
                          <Latin>{category.name}</Latin>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Reveal>
            ) : null}

            {/*
              Iki kolon lg'de (1024px) acilir, md'de DEGIL: 768px'te kartin ic
              genisligi ~600px ve ikiye bolununce her kolon 260px'e duser —
              19px'lik urun adi + fiyat orada okunmuyor. O aralikta tek genis
              kolon dogru.
            */}
            <div
              className={`mt-11 grid items-start gap-x-[70px] gap-y-14 sm:mt-12 ${
                twoColumns ? "lg:grid-cols-2" : ""
              }`}
            >
              {[left, right].map((group, groupIndex) =>
                group.length === 0 ? null : (
                  /*
                    min-w-0 ZORUNLU: izgara kolonlarinin (hem varsayilan tek
                    kolon hem lg'deki 1fr) otomatik alt siniri icerigin
                    min-content genisligidir. PriceRow'daki `break-words`
                    (overflow-wrap) bu hesaba GIRMEZ; urun adinda tek parca
                    uzun bir kelime varsa kolon o kelimenin genisligine kadar
                    sisip karti ve sayfayi yatayda tasiriyordu (390px'te
                    olculdu: sayfa 522px). min-w-0 ile kolon kap genisligine
                    iner, ad da break-words sayesinde icerde kirilir.
                  */
                  <div key={groupIndex} className="flex min-w-0 flex-col gap-14">
                    {group.map((category, index) => (
                      <Reveal
                        key={category.id}
                        delay={Math.min(index, 3) * 0.06}
                      >
                        {/*
                          scroll-mt: capadan gelindiginde baslik ekranin en ust
                          kenarina yapismasin, ustunde nefes kalsin.
                          break-words: ayni sebep — uzun kategori adi cerceveyi
                          asip kagidin disina tasmasin.
                        */}
                        <h2
                          id={anchorId(category)}
                          className="ky-eyebrow scroll-mt-8 break-words border-b border-[var(--brand-surface)]/25 pb-3 text-[var(--brand-accent)]"
                        >
                          <Latin>{category.name}</Latin>
                        </h2>

                        <ul className="mt-1.5 flex flex-col">
                          {category.items.map((item) => (
                            <PriceRow
                              key={item.id}
                              item={item}
                              featuredLabel={t.menu.featured}
                              thumb={itemThumb(content, item)}
                                  messages={t}
                              reserveImage={anyItemHasImage(
                                content,
                                category.items,
                              )}
                            />
                          ))}
                        </ul>
                      </Reveal>
                    ))}
                  </div>
                ),
              )}
            </div>

            {/*
              Kartin dipnotu: tasarimda menu bandinin en altinda italik bir
              ikram notu var. Basili menuda o not da kagidin uzerinde, ince
              bir cizginin altinda durur.
            */}
            <div className="mt-12 border-t border-[var(--brand-surface)]/15 pt-7 text-center sm:mt-14">
              <p className="ky-note text-[var(--brand-surface)]/65">
                {t.menu.pageIntro}
              </p>
            </div>
          </div>
        </div>

        {/*
          Kapanis KARTIN DISINDA: menu kagidi bitti, sayfa devam ediyor. Kisa
          bir cift cizgi (tabela imzasi) ve ana sayfaya donus. Sozlukte "geri
          don" karsiligi yok; isletme adi bu tasarimda zaten tabelanin kendisi,
          dolayisiyla adin uzerine basmak "tabelaya don" demek oluyor.
        */}
        <div className="mt-14 text-center sm:mt-16">
          <DoubleRuleDark className="mx-auto w-[180px]" />

          <div className="pt-10">
            <Link href={`/${content.locale}`} className={buttonGhostDark}>
              {name}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
