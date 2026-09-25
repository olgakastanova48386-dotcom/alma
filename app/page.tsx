"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UnifiedMap from "@/components/UnifiedMap";
import NeuralSculpture from "@/components/NeuralSculpture";

const places = [
  { title: "Русский музей", category: "Музей", image: "/images/русский музей.jpg" },
  { title: "Петергоф", category: "Музей-заповедник", image: "/images/петергоф.jpg" },
  { title: "Эрмитаж", category: "Музей", image: "/images/эрмитаж.jpg" },
  { title: "Спас на Крови", category: "Архитектура", image: "/images/спас на крови.jpg" },
  { title: "Петропавловская крепость", category: "История", image: "/images/петропавловская крепость.jpg" },
  { title: "Исаакиевский собор", category: "Архитектура", image: "/images/иссакиевский собор.jpg" },
  { title: "Дворцовая площадь", category: "Архитектура", image: "/images/дворцовая площадь.jpg" },
  { title: "Новая Голландия", category: "Отдых", image: "/images/new-holland.jpg" },
];

const photozones = [
  { title: "Кафе Зингер", tag: "Архитектура", image: "/images/кафе зингер.jpg", time: "Днём · у окна" },
  { title: "Поцелуев мост", tag: "Романтика", image: "/images/kisses-bridge.jpg", time: "Перед закатом" },
  { title: "Дворцовая площадь", tag: "Архитектура", image: "/images/isaac.jpg", time: "Утро · золотой час" },
  { title: "Падел-клуб «Ракета»", tag: "Индустриальная эстетика", image: "/images/падл адрес ракета кожевенная линия, 27.jpg", time: "Днём или вечером · в помещении" },
  { title: "Новая Голландия", tag: "Городская эстетика", image: "/images/new-holland.jpg", time: "После 16:00" },
  { title: "Академия Штиглица", tag: "Детали", image: "/images/shtiglitz.jpg", time: "Днём" },
];

const placeIds: Record<string, number> = {
  "Русский музей": 64,
  "Петергоф": 114,
  "Эрмитаж": 63,
  "Спас на Крови": 71,
  "Петропавловская крепость": 62,
  "Исаакиевский собор": 72,
  "Дворцовая площадь": 1,
  "Новая Голландия": 8,
  "Падел-клуб «Ракета»": 5002,
  "Кафе Зингер": 5003,
};

type Weather = { temperature: number; code: number; isDay: boolean };

function getPetersburgIsDay() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Moscow",
      hour: "2-digit",
      hour12: false,
    }).format(new Date()),
  );

  return hour >= 7 && hour < 22;
}

function getWeatherInfo(code: number, isDay: boolean) {
  if (code === 0) return { icon: isDay ? "☀️" : "🌙", text: "Ясно" };
  if ([1, 2].includes(code)) return { icon: isDay ? "🌤️" : "🌙", text: "Малооблачно" };
  if (code === 3) return { icon: "☁️", text: "Облачно" };
  if ([45, 48].includes(code)) return { icon: "🌫️", text: "Туман" };
  if ([51, 53, 55, 56, 57].includes(code)) return { icon: "🌦️", text: "Морось" };
  if ([61, 63, 65, 66, 67].includes(code)) return { icon: "🌧️", text: "Дождь" };
  if ([71, 73, 75, 77].includes(code)) return { icon: "🌨️", text: "Снег" };
  if ([80, 81, 82].includes(code)) return { icon: "🌦️", text: "Ливень" };
  if ([85, 86].includes(code)) return { icon: "🌨️", text: "Снегопад" };
  if ([95, 96, 99].includes(code)) return { icon: "⛈️", text: "Гроза" };
  return { icon: "🌤️", text: "Погода" };
}

function getHeroImage(weather: Weather | null) {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Moscow", hour: "2-digit", hour12: false }).format(new Date()));
  const rainy = weather && [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weather.code);
  if (rainy) return hour >= 20 || hour < 7 ? "/images/дождь в питере ночь.jpg" : "/images/питер морось.jpg";
  if (hour < 7 || hour >= 22) return "/images/ночной питербург.jpg";
  if (hour < 11) return "/images/утро питера.jpg";
  if (hour >= 18) return "/images/закат в питере.jpg";
  return weather?.code === 3 ? "/images/облачно день.jpg" : "/images/питер главная фотка.jpg";
}

export default function HomePage() {
  const router = useRouter();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [mobileReady, setMobileReady] = useState(false);
  const [splashMinElapsed, setSplashMinElapsed] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=59.9386&longitude=30.3141&current=temperature_2m,weather_code,is_day&timezone=Europe%2FMoscow");
        if (!response.ok) return;
        const data = await response.json();
        const temperature = data?.current?.temperature_2m;
        const code = data?.current?.weather_code;
        const isDay = data?.current?.is_day;
        if (typeof temperature === "number" && typeof code === "number" && typeof isDay === "number") {
          setWeather({ temperature, code, isDay: isDay === 1 });
          setLoadingProgress((value) => Math.max(value, 45));
        }
      } catch {}
    };
    loadWeather();
  }, []);

  useEffect(() => {
    const minTimer = window.setTimeout(() => setSplashMinElapsed(true), 1400);
    const progressTimer = window.setInterval(() => {
      setLoadingProgress((value) => Math.min(92, value + Math.max(1, Math.round((92 - value) * 0.09))));
    }, 70);
    return () => { window.clearTimeout(minTimer); window.clearInterval(progressTimer); };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { setLoadingProgress((value) => Math.max(value, 92)); setMobileReady(true); }, 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mobileReady || !splashMinElapsed) return;
    const doneTimer = window.setTimeout(() => { setLoadingProgress(100); setSplashDone(true); }, 400);
    return () => window.clearTimeout(doneTimer);
  }, [mobileReady, splashMinElapsed]);

  const scrollToFilters = () => document.getElementById("alma-filters")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const openPlace = (title: string) => {
    const id = placeIds[title];
    router.push(id ? `/place/${id}` : "/#alma-filters");
  };
  const isDay = weather?.isDay ?? getPetersburgIsDay();
  const weatherInfo = weather ? getWeatherInfo(weather.code, isDay) : null;
  const heroImage = getHeroImage(weather);

  return (
    <>
      {!splashDone && (
        <div className="fixed inset-0 z-[99999] flex md:hidden flex-col items-center justify-center bg-[#f7f4ef] text-black" style={{ backgroundImage: "radial-gradient(circle at 50% 45%, #fff 0%, #f7f4ef 70%)" }}>
          <div className="text-[33px] font-bold tracking-[0.18em]">alma</div>
          <div role="progressbar" aria-label="Загрузка ALMA" aria-valuemin={0} aria-valuemax={100} aria-valuenow={loadingProgress} className="relative mt-7 flex h-[112px] w-[112px] items-center justify-center">
            <svg viewBox="0 0 112 112" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="56" cy="56" r="48" fill="none" stroke="#e9e5df" strokeWidth="3" />
              <circle cx="56" cy="56" r="48" fill="none" stroke="#242321" strokeWidth="3" strokeLinecap="round" strokeDasharray={301.6} strokeDashoffset={301.6 * (1 - loadingProgress / 100)} className="transition-all duration-500 ease-out" />
            </svg>
            <span className="text-[25px] font-semibold tracking-tight tabular-nums">{loadingProgress}<span className="ml-0.5 text-sm text-neutral-500">%</span></span>
          </div>
          <p className="mt-6 text-[12px] font-medium tracking-[0.04em] text-neutral-500">Готовим места для тебя</p>
        </div>
      )}
      <main className="alma-home-page relative min-h-screen overflow-x-hidden bg-transparent text-black">
      <section className="alma-home-hero alma-soft-hero">
        <div className="alma-soft-shell">
          <div className="alma-soft-grid">
            <div className="alma-soft-copy">
              <span className="alma-soft-eyebrow"><span className="alma-soft-dot" /> ТВОЙ ПЕТЕРБУРГ, ТВОЙ РИТМ</span>
              <h1>Город под<br /><em>твоё</em><br />настроение.</h1>
              <p>Выбери, чего хочется сегодня. ALMA найдёт место, прогулку или готовый маршрут.</p>
              <div className="alma-soft-actions">
                <button type="button" onClick={scrollToFilters} className="alma-soft-button alma-soft-button-main">Найти место <span aria-hidden="true">↗</span></button>
                <button type="button" onClick={() => router.push("/surprise?new=1")} className="alma-soft-button alma-soft-button-quiet">Удиви меня <span aria-hidden="true">✦</span></button>
              </div>
              <div className="alma-soft-note">ПО НАСТРОЕНИЮ <span>·</span> ПО БЮДЖЕТУ <span>·</span> БЕЗ ЛИШНИХ ПЛАНОВ</div>
            </div>
            <div className="alma-soft-art" aria-label="Живой цифровой цветок ALMA">
              <div className="alma-soft-stage">
                <div className="alma-soft-stage-head"><span>ALMA <small>ГОРОД ЧУВСТВУЕТ ТЕБЯ</small></span><span className="alma-soft-stage-mark">✳</span></div>
                <NeuralSculpture />
                <p>Город расцветает<br />под твоё настроение.</p>
                <span className="alma-soft-stage-arrow" aria-hidden="true">↗</span>
              </div>
              <div className="alma-soft-weather"><img src={heroImage} alt="Петербург сегодня" /><span>{weather && weatherInfo ? `${weatherInfo.text} · ${Math.round(weather.temperature) > 0 ? "+" : ""}${Math.round(weather.temperature)}°` : "Петербург сегодня"}</span></div>
              <div className="alma-soft-float-label" aria-hidden="true">01 / ИССЛЕДУЙ ГОРОД</div>
            </div>
          </div>
        </div>
      </section>

      <div id="alma-filters" className="alma-atlas-map-section relative z-10 pt-5 sm:pt-6 md:pt-12 lg:pt-14">
        <div className="alma-atlas-map-title max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div><span>02 / ЖИВОЙ АТЛАС</span><h2>Где окажемся<br />сегодня?</h2></div><p>Выбирай настроение, время и компанию. Карта покажет подходящие места.</p></div>
        <Suspense fallback={<section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8"><div className="flex min-h-[560px] items-center justify-center rounded-[28px] bg-[#ebe8e3] text-neutral-500">Загружаем карту…</div></section>}>
          <UnifiedMap />
        </Suspense>
      </div>

      <section id="alma-photozones" className="scroll-mt-24 bg-[#171614] text-white pt-4 pb-5 sm:pt-8 sm:pb-9 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="max-w-full text-[clamp(28px,7vw,64px)] font-bold tracking-tight leading-[.96] break-words">Фотолокации</h2>
            <button type="button" onClick={() => router.push("/photozones/add")} className="alma-pressable mt-3 sm:mt-5 inline-flex min-h-10 sm:min-h-11 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#f4d37c]">＋ Добавить фотолокацию</button>
          </div>
          <div className="mt-3 sm:mt-9 columns-2 lg:columns-4 gap-3 sm:gap-4">
            {photozones.map((place, index) => <button key={place.title} type="button" onClick={() => openPlace(place.title)} aria-label={`Открыть ${place.title}`} className="alma-photo-card group relative mb-3 sm:mb-4 block w-full break-inside-avoid overflow-hidden rounded-[22px] sm:rounded-[28px] bg-white/5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"><div className={`${index === 0 || index === 3 ? "h-[165px] sm:h-[500px]" : "h-[145px] sm:h-[390px]"} relative`}><img src={place.image} alt={place.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/5" /><span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] text-black">{place.tag}</span><div className="absolute left-3 right-3 bottom-4 sm:left-4 sm:right-4"><p className="text-[11px] sm:text-xs text-white/55 line-clamp-1">{place.time}</p><h3 className="mt-1 line-clamp-2 max-w-full text-[15px] sm:text-[22px] font-bold leading-[1.08] text-white break-normal">{place.title}</h3></div></div></button>)}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-12 lg:py-14 text-black"><div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-5 mb-3 sm:mb-9"><div><h2 className="mt-0 sm:mt-4 max-w-full text-[clamp(25px,7vw,48px)] font-bold tracking-tight leading-tight text-black break-words">Популярные места</h2></div><button type="button" onClick={scrollToFilters} className="alma-pressable self-start rounded-full border border-black/10 bg-white px-5 sm:px-6 py-3 text-sm font-medium hover:bg-black hover:text-white transition">Смотреть все →</button></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">{places.map((place) => <button key={place.title} type="button" onClick={() => openPlace(place.title)} className="alma-photo-card group relative min-h-[165px] sm:min-h-[420px] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-neutral-200 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"><img src={place.image} alt={place.title} className={`absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.04] ${place.title === "Петропавловская крепость" ? "object-top" : "object-center"}`} /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" /><div className="absolute top-4 left-4"><span className="inline-flex rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-xs text-black">{place.category}</span></div><div className="absolute left-4 right-4 bottom-4"><h3 className="line-clamp-2 max-w-full text-[clamp(20px,6vw,24px)] font-bold text-white leading-tight break-normal">{place.title}</h3></div></button>)}</div></section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-7 sm:pb-16 text-black"><div className="overflow-hidden rounded-[20px] sm:rounded-[28px] bg-[#e9e4dc] p-4 sm:p-8 sm:p-8 lg:p-10 text-black"><div className="max-w-3xl"><p className="text-xs uppercase tracking-[0.22em] text-neutral-500">ALMA</p><h2 className="mt-2 sm:mt-4 max-w-full text-[clamp(23px,6vw,44px)] font-bold tracking-tight leading-[1.04] text-black break-words [overflow-wrap:anywhere]">Петербург под твоё настроение</h2><p className="mt-2 sm:mt-4 text-[13px] sm:text-base text-neutral-600 leading-6 sm:leading-7 max-w-2xl">Не нужно заранее знать, куда именно идти. Достаточно понять, чего хочется сегодня.</p><button type="button" onClick={scrollToFilters} className="mt-4 sm:mt-6 rounded-full bg-black text-white px-6 py-3 font-medium hover:opacity-80 transition">Подобрать место</button></div></div></section>
    </main>
    </>
  );
}
