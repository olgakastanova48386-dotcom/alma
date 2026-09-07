import Link from "next/link";
import { restaurantPlaces } from "@/data/restaurantPlaces";

export default function RestaurantsPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-28 sm:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div><p className="text-xs uppercase tracking-[0.22em] text-neutral-500">ALMA · Санкт-Петербург</p><h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">Рестораны с рейтингом 4,5–5,0</h1><p className="mt-4 max-w-3xl text-neutral-600 text-base sm:text-lg leading-8">Проверенная подборка ALMA. Показываем рейтинг, количество оценок и дату проверки.</p></div>
          <div className="rounded-full bg-black text-white px-5 py-3 text-sm font-medium self-start lg:self-auto">{restaurantPlaces.length} мест</div>
        </div>
        <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {restaurantPlaces.map((place, index) => (
            <article key={place.id} className="rounded-[28px] bg-white border border-black/5 p-6 shadow-sm flex flex-col">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Ресторан</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">{place.name}</h2></div><div className="shrink-0 rounded-full bg-[#f3f1ed] px-3 py-2 text-sm font-semibold">★ {place.rating.toFixed(1)} / 5</div></div>
              <p className="mt-4 text-sm leading-6 text-neutral-600">{place.note}</p>
              <div className="mt-5 space-y-2 text-sm text-neutral-600"><p><span className="text-black font-medium">Адрес:</span> {place.address}</p>{place.averageBill && <p><span className="text-black font-medium">Средний счёт:</span> {place.averageBill}</p>}{place.phone && <p><span className="text-black font-medium">Телефон:</span> {place.phone}</p>}{place.dogFriendly && <p><span className="text-black font-medium">Dog Friendly:</span> {place.dogFriendly}</p>}</div>
              <div className="mt-auto pt-6"><div className="pt-5 border-t border-black/5 text-xs text-neutral-500 leading-5"><p>★ {place.rating.toFixed(1)} из 5 · {place.ratingCount.toLocaleString("ru-RU")} оценок</p><p>Проверено ALMA: {place.ratingUpdated}</p></div><div className="mt-5 flex justify-end"><Link href={`/map?place=${2001 + index}`} title="На карте" aria-label={`${place.name} на карте ALMA`} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition hover:scale-105"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></Link></div></div>
            </article>
          ))}
        </div>
        <div className="mt-10"><Link href="/map" className="inline-flex rounded-full bg-white border border-black/5 px-5 py-3 text-sm font-medium shadow-sm">← К карте</Link></div>
      </div>
    </main>
  );
}
