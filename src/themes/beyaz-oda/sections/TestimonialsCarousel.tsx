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
 * kopyasi. Gradyan/mask yerine `overflow:hidden` + genislik kullaniliyor —
 * tarayici destegi tam ve tek bir id catismasi riski yok.
 *
 * `dir="ltr"`: yildiz seridi Arapca sayfada da soldan saga okunur; sablon
 * telefon ve saat araligi icin de ayni istisnayi uyguluyor.
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
/*                                  Karusel                                    */
/* -------------------------------------------------------------------------- */

const AUTOPLAY_MS = 7000;

/**
 * Yorum karuseli.
 *
 * NEDEN scroll-snap: kaydirmayi TARAYICI yapiyor. Dokunmatik cihazda parmakla
 * kaydirma, klavyede ok tuslari ve RTL yon cevrimi bedava geliyor; JS yalnizca
 * hangi yorumun ortada oldugunu izliyor ve butonlari o slayta goturuyor.
 * Elle transform hesaplayan bir karusel bunlarin ucunu de tek tek yazmayi
 * gerektirirdi ve Arapca'da ters calisirdi.
 *
 * Otomatik gecis, kullanici uzerine geldiginde / odaklandiginda ve
 * `prefers-reduced-motion` acikken DURUR.
 */
export function TestimonialsCarousel({
  items,
  messages,
}: {
  items: Testimonial[];
  messages: Messages;
}) {
  const t = messages.testimonials;
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  /*
   * Serit yuksekligi AKTIF slayta gore ayarlaniyor.
   *
   * NEDEN: flex serit dogal olarak EN UZUN slayt kadar yukselir. Yorumlarin
   * uzunlugu 165 ile 500 karakter arasinda degisiyor; kisa bir yorum
   * gosterilirken altinda yarim ekranlik bos alan kaliyordu. Yukseklik
   * gecisli oldugu icin kutu icerikle birlikte "nefes aliyor".
   *
   * null iken hic stil verilmez — JS calismazsa serit dogal (en uzun)
   * yuksekliginde kalir ve hicbir yorum kirpilmaz.
   */
  const [trackHeight, setTrackHeight] = useState<number | null>(null);

  /* Ortadaki slaydi izle — parmakla kaydirinca da noktalar guncellensin. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { root: track, threshold: 0.6 },
    );

    for (const slide of track.children) observer.observe(slide);
    return () => observer.disconnect();
  }, [items.length]);

  /* Aktif slaydin yuksekligini olc; yaziyaz akisi degisirse (yeniden boyutlama,
     font yuklenmesi) tekrar olc. */
  useEffect(() => {
    const track = trackRef.current;
    const slide = track?.children[active] as HTMLElement | undefined;
    if (!track || !slide) return;

    const measure = () => setTrackHeight(slide.scrollHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(slide);
    return () => observer.disconnect();
  }, [active, items.length]);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!slide) return;
    /*
     * block:"nearest" ZORUNLU: yoksa tarayici slaydi dikeyde de ortalamaya
     * calisir ve sayfa yorum bolumune ziplar.
     */
    slide.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  /* Otomatik gecis. */
  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActive((current) => {
        const next = (current + 1) % items.length;
        goTo(next);
        return next;
      });
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, items.length, goTo]);

  if (items.length === 0) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <ul
        ref={trackRef}
        /*
         * scrollbar gizli: serit zaten noktalarla ve oklarla yonetiliyor,
         * altta duran bir cubuk tasarimin sadeligini bozuyordu.
         */
        className="bo-track flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden pb-2 transition-[height] duration-500 ease-[cubic-bezier(0.16,0.8,0.24,1)] motion-reduce:transition-none"
        style={trackHeight !== null ? { height: trackHeight } : undefined}
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            data-index={index}
            className="w-full shrink-0 snap-center self-start"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${items.length}`}
          >
            <figure className="flex flex-col items-start gap-7 border-t border-[var(--brand-ink)] pt-8">
              <blockquote className="brand-display max-w-[46ch] text-[clamp(1.25rem,2.3vw,1.875rem)] leading-[1.42] tracking-[-0.02em] text-pretty">
                {item.text}
              </blockquote>

              <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="bo-mono brand-eyebrow text-[11.5px] font-light text-[var(--brand-ink-muted)]">
                  <Latin>{item.author}</Latin>
                </span>
                {item.rating ? (
                  <Stars
                    value={item.rating}
                    label={fill(t.ratingLabel, { rating: String(item.rating) })}
                  />
                ) : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {items.length > 1 ? (
        <div className="mt-8 flex items-center justify-between gap-6">
          {/* Noktalar */}
          <ul className="flex items-center gap-2">
            {items.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={fill(t.goTo, { index: String(index + 1) })}
                  aria-current={index === active ? "true" : undefined}
                  className={`block h-[3px] transition-all duration-300 ${
                    index === active
                      ? "w-8 bg-[var(--brand-ink)]"
                      : "w-4 bg-[var(--brand-border)] hover:bg-[var(--brand-ink-muted)]"
                  }`}
                />
              </li>
            ))}
          </ul>

          {/* Oklar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo((active - 1 + items.length) % items.length)}
              aria-label={t.previous}
              className="brand-frame grid size-10 place-items-center transition-colors hover:border-[var(--brand-ink)] hover:text-[var(--brand-accent)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 rtl:-scale-x-100">
                <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo((active + 1) % items.length)}
              aria-label={t.next}
              className="brand-frame grid size-10 place-items-center transition-colors hover:border-[var(--brand-ink)] hover:text-[var(--brand-accent)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 rtl:-scale-x-100">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { Stars };
