"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Latin } from "@/components/site/Latin";
import { fill } from "@/i18n";
import type { Messages } from "@/i18n";
import type { Testimonial } from "@/themes/types";

/* -------------------------------------------------------------------------- */
/*                                  Yildizlar                                  */
/* -------------------------------------------------------------------------- */

function StarRow({ className = "" }: { className?: string }) {
  return (
    <span className={`flex gap-[3px] ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="size-[15px] shrink-0">
          <path d="M10 1.6l2.47 5.3 5.53.72-4.07 3.9 1.04 5.62L10 14.4l-4.97 2.74 1.04-5.62L2 7.62l5.53-.72z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Kesirli puan gostergesi (orn. 4,3 -> dort tam, besincisi %30 dolu).
 *
 * Iki kat: altta bos yildizlar, ustte dolu yildizlarin YUZDEYLE kirpilmis
 * kopyasi. `dir="ltr"`: yildiz seridi Arapca sayfada da soldan saga okunur;
 * sablon telefon ve saat araligi icin de ayni istisnayi uyguluyor.
 */
function Stars({ value, label }: { value: number; label: string }) {
  const percent = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="relative inline-flex" dir="ltr" role="img" aria-label={label}>
      <StarRow className="text-[var(--bo-star-empty)]" />
      <span
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${percent}%` }}
      >
        <StarRow className="text-[var(--bo-star)]" />
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Kart                                     */
/* -------------------------------------------------------------------------- */

/**
 * Yorum karti. `href` verilmisse baglanti, verilmemisse duz bir kutu.
 *
 * NEDEN KOSULLU: yorumlar Google'dan geliyor ve tam metni orada. Karta
 * tiklayinca Google'daki yorumlar sayfasi acilir. Ama carsi yonetimi panele
 * Google baglantisi girmediyse tiklanabilir gorunen ama hicbir yere gitmeyen
 * bir kart birakmak yanlis olurdu.
 *
 * `interactive` false iken (yandaki yarim kartlar) baglanti klavye sirasindan
 * ve ekran okuyucudan cikarilir: gorunmeyen bir seye Tab ile gidilmemeli.
 */
function Card({
  href,
  label,
  interactive,
  className,
  children,
}: {
  href?: string;
  label: string;
  interactive: boolean;
  className: string;
  children: React.ReactNode;
}) {
  if (!href) return <figure className={className}>{children}</figure>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      tabIndex={interactive ? undefined : -1}
      className={className}
    >
      {children}
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Karusel                                    */
/* -------------------------------------------------------------------------- */

const AUTOPLAY_MS = 5500;
/** Parmakla kaydirmanin slayt degistirmesi icin gereken en az mesafe (px). */
const SWIPE_THRESHOLD = 45;

/**
 * Yorum karuseli — uclu kart, ortadaki one cikar, SONSUZ dongu.
 *
 * SONSUZ DONGU NASIL: liste UC KEZ basiliyor ve karusel ortadaki kopyada
 * basliyor. Kullanici saga ya da sola giderken hep dolu bir serit goruyor;
 * indeks bir kopyanin sinirini gecince, gecis animasyonu KAPATILIP ayni
 * gorsel konuma denk gelen orta kopyaya sessizce donuluyor. Ziyaretci
 * hicbir zaman "basa sardi" hissi yasamaz.
 *
 * NEDEN scroll-snap DEGIL: onceki surum tarayicinin kaydirmasini kullaniyordu;
 * bedava dokunmatik destegi geliyordu ama son slayttan ilkine donerken serit
 * gozle gorulur sekilde geri sariyordu. Sonsuz his icin konum kontrolu
 * bizde olmali.
 *
 * Dokunmatik: pointer olaylariyla yatay surukleme. Dikey kaydirma
 * ENGELLENMIYOR — parmak agirlikli olarak dikey hareket ediyorsa surukleme
 * hic baslamiyor, yoksa sayfayi asagi kaydirmak imkansiz olurdu.
 */
export function TestimonialsCarousel({
  items,
  messages,
  dir,
  reviewsUrl,
}: {
  items: Testimonial[];
  messages: Messages;
  /** Sayfanin yonu; RTL'de serit ters yone kayar. */
  dir: "ltr" | "rtl";
  /** Doluysa her kart Google yorumlarina giden bir baglanti olur. */
  reviewsUrl?: string;
}) {
  const t = messages.testimonials;
  const count = items.length;

  /*
   * Uc kopya: [0..n-1][0..n-1][0..n-1]. Orta kopyanin ilk ogesinden basliyoruz.
   * Tek slayt varsa dongunun anlami yok — kopya da cikarilmiyor.
   */
  const looped = count > 1 ? [...items, ...items, ...items] : items;
  const start = count > 1 ? count : 0;

  const [index, setIndex] = useState(start);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLUListElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);

  const sign = dir === "rtl" ? 1 : -1;

  /* Sinira gelince gecisi kapatip orta kopyaya sessizce don. */
  useEffect(() => {
    if (count < 2) return;
    if (index >= start && index < start + count) return;

    const timer = window.setTimeout(() => {
      setAnimate(false);
      setIndex((i) => ((i % count) + count) % count + start);
    }, 620); // gecis suresiyle ayni

    return () => window.clearTimeout(timer);
  }, [index, count, start]);

  /* Sessiz sicramadan sonra gecisi tekrar ac. */
  useEffect(() => {
    if (animate) return;
    const raf = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  const go = useCallback((delta: number) => setIndex((i) => i + delta), []);

  /* Otomatik gecis. */
  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, count, go]);

  /* --------------------------- dokunmatik surukleme ------------------------ */

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") return; // farede oklar var
    dragStart.current = { x: event.clientX, y: event.clientY };
    dragging.current = false;
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const origin = dragStart.current;
    if (!origin) return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    // Dikey agirlikli hareket = sayfayi kaydirmak istiyor; karisma.
    if (!dragging.current && Math.abs(dy) > Math.abs(dx)) {
      dragStart.current = null;
      return;
    }
    if (Math.abs(dx) > 8) dragging.current = true;
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const origin = dragStart.current;
    dragStart.current = null;
    if (!origin || !dragging.current) return;
    const dx = event.clientX - origin.x;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    // Sola surukleme (dx<0) LTR'de ileri, RTL'de geri.
    go(dx < 0 ? -sign : sign);
  };

  if (count === 0) return null;

  /** Ekranda kac kart var — CSS ile ayni deger (mobil 1, sm+ 3). */
  const activeReal = ((index % count) + count) % count;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={t.eyebrow}
    >
      {/*
        Serit tasan kartlari GIZLEMEZ, kirpar: uclu duzende yandaki kartlarin
        yarisi gorunsun diye kap genisliginden tasan kisim overflow-hidden ile
        kesiliyor.
      */}
      <div className="overflow-hidden">
        <ul
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (dragStart.current = null)}
          className={`flex touch-pan-y ${animate ? "transition-transform duration-[620ms] ease-[cubic-bezier(0.16,0.8,0.24,1)] motion-reduce:transition-none" : ""}`}
          style={{
            /*
             * Kart genisligi ve ORTALAMA KAYMASI CSS'ten geliyor:
             *   mobil : 1 kart gorunur, kayma 0  -> aktif kart tam ekran
             *   sm+   : 3 kart gorunur, kayma 1  -> aktif kart ORTADA
             * JS ekran genisligi olcmuyor; yeniden boyutlamada bozulmuyor.
             */
            transform: `translateX(calc(${sign} * (${index} - var(--bo-card-offset)) * var(--bo-card-w)))`,
          }}
        >
          {looped.map((item, i) => {
            const isActive = i === index;
            return (
              <li
                key={`${item.id}-${i}`}
                aria-hidden={!isActive}
                className="w-[var(--bo-card-w)] shrink-0 px-3"
              >
                {/*
                  ORTADAKI KART one cikar: tam opaklik, kalin cerceve, hafif
                  buyume. Yanlardakiler geride durur — goz nereye bakacagini
                  bilir.
                */}
                <Card
                  href={reviewsUrl}
                  label={t.readOnGoogle}
                  /*
                    ORTADAKI KART one cikar: tam opaklik, kalin cerceve, hafif
                    buyume. Yanlardakiler geride durur — goz nereye bakacagini
                    bilir. Yalnizca ORTADAKI kart tiklanabilir/odaklanabilir;
                    yarim gorunen kartlar klavye sirasina girmemeli.
                  */
                  interactive={isActive}
                  className={`flex h-full flex-col gap-6 border p-7 transition-all duration-500 sm:p-8 ${
                    isActive
                      ? "border-[var(--brand-ink)] bg-[var(--brand-surface)] opacity-100 hover:border-[var(--brand-accent)] sm:scale-100"
                      : "border-[var(--brand-border)] bg-[var(--brand-surface-alt)] opacity-55 sm:scale-[0.94]"
                  } motion-reduce:transition-none motion-reduce:scale-100 motion-reduce:opacity-100`}
                >
                  {item.rating ? (
                    <Stars
                      value={item.rating}
                      label={fill(t.ratingLabel, { rating: String(item.rating) })}
                    />
                  ) : null}

                  {/*
                    Kart yuksekligi esitlenmeli ama uzun yorum kirpilmamali:
                    line-clamp ile 8 satirda duruyor, tamami Google'da.
                  */}
                  <blockquote className="line-clamp-8 flex-1 text-[15px] leading-[1.68] text-pretty text-[var(--brand-ink-soft)] sm:text-[15.5px]">
                    {item.text}
                  </blockquote>

                  <div className="bo-mono brand-eyebrow border-t border-[var(--brand-border)] pt-5 text-[12.5px] font-light text-[var(--brand-ink-muted)] sm:text-[11.5px]">
                    <Latin>{item.author}</Latin>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>

      {/*
        KONTROL SATIRI.

        ONCEKI HALI ve NEDEN DEGISTI: ok - 10 nokta - ok tek satirda duruyordu
        ve satirin en dar hali 376px'ti. 320-360px'lik telefonlarda bu satir
        SAYFAYI yatay kaydiriyor, iki ok da ekranin disina tasip yariya
        kirpiliyordu. Ustelik noktalar 3px yuksekliginde: parmakla isabet
        ettirilecek bir hedef degil, ve 10 nokta zaten "kacinci yorumdayim"
        sorusunu telefon olceginde cevaplamiyordu.

        Telefonda noktalarin yerine KONUM SAYACI ("03 / 10") geliyor: hem
        satiri 200px'in altina indiriyor hem de kac yorum oldugunu acikca
        soyluyor. Noktalar sm'den itibaren geri geliyor; orada hem yer var
        hem de isaretci ile 3px'lik bir seride isabet etmek mumkun.
      */}
      {count > 1 ? (
        <div className="mt-10 flex items-center justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t.previous}
            className="brand-frame grid size-11 shrink-0 place-items-center transition-colors hover:border-[var(--brand-ink)] hover:text-[var(--brand-accent)] sm:size-10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 rtl:-scale-x-100">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/*
            Sayac. `aria-hidden`: her yorum kartinin kendi metni zaten
            okunuyor ve oklarin etiketleri var; ekran okuyucuya ayrica
            "3 bolu 10" demek gurultu olurdu. tabular-nums: rakam
            genisligi sabit, sayac ilerlerken oklar yerinden oynamiyor.
          */}
          <p
            aria-hidden="true"
            dir="ltr"
            className="bo-mono w-[72px] shrink-0 text-center text-[13px] font-light tracking-[0.14em] tabular-nums text-[var(--brand-ink-muted)] sm:hidden"
          >
            <span className="text-[var(--brand-ink)]">
              {String(activeReal + 1).padStart(2, "0")}
            </span>
            {" / "}
            {String(count).padStart(2, "0")}
          </p>

          <ul className="hidden items-center gap-2 sm:flex">
            {items.map((item, i) => (
              <li key={item.id}>
                {/*
                  Cizgi 3px kaliyor ama DOKUNMA ALANI 36px: dis dugme
                  yuksekligi verip cizgiyi icine ortaliyoruz. Gorunum
                  degismiyor, hedef buyuyor.
                */}
                <button
                  type="button"
                  onClick={() => setIndex(start + i)}
                  aria-label={fill(t.goTo, { index: String(i + 1) })}
                  aria-current={i === activeReal ? "true" : undefined}
                  className="group flex h-9 items-center"
                >
                  <span
                    className={`block h-[3px] transition-all duration-300 ${
                      i === activeReal
                        ? "w-8 bg-[var(--brand-ink)]"
                        : "w-4 bg-[var(--brand-border)] group-hover:bg-[var(--brand-ink-muted)]"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t.next}
            className="brand-frame grid size-11 shrink-0 place-items-center transition-colors hover:border-[var(--brand-ink)] hover:text-[var(--brand-accent)] sm:size-10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 rtl:-scale-x-100">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export { Stars };
