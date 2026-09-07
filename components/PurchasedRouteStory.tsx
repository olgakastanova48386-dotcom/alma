"use client";

import Image from "next/image";
import Link from "next/link";
import type { Place } from "@/data/places";

type RouteStop = Place & { stopType?: string };

const stayTime=(category:string)=>{
 const c=category.toLowerCase();
 if(c.includes("музей")||c.includes("искус")) return "1–1,5 часа";
 if(c.includes("ресторан")||c.includes("каф")||c.includes("коф")||c.includes("бар")) return "1–1,5 часа";
 if(c.includes("прогул")||c.includes("парк")||c.includes("отдых")) return "40–60 минут";
 return "45–60 минут";
};

const outfit=(category:string)=>{
 const c=category.toLowerCase();
 if(c.includes("прогул")||c.includes("парк")||c.includes("пространство")||c.includes("отдых")) return "Удобная обувь и слой от ветра — часть маршрута пройдёт на улице.";
 if(c.includes("музей")||c.includes("искус")) return "Комфортный городской образ: внутри тепло, верхнюю одежду можно оставить в гардеробе.";
 return "Удобный городской образ и обувь, в которой приятно пройти следующий участок пешком.";
};

const story=(place:RouteStop)=> place.why || "Обрати внимание на детали вокруг — у этой остановки есть свой характер и история.";

function minutesBetween(a:RouteStop,b:RouteStop){
 const rad=(v:number)=>v*Math.PI/180;
 const dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng);
 const x=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;
 const km=6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
 return Math.max(5,Math.round((km/4.5)*60/5)*5);
}

export default function PurchasedRouteStory({stops,romantic=false,onReset}:{stops:RouteStop[];romantic?:boolean;onReset:()=>void}){
 return <div className="mt-9 overflow-hidden rounded-[38px] bg-[#f3eee6] border border-black/5">
  <header className="p-7 sm:p-10 lg:p-12 border-b border-black/5"><div className="flex flex-wrap items-start justify-between gap-6"><div><span className="inline-flex rounded-full bg-[#dcebdc] px-3 py-2 text-xs font-semibold">ТЕСТОВАЯ ПОКУПКА УСПЕШНА</span><p className="mt-6 text-xs uppercase tracking-[.2em] text-neutral-400">Твой день с ALMA</p><h3 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight">Маршрут открыт ✦</h3><p className="mt-3 max-w-xl text-neutral-500">Готовый сценарий: куда идти, сколько остаться и как перейти к следующей точке. 199 ₽ в тестовом режиме не списывались.</p></div><button onClick={onReset} className="rounded-full bg-white border border-black/10 px-5 py-3 text-sm">Новый тест</button></div></header>
  <div className="relative px-5 sm:px-10 lg:px-14 py-10 sm:py-14"><div className="absolute left-[42px] sm:left-1/2 top-10 bottom-10 w-px bg-black/15"/>
   {stops.map((place,i)=>{const reverse=i%2===1;const next=stops[i+1];const walk=next?minutesBetween(place,next):0;return <div key={place.id} className="relative mb-3 last:mb-0">
    <span className="absolute left-[18px] sm:left-1/2 sm:-translate-x-1/2 top-8 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white font-bold shadow-lg">{i+1}</span>
    <article className={`ml-16 sm:ml-0 grid sm:grid-cols-2 gap-7 sm:gap-16 lg:gap-24 items-center ${reverse?"sm:[&>*:first-child]:order-2":""}`}>
     <div className="relative aspect-[4/3] overflow-hidden rounded-[50%] bg-neutral-200 shadow-sm"><Image src={place.image} alt={place.name} fill sizes="(max-width: 640px) 80vw, 38vw" className="object-cover"/></div>
     <div className={reverse?"sm:text-right":""}><p className="text-xs uppercase tracking-[.18em] text-neutral-400">Остановка {i+1} · {place.category}</p><h4 className="mt-3 text-2xl sm:text-3xl font-bold">{place.name}</h4><p className="mt-2 text-sm text-neutral-500">⌖ {place.address}</p><div className={`mt-5 flex flex-wrap gap-2 ${reverse?"sm:justify-end":""}`}><span className="rounded-full bg-white px-3 py-2 text-xs">◷ Здесь: {stayTime(place.category)}</span><span className="rounded-full bg-white px-3 py-2 text-xs">{place.price}</span></div><p className="mt-5 text-sm leading-6 text-neutral-600">{place.description}</p><div className="mt-5 rounded-[20px] bg-white/70 p-4 text-left"><p className="text-xs uppercase tracking-wider text-neutral-400">Что надеть</p><p className="mt-2 text-sm leading-6">{outfit(place.category)}</p></div>{romantic&&<div className="mt-3 rounded-[20px] bg-[#e8ddd0] p-4 text-left"><p className="text-xs uppercase tracking-wider text-neutral-500">Можно рассказать ✦</p><p className="mt-2 text-sm leading-6">{story(place)}</p></div>}<Link href={`/map?place=${place.id}`} className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black text-white" aria-label={`Показать ${place.name} на карте ALMA`}><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"/><circle cx="12" cy="10" r="2.2"/></svg></Link></div>
    </article>
    {next&&<div className="relative z-10 ml-16 sm:ml-0 py-9 sm:py-12 flex sm:justify-center"><div className="rounded-full bg-[#f3eee6] border border-black/10 px-5 py-2.5 text-xs font-medium">≈ {walk} мин пешком до следующей точки</div></div>}
   </div>})}
  </div>
  {romantic&&<footer className="m-5 sm:m-10 mt-0 rounded-[28px] bg-black p-6 sm:p-8 text-white"><p className="text-xs uppercase tracking-[.18em] text-white/45">Для свидания</p><h4 className="mt-2 text-2xl font-bold">Приглашение без спойлеров</h4><p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">Маршрут можно отправить как приглашение, не раскрывая заранее все остановки. Финальную механику отправки подключим вместе с аккаунтами.</p></footer>}
 </div>;
}
