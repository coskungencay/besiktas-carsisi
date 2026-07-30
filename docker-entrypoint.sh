#!/bin/sh
set -e

# Container her acilista migration'lari uygular ve (bos ise) seed calistirir.
# Ikisi de idempotent; mevcut veriye dokunmaz.

echo "[entrypoint] Migration'lar uygulaniyor..."
node_modules/.bin/tsx scripts/migrate.ts

if [ "${RUN_SEED:-true}" = "true" ]; then
  echo "[entrypoint] Seed calistiriliyor..."
  node_modules/.bin/tsx scripts/seed.ts || echo "[entrypoint] Seed atlandi."
fi

echo "[entrypoint] Uygulama baslatiliyor..."
exec "$@"
