"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type PurchasedRouteStop = {
  id:number; name:string; category:string; image?:string; lat:number; lng:number;
  description:string; why?:string; address:string; price:string; mapPlaceId?:number;
  rating?:number; ratingSource?:string;
};

const INVITE_DRAFT_KEY="alma-date-invite-draft";
const invitePresets=[
  {label:"Нежно",text:"У меня есть для нас небольшой план. Детали пока оставлю сюрпризом ✦"},
  {label:"Игриво",text:"Ничего не планируй на это время — я уже всё придумал(а). Тебе останется только прийти ✦"},
  {label:"Минималистично",text:"Хочу украсть тебя на несколько часов. Маршрут — сюрприз."},
];

const stayTime=(place:PurchasedRouteStop)=>{
  const name=place.name.toLowerCase();
  const c=place.category.toLowerCase();
  if(name.includes("поцелуев мост")) return "10–15 минут";
  if(name.includes("мозаичный дворик")) return "20–30 минут";
  if(name.includes("исаакиевская площадь")) return "15–25 минут";
  if(name.includes("лахта центр")) return "20–30 минут";
  if(name.includes("новая голландия")) return "1–2 часа";
  if(name.includes("севкабель")) return "1–2 часа";
  if(name.includes("эрарта")) return "2–3 часа";
  if(name.includes("мир на ощупь")) return "около 1,5 часа";
  if(name.includes("пушкинская-10")) return "1–1,5 часа";
  if(name.includes("ботанический сад")) return "1,5–2,5 часа";
  if(name.includes("музей фаберже")) return "1–1,5 часа";
  if(name.includes("гранд макет")) return "1,5–2,5 часа";
  if(name.includes("петровская акватория")) return "1–1,5 часа";
  if(name.includes("музей сновидений фрейда")) return "45–60 минут";
  if(name.includes("михайловский замок")) return "1,5–2 часа";
  if(c.includes("музей")||c.includes("искус")) return "1–1,5 часа";
  if(c.includes("ресторан")||c.includes("каф")||c.includes("коф")||c.includes("бар")) return "1–1,5 часа";
  if(c.includes("парк")||c.includes("отдых")||c.includes("пространство")) return "45–90 минут";
  if(c.includes("прогул")) return "20–40 минут";
  if(c.includes("архитект")) return "15–30 минут";
  return "30–60 минут";
};
const outfit=(category:string)=>{
  const c=category.toLowerCase();
  if(c.includes("прогул")||c.includes("парк")||c.includes("пространство")||c.includes("отдых")) return "Удобная обувь и слой от ветра — часть маршрута пройдёт на улице.";
  if(c.includes("музей")||c.includes("искус")) return "Комфортный городской образ: внутри тепло, верхнюю одежду можно оставить в гардеробе.";
  if(c.includes("ресторан")||c.includes("каф")||c.includes("коф")||c.includes("бар")) return "Городской образ без лишней формальности. Оставь удобную обувь — после этой точки маршрут продолжится.";
  return "Удобный городской образ и обувь, в которой приятно пройти следующий участок пешком.";
};
const verifiedStories:Record<string,string>={
  "поцелуев мост":"Название моста не связано с влюблёнными: в конце XVIII века рядом работал трактир «Поцелуй» в доме купца Никифора Поцелуева. Первая деревянная переправа появилась здесь ещё в 1738 году.",
  "новая голландия":"Название «Новая Голландия» закрепилось примерно в 1737 году: здесь хранили корабельный лес, уложенный особым голландским способом. Исторические корпуса острова строились как склады для судостроения.",
  "севкабель порт":"Это бывшая промышленная территория первого кабельного завода России: производство на Кожевенной линии началось в 1879 году как завод торгового дома Siemens & Halske. Общественное пространство открылось здесь в 2018 году.",
  "исаакиевская площадь":"На площади стоит памятник Николаю I, открытый в 1859 году. Его конная статуя необычна тем, что опирается всего на две точки — задние ноги коня.",
  "эрарта":"Эрарта открылась в 2010 году после нескольких лет подготовки и стала одним из самых заметных частных музеев современного искусства в России.",
  "пушкинская-10":"История арт-центра началась в 1989 году, когда независимые художники и музыканты заняли расселённый дом и создали творческую коммуну — будущую «Пушкинскую-10».",
  "ботанический сад":"Сад вырос из Аптекарского огорода начала XVIII века, где выращивали лекарственные растения. От него получил своё название и Аптекарский остров.",
  "музей фаберже":"Шуваловский дворец на Фонтанке построили в конце XVIII века. В 1834 году здесь устроили знаменитый бал в честь совершеннолетия будущего императора Александра II, а музей Фаберже открылся во дворце в 2013 году.",
  "гранд макет россия":"«Гранд Макет Россия» открылся в 2012 году. Над макетом площадью 800 м² десятки специалистов работали около пяти лет — это собирательный образ страны, а не уменьшенная карта один к одному.",
  "петровская акватория":"Макет старого Петербурга создавали более двух лет с участием историков, архитекторов, моделистов и инженеров. Внутри есть настоящее водное пространство, изображающее Неву и Финский залив, а корабли движутся по запатентованной системе.",
  "музей сновидений фрейда":"Музей открылся 4 ноября 1999 года — к столетию выхода книги Фрейда «Толкование сновидений». В отличие от музеев Фрейда в Вене и Лондоне, он посвящён не его вещам, а идеям, образам и самому феномену сновидений.",
  "михайловский замок":"Замысел Михайловского замка во многом принадлежал самому Павлу I. Его построили на месте Летнего дворца Елизаветы Петровны, который разобрали по приказу императора после смерти Екатерины II.",
};
const story=(place:PurchasedRouteStop)=>verifiedStories[place.name.toLowerCase()]||null;
function minutesBetween(a:PurchasedRouteStop,b:PurchasedRouteStop){
  const rad=(v:number)=>v*Math.PI/180;
  const dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng);
  const x=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;
  const km=6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
  return Math.max(5,Math.round((km/4.5)*60/5)*5);
}

export default function PurchasedRouteStory({stops,romantic=false,onReset}:{stops:PurchasedRouteStop[];romantic?:boolean;onReset:()=>void}){
  const [inviteOpen,setInviteOpen]=useState(false),[guestName,setGuestName]=useState(""),[date,setDate]=useState(""),[time,setTime]=useState(""),[meeting,setMeeting]=useState("");
  const [note,setNote]=useState(invitePresets[0].text),[copied,setCopied]=useState(false),[linkCopied,setLinkCopied]=useState(false),[shared,setShared]=useState(false),[saved,setSaved]=useState(false),[recipientPreview,setRecipientPreview]=useState(false);
  const [routeShared,setRouteShared]=useState(false),[routeLinkCopied,setRouteLinkCopied]=useState(false);

  useEffect(()=>{try{const raw=localStorage.getItem(INVITE_DRAFT_KEY);if(!raw)return;const d=JSON.parse(raw);if(d.guestName)setGuestName(d.guestName);if(d.date)setDate(d.date);if(d.time)setTime(d.time);if(d.meeting)setMeeting(d.meeting);if(d.note)setNote(d.note)}catch{}},[]);

  const prettyDate=useMemo(()=>{if(!date)return"";const d=new Date(`${date}T12:00:00`);return Number.isNaN(d.getTime())?date:new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long",weekday:"long"}).format(d)},[date]);
  const routeText=useMemo(()=>{
    const lines=stops.map((place,i)=>{
      const next=stops[i+1];
      const walk=next?`\nДо следующей точки: примерно ${minutesBetween(place,next)} мин пешком`:"";
      const fact=story(place);
      return `${i+1}. ${place.name}\n${place.category} · ${stayTime(place)}\n${place.address}\n${place.price}\n${place.description}\nЧто надеть: ${outfit(place.category)}${romantic&&fact?`\nМожно рассказать: ${fact}`:""}${walk}`;
    });
    return `Мой маршрут ALMA · Санкт-Петербург\n\n${lines.join("\n\n")}\n\nОткрыть маршрут в ALMA: ${typeof window!=="undefined"?window.location.href:""}`;
  },[stops,romantic]);
  const inviteHref=useMemo(()=>{
    const p=new URLSearchParams();
    if(guestName.trim())p.set("guest",guestName.trim());
    if(date)p.set("date",date); if(time)p.set("time",time); if(meeting.trim())p.set("meeting",meeting.trim()); if(note.trim())p.set("note",note.trim());
    return `/invite?${p.toString()}`;
  },[guestName,date,time,meeting,note]);
  const inviteText=useMemo(()=>{
    const hello=guestName.trim()?`${guestName.trim()}, `:"";const when=[prettyDate,time].filter(Boolean).join(" · ");const where=meeting.trim()?`\nВстречаемся: ${meeting.trim()}`:"";
    return `${hello}приглашаю тебя на маленькое приключение по Петербургу ✦\n${when?`Когда: ${when}`:""}${where}\n${note.trim()}\n\nМаршрут уже собран в ALMA, но точки пока останутся секретом.`;
  },[guestName,prettyDate,time,meeting,note]);
  const readyToSend=Boolean(date&&time&&note.trim());
  const fullInviteUrl=()=>typeof window==="undefined"?inviteHref:`${window.location.origin}${inviteHref}`;
  const copyInvite=async()=>{try{await navigator.clipboard.writeText(inviteText);setCopied(true);setTimeout(()=>setCopied(false),1800)}catch{}};
  const copyLink=async()=>{if(!readyToSend)return;try{await navigator.clipboard.writeText(fullInviteUrl());setLinkCopied(true);setTimeout(()=>setLinkCopied(false),1800)}catch{}};
  const shareInvite=async()=>{if(!readyToSend)return;try{const url=fullInviteUrl();if(navigator.share){await navigator.share({title:"Приглашение от ALMA",text:inviteText,url});setShared(true);setTimeout(()=>setShared(false),1800)}else await copyLink()}catch{}};
  const saveInvite=()=>{try{localStorage.setItem(INVITE_DRAFT_KEY,JSON.stringify({guestName,date,time,meeting,note,updatedAt:new Date().toISOString()}));setSaved(true);setTimeout(()=>setSaved(false),1800)}catch{}};
  const downloadCalendar=()=>{if(!date||!time)return;const start=new Date(`${date}T${time}:00`);if(Number.isNaN(start.getTime()))return;const end=new Date(start.getTime()+3*60*60*1000);const fmt=(d:Date)=>d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");const esc=(v:string)=>v.replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;");const ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//ALMA//Date Invitation//RU","BEGIN:VEVENT",`UID:alma-${Date.now()}@local`,`DTSTAMP:${fmt(new Date())}`,`DTSTART:${fmt(start)}`,`DTEND:${fmt(end)}`,`SUMMARY:${esc("Свидание с ALMA ✦")}`,`DESCRIPTION:${esc("Маршрут — сюрприз. Детали останутся скрыты до встречи.")}`,`LOCATION:${esc(meeting.trim()||"Санкт-Петербург")}`,"END:VEVENT","END:VCALENDAR"].join("\r\n");const blob=new Blob([ics],{type:"text/calendar;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="alma-date.ics";a.click();URL.revokeObjectURL(url)};
  const saveRouteToPhone=()=>{if(typeof window==="undefined")return;window.print()};
  const shareRoute=async()=>{if(typeof window==="undefined")return;try{if(navigator.share){await navigator.share({title:"Мой маршрут ALMA",text:routeText,url:window.location.href});setRouteShared(true);setTimeout(()=>setRouteShared(false),1800)}else{await navigator.clipboard.writeText(window.location.href);setRouteLinkCopied(true);setTimeout(()=>setRouteLinkCopied(false),1800)}}catch{}};

  return <div className="alma-purchased-route mt-9 overflow-hidden rounded-[38px] bg-[#f3eee6] border border-black/5">
    <header className="p-7 sm:p-10 lg:p-12 border-b border-black/5"><div className="flex flex-wrap items-start justify-between gap-6"><div><span className="inline-flex rounded-full bg-[#dcebdc] px-3 py-2 text-xs font-semibold">ТЕСТОВАЯ ПОКУПКА УСПЕШНА</span><p className="mt-6 text-xs uppercase tracking-[.2em] text-neutral-400">Твой день с ALMA</p><h3 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight">Маршрут открыт ✦</h3><p className="mt-3 max-w-xl text-neutral-500">Готовый сценарий: куда идти, сколько остаться и как перейти к следующей точке. 199 ₽ в тестовом режиме не списывались.</p><div className="alma-route-actions mt-6 flex flex-wrap gap-2"><button type="button" onClick={saveRouteToPhone} className="rounded-full bg-black text-white px-5 py-3 text-sm font-semibold hover:opacity-80 transition">↓ Сохранить на телефон</button><button type="button" onClick={shareRoute} className="rounded-full bg-white border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-neutral-50 transition">{routeShared?"Отправлено ✓":routeLinkCopied?"Ссылка скопирована ✓":"↗ Поделиться"}</button></div><p className="alma-route-actions mt-2 text-xs text-neutral-400">«Сохранить на телефон» откроет системное окно печати — выбери «Сохранить как PDF» или «Сохранить в Файлы».</p></div><button onClick={onReset} className="alma-route-actions rounded-full bg-white border border-black/10 px-5 py-3 text-sm">Новый тест</button></div></header>
    <div className="relative px-5 sm:px-10 lg:px-14 py-10 sm:py-14"><div className="absolute left-[42px] sm:left-1/2 top-10 bottom-10 w-px bg-black/15"/>
      {stops.map((place,i)=>{const reverse=i%2===1,next=stops[i+1],walk=next?minutesBetween(place,next):0;const fact=story(place);return <div key={`${place.category}-${place.id}`} className="alma-route-stop relative mb-3 last:mb-0"><span className="absolute left-[18px] sm:left-1/2 sm:-translate-x-1/2 top-8 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white font-bold shadow-lg">{i+1}</span><article className={`ml-16 sm:ml-0 grid sm:grid-cols-2 gap-7 sm:gap-16 lg:gap-24 items-center ${reverse?"sm:[&>*:first-child]:order-2":""}`}><div className="relative aspect-[4/3] overflow-hidden rounded-[50%] bg-[linear-gradient(135deg,#d9e0d4,#eee3d5)] shadow-sm">{place.image?<Image src={place.image} alt={place.name} fill sizes="(max-width: 640px) 80vw, 38vw" className="object-cover"/>:<div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><span className="text-5xl">{place.category.toLowerCase().includes("ресторан")?"🍽️":"✦"}</span><p className="mt-3 text-xs uppercase tracking-[.18em] text-neutral-500">ALMA</p></div></div>}</div><div className={reverse?"sm:text-right":""}><p className="text-xs uppercase tracking-[.18em] text-neutral-400">Остановка {i+1} · {place.category}</p><h4 className="mt-3 text-2xl sm:text-3xl font-bold">{place.name}</h4><p className="mt-2 text-sm text-neutral-500">⌖ {place.address}</p>{place.rating&&<p className="mt-2 text-xs text-neutral-500">★ {place.rating.toFixed(1)} · {place.ratingSource}</p>}<div className={`mt-5 flex flex-wrap gap-2 ${reverse?"sm:justify-end":""}`}><span className="rounded-full bg-white px-3 py-2 text-xs">◷ Здесь: {stayTime(place)}</span><span className="rounded-full bg-white px-3 py-2 text-xs">{place.price}</span></div><p className="mt-5 text-sm leading-6 text-neutral-600">{place.description}</p><div className="mt-5 rounded-[20px] bg-white/70 p-4 text-left"><p className="text-xs uppercase tracking-wider text-neutral-400">Что надеть</p><p className="mt-2 text-sm leading-6">{outfit(place.category)}</p></div>{romantic&&fact&&<div className="mt-3 rounded-[20px] bg-[#e8ddd0] p-4 text-left"><p className="text-xs uppercase tracking-wider text-neutral-500">Можно рассказать ✦</p><p className="mt-2 text-sm leading-6">{fact}</p></div>}<Link href={`/map?place=${place.mapPlaceId??place.id}`} className="alma-route-actions mt-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black text-white" aria-label={`Показать ${place.name} на карте ALMA`}><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"/><circle cx="12" cy="10" r="2.2"/></svg></Link></div></article>{next&&<div className="relative z-10 ml-16 sm:ml-0 py-9 sm:py-12 flex sm:justify-center"><div className="rounded-full bg-[#f3eee6] border border-black/10 px-5 py-2.5 text-xs font-medium">≈ {walk} мин пешком до следующей точки</div></div>}</div>})}
    </div>
    {romantic&&<footer className="alma-route-actions m-5 sm:m-10 mt-0 rounded-[30px] bg-black p-6 sm:p-8 text-white"><div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"><div><p className="text-xs uppercase tracking-[.18em] text-white/45">Для свидания</p><h4 className="mt-2 text-2xl sm:text-3xl font-bold">Приглашение без спойлеров</h4><p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">ALMA создаёт отдельную ссылку для получателя: там будут только дата, время, место встречи и твоё сообщение — маршрут останется секретом.</p></div><button type="button" onClick={()=>setInviteOpen(v=>!v)} className="shrink-0 rounded-full bg-white text-black px-5 py-3 text-sm font-semibold">{inviteOpen?"Скрыть":"Создать приглашение"}</button></div>
      {inviteOpen&&<div className="mt-7 grid lg:grid-cols-[.95fr_1.05fr] gap-4"><div className="rounded-[24px] bg-white/8 border border-white/10 p-5"><label className="block text-xs text-white/45">Кого приглашаем</label><input value={guestName} onChange={e=>setGuestName(e.target.value)} placeholder="Например, Аня" className="mt-2 w-full rounded-2xl bg-white text-black px-4 py-3 outline-none"/><div className="mt-4 grid grid-cols-2 gap-3"><div><label className="block text-xs text-white/45">Дата</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-2 w-full rounded-2xl bg-white text-black px-4 py-3 outline-none"/></div><div><label className="block text-xs text-white/45">Время встречи</label><input type="time" value={time} onChange={e=>setTime(e.target.value)} className="mt-2 w-full rounded-2xl bg-white text-black px-4 py-3 outline-none"/></div></div><label className="mt-4 block text-xs text-white/45">Место встречи · необязательно</label><input value={meeting} onChange={e=>setMeeting(e.target.value)} placeholder="Например, у метро Адмиралтейская" className="mt-2 w-full rounded-2xl bg-white text-black px-4 py-3 outline-none"/><p className="mt-4 text-xs text-white/45">Тон приглашения</p><div className="mt-2 flex flex-wrap gap-2">{invitePresets.map(p=><button key={p.label} type="button" onClick={()=>setNote(p.text)} className={`rounded-full px-3 py-2 text-xs border ${note===p.text?"bg-white text-black border-white":"border-white/15 text-white/70"}`}>{p.label}</button>)}</div><label className="mt-4 block text-xs text-white/45">Сообщение</label><textarea value={note} onChange={e=>setNote(e.target.value)} rows={4} className="mt-2 w-full resize-none rounded-2xl bg-white text-black px-4 py-3 outline-none"/><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={saveInvite} className="rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold">{saved?"Сохранено ✓":"Сохранить черновик"}</button><button type="button" onClick={()=>setRecipientPreview(v=>!v)} className="rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold">{recipientPreview?"Скрыть вид":"Глазами получателя"}</button></div></div><div className="rounded-[24px] bg-[#f3eee6] p-6 text-black"><div className="flex items-center justify-between gap-3"><p className="text-xs uppercase tracking-[.18em] text-neutral-400">Предпросмотр</p><span className="rounded-full bg-black/5 px-3 py-1.5 text-[11px] text-neutral-500">без спойлеров</span></div><div className="mt-5 rounded-[24px] bg-white p-5 shadow-sm"><p className="text-xs uppercase tracking-[.18em] text-neutral-400">ALMA · приглашение</p><p className="mt-4 whitespace-pre-line text-base leading-7">{inviteText}</p></div>{recipientPreview&&<div className="mt-4 rounded-[28px] bg-black p-5 text-white"><p className="text-[11px] uppercase tracking-[.18em] text-white/40">Так увидит получатель</p><p className="mt-4 text-2xl font-bold">Для тебя есть план ✦</p><p className="mt-3 text-sm leading-6 text-white/65">{prettyDate||"Дата пока не выбрана"}{time?` · ${time}`:""}</p>{meeting&&<p className="mt-2 text-sm text-white/65">Встречаемся: {meeting}</p>}<div className="mt-5 rounded-[20px] bg-white/10 p-4"><p className="text-sm leading-6">{note}</p></div></div>}{!readyToSend&&<p className="mt-4 text-xs text-amber-700">Добавь дату и время встречи — тогда приглашение будет готово.</p>}<div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={shareInvite} disabled={!readyToSend} className="rounded-full bg-black text-white px-5 py-3 text-sm font-semibold disabled:opacity-30">{shared?"Готово ✓":"Поделиться"}</button><button type="button" onClick={copyLink} disabled={!readyToSend} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold disabled:opacity-30">{linkCopied?"Ссылка скопирована ✓":"Скопировать ссылку"}</button><Link href={readyToSend?inviteHref:"#"} target={readyToSend?"_blank":undefined} aria-disabled={!readyToSend} className={`rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold ${readyToSend?"":"pointer-events-none opacity-30"}`}>Открыть приглашение</Link><button type="button" onClick={copyInvite} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold">{copied?"Скопировано ✓":"Скопировать текст"}</button><button type="button" onClick={downloadCalendar} disabled={!readyToSend} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold disabled:opacity-30">В календарь</button></div><p className="mt-3 text-xs leading-5 text-neutral-400">Тестовая ссылка уже работает без аккаунта и не содержит точек маршрута. Ответ «я приду» на странице получателя пока сохраняется только на его устройстве.</p></div></div>}
    </footer>}
  </div>;
}