"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const moods = ["Любое настроение", "Спокойно", "Романтика", "Вдохновиться", "Удивиться"];
const budgets = ["Любой", "300–1500 ₽", "2000–5000 ₽", "6000–10000 ₽", "от 10000 ₽"];
const companies = ["Любая", "Один", "Пара", "Друзья", "Семья"];
const durations = ["Любая", "До 1 часа", "1–2 часа", "2–4 часа", "Полдня"];

const places = [
  { title: "Исаакиевская площадь", category: "Архитектура", image: "/images/isaac.jpg" },
  { title: "Ботанический сад", category: "Прогулка", image: "/images/botanic.jpg" },
  { title: "Поцелуев мост", category: "Романтика", image: "/images/kisses-bridge.jpg" },
  { title: "Особняк Демидова", category: "Архитектура", image: "/images/demidov.jpg" },
  { title: "Академия Штиглица", category: "Искусство", image: "/images/shtiglitz.jpg" },
  { title: "Лахта Центр", category: "Современный Петербург", image: "/images/lahta-hero.jpg" },
  { title: "Водная прогулка", category: "Развлечения", image: "/images/hero.jpg" },
  { title: "Новая Голландия", category: "Отдых", image: "/images/new-holland.jpg" },
];

const photozones = [
  { title: "Поцелуев мост", tag: "Романтика", image: "/images/kisses-bridge.jpg", time: "Перед закатом" },
  { title: "Исаакиевская площадь", tag: "Архитектура", image: "/images/isaac.jpg", time: "Утро · золотой час" },
  { title: "Ракета · Кожевенная линия, 27", tag: "Индустриальная эстетика", image: "/images/падл адрес ракета кожевенная линия, 27.jpg", time: "Днём или вечером · в помещении" },
  { title: "Новая Голландия", tag: "Городская эстетика", image: "/images/new-holland.jpg", time: "После 16:00" },
  { title: "Академия Штиглица", tag: "Детали", image: "/images/shtiglitz.jpg", time: "Днём" },
];

type Weather = { temperature: number; code: number };
type HeroTheme = { image: string; position: string; label: string };

function getWeatherInfo(code: number) {
  if (code === 0) return { icon: "☀️", text: "Ясно" };
  if ([1, 2].includes(code)) return { icon: "🌤️", text: "Малооблачно" };
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

function getHeroTheme(code?: number): HeroTheme {
  if (code === 0) return { image: "/images/питер главная фотка 4.jpg", position: "center 42%", label: "Ясный Петербург" };
  if ([1, 2].includes(code ?? -1)) return { image: "/images/питер главная фотка.jpg", position: "center 42%", label: "Петербург в переменной облачности" };
  if (code === 3) return { image: "/images/питер главная фотка 2.jpg", position: "center 42%", label: "Пасмурный Петербург" };
  if ([45, 48].includes(code ?? -1)) return { image: "/images/пиер главная фотка 3.jpg", position: "center 42%", label: "Петербург в тумане" };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code ?? -1)) return { image: "/images/питер главная фотка 5.jpg", position: "center 46%", label: "Петербург под дождём" };
  if ([71, 73, 75, 77, 85, 86].includes(code ?? -1)) return { image: "/images/питер главная фотка 2.jpg", position: "center 42%", label: "Снежный Петербург" };
  if ([95, 96, 99].includes(code ?? -1)) return { image: "/images/пиер главная фотка 3.jpg", position: "center 42%", label: "Драматичный Петербург" };
  return { image: "/images/питер главная фотка.jpg", position: "center 42%", label: "Петербург сегодня" };
}

export default function HomePage() {
  const router = useRouter();
  const [mood, setMood] = useState("Любое настроение");
  const [budget, setBudget] = useState("Любой");
  const [company, setCompany] = useState("Любая");
  const [duration, setDuration] = useState("Любая");
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=59.9386&longitude=30.3141&current=temperature_2m,weather_code&timezone=Europe%2FMoscow");
        if (!response.ok) return;
        const data = await response.json();
        const temperature = data?.current?.temperature_2m;
        const code = data?.current?.weather_code;
        if (typeof temperature === "number" && typeof code === "number") setWeather({ temperature, code });
      } catch {}
    };
    loadWeather();
  }, []);

  const scrollToFilters = () => document.getElementById("alma-filters")?.scrollIntoView({ behavior: "smooth", block: "center" });
  const scrollToPhotozones = () => document.getElementById("alma-photozones")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const openMap = () => {
    const params = new URLSearchParams();
    if (mood !== "Любое настроение") params.set("mood", mood);
    if (budget !== "Любой") params.set("budget", budget);
    if (company !== "Любая") params.set("company", company);
    if (duration !== "Любая") params.set("duration", duration);
    const query = params.toString();
    router.push(query ? `/map?${query}` : "/map");
  };

  const renderDropdown = (label: string, value: string, options: string[], id: string, setter: (value: string) => void) => {
    const isOpen = openSelect === id;
    return <div className="relative"><p className="mb-2 text-xs uppercase tracking-[0.16em] text-white/40">{label}</p><button type="button" onClick={() => setOpenSelect(isOpen ? null : id)} className="w-full flex items-center justify-between gap-4 rounded-[18px] bg-white px-4 py-4 text-left text-black transition hover:bg-neutral-100"><span className="truncate">{value}</span><span className={`text-sm transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>↓</span></button>{isOpen && <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-[20px] bg-white p-2 shadow-2xl border border-black/5">{options.map(option => { const selected = option === value; return <button key={option} type="button" onClick={() => { setter(option); setOpenSelect(null); }} className={`w-full flex items-center justify-between gap-4 rounded-[14px] px-4 py-3 text-left text-sm transition ${selected ? "bg-black text-white" : "text-black hover:bg-neutral-100"}`}><span>{option}</span>{selected && <span>✓</span>}</button>; })}</div>}</div>;
  };

  const weatherInfo = weather ? getWeatherInfo(weather.code) : null;
  const heroTheme = getHeroTheme(weather?.code);

  return <main className="min-h-screen bg-[#f7f4ef]">
    <section className="relative min-h-0 md:min-h-[820px] flex items-center pt-24 sm:pt-28 pb-10 sm:pb-20 overflow-hidden bg-[#efe9e1] text-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_44%,rgba(255,255,255,0.95),rgba(239,233,225,0.65)_35%,rgba(226,216,205,0.95)_75%)]" />
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-white/45 blur-3xl" />
      <div className="hidden md:block absolute z-[2] right-[2%] lg:right-[7%] xl:right-[10%] top-32 bottom-10 w-[360px] lg:w-[440px] xl:w-[490px] pointer-events-none"><div className="relative h-full w-full overflow-hidden rounded-[36px] lg:rounded-[42px] shadow-[0_35px_80px_rgba(0,0,0,.20)] ring-1 ring-black/5 bg-neutral-200"><img key={heroTheme.image} src={heroTheme.image} alt={heroTheme.label} className="h-full w-full object-cover transition-opacity duration-700" style={{ objectPosition: heroTheme.position }} /><div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-white/5" /></div></div>
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"><div className="max-w-[760px]">
        {weather && weatherInfo && <div className="mb-3"><div className="inline-flex items-center gap-2.5 rounded-full bg-black/80 backdrop-blur-md text-white px-3.5 sm:px-4 py-2.5 shadow-sm"><span className="text-lg leading-none">{weatherInfo.icon}</span><span className="font-semibold">{Math.round(weather.temperature) > 0 ? "+" : ""}{Math.round(weather.temperature)}°</span><span className="w-px h-4 bg-white/20" /><span className="text-sm text-white/75">{weatherInfo.text}</span><span className="hidden xs:inline text-xs text-white/40">Петербург</span></div></div>}
        <div className="inline-flex rounded-full bg-white/70 backdrop-blur-md border border-black/5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm text-neutral-700 shadow-sm">✨ Открой Санкт-Петербург по-новому</div>
        <h1 className="mt-6 sm:mt-7 text-[42px] sm:text-6xl lg:text-7xl xl:text-[82px] font-bold leading-[0.98] tracking-tight text-black">Места, в которые<br />хочется вернуться</h1>
        <p className="mt-5 sm:mt-7 max-w-xl text-base sm:text-xl leading-7 sm:leading-8 text-neutral-600">ALMA помогает находить места Петербурга по настроению, бюджету, компании и времени.</p>
        <div className="mt-7 sm:mt-9 grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3"><button type="button" onClick={scrollToFilters} className="rounded-full bg-black text-white px-4 sm:px-7 py-3.5 sm:py-4 text-sm sm:text-base font-semibold hover:opacity-80 hover:scale-[1.02] transition">Найти место</button><button type="button" onClick={() => router.push("/surprise")} className="rounded-full bg-white/80 backdrop-blur-md border border-black/10 text-black px-4 sm:px-7 py-3.5 sm:py-4 text-sm sm:text-base font-medium hover:bg-white hover:scale-[1.02] transition shadow-sm">✦ Удиви меня</button><button type="button" onClick={scrollToPhotozones} className="rounded-full bg-white/80 backdrop-blur-md border border-black/10 text-black px-4 sm:px-7 py-3.5 sm:py-4 text-sm sm:text-base font-medium hover:bg-white hover:scale-[1.02] transition shadow-sm">📸 Фотозоны</button></div>
        <div className="md:hidden mt-8 relative h-[430px] w-full overflow-hidden rounded-[28px] shadow-[0_24px_55px_rgba(0,0,0,.18)] ring-1 ring-black/5 bg-neutral-200"><img key={`mobile-${heroTheme.image}`} src={heroTheme.image} alt={heroTheme.label} className="h-full w-full object-cover" style={{ objectPosition: heroTheme.position }} /><div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" /><div className="absolute left-4 bottom-4 rounded-full bg-black/70 backdrop-blur-md px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-white/80">{heroTheme.label}</div></div>
      </div></div><div className="absolute z-10 bottom-8 right-8 hidden lg:flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-neutral-500"><span className="w-8 h-px bg-black/20" />{heroTheme.label}</div>
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-28"><div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-7 sm:gap-10 lg:gap-20 items-end"><div><p className="text-xs uppercase tracking-[0.22em] text-neutral-500">ALMA · Санкт-Петербург</p><h2 className="mt-4 sm:mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.02]">Не просто<br />список мест</h2></div><p className="text-base sm:text-xl leading-7 sm:leading-8 text-neutral-500 max-w-2xl">Вместо бесконечного поиска выбирай, как ты хочешь провести время — а ALMA покажет подходящие места.</p></div></section>

    <section id="alma-filters" className="scroll-mt-32 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-14 sm:pb-28"><div className="rounded-[28px] sm:rounded-[44px] bg-black text-white p-5 sm:p-9 lg:p-12"><div><p className="text-xs uppercase tracking-[0.22em] text-white/40">Подбор места</p><h2 className="mt-3 sm:mt-4 text-[30px] sm:text-4xl lg:text-5xl leading-tight font-bold tracking-tight">Что тебе подходит сегодня?</h2><p className="mt-3 sm:mt-4 text-white/55 text-sm sm:text-lg max-w-2xl leading-6 sm:leading-7">Выбери настроение, бюджет, компанию и сколько времени хочется провести вне дома.</p></div><div className="mt-7 sm:mt-9 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{renderDropdown("Настроение", mood, moods, "mood", setMood)}{renderDropdown("Бюджет", budget, budgets, "budget", setBudget)}{renderDropdown("Компания", company, companies, "company", setCompany)}{renderDropdown("Длительность", duration, durations, "duration", setDuration)}</div><div className="mt-6 sm:mt-7 flex flex-col sm:flex-row sm:items-center gap-3"><button type="button" onClick={openMap} className="rounded-full bg-white text-black px-6 sm:px-8 py-4 font-semibold hover:scale-[1.02] transition">Показать подходящие места →</button><button type="button" onClick={() => { setMood("Любое настроение"); setBudget("Любой"); setCompany("Любая"); setDuration("Любая"); }} className="rounded-full border border-white/15 text-white/60 px-6 py-3.5 sm:py-4 hover:text-white hover:border-white/30 transition">Сбросить</button></div></div></section>

    <section id="alma-photozones" className="scroll-mt-24 bg-[#171614] text-white py-16 sm:py-28 overflow-hidden"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"><div><p className="text-xs uppercase tracking-[.24em] text-white/45">📸 ALMA · Фотозоны</p><h2 className="mt-4 text-[42px] sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[.96]">Петербург,<br/>который хочется сохранить</h2></div><p className="max-w-md text-sm sm:text-lg leading-7 text-white/55">Красивые точки, свет и время для кадра. Листай как визуальный альбом и сохраняй идеи для прогулки.</p></div><div className="mt-10 sm:mt-14 columns-2 lg:columns-4 gap-3 sm:gap-4">{photozones.map((place,index)=><article key={place.title} className="group relative mb-3 sm:mb-4 break-inside-avoid overflow-hidden rounded-[22px] sm:rounded-[28px] bg-white/5"><div className={`${index===0||index===3?"h-[340px] sm:h-[500px]":"h-[260px] sm:h-[390px]"} relative`}><img src={place.image} alt={place.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/5"/><span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] text-black">{place.tag}</span><div className="absolute left-4 right-4 bottom-4"><p className="text-xs text-white/55">{place.time}</p><h3 className="mt-1 text-lg sm:text-2xl font-bold">{place.title}</h3></div></div></article>)}</div><div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-t border-white/10 pt-7"><div><p className="font-semibold">ALMA+ · подробный фотогид</p><p className="mt-1 text-sm text-white/45">Точная точка съёмки · лучший свет · ракурс · подсказка для образа</p></div><button type="button" onClick={() => router.push("/surprise")} className="self-start rounded-full bg-white text-black px-6 py-3.5 text-sm font-semibold">Добавить фототочки в маршрут →</button></div></div></section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-32"><div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-5 mb-7 sm:mb-9"><div><p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Идеи для прогулки</p><h2 className="mt-3 sm:mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Популярные места</h2></div><button type="button" onClick={() => router.push("/map")} className="self-start rounded-full border border-black/10 bg-white px-5 sm:px-6 py-3 text-sm font-medium hover:bg-black hover:text-white transition">Смотреть все →</button></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">{places.map(place => <article key={place.title} className="group relative min-h-[340px] sm:min-h-[420px] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-neutral-200"><img src={place.image} alt={place.title} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.04]" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" /><div className="absolute top-4 left-4"><span className="inline-flex rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-xs text-black">{place.category}</span></div><div className="absolute left-5 right-5 bottom-5"><h3 className="text-2xl font-bold text-white leading-tight">{place.title}</h3></div></article>)}</div></section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24"><div className="rounded-[28px] sm:rounded-[38px] bg-[#e9e4dc] p-6 sm:p-12 lg:p-16"><div className="max-w-3xl"><p className="text-xs uppercase tracking-[0.22em] text-neutral-500">ALMA</p><h2 className="mt-4 sm:mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.02]">Петербург под твоё настроение</h2><p className="mt-4 sm:mt-5 text-base sm:text-lg text-neutral-500 leading-7 sm:leading-8 max-w-2xl">Не нужно заранее знать, куда именно идти. Достаточно понять, чего хочется сегодня.</p><button type="button" onClick={scrollToFilters} className="mt-7 sm:mt-8 rounded-full bg-black text-white px-7 py-4 font-medium hover:opacity-80 transition">Подобрать место</button></div></div></section>
  </main>;
}
