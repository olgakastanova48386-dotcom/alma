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
  { title: "Виктор Цой. Легенда", place: "Севкабель Порт", date: "до 27 сентября", category: "Выставки", note: "Выставка в Порту", href: "https://sevcableport.ru/afisha/", accent: "🎸" },
  { title: "Музей Восстания Машин", place: "Брусницын", date: "с 20 сентября", category: "Выставки", note: "Новый интерактивный музей · ежедневно", href: "https://brusnitsyn.spb.ru/", accent: "🤖" },
  { title: "Яркий фовизм", place: "Брусницын", date: "27 сентября", category: "Лекции", note: "Лекция из цикла «Изменчивый XX век»", href: "https://brusnitsyn.spb.ru/", accent: "🎨" },
  { title: "DARK WAVE", place: "Брусницын", date: "31 октября", category: "Вечеринки", note: "Тёмная эстетика, образы и немного мистики", href: "https://brusnitsyn.spb.ru/", accent: "🖤" },
];

const filters = ["Все", "Вечеринки", "Фестивали", "Маркеты", "Кино", "Выставки", "Лекции"];

export default function MapPage() {
  const [filter, setFilter] = useState("Все");
  const visible = useMemo(() => filter === "Все" ? events : events.filter((event) => event.category === filter), [filter]);

  return (
    <main className="min-h-screen bg-[#f7f4ef] pb-20 pt-28 text-black sm:pt-32">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">ALMA · Петербург сейчас</p>
        <div className="mt-4 max-w-4xl">
          <h1 className="text-[clamp(42px,8vw,88px)] font-bold leading-[0.94] tracking-tight">Что происходит<br />в Петербурге?</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">Вечеринки, фестивали, выставки и события в городских пространствах. Выбирай, куда хочется сегодня.</p>
        </div>

        <div className="mt-8 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {filters.map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition ${filter === item ? "border-black bg-black text-white" : "border-black/10 bg-white hover:border-black/30"}`}>{item}</button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((event, index) => (
            <a key={event.title} href={event.href} target="_blank" rel="noreferrer" className={`group relative flex min-h-[330px] flex-col justify-between overflow-hidden rounded-[30px] border border-black/5 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${index === 0 ? "bg-[#1c1b1a] text-white md:col-span-2" : "bg-white"}`}>
              <div className="flex items-start justify-between gap-4">
                <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${index === 0 ? "bg-white/12" : "bg-[#f1eee9]"}`}>{event.category}</span>
                <span className="text-3xl" aria-hidden="true">{event.accent}</span>
              </div>
              <div>
                <p className={`text-sm ${index === 0 ? "text-white/55" : "text-neutral-500"}`}>{event.date} · {event.place}</p>
                <h2 className="mt-2 text-[clamp(25px,4vw,38px)] font-bold leading-[1.02] tracking-tight">{event.title}</h2>
                <p className={`mt-3 text-sm leading-6 ${index === 0 ? "text-white/65" : "text-neutral-500"}`}>{event.note}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold">Подробнее <span className="transition group-hover:translate-x-1">→</span></div>
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
