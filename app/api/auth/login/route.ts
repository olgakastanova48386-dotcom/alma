import { NextResponse } from "next/server";
import { authDb, consumeAuthRateLimit, createSession, ensureAuthSchema, normalizePhone, sessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await ensureAuthSchema();
    const rate = await consumeAuthRateLimit(request, "login", 10, 15 * 60);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Слишком много попыток входа. Попробуйте позже." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
    }

    const body = await request.json();
    const phone = normalizePhone(String(body.phone || ""));
    const password = String(body.password || "");

    if (!/^\+?[1-9]\d{9,14}$/.test(phone) || !password) {
      return NextResponse.json({ error: "Проверьте номер телефона и пароль." }, { status: 400 });
    }

    const user = await authDb().prepare(`SELECT id, name, phone, gender, password_hash, password_salt FROM users WHERE phone = ?`).bind(phone).first();
    if (!user || !(await verifyPassword(password, user.password_salt, user.password_hash))) {
      return NextResponse.json({ error: "Неверный номер телефона или пароль." }, { status: 401 });
    }

    const token = await createSession(user.id);
    const response = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, phone: user.phone, gender: user.gender } });
    response.headers.set("Set-Cookie", sessionCookie(token));
    return response;
  } catch (error) {
    console.error("login error", error);
    return NextResponse.json({ error: "Не удалось войти. Попробуйте ещё раз." }, { status: 500 });
  }
}
