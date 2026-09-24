"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mapPlaces } from "@/data/mapPlaces";

const FAVORITES_KEY = "alma-favorites";

function MapPinIcon() {
  return <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
}

function readLocalFavorites() {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const localIds = readLocalFavorites();
      try {
        const meRes = await fetch("/api/auth/me", { credentials: "include" });
        const me = meRes.ok ? await meRes.json() : { user: null };
        if (!me.user) {
          if (active) {
            setSignedIn(false);
            setFavoriteIds(localIds);
          }
          return;
        }

        setSignedIn(true);
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
        if (active) setFavoriteIds(ids);
      } catch {
        if (active) setFavoriteIds(localIds);
      } finally {
        if (active) setLoaded(true);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const favoritePlaces = mapPlaces.filter((place) => favoriteIds.includes(place.id));

  async function removeFavorite(placeId: number) {
    const nextFavorites = favoriteIds.filter((id) => id !== placeId);
    setFavoriteIds(nextFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
    if (signedIn) {
      await fetch("/api/favorites", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId })
      }).catch(() => null);
    }
  }

  if (!loaded) return <main className="min-h-screen bg-[#f7f4ef] pt-[calc(env(safe-area-inset-top)+68px)] sm:pt-36 pb-20"><div className="max-w-7xl mx-auto px-4 sm:px-6"><p className="text-neutral-500">Загружаем избранное…</p></div></main>;

  return <main className="min-h-screen bg-[#f7f4ef] pt-[calc(env(safe-area-inset-top)+68px)] sm:pt-36 pb-24"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3"><div><h1 className="text-[30px] sm:text-5xl lg:text-6xl font-bold tracking-tight">Избранное</h1><p className="mt-1.5 text-[13px] leading-5 sm:text-lg text-neutral-500 max-w-2xl">{signedIn ? "Сохранённые места привязаны к вашему аккаунту ALMA." : "Сейчас места сохранены на этом устройстве. Войдите, чтобы они были доступны в аккаунте."}</p>{!signedIn&&<Link href="/login?next=%2Ffavorites" className="inline-flex mt-2 text-sm font-semibold underline underline-offset-4">Войти в аккаунт</Link>}</div>{favoritePlaces.length>0&&<div className="self-start lg:self-auto rounded-full bg-white border border-black/5 shadow-sm px-3 py-2 text-xs">Сохранено: <strong>{favoritePlaces.length}</strong></div>}</div>

    {favoritePlaces.length===0?<section className="mt-4 sm:mt-16"><div className="rounded-[22px] bg-white border border-black/5 p-5 sm:p-14 lg:p-16 text-center"><div className="mx-auto w-12 h-12 rounded-full bg-[#f3f1ed] flex items-center justify-center text-3xl">♡</div><h2 className="mt-3 text-xl sm:text-4xl font-bold">Пока ничего не сохранено</h2><p className="mt-4 text-neutral-500 text-sm sm:text-lg leading-6 sm:leading-8 max-w-xl mx-auto">Открой понравившееся место и нажми «В избранное». Оно появится здесь.</p><Link href="/#alma-filters" className="inline-flex mt-5 rounded-full bg-black text-white px-7 py-4 font-medium hover:opacity-80 transition">Найти место</Link></div></section>:
    <section className="mt-4 sm:mt-12"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">{favoritePlaces.map(place=><article key={place.id} className="group rounded-[28px] bg-white border border-black/5 overflow-hidden shadow-sm"><Link href={`/place/${place.id}`} className="block"><div className="relative h-[180px] sm:h-[300px] overflow-hidden bg-neutral-200"><img src={place.image} alt={place.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.03]"/><div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"/><div className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-xs">{place.category}</div><div className="absolute left-4 bottom-4 rounded-full bg-black text-white px-3 py-1.5 text-xs">{place.price}</div></div><div className="p-4 sm:p-6"><p className="text-xs uppercase tracking-[0.14em] text-neutral-400">{place.mood}</p><h2 className="mt-1 text-[20px] leading-tight font-bold">{place.name}</h2><p className="mt-2 text-[13px] text-neutral-500 leading-5 line-clamp-2">{place.why}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-[#f3f1ed] px-3 py-1.5 text-xs">{place.duration}</span><span className="rounded-full bg-[#f3f1ed] px-3 py-1.5 text-xs">{place.company[0]}</span></div></div></Link><div className="px-4 sm:px-6 pb-4 sm:pb-6 flex items-center gap-3"><button type="button" onClick={()=>removeFavorite(place.id)} className="flex-1 rounded-full border border-black/10 px-5 py-3 text-sm font-medium hover:bg-black hover:text-white transition">♥ Удалить</button><Link href={`/?place=${place.id}#alma-filters`} title="На карте" aria-label={`${place.name} на карте ALMA`} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:scale-105"><MapPinIcon/></Link></div></article>)}</div></section>}
  </div></main>;
}
