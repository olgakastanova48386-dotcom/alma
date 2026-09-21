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
type HeroTheme = { image: string; position: string; label: string };

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

function getHeroTheme(code: number | undefined, isDay: boolean, hour: number): HeroTheme {
  const isDrizzle = [51, 53, 55, 56, 57].includes(code ?? -1);

  const isEveningOrNight = hour >= 18 || hour < 7;

  if (isDrizzle && isEveningOrNight) {
    return { image: "/images/дождь в питере ночь.jpg", position: "center 45%", label: "Морось в Петербурге" };
  }

  if (isDrizzle) {
    return { image: "/images/питер морось.jpg", position: "center 48%", label: "Морось в Петербурге" };
  }

  if (!isDay) {
    if (false) {
      return { image: "/images/дождь в питере ночь.jpg", position: "center 45%", label: "Морось в Петербурге" };
    }

    if ([45, 48, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99].includes(code ?? -1)) {
      return { image: "/images/ночной питербург.jpg", position: "center 42%", label: "Ночной Петербург" };
    }

    return { image: "/images/питер ночью.jpg", position: "center 45%", label: "Петербург ночью" };
  }

  if (code === 0) return { image: "/images/питер главная фотка 4.jpg", position: "center 42%", label: "Ясный Петербург" };
  if ([1, 2].includes(code ?? -1)) return { image: "/images/питер главная фотка.jpg", position: "center 42%", label: "Петербург в переменной облачности" };
  if (code === 3) return { image: "/images/питер главная фотка 2.jpg", position: "center 42%", label: "Пасмурный Петербург" };
  if ([45, 48].includes(code ?? -1)) return { image: "/images/пиер главная фотка 3.jpg", position: "center 42%", label: "Петербург в тумане" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code ?? -1)) return { image: "/images/питер главная фотка 5.jpg", position: "center 46%", label: "Петербург под дождём" };
  if ([71, 73, 75, 77, 85, 86].includes(code ?? -1)) return { image: "/images/питер главная фотка 2.jpg", position: "center 42%", label: "Снежный Петербург" };
  if ([95, 96, 99].includes(code ?? -1)) return { image: "/images/пиер главная фотка 3.jpg", position: "center 42%", label: "Драматичный Петербург" };
  return { image: "/images/питер главная фотка.jpg", position: "center 42%", label: "Петербург сегодня" };
}

export default function HomePage() {
  const router = useRouter();
  const [weather, setWeather] = useState<Weather | null>(null);

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
        }
      } catch {}
    };
    loadWeather();
  }, []);

  const scrollToFilters = () => document.getElementById("alma-filters")?.scrollIntoView({ behavior: "smooth", block: "center" });
  const scrollToPhotozones = () => document.getElementById("alma-photozones")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const openPlace = (title: string) => {
    const id = placeIds[title];
    router.push(id ? `/place/${id}` : "/map");
  };
  const isDay = weather?.isDay ?? getPetersburgIsDay();
  const weatherInfo = weather ? getWeatherInfo(weather.code, isDay) : null;
  const petersburgHour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Moscow", hour: "2-digit", hour12: false }).format(new Date()));
  const heroTheme = getHeroTheme(weather?.code, isDay, petersburgHour);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f4ef] text-black">
      <section className="alma-home-hero relative h-[390px] sm:h-[430px] md:h-auto md:min-h-[680px] flex items-start md:items-center pt-0 md:pt-28 pb-0 overflow-hidden bg-[#f7f4ef] text-black">
        <div className="alma-home-hero-image md:hidden absolute inset-0 overflow-hidden bg-[#171614]"><img key={`mobile-bg-${heroTheme.image}`} src={heroTheme.image} alt={heroTheme.label} className="absolute inset-0 h-full w-full object-cover brightness-[1.08] contrast-[0.9] saturate-[0.88] transition-opacity duration-700" style={{ objectPosition: "center 42%" }} /></div>
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-[#171614]/78" />
        <div className="hidden md:block absolute inset-0 bg-[#f7f4ef]" />
        <div className="hidden md:block absolute z-[2] right-[2%] lg:right-[7%] xl:right-[10%] top-32 bottom-0 w-[360px] lg:w-[440px] xl:w-[490px] pointer-events-none"><div className="relative h-full w-full overflow-hidden rounded-[36px] lg:rounded-[42px] shadow-[0_35px_80px_rgba(0,0,0,.20)] ring-1 ring-black/5 bg-neutral-200"><img key={heroTheme.image} src={heroTheme.image} alt={heroTheme.label} className="h-full w-full object-cover transition-opacity duration-700" style={{ objectPosition: heroTheme.position }} /><div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-white/5" /></div></div>

        {weather && weatherInfo && <div className="absolute right-4 top-[68px] z-20 md:hidden"><div className="inline-flex items-center gap-1.5 rounded-full bg-black/72 px-2.5 py-1.5 text-white shadow-sm backdrop-blur-md"><span className="text-sm leading-none">{weatherInfo.icon}</span><span className="text-xs font-semibold">{Math.round(weather.temperature) > 0 ? "+" : ""}{Math.round(weather.temperature)}°</span><span className="h-3 w-px bg-white/20" /><span className="text-[11px] text-white/75">{weatherInfo.text}</span></div></div>}

        <div className="absolute inset-x-0 bottom-3 z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-4 md:relative md:inset-auto md:bottom-auto lg:px-8"><div className="max-w-[760px]">
          {weather && weatherInfo && <div className="hidden md:block mb-3"><div className="inline-flex items-center gap-2.5 rounded-full bg-black/80 backdrop-blur-md text-white px-3.5 md:px-4 py-2.5 shadow-sm"><span className="text-lg leading-none">{weatherInfo.icon}</span><span className="font-semibold">{Math.round(weather.temperature) > 0 ? "+" : ""}{Math.round(weather.temperature)}°</span><span className="w-px h-4 bg-white/20" /><span className="text-sm text-white/75">{weatherInfo.text}</span><span className="hidden xs:inline text-xs text-white/40">Петербург</span></div></div>}
          <h1 className="mt-0 md:mt-7 max-w-full text-[clamp(25px,7vw,82px)] font-bold leading-[1.02] md:leading-[0.98] tracking-tight text-white md:text-black drop-shadow-[0_2px_12px_rgba(0,0,0,.28)] md:drop-shadow-none break-words">Места, в которые<br />хочется вернуться</h1>
          <p className="mt-1.5 md:mt-7 max-w-[94%] md:max-w-xl text-[13px] md:text-xl leading-[1.35] md:leading-8 text-white/82 md:text-neutral-600"><span className="md:hidden">ALMA помогает находить места Петербурга<br />по настроению, бюджету, компании и времени.</span><span className="hidden md:inline">ALMA помогает находить места Петербурга по настроению, бюджету, компании и времени.</span></p>
          <div className="mt-2.5 md:mt-9 grid grid-cols-3 gap-1.5 md:flex md:flex-wrap md:gap-3">
            <button type="button" onClick={scrollToFilters} className="min-w-0 overflow-hidden whitespace-nowrap rounded-full bg-white text-black md:bg-black md:text-white px-1.5 md:px-7 py-2.5 md:py-4 text-[8px] md:text-base font-semibold leading-none hover:opacity-80 hover:scale-[1.02] transition">Найти место</button>
            <button type="button" onClick={() => router.push("/surprise?new=1")} className="group relative min-w-0 overflow-hidden whitespace-nowrap rounded-full border border-[#f4d37c] bg-[#f4d37c] px-3 py-2.5 text-[11px] font-bold leading-none text-black shadow-[0_14px_32px_-10px_rgba(118,82,0,.38)] ring-2 ring-[#f4d37c]/35 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.06] hover:bg-[#ffe39a] hover:shadow-[0_12px_38px_rgba(244,211,124,.72)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4d37c]/50 md:px-7 md:py-4 md:text-base"><span className="alma-cta-shine pointer-events-none absolute -inset-y-2 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/85 to-transparent blur-[1px]" aria-hidden="true"/><span className="relative z-10"><span className="mr-1.5" aria-hidden="true">✦</span>Удиви меня</span></button>
            <button type="button" onClick={scrollToPhotozones} className="min-w-0 overflow-hidden whitespace-nowrap rounded-full bg-black/55 md:bg-white/80 backdrop-blur-md border border-white/25 md:border-black/10 text-white md:text-black px-1.5 md:px-7 py-2.5 md:py-4 text-[8px] md:text-base font-medium leading-none hover:scale-[1.02] transition shadow-sm">📸 Фотозоны</button>
          </div>
        </div></div>
        <div className="absolute z-10 bottom-8 right-8 hidden lg:flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-neutral-500"><span className="w-8 h-px bg-black/20" />{heroTheme.label}</div>
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
            <button type="button" onClick={() => router.push("/photozones/add")} className="mt-3 sm:mt-5 inline-flex min-h-10 sm:min-h-11 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#f4d37c]">＋ Добавить фотолокацию</button>
          </div>
          <div className="mt-4 sm:mt-9 columns-2 lg:columns-4 gap-3 sm:gap-4">
            {photozones.map((place, index) => <button key={place.title} type="button" onClick={() => openPlace(place.title)} aria-label={`Открыть ${place.title}`} className="group relative mb-3 sm:mb-4 block w-full break-inside-avoid overflow-hidden rounded-[22px] sm:rounded-[28px] bg-white/5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"><div className={`${index === 0 || index === 3 ? "h-[260px] sm:h-[500px]" : "h-[210px] sm:h-[390px]"} relative`}><img src={place.image} alt={place.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/5" /><span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] text-black">{place.tag}</span><div className="absolute left-3 right-3 bottom-4 sm:left-4 sm:right-4"><p className="text-[11px] sm:text-xs text-white/55 line-clamp-1">{place.time}</p><h3 className="mt-1 line-clamp-2 min-h-[2.2em] max-w-full text-[16px] sm:text-[22px] font-bold leading-[1.08] text-white break-normal">{place.title}</h3></div></div></button>)}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-14 text-black"><div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-5 mb-4 sm:mb-9"><div><h2 className="mt-3 sm:mt-4 max-w-full text-[clamp(27px,8vw,48px)] font-bold tracking-tight leading-tight text-black break-words">Популярные места</h2></div><button type="button" onClick={() => router.push("/map")} className="self-start rounded-full border border-black/10 bg-white px-5 sm:px-6 py-3 text-sm font-medium hover:bg-black hover:text-white transition">Смотреть все →</button></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">{places.map((place) => <button key={place.title} type="button" onClick={() => openPlace(place.title)} className="group relative min-h-[270px] sm:min-h-[420px] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-neutral-200 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"><img src={place.image} alt={place.title} className={`absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.04] ${place.title === "Петропавловская крепость" ? "object-top" : "object-center"}`} /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" /><div className="absolute top-4 left-4"><span className="inline-flex rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-xs text-black">{place.category}</span></div><div className="absolute left-5 right-5 bottom-5"><h3 className="line-clamp-2 max-w-full text-[clamp(20px,6vw,24px)] font-bold text-white leading-tight break-normal">{place.title}</h3></div></button>)}</div></section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-7 sm:pb-16 text-black"><div className="overflow-hidden rounded-[20px] sm:rounded-[28px] bg-[#e9e4dc] p-4 sm:p-8 sm:p-8 lg:p-10 text-black"><div className="max-w-3xl"><p className="text-xs uppercase tracking-[0.22em] text-neutral-500">ALMA</p><h2 className="mt-2 sm:mt-4 max-w-full text-[clamp(23px,6vw,44px)] font-bold tracking-tight leading-[1.04] text-black break-words [overflow-wrap:anywhere]">Петербург под твоё настроение</h2><p className="mt-2 sm:mt-4 text-[13px] sm:text-base text-neutral-600 leading-6 sm:leading-7 max-w-2xl">Не нужно заранее знать, куда именно идти. Достаточно понять, чего хочется сегодня.</p><button type="button" onClick={scrollToFilters} className="mt-4 sm:mt-6 rounded-full bg-black text-white px-6 py-3 font-medium hover:opacity-80 transition">Подобрать место</button></div></div></section>
    </main>
  );
}
