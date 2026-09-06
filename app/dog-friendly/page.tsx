"use client";

import { useMemo, useState } from "react";
import { dogFriendlyPlaces } from "@/data/dogFriendlyPlaces";

export default function DogFriendlyPage() {
  const [category, setCategory] = useState("Все места");
  const [district, setDistrict] = useState("Все районы");

  const categories = ["Все места", ...Array.from(new Set(dogFriendlyPlaces.map((place) => place.category)))];
  const districts = ["Все районы", ...Array.from(new Set(dogFriendlyPlaces.map((place) => place.district)))];

  const filtered = useMemo(
    () =>
      dogFriendlyPlaces.filter(
        (place) =>
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
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-neutral-700 leading-7">Места, куда можно прийти вместе с питомцем. ALMA показывает условия заведения отдельно и не превращает городское правило «40 см» в выдуманное ограничение кафе.</p>
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
          {filtered.map((place) => (
            <article key={place.id} className="rounded-[30px] bg-white border border-black/5 p-6 sm:p-7 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs uppercase tracking-[0.16em] text-neutral-400">{place.category}</p><h2 className="mt-2 text-2xl sm:text-3xl font-bold">{place.name}</h2></div>
                <span className="shrink-0 rounded-full bg-[#dfe8d8] px-3 py-2 text-xs font-medium">🐾 Dog Friendly</span>
              </div>
              <p className="mt-4 text-neutral-500">{place.address}</p>
              <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-[#f3f1ed] px-3 py-1.5 text-xs">{place.budget}</span><span className="rounded-full bg-[#f3f1ed] px-3 py-1.5 text-xs">{place.district}</span></div>
              <div className="mt-6 rounded-[22px] bg-[#f7f4ef] p-5"><p className="text-sm font-semibold">Размер собаки</p><p className="mt-1 text-neutral-600">{place.dogSize}</p><p className="mt-4 text-sm font-semibold">Условия</p><p className="mt-1 text-sm leading-6 text-neutral-600">{place.dogRules}</p></div>
              <div className="mt-5 flex items-center justify-between gap-4 text-xs text-neutral-400"><span>Проверено {place.verifiedAt}</span><a href={place.sourceUrl} target="_blank" rel="noreferrer" className="text-black underline underline-offset-4">Источник ↗</a></div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[28px] bg-black text-white p-6 sm:p-8">
          <p className="text-sm font-semibold">Почему ALMA не ставит всем собакам «до 40 см»?</p>
          <p className="mt-3 max-w-4xl text-sm sm:text-base leading-7 text-white/70">40 см — порог из городских правил содержания собак в общественных местах. Это не универсальное правило входа в кафе. Если конкретное заведение публикует собственное ограничение по росту или размеру, ALMA покажет именно его.</p>
        </div>
      </section>
    </main>
  );
}
