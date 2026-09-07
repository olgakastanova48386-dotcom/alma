import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    return NextResponse.json({ user });
  } catch (error) {
    console.error("me error", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
