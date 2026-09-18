import { NextResponse } from "next/server";
import { authDb, consumeAuthRateLimit, createSession, ensureAuthSchema, hashPassword, sessionCookie, verifyPassword } from "@/lib/auth";

const NAME_RE = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\- ']{1,39}$/;

const isTransientDatabaseError = (error: unknown) =>
  /D1|database|binding|busy|locked|timeout|temporar/i.test(
    error instanceof Error ? error.message : String(error),
  );

async function withDatabaseRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isTransientDatabaseError(error) || attempt === 2) throw error;
      await new Promise((resolve) => setTimeout(resolve, 120 * (attempt + 1)));
    }
  }
  throw lastError;
}

export async function POST(request: Request) {
  try {
    await withDatabaseRetry(() => ensureAuthSchema());
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

    const rate = await consumeAuthRateLimit(request, "register", 20, 10 * 60);
    if (!rate.allowed) return NextResponse.json({ error: "Слишком много попыток подряд. Подождите несколько минут и попробуйте снова." }, { status: 429 });

    const database = authDb();
    const existing = await withDatabaseRetry(() =>
      database
        .prepare("SELECT id, name, login, gender, password_hash, password_salt FROM users WHERE login = ? COLLATE NOCASE")
        .bind(normalizedLogin)
        .first(),
    );
    if (existing) {
      const sameAccount = await verifyPassword(
        password,
        String(existing.password_salt),
        String(existing.password_hash),
      );
      if (!sameAccount)
        return NextResponse.json({ error: "Такой логин уже занят." }, { status: 409 });

      // Повторная отправка после оборвавшегося ответа должна завершать
      // регистрацию, а не оставлять пользователя с недоступным аккаунтом.
      const token = await withDatabaseRetry(() => createSession(String(existing.id)));
      const response = NextResponse.json({
        ok: true,
        requiresVerification: false,
        user: {
          id: existing.id,
          name: existing.name,
          login: existing.login,
          gender: existing.gender,
        },
      });
      response.headers.set("Set-Cookie", sessionCookie(token));
      return response;
    }

    const { hash, salt } = await hashPassword(password);
    const now = Math.floor(Date.now() / 1000);
    const userId = crypto.randomUUID();
    const legacyPhone = "login-" + userId;
    await withDatabaseRetry(() =>
      database
        .prepare("INSERT INTO users (id, name, phone, login, gender, password_hash, password_salt, marketing_sms, phone_verified, email_verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 1, ?)")
        .bind(userId, name, legacyPhone, normalizedLogin, gender, hash, salt, now)
        .run(),
    );
    const token = await withDatabaseRetry(() => createSession(userId));
    const response = NextResponse.json({ ok: true, requiresVerification: false, user: { id: userId, name, login, gender } }, { status: 201 });
    response.headers.set("Set-Cookie", sessionCookie(token));
    return response;
  } catch (error) {
    console.error("register error", error);
    const message = error instanceof Error ? error.message : String(error);
    if (isTransientDatabaseError(error)) {
      return NextResponse.json({ error: "Сервис аккаунтов временно недоступен. Попробуйте ещё раз через минуту." }, { status: 503 });
    }
    return NextResponse.json({ error: "Не удалось создать аккаунт. Попробуйте ещё раз." }, { status: 500 });
  }
}
