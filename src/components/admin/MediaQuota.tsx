import { mediaUsage } from "@/lib/uploads";

function mb(bytes: number): string {
  const value = bytes / 1024 / 1024;
  // 1 MB altindaki degerlerde "0 MB" yazmak doluluk hissini yok ediyor.
  return value < 1 && value > 0 ? "<1 MB" : `${Math.round(value)} MB`;
}

/**
 * Medya kotasi gostergesi.
 *
 * Yukleme yapilabilen her panel sayfasinin ustunde durur. Sayim DISKTEN
 * okunur (bkz. lib/uploads.ts): buradaki MB, yuklenen dosyalarin toplami
 * degil diskte GERCEKTEN tutulan yerdir — her medyanin uc varyanti (ana
 * WebP + thumb + orijinal) dahil.
 *
 * Esikler yuzde uzerinden calisiyor, sabit sayilar uzerinden degil; bu yuzden
 * kotalar degistiginde (bkz. MAX_MEDIA_COUNT / MAX_MEDIA_BYTES) burada
 * dokunulacak bir sey yok.
 */
export async function MediaQuota() {
  const { count, bytes, maxCount, maxBytes } = await mediaUsage();

  const countPct = Math.min(100, Math.round((count / maxCount) * 100));
  const bytesPct = Math.min(100, Math.round((bytes / maxBytes) * 100));
  const fullest = Math.max(countPct, bytesPct);

  /* Dolmaya yaklasinca renk degistir: %90 kirmizi, %75 amber, altinda notr. */
  const tone =
    fullest >= 90
      ? { bar: "bg-red-500", text: "text-red-700" }
      : fullest >= 75
        ? { bar: "bg-amber-500", text: "text-amber-700" }
        : { bar: "bg-zinc-800", text: "text-zinc-600" };

  return (
    <section
      aria-label="Medya kullanımı"
      className="rounded-lg border border-zinc-200 bg-white p-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-sm font-medium text-zinc-900">Medya kullanımı</h2>
        <p className={`text-sm tabular-nums ${tone.text}`}>
          {count} / {maxCount} dosya · {mb(bytes)} / {mb(maxBytes)}
        </p>
      </div>

      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100"
        role="progressbar"
        aria-valuenow={fullest}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Kullanılan medya alanı"
      >
        <div
          className={`h-full rounded-full transition-[width] ${tone.bar}`}
          style={{ width: `${Math.max(fullest, 2)}%` }}
        />
      </div>

      {fullest >= 75 ? (
        <p className="mt-2 text-xs leading-relaxed text-zinc-600">
          Alan dolmak üzere. Kullanmadığınız fotoğrafları galeriden veya mağazalardan
          silerseniz yer açılır.
        </p>
      ) : null}
    </section>
  );
}
