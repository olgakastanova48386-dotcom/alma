import { NextResponse } from "next/server";
import { authDb, consumeAuthRateLimit, createSession, ensureAuthSchema, normalizePhone, sessionCookie, verifyPhoneCode } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await ensureAuthSchema();
    const rate = await consumeAuthRateLimit(request, "verify-phone", 10, 15 * 60);
    if (!rate.allowed) return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });

    const body = await request.json();
    const phone = normalizePhone(String(body.phone || ""));
    const code = String(body.code || "").replace(/\D/g, "");
    if (!/^\+?[1-9]\d{9,14}$/.test(phone) || !/^\d{6}$/.test(code)) return NextResponse.json({ error: "Проверьте номер и шестизначный код." }, { status: 400 });

    const ok = await verifyPhoneCode(phone, "verify", code);
    if (!ok) return NextResponse.json({ error: "Код неверный или истёк." }, { status: 400 });

    const user = await authDb().prepare("SELECT id, name, phone, gender FROM users WHERE phone = ?").bind(phone).first();
    if (!user) return NextResponse.json({ error: "Аккаунт не найден." }, { status: 404 });
    await authDb().prepare("UPDATE users SET phone_verified = 1 WHERE id = ?").bind(user.id).run();

    const token = await createSession(user.id);
    const response = NextResponse.json({ ok: true, user });
    response.headers.set("Set-Cookie", sessionCookie(token));
    return response;
  } catch (error) {
    console.error("verify-phone error", error);
    return NextResponse.json({ error: "Не удалось подтвердить номер." }, { status: 500 });
  }
}
