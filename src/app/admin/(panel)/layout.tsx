import type { ReactNode } from "react";
import { eq } from "drizzle-orm";

import { AdminNav } from "@/components/admin/AdminNav";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { getSettings } from "@/lib/content";
import { requirePanelUser } from "@/lib/session";

export const dynamic = "force-dynamic";

function unreadCount(): number {
  const row = db
    .select({ id: contactMessages.id })
    .from(contactMessages)
    .where(eq(contactMessages.isRead, false))
    .all();
  return row.length;
}

export default async function PanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requirePanelUser();
  const settings = getSettings();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6 lg:py-8">
      <AdminNav
        siteName={settings.name || "Yönetim Paneli"}
        userEmail={user.email}
        unread={unreadCount()}
        logoUrl={settings.logoUrl}
      />
      <main className="min-w-0 flex-1 pb-12">{children}</main>
    </div>
  );
}
