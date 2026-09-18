"use client";

import { useMemo, useState } from "react";

type EventItem = {
  title: string;
  place: string;
  date: string;
  category: string;
  note: string;
  href: string;
  accent: string;
};

const events: EventItem[] = [
  { title: "Финский залив андер хаус пати", place: "Севкабель Порт", date: "19–20 сентября", category: "Вечеринки", note: "Вечеринка у залива", href: "https://sevcableport.ru/afisha/", accent: "🌊" },
  { title: "Гроубокс маркет", place: "Севкабель Порт", date: "19–20 сентября", category: "Маркеты", note: "Маркет выходного дня в Порту", href: "https://sevcableport.ru/afisha/", accent: "🛍️" },
  { title: "КОИ Азия Фестиваль", place: "Севкабель Порт · Цех", date: "19–20 сентября", category: "Фестивали", note: "Азия, музыка, еда, маркет и фотозоны · вход по регистрации", href: "https://sevcableport.ru/afisha/koi-aziya-festival/", accent: "🏮" },
  { title: "SPIEXFF", place: "Севкабель Порт · лекторий’порт", date: "до 20 сентября", category: "Кино", note: "Международный фестиваль экспериментального кино", href: "https://sevcableport.ru/afisha/sankt-peterburgskij-mezhdunarodnyj-festival-eksperimentalnogo-kino-spiexff/", accent: "🎞️" },
  { title: "Тренировки на набережной", place: "Севкабель Порт · Набережная", date: "до 30 сентября", category: "Спорт", note: "Йога и функциональные тренировки на берегу · вход свободный", href: "https://sevcableport.ru/afisha/trenirovki-na-naberezhnoj/", accent: "🧘" },
  { title: "Виктор Цой. Легенда", place: "Севкабель Порт", date: "до 27 сентября", category: "Выставки", note: "Выставка в Порту", href: "https://sevcableport.ru/afisha/", accent: "🎸" },
  { title: "Музей Восстания Машин", place: "Брусницын", date: "с 20 сентября", category: "Выставки", note: "Новый интерактивный музей · ежедневно", href: "https://brusnitsyn.spb.ru/", accent: "🤖" },
  { title: "Яркий фовизм", place: "Брусницын", date: "27 сентября", category: "Лекции", note: "Лекция из цикла «Изменчивый XX век»", href: "https://brusnitsyn.spb.ru/", accent: "🎨" },
  { title: "DARK WAVE", place: "Брусницын", date: "31 октября", category: "Вечеринки", note: "Тёмная эстетика, образы и немного мистики", href: "https://brusnitsyn.spb.ru/", accent: "🖤" },
];

const filters = ["Все", "Вечеринки", "Фестивали", "Маркеты", "Кино", "Выставки", "Спорт", "Лекции"];

export default function MapPage() {
  const [filter, setFilter] = useState("Все");
  const visible = useMemo(() => filter === "Все" ? events : events.filter((event) => event.category === filter), [filter]);

  return (
    <main className="min-h-screen bg-[#f7f4ef] pb-20 pt-28 text-black sm:pt-32">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 grid items-start gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)] md:gap-12">
          <h1 className="whitespace-nowrap text-[clamp(25px,4.5vw,48px)] font-bold leading-[1.08] tracking-[-0.03em]">Что сегодня в городе?</h1>
        </div>

        <div className="mt-8 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {filters.map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-medium transition ${filter === item ? "border-black bg-black text-white" : "border-black/10 bg-white hover:border-black/30"}`}>{item}</button>
          ))}
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-12">
          {visible.map((event, index) => (
            <a key={event.title} href={event.href} target="_blank" rel="noreferrer" className={`group relative flex flex-col justify-between overflow-hidden border border-black/5 p-5 sm:p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${index === 0 ? "min-h-[220px] rounded-[26px] bg-[#1c1b1a] text-white lg:col-span-6" : index === 1 ? "min-h-[220px] rounded-[26px] bg-[#eadfd6] lg:col-span-3" : index === 2 ? "min-h-[220px] rounded-[26px] bg-[#e5e8df] lg:col-span-3" : index === 3 ? "min-h-[210px] rounded-[24px] bg-[#e7e1ec] lg:col-span-4" : index === 4 ? "min-h-[210px] rounded-[24px] bg-[#dfe8e7] lg:col-span-4" : "min-h-[210px] rounded-[24px] bg-white lg:col-span-4"}`}>
              <div className="flex items-start justify-between gap-4">
                <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${index === 0 ? "bg-white/12" : "bg-white/70 backdrop-blur-sm"}`}>{event.category}</span>
                <span className={`${index < 5 ? "text-3xl sm:text-4xl" : "text-3xl"} transition duration-300 group-hover:scale-110`} aria-hidden="true">{event.accent}</span>
              </div>
              <div>
                <p className={`text-sm ${index === 0 ? "text-white/55" : "text-neutral-500"}`}>{event.date} · {event.place}</p>
                <h2 className={`mt-2 font-bold leading-[1.04] tracking-[-0.035em] ${index === 0 ? "text-[clamp(26px,3.8vw,38px)] max-w-xl" : index < 5 ? "text-[clamp(22px,2.7vw,29px)]" : "text-[clamp(21px,2.5vw,27px)]"}`}>{event.title}</h2>
                <p className={`mt-3 text-[13px] leading-5 sm:text-sm sm:leading-6 ${index === 0 ? "text-white/65" : "text-neutral-500"}`}>{event.note}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold">Подробнее <span className="transition group-hover:translate-x-1">→</span></div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 rounded-[30px] bg-[#e9e4dc] p-6 sm:p-9">
          <p className="text-xs uppercase tracking-[.2em] text-neutral-500">ALMA следит за городом</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">События будут меняться вместе с Петербургом</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">Прошедшее убираем, новое добавляем — чтобы здесь оставалось то, на что действительно можно сходить.</p>
        </div>
      </section>
    </main>
  );
}
