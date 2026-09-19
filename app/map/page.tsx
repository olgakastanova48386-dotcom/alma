"use client";

import { useMemo, useState } from "react";

type EventItem = {
  id: string;
  title: string;
  place: string;
  date: string;
  category: string;
  note: string;
  href: string;
  accent: string;
  image: string;
};

const events: EventItem[] = [
  { id: "fin-zaliv-house-party", title: "Финский залив андер хаус пати", place: "Севкабель Порт", date: "19–20 сентября", category: "Вечеринки", note: "Вечеринка у залива", href: "https://sevcableport.ru/afisha/", accent: "🌊", image: "/images/sevcable.jpg" },
  { id: "growbox-market", title: "Гроубокс маркет", place: "Севкабель Порт", date: "19–20 сентября", category: "Маркеты", note: "Маркет выходного дня в Порту", href: "https://sevcableport.ru/afisha/", accent: "🛍️", image: "/images/sevcable.jpg" },
  { id: "koi-asia-festival", title: "КОИ Азия Фестиваль", place: "Севкабель Порт · Цех", date: "19–20 сентября", category: "Фестивали", note: "Азия, музыка, еда, маркет и фотозоны · вход по регистрации", href: "https://sevcableport.ru/afisha/koi-aziya-festival/", accent: "🏮", image: "/images/sevcable.jpg" },
  { id: "spiexff", title: "SPIEXFF", place: "Севкабель Порт · лекторий’порт", date: "до 20 сентября", category: "Кино", note: "Международный фестиваль экспериментального кино", href: "https://sevcableport.ru/afisha/sankt-peterburgskij-mezhdunarodnyj-festival-eksperimentalnogo-kino-spiexff/", accent: "🎞️", image: "/images/sevcable.jpg" },
  { id: "waterfront-workouts", title: "Тренировки на набережной", place: "Севкабель Порт · Набережная", date: "до 30 сентября", category: "Спорт", note: "Йога и функциональные тренировки на берегу · вход свободный", href: "https://sevcableport.ru/afisha/trenirovki-na-naberezhnoj/", accent: "🧘", image: "/images/sevcable.jpg" },
  { id: "viktor-tsoi-legenda", title: "Виктор Цой. Легенда", place: "Севкабель Порт", date: "до 27 сентября", category: "Выставки", note: "Выставка в Порту", href: "https://sevcableport.ru/afisha/", accent: "🎸", image: "/images/sevcable.jpg" },
  { id: "museum-machines", title: "Музей Восстания Машин", place: "Брусницын", date: "с 20 сентября", category: "Выставки", note: "Новый интерактивный музей · ежедневно", href: "https://brusnitsyn.spb.ru/", accent: "🤖", image: "/images/питер главная фотка 4.jpg" },
  { id: "yarkiy-fovizm", title: "Яркий фовизм", place: "Брусницын", date: "27 сентября", category: "Лекции", note: "Лекция из цикла «Изменчивый XX век»", href: "https://brusnitsyn.spb.ru/", accent: "🎨", image: "/images/erarta.jpg" },
  { id: "dark-wave", title: "DARK WAVE", place: "Брусницын", date: "31 октября", category: "Вечеринки", note: "Тёмная эстетика, образы и немного мистики", href: "https://brusnitsyn.spb.ru/", accent: "🖤", image: "/images/ночной питербург.jpg" },
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

        <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-12">
          {visible.map((event, index) => (
            <a key={event.title} href={`/map/${event.id}`} className={`group relative flex flex-col justify-between overflow-hidden border border-black/5 p-4 sm:p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${index === 0 ? "min-h-[175px] rounded-[22px] bg-[#1c1b1a] text-white lg:col-span-5" : index === 1 ? "min-h-[175px] rounded-[22px] bg-[#eadfd6] lg:col-span-3" : index === 2 ? "min-h-[175px] rounded-[22px] bg-[#e5e8df] lg:col-span-4" : index === 3 ? "min-h-[170px] rounded-[22px] bg-[#e7e1ec] lg:col-span-4" : index === 4 ? "min-h-[170px] rounded-[22px] bg-[#dfe8e7] lg:col-span-4" : "min-h-[170px] rounded-[22px] bg-white lg:col-span-4"}`}>
              <div className="absolute inset-x-0 top-0 h-[72px] overflow-hidden"><img src={event.image} alt="" className="h-full w-full object-cover opacity-90" /><div className={`absolute inset-0 ${index === 0 ? "bg-black/25" : "bg-gradient-to-b from-black/10 to-transparent"}`} /></div><div className="relative z-10 flex items-start justify-between gap-4">
                <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${index === 0 ? "bg-white/12" : "bg-white/70 backdrop-blur-sm"}`}>{event.category}</span>
                <span className={`${index < 5 ? "text-2xl sm:text-3xl" : "text-2xl"} transition duration-300 group-hover:scale-110`} aria-hidden="true">{event.accent}</span>
              </div>
              <div className="relative z-10 mt-[62px]">
                <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-semibold leading-4 ${index === 0 ? "text-white/75" : "text-neutral-700"}`}><span>{event.date}</span><span className={`${index === 0 ? "text-white/30" : "text-black/20"}`}>•</span><span>{event.place}</span></div>
                <h2 className={`mt-2 font-bold leading-[1.12] tracking-[-0.025em] ${index === 0 ? "max-w-xl text-[clamp(23px,3vw,32px)]" : index < 5 ? "text-[clamp(20px,2.3vw,25px)]" : "text-[clamp(19px,2.2vw,24px)]"}`}>{event.title}</h2>
                <p className={`mt-3 text-[13px] leading-5 sm:text-sm sm:leading-6 ${index === 0 ? "text-white/78" : "text-neutral-700"}`}>{event.note}</p>
                <div className={`mt-3 flex items-center gap-2 text-[12px] font-semibold ${index === 0 ? "text-white/70" : "text-black/60"}`}>Открыть событие <span className="transition group-hover:translate-x-1">→</span></div>
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
