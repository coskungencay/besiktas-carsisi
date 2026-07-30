"use client";

import Image from "next/image";
import { useActionState } from "react";

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

export function GalleryManager({ images }: { images: GalleryImageRow[] }) {
  const [uploadState, uploadAction] = useActionState(uploadGalleryAction, IDLE);
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
              className="mt-1.5 block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Tek seferde en fazla 30 dosya, dosya başına 12 MB. Görseller
              otomatik olarak WebP&apos;ye çevrilir ve küçültülür.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <SubmitButton>Yükle</SubmitButton>
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
