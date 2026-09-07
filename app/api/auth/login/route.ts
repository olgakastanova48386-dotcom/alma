import { NextResponse } from "next/server";
import { authDb, consumeAuthRateLimit, createSession, ensureAuthSchema, isValidEmail, normalizeEmail, sessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await ensureAuthSchema();
    const rate = await consumeAuthRateLimit(request, "login", 10, 15 * 60);
    if (!rate.allowed) return NextResponse.json({ error: "Слишком много попыток входа. Попробуйте позже." }, { status: 429 });
    const body = await request.json(); const email = normalizeEmail(String(body.email || "")); const password = String(body.password || "");
    if (!isValidEmail(email) || !password) return NextResponse.json({ error: "Проверьте почту и пароль." }, { status: 400 });
    const user = await authDb().prepare(`SELECT id, name, email, gender, password_hash, password_salt, email_verified FROM users WHERE email = ?`).bind(email).first();
    if (!user || !(await verifyPassword(password, user.password_salt, user.password_hash))) return NextResponse.json({ error: "Неверная почта или пароль." }, { status: 401 });
    if (Number(user.email_verified) !== 1) return NextResponse.json({ error: "Сначала подтвердите электронную почту.", requiresVerification: true, email }, { status: 403 });
    const token = await createSession(user.id); const response = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, gender: user.gender } }); response.headers.set("Set-Cookie", sessionCookie(token)); return response;
  } catch (error) { console.error("login error", error); return NextResponse.json({ error: "Не удалось войти. Попробуйте ещё раз." }, { status: 500 }); }
}
