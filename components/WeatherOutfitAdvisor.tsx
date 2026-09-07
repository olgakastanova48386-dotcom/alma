"use client";

import { useEffect, useState } from "react";

type Weather = {
  temperature: number;
  apparent: number;
  precipitation: number;
  wind: number;
  code: number;
};

type Status = "idle" | "loading" | "denied" | "location-fallback" | "weather-error";

const SPB = { latitude: 59.9386, longitude: 30.3141 };

function weatherLabel(code: number) {
  if (code === 0) return "ясно";
  if ([1, 2].includes(code)) return "малооблачно";
  if (code === 3) return "облачно";
  if ([45, 48].includes(code)) return "туман";
  if ([51, 53, 55, 56, 57].includes(code)) return "морось";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "дождь";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "снег";
  if ([95, 96, 99].includes(code)) return "гроза";
  return "переменная погода";
}

function outfitAdvice(w: Weather) {
  const t = w.apparent;
  const wet = w.precipitation > 0 || [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(w.code);
  const windy = w.wind >= 25;
  const parts: string[] = [];
  if (t <= -10) parts.push("тёплый пуховик, шапка, шарф и перчатки");
  else if (t <= 0) parts.push("зимняя куртка, тёплый слой и закрытая обувь");
  else if (t <= 7) parts.push("тёплая куртка или пальто и закрытая обувь");
  else if (t <= 14) parts.push("лёгкая куртка или тренч со свитером");
  else if (t <= 20) parts.push("лёгкая куртка или плотная рубашка на вечер");
  else if (t <= 27) parts.push("лёгкая одежда; на вечер можно взять тонкий слой");
  else parts.push("лёгкая дышащая одежда и головной убор");
  if (wet) parts.push("зонт или непромокаемая куртка");
  if (windy) parts.push("ветрозащитный слой");
  return parts.join(" · ");
}

export default function WeatherOutfitAdvisor() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [open, setOpen] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const loadWeatherForCoords = async (latitude: number, longitude: number, fallback = false) => {
    try {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.searchParams.set("latitude", String(latitude));
      url.searchParams.set("longitude", String(longitude));
      url.searchParams.set("current", "temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m");
      url.searchParams.set("timezone", "auto");
      const response = await fetch(url.toString(), { cache: "no-store" });
      if (!response.ok) throw new Error("weather");
      const data = await response.json();
      const current = data?.current;
      if (!current || typeof current.temperature_2m !== "number" || typeof current.apparent_temperature !== "number" || typeof current.precipitation !== "number" || typeof current.wind_speed_10m !== "number" || typeof current.weather_code !== "number") throw new Error("weather-data");
      setWeather({ temperature: current.temperature_2m, apparent: current.apparent_temperature, precipitation: current.precipitation, wind: current.wind_speed_10m, code: current.weather_code });
      setUsingFallback(fallback);
      setStatus(fallback ? "location-fallback" : "idle");
    } catch {
      setStatus("weather-error");
    }
  };

  const loadSpbFallback = () => { void loadWeatherForCoords(SPB.latitude, SPB.longitude, true); };

  const requestLocation = (showPanel = false) => {
    if (showPanel) setOpen(true);
    if (status === "loading") return;
    if (!navigator.geolocation) { loadSpbFallback(); return; }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { void loadWeatherForCoords(coords.latitude, coords.longitude, false); },
      (error) => { if (error.code === error.PERMISSION_DENIED) setStatus("denied"); loadSpbFallback(); },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 30 * 60 * 1000 }
    );
  };

  useEffect(() => {
    let cancelled = false;
    const requestOnFirstVisit = async () => {
      if (!navigator.geolocation) { if (!cancelled) loadSpbFallback(); return; }
      try {
        if (navigator.permissions?.query) {
          const permission = await navigator.permissions.query({ name: "geolocation" as PermissionName });
          if (cancelled) return;
          if (permission.state === "denied") { setStatus("denied"); loadSpbFallback(); return; }
        }
      } catch {}
      if (!cancelled) requestLocation(false);
    };
    void requestOnFirstVisit();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="fixed bottom-5 left-4 z-[70] sm:left-6">
      {open && <div className="mb-3 w-[min(360px,calc(100vw-32px))] rounded-[24px] border border-black/10 bg-[#fffdf9]/95 p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.16em] text-neutral-500">ALMA · по погоде рядом</p><h3 className="mt-1 text-xl font-semibold text-black">Что надеть сегодня</h3></div><button type="button" onClick={() => setOpen(false)} className="rounded-full px-2 py-1 text-neutral-500 hover:bg-black/5" aria-label="Закрыть">×</button></div>
        {status === "loading" && <p className="mt-4 text-sm text-neutral-600">Определяю погоду рядом с тобой…</p>}
        {status === "weather-error" && <div className="mt-4"><p className="text-sm leading-6 text-neutral-600">Сейчас не получилось загрузить данные о погоде.</p><button type="button" onClick={() => requestLocation(false)} className="mt-3 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">Попробовать ещё раз</button></div>}
        {weather && <div className="mt-4">{usingFallback && <p className="mb-3 rounded-2xl bg-black/5 px-3 py-2 text-xs leading-5 text-neutral-600">Точное местоположение не определилось, поэтому пока показываю погоду по Санкт-Петербургу.</p>}<div className="flex flex-wrap items-center gap-2 text-sm"><span className="rounded-full bg-black px-3 py-1.5 font-semibold text-white">{Math.round(weather.temperature) > 0 ? "+" : ""}{Math.round(weather.temperature)}°</span><span className="rounded-full bg-black/5 px-3 py-1.5 text-neutral-700">ощущается {Math.round(weather.apparent) > 0 ? "+" : ""}{Math.round(weather.apparent)}°</span><span className="text-neutral-500">{weatherLabel(weather.code)}</span></div><p className="mt-4 text-[15px] leading-6 text-neutral-800">{outfitAdvice(weather)}</p><p className="mt-3 text-xs leading-5 text-neutral-400">Совет ориентировочный: учитывай свою чувствительность к холоду и длительность прогулки.</p></div>}
      </div>}
      <button type="button" onClick={() => { if (weather) { setOpen(true); return; } requestLocation(true); }} className="rounded-full border border-black/10 bg-black px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-[1.02] hover:bg-neutral-800">☁️ Что надеть?</button>
    </div>
  );
}
