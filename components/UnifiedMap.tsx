"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mapPlaces, type MapPlace } from "@/data/mapPlaces";
import MapDirectSearch from "@/components/MapDirectSearch";

declare global { interface Window { L: any; almaRouteTo?: (id: number) => void; almaOpenPlace?: (id: number) => void; } }

function emoji(place: MapPlace) {
  if (place.safePlace) return "🛡";
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
  const [selected, setSelected] = useState<number | null>(null);
  const selectedRef = useRef<number | null>(null);
  const [category, setCategory] = useState(initialCategory);
  const [driveTag, setDriveTag] = useState("Все");
  const [routeStatus, setRouteStatus] = useState("");
  const [mood, setMood] = useState("Настроение");
  const [budget, setBudget] = useState("Бюджет");
  const [company, setCompany] = useState("Компания");
  const [duration, setDuration] = useState("Длительность");
  const [studentOnly, setStudentOnly] = useState(false);
  const [isFemale, setIsFemale] = useState(false);
  const [moreCategoriesOpen, setMoreCategoriesOpen] = useState(false);

  const categories = ["Все", "Кофейня", "Ресторан", "🎓 Скидка студенту", ...(isFemale ? ["🛡 Безопасное место"] : []), "Dog Friendly", "👶 Для малыша", "⚡ Драйв", "Другие места"];
  const driveTags = ["Все", "Активный отдых", "Матчи", "Живая музыка", "Рок", "С друзьями"];
  const moods = ["Настроение", "Весёлое", "Грустное", "Нейтральное", "Энергичное"];
  const budgets = ["Бюджет", "Бесплатно", "От 1000 до 2500 ₽", "От 3000 до 5000 ₽", "От 5000 ₽"];
  const companies = ["Компания", "С собакой", ...Array.from(new Set(mapPlaces.flatMap((place) => place.company))).filter((value) => value !== "С собакой").sort()];
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
      (company === "Компания" || (company === "С собакой" ? Boolean(p.dogFriendly) : p.company.includes(company))) &&
      (duration === "Длительность" ||
        (duration === "До 1 часа" && /до 1|30|45|60|1 час/i.test(p.duration)) ||
        (duration === "1–2 часа" && /1.?2|1–2|1-2|1 час|2 час/i.test(p.duration)) ||
        (duration === "2–4 часа" && /2.?4|2–4|2-4|3 час|4 час/i.test(p.duration)) ||
        (duration === "Полдня" && /полдня|полдня|5 час|6 час/i.test(p.duration))) &&
      (!studentOnly || Boolean(p.studentDiscount)) &&
      (!params.get("mood") || p.mood === params.get("mood")) &&
      (!params.get("budget") || p.budget === params.get("budget")) &&
      (!params.get("company") || p.company.includes(params.get("company")!)) &&
      (!params.get("duration") || p.duration === params.get("duration"));
  }), [budget, category, company, driveTag, duration, isFemale, mood, params, studentOnly]);

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
    filtered.forEach((p) => {
      const icon = window.L.divIcon({ className: "alma-marker-wrapper", html: `<div class="alma-marker">${emoji(p)}</div>${p.safePlace ? `<div class="alma-safe-badge">Безопасное место</div>` : ""}${p.studentDiscount ? `<div class="alma-student-badge">−${p.studentDiscount}%</div>` : ""}`, iconSize: [40, 40], iconAnchor: [20, 20] });
      const marker = window.L.marker([p.lat, p.lng], { icon }).addTo(map.current);
      marker.bindPopup(`<div class="alma-popup"><div class="alma-popup-category">${p.category}</div><button class="alma-popup-title alma-popup-open" onclick="window.almaOpenPlace(${p.id})">${p.name}</button>${p.rating ? `<div class="alma-popup-rating">★ ${p.rating.toFixed(1)} / 5 · ${p.ratingSource ?? ""}</div>` : ""}<div class="alma-popup-address">${p.address}</div>${p.safePlace ? `<div class="alma-popup-safe">🛡 Безопасное место</div>` : ""}${p.studentDiscount ? `<div class="alma-popup-student">🎓 −${p.studentDiscount}% студентам</div>` : ""}${p.babyCare ? `<div class="alma-popup-baby">👶 ${(p.babyCareDetails?.length ? p.babyCareDetails.join(" · ") : p.babyCare)}</div>` : ""}${p.driveTags?.length ? `<div class="alma-popup-tags">${p.driveTags.join(" · ")}</div>` : ""}<button class="alma-open-button" onclick="window.almaOpenPlace(${p.id})">Открыть карточку →</button><button class="alma-route-button" onclick="window.almaRouteTo(${p.id})">Маршрут от меня →</button></div>`, { maxWidth: 330, minWidth: 290, className: "alma-leaflet-popup" });
      marker.on("click", () => {
        if (selectedRef.current === p.id) router.push(p.detailHref);
        else setSelected(p.id);
      });
      markers.current.push({ id: p.id, marker });
    });
    if (!placeId) currentMap.setView(center, zoom, { animate: false });
  }, [filtered, ready, router, placeId]);

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
      <div className="grid items-start gap-3 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5">
        <aside className="rounded-[26px] border border-black/5 bg-white p-4 shadow-[0_18px_55px_-35px_rgba(0,0,0,.35)] sm:rounded-[30px] sm:p-5 lg:sticky lg:top-24">
          <div className="mb-4">
            
            <p className="mt-1 text-xl font-bold tracking-tight">Найди то самое место</p>
          </div>
          <div className="mx-auto grid w-[88%] gap-2 sm:w-full sm:gap-2.5">
          <label className="relative block">
            <span className="sr-only">Настроение</span>
            <select value={mood} onChange={(event) => setMood(event.target.value)} className="h-10 sm:h-10 sm:h-10 sm:h-10 sm:h-12 w-full appearance-none rounded-2xl border border-black/5 bg-[#f7f4ef] px-4 pr-9 text-sm font-medium outline-none transition focus:border-black/25">
              {moods.map((value) => <option key={value}>{value}</option>)}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs">⌄</span>
          </label>
          <label className="relative block">
            <span className="sr-only">Бюджет</span>
            <select value={budget} onChange={(event) => setBudget(event.target.value)} className="h-12 w-full appearance-none rounded-2xl border border-black/5 bg-[#f7f4ef] px-4 pr-9 text-sm font-medium outline-none transition focus:border-black/25">
              {budgets.map((value) => <option key={value}>{value}</option>)}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs">⌄</span>
          </label>
          <label className="relative block">
            <span className="sr-only">Компания</span>
            <select value={company} onChange={(event) => setCompany(event.target.value)} className="h-12 w-full appearance-none rounded-2xl border border-black/5 bg-[#f7f4ef] px-4 pr-9 text-sm font-medium outline-none transition focus:border-black/25">
              {companies.map((value) => <option key={value}>{value}</option>)}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs">⌄</span>
          </label>
          <label className="relative block">
            <span className="sr-only">Длительность прогулки</span>
            <select value={duration} onChange={(event) => setDuration(event.target.value)} className="h-12 w-full appearance-none rounded-2xl border border-black/5 bg-[#f7f4ef] px-4 pr-9 text-sm font-medium outline-none transition focus:border-black/25">
              {durations.map((value) => <option key={value}>{value}</option>)}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs">⌄</span>
          </label>
          <button type="button" aria-pressed={studentOnly} onClick={() => setStudentOnly((value) => !value)} className={`flex h-9 sm:h-12 items-center justify-between gap-3 rounded-2xl border px-4 text-sm font-semibold transition md:col-span-2 xl:col-span-1 ${studentOnly ? "border-black bg-black text-white" : "border-black/5 bg-[#f7f4ef] text-black"}`}>
            <span className="whitespace-nowrap">🎓 Скидка студенту</span>
            <span aria-hidden="true" className={`relative h-6 w-10 rounded-full transition ${studentOnly ? "bg-white" : "bg-black/15"}`}><span className={`absolute top-1 h-4 w-4 rounded-full transition ${studentOnly ? "left-5 bg-black" : "left-1 bg-white"}`} /></span>
          </button>
          </div>

          <div className="mx-auto mt-4 w-[88%] border-t border-black/5 pt-3 sm:mt-5 sm:w-full sm:pt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[.16em] text-neutral-400">Категории</p>
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, isFemale ? 5 : 4).map((c) => <button key={c} onClick={() => { setCategory(c); if (c !== "⚡ Драйв") setDriveTag("Все"); }} className={`rounded-full border px-3 py-2 text-[12px] font-medium transition-all duration-200 ${category === c ? "border-black bg-black text-white" : "border-black/5 bg-[#f7f4ef] text-black hover:border-black/15"}`}>{c}</button>)}
              <button type="button" onClick={() => setMoreCategoriesOpen((value) => !value)} className="rounded-full border border-black/5 bg-[#f7f4ef] px-3 py-2 text-[12px] font-medium text-black transition hover:border-black/15">Ещё {moreCategoriesOpen ? "⌃" : "⌄"}</button>
            </div>
            {moreCategoriesOpen && <div className="mt-2 flex flex-wrap gap-1.5">
              {categories.slice(isFemale ? 5 : 4).map((c) => <button key={c} onClick={() => { setCategory(c); if (c !== "⚡ Драйв") setDriveTag("Все"); }} className={`rounded-full border px-3 py-2 text-[12px] font-medium transition-all duration-200 ${category === c ? "border-black bg-black text-white" : "border-black/5 bg-[#f7f4ef] text-black hover:border-black/15"}`}>{c}</button>)}
            </div>}
          </div>

          {category === "👶 Для малыша" && <div className="mt-4 rounded-[18px] bg-[#efe5d7] p-3.5"><p className="text-[11px] uppercase tracking-[.16em] text-neutral-500">ALMA · Для малыша</p><p className="mt-1 text-[13px] leading-5 text-neutral-700">Показываем только подтверждённые удобства.</p></div>}
          {category === "⚡ Драйв" && <div className="mt-4 rounded-[18px] bg-black p-3.5 text-white"><p className="text-[10px] uppercase tracking-[.16em] text-white/45">ALMA · Драйв</p><div className="mt-2 flex flex-wrap gap-1.5">{driveTags.map((t) => <button key={t} onClick={() => setDriveTag(t)} className={`rounded-full px-3 py-1.5 text-[11px] ${driveTag === t ? "bg-white text-black" : "bg-white/10 text-white"}`}>{t}</button>)}</div></div>}

          <button type="button" onClick={() => { setMood("Настроение"); setBudget("Бюджет"); setCompany("Компания"); setDuration("Длительность"); setStudentOnly(false); setCategory("Все"); setDriveTag("Все"); setMoreCategoriesOpen(false); }} className="mt-5 w-full rounded-full border border-black/10 px-4 py-3 text-sm font-medium transition hover:border-black/25">Сбросить фильтры</button>
        </aside>

        <div>
          <div className="alma-map relative min-h-[430px] overflow-hidden rounded-[28px] border border-black/5 bg-[#ebe8e3] shadow-[0_24px_70px_-38px_rgba(0,0,0,.45)] sm:min-h-[580px] sm:rounded-[34px] lg:min-h-[720px]">
            <div ref={container} className="absolute inset-0" />\n            <div className="absolute right-3 top-3 z-[600] inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white/95 px-3 py-1.5 text-xs font-semibold shadow-md backdrop-blur sm:right-4 sm:top-4"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 6 5-2 8 3 5-2v13l-5 2-8-3-5 2V6Z"/><path d="M8 4v13M16 7v13"/></svg>{filtered.length} мест</div>
            {!ready && <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#ebe8e3]">Загружаем…</div>}
            {routeStatus && <div className="absolute z-[600] left-3 top-3 max-w-[calc(100%-24px)] rounded-xl bg-white px-3 py-2.5 text-[13px] font-medium shadow-lg sm:left-4 sm:top-4 sm:max-w-[calc(100%-32px)] sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">{routeStatus}</div>}
            <div className="absolute z-[500] left-3 bottom-3 rounded-full bg-black text-white px-3 py-1.5 text-xs font-semibold sm:left-4 sm:bottom-4 sm:px-4 sm:py-2 sm:text-sm">alma</div>
          </div>
          <div className="mt-3"><MapDirectSearch /></div>
        </div>
      </div>


    </div>

    <style jsx global>{`.alma-map .leaflet-tile-pane{filter:sepia(.22) saturate(.62) brightness(1.14) contrast(.76) hue-rotate(-8deg) opacity(.82)}.alma-map .leaflet-tile{mix-blend-mode:multiply}.alma-map .leaflet-pane.leaflet-tile-pane{background:#f7f2e8}.alma-map .leaflet-container{background:#f8f4ec}.alma-map::after{content:"";position:absolute;inset:0;z-index:250;pointer-events:none;background:rgba(255,248,237,.20);mix-blend-mode:screen;}font-family:inherit}.alma-map .leaflet-control-attribution{border-radius:10px 0 0 0!important;background:rgba(255,255,255,.78)!important;backdrop-filter:blur(10px);font-size:9px!important;color:#777!important}.alma-map .leaflet-control-container{position:relative;z-index:500}.alma-map .leaflet-control-zoom{overflow:hidden;border:0!important;border-radius:16px!important;box-shadow:0 10px 30px rgba(0,0,0,.16)!important}.alma-map .leaflet-control-zoom a{width:38px!important;height:38px!important;line-height:38px!important;border-color:rgba(0,0,0,.06)!important}.alma-marker-wrapper{background:transparent;border:none;position:relative}.alma-safe-badge{position:absolute;left:30px;top:-5px;white-space:nowrap;border:2px solid #fff;border-radius:999px;background:#f4d9df;color:#6f2437;padding:4px 8px;font-size:9px;font-weight:800;line-height:1;box-shadow:0 6px 16px rgba(0,0,0,.16)}.alma-student-badge{position:absolute;left:30px;top:-5px;white-space:nowrap;border:2px solid #fff;border-radius:999px;background:#111;color:#fff;padding:3px 7px;font-size:10px;font-weight:800;line-height:1;box-shadow:0 6px 16px rgba(0,0,0,.22)}.alma-marker{width:42px;height:42px;display:flex;align-items:center;justify-content:center;border:3px solid #fff;border-radius:999px;background:#111;color:#fff;box-shadow:0 10px 24px rgba(0,0,0,.28);font-size:17px;transition:transform .2s ease,box-shadow .2s ease}.alma-marker:hover{transform:translateY(-3px) scale(1.08);box-shadow:0 14px 30px rgba(0,0,0,.34)}.alma-leaflet-popup .leaflet-popup-content-wrapper{padding:0!important;border-radius:24px!important;overflow:hidden}.alma-leaflet-popup .leaflet-popup-content{margin:0!important;width:300px!important}.alma-popup{padding:20px;color:#111}.alma-popup-category{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#999}.alma-popup-title{margin-top:6px;font-size:22px;font-weight:700}.alma-popup-open{display:block;width:100%;padding:0;border:0;background:transparent;color:inherit;text-align:left;cursor:pointer}.alma-popup-open:hover{text-decoration:underline}.alma-popup-rating,.alma-popup-address,.alma-popup-tags,.alma-popup-baby,.alma-popup-student,.alma-popup-safe{margin-top:9px;font-size:12px}.alma-popup-safe{display:inline-flex;border-radius:999px;background:#f4d9df;color:#6f2437;padding:5px 9px;font-weight:800}.alma-popup-student{display:inline-flex;border-radius:999px;background:#111;color:#fff;padding:5px 9px;font-weight:700}.alma-popup-address{color:#666}.alma-popup-tags,.alma-popup-baby{font-weight:600}.alma-open-button,.alma-route-button{display:flex;width:100%;justify-content:center;min-height:42px;align-items:center;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer}.alma-open-button{margin-top:14px;border:1px solid rgba(0,0,0,.12);background:#fff;color:#111}.alma-route-button{margin-top:8px;background:#111;color:#fff;border:0}@media(max-width:767px){.alma-leaflet-popup .leaflet-popup-content{width:245px!important}.alma-popup{padding:15px}.alma-popup-title{font-size:18px}.alma-map .leaflet-control-zoom{transform:scale(.88);transform-origin:bottom right}}`}</style>
  </section>;
}
