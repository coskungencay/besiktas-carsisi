"use client";

import Image from "next/image";
import { useActionState } from "react";

import {
  removeSettingsImageAction,
  saveSettingsAction,
} from "@/actions/settings";
import {
  FieldError,
  FormMessage,
  SubmitButton,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/ui";
import type { SiteSettingsRow } from "@/db/schema";
import { IDLE } from "@/lib/action-result";
import { MAX_HIGHLIGHTS } from "@/lib/validators";

export function SettingsForm({ settings }: { settings: SiteSettingsRow }) {
  const [state, formAction] = useActionState(saveSettingsAction, IDLE);
  // Bozuk JSON'a karsi: dizi degilse bos kabul et, panel yine acilsin.
  const highlights = Array.isArray(settings.highlights)
    ? settings.highlights
    : [];
  const [removeState, removeAction] = useActionState(
    removeSettingsImageAction,
    IDLE,
  );

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-6">
        <section className={cardClass}>
          <h2 className="text-lg font-semibold">Kimlik</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="name" className={labelClass}>
                İşletme adı <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                name="name"
                required
                maxLength={120}
                defaultValue={settings.name}
                className={inputClass}
              />
              <FieldError state={state} name="name" />
            </div>

            <div>
              <label htmlFor="tagline" className={labelClass}>
                Slogan
              </label>
              <input
                id="tagline"
                name="tagline"
                maxLength={200}
                defaultValue={settings.tagline}
                placeholder="Günün her saati taze kahve ve ev yapımı tatlılar"
                className={inputClass}
              />
              <FieldError state={state} name="tagline" />
            </div>

            <div>
              <label htmlFor="about" className={labelClass}>
                Hakkımızda
              </label>
              <textarea
                id="about"
                name="about"
                rows={6}
                maxLength={4000}
                defaultValue={settings.about}
                placeholder="Paragrafları boş satırla ayırın."
                className={`${inputClass} resize-y`}
              />
              <p className="mt-1 text-xs text-zinc-500">
                Paragraf oluşturmak için aralarında bir boş satır bırakın.
              </p>
              <FieldError state={state} name="about" />
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="text-lg font-semibold">Ana sayfa başlığı</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Sitenin en üstünde görünen büyük yazı. Boş bırakırsanız işletme adı
            kullanılır.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="heroHeadline" className={labelClass}>
                Başlık
              </label>
              <input
                id="heroHeadline"
                name="heroHeadline"
                maxLength={160}
                defaultValue={settings.heroHeadline}
                placeholder="Beyaz bir oda, siyah bir kahve."
                className={inputClass}
              />
              <FieldError state={state} name="heroHeadline" />
            </div>

            <div>
              <label htmlFor="heroSubline" className={labelClass}>
                Başlığın devamı (soluk yazılır)
              </label>
              <input
                id="heroSubline"
                name="heroSubline"
                maxLength={160}
                defaultValue={settings.heroSubline}
                placeholder="Fazlası yok."
                className={inputClass}
              />
              <FieldError state={state} name="heroSubline" />
            </div>
          </div>

          <h3 className="mt-8 text-sm font-semibold">Künye satırları</h3>
          <p className="mt-1 text-sm text-zinc-600">
            Başlığın altında görünen kısa bilgiler. En fazla {MAX_HIGHLIGHTS}{" "}
            satır; boş bıraktıklarınız gösterilmez. Hiç doldurmazsanız çalışma
            saatlerinizden otomatik üretilir.
          </p>

          <div className="mt-4 space-y-3">
            {Array.from({ length: MAX_HIGHLIGHTS }, (_, index) => {
              const row = highlights[index];
              return (
                <div key={index} className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                  <div>
                    <label
                      htmlFor={`highlightLabel${index}`}
                      className="sr-only"
                    >
                      {index + 1}. satır etiketi
                    </label>
                    <input
                      id={`highlightLabel${index}`}
                      name={`highlightLabel${index}`}
                      maxLength={40}
                      defaultValue={row?.label ?? ""}
                      placeholder={index === 0 ? "SAAT" : "Etiket"}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`highlightValue${index}`}
                      className="sr-only"
                    >
                      {index + 1}. satır değeri
                    </label>
                    <input
                      id={`highlightValue${index}`}
                      name={`highlightValue${index}`}
                      maxLength={60}
                      defaultValue={row?.value ?? ""}
                      placeholder={index === 0 ? "08–18" : "Değer"}
                      className={inputClass}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="text-lg font-semibold">İletişim</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className={labelClass}>
                Telefon
              </label>
              <input
                id="phone"
                name="phone"
                defaultValue={settings.phone}
                placeholder="+90 555 111 22 33"
                className={inputClass}
              />
              <FieldError state={state} name="phone" />
            </div>

            <div>
              <label htmlFor="whatsapp" className={labelClass}>
                WhatsApp numarası
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                defaultValue={settings.whatsapp}
                placeholder="0555 111 22 33"
                className={inputClass}
              />
              <FieldError state={state} name="whatsapp" />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={settings.email}
                className={inputClass}
              />
              <FieldError state={state} name="email" />
            </div>

            <div>
              <label htmlFor="instagram" className={labelClass}>
                Instagram
              </label>
              <input
                id="instagram"
                name="instagram"
                defaultValue={settings.instagram}
                placeholder="@kullaniciadi"
                className={inputClass}
              />
              <FieldError state={state} name="instagram" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className={labelClass}>
                Adres
              </label>
              <textarea
                id="address"
                name="address"
                rows={2}
                defaultValue={settings.address}
                className={`${inputClass} resize-y`}
              />
              <FieldError state={state} name="address" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="mapsUrl" className={labelClass}>
                Google Maps bağlantısı
              </label>
              <input
                id="mapsUrl"
                name="mapsUrl"
                type="url"
                defaultValue={settings.mapsUrl}
                placeholder="https://maps.app.goo.gl/..."
                className={inputClass}
              />
              <FieldError state={state} name="mapsUrl" />
            </div>

            <div>
              <label htmlFor="lat" className={labelClass}>
                Enlem (latitude)
              </label>
              <input
                id="lat"
                name="lat"
                inputMode="decimal"
                defaultValue={settings.lat ?? ""}
                placeholder="41.0082"
                className={inputClass}
              />
              <FieldError state={state} name="lat" />
            </div>

            <div>
              <label htmlFor="lng" className={labelClass}>
                Boylam (longitude)
              </label>
              <input
                id="lng"
                name="lng"
                inputMode="decimal"
                defaultValue={settings.lng ?? ""}
                placeholder="28.9784"
                className={inputClass}
              />
              <FieldError state={state} name="lng" />
            </div>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            Koordinatlar Google arama sonuçlarında haritada görünmek için
            kullanılır. Google Maps&apos;te mekâna sağ tıklayıp koordinatları
            kopyalayabilirsiniz.
          </p>
        </section>

        <section className={cardClass}>
          <h2 className="text-lg font-semibold">Görseller</h2>

          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <p className={labelClass}>Logo</p>
              {settings.logoUrl ? (
                <Image
                  src={settings.logoUrl}
                  alt="Mevcut logo"
                  width={120}
                  height={120}
                  className="mt-2 h-24 w-24 rounded-lg border border-zinc-200 bg-white object-contain p-1"
                />
              ) : (
                <p className="mt-2 text-sm text-zinc-500">Henüz yüklenmedi.</p>
              )}
              <input
                type="file"
                name="logoFile"
                accept="image/*"
                className="mt-2 block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              <input type="hidden" name="logoUrl" value={settings.logoUrl} />
            </div>

            <div>
              <p className={labelClass}>Kapak (hero) görseli</p>
              {settings.heroImageUrl ? (
                <Image
                  src={settings.heroImageUrl}
                  alt="Mevcut kapak görseli"
                  width={320}
                  height={180}
                  className="mt-2 h-28 w-full rounded-lg border border-zinc-200 object-cover"
                />
              ) : (
                <p className="mt-2 text-sm text-zinc-500">Henüz yüklenmedi.</p>
              )}
              <input
                type="file"
                name="heroFile"
                accept="image/*"
                className="mt-2 block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              <input
                type="hidden"
                name="heroImageUrl"
                value={settings.heroImageUrl}
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            Görseller otomatik olarak en fazla 1920 piksel genişliğe küçültülür
            ve WebP formatına çevrilir. Orijinal dosya sunucuda saklanır.
          </p>
        </section>

        <div className="flex items-center gap-3">
          <SubmitButton>Değişiklikleri Kaydet</SubmitButton>
          <FormMessage state={state} />
        </div>
      </form>

      {settings.logoUrl || settings.heroImageUrl ? (
        <section className={cardClass}>
          <h2 className="text-sm font-semibold text-zinc-700">
            Görsel kaldırma
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {settings.logoUrl ? (
              <form action={removeAction}>
                <input type="hidden" name="field" value="logoUrl" />
                <SubmitButton
                  variant="danger"
                  confirm="Logo kaldırılsın mı? Bu işlem geri alınamaz."
                >
                  Logoyu kaldır
                </SubmitButton>
              </form>
            ) : null}
            {settings.heroImageUrl ? (
              <form action={removeAction}>
                <input type="hidden" name="field" value="heroImageUrl" />
                <SubmitButton
                  variant="danger"
                  confirm="Kapak görseli kaldırılsın mı? Bu işlem geri alınamaz."
                >
                  Kapak görselini kaldır
                </SubmitButton>
              </form>
            ) : null}
            <FormMessage state={removeState} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
