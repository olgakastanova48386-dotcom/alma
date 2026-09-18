import { NextResponse } from "next/server";
import { authDb, consumeAuthRateLimit, createSession, ensureAuthSchema, hashPassword, sessionCookie } from "@/lib/auth";

const NAME_RE = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\- ']{1,39}$/;

export async function POST(request: Request) {
  try {
    await ensureAuthSchema();
    const rate = await consumeAuthRateLimit(request, "register", 20, 10 * 60);
    if (!rate.allowed) return NextResponse.json({ error: "Слишком много попыток подряд. Подождите несколько минут и попробуйте снова." }, { status: 429 });
    const body = await request.json();
    const name = String(body.name || "").trim();
    const login = String(body.login || "").trim();
    const normalizedLogin = login.toLowerCase();
    const password = String(body.password || "");
    const gender = ["female", "male"].includes(body.gender) ? body.gender : "female";
    const consent = body.consent === true;
    if (!NAME_RE.test(name) || /(.)\1{3,}/i.test(name)) return NextResponse.json({ error: "Проверьте имя." }, { status: 400 });
    if (login.length < 3 || login.length > 40) return NextResponse.json({ error: "Логин должен содержать от 3 до 40 символов." }, { status: 400 });
    if (password.length < 8 || password.length > 128) return NextResponse.json({ error: "Пароль должен содержать от 8 до 128 символов." }, { status: 400 });
    if (!consent) return NextResponse.json({ error: "Нужно согласиться с правилами ALMA и обработкой данных." }, { status: 400 });

    const database = authDb();
    const existing = await database.prepare("SELECT id FROM users WHERE login = ? COLLATE NOCASE").bind(normalizedLogin).first();
    if (existing) return NextResponse.json({ error: "Такой логин уже занят." }, { status: 409 });

    const { hash, salt } = await hashPassword(password);
    const now = Math.floor(Date.now() / 1000);
    const userId = crypto.randomUUID();
    const legacyPhone = "login-" + userId;
    await database.prepare("INSERT INTO users (id, name, phone, login, gender, password_hash, password_salt, marketing_sms, phone_verified, email_verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 1, ?)").bind(userId, name, legacyPhone, normalizedLogin, gender, hash, salt, now).run();
    const token = await createSession(userId);
    const response = NextResponse.json({ ok: true, requiresVerification: false, user: { id: userId, name, login, gender } }, { status: 201 });
    response.headers.set("Set-Cookie", sessionCookie(token));
    return response;
  } catch (error) {
    console.error("register error", error);
    return NextResponse.json({ error: "Не удалось создать аккаунт. Попробуйте ещё раз." }, { status: 500 });
  }
}
