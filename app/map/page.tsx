import Link from "next/link";
import UnifiedMap from "@/components/UnifiedMap";

const collections = [
  { emoji: "☕", title: "Кофейни 4,5–5,0", subtitle: "10 проверенных мест", href: "/coffee" },
  { emoji: "🍽️", title: "Рестораны 4,5–5,0", subtitle: "10 проверенных мест", href: "/restaurants" },
  { emoji: "🐾", title: "С собакой", subtitle: "Dog-friendly места Петербурга", href: "/dog-friendly" },
  { emoji: "❤️", title: "Для свидания", subtitle: "Под настроение и компанию", href: "/map?mood=Романтика&company=Пара" },
];

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-28 pb-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-3">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">ALMA · Санкт-Петербург</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">Найди место</h1>
        <p className="mt-3 max-w-xl text-neutral-500">Выбирай вручную или начни с готовой подборки.</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              href={collection.href}
              className="group rounded-[24px] border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-2xl">{collection.emoji}</div>
              <h2 className="mt-4 text-lg font-semibold text-black">{collection.title}</h2>
              <p className="mt-1 text-sm text-neutral-500">{collection.subtitle}</p>
              <span className="mt-4 inline-flex text-sm font-medium text-black/70 transition group-hover:text-black">Открыть →</span>
            </Link>
          ))}
        </div>
      </section>

      <UnifiedMap />
    </main>
  );
}
