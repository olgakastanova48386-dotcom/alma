"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

const decode = (value: string | null) => {
  if (!value) return "";
  try { return decodeURIComponent(value); } catch { return value; }
};

function InviteContent(){
  const params = useSearchParams();
  const [answer,setAnswer]=useState<"yes"|"maybe"|"">("");
  const guest=decode(params.get("guest"));
  const date=decode(params.get("date"));
  const time=decode(params.get("time"));
  const meeting=decode(params.get("meeting"));
  const note=decode(params.get("note"));

  const prettyDate=useMemo(()=>{
    if(!date) return "";
    const d=new Date(`${date}T12:00:00`);
    return Number.isNaN(d.getTime())?date:new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long",weekday:"long"}).format(d);
  },[date]);

  const saveAnswer=(value:"yes"|"maybe")=>{
    setAnswer(value);
    try{localStorage.setItem("alma-invite-answer",JSON.stringify({answer:value,guest,date,time,updatedAt:new Date().toISOString()}));}catch{}
  };

  return <main className="min-h-screen bg-[#f7f4ef] px-4 py-20 sm:px-6 sm:py-28">
    <section className="mx-auto max-w-2xl">
      <div className="rounded-[38px] bg-black p-6 text-white shadow-2xl sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xl font-bold tracking-tight">alma</span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[.18em] text-white/60">без спойлеров</span>
        </div>
        <div className="mt-12 rounded-[30px] bg-[#f3eee6] p-6 text-black sm:p-8">
          <p className="text-xs uppercase tracking-[.2em] text-neutral-400">Для тебя есть план ✦</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{guest?`${guest}, тебя приглашают`:"Тебя приглашают"}</h1>
          <p className="mt-4 text-base leading-7 text-neutral-600">На небольшое приключение по Петербургу. Маршрут уже собран в ALMA, но все точки пока останутся секретом.</p>
          {(prettyDate||time||meeting)&&<div className="mt-7 grid gap-3 sm:grid-cols-2">
            {(prettyDate||time)&&<div className="rounded-[22px] bg-white p-5"><p className="text-xs uppercase tracking-wider text-neutral-400">Когда</p><p className="mt-2 font-semibold">{[prettyDate,time].filter(Boolean).join(" · ")}</p></div>}
            {meeting&&<div className="rounded-[22px] bg-white p-5"><p className="text-xs uppercase tracking-wider text-neutral-400">Встречаемся</p><p className="mt-2 font-semibold">{meeting}</p></div>}
          </div>}
          {note&&<div className="mt-5 rounded-[22px] bg-[#e8ddd0] p-5"><p className="text-xs uppercase tracking-wider text-neutral-500">Сообщение</p><p className="mt-3 whitespace-pre-line text-base leading-7">{note}</p></div>}
          <div className="mt-8 border-t border-black/10 pt-7">
            {!answer?<><p className="text-sm font-medium">Получается прийти?</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>saveAnswer("yes")} className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">Да, я в деле ✦</button><button onClick={()=>saveAnswer("maybe")} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold">Пока не уверен(а)</button></div></>:<div className="rounded-[22px] bg-white p-5"><p className="text-sm font-semibold">{answer==="yes"?"Ответ сохранён: ты в деле ✦":"Ответ сохранён: пока под вопросом"}</p><p className="mt-2 text-xs leading-5 text-neutral-500">В тестовой версии ответ хранится только на этом устройстве. После подключения аккаунтов ALMA сможет передавать его отправителю.</p></div>}
          </div>
        </div>
        <p className="mt-6 text-center text-xs leading-5 text-white/45">ALMA не раскрывает в приглашении названия мест, адреса остановок и порядок маршрута.</p>
      </div>
      <div className="mt-6 text-center"><Link href="/" className="text-sm text-neutral-500 underline underline-offset-4">Что такое ALMA?</Link></div>
    </section>
  </main>;
}

export default function InvitePage(){
  return <Suspense fallback={<main className="min-h-screen bg-[#f7f4ef]"/>}><InviteContent/></Suspense>;
}
