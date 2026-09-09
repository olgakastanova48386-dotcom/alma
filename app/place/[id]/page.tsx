"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mapPlaces } from "@/data/mapPlaces";
import PlaceOutfitAdvice from "@/components/PlaceOutfitAdvice";

const FAVORITES_KEY = "alma-favorites";

function readLocalFavorites() {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

export default function PlacePage() {
  const params = useParams();
  const id = Number(params?.id);
  const place = mapPlaces.find((item) => item.id === id);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadFavorites() {
      const localIds = readLocalFavorites();
      try {
        const meRes = await fetch("/api/auth/me", { credentials: "include" });
        const me = meRes.ok ? await meRes.json() : { user: null };
        if (!me.user) {
          if (active) {
            setSignedIn(false);
            setFavorites(localIds);
          }
          return;
        }

        if (active) setSignedIn(true);
        for (const placeId of localIds) {
          await fetch("/api/favorites", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ placeId })
          });
        }

        const favRes = await fetch("/api/favorites", { credentials: "include" });
        const data = favRes.ok ? await favRes.json() : { ids: localIds };
        const ids = Array.isArray(data.ids) ? data.ids.map(Number).filter(Number.isFinite) : localIds;
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
        if (active) setFavorites(ids);
      } catch {
        if (active) setFavorites(localIds);
      } finally {
        if (active) setFavoritesLoaded(true);
      }
    }
    loadFavorites();
    return () => { active = false; };
  }, []);

  const isFavorite = place ? favorites.includes(place.id) : false;
  const gallery = place?.gallery?.length ? place.gallery : place?.image ? [place.image] : [];
  const heroImage = gallery[activePhoto] ?? place?.image ?? "";

  async function toggleFavorite() {
    if (!place) return;
    const adding = !isFavorite;
    const nextFavorites = adding ? [...favorites, place.id] : favorites.filter((item) => item !== place.id);
    setFavorites(nextFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));

    if (signedIn) {
      await fetch("/api/favorites", {
        method: adding ? "POST" : "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: place.id })
      }).catch(() => null);
    }
  }

  if (!place) {
    return <main className="min-h-screen bg-[#f7f4ef] pt-36 pb-20"><div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><div className="rounded-[32px] bg-white p-8 sm:p-12 border border-black/5"><p className="text-sm uppercase tracking-[0.2em] text-neutral-500">ALMA</p><h1 className="mt-4 text-4xl sm:text-5xl font-bold">Место не найдено</h1><p className="mt-4 text-neutral-500 text-lg">Возможно, ссылка устарела или это место пока недоступно.</p><Link href="/map" className="inline-flex mt-8 rounded-full bg-black text-white px-6 py-3.5 font-medium hover:opacity-80 transition">← Вернуться к карте</Link></div></div></main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] pt-28 sm:pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-7"><Link href="/map" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition"><span>←</span><span>Вернуться к карте</span></Link></div>
        <section className="grid lg:grid-cols-[1.08fr_0.92fr] gap-5 sm:gap-8 lg:gap-12 items-stretch">
          <div>
            <div className="relative min-h-[340px] sm:min-h-[560px] lg:min-h-[700px] rounded-[22px] sm:rounded-[40px] overflow-hidden bg-neutral-200">
              {heroImage ? <img src={heroImage} alt={place.name} className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0 bg-gradient-to-br from-[#ddd0c0] via-[#f3ece4] to-[#cfc1af]" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              <div className="absolute top-4 left-4 sm:top-7 sm:left-7"><span className="inline-flex rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-black shadow-sm">{place.category}</span></div>
              <div className="absolute left-4 right-4 bottom-4 sm:left-7 sm:right-7 sm:bottom-7"><div className="inline-flex rounded-full bg-black/80 backdrop-blur-md text-white px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">✦ {place.mood}</div></div>
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:mt-4 sm:gap-3">
                {gallery.map((photo, index) => (
                  <button
                    key={`${photo}-${index}`}
                    type="button"
                    onClick={() => setActivePhoto(index)}
                    aria-label={`Фото ${index + 1}: ${place.name}`}
                    className={`relative aspect-[4/3] overflow-hidden rounded-[14px] sm:rounded-[20px] border-2 transition ${activePhoto === index ? "border-black" : "border-transparent opacity-80 hover:opacity-100"}`}
                  >
                    <img src={photo} alt={`${place.name}, фото ${index + 1}`} className="absolute inset-0 h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between py-1 lg:py-3">
            <div>
              <h1 className="text-[34px] sm:text-5xl lg:text-[58px] font-bold leading-[1.02] tracking-tight text-neutral-900">{place.name}</h1>
              {place.rating && <div className="mt-3 sm:mt-5 flex flex-wrap items-center gap-2 sm:gap-3"><span className="rounded-full bg-black text-white px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold">★ {place.rating.toFixed(1)} / 5</span>{place.ratingSource && <span className="text-xs sm:text-sm text-neutral-500">Источник: {place.ratingSource}</span>}</div>}

              {place.description && (
                <div className="mt-5 sm:mt-7 rounded-[18px] sm:rounded-[28px] bg-white border border-black/5 p-4 sm:p-7">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] text-neutral-400">О месте</p>
                  <p className="mt-2 sm:mt-3 text-[15px] sm:text-lg leading-6 sm:leading-8 text-neutral-700">{place.description}</p>
                </div>
              )}

              <div className="mt-3 sm:mt-6 rounded-[18px] sm:rounded-[28px] bg-black text-white p-4 sm:p-7">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] text-white/45">Почему сюда</p>
                <p className="mt-2 text-[17px] leading-6 sm:mt-3 sm:text-2xl sm:leading-8 font-medium">{place.why}</p>
              </div>

              <div className="mt-3 sm:mt-6 rounded-[18px] sm:rounded-[28px] bg-white border border-black/5 p-4 sm:p-7">
                <p className="text-xs sm:text-sm text-neutral-500">Стоимость</p>
                <p className="mt-1 text-[24px] sm:mt-2 sm:text-4xl font-bold tracking-tight text-black">{place.price}</p>
                <p className="mt-1 text-sm sm:mt-2 sm:text-base font-medium text-neutral-700">{place.priceNote}</p>
              </div>

              <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-[16px] sm:rounded-[24px] bg-white border border-black/5 p-3 sm:p-5"><p className="text-[11px] sm:text-sm text-neutral-500">Настроение</p><p className="mt-1 text-[13px] sm:mt-2 sm:text-lg font-semibold leading-4 sm:leading-normal">{place.mood}</p></div>
                <div className="rounded-[16px] sm:rounded-[24px] bg-white border border-black/5 p-3 sm:p-5"><p className="text-[11px] sm:text-sm text-neutral-500">Время</p><p className="mt-1 text-[13px] sm:mt-2 sm:text-lg font-semibold leading-4 sm:leading-normal">{place.duration}</p></div>
                <div className="rounded-[16px] sm:rounded-[24px] bg-white border border-black/5 p-3 sm:p-5"><p className="text-[11px] sm:text-sm text-neutral-500">Компания</p><p className="mt-1 text-[13px] sm:mt-2 sm:text-lg font-semibold leading-4 sm:leading-7">{place.company.join(", ")}</p></div>
              </div>

              <div className="mt-3 sm:mt-4 rounded-[18px] sm:rounded-[24px] bg-white border border-black/5 p-4 sm:p-6"><p className="text-xs sm:text-sm text-neutral-500">Адрес</p><div className="mt-2 flex items-start gap-2 sm:gap-3"><span className="text-base sm:text-lg">📍</span><p className="text-sm sm:text-lg font-medium leading-6 sm:leading-7">{place.address}</p></div>{place.babyCare && <div className="mt-3 rounded-xl sm:rounded-2xl bg-[#efe5d7] px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm font-medium">👶 {place.babyCare}</div>}{place.dogFriendly && <div className="mt-2 rounded-xl sm:rounded-2xl bg-[#eef3e9] px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm font-medium">🐾 Dog Friendly</div>}</div>
              <PlaceOutfitAdvice lat={place.lat} lng={place.lng} category={place.category} />
            </div>

            <div className="mt-5 sm:mt-8 grid grid-cols-2 gap-2.5 sm:flex sm:flex-row sm:gap-3"><Link href={`/map?place=${place.id}`} className="sm:flex-1 rounded-full bg-black text-white px-4 py-3.5 sm:px-7 sm:py-4 text-center text-sm sm:text-base font-medium hover:opacity-85 transition">На карте</Link><button type="button" onClick={toggleFavorite} disabled={!favoritesLoaded} aria-pressed={isFavorite} className={`sm:flex-1 rounded-full border px-4 py-3.5 sm:px-7 sm:py-4 text-sm sm:text-base font-medium transition-all duration-300 ${isFavorite ? "bg-black border-black text-white" : "bg-white border-black/10 text-black hover:bg-black hover:text-white"}`}>{isFavorite ? "♥ Сохранено" : "♡ В избранное"}</button></div>
            {favoritesLoaded && !signedIn && <p className="mt-3 text-center sm:text-left text-xs text-neutral-400">Войдите в ALMA, чтобы избранное сохранилось в аккаунте.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
