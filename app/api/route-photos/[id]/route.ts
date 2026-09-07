import { authDb, getCurrentUser, isPhotoModerator } from "@/lib/auth";

function fromBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const row: any = await authDb().prepare(`SELECT id, user_id, mime_type, image_base64, status FROM route_photos WHERE id = ?`).bind(id).first();
    if (!row) return new Response("Not found", { status: 404 });

    if (row.status !== "approved") {
      const user: any = await getCurrentUser(request);
      if (!user || (user.id !== row.user_id && !isPhotoModerator(user))) return new Response("Not found", { status: 404 });
    }

    return new Response(fromBase64(row.image_base64), {
      headers: {
        "Content-Type": row.mime_type,
        "Cache-Control": row.status === "approved" ? "public, max-age=86400" : "private, no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    console.error("route photo image error", error);
    return new Response("Not found", { status: 404 });
  }
}
