import fs from "node:fs/promises";
import path from "node:path";

const dataPath = process.env.ALMA_DATA_PATH || "data/places.ts";
const outDir = "public/place-images";
const targetRestaurantFallback = dataPath.endsWith("mapPlaces.ts");
await fs.mkdir(outDir, { recursive: true });
let source = await fs.readFile(dataPath, "utf8");

const cards = [...source.matchAll(/\{\s*id:\s*(\d+),[\s\S]*?name:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]*)"([\s\S]*?)\n\s*\}/g)]
  .map(m => ({ full:m[0], id:Number(m[1]), name:m[2], image:m[3] }))
  .filter(p => !p.image || p.image === "/images/hero.jpg" || p.image === "/images/loft.jpg" || /^https?:\/\//.test(p.image) || (targetRestaurantFallback && p.image === "/images/restaurant.jpg"));

async function commonsPhoto(name) {
  try {
    const q = encodeURIComponent('"' + name + '" Санкт-Петербург');
    const api = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=' + q + '&prop=imageinfo&iiprop=url|mime&format=json&origin=*';
    const res = await fetch(api, { headers: { "User-Agent": "ALMA-place-photo-refresh/1.0" }});
    if (res.ok) {
      const json = await res.json();
      for (const page of Object.values(json?.query?.pages || {})) {
        const info = page?.imageinfo?.[0];
        if (info?.url && String(info.mime || "").startsWith("image/")) return info.url;
      }
    }
  } catch {}
  return null;
}

let changed = 0;
for (const p of cards) {
  try {
    // Never touch a local image chosen/uploaded by ALMA. Only empty,
    // generic fallback and external images reach this loop.
    let url = p.image;
    if (!/^https?:\/\//.test(url)) url = await commonsPhoto(p.name);
    if (!url) { console.log("NO_MATCH", p.id, p.name); continue; }
    const r = await fetch(url, { headers: { "User-Agent": "ALMA-place-photo-refresh/1.0" }, redirect: "follow" });
    if (!r.ok) { console.log("DOWNLOAD_FAIL", p.id, p.name, r.status); continue; }
    const type = r.headers.get("content-type") || "";
    if (!type.startsWith("image/")) continue;
    const buffer = Buffer.from(await r.arrayBuffer());
    if (buffer.length < 25000) continue;
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
    const namespace = path.basename(dataPath, path.extname(dataPath)).replace(/[^a-zA-Z0-9_-]/g, "-");
    const file = namespace + "-" + p.id + "." + ext;
    await fs.writeFile(path.join(outDir,file), buffer);
    const next = p.full.replace(/image:\s*"[^"]*"/, 'image: "/place-images/' + file + '"');
    source = source.replace(p.full, next);
    changed++;
  } catch (e) { console.log("ERROR", p.id, p.name, e.message); }
}
await fs.writeFile(dataPath, source);
console.log("Updated", changed, "of", cards.length, "photos");
