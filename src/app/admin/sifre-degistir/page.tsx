import Link from "next/link";

import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  const user = await requireUser();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          Şifre Değiştir
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-600">
          {user.mustChangePassword
            ? "Güvenliğiniz için ilk girişte şifrenizi değiştirmeniz gerekiyor."
            : "Yeni şifrenizi belirleyin."}
        </p>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <ChangePasswordForm mustChange={user.mustChangePassword} />
        </div>

        {!user.mustChangePassword ? (
          <p className="mt-6 text-center text-sm">
            <Link href="/admin" className="text-zinc-600 underline underline-offset-4">
              Panele dön
            </Link>
          </p>
        ) : null}
      </div>
    </main>
  );
}
