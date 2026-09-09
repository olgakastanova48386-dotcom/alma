import Link from "next/link";
import { Suspense } from "react";
import UnifiedMap from "@/components/UnifiedMap";

const collections = [
  { title: "Готовый план", href: "/surprise", featured: true },
  { title: "Кофейни", href: "/coffee" },
  { title: "Рестораны", href: "/restaurants" },
  { title: "С собакой", href: "/dog-friendly" },
  { title: "Для свидания", href: "/map?mood=Романтика&company=Пара" },
  { title: "Драйв", href: "/map?category=drive" },
];

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-24 sm:pt-28 pb-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-3">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Выбери место</h1>
        <p className="mt-2 sm:mt-3 max-w-xl text-[15px] sm:text-base leading-6 text-neutral-500">Начни с готового плана или выбери конкретную категорию.</p>

        <div className="mt-3 sm:mt-5 -mx-4 px-4 flex gap-2.5 overflow-x-auto pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 xl:grid-cols-6 sm:overflow-visible sm:pb-0">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              href={collection.href}
              className={`group min-w-[156px] max-w-[172px] snap-start rounded-[18px] sm:rounded-[24px] border px-3.5 py-3 sm:p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:min-w-0 sm:max-w-none ${collection.featured ? "border-black bg-black text-white" : "border-black/5 bg-white text-black"}`}
            >
              <h2 className="text-[15px] leading-5 sm:text-lg font-semibold">{collection.title}</h2>
              <span className={`mt-2 sm:mt-4 inline-flex text-[13px] sm:text-sm font-medium transition ${collection.featured ? "text-white/80 group-hover:text-white" : "text-black/70 group-hover:text-black"}`}>Открыть →</span>
            </Link>
          ))}
        </div>
      </section>
      <Suspense fallback={<section className="mx-auto max-w-7xl px-4 sm:px-6"><div className="min-h-[560px] rounded-[28px] bg-[#ebe8e3] flex items-center justify-center text-neutral-500">Загружаем карту…</div></section>}>
        <UnifiedMap />
      </Suspense>
    </main>
  );
}
