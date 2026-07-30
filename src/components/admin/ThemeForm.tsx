"use client";

import { useActionState, useState } from "react";

import { resetThemeColorsAction, saveThemeAction } from "@/actions/theme";
import {
  FormMessage,
  SubmitButton,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/ui";
import { IDLE } from "@/lib/action-result";

type ColorVar = { key: string; label: string; fallback: string };

export function ThemeForm({
  themes,
  currentSlug,
  pinnedSlug,
  colors,
  variables,
}: {
  themes: { slug: string; name: string }[];
  currentSlug: string;
  pinnedSlug: string | null;
  colors: Record<string, string>;
  variables: ColorVar[];
}) {
  const [state, formAction] = useActionState(saveThemeAction, IDLE);
  const [resetState, resetAction] = useActionState(resetThemeColorsAction, IDLE);

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      variables.map((v) => [v.key, colors[v.key] ?? v.fallback]),
    ),
  );

  const previewStyle = Object.fromEntries(
    Object.entries(values),
  ) as React.CSSProperties;

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-6">
        <section className={cardClass}>
          <h2 className="text-lg font-semibold">Tema</h2>

          {pinnedSlug ? (
            <>
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                Tema sunucu ayarlarında <strong>{pinnedSlug}</strong> olarak
                sabitlenmiş (NEXT_PUBLIC_THEME). Buradan değiştirilemez; renkler
                yine de değiştirilebilir.
              </p>
              <input type="hidden" name="themeSlug" value={currentSlug} />
            </>
          ) : (
            <div className="mt-4 max-w-sm">
              <label htmlFor="themeSlug" className={labelClass}>
                Aktif tema
              </label>
              <select
                id="themeSlug"
                name="themeSlug"
                defaultValue={currentSlug}
                className={inputClass}
              >
                {themes.map((theme) => (
                  <option key={theme.slug} value={theme.slug}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        <section className={cardClass}>
          <h2 className="text-lg font-semibold">Marka Renkleri</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Her renk sitedeki bir CSS değişkenine karşılık gelir. Boş bırakılan
            değerler temanın varsayılanını kullanır.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {variables.map((variable) => (
              <div key={variable.key}>
                <label htmlFor={variable.key} className={labelClass}>
                  {variable.label}
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    id={variable.key}
                    name={variable.key}
                    type="color"
                    value={values[variable.key] ?? variable.fallback}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        [variable.key]: event.target.value,
                      }))
                    }
                    className="h-10 w-14 shrink-0 cursor-pointer rounded border border-zinc-300 bg-white p-1"
                  />
                  <input
                    type="text"
                    aria-label={`${variable.label} renk kodu`}
                    value={values[variable.key] ?? variable.fallback}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        [variable.key]: event.target.value,
                      }))
                    }
                    pattern="#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})"
                    className={`${inputClass} mt-0 font-mono`}
                  />
                </div>
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  {variable.key}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="text-lg font-semibold">Önizleme</h2>
          <div
            style={previewStyle}
            className="mt-4 overflow-hidden rounded-xl border border-zinc-200"
          >
            <div className="bg-[var(--brand-surface)] p-6">
              <p className="text-2xl font-semibold text-[var(--brand-ink)]">
                İşletme Adı
              </p>
              <p className="mt-2 text-sm text-[var(--brand-ink-muted)]">
                Slogan buraya gelir — sıcak, taze ve her gün yeni.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-[var(--brand-primary-contrast)]">
                  Menüyü İncele
                </span>
                <span className="rounded-lg bg-[var(--brand-accent)] px-4 py-2 text-sm font-semibold text-[var(--brand-primary-contrast)]">
                  Öne çıkan
                </span>
              </div>
            </div>
            <div className="border-t border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-6">
              <p className="text-sm text-[var(--brand-ink)]">
                İkincil zemin üzerindeki metin böyle görünür.
              </p>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <SubmitButton>Tema Ayarlarını Kaydet</SubmitButton>
          <FormMessage state={state} />
        </div>
      </form>

      <form action={resetAction} className="flex items-center gap-3">
        <SubmitButton
          variant="secondary"
          confirm="Renkler temanın varsayılan değerlerine dönecek. Devam edilsin mi?"
        >
          Varsayılan renklere dön
        </SubmitButton>
        <FormMessage state={resetState} />
      </form>
    </div>
  );
}
