import { NextResponse } from "next/server";
import { authDb, consumeAuthRateLimit, ensureAuthSchema, hashPassword, normalizePhone, verifyPhoneCode } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await ensureAuthSchema();
    const rate = await consumeAuthRateLimit(request, "reset-password", 10, 15 * 60);
    if (!rate.allowed) return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });

    const body = await request.json();
    const phone = normalizePhone(String(body.phone || ""));
    const code = String(body.code || "").replace(/\D/g, "");
    const password = String(body.password || "");

    if (!/^\+?[1-9]\d{9,14}$/.test(phone) || !/^\d{6}$/.test(code)) return NextResponse.json({ error: "Проверьте номер и шестизначный код." }, { status: 400 });
    if (password.length < 8 || password.length > 128) return NextResponse.json({ error: "Пароль должен содержать от 8 до 128 символов." }, { status: 400 });

    const user = await authDb().prepare("SELECT id FROM users WHERE phone = ?").bind(phone).first();
    if (!user) return NextResponse.json({ error: "Аккаунт не найден." }, { status: 404 });

    const ok = await verifyPhoneCode(phone, "reset", code);
    if (!ok) return NextResponse.json({ error: "Код неверный или истёк." }, { status: 400 });

    const { hash, salt } = await hashPassword(password);
    await authDb().prepare("UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?").bind(hash, salt, user.id).run();
    await authDb().prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.id).run();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("reset-password error", error);
    return NextResponse.json({ error: "Не удалось восстановить доступ." }, { status: 500 });
  }
}
