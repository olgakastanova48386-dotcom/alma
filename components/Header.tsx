"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  phone: string;
};

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[20px] w-[20px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[20px] w-[20px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[21px] w-[21px]" fill="currentColor">
      <ellipse cx="8" cy="7.2" rx="2" ry="2.7" transform="rotate(-18 8 7.2)" />
      <ellipse cx="16" cy="7.2" rx="2" ry="2.7" transform="rotate(18 16 7.2)" />
      <ellipse cx="5.2" cy="11.7" rx="1.8" ry="2.4" transform="rotate(-30 5.2 11.7)" />
      <ellipse cx="18.8" cy="11.7" rx="1.8" ry="2.4" transform="rotate(30 18.8 11.7)" />
      <path d="M12 10.8c-3 0-5.7 2.7-5.7 5.5 0 1.9 1.4 3.2 3.1 3.2 1 0 1.7-.55 2.6-.55s1.6.55 2.6.55c1.7 0 3.1-1.3 3.1-3.2 0-2.8-2.7-5.5-5.7-5.5Z" />
    </svg>
  );
}

function EventsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[20px] w-[20px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
      <path d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17" />
      <path d="m12 13 .7 1.45 1.6.23-1.15 1.12.27 1.58L12 16.63l-1.42.75.27-1.58-1.15-1.12 1.6-.23L12 13Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[21px] w-[21px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.8l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.4 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6" />
    </svg>
  );
}

function isCurrentRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const authScreen =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/verify-phone");

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(async (res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (active) {
          setUser(data.user || null);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setAuthLoaded(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-[9999]">
      <div className="max-w-7xl mx-auto mt-[calc(env(safe-area-inset-top)+10px)] sm:mt-4 px-2.5 sm:px-6">
        <div className={`rounded-[22px] sm:rounded-full px-3 sm:px-8 py-1.5 sm:py-3 bg-white/92 border border-black/5 shadow-lg backdrop-blur-xl`}>

          {/* MOBILE: a clear header and an app-style bottom navigation. */}
          <div className="flex h-11 items-center justify-between md:hidden">
            <Link href="/" aria-label="ALMA — главная" className="pl-1 text-[18px] font-bold tracking-[0.2em] text-black">alma</Link>
            {!authScreen && <Link href={user ? "/profile" : "/login"} aria-label={user ? "Профиль" : "Войти"} className="flex min-h-11 items-center gap-1.5 rounded-full bg-black px-3 text-xs font-semibold text-white">
              <ProfileIcon /><span className="max-w-[90px] truncate">{user ? user.name : "Войти"}</span>
            </Link>}
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center justify-between">

            <Link
              href="/"
              className="text-lg sm:text-2xl font-bold tracking-[0.28em]"
            >
              alma
            </Link>

            <nav className="flex items-center gap-5 lg:gap-7 text-sm md:text-base text-gray-600">

              <Link href="/" className="hover:text-black">
                Главная
              </Link>

              <Link href="/map" className="hover:text-black">
                События
              </Link>

              <Link href="/dog-friendly" className="hover:text-black">
                🐾 С собакой
              </Link>

              <Link href="/favorites" className="hover:text-black">
                ♡ Избранное
              </Link>

              <Link href="/about" className="hover:text-black">
                О проекте
              </Link>

            </nav>


            {authLoaded && user ? (
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-2.5"
              >
                <ProfileIcon />
                <span>{user.name}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-black text-white px-5 py-2.5"
              >
                Войти
              </Link>
            )}

          </div>

        </div>
      </div>
          {!authScreen && <nav aria-label="Основная навигация" className="fixed inset-x-3 bottom-[calc(10px+env(safe-area-inset-bottom))] z-[10000] mx-auto grid max-w-[480px] grid-cols-5 rounded-[24px] border border-black/10 bg-white/95 px-1.5 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,.16)] backdrop-blur-xl md:hidden">
            {[
              { href: "/", label: "Главная", icon: <HomeIcon /> },
              { href: "/map", label: "События", icon: <EventsIcon /> },
              { href: "/dog-friendly", label: "С собакой", icon: <PawIcon /> },
              { href: "/favorites", label: "Избранное", icon: <HeartIcon /> },
              { href: user ? "/profile" : "/login", label: "Профиль", icon: <ProfileIcon /> },
            ].map(({ href, label, icon }) => {
              const active = isCurrentRoute(pathname, href);
              return <Link key={label} href={href} aria-label={label} aria-current={active ? "page" : undefined} className={`flex min-h-[56px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-[18px] text-[10px] font-medium leading-none ${active ? "bg-[#f3e9e6] text-black" : "text-neutral-600"}`}>
                {icon}<span className="truncate">{label}</span>
              </Link>;
            })}
          </nav>}

    </header>
  );
}