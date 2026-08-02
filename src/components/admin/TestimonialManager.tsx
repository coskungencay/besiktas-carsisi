"use client";

import { useActionState, useState } from "react";

import {
  deleteTestimonialAction,
  reorderTestimonialsAction,
  saveTestimonialAction,
} from "@/actions/testimonials";
import {
  FieldError,
  FormMessage,
  SubmitButton,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/ui";
import { SortableList } from "@/components/admin/SortableList";
import type { TestimonialRow } from "@/db/schema";
import { IDLE } from "@/lib/action-result";

/**
 * Yorum yonetimi: ekle / duzenle / sil / sirala.
 *
 * Duzenleme ayri bir sayfa yerine ayni formda yapilir (secili kayit forma
 * yuklenir); panelde tek ekranda kalmak musteri icin daha az kayboluyor.
 */
export function TestimonialManager({ items }: { items: TestimonialRow[] }) {
  const [saveState, saveAction] = useActionState(saveTestimonialAction, IDLE);
  const [deleteState, deleteAction] = useActionState(
    deleteTestimonialAction,
    IDLE,
  );
  const [editing, setEditing] = useState<TestimonialRow | null>(null);

  return (
    <div className="space-y-6">
      <form
        action={saveAction}
        className={cardClass}
        // key: duzenlenen kayit degisince form alanlari yeni degerlerle tazelenir.
        key={editing?.id ?? "new"}
      >
        <h2 className="text-lg font-semibold">
          {editing ? "Yorumu düzenle" : "Yeni yorum"}
        </h2>

        {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

        <div className="mt-4 grid gap-4 sm:grid-cols-[2fr_1fr]">
          <div>
            <label htmlFor="author" className={labelClass}>
              Yorumu yazan <span className="text-red-600">*</span>
            </label>
            <input
              id="author"
              name="author"
              required
              maxLength={80}
              defaultValue={editing?.author ?? ""}
              placeholder="Ayşe K."
              className={inputClass}
            />
            <FieldError state={saveState} name="author" />
          </div>

          <div>
            <label htmlFor="rating" className={labelClass}>
              Puan (1-5)
            </label>
            <select
              id="rating"
              name="rating"
              defaultValue={editing?.rating?.toString() ?? ""}
              className={inputClass}
            >
              <option value="">Yıldız gösterme</option>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <FieldError state={saveState} name="rating" />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="text" className={labelClass}>
            Yorum <span className="text-red-600">*</span>
          </label>
          <textarea
            id="text"
            name="text"
            required
            rows={3}
            maxLength={600}
            defaultValue={editing?.text ?? ""}
            placeholder="Mahallenin en iyi filtre kahvesi."
            className={`${inputClass} resize-y`}
          />
          <FieldError state={saveState} name="text" />
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={editing ? editing.isActive : true}
            className="size-4"
          />
          Sitede göster
        </label>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <SubmitButton>{editing ? "Güncelle" : "Ekle"}</SubmitButton>
          {editing ? (
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Vazgeç
            </button>
          ) : null}
          <FormMessage state={saveState} />
        </div>
      </form>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold">Yorumlar</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Sıralamayı sürükleyerek değiştirebilirsiniz; sitede bu sırada görünür.
        </p>

        <div className="mt-4">
          <SortableList
            emptyText="Henüz yorum eklemediniz."
            action={async (ids) => {
              const data = new FormData();
              data.set("ids", ids.join(","));
              return reorderTestimonialsAction(IDLE, data);
            }}
            items={items.map((item) => ({
              id: item.id,
              content: (
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900">
                      {item.author}
                      {item.rating ? (
                        <span className="ms-2 text-amber-600">
                          {"★".repeat(item.rating)}
                        </span>
                      ) : null}
                      {!item.isActive ? (
                        <span className="ms-2 rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600">
                          gizli
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">{item.text}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(item)}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                      Düzenle
                    </button>
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <SubmitButton variant="danger" confirm="Yorum silinsin mi?">
                        Sil
                      </SubmitButton>
                    </form>
                  </div>
                </div>
              ),
            }))}
          />
        </div>

        <FormMessage state={deleteState} />
      </section>
    </div>
  );
}
