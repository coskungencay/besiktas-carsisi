"use client";

import { useActionState, useState } from "react";

import {
  deleteFaqAction,
  reorderFaqsAction,
  saveFaqAction,
} from "@/actions/faqs";
import {
  FieldError,
  FormMessage,
  SubmitButton,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/ui";
import { SortableList } from "@/components/admin/SortableList";
import type { FaqRow } from "@/db/schema";
import { IDLE } from "@/lib/action-result";

/**
 * SSS yonetimi: ekle / duzenle / sil / sirala.
 *
 * Duzenleme ayri bir sayfa yerine ayni formda yapilir (secili kayit forma
 * yuklenir); panelde tek ekranda kalmak musteri icin daha az kayboluyor.
 */
export function FaqManager({ items }: { items: FaqRow[] }) {
  const [saveState, saveAction] = useActionState(saveFaqAction, IDLE);
  const [deleteState, deleteAction] = useActionState(
    deleteFaqAction,
    IDLE,
  );
  const [editing, setEditing] = useState<FaqRow | null>(null);

  return (
    <div className="space-y-6">
      <form
        action={saveAction}
        className={cardClass}
        // key: duzenlenen kayit degisince form alanlari yeni degerlerle tazelenir.
        key={editing?.id ?? "new"}
      >
        <h2 className="text-lg font-semibold">
          {editing ? "Soruyu düzenle" : "Yeni soru"}
        </h2>

        {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

        <div className="mt-4">
          <label htmlFor="question" className={labelClass}>
            Soru <span className="text-red-600">*</span>
          </label>
          <input
            id="question"
            name="question"
            required
            maxLength={200}
            defaultValue={editing?.question ?? ""}
            placeholder="Wi-Fi var mı?"
            className={inputClass}
          />
          <FieldError state={saveState} name="question" />
        </div>

        <div className="mt-4">
          <label htmlFor="answer" className={labelClass}>
            Cevap <span className="text-red-600">*</span>
          </label>
          <textarea
            id="answer"
            name="answer"
            required
            rows={3}
            maxLength={1500}
            defaultValue={editing?.answer ?? ""}
            placeholder="Evet, ücretsiz Wi-Fi mevcut. Şifreyi kasadan alabilirsiniz."
            className={`${inputClass} resize-y`}
          />
          <FieldError state={saveState} name="answer" />
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
        <h2 className="text-lg font-semibold">Sorular</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Sıralamayı sürükleyerek değiştirebilirsiniz; sitede bu sırada görünür.
        </p>

        <div className="mt-4">
          <SortableList
            emptyText="Henüz soru eklemediniz."
            action={async (ids) => {
              const data = new FormData();
              data.set("ids", ids.join(","));
              return reorderFaqsAction(IDLE, data);
            }}
            items={items.map((item) => ({
              id: item.id,
              content: (
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900">
                      {item.question}
                      {!item.isActive ? (
                        <span className="ms-2 rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600">
                          gizli
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">{item.answer}</p>
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
                      <SubmitButton variant="danger" confirm="Soru silinsin mi?">
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
