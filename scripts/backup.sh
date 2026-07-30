#!/usr/bin/env bash
#
# cafe-infra — yedekleme
#
# SQLite veritabanini (canli calisirken guvenli sekilde, .backup ile) ve
# yuklenen gorselleri tek bir klasore yedekler.
#
# Kullanim:
#   ./scripts/backup.sh                      # varsayilan: /data -> ./backups
#   DATA_DIR=/data BACKUP_DIR=/yedek ./scripts/backup.sh
#   KEEP_DAYS=30 ./scripts/backup.sh         # 30 gunden eski yedekleri sil
#
# Docker icinden:
#   docker exec cafe-infra /app/scripts/backup.sh
# Host'tan (volume uzerinden):
#   docker run --rm -v cafe_data:/data -v "$PWD/backups:/backups" \
#     -e BACKUP_DIR=/backups alpine sh -c "apk add sqlite tar && /backup.sh"
#
set -euo pipefail

DATA_DIR="${DATA_DIR:-/data}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
KEEP_DAYS="${KEEP_DAYS:-14}"

DB_PATH="${DB_PATH:-$DATA_DIR/app.db}"
UPLOADS_PATH="${UPLOADS_PATH:-$DATA_DIR/uploads}"

STAMP="$(date +%Y%m%d-%H%M%S)"
TARGET="$BACKUP_DIR/$STAMP"

echo "==> cafe-infra yedekleme"
echo "    veri kaynagi : $DATA_DIR"
echo "    hedef        : $TARGET"

if [ ! -f "$DB_PATH" ]; then
  echo "HATA: veritabani bulunamadi: $DB_PATH" >&2
  exit 1
fi

mkdir -p "$TARGET"

# --- 1) Veritabani -----------------------------------------------------------
# .backup komutu WAL modunda bile tutarli bir kopya alir; uygulama
# calismaya devam edebilir.
if command -v sqlite3 >/dev/null 2>&1; then
  echo "--> Veritabani yedekleniyor (sqlite3 .backup)"
  sqlite3 "$DB_PATH" ".backup '$TARGET/app.db'"
else
  echo "UYARI: sqlite3 bulunamadi, dosya kopyasi aliniyor (WAL dahil)."
  cp "$DB_PATH" "$TARGET/app.db"
  [ -f "$DB_PATH-wal" ] && cp "$DB_PATH-wal" "$TARGET/app.db-wal"
  [ -f "$DB_PATH-shm" ] && cp "$DB_PATH-shm" "$TARGET/app.db-shm"
fi

# Butunluk kontrolu
if command -v sqlite3 >/dev/null 2>&1; then
  RESULT="$(sqlite3 "$TARGET/app.db" "PRAGMA integrity_check;")"
  if [ "$RESULT" != "ok" ]; then
    echo "HATA: yedek butunluk kontrolunden gecmedi: $RESULT" >&2
    exit 1
  fi
  echo "    butunluk kontrolu: ok"
fi

# --- 2) Yuklenen gorseller ---------------------------------------------------
if [ -d "$UPLOADS_PATH" ]; then
  echo "--> Gorseller arsivleniyor (uploads.tar.gz)"
  tar -czf "$TARGET/uploads.tar.gz" -C "$(dirname "$UPLOADS_PATH")" "$(basename "$UPLOADS_PATH")"
else
  echo "UYARI: uploads klasoru yok, atlaniyor: $UPLOADS_PATH"
fi

# --- 3) Ozet -----------------------------------------------------------------
{
  echo "tarih      : $(date -Iseconds)"
  echo "kaynak     : $DATA_DIR"
  echo "db boyutu  : $(du -h "$TARGET/app.db" | cut -f1)"
  [ -f "$TARGET/uploads.tar.gz" ] && echo "uploads    : $(du -h "$TARGET/uploads.tar.gz" | cut -f1)"
} > "$TARGET/INFO.txt"

cat "$TARGET/INFO.txt"

# --- 4) Eski yedekleri temizle ----------------------------------------------
if [ "$KEEP_DAYS" -gt 0 ]; then
  echo "--> $KEEP_DAYS gunden eski yedekler siliniyor"
  find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -mtime "+$KEEP_DAYS" -exec rm -rf {} + 2>/dev/null || true
fi

echo "==> Tamamlandi: $TARGET"

# -----------------------------------------------------------------------------
# GERI YUKLEME (manuel):
#   1) docker compose down
#   2) cp <yedek>/app.db /data/app.db
#      rm -f /data/app.db-wal /data/app.db-shm
#   3) tar -xzf <yedek>/uploads.tar.gz -C /data
#   4) docker compose up -d
# -----------------------------------------------------------------------------
