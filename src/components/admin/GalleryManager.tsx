"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import {
  deleteGalleryImageAction,
  reorderGalleryAction,
  updateGalleryAltAction,
  uploadGalleryAction,
} from "@/actions/gallery";
import { SortableList } from "@/components/admin/SortableList";
import {
  FormMessage,
  SubmitButton,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/ui";
import type { GalleryImageRow } from "@/db/schema";
import { IDLE } from "@/lib/action-result";
import { thumbUrl } from "@/lib/format";
import {
  MAX_ACTION_BYTES,
  MAX_BATCH_FILES,
  MAX_UPLOAD_BYTES,
  formatBytes,
} from "@/lib/upload-limits";

export function GalleryManager({ images }: { images: GalleryImageRow[] }) {
  const [uploadState, uploadAction] = useActionState(uploadGalleryAction, IDLE);

  /*
   * SECIM ANINDA UYARI.
   *
   * Server action govdesi bellekte tamponlanir ve tavani asilirsa istek
   * uygulama koduna HIC varmaz: Next 413 doner, kullanici da anlamli bir
   * uyari degil ham "Application error" ekrani gorur. Yani sunucu tarafi
   * kontrolu bu durumda gec kaliyor.
   *
   * Bu yuzden kontrol dosyalar SECILIR SECILMEZ burada yapiliyor: kullanici
   * 40 MB'lik bir secimin neden gitmeyecegini gonder tusuna basmadan once,
   * rakamlariyla goruyor. Sunucudaki ayni kontrol yine duruyor (JS kapali
   * ya da elle olusturulmus istekler icin).
   */
  const [pick, setPick] = useState<{ count: number; bytes: number } | null>(
    null,
  );

  const tooManyFiles = pick !== null && pick.count > MAX_BATCH_FILES;
  const tooLarge = pick !== null && pick.bytes > MAX_ACTION_BYTES;
  const blocked = tooManyFiles || tooLarge;
  const [altState, altAction] = useActionState(updateGalleryAltAction, IDLE);
  const [deleteState, deleteAction] = useActionState(
    deleteGalleryImageAction,
    IDLE,
  );

  return (
    <div className="space-y-6">
      <section className={cardClass} aria-labelledby="upload-title">
        <h2 id="upload-title" className="text-lg font-semibold">
          Görsel Yükle
        </h2>

        <form action={uploadAction} className="mt-4 space-y-3">
          <div>
            <label htmlFor="gallery-files" className={labelClass}>
              Fotoğraflar (birden fazla seçebilirsiniz)
            </label>
            <input
              id="gallery-files"
              type="file"
              name="files"
              accept="image/*"
              multiple
              required
              onChange={(event) => {
                const files = Array.from(event.currentTarget.files ?? []);
                setPick(
                  files.length === 0
                    ? null
                    : {
                        count: files.length,
                        bytes: files.reduce((sum, f) => sum + f.size, 0),
                      },
                );
              }}
              className="mt-1.5 block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
            {/*
              Yazili sinir artik GERCEKTEN gecerli olan sinir. Onceden
              "30 dosya x 12 MB" yaziyordu — yani 360 MB — ama cerceve
              1 MB'da kesiyordu; vaat ile davranis arasinda 360 katlik fark
              vardi ve kullanici bunu ancak hata ekraniyla ogreniyordu.
            */}
            <p className="mt-1 text-xs text-zinc-500">
              Tek seferde en fazla {MAX_BATCH_FILES} dosya, dosya başına{" "}
              {formatBytes(MAX_UPLOAD_BYTES)}, toplam{" "}
              {formatBytes(MAX_ACTION_BYTES)}. Görseller otomatik olarak
              WebP&apos;ye çevrilir ve küçültülür.
            </p>

            {pick ? (
              <p
                className={`mt-2 text-xs ${blocked ? "font-semibold text-red-700" : "text-zinc-600"}`}
                role={blocked ? "alert" : undefined}
              >
                {pick.count} dosya seçildi · {formatBytes(pick.bytes)}
                {tooManyFiles
                  ? ` — tek seferde en fazla ${MAX_BATCH_FILES} dosya yükleyebilirsiniz.`
                  : tooLarge
                    ? ` — tek seferde en fazla ${formatBytes(MAX_ACTION_BYTES)} yükleyebilirsiniz. Daha az dosya seçip birkaç kez yükleyin.`
                    : ""}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <SubmitButton disabled={blocked}>Yükle</SubmitButton>
            <FormMessage state={uploadState} />
          </div>
        </form>
      </section>

      <section className={cardClass} aria-labelledby="gallery-list-title">
        <h2 id="gallery-list-title" className="text-lg font-semibold">
          Galerideki Görseller ({images.length})
        </h2>

        <div className="mt-2 space-y-1">
          <FormMessage state={altState} />
          <FormMessage state={deleteState} />
        </div>

        <div className="mt-4">
          <SortableList
            action={reorderGalleryAction}
            emptyText="Galeriye henüz görsel eklenmedi."
            items={images.map((image, index) => ({
              id: image.id,
              content: (
                <div className="flex flex-wrap items-center gap-3">
                  <Image
                    src={thumbUrl(image.url)}
                    alt={image.alt || `Galeri görseli ${index + 1}`}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-lg border border-zinc-200 object-cover"
                  />

                  <form
                    action={altAction}
                    className="flex min-w-56 flex-1 items-end gap-2"
                  >
                    <input type="hidden" name="id" value={image.id} />
                    <div className="flex-1">
                      <label
                        htmlFor={`alt-${image.id}`}
                        className="text-xs font-medium text-zinc-600"
                      >
                        Görsel açıklaması (erişilebilirlik & SEO)
                      </label>
                      <input
                        id={`alt-${image.id}`}
                        name="alt"
                        defaultValue={image.alt}
                        maxLength={200}
                        placeholder="Pencere kenarında kahve ve kitap"
                        className={`${inputClass} mt-1`}
                      />
                    </div>
                    <SubmitButton variant="secondary">Kaydet</SubmitButton>
                  </form>

                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={image.id} />
                    <SubmitButton
                      variant="danger"
                      confirm="Bu görsel kalıcı olarak silinecek. Emin misiniz?"
                    >
                      Sil
                    </SubmitButton>
                  </form>
                </div>
              ),
            }))}
          />
        </div>
      </section>
    </div>
  );
}
