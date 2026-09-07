import { NextResponse } from "next/server";
import { authDb, getCurrentUser } from "@/lib/auth";

type AuthUser = { id: string };
type FavoriteRow = { place_id: number | string };

export async function GET(request: Request) {
  const user = await getCurrentUser(request) as AuthUser | null;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const result = await authDb().prepare("SELECT place_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC").bind(user.id).all();
  const rows = (result?.results || []) as FavoriteRow[];
  const ids = rows.map((row) => Number(row.place_id)).filter(Number.isFinite);
  return NextResponse.json({ ids });
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request) as AuthUser | null;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const placeId = Number(body.placeId);
  if (!Number.isInteger(placeId) || placeId <= 0) {
    return NextResponse.json({ error: "invalid_place_id" }, { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000);
  await authDb().prepare("INSERT OR IGNORE INTO favorites (user_id, place_id, created_at) VALUES (?, ?, ?)")
    .bind(user.id, placeId, now).run();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser(request) as AuthUser | null;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const placeId = Number(body.placeId);
  if (!Number.isInteger(placeId) || placeId <= 0) {
    return NextResponse.json({ error: "invalid_place_id" }, { status: 400 });
  }

  await authDb().prepare("DELETE FROM favorites WHERE user_id = ? AND place_id = ?").bind(user.id, placeId).run();
  return NextResponse.json({ ok: true });
}
