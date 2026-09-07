import { NextResponse } from "next/server";
import { authDb, consumeAuthRateLimit, ensureAuthSchema, hashPassword, isValidEmail, issueEmailCode, normalizeEmail, sendEmailCode } from "@/lib/auth";

const NAME_RE = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\- ']{1,39}$/;

export async function POST(request: Request) {
  try {
    await ensureAuthSchema();
    const rate = await consumeAuthRateLimit(request, "register", 5, 60 * 60);
    if (!rate.allowed) return NextResponse.json({ error: "Слишком много попыток регистрации. Попробуйте позже." }, { status: 429 });
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = normalizeEmail(String(body.email || ""));
    const password = String(body.password || "");
    const gender = ["female", "male", "unspecified"].includes(body.gender) ? body.gender : "unspecified";
    const consent = body.consent === true;
    if (!NAME_RE.test(name) || /(.)\1{3,}/i.test(name)) return NextResponse.json({ error: "Проверьте имя." }, { status: 400 });
    if (!isValidEmail(email)) return NextResponse.json({ error: "Проверьте адрес электронной почты." }, { status: 400 });
    if (password.length < 8 || password.length > 128) return NextResponse.json({ error: "Пароль должен содержать от 8 до 128 символов." }, { status: 400 });
    if (!consent) return NextResponse.json({ error: "Нужно согласиться с правилами ALMA и обработкой данных." }, { status: 400 });
    const existing = await authDb().prepare("SELECT id, email_verified FROM users WHERE email = ?").bind(email).first();
    if (existing && Number(existing.email_verified) === 1) return NextResponse.json({ error: "Аккаунт с этой почтой уже существует." }, { status: 409 });
    if (!existing) {
      const id = crypto.randomUUID(); const { hash, salt } = await hashPassword(password); const now = Math.floor(Date.now() / 1000);
      const legacyPhone = `email-${id}`;
      await authDb().prepare(`INSERT INTO users (id, name, phone, email, gender, password_hash, password_salt, marketing_sms, phone_verified, email_verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?)`).bind(id, name, legacyPhone, email, gender, hash, salt, now).run();
    }
    const code = await issueEmailCode(email, "verify");
    await sendEmailCode(email, code, "verify");
    return NextResponse.json({ ok: true, requiresVerification: true, email }, { status: 201 });
  } catch (error) {
    console.error("register error", error);
    if (error instanceof Error && error.message === "EMAIL_PROVIDER_NOT_CONFIGURED") return NextResponse.json({ error: "Почтовая отправка ALMA ещё не подключена." }, { status: 503 });
    return NextResponse.json({ error: "Не удалось создать аккаунт. Попробуйте ещё раз." }, { status: 500 });
  }
}
