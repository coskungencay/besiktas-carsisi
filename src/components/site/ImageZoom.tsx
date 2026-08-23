"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Kucuk bir gorseli tiklaninca buyuk gosteren kapak.
 *
 * NEDEN <dialog>: odak tuzagi, Esc ile kapanma, arkadaki icerigin ekran
 * okuyuculardan gizlenmesi ve arka plan kaplamasi TARAYICIDAN geliyor. Elle
 * yazilmis bir modal'da bunlarin hepsini yeniden kurmak gerekirdi ve
 * genellikle biri eksik kalir.
 *
 * NEDEN BUYUK GORSEL SONRADAN: <Image> her zaman basilsaydi, menudeki her
 * urun icin 1920px'lik dosya sayfa acilir acilmaz kuyruga girerdi (13 urunlu
 * bir menude megabaytlarca gereksiz indirme). Buyuk gorsel yalnizca kapak
 * ACILDIGINDA render ediliyor.
 *
 * Kucuk kare, cagiran tarafin verdigi kutuyu doldurur; bicim (kose yaricapi,
 * zemin) tema token'larindan gelir, burada sabit renk yoktur.
 */
export function ImageZoom({
  thumbSrc,
  fullSrc,
  alt,
  openLabel,
  closeLabel,
  sizes = "64px",
}: {
  thumbSrc: string;
  /** Buyuk surum. Bos gelirse kucuk surum buyutulur. */
  fullSrc: string;
  alt: string;
  /** Butonun erisilebilir adi, orn. "Vanilyalı Ice Latte görselini büyüt". */
  openLabel: string;
  closeLabel: string;
  sizes?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // showModal() render'dan SONRA cagrilmali; aksi halde icerik henuz
    // yokken kapak aciliyor ve ilk karede bos bir kutu goruluyor.
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={openLabel}
        /*
         * absolute inset-0: cagiran tarafin verdigi kareyi tam doldurur, yani
         * gorselin gorunen boyutu bu bilesen eklenmeden onceki haliyle ayni
         * kalir. cursor-zoom-in tiklanabilir oldugunu isaret eder.
         */
        className="absolute inset-0 cursor-zoom-in"
      >
        <Image src={thumbSrc} alt="" fill sizes={sizes} className="object-cover" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label={alt}
        onClose={() => setOpen(false)}
        /*
         * Kapak DISINA tiklayinca kapanir. <dialog> tiklamalarinda hedef,
         * bosluga basildiginda dialog'un KENDISI olur; icerige basildiginda
         * ic ogelerden biri. Karsilastirma bu yuzden dogru calisiyor.
         */
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        className="m-auto max-h-[90dvh] max-w-[min(92vw,900px)] rounded-[var(--brand-radius)] bg-[var(--brand-surface)] p-0 text-[var(--brand-ink)] backdrop:bg-black/70"
      >
        {open ? (
          <div className="flex flex-col">
            <Image
              src={fullSrc || thumbSrc}
              alt={alt}
              width={1200}
              height={1200}
              sizes="(min-width: 900px) 900px, 92vw"
              className="h-auto max-h-[78dvh] w-full object-contain"
            />
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              {/* Gorselin adi kapakta da yaziyor: buyutulen seyin ne oldugu,
                  menuye geri donmeden anlasilsin. */}
              <p className="brand-body min-w-0 truncate text-sm text-[var(--brand-ink-muted)]">
                {alt}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="brand-body brand-rounded shrink-0 bg-[var(--brand-primary)] px-3 py-1.5 text-xs font-medium text-[var(--brand-primary-contrast)]"
              >
                {closeLabel}
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
