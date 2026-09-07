import { NextResponse } from "next/server";
import { authDb, consumeAuthRateLimit, ensureAuthSchema, hashPassword, issuePhoneCode, normalizePhone, sendSmsCode } from "@/lib/auth";

const NAME_RE = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\- ']{1,39}$/;

export async function POST(request: Request) {
  try {
    await ensureAuthSchema();
    const rate = await consumeAuthRateLimit(request, "register", 5, 60 * 60);
    if (!rate.allowed) return NextResponse.json({ error: "Слишком много попыток регистрации. Попробуйте позже." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });

    const body = await request.json();
    const name = String(body.name || "").trim();
    const phone = normalizePhone(String(body.phone || ""));
    const password = String(body.password || "");
    const gender = ["female", "male", "unspecified"].includes(body.gender) ? body.gender : "unspecified";
    const consent = body.consent === true;
    const marketingSms = body.marketingSms === true ? 1 : 0;

    if (!NAME_RE.test(name) || /(.)\1{3,}/i.test(name)) return NextResponse.json({ error: "Проверьте имя." }, { status: 400 });
    if (!/^\+?[1-9]\d{9,14}$/.test(phone)) return NextResponse.json({ error: "Проверьте номер телефона." }, { status: 400 });
    if (password.length < 8 || password.length > 128) return NextResponse.json({ error: "Пароль должен содержать от 8 до 128 символов." }, { status: 400 });
    if (!consent) return NextResponse.json({ error: "Нужно согласиться с правилами ALMA и обработкой данных." }, { status: 400 });

    const existing = await authDb().prepare("SELECT id, phone_verified FROM users WHERE phone = ?").bind(phone).first();
    if (existing && Number(existing.phone_verified) === 1) return NextResponse.json({ error: "Аккаунт с этим номером уже существует." }, { status: 409 });

    if (!existing) {
      const id = crypto.randomUUID();
      const { hash, salt } = await hashPassword(password);
      const now = Math.floor(Date.now() / 1000);
      await authDb().prepare(`INSERT INTO users (id, name, phone, gender, password_hash, password_salt, marketing_sms, phone_verified, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`).bind(id, name, phone, gender, hash, salt, marketingSms, now).run();
    }

    const code = await issuePhoneCode(phone, "verify");
    await sendSmsCode(phone, code, "verify");
    return NextResponse.json({ ok: true, requiresVerification: true, phone }, { status: 201 });
  } catch (error) {
    console.error("register error", error);
    if (error instanceof Error && error.message === "SMS_PROVIDER_NOT_CONFIGURED") return NextResponse.json({ error: "Регистрация подготовлена, но SMS-сервис ещё не подключён к ALMA." }, { status: 503 });
    return NextResponse.json({ error: "Не удалось создать аккаунт. Попробуйте ещё раз." }, { status: 500 });
  }
}
