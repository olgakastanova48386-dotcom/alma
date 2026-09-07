import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSavedRouteDraft, saveRouteDraft } from "@/lib/payments";

type AuthUser = { id: string };
type RouteDraft = {
  mood: string;
  budget: string;
  company: string;
  duration: string;
  interests: string[];
  placeIds: number[];
  hardcore?: boolean;
  createdAt?: string;
};

function validRoute(route: unknown): route is RouteDraft {
  if (!route || typeof route !== "object") return false;
  const value = route as Partial<RouteDraft>;
  return typeof value.mood === "string" && typeof value.budget === "string" && typeof value.company === "string" && typeof value.duration === "string" && Array.isArray(value.interests) && value.interests.every((item) => typeof item === "string") && Array.isArray(value.placeIds) && value.placeIds.every((id) => Number.isInteger(id) && id > 0);
}

export async function GET(request: Request) {
  const user = await getCurrentUser(request) as AuthUser | null;
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
  const user = await getCurrentUser(request) as AuthUser | null;
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
