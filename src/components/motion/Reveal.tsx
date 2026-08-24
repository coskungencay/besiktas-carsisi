"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Belirme bicimleri.
 *
 * NEDEN BIRDEN FAZLA: tek bir "yukari kay + soluk" hareketi sayfanin her
 * yerinde tekrarlaninca goze tek bir tik gibi geliyordu. Ogenin TURU hareketi
 * belirlemeli — bir fotograf perde acilir gibi, bir baslik asagidan yukari,
 * bir kunye yalnizca solarak gelmeli.
 */
type RevealVariant =
  /** Asagidan yukari suzulme — metin bloklari ve liste satirlari icin. */
  | "up"
  /** Yalnizca opaklik — hareketi rahatsiz edecek kucuk kunye satirlari icin. */
  | "fade"
  /** Cok hafif buyume — kart ve rozet gibi butun bloklar icin. */
  | "scale"
  /** Perde acilir gibi asagidan yukari acilma — FOTOGRAFLAR icin. */
  | "clip";

type RevealProps = {
  children: ReactNode;
  /** Saniye cinsinden gecikme. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "figure";
  variant?: RevealVariant;
};

const VARIANTS = {
  up: {
    initial: { opacity: 0, y: 16 },
    inView: { opacity: 1, y: 0 },
    duration: 0.5,
  },
  fade: {
    initial: { opacity: 0 },
    inView: { opacity: 1 },
    duration: 0.7,
  },
  scale: {
    initial: { opacity: 0, scale: 0.97, y: 10 },
    inView: { opacity: 1, scale: 1, y: 0 },
    duration: 0.65,
  },
  /*
   * clipPath ile perde: yukseklik degismedigi icin layout kaymasi olmaz ve
   * fotografin kendisi kirpilmaz — yalnizca gorunur alani buyur.
   */
  clip: {
    initial: { opacity: 0, clipPath: "inset(14% 0% 0% 0%)" },
    inView: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
    duration: 0.85,
  },
} as const satisfies Record<
  RevealVariant,
  { initial: Record<string, unknown>; inView: Record<string, unknown>; duration: number }
>;

/**
 * Viewport'a girince yumusak bir sekilde beliren sarmalayici.
 * prefers-reduced-motion aktifse animasyon TAMAMEN devre disi kalir
 * (icerik aninda ve tam opaklikta gorunur).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  variant = "up",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const config = VARIANTS[variant];

  return (
    <MotionTag
      // data-reveal: JavaScript kapaliyken globals.css icindeki <noscript>
      // kurali bu elemanlari gorunur yapar (yoksa sayfa bos gorunurdu).
      data-reveal=""
      className={className}
      initial={config.initial}
      whileInView={config.inView}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: config.duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
