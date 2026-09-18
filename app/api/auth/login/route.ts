import { NextResponse } from "next/server";

import { authDb, consumeAuthRateLimit, createSession, ensureAuthSchema, sessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await ensureAuthSchema();
    const rate = await consumeAuthRateLimit(request, "login", 10, 15 * 60);
    if (!rate.allowed) return NextResponse.json({ error: "Слишком много попыток входа. Попробуйте позже." }, { status: 429 });
    const body = await request.json(); const login = String(body.login || "").trim(); const normalizedLogin = login.toLowerCase(); const password = String(body.password || "");
    if (login.length < 3 || !password) return NextResponse.json({ error: "Проверьте логин и пароль." }, { status: 400 });
    const user = await authDb().prepare(`SELECT id, name, login, gender, password_hash, password_salt FROM users WHERE login = ? COLLATE NOCASE`).bind(normalizedLogin).first();
    if (!user || !(await verifyPassword(password, user.password_salt, user.password_hash))) return NextResponse.json({ error: "Неверный логин или пароль." }, { status: 401 });
    const token = await createSession(user.id); const response = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, login, gender: user.gender } }); response.headers.set("Set-Cookie", sessionCookie(token)); return response;
  } catch (error) { console.error("login error", error); return NextResponse.json({ error: "Не удалось войти. Попробуйте ещё раз." }, { status: 500 }); }
}
