"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type PurchasedRouteStop = {
  id:number; name:string; category:string; image?:string; lat:number; lng:number;
  description:string; why?:string; address:string; price:string; mapPlaceId?:number;
  rating?:number; ratingSource?:string;
};

type MetroStop={name:string;line:string;lat:number;lng:number};
type TransitPlan={mode:"walk"|"metro"|"bus";minutes:number;title:string;details:string[]};

const metro:MetroStop[]=[
  {name:"Чернышевская",line:"1 · красная",lat:59.9445,lng:30.3594},
  {name:"Площадь Восстания",line:"1 · красная",lat:59.9318,lng:30.3602},
  {name:"Владимирская",line:"1 · красная",lat:59.9276,lng:30.3479},
  {name:"Невский проспект",line:"2 · синяя",lat:59.9345,lng:30.3304},
  {name:"Петроградская",line:"2 · синяя",lat:59.9663,lng:30.3114},
  {name:"Горьковская",line:"2 · синяя",lat:59.9561,lng:30.3187},
  {name:"Василеостровская",line:"3 · зелёная",lat:59.9425,lng:30.2781},
  {name:"Беговая",line:"3 · зелёная",lat:59.9871,lng:30.2026},
  {name:"Адмиралтейская",line:"5 · фиолетовая",lat:59.9359,lng:30.3154},
  {name:"Спортивная",line:"5 · фиолетовая",lat:59.9521,lng:30.2913},
  {name:"Чкаловская",line:"5 · фиолетовая",lat:59.9615,lng:30.2920},
];

const stayTime=(p:PurchasedRouteStop)=>{
  const n=p.name.toLowerCase(),c=p.category.toLowerCase();
  if(n.includes("поцелуев мост"))return"10–15 минут";
  if(n.includes("мозаичный дворик"))return"20–30 минут";
  if(n.includes("исаакиевская площадь"))return"15–25 минут";
  if(n.includes("новая голландия")||n.includes("севкабель"))return"1–2 часа";
  if(n.includes("эрарта"))return"2–3 часа";
  if(n.includes("ботанический сад"))return"1,5–2,5 часа";
  if(n.includes("музей фаберже"))return"1–1,5 часа";
  if(n.includes("гранд макет"))return"1,5–2,5 часа";
  if(c.includes("музей")||c.includes("искус"))return"1–1,5 часа";
  if(c.includes("ресторан")||c.includes("каф")||c.includes("коф")||c.includes("бар"))return"1–1,5 часа";
  if(c.includes("парк")||c.includes("пространство")||c.includes("отдых"))return"45–90 минут";
  return"30–60 минут";
};
const outfit=(category:string)=>{
  const c=category.toLowerCase();
  if(c.includes("парк")||c.includes("прогул")||c.includes("пространство")||c.includes("отдых"))return"Удобная обувь и слой от ветра — часть маршрута пройдёт на улице.";
  if(c.includes("музей")||c.includes("искус"))return"Комфортный городской образ: внутри тепло, верхнюю одежду можно оставить в гардеробе.";
  if(c.includes("ресторан")||c.includes("каф")||c.includes("бар"))return"Городской образ без лишней формальности. Оставь удобную обувь — маршрут продолжится.";
  return"Удобный городской образ и обувь для следующего участка маршрута.";
};
const facts:Record<string,string>={
  "поцелуев мост":"Название моста связано не с влюблёнными, а с трактиром «Поцелуй», который когда-то находился рядом.",
  "новая голландия":"Название «Новая Голландия» закрепилось ещё в XVIII веке: здесь хранили корабельный лес для судостроения.",
  "севкабель порт":"Это бывшая промышленная территория кабельного завода; общественное пространство появилось здесь в 2018 году.",
  "исаакиевская площадь":"Конная статуя Николая I на площади необычна тем, что опирается всего на две точки — задние ноги коня.",
};

const rad=(v:number)=>v*Math.PI/180;
function kmBetween(a:{lat:number;lng:number},b:{lat:number;lng:number}){
  const dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng);
  const x=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}
const walkMinutes=(a:{lat:number;lng:number},b:{lat:number;lng:number})=>Math.max(4,Math.round((kmBetween(a,b)/4.5)*60));
const nearestMetro=(p:PurchasedRouteStop)=>[...metro].sort((a,b)=>kmBetween(p,a)-kmBetween(p,b))[0];

function busNumber(a:PurchasedRouteStop,b:PurchasedRouteStop){
  const west=(p:PurchasedRouteStop)=>p.lng<30.29;
  const north=(p:PurchasedRouteStop)=>p.lat>59.947;
  const centralNorth=(p:PurchasedRouteStop)=>p.lat>59.938&&p.lng>30.33;
  const center=(p:PurchasedRouteStop)=>p.lat>59.925&&p.lat<59.946&&p.lng>30.295&&p.lng<30.335;
  if((west(a)&&center(b))||(west(b)&&center(a)))return"24";
  if((centralNorth(a)&&center(b))||(centralNorth(b)&&center(a)))return"22";
  if((north(a)&&centralNorth(b))||(north(b)&&centralNorth(a)))return"46";
  return null;
}

function smartTransit(a:PurchasedRouteStop,b:PurchasedRouteStop):TransitPlan{
  const walk=walkMinutes(a,b);
  if(walk<=20)return{mode:"walk",minutes:walk,title:`Пешком · ≈ ${walk} мин`,details:["Это самый простой вариант — без ожидания транспорта и пересадок."]};

  const from=nearestMetro(a),to=nearestMetro(b);
  const toFrom=walkMinutes(a,from),fromTo=walkMinutes(b,to);
  const sameStation=from.name===to.name;
  const sameLine=from.line===to.line;
  const metroRide=Math.max(5,Math.round(kmBetween(from,to)/0.55*2.2));
  const metroTotal=toFrom+fromTo+metroRide+5+(sameLine?0:6);

  if(!sameStation&&toFrom<=12&&fromTo<=12&&metroTotal<=walk-6){
    return{mode:"metro",minutes:metroTotal,title:`Лучше всего: метро · ≈ ${metroTotal} мин`,details:[`${toFrom} мин пешком → ${from.name}`,`${from.line}${sameLine?"":" · 1 пересадка"}`,`${to.name} → ${fromTo} мин пешком до следующей точки`]};
  }

  const bus=busNumber(a,b);
  if(bus){
    const total=Math.max(18,Math.round(walk*0.55));
    return{mode:"bus",minutes:total,title:`Лучше всего: автобус №${bus} · ≈ ${total} мин`,details:["Без лишнего спуска в метро", "ALMA выбирает наземный вариант, потому что здесь он удобнее пешего пути и метро."]};
  }

  if(!sameStation&&toFrom<=15&&fromTo<=15){
    return{mode:"metro",minutes:metroTotal,title:`Метро · ≈ ${metroTotal} мин`,details:[`${toFrom} мин пешком → ${from.name}`,`${from.line}${sameLine?"":" · с пересадкой"}`,`${to.name} → ${fromTo} мин пешком`]};
  }

  return{mode:"bus",minutes:Math.max(20,Math.round(walk*0.6)),title:"Наземный транспорт удобнее",details:["ALMA не отправляет тебя на длинную пешую прогулку.","Для этой пары точек покажем ближайший прямой автобус после проверки маршрута."]};
}

function visualFor(place:PurchasedRouteStop){
  if(place.image)return place.image;
  if(place.name.toLowerCase()==="birch")return"https://img.restoclub.ru/uploads/place/f/c/7/c/fc7c964416cae41eb1bfda597e9f3421_w1230_h820--no-cut.webp?v=3";
  return null;
}

export default function PurchasedRouteStory({stops,romantic=false,onReset}:{stops:PurchasedRouteStop[];romantic?:boolean;onReset:()=>void}){
  const [routeShared,setRouteShared]=useState(false);
  const [inviteOpen,setInviteOpen]=useState(false);
  const [guest,setGuest]=useState("");
  const [date,setDate]=useState("");
  const [time,setTime]=useState("");
  const transitions=useMemo(()=>stops.slice(0,-1).map((p,i)=>smartTransit(p,stops[i+1])),[stops]);
  const routeText=useMemo(()=>stops.map((p,i)=>`${i+1}. ${p.name} · ${stayTime(p)}${transitions[i]?`\n${transitions[i].title}`:""}`).join("\n\n"),[stops,transitions]);
  const shareRoute=async()=>{try{if(navigator.share)await navigator.share({title:"Мой маршрут ALMA",text:routeText,url:location.href});else await navigator.clipboard.writeText(location.href);setRouteShared(true);setTimeout(()=>setRouteShared(false),1800)}catch{}};

  return <div className="alma-purchased-route mt-9 overflow-hidden rounded-[38px] bg-[#f3eee6] border border-black/5">
    <header className="p-7 sm:p-10 lg:p-12 border-b border-black/5">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div><span className="inline-flex rounded-full bg-[#dcebdc] px-3 py-2 text-xs font-semibold">МАРШРУТ ГОТОВ</span><p className="mt-6 text-xs uppercase tracking-[.2em] text-neutral-400">Твой день с ALMA</p><h3 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight">Маршрут открыт ✦</h3><p className="mt-3 max-w-xl text-neutral-500">ALMA уже выбрала удобный способ перемещения между точками. Всё остаётся внутри сайта.</p><div className="mt-6 flex flex-wrap gap-2"><button type="button" onClick={()=>window.print()} className="rounded-full bg-black text-white px-5 py-3 text-sm font-semibold">↓ Сохранить</button><button type="button" onClick={shareRoute} className="rounded-full bg-white border border-black/10 px-5 py-3 text-sm font-semibold">{routeShared?"Готово ✓":"↗ Поделиться"}</button></div></div>
        <button onClick={onReset} className="rounded-full bg-white border border-black/10 px-5 py-3 text-sm">Новый маршрут</button>
      </div>
    </header>

    <div className="relative px-5 sm:px-10 lg:px-14 py-10 sm:py-14"><div className="absolute left-[42px] sm:left-1/2 top-10 bottom-10 w-px bg-black/15"/>
      {stops.map((place,i)=>{const reverse=i%2===1,plan=transitions[i],fact=facts[place.name.toLowerCase()],visual=visualFor(place);return <div key={`${place.category}-${place.id}`} className="relative mb-3 last:mb-0">
        <span className="absolute left-[18px] sm:left-1/2 sm:-translate-x-1/2 top-8 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white font-bold shadow-lg">{i+1}</span>
        <article className={`ml-16 sm:ml-0 grid sm:grid-cols-2 gap-7 sm:gap-16 lg:gap-24 items-center ${reverse?"sm:[&>*:first-child]:order-2":""}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[50%] bg-[linear-gradient(135deg,#d9e0d4,#eee3d5)] shadow-sm">
            {visual?(visual.startsWith("http")?<img src={visual} alt={place.name} className="absolute inset-0 h-full w-full object-cover"/>:<Image src={visual} alt={place.name} fill sizes="(max-width: 640px) 80vw, 38vw" className="object-cover"/>):<div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><span className="text-5xl">🍽️</span><p className="mt-3 text-xs uppercase tracking-[.18em] text-neutral-500">Фото обновляется</p></div></div>}
          </div>
          <div className={reverse?"sm:text-right":""}><p className="text-xs uppercase tracking-[.18em] text-neutral-400">Остановка {i+1} · {place.category}</p><h4 className="mt-3 text-2xl sm:text-3xl font-bold">{place.name}</h4><p className="mt-2 text-sm text-neutral-500">⌖ {place.address}</p>{place.rating&&<p className="mt-2 text-xs text-neutral-500">★ {place.rating.toFixed(1)} · {place.ratingSource}</p>}<div className={`mt-5 flex flex-wrap gap-2 ${reverse?"sm:justify-end":""}`}><span className="rounded-full bg-white px-3 py-2 text-xs">◷ Здесь: {stayTime(place)}</span><span className="rounded-full bg-white px-3 py-2 text-xs">{place.price}</span></div><p className="mt-5 text-sm leading-6 text-neutral-600">{place.description}</p><div className="mt-5 rounded-[20px] bg-white/70 p-4 text-left"><p className="text-xs uppercase tracking-wider text-neutral-400">Что надеть</p><p className="mt-2 text-sm leading-6">{outfit(place.category)}</p></div>{romantic&&fact&&<div className="mt-3 rounded-[20px] bg-[#e8ddd0] p-4 text-left"><p className="text-xs uppercase tracking-wider text-neutral-500">Можно рассказать ✦</p><p className="mt-2 text-sm leading-6">{fact}</p></div>}<Link href={`/map?place=${place.mapPlaceId??place.id}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-3 text-xs font-semibold">⌖ Показать на карте ALMA</Link></div>
        </article>
        {plan&&<div className="relative z-10 ml-16 sm:ml-0 py-9 sm:py-12 flex sm:justify-center"><div className="max-w-md rounded-[22px] bg-white border border-black/10 px-5 py-4 shadow-sm"><p className="text-sm font-bold">{plan.mode==="walk"?"🚶":plan.mode==="metro"?"🚇":"🚌"} {plan.title}</p>{plan.details.map((d,j)=><p key={j} className="mt-1.5 text-xs leading-5 text-neutral-500">{d}</p>)}</div></div>}
      </div>})}
    </div>

    {romantic&&<footer className="m-5 sm:m-10 mt-0 rounded-[30px] bg-black p-6 sm:p-8 text-white"><div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"><div><p className="text-xs uppercase tracking-[.18em] text-white/45">Для свидания</p><h4 className="mt-2 text-2xl sm:text-3xl font-bold">Приглашение без спойлеров</h4><p className="mt-2 text-sm leading-6 text-white/60">Получатель увидит только дату, время и твоё сообщение. Сам маршрут останется секретом.</p></div><button type="button" onClick={()=>setInviteOpen(v=>!v)} className="rounded-full bg-white text-black px-5 py-3 text-sm font-semibold">{inviteOpen?"Скрыть":"Создать приглашение"}</button></div>{inviteOpen&&<div className="mt-6 grid sm:grid-cols-3 gap-3"><input value={guest} onChange={e=>setGuest(e.target.value)} placeholder="Имя" className="rounded-2xl px-4 py-3 text-black"/><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="rounded-2xl px-4 py-3 text-black"/><input type="time" value={time} onChange={e=>setTime(e.target.value)} className="rounded-2xl px-4 py-3 text-black"/><div className="sm:col-span-3 rounded-2xl bg-white/10 p-4 text-sm">{guest?`${guest}, `:""}у меня есть для нас небольшой план ✦ {date&&`Дата: ${date}. `}{time&&`Встречаемся в ${time}. `}Маршрут пока останется сюрпризом.</div></div>}</footer>}
  </div>;
}
