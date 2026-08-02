"use client";

import { useActionState } from "react";

import { saveHiddenSectionsAction } from "@/actions/settings";
import {
  FormMessage,
  SubmitButton,
  cardClass,
} from "@/components/admin/ui";
import { IDLE } from "@/lib/action-result";
import { TOGGLEABLE_SECTIONS } from "@/lib/sections";

/**
 * Bolum ac/kapa.
 *
 * Form ACIK olanlari gonderir; sunucu bunun tersini (kapalilar) kaydeder.
 * Boylece ileride yeni bir bolum eklendiginde mevcut kurulumlarda otomatik
 * acik gelir — kimse paneli acip yeni kutuyu isaretlemek zorunda kalmaz.
 */
export function SectionVisibilityForm({ hidden }: { hidden: string[] }) {
  const [state, formAction] = useActionState(saveHiddenSectionsAction, IDLE);
  const hiddenSet = new Set(hidden);

  return (
    <form action={formAction} className={cardClass}>
      <h2 className="text-lg font-semibold">Sitede görünecek bölümler</h2>
      <p className="mt-1 text-sm text-zinc-600">
        İşaretini kaldırdığınız bölüm sitede hiç görünmez; içeriği silinmez.
        İçeriği olmayan bölümler zaten kendiliğinden gizlenir.
      </p>

      <ul className="mt-4 space-y-3">
        {TOGGLEABLE_SECTIONS.map((section) => (
          <li key={section.key}>
            <label className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3">
              <input
                type="checkbox"
                name="visible"
                value={section.key}
                defaultChecked={!hiddenSet.has(section.key)}
                className="mt-0.5 size-4 shrink-0"
              />
              <span>
                <span className="block text-sm font-medium text-zinc-900">
                  {section.label}
                </span>
                <span className="mt-0.5 block text-xs text-zinc-600">
                  {section.hint}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <SubmitButton />
        <FormMessage state={state} />
      </div>
    </form>
  );
}
