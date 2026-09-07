"use client";

import { useCallback, useEffect, useState } from "react";

type PendingPhoto = { id:string; place_id:number; place_name:string; mime_type:string; status:string; created_at:number; };

export default function PhotoModerationPage() {
  const [photos,setPhotos]=useState<PendingPhoto[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const load=useCallback(async()=>{setLoading(true);setError("");try{const res=await fetch("/api/route-photos?moderation=1",{cache:"no-store"});const data=await res.json();if(!res.ok)throw new Error(data.error||"Не удалось загрузить фотографии.");setPhotos(data.photos||[])}catch(e:any){setError(e?.message||"Не удалось загрузить фотографии.")}finally{setLoading(false)}},[]);
  useEffect(()=>{load()},[load]);
  const decide=async(id:string,status:"approved"|"rejected")=>{const res=await fetch("/api/route-photos",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status})});if(res.ok)setPhotos(list=>list.filter(photo=>photo.id!==id));};
  return <main className="min-h-screen bg-[#f7f4ef] pt-28 pb-20"><section className="mx-auto max-w-6xl px-4 sm:px-6"><p className="text-xs uppercase tracking-[.2em] text-neutral-400">ALMA · модерация</p><h1 className="mt-3 text-4xl sm:text-6xl font-bold tracking-tight">Проверка фотографий</h1><p className="mt-4 max-w-2xl text-neutral-500">Пользовательские фото не появляются публично, пока ты их не одобришь.</p>{loading&&<div className="mt-10 rounded-[28px] bg-white p-8">Загружаю очередь…</div>}{error&&<div className="mt-10 rounded-[28px] bg-white p-8 text-red-700">{error}</div>}{!loading&&!error&&photos.length===0&&<div className="mt-10 rounded-[28px] bg-white p-8">Сейчас фотографий на проверке нет ✦</div>}<div className="mt-10 grid md:grid-cols-2 gap-5">{photos.map(photo=><article key={photo.id} className="overflow-hidden rounded-[30px] bg-white border border-black/5"><div className="aspect-[4/3] bg-neutral-100"><img src={`/api/route-photos/${photo.id}`} alt={photo.place_name} className="h-full w-full object-cover"/></div><div className="p-5 sm:p-6"><p className="text-xs uppercase tracking-[.16em] text-neutral-400">На проверке</p><h2 className="mt-2 text-2xl font-bold">{photo.place_name}</h2><p className="mt-2 text-sm text-neutral-500">Отправлено {new Date(photo.created_at*1000).toLocaleString("ru-RU")}</p><div className="mt-5 flex gap-2"><button onClick={()=>decide(photo.id,"approved")} className="rounded-full bg-black text-white px-5 py-3 text-sm font-semibold">✓ Одобрить</button><button onClick={()=>decide(photo.id,"rejected")} className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">Отклонить</button></div></div></article>)}</div></section></main>;
}
