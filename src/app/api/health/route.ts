import { NextResponse } from "next/server";

import { sqlite } from "@/db";

export const dynamic = "force-dynamic";

/**
 * Docker healthcheck ve Coolify icin. Sadece 200/503 doner.
 * DB dosyasina gercekten yazip okunabildigini kontrol eder.
 */
export function GET() {
  try {
    sqlite.prepare("select 1 as ok").get();
    return NextResponse.json(
      { status: "ok", time: new Date().toISOString() },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("[health] veritabani erisilemiyor:", error);
    return NextResponse.json(
      { status: "error" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}
