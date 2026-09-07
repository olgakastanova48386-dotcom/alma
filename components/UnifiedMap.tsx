"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { mapPlaces, type MapPlace } from "@/data/mapPlaces";
import MapDirectSearch from "@/components/MapDirectSearch";

declare global { interface Window { L: any; almaRouteTo?: (id: number) => void; } }

function emoji(place: MapPlace) {
  if (place.dogFriendly) return "🐾";
  if (place.category === "Кофейня") return "☕";
  if (place.category === "Ресторан") return "🍴";
  return "✦";
}

export default function UnifiedMap() {
  const params = useSearchParams();
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<any>(null);
  const markers = useRef<{ id: number; marker: any }[]>([]);
  const routeLayer = useRef<any>(null);
  const userMarker = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [category, setCategory] = useState("Все");
  const [routeStatus, setRouteStatus] = useState("");
  const categories = ["Все", "Кофейня", "Ресторан", "Dog Friendly", "Другие места"];
  const placeId = params.get("place");

  const filtered = useMemo(() => mapPlaces.filter((p) => {
    const cat = category === "Все" || (category === "Dog Friendly" && p.dogFriendly) || (category === "Другие места" && p.category !== "Кофейня" && p.category !== "Ресторан") || p.category === category;
    return cat && (!params.get("mood") || p.mood === params.get("mood")) && (!params.get("budget") || p.budget === params.get("budget")) && (!params.get("company") || p.company.includes(params.get("company")!)) && (!params.get("duration") || p.duration === params.get("duration"));
  }), [category, params]);

  useEffect(() => {
    if (!document.querySelector('link[data-leaflet-css="true"]')) {
      const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; l.dataset.leafletCss = "true"; document.head.appendChild(l);
    }
    if (window.L) return setReady(true);
    const old = document.querySelector('script[data-leaflet-js="true"]') as HTMLScriptElement | null;
    if (old) { old.addEventListener("load", () => setReady(true)); return; }
    const s = document.createElement("script"); s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; s.async = true; s.dataset.leafletJs = "true"; s.onload = () => setReady(true); document.body.appendChild(s);
  }, []);

  useEffect(() => {
    if (!ready || !container.current || map.current) return;
    map.current = window.L.map(container.current, { zoomControl: false }).setView([59.9386, 30.3141], 11);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map.current);
    window.L.control.zoom({ position: "bottomright" }).addTo(map.current);
  }, [ready]);

  const buildRoute = async (place: MapPlace) => {
    if (!navigator.geolocation || !map.current) { setRouteStatus("Не удалось определить ваше местоположение"); return; }
    setSelected(place.id); setRouteStatus("Определяем ваше местоположение…");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        setRouteStatus("Строим маршрут…");
        const url = `https://router.project-osrm.org/route/v1/driving/${coords.longitude},${coords.latitude};${place.lng},${place.lat}?overview=full&geometries=geojson&steps=true`;
        const res = await fetch(url); if (!res.ok) throw new Error();
        const data = await res.json(); const route = data.routes?.[0]; if (!route) throw new Error();
        if (routeLayer.current) routeLayer.current.remove();
        if (userMarker.current) userMarker.current.remove();
        userMarker.current = window.L.circleMarker([coords.latitude, coords.longitude], { radius: 8, weight: 3, color: "#111", fillColor: "#fff", fillOpacity: 1 }).addTo(map.current).bindTooltip("Вы здесь");
        routeLayer.current = window.L.geoJSON(route.geometry, { style: { color: "#111", weight: 5, opacity: .9 } }).addTo(map.current);
        map.current.fitBounds(routeLayer.current.getBounds(), { padding: [45, 45] });
        const km = route.distance / 1000; const min = Math.max(1, Math.round(route.duration / 60));
        setRouteStatus(`${km.toFixed(1).replace(".", ",")} км · примерно ${min} мин`);
      } catch { setRouteStatus("Маршрут сейчас не удалось построить. Попробуйте ещё раз."); }
    }, () => setRouteStatus("Разрешите ALMA доступ к геопозиции, чтобы построить маршрут."), { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  };

  useEffect(() => {
    window.almaRouteTo = (id: number) => { const p = mapPlaces.find((x) => x.id === id); if (p) buildRoute(p); };
    return () => { delete window.almaRouteTo; };
  });

  useEffect(() => {
    if (!ready || !map.current) return;
    markers.current.forEach((m) => m.marker.remove()); markers.current = [];
    filtered.forEach((p) => {
      const icon = window.L.divIcon({ className: "alma-marker-wrapper", html: `<div class="alma-marker">${emoji(p)}</div>`, iconSize: [40,40], iconAnchor: [20,20] });
      const marker = window.L.marker([p.lat, p.lng], { icon }).addTo(map.current);
      marker.bindPopup(`<div class="alma-popup"><div class="alma-popup-category">${p.category}</div><div class="alma-popup-title">${p.name}</div>${p.rating ? `<div class="alma-popup-rating">★ ${p.rating.toFixed(1)} / 5</div>` : ""}<div class="alma-popup-address">${p.address}</div><button class="alma-route-button" onclick="window.almaRouteTo(${p.id})">Маршрут от меня →</button><a href="${p.detailHref}" class="alma-popup-button">Подробнее</a></div>`, { maxWidth: 330, minWidth: 290, className: "alma-leaflet-popup" });
      marker.on("click", () => setSelected(p.id)); markers.current.push({ id: p.id, marker });
    });
  }, [filtered, ready]);

  const focus = (p: MapPlace) => { setSelected(p.id); map.current?.flyTo([p.lat,p.lng],15,{duration:1}); const m=markers.current.find(x=>x.id===p.id); if(m) setTimeout(()=>m.marker.openPopup(),400); };

  useEffect(() => { if (!placeId || !ready || !map.current || !markers.current.length) return; const p=mapPlaces.find(x=>x.id===Number(placeId)); if(p) setTimeout(()=>focus(p),100); }, [placeId, ready, filtered]);

  return <section className="bg-[#f7f4ef] pb-10 text-black"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="mb-3"><p className="text-xs uppercase tracking-[0.22em] text-neutral-500">ALMA · Санкт-Петербург</p><h2 className="mt-2 text-3xl sm:text-4xl font-bold">Карта</h2><p className="mt-2 text-neutral-500">Выбери категорию или найди конкретное заведение.</p></div>
    <div className="mb-4 flex flex-wrap gap-2">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={`rounded-full px-4 py-2.5 text-sm ${category===c?"bg-black text-white":"bg-white border border-black/5"}`}>{c}</button>)}</div>
    <div className="grid lg:grid-cols-[390px_minmax(0,1fr)] gap-5 lg:gap-6 items-start">
      <div className="order-2 lg:order-1 bg-white rounded-[28px] border border-black/5 overflow-hidden lg:mt-[52px]"><div className="px-6 pt-6 pb-4 border-b border-black/5"><p className="font-semibold text-lg">Список мест</p><p className="mt-1 text-sm text-neutral-500">Выбери карточку — покажем точку справа.</p></div><div className="max-h-[700px] overflow-y-auto p-3">{filtered.map(p=><div key={p.id} className={`rounded-[22px] p-3 mb-2 ${selected===p.id?"bg-black text-white":"hover:bg-[#f5f2ed]"}`}><button onClick={()=>focus(p)} className="w-full text-left"><p className="text-xs opacity-60">{p.category}</p><h3 className="mt-1 font-semibold">{p.name}</h3>{p.rating&&<p className="mt-1 text-xs opacity-70">★ {p.rating.toFixed(1)} / 5</p>}<p className="mt-2 text-xs opacity-70">{p.address}</p></button><button onClick={()=>buildRoute(p)} className={`mt-3 w-full rounded-full px-4 py-2.5 text-sm font-medium ${selected===p.id?"bg-white text-black":"bg-[#f3f1ed] text-black"}`}>Маршрут от меня →</button></div>)}</div></div>
      <div className="order-1 lg:order-2"><div className="mb-3 flex justify-start lg:justify-end"><MapDirectSearch /></div><div className="alma-map relative min-h-[560px] lg:min-h-[760px] rounded-[28px] overflow-hidden bg-[#ebe8e3] border border-black/5"><div ref={container} className="absolute inset-0"/>{!ready&&<div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#ebe8e3]">Загружаем…</div>}{routeStatus&&<div className="absolute z-[600] left-4 top-4 max-w-[calc(100%-32px)] rounded-2xl bg-white px-4 py-3 text-sm font-medium shadow-lg">{routeStatus}</div>}<div className="absolute z-[500] left-4 bottom-4 rounded-full bg-black text-white px-4 py-2 text-sm font-semibold">alma</div></div></div>
    </div></div>
    <style jsx global>{`.alma-map .leaflet-tile-pane{filter:grayscale(.82) sepia(.1) saturate(.42) brightness(1.08) contrast(.87)}.alma-map .leaflet-control-container{position:relative;z-index:500}.alma-marker-wrapper{background:transparent;border:none}.alma-marker{width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:#fff;box-shadow:0 6px 18px rgba(0,0,0,.2);font-size:18px}.alma-leaflet-popup .leaflet-popup-content-wrapper{padding:0!important;border-radius:24px!important;overflow:hidden}.alma-leaflet-popup .leaflet-popup-content{margin:0!important;width:300px!important}.alma-popup{padding:20px;color:#111}.alma-popup-category{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#999}.alma-popup-title{margin-top:6px;font-size:22px;font-weight:700}.alma-popup-rating,.alma-popup-address{margin-top:9px;font-size:12px}.alma-popup-address{color:#666}.alma-route-button,.alma-popup-button{display:flex;width:100%;justify-content:center;margin-top:12px;min-height:42px;align-items:center;border-radius:999px;font-size:13px;font-weight:600}.alma-route-button{background:#111;color:#fff;border:0;cursor:pointer}.alma-popup-button{background:#f3f1ed;color:#111!important;text-decoration:none!important}`}</style>
  </section>;
}
