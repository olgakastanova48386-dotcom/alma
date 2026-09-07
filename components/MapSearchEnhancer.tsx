"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { places } from "@/data/places";

type Position = {
  top: number;
  left: number;
};

export default function MapSearchEnhancer() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (pathname !== "/map") return;

    let pill: HTMLElement | null = null;
    let frame = 0;

    const updatePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!pill || !pill.isConnected) {
          setPosition(null);
          return;
        }
        const rect = pill.getBoundingClientRect();
        const searchWidth = 260;
        const gap = 10;
        const left = Math.max(16, rect.left - searchWidth - gap);
        setPosition({ top: rect.top, left });
      });
    };

    const findPill = () => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>("div"));
      pill = elements.find((element) => {
        const text = element.textContent?.replace(/\s+/g, " ").trim() ?? "";
        return text.startsWith("Найдено:");
      }) ?? null;
      updatePosition();
    };

    findPill();
    const retry = window.setInterval(() => {
      if (!pill || !pill.isConnected) findPill();
    }, 350);
    const observer = new MutationObserver(() => {
      if (!pill || !pill.isConnected) findPill();
      else updatePosition();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(retry);
      observer.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [pathname]);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    return places.filter((place) =>
      [place.name, place.category, place.address].join(" ").toLowerCase().includes(value)
    ).slice(0, 7);
  }, [query]);

  if (pathname !== "/map" || !position) return null;

  return (
    <div className="fixed z-[12000] w-[260px] max-w-[calc(100vw-32px)]" style={{ top: position.top, left: position.left }}>
      <div className="flex items-center rounded-full bg-white border border-black/5 shadow-sm px-4 py-2.5">
        <span className="mr-2 text-neutral-400" aria-hidden="true">⌕</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти место…" aria-label="Поиск места на карте" className="min-w-0 flex-1 bg-transparent outline-none text-sm text-black placeholder:text-neutral-400" />
        {query && <button type="button" onClick={() => setQuery("")} className="ml-2 text-neutral-400 hover:text-black transition" aria-label="Очистить поиск">×</button>}
      </div>
      {query && <div className="absolute z-[12001] right-0 left-0 mt-2 overflow-hidden rounded-[20px] bg-white border border-black/5 shadow-xl">
        {results.length ? results.map((place) => <button type="button" key={place.id} onClick={() => { setQuery(""); router.push(`/map?place=${place.id}`); }} className="w-full text-left px-4 py-3 hover:bg-[#f7f4ef] transition border-b border-black/5 last:border-b-0"><span className="block font-medium text-sm text-black">{place.name}</span><span className="block mt-0.5 text-xs text-neutral-500 line-clamp-2">{place.category} · {place.address}</span></button>) : <div className="px-4 py-4 text-sm text-neutral-500">Ничего не найдено</div>}
      </div>}
    </div>
  );
}
