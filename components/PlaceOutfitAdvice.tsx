"use client";

import { useEffect, useMemo, useState } from "react";

type Weather = {
  temperature: number;
  apparent: number;
  precipitation: number;
  wind: number;
  code: number;
};

type Props = {
  lat: number;
  lng: number;
  category: string;
};

function isOutdoorCategory(category: string) {
  const value = category.toLowerCase();
  return ["парк", "набереж", "пространство", "смотров", "прогул", "остров", "пляж", "крыша"].some((item) => value.includes(item));
}

function weatherEmoji(code: number) {
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  if ([1, 2, 3, 45, 48].includes(code)) return "☁️";
  return "☀️";
}

function buildAdvice(weather: Weather, outdoor: boolean) {
  const t = weather.apparent;
  const wet = weather.precipitation > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weather.code);
  const windy = weather.wind >= 24;

  const clothes =
    t <= -10 ? "тёплый пуховик, шапка, перчатки и утеплённая обувь" :
    t <= 0 ? "зимняя куртка, шапка и тёплая обувь" :
    t <= 7 ? "пальто или тёплая куртка и закрытая обувь" :
    t <= 13 ? "лёгкая куртка или тренч со свитером" :
    t <= 18 ? "жакет, кардиган или лёгкая куртка" :
    t <= 24 ? "лёгкий слой: рубашка, лонгслив или тонкий жакет" :
    "лёгкая одежда из дышащих тканей";

  const extras: string[] = [];
  if (wet) extras.push("возьми зонт или непромокаемый верх");
  if (windy) extras.push("лучше выбрать верхний слой, который не продувается");
  if (outdoor && t <= 12) extras.push("для долгой прогулки оденься чуть теплее обычного");
  if (!outdoor && t >= 10) extras.push("внутри будет теплее, поэтому удобнее одеться слоями");

  return `${clothes.charAt(0).toUpperCase()}${clothes.slice(1)}${extras.length ? `. ${extras.join("; ")}.` : "."}`;
}

export default function PlaceOutfitAdvice({ lat, lng, category }: Props) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const outdoor = useMemo(() => isOutdoorCategory(category), [category]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`;
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error("weather");
        const data = await response.json();
        if (cancelled) return;
        setWeather({
          temperature: Number(data.current.temperature_2m),
          apparent: Number(data.current.apparent_temperature),
          precipitation: Number(data.current.precipitation),
          wind: Number(data.current.wind_speed_10m),
          code: Number(data.current.weather_code),
        });
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => { cancelled = true; };
  }, [lat, lng]);

  return (
    <div className="mt-4 rounded-[24px] bg-[#eef0e7] border border-black/5 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="text-2xl" aria-hidden="true">{weather ? weatherEmoji(weather.code) : "🧥"}</div>
        <div className="min-w-0">
          <p className="text-sm text-neutral-500">Что надеть сюда сегодня</p>
          {status === "loading" && <p className="mt-2 font-medium">Смотрим погоду рядом с местом…</p>}
          {status === "error" && <p className="mt-2 font-medium">Не удалось получить погоду. Ориентируйся на прогноз перед выходом.</p>}
          {status === "ready" && weather && (
            <>
              <p className="mt-2 text-lg font-semibold">{buildAdvice(weather, outdoor)}</p>
              <p className="mt-2 text-sm text-neutral-500">Сейчас {Math.round(weather.temperature)}°C, ощущается как {Math.round(weather.apparent)}°C · ветер {Math.round(weather.wind)} км/ч</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
