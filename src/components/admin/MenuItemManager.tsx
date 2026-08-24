"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import {
  deleteItemAction,
  reorderItemsAction,
  saveItemAction,
} from "@/actions/menu";
import { SortableList } from "@/components/admin/SortableList";
import {
  FieldError,
  FormMessage,
  SubmitButton,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/ui";
import type { MenuCategoryRow, MenuItemRow } from "@/db/schema";
import { IDLE } from "@/lib/action-result";
import { formatPrice, thumbUrl } from "@/lib/format";

export function MenuItemManager({
  categories,
  items,
}: {
  categories: MenuCategoryRow[];
  items: MenuItemRow[];
}) {
  const [saveState, saveAction] = useActionState(saveItemAction, IDLE);
  const [deleteState, deleteAction] = useActionState(deleteItemAction, IDLE);
  const [editing, setEditing] = useState<MenuItemRow | null>(null);

  if (categories.length === 0) {
    return (
      <section className={cardClass}>
        <h2 className="text-lg font-semibold">Mağazalar</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Mağaza eklemek için önce en az bir kategori oluşturun.
        </p>
      </section>
    );
  }

  return (
    <section className={cardClass} aria-labelledby="items-title">
      <h2 id="items-title" className="text-lg font-semibold">
        Mağazalar
      </h2>

      <form
        action={saveAction}
        key={editing?.id ?? "new"}
        className="mt-4 space-y-4 rounded-lg bg-zinc-50 p-4"
      >
        <p className="text-sm font-semibold text-zinc-700">
          {editing ? `Düzenleniyor: ${editing.name}` : "Yeni mağaza ekle"}
        </p>

        {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
        <input
          type="hidden"
          name="imageUrl"
          value={editing?.imageUrl ?? ""}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="item-name" className={labelClass}>
              Mağaza adı <span className="text-red-600">*</span>
            </label>
            <input
              id="item-name"
              name="name"
              required
              maxLength={120}
              defaultValue={editing?.name ?? ""}
              placeholder="Filtre Kahve"
              className={inputClass}
            />
            <FieldError state={saveState} name="name" />
          </div>

          <div>
            <label htmlFor="item-category" className={labelClass}>
              Kategori <span className="text-red-600">*</span>
            </label>
            <select
              id="item-category"
              name="categoryId"
              required
              defaultValue={editing?.categoryId ?? categories[0]?.id ?? ""}
              className={inputClass}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FieldError state={saveState} name="categoryId" />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="item-description" className={labelClass}>
              Kat / kapı no ve kısa açıklama
            </label>
            <textarea
              id="item-description"
              name="description"
              rows={2}
              placeholder="Örn. Zemin kat, No: 42 — kadın ayakkabı ve aksesuar"
              maxLength={600}
              defaultValue={editing?.description ?? ""}
              className={`${inputClass} resize-y`}
            />
            <FieldError state={saveState} name="description" />
          </div>

          {/*
            CARSI UYARLAMASI: sablonun "Fiyat (TL)" alani burada YOK.
            Carsida kiralanan bagimsiz dukkanlar var; magazanin kendi fiyati
            diye bir sey yok, olsa da carsi yonetimi onu bilmez.

            Alan tamamen silinmedi, GIZLI olarak 0 gonderiliyor: sunucu semasi
            (menuItemSchema.price) hala bir sayi bekliyor ve icerik katmani
            0'i "fiyat gosterme" olarak okuyor (bkz. lib/format.ts formatPrice).
            Boylece sablonla uyum bozulmadan alan aradan cikiyor.
          */}
          <input type="hidden" name="price" value="0" />

          <div>
            <label htmlFor="item-image" className={labelClass}>
              Görsel
            </label>
            <input
              id="item-image"
              type="file"
              name="imageFile"
              accept="image/*"
              className="mt-1.5 block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
            {editing?.imageUrl ? (
              <p className="mt-1 text-xs text-zinc-500">
                Yeni dosya seçmezseniz mevcut görsel korunur.
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={editing?.isFeatured ?? false}
                className="h-4 w-4 rounded border-zinc-300"
              />
              Ana sayfada öne çıkar
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={editing?.isActive ?? true}
                className="h-4 w-4 rounded border-zinc-300"
              />
              Sitede göster
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton>{editing ? "Mağazayı Güncelle" : "Mağaza Ekle"}</SubmitButton>
          {editing ? (
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              Vazgeç
            </button>
          ) : null}
          <FormMessage state={saveState} />
        </div>
      </form>

      <div className="mt-3">
        <FormMessage state={deleteState} />
      </div>

      <div className="mt-4">
        <SortableList
          action={reorderItemsAction}
          emptyText="Henüz mağaza eklenmedi."
          items={items.map((item) => {
            const category = categories.find((c) => c.id === item.categoryId);
            return {
              id: item.id,
              content: (
                <div className="flex flex-wrap items-center gap-3">
                  {item.imageUrl ? (
                    <Image
                      src={thumbUrl(item.imageUrl)}
                      alt=""
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-lg border border-zinc-200 object-cover"
                    />
                  ) : null}

                  <div className="min-w-40 flex-1">
                    <p className="font-medium">
                      {item.name}
                      {!item.isActive ? (
                        <span className="ml-2 rounded bg-zinc-200 px-1.5 py-0.5 text-xs font-semibold text-zinc-700">
                          gizli
                        </span>
                      ) : null}
                      {item.isFeatured ? (
                        <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">
                          öne çıkan
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {category?.name ?? "—"}
                      {item.price > 0 ? ` · ${formatPrice(item.price)}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(item)}
                      className="rounded-lg border border-zinc-300 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                    >
                      Düzenle
                    </button>
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <SubmitButton
                        variant="danger"
                        confirm={`"${item.name}" silinsin mi?`}
                      >
                        Sil
                      </SubmitButton>
                    </form>
                  </div>
                </div>
              ),
            };
          })}
        />
      </div>
    </section>
  );
}
