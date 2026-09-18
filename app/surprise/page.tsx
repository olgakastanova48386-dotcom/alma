"use client";

import { useEffect, useMemo, useState } from "react";
import { places } from "@/data/places";
import { restaurantPlaces } from "@/data/restaurantPlaces";
import { routeStayTimes } from "@/data/routeStories";
import PurchasedRouteStory, {
  type PurchasedRouteStop,
} from "@/components/PurchasedRouteStory";

const moods = ["Спокойно", "Романтика", "Вдохновиться", "Удивиться"];
const budgets = [
  "Бесплатно",
  "300–1500 ₽",
  "2000–5000 ₽",
  "6000–10000 ₽",
  "от 10000 ₽",
];
const companies = ["Один", "Пара", "Друзья", "Семья"];
const durations = ["До 1 часа", "1–2 часа", "2–4 часа", "Полдня"];
const interests = [
  "Искусство",
  "Вкусно поесть",
  "Прогулки",
  "Необычные места",
  "Развлечения",
  "Романтика",
  "Хардкор · успеть максимум",
];
type Step = 1 | 2 | 3 | 4 | 5 | 6;
type SavedDraft = {
  mood?: string;
  budget?: string;
  company?: string;
  duration?: string;
  interests?: string[];
  hardcore?: boolean;
  placeIds?: number[];
  createdAt?: string;
};
const DRAFT_KEY = "alma-surprise-draft";

const matchesInterest = (p: (typeof places)[number], interest: string) => {
  const c = p.category.toLowerCase();
  if (interest === "Искусство")
    return c.includes("искус") || c.includes("музей");
  if (interest === "Прогулки")
    return (
      c.includes("прогул") ||
      c.includes("парк") ||
      c.includes("пространство") ||
      c.includes("отдых") ||
      c.includes("архитект")
    );
  if (interest === "Необычные места")
    return (
      c.includes("необыч") ||
      c.includes("скрыт") ||
      c.includes("андеграунд") ||
      c.includes("современн") ||
      c.includes("архитект")
    );
  if (interest === "Развлечения")
    return c.includes("развлеч") || c.includes("интерактив");
  if (interest === "Романтика")
    return (
      p.mood === "Романтика" || c.includes("прогул") || c.includes("отдых")
    );
  return false;
};
const dist = (
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) => {
  const r = (v: number) => (v * Math.PI) / 180,
    dLat = r(b.lat - a.lat),
    dLng = r(b.lng - a.lng),
    x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};
const editorialStop = (p: (typeof places)[number]): PurchasedRouteStop => ({
  id: p.id,
  name: p.name,
  category: p.category,
  image: p.image,
  lat: p.lat,
  lng: p.lng,
  description: p.description,
  why: p.why,
  address: p.address,
  price: p.price,
  mapPlaceId: p.id,
});
const verifiedRestaurants = restaurantPlaces.filter(
  (r) => r.rating >= 4.5 && r.rating <= 5,
);
const restaurantStop = (
  r: (typeof restaurantPlaces)[number],
): PurchasedRouteStop => ({
  id: 2000 + r.id,
  mapPlaceId: 2000 + r.id,
  name: r.name,
  category: "Ресторан",
  image: r.image,
  lat: r.lat,
  lng: r.lng,
  description: r.note,
  why: `Рейтинг ${r.rating.toFixed(1)} из 5 — хорошая гастрономическая пауза внутри маршрута.`,
  address: r.address,
  price: r.averageBill || "Средний чек уточняется",
  rating: r.rating,
  ratingSource: r.ratingSource,
});
const stopFromMapId = (id: number): PurchasedRouteStop | null => {
  if (id >= 2001) {
    const r = restaurantPlaces.find((x) => 2000 + x.id === id);
    return r && r.rating >= 4.5 && r.rating <= 5 ? restaurantStop(r) : null;
  }
  const p = places.find((x) => x.id === id);
  return p ? editorialStop(p) : null;
};

const routeBudgetMinutes = (duration: string) =>
  duration === "До 1 часа"
    ? 60
    : duration === "1–2 часа"
      ? 120
      : duration === "2–4 часа"
        ? 240
        : 360;
const rangeMinutes = (value: string) => {
  const nums = (value.match(/\d+(?:[.,]\d+)?/g) || []).map((x) =>
    Number(x.replace(",", ".")),
  );
  if (!nums.length) return 60;
  const mult = value.includes("час") ? 60 : 1;
  return Math.round(((nums[0] + (nums[1] ?? nums[0])) / 2) * mult);
};
const stopMinutes = (p: PurchasedRouteStop) => {
  if (p.category === "Ресторан") return 60;
  const exact = routeStayTimes[p.name.trim().toLowerCase()];
  if (exact) return rangeMinutes(exact);
  const c = p.category.toLowerCase();
  if (c.includes("музей") || c.includes("искус")) return 90;
  if (c.includes("парк") || c.includes("пространство") || c.includes("отдых"))
    return 60;
  if (c.includes("прогул") || c.includes("архитект")) return 30;
  return 60;
};
const isMainStop = (p: PurchasedRouteStop) => {
  const c = p.category.toLowerCase();
  return (
    c.includes("музей") ||
    c.includes("искус") ||
    c.includes("интерактив") ||
    c.includes("истор") ||
    stopMinutes(p) >= 90
  );
};
const transferMinutes = (a: PurchasedRouteStop, b: PurchasedRouteStop) =>
  Math.max(8, Math.round((dist(a, b) / 4.5) * 60));

export default function SurprisePage() {
  const [step, setStep] = useState<Step>(1),
    [mood, setMood] = useState(""),
    [budget, setBudget] = useState(""),
    [company, setCompany] = useState(""),
    [duration, setDuration] = useState(""),
    [selectedInterests, setSelectedInterests] = useState<string[]>([]),
    [generated, setGenerated] = useState(false),
    [restored, setRestored] = useState(false),
    [restoredPlaceIds, setRestoredPlaceIds] = useState<number[]>([]);
  useEffect(() => {
    let active = true;
    (async () => {
      const startNew =
        new URLSearchParams(window.location.search).get("new") === "1";
      let saved: SavedDraft | null = null;
      if (!startNew) {
        try {
          const raw = localStorage.getItem(DRAFT_KEY);
          if (raw) saved = JSON.parse(raw) as SavedDraft;
        } catch {}
        try {
          const response = await fetch("/api/routes/draft", {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            if (!saved && data.saved?.route)
              saved = data.saved.route as SavedDraft;
          }
        } catch {}
      }
      if (!active) return;
      if (saved) {
        if (saved.mood) setMood(saved.mood);
        if (saved.budget) setBudget(saved.budget);
        if (saved.company) setCompany(saved.company);
        if (saved.duration) setDuration(saved.duration);
        if (Array.isArray(saved.interests))
          setSelectedInterests(saved.interests);
        if (Array.isArray(saved.placeIds))
          setRestoredPlaceIds(
            saved.placeIds.map(Number).filter(Number.isFinite),
          );
        setGenerated(true);
        setStep(6);
        setRestored(true);
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(saved));
        } catch {}
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  const hardcore = selectedInterests.includes("Хардкор · успеть максимум");
  const routeInterests = useMemo(
    () => selectedInterests.filter((i) => i !== "Хардкор · успеть максимум"),
    [selectedInterests],
  );
  const toggleInterest = (v: string) =>
    setSelectedInterests((x) =>
      x.includes(v) ? x.filter((i) => i !== v) : [...x, v],
    );
  const matchingPlaces = useMemo<PurchasedRouteStop[]>(() => {
    if (restoredPlaceIds.length) {
      const restoredStops = restoredPlaceIds
        .map(stopFromMapId)
        .filter((x): x is PurchasedRouteStop => Boolean(x));
      if (restoredStops.length) return restoredStops;
    }
    const score = (p: (typeof places)[number]) =>
      (p.mood === mood ? 4 : 0) +
      (p.budget === budget ? 3 : 0) +
      (p.company.includes(company) ? 3 : 0) +
      (p.duration === duration ? 2 : 0) +
      routeInterests.reduce(
        (s, i) => s + (matchesInterest(p, i) ? (i === "Романтика" ? 4 : 3) : 0),
        0,
      );
    const ranked = [...places].sort((a, b) => score(b) - score(a));
    const hardMax =
      duration === "Полдня"
        ? 5
        : duration === "2–4 часа"
          ? 4
          : duration === "1–2 часа"
            ? 3
            : 2;
    const normalMax =
      duration === "Полдня"
        ? 4
        : duration === "2–4 часа"
          ? 3
          : duration === "1–2 часа"
            ? 2
            : 1;
    const max = hardcore ? hardMax : normalMax,
      budgetMinutes = routeBudgetMinutes(duration);
    const chosen: PurchasedRouteStop[] = [];
    const usedEditorial = new Set<number>();
    const usedRestaurants = new Set<number>();
    const fits = (candidate: PurchasedRouteStop) => {
      if (chosen.length >= max) return false;
      if (hardcore) return true;
      if (isMainStop(candidate) && chosen.some(isMainStop)) return false;
      const visit =
        chosen.reduce((s, p) => s + stopMinutes(p), 0) + stopMinutes(candidate);
      const travel =
        chosen
          .slice(0, -1)
          .reduce((s, p, i) => s + transferMinutes(p, chosen[i + 1]), 0) +
        (chosen.length
          ? transferMinutes(chosen[chosen.length - 1], candidate)
          : 0);
      return visit + travel <= budgetMinutes;
    };
    for (const interest of routeInterests) {
      if (chosen.length >= max) break;
      if (interest === "Вкусно поесть") {
        const previous = chosen[chosen.length - 1];
        const candidates = verifiedRestaurants
          .filter((r) => !usedRestaurants.has(r.id))
          .map(restaurantStop)
          .filter(fits);
        const picked = [...candidates].sort((a, b) =>
          previous
            ? dist(previous, a) - dist(previous, b)
            : (b.rating ?? 0) - (a.rating ?? 0),
        )[0];
        if (picked) {
          chosen.push(picked);
          usedRestaurants.add(picked.id - 2000);
        }
        continue;
      }
      const previous = chosen[chosen.length - 1];
      const candidates = ranked
        .filter((x) => matchesInterest(x, interest) && !usedEditorial.has(x.id))
        .map(editorialStop)
        .filter(fits);
      const p = [...candidates].sort((a, b) =>
        previous
          ? dist(previous, a) - dist(previous, b)
          : score(places.find((x) => x.id === b.id)!) -
            score(places.find((x) => x.id === a.id)!),
      )[0];
      if (p) {
        chosen.push(p);
        usedEditorial.add(p.id);
      }
    }
    for (const raw of ranked) {
      if (chosen.length >= max) break;
      if (usedEditorial.has(raw.id)) continue;
      const p = editorialStop(raw);
      if (
        (chosen.length === 0 ||
          hardcore ||
          dist(chosen[chosen.length - 1], p) <= 4) &&
        fits(p)
      ) {
        chosen.push(p);
        usedEditorial.add(raw.id);
      }
    }
    return chosen;
  }, [
    mood,
    budget,
    company,
    duration,
    selectedInterests,
    hardcore,
    routeInterests,
    restoredPlaceIds,
  ]);
  const can = () =>
    step === 1
      ? !!mood
      : step === 2
        ? !!company
        : step === 3
          ? !!budget
          : step === 4
            ? !!duration
            : step === 5
              ? routeInterests.length > 0
              : true;
  const Option = ({
    value,
    current,
    set,
  }: {
    value: string;
    current: string;
    set: (v: string) => void;
  }) => (
    <button
      type="button"
      onClick={() => {
        setRestoredPlaceIds([]);
        set(value);
      }}
      className={`rounded-[18px] sm:rounded-[22px] border px-4 sm:px-5 py-4 sm:py-5 text-left text-base sm:text-lg font-medium transition ${current === value ? "bg-black border-black text-white" : "bg-white border-black/10 hover:border-black/30"}`}
    >
      <span className="flex justify-between gap-3">
        <span>{value}</span>
        <span>{current === value ? "✓" : ""}</span>
      </span>
    </button>
  );
  const question =
    step === 1
      ? ["Какое у тебя настроение?", moods, mood, setMood]
      : step === 2
        ? ["Какая сегодня компания?", companies, company, setCompany]
        : step === 3
          ? ["Какой бюджет?", budgets, budget, setBudget]
          : ([
              "Сколько времени есть?",
              durations,
              duration,
              setDuration,
            ] as any);
  const draft = () => ({
    mood,
    budget,
    company,
    duration,
    interests: selectedInterests,
    hardcore,
    placeIds: matchingPlaces.map((p) => p.mapPlaceId ?? p.id),
    createdAt: new Date().toISOString(),
  });
  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft()));
    } catch {}
  };
  const generateRoute = () => {
    saveDraft();
    setGenerated(true);
  };
  const reset = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setGenerated(false);
    setRestored(false);
    setRestoredPlaceIds([]);
    setStep(1);
    setMood("");
    setBudget("");
    setCompany("");
    setDuration("");
    setSelectedInterests([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-24 sm:pt-32 pb-20 sm:pb-24">
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full bg-black text-white px-3.5 sm:px-4 py-2 text-xs sm:text-sm">
            ✦ ALMA · Удиви меня
          </div>
          <h1 className="mt-5 sm:mt-7 text-[42px] sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[.98]">
            Соберём твой
            <br />
            Петербург
          </h1>
          <p className="mt-5 sm:mt-6 max-w-2xl text-base sm:text-xl leading-7 sm:leading-8 text-neutral-500">
            Ответь на несколько вопросов — ALMA бесплатно соберёт реалистичный
            маршрут с учётом времени.
          </p>
          {restored && (
            <div className="mt-5 inline-flex rounded-full bg-white border border-black/10 px-4 py-2 text-sm font-medium">
              ↻ Восстановлен сохранённый маршрут
            </div>
          )}
        </div>
        {!generated && (
          <div className="mt-10 sm:mt-20">
            <div className="flex justify-between mb-3 text-xs sm:text-sm text-neutral-500">
              <span>Шаг {step} из 6</span>
              <span>{Math.round((step / 6) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/5 overflow-hidden">
              <div
                className="h-full bg-black"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
            <div className="mt-5 sm:mt-8 rounded-[28px] sm:rounded-[40px] bg-[#ebe6de] p-5 sm:p-10">
              {step < 6 ? (
                <>
                  {step === 5 ? (
                    <>
                      <p className="text-xs sm:text-sm text-neutral-500">
                        Можно выбрать несколько
                      </p>
                      <h2 className="mt-2 sm:mt-3 text-[28px] sm:text-4xl leading-[1.05] font-bold">
                        Что добавить в маршрут?
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-neutral-500">
                        Обычный маршрут — без гонки: ALMA учитывает реальное
                        время в каждой точке и дорогу между ними. Две большие
                        локации подряд появятся только в режиме «Хардкор».
                      </p>
                      <div className="mt-6 sm:mt-8 grid sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {interests.map((v) => {
                          const active = selectedInterests.includes(v);
                          return (
                            <button
                              key={v}
                              type="button"
                              onClick={() => {
                                setRestoredPlaceIds([]);
                                toggleInterest(v);
                              }}
                              className={`rounded-[18px] sm:rounded-[22px] border px-4 sm:px-5 py-4 sm:py-5 text-left text-base sm:text-lg font-medium ${active ? "bg-black border-black text-white" : "bg-white border-black/10"}`}
                            >
                              <span className="flex justify-between gap-3">
                                <span>{v}</span>
                                <span>{active ? "✓" : "＋"}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {selectedInterests.length > 0 && (
                        <p className="mt-4 text-sm font-medium">
                          Выбрано: {selectedInterests.length}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-xs sm:text-sm text-neutral-500">
                        Удиви меня
                      </p>
                      <h2 className="mt-2 sm:mt-3 text-[28px] sm:text-4xl leading-[1.05] font-bold">
                        {question[0]}
                      </h2>
                      <div className="mt-6 sm:mt-8 grid sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {(question[1] as string[]).map((v) => (
                          <Option
                            key={v}
                            value={v}
                            current={question[2] as string}
                            set={question[3] as (v: string) => void}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="text-xs sm:text-sm text-neutral-500">
                    Почти готово
                  </p>
                  <h2 className="mt-2 sm:mt-3 text-[28px] sm:text-4xl leading-[1.05] font-bold">
                    Собрать твой маршрут?
                  </h2>
                  <div className="mt-6 sm:mt-8 grid sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {[
                      ["Настроение", mood],
                      ["Компания", company],
                      ["Бюджет", budget],
                      ["Время", duration],
                      [
                        "Темп",
                        hardcore ? "Хардкор · успеть максимум" : "Комфортный",
                      ],
                      ["Сценарий", routeInterests.join(" → ")],
                    ].map(([l, v]) => (
                      <div
                        key={l}
                        className="rounded-[18px] sm:rounded-[22px] bg-white p-4 sm:p-5"
                      >
                        <p className="text-[11px] sm:text-xs uppercase tracking-wider text-neutral-400">
                          {l}
                        </p>
                        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base font-semibold leading-6">
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 sm:mt-6 text-sm text-neutral-500">
                    Названия точек, фотографии и полный сценарий откроются сразу
                    и бесплатно.
                  </p>
                </>
              )}
              <div className="mt-7 sm:mt-9 grid grid-cols-2 gap-2.5 sm:flex sm:justify-between sm:gap-3">
                <button
                  disabled={step === 1}
                  onClick={() => setStep((step - 1) as Step)}
                  className="min-h-12 rounded-full px-4 sm:px-6 py-3 border border-black/10 disabled:opacity-30"
                >
                  ← Назад
                </button>
                {step < 6 ? (
                  <button
                    disabled={!can()}
                    onClick={() => setStep((step + 1) as Step)}
                    className="min-h-12 rounded-full bg-black text-white px-4 sm:px-7 py-3 disabled:opacity-25"
                  >
                    Дальше →
                  </button>
                ) : (
                  <button
                    onClick={generateRoute}
                    className="min-h-12 rounded-full bg-black text-white px-4 sm:px-8 py-3"
                  >
                    ✦ Собрать маршрут бесплатно
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {generated && (
          <section className="mt-10 sm:mt-16">
            <div className="max-w-3xl">
              <p className="text-[11px] sm:text-xs uppercase tracking-[.18em] sm:tracking-[.22em] text-neutral-500">
                ALMA собрала твой маршрут бесплатно
              </p>
              <h2 className="mt-3 sm:mt-4 text-[40px] sm:text-6xl font-bold tracking-tight leading-none">
                Есть план ✦
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-7 text-neutral-500">
                {mood} · {company} · {duration} ·{" "}
                {hardcore ? "Хардкор" : "Комфортный темп"} ·{" "}
                {routeInterests.join(" → ")}
              </p>
            </div>
            <div id="ready-route">
              <PurchasedRouteStory
                stops={matchingPlaces}
                romantic={
                  company === "Пара" ||
                  mood === "Романтика" ||
                  selectedInterests.includes("Романтика")
                }
                onReset={reset}
              />
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
