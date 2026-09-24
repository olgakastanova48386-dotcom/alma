"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { dogFriendlyPlaces } from "@/data/dogFriendlyPlaces";
import { mapPlaces } from "@/data/mapPlaces";
import AlmaSelect from "@/components/AlmaSelect";

export default function DogFriendlyPage() {
  const [category, setCategory] = useState("Все места");
  const [district, setDistrict] = useState("Все районы");
  const categories = [
    "Все места",
    ...Array.from(new Set(dogFriendlyPlaces.map((place) => place.category))),
  ];
  const districts = [
    "Все районы",
    ...Array.from(new Set(dogFriendlyPlaces.map((place) => place.district))),
  ];
  const filtered = useMemo(
    () =>
      dogFriendlyPlaces.filter(
        (place) =>
          (category === "Все места" || place.category === category) &&
          (district === "Все районы" || place.district === district),
      ),
    [category, district],
  );
  const mapIdFor = (name: string) =>
    mapPlaces.find((item) => item.name.toLowerCase() === name.toLowerCase())
      ?.id;

  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-[calc(env(safe-area-inset-top)+68px)] sm:pt-[104px] pb-10 sm:pb-24 text-black">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="alma-satin relative overflow-hidden rounded-[22px] sm:overflow-visible sm:rounded-[28px] bg-[#dfe8d8] px-4 py-3 min-h-[118px] sm:px-8 sm:py-5 sm:pr-[220px] sm:min-h-[170px] md:min-h-[185px] md:pr-[310px] lg:min-h-[190px] lg:px-9 lg:py-6 lg:pr-[390px]">
          <div className="relative z-10 flex min-h-[94px] items-start pt-2 sm:min-h-[130px] md:min-h-[145px] lg:min-h-[142px] lg:max-w-[68%]">
            <h1 className="mt-0 max-w-full text-[clamp(18px,5.7vw,23px)] sm:text-[28px] md:text-[34px] lg:text-[48px] font-bold tracking-tight leading-[1.08]">
              <span className="block whitespace-nowrap">Петербург вместе</span>
              <span className="block">с собакой</span>
            </h1>
            <div className="hidden sm:flex mt-4 items-center gap-3 text-[#56614f]">
              <span className="h-px w-10 bg-[#78856f]/55" />
              <span className="text-[12px] font-medium tracking-[0.08em] uppercase whitespace-nowrap">Выбор Джека</span>
              <span className="h-px w-10 bg-[#78856f]/55" />
            </div>
          </div>
          
          <img
            src="/images/alma-dog.webp"
            alt="Пёс ALMA"
            className="pointer-events-none absolute bottom-0 right-0 z-20 block h-[118px] w-[39%] max-h-none object-contain object-bottom drop-shadow-[0_10px_16px_rgba(0,0,0,0.14)] sm:bottom-[-18px] sm:right-[-8px] sm:w-[240px] sm:max-h-none md:bottom-[-20px] md:right-[4px] md:w-[360px] md:max-h-none lg:bottom-[-42px] lg:right-[18px] lg:w-[430px] lg:max-h-none"
          />
        </div>
        <div className="relative z-30 mx-auto mt-2 w-full rounded-[16px] sm:rounded-[20px] bg-transparent sm:bg-white border-0 sm:border sm:border-black/5 p-0 sm:p-2 sm:mt-5 sm:w-[94%] sm:rounded-[22px] sm:p-5">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <AlmaSelect
              compact
              label="Тип места"
              value={category}
              options={categories}
              onChange={setCategory}
            />
            <AlmaSelect
              compact
              label="Район"
              value={district}
              options={districts}
              onChange={setDistrict}
            />
          </div>
        </div>
        <div className="mt-3 sm:mt-8 grid md:grid-cols-2 gap-3 sm:gap-5 sm:gap-6">
          {filtered.map((place) => {
            const mapId = mapIdFor(place.name);
            return (
              <article
                key={place.id}
                className="alma-paper relative overflow-hidden rounded-[20px] sm:rounded-[30px] bg-white border border-black/5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {mapId && (
                  <Link
                    href={`/place/${mapId}`}
                    aria-label={`Открыть карточку ${place.name}`}
                    className="absolute inset-0 z-10 rounded-[20px] sm:rounded-[30px]"
                  >
                    <span className="sr-only">
                      Открыть карточку {place.name}
                    </span>
                  </Link>
                )}
                {place.imageUrl ? (
                  <div className="h-24 sm:h-48 overflow-hidden bg-[#ebe7df]">
                    <img
                      src={place.imageUrl}
                      alt={`${place.name} — место, куда можно с собакой`}
                      className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="h-24 sm:h-48 bg-[#ebe7df] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl">🐾</div>
                      <p className="mt-1 text-xs font-medium text-neutral-500">
                        Dog Friendly · ALMA
                      </p>
                    </div>
                  </div>
                )}
                <div className="p-3 sm:p-7">
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                        {place.category}
                      </p>
                      <h2 className="mt-1 break-words text-left text-[19px] leading-tight sm:mt-2 sm:text-3xl font-bold">
                        {place.name}
                      </h2>
                    </div>
                    <span className="hidden sm:inline-flex shrink-0 rounded-full bg-[#dfe8d8] px-2 py-1 text-[10px] sm:px-3 sm:py-2 sm:text-xs font-medium">
                      🐾 Dog Friendly
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="rounded-full bg-black text-white px-2.5 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm font-semibold">
                      ★ {place.rating.toFixed(1)} / 5
                    </span>
                    <span className="text-xs text-neutral-500">
                      {place.ratingSource}
                      {place.ratingCount
                        ? ` · ${place.ratingCount.toLocaleString("ru-RU")} оценок`
                        : ""}
                    </span>
                  </div>
                  <p className="mt-2 sm:mt-4 text-[13px] leading-5 sm:text-base text-neutral-600">{place.address}</p>
                  <div className="mt-2 sm:mt-5 flex flex-wrap gap-1.5 sm:gap-2">
                    <span className="rounded-full bg-[#f3f1ed] px-3 py-1.5 text-xs">
                      {place.budget}
                    </span>
                    <span className="rounded-full bg-[#f3f1ed] px-3 py-1.5 text-xs">
                      {place.district}
                    </span>
                  </div>
                  <div className="relative z-20 mt-2.5 rounded-[14px] bg-[#f7f4ef] px-3 py-2.5 sm:mt-6 sm:rounded-[22px] sm:p-5">
                    <p className="text-[13px] leading-5 text-neutral-700 sm:text-sm"><strong className="text-black">Размер собаки:</strong> {place.dogSize}</p>
                    <details className="mt-1.5 text-[13px] sm:text-sm">
                      <summary className="cursor-pointer font-semibold text-black">Условия посещения</summary>
                      <p className="mt-2 leading-5 text-neutral-600">{place.dogRules}</p>
                    </details>
                  </div>
                  <div className="mt-3 sm:mt-5 flex items-center justify-between gap-3 sm:gap-4">
                    <span className="text-xs text-neutral-400">
                      Проверено ALMA: {place.verifiedAt}
                    </span>
                    {mapId && (
                      <Link
                        href={`/?place=${mapId}#alma-filters`}
                        title="На карте"
                        aria-label={`${place.name} на карте ALMA`}
                        className="relative z-20 shrink-0 inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black text-white transition hover:scale-105"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="23"
                          height="23"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-4 sm:mt-10 rounded-[20px] sm:rounded-[28px] bg-black text-white p-4 sm:p-8">
          <p className="text-sm font-semibold">Правило ALMA</p>
          <p className="mt-3 max-w-4xl text-sm sm:text-base leading-7 text-white/70">
            Публикуем заведения только с подтверждённой оценкой от 4,5 до 5,0 по
            пятибалльной шкале.
          </p>
        </div>
      </section>
    </main>
  );
}
