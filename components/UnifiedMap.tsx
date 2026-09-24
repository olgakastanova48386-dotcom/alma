"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mapPlaces, type MapPlace } from "@/data/mapPlaces";
import MapDirectSearch from "@/components/MapDirectSearch";

declare global { interface Window { L: any; almaRouteTo?: (id: number) => void; almaOpenPlace?: (id: number) => void; } }

function emoji(place: MapPlace) {
  if (place.safePlace) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 19 5.4v5.4c0 4.8-2.9 8.8-7 10.7-4.1-1.9-7-5.9-7-10.7V5.4L12 2.5Z"/><circle cx="12" cy="10.2" r="2.1"/><path d="M11.2 11.8h1.6l.7 4h-3l.7-4Z"/></svg>`;
  if (place.studentDiscount) return "🎓";
  if (place.driveTags?.includes("Активный отдых")) return "🏎️";
  if (place.drive) return "⚡";
  if (place.babyCare) return "👶";
  if (place.dogFriendly) return "🐾";
  if (place.category === "Кофейня") return "☕";
  if (place.category === "Ресторан") return "🍴";
  return "✦";
}

function maxPrice(place: MapPlace) {
  const value = `${place.budget} ${place.price}`.toLowerCase();
  if (value.includes("бесплат")) return 0;
  const numbers = value.match(/\d[\d\s]*/g)?.map((item) => Number(item.replace(/\s/g, ""))).filter(Number.isFinite) ?? [];
  return numbers.length ? Math.max(...numbers) : null;
}

function matchesBudget(place: MapPlace, value: string) {
  if (value === "Бюджет") return true;
  const price = maxPrice(place);
  if (value === "Бесплатно") return price === 0;
  if (price === null) return false;
  if (value === "От 1000 до 2500 ₽") return price >= 1000 && price <= 2500;
  if (value === "От 3000 до 5000 ₽") return price >= 3000 && price <= 5000;
  if (value === "От 5000 ₽") return price >= 5000;
  return true;
}

function matchesAverageCheck(place: MapPlace, value: string) {
  if (value === "Любой чек") return true;
  const price = maxPrice(place);
  if (price === null) return false;
  if (value === "До 700 ₽") return price <= 700;
  if (value === "700–1500 ₽") return price > 700 && price <= 1500;
  if (value === "1500–3000 ₽") return price > 1500 && price <= 3000;
  return price > 3000;
}

export default function UnifiedMap() {
  const router = useRouter();
  const params = useSearchParams();
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<any>(null);
  const markers = useRef<{ id: number; marker: any }[]>([]);
  const routeLayer = useRef<any>(null);
  const userMarker = useRef<any>(null);

  const initialCategory = params.get("category") === "drive" ? "⚡ Драйв" : params.get("category") === "baby" ? "👶 Для малыша" : "Все";
  const [ready, setReady] = useState(false);
  const [mapZoom, setMapZoom] = useState(11);
  const [selected, setSelected] = useState<number | null>(null);
  const selectedRef = useRef<number | null>(null);
  const [category, setCategory] = useState(initialCategory);
  const [driveTag, setDriveTag] = useState("Все");
  const [routeStatus, setRouteStatus] = useState("");
  const [mood, setMood] = useState("Настроение");
  const [budget, setBudget] = useState("Бюджет");
  const [company, setCompany] = useState("Компания");
  const [duration, setDuration] = useState("Длительность");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [studentOnly, setStudentOnly] = useState(false);
  const [safeOnly, setSafeOnly] = useState(false);
  const [isFemale, setIsFemale] = useState(false);
  const [moreCategoriesOpen, setMoreCategoriesOpen] = useState(false);

  const categories = ["Все", "Кофейня", "Ресторан", "Dog Friendly", "👶 Для малыша", "⚡ Драйв", "Другие места"];
  const driveTags = ["Все", "Активный отдых", "Матчи", "Живая музыка", "Рок", "С друзьями"];
  const moods = ["Настроение", "Весёлое", "Грустное", "Нейтральное", "Энергичное"];
  const budgets = ["Бюджет", "Бесплатно", "От 1000 до 2500 ₽", "От 3000 до 5000 ₽", "От 5000 ₽"];
  const companies = ["Компания", "С собакой", ...Array.from(new Set(mapPlaces.flatMap((place) => place.company))).filter((value) => value !== "С собакой").sort()].map((value) => value === "Друзья" ? "Друзьями" : value);
  const durations = ["Длительность", "До 1 часа", "1–2 часа", "2–4 часа", "Полдня"];
  const placeId = params.get("place");

  const filtered = useMemo(() => mapPlaces.filter((p) => {
    if (p.safePlace && !isFemale) return false;
    const cat = category === "Все" ||
      (category === "🎓 Скидка студенту" && Boolean(p.studentDiscount)) ||
      (category === "🛡 Безопасное место" && Boolean(p.safePlace)) ||
      (category === "Dog Friendly" && p.dogFriendly) ||
      (category === "👶 Для малыша" && Boolean(p.babyCare)) ||
      (category === "⚡ Драйв" && p.drive) ||
      (category === "Другие места" && !p.drive && !p.babyCare && p.category !== "Кофейня" && p.category !== "Ресторан") ||
      p.category === category;
    const tag = category !== "⚡ Драйв" || driveTag === "Все" || p.driveTags?.includes(driveTag);
    return cat && tag &&
      (mood === "Настроение" || p.mood === mood) &&
      matchesBudget(p, budget) &&
      (company === "Компания" || (company === "С собакой" ? Boolean(p.dogFriendly) : company === "Друзьями" ? p.company.includes("Друзья") : p.company.includes(company))) &&
      (duration === "Длительность" ||
        (duration === "До 1 часа" && /до 1|30|45|60|1 час/i.test(p.duration)) ||
        (duration === "1–2 часа" && /1.?2|1–2|1-2|1 час|2 час/i.test(p.duration)) ||
        (duration === "2–4 часа" && /2.?4|2–4|2-4|3 час|4 час/i.test(p.duration)) ||
        (duration === "Полдня" && /полдня|полдня|5 час|6 час/i.test(p.duration))) &&
      (!studentOnly || Boolean(p.studentDiscount)) &&
      (!safeOnly || Boolean(p.safePlace)) &&
      (!params.get("mood") || p.mood === params.get("mood")) &&
      (!params.get("budget") || p.budget === params.get("budget")) &&
      (!params.get("company") || p.company.includes(params.get("company")!)) &&
      (!params.get("duration") || p.duration === params.get("duration"));
  }), [budget, category, company, driveTag, duration, isFemale, mood, params, safeOnly, studentOnly]);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    let cancelled = false;
    const loadAccount = async () => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
          if (!response.ok) throw new Error("account unavailable");
          const data = await response.json();
          if (!cancelled) setIsFemale(data?.user?.gender === "female");
          return;
        } catch {
          if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
        }
      }
    };
    void loadAccount();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!document.querySelector('link[data-leaflet-css="true"]')) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      l.dataset.leafletCss = "true";
      l.onerror = () => { l.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"; };
      document.head.appendChild(l);
    }
    if (window.L) {
      queueMicrotask(() => setReady(true));
      return;
    }
    const old = document.querySelector('script[data-leaflet-js="true"]') as HTMLScriptElement | null;
    if (old) {
      old.addEventListener("load", () => setReady(true));
      return;
    }
    const s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.async = true;
    s.dataset.leafletJs = "true";
    s.onload = () => setReady(true);
    s.onerror = () => {
      s.remove();
      const fallback = document.createElement("script");
      fallback.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
      fallback.async = true;
      fallback.dataset.leafletJs = "true";
      fallback.onload = () => setReady(true);
      document.body.appendChild(fallback);
    };
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    if (!ready || !container.current || map.current) return;
    map.current = window.L.map(container.current, { zoomControl: false }).setView([59.9386, 30.3141], 11);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map.current);
    window.L.control.zoom({ position: "bottomright" }).addTo(map.current);
    const onZoom = () => setMapZoom(map.current?.getZoom() ?? 11);
    map.current.on("zoomend", onZoom);
    return () => map.current?.off("zoomend", onZoom);
  }, [ready]);

  const buildRoute = async (place: MapPlace) => {
    if (!navigator.geolocation || !map.current) {
      setRouteStatus("Не удалось определить ваше местоположение");
      return;
    }
    setSelected(place.id);
    setRouteStatus("Определяем ваше местоположение…");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        setRouteStatus("Строим маршрут…");
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords.longitude},${coords.latitude};${place.lng},${place.lat}?overview=full&geometries=geojson&steps=true`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const route = data.routes?.[0];
        if (!route) throw new Error();
        routeLayer.current?.remove();
        userMarker.current?.remove();
        userMarker.current = window.L.circleMarker([coords.latitude, coords.longitude], { radius: 8, weight: 3, color: "#111", fillColor: "#fff", fillOpacity: 1 }).addTo(map.current).bindTooltip("Вы здесь");
        routeLayer.current = window.L.geoJSON(route.geometry, { style: { color: "#111", weight: 5, opacity: .9 } }).addTo(map.current);
        map.current.fitBounds(routeLayer.current.getBounds(), { padding: [45, 45] });
        setRouteStatus(`${(route.distance / 1000).toFixed(1).replace(".", ",")} км · примерно ${Math.max(1, Math.round(route.duration / 60))} мин`);
      } catch {
        setRouteStatus("Маршрут сейчас не удалось построить. Попробуйте ещё раз.");
      }
    }, () => setRouteStatus("Разрешите ALMA доступ к геопозиции, чтобы построить маршрут."), { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  };

  useEffect(() => {
    window.almaRouteTo = (id: number) => {
      const p = mapPlaces.find((x) => x.id === id);
      if (p) buildRoute(p);
    };
    window.almaOpenPlace = (id: number) => {
      const p = mapPlaces.find((x) => x.id === id);
      if (p) router.push(p.detailHref);
    };
    return () => {
      delete window.almaRouteTo;
      delete window.almaOpenPlace;
    };
  });

  useEffect(() => {
    if (!ready || !map.current) return;
    const currentMap = map.current;
    const center = currentMap.getCenter();
    const zoom = currentMap.getZoom();
    markers.current.forEach((m) => m.marker.remove());
    markers.current = [];
    // Group nearby places at the current zoom so each marker remains usable.
    const groups = new Map<string, MapPlace[]>();
    const cell = mapZoom >= 15 ? 0 : mapZoom >= 13 ? 42 : 56;
    filtered.forEach((p) => {
      const projected = currentMap.project([p.lat, p.lng], mapZoom);
      const key = cell ? `${Math.floor(projected.x / cell)}:${Math.floor(projected.y / cell)}` : String(p.id);
      const group = groups.get(key) ?? [];
      group.push(p);
      groups.set(key, group);
    });
    groups.forEach((group) => {
      if (group.length > 1) {
        const lat = group.reduce((sum, p) => sum + p.lat, 0) / group.length;
        const lng = group.reduce((sum, p) => sum + p.lng, 0) / group.length;
        const icon = window.L.divIcon({ className: "alma-marker-wrapper", html: `<div class="alma-cluster" aria-label="${group.length} мест">${group.length}</div>`, iconSize: [44, 44], iconAnchor: [22, 22] });
        const marker = window.L.marker([lat, lng], { icon }).addTo(currentMap);
        marker.on("click", () => {
          const bounds = window.L.latLngBounds(group.map((p) => [p.lat, p.lng]));
          currentMap.fitBounds(bounds, { padding: [50, 50], maxZoom: Math.min(mapZoom + 2, 15) });
        });
        markers.current.push({ id: -group[0].id, marker });
        return;
      }
      const p = group[0];
      const icon = window.L.divIcon({ className: "alma-marker-wrapper", html: `<div class="alma-marker">${emoji(p)}</div>${p.safePlace ? `<div class="alma-safe-badge">Безопасное место</div>` : ""}${p.studentDiscount ? `<div class="alma-student-badge">−${p.studentDiscount}%</div>` : ""}`, iconSize: [40, 40], iconAnchor: [20, 20] });
      const marker = window.L.marker([p.lat, p.lng], { icon }).addTo(map.current);
      marker.bindPopup(`<div class="alma-popup"><div class="alma-popup-category">${p.category}</div><button class="alma-popup-title alma-popup-open" onclick="window.almaOpenPlace(${p.id})">${p.name}</button>${p.rating ? `<div class="alma-popup-rating">★ ${p.rating.toFixed(1)} / 5 · ${p.ratingSource ?? ""}</div>` : ""}<div class="alma-popup-address">${p.address}</div>${p.safePlace ? `<div class="alma-popup-safe"><span class="alma-safe-inline"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 19 5.4v5.4c0 4.8-2.9 8.8-7 10.7-4.1-1.9-7-5.9-7-10.7V5.4L12 2.5Z"/><circle cx="12" cy="10.2" r="2.1"/><path d="M11.2 11.8h1.6l.7 4h-3l.7-4Z"/></svg></span> Безопасное место</div>` : ""}${p.studentDiscount ? `<div class="alma-popup-student">🎓 −${p.studentDiscount}% студентам</div>` : ""}${p.babyCare ? `<div class="alma-popup-baby">👶 ${(p.babyCareDetails?.length ? p.babyCareDetails.join(" · ") : p.babyCare)}</div>` : ""}${p.driveTags?.length ? `<div class="alma-popup-tags">${p.driveTags.join(" · ")}</div>` : ""}<button class="alma-open-button" onclick="window.almaOpenPlace(${p.id})">Открыть карточку →</button><button class="alma-route-button" onclick="window.almaRouteTo(${p.id})">Маршрут от меня →</button></div>`, { maxWidth: 330, minWidth: 290, className: "alma-leaflet-popup" });
      marker.on("click", () => {
        if (selectedRef.current === p.id) router.push(p.detailHref);
        else setSelected(p.id);
      });
      markers.current.push({ id: p.id, marker });
    });
    if (!placeId) currentMap.setView(center, zoom, { animate: false });
  }, [filtered, ready, router, placeId, mapZoom]);

  const focus = (p: MapPlace) => {
    setSelected(p.id);
    map.current?.flyTo([p.lat, p.lng], 15, { duration: 1 });
    const m = markers.current.find((x) => x.id === p.id);
    if (m) setTimeout(() => m.marker.openPopup(), 400);
  };

  useEffect(() => {
    if (!placeId || !ready || !map.current || !markers.current.length) return;
    const p = mapPlaces.find((x) => x.id === Number(placeId));
    if (p) setTimeout(() => focus(p), 100);
  }, [placeId, ready, filtered]);

  return <section className="bg-[#f7f4ef] pb-10 pt-0 text-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="alma-map-layout grid grid-cols-[40%_minmax(0,1fr)] items-start gap-2 sm:grid-cols-1 sm:gap-3 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5">
        <aside className="alma-map-filters rounded-[20px] border border-black/5 bg-white p-2.5 shadow-[0_18px_55px_-35px_rgba(0,0,0,.35)] sm:rounded-[30px] sm:p-5 lg:sticky lg:top-24">
          <div className="alma-map-filter-stack mx-auto grid w-full gap-1.5 sm:gap-2.5">
          {[
            { value: mood, setValue: setMood, options: moods, label: "Настроение" },
            { value: budget, setValue: setBudget, options: budgets, label: "Бюджет" },
            { value: company, setValue: setCompany, options: companies, label: "Компания" },
            { value: duration, setValue: setDuration, options: durations, label: "Длительность" },
          ].map((filter) => (
            <div key={filter.label} className="relative">
              <button type="button" onClick={() => setOpenFilter((current) => current === filter.label ? null : filter.label)} className="alma-map-filter-button alma-embossed-button flex h-10 w-full items-center justify-between rounded-xl border border-black/5 bg-[#f7f4ef] px-2.5 text-left text-[11px] font-medium transition hover:border-black/15 sm:h-12 sm:rounded-2xl sm:px-4 sm:text-sm">
                <span>{filter.value}</span>
                <span aria-hidden="true" className={`text-xs transition-transform ${openFilter === filter.label ? "rotate-180" : ""}`}>⌄</span>
              </button>
              {openFilter === filter.label && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[1200] overflow-hidden rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_16px_45px_rgba(0,0,0,.16)]">
                  {filter.options.map((option) => (
                    <button key={option} type="button" onClick={() => { filter.setValue(option); setOpenFilter(null); }} className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition ${filter.value === option ? "bg-black text-white" : "text-black hover:bg-[#f3efe9]"}`}>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button type="button" aria-pressed={studentOnly} onClick={() => setStudentOnly((value) => !value)} className={`alma-embossed-toggle alma-student-toggle flex h-9 sm:h-12 items-center justify-between gap-3 rounded-2xl border px-4 text-sm font-semibold transition md:col-span-2 xl:col-span-1 ${studentOnly ? "border-black bg-black text-white" : "border-black/5 bg-[#f7f4ef] text-black"}`}>
            <span className="whitespace-nowrap">🎓 Скидка студенту</span>
            <span aria-hidden="true" className={`alma-embossed-track relative h-6 w-10 rounded-full transition ${studentOnly ? "bg-white" : "bg-black/15"}`}><span className={`alma-embossed-knob absolute top-1 h-4 w-4 rounded-full transition ${studentOnly ? "left-5 bg-black" : "left-1 bg-white"}`} /></span>
          </button>
          {isFemale && <button type="button" aria-pressed={safeOnly} onClick={() => setSafeOnly((value) => !value)} className={`alma-embossed-toggle alma-safe-toggle flex h-9 sm:h-12 items-center justify-between gap-3 rounded-2xl border px-4 text-sm font-semibold transition md:col-span-2 xl:col-span-1 ${safeOnly ? "border-[#6f2437] bg-[#6f2437] text-white" : "border-[#ead0d7] bg-[#f8e8ec] text-[#6f2437]"}`}><span className="whitespace-nowrap inline-flex items-center gap-1.5"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M12 2.5 19 5.4v5.4c0 4.8-2.9 8.8-7 10.7-4.1-1.9-7-5.9-7-10.7V5.4L12 2.5Z"/><circle cx="12" cy="10.2" r="2.1" className="fill-[#f4d9df]"/><path d="M11.2 11.8h1.6l.7 4h-3l.7-4Z" className="fill-[#f4d9df]"/></svg>Безопасное место</span><span aria-hidden="true" className={`alma-embossed-track relative h-6 w-10 rounded-full transition ${safeOnly ? "bg-white" : "bg-[#6f2437]/15"}`}><span className={`alma-embossed-knob absolute top-1 h-4 w-4 rounded-full transition ${safeOnly ? "left-5 bg-[#6f2437]" : "left-1 bg-white"}`} /></span></button>}
          {(mood !== "Настроение" || budget !== "Бюджет" || company !== "Компания" || duration !== "Длительность" || studentOnly || safeOnly) && <button type="button" onClick={() => { setMood("Настроение"); setBudget("Бюджет"); setCompany("Компания"); setDuration("Длительность"); setStudentOnly(false); setSafeOnly(false); }} className="alma-map-reset mt-1 w-full rounded-full border border-black/10 px-4 py-2 text-xs font-medium text-neutral-600 transition hover:border-black/25 hover:text-black">Сбросить фильтры</button>}
          </div>

          <div className="mx-auto mt-4 w-[88%] border-t border-black/5 pt-3 sm:mt-5 sm:w-full sm:pt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[.16em] text-neutral-400">Категории</p>
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 3).map((c) => <button key={c} onClick={() => { setCategory(c); if (c !== "⚡ Драйв") setDriveTag("Все"); }} className={`alma-embossed-button rounded-full border px-3 py-2 text-[12px] font-medium transition-all duration-200 ${category === c ? "border-black bg-black text-white" : "border-black/5 bg-[#f7f4ef] text-black hover:border-black/15"}`}>{c}</button>)}
              <button type="button" onClick={() => setMoreCategoriesOpen((value) => !value)} className="alma-embossed-button rounded-full border border-black/5 bg-[#f7f4ef] px-3 py-2 text-[12px] font-medium text-black transition hover:border-black/15">Ещё {moreCategoriesOpen ? "⌃" : "⌄"}</button>
            </div>
            {moreCategoriesOpen && <div className="mt-2 flex flex-wrap gap-1.5">
              {categories.slice(3).map((c) => <button key={c} onClick={() => { setCategory(c); if (c !== "⚡ Драйв") setDriveTag("Все"); }} className={`alma-embossed-button rounded-full border px-3 py-2 text-[12px] font-medium transition-all duration-200 ${category === c ? "border-black bg-black text-white" : "border-black/5 bg-[#f7f4ef] text-black hover:border-black/15"}`}>{c}</button>)}
            </div>}
          </div>

          {category === "👶 Для малыша" && <div className="mt-4 rounded-[18px] bg-[#efe5d7] p-3.5"><p className="text-[11px] uppercase tracking-[.16em] text-neutral-500">ALMA · Для малыша</p><p className="mt-1 text-[13px] leading-5 text-neutral-700">Показываем только подтверждённые удобства.</p></div>}
          {category === "⚡ Драйв" && <div className="mt-4 rounded-[18px] bg-black p-3.5 text-white"><p className="text-[10px] uppercase tracking-[.16em] text-white/45">ALMA · Драйв</p><div className="mt-2 flex flex-wrap gap-1.5">{driveTags.map((t) => <button key={t} onClick={() => setDriveTag(t)} className={`rounded-full px-3 py-1.5 text-[11px] ${driveTag === t ? "bg-white text-black" : "bg-white/10 text-white"}`}>{t}</button>)}</div></div>}

          
        </aside>

        <div>
          <div className="alma-map relative min-h-[430px] overflow-hidden rounded-[20px] border border-black/5 bg-[#ebe8e3] shadow-[0_24px_70px_-38px_rgba(0,0,0,.45)] sm:min-h-[580px] sm:rounded-[34px] lg:min-h-[430px] lg:h-[430px]">
            <div ref={container} className="absolute inset-0" />
            <div className="absolute right-3 top-3 z-[600] inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white/95 px-3 py-1.5 text-xs font-semibold shadow-md backdrop-blur sm:right-4 sm:top-4"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 6 5-2 8 3 5-2v13l-5 2-8-3-5 2V6Z"/><path d="M8 4v13M16 7v13"/></svg>{filtered.length} мест</div>
            {!ready && <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#ebe8e3]">Загружаем…</div>}
            {routeStatus && <div className="absolute z-[600] left-3 top-3 max-w-[calc(100%-24px)] rounded-xl bg-white px-3 py-2.5 text-[13px] font-medium shadow-lg sm:left-4 sm:top-4 sm:max-w-[calc(100%-32px)] sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">{routeStatus}</div>}
            <div className="absolute z-[500] left-3 bottom-3 rounded-full bg-black text-white px-3 py-1.5 text-xs font-semibold sm:left-4 sm:bottom-4 sm:px-4 sm:py-2 sm:text-sm">alma</div>
          </div>
          <div className="alma-map-search mt-3"><MapDirectSearch /></div>
        </div>
      </div>


    </div>

    <style jsx global>{`.alma-map-filters .alma-embossed-button,.alma-map-filters .alma-embossed-toggle{box-shadow:inset 0 1px 0 rgba(255,255,255,.95),inset 0 -1px 0 rgba(0,0,0,.06),0 3px 0 #e6e1da,0 7px 14px rgba(41,34,28,.08);background-image:linear-gradient(160deg,#fff 0%,#f5f1eb 100%);transition:transform .16s ease,box-shadow .16s ease,background .2s ease}
.alma-map-filters .alma-embossed-button:active,.alma-map-filters .alma-embossed-toggle:active{transform:translateY(2px);box-shadow:inset 0 2px 5px rgba(0,0,0,.12),0 1px 0 #e6e1da}
.alma-map-filters .alma-embossed-button.bg-black,.alma-map-filters .alma-embossed-toggle[aria-pressed="true"]{background-image:linear-gradient(145deg,#34312f,#0f0e0d);box-shadow:inset 0 1px 0 rgba(255,255,255,.2),inset 0 -2px 5px rgba(0,0,0,.3),0 3px 0 #98918a,0 7px 14px rgba(0,0,0,.15)}
.alma-map-filters .alma-embossed-toggle:has(svg):not([aria-pressed="true"]){background-image:linear-gradient(145deg,#fff9fa,#f7e5eb);box-shadow:inset 0 1px 0 #fff,0 3px 0 #e8cbd4,0 7px 14px rgba(111,36,55,.08)}
.alma-map-filters .alma-embossed-toggle[aria-pressed="true"]:has(svg){background-image:linear-gradient(145deg,#8f455f,#57243a);box-shadow:inset 0 1px 0 rgba(255,255,255,.26),inset 0 -2px 5px rgba(0,0,0,.2),0 3px 0 #cf9eac,0 7px 14px rgba(89,38,58,.16)}
.alma-map-filters .alma-embossed-track{box-shadow:inset 0 2px 5px rgba(0,0,0,.2),0 1px 0 rgba(255,255,255,.8);background-image:linear-gradient(140deg,#d7d3cf,#ebe7e3)}
.alma-map-filters .alma-embossed-toggle[aria-pressed="true"] .alma-embossed-track{background-image:linear-gradient(140deg,#b9acae,#fff)}
.alma-map-filters .alma-embossed-knob{background:#fff!important;box-shadow:inset 0 1px 1px #fff,inset 0 -2px 3px rgba(0,0,0,.1),0 2px 5px rgba(0,0,0,.25)}
.alma-map-search{width:100%;}.alma-map-search>div{max-width:400px;margin-inline:0}.alma-map-search input{font-size:13px}
.alma-map .leaflet-tile-pane{filter:sepia(.22) saturate(.62) brightness(1.14) contrast(.76) hue-rotate(-8deg) opacity(.82)}.alma-map .leaflet-tile{mix-blend-mode:multiply}.alma-map .leaflet-pane.leaflet-tile-pane{background:#f7f2e8}.alma-map .leaflet-container{background:#f8f4ec}.alma-map::after{content:"";position:absolute;inset:0;z-index:250;pointer-events:none;background:rgba(255,248,237,.20);mix-blend-mode:screen;}.alma-map .leaflet-control-attribution{border-radius:10px 0 0 0!important;background:rgba(255,255,255,.78)!important;backdrop-filter:blur(10px);font-size:9px!important;color:#777!important}.alma-map .leaflet-control-container{position:relative;z-index:500}.alma-map .leaflet-control-zoom{overflow:hidden;border:0!important;border-radius:16px!important;box-shadow:0 10px 30px rgba(0,0,0,.16)!important}.alma-map .leaflet-control-zoom a{width:38px!important;height:38px!important;line-height:38px!important;border-color:rgba(0,0,0,.06)!important}.alma-marker-wrapper{background:transparent;border:none;position:relative}.alma-cluster{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border:3px solid #fff;border-radius:50%;background:#171614;color:#fff;font-size:14px;font-weight:800;box-shadow:0 8px 22px rgba(0,0,0,.28);cursor:pointer}.alma-cluster:hover{background:#6f2437;transform:scale(1.07)}.alma-marker svg{width:24px;height:24px;fill:#6f2437}.alma-marker svg circle,.alma-marker svg path:last-child{fill:#f4d9df}.alma-safe-inline{display:inline-flex;vertical-align:middle;margin-right:3px}.alma-safe-inline svg{width:15px;height:15px;fill:#6f2437}.alma-safe-inline svg circle,.alma-safe-inline svg path:last-child{fill:#f4d9df}.alma-safe-badge{position:absolute;left:30px;top:-5px;white-space:nowrap;border:2px solid #fff;border-radius:999px;background:#f4d9df;color:#6f2437;padding:4px 8px;font-size:9px;font-weight:800;line-height:1;box-shadow:0 6px 16px rgba(0,0,0,.16)}.alma-student-badge{position:absolute;left:30px;top:-5px;white-space:nowrap;border:2px solid #fff;border-radius:999px;background:#111;color:#fff;padding:3px 7px;font-size:10px;font-weight:800;line-height:1;box-shadow:0 6px 16px rgba(0,0,0,.22)}.alma-marker{width:42px;height:42px;display:flex;align-items:center;justify-content:center;border:3px solid #fff;border-radius:999px;background:#111;color:#fff;box-shadow:0 10px 24px rgba(0,0,0,.28);font-size:17px;transition:transform .2s ease,box-shadow .2s ease}.alma-marker:hover{transform:translateY(-3px) scale(1.08);box-shadow:0 14px 30px rgba(0,0,0,.34)}.alma-leaflet-popup .leaflet-popup-content-wrapper{padding:0!important;border-radius:24px!important;overflow:hidden}.alma-leaflet-popup .leaflet-popup-content{margin:0!important;width:250px!important}.alma-popup{padding:14px;color:#111}.alma-popup-category{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#999}.alma-popup-title{margin-top:4px;font-size:18px;font-weight:700;line-height:1.15}.alma-popup-open{display:block;width:100%;padding:0;border:0;background:transparent;color:inherit;text-align:left;cursor:pointer}.alma-popup-open:hover{text-decoration:underline}.alma-popup-rating,.alma-popup-address,.alma-popup-tags,.alma-popup-baby,.alma-popup-student,.alma-popup-safe{margin-top:6px;font-size:11px;line-height:1.3}.alma-popup-safe{display:inline-flex;border-radius:999px;background:#f4d9df;color:#6f2437;padding:5px 9px;font-weight:800}.alma-popup-student{display:inline-flex;border-radius:999px;background:#111;color:#fff;padding:5px 9px;font-weight:700}.alma-popup-address{color:#666}.alma-popup-tags,.alma-popup-baby{font-weight:600}.alma-open-button,.alma-route-button{display:flex;width:100%;justify-content:center;min-height:36px;align-items:center;border-radius:999px;font-size:12px;font-weight:600;cursor:pointer}.alma-open-button{margin-top:9px;border:1px solid rgba(0,0,0,.12);background:#fff;color:#111}.alma-route-button{margin-top:6px;background:#111;color:#fff;border:0}@media(max-width:639px){
.alma-map-layout{display:flex!important;flex-direction:column!important;gap:7px!important}
.alma-map-filters{position:relative!important;z-index:900!important;width:100%!important;padding:10px!important;border-radius:18px!important;background:#fff!important;box-shadow:0 8px 26px rgba(0,0,0,.06)!important}
.alma-map-filter-stack{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}
.alma-map-filter-stack>div{min-width:0}
.alma-map-filter-button{height:44px!important;padding:0 10px!important;font-size:13px!important;border-radius:14px!important}
.alma-map-filter-button span:first-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.alma-map-filter-button span:last-child{flex:0 0 auto;margin-left:4px}
.alma-map-filter-button+div{position:absolute!important;left:0!important;right:auto!important;top:calc(100% + 4px)!important;bottom:auto!important;width:max(100%,210px);max-width:min(290px,calc(100vw - 52px));max-height:45vh;overflow:auto;padding:6px!important}
.alma-map-filter-button+div button{min-height:42px;font-size:14px!important}
.alma-map-filter-stack>button.alma-embossed-toggle{grid-column:auto!important;min-width:0!important;max-width:100%!important;width:100%!important;overflow:hidden}
.alma-map-filter-stack>button.alma-embossed-toggle>span:first-child{flex:1 1 auto;min-width:0!important;overflow-wrap:anywhere}
.alma-map-filter-stack>button.alma-safe-toggle svg{display:none}
.alma-map-filters button[aria-pressed]{min-height:44px!important;gap:6px!important;border-radius:14px!important;padding:6px 8px!important;font-size:12px!important;line-height:1.15;text-align:left}
.alma-map-filters button[aria-pressed]>span:first-child{white-space:normal!important}
.alma-map-filters button[aria-pressed]>span:last-child{flex:0 0 34px!important;width:34px!important;height:20px!important}
.alma-map-filters button[aria-pressed]>span:last-child>span{top:3px!important;width:14px!important;height:14px!important}
.alma-map-filters button[aria-pressed="true"]>span:last-child>span{left:17px!important}
.alma-map-filters button[aria-pressed="false"]>span:last-child>span{left:3px!important}
.alma-map-filter-stack>button.alma-map-reset{grid-column:1/-1;min-height:40px!important;font-size:12px!important}
.alma-map-filters>div:nth-child(2){display:block!important;margin-top:8px!important;padding-top:8px!important}
.alma-map-layout>div:nth-child(2){width:100%!important}
.alma-map-layout .alma-map{width:100%!important;height:320px!important;min-height:320px!important;border-radius:22px!important}
.alma-map-search{margin-top:10px!important}.alma-map-search>div{width:min(100%,320px)!important;max-width:320px!important;margin-inline:auto!important}
.alma-map-search input{font-size:16px!important}
.alma-map-layout .alma-map .leaflet-control-zoom{display:none}
.alma-map-layout .alma-map .alma-marker{transform:scale(.85)}
.alma-map-layout .alma-map .alma-cluster{transform:scale(.9)}
.alma-map-layout .alma-map .alma-safe-badge,.alma-map-layout .alma-map .alma-student-badge{font-size:8px!important;padding:2px 5px!important}
.alma-leaflet-popup .leaflet-popup-content{width:min(260px,calc(100vw - 56px))!important}
.alma-popup{padding:12px!important}.alma-popup-title{font-size:17px!important}.alma-popup-category{font-size:10px!important}
.alma-popup-rating,.alma-popup-address,.alma-popup-tags,.alma-popup-baby,.alma-popup-student,.alma-popup-safe{font-size:11px!important}
.alma-open-button,.alma-route-button{min-height:42px!important;font-size:12px!important}
}`}</style>
  </section>;
}
