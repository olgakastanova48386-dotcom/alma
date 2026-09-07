import { NextResponse } from "next/server";
import { confirmPaymentByReference, isAdminRequest } from "@/lib/payments";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const body = await request.json().catch(() => ({}));
    const reference = String(body.reference || "").trim().toUpperCase();
    if (!/^ALMA-[A-F0-9]{8}$/.test(reference)) return NextResponse.json({ error: "invalid_reference" }, { status: 400 });
    const result = await confirmPaymentByReference(reference);
    if (!result) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    console.error("payment confirm error", error);
    return NextResponse.json({ error: "Не удалось подтвердить оплату." }, { status: 500 });
  }
}
