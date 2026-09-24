"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UnifiedMap from "@/components/UnifiedMap";

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

function AnimatedCityScene({ isDay, cloudy }: { isDay: boolean; cloudy: boolean }) {
  const skyTop = isDay ? "#426c84" : "#091625";
  const skyBottom = isDay ? "#c7a995" : "#57435b";
  const cityBack = isDay ? "#677485" : "#283347";
  const cityFront = isDay ? "#384a5b" : "#172333";
  const windowLight = isDay ? "#f2dbac" : "#f5cf85";

  return (
    <svg className="alma-city-scene" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Анимированный Петербург: собор, мост и отражения на воде">
      <defs>
        <linearGradient id="alma-animated-sky" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={skyTop} />
          <stop offset=".64" stopColor={skyBottom} />
          <stop offset="1" stopColor={isDay ? "#9b8390" : "#283146"} />
        </linearGradient>
        <radialGradient id="alma-animated-halo">
          <stop stopColor={isDay ? "#ffe1b3" : "#f1d49b"} stopOpacity=".58" />
          <stop offset="1" stopColor="#ffe1b3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="alma-animated-water" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={isDay ? "#536f7c" : "#22394a"} />
          <stop offset="1" stopColor={isDay ? "#263c51" : "#091a2b"} />
        </linearGradient>
        <mask id="alma-animated-bridge-cutouts">
          <rect width="1200" height="150" y="550" fill="white" />
          <path d="M35 665a105 105 0 0 1 210 0ZM260 665a105 105 0 0 1 210 0ZM485 665a105 105 0 0 1 210 0ZM710 665a105 105 0 0 1 210 0ZM935 665a105 105 0 0 1 210 0Z" fill="black" />
        </mask>
      </defs>
      <rect width="1200" height="800" fill="url(#alma-animated-sky)" />
      <ellipse className="alma-city-halo" cx="830" cy="192" rx="290" ry="240" fill="url(#alma-animated-halo)" />
      <circle className="alma-city-light" cx="830" cy="192" r={isDay ? "53" : "39"} fill={isDay ? "#f8dfb2" : "#f5e6c5"} opacity={isDay ? ".82" : ".9"} />
      <g className="alma-city-cloud-a" opacity={cloudy ? ".34" : ".16"} fill="#e8e4e0">
        <path d="M-100 190c74-38 132-42 212-8 82-53 147-36 218-4 68-15 112 2 160 32-157 39-378 34-590-20Z" />
        <path d="M620 140c72-25 123-15 165 12 86-36 158-25 230 21 79-9 118 8 166 38-187 20-388 15-561-71Z" />
      </g>
      <g className="alma-city-cloud-b" opacity={cloudy ? ".22" : ".1"} fill="#f6e9d9">
        <path d="M30 281c154-35 248-22 352 14 75-18 149-13 229 22-208 35-421 17-581-36Z" />
      </g>
      <path d="M0 464V353h58v-43h27v43h102v-69h38v69h83v-34h62v34h115v-21h78v132Zm700 0V344h49v-56h24v56h67v-30h43v30h98v-70h36v70h74v-34h47v34h62v120Z" fill={cityBack} />
      <path d="M0 542V400h74v-36h107v36h92v-58h54v58h150v142Zm746 0V391h75v-49h68v49h105v-31h67v31h139v151Z" fill={cityFront} />
      <g fill={windowLight} className="alma-city-windows" opacity={isDay ? ".42" : ".78"}>
        <path d="M50 433h6v11h-6zm32 0h6v11h-6zm32 0h6v11h-6zm32 0h6v11h-6zm-96 35h6v11h-6zm64 0h6v11h-6zm32 0h6v11h-6zm150-62h6v11h-6zm32 0h6v11h-6zm32 0h6v11h-6zm160 31h6v11h-6zm32 0h6v11h-6zm32 0h6v11h-6zm309-20h6v11h-6zm32 0h6v11h-6zm32 0h6v11h-6zm126-19h6v11h-6zm32 0h6v11h-6zm32 0h6v11h-6zm-64 33h6v11h-6zm32 0h6v11h-6z" />
      </g>
      <g className="alma-city-dome">
        <path d="M542 360c3-66 27-110 66-123 42 13 66 57 69 123Z" fill={isDay ? "#b2a28d" : "#a28a76"} />
        <path d="M549 359c8-56 27-95 59-107 35 12 55 51 62 107" fill="none" stroke={isDay ? "#e5d5b6" : "#d6b991"} strokeWidth="8" opacity=".7" />
        <path d="M592 234v-22h32v22m-16-23v-51m-10 19h20" stroke="#e8c99d" strokeWidth="6" fill="none" />
        <rect x="520" y="359" width="178" height="24" fill={isDay ? "#a39283" : "#695d60"} />
        <path d="M505 403h208l-24-24H529Z" fill={isDay ? "#c5b4a1" : "#8b7672"} />
        <rect x="511" y="403" width="196" height="139" fill={isDay ? "#9b928c" : "#554f5b"} />
        <path d="M523 422h172m-172 90h172" stroke={isDay ? "#ded0bd" : "#ad9a8e"} strokeWidth="7" />
        {Array.from({ length: 7 }, (_, index) => <rect key={index} x={530 + index * 25} y="430" width="8" height="83" fill={isDay ? "#d5c5af" : "#978d87"} />)}
        <path d="M485 542h251v17H485Z" fill={cityFront} />
      </g>
      <path d="M0 555H1200v105H0Z" fill="url(#alma-animated-water)" />
      <path d="M0 550h1200v112H0Z" fill={cityFront} mask="url(#alma-animated-bridge-cutouts)" />
      <path d="M0 548h1200m0 16H0" stroke={isDay ? "#c6ad91" : "#b69377"} strokeWidth="5" opacity=".8" />
      <path d="M0 568h1200" stroke="#d7b38b" strokeWidth="2" strokeDasharray="4 11" opacity=".5" />
      <g className="alma-city-lamps" fill="#f5d9a7">
        {[112, 338, 563, 788, 1012].map((x) => <g key={x}><path d={`M${x} 546v-29`} stroke="#2a3038" strokeWidth="4" /><circle cx={x} cy="514" r="5" /><circle cx={x} cy="514" r="22" fill="#f4c784" opacity=".12" /></g>)}
      </g>
      <rect y="662" width="1200" height="138" fill="url(#alma-animated-water)" />
      <g className="alma-city-reflections" stroke={isDay ? "#f2d3a5" : "#efc990"} strokeLinecap="round" opacity=".47" fill="none">
        <path d="M80 686h36m34 10h90m-82 21h47m285-32h130m-95 21h100m110-26h60m-23 34h112m150-19h80m-48 31h120" strokeWidth="3" />
        <path d="M92 744h72m90-24h48m275 34h102m114-12h47m160-32h90" strokeWidth="2" />
      </g>
      <g className="alma-city-boat" fill={isDay ? "#1b3546" : "#0c1a28"}>
        <path d="M270 692h96l-15 17h-62Z" /><path d="M318 692v-48m0 6 32 37h-32Z" stroke={isDay ? "#ead7bf" : "#d0c2b7"} strokeWidth="3" fill="none" />
      </g>
      <rect y="763" width="1200" height="37" fill={isDay ? "#1e3445" : "#071421"} opacity=".45" />
    </svg>
  );
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
    setLoadingProgress(100);
    const doneTimer = window.setTimeout(() => setSplashDone(true), 400);
    return () => window.clearTimeout(doneTimer);
  }, [mobileReady, splashMinElapsed]);

  const scrollToFilters = () => document.getElementById("alma-filters")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToPhotozones = () => document.getElementById("alma-photozones")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const openPlace = (title: string) => {
    const id = placeIds[title];
    router.push(id ? `/place/${id}` : "/#alma-filters");
  };
  const isDay = weather?.isDay ?? getPetersburgIsDay();
  const weatherInfo = weather ? getWeatherInfo(weather.code, isDay) : null;
  const cloudy = weather ? weather.code !== 0 : true;

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
      <main className="min-h-screen overflow-x-hidden bg-[#f7f4ef] text-black">
      <section className="alma-home-hero relative h-[390px] sm:h-[430px] md:h-auto md:min-h-[680px] flex items-start md:items-center pt-0 md:pt-28 pb-0 overflow-hidden bg-[#f7f4ef] text-black">
        <div className="alma-home-hero-image md:hidden absolute inset-0 overflow-hidden bg-[#101e2b]"><AnimatedCityScene isDay={isDay} cloudy={cloudy} /></div>
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#101720]/78" />
        <div className="hidden md:block absolute inset-0 bg-[#f7f4ef]" />
        <div className="hidden md:block absolute z-[2] right-[2%] lg:right-[7%] xl:right-[10%] top-32 bottom-0 w-[360px] lg:w-[440px] xl:w-[490px] pointer-events-none"><div className="relative h-full w-full overflow-hidden rounded-[36px] lg:rounded-[42px] shadow-[0_35px_80px_rgba(0,0,0,.20)] ring-1 ring-black/5 bg-[#101e2b]"><AnimatedCityScene isDay={isDay} cloudy={cloudy} /></div></div>

                {weather && weatherInfo && <div className="absolute right-4 top-[calc(env(safe-area-inset-top)+76px)] z-20 md:hidden"><div className="inline-flex items-center gap-1.5 rounded-full bg-black/72 px-2.5 py-1.5 text-white shadow-sm backdrop-blur-md"><span className="text-sm leading-none">{weatherInfo.icon}</span><span className="text-xs font-semibold">{Math.round(weather.temperature) > 0 ? "+" : ""}{Math.round(weather.temperature)}°</span><span className="h-3 w-px bg-white/20" /><span className="text-[11px] text-white/75">{weatherInfo.text}</span></div></div>}

        <div className="absolute inset-x-0 bottom-3 z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-4 md:relative md:inset-auto md:bottom-auto lg:px-8"><div className="max-w-[760px]">
          {weather && weatherInfo && <div className="hidden md:block mb-3"><div className="inline-flex items-center gap-2.5 rounded-full bg-black/80 backdrop-blur-md text-white px-3.5 md:px-4 py-2.5 shadow-sm"><span className="text-lg leading-none">{weatherInfo.icon}</span><span className="font-semibold">{Math.round(weather.temperature) > 0 ? "+" : ""}{Math.round(weather.temperature)}°</span><span className="w-px h-4 bg-white/20" /><span className="text-sm text-white/75">{weatherInfo.text}</span><span className="hidden xs:inline text-xs text-white/40">Петербург</span></div></div>}
          <h1 className="mt-0 md:mt-7 max-w-full text-[clamp(25px,7vw,82px)] font-bold leading-[1.02] md:leading-[0.98] tracking-tight text-white md:text-black drop-shadow-[0_2px_12px_rgba(0,0,0,.28)] md:drop-shadow-none break-words">Места, в которые<br />хочется вернуться</h1>
          <p className="mt-1.5 md:mt-7 max-w-[94%] md:max-w-xl text-[13px] md:text-xl leading-[1.35] md:leading-8 text-white/82 md:text-neutral-600"><span className="md:hidden">ALMA помогает находить места Петербурга<br />по настроению, бюджету, компании и времени.</span><span className="hidden md:inline">ALMA помогает находить места Петербурга по настроению, бюджету, компании и времени.</span></p>
          <div className="mt-2.5 md:mt-9 grid grid-cols-3 gap-1.5 md:flex md:flex-wrap md:gap-3">
            <button type="button" onClick={scrollToFilters} className="alma-pressable min-w-0 overflow-hidden whitespace-nowrap rounded-full bg-white text-black md:bg-black md:text-white px-1.5 md:px-7 py-2.5 md:py-4 text-[12px] md:text-base font-semibold leading-none hover:opacity-80 hover:scale-[1.02] transition">Найти место</button>
            <button type="button" onClick={() => router.push("/surprise?new=1")} className="alma-glow group relative min-w-0 overflow-hidden whitespace-nowrap rounded-full border border-[#f4d37c] bg-[#f4d37c] px-3 py-2.5 text-[11px] font-bold leading-none text-black shadow-[0_14px_32px_-10px_rgba(118,82,0,.38)] ring-2 ring-[#f4d37c]/35 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.06] hover:bg-[#ffe39a] hover:shadow-[0_12px_38px_rgba(244,211,124,.72)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4d37c]/50 md:px-7 md:py-4 md:text-base"><span className="alma-cta-shine pointer-events-none absolute -inset-y-2 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/85 to-transparent blur-[1px]" aria-hidden="true"/><span className="relative z-10"><span className="mr-1.5" aria-hidden="true">✦</span>Удиви меня</span></button>
            <button type="button" onClick={scrollToPhotozones} className="alma-pressable min-w-0 overflow-hidden whitespace-nowrap rounded-full bg-black/55 md:bg-white/80 backdrop-blur-md border border-white/25 md:border-black/10 text-white md:text-black px-1.5 md:px-7 py-2.5 md:py-4 text-[12px] md:text-base font-medium leading-none hover:scale-[1.02] transition shadow-sm">📸 Фотозоны</button>
          </div>
        </div></div>
        <div className="absolute z-10 bottom-8 right-8 hidden lg:flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-neutral-500"><span className="w-8 h-px bg-black/20" />Петербург в движении</div>
      </section>

      <div id="alma-filters" className="relative z-10 bg-[#f7f4ef] pt-5 sm:pt-6 md:pt-12 lg:pt-14">
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
