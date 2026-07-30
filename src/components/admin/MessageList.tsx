"use client";

import { useActionState } from "react";

import {
  deleteMessageAction,
  markAllReadAction,
  toggleMessageReadAction,
} from "@/actions/messages";
import { FormMessage, SubmitButton, cardClass } from "@/components/admin/ui";
import type { ContactMessageRow } from "@/db/schema";
import { IDLE } from "@/lib/action-result";
import { formatDateTime, telHref } from "@/lib/format";

export function MessageList({ messages }: { messages: ContactMessageRow[] }) {
  const [toggleState, toggleAction] = useActionState(
    toggleMessageReadAction,
    IDLE,
  );
  const [deleteState, deleteAction] = useActionState(deleteMessageAction, IDLE);

  const unread = messages.filter((m) => !m.isRead).length;

  if (messages.length === 0) {
    return (
      <section className={cardClass}>
        <p className="text-sm text-zinc-600">Henüz mesaj yok.</p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-zinc-600">
          Toplam {messages.length} mesaj, {unread} okunmamış.
        </p>
        {unread > 0 ? (
          <form action={markAllReadAction}>
            <SubmitButton variant="secondary">
              Tümünü okundu işaretle
            </SubmitButton>
          </form>
        ) : null}
      </div>

      <div className="space-y-1">
        <FormMessage state={toggleState} />
        <FormMessage state={deleteState} />
      </div>

      <ul className="space-y-3">
        {messages.map((message) => (
          <li
            key={message.id}
            className={`rounded-xl border p-4 shadow-sm ${
              message.isRead
                ? "border-zinc-200 bg-white"
                : "border-amber-300 bg-amber-50"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">
                {message.name}
                {!message.isRead ? (
                  <span className="ml-2 rounded bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white">
                    YENİ
                  </span>
                ) : null}
              </p>
              <time
                dateTime={message.createdAt.toISOString()}
                className="text-xs text-zinc-500"
              >
                {formatDateTime(message.createdAt)}
              </time>
            </div>

            <p className="mt-1 text-sm text-zinc-600">
              {message.phone ? (
                <a
                  href={telHref(message.phone)}
                  className="underline underline-offset-4"
                >
                  {message.phone}
                </a>
              ) : null}
              {message.phone && message.email ? " · " : null}
              {message.email ? (
                <a
                  href={`mailto:${message.email}`}
                  className="underline underline-offset-4"
                >
                  {message.email}
                </a>
              ) : null}
            </p>

            <p className="mt-3 text-sm whitespace-pre-wrap text-zinc-800">
              {message.message}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <form action={toggleAction}>
                <input type="hidden" name="id" value={message.id} />
                <SubmitButton variant="secondary">
                  {message.isRead
                    ? "Okunmadı işaretle"
                    : "Okundu işaretle"}
                </SubmitButton>
              </form>
              <form action={deleteAction}>
                <input type="hidden" name="id" value={message.id} />
                <SubmitButton
                  variant="danger"
                  confirm="Bu mesaj kalıcı olarak silinecek. Emin misiniz?"
                >
                  Sil
                </SubmitButton>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
