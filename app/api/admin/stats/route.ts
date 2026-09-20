import { NextResponse } from "next/server";
import { authDb, ensureAuthSchema, getCurrentUser } from "@/lib/auth";
export async function GET(request: Request) {
  try {
    await ensureAuthSchema();
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Необходим вход." }, { status: 401 });
    const db = authDb();
    const owner = await db.prepare("SELECT id FROM users ORDER BY created_at ASC LIMIT 1").first();
    if (!owner || String(owner.id) !== String(user.id)) return NextResponse.json({ error: "Нет доступа." }, { status: 403 });
    const now = Math.floor(Date.now() / 1000), day = 86400;
    const s = await db.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS today, SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS week, SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS month, MAX(created_at) AS last_registration FROM users").bind(now-day,now-7*day,now-30*day).first();
    return NextResponse.json({ total:Number(s?.total||0), today:Number(s?.today||0), week:Number(s?.week||0), month:Number(s?.month||0), lastRegistration:s?.last_registration?Number(s.last_registration):null });
  } catch (error) { console.error("admin stats error", error); return NextResponse.json({ error:"Не удалось загрузить статистику." },{status:500}); }
}