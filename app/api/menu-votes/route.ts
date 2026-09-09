import { NextResponse } from "next/server";
import { authDb, getCurrentUser } from "@/lib/auth";
import { getPlaceMenu } from "@/data/placeMenus";

type AuthUser = { id: string };
type VoteRow = { item_id: string; votes: number | string };

async function voteState(placeId: number, userId?: string) {
  const result = await authDb()
    .prepare(
      "SELECT item_id, COUNT(*) AS votes FROM menu_votes WHERE place_id = ? GROUP BY item_id",
    )
    .bind(placeId)
    .all();
  const counts = Object.fromEntries(
    ((result?.results || []) as VoteRow[]).map((row) => [
      row.item_id,
      Number(row.votes),
    ]),
  );
  let selected: string[] = [];
  if (userId) {
    const own = await authDb()
      .prepare(
        "SELECT item_id FROM menu_votes WHERE place_id = ? AND user_id = ?",
      )
      .bind(placeId, userId)
      .all();
    selected = (own?.results || []).map(
      (row: { item_id: string }) => row.item_id,
    );
  }
  return { counts, selected };
}

function validChoice(placeId: number, itemId: string) {
  return (
    getPlaceMenu(placeId)?.items.some((item) => item.id === itemId) ?? false
  );
}

export async function GET(request: Request) {
  const placeId = Number(new URL(request.url).searchParams.get("placeId"));
  if (!Number.isInteger(placeId) || !getPlaceMenu(placeId)) {
    return NextResponse.json({ error: "invalid_place_id" }, { status: 400 });
  }
  const user = (await getCurrentUser(request)) as AuthUser | null;
  return NextResponse.json(await voteState(placeId, user?.id));
}

export async function POST(request: Request) {
  const user = (await getCurrentUser(request)) as AuthUser | null;
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const placeId = Number(body.placeId);
  const itemId = String(body.itemId ?? "");
  if (!Number.isInteger(placeId) || !validChoice(placeId, itemId)) {
    return NextResponse.json({ error: "invalid_choice" }, { status: 400 });
  }
  await authDb()
    .prepare(
      "INSERT OR IGNORE INTO menu_votes (user_id, place_id, item_id, created_at) VALUES (?, ?, ?, ?)",
    )
    .bind(user.id, placeId, itemId, Math.floor(Date.now() / 1000))
    .run();
  return NextResponse.json(await voteState(placeId, user.id));
}

export async function DELETE(request: Request) {
  const user = (await getCurrentUser(request)) as AuthUser | null;
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const placeId = Number(body.placeId);
  const itemId = String(body.itemId ?? "");
  if (!Number.isInteger(placeId) || !validChoice(placeId, itemId)) {
    return NextResponse.json({ error: "invalid_choice" }, { status: 400 });
  }
  await authDb()
    .prepare(
      "DELETE FROM menu_votes WHERE user_id = ? AND place_id = ? AND item_id = ?",
    )
    .bind(user.id, placeId, itemId)
    .run();
  return NextResponse.json(await voteState(placeId, user.id));
}
