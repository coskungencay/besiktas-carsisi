import { CategoryManager } from "@/components/admin/CategoryManager";
import { MediaQuota } from "@/components/admin/MediaQuota";
import { MenuItemManager } from "@/components/admin/MenuItemManager";
import { getMenuCategories, getMenuItems } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function MenuPage() {
  const categories = getMenuCategories();
  const items = getMenuItems();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Mağazalar</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Önce kategori oluşturun, ardından mağazaları ekleyin. Sıralamayı
          sürükleyerek veya ok tuşlarıyla değiştirebilirsiniz.
        </p>
      </header>

      <MediaQuota />

      <CategoryManager categories={categories} />
      <MenuItemManager categories={categories} items={items} />
    </div>
  );
}
