"use client";

import { useState } from "react";
import type { PurchasedRouteStop } from "@/components/PurchasedRouteStory";

export default function RoutePhotoZone({stops}:{stops:PurchasedRouteStop[]}){
  const [placeId,setPlaceId]=useState<number>(()=>stops[0]?.mapPlaceId??stops[0]?.id??0);
  const [uploading,setUploading]=useState(false);
  const [message,setMessage]=useState("");

  const upload=async(file?:File)=>{
    if(!file)return;
    const place=stops.find(p=>(p.mapPlaceId??p.id)===placeId);
    if(!place)return;
    setUploading(true);setMessage("");
    try{
      const form=new FormData();
      form.append("file",file);form.append("placeId",String(placeId));form.append("placeName",place.name);
      const res=await fetch("/api/route-photos",{method:"POST",body:form});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||"Не удалось отправить фото.");
      setMessage("Фото отправлено на проверку ✓ После одобрения оно сможет появиться в ALMA.");
    }catch(e:any){setMessage(e?.message||"Не удалось отправить фото.");}
    finally{setUploading(false)}
  };

  return <section className="m-5 sm:m-10 rounded-[28px] bg-[#dcebdc] p-5 sm:p-7 border border-black/5">
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
      <div><p className="text-xs uppercase tracking-[.18em] text-neutral-500">Сделай ALMA живой</p><h4 className="mt-2 text-2xl sm:text-3xl font-bold">Добавить фотозону</h4><p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">Выбери точку и загрузи своё фото. Мы сначала проверим, что на снимке действительно это место и что фотографию можно показывать другим.</p></div>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center"><select value={placeId} onChange={e=>setPlaceId(Number(e.target.value))} className="min-h-12 rounded-full bg-white px-4 py-3 text-sm border border-black/10">{stops.map(p=><option key={p.id} value={p.mapPlaceId??p.id}>{p.name}</option>)}</select><label className={`min-h-12 inline-flex items-center justify-center rounded-full bg-black text-white px-5 py-3 text-sm font-semibold cursor-pointer ${uploading?"opacity-50 pointer-events-none":""}`}>{uploading?"Отправляю…":"＋ Выбрать фото"}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e=>{const file=e.target.files?.[0];upload(file);e.currentTarget.value=""}}/></label></div>
    </div>
    <p className="mt-3 text-xs text-neutral-500">JPG, PNG или WEBP · до 1,5 МБ · публикация только после проверки.</p>{message&&<p className="mt-3 rounded-2xl bg-white/70 px-4 py-3 text-sm">{message}</p>}
  </section>;
}
