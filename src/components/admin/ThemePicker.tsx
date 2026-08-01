"use client";

import { useActionState } from "react";

import { saveThemeSlugAction } from "@/actions/theme";
import { FormMessage, SubmitButton, cardClass } from "@/components/admin/ui";
import { IDLE } from "@/lib/action-result";

type ThemeOption = {
  slug: string;
  name: string;
  description: string;
  scheme: "light" | "dark";
  /** [zemin, ana renk, vurgu, yazı] */
  swatches: string[];
  isActive: boolean;
};

/**
 * Tema secici — YALNIZCA tema pinlenmemisken basilir (bkz. admin/tema/page.tsx).
 * Musteri repo'sunda NEXT_PUBLIC_THEME dolu oldugu icin hic gorunmez.
 */
export function ThemePicker({
  themes,
  activeSlug,
}: {
  themes: ThemeOption[];
  activeSlug: string;
}) {
  const [state, formAction] = useActionState(saveThemeSlugAction, IDLE);

  return (
    <form action={formAction} className={cardClass}>
      <h2 className="text-lg font-semibold">Tema</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Sitenin genel tasarımını seçin. Tema değiştirdiğinizde renkler o temanın
        varsayılanlarına döner.
      </p>

      <fieldset className="mt-4">
        <legend className="sr-only">Tema seçimi</legend>
        <ul className="grid gap-3 sm:grid-cols-2">
          {themes.map((theme) => (
            <li key={theme.slug}>
              <label
                className={`flex h-full cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${
                  theme.slug === activeSlug
                    ? "border-zinc-900 bg-zinc-50"
                    : "border-zinc-200 bg-white hover:border-zinc-400"
                }`}
              >
                <input
                  type="radio"
                  name="themeSlug"
                  value={theme.slug}
                  defaultChecked={theme.slug === activeSlug}
                  className="mt-1 h-4 w-4 shrink-0"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{theme.name}</span>
                    {theme.scheme === "dark" ? (
                      <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                        koyu
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm text-zinc-600">
                    {theme.description}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-3 flex overflow-hidden rounded-md border border-zinc-200"
                  >
                    {theme.swatches.map((color, i) => (
                      <span
                        key={i}
                        style={{ background: color }}
                        className="h-6 flex-1"
                      />
                    ))}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <SubmitButton confirm="Tema değiştirilecek ve özel renkleriniz yeni temanın varsayılanlarına dönecek. Devam edilsin mi?">
          Temayı Kaydet
        </SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
