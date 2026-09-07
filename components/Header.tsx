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

  const accountControl = authLoaded && user ? (
    <Link href="/profile" className="rounded-full bg-black text-white px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base hover:opacity-80 transition max-w-[150px] truncate" title={user.name}>
      {user.name}
    </Link>
  ) : (
    <Link href="/login" className="rounded-full bg-black text-white px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base hover:opacity-80 transition">
      Войти
    </Link>
  );

  const mobileVisibleItems = mobileNavItems.filter((item) => !isCurrentRoute(pathname, item.href));

  return (
    <header className="fixed top-0 left-0 w-full z-[9999]">
      <div className="max-w-7xl mx-auto mt-3 sm:mt-4 px-3 sm:px-6">
        <div className="rounded-[22px] sm:rounded-full bg-white/92 backdrop-blur-xl border border-black/5 shadow-lg px-4 sm:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
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

          <nav className="md:hidden mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {mobileVisibleItems.map((item) => {
              const iconOnly = item.href === "/map" || item.href === "/favorites";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  title={item.label}
                  className={`flex shrink-0 items-center justify-center rounded-full bg-black/[.04] py-2 text-[12px] font-medium text-neutral-700 active:bg-black/[.08] ${iconOnly ? "h-9 w-10 px-0" : "gap-1.5 px-3"}`}
                >
                  {item.icon === "map" ? <MapIcon /> : <span className={`${item.href === "/favorites" ? "text-[18px]" : "text-sm"} leading-none`}>{item.icon}</span>}
                  {!iconOnly && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
