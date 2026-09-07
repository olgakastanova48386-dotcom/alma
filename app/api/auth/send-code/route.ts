import { NextResponse } from "next/server";
import { authDb, consumeAuthRateLimit, ensureAuthSchema, issuePhoneCode, normalizePhone, sendSmsCode } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await ensureAuthSchema();
    const rate = await consumeAuthRateLimit(request, "send-code", 5, 15 * 60);
    if (!rate.allowed) return NextResponse.json({ error: "Слишком много запросов кода. Попробуйте позже." }, { status: 429 });

    const body = await request.json();
    const phone = normalizePhone(String(body.phone || ""));
    const purpose = body.purpose === "reset" ? "reset" : "verify";
    if (!/^\+?[1-9]\d{9,14}$/.test(phone)) return NextResponse.json({ error: "Проверьте номер телефона." }, { status: 400 });

    const user = await authDb().prepare("SELECT id, phone_verified FROM users WHERE phone = ?").bind(phone).first();
    if (purpose === "verify" && !user) return NextResponse.json({ error: "Аккаунт с таким номером не найден." }, { status: 404 });
    if (purpose === "reset" && !user) return NextResponse.json({ ok: true });
    if (purpose === "verify" && Number(user.phone_verified) === 1) return NextResponse.json({ ok: true, alreadyVerified: true });

    const code = await issuePhoneCode(phone, purpose);
    await sendSmsCode(phone, code, purpose);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("send-code error", error);
    if (error instanceof Error && error.message === "SMS_PROVIDER_NOT_CONFIGURED") return NextResponse.json({ error: "SMS-сервис ещё не подключён к ALMA." }, { status: 503 });
    return NextResponse.json({ error: "Не удалось отправить код. Попробуйте ещё раз." }, { status: 500 });
  }
}
