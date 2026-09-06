"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { places } from "@/data/places";

export default function MapSearchEnhancer() {
  const pathname = usePathname();
  const router = useRouter();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (pathname !== "/map") {
      setTarget(null);
      return;
    }

    let wrapper: HTMLDivElement | null = null;
    let foundPill: HTMLElement | null = null;
    let originalParent: HTMLElement | null = null;

    const mount = () => {
      const candidates = Array.from(document.querySelectorAll("div"));
      const pill = candidates.find((element) => {
        const text = element.textContent?.replace(/\s+/g, " ").trim() ?? "";
        return text.startsWith("Найдено:") && element.className.toString().includes("rounded-full");
      }) as HTMLElement | undefined;

      if (!pill || pill.dataset.almaSearchMounted === "true") return;

      originalParent = pill.parentElement;
      if (!originalParent) return;

      wrapper = document.createElement("div");
      wrapper.className = "relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-start lg:self-auto";
      wrapper.dataset.almaSearchWrapper = "true";

      originalParent.insertBefore(wrapper, pill);
      wrapper.appendChild(pill);
      pill.dataset.almaSearchMounted = "true";
      foundPill = pill;
      setTarget(wrapper);
    };

    mount();

    const observer = new MutationObserver(mount);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      setTarget(null);

      if (foundPill) {
        delete foundPill.dataset.almaSearchMounted;
      }

      if (wrapper && originalParent && foundPill && wrapper.parentElement === originalParent) {
        originalParent.insertBefore(foundPill, wrapper);
        wrapper.remove();
      }
    };
  }, [pathname]);

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

  if (!target) return null;

  return createPortal(
    <>
      <div className="relative order-first sm:order-none min-w-[230px]">
        <div className="flex items-center rounded-full bg-white border border-black/5 shadow-sm px-4 py-2.5">
          <span className="text-neutral-400 mr-2" aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти место…"
            aria-label="Поиск места на карте"
            className="w-full bg-transparent outline-none text-sm text-black placeholder:text-neutral-400"
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
          <div className="absolute z-[10000] right-0 left-0 mt-2 overflow-hidden rounded-[20px] bg-white border border-black/5 shadow-xl">
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
                  <span className="block font-medium text-sm text-black">{place.name}</span>
                  <span className="block mt-0.5 text-xs text-neutral-500">{place.category} · {place.address}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-4 text-sm text-neutral-500">Ничего не найдено</div>
            )}
          </div>
        )}
      </div>
    </>,
    target
  );
}
