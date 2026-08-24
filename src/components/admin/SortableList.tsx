"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";

import type { ActionState } from "@/lib/action-result";

export type SortableItem = {
  id: number;
  content: ReactNode;
};

type SortableListProps = {
  items: SortableItem[];
  /** Yeni sirayi kaydeden server action. */
  action: (ids: number[]) => Promise<ActionState>;
  emptyText?: string;
};

/**
 * Suruklebirak ile siralama.
 * Bagimlilik yok: HTML5 drag & drop + klavye/dokunmatik icin yukari-asagi
 * butonlari. Yeni sira dogrudan server action'a gonderilir.
 */
export function SortableList({
  items,
  action,
  emptyText = "Henüz kayıt yok.",
}: SortableListProps) {
  const [order, setOrder] = useState<SortableItem[]>(items);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  // Sunucudan gelen liste degisince (ekleme/silme) yerel sirayi tazele.
  useEffect(() => {
    setOrder(items);
  }, [items]);

  function persist(next: SortableItem[]) {
    setOrder(next);
    startTransition(async () => {
      const result = await action(next.map((item) => item.id));
      setMessage(result.message);
    });
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= order.length || from === to) return;
    const next = [...order];
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    persist(next);
  }

  if (order.length === 0) {
    return <p className="text-sm text-zinc-500">{emptyText}</p>;
  }

  return (
    <div>
      <ul className="space-y-2">
        {order.map((item, index) => (
          <li
            key={item.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragEnd={() => setDragIndex(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (dragIndex !== null) move(dragIndex, index);
              setDragIndex(null);
            }}
            className={`flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3 transition-opacity ${
              dragIndex === index ? "opacity-50" : ""
            }`}
          >
            <span
              aria-hidden="true"
              title="Sürükleyerek sıralayın"
              className="mt-1 cursor-grab text-lg leading-none text-zinc-400 select-none active:cursor-grabbing"
            >
              ⠿
            </span>

            <div className="min-w-0 flex-1">{item.content}</div>

            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => move(index, index - 1)}
                disabled={index === 0 || pending}
                aria-label={`${index + 1}. kaydı yukarı taşı`}
                /*
                  Telefonda 36px, isaretci cihazda tasarimin kendi olcusu.
                  Iki dugme ust uste duruyor ve her biri 22px yuksekligindeydi;
                  parmakla "yukari" yerine "asagi" tasimak cok kolaydi.
                */
                className="rounded border border-zinc-300 px-3 py-2 text-sm leading-none text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 sm:px-2 sm:py-0.5 sm:text-xs"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, index + 1)}
                disabled={index === order.length - 1 || pending}
                aria-label={`${index + 1}. kaydı aşağı taşı`}
                className="rounded border border-zinc-300 px-3 py-2 text-sm leading-none text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 sm:px-2 sm:py-0.5 sm:text-xs"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p role="status" aria-live="polite" className="mt-2 text-sm text-zinc-500">
        {pending ? "Sıralama kaydediliyor…" : message}
      </p>
    </div>
  );
}
