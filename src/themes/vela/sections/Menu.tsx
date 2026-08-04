import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import {
  allMenuItems,
  anyItemHasImage,
  featuredItems,
  hasMenu,
  itemThumb,
  menuHref,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  goldButtonOnAccent,
  SectionHead,
  sectionTop,
  shell,
  surface,
} from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ana sayfadaki menu VITRINI — tam liste artik /<dil>/menu sayfasinda.
 *
 * NEDEN VITRIN: 30+ urunlu bir kart ana sayfayi okunmaz uzunluga cikariyordu.
 * Burada yalnizca uc urun duruyor; karar veren zaten menu sayfasina geciyor.
 *
 * Tasarimin menu diline sadik kalindi: YAN YANA IKI PANEL, aralarinda bosluk
 * yok, ayrim yalnizca renk kontrastindan geliyor.
 *   - genis panel (koyu, altin cerceveli) — uc urun, satir satir
 *   - dar panel (krem) — tam menuye giden cagri
 * Olculer tasarimdan: panel dolgusu 64/60px, satir dolgusu 19px, urun adi
 * 21px, fiyat 19px, aciklama 13px.
 *
 * Bosluk bu tasarimin malzemesi; urun fotografi yalnizca musteri panelden
 * eklerse belirir ve o zaman da kucuk, altin cerceveli bir kare olarak durur.
 */
export default function Menu({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { t } = content;

  /*
   * Musteri hicbir urunu "one cikan" isaretlemediyse bolum bos kalmasin diye
   * menunun ilk uc urunune duseriz. O durumda "One cikan" etiketi BASILMAZ —
   * isaretlenmemis bir urunu one cikan gibi gostermek yalan olurdu.
   */
  const featured = featuredItems(content, 3);
  const items = featured.length > 0 ? featured : allMenuItems(content).slice(0, 3);

  const withImages = anyItemHasImage(content, items);
  if (items.length === 0) return null;

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div className={`${shell} ${sectionTop}`}>
        <Reveal>
          <SectionHead
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          />
        </Reveal>

        {/*
         * gap YOK: paneller tasarimda birbirine yapisik duruyor. Urun paneli
         * daha genis (1.6fr), cagri paneli dar (1fr) — galeri izgarasiyla ayni
         * oran. minmax(0,…) uzun urun adlarinin kolonu sismesini engeller.
         */}
        <div className="mt-16 grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Reveal>
            <div className="h-full border border-[var(--brand-frame-gold)] bg-[var(--brand-surface-alt)] px-6 py-12 sm:px-[3.75rem] sm:py-16">
              {featured.length > 0 ? (
                <h3 className="brand-body brand-eyebrow text-[0.6875rem] leading-[1.6] text-[var(--brand-primary)]">
                  {t.menu.featured}
                </h3>
              ) : null}

              <ul className={featured.length > 0 ? "mt-[1.625rem]" : ""}>
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    className={`flex items-baseline justify-between gap-6 py-[1.1875rem] sm:gap-8 ${
                      index === items.length - 1
                        ? ""
                        : "border-b border-[var(--brand-rule-soft)]"
                    }`}
                  >
                    {/* min-w-0: uzun urun adi sarsin, fiyatin uzerine binmesin. */}
                    <div className="flex min-w-0 items-center gap-4">
                      {withImages ? (
                        /*
                          Koyu butik zeminde fotograf altin bir saç teliyle
                          cevriliyor: cercevesiz birakildiginda koyu bir gorsel
                          zeminle birlesip lekeye donusuyordu.
                        */
                        <span
                          className={`relative block size-14 shrink-0 overflow-hidden rounded-[var(--brand-radius)] sm:size-16 ${itemThumb(content, item) ? "border border-[var(--brand-rule-soft)] bg-[var(--brand-surface-alt)]" : ""}`}
                        >
                          {itemThumb(content, item) ? (
                            <Image
                              src={itemThumb(content, item) as string}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : null}
                        </span>
                      ) : null}

                      <div className="min-w-0">
                      <p className="brand-display text-[1.3125rem] leading-[1.3] text-pretty">
                        {item.name}
                      </p>

                      {item.description ? (
                        <p className="mt-[0.3125rem] text-[0.8125rem] leading-[1.6] text-pretty text-[var(--brand-ink-muted)]">
                          {item.description}
                        </p>
                      ) : null}
                      </div>
                    </div>

                    {item.price ? (
                      <p
                        className="brand-display shrink-0 text-[1.1875rem] leading-[1.3] tabular-nums text-[var(--brand-primary)]"
                        dir="ltr"
                      >
                        {item.price}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/*
           * Krem panel: tasarimdaki ikinci menu paneli, burada tek isi tam
           * menuye gondermek. Dolu bir renk blogu oldugu icin sayfadaki en
           * belirgin eylem cagrisi kendiliginden burasi oluyor.
           */}
          <Reveal delay={0.12}>
            <div className="flex h-full flex-col justify-center gap-8 bg-[var(--brand-accent)] px-6 py-12 text-[var(--brand-surface)] sm:px-[3.75rem] sm:py-16">
              <p className="brand-display text-[clamp(1.5rem,2.6vw,1.875rem)] leading-[1.35] text-pretty">
                {t.menu.pageIntro}
              </p>

              {/*
               * Temanin tek buton bicimi, krem zemin varyanti. self-start:
               * buton panelin genisligine yayilmasin, tasarimdaki gibi metin
               * kadar yer kaplasin.
               */}
              <Link
                href={menuHref(content)}
                className={`${goldButtonOnAccent} self-start`}
              >
                {t.menu.viewAll}
                <ArrowIcon className="size-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
