"use client";

import { useActionState, useState } from "react";

import { saveOpeningHoursAction } from "@/actions/hours";
import {
  FormMessage,
  SubmitButton,
  cardClass,
  inputClass,
} from "@/components/admin/ui";
import { IDLE } from "@/lib/action-result";

type Row = {
  dayOfWeek: number;
  dayLabel: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export function OpeningHoursForm({ hours }: { hours: Row[] }) {
  const [state, formAction] = useActionState(saveOpeningHoursAction, IDLE);
  const [closed, setClosed] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(hours.map((h) => [h.dayOfWeek, h.isClosed])),
  );

  return (
    <form action={formAction} className="space-y-6">
      <section className={cardClass}>
        <ul className="divide-y divide-zinc-200">
          {hours.map((hour) => {
            const isClosed = closed[hour.dayOfWeek] ?? false;
            return (
              <li
                key={hour.dayOfWeek}
                className="flex flex-wrap items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <span className="w-28 shrink-0 text-sm font-medium">
                  {hour.dayLabel}
                </span>

                <div className="flex items-center gap-2">
                  <label htmlFor={`open-${hour.dayOfWeek}`} className="sr-only">
                    {hour.dayLabel} açılış saati
                  </label>
                  <input
                    id={`open-${hour.dayOfWeek}`}
                    name={`open-${hour.dayOfWeek}`}
                    type="time"
                    required
                    defaultValue={hour.openTime}
                    readOnly={isClosed}
                    aria-disabled={isClosed}
                    className={`${inputClass} mt-0 w-32 ${isClosed ? "bg-zinc-100 text-zinc-400" : ""}`}
                  />
                  <span aria-hidden="true" className="text-zinc-400">
                    –
                  </span>
                  <label htmlFor={`close-${hour.dayOfWeek}`} className="sr-only">
                    {hour.dayLabel} kapanış saati
                  </label>
                  <input
                    id={`close-${hour.dayOfWeek}`}
                    name={`close-${hour.dayOfWeek}`}
                    type="time"
                    required
                    defaultValue={hour.closeTime}
                    readOnly={isClosed}
                    aria-disabled={isClosed}
                    className={`${inputClass} mt-0 w-32 ${isClosed ? "bg-zinc-100 text-zinc-400" : ""}`}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    name={`closed-${hour.dayOfWeek}`}
                    defaultChecked={hour.isClosed}
                    onChange={(event) =>
                      setClosed((prev) => ({
                        ...prev,
                        [hour.dayOfWeek]: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                  Kapalı
                </label>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-xs text-zinc-500">
          Not: &quot;Kapalı&quot; işaretlendiğinde saat alanları devre dışı
          kalır; kayıtlı saatler korunur.
        </p>
      </section>

      <div className="flex items-center gap-3">
        <SubmitButton>Saatleri Kaydet</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
