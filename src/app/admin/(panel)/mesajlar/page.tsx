import { desc } from "drizzle-orm";

import { MessageList } from "@/components/admin/MessageList";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export const dynamic = "force-dynamic";

export default function MessagesPage() {
  const messages = db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt), desc(contactMessages.id))
    .limit(500)
    .all();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Mesajlar</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Sitedeki iletişim formundan gelen mesajlar. En yeniden eskiye
          sıralıdır.
        </p>
      </header>

      <MessageList messages={messages} />
    </div>
  );
}
