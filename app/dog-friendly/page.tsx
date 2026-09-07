"use client";

import { useMemo, useState } from "react";
import { dogFriendlyPlaces } from "@/data/dogFriendlyPlaces";

function normalizedRating(rating?: number, scale?: number) {
  if (typeof rating !== "number" || typeof scale !== "number" || scale <= 0) return null;
  return (rating / scale) * 5;
}

export default function DogFriendlyPage() {
  const [category, setCategory] = useState("Все места");
  const [district, setDistrict] = useState("Все районы");

  const categories = ["Все места", ...Array.from(new Set(dogFriendlyPlaces.map((place) => place.category)))];
  const districts = ["Все районы", ...Array.from(new Set(dogFriendlyPlaces.map((place) => place.district)))];

  const filtered = useMemo(
    () => dogFriendlyPlaces.filter((place) =>
      (category === "Все места" || place.category === category) &&
      (district === "Все районы" || place.district === district)
    ),
    [category, district]
  );

  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-32 sm:pt-36 pb-24 text-black">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] bg-[#dfe8d8] p-7 sm:p-10 lg:p-14 overflow-hidden relative">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-600">ALMA · Dog Friendly</p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.96]">Петербург<br />вместе с собакой 🐾</h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-neutral-700 leading-7">Места, куда можно прийти вместе с питомцем. Показываем рейтинг по единой 5-балльной шкале, актуальные условия для собак и фотографии конкретных заведений.</p>
        </div>

        <div className="mt-8 rounded-[28px] bg-white border border-black/5 p-5 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex-1 text-sm font-medium">Тип места
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full rounded-2xl bg-[#f3f1ed] px-4 py-3 outline-none">
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="flex-1 text-sm font-medium">Район
              <select value={district} onChange={(event) => setDistrict(event.target.value)} className="mt-2 w-full rounded-2xl bg-[#f3f1ed] px-4 py-3 outline-none">
                {districts.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-5 sm:gap-6">
          {filtered.map((place) => {
            const rating = normalizedRating(place.rating, place.ratingScale);
            const converted = Boolean(place.ratingScale && place.ratingScale !== 5);

            return (
              <article key={place.id} className="overflow-hidden rounded-[30px] bg-white border border-black/5 shadow-sm">
                <a href={place.imageSourceUrl || place.sourceUrl} target="_blank" rel="noreferrer" className="block h-52 sm:h-60 bg-[#ebe7df] relative overflow-hidden group">
                  <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                    <div>
                      <div className="text-5xl">🐾</div>
                      <p className="mt-3 font-semibold">Фото {place.name}</p>
                      <p className="mt-1 text-xs text-neutral-500">Открыть актуальные фотографии ↗</p>
                    </div>
                  </div>
                </a>

                <div className="p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">{place.category}</p>
                      <h2 className="mt-2 text-2xl sm:text-3xl font-bold">{place.name}</h2>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#dfe8d8] px-3 py-2 text-xs font-medium">🐾 Dog Friendly</span>
                  </div>

                  {rating !== null ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-black text-white px-3 py-2 text-sm font-semibold">★ {rating.toFixed(1)} / 5</span>
                      <span className="text-xs text-neutral-500">
                        {place.ratingSource || "Источник рейтинга"}
                        {place.ratingCount ? ` · ${place.ratingCount.toLocaleString("ru-RU")} оценок` : ""}
                        {converted ? " · пересчитано в шкалу ALMA" : ""}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#f3f1ed] px-3 py-2 text-sm font-medium text-neutral-600">Рейтинг не указан</span>
                      <span className="text-xs text-neutral-400">Добавим, когда найдём надёжный источник</span>
                    </div>
                  )}

                  <p className="mt-4 text-neutral-500">{place.address}</p>
                  <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-[#f3f1ed] px-3 py-1.5 text-xs">{place.budget}</span><span className="rounded-full bg-[#f3f1ed] px-3 py-1.5 text-xs">{place.district}</span></div>
                  <div className="mt-6 rounded-[22px] bg-[#f7f4ef] p-5"><p className="text-sm font-semibold">Размер собаки</p><p className="mt-1 text-neutral-600">{place.dogSize}</p><p className="mt-4 text-sm font-semibold">Условия</p><p className="mt-1 text-sm leading-6 text-neutral-600">{place.dogRules}</p></div>
                  <div className="mt-5 flex items-center justify-between gap-4 text-xs text-neutral-400"><span>Проверено {place.verifiedAt}</span><a href={place.sourceUrl} target="_blank" rel="noreferrer" className="text-black underline underline-offset-4">Источник ↗</a></div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-[28px] bg-black text-white p-6 sm:p-8">
          <p className="text-sm font-semibold">Важно про рейтинги и правила</p>
          <p className="mt-3 max-w-4xl text-sm sm:text-base leading-7 text-white/70">В ALMA все оценки показываем по единой 5-балльной шкале. Если исходный сервис использует другую шкалу, мы аккуратно пересчитываем её и отмечаем это рядом с источником. Если надёжной оценки нет, так и пишем — «Рейтинг не указан».</p>
        </div>
      </section>
    </main>
  );
}
