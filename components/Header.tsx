"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = { id: string; name: string; phone: string };

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (res) => res.ok ? res.json() : { user: null })
      .then((data) => { if (active) setUser(data.user || null); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setAuthLoaded(true); });
    return () => { active = false; };
  }, []);

  const accountControl = authLoaded && user ? (
    <Link
      href="/profile"
      className="rounded-full bg-black text-white px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base hover:opacity-80 transition max-w-[150px] truncate"
      title={user.name}
    >
      {user.name}
    </Link>
  ) : (
    <Link
      href="/login"
      className="rounded-full bg-black text-white px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base hover:opacity-80 transition"
    >
      Войти
    </Link>
  );

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[9999]">
        <div className="max-w-7xl mx-auto mt-3 sm:mt-4 px-3 sm:px-6">
          <div className="flex items-center justify-between rounded-[22px] sm:rounded-full bg-white/92 backdrop-blur-xl border border-black/5 shadow-lg px-4 sm:px-8 py-2.5 sm:py-3">
            <Link href="/" className="text-lg sm:text-2xl font-bold tracking-[0.28em]">alma</Link>

            <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm md:text-base text-gray-600">
              <Link href="/" className="hover:text-black transition">Главная</Link>
              <Link href="/map" className="hover:text-black transition">Карта</Link>
              <Link href="/dog-friendly" className="hover:text-black transition">🐾 С собакой</Link>
              <Link href="/favorites" className="hover:text-black transition">♡ Избранное</Link>
              <Link href="/about" className="hover:text-black transition">О проекте</Link>
            </nav>

            {accountControl}
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-[9999] rounded-[24px] bg-white/95 backdrop-blur-xl border border-black/5 shadow-[0_16px_45px_rgba(0,0,0,.16)] px-2 py-2 safe-area-mobile-nav">
        <div className="grid grid-cols-5 items-center">
          <Link href="/" className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[18px] text-[10px] font-medium text-neutral-600 active:bg-neutral-100"><span className="text-lg leading-none">⌂</span><span>Главная</span></Link>
          <Link href="/map" className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[18px] text-[10px] font-medium text-neutral-600 active:bg-neutral-100"><span className="text-lg leading-none">⌖</span><span>Карта</span></Link>
          <Link href="/dog-friendly" className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[18px] text-[10px] font-medium text-neutral-600 active:bg-neutral-100"><span className="text-lg leading-none">🐾</span><span>С собакой</span></Link>
          <Link href="/favorites" className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[18px] text-[10px] font-medium text-neutral-600 active:bg-neutral-100"><span className="text-lg leading-none">♡</span><span>Избранное</span></Link>
          <Link href={user ? "/profile" : "/login"} className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[18px] text-[10px] font-medium text-neutral-600 active:bg-neutral-100"><span className="text-lg leading-none">◎</span><span>{user ? "Профиль" : "Войти"}</span></Link>
        </div>
      </nav>
    </>
  );
}
