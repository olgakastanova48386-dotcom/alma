import { NextResponse } from "next/server";
import { authDb, getCurrentUser, isPhotoModerator } from "@/lib/auth";

const MAX_BYTES = 1_500_000;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

function toBase64(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

export async function POST(request: Request) {
  try {
    const user: any = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Войдите в ALMA, чтобы добавить фото." }, { status: 401 });

    const form = await request.formData();
    const file = form.get("file");
    const placeId = Number(form.get("placeId"));
    const placeName = String(form.get("placeName") || "").trim();
    if (!(file instanceof File) || !Number.isFinite(placeId) || !placeName) {
      return NextResponse.json({ error: "Не удалось прочитать фотографию." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "Подойдут JPG, PNG или WEBP." }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "Фото должно быть меньше 1,5 МБ." }, { status: 400 });

    const id = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const imageBase64 = toBase64(new Uint8Array(await file.arrayBuffer()));
    await authDb().prepare(`INSERT INTO route_photos
      (id, user_id, place_id, place_name, mime_type, image_base64, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`)
      .bind(id, user.id, placeId, placeName, file.type, imageBase64, now).run();

    return NextResponse.json({ ok: true, id, status: "pending" });
  } catch (error) {
    console.error("route photo upload error", error);
    return NextResponse.json({ error: "Не удалось отправить фото. Попробуйте ещё раз." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const moderation = url.searchParams.get("moderation") === "1";
    const user: any = await getCurrentUser(request);

    if (moderation) {
      if (!user || !isPhotoModerator(user)) return NextResponse.json({ error: "Нет доступа." }, { status: 403 });
      const rows = await authDb().prepare(`SELECT id, place_id, place_name, mime_type, status, created_at
        FROM route_photos WHERE status = 'pending' ORDER BY created_at ASC LIMIT 100`).all();
      return NextResponse.json({ photos: rows.results || [] });
    }

    const placeId = Number(url.searchParams.get("placeId"));
    if (!Number.isFinite(placeId)) return NextResponse.json({ photos: [] });
    const rows = await authDb().prepare(`SELECT id, place_id, place_name, created_at
      FROM route_photos WHERE place_id = ? AND status = 'approved' ORDER BY reviewed_at DESC LIMIT 8`)
      .bind(placeId).all();
    const photos = (rows.results || []).map((row: any) => ({ ...row, url: `/api/route-photos/${row.id}` }));
    return NextResponse.json({ photos });
  } catch (error) {
    console.error("route photo list error", error);
    return NextResponse.json({ photos: [] }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user: any = await getCurrentUser(request);
    if (!user || !isPhotoModerator(user)) return NextResponse.json({ error: "Нет доступа." }, { status: 403 });
    const body = await request.json();
    const id = String(body?.id || "");
    const status = body?.status === "approved" ? "approved" : body?.status === "rejected" ? "rejected" : null;
    if (!id || !status) return NextResponse.json({ error: "Некорректное решение." }, { status: 400 });
    const now = Math.floor(Date.now() / 1000);
    await authDb().prepare(`UPDATE route_photos SET status = ?, reviewed_at = ?, reviewed_by = ? WHERE id = ? AND status = 'pending'`)
      .bind(status, now, user.id, id).run();
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    console.error("route photo moderation error", error);
    return NextResponse.json({ error: "Не удалось сохранить решение." }, { status: 500 });
  }
}
