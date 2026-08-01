"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  saveEnabledLocalesAction,
  saveTranslationsAction,
} from "@/actions/locales";
import {
  FormMessage,
  SubmitButton,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/ui";
import { IDLE } from "@/lib/action-result";
import { thumbUrl } from "@/lib/format";

type LocaleRow = {
  locale: string;
  adminLabel: string;
  nativeLabel: string;
  isDefault: boolean;
  isEnabled: boolean;
};

type BaseContent = {
  settings: {
    name: string;
    tagline: string;
    heroHeadline: string;
    heroSubline: string;
    about: string;
    address: string;
  };
  highlights: { index: number; label: string; value: string }[];
  categories: { id: number; name: string }[];
  items: { id: number; name: string; description: string }[];
  gallery: { id: number; alt: string; thumb: string }[];
};

const SETTINGS_FIELDS = [
  { field: "name", label: "İşletme adı", multiline: false },
  { field: "tagline", label: "Slogan", multiline: false },
  { field: "heroHeadline", label: "Ana sayfa başlığı", multiline: false },
  { field: "heroSubline", label: "Başlığın devamı", multiline: false },
  { field: "about", label: "Hakkımızda", multiline: true },
  { field: "address", label: "Adres", multiline: true },
] as const;

export function LocalesManager({
  allLocales,
  editableLocales,
  activeLocale,
  values,
  base,
}: {
  allLocales: LocaleRow[];
  editableLocales: { locale: string; adminLabel: string }[];
  activeLocale: string | null;
  values: Record<string, string>;
  base: BaseContent;
}) {
  const [enabledState, enabledAction] = useActionState(
    saveEnabledLocalesAction,
    IDLE,
  );
  const [saveState, saveAction] = useActionState(saveTranslationsAction, IDLE);

  const val = (namespace: string, refId: number, field: string) =>
    values[`${namespace}|${refId}|${field}`] ?? "";

  const name = (namespace: string, refId: number, field: string) =>
    `t|${namespace}|${refId}|${field}`;

  return (
    <div className="space-y-6">
      {/* ------------------------- Aktif diller ------------------------- */}
      <form action={enabledAction} className={cardClass}>
        <h2 className="text-lg font-semibold">Sitedeki diller</h2>
        <p className="mt-1 text-sm text-zinc-600">
          İşaretlediğiniz diller sitede bir dil seçici olarak görünür. Sadece
          gerçekten çevireceğiniz dilleri açın.
        </p>

        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {allLocales.map((row) => (
            <li key={row.locale}>
              <label
                className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${
                  row.isDefault
                    ? "border-zinc-300 bg-zinc-50"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  name={row.locale}
                  defaultChecked={row.isEnabled}
                  disabled={row.isDefault}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <span>
                  <span className="font-medium">{row.adminLabel}</span>{" "}
                  <span className="text-zinc-500">({row.nativeLabel})</span>
                  {row.isDefault ? (
                    <span className="ms-2 rounded bg-zinc-900 px-1.5 py-0.5 text-xs font-semibold text-white">
                      varsayılan
                    </span>
                  ) : null}
                </span>
              </label>
            </li>
          ))}
        </ul>

        <p className="mt-3 text-xs text-zinc-500">
          Varsayılan dil kapatılamaz. Sadece bir dil açıksa sitede dil seçici
          gösterilmez.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <SubmitButton>Dilleri Kaydet</SubmitButton>
          <FormMessage state={enabledState} />
        </div>
      </form>

      {/* -------------------------- Çeviriler --------------------------- */}
      {editableLocales.length === 0 || !activeLocale ? (
        <section className={cardClass}>
          <h2 className="text-lg font-semibold">Çeviriler</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Çeviri girmek için önce yukarıdan en az bir ek dil açın.
          </p>
        </section>
      ) : (
        <section className={cardClass}>
          <h2 className="text-lg font-semibold">Çeviriler</h2>

          <div className="mt-4 flex flex-wrap gap-2" role="tablist">
            {editableLocales.map((option) => (
              <Link
                key={option.locale}
                href={`/admin/diller?dil=${option.locale}`}
                role="tab"
                aria-selected={option.locale === activeLocale}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  option.locale === activeLocale
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {option.adminLabel}
              </Link>
            ))}
          </div>

          <form
            action={saveAction}
            key={activeLocale}
            className="mt-6 space-y-8"
          >
            <input type="hidden" name="locale" value={activeLocale} />

            {/* Genel bilgiler */}
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-zinc-700 uppercase">
                Genel bilgiler
              </h3>
              <div className="mt-3 space-y-4">
                {SETTINGS_FIELDS.map((f) => (
                  <div key={f.field}>
                    <label
                      htmlFor={name("settings", 0, f.field)}
                      className={labelClass}
                    >
                      {f.label}
                    </label>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Orijinal:{" "}
                      <span className="text-zinc-700">
                        {base.settings[
                          f.field as keyof BaseContent["settings"]
                        ] || "—"}
                      </span>
                    </p>
                    {f.multiline ? (
                      <textarea
                        id={name("settings", 0, f.field)}
                        name={name("settings", 0, f.field)}
                        rows={f.field === "about" ? 6 : 2}
                        defaultValue={val("settings", 0, f.field)}
                        className={`${inputClass} resize-y`}
                      />
                    ) : (
                      <input
                        id={name("settings", 0, f.field)}
                        name={name("settings", 0, f.field)}
                        defaultValue={val("settings", 0, f.field)}
                        className={inputClass}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Künye satırları */}
            {base.highlights.length > 0 ? (
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-zinc-700 uppercase">
                  Künye satırları
                </h3>
                <div className="mt-3 space-y-4">
                  {base.highlights.map((highlight) => (
                    <div
                      key={highlight.index}
                      className="grid gap-3 sm:grid-cols-2"
                    >
                      <div>
                        <label
                          htmlFor={name("highlight", highlight.index, "label")}
                          className="text-xs text-zinc-500"
                        >
                          Orijinal etiket:{" "}
                          <span className="text-zinc-700">
                            {highlight.label || "—"}
                          </span>
                        </label>
                        <input
                          id={name("highlight", highlight.index, "label")}
                          name={name("highlight", highlight.index, "label")}
                          defaultValue={val("highlight", highlight.index, "label")}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={name("highlight", highlight.index, "value")}
                          className="text-xs text-zinc-500"
                        >
                          Orijinal değer:{" "}
                          <span className="text-zinc-700">
                            {highlight.value || "—"}
                          </span>
                        </label>
                        <input
                          id={name("highlight", highlight.index, "value")}
                          name={name("highlight", highlight.index, "value")}
                          defaultValue={val("highlight", highlight.index, "value")}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Menü kategorileri */}
            {base.categories.length > 0 ? (
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-zinc-700 uppercase">
                  Menü kategorileri
                </h3>
                <div className="mt-3 space-y-3">
                  {base.categories.map((category) => (
                    <div key={category.id}>
                      <label
                        htmlFor={name("menu_category", category.id, "name")}
                        className="text-xs text-zinc-500"
                      >
                        Orijinal:{" "}
                        <span className="text-zinc-700">{category.name}</span>
                      </label>
                      <input
                        id={name("menu_category", category.id, "name")}
                        name={name("menu_category", category.id, "name")}
                        defaultValue={val("menu_category", category.id, "name")}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Menü ürünleri */}
            {base.items.length > 0 ? (
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-zinc-700 uppercase">
                  Menü ürünleri
                </h3>
                <div className="mt-3 space-y-5">
                  {base.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-zinc-200 p-3"
                    >
                      <p className="text-xs text-zinc-500">
                        Orijinal:{" "}
                        <span className="font-medium text-zinc-800">
                          {item.name}
                        </span>
                      </p>
                      <input
                        aria-label={`${item.name} — ürün adı çevirisi`}
                        name={name("menu_item", item.id, "name")}
                        defaultValue={val("menu_item", item.id, "name")}
                        placeholder="Ürün adı"
                        className={inputClass}
                      />
                      {item.description ? (
                        <>
                          <p className="mt-2 text-xs text-zinc-500">
                            Orijinal açıklama:{" "}
                            <span className="text-zinc-700">
                              {item.description}
                            </span>
                          </p>
                          <textarea
                            aria-label={`${item.name} — açıklama çevirisi`}
                            name={name("menu_item", item.id, "description")}
                            rows={2}
                            defaultValue={val(
                              "menu_item",
                              item.id,
                              "description",
                            )}
                            placeholder="Açıklama"
                            className={`${inputClass} resize-y`}
                          />
                        </>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Galeri */}
            {base.gallery.length > 0 ? (
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-zinc-700 uppercase">
                  Galeri açıklamaları
                </h3>
                <div className="mt-3 space-y-3">
                  {base.gallery.map((image) => (
                    <div key={image.id} className="flex items-end gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbUrl(image.thumb)}
                        alt=""
                        width={48}
                        height={48}
                        className="h-12 w-12 shrink-0 rounded-lg border border-zinc-200 object-cover"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={name("gallery", image.id, "alt")}
                          className="text-xs text-zinc-500"
                        >
                          Orijinal:{" "}
                          <span className="text-zinc-700">
                            {image.alt || "—"}
                          </span>
                        </label>
                        <input
                          id={name("gallery", image.id, "alt")}
                          name={name("gallery", image.id, "alt")}
                          defaultValue={val("gallery", image.id, "alt")}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-3 border-t border-zinc-200 pt-4">
              <SubmitButton>Çevirileri Kaydet</SubmitButton>
              <FormMessage state={saveState} />
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
