"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { places } from "@/data/places";

const moods = [
  "Спокойно",
  "Романтика",
  "Вдохновиться",
  "Удивиться",
];

const budgets = [
  "Бесплатно",
  "300–1500 ₽",
  "2000–5000 ₽",
  "6000–10000 ₽",
  "от 10000 ₽",
];

const companies = [
  "Один",
  "Пара",
  "Друзья",
  "Семья",
];

const durations = [
  "До 1 часа",
  "1–2 часа",
  "2–4 часа",
  "Полдня",
];

const interests = [
  "Искусство",
  "Архитектура",
  "Прогулки",
  "Необычные места",
  "Развлечения",
];

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function SurprisePage() {
  const [step, setStep] = useState<Step>(1);

  const [mood, setMood] = useState("");
  const [budget, setBudget] = useState("");
  const [company, setCompany] = useState("");
  const [duration, setDuration] = useState("");
  const [interest, setInterest] = useState("");

  const [generated, setGenerated] = useState(false);

  const progress = `${(step / 6) * 100}%`;

  const matchingPlaces = useMemo(() => {
    const scored = places.map((place) => {
      let score = 0;

      if (place.mood === mood) {
        score += 4;
      }

      if (place.budget === budget) {
        score += 3;
      }

      if (place.company.includes(company)) {
        score += 3;
      }

      if (place.duration === duration) {
        score += 2;
      }

      const category =
        place.category.toLowerCase();

      if (
        interest === "Искусство" &&
        (
          category.includes("искус") ||
          category.includes("музей")
        )
      ) {
        score += 3;
      }

      if (
        interest === "Архитектура" &&
        (
          category.includes("архит") ||
          category.includes("истор")
        )
      ) {
        score += 3;
      }

      if (
        interest === "Прогулки" &&
        (
          category.includes("прогул") ||
          category.includes("отдых") ||
          category.includes("пространство")
        )
      ) {
        score += 3;
      }

      if (
        interest === "Необычные места" &&
        (
          category.includes("необыч") ||
          category.includes("скрыт") ||
          category.includes("андеграунд")
        )
      ) {
        score += 3;
      }

      if (
        interest === "Развлечения" &&
        (
          category.includes("развлеч") ||
          category.includes("интерактив")
        )
      ) {
        score += 3;
      }

      return {
        ...place,
        score,
      };
    });

    return scored
      .sort(
        (a, b) =>
          b.score - a.score
      )
      .slice(0, 3);
  }, [
    mood,
    budget,
    company,
    duration,
    interest,
  ]);

  const canContinue = () => {
    if (step === 1) return !!mood;
    if (step === 2) return !!company;
    if (step === 3) return !!budget;
    if (step === 4) return !!duration;
    if (step === 5) return !!interest;

    return true;
  };

  const next = () => {
    if (!canContinue()) {
      return;
    }

    if (step < 6) {
      setStep(
        (step + 1) as Step
      );
    }
  };

  const back = () => {
    if (step > 1) {
      setStep(
        (step - 1) as Step
      );
    }
  };

  const createRoute = () => {
    setGenerated(true);

    window.setTimeout(() => {
      document
        .getElementById("alma-route")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  const reset = () => {
    setGenerated(false);
    setStep(1);

    setMood("");
    setBudget("");
    setCompany("");
    setDuration("");
    setInterest("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const Option = ({
    value,
    selected,
    onClick,
  }: {
    value: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[22px] border px-5 py-5 text-left text-base sm:text-lg font-medium transition-all ${
        selected
          ? "bg-black border-black text-white scale-[1.02]"
          : "bg-white border-black/10 text-black hover:border-black/30 hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <span>
          {value}
        </span>

        <span
          className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
            selected
              ? "border-white bg-white text-black"
              : "border-black/15"
          }`}
        >
          {selected ? "✓" : ""}
        </span>
      </div>
    </button>
  );

  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-32 pb-24">

      <section className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="max-w-3xl">

          <div className="inline-flex rounded-full bg-black text-white px-4 py-2 text-sm">
            ✦ ALMA · Удиви меня
          </div>

          <h1 className="mt-7 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.98]">
            Соберём твой
            <br />
            Петербург
          </h1>

          <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-8 text-neutral-500">
            Расскажи ALMA, чего хочется сегодня.
            Мы подберём места и соберём их
            в готовый маршрут.
          </p>

        </div>

        {!generated && (
          <div className="mt-14 sm:mt-20">

            {/* PROGRESS */}

            <div className="flex items-center justify-between mb-3">

              <span className="text-sm text-neutral-500">
                Шаг {step} из 6
              </span>

              <span className="text-sm text-neutral-400">
                {Math.round(
                  (step / 6) * 100
                )}
                %
              </span>

            </div>

            <div className="h-1.5 rounded-full bg-black/5 overflow-hidden">

              <div
                className="h-full rounded-full bg-black transition-all duration-500"
                style={{
                  width: progress,
                }}
              />

            </div>

            {/* QUESTION */}

            <div className="mt-8 rounded-[36px] sm:rounded-[44px] bg-[#ebe6de] p-6 sm:p-10 lg:p-12">

              {step === 1 && (
                <>
                  <p className="text-sm text-neutral-500">
                    Начнём с главного
                  </p>

                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                    Какое у тебя настроение?
                  </h2>

                  <div className="mt-8 grid sm:grid-cols-2 gap-3">

                    {moods.map((item) => (
                      <Option
                        key={item}
                        value={item}
                        selected={
                          mood === item
                        }
                        onClick={() =>
                          setMood(item)
                        }
                      />
                    ))}

                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <p className="text-sm text-neutral-500">
                    С кем идём
                  </p>

                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                    Какая сегодня компания?
                  </h2>

                  <div className="mt-8 grid sm:grid-cols-2 gap-3">

                    {companies.map(
                      (item) => (
                        <Option
                          key={item}
                          value={item}
                          selected={
                            company === item
                          }
                          onClick={() =>
                            setCompany(item)
                          }
                        />
                      )
                    )}

                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <p className="text-sm text-neutral-500">
                    Планируем расходы
                  </p>

                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                    Какой бюджет?
                  </h2>

                  <div className="mt-8 grid sm:grid-cols-2 gap-3">

                    {budgets.map(
                      (item) => (
                        <Option
                          key={item}
                          value={item}
                          selected={
                            budget === item
                          }
                          onClick={() =>
                            setBudget(item)
                          }
                        />
                      )
                    )}

                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <p className="text-sm text-neutral-500">
                    Время
                  </p>

                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                    Сколько времени есть?
                  </h2>

                  <div className="mt-8 grid sm:grid-cols-2 gap-3">

                    {durations.map(
                      (item) => (
                        <Option
                          key={item}
                          value={item}
                          selected={
                            duration === item
                          }
                          onClick={() =>
                            setDuration(item)
                          }
                        />
                      )
                    )}

                  </div>
                </>
              )}

              {step === 5 && (
                <>
                  <p className="text-sm text-neutral-500">
                    Последний штрих
                  </p>

                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                    Чего хочется больше?
                  </h2>

                  <div className="mt-8 grid sm:grid-cols-2 gap-3">

                    {interests.map(
                      (item) => (
                        <Option
                          key={item}
                          value={item}
                          selected={
                            interest === item
                          }
                          onClick={() =>
                            setInterest(item)
                          }
                        />
                      )
                    )}

                  </div>
                </>
              )}

              {step === 6 && (
                <>
                  <p className="text-sm text-neutral-500">
                    Всё готово
                  </p>

                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                    Вот что я поняла
                  </h2>

                  <div className="mt-8 grid sm:grid-cols-2 gap-3">

                    {[
                      ["Настроение", mood],
                      ["Компания", company],
                      ["Бюджет", budget],
                      ["Время", duration],
                      ["Хочется", interest],
                    ].map(
                      ([label, value]) => (
                        <div
                          key={label}
                          className="rounded-[22px] bg-white p-5 border border-black/5"
                        >
                          <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">
                            {label}
                          </p>

                          <p className="mt-2 text-lg font-semibold">
                            {value}
                          </p>
                        </div>
                      )
                    )}

                  </div>

                  <div className="mt-8 rounded-[24px] bg-black text-white p-6">

                    <p className="text-white/50 text-sm">
                      ALMA
                    </p>

                    <p className="mt-2 text-lg leading-7">
                      Я выберу места, которые лучше
                      всего подходят под эти условия,
                      и соберу из них маршрут.
                    </p>

                  </div>
                </>
              )}

              {/* CONTROLS */}

              <div className="mt-9 flex items-center justify-between gap-3">

                <button
                  type="button"
                  onClick={back}
                  disabled={step === 1}
                  className="rounded-full px-6 py-3.5 border border-black/10 disabled:opacity-30 hover:bg-white transition"
                >
                  ← Назад
                </button>

                {step < 6 ? (
                  <button
                    type="button"
                    disabled={
                      !canContinue()
                    }
                    onClick={next}
                    className="rounded-full bg-black text-white px-7 py-3.5 font-medium disabled:opacity-25 hover:opacity-80 transition"
                  >
                    Дальше →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={createRoute}
                    className="rounded-full bg-black text-white px-8 py-3.5 font-medium hover:scale-[1.02] transition"
                  >
                    ✦ Создать мой маршрут
                  </button>
                )}

              </div>

            </div>

          </div>
        )}

        {/* RESULT */}

        {generated && (
          <section
            id="alma-route"
            className="mt-16 scroll-mt-28"
          >

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

              <div>

                <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
                  Твой маршрут
                </p>

                <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  Кажется, тебе сюда
                </h2>

                <p className="mt-4 text-lg text-neutral-500">
                  {mood} · {company} · {budget}
                </p>

              </div>

              <button
                type="button"
                onClick={reset}
                className="self-start rounded-full border border-black/10 bg-white px-6 py-3.5 font-medium hover:bg-black hover:text-white transition"
              >
                ✦ Удиви меня ещё раз
              </button>

            </div>

            <div className="mt-10 grid gap-5">

              {matchingPlaces.map(
                (place, index) => (
                  <div
                    key={place.id}
                    className="grid lg:grid-cols-[220px_1fr_auto] gap-6 bg-white rounded-[30px] p-4 sm:p-5 border border-black/5"
                  >

                    <div className="relative min-h-[190px] lg:min-h-[170px] rounded-[22px] overflow-hidden bg-neutral-100">

                      <img
                        src={place.image}
                        alt={place.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                    </div>

                    <div className="py-2">

                      <div className="flex items-center gap-3">

                        <span className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>

                        <span className="text-sm text-neutral-400">
                          Остановка {index + 1}
                        </span>

                      </div>

                      <p className="mt-5 text-sm text-neutral-500">
                        {place.category}
                      </p>

                      <h3 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
                        {place.name}
                      </h3>

                      <p className="mt-3 max-w-xl text-neutral-500 leading-7">
                        {place.why}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">

                        <span className="rounded-full bg-[#f3f1ed] px-3 py-2 text-sm">
                          {place.mood}
                        </span>

                        <span className="rounded-full bg-[#f3f1ed] px-3 py-2 text-sm">
                          {place.duration}
                        </span>

                        <span className="rounded-full bg-[#f3f1ed] px-3 py-2 text-sm">
                          {place.price}
                        </span>

                      </div>

                    </div>

                    <div className="flex lg:flex-col items-start lg:items-end justify-between gap-4 p-2">

                      <div className="lg:text-right">

                        <p className="text-xs text-neutral-400">
                          Стоимость
                        </p>

                        <p className="mt-1 font-semibold">
                          {place.price}
                        </p>

                      </div>

                      <Link
                        href={`/place/${place.id}`}
                        className="rounded-full bg-black text-white px-5 py-3 text-sm font-medium hover:opacity-80 transition"
                      >
                        Подробнее →
                      </Link>

                    </div>

                  </div>
                )
              )}

            </div>

            <div className="mt-6 rounded-[30px] bg-black text-white p-7 sm:p-9">

              <div className="grid sm:grid-cols-3 gap-7">

                <div>

                  <p className="text-sm text-white/40">
                    Настроение
                  </p>

                  <p className="mt-2 text-xl font-semibold">
                    {mood}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-white/40">
                    Компания
                  </p>

                  <p className="mt-2 text-xl font-semibold">
                    {company}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-white/40">
                    Бюджет
                  </p>

                  <p className="mt-2 text-xl font-semibold">
                    {budget}
                  </p>

                </div>

              </div>

              <div className="mt-8 pt-7 border-t border-white/10 flex flex-wrap gap-3">

                <Link
                  href="/map"
                  className="rounded-full bg-white text-black px-6 py-3.5 font-medium"
                >
                  Посмотреть на карте →
                </Link>

                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full border border-white/20 px-6 py-3.5 text-white/70 hover:text-white transition"
                >
                  Собрать другой маршрут
                </button>

              </div>

            </div>

          </section>
        )}

      </section>

    </main>
  );
}