import { NextResponse } from "next/server";
import { authDb, ensureAuthSchema, getCurrentUser } from "@/lib/auth";
export async function POST(request:Request){
 try{
  await ensureAuthSchema();
  const user=await getCurrentUser(request);
  if(String(user?.login||"").trim().toLowerCase()==="pr_pretty_8") return NextResponse.json({ok:true,excluded:true});
  const body=await request.json().catch(()=>({}));
  const path=String(body?.path||"").trim().slice(0,160);
  const visitorId=String(body?.visitorId||"").trim().slice(0,80);
  if(!path.startsWith("/")||path.startsWith("/api")||path.startsWith("/admin")||!visitorId) return NextResponse.json({ok:false},{status:400});
  await authDb().prepare("INSERT INTO page_views (id,path,visitor_id,created_at) VALUES (?,?,?,?)").bind(crypto.randomUUID(),path,visitorId,Math.floor(Date.now()/1000)).run();
  return NextResponse.json({ok:true});
 }catch(error){console.error("pageview error",error);return NextResponse.json({ok:false},{status:500});}
}