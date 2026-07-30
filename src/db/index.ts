import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

/** site_settings tekil satirinin sabit id'si. */
export const SINGLETON_ID = 1;

export function resolveDatabasePath(): string {
  const raw = process.env.DATABASE_PATH?.trim() || "./data/app.db";
  return isAbsolute(raw) ? raw : resolve(process.cwd(), raw);
}

function createConnection() {
  const path = resolveDatabasePath();
  mkdirSync(dirname(path), { recursive: true });

  const sqlite = new Database(path);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("busy_timeout = 5000");
  return sqlite;
}

// Next.js dev modunda modul yeniden yuklendiginde yeni baglanti acilmasin.
const globalForDb = globalThis as unknown as {
  __cafeSqlite?: Database.Database;
};

export const sqlite = globalForDb.__cafeSqlite ?? createConnection();
if (process.env.NODE_ENV !== "production") {
  globalForDb.__cafeSqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });

export { schema };
