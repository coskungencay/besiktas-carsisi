import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function GeneralPage() {
  const settings = getSettings();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Genel Bilgiler</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Sitenin başlığı, iletişim bilgileri ve ana görselleri.
        </p>
      </header>

      <SettingsForm settings={settings} />
    </div>
  );
}
