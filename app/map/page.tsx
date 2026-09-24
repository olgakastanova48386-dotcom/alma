"use client";

import { useMemo, useState } from "react";
import { events, isEventActive } from "@/data/events";

const filters = ["Все", "Вечеринки", "Фестивали", "Маркеты", "Кино", "Выставки", "Спорт", "Лекции"];

export default function MapPage() {
  const [filter, setFilter] = useState("Все");
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () => events.filter((event) => isEventActive(event) && (filter === "Все" || event.category === filter) && (!query.trim() || `${event.title} ${event.place} ${event.note}`.toLocaleLowerCase("ru-RU").includes(query.trim().toLocaleLowerCase("ru-RU")))),
    [filter, query],
  );

  return (
    <main className="min-h-screen bg-[#f7f4ef] pb-20 pt-[calc(env(safe-area-inset-top)+68px)] text-black sm:pt-[104px]">
      <section className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[clamp(32px,6vw,76px)] font-bold leading-[.95] tracking-[-0.055em]">События</h1>
          </div>
          <label className="alma-well flex h-11 w-full items-center gap-3 rounded-full bg-[#ebe7e1] px-4 lg:max-w-[390px]">
            <span className="text-lg">⌕</span>
            <input aria-label="Поиск событий" placeholder="Поиск событий" value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500" />
          </label>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {filters.map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-medium transition ${filter === item ? "border-black bg-black text-white" : "border-black/10 bg-white hover:border-black/30"}`}>{item}</button>
          ))}
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {visible.length === 0 && <p className="rounded-[20px] bg-white p-5 text-sm text-neutral-600 md:col-span-2 lg:col-span-3">По этому запросу событий пока нет.</p>}
          {visible.map((event) => (
            <a key={event.id} href={`/map/${event.id}`} className="alma-paper group overflow-hidden rounded-[22px] border border-black/[.06] bg-white shadow-[0_6px_24px_rgba(0,0,0,.035)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,0,0,.08)]">
              <div className="relative aspect-[16/6.1] overflow-hidden bg-neutral-100">
                <img src={event.image} alt={event.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-2 text-xs font-medium text-black backdrop-blur-sm">{event.category}</span>
              </div>
              <div className="flex min-h-0 flex-col p-4 sm:min-h-[205px] sm:p-5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-semibold leading-4 text-neutral-600">
                  <span>{event.date}</span><span className="text-black/20">•</span><span>{event.place}</span>
                </div>
                <h2 className="mt-2 text-[20px] font-bold leading-[1.08] tracking-[-0.035em] sm:mt-2.5 sm:text-[clamp(21px,2vw,27px)]">{event.title}</h2>
                <p className="mt-2 text-[13px] leading-[1.35] text-neutral-600 sm:mt-2.5 sm:text-[14px] sm:leading-5">{event.note}</p>
                <div className="mt-2 text-[13px] font-semibold text-neutral-700 sm:mt-auto sm:pt-5">Подробнее <span className="ml-1 inline-block transition group-hover:translate-x-1">→</span></div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
