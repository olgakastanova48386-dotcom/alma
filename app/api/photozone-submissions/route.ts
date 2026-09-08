import { NextResponse } from "next/server";
import { authDb, getCurrentUser } from "@/lib/auth";

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
    if (!user) {
      return NextResponse.json(
        { error: "Войдите в ALMA, чтобы предложить фотолокацию.", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    const name = String(form.get("name") || "").trim();
    const address = String(form.get("address") || "").trim();
    const note = String(form.get("note") || "").trim();

    if (!name || name.length > 120) {
      return NextResponse.json({ error: "Укажите название места." }, { status: 400 });
    }
    if (!address || address.length > 240) {
      return NextResponse.json({ error: "Укажите адрес или ориентир." }, { status: 400 });
    }
    if (note.length > 700) {
      return NextResponse.json({ error: "Описание должно быть короче 700 символов." }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Прикрепите фотографию локации." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "Подойдут JPG, PNG или WEBP." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Фото должно быть меньше 1,5 МБ." }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const imageBase64 = toBase64(new Uint8Array(await file.arrayBuffer()));

    await authDb()
      .prepare(`INSERT INTO photozone_submissions
        (id, user_id, name, address, note, mime_type, image_base64, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`)
      .bind(id, user.id, name, address, note || null, file.type, imageBase64, now)
      .run();

    return NextResponse.json({ ok: true, id, status: "pending" });
  } catch (error) {
    console.error("photozone submission error", error);
    return NextResponse.json(
      { error: "Не удалось отправить фотолокацию. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
