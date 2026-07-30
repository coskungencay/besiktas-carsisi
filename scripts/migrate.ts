/**
 * Drizzle migration'larini uygular.
 * Kullanim: pnpm db:migrate
 *
 * Container acilisinda da calistirilir (docker-compose command).
 */
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const dbPath = resolve(
  process.cwd(),
  process.env.DATABASE_PATH?.trim() || "./data/app.db",
);

mkdirSync(dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite);

migrate(db, { migrationsFolder: resolve(process.cwd(), "drizzle") });

console.log(`[migrate] Tamamlandi -> ${dbPath}`);
sqlite.close();
