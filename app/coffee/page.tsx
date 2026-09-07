import Link from "next/link";
import { coffeePlaces } from "@/data/coffeePlaces";

export default function CoffeePage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-28 sm:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">ALMA · Санкт-Петербург</p>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">Кофейни с рейтингом ★ 4,5–5,0</h1>
            <p className="mt-4 max-w-3xl text-neutral-600 text-base sm:text-lg leading-8">Проверенные кофейни Петербурга. Показываем рейтинг, количество оценок и дату проверки ALMA.</p>
          </div>
          <div className="rounded-full bg-black text-white px-5 py-3 text-sm font-medium self-start lg:self-auto">{coffeePlaces.length} мест</div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {coffeePlaces.map((place, index) => (
            <article key={place.id} className="overflow-hidden rounded-[28px] bg-white border border-black/5 shadow-sm flex flex-col">
              {place.image && <div className="aspect-[16/10] overflow-hidden bg-[#ebe8e3]"><img src={place.image} alt={`${place.name} — кофейня в Санкт-Петербурге`} className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" loading="lazy" /></div>}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Кофейня</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">{place.name}</h2></div><div className="shrink-0 rounded-full bg-[#f3f1ed] px-3 py-2 text-sm font-semibold">★ {place.rating.toFixed(1)} <span className="font-normal text-neutral-500">/ 5</span></div></div>
                <p className="mt-4 text-sm leading-6 text-neutral-600">{place.note}</p>
                <div className="mt-5 space-y-2 text-sm text-neutral-600"><p><span className="text-black font-medium">Адрес:</span> {place.address}</p><p><span className="text-black font-medium">Часы:</span> {place.hours}</p>{place.priceNote && <p><span className="text-black font-medium">Цена:</span> {place.priceNote}</p>}{place.dogFriendly && <p><span className="text-black font-medium">Dog Friendly:</span> {place.dogFriendly}</p>}</div>
                <div className="mt-auto pt-6"><div className="pt-5 border-t border-black/5 text-xs text-neutral-500 leading-5"><p>★ {place.rating.toFixed(1)} из 5 · {place.ratingCount.toLocaleString("ru-RU")} оценок</p><p>Проверено ALMA: {place.ratingUpdated}</p></div><div className="mt-5"><Link href={`/map?place=${1001 + index}`} className="inline-flex rounded-full bg-black text-white px-4 py-2.5 text-sm font-medium">Показать на карте ALMA →</Link></div></div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10"><Link href="/map" className="inline-flex rounded-full bg-white border border-black/5 px-5 py-3 text-sm font-medium shadow-sm">← К карте</Link></div>
      </div>
    </main>
  );
}
