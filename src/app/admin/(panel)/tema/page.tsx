import { EDITABLE_COLOR_VARS } from "@/lib/theme-vars";
import { ThemeForm } from "@/components/admin/ThemeForm";
import { getSettings } from "@/lib/content";
import { pinnedThemeSlug, themeRegistry } from "@/themes/registry";

export const dynamic = "force-dynamic";

export default function ThemePage() {
  const settings = getSettings();
  const pinned = pinnedThemeSlug();

  const themes = Object.entries(themeRegistry).map(([slug, definition]) => ({
    slug,
    name: definition.name,
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Tema & Renkler</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Sitenin görünümünü buradan değiştirebilirsiniz. Değişiklikler kaydettikten
          hemen sonra yayına girer.
        </p>
      </header>

      <ThemeForm
        themes={themes}
        currentSlug={settings.themeSlug}
        pinnedSlug={pinned}
        colors={settings.brandColors ?? {}}
        variables={[...EDITABLE_COLOR_VARS]}
      />
    </div>
  );
}
