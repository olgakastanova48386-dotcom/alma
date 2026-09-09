"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { restaurantPlaces } from "@/data/restaurantPlaces";

type DogFilter = "Все" | "Dog Friendly 🐾" | "Без отметки 🐾";

export default function RestaurantsPage() {
  const [dogFilter, setDogFilter] = useState<DogFilter>("Все");
  const filtered = useMemo(() => restaurantPlaces.filter((place) => {
    if (dogFilter === "Dog Friendly 🐾") return Boolean(place.dogFriendly);
    if (dogFilter === "Без отметки 🐾") return !place.dogFriendly;
    return true;
  }), [dogFilter]);

  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-28 sm:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div><h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">Рестораны с рейтингом 4,5–5,0</h1><p className="mt-4 max-w-3xl text-neutral-600 text-base sm:text-lg leading-8">Проверенная подборка ALMA. Показываем рейтинг, количество оценок, дату проверки и подтверждённые удобства.</p></div>
          <div className="rounded-full bg-black text-white px-5 py-3 text-sm font-medium self-start lg:self-auto">{filtered.length} мест</div>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {(["Все", "Dog Friendly 🐾", "Без отметки 🐾"] as DogFilter[]).map((item) => <button key={item} type="button" onClick={() => setDogFilter(item)} className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${dogFilter === item ? "bg-black text-white" : "bg-white border border-black/5 hover:border-black/20"}`}>{item}</button>)}
        </div>
        {dogFilter === "Без отметки 🐾" && <p className="mt-3 text-xs text-neutral-500">«Без отметки» означает, что ALMA пока не подтверждала Dog Friendly-условия. Это не означает запрет на посещение с собакой.</p>}

        <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((place) => (
            <article key={place.id} className="relative overflow-hidden rounded-[28px] bg-white border border-black/5 shadow-sm flex flex-col transition hover:-translate-y-1 hover:shadow-lg">
              <Link href={`/place/${2000 + place.id}`} aria-label={`Открыть карточку ${place.name}`} className="absolute inset-0 z-10 rounded-[28px]"><span className="sr-only">Открыть карточку {place.name}</span></Link>
              {place.image && (
                <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                  <img src={place.image} alt={`Интерьер ресторана ${place.name}`} className="h-full w-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Ресторан</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">{place.name}</h2></div><div className="shrink-0 rounded-2xl bg-black px-4 py-3 text-white text-xl sm:text-2xl font-bold leading-none">★ {place.rating.toFixed(1)} <span className="text-sm font-medium text-white/60">/ 5</span></div></div>
              <p className="mt-4 text-sm leading-6 text-neutral-600">{place.note}</p>
              <div className="mt-4 flex flex-wrap gap-2">{place.dogFriendly && <span className="inline-flex rounded-full bg-black text-white px-3 py-2 text-sm font-semibold">🐾 {place.dogFriendly}</span>}{place.babyCare && <span className="inline-flex rounded-full bg-[#efe5d7] px-3 py-2 text-xs font-semibold text-neutral-800">👶 {place.babyCare}</span>}</div>
              <div className="mt-5 space-y-2 text-sm text-neutral-600"><p><span className="text-black font-medium">Адрес:</span> {place.address}</p>{place.averageBill && <p><span className="text-black font-medium">Средний счёт:</span> {place.averageBill}</p>}{place.phone && <p><span className="text-black font-medium">Телефон:</span> {place.phone}</p>}{place.babyCare && <p><span className="text-black font-medium">Для малыша:</span> {place.babyCare}{place.babyCareVerifiedAt ? ` · проверено ${place.babyCareVerifiedAt}` : ""}</p>}</div>
              <div className="mt-auto pt-6"><div className="pt-5 border-t border-black/5 text-sm text-neutral-500 leading-6"><p className="font-medium text-neutral-700">★ {place.rating.toFixed(1)} из 5 · {place.ratingCount.toLocaleString("ru-RU")} оценок</p><p>Проверено ALMA: {place.ratingUpdated}</p></div><div className="mt-5 flex justify-end"><Link href={`/map?place=${2000 + place.id}`} title="На карте" aria-label={`${place.name} на карте ALMA`} className="relative z-20 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition hover:scale-105"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></Link></div></div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10"><Link href="/map" className="inline-flex rounded-full bg-white border border-black/5 px-5 py-3 text-sm font-medium shadow-sm">← К карте</Link></div>
      </div>
    </main>
  );
}
