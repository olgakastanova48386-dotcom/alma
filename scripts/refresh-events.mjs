import fs from "node:fs/promises";
import path from "node:path";

const fixedImages = {
  "fin-zaliv-house-party":"https://where.ru/upload/sprint.editor/e68/vhl7rsbbl3bl8bmqaa7hl6at856f9hq4.jpeg",
  "koi-asia-festival":"https://static.tildacdn.com/tild3133-3062-4332-a465-633661666136/4.jpg",
  "growbox-market":"https://thb.tildacdn.com/tild6563-3061-4730-b636-373166653962/-/resize/800x/5516884-02_2.png",
  "spiexff":"https://static.tildacdn.com/tild3766-3666-4164-a537-363637333932/JPEG_SPIEXFF4_000911.jpg",
  "waterfront-workouts":"https://s.inyourpocket.com/gallery/245582.jpg",
  "viktor-tsoi-legenda":"https://media-1.gorbilet.com/3b/a5/fb/DSCF5703_Preview.jpg",
  "museum-machines":"https://optim.tildacdn.com/tild3038-6666-4338-b934-613333656633/-/format/webp/photo_52471159935600.jpg.webp",
  "dark-wave":"https://optim.tildacdn.com/tild3134-6131-4532-a432-383961346431/-/format/webp/IMG_1711.JPG.webp",
  "yarkiy-fovizm":"https://s0.rbk.ru/v6_top_pics/media/img/6/86/347503352588866.jpeg",
};

const events = [
  ["fin-zaliv-house-party","https://sevcableport.ru/afisha/finskij-zaliv-under-haus-pati/"],
  ["koi-asia-festival","https://sevcableport.ru/afisha/koi-aziya-festival/"],
  ["spiexff","https://sevcableport.ru/afisha/sankt-peterburgskij-mezhdunarodnyj-festival-eksperimentalnogo-kino-spiexff/"],
  ["waterfront-workouts","https://sevcableport.ru/afisha/trenirovki-na-naberezhnoj/"],
  ["viktor-tsoi-legenda","https://sevcableport.ru/afisha/"],
  ["growbox-market","https://sevcableport.ru/afisha/"],
  ["museum-machines","https://brusnitsyn.spb.ru/museambot"],
  ["yarkiy-fovizm","https://brusnitsyn.spb.ru/"],
  ["dark-wave","https://brusnitsyn.spb.ru/darkwave"],
  ["word-and-action","https://sevcableport.ru/afisha/detskij-festival-slovo-i-delo/"],
  ["white-night-auto","https://sevcableport.ru/afisha/avtovystavka-belaya-noch-white-night/"],
  ["lilac-branch","https://sevcableport.ru/afisha/vetka-sireni/"]
];

const decode = s => s.replaceAll("&amp;","&").replaceAll("&#038;","&");
const pageImage = (html) => {
  const matches = [...html.matchAll(/<img\s+[^>]*src=(?:"([^"]+)"|'([^']+)')[^>]*>/gi)];
  const urls = matches.map(m => decode((m[1] || m[2] || "").trim())).filter(Boolean);
  return urls.find(u => !/logo|icon|svg|pixel|counter|favicon/i.test(u)) || "";
};
const meta = (html, property) => {
  const tags = html.match(/<meta\s+[^>]*>/gi) || [];
  for (const tag of tags) {
    if (!tag.toLowerCase().includes(property.toLowerCase())) continue;
    const m = tag.match(/content=(?:"([^"]+)"|'([^']+)')/i);
    if (m) return decode((m[1] || m[2] || "").trim());
  }
  return "";
};
await fs.mkdir("public/events",{recursive:true});
const report={updatedAt:new Date().toISOString(),events:{}};
for (const [id,url] of events) {
  try {
    const html=await (await fetch(url,{headers:{"user-agent":"ALMA event updater/1.0"}})).text();
    const image=fixedImages[id] || meta(html,"og:image") || meta(html,"twitter:image") || pageImage(html);
    if (!image) throw new Error("event image not found");
    const res=await fetch(new URL(image,url),{headers:{"user-agent":"Mozilla/5.0","referer":url}});
    if (!res.ok) throw new Error("image "+res.status);
    const buf=Buffer.from(await res.arrayBuffer());
    if(buf.length<5000) throw new Error("image too small");
    const type=(res.headers.get("content-type")||"").toLowerCase();
    if(!type.startsWith("image/")) throw new Error("not an image: "+type);
    await fs.writeFile(path.join("public/events",id+".jpg"),buf);
    report.events[id]={source:url,image:String(new URL(image,url)),ok:true};
  } catch(e) {
    report.events[id]={source:url,ok:false,error:String(e.message||e)};
  }
}
await fs.mkdir("public/data",{recursive:true});
await fs.writeFile("public/data/events-refresh.json",JSON.stringify(report,null,2)+"\n");
