"use client";

import { useState, type CSSProperties } from "react";
import { useActionState } from "react";

import { resetThemeColorsAction, saveThemeColorsAction } from "@/actions/theme";
import {
  FormMessage,
  SubmitButton,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/ui";
import { IDLE } from "@/lib/action-result";

type ColorVar = {
  key: string;
  label: string;
  /** Temanin kendi degeri. */
  themeDefault: string;
  /** Su an gecerli olan deger (ozel renk varsa o). */
  value: string;
  isCustom: boolean;
};

export function ThemeColorsForm({
  themeName,
  variables,
  hasCustomColors,
}: {
  themeName: string;
  variables: ColorVar[];
  hasCustomColors: boolean;
}) {
  const [state, formAction] = useActionState(saveThemeColorsAction, IDLE);
  const [resetState, resetAction] = useActionState(resetThemeColorsAction, IDLE);

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(variables.map((v) => [v.key, v.value])),
  );

  const previewStyle = { ...values } as CSSProperties;

  function update(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <form action={formAction} className={cardClass}>
        <h2 className="text-lg font-semibold">Marka Renkleri</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Aktif tema: <strong>{themeName}</strong>. Her renk sitedeki bir CSS
          değişkenine karşılık gelir. Bir rengi temanın varsayılanına
          döndürmek için yanındaki oka basın.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {variables.map((variable) => {
            const current = values[variable.key] ?? variable.themeDefault;
            const changed =
              current.toUpperCase() !== variable.themeDefault.toUpperCase();

            return (
              <div key={variable.key}>
                <label htmlFor={variable.key} className={labelClass}>
                  {variable.label}
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    id={variable.key}
                    name={variable.key}
                    type="color"
                    value={current}
                    onChange={(e) => update(variable.key, e.target.value)}
                    className="h-10 w-14 shrink-0 cursor-pointer rounded border border-zinc-300 bg-white p-1"
                  />
                  <input
                    type="text"
                    aria-label={`${variable.label} renk kodu`}
                    value={current}
                    onChange={(e) => update(variable.key, e.target.value)}
                    pattern="#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})"
                    className={`${inputClass} mt-0 font-mono uppercase`}
                  />
                  <button
                    type="button"
                    onClick={() => update(variable.key, variable.themeDefault)}
                    disabled={!changed}
                    title={`Temanın varsayılanına dön (${variable.themeDefault})`}
                    aria-label={`${variable.label}: temanın varsayılanına dön`}
                    className="shrink-0 rounded-lg border border-zinc-300 px-2 py-2 text-xs text-zinc-700 hover:bg-zinc-50 disabled:opacity-30"
                  >
                    ↺
                  </button>
                </div>
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  {variable.key}
                  {changed ? (
                    <span className="ms-2 font-sans text-amber-700">
                      özelleştirildi
                    </span>
                  ) : null}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-zinc-700">Önizleme</h3>
          <div
            style={previewStyle}
            className="mt-3 overflow-hidden rounded-xl border border-zinc-200"
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
                  Mağazaları Gör
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
        </div>

        <div className="mt-6 flex items-center gap-3">
          <SubmitButton>Renkleri Kaydet</SubmitButton>
          <FormMessage state={state} />
        </div>
      </form>

      {hasCustomColors ? (
        <form action={resetAction} className="flex items-center gap-3">
          <SubmitButton
            variant="secondary"
            confirm={`Tüm renkler "${themeName}" temasının varsayılanlarına dönecek. Devam edilsin mi?`}
          >
            Tüm renkleri temaya döndür
          </SubmitButton>
          <FormMessage state={resetState} />
        </form>
      ) : null}
    </div>
  );
}
