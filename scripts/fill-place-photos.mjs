import fs from "node:fs/promises";
import path from "node:path";

const dataPath = "data/places.ts";
const outDir = "public/place-images";
await fs.mkdir(outDir, { recursive: true });
let source = await fs.readFile(dataPath, "utf8");

const cards = [...source.matchAll(/\{\s*id:\s*(\d+),[\s\S]*?name:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]*)"([\s\S]*?)\n\s*\}/g)]
  .map(m => ({ full:m[0], id:Number(m[1]), name:m[2], image:m[3] }))
  .filter(p => p.image === "/images/hero.jpg" || p.image === "/images/loft.jpg");

async function commonsPhoto(name) {
  const q = encodeURIComponent('"' + name + '" Санкт-Петербург');
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=' + q + '&prop=imageinfo&iiprop=url|mime&format=json&origin=*';
  const res = await fetch(api, { headers: { "User-Agent": "ALMA-place-photo-refresh/1.0" }});
  if (!res.ok) return null;
  const json = await res.json();
  const pages = Object.values(json?.query?.pages || {});
  for (const page of pages) {
    const info = page?.imageinfo?.[0];
    if (!info?.url || !String(info.mime || "").startsWith("image/")) continue;
    return info.url;
  }
  return null;
}

let changed = 0;
for (const p of cards) {
  try {
    const url = await commonsPhoto(p.name);
    if (!url) { console.log("NO_MATCH", p.id, p.name); continue; }
    const r = await fetch(url, { headers: { "User-Agent": "ALMA-place-photo-refresh/1.0" }});
    if (!r.ok) { console.log("DOWNLOAD_FAIL", p.id, p.name, r.status); continue; }
    const type = r.headers.get("content-type") || "";
    if (!type.startsWith("image/")) continue;
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
    const file = p.id + "." + ext;
    await fs.writeFile(path.join(outDir,file), Buffer.from(await r.arrayBuffer()));
    const next = p.full.replace(/image:\s*"[^"]*"/, 'image: "/place-images/' + file + '"');
    source = source.replace(p.full, next);
    changed++;
    console.log("OK", p.id, p.name, url);
  } catch (e) { console.log("ERROR", p.id, p.name, e.message); }
}
await fs.writeFile(dataPath, source);
console.log("Updated", changed, "of", cards.length, "generic photos");

// trigger photo refresh
