import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRoutePurchaseStatus } from "@/lib/payments";

export async function GET(request: Request) {
  const user = await getCurrentUser(request) as any;
  if (!user) return NextResponse.json({ authenticated: false, entitled: false, status: "none" }, { status: 401 });
  try {
    const status = await getRoutePurchaseStatus(user.id);
    return NextResponse.json({ authenticated: true, ...status });
  } catch (error) {
    console.error("payment status error", error);
    return NextResponse.json({ error: "Не удалось проверить оплату." }, { status: 500 });
  }
}
