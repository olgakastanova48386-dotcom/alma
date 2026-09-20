import { NextResponse } from "next/server";
import { authDb, ensureAuthSchema } from "@/lib/auth";
export async function POST(request:Request){
 try{
  await ensureAuthSchema();
  const body=await request.json().catch(()=>({}));
  const path=String(body?.path||"").trim().slice(0,160);
  if(!path.startsWith("/")||path.startsWith("/api")||path.startsWith("/admin")) return NextResponse.json({ok:false},{status:400});
  await authDb().prepare("INSERT INTO page_views (id,path,created_at) VALUES (?,?,?)").bind(crypto.randomUUID(),path,Math.floor(Date.now()/1000)).run();
  return NextResponse.json({ok:true});
 }catch(error){console.error("pageview error",error);return NextResponse.json({ok:false},{status:500});}
}