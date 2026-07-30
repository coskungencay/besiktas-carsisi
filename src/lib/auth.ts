import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import { account, session, user, verification } from "@/db/schema";
import { appUrl, authSecret } from "@/lib/env";

export const MIN_PASSWORD_LENGTH = 8;

export const auth = betterAuth({
  appName: "cafe-infra",
  baseURL: appUrl(),
  secret: authSecret(),
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    // Panelde tek admin var; kayit ekrani yok. Kullanici sadece seed ile olusur.
    disableSignUp: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    maxPasswordLength: 128,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      mustChangePassword: {
        type: "boolean",
        defaultValue: true,
        required: false,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 gun
    updateAge: 60 * 60 * 24, // gunde bir tazele
    // cookieCache KAPALI olmali: acik oldugunda mustChangePassword gibi
    // kullanici alanlari cereze donar ve sifre degisiminden sonra bile
    // 5 dakika boyunca eski deger okunur. SQLite okumasi zaten cok ucuz.
    cookieCache: { enabled: false },
  },
  advanced: {
    cookiePrefix: "cafe",
  },
  // nextCookies her zaman en son plugin olmali.
  plugins: [nextCookies()],
});

export type AppSession = typeof auth.$Infer.Session;
