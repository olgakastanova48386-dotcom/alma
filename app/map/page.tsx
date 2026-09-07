import Link from "next/link";
import UnifiedMap from "@/components/UnifiedMap";
import { coffeePlaces } from "@/data/coffeePlaces";
import { restaurantPlaces } from "@/data/restaurantPlaces";
import { dogFriendlyPlaces } from "@/data/dogFriendlyPlaces";
import { drivePlaces } from "@/data/drivePlaces";

const verified = (rating: number) => rating >= 4.5 && rating <= 5;

const collections = [
  { emoji: "⚡", title: "Драйв", subtitle: "Активный отдых", href: "/map?category=drive" },
  { emoji: "☕", title: "Кофейни 4,5–5,0", subtitle: `${coffeePlaces.filter((place) => verified(place.rating)).length} проверенных мест`, href: "/coffee" },
  { emoji: "🍽️", title: "Рестораны 4,5–5,0", subtitle: `${restaurantPlaces.filter((place) => verified(place.rating)).length} проверенных мест`, href: "/restaurants" },
  { emoji: "🐾", title: "С собакой", subtitle: `${dogFriendlyPlaces.filter((place) => place.ratingScale === 5 && verified(place.rating)).length} проверенных мест`, href: "/dog-friendly" },
  { emoji: "❤️", title: "Для свидания", subtitle: "Под настроение и компанию", href: "/map?mood=Романтика&company=Пара" },
];

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-24 sm:pt-28 pb-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-3">
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-neutral-500">ALMA · Санкт-Петербург</p>
        <h1 className="mt-2 sm:mt-3 text-3xl sm:text-5xl font-bold tracking-tight">Найди место</h1>
        <p className="mt-2 sm:mt-3 max-w-xl text-[15px] sm:text-base leading-6 text-neutral-500">Выбирай вручную или начни с готовой подборки.</p>

        <div className="mt-3 sm:mt-5 -mx-4 px-4 flex gap-2.5 overflow-x-auto pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 xl:grid-cols-5 sm:overflow-visible sm:pb-0">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              href={collection.href}
              className={`group min-w-[156px] max-w-[172px] snap-start rounded-[18px] sm:rounded-[24px] border px-3.5 py-3 sm:p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:min-w-0 sm:max-w-none ${collection.title==="Драйв"?"border-black bg-black text-white":"border-black/5 bg-white text-black"}`}
            >
              <div className="text-lg sm:text-2xl">{collection.emoji}</div>
              <h2 className="mt-2 text-[15px] leading-5 sm:mt-4 sm:text-lg font-semibold">{collection.title}</h2>
              <p className={`mt-1 text-[13px] leading-[18px] sm:text-sm ${collection.title==="Драйв"?"text-white/65":"text-neutral-500"}`}>{collection.subtitle}</p>
              <span className={`mt-2 sm:mt-4 inline-flex text-[13px] sm:text-sm font-medium transition ${collection.title==="Драйв"?"text-white/80 group-hover:text-white":"text-black/70 group-hover:text-black"}`}>Открыть →</span>
            </Link>
          ))}
        </div>
      </section>
      <UnifiedMap />
    </main>
  );
}
