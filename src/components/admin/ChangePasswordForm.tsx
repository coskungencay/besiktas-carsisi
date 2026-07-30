"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { changePasswordAction } from "@/actions/account";
import {
  FieldError,
  FormMessage,
  SubmitButton,
  inputClass,
  labelClass,
} from "@/components/admin/ui";
import { IDLE } from "@/lib/action-result";

export function ChangePasswordForm({ mustChange }: { mustChange: boolean }) {
  const router = useRouter();
  const [state, formAction] = useActionState(changePasswordAction, IDLE);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
      const timer = setTimeout(() => router.replace("/admin"), 900);
      return () => clearTimeout(timer);
    }
  }, [state.status, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className={labelClass}>
          Mevcut şifre
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
        <FieldError state={state} name="currentPassword" />
      </div>

      <div>
        <label htmlFor="newPassword" className={labelClass}>
          Yeni şifre <span className="text-zinc-500">(en az 8 karakter)</span>
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <FieldError state={state} name="newPassword" />
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Yeni şifre (tekrar)
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <FieldError state={state} name="confirmPassword" />
      </div>

      <FormMessage state={state} />

      <div className="pt-1">
        <SubmitButton>
          {mustChange ? "Şifreyi Belirle ve Devam Et" : "Şifreyi Güncelle"}
        </SubmitButton>
      </div>
    </form>
  );
}
