import { NextResponse } from "next/server";
import { authDb, consumeAuthRateLimit, createSession, ensureAuthSchema, isValidEmail, normalizeEmail, sessionCookie, verifyEmailCode } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await ensureAuthSchema(); const rate = await consumeAuthRateLimit(request, "verify-email", 10, 15 * 60); if (!rate.allowed) return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
    const body = await request.json(); const email = normalizeEmail(String(body.email || "")); const code = String(body.code || "").replace(/\D/g, "");
    if (!isValidEmail(email) || !/^\d{6}$/.test(code)) return NextResponse.json({ error: "Проверьте почту и шестизначный код." }, { status: 400 });
    const ok = await verifyEmailCode(email, "verify", code); if (!ok) return NextResponse.json({ error: "Код неверный или истёк." }, { status: 400 });
    const user = await authDb().prepare("SELECT id, name, email, gender FROM users WHERE email = ?").bind(email).first(); if (!user) return NextResponse.json({ error: "Аккаунт не найден." }, { status: 404 });
    await authDb().prepare("UPDATE users SET email_verified = 1 WHERE id = ?").bind(user.id).run(); const token = await createSession(user.id); const response = NextResponse.json({ ok: true, user }); response.headers.set("Set-Cookie", sessionCookie(token)); return response;
  } catch (error) { console.error("verify-email error", error); return NextResponse.json({ error: "Не удалось подтвердить электронную почту." }, { status: 500 }); }
}
