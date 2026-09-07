import Link from "next/link";
import { coffeePlaces } from "@/data/coffeePlaces";

export default function CoffeePage() {
  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-28 sm:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
              ALMA · Санкт-Петербург
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Кофейни с рейтингом 4,5–5,0
            </h1>
            <p className="mt-4 max-w-3xl text-neutral-600 text-base sm:text-lg leading-8">
              Первая проверенная подборка ALMA. Рейтинг показываем вместе с источником и датой проверки, чтобы не смешивать данные разных сервисов.
            </p>
          </div>

          <div className="rounded-full bg-black text-white px-5 py-3 text-sm font-medium self-start lg:self-auto">
            {coffeePlaces.length} мест
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {coffeePlaces.map((place) => (
            <article
              key={place.id}
              className="rounded-[28px] bg-white border border-black/5 p-6 shadow-sm flex flex-col"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Кофейня</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">{place.name}</h2>
                </div>
                <div className="shrink-0 rounded-full bg-[#f3f1ed] px-3 py-2 text-sm font-semibold">
                  ★ {place.rating.toFixed(1)}
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-neutral-600">{place.note}</p>

              <div className="mt-5 space-y-2 text-sm text-neutral-600">
                <p><span className="text-black font-medium">Адрес:</span> {place.address}</p>
                <p><span className="text-black font-medium">Часы:</span> {place.hours}</p>
                {place.priceNote && (
                  <p><span className="text-black font-medium">Цена:</span> {place.priceNote}</p>
                )}
                {place.dogFriendly && (
                  <p><span className="text-black font-medium">Dog Friendly:</span> {place.dogFriendly}</p>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-black/5 text-xs text-neutral-500 leading-5">
                <p>{place.ratingSource} · {place.ratingCount.toLocaleString("ru-RU")} оценок</p>
                <p>Проверено ALMA: {place.ratingUpdated}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.lat},${place.lng}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-black text-white px-4 py-2.5 text-sm font-medium"
                >
                  Открыть на карте ↗
                </a>

                {place.website && (
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full bg-[#f3f1ed] px-4 py-2.5 text-sm font-medium"
                  >
                    Сайт ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/collections"
            className="inline-flex rounded-full bg-white border border-black/5 px-5 py-3 text-sm font-medium shadow-sm"
          >
            ← К подборкам
          </Link>
        </div>
      </div>
    </main>
  );
}
