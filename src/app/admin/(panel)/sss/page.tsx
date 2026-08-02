import { asc } from "drizzle-orm";

import { FaqManager } from "@/components/admin/FaqManager";
import { db } from "@/db";
import { faqs } from "@/db/schema";

export const dynamic = "force-dynamic";

export default function FaqPage() {
  const items = db
    .select()
    .from(faqs)
    .orderBy(asc(faqs.sortOrder), asc(faqs.id))
    .all();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Sıkça Sorulan Sorular
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Müşterilerin en çok sorduğu şeyleri buraya yazın: Wi-Fi, çalışma
          ortamı, evcil hayvan, rezervasyon gibi. Arama motorları da bu
          bölümü okur.
        </p>
      </header>

      <FaqManager items={items} />
    </div>
  );
}
