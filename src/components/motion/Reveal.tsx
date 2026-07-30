"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Saniye cinsinden gecikme. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "figure";
};

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
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
