import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { getSettings } from "@/lib/content";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(user.mustChangePassword ? "/admin/sifre-degistir" : "/admin");
  }

  const settings = getSettings();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          {settings.name || "Yönetim Paneli"}
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-600">
          Devam etmek için giriş yapın.
        </p>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
