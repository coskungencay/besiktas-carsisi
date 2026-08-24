"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Acilis ekrani — amblem, kelime-marka, ince bir cizgi, sonra kayboluyor.
 *
 * UC GUVENLIK KARARI:
 *
 * 1. TAMAMEN ISTEMCI TARAFI. Sunucu ciktisinda hic yok; `mounted` state'i
 *    true olana kadar null doner. Boylece JavaScript calismazsa ya da hata
 *    verirse ziyaretcinin onunde ASLA takili bir perde kalmaz — en kotu
 *    ihtimalde acilis ekrani hic gorunmez, site normal acilir.
 *
 * 2. OTURUMDA BIR KEZ. `sessionStorage` ile isaretleniyor; magazalar
 *    sayfasina gidip geri donen biri ayni animasyonu tekrar izlemez.
 *    localStorage DEGIL: bir sonraki ziyarette yeniden gorulmesi dogru,
 *    ama ayni gezinti icinde tekrar etmesi sinir bozucu.
 *
 * 3. HAREKET AZALTMA. `prefers-reduced-motion` acikken hic basilmaz.
 *
 * Icerik perdenin ALTINDA zaten DOM'da duruyor; arama motorlari ve ekran
 * okuyucular icin sayfa hicbir zaman bos degil. Perde `aria-hidden` ve
 * `pointer-events` kapali bicimde kayboluyor.
 */
export function IntroSplash({ name, logoUrl }: { name: string; logoUrl: string }) {
  const [phase, setPhase] = useState<"pending" | "showing" | "leaving" | "done">(
    "pending",
  );

  useEffect(() => {
    // Ayni oturumda daha once gosterildiyse hic acma.
    let seen = false;
    try {
      seen = sessionStorage.getItem("bbc:intro") === "1";
    } catch {
      /* gizli sekmede sessionStorage erisimi hata verebilir; sorun degil */
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setPhase("done");
      return;
    }

    try {
      sessionStorage.setItem("bbc:intro", "1");
    } catch {
      /* yazamadiysak da acilis bir kez gorunsun, dongu olusmaz */
    }

    setPhase("showing");

    // Perde acikken arkadaki sayfa kaymasin.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const leave = window.setTimeout(() => setPhase("leaving"), 1250);
    const finish = window.setTimeout(() => setPhase("done"), 1850);

    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(finish);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (phase === "done") document.body.style.overflow = "";
  }, [phase]);

  if (phase === "pending" || phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      data-leaving={phase === "leaving" ? "" : undefined}
      className="intro-splash"
    >
      <div className="intro-splash__inner">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt=""
            width={96}
            height={96}
            priority
            className="intro-splash__seal"
          />
        ) : null}
        <p className="intro-splash__word">{name}</p>
        <span className="intro-splash__rule" />
      </div>
    </div>
  );
}
