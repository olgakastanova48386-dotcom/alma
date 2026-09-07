import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSavedRouteDraft, saveRouteDraft } from "@/lib/payments";

function validRoute(route: any) {
  return route && typeof route === "object" && typeof route.mood === "string" && typeof route.budget === "string" && typeof route.company === "string" && typeof route.duration === "string" && Array.isArray(route.interests) && Array.isArray(route.placeIds);
}

export async function GET(request: Request) {
  const user = await getCurrentUser(request) as any;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const saved = await getSavedRouteDraft(user.id);
    return NextResponse.json({ saved });
  } catch (error) {
    console.error("route draft get error", error);
    return NextResponse.json({ error: "Не удалось загрузить маршрут." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request) as any;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const body = await request.json().catch(() => ({}));
    if (!validRoute(body.route)) return NextResponse.json({ error: "invalid_route" }, { status: 400 });
    const result = await saveRouteDraft(user.id, body.route);
    return NextResponse.json(result);
  } catch (error) {
    console.error("route draft save error", error);
    return NextResponse.json({ error: "Не удалось сохранить маршрут." }, { status: 500 });
  }
}
