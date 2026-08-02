import { SectionVisibilityForm } from "@/components/admin/SectionVisibilityForm";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/content";
import { normalizeHiddenSections } from "@/lib/sections";

export const dynamic = "force-dynamic";

export default function GeneralPage() {
  const settings = getSettings();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Genel Bilgiler</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Sitenin başlığı, iletişim bilgileri, sosyal medya hesapları ve ana
          görselleri.
        </p>
      </header>

      <SettingsForm settings={settings} />

      {/*
        Gorunurluk ayri bir form: kaydetmesi ayri bir action ve icerik
        formunun uzunlugu icinde kaybolmasin diye en altta duruyor.
      */}
      <SectionVisibilityForm
        hidden={normalizeHiddenSections(settings.hiddenSections)}
      />
    </div>
  );
}
