"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { places } from "@/data/places";
import PlaceOutfitAdvice from "@/components/PlaceOutfitAdvice";

const FAVORITES_KEY = "alma-favorites";

export default function PlacePage() {
  const params = useParams();
  const id = Number(params?.id);
  const place = places.find((item) => item.id === id);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setFavorites(parsed.map((item) => Number(item)).filter((item) => Number.isFinite(item)));
      }
    } catch { setFavorites([]); }
    finally { setFavoritesLoaded(true); }
  }, []);

  const isFavorite = place ? favorites.includes(place.id) : false;
  const toggleFavorite = () => {
    if (!place) return;
    const nextFavorites = isFavorite ? favorites.filter((item) => item !== place.id) : [...favorites, place.id];
    setFavorites(nextFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
  };

  if (!place) {
    return <main className="min-h-screen bg-[#f7f4ef] pt-36 pb-20"><div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><div className="rounded-[32px] bg-white p-8 sm:p-12 border border-black/5"><p className="text-sm uppercase tracking-[0.2em] text-neutral-500">ALMA</p><h1 className="mt-4 text-4xl sm:text-5xl font-bold">Место не найдено</h1><p className="mt-4 text-neutral-500 text-lg">Возможно, ссылка устарела или это место пока недоступно.</p><Link href="/map" className="inline-flex mt-8 rounded-full bg-black text-white px-6 py-3.5 font-medium hover:opacity-80 transition">← Вернуться к карте</Link></div></div></main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-32 sm:pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-7"><Link href="/map" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition"><span>←</span><span>Вернуться к карте</span></Link></div>
        <section className="grid lg:grid-cols-[1.08fr_0.92fr] gap-8 lg:gap-12 items-stretch">
          <div className="relative min-h-[460px] sm:min-h-[560px] lg:min-h-[700px] rounded-[30px] sm:rounded-[40px] overflow-hidden bg-neutral-200">
            <img src={place.image} alt={place.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
            <div className="absolute top-5 left-5 sm:top-7 sm:left-7"><span className="inline-flex rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-sm text-black shadow-sm">{place.category}</span></div>
            <div className="absolute left-5 right-5 bottom-5 sm:left-7 sm:right-7 sm:bottom-7"><div className="inline-flex rounded-full bg-black/80 backdrop-blur-md text-white px-4 py-2 text-sm">✦ {place.mood}</div></div>
          </div>

          <div className="flex flex-col justify-between py-1 lg:py-3">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-neutral-500">ALMA · Санкт-Петербург</p>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[58px] font-bold leading-[1.02] tracking-tight text-neutral-900">{place.name}</h1>
              <p className="mt-6 text-lg sm:text-xl leading-8 text-neutral-600">{place.description}</p>
              <div className="mt-8 rounded-[28px] bg-black text-white p-6 sm:p-7"><p className="text-xs uppercase tracking-[0.18em] text-white/45">Почему сюда</p><p className="mt-3 text-xl sm:text-2xl leading-8 font-medium">{place.why}</p></div>
              <div className="mt-6 rounded-[28px] bg-white border border-black/5 p-6 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5"><div><p className="text-sm text-neutral-500">Стоимость</p><p className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-black">{place.price}</p><p className="mt-2 text-base font-medium text-neutral-700">{place.priceNote}</p></div><div className="shrink-0 rounded-full bg-[#f3f1ed] px-4 py-2 text-xs text-neutral-500">обновлено {place.priceUpdated}</div></div>
                {place.priceDetails && <div className="mt-5 pt-5 border-t border-black/5"><p className="text-sm sm:text-base leading-7 text-neutral-500">{place.priceDetails}</p></div>}
              </div>
              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <div className="rounded-[24px] bg-white border border-black/5 p-5"><p className="text-sm text-neutral-500">Настроение</p><p className="mt-2 text-lg font-semibold">{place.mood}</p></div>
                <div className="rounded-[24px] bg-white border border-black/5 p-5"><p className="text-sm text-neutral-500">Длительность</p><p className="mt-2 text-lg font-semibold">{place.duration}</p></div>
                <div className="rounded-[24px] bg-white border border-black/5 p-5"><p className="text-sm text-neutral-500">Компания</p><p className="mt-2 text-base sm:text-lg font-semibold leading-7">{place.company.join(", ")}</p></div>
              </div>
              <div className="mt-4 rounded-[24px] bg-white border border-black/5 p-5 sm:p-6"><p className="text-sm text-neutral-500">Адрес</p><div className="mt-2 flex items-start gap-3"><span className="text-lg">📍</span><p className="text-base sm:text-lg font-medium leading-7">{place.address}</p></div></div>

              <PlaceOutfitAdvice lat={place.lat} lng={place.lng} category={place.category} />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href={`/map?place=${place.id}`} className="flex-1 rounded-full bg-black text-white px-7 py-4 text-center font-medium hover:opacity-85 transition">Показать на карте</Link>
              <button type="button" onClick={toggleFavorite} disabled={!favoritesLoaded} aria-pressed={isFavorite} className={`flex-1 rounded-full border px-7 py-4 font-medium transition-all duration-300 ${isFavorite ? "bg-black border-black text-white" : "bg-white border-black/10 text-black hover:bg-black hover:text-white"}`}>{isFavorite ? "♥ В избранном" : "♡ В избранное"}</button>
            </div>
          </div>
        </section>

        <section className="mt-16 sm:mt-20"><div className="rounded-[32px] sm:rounded-[40px] bg-black text-white p-7 sm:p-10 lg:p-12"><p className="text-white/45 text-sm uppercase tracking-[0.18em]">ALMA</p><div className="mt-3 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"><div><h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">{isFavorite ? "Место сохранено" : "Подходит тебе?"}</h2><p className="mt-4 text-white/60 text-lg leading-8 max-w-2xl">{isFavorite ? "ALMA запомнила это место. Ты сможешь вернуться к нему позже." : "Сохрани место и вернись к нему, когда появится подходящее настроение."}</p></div><Link href="/map" className="shrink-0 rounded-full bg-white text-black px-7 py-4 text-center font-medium hover:scale-105 transition">Вернуться к карте</Link></div></div></section>
      </div>
    </main>
  );
}
