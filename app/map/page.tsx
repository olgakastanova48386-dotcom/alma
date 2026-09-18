import Link from "next/link";

const collections = [
  { title: "Готовый план", icon: "✨", href: "/surprise", featured: true },
  { title: "Кофейни", icon: "☕", href: "/coffee" },
  { title: "Рестораны", icon: "🍴", href: "/restaurants" },
  { title: "С собакой", icon: "🐾", href: "/dog-friendly" },
  { title: "Для свидания", icon: "💕", href: "/map?mood=Романтика&company=Пара" },
  { title: "Драйв", icon: "⚡", href: "/map?category=drive" },
];

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-24 sm:pt-28 pb-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-3">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Выбери место</h1>
        <p className="mt-2 sm:mt-3 max-w-xl text-[15px] sm:text-base leading-6 text-neutral-500">Начни с готового плана или выбери конкретную категорию.</p>

        <div className="mt-4 sm:mt-6 -mx-4 flex gap-3 overflow-x-auto px-4 pb-3 snap-x snap-mandatory sm:mx-0 sm:px-0 xl:overflow-visible">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              href={collection.href}
              className={`group flex h-[70px] min-w-[178px] flex-1 snap-start items-center justify-between gap-3 rounded-full border px-5 shadow-[0_5px_18px_rgba(30,24,18,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(30,24,18,0.10)] sm:h-[78px] sm:min-w-[196px] xl:min-w-0 ${collection.featured ? "border-black bg-black text-white" : "border-black/10 bg-white text-black"}`}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span aria-hidden="true" className="shrink-0 text-xl sm:text-[22px]">{collection.icon}</span>
                <span className="whitespace-nowrap text-[15px] font-semibold sm:text-base">{collection.title}</span>
              </span>
              {!collection.featured && (
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl text-black/45 transition duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
