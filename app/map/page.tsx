import Link from "next/link";
import UnifiedMap from "@/components/UnifiedMap";

const collections = [
  {
    emoji: "☕",
    title: "Кофейни 4,5–5,0",
    subtitle: "10 проверенных мест",
    href: "/coffee",
  },
  {
    emoji: "🍽️",
    title: "Рестораны 4,5–5,0",
    subtitle: "10 проверенных мест",
    href: "/restaurants",
  },
  {
    emoji: "🐾",
    title: "С собакой",
    subtitle: "Dog-friendly места Петербурга",
    href: "/dog-friendly",
  },
  {
    emoji: "❤️",
    title: "Для свидания",
    subtitle: "Под настроение и компанию",
    href: "/map?mood=Романтика&company=Пара",
  },
];

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-28 pb-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Карта ALMA
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
              Найди место на карте
            </h1>
          </div>

          <p className="max-w-xl text-neutral-500 sm:text-right">
            Выбирай место вручную или начни с готовой подборки.
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              href={collection.href}
              className="group rounded-[24px] border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-2xl">{collection.emoji}</div>
              <h2 className="mt-4 font-semibold text-lg text-black">
                {collection.title}
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                {collection.subtitle}
              </p>
              <span className="mt-4 inline-flex text-sm font-medium text-black/70 transition group-hover:text-black">
                Открыть →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <UnifiedMap />
    </main>
  );
}
