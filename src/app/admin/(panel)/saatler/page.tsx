import { OpeningHoursForm } from "@/components/admin/OpeningHoursForm";
import { getOpeningHours } from "@/lib/content";
import { DAY_LABELS } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function HoursPage() {
  const rows = getOpeningHours();

  const hours = DAY_LABELS.map((label, day) => {
    const existing = rows.find((row) => row.dayOfWeek === day);
    return {
      dayOfWeek: day,
      dayLabel: label,
      openTime: existing?.openTime ?? "09:00",
      closeTime: existing?.closeTime ?? "22:00",
      isClosed: existing?.isClosed ?? false,
    };
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Çalışma Saatleri
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Bu saatler sitede ve Google arama sonuçlarında görünür.
        </p>
      </header>

      <OpeningHoursForm hours={hours} />
    </div>
  );
}
