import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createOrGetPendingRequest, markTransferSent } from "@/lib/payments";

export async function POST(request: Request) {
  const user = await getCurrentUser(request) as any;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const payment = await createOrGetPendingRequest(user.id);
    return NextResponse.json({ ok: true, payment });
  } catch (error) {
    console.error("payment request error", error);
    return NextResponse.json({ error: "Не удалось создать запрос на оплату." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser(request) as any;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const body = await request.json().catch(() => ({}));
    const reference = String(body.reference || "").trim().toUpperCase();
    if (!/^ALMA-[A-F0-9]{8}$/.test(reference)) return NextResponse.json({ error: "invalid_reference" }, { status: 400 });
    const payment = await markTransferSent(user.id, reference);
    if (!payment) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true, payment });
  } catch (error) {
    console.error("payment sent error", error);
    return NextResponse.json({ error: "Не удалось обновить заявку." }, { status: 500 });
  }
}
