import { asc } from "drizzle-orm";

import { TestimonialManager } from "@/components/admin/TestimonialManager";
import { db } from "@/db";
import { testimonials } from "@/db/schema";

export const dynamic = "force-dynamic";

export default function TestimonialsPage() {
  // Panelde pasif kayitlar da gorunur; site tarafi yalnizca aktifleri okur.
  const items = db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.id))
    .all();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Yorumlar</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Müşteri yorumları sitede ayrı bir bölümde gösterilir. Bölümü tamamen
          kapatmak isterseniz Genel Bilgiler sayfasındaki görünürlük ayarlarını
          kullanın.
        </p>
      </header>

      <TestimonialManager items={items} />
    </div>
  );
}
