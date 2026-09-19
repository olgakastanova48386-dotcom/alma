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
  { id: "fin-zaliv-house-party", title: "Финский залив андер хаус пати", place: "Севкабель Порт", date: "19–20 сентября", category: "Вечеринки", note: "Вечеринка у залива", href: "https://sevcableport.ru/afisha/", accent: "", image: "/events/fin-zaliv-house-party.jpg" },
  { id: "growbox-market", title: "Гроубокс маркет", place: "Севкабель Порт", date: "19–20 сентября", category: "Маркеты", note: "Маркет выходного дня в Порту", href: "https://sevcableport.ru/afisha/", accent: "", image: "/events/growbox-market.jpg" },
  { id: "koi-asia-festival", title: "КОИ Азия Фестиваль", place: "Севкабель Порт · Цех", date: "19–20 сентября", category: "Фестивали", note: "Азия, музыка, еда, маркет и фотозоны · вход по регистрации", href: "https://sevcableport.ru/afisha/koi-aziya-festival/", accent: "", image: "/events/koi-asia-festival.jpg" },
  { id: "spiexff", title: "SPIEXFF", place: "Севкабель Порт · лекторий’порт", date: "до 20 сентября", category: "Кино", note: "Международный фестиваль экспериментального кино", href: "https://sevcableport.ru/afisha/sankt-peterburgskij-mezhdunarodnyj-festival-eksperimentalnogo-kino-spiexff/", accent: "", image: "/events/spiexff.jpg" },
  { id: "waterfront-workouts", title: "Тренировки на набережной", place: "Севкабель Порт · Набережная", date: "до 30 сентября", category: "Спорт", note: "Йога и функциональные тренировки на берегу · вход свободный", href: "https://sevcableport.ru/afisha/trenirovki-na-naberezhnoj/", accent: "", image: "/events/waterfront-workouts.jpg" },
  { id: "viktor-tsoi-legenda", title: "Виктор Цой. Легенда", place: "Севкабель Порт", date: "до 27 сентября", category: "Выставки", note: "Выставка в Порту", href: "https://sevcableport.ru/afisha/", accent: "", image: "/events/viktor-tsoi-legenda.jpg" },
  { id: "museum-machines", title: "Музей Восстания Машин", place: "Брусницын", date: "с 20 сентября", category: "Выставки", note: "Новый интерактивный музей · ежедневно", href: "https://brusnitsyn.spb.ru/", accent: "", image: "/events/museum-machines.jpg" },
  { id: "yarkiy-fovizm", title: "Яркий фовизм", place: "Брусницын", date: "27 сентября", category: "Лекции", note: "Лекция из цикла «Изменчивый XX век»", href: "https://brusnitsyn.spb.ru/", accent: "", image: "/events/yarkiy-fovizm.jpg" },
  { id: "dark-wave", title: "DARK WAVE", place: "Брусницын", date: "31 октября", category: "Вечеринки", note: "Тёмная эстетика, образы и немного мистики", href: "https://brusnitsyn.spb.ru/", accent: "", image: "/events/dark-wave.jpg" },
];

const filters = ["Все", "Вечеринки", "Фестивали", "Маркеты", "Кино", "Выставки", "Спорт", "Лекции"];

export default function MapPage() {
  const [filter, setFilter] = useState("Все");
  const visible = useMemo(() => filter === "Все" ? events : events.filter((event) => event.category === filter), [filter]);

  return (
    <main className="min-h-screen bg-[#f7f4ef] pb-20 pt-28 text-black sm:pt-32">
      <section className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[clamp(44px,6vw,76px)] font-bold leading-[.95] tracking-[-0.055em]">События</h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-6 text-neutral-600 sm:text-lg">Выставки, фестивали, маркеты, кино и другие события в Санкт-Петербурге</p>
          </div>
          <label className="flex h-12 w-full items-center gap-3 rounded-full bg-[#ebe7e1] px-5 lg:max-w-[390px]">
            <span className="text-lg">⌕</span>
            <input aria-label="Поиск событий" placeholder="Поиск событий" className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500" />
          </label>
        </div>

        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {filters.map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full border px-4 py-2.5 text-[13px] font-medium transition ${filter === item ? "border-black bg-black text-white" : "border-black/10 bg-white hover:border-black/30"}`}>{item}</button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((event) => (
            <a key={event.id} href={`/map/${event.id}`} className="group overflow-hidden rounded-[22px] border border-black/[.06] bg-white shadow-[0_6px_24px_rgba(0,0,0,.035)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,0,0,.08)]">
              <div className="relative aspect-[16/6.1] overflow-hidden bg-neutral-100">
                <img src={event.image} alt={event.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-2 text-xs font-medium text-black backdrop-blur-sm">{event.category}</span>
              </div>
              <div className="flex min-h-[205px] flex-col p-5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-semibold leading-4 text-neutral-600">
                  <span>{event.date}</span><span className="text-black/20">•</span><span>{event.place}</span>
                </div>
                <h2 className="mt-2.5 text-[clamp(21px,2vw,27px)] font-bold leading-[1.08] tracking-[-0.035em]">{event.title}</h2>
                <p className="mt-2.5 text-[14px] leading-5 text-neutral-600">{event.note}</p>
                <div className="mt-auto pt-5 text-[13px] font-semibold text-neutral-700">Подробнее <span className="ml-1 inline-block transition group-hover:translate-x-1">→</span></div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
