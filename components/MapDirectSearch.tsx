"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { places } from "@/data/places";

export default function MapDirectSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];

    return places
      .filter((place) =>
        [place.name, place.category, place.address]
          .join(" ")
          .toLowerCase()
          .includes(value)
      )
      .slice(0, 7);
  }, [query]);

  return (
    <div className="absolute z-[1200] top-[205px] right-[145px] hidden lg:block">
      <div className="relative w-[270px]">
        <div className="flex items-center rounded-full bg-white border border-black/5 shadow-sm px-4 py-2.5">
          <span className="mr-2 text-neutral-400" aria-hidden="true">
            ⌕
          </span>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти место…"
            aria-label="Поиск места на карте"
            className="min-w-0 flex-1 bg-transparent outline-none text-sm text-black placeholder:text-neutral-400"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="ml-2 text-neutral-400 hover:text-black transition"
              aria-label="Очистить поиск"
            >
              ×
            </button>
          )}
        </div>

        {query && (
          <div className="absolute z-[1300] right-0 left-0 mt-2 overflow-hidden rounded-[20px] bg-white border border-black/5 shadow-xl">
            {results.length ? (
              results.map((place) => (
                <button
                  type="button"
                  key={place.id}
                  onClick={() => {
                    setQuery("");
                    router.push(`/map?place=${place.id}`);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-[#f7f4ef] transition border-b border-black/5 last:border-b-0"
                >
                  <span className="block font-medium text-sm text-black">
                    {place.name}
                  </span>
                  <span className="block mt-0.5 text-xs text-neutral-500 line-clamp-2">
                    {place.category} · {place.address}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-4 text-sm text-neutral-500">
                Ничего не найдено
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
