import { GalleryManager } from "@/components/admin/GalleryManager";
import { getGalleryImages } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function GalleryPage() {
  const images = getGalleryImages();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Galeri</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Birden fazla fotoğrafı aynı anda yükleyebilirsiniz. Sıralamayı
          sürükleyerek değiştirin.
        </p>
      </header>

      <GalleryManager images={images} />
    </div>
  );
}
