import { ThemePicker } from "@/components/admin/ThemePicker";
import { ThemeColorsForm } from "@/components/admin/ThemeColorsForm";
import { getSettings } from "@/lib/content";
import { EDITABLE_COLOR_VARS } from "@/lib/theme-vars";
import { getTheme, pinnedThemeSlug, themeRegistry } from "@/themes/registry";
import { resolveThemeSlug } from "@/themes/registry";

export const dynamic = "force-dynamic";

export default function ThemePage() {
  const settings = getSettings();
  const pinned = pinnedThemeSlug();
  const activeSlug = resolveThemeSlug(settings.themeSlug);
  const active = getTheme(activeSlug);

  const themes = Object.entries(themeRegistry).map(([slug, definition]) => ({
    slug,
    name: definition.name,
    description: definition.description,
    scheme: definition.scheme,
    swatches: [
      definition.defaultColors["--brand-surface"] ?? "#ffffff",
      definition.defaultColors["--brand-primary"] ?? "#000000",
      definition.defaultColors["--brand-accent"] ?? "#888888",
      definition.defaultColors["--brand-ink"] ?? "#000000",
    ],
    isActive: slug === activeSlug,
  }));

  // Musteri bir rengi ozellestirmediyse temanin varsayilani gosterilir.
  const saved = settings.brandColors ?? {};
  const variables = EDITABLE_COLOR_VARS.map((v) => ({
    key: v.key,
    label: v.label,
    themeDefault: active.defaultColors[v.key] ?? "#000000",
    value: saved[v.key] ?? active.defaultColors[v.key] ?? "#000000",
    isCustom: Boolean(saved[v.key]),
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Tema & Renkler</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Sitenin görünümünü buradan değiştirebilirsiniz. Değişiklikler
          kaydettikten hemen sonra yayına girer.
        </p>
      </header>

      <ThemePicker
        themes={themes}
        activeSlug={activeSlug}
        pinnedSlug={pinned}
      />

      <ThemeColorsForm
        themeName={active.name}
        variables={variables}
        hasCustomColors={Object.keys(saved).length > 0}
      />
    </div>
  );
}
