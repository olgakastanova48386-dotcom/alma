"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type User = { id: string; name: string; phone: string };

const mobileNavItems = [
  { href: "/", label: "Главная", icon: "⌂" },
  { href: "/map", label: "Карта", icon: "map" },
  { href: "/dog-friendly", label: "С собакой", icon: "🐾" },
  { href: "/favorites", label: "Избранное", icon: "♡" },
];

function isCurrentRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 5.5 8.5 3l7 2.5 5-2v15l-5 2-7-2.5-5 2.5z" />
      <path d="M8.5 3v15M15.5 5.5v15" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
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

  const mobileVisibleItems = mobileNavItems.filter((item) => !isCurrentRoute(pathname, item.href));

  return (
    <header className="fixed top-0 left-0 w-full z-[9999]">
      <div className="max-w-7xl mx-auto mt-3 sm:mt-4 px-3 sm:px-6">
        <div className="rounded-[22px] sm:rounded-full bg-white/92 backdrop-blur-xl border border-black/5 shadow-lg px-3 sm:px-8 py-2.5 sm:py-3">
          <div className="md:hidden flex h-11 items-center gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className="shrink-0 pl-1 pr-1 text-[17px] font-bold tracking-[0.22em]">alma</Link>
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              {mobileVisibleItems.map((item) => {
                const iconOnly = item.href === "/map" || item.href === "/favorites";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.label}
                    title={item.label}
                    className={`flex h-9 shrink-0 items-center justify-center rounded-full bg-black/[.04] text-[11px] font-medium text-neutral-700 active:bg-black/[.08] ${iconOnly ? "w-9 px-0" : "gap-1 px-2.5"}`}
                  >
                    {item.icon === "map" ? <MapIcon /> : <span className={`${item.href === "/favorites" ? "text-[18px]" : "text-[13px]"} leading-none`}>{item.icon}</span>}
                    {!iconOnly && <span>{item.label}</span>}
                  </Link>
                );
              })}
              {authLoaded && user ? (
                <Link href="/profile" className="max-w-[82px] truncate rounded-full bg-black px-3 py-2.5 text-[11px] font-medium text-white" title={user.name}>{user.name}</Link>
              ) : (
                <Link href="/login" className="rounded-full bg-black px-3 py-2.5 text-[11px] font-medium text-white">Войти</Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center justify-between">
            <Link href="/" className="text-lg sm:text-2xl font-bold tracking-[0.28em]">alma</Link>
            <nav className="flex items-center gap-5 lg:gap-7 text-sm md:text-base text-gray-600">
              <Link href="/" className="hover:text-black transition">Главная</Link>
              <Link href="/map" className="hover:text-black transition">Карта</Link>
              <Link href="/dog-friendly" className="hover:text-black transition">🐾 С собакой</Link>
              <Link href="/favorites" className="hover:text-black transition">♡ Избранное</Link>
              <Link href="/about" className="hover:text-black transition">О проекте</Link>
            </nav>
            {authLoaded && user ? (
              <Link href="/profile" className="rounded-full bg-black text-white px-5 py-2.5 text-base hover:opacity-80 transition max-w-[150px] truncate" title={user.name}>{user.name}</Link>
            ) : (
              <Link href="/login" className="rounded-full bg-black text-white px-5 py-2.5 text-base hover:opacity-80 transition">Войти</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
