import { NextResponse } from "next/server";
import { authDb, createSession, ensureAuthSchema, hashPassword } from "@/lib/auth";

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

export async function POST(request: Request) {
  if (request.headers.get("x-alma-registration-probe") !== "alma-2026-registration-check")
    return NextResponse.json({ ok: false }, { status: 404 });

  const database = authDb();
  const id = `registration-probe-${crypto.randomUUID()}`;
  const login = `registration_probe_${Date.now()}`;
  let stage = "schema";
  try {
    await ensureAuthSchema();
    stage = "password";
    const { hash, salt } = await hashPassword("registration-probe-password");
    const now = Math.floor(Date.now() / 1000);
    stage = "user-insert";
    await database
      .prepare("INSERT INTO users (id, name, phone, login, gender, password_hash, password_salt, marketing_sms, phone_verified, email_verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 1, ?)")
      .bind(id, "Проверка", `probe-${id}`, login, "female", hash, salt, now)
      .run();
    stage = "session-insert";
    await createSession(id);
    stage = "cleanup";
    await database.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id).run();
    await database.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
    return NextResponse.json({ ok: true, registration: true });
  } catch (error) {
    await database.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id).run().catch(() => undefined);
    await database.prepare("DELETE FROM users WHERE id = ?").bind(id).run().catch(() => undefined);
    return NextResponse.json(
      { ok: false, stage, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
