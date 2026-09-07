"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type PurchasedRouteStop = {
  id: number;
  name: string;
  category: string;
  image?: string;
  lat: number;
  lng: number;
  description: string;
  why?: string;
  address: string;
  price: string;
  mapPlaceId?: number;
  rating?: number;
  ratingSource?: string;
};

const verifiedStories: Record<string, string> = {
  "поцелуев мост": "Название моста связано не с романтической легендой, а с трактиром «Поцелуй», который находился рядом в конце XVIII века.",
  "новая голландия": "Название «Новая Голландия» закрепилось за островом ещё в XVIII веке, когда здесь хранили корабельный лес для петербургских верфей.",
  "севкабель порт": "До превращения в общественное пространство это была промышленная территория одного из старейших кабельных производств России.",
  "исаакиевская площадь": "Исаакиевская площадь формировалась как часть парадного центра Петербурга вокруг Исаакиевского собора.",
};

function stayMinutes(place: PurchasedRouteStop) {
  const name = place.name.toLowerCase();
  const c = place.category.toLowerCase();
  if (name.includes("поцелуев мост")) return 15;
  if (name.includes("мозаичный дворик")) return 30;
  if (name.includes("исаакиевская площадь")) return 25;
  if (name.includes("лахта центр")) return 30;
  if (name.includes("новая голландия")) return 90;
  if (name.includes("севкабель")) return 90;
  if (name.includes("эрарта")) return 150;
  if (name.includes("мир на ощупь")) return 90;
  if (name.includes("пушкинская-10")) return 75;
  if (name.includes("ботанический сад")) return 120;
  if (c.includes("музей") || c.includes("искус")) return 90;
  if (c.includes("ресторан") || c.includes("каф") || c.includes("коф") || c.includes("бар")) return 75;
  if (c.includes("парк") || c.includes("отдых") || c.includes("пространство")) return 60;
  if (c.includes("прогул")) return 35;
  if (c.includes("архитект")) return 25;
  return 45;
}

function stayLabel(place: PurchasedRouteStop) {
  const m = stayMinutes(place);
  if (m < 60) return `${m} мин`;
  if (m === 60) return "1 час";
  if (m % 60 === 0) return `${m / 60} ч`;
  return `${Math.floor(m / 60)} ч ${m % 60} мин`;
}

function outfit(category: string) {
  const c = category.toLowerCase();
  if (c.includes("прогул") || c.includes("парк") || c.includes("пространство") || c.includes("отдых")) {
    return "Удобная обувь и слой от ветра — часть маршрута пройдёт на улице.";
  }
  if (c.includes("музей") || c.includes("искус")) {
    return "Комфортный городской образ: внутри тепло, верхнюю одежду можно оставить в гардеробе.";
  }
  if (c.includes("ресторан") || c.includes("каф") || c.includes("коф") || c.includes("бар")) {
    return "Городской образ без лишней формальности. Оставь удобную обувь — день ещё продолжится.";
  }
  return "Удобный городской образ и обувь, в которой приятно пройти следующий участок пешком.";
}

function distanceKm(a: PurchasedRouteStop, b: PurchasedRouteStop) {
  const rad = (v: number) => (v * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function travelMinutes(a: PurchasedRouteStop, b: PurchasedRouteStop) {
  const km = distanceKm(a, b);
  if (km <= 1.4) return Math.max(5, Math.round((km / 4.5) * 60 / 5) * 5);
  return Math.max(10, Math.round((km / 16) * 60 / 5) * 5 + 5);
}

function travelMode(a: PurchasedRouteStop, b: PurchasedRouteStop) {
  return distanceKm(a, b) <= 1.4 ? "пешком" : "на транспорте";
}

function priceNumber(price: string) {
  const nums = price.match(/\d[\d\s]*/g)?.map((n) => Number(n.replace(/\s/g, ""))).filter(Boolean) || [];
  if (!nums.length) return 0;
  return nums.length > 1 ? Math.round((nums[0] + nums[1]) / 2) : nums[0];
}

function formatClock(minutes: number) {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

function yandexRouteUrl(stops: PurchasedRouteStop[]) {
  const points = stops.map((s) => `${s.lat},${s.lng}`).join("~");
  return `https://yandex.ru/maps/?rtext=${encodeURIComponent(points)}&rtt=auto`;
}

function yandexPlaceUrl(place: PurchasedRouteStop) {
  return `https://yandex.ru/maps/?pt=${place.lng},${place.lat}&z=16&l=map`;
}

export default function PurchasedRouteStory({
  stops,
  romantic = false,
  onReset,
}: {
  stops: PurchasedRouteStop[];
  romantic?: boolean;
  onReset: () => void;
}) {
  const [startTime, setStartTime] = useState("14:30");
  const [copied, setCopied] = useState(false);

  const startMinutes = useMemo(() => {
    const [h, m] = startTime.split(":").map(Number);
    return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : 14 * 60 + 30;
  }, [startTime]);

  const schedule = useMemo(() => {
    let cursor = startMinutes;
    return stops.map((place, index) => {
      const arrive = cursor;
      const stay = stayMinutes(place);
      const next = stops[index + 1];
      const move = next ? travelMinutes(place, next) : 0;
      cursor += stay + move;
      return { place, index, arrive, stay, next, move };
    });
  }, [stops, startMinutes]);

  const totalDistance = useMemo(
    () => stops.slice(0, -1).reduce((sum, place, i) => sum + distanceKm(place, stops[i + 1]), 0),
    [stops]
  );

  const totalMinutes = useMemo(() => {
    if (!schedule.length) return 0;
    const last = schedule[schedule.length - 1];
    return last.arrive + last.stay - startMinutes;
  }, [schedule, startMinutes]);

  const budget = useMemo(() => stops.reduce((sum, s) => sum + priceNumber(s.price), 0), [stops]);

  const routeText = useMemo(() => {
    const lines = schedule.map(({ place, arrive, next, move }, i) => {
      const fact = verifiedStories[place.name.toLowerCase()];
      const transition = next ? `\nДальше: ${move} мин ${travelMode(place, next)} → ${next.name}` : "";
      return `${formatClock(arrive)} · ${place.name}\n${place.category} · ${stayLabel(place)}\n${place.address}\n${place.price}\n${place.description}${romantic && fact ? `\nИнтересная деталь: ${fact}` : ""}${transition}`;
    });
    return `Мой день с ALMA · Санкт-Петербург\n\n${lines.join("\n\n")}\n\n${stops.length} точек · ~${Math.round(totalMinutes / 30) / 2} ч · ~${totalDistance.toFixed(1)} км`;
  }, [schedule, romantic, stops.length, totalMinutes, totalDistance]);

  const shareRoute = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Мой маршрут ALMA", text: routeText, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(routeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {}
  };

  const saveRoute = () => window.print();

  if (!stops.length) return null;

  return (
    <div id="purchased-route" className="mt-9 overflow-hidden rounded-[38px] border border-black/5 bg-[#f3eee6]">
      <header className="border-b border-black/5 p-6 sm:p-9 lg:p-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-[#dcebdc] px-3 py-2 text-xs font-semibold">МАРШРУТ ГОТОВ</span>
            <p className="mt-6 text-xs uppercase tracking-[.2em] text-neutral-400">Твой день с ALMA</p>
            <h3 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Петербург уже спланирован ✦</h3>
            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">
              Не список мест, а готовый сценарий дня: когда приехать, сколько остаться, как перейти дальше и чем закончить маршрут.
            </p>
          </div>
          <button onClick={onReset} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-neutral-50">Собрать другой</button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-[24px] bg-white p-5"><p className="text-xs uppercase tracking-[.14em] text-neutral-400">Точек</p><p className="mt-2 text-2xl font-bold">{stops.length}</p></div>
          <div className="rounded-[24px] bg-white p-5"><p className="text-xs uppercase tracking-[.14em] text-neutral-400">Длительность</p><p className="mt-2 text-2xl font-bold">~{Math.round(totalMinutes / 30) / 2} ч</p></div>
          <div className="rounded-[24px] bg-white p-5"><p className="text-xs uppercase tracking-[.14em] text-neutral-400">Маршрут</p><p className="mt-2 text-2xl font-bold">~{totalDistance.toFixed(1)} км</p></div>
          <div className="rounded-[24px] bg-white p-5"><p className="text-xs uppercase tracking-[.14em] text-neutral-400">Бюджет мест</p><p className="mt-2 text-2xl font-bold">{budget ? `~${budget.toLocaleString("ru-RU")} ₽` : "по факту"}</p></div>
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-[24px] bg-black p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[.15em] text-white/45">Начало дня</p>
            <p className="mt-1 text-lg font-semibold">Подстроить таймлайн под себя</p>
          </div>
          <div className="flex items-center gap-3">
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="rounded-full bg-white px-4 py-3 font-semibold text-black outline-none" />
            <a href={yandexRouteUrl(stops)} target="_blank" rel="noreferrer" className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-black hover:opacity-90">Открыть весь маршрут ↗</a>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={saveRoute} className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">↓ Сохранить</button>
          <button onClick={shareRoute} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold">{copied ? "Скопировано ✓" : "↗ Поделиться"}</button>
        </div>
      </header>

      <div className="px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div className="mx-auto max-w-5xl">
          {schedule.map(({ place, index, arrive, next, move }) => {
            const fact = verifiedStories[place.name.toLowerCase()];
            const isLast = index === schedule.length - 1;
            return (
              <section key={`${place.category}-${place.id}`} className="relative grid gap-5 pb-10 sm:grid-cols-[110px_1fr] sm:gap-8 sm:pb-14">
                <div className="relative">
                  {!isLast && <div className="absolute left-[27px] top-14 hidden h-[calc(100%+24px)] w-px bg-black/15 sm:block" />}
                  <div className="flex items-center gap-3 sm:block">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black text-lg font-bold text-white shadow-lg">{index + 1}</div>
                    <div className="sm:mt-4">
                      <p className="text-xs uppercase tracking-[.14em] text-neutral-400">Прибыть</p>
                      <p className="mt-1 text-xl font-bold">{formatClock(arrive)}</p>
                    </div>
                  </div>
                </div>

                <article className="overflow-hidden rounded-[30px] bg-white shadow-sm ring-1 ring-black/5">
                  {place.image && (
                    <div className="relative h-56 sm:h-72">
                      <Image src={place.image} alt={place.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      <div className="absolute bottom-5 left-5 right-5 text-white">
                        <p className="text-xs uppercase tracking-[.15em] text-white/70">{place.category}</p>
                        <h4 className="mt-1 text-3xl font-bold sm:text-4xl">{place.name}</h4>
                      </div>
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    {!place.image && <><p className="text-xs uppercase tracking-[.15em] text-neutral-400">{place.category}</p><h4 className="mt-2 text-3xl font-bold">{place.name}</h4></>}
                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-neutral-500">
                      <span>{stayLabel(place)}</span><span>·</span><span>{place.price}</span>{place.rating ? <><span>·</span><span>★ {place.rating.toFixed(1)}</span></> : null}
                    </div>
                    <p className="mt-5 text-base leading-7 text-neutral-700">{place.description}</p>
                    {place.why && <div className="mt-5 rounded-[20px] bg-[#f3eee6] p-5"><p className="text-xs uppercase tracking-[.15em] text-neutral-400">Почему здесь</p><p className="mt-2 leading-6">{place.why}</p></div>}

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[20px] border border-black/10 p-5"><p className="text-xs uppercase tracking-[.15em] text-neutral-400">Что надеть</p><p className="mt-2 text-sm leading-6 text-neutral-600">{outfit(place.category)}</p></div>
                      <div className="rounded-[20px] border border-black/10 p-5"><p className="text-xs uppercase tracking-[.15em] text-neutral-400">Адрес</p><p className="mt-2 text-sm leading-6 text-neutral-600">{place.address}</p><a href={yandexPlaceUrl(place)} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold underline underline-offset-4">Показать на карте ↗</a></div>
                    </div>

                    {romantic && fact && <div className="mt-5 rounded-[20px] bg-[#f7e8e7] p-5"><p className="text-xs uppercase tracking-[.15em] text-neutral-500">Для свидания ✦</p><p className="mt-2 text-sm leading-6 text-neutral-700">Можно ненавязчиво рассказать: {fact}</p></div>}
                  </div>
                </article>

                {next && (
                  <div className="sm:col-start-2 -mt-4 mb-2 rounded-[22px] border border-dashed border-black/15 bg-white/55 px-5 py-4">
                    <p className="text-xs uppercase tracking-[.14em] text-neutral-400">Следующий переход</p>
                    <p className="mt-1 font-semibold">{move} мин {travelMode(place, next)} → {next.name}</p>
                    <p className="mt-1 text-sm text-neutral-500">Отправляйся примерно в {formatClock(arrive + stayMinutes(place))}, чтобы сохранить спокойный темп.</p>
                  </div>
                )}
              </section>
            );
          })}

          <div className="rounded-[30px] bg-black p-7 text-white sm:p-9">
            <p className="text-xs uppercase tracking-[.18em] text-white/45">Финал дня</p>
            <h4 className="mt-2 text-3xl font-bold">{formatClock(startMinutes + totalMinutes)} · можно никуда не спешить ✦</h4>
            <p className="mt-3 max-w-2xl leading-7 text-white/65">ALMA уже заложила время на сами места и переходы между ними. Если захочется задержаться где-то дольше — просто двигай остальной день по настроению.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
