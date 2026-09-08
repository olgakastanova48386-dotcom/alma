import { NextResponse } from "next/server";
import { authDb, getCurrentUser } from "@/lib/auth";
import { ensurePaymentSchema, getRoutePurchaseStatus, ROUTE_PRODUCT } from "@/lib/payments";

type AuthUser = { id: string };

export async function GET(request: Request) {
  const user = await getCurrentUser(request) as AuthUser | null;
  if (!user) return NextResponse.json({ authenticated: false, entitled: false, status: "none" }, { status: 401 });
  try {
    await ensurePaymentSchema();
    let status = await getRoutePurchaseStatus(user.id);

    if (!status.entitled && status.routeKey) {
      const countRow = await authDb().prepare("SELECT COUNT(*) AS count FROM entitlements WHERE user_id = ? AND product = ?")
        .bind(user.id, ROUTE_PRODUCT).first();
      const usedRoutes = Number(countRow?.count || 0);

      if (usedRoutes === 0) {
        const now = Math.floor(Date.now() / 1000);
        await authDb().prepare(`INSERT INTO entitlements (user_id, product, route_key, granted_at, source_request_id)
          VALUES (?, ?, ?, ?, 'free_first_route')
          ON CONFLICT(user_id, product, route_key) DO NOTHING`)
          .bind(user.id, ROUTE_PRODUCT, status.routeKey, now).run();
        status = { entitled: true, status: "free", routeKey: status.routeKey, grantedAt: now };
      }
    }

    return NextResponse.json({ authenticated: true, ...status });
  } catch (error) {
    console.error("payment status error", error);
    return NextResponse.json({ error: "Не удалось проверить доступ к маршруту." }, { status: 500 });
  }
}
