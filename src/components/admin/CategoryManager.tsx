"use client";

import { useActionState, useState } from "react";

import {
  deleteCategoryAction,
  reorderCategoriesAction,
  saveCategoryAction,
} from "@/actions/menu";
import { SortableList } from "@/components/admin/SortableList";
import {
  FormMessage,
  SubmitButton,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/ui";
import type { MenuCategoryRow } from "@/db/schema";
import { IDLE } from "@/lib/action-result";

export function CategoryManager({
  categories,
}: {
  categories: MenuCategoryRow[];
}) {
  const [saveState, saveAction] = useActionState(saveCategoryAction, IDLE);
  const [deleteState, deleteAction] = useActionState(deleteCategoryAction, IDLE);
  const [editing, setEditing] = useState<MenuCategoryRow | null>(null);

  return (
    <section className={cardClass} aria-labelledby="categories-title">
      <h2 id="categories-title" className="text-lg font-semibold">
        Kategoriler
      </h2>

      <form
        action={saveAction}
        key={editing?.id ?? "new"}
        className="mt-4 flex flex-wrap items-end gap-3"
      >
        {editing ? (
          <input type="hidden" name="id" value={editing.id} />
        ) : null}

        <div className="min-w-56 flex-1">
          <label htmlFor="category-name" className={labelClass}>
            {editing ? "Kategori adını düzenle" : "Yeni kategori adı"}
          </label>
          <input
            id="category-name"
            name="name"
            required
            maxLength={80}
            defaultValue={editing?.name ?? ""}
            placeholder="Sıcak İçecekler"
            className={inputClass}
          />
        </div>

        <SubmitButton>{editing ? "Güncelle" : "Ekle"}</SubmitButton>

        {editing ? (
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Vazgeç
          </button>
        ) : null}
      </form>

      <div className="mt-2 space-y-1">
        <FormMessage state={saveState} />
        <FormMessage state={deleteState} />
      </div>

      <div className="mt-4">
        <SortableList
          action={reorderCategoriesAction}
          emptyText="Henüz kategori eklenmedi."
          items={categories.map((category) => ({
            id: category.id,
            content: (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{category.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(category)}
                    className="rounded-lg border border-zinc-300 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    Düzenle
                  </button>
                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <SubmitButton
                      variant="danger"
                      confirm={`"${category.name}" kategorisi ve içindeki TÜM ürünler silinecek. Emin misiniz?`}
                    >
                      Sil
                    </SubmitButton>
                  </form>
                </div>
              </div>
            ),
          }))}
        />
      </div>
    </section>
  );
}
