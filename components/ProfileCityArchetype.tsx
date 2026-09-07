"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ArchetypeKey = "romantic" | "aesthete" | "explorer" | "hedonist";

type Archetype = {
  title: string;
  emoji: string;
  accent: string;
  description: string;
  hint: string;
};

const archetypes: Record<ArchetypeKey, Archetype> = {
  romantic: {
    title: "Городской романтик",
    emoji: "♡",
    accent: "#eadbd6",
    description: "Ты замечаешь атмосферу раньше вывески: красивый свет, разговоры допоздна, вода, крыши и места с историей.",
    hint: "ALMA будет чаще предлагать закаты, камерные рестораны, прогулки у воды и точки с настроением."
  },
  aesthete: {
    title: "Эстет деталей",
    emoji: "✦",
    accent: "#dedccf",
    description: "Тебе важно, как место выглядит и ощущается: архитектура, интерьер, выставка, подача и тот самый кадр.",
    hint: "ALMA будет чаще подмешивать дизайн, искусство, красивые интерьеры и фотогеничные остановки."
  },
  explorer: {
    title: "Городской исследователь",
    emoji: "⌖",
    accent: "#d9e5df",
    description: "Тебе хочется открывать новое и неочевидное — дворы, локальные пространства, необычные маршруты и места «не для всех».",
    hint: "ALMA будет чаще вести в неожиданные районы, скрытые точки и места, которые легко пропустить."
  },
  hedonist: {
    title: "Гедонист города",
    emoji: "☕",
    accent: "#e8dfd0",
    description: "Ты выбираешь город через удовольствие: вкусная еда, хороший кофе, комфорт, красивые паузы и минимум суеты.",
    hint: "ALMA будет чаще собирать день вокруг гастрономии, удобных перемещений и приятных остановок."
  }
};

const questions = [
  {
    text: "Идеальный свободный вечер — это…",
    answers: [
      ["romantic", "Прогулка на закате и красивый ужин"],
      ["aesthete", "Новая выставка и стильное место после"],
      ["explorer", "Уехать в незнакомый район и смотреть по сторонам"],
      ["hedonist", "Вкусно поесть и никуда не спешить"]
    ] as [ArchetypeKey, string][]
  },
  {
    text: "Что заставляет сохранить место?",
    answers: [
      ["aesthete", "Интерьер и визуал"],
      ["hedonist", "Меню и отзывы про еду"],
      ["explorer", "Ощущение, что я нашёл секрет"],
      ["romantic", "Атмосфера и история места"]
    ] as [ArchetypeKey, string][]
  },
  {
    text: "Если ALMA даст тебе один сюрприз, что выбираешь?",
    answers: [
      ["explorer", "Совсем неочевидную точку"],
      ["romantic", "Маршрут с вау-финалом"],
      ["hedonist", "Место, где точно будет вкусно"],
      ["aesthete", "Локацию, которую хочется сфотографировать"]
    ] as [ArchetypeKey, string][]
  }
];

const STORAGE_KEY = "alma_city_archetype";

export default function ProfileCityArchetype() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<ArchetypeKey, number>>({ romantic: 0, aesthete: 0, explorer: 0, hedonist: 0 });
  const [result, setResult] = useState<ArchetypeKey | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ArchetypeKey | null;
    if (saved && archetypes[saved]) setResult(saved);
  }, []);

  const current = questions[step];
  const resultData = useMemo(() => result ? archetypes[result] : null, [result]);

  function answer(key: ArchetypeKey) {
    const next = { ...scores, [key]: scores[key] + 1 };
    setScores(next);
    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }
    const winner = (Object.entries(next) as [ArchetypeKey, number][]).sort((a, b) => b[1] - a[1])[0][0];
    setResult(winner);
    window.localStorage.setItem(STORAGE_KEY, winner);
  }

  function reset() {
    setStep(0);
    setScores({ romantic: 0, aesthete: 0, explorer: 0, hedonist: 0 });
    setResult(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <section className="mt-6 overflow-hidden rounded-[30px] border border-black/5 bg-black text-white shadow-sm">
      <div className="p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45">Только в твоём профиле</p>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Твой городской архетип</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">Три быстрых выбора — и ALMA скажет, как ты на самом деле любишь проживать город.</p>
          </div>
          <span className="text-3xl">✦</span>
        </div>
      </div>

      {!resultData ? (
        <div className="bg-[#f4efe7] p-6 sm:p-8 text-black">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Вопрос {step + 1} из {questions.length}</p>
            <div className="flex gap-1.5">{questions.map((_, i) => <span key={i} className={`h-1.5 w-8 rounded-full ${i <= step ? "bg-black" : "bg-black/10"}`} />)}</div>
          </div>
          <h3 className="mt-5 text-xl sm:text-2xl font-semibold">{current.text}</h3>
          <div className="mt-5 grid gap-2">
            {current.answers.map(([key, label]) => (
              <button key={label} type="button" onClick={() => answer(key)} className="rounded-[20px] border border-black/10 bg-white px-4 py-4 text-left text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm">
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-8 text-black" style={{ background: resultData.accent }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-black/45">ALMA считает, что ты</p>
              <h3 className="mt-2 text-3xl sm:text-4xl font-bold">{resultData.emoji} {resultData.title}</h3>
            </div>
            <button type="button" onClick={reset} className="rounded-full border border-black/10 bg-white/60 px-4 py-2 text-xs font-medium">Пройти заново</button>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-black/65">{resultData.description}</p>
          <div className="mt-5 rounded-[22px] bg-white/65 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-black/40">Что это меняет</p>
            <p className="mt-2 text-sm leading-6">{resultData.hint}</p>
          </div>
          <Link href="/surprise" className="mt-5 inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">Собрать день под мой тип →</Link>
        </div>
      )}
    </section>
  );
}
