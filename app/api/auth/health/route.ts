import { NextResponse } from "next/server";
import { authDb, ensureAuthSchema } from "@/lib/auth";

export async function GET() {
  try {
    await ensureAuthSchema();
    const row = await authDb().prepare("SELECT COUNT(*) AS count FROM users").first();
    return NextResponse.json({ ok: true, database: true, users: Number(row?.count || 0) });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("auth health error", error);
    return NextResponse.json({ ok: false, database: false, error: message }, { status: 500 });
  }
}
