import { NextResponse } from "next/server";
import { authDb, ensureAuthSchema, getCurrentUser } from "@/lib/auth";
export async function GET(request: Request) {
  try {
    await ensureAuthSchema();
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Необходим вход." }, { status: 401 });
    const db = authDb();
    const ownerLogin = "pr_pretty_8";
    if (String(user.login || "").trim().toLowerCase() !== ownerLogin) return NextResponse.json({ error: "Нет доступа." }, { status: 403 });
    const now = Math.floor(Date.now() / 1000), day = 86400;
    const s = await db.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS today, SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS week, SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS month, MAX(created_at) AS last_registration FROM users").bind(now-day,now-7*day,now-30*day).first();
    const views = await db.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS today, SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS week, SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS month FROM page_views").bind(now-day,now-7*day,now-30*day).first();
    const visitors = await db.prepare("SELECT COUNT(DISTINCT visitor_id) AS total, COUNT(DISTINCT CASE WHEN created_at >= ? THEN visitor_id END) AS today, COUNT(DISTINCT CASE WHEN created_at >= ? THEN visitor_id END) AS week, COUNT(DISTINCT CASE WHEN created_at >= ? THEN visitor_id END) AS month FROM page_views WHERE visitor_id IS NOT NULL").bind(now-day,now-7*day,now-30*day).first();
    const pages = await db.prepare("SELECT path, COUNT(*) AS views FROM page_views GROUP BY path ORDER BY views DESC LIMIT 30").all();
    const photozones = await db.prepare("SELECT id, name, address, note, mime_type, image_base64, status, created_at FROM photozone_submissions WHERE status = ? ORDER BY created_at DESC LIMIT 50").bind("pending").all();
    return NextResponse.json({ total:Number(s?.total||0), today:Number(s?.today||0), week:Number(s?.week||0), month:Number(s?.month||0), lastRegistration:s?.last_registration?Number(s.last_registration):null, pageViews:{total:Number(views?.total||0),today:Number(views?.today||0),week:Number(views?.week||0),month:Number(views?.month||0)}, visitors:{total:Number(visitors?.total||0),today:Number(visitors?.today||0),week:Number(visitors?.week||0),month:Number(visitors?.month||0)}, pages:(pages?.results||[]).map((row:any)=>({path:String(row.path),views:Number(row.views||0)})), photozones:(photozones?.results||[]).map((row:any)=>({id:String(row.id),name:String(row.name),address:String(row.address),note:row.note?String(row.note):"",image:`data:${row.mime_type};base64,${row.image_base64}`,status:String(row.status),createdAt:Number(row.created_at)})) });
  } catch (error) { console.error("admin stats error", error); return NextResponse.json({ error:"Не удалось загрузить статистику." },{status:500}); }
}