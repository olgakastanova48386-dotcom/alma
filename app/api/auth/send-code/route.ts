import { NextResponse } from "next/server";
import { authDb, consumeAuthRateLimit, ensureAuthSchema, isValidEmail, issueEmailCode, normalizeEmail, sendEmailCode } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await ensureAuthSchema(); const rate = await consumeAuthRateLimit(request, "send-code", 5, 15 * 60); if (!rate.allowed) return NextResponse.json({ error: "Слишком много запросов кода. Попробуйте позже." }, { status: 429 });
    const body = await request.json(); const email = normalizeEmail(String(body.email || "")); const purpose = body.purpose === "reset" ? "reset" : "verify";
    if (!isValidEmail(email)) return NextResponse.json({ error: "Проверьте адрес электронной почты." }, { status: 400 });
    const user = await authDb().prepare("SELECT id, email_verified FROM users WHERE email = ?").bind(email).first();
    if (purpose === "verify" && !user) return NextResponse.json({ error: "Аккаунт с такой почтой не найден." }, { status: 404 });
    if (purpose === "reset" && !user) return NextResponse.json({ ok: true });
    if (purpose === "verify" && Number(user.email_verified) === 1) return NextResponse.json({ ok: true, alreadyVerified: true });
    const code = await issueEmailCode(email, purpose); await sendEmailCode(email, code, purpose); return NextResponse.json({ ok: true });
  } catch (error) { console.error("send-code error", error); if (error instanceof Error && error.message === "EMAIL_PROVIDER_NOT_CONFIGURED") return NextResponse.json({ error: "Почтовая отправка ALMA ещё не подключена." }, { status: 503 }); return NextResponse.json({ error: "Не удалось отправить письмо. Попробуйте ещё раз." }, { status: 500 }); }
}
