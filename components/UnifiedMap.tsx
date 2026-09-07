"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { mapPlaces, type MapPlace } from "@/data/mapPlaces";

declare global {
  interface Window {
    L: any;
  }
}

function categoryEmoji(place: MapPlace) {
  if (place.dogFriendly) return "🐾";
  if (place.category === "Кофейня") return "☕";
  if (place.category === "Ресторан") return "🍴";
  return "✦";
}

export default function UnifiedMap() {
  const searchParams = useSearchParams();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ id: number; marker: any }[]>([]);

  const [leafletReady, setLeafletReady] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const [category, setCategory] = useState("Все");

  const mood = searchParams.get("mood");
  const budget = searchParams.get("budget");
  const company = searchParams.get("company");
  const duration = searchParams.get("duration");
  const placeId = searchParams.get("place");

  const categories = ["Все", "Кофейня", "Ресторан", "Dog Friendly", "Другие места"];

  const filteredPlaces = useMemo(() => {
    return mapPlaces.filter((place) => {
      const categoryMatches =
        category === "Все" ||
        (category === "Dog Friendly" && place.dogFriendly) ||
        (category === "Другие места" && place.category !== "Кофейня" && place.category !== "Ресторан") ||
        place.category === category;

      const moodMatches = !mood || place.mood === mood;
      const budgetMatches = !budget || place.budget === budget;
      const companyMatches = !company || place.company.includes(company);
      const durationMatches = !duration || place.duration === duration;

      return categoryMatches && moodMatches && budgetMatches && companyMatches && durationMatches;
    });
  }, [category, mood, budget, company, duration]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!document.querySelector('link[data-leaflet-css="true"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.setAttribute("data-leaflet-css", "true");
      document.head.appendChild(link);
    }

    if (window.L) {
      setLeafletReady(true);
      return;
    }

    const existingScript = document.querySelector('script[data-leaflet-js="true"]') as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", () => setLeafletReady(true));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.setAttribute("data-leaflet-js", "true");
    script.onload = () => setLeafletReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || mapRef.current) return;

    mapRef.current = window.L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView([59.9386, 30.3141], 11);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);

    window.L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);
    setTimeout(() => mapRef.current?.invalidateSize(), 100);
  }, [leafletReady]);

  useEffect(() => {
    if (!leafletReady || !mapRef.current) return;

    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    filteredPlaces.forEach((place) => {
      const icon = window.L.divIcon({
        className: "alma-marker-wrapper",
        html: `<div class="alma-marker"><span>${categoryEmoji(place)}</span></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      });

      const marker = window.L.marker([place.lat, place.lng], { icon }).addTo(mapRef.current);
      const rating = place.rating
        ? `<div class="alma-popup-rating">★ ${place.rating.toFixed(1)} / ${place.ratingScale ?? 5}${place.ratingSource ? ` · ${place.ratingSource}` : ""}</div>`
        : "";
      const dog = place.dogFriendly ? `<span class="alma-popup-dog">🐾 Dog Friendly</span>` : "";

      marker.bindPopup(
        `<div class="alma-popup">
          <div class="alma-popup-category">${place.category}</div>
          <div class="alma-popup-title">${place.name}</div>
          ${rating}
          <div class="alma-popup-why">${place.why}</div>
          <div class="alma-popup-address">${place.address}</div>
          <div class="alma-popup-price"><span>${place.priceNote}</span><strong>${place.price}</strong></div>
          ${dog}
          <a href="${place.detailHref}" class="alma-popup-button">Подробнее →</a>
        </div>`,
        { maxWidth: 330, minWidth: 290, className: "alma-leaflet-popup" }
      );

      marker.on("click", () => setSelectedPlace(place.id));
      markersRef.current.push({ id: place.id, marker });
    });
  }, [filteredPlaces, leafletReady]);

  const focusPlace = (place: MapPlace) => {
    setSelectedPlace(place.id);
    if (!mapRef.current) return;
    mapRef.current.flyTo([place.lat, place.lng], 15, { duration: 1.05 });
    const item = markersRef.current.find((marker) => marker.id === place.id);
    if (item) setTimeout(() => item.marker.openPopup(), 450);
  };

  useEffect(() => {
    if (!placeId || !leafletReady || !mapRef.current || markersRef.current.length === 0) return;
    const id = Number(placeId);
    if (!Number.isFinite(id)) return;
    const place = mapPlaces.find((item) => item.id === id);
    if (!place) return;

    const visible = filteredPlaces.some((item) => item.id === place.id);
    if (!visible) setCategory("Все");
    setTimeout(() => focusPlace(place), 100);
  }, [placeId, leafletReady, filteredPlaces]);

  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-28 sm:pt-32 pb-10 text-black">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">ALMA · Санкт-Петербург</p>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">Карта мест</h1>
          <p className="mt-3 text-neutral-500 text-base sm:text-lg max-w-3xl">
            Здесь собраны места ALMA, кофейни, рестораны и Dog Friendly-точки. Новые заведения автоматически можно подключать к этой карте через общую базу.
          </p>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2.5 text-sm transition ${category === item ? "bg-black text-white" : "bg-white border border-black/5 hover:bg-[#f0ede8]"}`}
            >
              {item}
            </button>
          ))}
        </div>

        <section className="grid lg:grid-cols-[390px_minmax(0,1fr)] gap-5 lg:gap-6 items-stretch">
          <div className="order-2 lg:order-1 bg-white rounded-[28px] border border-black/5 shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 pt-6 pb-4 border-b border-black/5">
              <p className="font-semibold text-lg">Места на карте</p>
              <p className="mt-1 text-sm text-neutral-500">Нажми на карточку, чтобы приблизить точку.</p>
            </div>

            <div className="max-h-[700px] overflow-y-auto p-3">
              {filteredPlaces.map((place) => {
                const active = selectedPlace === place.id;
                return (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => focusPlace(place)}
                    className={`w-full text-left rounded-[22px] p-3 mb-2 transition ${active ? "bg-black text-white" : "hover:bg-[#f5f2ed]"}`}
                  >
                    <div className="flex gap-3">
                      <div className="w-[94px] h-[92px] rounded-[17px] overflow-hidden shrink-0 bg-[#ece8e2] flex items-center justify-center">
                        {place.image ? (
                          <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl" aria-hidden="true">{categoryEmoji(place)}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 py-0.5">
                        <p className={`text-[11px] uppercase tracking-[0.13em] ${active ? "text-white/50" : "text-neutral-400"}`}>{place.category}</p>
                        <h2 className="mt-1 text-base font-semibold leading-5">{place.name}</h2>
                        {place.rating && (
                          <p className={`mt-1 text-xs ${active ? "text-white/70" : "text-neutral-500"}`}>
                            ★ {place.rating.toFixed(1)} / {place.ratingScale ?? 5}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {place.dogFriendly && <span className={`rounded-full px-2.5 py-1 text-xs ${active ? "bg-white/10" : "bg-[#dfe8d8]"}`}>🐾</span>}
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${active ? "bg-white text-black" : "bg-black text-white"}`}>{place.price}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="alma-map relative min-h-[560px] lg:min-h-[760px] rounded-[28px] overflow-hidden bg-[#ebe8e3] border border-black/5 shadow-sm">
              <div ref={mapContainerRef} className="absolute inset-0 z-0" />
              {!leafletReady && (
                <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#ebe8e3]">
                  <div className="text-center">
                    <div className="mx-auto w-10 h-10 rounded-full border-2 border-black/15 border-t-black animate-spin" />
                    <p className="mt-4 text-sm text-neutral-500">Загружаем карту…</p>
                  </div>
                </div>
              )}
              <div className="absolute z-[500] left-4 bottom-4 rounded-full bg-black text-white px-4 py-2 text-sm font-semibold tracking-[0.12em] shadow-lg pointer-events-none">alma</div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .alma-map .leaflet-tile-pane { filter: grayscale(.82) sepia(.1) saturate(.42) brightness(1.08) contrast(.87); }
        .alma-map .leaflet-control-container { position: relative; z-index: 500; }
        .alma-map .leaflet-control-zoom { border: none !important; border-radius: 15px !important; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,.1) !important; }
        .alma-map .leaflet-control-zoom a { width: 38px !important; height: 38px !important; line-height: 38px !important; border: none !important; background: rgba(255,255,255,.95) !important; color: #111 !important; }
        .alma-marker-wrapper { background: transparent; border: none; }
        .alma-marker { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 999px; background: rgba(255,255,255,.96); box-shadow: 0 6px 18px rgba(0,0,0,.2); font-size: 18px; }
        .alma-leaflet-popup .leaflet-popup-content-wrapper { padding: 0 !important; border-radius: 24px !important; overflow: hidden; background: white !important; box-shadow: 0 20px 60px rgba(0,0,0,.22) !important; }
        .alma-leaflet-popup .leaflet-popup-content { margin: 0 !important; width: 310px !important; }
        .alma-popup { padding: 21px; color: #111; }
        .alma-popup-category { font-size: 10px; text-transform: uppercase; letter-spacing: .14em; color: #999; }
        .alma-popup-title { margin-top: 6px; font-size: 23px; line-height: 1.12; font-weight: 700; }
        .alma-popup-rating { margin-top: 8px; font-size: 12px; font-weight: 600; }
        .alma-popup-why, .alma-popup-address { margin-top: 9px; color: #666; font-size: 12px; line-height: 1.5; }
        .alma-popup-price { margin-top: 15px; padding: 12px 13px; border-radius: 15px; background: #f3f1ed; display: flex; justify-content: space-between; gap: 12px; font-size: 11px; }
        .alma-popup-price strong { font-size: 14px; }
        .alma-popup-dog { display: inline-flex; margin-top: 12px; padding: 7px 10px; border-radius: 999px; background: #dfe8d8; font-size: 11px; }
        .alma-popup-button { display: flex; justify-content: center; margin-top: 14px; min-height: 43px; align-items: center; border-radius: 999px; background: #111; color: white !important; text-decoration: none !important; font-size: 13px; font-weight: 600; }
        .alma-leaflet-popup .leaflet-popup-tip { box-shadow: none !important; }
        @media (max-width: 640px) { .alma-leaflet-popup .leaflet-popup-content { width: 275px !important; } }
      `}</style>
    </main>
  );
}
