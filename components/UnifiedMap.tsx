"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mapPlaces, type MapPlace } from "@/data/mapPlaces";
import MapDirectSearch from "@/components/MapDirectSearch";

declare global { interface Window { L: any; almaRouteTo?: (id: number) => void; } }

function emoji(place: MapPlace) {
  if (place.driveTags?.includes("Активный отдых")) return "🏎️";
  if (place.drive) return "⚡";
  if (place.babyCare) return "👶";
  if (place.dogFriendly) return "🐾";
  if (place.category === "Кофейня") return "☕";
  if (place.category === "Ресторан") return "🍴";
  return "✦";
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
  const [category, setCategory] = useState(initialCategory);
  const [driveTag, setDriveTag] = useState("Все");
  const [routeStatus, setRouteStatus] = useState("");

  const categories = ["Все", "Кофейня", "Ресторан", "Dog Friendly", "👶 Для малыша", "⚡ Драйв", "Другие места"];
  const driveTags = ["Все", "Активный отдых", "Матчи", "Живая музыка", "Рок", "С друзьями"];
  const placeId = params.get("place");

  const filtered = useMemo(() => mapPlaces.filter((p) => {
    const cat = category === "Все" ||
      (category === "Dog Friendly" && p.dogFriendly) ||
      (category === "👶 Для малыша" && Boolean(p.babyCare)) ||
      (category === "⚡ Драйв" && p.drive) ||
      (category === "Другие места" && !p.drive && !p.babyCare && p.category !== "Кофейня" && p.category !== "Ресторан") ||
      p.category === category;
    const tag = category !== "⚡ Драйв" || driveTag === "Все" || p.driveTags?.includes(driveTag);
    return cat && tag &&
      (!params.get("mood") || p.mood === params.get("mood")) &&
      (!params.get("budget") || p.budget === params.get("budget")) &&
      (!params.get("company") || p.company.includes(params.get("company")!)) &&
      (!params.get("duration") || p.duration === params.get("duration"));
  }), [category, driveTag, params]);

  useEffect(() => {
    if (!document.querySelector('link[data-leaflet-css="true"]')) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      l.dataset.leafletCss = "true";
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
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    if (!ready || !container.current || map.current) return;
    map.current = window.L.map(container.current, { zoomControl: false }).setView([59.9386, 30.3141], 11);
    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { subdomains: "abcd", maxZoom: 20, attribution: "© OpenStreetMap · © CARTO" }).addTo(map.current);
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
    return () => { delete window.almaRouteTo; };
  });

  useEffect(() => {
    if (!ready || !map.current) return;
    markers.current.forEach((m) => m.marker.remove());
    markers.current = [];
    filtered.forEach((p) => {
      const icon = window.L.divIcon({ className: "alma-marker-wrapper", html: `<div class="alma-marker">${emoji(p)}</div>`, iconSize: [40, 40], iconAnchor: [20, 20] });
      const marker = window.L.marker([p.lat, p.lng], { icon }).addTo(map.current);
      marker.bindPopup(`<div class="alma-popup"><div class="alma-popup-category">${p.category}</div><div class="alma-popup-title">${p.name}</div>${p.rating ? `<div class="alma-popup-rating">★ ${p.rating.toFixed(1)} / 5 · ${p.ratingSource ?? ""}</div>` : ""}<div class="alma-popup-address">${p.address}</div>${p.babyCare ? `<div class="alma-popup-baby">👶 ${p.babyCare}</div>` : ""}${p.driveTags?.length ? `<div class="alma-popup-tags">${p.driveTags.join(" · ")}</div>` : ""}<button class="alma-route-button" onclick="window.almaRouteTo(${p.id})">Маршрут от меня →</button></div>`, { maxWidth: 330, minWidth: 290, className: "alma-leaflet-popup" });
      marker.on("click", () => setSelected(p.id));
      markers.current.push({ id: p.id, marker });
    });
  }, [filtered, ready]);

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

  return <section className="bg-[#f7f4ef] pb-10 text-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div><p className="text-[11px] font-semibold uppercase tracking-[.18em] text-neutral-400">Исследуй Петербург</p><h2 className="mt-1 w-full text-left text-3xl font-bold tracking-tight sm:text-4xl">Карта</h2></div>
        <span className="shrink-0 rounded-full border border-black/5 bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">{filtered.length} мест</span>
      </div>

      <div className="mb-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {categories.map((c) => <button key={c} onClick={() => { setCategory(c); if (c !== "⚡ Драйв") setDriveTag("Все"); }} className={`shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-medium shadow-sm transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-sm ${category === c ? "border-black bg-black text-white shadow-md" : "border-black/5 bg-white text-black hover:-translate-y-0.5 hover:border-black/15"}`}>{c}</button>)}
      </div>

      {category === "👶 Для малыша" && <div className="mb-4 rounded-[18px] bg-[#efe5d7] p-3.5 sm:mb-5 sm:rounded-[24px] sm:p-5"><p className="text-[11px] uppercase tracking-[.16em] text-neutral-500">ALMA · Для малыша</p><p className="mt-1 text-[15px] leading-5 text-neutral-700 sm:text-sm">Показываем только подтверждённые удобства: пеленальный столик, комнату матери и ребёнка или отдельную детскую комнату.</p></div>}

      {category === "⚡ Драйв" && <div className="mb-4 rounded-[18px] bg-black px-3.5 py-3 text-white sm:mb-5 sm:rounded-[24px] sm:p-5"><div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3"><div><p className="text-[10px] uppercase tracking-[.16em] text-white/45 sm:text-xs">ALMA · Драйв</p><p className="mt-1 text-[17px] leading-5 font-medium text-white/90 sm:text-sm">Активный отдых</p></div><div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 sm:flex-wrap sm:overflow-visible sm:p-0">{driveTags.map((t) => <button key={t} onClick={() => setDriveTag(t)} className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] sm:py-2 sm:text-xs ${driveTag === t ? "bg-white text-black" : "bg-white/10 text-white"}`}>{t}</button>)}</div></div></div>}

      <div className="grid items-start gap-4 lg:grid-cols-[390px_minmax(0,1fr)] lg:gap-6">
        <div className="order-2 overflow-hidden rounded-[26px] border border-black/5 bg-white/90 shadow-[0_18px_55px_-35px_rgba(0,0,0,.35)] backdrop-blur-xl sm:rounded-[30px] lg:order-1 lg:mt-[52px]">
          <div className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4 border-b border-black/5">
            <p className="font-semibold text-[20px] sm:text-lg">{category === "⚡ Драйв" ? "Куда за драйвом" : category === "👶 Для малыша" ? "С малышом" : "Выбери место"}</p>
            <p className="mt-1 text-[14px] sm:text-sm text-neutral-500">Рейтинг 4,5–5,0 · проверено ALMA.</p>
          </div>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:block lg:max-h-[700px] lg:overflow-y-auto">
            {filtered.length === 0 && <div className="rounded-[18px] bg-[#faf8f5] p-4 text-sm leading-6 text-neutral-500">Пока нет мест с подтверждённым удобством в этой категории.</div>}
            {filtered.map((p) => <article key={p.id} className={`w-[82vw] max-w-[340px] shrink-0 snap-center overflow-hidden rounded-[22px] border transition-all duration-300 lg:mb-3 lg:w-auto lg:max-w-none ${selected === p.id ? "border-black bg-black text-white shadow-lg" : "border-black/5 bg-[#faf8f5] hover:border-black/15"}`}>
              <button onClick={() => router.push(p.detailHref)} className="w-full text-left">
                {p.image ? <div className="relative h-28 sm:h-36 w-full bg-[#ece8e2]"><img src={p.image} alt={p.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" /></div> : <div className="h-20 sm:h-24 w-full bg-gradient-to-br from-[#e9dfd1] via-[#f5eee5] to-[#ddd1c2] flex items-center justify-center text-3xl">{emoji(p)}</div>}
                <div className="p-3.5 sm:p-4">
                  <div className="flex items-start justify-between gap-3"><div><p className="text-[12px] opacity-60">{p.category}</p><h3 className="mt-1 text-[20px] leading-6 font-semibold sm:text-lg">{p.name}</h3><p className="mt-1.5 text-[12px] opacity-55">Открыть карточку →</p></div>{p.rating && <span className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold ${selected === p.id ? "bg-white text-black" : "bg-black text-white"}`}>★ {p.rating.toFixed(1)}</span>}</div>
                  {p.babyCare && <div className="mt-2.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${selected === p.id ? "bg-white/10" : "bg-[#efe5d7]"}`}>👶 {p.babyCare}</span></div>}
                  {p.driveTags?.length && <div className="mt-2.5 flex flex-wrap gap-1.5">{p.driveTags.map((t) => <span key={t} className={`rounded-full px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-[11px] ${selected === p.id ? "bg-white/10" : "bg-black/5"}`}>{t}</span>)}</div>}
                  <p className="mt-2 text-[12px] leading-4 opacity-70">{p.address}</p>
                  {p.drive && <p className="mt-2 text-[14px] leading-5 opacity-75">{p.why}</p>}
                </div>
              </button>
              <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4"><button onClick={() => buildRoute(p)} className={`w-full rounded-full px-4 py-2.5 text-sm font-medium ${selected === p.id ? "bg-white text-black" : "bg-white border border-black/10 text-black"}`}>Маршрут от меня →</button></div>
            </article>)}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="mb-3"><MapDirectSearch /></div>
          <div className="alma-map relative min-h-[430px] overflow-hidden rounded-[28px] border border-black/5 bg-[#ebe8e3] shadow-[0_24px_70px_-38px_rgba(0,0,0,.45)] sm:min-h-[580px] sm:rounded-[34px] lg:min-h-[760px]">
            <div ref={container} className="absolute inset-0" />
            {!ready && <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#ebe8e3]">Загружаем…</div>}
            {routeStatus && <div className="absolute z-[600] left-3 top-3 max-w-[calc(100%-24px)] rounded-xl bg-white px-3 py-2.5 text-[13px] font-medium shadow-lg sm:left-4 sm:top-4 sm:max-w-[calc(100%-32px)] sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">{routeStatus}</div>}
            <div className="absolute z-[500] left-3 bottom-3 rounded-full bg-black text-white px-3 py-1.5 text-xs font-semibold sm:left-4 sm:bottom-4 sm:px-4 sm:py-2 sm:text-sm">alma</div>
          </div>
          <p className="mt-2 px-1 text-[12px] text-neutral-400 lg:hidden">Нажми на метку или выбери место в ленте ниже.</p>
        </div>
      </div>
    </div>

    <style jsx global>{`.alma-map .leaflet-tile-pane{filter:saturate(.72) sepia(.08) brightness(1.015) contrast(.96)}.alma-map .leaflet-container{background:#e9e5df;font-family:inherit}.alma-map .leaflet-control-attribution{border-radius:10px 0 0 0!important;background:rgba(255,255,255,.78)!important;backdrop-filter:blur(10px);font-size:9px!important;color:#777!important}.alma-map .leaflet-control-container{position:relative;z-index:500}.alma-map .leaflet-control-zoom{overflow:hidden;border:0!important;border-radius:16px!important;box-shadow:0 10px 30px rgba(0,0,0,.16)!important}.alma-map .leaflet-control-zoom a{width:38px!important;height:38px!important;line-height:38px!important;border-color:rgba(0,0,0,.06)!important}.alma-marker-wrapper{background:transparent;border:none}.alma-marker{width:42px;height:42px;display:flex;align-items:center;justify-content:center;border:3px solid #fff;border-radius:999px;background:#111;color:#fff;box-shadow:0 10px 24px rgba(0,0,0,.28);font-size:17px;transition:transform .2s ease,box-shadow .2s ease}.alma-marker:hover{transform:translateY(-3px) scale(1.08);box-shadow:0 14px 30px rgba(0,0,0,.34)}.alma-leaflet-popup .leaflet-popup-content-wrapper{padding:0!important;border-radius:24px!important;overflow:hidden}.alma-leaflet-popup .leaflet-popup-content{margin:0!important;width:300px!important}.alma-popup{padding:20px;color:#111}.alma-popup-category{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#999}.alma-popup-title{margin-top:6px;font-size:22px;font-weight:700}.alma-popup-rating,.alma-popup-address,.alma-popup-tags,.alma-popup-baby{margin-top:9px;font-size:12px}.alma-popup-address{color:#666}.alma-popup-tags,.alma-popup-baby{font-weight:600}.alma-route-button{display:flex;width:100%;justify-content:center;margin-top:12px;min-height:42px;align-items:center;border-radius:999px;font-size:13px;font-weight:600;background:#111;color:#fff;border:0;cursor:pointer}@media(max-width:767px){.alma-leaflet-popup .leaflet-popup-content{width:245px!important}.alma-popup{padding:15px}.alma-popup-title{font-size:18px}.alma-map .leaflet-control-zoom{transform:scale(.88);transform-origin:bottom right}}`}</style>
  </section>;
}
