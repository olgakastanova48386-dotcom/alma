import { NextResponse } from "next/server";
import { clearSessionCookie, deleteCurrentSession, ensureAuthSchema } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await ensureAuthSchema();
    await deleteCurrentSession(request);
  } catch (error) {
    console.error("logout error", error);
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", clearSessionCookie());
  return response;
}
