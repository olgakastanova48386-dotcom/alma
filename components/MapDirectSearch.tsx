"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { mapPlaces } from "@/data/mapPlaces";

export default function MapDirectSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];

    return mapPlaces
      .filter((place) =>
        [place.name, place.category, place.address]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(value)
      )
      .slice(0, 8);
  }, [query]);

  return (
    <div className="relative w-full">
      <div className="flex items-center rounded-2xl bg-white border border-black/5 shadow-sm px-4 py-3.5">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="mr-3 shrink-0 text-neutral-400"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Кофейня, ресторан или адрес…"
          aria-label="Поиск места на карте ALMA"
          className="min-w-0 flex-1 bg-transparent outline-none text-sm text-black placeholder:text-neutral-400"
        />
        {query && <button type="button" onClick={() => setQuery("")} className="ml-2 text-neutral-400 hover:text-black transition" aria-label="Очистить поиск">×</button>}
      </div>

      {query && (
        <div className="absolute z-[1300] right-0 left-0 mt-2 overflow-hidden rounded-[20px] bg-white border border-black/5 shadow-xl">
          {results.length ? results.map((place) => (
            <button type="button" key={place.id} onClick={() => { setQuery(""); router.push(`/map?place=${place.id}`); }} className="w-full text-left px-4 py-3 hover:bg-[#f7f4ef] transition border-b border-black/5 last:border-b-0">
              <span className="flex items-center justify-between gap-3"><span className="font-medium text-sm text-black">{place.name}</span>{place.rating && <span className="shrink-0 text-sm font-semibold text-black">★ {place.rating.toFixed(1)}</span>}</span>
              <span className="block mt-1 text-xs text-neutral-500 line-clamp-2">{place.category} · {place.address}</span>
            </button>
          )) : <div className="px-4 py-4 text-sm text-neutral-500">Ничего не найдено</div>}
        </div>
      )}
    </div>
  );
}
